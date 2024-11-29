import {FC} from "react";
import { Button } from "@nextui-org/react";

const EventDetail: FC = () => {
    return (
        <div className="font-sans text-gray-900">
            {/* Header Section */}
            <section className="relative w-full h-auto bg-gray-200">
                <div className="w-full h-[300px] bg-gray-300 flex justify-center items-center">
                    <div className="text-gray-400">Event Cover Image</div>
                </div>
            </section>

            {/* Event Details Section */}
            <section className="p-6 md:p-10 bg-white">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    Community Service Project X: Making a Difference Together
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                    Join us for Community Service Project X, a transformative event
                    designed to bring our community together for a day of service,
                    learning, and connection. Whether you are a seasoned volunteer or new
                    to community service, this event offers a meaningful opportunity to
                    make a positive impact.
                </p>

                {/* Event Details */}
                <div className="flex flex-col md:flex-row md:space-x-10 mb-6">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <span className="material-icons text-gray-600">calendar_today</span>
                        <p className="text-gray-800">Sunday, January 2024 at 08:00 UTC+7</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="material-icons text-gray-600">place</span>
                        <a
                            href="https://maps.app.goo.gl/qP6FCU4JL7Dy464A"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            View Location
                        </a>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">By X Communities</p>

                {/* Pricing and Slots */}
                <div className="flex flex-col items-center md:flex-row justify-between bg-gray-100 p-4 rounded-lg mb-6">
                    <p className="text-gray-700">
                        Prices range from <span className="font-bold">Rp12.300</span> to{" "}
                        <span className="font-bold">Rp123.000</span>
                    </p>
                    <p className="text-gray-700">
                        <span className="font-bold">123</span> people are participating •{" "}
                        <span className="font-bold">123</span> slots left!
                    </p>
                </div>

                {/* Call to Action */}
                <div className="flex justify-center">
                    <Button className="px-8 py-3 text-white bg-blue-600 hover:bg-blue-700">
                        Participate
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default EventDetail;