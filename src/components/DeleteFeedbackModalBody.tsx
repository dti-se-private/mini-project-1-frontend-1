import { CreateFeedbackRequest } from "@/src/stores/apis/participantApi";
import FormInput from "@/src/components/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button } from "@nextui-org/react";
import { useFeedbackModal } from "@/src/hooks/useFeedbackModal";

export default function DeleteFeedbackModalBody() {
    const { state, onOpenChange, setFeedbackId } = useFeedbackModal();

    const initialValues: CreateFeedbackRequest = {
        transactionId: state.transaction?.transactionId ?? "",
        rating: state.transaction?.feedback?.rating ?? 0,
        review: state.transaction?.feedback?.review ?? "",
    };

    const validationSchema = Yup.object().shape({
        rating: Yup.number().min(1, "Rating is required.").required("Rating is required."),
        review: Yup.string().required("Review is required."),
    });

    const handleSubmit = () => {
        onOpenChange(false);
    };

    return (
        <div className="w-full flex flex-col justify-center p-2">
            <div className="flex flex-col gap-2 text-center mb-4">
                <p className="text-lg">{state.transaction?.eventName}</p>
                <p className="text-base font-semibold">Are you sure you want to delete this feedback?</p>
            </div>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({values, errors, touched}) => (
                    <Form className="w-full">
                        <div className="w-full p-6 space-y-4 mb-2 border-b-1 border-b-gray-300">
                            <FormInput name="review" placeholder="type your ldeas or suggestions" type="text" />
                            <div className="form-group">
                                <div className="flex justify-center space-x-2 mt-2">
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const value = i + 1;
                                        return (
                                            <span
                                                key={value}
                                                className={`text-3xl cursor-pointer ${
                                                    values.rating >= value ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                            >★</span>
                                        );
                                    })}
                                </div>
                                {/* Display error message for rating */}
                                {touched.rating && errors.rating && (
                                    <div className="text-tiny text-danger">{errors.rating}</div>
                                )}
                            </div>
                        </div>
                        <div className="w-ful flex gap-2 justify-end">
                            <Button onClick={() => onOpenChange(false)}
                                    className="w-1/3 md:w-6 text-white font-semibold rounded-md py-2 bg-blue-500 hover:bg-blue-100">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (state.transaction?.feedback.id) {
                                        setFeedbackId(state.transaction.feedback.id);
                                        onOpenChange(false);
                                    }
                                }}
                                className="w-1/3 md:w-6 bg-red-500 text-white font-semibold rounded-md py-2 hover:bg-red-600">
                                Delete
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
