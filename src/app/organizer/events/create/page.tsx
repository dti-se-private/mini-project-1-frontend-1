"use client"
import * as Yup from "yup";
import {Button, Input} from '@nextui-org/react';
import {FieldArray, Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {
    CreateEventRequest,
    CreateEventTicketRequest,
    CreateEventVoucherRequest
} from "@/src/stores/apis/organizerEventApi";
import {useOrganizerEvents} from "@/src/hooks/useOrganizerEvent";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import {useModal} from '@/src/hooks/useModal';
import moment from "moment";
import Json from "@/src/components/Json";

export default function Page() {
    const modal = useModal();
    const router = useRouter();

    const {
        setIsLoading,
        createEvent,
    } = useOrganizerEvents();

    const initialValues: CreateEventRequest = {
        name: "",
        description: "",
        location: "",
        category: "",
        time: "",
        bannerImageUrl: "",
        eventTickets: [{
            name: "Standard Ticket",
            description: "Standard ticket for attending the event.",
            price: 0,
            slots: 1,
            fields: ["name", "email", "phone", "dob"],
        }],
        eventVouchers: [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Event name is required."),
        description: Yup.string().required("Event description is required."),
        location: Yup.string().required("Event location is required."),
        category: Yup.string().required("Event category is required."),
        time: Yup.date().required("Event time is required."),
        slots: Yup.number().required("Ticket slots is required.").min(1),
        price: Yup.number().required("Ticket price is required.").min(0),
        eventTickets: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Ticket name is required."),
                description: Yup.string().required("Ticket description is required."),
                price: Yup.number().required("Ticket price is required.").min(0),
                slots: Yup.number().required("Ticket slots is required.").min(1),
            })
        ),
        eventVouchers: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Voucher name is required."),
                description: Yup.string().required("Voucher description is required."),
                variableAmount: Yup.number().required("Voucher variable amount is required.").min(0),
                startedAt: Yup.date().required("Voucher started at is required."),
                endedAt: Yup.date().required("Voucher ended at is required."),
            })
        ),
    });

    const handleSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        setIsLoading(true);

        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const request: CreateEventRequest = {
            ...values,
            time: moment(values.time).utcOffset(currentTimeZone).toISOString(),
            eventVouchers: values.eventVouchers.map((voucher) => ({
                ...voucher,
                startedAt: moment(voucher.startedAt).utcOffset(currentTimeZone).toISOString(),
                endedAt: moment(voucher.endedAt).utcOffset(currentTimeZone).toISOString(),
            }))
        }

        return createEvent(request)
            .then((data) => {
                modal.setContent({
                    header: "Create Event Succeed",
                    body: <Json value={data}/>,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Create Event Failed",
                    body: <Json value={error}/>,
                })
            })
            .finally(() => {
                setIsLoading(false);
                modal.onOpenChange(true)
            });
    };

    const addVoucherField = (push: (voucher: CreateEventVoucherRequest) => void) => {
        push({
            name: "",
            description: "",
            variableAmount: 0,
            startedAt: "",
            endedAt: "",
        });
    };

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="text-3xl font-bold mb-6">Event Creation</div>
            <Formik
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            >
                <Form
                    className="w-2/3 md:w-2/4 flex flex-col gap-1">
                    <p className="text-gray-700">Event</p>
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
                            type="datetime-local"
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

                    <p className="text-gray-700">Ticket</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <FieldArray name="eventTickets">
                            {({push, remove, form}) => (
                                <>
                                    {form.values.eventTickets.map((ticket: CreateEventTicketRequest, index: number) => (
                                        <div key={index} className="flex flex-col mb-2">
                                            <div className="mb-6">
                                                <Input
                                                    name={`eventTickets.${index}.name`}
                                                    label="Ticket Name"
                                                    type="text"
                                                    disabled={true}
                                                    value="Standard Ticket"
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <Input
                                                    name={`eventTickets.${index}.description`}
                                                    label="Ticket Description"
                                                    type="text"
                                                    disabled={true}
                                                    value="Standard ticket for attending the event."
                                                />
                                            </div>
                                            <FormInput
                                                name={`eventTickets.${index}.price`}
                                                label="Ticket Price"
                                                type="number"
                                            />
                                            <FormInput
                                                name={`eventTickets.${index}.slots`}
                                                label="Ticket Slots"
                                                type="number"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </FieldArray>
                    </div>

                    <p className="text-gray-700">Vouchers</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <FieldArray name="eventVouchers">
                            {({push, remove, form}) => (
                                <>
                                    {form.values.eventVouchers.map((voucher: CreateEventVoucherRequest, index: number) => (
                                        <div key={index} className="flex flex-col mb-2">
                                            <FormInput
                                                name={`eventVouchers.${index}.name`}
                                                label={`Voucher ${index + 1} Name`}
                                                type="text"
                                            />
                                            <FormInput
                                                name={`eventVouchers.${index}.description`}
                                                label={`Voucher ${index + 1} Description`}
                                                type="text"
                                            />
                                            <FormInput
                                                name={`eventVouchers.${index}.variableAmount`}
                                                label={`Voucher ${(index + 1)} Variable Amount`}
                                                type="number"
                                            />
                                            <FormInput
                                                name={`eventVouchers.${index}.startedAt`}
                                                label={`Voucher ${index + 1} Start Date`}
                                                type="datetime-local"
                                            />
                                            <FormInput
                                                name={`eventVouchers.${index}.endedAt`}
                                                label={`Voucher ${index + 1} End Date`}
                                                type="datetime-local"
                                            />
                                            <p
                                                className="flex text-red-400 hover:text-red-500 hover:cursor-pointer items-center align-middle justify-end gap-2"
                                                onClick={() => remove(index)}
                                            >
                                                <Icon icon="mdi:trash-can" className="w-4 h-4"/>
                                                <span>{`Voucher ${index + 1}`}</span>
                                            </p>
                                        </div>
                                    ))}
                                    <p
                                        className="flex text-blue-400 hover:text-blue-500 hover:cursor-pointer items-center align-middle gap-2"
                                        onClick={() => addVoucherField(push)}
                                    >
                                        <Icon icon="mdi:plus" className="w-5 h-5"/>
                                        <span>{`Voucher`}</span>
                                    </p>
                                </>
                            )}
                        </FieldArray>
                    </div>

                    <Button type="submit" className="w-full" color="primary">
                        Create
                    </Button>
                </Form>
            </Formik>
        </div>
    );
}