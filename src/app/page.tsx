"use client"
import {Button, Image} from '@nextui-org/react';
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
        currencySign: 'accounting'
    });

    return (
        <div className="mb-8">
            {/* Hero */}
            <section className="w-full mb-8">
                <Swiper
                    loop={true}
                    autoplay={true}
                    modules={[Pagination]}
                    slidesPerView={1.5}
                    centeredSlides={true}
                    pagination={{clickable: true}}
                >
                    {
                        [1, 2, 3].map((item, index) => (
                            <SwiperSlide key={index}>
                                <Image
                                    className="w-full h-[75vh]"
                                    radius="md"
                                    src={`https://placehold.co/1366x768?text=hero${item}`}
                                    alt="hero"
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section>

            {/* Categories */}
            <section className="container flex flex-col justify-center items-center mb-8">
                <div className="flex justify-center items-center gap-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => landing.setCategory(category)}
                        >
                            {upperFirst(category)}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Events */}
            <section className="container flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                    {landing.searcherState.events.map((event, index) => (
                        <Link
                            href={`/events/${event.id}`}
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
                        </Link>
                    ))}
                    {landing.eventApiResult.isLoading && (
                        <div className="flex justify-center mt-4">
                            Loading...
                        </div>
                    )}
                    {landing.searcherState.events.length === 0 && (
                        <div className="flex justify-center mt-4">
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
