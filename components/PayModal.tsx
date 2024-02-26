import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';

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
                        <div className='m-auto flex justify-center w-60' ref={(node) => { node && node.appendChild(children) }}></div>
                        <div className='mt-4 text-center'>
                            Total Pay: {totalPay} sats
                        </div>
                        <Input className='mt-4' isDisabled={true} variant='outline' placeholder='Outline' value={fundingAddress} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Confirm</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}