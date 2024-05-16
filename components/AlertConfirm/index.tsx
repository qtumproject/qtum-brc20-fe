import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from '@chakra-ui/react'

import { useEffect, useRef } from 'react';

export default function AlertConfirm({ isShowAlert }: {
    isShowAlert: boolean
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        console.log('isShowAlert', isShowAlert)
        if (isShowAlert) {
            onOpen();
        }
    }, [isShowAlert, onOpen])

    const onConfirm = async () => {
        await (window as any).qtum.btc.switchNetwork('testnet');
        onClose();
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Change Network
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You will change to tQtum.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='brand' onClick={onConfirm} ml={3}>
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}