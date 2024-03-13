
import Image from 'next/image'
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <div className={`h-24 bg-[#E7E7E1] text-white flex items-center justify-between px-[7.5rem] py-[1.875rem]`}>
                <div>
                    <Image src="/logo.svg" alt="logo" width={240} height={38} />
                    <div className="text-black	">Contact us: QBRC20@qtum.info</div>
                </div>

                <div className="flex">
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://discord.com/invite/DCPGvUCms5">
                            <Image src="/img/discord.png" alt="discord" width={48} height={48} />
                        </Link>
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://twitter.com/qtum">
                            <Image src="/img/x.png" alt="x" width={48} height={48} />
                        </Link>
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://coinmarketcap.com/community/profile/Qtum_Foundation/">
                            <Image src="/img/coinmarketcap.png" alt="coinmarketcap" width={48} height={48} />
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}