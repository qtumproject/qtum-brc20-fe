import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
} from '@chakra-ui/react'
import Link from 'next/link';
import { IBrc20ListItem, TBrc20List } from '@/types';

interface IProps {
    dataList: TBrc20List
}

export default function CustomTable({ dataList }: IProps) {
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
                    {dataList.map((data: IBrc20ListItem) => {
                        return (<Tr key={data.token_name}>
                            <Td>{data.token_name}</Td>
                            <Td>{data.deploy_time}</Td>
                            <Td>{data.progress}</Td>
                            <Td>{data.holders || 0}</Td>
                            <Td>{data.mint_times || 0}</Td>
                            <Td>
                                <Link href={{
                                    pathname: '/inscribe',
                                    query: {
                                        type: 'Mint',
                                        tick: data.token_name,
                                    }
                                }}>
                                    <Button variant="brandPrimary" size="sm">Mint</Button>
                                </Link>

                            </Td>
                        </Tr>)
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    )
}