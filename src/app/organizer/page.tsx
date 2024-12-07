"use client"
import {Button, Spinner} from '@nextui-org/react';
import moment from 'moment';
import {useOrganizerEvents} from "@/src/hooks/useOrganizerEvents";
import Link from "next/link";

export default function Page() {
    const {organizerEventApiResult, eventManagementState, setPage} = useOrganizerEvents();

    return (
        <div className="container mx-auto p-4 min-h-[80vh]">
            {/* Header */}
            <header className="flex items-center content-start mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                {!organizerEventApiResult.isLoading && organizerEventApiResult.data?.data?.length !== 0 && (
                    <Button as={Link} href='/organizer/create'
                        className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add more event
                    </Button>
                )}
            </header>

            {!organizerEventApiResult.isLoading && organizerEventApiResult.data?.data?.length !== 0 && (
            <>
                {/* Table */}
                <section className="w-full overflow-auto">
                    <table className="w-full text-left border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">
                                #
                            </th>
                            <th className="border border-gray-300 px-4 py-2">Event ID</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Date Time</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {organizerEventApiResult.data?.data?.map((event, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{event.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{event.name}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {moment(event.time).format('YYYY-MM-DD HH:mm')}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <Button as={Link} href={`/events/${event.id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white">
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => setPage(eventManagementState.currentPage - 1)}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {eventManagementState.currentPage + 1}
                    </Button>
                    <Button
                        onClick={() => setPage(eventManagementState.currentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
                {/* Pagination */}
            </>
            )}
            {organizerEventApiResult.isLoading && (<Spinner/>)}
            {!organizerEventApiResult.isLoading && organizerEventApiResult.data?.data?.length === 0 && (
                <div className="flex justify-center text-black">
                    Empty!&nbsp;<Link className="text-blue-400" href={'/organizer/create'}>Create one?</Link>
                </div>
            )}
        </div>
    );
};
