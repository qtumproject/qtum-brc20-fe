import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    SkeletonText
} from '@chakra-ui/react'
import { IOrderItem, TOrderList } from '@/types';

interface IProps {
    dataList: TOrderList,
    isLoading: boolean,
}

export default function OrderTable({ dataList, isLoading }: IProps) {

    const renderData = () => dataList.map((data: IOrderItem) => {
        return (<Tr key={data.orderId}>
            <Td className='font-medium text-sm w-[300px]'>{data.orderId}</Td>
            <Td className='font-medium text-sm'>{data.tick}</Td>
            <Td className='font-medium text-sm'>{data.type}</Td>
            <Td className='font-medium text-sm'>{data.status}</Td>
            <Td className='text-sm'>
                {data.createTime}
            </Td>
            <Td className='text-sm'>
                {data.updateTime}
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
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>OrderId</Th>
                        <Th>Tick</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>CreateTime</Th>
                        <Th>UpdateTime</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        isLoading ? renderLoading() : renderList()
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}