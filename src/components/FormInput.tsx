import {useFormikContext} from "formik";
import {Input} from "@nextui-org/react";
import {ComponentProps} from "react";


export default function Component(props: Readonly<ComponentProps<typeof Input>>) {
    const {isSubmitting, errors, handleChange, handleBlur, values} = useFormikContext();

    return (
        <Input
            {...props}
            className="mb-6 w-full"
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