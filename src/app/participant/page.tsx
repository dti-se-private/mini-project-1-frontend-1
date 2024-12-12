"use client"

import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button} from "@nextui-org/react";
import moment from "moment";
import {useParticipant} from "@/src/hooks/useParticipant";
import {RetrieveAllFeedbackResponse} from "@/src/stores/apis/participantApi";
import {useFeedbackModal} from "@/src/hooks/useFeedbackModal";
import {useEffect} from "react";
import Link from "next/link";

export default function Page() {
    const participant = useParticipant();
    const modal = useFeedbackModal();

    const handleCheckFeedback = (trx: RetrieveAllFeedbackResponse) => {
        modal.setContent({
            header: '',
            body: 'Create Feedback',
            bodyType: 'FeedbackModalBody',
        });
        modal.setTransaction(trx);
        modal.onOpenChange(true);
    }

    const handleDeleteFeedback = (trx: RetrieveAllFeedbackResponse) => {
        modal.setContent({
            header: '',
            body: 'Delete Feedback',
            bodyType: 'DeleteFeedback',
        });
        modal.setTransaction(trx);
        modal.onOpenChange(true);
    }

    useEffect(() => {
        if (modal.state.feedbackRequest !== undefined) {
            participant.createFeedback(modal.state.feedbackRequest).then(r => {
                if (r.data) {
                    participant.feedbackApiResult.refetch();
                }
            });
        }
    }, [modal.state.feedbackRequest]);

    useEffect(() => {
        if (modal.state.feedbackId !== undefined) {
            participant.deleteFeedback({id : modal.state.feedbackId}).then(() => {
                participant.feedbackApiResult.refetch();
            });
        }
    }, [modal.state.feedbackId]);

    return (
        <div className="container py-8 px-12 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="w-full flex flex-col justify-center items-between">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold">Points</div>
                </div>

                <Table className="min-h-[50vh] w-full text-left"
                       aria-label="Point Table">
                    <TableHeader className="bg-gray-300">
                        <TableColumn>#</TableColumn>
                        <TableColumn>Amount</TableColumn>
                        <TableColumn>Ended At</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="Empty!">
                        {(participant.pointApiResult?.data?.data ?? []).map((point, index) => (
                            <TableRow key={'point' + index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{point.fixedAmount}</TableCell>
                                <TableCell>{moment(point.endedAt).format("YYYY-MM-DD HH:mm [UTC]Z")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => participant.setPointPage(participant.state.pointCurrentPage - 1)}
                        disabled={participant.state.pointCurrentPage === 0}
                    >
                        {'<'}
                    </Button>
                    <Button>
                        {participant.state.pointCurrentPage + 1}
                    </Button>
                    <Button
                        onClick={() => participant.setPointPage(participant.state.pointCurrentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>

                <br/>
                <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold">Vouchers</div>
                </div>

                <Table className="min-h-[50vh] w-full text-left"
                       aria-label="Voucher Table">
                    <TableHeader className="bg-gray-300">
                        <TableColumn>#</TableColumn>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Code</TableColumn>
                        <TableColumn>Amount</TableColumn>
                        <TableColumn>Ended At</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="Empty!">
                        {(participant.voucherApiResult?.data?.data ?? []).map((voucher, index) => (
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

                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => participant.setVoucherPage(participant.state.voucherCurrentPage - 1)}
                        disabled={participant.state.voucherCurrentPage === 0}
                    >
                        {'<'}
                    </Button>
                    <Button>
                        {participant.state.voucherCurrentPage + 1}
                    </Button>
                    <Button
                        onClick={() => participant.setVoucherPage(participant.state.voucherCurrentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>

                <br/>

                <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold">Feedbacks</div>
                </div>

                <Table className="min-h-[50vh] w-full text-left"
                       aria-label="Feedback Table">
                    <TableHeader className="bg-gray-300">
                        <TableColumn>#</TableColumn>
                        <TableColumn>Trx ID</TableColumn>
                        <TableColumn>Event ID</TableColumn>
                        <TableColumn>Event Name</TableColumn>
                        <TableColumn>Time</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="Empty!">
                        {(participant.feedbackApiResult?.data?.data ?? []).map((feedback, index) => (
                            <TableRow key={'feedback' + index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{feedback.transactionId}</TableCell>
                                <TableCell>{feedback.eventId}</TableCell>
                                <TableCell>{feedback.eventName}</TableCell>
                                <TableCell>{moment(feedback.time).format("YYYY-MM-DD HH:mm")}</TableCell>
                                <TableCell>
                                    {feedback.feedback?.id ? (
                                            <Button
                                                color="danger"
                                                onClick={() => handleDeleteFeedback(feedback)}
                                            >
                                                Delete
                                            </Button>)
                                        : (
                                            <Button
                                                color="primary"
                                                onClick={() => handleCheckFeedback(feedback)}
                                            >
                                                Submit
                                            </Button>)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => participant.setFeedbackPage(participant.state.feedbackCurrentPage - 1)}
                        disabled={participant.state.feedbackCurrentPage === 0}
                    >
                        {'<'}
                    </Button>
                    <Button>
                        {participant.state.feedbackCurrentPage + 1}
                    </Button>
                    <Button
                        onClick={() => participant.setFeedbackPage(participant.state.feedbackCurrentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>

                <br/>

                <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold">Transaction</div>
                </div>

                <Table className="min-h-[50vh] w-full text-left"
                       aria-label="Transaction Table">
                    <TableHeader className="bg-gray-300">
                        <TableColumn>#</TableColumn>
                        <TableColumn>Trx ID</TableColumn>
                        <TableColumn>Event ID</TableColumn>
                        <TableColumn>Event Name</TableColumn>
                        <TableColumn>Time</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="Empty!">
                        {(participant.transactionApiResult?.data?.data ?? []).map((trx, index) => (
                            <TableRow key={'feedback' + index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{trx.transactionId}</TableCell>
                                <TableCell>{trx.eventId}</TableCell>
                                <TableCell>{trx.eventName}</TableCell>
                                <TableCell>{moment(trx.time).format("YYYY-MM-DD HH:mm")}</TableCell>
                                <TableCell>
                                    <Button
                                        color="primary"
                                        as={Link}
                                        href={`/participant/${trx.transactionId}`}
                                    >
                                        Detail
                                    </Button>)
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => participant.setTransactionPage(participant.state.transactionCurrentPage - 1)}
                        disabled={participant.state.transactionCurrentPage === 0}
                    >
                        {'<'}
                    </Button>
                    <Button>
                        {participant.state.transactionCurrentPage + 1}
                    </Button>
                    <Button
                        onClick={() => participant.setTransactionPage(participant.state.transactionCurrentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
