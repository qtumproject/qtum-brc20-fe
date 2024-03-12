
import {
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import axios from 'axios'
import { Search2Icon } from '@chakra-ui/icons'
import RadioGroup from '@/components/RadioGroup'
import CustomTable from '@/components/CustomTable'
import Pagination from '@/components/Pagination';
import { TBrc20Status, TBrc20StatusParams, IBrc20ListParams, IBrc20ListItem } from '@/types';


const options = [
    'All',
    'Inprogress',
    'Completed'
]

export default function Indexer() {

    const [pageInfo, setPageInfo] = useState({
        page: 1,
        total: 1,
    });

    const [tokenName, setTokenName] = useState('');

    const [dataList, setDataList] = useState<[IBrc20ListItem] | []>([]);

    const setCurrPage = (page: number) => {
        setPageInfo({
            ...pageInfo,
            page,
        })
    }
    const getData = async ({
        status,
        tick,
    }: IBrc20ListParams) => {
        try {
            const params: IBrc20ListParams = { status };
            if (tick) {
                params.tick = tick;
            }
            const { status: resStatus, data, statusText } = await axios.get('/api/v1/getCollectionList?chain_id=qtum', { params });
            if (resStatus === 200) {
                const { code, data: resData, msg } = data || {};
                if (code === 0) {
                    const { pagination_info, collection_list = [] } = resData;
                    setPageInfo({
                        page: pagination_info.page,
                        total: pagination_info.total,
                    });
                    setDataList(collection_list)

                } else {
                    console.error(msg);
                }
            } else {
                console.error(statusText);
            }
        } catch (e) {

        }

    }

    const onStatusChange = (status: TBrc20Status) => {
        const paramsMap = {
            'Inprogress': 'in-progress',
            'Completed': 'completed',
            'All': '',
        }
        const params = {
            status: paramsMap[status] as TBrc20StatusParams,
        };
        getData(params);

    }

    const onQueryChange = () => {
        getData({ tick: tokenName })
    }

    useEffect(() => {
        getData({ status: '' });
    }, [])


    return (
        <div className={`flex flex-col items-center px-6`}>
            <div className={`mb-[40px] text-[40px] mt-[-40px] font-[Outfit] font-medium`}>QBRC20 List</div>
            <div className={`flex flex-col items-center py-10 px-8 bg-white w-[1024px] rounded-[12px] shadow-lg`}>
                <div className='w-[680px] mb-8'>
                    <InputGroup>
                        <InputRightElement height='56px' className="cursor-pointer" onClick={onQueryChange}>
                            <Search2Icon />
                        </InputRightElement>
                        <Input
                            placeholder='Search BRC-20 token name'
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    onQueryChange();
                                }
                            }} />
                    </InputGroup>
                </div>
                <div className='w-[680px] mb-8'>
                    <RadioGroup options={options} name="queryType" defaultValue='All' onChange={onStatusChange} />
                </div>

                <div className='w-full'>
                    <CustomTable dataList={dataList} />
                    <div className='mt-4'>
                        <Pagination
                            pageSize={10}
                            pageIndex={pageInfo.page - 1}
                            setPageIndex={(page: number) => setCurrPage(page + 1)}
                            totalItemsCount={pageInfo.total}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
