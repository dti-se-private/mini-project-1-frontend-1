import {useFormikContext} from "formik";
import {Input} from "@nextui-org/react";

interface FormInputProps {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
}

export default function Component(props: FormInputProps) {
    const {isSubmitting, errors, handleChange, handleBlur, values} = useFormikContext();
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
            // @ts-expect-error: Still compatible even in type lint error.
            value={values[props.name]}
            // @ts-expect-error: Still compatible even in type lint error.
            isInvalid={Boolean(errors[props.name])}
            // @ts-expect-error: Still compatible even in type lint error.
            errorMessage={errors[props.name]}
        />
    );
};