import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';


interface IProps {
    isOpen: boolean,
    onClose: () => void,
}

export default function DownloadModal({ isOpen, onClose }: IProps) {

    const handleConfirm = () => {
        // TODO add open app logic, if failed and then redirect to foxwallet homepage
        location.href = "https://foxwallet.com"
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent className='w-[calc(100vw_-_32px)] l-4'>
                <ModalHeader className='leading-[32px]'>Reminder</ModalHeader>
                <ModalCloseButton top="16px" right="16px" />
                <ModalBody pb={4} px={3} pt={0}>
                    <div>You could not “Pay with wallet” in browser. If you want to use this function, please open this link in FoxWallet app.</div>
                </ModalBody>
                <div className='pb-4 px-3 flex justify-between'>
                    <Button width='48%' height='53px' fontSize='16px' borderRadius='12px' variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='brand' width='48%' height='53px' fontSize='16px' borderRadius='12px' onClick={handleConfirm}>
                        Download App
                    </Button>
                </div>
            </ModalContent>
        </Modal >
    )
}