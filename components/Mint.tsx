import { useEffect, ChangeEvent, cache } from 'react';
import useState from 'react-usestateref';
import {
    Divider,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    NumberInput,
    NumberInputField,
    useToast,
    Button,
} from '@chakra-ui/react';
import {
    satsToQtum,
    mintOrDeploy,
    calcTotalFees,
    abortRequest,
    validMint
} from '@/utils';
import { IQtumFeeRates, TFeeType, IProgressInfo, IOrderItem, IModalInfo } from '@/types';
import FeeType from "./FeeType";
import PayModal from "./PayModal";
import PayMode from './PayMode';

interface IProps {
    defaultTick: string,
    feeRates: IQtumFeeRates,
    updateOrder: (orderItem: IOrderItem, opType: 'add' | 'update') => void,
}

export default function Mint({ defaultTick, feeRates, updateOrder }: IProps) {
    const toast = useToast();
    const [mode, setMode] = useState('qtum');
    const [step, setStep] = useState(1);
    const [tick, setTick] = useState(defaultTick)
    const [amount, setAmount] = useState("1");
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState<TFeeType>('normal');
    const [customFee, setCustomFee] = useState(feeRates['custom']);
    const [fee, setFee] = useState('400');

    const [inscriptionFees, setInscriptionFees] = useState(0);
    const [totalFees, setTotalFees] = useState(0);

    const [isTickError, setIsTickError] = useState(false);
    const [tickErrorText, setTickErrorText] = useState('');
    const [isAmountError, setIsAmountError] = useState(false);
    const [amountErrorText, setAmountErrorText] = useState('');
    const [isRAddressError, setisRAddressError] = useState(false);

    const [isModalShow, setIsModalShow] = useState(false);
    const [isProgress, setIsProgress] = useState(false);
    const [txids, setTxIds, txidsRef] = useState<Array<string>>([]);
    const [activeStep, setActiveStep] = useState(1);
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

    const validTickAndAmount = async (tick: string, amount: string) => {
        if (!tick) {
            setTickErrorText('Tick is required.');
            setIsTickError(true);
            return false;
        }
        if (!amount) {
            setAmountErrorText('Amount is required.');
            setIsAmountError(true);
            return false;
        }
        const params = {
            protocol: 'brc-20',
            chain_id: 'qtum',
            ticker: tick,
            amount,
        }
        const { code, data, msg } = await validMint(params);
        if (code === -1) {
            setTickErrorText(msg);
            setIsTickError(true);
            return false;
        } else if (code === 0 && data.is_valid) {
            setIsTickError(false);
            setIsAmountError(false);
            return true;
        } else {
            setIsTickError(false);
            setAmountErrorText(data.reason);
            setIsAmountError(true);
            return false;
        }
    }

    const validForm = async () => {
        let valid = true;
        const isValidTickAndAmount = await validTickAndAmount(tick, amount);
        if (!isValidTickAndAmount) {
            valid = false;
        } else {
            setIsTickError(false);
            setIsAmountError(false);
        }
        return valid;
    }


    const handleGoNext = async () => {
        const res = await validForm();
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

    const onTickBlur = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        validTickAndAmount(value, amount);
    }

    const onAmountBlur = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        validTickAndAmount(tick, value);
    }

    const handleSubmit = async () => {
        const valid = validSecondForm();
        if (valid) {
            resolveMint(mode);
        }
    }

    const setProgress = (progressInfo: IProgressInfo) => {
        if (!isModalShow) {
            setIsModalShow(true);
        }
        const { step, txid } = progressInfo;
        setIsProgress(true);
        setActiveStep(step);
        const txidsTemp: Array<string> = txidsRef.current.slice();
        txidsTemp.push(txid);
        setTxIds(txidsTemp);
    }

    const handleModalClose = () => {
        setIsModalShow(false);
        abortRequest();
    }

    const setModalInfo = ({ fundingAddress, qrImg }: IModalInfo) => {
        setFundingAddress(fundingAddress);
        setQrImg(qrImg);
        setIsModalShow(true);
    }

    const resolveMint = (mode: string) => {
        try {
            mintOrDeploy({
                scriptObj: mint,
                inscriptionFees,
                totalFees,
                rAddress,
                setModalInfo,
                setProgress,
                updateOrder,
                mode,
            });
        } catch (e: any) {
            toast({
                title: `[Mint error] ${e.message}`,
                position: 'top',
                status: 'error',
                duration: 2000,
            })
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
                                focusBorderColor="#2D73FF"
                                placeholder='4 characters like &quot;abcd&quot;...'
                                value={tick}
                                htmlSize={4}
                                onChange={onTickChange}
                                onBlur={onTickBlur}
                            />
                            {isTickError && <FormErrorMessage>
                                {tickErrorText}
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isAmountError}>
                            <FormLabel htmlFor='amount'>Amount</FormLabel>
                            <NumberInput id='amount' focusBorderColor="#2D73FF" defaultValue={1} min={1} value={amount} onChange={(value) => setAmount(value)} onBlur={onAmountBlur}>
                                <NumberInputField />
                            </NumberInput>
                            {isAmountError && <FormErrorMessage>
                                {amountErrorText}
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4 text-center lg:block hidden'>
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

                    <div className='mb-4 text-center lg:hidden'>
                        <Button
                            mt={4}
                            width='full'
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
                            <pre className="font-medium	py-[16px] rounded-[12px] pl-[16px] dark:bg-[#282A33] bg-[#F3F3F0] break-all whitespace-break-spaces">{JSON.stringify(mint)} </pre>
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
                            <div className="mb-4 justify-between lg:flex hidden">
                                <div><FeeType title="Economy" type="solid" amount={Number(feeRates['economy'])} focus={feeType === 'economy'} onClick={() => setFeeType('economy')} /></div>
                                <div><FeeType title="Normal" type="solid" amount={Number(feeRates['normal'])} focus={feeType === 'normal'} onClick={() => setFeeType('normal')} /></div>
                                <div><FeeType title="Custom" type="input" setValue={setCustomFee} amount={Number(customFee)} focus={feeType === 'custom'} onClick={() => setFeeType('custom')} /></div>
                            </div>
                            <div className="mb-4 flex flex-col justify-between lg:hidden">
                                <div className='mb-4'><FeeType title="Economy" type="solid" amount={Number(feeRates['economy'])} focus={feeType === 'economy'} onClick={() => setFeeType('economy')} /></div>
                                <div className='mb-4'><FeeType title="Normal" type="solid" amount={Number(feeRates['normal'])} focus={feeType === 'normal'} onClick={() => setFeeType('normal')} /></div>
                                <div className='mb-4'><FeeType title="Custom" type="input" setValue={setCustomFee} amount={Number(customFee)} focus={feeType === 'custom'} onClick={() => setFeeType('custom')} /></div>
                            </div>
                        </FormControl>
                    </div >
                    <Divider className="mb-4" />
                    <div className="mb-4">
                        <div className="mb-4 hidden lg:flex justify-between bg-[#F3F3F0] dark:bg-[#282A33] p-4 rounded-[12px] text-sm">
                            <div className="font-semibold">Network Fee</div>
                            <div><span className="font-semibold">{totalFees.toFixed(3)} sats</span> <span className="text-[#7F8596]">{satsToQtum(totalFees)} QTUM</span> </div>
                        </div>
                        <div className="mb-4 lg:hidden flex flex-col justify-between bg-[#F3F3F0] dark:bg-[#282A33] p-4 rounded-[12px] text-sm">
                            <div className="font-semibold mb-2">Network Fee</div>
                            <div><span className="font-semibold">{totalFees.toFixed(3)} sats</span> <span className="text-[#7F8596]">{satsToQtum(totalFees)} QTUM</span> </div>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <PayMode initialMode={mode} onChange={(mode) => setMode(mode)} />
                    </div>

                    <div className='mb-4 text-center hidden lg:block'>
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
                    <div className='text-center lg:hidden flex'>
                        <Button
                            mt={4}
                            width='50%'
                            variant='outline'
                            className='mr-8'
                            onClick={() => setStep(1)}
                        >
                            Back
                        </Button>
                        <Button
                            mt={4}
                            width='50%'
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
                isProgress={isProgress}
                activeStep={activeStep}
                txids={txids}
                close={handleModalClose}>
                {qrImg}
            </PayModal>

        </>
    )
}