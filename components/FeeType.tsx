
import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react'
interface IProps {
    title: string,
    type: string,
    amount: number,
    focus: boolean,
    setValue?: Function,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export default function FeeType({ title, type = 'solid', setValue, amount, focus, onClick }: IProps) {
    return <div className={`flex flex-col items-center border-2 rounded-[12px] border-[#e7e7e1] px-6 py-2 cursor-pointer w-[218px] h-[79px] ${focus ? 'border-black' : 'border-[#e7e7e1]'} `} onClick={onClick}>
        <div className="mb-2 font-bold">{title}</div>
        <div className='flex'>
            {
                type === 'solid' ? <span>{amount}</span> : <span>
                    <NumberInput variant='flushed' value={amount} onChange={(value) => setValue?.(value)} focusBorderColor="#2D73FF" >
                        <NumberInputField h={6} pr={2} />
                    </NumberInput>
                </span>
            }
            <span>  sats/vB</span>
        </div>
    </div>
}