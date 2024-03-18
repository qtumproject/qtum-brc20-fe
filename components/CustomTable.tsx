import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Progress,
    SkeletonText
} from '@chakra-ui/react'
import Link from 'next/link';
import { IBrc20ListItem, TBrc20List } from '@/types';

interface IProps {
    dataList: TBrc20List,
    isLoading: boolean,
}

export default function CustomTable({ dataList, isLoading }: IProps) {

    const renderData = () => dataList.map((data: IBrc20ListItem) => {
        return (<Tr key={data.token_name}>
            <Td className='font-medium text-sm'>{data.token_name}</Td>
            <Td className='text-[#7f8596]'>{data.deploy_time}</Td>
            <Td className='text-sm'>
                {data.progress}
                <Progress height={0.5} value={Number(data.progress.slice(0, 5))} size='xs' colorScheme='brand' />
            </Td>
            <Td className='text-sm font-medium'>{data.holders || 0}</Td>
            <Td className='text-sm'>{data.mint_times || 0}</Td>
            <Td>
                {data.progress === '100.000%' ? '-' : <Link href={`/inscribe?type=Mint&tick=${data.token_name}`}>
                    <Button variant="brandPrimary" borderRadius='8px' size='xs' width='79px' height='32px' >Mint</Button>
                </Link>}

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
                        <Th>Token Name</Th>
                        <Th>Deploy Time</Th>
                        <Th>Progress</Th>
                        <Th>Holders</Th>
                        <Th>Mint Times</Th>
                        <Th>Operation</Th>
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