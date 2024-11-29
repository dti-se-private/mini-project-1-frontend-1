import {Avatar, Input} from "@nextui-org/react";
import {SearchIcon} from "@nextui-org/shared-icons";

export default function Header() {
    return (
        <header className="bg-white shadow-md flex justify-center items-center p-4">
            <div className="container flex justify-center items-center">
                <h1 className="w-1/5 flex text-xl font-semibold text-black">Eventee</h1>
                <div className="flex w-3/5 justify-center">
                    <Input
                        type="text"
                        placeholder="Search.."
                        startContent={<SearchIcon className="text-gray-500"/>}
                    />
                </div>
                <div className="flex w-1/5 justify-end">
                    <Avatar src="/profile-pic.jpg" size="md"/>
                </div>
            </div>
        </header>
    );
};
