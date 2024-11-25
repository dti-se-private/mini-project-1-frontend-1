"use client"
import { FC, useState } from 'react';
import { Button, Image } from '@nextui-org/react';
import NavBar from "@/src/components/NavBar";

const LandingPage: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Music', 'Technology', 'Art', 'Sports'];

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
                <div className="flex w-1/2 space-x-4 p-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                selectedCategory === category ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'
                            }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </nav>

            {/* Event Overview */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                    {/* Example Event 1 */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <Image src="/event1.jpg" alt="Event 1" className="w-full h-40 object-cover rounded-md mb-4"/>
                        <h3 className="text-lg font-bold">Event Title 1</h3>
                        <h5 className="text-lg font-medium">Day, d Month yyyy at tt:ss UTC+TZ</h5>
                        <div className="flex justify-between">
                            <div>Rp000.000</div>
                            <div>000 Participant(s)</div>
                        </div>
                    </div>
                    {/* Example Event 2 */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <Image src="/event2.jpg" alt="Event 2" className="w-full h-40 object-cover rounded-md mb-4"/>
                        <h3 className="text-lg font-bold">Event Title 2</h3>
                        <h5 className="text-lg font-medium">Day, d Month yyyy at tt:ss UTC+TZ</h5>
                        <div className="flex justify-between">
                            <div>Rp000.000</div>
                            <div>000 Participant(s)</div>
                        </div>
                    </div>
                    {/* Example Event 3 */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <Image src="/event2.jpg" alt="Event 2" className="w-full h-40 object-cover rounded-md mb-4"/>
                        <h3 className="text-lg font-bold">Event Title 3</h3>
                        <h5 className="text-lg font-medium">Day, d Month yyyy at tt:ss UTC+TZ</h5>
                        <div className="flex justify-between">
                            <div>Rp000.000</div>
                            <div>000 Participant(s)</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;