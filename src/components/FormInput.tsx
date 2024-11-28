import {useFormikContext} from "formik";
import {Input} from "@nextui-org/react";

interface FormInputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
}

export default function FormInput(props: FormInputProps) {
    const {isSubmitting, errors, handleChange, handleBlur} = useFormikContext();
    const inputId = `${props.label.toLowerCase()}-input`;

    return (
        <Input
            className="mb-6 w-full"
            id={inputId}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            label={props.label}
            disabled={isSubmitting}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={Boolean(errors[props.name])}
            errorMessage={errors[props.name]}
        />
    );
};