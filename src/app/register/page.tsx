'use client'
import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {RegisterByEmailAndPasswordRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@nextui-org/react";
import FormDateInput from "@/src/components/FormDateInput";

export default function Page() {
    const {register} = useAuthentication();

    const initialValues: RegisterByEmailAndPasswordRequest = {
        email: "",
        password: "",
        name: "",
        phone: "",
        dob: "",
        referralCode: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
        dob: Yup.string().required("Date of birth is required."),
        referralCode: Yup.string(),
    });

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        return register(values)
            .then(() => {
                actions.resetForm();
                alert("Registration succeed.");
            })
            .catch(() => {
                alert("Registration failed.");
            });
    };

    return (
        <div className="container flex flex-col justify-center items-center my-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Register Now!</h1>
            </div>
            <div className="w-1/3">
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
                        <FormDateInput name="dob" label="Date of Birth"/>
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