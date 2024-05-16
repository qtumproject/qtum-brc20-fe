
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useClipboard,
    useToast,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Box,
    Button,
    Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { satsToQtum } from '@/utils';
import Image from 'next/image';

interface IProps {
    isShow: boolean,
    children: any,
    fundingAddress: string,
    totalPay: number,
    isProgress: boolean,
    walletLoading: boolean,
    activeStep: number,
    txids: Array<string>
    close: Function,
}

export default function PayModal({
    isShow,
    children,
    fundingAddress,
    totalPay,
    isProgress,
    walletLoading,
    activeStep,
    txids,
    close
}: IProps) {
    const toast = useToast();

    const { onCopy: onCopyAddress } = useClipboard(fundingAddress);
    const count = satsToQtum(totalPay)
    const { onCopy: onCopyCount } = useClipboard(count);

    const steps = [
        { title: 'Payment Confirmed', description: '' },
        { title: 'Inscribing(1/1)', description: '' },
        { title: 'Inscription Finished', description: '' },
    ];

    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => { setIsOpen(isShow) }, [isShow])

    const onAddressCopyClick = () => {
        onCopyAddress();
        toast({
            title: 'The address has been copied!',
            position: 'top',
            status: 'success',
            duration: 2000,
        })
    }
    const onCountCopyClick = () => {
        onCopyCount();
        toast({
            title: 'The count has been copied!',
            position: 'top',
            status: 'success',
            duration: 2000,
        })
    }
    const onClose = () => {
        close()
    }

    const renderLoading = () => {
        return (
            <div className='flex flex-col items-center justify-center bg-white'>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='brand.100'
                    size='xl'
                />
                <div className='text-black mt-4 text-center'>Do not leave this page, the inscription is in progress.</div>
            </div>

        )
    }

    const renderPayCode = () => (<>
        <div className='m-auto flex justify-center w-[170px] h-[170px]' ref={(node) => { node && node.appendChild(children) }}></div>
        <div className='mb-4 flex items-center justify-center'>
            Payment amount: {satsToQtum(totalPay)} QTUM <span className='bg-[#F3F3F0] dark:bg-[#282A33] rounded-full p-1.5 ml-2.5'>
                <Image width={18} height={18} alt="copy" src='/img/copy.png' className='dark:hidden block  cursor-pointer' onClick={onCountCopyClick} />
                <Image width={18} height={18} alt="copy" src='/img/copy-d.svg' className='dark:block hidden cursor-pointer' onClick={onCountCopyClick} />
            </span>
        </div>
        <div className='mt-4 bg-[#F3F3F0] dark:bg-[#282A33] p-4 rounded-xl text-[#7F8596] font-medium text-base	leading-[20px] pr-[40px] relative'>
            {fundingAddress}
            <Image width={24} height={24} alt="copy" src='/img/copy.png' className='dark:hidden block absolute right-3 top-7 cursor-pointer' onClick={onAddressCopyClick} />
            <Image width={24} height={24} alt="copy" src='/img/copy-d.svg' className='dark:block hidden absolute right-3 top-7 cursor-pointer' onClick={onAddressCopyClick} />

        </div >

        <div className='hidden lg:flex mt-4 bg-[#F3F3F0] dark:bg-[#282A33] p-4 rounded-xl justify-between'>
            <div className='font-semibold text-sm'>Network Fee</div>
            <div>
                <span className='font-semibold text-sm'>
                    {totalPay.toFixed(3)} sats
                </span>
                <span className='text-sm text-[#7F8596] ml-2'>{satsToQtum(totalPay)} QTUM</span>
            </div>
        </div >

        <div className='lg:hidden mt-4 bg-[#F3F3F0] dark:bg-[#282A33] p-4 rounded-xl flex flex-col justify-between'>
            <div className='font-semibold text-sm'>Network Fee</div>
            <div>
                <span className='font-semibold text-sm'>
                    {totalPay.toFixed(3)} sats
                </span>
                <span className='text-sm text-[#7F8596] ml-2'>{satsToQtum(totalPay)} QTUM</span>
            </div>
        </div >
        <div className='mt-4 text-[#D2311B] text-center'>
            Please stay on the current page before completing the transfer
        </div></>)

    const renderProgress = () => {
        return <>
            <Stepper index={activeStep} colorScheme='brand' orientation='vertical' height='400px' gap='0'>
                {steps.map((step, index) => (
                    <Step key={index} className="w-full">
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0' width="100%">
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription className='w-[90%]'>{txids[index] ? `txid: ${txids[index]}` : ''}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>
                ))}
            </Stepper >
            <div className='mt-4 text-center'>
                <Button
                    mt={4}
                    width='90%'
                    type="submit"
                    variant='brandPrimary'
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </>
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{walletLoading ? 'Inscription Process' : (isProgress ? 'Inscription Process' : 'Scan QR code to pay')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {walletLoading ? renderLoading() : (isProgress ? renderProgress() : renderPayCode())}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}