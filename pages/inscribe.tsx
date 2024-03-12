import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';
import RadioGroup from "../components/RadioGroup";
import qs from 'qs';

export default function Inscribe() {
    const [value, setValue] = useState('Mint');
    const [defaultTick, setDefaultTick] = useState('');
    const router = useRouter();

    useEffect(() => {
        const { tick, type } = qs.parse(router.asPath.slice(10));
        if (tick && type) {
            if (['Mint', 'Deploy'].includes(type)) {
                setValue(type as string);
                setDefaultTick(tick as string);
            }
        }
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
                        value === "Mint" && <Mint defaultTick={defaultTick} />
                    }

                    {
                        value === "Deploy" && <Deploy />
                    }
                </div>
            </div>
        </div>
    )
}
