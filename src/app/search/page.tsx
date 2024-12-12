"use client"
import {Button, Checkbox, CheckboxGroup, Image, Spinner} from '@nextui-org/react';
import {useSearch} from "@/src/hooks/useSearch";
import moment from "moment";
import {upperFirst} from "tiny-case";
import Link from "next/link";

export default function Page() {
    const search = useSearch();
    const filters = ["name", "description", "category", "time", "location"]

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return (
        <div className="py-8 flex flex-col justify-center items-center">
            {/* Filters */}
            <section className="container flex justify-center items-center mb-8">
                <CheckboxGroup
                    defaultValue={filters}
                    onChange={(values) => search.setRequest({
                        ...search.searcherState.request,
                        filters: values
                    })}
                >
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        {filters.map((value, index) => (
                            <Checkbox
                                key={index}
                                value={value}
                            >
                                {upperFirst(value)}
                            </Checkbox>
                        ))}
                    </div>
                </CheckboxGroup>
            </section>

            {/* Events */}
            <section className="container flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 min-h-[80vh]">
                    {search.searcherState.events.map((event, index) => (
                        <Link
                            href={`/events/${event.id}`}
                            key={index}
                            className="flex flex-col justify-center items-center p-4 border-gray-300 rounded-lg shadow-md w-3/4 md:w-1/4 h-full"
                        >
                            <Image
                                className="w-full h-3/5 object-cover rounded-md mb-4"
                                src={event.bannerImageUrl ?? "https://placehold.co/1366x768?text=event"}
                                alt='event'
                            />
                            <div className="w-full h-1/5 flex flex-col justify-center items-start">
                                <h3 className="overflow-hidden truncate w-full text-lg font-bold">{event.name}</h3>
                                <h5 className="overflow-hidden truncate w-full">{moment(event.time).format('LT [on] DD/MM/YYYY [UTC]Z')}</h5>
                                <div className="overflow-hidden truncate w-full">{event.location}</div>
                                <div className="w-full h-1/5 flex justify-between">
                                    <div className="overflow-hidden truncate w-full">
                                        {
                                            event.eventTickets[0].price > 0 ?
                                                currencyFormatter.format(event.eventTickets[0].price) :
                                                "FREE"
                                        }
                                    </div>
                                    <div className="overflow-hidden truncate w-full text-right">
                                        {event.eventTickets[0].slots} Slots left!
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {search.eventApiResult.isLoading && (<Spinner/>)}
                    {!search.eventApiResult.isLoading && search.searcherState.events.length === 0 && (
                        <div className="flex justify-center">
                            Empty!
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => search.setPage(search.searcherState.request.page - 1)}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {search.searcherState.request.page + 1}
                    </Button>
                    <Button
                        onClick={() => search.setPage(search.searcherState.request.page + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </section>
        </div>
    )
        ;
};

