import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
    ChevronRightIcon,
} from "@chakra-ui/icons";
import WalletModal from './WalletModal';

export default function ConnectWallet() {
    const [isShow, setIsShow] = useState(false);
    const [account, setAccount] = useState('');

    const handleConnect = () => {
        setIsShow(true);

    }
    const handleConnectCB = (accounts: Array<string>) => {
        setAccount(accounts[0])
    }

    const renderAddress = () => {
        return (

            <Menu>
                <MenuButton className='w-[200px] overflow-hidden whitespace-nowrap text-ellipsis	 !block pr-4' as={Button} rightIcon={<ChevronRightIcon />}>
                    {account}
                </MenuButton>
                <MenuList>
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Create a Copy</MenuItem>
                    <MenuItem>Mark as Draft</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Attend a Workshop</MenuItem>
                </MenuList>
            </Menu>

        )
    }

    const renderConnectButton = () => {
        return (
            <Button
                width='180px'
                type="submit"
                variant='brandPrimary'
                onClick={() => { handleConnect() }}
            >
                Connect
            </Button>
        )
    }

    return (
        <>
            {
                account ? renderAddress() : renderConnectButton()
            }

            <WalletModal
                isShow={isShow}
                close={() => setIsShow(false)}
                connectCb={handleConnectCB}
            />
        </>
    )
}