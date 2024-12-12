"use client"
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button} from "@nextui-org/react";
import {useParticipant} from "@/src/hooks/useParticipant";
import {RetrieveFeedbackResponse} from "@/src/stores/apis/participantApi";
import {useFeedbackModal} from "@/src/hooks/useFeedbackModal";
import {useEffect} from "react";
import Link from "next/link";
import {Spinner} from "@nextui-org/spinner";

export default function Page() {
    const participant = useParticipant();
    const modal = useFeedbackModal();

    const handleCheckFeedback = (transaction: RetrieveFeedbackResponse) => {
        modal.setContent({
            header: '',
            body: 'Create Feedback',
            bodyType: 'FeedbackModalBody',
        });
        modal.setTransaction(transaction);
        modal.onOpenChange(true);
    }

    const handleDeleteFeedback = (transaction: RetrieveFeedbackResponse) => {
        modal.setContent({
            header: '',
            body: 'Delete Feedback',
            bodyType: 'DeleteFeedback',
        });
        modal.setTransaction(transaction);
        modal.onOpenChange(true);
    }

    useEffect(() => {
        if (modal.state.feedbackRequest !== undefined) {
            participant.createFeedback(modal.state.feedbackRequest).then(response => {
                if (response.data) {
                    participant.feedbackApiResult.refetch();
                }
            });
        }
    }, [modal.state.feedbackRequest]);

    useEffect(() => {
        if (modal.state.feedbackId !== undefined) {
            participant.deleteFeedback({id: modal.state.feedbackId}).then(() => {
                participant.feedbackApiResult.refetch();
            });
        }
    }, [modal.state.feedbackId]);

    return (
        <div className="py-8 px-12 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
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
                        <TableBody emptyContent={participant.pointApiResult.isLoading ? <Spinner/> : "Empty!"}>
                            {(participant.pointApiResult?.data?.data ?? []).map((point, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(index + 1) + (10 * participant.state.pointCurrentPage)}</TableCell>
                                    <TableCell>{point.fixedAmount}</TableCell>
                                    <TableCell>{point.endedAt}</TableCell>
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
                        <TableBody emptyContent={participant.voucherApiResult.isLoading ? <Spinner/> : "Empty!"}>
                            {(participant.voucherApiResult?.data?.data ?? []).map((voucher, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(index + 1) + (10 * participant.state.voucherCurrentPage)}</TableCell>
                                    <TableCell>{voucher.name}</TableCell>
                                    <TableCell>{voucher.description}</TableCell>
                                    <TableCell>{voucher.code}</TableCell>
                                    <TableCell>{voucher.variableAmount * 100}%</TableCell>
                                    <TableCell>{voucher.endedAt}</TableCell>
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
                            <TableColumn>Transaction ID</TableColumn>
                            <TableColumn>Event ID</TableColumn>
                            <TableColumn>Event Name</TableColumn>
                            <TableColumn>Time</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={participant.feedbackApiResult.isLoading ? <Spinner/> : "Empty!"}>
                            {(participant.feedbackApiResult?.data?.data ?? []).map((feedback, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(index + 1) + (10 * participant.state.feedbackCurrentPage)}</TableCell>
                                    <TableCell>{feedback.transactionId}</TableCell>
                                    <TableCell>{feedback.eventId}</TableCell>
                                    <TableCell>{feedback.eventName}</TableCell>
                                    <TableCell>{feedback.time}</TableCell>
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
                        <div className="text-2xl font-bold">Transactions</div>
                    </div>

                    <Table className="min-h-[50vh] w-full text-left"
                           aria-label="Transaction Table">
                        <TableHeader className="bg-gray-300">
                            <TableColumn>#</TableColumn>
                            <TableColumn>Transaction ID</TableColumn>
                            <TableColumn>Event ID</TableColumn>
                            <TableColumn>Event Name</TableColumn>
                            <TableColumn>Time</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={participant.transactionApiResult.isLoading ? <Spinner/> : "Empty!"}>
                            {(participant.transactionApiResult?.data?.data ?? []).map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(index + 1) + (10 * participant.state.transactionCurrentPage)}</TableCell>
                                    <TableCell>{transaction.transactionId}</TableCell>
                                    <TableCell>{transaction.eventId}</TableCell>
                                    <TableCell>{transaction.eventName}</TableCell>
                                    <TableCell>{transaction.time}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="primary"
                                            as={Link}
                                            href={`/participant/transactions/${transaction.transactionId}`}
                                        >
                                            Detail
                                        </Button>
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
        </div>
    );
}
