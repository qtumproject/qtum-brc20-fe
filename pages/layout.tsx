
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
            </Head>
            <NavBar></NavBar>
            <div style={{ background: "#090808", color: "white", paddingTop: "40px" }}>{children}</div >
            <Footer />
        </>
    )
}