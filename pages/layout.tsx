
import React from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Head>
                <title>QBRC20</title>
                <meta property="og:title" content="QBRC20" key="title" />
                <script src="lib/indexeddb.js" defer></script>
                <script src="lib/wif.js" defer></script>
                <script src="lib/buffer.6.0.3.js" defer></script>
                <script src="lib/tapscript.1.2.7.js" defer></script>
                <script src="lib/crypto-utils.1.5.11.js" defer></script>
                <script src="lib/bech32.2.0.0.js" defer></script>
                <script src="lib/qrcode.js" defer></script>
            </Head>
            <NavBar></NavBar>
            <div style={{ background: "#090808", color: "white", paddingTop: "40px" }}>{children}</div >
            <Footer />
        </>
    )
}