'use client';
import {Button, Input, Spinner} from "@nextui-org/react";
import {useParams} from "next/navigation";
import {participantApi} from "@/src/stores/apis/participantApi";
import moment from "moment";
import Link from "next/link";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";

export default function Page() {
    const {id: transactionId}: { id: string } = useParams();
    const transaction = participantApi
        .useGetTransactionDetailQuery({id: transactionId});

    if (transaction.isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Spinner/>
            </div>
        );
    }

    if (!transaction.isLoading && !transaction.data?.data) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                Transaction not found!
            </div>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="text-3xl font-bold mb-6">My Transaction Details</div>
                <div className="w-2/3 md:w-2/4 flex flex-col gap-1 mb-12">
                    <p className="text-gray-700">Transaction</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Input
                            label="Transaction ID"
                            value={transaction.data?.data?.transactionId}
                            type="text"
                            disabled
                        />
                        <div className="w-full flex">
                            <div className="w-3/4">
                                <Input
                                    label="Event ID"
                                    value={transaction.data?.data?.eventId}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="w-1/4">
                                <Button
                                    color="primary"
                                    as={Link}
                                    href={`/participant/${transaction.data?.data?.transactionId}/${transaction.data?.data?.eventId}`}>
                                    Detail
                                </Button>
                            </div>
                        </div>
                        <Input
                            label="Time"
                            value={moment(transaction.data?.data?.time).format("YYYY-MM-DD HH:mm")}
                            type="text"
                            disabled
                        />
                    </div>

                    <p className="text-gray-700">Used Points</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Table className="min-h-[50vh] w-full text-left"
                               aria-label="Used Point Table">
                            <TableHeader className="bg-gray-300">
                                <TableColumn>#</TableColumn>
                                <TableColumn>Amount</TableColumn>
                                <TableColumn>Ended At</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Empty!">
                                {(transaction.data?.data?.usedPoints ?? []).map((point, index) => (
                                    <TableRow key={'point' + index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{point.fixedAmount}</TableCell>
                                        <TableCell>{moment(point.endedAt).format("YYYY-MM-DD HH:mm [UTC]Z")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <p className="text-gray-700">Used Vouchers</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Table className="min-h-[50vh] w-full text-left"
                               aria-label="Used Voucher Table">
                            <TableHeader className="bg-gray-300">
                                <TableColumn>#</TableColumn>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Description</TableColumn>
                                <TableColumn>Code</TableColumn>
                                <TableColumn>Amount</TableColumn>
                                <TableColumn>Ended At</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Empty!">
                                {(transaction.data?.data?.usedVouchers ?? []).map((voucher, index) => (
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
