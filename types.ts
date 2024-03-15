// inscribe
// https://github.com/qtumproject/qtumjs-lib/blob/master/src/networks.js
export type Networks = 'qtum' | 'qtum_testnet';
export type NetworksPrefix = 'qc' | 'tq';
export interface qtumAddressInfo {
    balance: number
}
export interface IPushBTCpmtRes {
    status: number,
    id?: string,
    message?: string,

}

export interface IUtxoResItem {
    transactionId: string,
    outputIndex: number,
    value: string,
}

export type TUtxoRes = [IUtxoResItem] | [];
export interface IQtumFeeRatesItem {
    blocks: number,
    feeRate: number,
}
export type TQtumFeeRatesRes = [IQtumFeeRatesItem] | [];
export interface IQtumFeeRates {
    custom: string,
    economy: string,
    normal: string,
}
export type TFeeType = 'economy' | 'custom' | 'normal';
export interface IMintJson {
    p: string,
    op: string,
    tick: string,
    amt: string,
}
export interface IDeployJson {
    p: string,
    op: string,
    tick: string,
    max: string,
    lim: string,
}
export interface IMintOrDeployParams {
    scriptObj: IMintJson | IDeployJson,
    inscriptionFees: number,
    totalFees: number,
    rAddress: string,
    setFundingAddress: Function,
    setQrImg: Function,
    setProgress: Function,
}

export interface ICaclTotalFeesParams {
    scriptObj: IMintJson | IDeployJson,
    fee: string,
    customFee: string,
    feeType: string,
    setInscriptionFees: Function,
    setTotalFees: Function,
}

export interface IProgressInfo {
    step: number,
    txid: string,
}



// brc20
export type TBrc20Status = 'All' | 'Inprogress' | 'Completed';
export type TBrc20StatusParams = '' | 'in-progress' | 'completed';
export interface IBrc20ListItem {
    token_name: string,
    deploy_time: string,
    progress: string,
    holders?: number,
    mint_times?: number
}
export type TBrc20List = [IBrc20ListItem] | [];
export interface IBrc20ListParams {
    status?: TBrc20StatusParams,
    tick?: string,
    page?: number,
}