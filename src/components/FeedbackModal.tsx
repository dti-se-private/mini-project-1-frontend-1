"use client"
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {useFeedbackModal} from "@/src/hooks/useFeedbackModal";
import FeedbackModalBody from "@/src/components/FeedbackModalBody";
import DeleteFeedbackModalBody from "@/src/components/DeleteFeedbackModalBody";

export default function Component() {
    const {
        state,
        onOpenChange,
    } = useFeedbackModal();

    const renderBody = () => {
        switch (state.bodyType) {
            case "FeedbackModalBody":
                return (<FeedbackModalBody />);
            case "DeleteFeedback":
                return (
                    <DeleteFeedbackModalBody />
                );
            default:
                return state?.body || null;
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
