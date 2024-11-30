"use client"
import {
    FC,
    useCallback,
    useEffect,
} from 'react';
import { Button, Image } from '@nextui-org/react';
import { useLanding } from '@/src/hooks/useLanding';
import debounce from 'lodash/debounce';

const LandingPage: FC = () => {
    const { api, state, setCategory, setPage } = useLanding();
    const categories = ['All', 'Sports', 'Entertainment', 'Conference',
        'Networking', 'Health', 'Literature', 'Art', 'Workshop', 'Education',]

    const handleScroll = useCallback(() => {
        const bottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1;
        if (bottom) {
            setPage(state.page + 1);
        }
    }, [state.page, setPage]);

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
            {/* Hero Section */}
            <section className="w-full relative h-auto bg-cover bg-center bg-gray-200 overflow-x-auto">
                <div className="flex w-auto h-auto space-x-4">
                    <div className="flex-shrink-0 w-[100vw] bg-black flex overflow-hidden">
                        <Image src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt='event'/>
                    </div>
                    <div className="flex-shrink-0 w-[100vw] bg-black flex overflow-hidden">
                        <Image src="https://images.pexels.com/photos/14585155/pexels-photo-14585155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt='event'/>
                    </div>
                    <div className="flex-shrink-0 w-[100vw] bg-black flex overflow-hidden">
                        <Image src="https://images.pexels.com/photos/69866/pexels-photo-69866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt='event'/>
                    </div>
                </div>
            </section>

            <nav className="flex justify-center w-full bg-gray-100 overflow-x-auto">
                <div className="flex w-auto space-x-4 p-4">
                    {categories.map((optionCategory) => (
                        <Button
                            key={optionCategory}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                optionCategory === state.category ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'
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
                    {state?.events?.map((event, index) => (
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
                    {api.isLoading && (
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