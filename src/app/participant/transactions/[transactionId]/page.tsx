'use client';
import {Button, Input, Spinner} from "@nextui-org/react";
import {useParams} from "next/navigation";
import {participantApi, UsedPointResponse, UsedVoucherResponse} from "@/src/stores/apis/participantApi";
import moment from "moment";
import Link from "next/link";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {useState} from "react";

const ITEMS_PER_PAGE = 5;

export default function Page() {
    const {transactionId}: { transactionId: string } = useParams();
    const transaction = participantApi
        .useGetTransactionDetailQuery({id: transactionId,});

    const [pointsPage, setPointsPage] = useState<number>(0);
    const [vouchersPage, setVouchersPage] = useState<number>(0);

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

    const paginateData = <T, >(data: T[], page: number): T[] =>
        data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const usedPoints = transaction.data?.data?.usedPoints || [];
    const paginatedPoints = paginateData<UsedPointResponse>(usedPoints, pointsPage);

    const usedVouchers = transaction.data?.data?.usedVouchers || [];
    const paginatedVouchers = paginateData<UsedVoucherResponse>(usedVouchers, vouchersPage);

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="pl-2 text-3xl font-bold mb-6">My Transaction Details</div>
                <div className="w-2/3 md:w-2/4 flex flex-col gap-1 mb-12">
                    <p className="text-gray-700">Transaction</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Input
                            className="mb-6 w-full"
                            label="Transaction ID"
                            value={transaction.data?.data?.transactionId}
                            type="text"
                            disabled
                        />
                        <div className="w-full flex gap-3">
                            <div className="flex-1">
                                <Input
                                    className="mb-6 w-full"
                                    label="Event ID"
                                    value={transaction.data?.data?.eventId}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="w-auto mt-2">
                                <Button
                                    color="primary"
                                    as={Link}
                                    href={`/participant/transactions/${transaction.data?.data?.transactionId}/events/${transaction.data?.data?.eventId}`}
                                >
                                    Detail
                                </Button>
                            </div>
                        </div>
                        <Input
                            className="mb-6 w-full"
                            label="Time"
                            value={moment(transaction.data?.data?.time).format("YYYY-MM-DD HH:mm")}
                            type="text"
                            disabled
                        />
                    </div>

                    {/* Used Points */}
                    <p className="text-gray-700">Used Points</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Table className="w-full text-left" aria-label="Used Point Table">
                            <TableHeader className="bg-gray-300">
                                <TableColumn>#</TableColumn>
                                <TableColumn>Amount</TableColumn>
                                <TableColumn>Ended At</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Empty!">
                                {paginatedPoints.map((point, index) => (
                                    <TableRow key={`point-${index}`}>
                                        <TableCell>{index + 1 + pointsPage * ITEMS_PER_PAGE}</TableCell>
                                        <TableCell>{point.fixedAmount}</TableCell>
                                        <TableCell>{moment(point.endedAt).format("YYYY-MM-DD HH:mm [UTC]Z")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-center gap-4 mt-4">
                            <Button
                                disabled={pointsPage === 0}
                                onClick={() => setPointsPage(pointsPage - 1)}
                            >
                                {'<'}
                            </Button>
                            <Button>
                                {pointsPage + 1}
                            </Button>
                            <Button
                                disabled={(pointsPage + 1) * ITEMS_PER_PAGE >= usedPoints.length}
                                onClick={() => setPointsPage(pointsPage + 1)}
                            >
                                {'>'}
                            </Button>
                        </div>
                    </div>

                    {/* Used Vouchers */}
                    <p className="text-gray-700">Used Vouchers</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <Table className="w-full text-left" aria-label="Used Voucher Table">
                            <TableHeader className="bg-gray-300">
                                <TableColumn>#</TableColumn>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Description</TableColumn>
                                <TableColumn>Code</TableColumn>
                                <TableColumn>Amount</TableColumn>
                                <TableColumn>Ended At</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="Empty!">
                                {paginatedVouchers.map((voucher, index) => (
                                    <TableRow key={`voucher-${index}`}>
                                        <TableCell>{index + 1 + vouchersPage * ITEMS_PER_PAGE}</TableCell>
                                        <TableCell>{voucher.name}</TableCell>
                                        <TableCell>{voucher.description}</TableCell>
                                        <TableCell>{voucher.code}</TableCell>
                                        <TableCell>{voucher.variableAmount * 100}%</TableCell>
                                        <TableCell>{moment(voucher.endedAt).format("YYYY-MM-DD HH:mm [UTC]Z")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex justify-center gap-4 mt-4">
                            <Button
                                disabled={vouchersPage === 0}
                                onClick={() => setVouchersPage(vouchersPage - 1)}
                            >
                                {'<'}
                            </Button>
                            <Button>
                                {vouchersPage + 1}
                            </Button>
                            <Button
                                disabled={(vouchersPage + 1) * ITEMS_PER_PAGE >= usedVouchers.length}
                                onClick={() => setVouchersPage(vouchersPage + 1)}
                            >
                                {'>'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
