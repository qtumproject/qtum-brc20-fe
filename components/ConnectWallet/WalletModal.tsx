import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import Image from 'next/image'

interface IProps {
    isShow: boolean,
    close: Function,
    connectCb: Function,
}

export default function WalletModal({ isShow, close, connectCb }: IProps) {

    const onClose = () => {
        close()
    }
    const handleConnectUnisat = async () => {
        if (typeof window.unisat === 'undefined') {
            alert('UniSat Wallet has not installed!');
            return;
        }
        console.log('unisat wallet has installed');
        try {
            let accounts = await window.unisat.requestAccounts();
            console.log('connect success', accounts);
            connectCb(accounts);

        } catch (e) {
            console.log('connect failed');
        }

    }
    return (
        <>
            <div className='hidden lg:block'>
                <Modal isOpen={isShow} onClose={onClose} size="xl" closeOnOverlayClick={false}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Connect Wallet</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <div className='flex items-center hover:bg-cblack border rounded p-2 cursor-pointer' onClick={handleConnectUnisat}>
                                <Image src="https://next-cdn.unisat.io/_/187/logo/color.svg" alt='unisat' width={48} height={48}></Image>
                                Unisat Wallet
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}