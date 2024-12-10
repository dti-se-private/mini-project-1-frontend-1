"use client"

import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button} from "@nextui-org/react";
import moment from "moment";
import {useProfile} from "@/src/hooks/useProfile";
import {RetrieveAllFeedbackResponse, RetrieveFeedbackResponse} from "@/src/stores/apis/participantApi";
import {useModal} from "@/src/hooks/useModal";

export default function Page() {
    const profile = useProfile();
    const modal = useModal();

    const handleCheckFeedback = (trx: RetrieveAllFeedbackResponse) => {
        modal.onOpenChange(true);
    }

    const handleDeleteFeedback = (feedback: RetrieveFeedbackResponse) => {
        alert(feedback);
    }

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
                        {(profile.feedbackApiResult?.data?.data ?? []).map((feedback, index) => (
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
                                                onClick={() => handleDeleteFeedback(feedback.feedback)}
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
                        onClick={() => profile.setFeedbackPage(profile.state.feedbackCurrentPage - 1)}
                        disabled={profile.state.feedbackCurrentPage === 0}
                    >
                        {'<'}
                    </Button>
                    <Button>
                        {profile.state.feedbackCurrentPage + 1}
                    </Button>
                    <Button
                        onClick={() => profile.setFeedbackPage(profile.state.feedbackCurrentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
