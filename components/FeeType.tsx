
interface IProps {
    type: string,
    amount: number,
    focus: boolean,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export default function FeeType({ type, amount, focus, onClick }: IProps) {
    return <div className={`flex flex-col items-center border rounded-[12px] border-[#e7e7e1] px-6 py-2 cursor-pointer w-[218px] h-[79px] ${focus ? 'border-[#000]' : 'border-[#e7e7e1]'} `} onClick={onClick}>
        <div className="mb-2 font-bold">{type}</div>
        <div>{amount} sats/vB</div>
    </div>
}