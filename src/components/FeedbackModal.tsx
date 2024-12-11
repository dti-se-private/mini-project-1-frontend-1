"use client"
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {useFeedbackModal} from "@/src/hooks/useFeedbackModal";
import FeedbackModalBody from "@/src/components/FeedbackModalBody";

export default function Component() {
    const {
        state,
        onOpenChange,
    } = useFeedbackModal();

    const renderBody = () => {
        if (state.bodyType === "FeedbackModalBody") {
            return (<FeedbackModalBody />);
        }

        return state.body || null;
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
                            {state.bodyType === "FeedbackModalBody" ? "" : state.header}
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
