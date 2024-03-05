import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
} from '@chakra-ui/react'

export default function CustomTable() {
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
                    <Tr>
                        <Td>Ordi</Td>
                        <Td>2023/11/24 12:34:08</Td>
                        <Td>100%</Td>
                        <Td>48,273</Td>
                        <Td>563,863</Td>
                        <Td>
                            <Button variant="brandPrimary" size="sm">Mint</Button>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Meme</Td>
                        <Td>2023/11/24 12:34:08</Td>
                        <Td>100%</Td>
                        <Td>48,273</Td>
                        <Td>563,863</Td>
                        <Td>
                            <Button variant="brandPrimary" size="sm">Mint</Button>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Punk</Td>
                        <Td>2023/11/24 12:34:08</Td>
                        <Td>100%</Td>
                        <Td>48,273</Td>
                        <Td>563,863</Td>
                        <Td>
                            <Button variant="brandPrimary" size="sm">Mint</Button>
                        </Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Td>Ordi</Td>
                        <Td>2023/11/24 12:34:08</Td>
                        <Td>100%</Td>
                        <Td>48,273</Td>
                        <Td>563,863</Td>
                        <Td>
                            <Button variant="brandPrimary" size="sm">Mint</Button>
                        </Td>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}