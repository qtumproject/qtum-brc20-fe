import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
} from '@chakra-ui/react'

import { useRef } from 'react';

export default function AlertConfirm({ isShowAlert, onConfirm, onClose }: {
    isShowAlert: boolean
    onConfirm: () => void,
    onClose: () => void
}) {
    const cancelRef = useRef<HTMLButtonElement>(null)

    const handleConfirm = async () => {
        onClose();
        onConfirm();
    }

    return (
        <>
            <AlertDialog
                isOpen={isShowAlert}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            Closing the pop-up window may result in inscription failure. Are you sure to continue?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} size='sm'>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleConfirm} ml={3} size='sm'>
                                Yes, stop inscribing
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}