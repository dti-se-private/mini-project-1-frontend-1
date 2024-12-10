'use client';
import {Button, Spinner} from "@nextui-org/react";
import moment from "moment";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import * as Yup from "yup";
import Json from "@/src/components/Json";
import {
    TransactionCheckoutRequest,
    TransactionTicketCheckoutRequest,
    TransactionTicketFieldCheckoutRequest
} from "@/src/stores/apis/transactionApi";
import {useTransaction} from "@/src/hooks/useTransaction";
import {useModal} from '@/src/hooks/useModal';
import Image from "next/image";
import _ from "lodash";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {Icon} from "@iconify/react";
import FormikListener from "@/src/components/FormikListener";


export default function Page() {
    const authentication = useAuthentication();
    const modal = useModal();
    const transaction = useTransaction();

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const initialValues = {
        email: "",
        name: "",
        phone: "",
        dob: new Date(),
        points: 0,
        voucherCodes: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required."),
        email: Yup.string().email("Invalid email.").required("Email is required."),
        phone: Yup.string().required("Phone is required."),
        dob: Yup.date().required("Date of Birth is required."),
        points: Yup.number().min(0).max(transaction.state.event?.eventTickets[0].price ?? 0).required("Points is required."),
        voucherCodes: Yup.string(),
    });

    const handleSubmit = (values: typeof initialValues) => {
        if (!authentication.state.isLoggedIn) {
            modal.setContent({
                header: "Login Required",
                body: "Please login first before checkout."
            });
            modal.onOpenChange(true);
            return;
        }

        const event = transaction.state.event;
        const ticket = event?.eventTickets[0];
        const transactionTicketFields: TransactionTicketFieldCheckoutRequest[] = [
            {
                key: "name",
                value: values.name
            },
            {
                key: "email",
                value: values.email
            },
            {
                key: "phone",
                value: values.phone
            },
            {
                key: "dob",
                value: new Date(values.dob).toISOString(),
            }
        ]
        const transactionTicket: TransactionTicketCheckoutRequest = {
            eventTicketId: ticket!.id!,
            fields: transactionTicketFields
        }
        const request: TransactionCheckoutRequest = {
            eventId: transaction.eventId,
            transactionTickets: [transactionTicket],
            voucherCodes: values.voucherCodes.split(","),
            points: values.points,
        }

        transaction
            .checkout(request)
            .then((data) => {
                modal.setContent({
                    header: "Checkout Succeed",
                    body: <Json value={data ?? {}}/>,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Checkout Failed",
                    body: <Json value={error}/>,
                })
            }).finally(() => {
            modal.onOpenChange(true);
        });
    };

    const handleTrySubmit = (values: typeof initialValues) => {
        const event = transaction.state.event;
        const ticket = event?.eventTickets[0];
        const transactionTicketFields: TransactionTicketFieldCheckoutRequest[] = [
            {
                key: "name",
                value: values.name
            },
            {
                key: "email",
                value: values.email
            },
            {
                key: "phone",
                value: values.phone
            },
            {
                key: "dob",
                value: new Date(values.dob).toISOString(),
            }
        ]
        const transactionTicket: TransactionTicketCheckoutRequest = {
            eventTicketId: ticket!.id!,
            fields: transactionTicketFields
        }
        const request: TransactionCheckoutRequest = {
            eventId: transaction.eventId,
            transactionTickets: [transactionTicket],
            voucherCodes: values.voucherCodes.split(","),
            points: values.points,
        }
        transaction
            .tryCheckout(request)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleFormikChange = _.debounce((values: typeof initialValues) => {
        if (transaction.state.event && authentication.state.isLoggedIn) {
            handleTrySubmit(values);
        }
    }, 1000);

    if (transaction.eventApiResult.isLoading || !transaction.state.event) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Spinner/>
            </div>
        );
    }

    if (!transaction.eventApiResult.isLoading && !transaction.eventApiResult.data?.data) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                Event not found!
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-center min-h-[80vh]">
            <section className="container min-w-2/3 h-full py-12 flex flex-col justify-center items-center">
                <div className="w-2/3 flex flex-col justify-center items-start mb-8">
                    <div className="text-6xl font-bold">Order</div>
                    <div>All fields are required for ticket orders.</div>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="w-2/3">
                        <FormikListener onChange={handleFormikChange}/>
                        <FormInput name="name" label="Name" type="text"/>
                        <FormInput name="email" label="Email" type="email"/>
                        <FormInput name="phone" label="Phone" type="tel"/>
                        <FormInput name="dob" label="Date of Birth" type="date"/>
                        <FormInput name="points" label="Points" type="number"/>
                        <FormInput name="voucherCodes" label="Voucher Codes" type="text"/>
                        <Button type="submit" className="mt-4 w-full">
                            Checkout
                        </Button>
                    </Form>
                </Formik>
            </section>

            <section
                className="w-full md:w-1/3 h-[100vh] md:sticky md:right-0 md:top-0 md:bottom-0 flex flex-col justify-between items-center border-l border-gray-300">
                <div className="relative w-full h-2/5">
                    <Image
                        src={transaction.state.event?.bannerImageUrl ?? "https://placehold.co/1366x768?text=Loading..."}
                        layout="fill"
                        objectFit="cover"
                        alt="Event Banner"
                    />
                </div>
                <div className="flex w-full h-3/5 flex-col justify-between items-start p-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-2xl font-bold">Summary</div>
                        <div className="flex flex-col">
                            <div>
                                {transaction.state.event?.name}
                            </div>
                            <div className="overflow-hidden truncate w-full">
                                {transaction.state.event?.description}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2 md:mb-0">
                                <Icon icon="mdi-light:calendar" className="h-6 w-6"/>
                                <p>
                                    {moment(transaction.state.event?.time).format('dddd, DD MMMM YYYY [at] HH.mm [UTC]Z')}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Icon icon="mdi-light:map-marker" className="h-6 w-6"/>
                                <p>{transaction.state.event?.location}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        <div>Total</div>
                        <div>
                            {
                                transaction.state.triedCheckout?.finalPrice !== undefined ?
                                    currencyFormatter.format(transaction.state.triedCheckout.finalPrice)
                                    :
                                    currencyFormatter.format(transaction.state.event!.eventTickets[0].price)
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
};
