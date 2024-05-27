import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogOverlay,
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
                        <AlertDialogBody textAlign='center' fontFamily='DMsans' fontSize='16px' paddingTop='20px'>
                            <div>Closing the pop-up window may result in </div>
                            <div>inscription failure. Are you sure to continue?</div>
                        </AlertDialogBody>

                        <div className='hidden lg:block'>

                            <AlertDialogFooter justifyContent='space-between'>
                                <Button ref={cancelRef} width='181px' height='53px' fontSize='16px' borderRadius='12px' variant='outline' onClick={onClose} size='sm'>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' width='181px' height='53px' fontSize='16px' borderRadius='12px' onClick={handleConfirm} size='sm'>
                                    Yes, stop inscribing
                                </Button>
                            </AlertDialogFooter>

                        </div>

                        <div className='lg:hidden block max-w-[355px] mx-auto'>
                            <AlertDialogFooter justifyContent='space-between' paddingLeft='0' paddingRight='0'>
                                <Button ref={cancelRef} width='170px' height='48px' fontSize='14px' borderRadius='12px' variant='outline' onClick={onClose} size='sm'>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' width='170px' height='48px' fontSize='14px' borderRadius='12px' marginLeft='14px' onClick={handleConfirm} size='sm'>
                                    Yes, stop inscribing
                                </Button>
                            </AlertDialogFooter>
                        </div>


                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog >
        </>
    )
}