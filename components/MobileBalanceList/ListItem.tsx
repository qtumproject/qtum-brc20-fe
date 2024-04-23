import { IBrc20BalanceListItem } from '@/types';

export default function ListItem({ data }: { data: IBrc20BalanceListItem }) {
    return (<div className="px-6 py-3 border border-[#E7E7E1] dark:border-[#494e5b80] rounded-xl">
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Address</div>
            <div className='text-sm leading-[18px] overflow-hidden pl-4'>{data.wallet_address}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Token name</div>
            <div className='text-sm leading-[18px]'>{data.token_name}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Available</div>
            <div className='text-sm leading-[18px]'>{data.available}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Balance</div>
            <div className='text-sm leading-[18px]'>{data.balance}</div>
        </div>
    </div>)
}