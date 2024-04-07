import { IOrderItem } from '@/types';

export default function ListItem({ data }: { data: IOrderItem }) {
    return (<div className="px-3 py-3 border border-[#E7E7E1] dark:border-[#494e5b80] rounded-xl">
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">OrderId</div>
            <div className='text-sm leading-[18px]'>{data.orderId}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Tick</div>
            <div className='text-sm leading-[18px]'>{data.tick}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Type</div>
            <div className='flex items-center text-sm leading-[18px]' >
                <div className='ml-1'>{data.type}</div>
            </div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Status</div>
            <div className='text-sm leading-[18px]'>{data.status}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">CreateTime</div>
            <div className='text-sm leading-[18px]'>{data.createTime}</div>
        </div>
        <div className="flex justify-between items-center">
            <div className="text-[#7F8596] text-sm leading-[18px]">UpdateTime</div>
            <div className='text-sm leading-[18px]'>
                {data.updateTime}
            </div>
        </div>
    </div>)
}