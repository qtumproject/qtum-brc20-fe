import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { satsToQtum } from '@/utils';

interface IProps {
    isShow: boolean,
    children: any,
    fundingAddress: string,
    totalPay: number,
    close: Function,
}

export default function PayModal({ isShow, children, fundingAddress, totalPay, close }: IProps) {

    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => { setIsOpen(isShow) }, [isShow])
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
                            Payment amount: {totalPay.toFixed(3)} sats  = {satsToQtum(totalPay)} QTUM
                        </div>
                        <div className='mt-4 bg-[#F3F3F0] p-4 rounded-xl'>{fundingAddress} </div >
                        <div className='mt-4 text-[#D2311B] text-center'>
                            Please stay on the current page before completing the transfer
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}