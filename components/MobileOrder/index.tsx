
import { TOrderList } from '@/types';
import {
    Skeleton
} from '@chakra-ui/react'
import ListItem from './ListItem';
interface IProps {
    dataList: TOrderList,
    isLoading: boolean,
}
export default function MobileList({ dataList, isLoading }: IProps) {


    const renderData = () => {
        if (!dataList.length) return 'no data';
        return dataList.map((data) => <div key={data.orderId} className='mb-4'><ListItem data={data}></ListItem></div>)
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