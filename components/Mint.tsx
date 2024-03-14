import { useState, useEffect, ChangeEvent } from "react"
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
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
import {
    satsToQtum,
    mintOrDeploy,
    calcTotalFees,
} from '@/utils';
import { IQtumFeeRates, TFeeType } from '@/types';
import FeeType from "./FeeType";
import PayModal from "./PayModal";

interface IProps {
    defaultTick: string,
    feeRates: IQtumFeeRates,
}

export default function Mint({ defaultTick, feeRates }: IProps) {
    const [step, setStep] = useState(1);

    const [tick, setTick] = useState(defaultTick)
    const [amount, setAmount] = useState("1");
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState<TFeeType>('normal');
    const [customFee, setCustomFee] = useState(feeRates['custom']);
    const [fee, setFee] = useState('400');

    const [inscriptionFees, setInscriptionFees] = useState(0);
    const [totalFees, setTotalFees] = useState(0);

    const [isModalShow, setIsModalShow] = useState(false);
    const [isTickError, setIsTickError] = useState(false);
    const [isAmountError, setIsAmountError] = useState(false);
    const [isRAddressError, setisRAddressError] = useState(false);

    const [qrImg, setQrImg] = useState('');
    const [fundingAddress, setFundingAddress] = useState('');

    const [mint, setMint] = useState({
        p: 'brc-20',
        op: 'mint',
        tick: '',
        amt: '0',
    })
    useEffect(() => { setCustomFee(feeRates.custom) }, [feeRates]);
    useEffect(() => { setTick(defaultTick) }, [defaultTick])
    useEffect(() => {
        setMint({
            p: 'brc-20',
            op: 'mint',
            tick,
            amt: amount,
        })
    }, [tick, amount])


    useEffect(() => {
        setFee(feeRates[feeType]);
    }, [feeType, feeRates])

    useEffect(() => {
        calcTotalFees({
            scriptObj: mint,
            fee,
            customFee,
            feeType,
            setInscriptionFees,
            setTotalFees,
        });
    }, [customFee, fee, mint])

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

    const onRAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRAddress(e.target.value);
        if (e.target.value) {
            setisRAddressError(false);
        }
    }

    const onTickChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.slice(0, 4);
        setTick(value);
    }

    const handleSubmit = () => {
        const valid = validSecondForm();
        if (valid) {
            resolveMint();
            setIsModalShow(true);
        }
    }

    const resolveMint = () => {
        mintOrDeploy({
            scriptObj: mint,
            inscriptionFees,
            totalFees,
            rAddress,
            setFundingAddress,
            setQrImg
        })
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
                                focusBorderColor="#2D73FF"
                                placeholder='4 characters like &quot;abcd&quot;...'
                                value={tick}
                                htmlSize={4}
                                onChange={onTickChange} />
                            {isTickError && <FormErrorMessage>
                                invalid input tick name
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isAmountError}>
                            <FormLabel htmlFor='amount'>Amount</FormLabel>
                            <NumberInput id='amount' focusBorderColor="#2D73FF" defaultValue={1} min={1} value={amount} onChange={(value) => setAmount(value)}>
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
                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='400px'
                            type="submit"
                            variant='brandPrimary'
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
                            <pre className="py-[16px] rounded-[12px] pl-[16px] bg-[#F3F3F0] break-all whitespace-break-spaces">{JSON.stringify(mint)} </pre>
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isRAddressError}>
                            <FormLabel htmlFor='raddress'>Receiving Address</FormLabel>
                            <Input
                                id='raddress'
                                placeholder='input your receiving address'
                                value={rAddress}
                                variant='outline'
                                focusBorderColor="#2D73FF"
                                onChange={onRAddressChange} />
                            {isRAddressError && <FormErrorMessage>invalid receive address</FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl>
                            <FormLabel htmlFor='amount'>Network Fee</FormLabel>
                            <div className="mb-4 flex justify-between">
                                <div><FeeType type="Economy" amount={Number(feeRates['economy'])} focus={feeType === 'economy'} onClick={() => setFeeType('economy')} /></div>
                                <div><FeeType type="Normal" amount={Number(feeRates['normal'])} focus={feeType === 'normal'} onClick={() => setFeeType('normal')} /></div>
                                <div><FeeType type="Custom" amount={Number(customFee)} focus={feeType === 'custom'} onClick={() => setFeeType('custom')} /></div>
                            </div>
                            {
                                feeType === 'custom' && <div className="mb-4 flex">
                                    <Slider className="flex-auto" aria-label='slider-ex-1' focusThumbOnChange={false} value={Number(customFee)} onChange={(val) => setCustomFee(val.toString())}>
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                    <div className="w-24 ml-4">
                                        <NumberInput focusBorderColor="#2D73FF" defaultValue={1} min={1} value={customFee} onChange={(value) => setCustomFee(value)}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </div>

                                </div>
                            }

                        </FormControl>
                    </div >
                    <Divider className="mb-4" />
                    <div className="mb-4">
                        <div className="mb-4 flex justify-between bg-[#F3F3F0] p-4 rounded-[12px]">
                            <div className="">Network Fee</div>
                            <div>{totalFees.toFixed(3)} sats = {satsToQtum(totalFees)} QTUM</div>
                        </div>
                    </div>

                    <div className='mb-4 text-center'>
                        <Button
                            mt={4}
                            width='236px'
                            variant='outline'
                            className='mr-8'
                            onClick={() => setStep(1)}
                        >
                            Back
                        </Button>
                        <Button
                            mt={4}
                            width='236px'
                            variant='brandPrimary'
                            onClick={() => handleSubmit()}
                        >
                            Submit & Pay
                        </Button>
                    </div>
                </div >
            }


            <PayModal
                isShow={isModalShow}
                fundingAddress={fundingAddress}
                totalPay={totalFees}
                close={() => setIsModalShow(false)}>
                {qrImg}
            </PayModal>

        </>
    )
}