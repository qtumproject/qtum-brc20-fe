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
    ICaclTotalFeesParams,
    TOrderList,
    IOrderStatus,
    TOperationType,
    IMintJson,
    IDeployJson,
    IValidDeployParams,
    IValidMintParams,
    IValidResult,
    ISendParams,
} from "@/types";
import { axiosInstance } from '@/utils';
import store from 'store2';
import dayjs from 'dayjs';

let controller: AbortController | null = null;
const orderListKey = 'orderList';
const encodedAddressPrefix = 'tq'; // qc for qtum | tq for qtum_testnet
const debug = require('debug')('[inscribe]');

export function abortRequest() {
    controller?.abort();
}

export function setLocalOrderList(orderList: TOrderList) {
    try {
        store.set(orderListKey, orderList);
    } catch (e) {
        console.error(e);
    }
}

export async function getLocalOrderList() {
    return await store.get(orderListKey) || [];
}

const getNowTime = () => {
    return dayjs().format('YYYY/MM/DD HH:mm:ss');
}

const sendByWallet = ({ address, amount }: ISendParams) => {
    if ((window as any)?.qtum) {
        return (window as any).qtum.btc.sendBitcoin(address, amount);
    } else {
        alert('wallet not found, please install foxwallet');
    }
}

export async function mintOrDeploy({
    scriptObj,
    inscriptionFees,
    totalFees,
    rAddress,
    setModalInfo,
    setProgress,
    updateOrder,
    mode,
}: IMintOrDeployParams) {
    debug('inscribe begin')
    controller = new AbortController();
    let inscriptions = [];

    let privkey = bytesToHex(Noble.utils.randomPrivateKey());
    debug('privkey %o', privkey);

    const currentOrder = {
        orderId: privkey.slice(0, 30) as string,
        type: scriptObj.op as TOperationType,
        quantity: scriptObj.op === 'mint' ? (scriptObj as IMintJson).amt : (scriptObj as IDeployJson).max,
        tick: scriptObj.tick,
        status: IOrderStatus.PENDING as string,
        createTime: getNowTime(),
        updateTime: getNowTime(),
    };
    updateOrder(currentOrder, 'add');

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

    debug('Inscription address: %o', inscriptionAddress);
    debug('Inscription Tapkey: %o', tapkey);
    let prefix = 160;
    let txsize = prefix + Math.floor(data.length / 4);
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
    debug('Address that will receive the inscription: %o', rAddress);
    debug('Total transfer amount: %o', satsToQtum(totalFees), 'QTUM');

    let fundingAddress = p2trEncode(init_tapkey, encodedAddressPrefix);
    debug('Funding address: %o', fundingAddress);
    debug('Funding Tapkey: %o', init_tapkey);
    if (mode === 'qtum') {
        // web transaction
        let qr_value = "qtum:" + fundingAddress + "?amount=" + satsToQtum(totalFees);
        debug("Qrcode value is: %o", qr_value);
        const qrImg = createQR(qr_value);
        setModalInfo({
            fundingAddress,
            qrImg,
        })
    } else {
        try {
            // wallet transaction
            const res = await sendByWallet({ address: fundingAddress, amount: totalFees });
            console.log('wallet pay result', res);
        } catch (e) {
            console.error(e);
            return;
        }
    }

    try {
        await loopTilAddressReceivesMoney(fundingAddress, true);
    } catch (e) {
        debug(e);
        currentOrder.status = IOrderStatus.CLOSED;
        currentOrder.updateTime = getNowTime();
        updateOrder(currentOrder, 'update');
        return;
    }
    await waitSomeSeconds(2);
    let txinfo = await addressReceivedMoneyInThisTx(fundingAddress);
    let txid = txinfo[0];
    let vout = txinfo[1];
    let amt = txinfo[2];
    debug('Funding Address receive the money, the txid, vout, amount is: %o %o %o', txid, vout, amt);
    currentOrder.status = IOrderStatus.INSCRIBING;
    currentOrder.updateTime = getNowTime();
    updateOrder(currentOrder, 'update');
    setProgress({ step: 1, txid });

    // 1. to inscription address
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

    const init_sig = await Signer.taproot.sign(seckey.raw, init_redeemtx, 0, { extension: init_leaf });
    init_redeemtx.vin[0].witness = [init_sig.hex, init_script, init_cblock];

    console.dir(init_redeemtx, { depth: null });
    let rawtx = Tx.encode(init_redeemtx).hex;
    let _txid = await pushBTCpmt(rawtx);

    if (!_txid) {
        debug('[Error]: pushBTCpmt error')
        return;
    }
    debug('Inscription address receive the money, the txid is: %o', _txid);
    setProgress({ step: 2, txid: _txid });

    const inscribe = async (inscription: any, vout: any) => {
        try {
            await loopTilAddressReceivesMoney(inscription.inscriptionAddress, true);
        } catch (e) {
            debug(e);
            currentOrder.status = IOrderStatus.CLOSED;
            currentOrder.updateTime = getNowTime();
            updateOrder(currentOrder, 'update');
            return;
        }
        await waitSomeSeconds(2);
        let txinfo2 = await addressReceivedMoneyInThisTx(inscription.inscriptionAddress);
        let txid2 = txinfo2[0];
        let amt2 = txinfo2[2] || 0;
        const pubKey = addressToScriptPubKey(rAddress);
        // 2. to receive address
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
                scriptPubKey: pubKey,
            }],
        });

        const sig = await Signer.taproot.sign(seckey.raw, redeemtx, 0, { extension: inscription.leaf });
        redeemtx.vin[0].witness = [sig.hex, inscription.script_orig, inscription.cblock];
        let rawtx2 = Tx.encode(redeemtx).hex;
        let _txid2;
        _txid2 = await pushBTCpmt(rawtx2) || '';
        if (!_txid2) {
            inscribe(inscription, vout);
            return;
        }
        debug('Receive address receive the money, the txid is: %o', _txid2);
        setProgress({ step: 3, txid: _txid2 });
        currentOrder.status = IOrderStatus.SUCCESS;
        currentOrder.updateTime = getNowTime();
        updateOrder(currentOrder, 'update');
        debug('Success!')
    }

    for (let i = 0; i < inscriptions.length; i++) {
        inscribe(inscriptions[i], i);
    };
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

        let baseSize = 160;
        let padding = 546;
        let repeat = 1;
        totalFees += totalFee + ((69 + (repeat + 1) * 2) * 31 + 10) * Number(fee);
        totalFees += baseSize * repeat;
        totalFees += padding * repeat;
    }
    setTotalFees(totalFees);
}

/**
 * valid deploy ticker name
 * @param params 
 * @returns
 */
export async function validDeploy(params: IValidDeployParams) {
    try {
        let res: IValidResult = await axiosInstance.get('/api/v1/verify/deploy', { params, baseURL: '/' });
        return res;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}

/**
 * valid mint ticker name and amount
 * @param params 
 * @returns 
 */
export async function validMint(params: IValidMintParams) {
    try {
        let res: IValidResult = await axiosInstance.get('/api/v1/verify/mint', { params, baseURL: '/' });
        return res;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}



export async function getQtumFee() {
    try {
        let res: TQtumFeeRatesRes = await axiosInstance.get('/feerates');
        return res;
    } catch (e) {
        console.error(e);
        throw (e);
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

export const addressToScriptPubKey = (address: string): Array<string> => {
    try {
        // p2pkh
        const hex = Buff.b58chk(address).slice(1).hex;
        return ['OP_DUP', 'OP_HASH160', hex, 'OP_EQUALVERIFY', 'OP_CHECKSIG']
    } catch (error) {
        try {
            // p2tr
            const hex = Buff.bech32(address).hex;
            return ['OP_1', hex]
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
            debug('pushBTCpmt success, txid is %o', txid);
        } else {
            console.error(message)
            throw new Error(message)
        }
    } catch (e) {
        console.error(e);
        throw e;
    }

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
        debug('[Error] get tx info error');
        console.error(e);
        throw e;
    }
    // let nonjson;
    return [txid, vout, amt];
}

export async function addressOnceHadMoney(address: string, includeMempool: boolean) {
    try {
        const res: qtumAddressInfo = await axiosInstance.get(`/address/${address}`, { signal: controller?.signal });
        const { balance } = res || {};
        if (Number(balance) > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        debug('[Error] get address info error')
        throw e;
    }
}

export async function loopTilAddressReceivesMoney(address: string, includeMempool: boolean) {
    let itReceivedMoney = false;

    async function isDataSetYet(data_i_seek: boolean) {
        return new Promise(function (resolve, reject) {
            if (!data_i_seek) {
                setTimeout(async function () {
                    debug("waiting for address to receive money...");
                    try {
                        itReceivedMoney = await addressOnceHadMoney(address, includeMempool);
                    } catch (e) {
                        reject(e);
                        return;
                    }
                    if (itReceivedMoney) {
                        debug('receive money success!')
                    }
                    try {
                        let msg = await isDataSetYet(itReceivedMoney);
                        resolve(msg);
                    } catch (e) {
                        reject(e);
                    }


                }, 2000);
            } else {
                resolve(data_i_seek);
            }
        });
    }

    async function getTimeoutData() {
        try {
            let data_i_seek = await isDataSetYet(itReceivedMoney);
            return data_i_seek;
        } catch (e) {
            throw e;
        }

    }

    try {
        let returnable = await getTimeoutData();
        return returnable;
    } catch (e) {
        throw (e);
    }
}


