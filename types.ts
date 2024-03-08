// Networks 
// https://github.com/qtumproject/qtumjs-lib/blob/master/src/networks.js

export type Networks   = 'qtum' | 'qtum_testnet';

export type NetworksPrefix = 'qc' | 'tq';

export interface qtumAddressInfo {
    balance: number
}