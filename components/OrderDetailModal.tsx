
import { IOrderItem, IOrderStatus } from '@/types';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Divider,
} from '@chakra-ui/react';
import Image from 'next/image';
import {
    satsToQtum,
} from '@/utils';

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
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Order ID</div>
                        <div className='font-medium	'>{orderDetail.orderId}</div>
                    </div>
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Quantity</div>
                        <div className='font-medium	'>{orderDetail.quantity}</div>
                    </div>
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Type</div>
                        <div className='font-medium	'>{orderDetail.type}</div>
                    </div>
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Create Time</div>
                        <div className='font-medium	'>{orderDetail.createTime}</div>
                    </div>
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Status</div>
                        {orderDetail.status === IOrderStatus.CLOSED ? <div className='font-medium	text-[#D2311B]'>{orderDetail.status}</div> : <div className='font-medium	text-[#2D73FF]'>{orderDetail.status}</div>}
                    </div>

                    <Divider />
                    <div className='my-4'>
                        <pre className="font-medium	py-[16px] rounded-[12px] px-[16px] dark:bg-[#282A33] bg-[#F3F3F0] break-all whitespace-break-spaces flex justify-between">
                            {JSON.stringify(orderDetail.inscribeInfo)}
                            {
                                orderDetail.status === IOrderStatus.CLOSED ? <Image width={24} height={24} src="/failed.svg" alt="failed" /> : <Image width={24} height={24} src="/success.svg" alt="success" />
                            }
                        </pre>
                    </div>

                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Receving Address</div>
                        <div className='font-medium	'>{orderDetail.receiveAddress}</div>
                    </div>
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Network Fee</div>
                        <div className='font-medium	'>{satsToQtum(orderDetail.inscriptionFees)} QTUM</div>
                    </div>

                    {
                        orderDetail.txinfos?.length ? <div className='mt-4'>
                            <div className='mb-4 text-[#7F8596]'>Transaction Info</div>
                            {orderDetail.txinfos.map(item => (
                                <div className='mt-2 ' key={item.txid}>
                                    <div className='font-normal'>{item.desp}</div>
                                    <div className='font-medium	'>{item.txid}</div>
                                </div>
                            ))}
                        </div> : null
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}