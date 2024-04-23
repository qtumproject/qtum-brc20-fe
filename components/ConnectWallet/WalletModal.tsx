import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import store from 'store2';
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
        if (typeof (window as any).unisat === 'undefined') {
            alert('UniSat Wallet has not installed!');
            return;
        }
        console.log('unisat wallet has installed');
        try {
            let accounts = await (window as any).unisat.requestAccounts();
            console.log('connect success', accounts);
            store.set('connected_wallet', 'unisat');
            if (accounts && accounts[0]) {
                connectCb(accounts);
                close();
            }
        } catch (e) {
            console.log('connect failed');
        }

    }
    return (
        <>
            <div className='hidden lg:block'>
                <Modal isOpen={isShow} onClose={onClose} size="sm" closeOnOverlayClick={false}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Connect Wallet</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <div className='flex items-center dark:bg-[#31343F] dark:hover:bg-[#282A33] hover:bg-[#F3F3F0] border rounded-lg p-4 cursor-pointer' onClick={handleConnectUnisat}>
                                <Image src="https://next-cdn.unisat.io/_/187/logo/color.svg" alt='unisat' width={24} height={24} className='mr-3'></Image>
                                Unisat Wallet
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}