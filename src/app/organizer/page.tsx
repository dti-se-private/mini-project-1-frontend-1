"use client"
import {Spinner} from "@nextui-org/spinner";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {useOrganizerEvents} from "@/src/hooks/useOrganizerEvents";
import Link from "next/link";
import {useOrganizerEvent} from "@/src/hooks/useOrganizerEvent";
import {useModal} from '@/src/hooks/useModal';
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {useEffect, useState} from "react";
import {SharedSelection} from "@nextui-org/system";
import {ChevronDownIcon} from "@nextui-org/shared-icons";
import {statisticApi} from "@/src/stores/apis/statisticApi";

export default function Page() {
    const {organizerEventApiResult, organizerState, setPage} = useOrganizerEvents();
    const {deleteEvent} = useOrganizerEvent();
    const modal = useModal();

    const handleDeleteEvent = (id: string) => {
        return deleteEvent({id})
            .then((data) => {
                modal.setContent({
                    header: "Delete Event Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Delete Event Failed",
                    body: `${error.data.message}`,
                })
            })
            .finally(() => {
                modal.onOpenChange(true)
                organizerEventApiResult.refetch();
            });
    }

    const [selectedTypes, setSelectedTypes] = useState(new Set<string>(["transactionAmount"]));
    const [selectedAggregations, setSelectedAggregations] = useState(new Set<string>(["sum"]));
    const [selectedPeriods, setSelectedPeriods] = useState(new Set<string>(["day"]));

    const dropdownTypes: Record<string, string> = {
        transactionAmount: "Transaction Amount",
        participantCount: "Participant Count",
    }
    const dropdownAggregations: Record<string, string> = {
        sum: "Sum",
        average: "Average"
    }
    const dropdownPeriods: Record<string, string> = {
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
    }

    const retrieveEventStatisticApiResult = statisticApi.useRetrieveEventStatisticQuery({
        type: Array.from(selectedTypes)[0],
        aggregation: Array.from(selectedAggregations)[0],
        period: Array.from(selectedPeriods)[0],
    });

    useEffect(() => {
        retrieveEventStatisticApiResult.refetch();
    }, [selectedTypes, selectedAggregations, selectedPeriods]);

    return (
        <div className="py-8 px-12 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="min-w-[90vw] min-h-[80vh] flex flex-col justify-start items-between mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-2xl font-bold">Statistics</div>
                        <div className="flex gap-4">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="capitalize"
                                        startContent={<ChevronDownIcon/>}
                                    >
                                        {
                                            Array
                                                .from(selectedTypes)
                                                .map((key) => dropdownTypes[key])
                                                [0]
                                        }
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    selectedKeys={selectedTypes}
                                    selectionMode="single"
                                    onSelectionChange={(keys: SharedSelection) => setSelectedTypes(keys as Set<string>)}
                                >
                                    {
                                        Object.entries(dropdownTypes).map(([key, value]) => (
                                            <DropdownItem key={key}>{value}</DropdownItem>
                                        ))
                                    }
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="capitalize"
                                        startContent={<ChevronDownIcon/>}
                                    >
                                        {
                                            Array
                                                .from(selectedAggregations)
                                                .map((key) => dropdownAggregations[key])
                                                [0]
                                        }
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    selectedKeys={selectedAggregations}
                                    selectionMode="single"
                                    onSelectionChange={(keys: SharedSelection) => setSelectedAggregations(keys as Set<string>)}
                                >
                                    {
                                        Object.entries(dropdownAggregations).map(([key, value]) => (
                                            <DropdownItem key={key}>{value}</DropdownItem>
                                        ))
                                    }
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="capitalize"
                                        startContent={<ChevronDownIcon/>}
                                    >
                                        {
                                            Array
                                                .from(selectedPeriods)
                                                .map((key) => dropdownPeriods[key])
                                                [0]
                                        }
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    selectedKeys={selectedPeriods}
                                    selectionMode="single"
                                    onSelectionChange={(keys: SharedSelection) => setSelectedPeriods(keys as Set<string>)}
                                >
                                    {
                                        Object.entries(dropdownPeriods).map(([key, value]) => (
                                            <DropdownItem key={key}>{value}</DropdownItem>
                                        ))
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="w-full h-full flex justify-center items-center p-4">
                        <LineChart data={retrieveEventStatisticApiResult.data?.data ?? []} width={1024} height={400}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="x"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="y"/>
                        </LineChart>
                    </div>
                </div>
                <div className="w-full h-full flex flex-col justify-start items-between">
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
                            <TableColumn>Time</TableColumn>
                            <TableColumn>Participant Count</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={organizerEventApiResult.isLoading ? <Spinner/> : "Empty!"}>
                            {(organizerEventApiResult.data?.data ?? []).map((event, index) => (
                                <TableRow key={event.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{event.id}</TableCell>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{event.time}</TableCell>
                                    <TableCell>{event.participantCount}</TableCell>
                                    <TableCell className="flex gap-4">
                                        <Button
                                            color="primary"
                                            as={Link}
                                            href={`/organizer/events/${event.id}`}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            color="danger"
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            onClick={() => setPage(organizerState.currentPage - 1)}
                            disabled={organizerState.currentPage === 0}
                        >
                            {'<'}
                        </Button>
                        <Button>
                            {organizerState.currentPage + 1}
                        </Button>
                        <Button
                            onClick={() => setPage(organizerState.currentPage + 1)}
                        >
                            {'>'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
