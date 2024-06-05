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
import { useRouter } from 'next/router'
import { useState } from 'react';
import store from 'store2';
import {
    ChevronRightIcon
} from "@chakra-ui/icons";
import WalletModal from './WalletModal';

export default function ConnectWallet() {
    const router = useRouter()
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
        if (typeof (window as any).qtum === 'undefined') {
            // uninstalled
            return;
        }

        const connectedWallet = store.has('connected_wallet');
        if (!connectedWallet) {
            return;
        }

        try {
            // await (window as any).qtum.btc.switchNetwork('qtum_testnet;')
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

    // useEffect(() => { getAccounts() }, [])

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

    const onGoMyQBRC20 = () => {
        router.push('/my-qbrc20');
        if (isWalletShow) {
            setIsWalletShow(false);
        }
    }

    const PersonIcon = () => {
        return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.8337 15.4167C15.8337 16.6912 13.3337 17.5 10.0003 17.5C6.66699 17.5 4.16699 16.6912 4.16699 15.4167C4.16699 13.5577 7.08366 12.5 10.0003 12.5C12.917 12.5 15.8337 13.75 15.8337 15.4167Z" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 10C12.0711 10 13.75 8.32107 13.75 6.25C13.75 4.17893 12.0711 2.5 10 2.5C7.92893 2.5 6.25 4.17893 6.25 6.25C6.25 8.32107 7.92893 10 10 10Z" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    }

    const CopyIcon = () => {
        return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33398 4.20596C8.38667 3.87612 8.46532 3.58678 8.57372 3.33341C9.1413 2.00678 10.4173 1.66675 13.268 1.66675C17.5007 1.66675 18.334 3.33341 18.334 6.74516C18.334 9.16675 18.1482 11.0005 16.6673 11.4673C16.4173 11.5461 16.1303 11.6098 15.801 11.6667" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.50033 18.3334C11.667 18.3334 13.3337 17.0834 13.3337 12.5001C13.3337 7.91675 11.667 6.66675 7.50033 6.66675C3.33366 6.66675 1.66699 7.63897 1.66699 12.5001C1.66699 17.3612 3.33366 18.3334 7.50033 18.3334Z" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.83431 7.50012C5.83431 7.50012 6.33812 9.49631 5.41764 10.4168C4.49717 11.3373 2.50098 10.8335 2.50098 10.8335" stroke="black" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    }

    const DisConnectIcon = () => {
        return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.16602 5.15668C10.6687 3.65402 13.0896 2.23485 15.4271 4.57231C17.7645 6.90978 16.3454 9.33072 14.8427 10.8334" stroke="#D2311B" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.833 14.8434C9.33035 16.3461 6.90941 17.7653 4.57195 15.4278C2.23448 13.0903 3.65366 10.6694 5.15631 9.16675" stroke="#D2311B" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.5 4.5L16 16" stroke="#D2311B" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

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
                            <MenuItem icon={<DisConnectIcon />} className='text-sm' onClick={onDisconnect}>Disconnect</MenuItem>
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
                        <div className='flex items-center p-3 text-sm mb-3' onClick={onAddressCopyClick}>
                            <CopyIcon />
                            <div className='ml-3'>Copy Address</div>
                        </div>
                        <div className='flex items-center p-3 text-sm mb-3' onClick={onGoMyQBRC20}>
                            <PersonIcon />
                            <div className='ml-3'>My QBRC20</div>
                        </div>
                        <Divider />
                        <div className='mt-3 flex items-center p-3 text-sm text-[#D2311B]' onClick={onDisconnect}>
                            <DisConnectIcon />
                            <div className='ml-3'>Disconnect</div>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}