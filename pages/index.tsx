
import Image from 'next/image'

export default function Home() {
    return (
        <div className={`flex min-h-screen flex-col mx-auto	w-[1200px]`}>

            <div className="flex mb-[80px]">
                <div className="relative inline-block">
                    <Image className="absolute top-[80px] left-[-105px]" src="/banner-l.png" alt="banner-left" width={230} height={230} />
                    <Image width={680} height={880} src="/home-banner.png" alt="banner" />
                    <Image className="absolute top-[267px] right-[-74px]" src="/banner-r.png" alt="banner-right" width={148} height={148} />
                </div>
                <div className="relative ml-[90px] mt-[107px] font-[DMsans] flex-[0_0_430px]">
                    <p className="text-[68px] font-[Outfit] font-bold leading-[86px]">What is</p>
                    <p className="text-[68px] font-[Outfit] font-bold leading-[86px]">QBRC20</p>
                    <p className="mb-[10px] mt-[50px] font-semibold text-lg	leading-[24px]">Based on the QTUM blockchain</p>
                    <p className="mb-[30px] text-sm leading-[18px]">The Ordinals protocol is built on the QTUM blockchain, utilizing its infrastructure and capabilities.</p>
                    <p className="mb-[10px] font-semibold text-lg leading-[24px]">Supports Inscription, Transaction, Deployment, and Viewing </p>
                    <p className="mb-[30px] text-sm leading-[18px]">The protocol provides support for various operations, including QBRC20 Token inscription, transfer, deployment, and viewing.</p>
                    <p className="mb-[10px] font-semibold text-lg leading-[24px]">Official verification </p>
                    <p className="mb-[30px] text-sm leading-[18px]">Our protocol has obtained official certification, ensuring compliance with the standards and specifications of the QTUM ecosystem. This verification guarantees its stability and reliability when interacting with the QTUM network.</p>
                    <p className="mb-[10px] font-semibold text-lg leading-[24px]">Efficiency & Security</p>
                    <p className="text-sm leading-[18px]">The Ordinals protocol ensures efficient operations and enhanced system performance while prioritizing user asset security through advanced encryption techniques and robust security measures.</p>
                    <Image className="absolute left-[272px] top-[64px]" src="/banner-q.png" alt="banner-q.png" width={66} height={100} />
                    <Image className="absolute right-0 bottom-[-42px]" src="/banner-c.png" alt="banner-c" width={120} height={120} />
                </div>
            </div>
        </div>
    )
}
