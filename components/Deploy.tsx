import { useState } from "react"
import {
    Divider,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Button,
} from '@chakra-ui/react'
import FeeType from "./FeeType";
import PayModal from "./PayModal";

export default function Deploy() {
    const [step, setStep] = useState(1);

    const [tick, setTick] = useState('')
    const [amount, setAmount] = useState(21000000);
    const [limit, setLimit] = useState(1);
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState('normal');
    const [isModalShow, setIsModalShow] = useState(false);

    const [isTickError, setIsTickError] = useState(false);
    const [isAmountError, setIsAmountError] = useState(false);
    const [isLimitError, setIsLimitError] = useState(false);
    const [isRAddressError, setisRAddressError] = useState(false);

    const validForm = () => {
        let valid = true;
        if (!tick) {
            setIsTickError(true);
            valid = false;
        } else {
            setIsTickError(false);
        }
        if (!amount) {
            setIsAmountError(true);
            valid = false;
        } else {
            setIsAmountError(false);
        }
        return valid;
    }

    const handleGoNext = () => {
        const res = validForm();
        if (res) {
            setStep(2);
        }
    }

    const validSecondForm = () => {
        let valid = true;
        if (!rAddress) {
            setisRAddressError(true);
            valid = false;
        }
        return valid;
    }

    const handleSubmit = () => {
        const valid = validSecondForm();
        if (valid) {
            setIsModalShow(true);
        }
    }

    return (
        <>
            {
                step === 1 && <div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isTickError}>
                            <FormLabel htmlFor='tick'>Tick</FormLabel>
                            <Input
                                id='tick'
                                placeholder='4 characters like &quot;abcd&quot;...'
                                value={tick}
                                onChange={(e) => setTick(e.target.value)} />
                            {isTickError && <FormErrorMessage>
                                invalid input tick name
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isAmountError}>
                            <FormLabel htmlFor='amount'>Total Supply</FormLabel>
                            <NumberInput id='amount' defaultValue={1} min={1} value={amount} onChange={(value) => setAmount(value)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {isAmountError && <FormErrorMessage>
                                invalid input amount
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isLimitError}>
                            <FormLabel htmlFor='limit'>Limit Per Mint</FormLabel>
                            <NumberInput id='limit' defaultValue={1} min={1} value={limit} onChange={(value) => setLimit(value)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {isLimitError && <FormErrorMessage>
                                invalid input limit
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='200px'
                            colorScheme='yellow'
                            type='submit'
                            onClick={() => { handleGoNext() }}
                        >
                            Next
                        </Button>
                    </div>

                </div>
            }
            {
                step === 2 && <div>
                    <div className='mb-4'>
                        <FormControl>
                            <FormLabel htmlFor='raddress'>You are about to inscribe {amount} brc-20. </FormLabel>
                            <pre className="px-2 py-2 bg-gray-500 rounded ">{JSON.stringify({
                                p: 'brc-20',
                                op: 'deploy',
                                tick: tick,
                                max: amount,
                                limit: limit,
                            })} </pre>
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isRAddressError}>
                            <FormLabel htmlFor='raddress'>Receiving Address</FormLabel>
                            <Input
                                id='raddress'
                                placeholder='input your receiving address'
                                value={rAddress}
                                onChange={(e) => setRAddress(e.target.value)} />
                            {isRAddressError && <FormErrorMessage>invalid receive address</FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl>
                            <FormLabel htmlFor='amount'>Network Fee</FormLabel>
                            <div className="flex justify-between">
                                <div><FeeType type="Economy" amount={29} focus={feeType === 'economy'} onClick={() => setFeeType('economy')} /></div>
                                <div><FeeType type="Normal" amount={29} focus={feeType === 'normal'} onClick={() => setFeeType('normal')} /></div>
                                <div><FeeType type="Custom" amount={29} focus={feeType === 'custom'} onClick={() => setFeeType('custom')} /></div>
                            </div>
                        </FormControl>
                    </div>

                    <div className="mb-4">
                        <div className="mb-4 flex justify-between">
                            <div className="">Network Fee</div>
                            <div>123 sats = $0.99</div>
                        </div>
                        <div className="mb-4 flex justify-between">
                            <div className="">Service Fee</div>
                            <div>123 sats = $0.99</div>
                        </div>
                        <Divider className="mb-4" />
                        <div className="mb-4 flex justify-between">
                            <div className="">Total Fee</div>
                            <div>123 sats = $0.99</div>
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
                            onClick={() => handleSubmit()}
                        >
                            Submit&Pay
                        </Button>
                    </div>
                </div>
            }

            <PayModal isShow={isModalShow} />

        </>
    )
}