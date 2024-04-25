import { useEffect, ChangeEvent } from 'react';
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
} from '@/utils';
import { IQtumFeeRates, TFeeType, IProgressInfo, IOrderItem } from '@/types';
import FeeType from "./FeeType";
import PayModal from "./PayModal";
import PayMode from './PayMode';

interface IProps {
    feeRates: IQtumFeeRates,
    updateOrder: (orderItem: IOrderItem, opType: 'add' | 'update') => void,
}

export default function Deploy({ feeRates, updateOrder }: IProps) {
    const toast = useToast();
    const [mode, setMode] = useState('qtum');
    const [step, setStep] = useState(1);
    const [tick, setTick] = useState('')
    const [amount, setAmount] = useState('21000000');
    const [limit, setLimit] = useState('1');
    const [rAddress, setRAddress] = useState('');
    const [feeType, setFeeType] = useState<TFeeType>('normal');
    const [customFee, setCustomFee] = useState(feeRates['custom']);
    const [fee, setFee] = useState('400');

    const [isTickError, setIsTickError] = useState(false);
    const [isAmountError, setIsAmountError] = useState(false);
    const [isLimitError, setIsLimitError] = useState(false);
    const [isRAddressError, setisRAddressError] = useState(false);

    const [inscriptionFees, setInscriptionFees] = useState(0);
    const [totalFees, setTotalFees] = useState(0);

    const [isModalShow, setIsModalShow] = useState(false);
    const [isProgress, setIsProgress] = useState(false);
    const [txids, setTxIds, txidsRef] = useState<Array<string>>([]);
    const [activeStep, setActiveStep] = useState(1);
    const [qrImg, setQrImg] = useState('');
    const [fundingAddress, setFundingAddress] = useState('');

    const [deploy, setDeploy] = useState({
        p: 'brc-20',
        op: 'deploy',
        tick: '',
        max: '0',
        lim: '0'

    });
    useEffect(() => { setCustomFee(feeRates.custom) }, [feeRates]);
    useEffect(() => {
        setDeploy({
            p: 'brc-20',
            op: 'deploy',
            tick,
            max: amount,
            lim: limit,
        })
    }, [tick, amount, limit])

    useEffect(() => {
        setFee(feeRates[feeType]);
    }, [feeType, feeRates])

    useEffect(() => {
        calcTotalFees({
            scriptObj: deploy,
            fee,
            customFee,
            feeType,
            setInscriptionFees,
            setTotalFees,
        });
    }, [customFee, fee, deploy])


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

        if (!limit) {
            setIsLimitError(true);
            valid = false;
        } else {
            setIsLimitError(false);
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
            if (mode === 'qtum') {
                resolveDeploy();
                setIsModalShow(true);
            } else {
                // TODO add sendQtum
                alert('use wallet to pay')
                console.log('use wallet to pay')
            }

        }
    }

    const setProgress = (progressInfo: IProgressInfo) => {
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

    const resolveDeploy = () => {
        try {
            mintOrDeploy({
                scriptObj: deploy,
                inscriptionFees,
                totalFees,
                rAddress,
                setFundingAddress,
                setQrImg,
                setProgress,
                updateOrder
            });
        } catch (e: any) {
            toast({
                title: `[Deploy error] ${e.message}`,
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
                                placeholder='4 characters like &quot;abcd&quot;...'
                                value={tick}
                                focusBorderColor="#2D73FF"
                                onChange={onTickChange} />
                            {isTickError && <FormErrorMessage>
                                invalid input tick name
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isAmountError}>
                            <FormLabel htmlFor='amount'>Total Supply</FormLabel>
                            <NumberInput id='amount' focusBorderColor="#2D73FF" defaultValue={1} min={1} value={amount} onChange={(value) => setAmount(value)}>
                                <NumberInputField />
                            </NumberInput>
                            {isAmountError && <FormErrorMessage>
                                invalid input amount
                            </FormErrorMessage>}
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isLimitError}>
                            <FormLabel htmlFor='limit'>Limit Per Mint</FormLabel>
                            <NumberInput id='limit' focusBorderColor="#2D73FF" defaultValue={1} min={1} value={limit} onChange={(value) => setLimit(value)}>
                                <NumberInputField />
                            </NumberInput>
                            {isLimitError && <FormErrorMessage>
                                invalid input limit
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

                </div >
            }
            {
                step === 2 && <div>
                    <div className='mb-4'>
                        <FormControl>
                            <pre className="py-[16px] rounded-[12px] pl-[16px] bg-[#F3F3F0] dark:bg-[#282A33] break-all whitespace-break-spaces">{JSON.stringify(deploy)} </pre>
                        </FormControl>
                    </div>
                    <div className='mb-4'>
                        <FormControl isRequired isInvalid={isRAddressError}>
                            <FormLabel htmlFor='raddress'>Receiving Address</FormLabel>
                            <Input
                                id='raddress'
                                placeholder='input your receiving address'
                                value={rAddress}
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
                    </div>

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
                </div>
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