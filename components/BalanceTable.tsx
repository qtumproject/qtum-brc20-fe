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
import { IBrc20BalanceListItem, TBrc20BalanceList } from '@/types';

interface IProps {
    dataList: TBrc20BalanceList,
    isLoading: boolean,
}

export default function BalanceTable({ dataList, isLoading }: IProps) {

    const renderData = () => dataList.map((data: IBrc20BalanceListItem) => {
        return (<Tr key={data.token_name}>
            <Td className='font-medium text-sm'>{data.wallet_address}</Td>
            <Td className='font-medium text-sm'>{data.token_name}</Td>
            <Td className='text-sm font-medium'>{data.available || 0}</Td>
            <Td className='text-sm font-medium'>{data.balance || 0}</Td>
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
                </Tr>
            </>
        )
    }

    const renderList = () => {
        if (dataList.length) {
            return renderData();
        }
    }

    const renderPlaceholder = () => {
        return <div className='h-[100px] flex items-center justify-center'>
            No Data
        </div>
    }
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th>Token Name</Th>
                        <Th>Available</Th>
                        <Th>balance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        isLoading ? renderLoading() : renderList()
                    }
                </Tbody>
            </Table>
            {
                !dataList.length && !isLoading ? renderPlaceholder() : null
            }
        </TableContainer>
    )
}