
export default function Footer() {
    return (
        <>
            <div className={`h-24 bg-[#E7E7E1] text-white flex items-center justify-between px-[7.5rem] py-[1.875rem]`}>
                <div>
                    <img src="./logo.svg" alt="logo" />
                    <div className="text-black	">Contact us: QBRC20@qtum.info</div>
                </div>

                <div className="flex">
                    <div className="rounded-full bg-black h-12 w-12 flex justify-center items-center mr-1.5">1</div>
                    <div className="rounded-full bg-black h-12 w-12 flex justify-center items-center mr-1.5">2</div>
                    <div className="rounded-full bg-black h-12 w-12 flex justify-center items-center mr-1.5">3</div>
                    <div className="rounded-full bg-black h-12 w-12 flex justify-center items-center mr-1.5">4</div>
                    <div className="rounded-full bg-black h-12 w-12 flex justify-center items-center">5</div>
                </div>
            </div>
        </>
    )
}