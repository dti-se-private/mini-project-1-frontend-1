'use client'

import {Avatar, Input} from "@nextui-org/react";
import {SearchIcon} from "@nextui-org/shared-icons";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import Link from "next/link";

export default function Component() {
    const {state} = useAuthentication();

    return (
        <header className="bg-white shadow-md flex justify-center items-center h-[10vh]">
            <div className="container p-4 flex justify-center items-center">
                <h1 className="w-1/5 flex text-xl font-semibold text-black">
                    <Link href="/">Eventee</Link>
                </h1>
                <div className="flex w-3/5 justify-center">
                    <Input
                        type="text"
                        placeholder="Search.."
                        startContent={<SearchIcon className="text-gray-500"/>}
                    />
                </div>
                <div className="flex w-1/5 justify-end">
                    <Avatar src={state.account?.profileImageUrl} size="md"/>
                </div>
            </div>
        </header>
    );
};
