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
    const handleConnectFoxwallet = async () => {
        if (typeof (window as any).qtum === 'undefined') {
            alert('Fox Wallet has not installed!');
            return;
        }
        console.log('Fox wallet has installed');
        try {
            await (window as any).qtum.btc.switchNetwork('testnet')
            let accounts = await (window as any).qtum.btc.requestAccounts();
            console.log('connect success', accounts);
            store.set('connected_wallet', 'foxwallet');
            console.log(store.get('connected_wallet'))
            if (accounts && accounts[0]) {
                connectCb(accounts);
                close();
            }
        } catch (e) {
            console.error(e)
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
                            <div className='flex items-center dark:bg-[#31343F] dark:hover:bg-[#282A33] hover:bg-[#F3F3F0] border rounded-lg p-4 cursor-pointer' onClick={handleConnectFoxwallet}>
                                <Image src="/foxwallet.jpg" alt='foxwallet' width={24} height={24} className='mr-3'></Image>
                                Fox Wallet
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}