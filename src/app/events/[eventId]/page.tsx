'use client';
import {useParams, useRouter} from 'next/navigation';
import {Avatar, Button, Spinner} from "@nextui-org/react";
import {eventApi} from "@/src/stores/apis/eventApi";
import {Icon} from "@iconify/react";
import moment from "moment";
import Image from "next/image";

export default function Page() {
    const {eventId}: { eventId: string } = useParams();
    const {data, isLoading} = eventApi.useRetrieveEventQuery({id: eventId})
    const router = useRouter();

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

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

    return (
        <div className="pb-8 flex flex-col justify-center items-center">
            {/* Hero */}
            <section className="w-full h-[90vh] relative mb-12">
                <Image
                    src={data?.data?.bannerImageUrl ?? "https://placehold.co/1366x768?text=Loading..."}
                    layout="fill"
                    objectFit="cover"
                    alt="Event Banner"
                />
            </section>

            {/* Details */}
            <section className="container flex flex-col px-12 gap-4 bg-white">
                <h1 className="text-5xl md:text-8xl font-bold ">
                    {data?.data?.name}
                </h1>
                <p className="text-lg md:text-xl mb-2">
                    {data?.data?.description}
                </p>

                {/* Event */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2 md:mb-0">
                        <Icon icon="mdi-light:calendar" className="h-6 w-6"/>
                        <p>
                            {moment(data?.data?.time).format('dddd, DD MMMM YYYY [at] HH.mm [UTC]Z')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon icon="mdi-light:map-marker" className="h-6 w-6"/>
                        <p>{data?.data?.location}</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center mb-3">
                    <Avatar
                        isBordered
                        as="button"
                        size="sm"
                        src={data?.data?.organizerAccount.profileImageUrl}
                    />
                    <p className="text-sm">By&nbsp;
                        <span className="font-semibold">
                            {data?.data?.organizerAccount.name}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col w-full bg-gray-100 py-4 gap-4 rounded-lg mb-6 items-center">
                    {/* Pricing and Slots */}
                    <div
                        className="flex md:flex-row flex-col justify-center items-center gap-1 md:gap-4 text-sm md:text-base font-semibold text-center">
                        <p className="px-4">
                            Price {data?.data?.eventTickets[0]?.price ? currencyFormatter.format(data?.data?.eventTickets[0]?.price) : "FREE"}
                        </p>
                        <p className="hidden md:flex">•</p>
                        <p className="px-4">
                            {data?.data?.participantCount} people are participating
                        </p>
                        <p className="hidden md:flex">•</p>
                        <p className="px-4">
                            {data?.data?.eventTickets[0].slots} slots left!
                        </p>
                    </div>

                    {/* Call to Action */}
                    <div className="flex justify-center w-full px-4">
                        <Button
                            color="primary"
                            className="w-full px-8 py-5"
                            onClick={() => router.push(`/events/${eventId}/checkout`)}
                        >
                            Participate
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
