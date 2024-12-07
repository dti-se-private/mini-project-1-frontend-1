"use client"
import * as Yup from "yup";
import { Button, Input } from '@nextui-org/react';
import {Form, Formik, FieldArray} from "formik";
import FormInput from "@/src/components/FormInput";
import {CreateEventRequest, CreateEventVoucherRequest} from "@/src/stores/apis/organizerEventApi";
import Json from "@/src/components/Json";
import {useOrganizerEventsMutation} from "@/src/hooks/useOrganizerEventMutation";
import {useModal} from "@/src/hooks/useModal";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";

export default function EventDetailForm() {
    const modal = useModal();
    const router = useRouter();

    const {
        //state,
        setIsCreatingEvent,
        createEvent,
    } = useOrganizerEventsMutation();

    const initialValues = {
        name: "",
        description: "",
        location: "",
        category: "",
        time: new Date(),
        bannerImageUrl: "",
        slots: 0,
        price: 0,
        vouchers: [],
    };

    const validationSchema = () => {
        const schemaFields = {
            name: Yup.string().required("Event name is required."),
            description: Yup.string().required("Description is required."),
            location: Yup.string().required("Location is required."),
            category: Yup.string().required("Category is required."),
            time: Yup.string().required("Time is required."),
            slots: Yup.number().required("Slots is required."),
            price: Yup.number().required("Price is required."),
            vouchers: Yup.array().of(
                Yup.object({
                    name: Yup.string().required("Voucher name is required."),
                    description: Yup.string().required("Description is required."),
                    variableAmount: Yup.number().required("Variable amount is required."),
                    startedAt: Yup.date().required("Started at is required."),
                    endedAt: Yup.date().required("Ended at is required."),
                })
            ),
        };
        return Yup.object().shape(schemaFields);
    };

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        setIsCreatingEvent(true);
        const request: CreateEventRequest = values;

        return createEvent(request)
            .then((data) => {
                modal.setContent({
                    header: "Event was created",
                    body: <Json value={data.data ?? {}}/>,
                })
                actions.resetForm();
                router.push(`/organizer/${data?.data?.id}`);
            })
            .catch((error) => {
                modal.setContent({
                    header: "Event creation failed",
                    body: <Json value={error}/>,
                })
            })
            .finally(() => {
                setIsCreatingEvent(false);
                //modal.onOpenChange(true);
            });
    };

    const addVoucherField = (push: (voucher: CreateEventVoucherRequest) => void) => {
        const newVoucher = {
            name: "",
            description: "",
            variableAmount: 0,
            startedAt: new Date(),
            endedAt: new Date(),
        };

        push(newVoucher);
    };

    return (
        <div className="w-full container mx-auto p-6">
            {/* Page Header */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Event Creation</h1>
            </header>

            <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                initialValues={initialValues}>
                {/* Event Form */}
                <Form className="flex flex-col gap-1 mx-0 md:mx-[20vw]">
                    {/* Event Details */}
                    <p className="text-gray-700">Event details</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <FormInput
                            name="name"
                            label="Event Name"
                            type="text"
                        />
                        <FormInput
                            name="description"
                            label="Event Description"
                            type="text"
                        />
                        <FormInput
                            name="time"
                            label="Event Time"
                            type="date"
                        />
                        <FormInput
                            name="location"
                            label="Event Location"
                            type="text"
                        />
                        <FormInput
                            name="category"
                            label="Event Category"
                            type="text"
                        />
                    </div>

                    {/* Ticket Details */}
                    <p className="text-gray-700">Ticket details</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <div className="mb-6">
                            <Input
                                label="Ticket Name"
                                type="text"
                                disabled={true}
                                value="Regular"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Ticket Description"
                                type="text"
                                disabled={true}
                                value="Regular ticket"
                            />
                        </div>
                        <FormInput
                            name="price"
                            label="Ticket Price"
                            type="number"
                        />
                        <FormInput
                            name="slots"
                            label="Ticket Slots"
                            type="number"
                        />
                    </div>

                    {/* Voucher Details */}
                    <p className="text-gray-700">Voucher details</p>
                    <div className="flex flex-col gap-1 mb-2">
                        <FieldArray name="vouchers">
                            {({push, remove, form}) => (
                                <div>
                                    {form.values.vouchers.map((voucher: CreateEventVoucherRequest, index: number) => (
                                        <div key={index} className="flex flex-col mb-2">
                                            <FormInput
                                                name={`vouchers[${index}].name`}
                                                label={`Voucher Name ${index + 1}`}
                                                type="text"
                                            />
                                            <FormInput
                                                name={`vouchers[${index}].description`}
                                                label={`Voucher Description ${index + 1}`}
                                                type="text"
                                            />
                                            <FormInput
                                                name={`vouchers[${index}].variableAmount`}
                                                label={`Voucher Variable Amount ${(index + 1)}`}
                                                type="number"
                                            />
                                            <FormInput
                                                name={`vouchers[${index}].startedAt`}
                                                label={`Voucher Start Date ${index + 1}`}
                                                type="date"
                                            />
                                            <FormInput
                                                name={`vouchers[${index}].endedAt`}
                                                label={`Voucher End Date ${index + 1}`}
                                                type="date"
                                            />
                                            <p
                                                className="flex text-red-400 hover:text-red-500 hover:cursor-pointer items-center align-middle justify-end"
                                                onClick={() => remove(index)}
                                            >
                                                <Icon icon="mdi:trash-can" className="w-4 h-4"/>
                                                <span>&nbsp;voucher {index + 1}</span>
                                            </p>
                                        </div>
                                    ))}
                                    <p
                                        className="flex text-blue-400 hover:text-blue-500 hover:cursor-pointer items-center align-middle"
                                        onClick={() => addVoucherField(push)}
                                    >
                                        <Icon icon="mdi:plus" className="w-5 h-5"/>
                                        <span>&nbsp;voucher</span>
                                    </p>
                                </div>
                            )}
                        </FieldArray>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="self-center" color="primary">
                        Create
                    </Button>
                </Form>
            </Formik>
        </div>
    );
}