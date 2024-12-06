import {useFormikContext} from "formik";
import {Input} from "@nextui-org/react";


export default function Component(props) {
    const {isSubmitting, errors, handleChange, handleBlur, values} = useFormikContext();
    const inputId = `${props.label.toLowerCase()}-input`;

    return (
        <Input
            {...props}
            className="mb-6 w-full"
            id={inputId}
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