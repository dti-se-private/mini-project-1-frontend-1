'use client';
import {useParams} from 'next/navigation';
import {FC} from "react";
import {Avatar, Button, Image, Spinner} from "@nextui-org/react";
import {eventApi} from "@/src/stores/apis/eventApi";
import {Icon} from "@iconify/react";
import moment from "moment";

const EventDetail: FC = () => {
    const { id } = useParams() as { id: string };
    const { data, isLoading } = eventApi.useGetEventDetailsQuery({ id });

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting'
    });

    if (isLoading) {
        return <Spinner />;
    }

    if (!isLoading && !data?.data) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                No Event Found!
            </div>
        );
    }

    return (
        <div className="font-sans text-black">
            {/* Header Section */}
            <section className="relative w-full flex justify-center">
                <Image
                    className="w-full h-[75vh] object-cover"
                    src={`https://placehold.co/1366x768?text=EventCover`}
                    alt="Event Cover"
                />
            </section>

            {/* Event Details Section */}
            <section className="flex flex-col gap-4 p-6 md:p-10 bg-white">
                <h1 className="text-3xl md:text-9xl font-bold md:font-semibold">
                    { data?.data?.name || "Event Name" }
                </h1>
                <p className="text-lg md:text-xl mb-2">
                    { data?.data?.description || "Event Description" }
                </p>

                {/* Event Details */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center space-x-2 md:mb-0">
                        <Icon icon="mdi-light:calendar" />
                        <p>
                            {moment(data?.data?.time).format('LT [on] DD/MM/YYYY')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Icon icon="mdi-light:map-marker" />
                        <span className="material-icons">place:&nbsp;</span>
                        { data?.data?.location || "#" }
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <Avatar
                        isBordered
                        as="button"
                        size="sm"
                        src={data?.data?.organizerAccount.profileImageUrl}
                    />
                    <p className="text-sm">By&nbsp;
                        <span className="font-semibold">
                            {data?.data?.organizerAccount.name || "Organizer Name"}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col bg-gray-100 py-4 gap-4 rounded-lg mb-6 items-center">
                    {/* Pricing and Slots */}
                    <div className="flex items-center gap-1 md:gap-4 text-sm md:text-base">
                        <p>
                            Price <span className="font-bold">
                        {currencyFormatter.format(data?.data?.eventTickets[0].price || 0) || "free"}
                        </span>
                        </p>
                        <p>•</p>
                        <p>
                            <span className="font-bold">{data?.data?.numberOfParticipants || 0}</span> people are
                            participating
                        </p>
                        <p>•</p>
                        <p>
                        <span
                            className="font-bold">{((data?.data?.eventTickets[0].slots || 0) - (data?.data?.numberOfParticipants || 0))}</span> slots
                            left!
                        </p>
                    </div>

                    {/* Call to Action */}
                    <div className="flex justify-center w-full px-4">
                        <Button className="w-full px-8 py-5 text-white bg-blue-600 hover:bg-blue-700">
                            Participate
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventDetail;