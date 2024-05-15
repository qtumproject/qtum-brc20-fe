import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useClipboard,
    useToast,
    Divider,
    Drawer, DrawerOverlay, DrawerContent, DrawerBody,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import store from 'store2';
import {
    ChevronRightIcon,
    CopyIcon,
    ArrowBackIcon
} from "@chakra-ui/icons";
import WalletModal from './WalletModal';

export default function ConnectWallet() {
    const [isShow, setIsShow] = useState(false);
    const [isWalletShow, setIsWalletShow] = useState(false);
    const [account, setAccount] = useState('');
    const [connected, setConnected] = useState(false);
    const toast = useToast();
    const { onCopy: onCopyAddress } = useClipboard(account);

    const onAddressCopyClick = () => {
        onCopyAddress();
        toast({
            title: 'The address has been copied!',
            position: 'top',
            status: 'success',
            duration: 2000,
        });
        if (isWalletShow) {
            setIsWalletShow(false);
        }
    }
    const getAccounts = async () => {
        console.log('===========> getAccount')
        if (typeof (window as any).qtum === 'undefined') {
            // uninstalled
            return;
        }

        const connectedWallet = store.has('connected_wallet');
        console.log('>>>>>>>>>>>>>>', connectedWallet)
        if (!connectedWallet) {
            return;
        }

        try {
            let accounts = await (window as any).qtum.btc.getAccounts();
            console.log('connect success', accounts);
            if (accounts && accounts[0]) {
                setAccount(accounts[0])
                setConnected(true);
            }
        } catch (e) {
            console.log('connect failed');
        }
    }

    useEffect(() => { getAccounts() }, [])

    const handleConnect = () => {
        setIsShow(true);
    }

    const handleShowWalletDrawer = () => {
        setIsWalletShow(true);
    }

    const handleCloseWalletDrawer = () => {
        setIsWalletShow(false);
    }

    const handleConnectCB = (accounts: Array<string>) => {
        setAccount(accounts[0])
        setConnected(true);
    }

    const onDisconnect = () => {
        const connectedWallet = store.has('connected_wallet');
        if (connectedWallet) {
            store.remove('connected_wallet')
            setConnected(false);
            if (isWalletShow) {
                setIsWalletShow(false);
            }
        }
    }

    const renderAddress = () => {
        return (
            <>
                <div className='hidden lg:block'>
                    <Menu>
                        <MenuButton variant='outline' className='w-[200px] overflow-hidden whitespace-nowrap text-ellipsis flex items-center pr-4' as={Button} rightIcon={<ChevronRightIcon />}>
                            <div className='flex items-center text-sm'>
                                <span className='w-3 h-3 block rounded-full bg-[#2D73FFCC] mr-2'></span>
                                {account.slice(0, 6) + '...' + account.slice(-5)}
                            </div>
                        </MenuButton>
                        <MenuList>
                            <MenuItem icon={<CopyIcon />} className='text-sm' onClick={onAddressCopyClick}>Copy Address</MenuItem>
                            <MenuDivider />
                            <MenuItem icon={<ArrowBackIcon />} className='text-sm' onClick={onDisconnect}>Disconnect</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
                <div className='block lg:hidden'>
                    <Button
                        width='130px'
                        size='sm'
                        type="submit"
                        variant='outline'
                        onClick={() => { handleShowWalletDrawer() }}
                    >
                        <div className='flex items-center text-sm'>
                            <span className='w-3 h-3 block rounded-full bg-[#2D73FFCC] mr-2'></span>
                            {account.slice(0, 4) + '...' + account.slice(-4)}
                        </div>
                    </Button>
                </div>
            </>


        )
    }

    const renderConnectButton = () => {
        return (
            <>
                <div className='hidden lg:block'>
                    <Button
                        width='180px'
                        type="submit"
                        variant='brandPrimary'
                        onClick={() => { handleConnect() }}
                    >
                        Connect
                    </Button>
                </div>
                <div className='block lg:hidden'>
                    <Button
                        width='108px'
                        size='sm'
                        type="submit"
                        variant='brandPrimary'
                        onClick={() => { handleConnect() }}
                    >
                        Connect
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            {
                connected ? renderAddress() : renderConnectButton()
            }

            <WalletModal
                isShow={isShow}
                close={() => setIsShow(false)}
                connectCb={handleConnectCB}
            />

            <Drawer placement='top' onClose={handleCloseWalletDrawer} isOpen={isWalletShow} autoFocus={false}>
                <DrawerOverlay bgColor={'transparent'} />
                <DrawerContent>
                    <DrawerBody>
                        <div className='flex items-center p-3 text-sm' onClick={onAddressCopyClick}>
                            <CopyIcon />
                            <div className='ml-3'>Copy Address</div>
                        </div>
                        <Divider />
                        <div className='flex items-center p-3 text-sm' onClick={onDisconnect}>
                            <ArrowBackIcon />
                            <div className='ml-3'>Disconnect</div>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}