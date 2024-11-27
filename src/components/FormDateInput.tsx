import {useFormikContext} from "formik";
import {DatePicker} from "@nextui-org/react";

interface FormDateInputProps {
    name: string;
    label: string;
}

export default function FormDateInput(props: FormDateInputProps) {
    const {isSubmitting, errors, handleChange, handleBlur} = useFormikContext();
    const inputId = `${props.label.toLowerCase()}-input`;

    return (
        <DatePicker
            className="mb-6 w-full"
            id={inputId}
            name={props.name}
            label={props.label}
            isDisabled={isSubmitting}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={Boolean(errors[props.name])}
            errorMessage={errors[props.name]}
        />
    );
};