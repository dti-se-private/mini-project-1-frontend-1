'use client'
import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {RegisterByEmailAndPasswordRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@nextui-org/react";
import {useModal} from "@/src/hooks/useModal";
import Json from "@/src/components/Json";

export default function Page() {
    const authentication = useAuthentication();
    const modal = useModal();

    const initialValues = {
        email: "",
        password: "",
        name: "",
        phone: "",
        dob: new Date(),
        referralCode: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
        dob: Yup.date().required("Date of Birth is required."),
        referralCode: Yup.string(),
    });

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        const request: RegisterByEmailAndPasswordRequest = {
            email: values.email,
            password: values.password,
            name: values.name,
            phone: values.phone,
            dob: new Date(values.dob).toISOString(),
            referralCode: values.referralCode,
        }
        return authentication
            .register(request)
            .then((data) => {
                modal.setContent({
                    header: "Register Succeed",
                    body: <Json value={data ?? {}}/>,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Register Failed",
                    body: <Json value={error}/>,
                })
            }).finally(() => {
                modal.onOpenChange(true);
            });
    };

    return (
        <div className="container py-12 min-h-[90vh] flex flex-col justify-center items-center">
            <h1 className="mb-8 text-4xl font-bold">Register Now!</h1>
            <div
                className="w-1/3"
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <FormInput name="email" label="Email" type="email"/>
                        <FormInput name="password" label="Password" type="password"/>
                        <FormInput name="name" label="Name" type="text"/>
                        <FormInput name="phone" label="Phone" type="text"/>
                        <FormInput name="dob" label="Date of Birth" type="date"/>
                        <FormInput name="referralCode" label="Referral Code" type="text"/>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}