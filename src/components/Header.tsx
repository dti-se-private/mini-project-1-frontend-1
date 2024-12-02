"use client"

import {Avatar, Input} from "@nextui-org/react";
import {SearchIcon} from "@nextui-org/shared-icons";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import Link from "next/link";
import {useSearch} from "@/src/hooks/useSearch";
import {useRouter} from "next/navigation";

export default function Component() {
    const authentication = useAuthentication();
    const search = useSearch();
    const router = useRouter();

    return (
        <header className="bg-white shadow-md flex justify-center items-center h-[10vh]">
            <div className="container p-4 flex justify-center items-center">
                <h1 className="w-1/5 flex text-xl font-semibold text-black">
                    <Link href="/">Eventee</Link>
                </h1>
                <div className="flex w-3/5 justify-center">
                    <Input
                        type="text"
                        placeholder="Search..."
                        startContent={<SearchIcon className="text-gray-500"/>}
                        onChange={(event) => {
                            if (window.location.pathname !== "/search") {
                                router.push("/search");
                            }
                            search.setRequest({
                                ...search.searcherState.request,
                                search: event.target.value
                            });
                        }}
                    />
                </div>
                <div className="flex w-1/5 justify-end">
                    <Avatar src={authentication.state.account?.profileImageUrl} size="md"/>
                </div>
            </div>
        </header>
    );
};
