import { useEffect } from "react";
import useState from 'react-usestateref';
import { useRouter } from 'next/router'
import qs from 'qs';
import { useToast } from "@chakra-ui/react";
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';
import RadioGroup from "@/components/RadioGroup";
import OrderTable from "@/components/OrderTable";
import MobileOrder from "@/components/MobileOrder";
import {
    getQtumFee,
    setLocalOrderList,
    getLocalOrderList
} from '@/utils';
import { IOrderItem, IOrderStatus, IQtumFeeRates } from '@/types'

export default function Inscribe() {
    const toast = useToast();
    const [value, setValue] = useState('Mint');
    const [orderList, setOrderList, orderListRef] = useState<IOrderItem[] | []>([])
    const [defaultTick, setDefaultTick] = useState('');
    const [feeRates, setFeeRates] = useState<IQtumFeeRates>({
        custom: '400',
        economy: '400',
        normal: '400'
    });
    const router = useRouter();

    const syncDataList = async () => {
        const dataList = await getLocalOrderList();
        dataList.forEach((item: IOrderItem) => {
            if (item.status !== IOrderStatus.SUCCESS) {
                item.status = IOrderStatus.CLOSED;
            }
        })
        setOrderList(dataList);
    }

    useEffect(() => {
        syncDataList();
    }, [])

    const setRouterParams = () => {
        const { tick, type } = qs.parse(router.asPath.slice(10));
        if (tick && type) {
            if (['Mint', 'Deploy'].includes(type)) {
                setValue(type as string);
                setDefaultTick(tick as string);
            }
        }
    }

    const setQtumFee = async () => {
        try {
            const res = await getQtumFee();
            let feeRates = {
                custom: '',
                economy: '',
                normal: ''
            } as IQtumFeeRates;
            const qtum2satvb = (count: number) => String((count * Math.pow(10, 5)).toFixed(3));
            if (res && res.length) {
                res.forEach(item => {
                    if (item.blocks === 2) {
                        feeRates.custom = qtum2satvb(item.feeRate);
                    }
                    if (item.blocks === 4) {
                        feeRates.normal = qtum2satvb(item.feeRate);
                    }
                    if (item.blocks === 6) {
                        feeRates.economy = qtum2satvb(item.feeRate);
                    }
                })
            }
            setFeeRates(feeRates);
        } catch (e: any) {
            toast({
                title: `[GetQtumFee] ${e.message}`,
                position: 'top',
                status: 'error',
                duration: 2000,
            })
        }

    }

    const handleUpdateOrderList = (orderItem: IOrderItem, opType: 'add' | 'update') => {
        const dataList = orderListRef.current.slice();
        if (opType === 'add') {
            dataList.unshift(orderItem)
        } else {
            dataList.forEach((item) => {
                if (item.orderId === orderItem.orderId) {
                    item = orderItem;
                }
            });
        }
        setOrderList(dataList);
        setLocalOrderList(dataList);
    }

    useEffect(() => {
        setRouterParams();
        setQtumFee();
    }, [])

    const renderOrderList = () => {
        return (
            <>
                <div className={`flex-col items-center lg:flex hidden dark:text-white mt-[40px]`}>
                    <div className={`flex flex-col items-center pt-[30px] pb-10 px-6 dark:bg-black bg-white w-[1024px] rounded-[12px] shadow-lg`}>
                        <div className={`mb-[30px] text-[40px] font-[Outfit] font-medium`}>My Orders</div>
                        <div>
                            <OrderTable dataList={orderList} isLoading={false} />
                        </div>
                    </div>
                </div>
                <div className="lg:hidden flex flex-col items-center px-4 mt-4">
                    <div className={`flex flex-col items-center py-[30px] px-2.5 bg-white dark:bg-black rounded-[12px] shadow-lg w-full`}>
                        <div className={`mb-[30px] text-[30px] font-[Outfit] font-medium`}>My Orders</div>
                        <div className="w-full">
                            <MobileOrder dataList={orderList} isLoading={false} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className={`flex-col items-center lg:flex hidden dark:text-white`}>
                <div className={`mb-[40px] text-[40px] mt-[-40px] font-[Outfit] font-medium`}>Inscribe  QBRC20</div>
                <div className={`flex flex-col items-center py-10 px-8 dark:bg-black bg-white w-[1024px] rounded-[12px] shadow-lg`}>
                    <div className='w-[680px]'>
                        <div className='mb-4 text-center'>
                            <RadioGroup options={['Mint', 'Deploy']} defaultValue='Mint' onChange={setValue} name='opType' />
                        </div>

                        {
                            value === "Mint" && <Mint defaultTick={defaultTick} feeRates={feeRates} updateOrder={handleUpdateOrderList} />
                        }

                        {
                            value === "Deploy" && <Deploy feeRates={feeRates} updateOrder={handleUpdateOrderList} />
                        }
                    </div>
                </div>
            </div>
            <div className="lg:hidden flex flex-col items-center px-4">
                <div className={`mb-4 text-[30px] mt-[-20px] font-[Outfit] font-medium`}>Inscribe  QBRC20</div>
                <div className={`flex flex-col items-center py-[30px] px-2.5 bg-white dark:bg-black rounded-[12px] shadow-lg w-full`}>
                    <div className='w-full'>
                        <div className='mb-8 text-center'>
                            <RadioGroup options={['Mint', 'Deploy']} defaultValue='Mint' onChange={setValue} name='opType' />
                        </div>

                        {
                            value === "Mint" && <Mint defaultTick={defaultTick} feeRates={feeRates} updateOrder={handleUpdateOrderList} />
                        }

                        {
                            value === "Deploy" && <Deploy feeRates={feeRates} updateOrder={handleUpdateOrderList} />
                        }
                    </div>
                </div>
            </div>
            {
                orderList.length ? renderOrderList() : null
            }
        </>

    )
}
