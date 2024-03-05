
import {
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react'
import { useState } from 'react';
import { Search2Icon } from '@chakra-ui/icons'
import RadioGroup from '@/components/RadioGroup'
import CustomTable from '@/components/CustomTable'
import Pagination from '@/components/Pagination';

const options = [
    'All',
    'Inprogress',
    'Completed'
]

export default function Indexer() {

    const [page, setPage] = useState(0);
    return (
        <div className={`flex flex-col items-center px-6`}>
            <div className={`font-bold mb-[40px] text-[40px] mt-[-40px]`}>Inscribe  QBRC20</div>
            <div className={`flex flex-col items-center py-10 px-8 bg-white w-[1024px] rounded-[12px] shadow-lg`}>
                <div className='w-[680px] mb-8'>
                    <InputGroup>
                        <InputRightElement pointerEvents='none' height='56px'>
                            <Search2Icon />
                        </InputRightElement>
                        <Input placeholder='Search BRC-20 token name' />
                    </InputGroup>
                </div>
                <div className='w-[680px] mb-8'>
                    <RadioGroup options={options} name="queryType" defaultValue='All' onChange={() => console.log()} />
                </div>

                <div className='w-full'>
                    <CustomTable />
                    <div className='mt-4'>
                        <Pagination
                            pageSize={10}
                            pageIndex={page}
                            setPageIndex={setPage}
                            totalItemsCount={100}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
