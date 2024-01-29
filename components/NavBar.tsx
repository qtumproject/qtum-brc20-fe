import { Tabs, TabList, TabIndicator, Tab } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';


const navList = [
    { name: 'Home', path: '/' },
    { name: 'Inscribe', path: '/inscribe' },
    { name: 'QBRC20', path: '/indexer' },
    { name: 'Marketplace', path: '/market' },
]


export default function NavBar() {
    const router = useRouter();
    const tabIndex = navList.findIndex((nav) => nav.path === router.pathname)

    return <div className={`header-wrap flex items-center h-16 bg-black text-white px-10`} style={{ background: "#090808", borderBottom: "1px solid hsla(0,0%,100%,.06)" }}>
        <div className={`text-x font-bold`}>QBRC-20</div>
        <div className={`tab-nav px-8`}>
            <Tabs position="relative" variant="unstyled" index={tabIndex}>
                <TabList>
                    {navList.map((nav) => <Link key={nav.name} href={nav.path}>
                        <Tab>{nav.name}</Tab>
                    </Link>)}
                </TabList>
                <TabIndicator
                    mt="0"
                    height="2px"
                    bg="white"
                    borderRadius="1px"
                />
            </Tabs>
        </div>
    </div>
}