"use client"
import {Button, Image, Spinner} from '@nextui-org/react';
import {useLanding} from '@/src/hooks/useLanding';
import Link from 'next/link'
import {upperFirst} from "tiny-case";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import moment from "moment";

export default function Page() {
    const landing = useLanding();
    const categories = ['all', 'sports', 'entertainment', 'conference', 'networking', 'health', 'literature', 'art', 'workshop', 'education']

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return (
        <div className="pb-8 flex flex-col justify-center items-center">
            {/* Hero */}
            <section className="w-full mb-8">
                <Swiper
                    loop={true}
                    autoplay={true}
                    modules={[Pagination]}
                    spaceBetween={15}
                    slidesPerView={1.5}
                    centeredSlides={true}
                    pagination={{clickable: true}}
                >
                    {
                        [1, 2, 3, 4].map((item, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    className="w-full h-[75vh]"
                                    radius="md"
                                    src={`https://placehold.co/1366x768?text=hero${index}`}
                                    alt="hero"
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section>

            {/* Categories */}
            <section className="container flex flex-col justify-center items-center mb-8">
                <div className="flex flex-wrap justify-center items-center gap-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => landing.setCategory(category)}
                            variant={(landing.searcherState.request.search === "" && category === "all") || (landing.searcherState.request.search === category) ? 'solid' : 'bordered'}
                        >
                            {upperFirst(category)}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Events */}
            <section className="container flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 min-h-[80vh]">
                    {landing.searcherState.events.map((event, index) => (
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
                    {landing.eventApiResult.isLoading && (<Spinner/>)}
                    {!landing.eventApiResult.isLoading && landing.searcherState.events.length === 0 && (
                        <div className="flex justify-center">
                            Empty!
                        </div>
                    )}
                </div>


                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => landing.setPage(landing.searcherState.request.page - 1)}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {landing.searcherState.request.page + 1}
                    </Button>
                    <Button
                        onClick={() => landing.setPage(landing.searcherState.request.page + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </section>
        </div>
    );
};
