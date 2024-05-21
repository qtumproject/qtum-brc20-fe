
import { IOrderItem } from '@/types';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

interface IProps {
    isOpen: boolean,
    orderDetail: IOrderItem,
    onClose: () => void,
}

export default function OrderDetailModal({ isOpen, onClose, orderDetail }: IProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent className='w-[calc(100vw_-_32px)] l-4'>
                <ModalHeader>Order details</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Order ID:</div>
                        <div>{orderDetail.orderId}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Quantity:</div>
                        <div>{orderDetail.quantity}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Type:</div>
                        <div>{orderDetail.type}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Create Time:</div>
                        <div>{orderDetail.createTime}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Status:</div>
                        <div>{orderDetail.status}</div>
                    </div>
                    <div className='my-2'>
                        <pre className="font-medium	py-[16px] rounded-[12px] pl-[16px] dark:bg-[#282A33] bg-[#F3F3F0] break-all whitespace-break-spaces"> {JSON.stringify(orderDetail.inscribeInfo)}</pre>
                    </div>

                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Receving Address:</div>
                        <div>{orderDetail.receiveAddress}</div>
                    </div>
                    <div className='flex'>
                        <div className='font-semibold mb-2 w-[160px]'>Network Fee:</div>
                        <div>{orderDetail.inscriptionFees}</div>
                    </div>

                    <div className='mt-4'>
                        <div className='font-semibold mb-2 w-[160px]'>Transaction Info:</div>
                        {orderDetail.txinfos.map(item => (
                            <div className='mt-2' key={item.txid}>
                                <div className='font-semibold'>{item.desp}</div>
                                <div>{item.txid}</div>
                            </div>
                        ))}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}