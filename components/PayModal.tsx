import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useClipboard,
    useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { satsToQtum } from '@/utils';
import Image from 'next/image';

interface IProps {
    isShow: boolean,
    children: any,
    fundingAddress: string,
    totalPay: number,
    close: Function,
}

export default function PayModal({ isShow, children, fundingAddress, totalPay, close }: IProps) {
    const toast = useToast();
    const { onCopy, hasCopied } = useClipboard(fundingAddress);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => { setIsOpen(isShow) }, [isShow])
    const onCopyClick = () => {
        onCopy();
        toast({
            title: 'Copied!',
            description: "The address has copied.",
            position: 'top',
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
    }
    const onClose = () => {
        close()
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Scan QR code to pay</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <div className='m-auto flex justify-center w-[170px] h-[170px]' ref={(node) => { node && node.appendChild(children) }}></div>
                        <div className='mb-4 text-center'>
                            Payment amount: {satsToQtum(totalPay)} QTUM
                        </div>
                        <div className='mt-4 bg-[#F3F3F0] p-4 rounded-xl text-[#7F8596] font-medium text-base	leading-[20px] pr-[40px] relative'>
                            {fundingAddress}
                            <Image width={24} height={24} alt="copy" src='/img/copy.png' className='absolute right-3 top-7 cursor-pointer' onClick={onCopyClick} />

                        </div >
                        <div className='mt-4 bg-[#F3F3F0] p-4 rounded-xl flex justify-between'>
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
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}