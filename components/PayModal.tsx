import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';

interface IProps {
    isShow: boolean,
    children: any,
    fundingAddress: string,
    close: Function,
}

export default function PayModal({ isShow, children, fundingAddress,close }: IProps) {

    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {setIsOpen(isShow)},[isShow])
    const onClose = () => {
        close()
    }
  
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {fundingAddress}
                       <div className='flex justify-center' ref={(node) => {node && node.appendChild(children)}}></div>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}