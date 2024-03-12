
import Image from 'next/image'

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
                        <Image src="/img/discord.png" alt="discord" width={48} height={48} />
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Image src="/img/telegram.png" alt="telegram" width={48} height={48} />
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Image src="/img/x.png" alt="x" width={48} height={48} />
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Image src="/img/youtube.png" alt="youtube" width={48} height={48} />
                    </div>
                    <div className="rounded-full h-12 w-12 flex justify-center items-center mr-6">
                        <Image src="/img/medium.png" alt="medium" width={48} height={48} />
                    </div>

                </div>
            </div>
        </>
    )
}