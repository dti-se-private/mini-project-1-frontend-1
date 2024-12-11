"use client"

import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button} from "@nextui-org/react";
import moment from "moment";
import {useParticipant} from "@/src/hooks/useParticipant";
import {RetrieveAllFeedbackResponse} from "@/src/stores/apis/participantApi";
import {useFeedbackModal} from "@/src/hooks/useFeedbackModal";
import {useEffect} from "react";

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
                            <TableRow key={'feedback'+index}>
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
            </div>
        </div>
    );
}
