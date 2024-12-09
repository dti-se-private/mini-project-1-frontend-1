'use client';
import * as Yup from "yup";
import {Button, Input, Spinner} from '@nextui-org/react';
import {Field, FieldArray, Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {useParams} from 'next/navigation';
import {organizerEventApi, PatchEventRequest, PatchEventVoucherResponse,} from "@/src/stores/apis/organizerEventApi";
import {useOrganizerEvents} from "@/src/hooks/useOrganizerEvent";
import {Icon} from "@iconify/react";
import {RetrieveEventResponse, RetrieveEventTicketResponse,} from "@/src/stores/apis/eventApi";
import {useModal} from '@/src/hooks/useModal';
import Json from "@/src/components/Json";
import moment from "moment/moment";

export default function Page() {
    const modal = useModal();
    const {
        setIsLoading,
        patchEvent,
    } = useOrganizerEvents();

    const {id}: { id: string } = useParams();
    const {data, isLoading} = organizerEventApi.useGetEventDetailsQuery({id});

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Spinner/>
            </div>
        );
    }

    if (!isLoading && !data?.data) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                Event not found!
            </div>
        );
    }

    const initialValues: PatchEventRequest | RetrieveEventResponse = {
        id: data?.data?.id ?? "",
        name: data?.data?.name ?? "",
        description: data?.data?.description ?? "",
        location: data?.data?.location ?? "",
        category: data?.data?.category ?? "",
        time: data?.data?.time ?? "",
        bannerImageUrl: data?.data?.bannerImageUrl ?? "",
        eventTickets: data?.data?.eventTickets ?? [] as RetrieveEventTicketResponse[],
        eventVouchers: data?.data?.eventVouchers ?? [] as PatchEventVoucherResponse[],
    };

    const validationSchema = () => {
        const schemaFields = {
            name: Yup.string().required("Event name is required."),
            description: Yup.string().required("Description is required."),
            location: Yup.string().required("Location is required."),
            category: Yup.string().required("Category is required."),
            time: Yup.string().required("Time is required."),
            eventTickets: Yup.array().of(
                Yup.object({
                    price: Yup.number().required("Price is required."),
                    slots: Yup.number().required("Slots is required."),
                })
            ),
            eventVouchers: Yup.array().of(
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
        modal.setContent({
            header: "Are you sure?",
            body: (<>
                <div>
                    <p>
                        Please confirm that your action is correct.
                    </p>
                    <p>
                        Once confirmed, changes cannot be undone.
                    </p>
                </div>
                <div>
                    <Button color="danger" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={() => handleConfirmSubmit(values, actions)}>Confirm</Button>
                </div>
            </>),
        })
        modal.onOpenChange(true);
    };

    const handleConfirmSubmit = (values: typeof initialValues, actions: { resetForm: () => void; }) => {
        setIsLoading(true);

        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const request: PatchEventRequest = {
            ...values,
            time: moment(values.time).utcOffset(currentTimeZone).toISOString(),
            eventVouchers: values.eventVouchers.map((voucher) => ({
                ...voucher,
                startedAt: moment(voucher.startedAt).utcOffset(currentTimeZone).toISOString(),
                endedAt: moment(voucher.endedAt).utcOffset(currentTimeZone).toISOString(),
            }))
        }

        return patchEvent(request)
            .then((data) => {
                modal.setContent({
                    header: "Update Event Succeed",
                    body: <Json value={data}/>,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Update Event Failed",
                    body: <Json value={error}/>,
                })
            })
            .finally(() => {
                setIsLoading(false);
                modal.onOpenChange(true)
            });
    };

    const handleCancel = () => {
        modal.onOpenChange(false);
    };

    const addVoucherField = (push: (voucher: PatchEventVoucherResponse) => void) => {
        const newVoucher = {
            id: "",
            code: "",
            name: "",
            description: "",
            variableAmount: 0,
            startedAt: "",
            endedAt: "",
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

                    {/* Ticket Details */}
                    <p className="text-gray-700">Ticket details</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <FieldArray name="eventTickets">
                            {({form}) => (
                                <div>
                                    {form.values.eventTickets.map((ticket: RetrieveEventTicketResponse, index: number) => (
                                        <div key={index}>
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
                                            <div className="mb-6">
                                                <Field
                                                    key={`ticket-price-${index}`}
                                                    name={`eventTickets[${index}].price`}
                                                    label="Ticket price"
                                                    type="number"
                                                    as={Input}
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <Field
                                                    key={`ticket-slots-${index}`}
                                                    name={`eventTickets[${index}].slots`}
                                                    label="Ticket Slots"
                                                    type="number"
                                                    as={Input}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FieldArray>
                    </div>

                    {/* Voucher Details */}
                    <p className="text-gray-700">Voucher details</p>
                    <div className="flex flex-col gap-1 mb-3">
                        <FieldArray name="eventVouchers">
                            {({push, remove, form}) => (
                                <div>
                                    {form.values.eventVouchers.map((voucher: PatchEventVoucherResponse, index: number) => (
                                        <div key={index} className="flex flex-col mb-2">
                                            <div className="mb-6">
                                                <Field
                                                    name={`eventVouchers[${index}].name`}
                                                    label={`Voucher Name ${index + 1}`}
                                                    type="text"
                                                    as={Input}
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <Field
                                                    name={`eventVouchers[${index}].description`}
                                                    label={`Voucher Description ${index + 1}`}
                                                    type="text"
                                                    as={Input}
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <Field
                                                    name={`eventVouchers[${index}].variableAmount`}
                                                    label={`Voucher Variable Amount ${(index + 1)}`}
                                                    type="number"
                                                    as={Input}
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <Field
                                                    name={`eventVouchers[${index}].startedAt`}
                                                    label={`Voucher Start Date ${index + 1}`}
                                                    type="datetime-local"
                                                    as={Input}
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <Field
                                                    name={`eventVouchers[${index}].endedAt`}
                                                    label={`Voucher End Date ${index + 1}`}
                                                    type="datetime-local"
                                                    as={Input}
                                                />
                                            </div>
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
                    <Button type="submit" className="w-full" color="primary">
                        Update
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};
