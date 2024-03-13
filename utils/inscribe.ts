import { Buff } from '@cmdcode/buff-utils';
import { Script, Signer, Tap, Tx } from '@cmdcode/tapscript';
import { Noble, KeyPair } from '@cmdcode/crypto-utils';
import QRCode from 'qrcode'
import {
    qtumAddressInfo,
    IPushBTCpmtRes,
    TUtxoRes,
    TQtumFeeRatesRes,
    IMintOrDeployParams,
    ICaclTotalFeesParams
} from "@/types";
import { axiosInstance } from '@/utils';

const qtumjs = require('@/lib/qtum');
const encodedAddressPrefix = 'tq'; // qc for qtum | tq for qtum_testnet

export async function mintOrDeploy({
    scriptObj,
    inscriptionFees,
    totalFees,
    rAddress,
    setFundingAddress,
    setQrImg
}: IMintOrDeployParams) {
    console.log('================mint or deploy begin=================');
    let inscriptions = [];

    let privkey = bytesToHex(Noble.utils.randomPrivateKey());
    console.log('privkey', privkey);

    let seckey = new KeyPair(privkey);
    let pubkey = seckey.pub.rawX;

    const ec = new TextEncoder();
    const init_script = [
        pubkey,
        'OP_CHECKSIG'
    ];
    let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, { target: init_leaf });

    const hex = textToHex(JSON.stringify(scriptObj));
    const data = hexToBytes(hex);
    const mimetype = ec.encode("text/plain;charset=utf-8");
    const script = [
        pubkey,
        'OP_CHECKSIG',
        'OP_0',
        'OP_IF',
        ec.encode('ord'),
        '01',
        mimetype,
        'OP_0',
        data,
        'OP_ENDIF'
    ];

    const script_backup = [
        '0x' + buf2hex(pubkey.buffer),
        'OP_CHECKSIG',
        'OP_0',
        'OP_IF',
        '0x' + buf2hex(ec.encode('ord')),
        '01',
        '0x' + buf2hex(mimetype),
        'OP_0',
        '0x' + buf2hex(data),
        'OP_ENDIF'
    ];

    const leaf = await Tap.tree.getLeaf(Script.encode(script));
    const [tapkey, cblock] = await Tap.getPubKey(pubkey, { target: leaf });

    let inscriptionAddress = p2trEncode(tapkey, encodedAddressPrefix);

    console.log('Inscription address: ', inscriptionAddress);
    console.log('Tapkey:', tapkey);
    let prefix = 160;
    let txsize = prefix + Math.floor(data.length / 4);
    console.log("TXSIZE", txsize);
    inscriptions.push(
        {
            leaf: leaf,
            tapkey: tapkey,
            cblock: cblock,
            inscriptionAddress: inscriptionAddress,
            txsize: txsize,
            fee: Number(inscriptionFees),
            script: script_backup,
            script_orig: script
        }
    );
    console.log('inscriptions', inscriptions)

    let fundingAddress = p2trEncode(init_tapkey, encodedAddressPrefix);
    console.log('Funding address: ', fundingAddress, 'based on', init_tapkey);
    setFundingAddress(fundingAddress)

    console.log('Address that will receive the inscription:', rAddress);

    let qr_value = "qtum:" + fundingAddress + "?amount=" + satsToQtum(totalFees);
    console.log("qr:", qr_value);

    const qrimg = createQR(qr_value);
    setQrImg(qrimg as any);

    // 检查转账是否完成
    await loopTilAddressReceivesMoney(fundingAddress, true);
    await waitSomeSeconds(2);
    let txinfo = await addressReceivedMoneyInThisTx(fundingAddress);

    let txid = txinfo[0];
    let vout = txinfo[1];
    let amt = txinfo[2];

    console.log("yay! txid:", txid, "vout:", vout, "amount:", amt);

    // 转账到inscription address
    let outputs = [];
    for (let i = 0; i < inscriptions.length; i++) {
        outputs.push(
            {
                value: Math.floor(546 + inscriptions[i].fee),
                scriptPubKey: ['OP_1', inscriptions[i].tapkey]
            }
        );

    }

    const init_redeemtx = Tx.create({
        vin: [{
            txid: txid,
            vout: vout,
            prevout: {
                value: Number(amt),
                scriptPubKey: ['OP_1', init_tapkey]
            },
        }],
        vout: outputs
    })

    console.log('outputs', outputs)

    const init_sig = await Signer.taproot.sign(seckey.raw, init_redeemtx, 0, { extension: init_leaf });
    init_redeemtx.vin[0].witness = [init_sig.hex, init_script, init_cblock];

    console.dir(init_redeemtx, { depth: null });
    console.log('YOUR SECKEY', seckey);
    // "non-mandatory-script-verify-flag (Invalid Schnorr signature)"
    let rawtx = Tx.encode(init_redeemtx).hex;
    let _txid = await pushBTCpmt(rawtx);

    console.log('Init TX', _txid);

    if (!_txid) {
        alert('广播交易失败')
        return;
    }

    const inscribe = async (inscription: any, vout: any) => {
        // we are running into an issue with 25 child transactions for unconfirmed parents.
        // so once the limit is reached, we wait for the parent tx to confirm.

        await loopTilAddressReceivesMoney(inscription.inscriptionAddress, true);
        await waitSomeSeconds(2);
        let txinfo2 = await addressReceivedMoneyInThisTx(inscription.inscriptionAddress);

        let txid2 = txinfo2[0];
        let amt2 = txinfo2[2] || 0;

        const data = addressToScript(rAddress, qtumjs.networks.qtum_testnet);
        const rAddressScriptPubKey = buf2hex(data);
        console.log('receive address scriptpubkey is: ', rAddressScriptPubKey);

        // 转账到receive address
        const redeemtx = Tx.create({
            vin: [{
                txid: txid2,
                vout: vout,
                prevout: {
                    value: Number(amt2),
                    scriptPubKey: ['OP_1', inscription.tapkey]
                },
            }],
            vout: [{
                value: Math.floor(Number(amt2) - Number(inscription.fee)),
                scriptPubKey: ['OP_1', rAddressScriptPubKey]
            }],
        });

        const sig = await Signer.taproot.sign(seckey.raw, redeemtx, 0, { extension: inscription.leaf });
        redeemtx.vin[0].witness = [sig.hex, inscription.script_orig, inscription.cblock];

        console.dir(redeemtx, { depth: null });

        let rawtx2 = Tx.encode(redeemtx).hex;
        let _txid2;

        _txid2 = await pushBTCpmt(rawtx2) || '';

        if (_txid2.includes('descendant')) {
            inscribe(inscription, vout);
            return;
        }
    }

    for (let i = 0; i < inscriptions.length; i++) {
        inscribe(inscriptions[i], i);
    }
}


export async function calcTotalFees({
    scriptObj,
    fee,
    customFee,
    feeType,
    setInscriptionFees,
    setTotalFees,
}: ICaclTotalFeesParams) {
    let totalFee = 0;
    let totalFees = 0;
    if (scriptObj && fee) {
        const hex = textToHex(JSON.stringify(scriptObj));
        const data = hexToBytes(hex);
        let prefix = 160;
        let txsize = prefix + Math.floor(data.length / 4);
        if (feeType === 'custom') {
            fee = customFee;
        }
        let feeTemp = Number(fee) * txsize;
        totalFee += feeTemp;
        setInscriptionFees(totalFee);
        console.log('转账给B的金额为', totalFee)

        let baseSize = 160;
        let padding = 546;
        let repeat = 1;
        totalFees += totalFee + ((69 + (repeat + 1) * 2) * 31 + 10) * Number(fee);
        totalFees += baseSize * repeat;
        totalFees += padding * repeat;
    }
    console.log('一共收费', totalFees)
    setTotalFees(totalFees);
}


export async function getQtumFee() {
    try {
        let res: TQtumFeeRatesRes = await axiosInstance.get('https://qtum.info/api/feerates');
        return res;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export function p2trEncode(input: string, prefix = 'qc') {
    const bytes = Buff.bytes(input)
    if (bytes.length !== 32) {
        throw new Error(`Invalid input size: ${bytes.hex} !== ${32}`)
    }
    return bytes.toBech32(prefix, 1)
}

export function p2trDecode(address: string) {
    return Buff.bech32(address);
}

export const addressToScript = (address: string, network: any): Buffer => {
    try {
        return qtumjs.address.toOutputScript(address, network);
    } catch (error) {
        try {
            const decoded = qtumjs.address.fromBech32(address);
            return decoded.data;
        } catch (error2) {
            throw new Error("cannot decode address");
        }
    }
};

export function textToHex(text: string) {
    var encoder = new TextEncoder().encode(text);
    return [...new Uint8Array(encoder)]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
}

export function buf2hex(buffer: any) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

export function bytesToHex(bytes: any) {
    return bytes.reduce((str: any, byte: any) => str + byte.toString(16).padStart(2, "0"), "");
}


export function hexToBytes(hex: any) {
    return Uint8Array.from(hex.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
}

export function satsToQtum(sats: number) {
    return (sats / Math.pow(10, 8)).toFixed(8);
}

export function createQR(content: any) {
    let dataUriPngImage = document.createElement("img");
    QRCode.toDataURL(content, {
        ecclevel: "M",
        format: "html",
        fillcolor: "#FFFFFF",
        textcolor: "#000000",
        margin: 4,
        modulesize: 8,
    }, function (err: Error, url: string) {
        if (err) throw err
        dataUriPngImage.src = url;
        dataUriPngImage.id = "qr_code";
    });

    return dataUriPngImage;
}

export async function pushBTCpmt(rawtx: string) {
    let txid;
    try {
        let res: IPushBTCpmtRes = await axiosInstance.post('/tx/send', {
            rawtx,
        });
        const { status, id, message } = res || {}
        if (status === 0) {
            txid = id;
        } else {
            console.error(message)
            return ''
        }
    } catch (e) {
        console.error(e)
    }
    console.log('rawtx', rawtx);
    console.log('txid', txid);
    return txid;
}

export function waitSomeSeconds(number: number) {
    let num = number.toString() + "000";
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("");
        }, Number(num));
    });
}

// 拿收到转账的信息
export async function addressReceivedMoneyInThisTx(address: string) {
    let txid;
    let vout;
    let amt;
    try {
        const res: TUtxoRes = await axiosInstance.get(`/address/${address}/utxo`);
        if (res && res.length && res[res.length - 1]) {
            txid = res[res.length - 1].transactionId;
            vout = res[res.length - 1].outputIndex;
            amt = res[res.length - 1].value;
        }
    } catch (e) {
        console.error('查询转账信息出现了错误');
        console.error(e);
    }
    // let nonjson;
    return [txid, vout, amt];
}

// 检查有没有收到转账
export async function addressOnceHadMoney(address: string, includeMempool: boolean) {
    console.log('检查转账的地址为：', address);
    // tq1jjuwhr4esatparyrgfj7qf5m8jyv6ytwnvrh2zj8tjq3m7atqedshh6wcd
    // tq1pnujql5krthgwzq5e30fygfh44p2q47fnjc586acyd5mc8hg56qjqv9fmhn
    // const td = 'tq1pnujql5krthgwzq5e30fygfh44p2q47fnjc586acyd5mc8hg56qjqv9fmhn';
    try {
        const res: qtumAddressInfo = await axiosInstance.get(`/address/${address}`);
        const { balance } = res || {};
        if (Number(balance) > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error('请求发生了错误')
        console.error(e);
        return false;
    }
}

// 轮询是否有收到转账
export async function loopTilAddressReceivesMoney(address: string, includeMempool: boolean) {
    let itReceivedMoney = false;

    async function isDataSetYet(data_i_seek: boolean) {
        return new Promise(function (resolve) {
            if (!data_i_seek) {
                setTimeout(async function () {
                    console.log("waiting for address to receive money...");
                    try {
                        itReceivedMoney = await addressOnceHadMoney(address, includeMempool);
                        if (itReceivedMoney) {
                            console.log('收到了转账！！！！！')
                        }
                    } catch (e) { }
                    let msg = await isDataSetYet(itReceivedMoney);
                    resolve(msg);
                }, 2000);
            } else {
                resolve(data_i_seek);
            }
        });
    }

    async function getTimeoutData() {
        let data_i_seek = await isDataSetYet(itReceivedMoney);
        return data_i_seek;
    }

    let returnable = await getTimeoutData();
    return returnable;
}


