
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
                <meta content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
                <script src="lib/debug/index.js" defer></script>
            </Head>
            <div className='hidden lg:block min-w-[1200px] overflow-auto'>
                <NavBar></NavBar>
                <div className='bg-[#F7F7F0] dark:bg-[#0F0F11] pt-[80px] min-h-[calc(100vh_-_185px)] pb-20'>{children}</div >
                <Footer />
            </div>
            <div className='block lg:hidden overflow-hidden'>
                <NavBar></NavBar>
                <div className='bg-[#F7F7F0] dark:bg-[#0F0F11] pt-[36px] min-h-[calc(100vh_-_185px)] pb-8'>{children}</div >
                <Footer />
            </div>

        </>
    )
}