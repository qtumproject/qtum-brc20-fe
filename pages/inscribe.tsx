import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import qs from 'qs';
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';
import RadioGroup from "@/components/RadioGroup";
import {
    getQtumFee
} from '@/utils';
import { IQtumFeeRates, TQtumFeeRatesRes } from '@/types'



export default function Inscribe() {
    const [value, setValue] = useState('Mint');
    const [defaultTick, setDefaultTick] = useState('');
    const [feeRates, setFeeRates] = useState<IQtumFeeRates>({
        custom: '',
        economy: '',
        normal: ''
    });
    const router = useRouter();

    const setRouterParams = () => {
        const { tick, type } = qs.parse(router.asPath.slice(10));
        if (tick && type) {
            if (['Mint', 'Deploy'].includes(type)) {
                setValue(type as string);
                setDefaultTick(tick as string);
            }
        }
    }

    const setQtumFee = async () => {
        const res = await getQtumFee();
        console.log('res', res)
        let feeRates = {
            custom: '',
            economy: '',
            normal: ''
        } as IQtumFeeRates;
        const qtum2satvb = (count: number) => String(count * Math.pow(10, 5));
        if (res && res.length) {
            res.forEach(item => {
                if (item.blocks === 2) {
                    feeRates.custom = qtum2satvb(item.feeRate);
                }
                if (item.blocks === 4) {
                    feeRates.normal = qtum2satvb(item.feeRate);
                }
                if (item.blocks === 6) {
                    feeRates.economy = qtum2satvb(item.feeRate);
                }
            })
        }
        setFeeRates(feeRates);
    }

    useEffect(() => {
        setRouterParams();
        setQtumFee();
    }, [])

    return (
        <div className={`flex flex-col items-center`}>
            <div className={`mb-[40px] text-[40px] mt-[-40px] font-[Outfit] font-medium`}>Inscribe  QBRC20</div>
            <div className={`flex flex-col items-center py-10 px-8 bg-white w-[1024px] rounded-[12px] shadow-lg`}>
                <div className='w-[680px]'>
                    <div className='mb-4 text-center'>
                        <RadioGroup options={['Mint', 'Deploy']} defaultValue='Mint' onChange={setValue} name='opType' />
                    </div>

                    {
                        value === "Mint" && <Mint defaultTick={defaultTick} feeRates={feeRates} />
                    }

                    {
                        value === "Deploy" && <Deploy feeRates={feeRates} />
                    }
                </div>
            </div>
        </div>
    )
}
