import { Tabs, TabList, TabIndicator, Tab, Popover, PopoverTrigger, Box, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from 'next/router';

const navList = [
    { name: 'Home', path: '/' },
    { name: 'Inscribe', path: '/inscribe' },
    { name: 'QBRC20', path: '/brc20' },
    { name: 'Marketplace', path: '/market', offline: true },
]


export default function NavBar() {
    const router = useRouter();
    const tabIndex = navList.findIndex((nav) => nav.path === router.pathname);

    return <div className={`header-wrap flex items-center h-[5.5625rem] px-10`} style={{ borderBottom: "1px solid hsla(0,0%,100%,.06)" }}>
        <div className={`text-x font-bold mr-[10.75rem]`}>
            <Image src="/logo.svg" alt="logo" width={240} height={38} />
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
    </div >
}