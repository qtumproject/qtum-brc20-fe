
import { IOrderItem, IOrderStatus } from '@/types';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Divider,
    Link,
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
                <ModalHeader className='leading-[64px]'>Order details</ModalHeader>
                <ModalCloseButton top="30px" right="16px" />
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
                        <pre className="leading-6 text-xs py-[16px] rounded-[12px] px-[16px] dark:bg-[#282A33] bg-[#F3F3F0] break-all whitespace-break-spaces flex justify-between">
                            {JSON.stringify(orderDetail.inscribeInfo)}
                            {
                                orderDetail.status === IOrderStatus.CLOSED ? <Image width={24} height={24} src="/failed.svg" alt="failed" /> : <Image width={24} height={24} src="/success.svg" alt="success" />
                            }
                        </pre>
                    </div>

                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Receiving Address</div>
                        <div className='font-medium	'>{orderDetail.receiveAddress}</div>
                    </div>
                    <div className='flex justify-between text-sm font-normal'>
                        <div className='mb-4 text-[#7F8596]'>Network Fee</div>
                        <div className='font-medium	'>{satsToQtum(orderDetail.inscriptionFees)} QTUM</div>
                    </div>

                    {
                        orderDetail.txinfos?.length ? <div>
                            <div className='mb-4 text-[#7F8596] text-sm '>Transaction Info</div>
                            {orderDetail.txinfos.map(item => (
                                <div className='text-sm mb-4' key={item.txid}>
                                    <div className='font-medium'>{item.desp}</div>
                                    <div>
                                        <Link isExternal color='brand.100' href={`https://testnet.qtum.info/tx/${item.txid}`}>
                                            {item.txid}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div> : null
                    }
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}