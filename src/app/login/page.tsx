"use client"
import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {LoginByEmailAndPasswordRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@nextui-org/react";
import {useModal} from "@/src/hooks/useModal";
import Json from "@/src/components/Json";
import {useRouter} from "next/navigation";

export default function Page() {
    const authentication = useAuthentication();
    const modal = useModal();
    const router = useRouter();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        const request: LoginByEmailAndPasswordRequest = {
            email: values.email,
            password: values.password,
        }
        return authentication
            .login(request)
            .then((data) => {
                modal.setContent({
                    header: "Login Succeed",
                    body: <Json value={data ?? {}}/>,
                })
                router.push("/");
            })
            .catch((error) => {
                modal.setContent({
                    header: "Login Failed",
                    body: <Json value={error}/>,
                })
            })
            .finally(() => {
                modal.onOpenChange(true);
            });
    };

    return (
        <div className="container py-12 min-h-[90vh] flex flex-col justify-center items-center">
            <h1 className="mb-8 text-4xl font-bold">Login Now!</h1>
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
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}