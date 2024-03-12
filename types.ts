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