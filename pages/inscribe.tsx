import {
    Radio, RadioGroup, Stack
} from '@chakra-ui/react'
import { useState, useEffect } from "react";
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';
import { axios } from '@/utils';

export default function Inscribe() {
    const [value, setValue] = useState('mint');
    
    useEffect(() => {
        const getFee = async () => {
            const res = await axios.get('https://mempool.space/api/v1/fees/recommended');
            console.log('res', res)
        }
        getFee();
    }, [])

    return (
        <div className={`flex min-h-screen flex-col items-center`}>
            <div className={`w-2/5 flex flex-col items-center rounded-md py-10 px-8`} style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <div className={`font-bold mb-4`}>Inscribe  QBRC20</div>
                <div className='w-full'>
                    <div className='mb-4 text-center'>
                        <RadioGroup onChange={setValue} value={value}>
                            <Stack direction='row'>
                                <Radio value='mint'>Mint</Radio>
                                <Radio value='deploy'>Deploy</Radio>
                            </Stack>
                        </RadioGroup>
                    </div>

                    {
                        value === "mint" && <Mint />
                    }

                    {
                        value === "deploy" && <Deploy />
                    }
                </div>
            </div>
        </div>
    )
}
