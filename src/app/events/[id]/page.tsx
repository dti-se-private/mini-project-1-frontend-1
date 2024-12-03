'use client';
import {useParams} from 'next/navigation';
import {FC} from "react";
import {Button, Image, Spinner} from "@nextui-org/react";
import {eventApi} from "@/src/stores/apis/eventApi";
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
        <div className="font-sans text-gray-900">
            {/* Header Section */}
            <section className="relative w-full flex justify-center">
                <Image
                    className="w-full h-[75vh] object-cover"
                    src={`https://placehold.co/1366x768?text=EventCover`}
                    alt="Event Cover"
                />
            </section>

            {/* Event Details Section */}
            <section className="p-6 md:p-10 bg-white">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    { data?.data?.name || "Event Name" }
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                    { data?.data?.description || "Event Description" }
                </p>

                {/* Event Details */}
                <div className="flex flex-col md:flex-row md:space-x-10 mb-6">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <p className="text-gray-800">
                            {moment(data?.data?.time).format('LT [on] DD/MM/YYYY')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="material-icons text-gray-600">place:&nbsp;</span>
                        { data?.data?.location || "#" }
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">By&nbsp;
                    <span className="font-semibold text-gray-800">
                        { data?.data?.organizerAccount.name || "Organizer Name" }
                    </span>
                </p>

                {/* Pricing and Slots */}
                <div className="flex flex-col items-center md:flex-row justify-between bg-gray-100 p-4 rounded-lg mb-6">
                    <p className="text-gray-700">
                        Price <span className="font-bold">
                        {currencyFormatter.format(data?.data?.eventTickets[0].price || 0) || "free" }
                        </span>
                    </p>
                    <p className="text-gray-700">
                        <span className="font-bold">{ data?.data?.numberOfParticipants || 0 }</span> people are participating •{" "}
                        <span className="font-bold">{ ((data?.data?.eventTickets[0].slots || 0) - (data?.data?.numberOfParticipants || 0)) }</span> slots left!
                    </p>
                </div>

                {/* Call to Action */}
                <div className="flex justify-center">
                    <Button className="px-8 py-3 text-white bg-blue-600 hover:bg-blue-700">
                        Participate
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default EventDetail;