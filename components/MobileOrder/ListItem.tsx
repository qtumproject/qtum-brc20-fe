import { IOrderItem } from '@/types';
import {
    Link
} from '@chakra-ui/react';

export default function ListItem({ data, onGoDetail }: { data: IOrderItem, onGoDetail: (data: IOrderItem) => void }) {
    return (<div className="px-3 py-3 border border-[#E7E7E1] dark:border-[#494e5b80] rounded-xl">
        <div className="flex justify-between mb-4 text-sm">
            <div className="text-[#7F8596] leading-[18px]">Order ID</div>
            <Link color='brand.100' href="javascript:;" onClick={() => onGoDetail(data)}>
                {data.orderId}
            </Link>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Tick</div>
            <div className='text-sm leading-[18px]'>{data.tick}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Quantity</div>
            <div className='text-sm leading-[18px]'>{data.quantity}</div>
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
    </div>)
}