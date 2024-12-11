"use client"
import {Button, Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {useFeedbackModal} from "@/src/hooks/useFeedbackModal";
import FeedbackModalBody from "@/src/components/FeedbackModalBody";

export default function Component() {
    const {
        state,
        onOpenChange,
        setFeedbackId,
    } = useFeedbackModal();

    const renderBody = () => {
        switch (state.bodyType) {
            case "FeedbackModalBody":
                return (<FeedbackModalBody />);
            case "DeleteFeedback":
                return (
                    <>
                        <div>Are you sure you want to delete this feedback?</div>
                        <div className="flex gap-4">
                            <Button
                                color="danger"
                                onClick={() => {
                                    if (state.transaction?.feedback.id) {
                                        setFeedbackId(state.transaction.feedback.id);
                                        onOpenChange(false);
                                    }
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={() => onOpenChange(false)}
                            >
                                No
                            </Button>
                        </div>
                    </>
                );
            default:
                return state.body || null;
        }
    };

    return (
        <Modal
            key="feedback-modal"
            size="3xl"
            isOpen={state.isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {state.header}
                        </ModalHeader>
                        <ModalBody>
                            {renderBody()}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
