
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
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { satsToQtum } from '@/utils';
import Image from 'next/image';

interface IProps {
    isShow: boolean,
    children: any,
    fundingAddress: string,
    totalPay: number,
    isProgress: boolean,
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
    activeStep,
    txids,
    close
}: IProps) {
    const toast = useToast();

    const steps = [
        { title: 'Payment Confirmed', description: '' },
        { title: 'Inscribing(1/1)', description: '' },
        { title: 'Inscription Finished', description: '' },
    ];

    const { onCopy } = useClipboard(fundingAddress);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { setIsOpen(isShow) }, [isShow])

    const onCopyClick = () => {
        onCopy();
        toast({
            title: 'The address has been copied!',
            position: 'top',
            status: 'success',
            duration: 2000,
        })
    }
    const onClose = () => {
        close()
    }

    const renderPayCode = () => (<>
        <div className='m-auto flex justify-center w-[170px] h-[170px]' ref={(node) => { node && node.appendChild(children) }}></div>
        <div className='mb-4 text-center'>
            Payment amount: {satsToQtum(totalPay)} QTUM
        </div>
        <div className='mt-4 bg-[#F3F3F0] p-4 rounded-xl text-[#7F8596] font-medium text-base	leading-[20px] pr-[40px] relative'>
            {fundingAddress}
            <Image width={24} height={24} alt="copy" src='/img/copy.png' className='absolute right-3 top-7 cursor-pointer' onClick={onCopyClick} />

        </div >

        <div className='hidden lg:flex mt-4 bg-[#F3F3F0] p-4 rounded-xl justify-between'>
            <div className='font-semibold text-sm'>Network Fee</div>
            <div>
                <span className='font-semibold text-sm'>
                    {totalPay.toFixed(3)} sats
                </span>
                <span className='text-sm text-[#7F8596] ml-2'>{satsToQtum(totalPay)} QTUM</span>
            </div>
        </div >

        <div className='lg:hidden mt-4 bg-[#F3F3F0] p-4 rounded-xl flex flex-col justify-between'>
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
            <Stepper index={activeStep} colorScheme='brand' orientation='vertical' width='480px' height='400px' gap='0'>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>

                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription className='w-[480px]'>{txids[index] ? `txid: ${txids[index]}` : ''}</StepDescription>
                        </Box>

                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>
            <div className='mb-4 text-center'>
                <Button
                    mt={4}
                    width='400px'
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
            <div className='hidden lg:block'>
                <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{isProgress ? 'Inscription Process' : 'Scan QR code to pay'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            {isProgress ? renderProgress() : renderPayCode()}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
            <div className='lg:hidden'>
                <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false}>
                    <ModalOverlay />
                    <ModalContent className='w-[calc(100vw_-_32px)] l-4'>
                        <ModalHeader>{isProgress ? 'Inscription Process' : 'Scan QR code to pay'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            {isProgress ? renderProgress() : renderPayCode()}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}