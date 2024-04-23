
import { TBrc20BalanceList } from '@/types';
import {
    Skeleton
} from '@chakra-ui/react'
import ListItem from './ListItem';
interface IProps {
    dataList: TBrc20BalanceList,
    isLoading: boolean,
}
export default function MobileBalanceList({ dataList, isLoading }: IProps) {


    const renderData = () => {
        if (!dataList.length) return <div className='text-center mt-4'>No data</div>;
        return dataList.map((data) => <div key={data.token_name} className='mb-4'><ListItem data={data}></ListItem></div>)
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