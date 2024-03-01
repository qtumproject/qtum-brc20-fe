
import PlaceHolder from "@/components/PlaceHolder";

export default function Home() {
    return (
        <div className={`flex min-h-screen flex-col`}>

            <div className="px-[120px] flex mb-[80px]">
                <div className="relative inline-block">
                    <img className="absolute top-[80px] left-[-105px] w-[230px] h-[230px]" src="./banner-l.png" alt="banner-left" />
                    <img className="w-[680px] h-[880px]" src="./home-banner.png" alt="banner" />
                    <img className="absolute top-[267px] right-[-74px] w-[148px] h-[148px]" src="./banner-r.png" alt="banner-right" />
                </div>
                <div className="relative ml-[165px] mt-[267px]">
                    <p className="text-[68px] ">What's</p>
                    <p className="text-[68px] ">QBRC20</p>
                    <p className="mb-[30px]">Explanation 01-Some alternative descriptive text</p>
                    <p className="mb-[30px]">Explanation 01-Some alternative descriptive text</p>
                    <p>Explanation 01-Some alternative descriptive text</p>
                    <img className="absolute left-[260px] top-[90px] w-[66px] h-[100px]" src="./banner-q.png" alt="banner-q.png" />
                    <img className="absolute right-0 bottom-[75px] w-[120px] h-[120px]" src="./banner-c.png" alt="banner-c" />
                </div>
            </div>

            <div className="px-[120px] py-[80px]">
                <h1 className="text-[68px] mb-[40px]">Parteners.</h1>
                <div className="flex-grow border-t border-gray-400"></div>

            </div>

            <PlaceHolder text="Home Page is under heavy development" />
        </div>
    )
}
