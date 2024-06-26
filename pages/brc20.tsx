
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
import MobileList from '@/components/MobileList';
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
        total_page: 1,
    });

    const [isLoading, setIsLoading] = useState(false);

    const [tokenName, setTokenName] = useState('');

    const [status, setStatus] = useState<TBrc20StatusParams>('');

    const [dataList, setDataList] = useState<IBrc20ListItem[] | []>([]);

    const setCurrPage = (page: number) => {
        setPageInfo({
            ...pageInfo,
            page,
        })
        getData({ status: status, tick: '', page: page })
    }
    const getData = async ({
        status,
        tick,
        page
    }: IBrc20ListParams) => {
        try {
            const params: IBrc20ListParams = {};
            if (status) {
                params.status = status
            }
            if (tick) {
                params.tick = tick;
            }
            if (page) {
                params.page = page;
            }
            setIsLoading(true);
            const { status: resStatus, data, statusText } = await axios.get('/api/v1/tickers?chain_id=qtum', { params });
            setIsLoading(false);
            if (resStatus === 200) {
                const { code, data: resData, msg } = data || {};
                if (code === 0) {
                    const { pagination_info, ticker_list = [] } = resData;
                    setPageInfo({
                        page: pagination_info.page,
                        total: pagination_info.total,
                        total_page: pagination_info.total_page,
                    });
                    setDataList(ticker_list)

                } else {
                    console.error(msg);
                }
            } else {
                console.error(statusText);
            }
        } catch (e) {
            setIsLoading(false);
        }

    }

    const onStatusChange = (status: TBrc20Status) => {
        const paramsMap = {
            'Inprogress': 'in-progress',
            'Completed': 'completed',
            'All': '',
        }
        const statusInParams = paramsMap[status] as TBrc20StatusParams;
        setStatus(statusInParams)
        const params = { status: statusInParams };
        getData(params);

    }

    const onQueryChange = () => {
        getData({ tick: tokenName.replace(/\s*/g, "") })
    }

    useEffect(() => {
        getData({ status: '', page: pageInfo.page });
    }, [])


    return (
        <>
            <div className={`lg:flex hidden flex-col items-center px-6 dark:text-white`}>
                <div className={`mb-[40px] text-[40px] dark:text-white mt-[-40px] font-[Outfit] font-medium`}>QBRC20 List</div>
                <div className={`flex flex-col items-center py-10 px-8 bg-white dark:bg-black w-[1024px] rounded-[12px] shadow-lg`}>
                    <div className='w-[680px] mb-8'>
                        <InputGroup>
                            <InputRightElement height='56px' className="cursor-pointer" onClick={onQueryChange}>
                                <Search2Icon />
                            </InputRightElement>
                            <Input
                                placeholder='Search qbrc20 token name'
                                value={tokenName}
                                focusBorderColor="#2D73FF"
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
                        <CustomTable dataList={dataList} isLoading={isLoading} />
                        {
                            pageInfo.total > 0 && pageInfo.total_page > 1 && <div className='mt-4'>
                                <Pagination
                                    pageSize={10}
                                    pageIndex={pageInfo.page - 1}
                                    setPageIndex={(page: number) => setCurrPage(page + 1)}
                                    totalItemsCount={pageInfo.total}
                                />
                            </div>
                        }

                    </div>
                </div>
            </div>
            <div className={`lg:hidden flex flex-col items-center px-6 dark:text-white`}>
                <div className={`mb-4 text-[30px] mt-[-20px] font-[Outfit] font-medium`}>QBRC20 List</div>
                <div className={`flex flex-col items-center py-[30px] px-2.5 bg-white dark:bg-black w-full rounded-[12px] shadow-lg`}>
                    <div className='mb-6 w-full'>
                        <InputGroup>
                            <InputRightElement height='56px' className="cursor-pointer" onClick={onQueryChange}>
                                <Search2Icon />
                            </InputRightElement>
                            <Input
                                placeholder='Search qbrc20 token name'
                                value={tokenName}
                                focusBorderColor="#2D73FF"
                                onChange={(e) => setTokenName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        onQueryChange();
                                    }
                                }} />
                        </InputGroup>
                    </div>
                    <div className='w-full mb-6'>
                        <RadioGroup options={options} name="queryType" defaultValue='All' onChange={onStatusChange} />
                    </div>

                    <div className='w-full'>
                        <MobileList dataList={dataList} isLoading={isLoading} />
                        {
                            pageInfo.total > 0 && pageInfo.total_page > 1 && <div className='mt-4'>
                                <Pagination
                                    pageSize={10}
                                    pageIndex={pageInfo.page - 1}
                                    setPageIndex={(page: number) => setCurrPage(page + 1)}
                                    totalItemsCount={pageInfo.total}
                                />
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
