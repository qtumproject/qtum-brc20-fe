import {
    Radio, Stack
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from "react";
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';
import { axios } from '@/utils';
import RadioGroup from "../components/RadioGroup";


export default function Inscribe() {
    const [value, setValue] = useState('Mint');
    const [bitcoinPrice, setBitcoinPrice] = useState(0);

    function getData(url: string) {
        return new Promise(async function (resolve, reject) {
            function inner_get(url: string) {
                let xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, true);
                xhttp.send();
                return xhttp;
            }

            let data = inner_get(url);
            data.onerror = function (e) {
                resolve("error");
            }

            async function isResponseReady() {
                return new Promise(function (resolve2, reject) {
                    if (!data.responseText || data.readyState != 4) {
                        setTimeout(async function () {
                            let msg = await isResponseReady();
                            resolve2(msg);
                        }, 1);
                    } else {
                        resolve2(data.responseText);
                    }
                });
            }

            let returnable = await isResponseReady();
            resolve(returnable);
        });
    }

    async function getBitcoinPriceFromCoinbase() {
        let data = await getData("https://api.coinbase.com/v2/prices/BTC-USD/spot");
        try {
            let json = JSON.parse(data as any);
            let price = json["data"]["amount"];
            return price;
        } catch (e) {
            console.error(e);
        }

        return 0;
    }

    async function getBitcoinPriceFromKraken() {
        let data = await getData("https://api.kraken.com/0/public/Ticker?pair=XBTUSD");
        let json = JSON.parse(data as any);
        let price = json["result"]["XXBTZUSD"]["a"][0];
        return price;
    }

    async function getBitcoinPriceFromCoindesk() {
        let data = await getData("https://api.coindesk.com/v1/bpi/currentprice.json");
        let json = JSON.parse(data as any);
        let price = json["bpi"]["USD"]["rate_float"];
        return price;
    }

    async function getBitcoinPriceFromGemini() {
        let data = await getData("https://api.gemini.com/v2/ticker/BTCUSD");
        let json = JSON.parse(data as any);
        let price = json["bid"];
        return price;
    }

    async function getBitcoinPriceFromBybit() {
        let data = await getData("https://api-testnet.bybit.com/derivatives/v3/public/order-book/L2?category=linear&symbol=BTCUSDT");
        let json = JSON.parse(data as any);
        let price = json["result"]["b"][0][0];
        return price;
    }

    useEffect(() => {
        const getFee = async () => {
            const res = await axios.get('https://mempool.space/api/v1/fees/recommended');
            console.log('res', res)
        }
        const getBitcoinPrice = async () => {
            let prices = [];
            let cbprice = await getBitcoinPriceFromCoinbase();
            let kprice = await getBitcoinPriceFromKraken();
            let cdprice = await getBitcoinPriceFromCoindesk();
            let gprice = await getBitcoinPriceFromGemini();
            let bprice = await getBitcoinPriceFromBybit();
            prices.push(Number(cbprice), Number(kprice), Number(cdprice), Number(gprice), Number(bprice));
            prices.sort();
            setBitcoinPrice(prices[2]);
            console.log('current bitcoin price is: ', prices[2])
        }
        getFee();
        getBitcoinPrice();
    }, []);

    return (
        <div className={`flex flex-col items-center`}>
            <div className={`font-bold mb-[40px] text-[40px] mt-[-40px] font-[Outfit] font-medium`}>Inscribe  QBRC20</div>
            <div className={`flex flex-col items-center py-10 px-8 bg-white w-[1024px] rounded-[12px] shadow-lg`}>
                <div className='w-[680px]'>
                    <div className='mb-4 text-center'>
                        <RadioGroup options={['Mint', 'Deploy']} defaultValue='Mint' onChange={setValue} name='opType' />
                    </div>

                    {
                        value === "Mint" && <Mint bitcoinPrice={bitcoinPrice} />
                    }

                    {
                        value === "Deploy" && <Deploy />
                    }
                </div>
            </div>
        </div>
    )
}
