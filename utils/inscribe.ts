import { Buff } from '@cmdcode/buff-utils';
import {
    qtumAddressInfo,
    IPushBTCpmtRes,
    TUtxoRes,
    TQtumFeeRatesRes
} from "@/types";
import { axiosInstance } from '@/utils';

const qtumjs = require('@/lib/qtum');


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
    let dataUriPngImage = document.createElement("img"),
        s = (window as any).QRCode.generatePNG(content, {
            ecclevel: "M",
            format: "html",
            fillcolor: "#FFFFFF",
            textcolor: "#000000",
            margin: 4,
            modulesize: 8,
        });
    dataUriPngImage.src = s;
    dataUriPngImage.id = "qr_code";
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


