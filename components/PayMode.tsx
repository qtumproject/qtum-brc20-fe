import { Divider, Radio, RadioGroup, Stack, } from '@chakra-ui/react'
import { useState } from 'react';

interface IProps {
    initialMode: string,
    onChange: (mode: string) => void,
}

export default function PayMode({ onChange, initialMode }: IProps) {
    const [mode, setMode] = useState(initialMode);

    const handleChange = (mode: string) => {
        setMode(mode);
        onChange(mode);
    }

    return (
        <>
            <RadioGroup onChange={handleChange} value={mode}>
                <Stack direction='column'>
                    <div className="mb-4 hidden lg:flex flex-col bg-[#F3F3F0] dark:bg-[#282A33] rounded-[12px]">
                        <div className='p-4'><Radio colorScheme='brand' value='qtum'><span className='font-semibold text-sm'>Pay with QTUM</span></Radio></div>
                        <Divider />
                        <div className='p-4'><Radio colorScheme='brand' value='wallet'><span className='font-semibold text-sm'>Pay with wallet</span></Radio></div>
                    </div>
                    <div className="mb-4 flex lg:hidden flex-col bg-[#F3F3F0] dark:bg-[#282A33] rounded-[12px]">
                        <div className='p-4'><Radio colorScheme='brand' value='qtum'><span className='font-semibold text-sm'>Pay with QTUM</span></Radio></div>
                        <Divider />
                        <div className='p-4'><Radio colorScheme='brand' value='wallet'><span className='font-semibold text-sm'>Pay with wallet</span></Radio></div>
                    </div>
                </Stack>
            </RadioGroup>

        </>
    )
}