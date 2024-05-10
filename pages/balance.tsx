
import {
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import axios from 'axios'
import { Search2Icon } from '@chakra-ui/icons'
import BalanceTable from '@/components/BalanceTable'
import MobileBalanceList from '@/components/MobileBalanceList';
import { IBrc20BalanceListParams, IBrc20BalanceListItem } from '@/types';

export default function Indexer() {

    const [isLoading, setIsLoading] = useState(false);
    const [address, setTokenName] = useState('');
    const [dataList, setDataList] = useState<IBrc20BalanceListItem[] | []>([]);

    const getData = async ({ address }: IBrc20BalanceListParams) => {
        try {
            const params: IBrc20BalanceListParams = {};
            if (address) {
                params.address = address;
            }
            setIsLoading(true);
            const { status: resStatus, data, statusText } = await axios.get('/api/v1/balances?chain_id=qtum', { params });
            setIsLoading(false);
            if (resStatus === 200) {
                const { code, data: resData, msg } = data || {};
                if (code === 0) {
                    const { address_ticker_balance_list = [] } = resData;
                    setDataList(address_ticker_balance_list)

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

    const onQueryChange = () => {
        getData({ address: address.replace(/\s*/g, "") })
    }

    useEffect(() => {
        getData({});
    }, [])


    return (
        <>
            <div className={`lg:flex hidden flex-col items-center px-6 dark:text-white`}>
                <div className={`mb-[40px] text-[40px] dark:text-white mt-[-40px] font-[Outfit] font-medium`}>QBRC20 Balance List</div>
                <div className={`flex flex-col items-center py-10 px-8 bg-white dark:bg-black w-[1024px] rounded-[12px] shadow-lg`}>
                    <div className='w-[680px] mb-8'>
                        <InputGroup>
                            <InputRightElement height='56px' className="cursor-pointer" onClick={onQueryChange}>
                                <Search2Icon />
                            </InputRightElement>
                            <Input
                                placeholder='Search the qbrc20 balance of the address'
                                value={address}
                                onChange={(e) => setTokenName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        onQueryChange();
                                    }
                                }} />
                        </InputGroup>
                    </div>

                    <div className='w-full'>
                        <BalanceTable dataList={dataList} isLoading={isLoading} />
                    </div>
                </div>
            </div>
            <div className={`lg:hidden flex flex-col items-center px-6 dark:text-white`}>
                <div className={`mb-4 text-[30px] mt-[-20px] font-[Outfit] font-medium`}>QBRC20 Balance List</div>
                <div className={`flex flex-col items-center py-[30px] px-2.5 bg-white dark:bg-black w-full rounded-[12px] shadow-lg`}>
                    <div className='mb-6 w-full'>
                        <InputGroup>
                            <InputRightElement height='56px' className="cursor-pointer" onClick={onQueryChange}>
                                <Search2Icon />
                            </InputRightElement>
                            <Input
                                placeholder='Search the qbrc20 balance of the address'
                                value={address}
                                onChange={(e) => setTokenName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        onQueryChange();
                                    }
                                }} />
                        </InputGroup>
                    </div>

                    <div className='w-full'>
                        <MobileBalanceList dataList={dataList} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </>
    )
}
