import { useState } from "react"
import {
    Radio, RadioGroup, Stack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
} from '@chakra-ui/react'
import FeeType from "./FeeType";

export default function Mint() {
    const [step, setStep] = useState(1);

    const [tick, setTick] = useState('')
    const [amount, setAmount] = useState(1);
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState('normal');

    return (
        <>
            {
                step === 1 && <FormControl>
                    <div className='mb-4'>
                        <FormLabel htmlFor='tick'>Tick</FormLabel>
                        <Input
                            id='tick'
                            placeholder='4 characters like &quot;abcd&quot;...'
                            value={tick}
                            onChange={(e) => setTick(e.target.value)} />
                    </div>
                    <div className='mb-4'>
                        <FormLabel htmlFor='amount'>Amount</FormLabel>
                        <NumberInput id='amount' defaultValue={1} min={1} value={amount} onChange={(value) => setAmount(value)}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </div>
                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='200px'
                            colorScheme='yellow'
                            type='submit'
                            onClick={() => { setStep(2) }}
                        >
                            Next
                        </Button>
                    </div>

                </FormControl>
            }
            {
                step === 2 && <FormControl>
                    <div className='mb-4'>
                        <FormLabel htmlFor='raddress'>You are about to inscribe {amount} brc-20. </FormLabel>
                        <pre className="px-2 py-2 bg-gray-500 rounded ">{JSON.stringify({
                            p: 'brc-20',
                            op: 'mint',
                            tick: tick,
                            amt: amount,
                        })} </pre>
                    </div>
                    <div className='mb-4'>
                        <FormLabel htmlFor='raddress'>Receiving Address</FormLabel>
                        <Input
                            id='raddress'
                            placeholder='input your receiving address'
                            value={rAddress}
                            onChange={(e) => setRAddress(e.target.value)} />
                    </div>
                    <div className='mb-4'>
                        <FormLabel htmlFor='amount'>Network Fee</FormLabel>
                        <div className="flex justify-between">
                            <div><FeeType type="Economy" amount={29} focus={feeType === 'economy'} onClick={() => setFeeType('economy')} /></div>
                            <div><FeeType type="Normal" amount={29} focus={feeType === 'normal'} onClick={() => setFeeType('normal')} /></div>
                            <div><FeeType type="Custom" amount={29} focus={feeType === 'custom'} onClick={() => setFeeType('custom')} /></div>
                        </div>
                    </div>
                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='200px'
                            colorScheme='yellow'
                            variant='outline'
                            className='mr-10'
                            onClick={() => setStep(1)}
                        >
                            Back
                        </Button>
                        <Button
                            mt={4}
                            width='200px'
                            colorScheme='yellow'
                            type='submit'
                        >
                            Submit&Pay
                        </Button>
                    </div>

                </FormControl>
            }

        </>
    )
}