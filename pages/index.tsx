export default function Home() {
    return (
        <div className={`flex min-h-screen flex-col mx-auto	w-[1200px]`}>

            <div className="flex mb-[80px]">
                <div className="relative inline-block">
                    <img className="absolute top-[80px] left-[-105px] w-[230px] h-[230px]" src="./banner-l.png" alt="banner-left" />
                    <img width={680} height={880} src="./home-banner.png" alt="banner" />
                    <img className="absolute top-[267px] right-[-74px] w-[148px] h-[148px]" src="./banner-r.png" alt="banner-right" />
                </div>
                <div className="relative ml-[150px] mt-[267px] font-[DMsans]">
                    <p className="text-[68px] font-[Outfit] font-bold">What is</p>
                    <p className="text-[68px] font-[Outfit] font-bold">QBRC20</p>
                    <p className="mb-[30px] mt-[50px]">Explanation 01-Some alternative descriptive text</p>
                    <p className="mb-[30px]">Explanation 01-Some alternative descriptive text</p>
                    <p>Explanation 01-Some alternative descriptive text</p>
                    <img className="absolute left-[272px] top-[90px] w-[66px] h-[100px]" src="./banner-q.png" alt="banner-q.png" />
                    <img className="absolute right-0 bottom-[75px] w-[120px] h-[120px]" src="./banner-c.png" alt="banner-c" />
                </div>
            </div>
        </div>
    )
}
