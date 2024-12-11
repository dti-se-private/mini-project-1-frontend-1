'use client';
import * as Yup from "yup";
import {Button, Spinner} from '@nextui-org/react';
import {FieldArray, Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {
    PatchEventRequest,
    PatchEventTicketRequest,
    PatchEventVoucherRequest
} from "@/src/stores/apis/organizerEventApi";
import {useOrganizerEvent} from "@/src/hooks/useOrganizerEvent";
import {Icon} from "@iconify/react";
import {
    RetrieveEventResponse,
    RetrieveEventTicketResponse,
    RetrieveEventVoucherResponse,
} from "@/src/stores/apis/eventApi";
import {useModal} from '@/src/hooks/useModal';
import Json from "@/src/components/Json";
import moment from "moment/moment";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";

export default function Page() {
    const modal = useModal();
    const organizerEvent = useOrganizerEvent();

    if (organizerEvent.retrieveEventApiResult.isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Spinner/>
            </div>
        );
    }

    if (!organizerEvent.retrieveEventApiResult.isLoading && !organizerEvent.retrieveEventApiResult.data) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                Event not found!
            </div>
        );
    }

    const initialValues: PatchEventRequest | RetrieveEventResponse = {
        id: organizerEvent.eventManagementState.event?.id ?? "",
        name: organizerEvent.eventManagementState.event?.name ?? "",
        description: organizerEvent.eventManagementState.event?.description ?? "",
        time: organizerEvent.eventManagementState.event?.time ?? "",
        location: organizerEvent.eventManagementState.event?.location ?? "",
        category: organizerEvent.eventManagementState.event?.category ?? "",
        bannerImageUrl: organizerEvent.eventManagementState.event?.bannerImageUrl ?? "",
        eventTickets: organizerEvent.eventManagementState.event?.eventTickets ?? [],
        eventVouchers: organizerEvent.eventManagementState.event?.eventVouchers ?? [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Event name is required."),
        description: Yup.string().required("Event description is required."),
        time: Yup.date().required("Event time is required."),
        location: Yup.string().required("Event location is required."),
        category: Yup.string().required("Event category is required."),
        bannerImageUrl: Yup.string(),
        eventTickets: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Ticket name is required."),
                description: Yup.string().required("Ticket description is required."),
                price: Yup.number().required("Ticket price is required.").min(0),
                slots: Yup.number().required("Ticket slots is required.").min(1),
                fields: Yup.array().of(
                    Yup.object().shape({
                        id: Yup.string().required("Field id is required."),
                        key: Yup.string().required("Field key is required."),
                    })
                )
            })
        ),
        eventVouchers: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Voucher name is required."),
                description: Yup.string().required("Voucher description is required."),
                code: Yup.string().required("Voucher code is required."),
                variableAmount: Yup.number().required("Voucher variable amount is required.").min(0).max(1),
                startedAt: Yup.date().required("Voucher started at is required."),
                endedAt: Yup.date().required("Voucher ended at is required."),
            })
        ),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        actions.setSubmitting(false);
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
                <div className="flex gap-2 justify-end">
                    <Button color="danger" onClick={() => modal.onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => handleConfirmSubmit(values)}>Confirm</Button>
                </div>
            </>),
        })
        modal.onOpenChange(true);
    };

    const handleConfirmSubmit = (values: typeof initialValues) => {
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

        return organizerEvent
            .patchEvent(request)
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
                modal.onOpenChange(true)
            });
    };

    const addVoucherField = (push: (voucher: RetrieveEventVoucherResponse) => void) => {
        push({
            id: "",
            code: "",
            name: "",
            description: "",
            variableAmount: 0,
            startedAt: "",
            endedAt: "",
        });
    };

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="text-3xl font-bold mb-6">Event Details</div>
                <Formik
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    enableReinitialize
                >
                    <Form className="w-2/3 md:w-2/4 flex flex-col gap-1 mb-12">
                        <p className="text-gray-700">Event</p>
                        <div className="flex flex-col gap-1 mb-3">
                            <FormInput
                                name="id"
                                label="Event Id"
                                type="text"
                                isDisabled
                            />
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
                            <FormInput
                                name="bannerImageUrl"
                                label="Event Banner Image URL"
                                type="text"
                            />
                        </div>

                        <p className="text-gray-700">Ticket</p>
                        <div className="flex flex-col gap-1 mb-3">
                            <FieldArray name="eventTickets">
                                {({form}) => (
                                    <div>
                                        {form.values.eventTickets.map((ticket: RetrieveEventTicketResponse | PatchEventTicketRequest, index: number) => (
                                            <div key={index} className="flex flex-col gap-1 mb-2">
                                                <FormInput
                                                    name={`eventTickets.${index}.name`}
                                                    label="Ticket Name"
                                                    type="text"
                                                    isDisabled
                                                />
                                                <FormInput
                                                    name={`eventTickets.${index}.description`}
                                                    label="Ticket Description"
                                                    type="text"
                                                    isDisabled
                                                />
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
                                    </div>
                                )}
                            </FieldArray>
                        </div>

                        <p className="text-gray-700">Vouchers</p>
                        <div className="flex flex-col gap-1 mb-3">
                            <FieldArray name="eventVouchers">
                                {({push, remove, form}) => (
                                    <div>
                                        {form.values.eventVouchers.map((voucher: RetrieveEventVoucherResponse | PatchEventVoucherRequest, index: number) => (
                                            <div key={index} className="flex flex-col gap-1 mb-2">
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
                                                    name={`eventVouchers.${index}.code`}
                                                    label={`Voucher ${index + 1} Code`}
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

                <div className="w-3/4 md:w-4/5 flex flex-col gap-1">
                    <p className="text-gray-700">Participants</p>
                    <Table className="min-h-[50vh] w-full text-left">
                        <TableHeader className="bg-gray-300">
                            <TableColumn>#</TableColumn>
                            <TableColumn>Account ID</TableColumn>
                            <TableColumn>Transaction ID</TableColumn>
                            <TableColumn>Event Ticket ID</TableColumn>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Email</TableColumn>
                            <TableColumn>Phone</TableColumn>
                            <TableColumn>Dob</TableColumn>
                        </TableHeader>
                        <TableBody
                            emptyContent={organizerEvent.retrieveEventApiResult.isLoading ? <Spinner/> : "Empty!"}>
                            {(organizerEvent.eventManagementState.event?.eventParticipants ?? []).map((participants, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{participants.accountId}</TableCell>
                                    <TableCell>{participants.transactionId}</TableCell>
                                    <TableCell>{participants.eventTicketId}</TableCell>
                                    <TableCell>{participants.fields.find((field) => field.key === "name")?.value}</TableCell>
                                    <TableCell>{participants.fields.find((field) => field.key === "email")?.value}</TableCell>
                                    <TableCell>{participants.fields.find((field) => field.key === "phone")?.value}</TableCell>
                                    <TableCell>{participants.fields.find((field) => field.key === "dob")?.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
