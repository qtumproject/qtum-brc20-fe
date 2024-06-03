
import {
    Divider,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    useClipboard,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import store from 'store2';
import { Search2Icon } from '@chakra-ui/icons'
import BalanceTable from '@/components/BalanceTable'
import MobileBalanceList from '@/components/MobileBalanceList';
import { IBrc20BalanceListParams, IBrc20BalanceListItem } from '@/types';
import Image from 'next/image'

export default function MyQBRC20() {
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [dataList, setDataList] = useState<IBrc20BalanceListItem[] | []>([]);
    const [showList, setShowList] = useState<IBrc20BalanceListItem[] | []>([]);
    const toast = useToast();
    const { onCopy: onCopyAddress } = useClipboard(address);
    const getAddress = () => {
        const address = store.get('wallet_address');
        if (address) setAddress(address);
    }
    useEffect(() => {
        getAddress();
    }, [])

    const getData = async ({ address }: IBrc20BalanceListParams) => {
        try {
            const params: IBrc20BalanceListParams = {};
            if (address) {
                params.address = address;
            }
            setIsLoading(true);
            const { status: resStatus, data, statusText } = await axios.get('/api/v1/balances?chain_id=qtum', { params });
            setIsLoading(false);
            console.log('data', data)
            if (resStatus === 200) {
                const { code, data: resData, msg } = data || {};
                if (code === 0) {
                    const { address_ticker_balance_list = [] } = resData;
                    setDataList(address_ticker_balance_list);
                    setShowList(address_ticker_balance_list)

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

    const onAddressCopyClick = () => {
        onCopyAddress();
        toast({
            title: 'The address has been copied!',
            position: 'top',
            status: 'success',
            duration: 2000,
        });
    }

    const onQueryChange = () => {
        if (!tokenName) {
            setShowList(dataList);
            return;
        }
        const queryResList = dataList.filter((item) => item.token_name === tokenName)
        setShowList(queryResList)
    }

    useEffect(() => {
        getData({ address });
    }, [address])


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
                                placeholder='Search the token name'
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

                    <div className='w-full'>
                        <BalanceTable dataList={showList} isLoading={isLoading} />
                    </div>
                </div>
            </div>
            <div className={`lg:hidden flex flex-col items-center px-6 dark:text-white`}>
                <div className={`flex flex-col items-center py-[30px] px-2.5 bg-white dark:bg-black w-full rounded-[12px] shadow-lg`}>
                    <div>
                        <div className='flex justify-center mb-2'>
                            <Image src="/wallet-logo.svg" width={50} height={50} alt="logo"></Image>
                        </div>
                        <div className='text-center text-xl font-medium mb-3' >
                            {address.slice(0, 7) + '...' + address.slice(-6)}
                        </div>
                        <div className='text-center text-sm font-medium text-[#7F8596] flex justify-between'>
                            {address}
                            <Image src="/copy.svg" width={20} height={20} alt="copy" className='ml-3' onClick={onAddressCopyClick}></Image>
                        </div>
                    </div>
                    <Divider className="my-8" />
                    <div className='mb-6 w-full'>
                        <InputGroup>
                            <InputRightElement height='56px' className="cursor-pointer" onClick={onQueryChange}>
                                <Search2Icon />
                            </InputRightElement>
                            <Input
                                placeholder='Search the token name'
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
                    <div className='w-full'>
                        <MobileBalanceList dataList={showList} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </>
    )
}
