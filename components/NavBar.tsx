import { Tabs, TabList, TabIndicator, Tab } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image'
import { useRouter } from 'next/router';

const navList = [
    { name: 'Home', path: '/' },
    { name: 'Inscribe', path: '/inscribe' },
    { name: 'QBRC20', path: '/brc20' },
    { name: 'Marketplace', path: '/market' },
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
                    {navList.map((nav) => <Link key={nav.name} href={nav.path}>
                        <Tab _selected={{ color: '#2d73ff', fontWeight: 800 }}>{nav.name}</Tab>
                    </Link>)}
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