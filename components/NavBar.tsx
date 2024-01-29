import { Tabs, TabList, TabIndicator, Tab } from '@chakra-ui/react'
import Link from 'next/link'


export default function NavBar() {
    return <div className={`header-wrap flex items-center h-16 bg-black text-white px-10`} style={{ background: "#090808", borderBottom: "1px solid hsla(0,0%,100%,.06)" }}>
        <div className={`text-x font-bold`}>QBRC-20</div>
        <div className={`tab-nav px-8`}>
            <Tabs position="relative" variant="unstyled">
                <TabList>
                    <Link href="/">
                        <Tab>Home</Tab>
                    </Link>
                    <Link href="inscribe">
                        <Tab>Inscribe</Tab>
                    </Link>
                    <Link href="indexer">
                        <Tab>QBRC20</Tab>
                    </Link>
                    <Link href="market">
                        <Tab>Marketplace</Tab>
                    </Link>
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