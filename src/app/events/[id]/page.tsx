'use client';

import { useParams } from 'next/navigation';
import {
    FC,
    useEffect,
} from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { eventApi } from "@/src/stores/apis/eventApi";

const EventDetail: FC = () => {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const { data, isSuccess } = eventApi.useGetEventDetailsQuery({ id });

    useEffect(() => {
        if (!id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
                .test(id)) {
            window.location.replace('/404');
        }
    }, [isSuccess, data, id, router]);

    return (
        <div className="font-sans text-gray-900">
            {/* Header Section */}
            <section className="relative w-full h-auto bg-gray-200">
                <div className="w-full h-[300px] bg-gray-300 flex justify-center items-center">
                    <div className="text-gray-400">Event Cover Image</div>
                </div>
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
                        <span className="material-icons text-gray-600">calendar_today</span>
                        <p className="text-gray-800">{ data?.data?.time || "Event Time" }</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="material-icons text-gray-600">place</span>
                        <a
                            href={ data?.data?.location || "#" }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            View Location
                        </a>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">By { data?.data?.organizerAccount.name || "Organizer Name" }</p>

                {/* Pricing and Slots */}
                <div className="flex flex-col items-center md:flex-row justify-between bg-gray-100 p-4 rounded-lg mb-6">
                    <p className="text-gray-700">
                        Price <span className="font-bold">
                        { data?.data?.price || "free" }
                        </span>
                    </p>
                    <p className="text-gray-700">
                        <span className="font-bold">{ data?.data?.numberOfParticipants || "0" }</span> people are participating •{" "}
                        <span className="font-bold">{ ((data?.data?.numberOfParticipants || 0) - (data?.data?.slots || 0)) }</span> slots left!
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