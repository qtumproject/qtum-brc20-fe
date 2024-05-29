
import { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';
import { isMobile } from '@/utils';

export default function AlertConfirm({ isShowAlert, onConfirm, onClose }: {
    isShowAlert: boolean
    onConfirm: () => void,
    onClose: () => void
}) {

    const [size, setSize] = useState('md');

    useEffect(() => {
        if (isMobile()) {
            setSize('sm');
        }
    }, [])

    const handleConfirm = async () => {
        onClose();
        onConfirm();
    }



    return (
        <>
            <Modal isOpen={isShowAlert} onClose={onClose} size={size} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent className='w-[calc(100vw_-_32px)] l-4'>
                    <ModalHeader className='leading-[32px]'>Reminder</ModalHeader>
                    <ModalCloseButton top="16px" right="16px" />
                    <ModalBody pb={4} px={3} pt={0}>
                        Closing the pop-up window may result in inscription failure. Are you sure you want to stop the inscription process?
                    </ModalBody>
                    <div className='pb-4 px-3 flex justify-between'>
                        <Button width='48%' height='53px' fontSize='16px' borderRadius='12px' variant='outline' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' width='48%' height='53px' fontSize='16px' borderRadius='12px' onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </div>
                </ModalContent>
            </Modal >
        </>
    )
}