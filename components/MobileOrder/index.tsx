
import { IOrderItem, TOrderList } from '@/types';
import {
    Skeleton,
    Divider,
    Link
} from '@chakra-ui/react'
import { useState, MouseEvent } from 'react';
import Image from 'next/image';
import { IOrderStatus } from '@/types'
import ListItem from './ListItem';
import {
    satsToQtum,
} from '@/utils';

interface IProps {
    dataList: TOrderList,
    isLoading: boolean,
}
export default function MobileList({ dataList, isLoading }: IProps) {

    const [mode, setMode] = useState('list'); // list | detail
    const [detailData, setDetailData] = useState<IOrderItem>({
        orderId: '',
        tick: '',
        quantity: '',
        type: 'mint',
        inscribeInfo: { p: '', op: '', tick: '', amt: '' },
        receiveAddress: '',
        inscriptionFees: 0,
        txinfos: [],
        status: '',
        createTime: '',
        updateTime: '',
    });

    const handleGoDetail = (e: MouseEvent, data: IOrderItem) => {
        e.preventDefault();
        setMode('detail');
        setDetailData(data);
    }

    const renderData = () => {
        if (mode === 'list') {
            return renderList();
        }
        return renderDetail();
    }

    const renderDetail = () => {
        return (<>
            <div className='text-lg	font-semibold h-[56px] relative flex items-center justify-center mb-4'>
                <Image className='absolute left-0' src='/back.svg' width={24} height={24} alt='back' onClick={() => setMode('list')}></Image>
                Order Details
            </div>
            <div className='px-1.5'>
                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Order ID</div>
                    <div className='text-sm leading-[18px] break-all whitespace-break-spaces text-right'>{detailData.orderId}</div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Quantity</div>
                    <div className='text-sm leading-[18px]'>{detailData.quantity}</div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Type</div>
                    <div className='text-sm leading-[18px]'>{detailData.type}</div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Create Time</div>
                    <div className='text-sm leading-[18px]'>{detailData.createTime}</div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Status</div>
                    {detailData.status === IOrderStatus.CLOSED ? <div className='font-medium	text-[#D2311B]'>{detailData.status}</div> : <div className='font-medium	text-[#2D73FF]'>{detailData.status}</div>}
                </div>
                <Divider />

                <div className='my-4'>
                    <pre className="leading-6 text-xs py-[16px] rounded-[12px] px-[16px] dark:bg-[#282A33] bg-[#F3F3F0] break-all whitespace-break-spaces flex justify-between">
                        {JSON.stringify(detailData.inscribeInfo)}
                        {
                            detailData.status === IOrderStatus.CLOSED ? <Image width={24} height={24} src="/failed.svg" alt="failed" /> : <Image width={24} height={24} src="/success.svg" alt="success" />
                        }
                    </pre>
                </div>

                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Receiving Address</div>
                    <div className='text-sm leading-[18px] break-all whitespace-break-spaces text-right'>{detailData.receiveAddress}</div>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="text-[#7F8596] text-sm leading-[18px]">Network Fee</div>
                    <div className='text-sm leading-[18px]'>{satsToQtum(detailData.inscriptionFees)} QTUM</div>
                </div>
                {
                    detailData.txinfos?.length ? <div>
                        <div className='mb-4 text-[#7F8596] text-sm'>Transaction Info</div>
                        {detailData.txinfos.map(item => (
                            <div className='text-sm mb-4' key={item.txid}>
                                <div className='font-medium'>{item.desp}</div>
                                <div>
                                    <Link isExternal color='brand.100' href={`https://testnet.qtum.info/tx/${item.txid}`}>
                                        {item.txid}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div> : null
                }
            </div>
        </>)
    }

    const renderList = () => {
        if (!dataList.length) return 'no data';
        return dataList.map((data) => <div key={data.orderId} className='mb-4'><ListItem data={data} onGoDetail={handleGoDetail}></ListItem></div>)
    }

    const renderLoading = () => {
        return <>
            <Skeleton mb='4' height='20px' />
            <Skeleton mb='4' height='20px' />
            <Skeleton mb='4' height='20px' />
        </>
    }


    return <>
        {isLoading ? renderLoading() : renderData()}
    </>





}