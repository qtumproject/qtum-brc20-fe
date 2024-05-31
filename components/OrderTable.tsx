import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    SkeletonText,
    Link
} from '@chakra-ui/react';
import { MouseEvent, useState } from 'react';
import { IOrderItem, TOrderList } from '@/types';
import OrderDetailModal from './OrderDetailModal';
interface IProps {
    dataList: TOrderList,
    isLoading: boolean,
}

export default function OrderTable({ dataList, isLoading }: IProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<IOrderItem>({
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

    const handleOrderDetailShow = (e: MouseEvent, orderDetail: IOrderItem) => {
        e.preventDefault();
        setIsOpen(true);
        setCurrentOrder(orderDetail);

    }

    const renderData = () => dataList.map((data: IOrderItem) => {
        return (<Tr key={data.orderId}>
            <Td className='font-medium text-sm w-[300px]'>
                <Link color='brand.100' href="/" onClick={(e) => handleOrderDetailShow(e, data)}>
                    {data.orderId}
                </Link>
            </Td>
            <Td className='font-medium text-sm'>{data.tick}</Td>
            <Td className='font-medium text-sm'>{data.quantity}</Td>
            <Td className='font-medium text-sm'>{data.type}</Td>
            <Td className='font-medium text-sm'>{data.status}</Td>
            <Td className='text-sm'>
                {data.createTime}
            </Td>
        </Tr>)
    });

    const renderLoading = () => {
        return (
            <>
                <Tr>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                </Tr>
                <Tr>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                </Tr>
                <Tr>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                    <Td>
                        <SkeletonText noOfLines={1} spacing='1' skeletonHeight='4' />
                    </Td>
                </Tr>
            </>
        )
    }

    const renderList = () => {
        if (dataList.length) {
            return renderData();
        } else {
            return renderPlaceholder();
        }
    }

    const renderPlaceholder = () => {
        return <Tr><Td></Td><Td></Td><Td></Td><Td>No Data</Td><Td></Td><Td></Td></Tr>
    }
    return (
        <>
            <TableContainer className='w-[976px]'>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>OrderId</Th>
                            <Th>Tick</Th>
                            <Th>Quantity</Th>
                            <Th>Type</Th>
                            <Th>Status</Th>
                            <Th>Create Time</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            isLoading ? renderLoading() : renderList()
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            <OrderDetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} orderDetail={currentOrder} />
        </>
    )
}