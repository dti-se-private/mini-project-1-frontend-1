"use client"
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {useModal} from "@/src/hooks/useModal";

export default function Component() {
    const {state, onOpenChange} = useModal();
    return (
        <Modal
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
                            {state.body}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>

    );
};
