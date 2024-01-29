
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <NavBar></NavBar>
            <div style={{ background: "#090808", color: "white", paddingTop: "40px" }}>{children}</div >
            <Footer />
        </>
    )
}