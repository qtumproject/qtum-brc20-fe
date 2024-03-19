import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import qs from 'qs';
import { useToast } from "@chakra-ui/react";
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';
import RadioGroup from "@/components/RadioGroup";
import {
    getQtumFee
} from '@/utils';
import { IQtumFeeRates } from '@/types'

export default function Inscribe() {
    const toast = useToast();
    const [value, setValue] = useState('Mint');
    const [defaultTick, setDefaultTick] = useState('');
    const [feeRates, setFeeRates] = useState<IQtumFeeRates>({
        custom: '400',
        economy: '400',
        normal: '400'
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
        try {
            const res = await getQtumFee();
            let feeRates = {
                custom: '',
                economy: '',
                normal: ''
            } as IQtumFeeRates;
            const qtum2satvb = (count: number) => String((count * Math.pow(10, 5)).toFixed(3));
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
        } catch (e: any) {
            toast({
                title: `[GetQtumFee] ${e.message}`,
                position: 'top',
                status: 'error',
                duration: 2000,
            })
        }

    }

    useEffect(() => {
        setRouterParams();
        setQtumFee();
    }, [])

    return (
        <>
            <div className={`flex-col items-center lg:flex hidden dark:text-white`}>
                <div className={`mb-[40px] text-[40px] mt-[-40px] font-[Outfit] font-medium`}>Inscribe  QBRC20</div>
                <div className={`flex flex-col items-center py-10 px-8 dark:bg-black bg-white w-[1024px] rounded-[12px] shadow-lg`}>
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
            <div className="lg:hidden flex flex-col items-center px-4 c">
                <div className={`mb-4 text-[30px] mt-[-20px] font-[Outfit] font-medium`}>Inscribe  QBRC20</div>
                <div className={`flex flex-col items-center py-[30px] px-2.5 bg-white dark:bg-black rounded-[12px] shadow-lg w-full`}>
                    <div className='w-full'>
                        <div className='mb-8 text-center'>
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
        </>

    )
}
