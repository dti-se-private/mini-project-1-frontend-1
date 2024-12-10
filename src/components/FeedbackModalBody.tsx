import {CreateFeedbackRequest, RetrieveAllFeedbackResponse} from "@/src/stores/apis/participantApi";
import FormInput from "@/src/components/FormInput";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {Button} from "@nextui-org/react";

export interface FeedbackModalBodyProps {
    feedback: RetrieveAllFeedbackResponse;
    isOpen: boolean;
    feedbackRequest: (req: CreateFeedbackRequest) => void;
}

export default function Component(props: FeedbackModalBodyProps) {
    const initialValues: CreateFeedbackRequest = {
        transactionId: props?.feedback?.transactionId ?? "",
        rating: 0,
        review: "",
    };

    const validationSchema = Yup.object().shape({
        rating: Yup.string().required("Rating is required."),
        review: Yup.string().required("Review is required."),
    });

    const handleSubmit = async (
        values: typeof initialValues, actions: { resetForm: () => void; }) => {
        props.feedbackRequest(values);
        actions.resetForm();
    };

    return (
        <div className="w-full flex">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <FormInput name="rating" label="rating" type="text" />
                    <FormInput name="review" label="review" type="text" />
                </Form>
                <Button type="submit" className="w-full" color="primary">
                    Create
                </Button>
            </Formik>
        </div>
    );
};