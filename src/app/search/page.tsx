"use client"
import {Button, Checkbox, CheckboxGroup, Image} from '@nextui-org/react';
import {useSearch} from "@/src/hooks/useSearch";
import moment from "moment";
import {upperFirst} from "tiny-case";

export default function Page() {
    const search = useSearch();
    const filters = ["name", "description", "category", "location", "time"]

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting'
    });

    return (
        <div className="my-8">
            {/* Filters */}
            <section className="container flex flex-col justify-center items-center mb-8">
                <CheckboxGroup
                    orientation="horizontal"
                    defaultValue={filters}
                    onChange={(values) => search.setRequest({
                        ...search.searcherState.request,
                        filters: values
                    })}
                >
                    {filters.map((value, index) => (
                        <Checkbox
                            className="mx-2"
                            key={index}
                            value={value}
                        >
                            {upperFirst(value)}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </section>

            {/* Events */
            }
            <section className="container flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                    {search.searcherState.events.map((event, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-center p-4 border-gray-300 rounded-lg shadow-md w-1/4 h-full"
                        >
                            <Image
                                className="w-full h-3/5 object-cover rounded-md mb-4"
                                src={event.bannerImageUrl}
                                alt='event'
                            />
                            <div className="w-full h-1/5 flex flex-col justify-center items-start">
                                <h3 className="text-lg font-bold">{event.name}</h3>
                                <h5 className="">{moment(event.time).format('LT [on] DD/MM/YYYY')}</h5>
                                <div className="w-full h-1/5 flex flex-row justify-between">
                                    <div>{currencyFormatter.format(event.eventTickets[0].price)}</div>
                                    <div>{event.eventTickets[0].slots} Participants</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {search.eventApiResult.isLoading && (
                        <div className="flex justify-center mt-4">
                            Loading...
                        </div>
                    )}
                    {search.searcherState.events.length === 0 && (
                        <div className="flex justify-center mt-4">
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

