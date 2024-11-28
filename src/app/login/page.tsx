'use client'
import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {LoginByEmailAndPasswordRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@nextui-org/react";

export default function Page() {
    const {login} = useAuthentication();

    const initialValues: LoginByEmailAndPasswordRequest = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        return login(values)
            .then(() => {
                actions.resetForm();
                alert("Login succeed.");
            })
            .catch(() => {
                alert("Login failed.");
            });
    };

    return (
        <div className="container flex flex-col justify-center items-center my-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Login Now!</h1>
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
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}