"use client"
import {
    FC,
    useCallback,
    useEffect,
} from 'react';
import { Button, Image } from '@nextui-org/react';
import NavBar from "@/src/components/NavBar";
import useBasicEvent from '@/src/hooks/useBasicEvent';
import debounce from 'lodash/debounce';

const LandingPage: FC = () => {
    const { data, isLoading, category, page, setCategory, setPage } = useBasicEvent();
    const categories = ['All', 'Sports', 'Entertainment', 'Conference',
        'Networking', 'Health', 'Literature', 'Art', 'Workshop', 'Education',]

    const handleScroll = useCallback(() => {
        const bottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1;
        if (bottom && !isLoading) {
            setPage(page + 1);
        }
    }, [isLoading, page, setPage]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceHandleScroll = useCallback(debounce(handleScroll, 200), [handleScroll]);

    useEffect(() => {
        window.addEventListener('scroll', debounceHandleScroll);
        return () => {
            window.removeEventListener('scroll', debounceHandleScroll);
        };
    }, [debounceHandleScroll]);

    return (
        <div className="font-sans text-gray-900">
            <NavBar />

            {/* Hero Section */}
            <section className="w-full relative h-auto bg-cover bg-center bg-gray-200 overflow-x-auto">
                <div className="flex w-auto h-auto space-x-4">
                    <div className="flex-shrink-0 w-[100vw] h-72 bg-black flex justify-center items-center opacity-50">
                        <div></div>
                    </div>
                    <div className="flex-shrink-0 w-[100vw] h-72 bg-black flex justify-center items-center opacity-50">
                        <div></div>
                    </div>
                    <div className="flex-shrink-0 w-[100vw] h-72 bg-black flex justify-center items-center opacity-50">
                        <div></div>
                    </div>
                </div>
            </section>

            <nav className="flex justify-center w-full bg-gray-100 overflow-x-auto">
                <div className="flex w-auto space-x-4 p-4">
                    {categories.map((optionCategory) => (
                        <Button
                            key={optionCategory}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                optionCategory === category ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'
                            }`}
                            onClick={() => setCategory(optionCategory)}
                        >
                            {optionCategory}
                        </Button>
                    ))}
                </div>
            </nav>

            {/* Event Overview */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-5">
                    {data?.map((event, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <Image src="/image.jpg" alt='event' className="w-full h-40 object-cover rounded-md mb-4"/>
                            <h3 className="text-lg font-bold">{event.name}</h3>
                            <h5 className="text-lg font-medium">{event.time}</h5>
                            <div className="flex justify-between">
                                <div>{event.price}</div>
                                <div>{event.slots} Participant(s)</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center mt-4">
                            <span>Loading more events...</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;