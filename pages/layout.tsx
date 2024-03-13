
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
            <div className='bg-[#F7F7F0] pt-[80px] min-h-[calc(100vh_-_185px)] pb-20'>{children}</div >
            <Footer />
        </>
    )
}