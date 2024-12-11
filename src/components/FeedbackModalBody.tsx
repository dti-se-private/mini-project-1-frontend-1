import { CreateFeedbackRequest } from "@/src/stores/apis/participantApi";
import FormInput from "@/src/components/FormInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button } from "@nextui-org/react";
import { useFeedbackModal } from "@/src/hooks/useFeedbackModal";

export default function Component() {
    const { state, setFeedbackRequest, onOpenChange } = useFeedbackModal();

    const initialValues: CreateFeedbackRequest = {
        transactionId: state.transaction?.transactionId ?? "",
        rating: 0,
        review: "",
    };

    const validationSchema = Yup.object().shape({
        rating: Yup.number().min(1, "Rating is required.").required("Rating is required."),
        review: Yup.string().required("Review is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void }) => {
        setFeedbackRequest(values);
        actions.resetForm();
    };

    return (
        <div className="w-full flex flex-col justify-center p-2">
            <div className="flex flex-col gap-2 text-center mb-4">
                <p className="text-lg font-semibold">{state.transaction?.eventName}</p>
                <p className="text-sm text-gray-500">We value your feedback. If you have any ideas or suggestions to improve our event,let us know.</p>
            </div>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({values, setFieldValue, errors, touched}) => (
                    <Form className="w-full">
                        <div className="w-full max-w-lg p-6 space-y-4 mb-2 border-b-1 border-b-gray-300">
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
                                                onClick={() => setFieldValue("rating", value)}
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
                                    className="w-1/3 font-semibold rounded-md py-2 bg-white hover:bg-gray-100">
                                Cancel
                            </Button>
                            <Button type="submit" className="w-1/3 bg-blue-500 text-white font-semibold rounded-md py-2 hover:bg-blue-600">
                                Create
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
