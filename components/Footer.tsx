
import Image from 'next/image'
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <div className={`h-24 bg-[#E7E7E1] text-black dark:text-white dark:bg-black lg:flex hidden items-center justify-between px-[7.5rem] py-[1.875rem]`}>
                <div>
                    <Image className="block dark:hidden" src="/logo.svg" alt="logo" width={240} height={38} />
                    <Image className="hidden dark:block" src="/logo-d.png" alt="logo" width={240} height={38} />
                    <div>Contact us: QBRC20@qtum.info</div>
                </div>

                <div className="flex">
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://discord.com/invite/DCPGvUCms5">
                            <Image className="block dark:hidden" src="/img/discord.png" alt="discord" width={48} height={48} />
                            <Image className="hidden dark:block" src="/img/discord-d.png" alt="discord" width={48} height={48} />
                        </Link>
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://twitter.com/qtum">
                            <Image className="block dark:hidden" src="/img/x.png" alt="x" width={48} height={48} />
                            <Image className="hidden dark:block" src="/img/x-d.png" alt="x" width={48} height={48} />
                        </Link>
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center">
                        <Link href="https://coinmarketcap.com/community/profile/Qtum_Foundation/">
                            <Image className="block dark:hidden" src="/img/coinmarketcap.png" alt="coinmarketcap" width={48} height={48} />
                            <Image className="hidden dark:block" src="/img/coinmarketcap-d.png" alt="coinmarketcap" width={48} height={48} />
                        </Link>
                    </div>

                </div>
            </div>
            <div className='lg:hidden bg-[#E7E7E1] px-5 py-8  dark:text-white dark:bg-black flex items-center flex-col justify-center'>
                <div className='flex items-center flex-col'>
                    <Image className="block dark:hidden" src="/logo.svg" alt="logo" width={126} height={20} />
                    <Image className="hidden dark:block" src="/logo-d.png" alt="logo" width={126} height={20} />
                    <div className="mt-2">Contact us: QBRC20@qtum.info</div>
                </div>
                <div className="flex mt-8">
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://discord.com/invite/DCPGvUCms5">
                            <Image className="block dark:hidden" src="/img/discord.png" alt="discord" width={48} height={48} />
                            <Image className="hidden dark:block" src="/img/discord-d.png" alt="discord" width={48} height={48} />
                        </Link>
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Link href="https://twitter.com/qtum">
                            <Image className="block dark:hidden" src="/img/x.png" alt="x" width={48} height={48} />
                            <Image className="hidden dark:block" src="/img/x-d.png" alt="x" width={48} height={48} />
                        </Link>
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center">
                        <Link href="https://coinmarketcap.com/community/profile/Qtum_Foundation/">
                            <Image className="block dark:hidden" src="/img/coinmarketcap.png" alt="coinmarketcap" width={48} height={48} />
                            <Image className="hidden dark:block" src="/img/coinmarketcap-d.png" alt="coinmarketcap" width={48} height={48} />
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}