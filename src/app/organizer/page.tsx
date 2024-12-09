"use client"

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/table";
import { Button, Spinner } from "@nextui-org/react";
import moment from "moment";
import { useOrganizerEvents } from "@/src/hooks/useOrganizerEvents";
import Link from "next/link";

export default function Page() {
    const { organizerEventApiResult, eventManagementState, setPage } = useOrganizerEvents();

    return (
        <div className="container mx-auto p-4 min-h-[80vh]">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                {!organizerEventApiResult.isLoading &&
                    organizerEventApiResult.data?.data?.length !== 0 && (
                        <Button
                            as={Link}
                            href="/organizer/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Add more event
                        </Button>
                    )}
            </header>

            {!organizerEventApiResult.isLoading &&
            organizerEventApiResult.data?.data?.length !== 0 ? (
                <>
                    {/* Table */}
                    <section className="w-full overflow-auto">
                        <Table
                            aria-label="Event Management Table"
                            className="w-full border border-gray-300 text-left"
                        >
                            <TableHeader className="bg-gray-100">
                                <TableColumn>#</TableColumn>
                                <TableColumn>Event ID</TableColumn>
                                <TableColumn>Name</TableColumn>
                                <TableColumn>Date Time</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {(organizerEventApiResult.data?.data || []).map((event, index) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{event.id}</TableCell>
                                        <TableCell>{event.name}</TableCell>
                                        <TableCell>{moment(event.time).format("YYYY-MM-DD HH:mm")}</TableCell>
                                        <TableCell>
                                            <Button
                                                as={Link}
                                                href={`/organizer/${event.id}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>

                    {/* Pagination */}
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            onClick={() => setPage(eventManagementState.currentPage - 1)}
                            disabled={eventManagementState.currentPage === 0}
                        >
                            {'<'}
                        </Button>
                        <span className="px-4 py-2 border border-gray-300">
                          {eventManagementState.currentPage + 1}
                        </span>
                        <Button
                            onClick={() => setPage(eventManagementState.currentPage + 1)}
                        >
                            {'>'}
                        </Button>
                    </div>
                </>
            ) : organizerEventApiResult.isLoading ? (
                <Spinner className="mx-auto" />
            ) : (
                <div className="flex justify-center text-black">
                    Empty!&nbsp;
                    <Link className="text-blue-400" href="/organizer/create">
                        Create one?
                    </Link>
                </div>
            )}
        </div>
    );
}
