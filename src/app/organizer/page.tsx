"use client"
import {Spinner} from "@nextui-org/spinner";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button} from "@nextui-org/react";
import moment from "moment";
import {useOrganizerEvents} from "@/src/hooks/useOrganizerEvents";
import Link from "next/link";

export default function Page() {
    const {organizerEventApiResult, eventManagementState, setPage} = useOrganizerEvents();

    return (
        <div className="py-8 px-12 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-between">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold">My Events</div>
                    <Button
                        as={Link}
                        href="/organizer/events/create"
                    >
                        Add New Event
                    </Button>
                </div>

                <Table className="min-h-[50vh] w-full text-left">
                    <TableHeader className="bg-gray-300">
                        <TableColumn>#</TableColumn>
                        <TableColumn>Event ID</TableColumn>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Date Time</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={organizerEventApiResult.isLoading ? <Spinner/> : "Empty!"}>
                        {(organizerEventApiResult.data?.data ?? []).map((event, index) => (
                            <TableRow key={event.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{event.id}</TableCell>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{moment(event.time).format("YYYY-MM-DD HH:mm")}</TableCell>
                                <TableCell>
                                    <Button
                                        as={Link}
                                        href={`/organizer/events/${event.id}`}
                                    >
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => setPage(eventManagementState.currentPage - 1)}
                        disabled={eventManagementState.currentPage === 0}
                    >
                        {'<'}
                    </Button>
                    <Button>
                        {eventManagementState.currentPage + 1}
                    </Button>
                    <Button
                        onClick={() => setPage(eventManagementState.currentPage + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
