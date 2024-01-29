
interface IProps {
    type: string,
    amount: number,
    focus: boolean,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export default function FeeType({ type, amount, focus, onClick }: IProps) {
    return <div className={`flex flex-col border px-6 py-2 cursor-pointer rounded ${focus ? 'border-amber-300' : 'border-cyan-50'} `} onClick={onClick}>
        <div className="mb-2 font-bold">{type}</div>
        <div><span className="font-bold text-lg text-amber-300 mr-1">{amount}</span>stas/vB</div>
    </div>
}