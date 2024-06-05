import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import DownloadModal from '@/components/DownloadModal';
import store from 'store2';
import Image from 'next/image'

interface IProps {
    isShow: boolean,
    close: Function,
    connectCb: Function,
}

export default function WalletModal({ isShow, close, connectCb }: IProps) {
    const [isShowAlert, setIsShowAlert] = useState(false);

    const onClose = () => {
        close()
    }
    const handleConnectFoxwallet = async () => {
        if (typeof (window as any).qtum === 'undefined') {
            setIsShowAlert(true);
            return;
        }
        console.log('Fox wallet has installed');
        try {
            // TODO change to livenet when switch to qtum
            await (window as any).qtum.btc.switchNetwork('testnet'); // testnet | livenet
            let accounts = await (window as any).qtum.btc.requestAccounts();
            console.log('connect success', accounts);
            store.set('connected_wallet', 'foxwallet');
            console.log(store.get('connected_wallet'))
            if (accounts && accounts[0]) {
                store.set('wallet_address', accounts[0]);
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
                <Modal isOpen={isShow} onClose={onClose} size="sm" closeOnOverlayClick={false} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader className='leading-[32px]'>Connect Wallet</ModalHeader>
                        <ModalCloseButton top="16px" right="16px" />
                        <ModalBody pb={4} px={3} pt={0}>
                            <div className='flex items-center dark:bg-[#31343F] dark:hover:bg-[#282A33] hover:bg-[#F3F3F0] border rounded-lg p-4 cursor-pointer' onClick={handleConnectFoxwallet}>
                                <Image src="/foxwallet.jpg" alt='foxwallet' width={24} height={24} className='mr-3'></Image>
                                Fox Wallet
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
            <DownloadModal isOpen={isShowAlert} onClose={() => setIsShowAlert(false)} />
        </>
    )
}