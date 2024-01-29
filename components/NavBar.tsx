import { Tabs, TabList, TabIndicator, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Link from 'next/link'


export default function NavBar() {
    return <div className={`header-wrap flex items-center h-16 bg-black text-white px-10`} style={{ background: "#090808", borderBottom: "1px solid hsla(0,0%,100%,.06)" }}>
        <div className={`text-x font-bold`}>QBRC-20</div>
        <div className={`tab-nav px-8`}>
            <Tabs variant="unstyled">
                <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="blue.500"
                    borderRadius="1px"
                />
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
            </Tabs>
        </div>
    </div>
}