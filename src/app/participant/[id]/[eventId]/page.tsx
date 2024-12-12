'use client';
import {Button, Input, Spinner} from "@nextui-org/react";
import {useParams} from "next/navigation";
import {participantApi} from "@/src/stores/apis/participantApi";
import moment from "moment";
import Link from "next/link";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";

export default function Page() {
    const {
        id: transactionId,
        eventId: eventId,
    }: {
        id: string,
        eventId: string,
    } = useParams();
    const event = participantApi
        .useGetTransactionEventDetailQuery({id: transactionId, eventId: eventId});

    if (event.isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Spinner/>
            </div>
        );
    }

    if (!event.isLoading && !event.data?.data) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                Event not found!
            </div>
        );
    }

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="text-3xl font-bold mb-6">My Transaction Details</div>
                <div className="w-2/3 md:w-2/4 flex flex-col gap-1 mb-12">
                    <p className="text-gray-700">Transaction</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Input
                            label="Event Name"
                            value={event.data?.data?.name}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Description"
                            value={event.data?.data?.description}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Time"
                            value={moment(event.data?.data?.time).format("YYYY-MM-DD HH:mm")}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Location"
                            value={event.data?.data?.location}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Category"
                            value={event.data?.data?.category}
                            type="text"
                            disabled
                        />
                    </div>

                    <p className="text-gray-700">Ticket</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Input
                            label="Ticket Name"
                            value={event.data?.data?.eventTickets[0].name}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Ticket Description"
                            value={event.data?.data?.eventTickets[0].description}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Price"
                            value={event.data?.data?.eventTickets[0].price &&
                                event.data?.data?.eventTickets[0].price > 0 ?
                                currencyFormatter.format(event.data?.data?.eventTickets[0].price) :
                                "FREE"}
                            type="text"
                            disabled
                        />
                        <Input
                            label="Slots"
                            value={event.data?.data?.eventTickets[0].slots.toString()}
                            type="text"
                            disabled
                        />
                    </div>

                    <p className="text-gray-700">Available Vouchers</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Table className="min-h-[50vh] w-full text-left"
                               aria-label="Available Voucher Table">
                            <TableHeader className="bg-gray-300">
                                <TableColumn>#</TableColumn>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Description</TableColumn>
                                <TableColumn>Code</TableColumn>
                                <TableColumn>Amount</TableColumn>
                                <TableColumn>Ended At</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Empty!">
                                {(event.data?.data?.eventVouchers ?? []).map((voucher, index) => (
                                    <TableRow key={'point' + index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{voucher.name}</TableCell>
                                        <TableCell>{voucher.description}</TableCell>
                                        <TableCell>{voucher.code}</TableCell>
                                        <TableCell>{voucher.variableAmount * 100}%</TableCell>
                                        <TableCell>{moment(voucher.endedAt).format("YYYY-MM-DD HH:mm [UTC]Z")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};
