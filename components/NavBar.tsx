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
import { useTheme } from 'next-themes'


const navList = [
    { name: 'Home', path: '/' },
    { name: 'Inscribe', path: '/inscribe' },
    { name: 'QBRC20', path: '/brc20' },
    { name: 'Marketplace', path: '/market', offline: true },
]

export default function NavBar() {
    const { theme, setTheme } = useTheme()
    const { colorMode, toggleColorMode } = useColorMode()

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const tabIndex = navList.findIndex((nav) => nav.path === router.pathname);

    const onClose = () => {
        setIsOpen(false)
    }

    const onLigthModeChange = (value: string) => {
        toggleColorMode();
        setTheme(value)
    }

    return (
        <>
            <div className={`header-wrap items-center h-[5.5625rem] px-10 lg:flex hidden justify-between`} style={{ borderBottom: "1px solid hsla(0,0%,100%,.06)" }}>
                <div className='flex justify-between'>
                    <div className={`text-x font-bold mr-[10.75rem]`}>
                        <Link href="/">
                            <Image src="/logo.svg" alt="logo" width={240} height={38} />
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

                <div>
                    <Switch onChange={onLigthModeChange} defaultValue={colorMode} />
                </div>
            </div >

            <div className='flex lg:hidden h-[50px] px-[16px] items-center justify-between'>
                <div className='flex'>
                    <Link href="/">
                        <Image src="/logo.svg" alt="logo" width={139} height={22} />
                    </Link>
                </div>
                <div>
                    <Image src="/img/icon-menu.png" height={32} width={32} alt="menu" onClick={() => setIsOpen(true)}></Image>
                    <Drawer placement='top' onClose={onClose} isOpen={isOpen} autoFocus={false}>
                        <DrawerOverlay bgColor={'transparent'} />
                        <DrawerContent>
                            <DrawerBody>
                                {navList.map((nav) => {
                                    return (<div key={nav.name}>
                                        <Link href={nav.path} onClick={() => setIsOpen(false)}>
                                            <div className='py-12px text-sm leading-[66px] font-medium'>{nav.name}</div>
                                        </Link>
                                        <Divider />
                                    </div>)
                                })}
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </>
    )

}
