

import {
    Button,
    Progress,
    Link,
} from '@chakra-ui/react'
import { IBrc20ListItem } from '@/types';

export default function ListItem({ data }: { data: IBrc20ListItem }) {
    return (<div className="px-6 py-3 border border-[#E7E7E1] dark:border-[#494e5b80] rounded-xl">
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Token name</div>
            <div className='text-sm leading-[18px]'>{data.token_name}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Deploy Time</div>
            <div className='text-sm leading-[18px]'>{data.deploy_time}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Progress</div>
            <div className='flex items-center text-sm leading-[18px]' >
                <div className='w-[82px]'>
                    <Progress height={0.5} value={Number(data.progress.slice(0, 5))} size='xs' colorScheme='brand' />
                </div>
                <div className='ml-1'>{data.progress}</div>
            </div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Holders</div>
            <div className='text-sm leading-[18px]'>{data.holders}</div>
        </div>
        <div className="flex justify-between mb-4">
            <div className="text-[#7F8596] text-sm leading-[18px]">Mint Times</div>
            <div className='text-sm leading-[18px]'>{data.mint_times}</div>
        </div>
        <div className="flex justify-between items-center">
            <div className="text-[#7F8596] text-sm leading-[18px]">Operation</div>
            <div className='text-sm leading-[18px]'>
                <Link href={`/inscribe?type=Mint&tick=${data.token_name}`}>
                    <Button colorScheme="brand" borderRadius='8px' size='xs' width='79px' height='32px' isDisabled={data.progress === '100.000%'}>Mint</Button>
                </Link>
            </div>
        </div>
    </div>)
}