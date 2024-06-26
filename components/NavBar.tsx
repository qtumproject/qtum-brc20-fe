import {
    Tabs, TabList, TabIndicator, Tab,
    Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody,
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
    Divider,
    useColorMode,
} from '@chakra-ui/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Switch from '@/components/Switch';
import { useShowConnect } from '@/hooks';
import { useTheme } from 'next-themes'
import ConnectWallet from './ConnectWallet';


const navList = [
    { name: 'Home', path: '/' },
    { name: 'Inscribe', path: '/inscribe' },
    { name: 'QBRC20', path: '/brc20' },
    { name: 'Balance', path: '/balance' },
    { name: 'Marketplace', path: '/market', offline: true },
]

export default function NavBar() {
    const { setTheme } = useTheme()
    const { colorMode, toggleColorMode } = useColorMode()
    const [isShowConnect] = useShowConnect();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const tabIndex = navList.findIndex((nav) => nav.path === router.pathname);

    const onClose = () => {
        setIsOpen(false)
    }

    const onModeChange = (value: string) => {
        toggleColorMode(); // change chakra-ui theme
        setTheme(value); // change next-theme
        onClose();
    }

    const renderConnect = () => {
        return isShowConnect ? <ConnectWallet /> : null;
    }

    return (
        <>
            <div className={`header-wrap items-center h-[5.5625rem] px-10 lg:flex hidden justify-between`} style={colorMode === 'light' ? { borderBottom: "1px solid hsla(0,0%,100%,.06)" } : { borderBottom: "1px solid #31343F" }}>
                <div className='flex justify-between'>
                    <div className={`text-x font-bold mr-[10.75rem]`}>
                        <Link href="/">
                            <Image className='block dark:hidden' src="/logo.svg" alt="logo" width={240} height={38} />
                            <Image className='dark:block hidden' src="/logo-d.png" alt="logo" width={240} height={38} />
                        </Link>
                    </div>
                    <div className={`tab-nav px-8`}>
                        <Tabs position="relative" variant="unstyled" index={tabIndex}>
                            <TabList>
                                {navList.map((nav) => {
                                    if (nav.offline) {
                                        return (
                                            <Popover key="popover" trigger='hover' offset={[0, -4]}>
                                                <PopoverTrigger>
                                                    <div role='button' className='ml-5 leading-10'>{nav.name}</div>
                                                </PopoverTrigger>
                                                <PopoverContent bg='brand.100' color='white' width={120} borderRadius='14px'>
                                                    <PopoverArrow bg='brand.100' />
                                                    <PopoverBody p="2.5" className='font-[DMsans] text-base leading-5'>
                                                        coming soon
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    } else {
                                        return (
                                            <Link key={nav.name} href={nav.path}>
                                                <Tab _selected={{ color: '#2d73ff', fontWeight: 800 }}>{nav.name}</Tab>
                                            </Link>
                                        )
                                    }
                                })}
                            </TabList>
                            <TabIndicator
                                mt="-1.5px"
                                height="1px"
                                bg="#2d73ff"
                                borderRadius="1px"
                            />
                        </Tabs>
                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className='mr-4'>
                        {renderConnect()}
                    </div>
                    <Switch onChange={onModeChange} defaultValue={colorMode} />
                </div>
            </div >

            <div className='flex lg:hidden h-[50px] px-[16px] items-center justify-between'>
                <div className='flex'>
                    <Link href="/">
                        <Image className='block dark:hidden' src="/logo.svg" alt="logo" width={139} height={22} />
                        <Image className='dark:block hidden' src="/logo-d.png" alt="logo" width={139} height={22} />
                    </Link>
                </div>

                <div className='flex items-center justify-center'>
                    <div className='mr-2'>
                        {renderConnect()}
                    </div>
                    <Image className="block dark:hidden" src="/img/icon-menu.png" height={32} width={32} alt="menu" onClick={() => setIsOpen(true)}></Image>
                    <Image className="hidden dark:block" src="/img/icon-menu-d.png" height={32} width={32} alt="menu" onClick={() => setIsOpen(true)}></Image>
                    <Drawer placement='top' onClose={onClose} isOpen={isOpen} autoFocus={false}>
                        <DrawerOverlay bgColor={'transparent'} />
                        <DrawerContent>
                            <DrawerBody>
                                {navList.map((nav) => {
                                    if (nav.offline) {
                                        return (
                                            <div key={nav.name} className="flex justify-between items-center text-sm text-[gray]">
                                                <div className='py-12px text-sm leading-[66px] font-medium'>{nav.name}</div>
                                                <div>coming soon</div>
                                            </div>
                                        )
                                    }
                                    return (<div key={nav.name}>
                                        <Link href={nav.path} onClick={() => setIsOpen(false)}>
                                            <div className='py-12px text-sm leading-[66px] font-medium'>{nav.name}</div>
                                        </Link>
                                        <Divider />
                                    </div>)
                                })}
                                <div className='mt-2'><Switch onChange={onModeChange} defaultValue={colorMode} /></div>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </>
    )

}
