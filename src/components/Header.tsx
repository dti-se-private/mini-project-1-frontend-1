"use client"
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Navbar,
    NavbarBrand,
    NavbarContent
} from "@nextui-org/react";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {useSearch} from "@/src/hooks/useSearch";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {SearchIcon} from "@nextui-org/shared-icons";
import {useModal} from "@/src/hooks/useModal";
import _ from "lodash";

export default function Component() {
    const modal = useModal();
    const authentication = useAuthentication();
    const search = useSearch();
    const router = useRouter();

    const handleLogout = (event: React.MouseEvent<HTMLLIElement>) => {
        authentication
            .logout()
            .then((data) => {
                modal.setContent({
                    header: "Logout Succeed",
                    body: `${data?.message}`,
                })
                router.push("/");
            })
            .catch((error) => {
                modal.setContent({
                    header: "Logout Failed",
                    body: `${error.message}`,
                })
            })
            .finally(() => {
                window.location.href = '/login';
                modal.onOpenChange(true);
            });
    }

    const handleSearch = _.debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        search.setRequest({
            ...search.searcherState.request,
            search: event.target.value
        });
    }, 500)

    return (
        <Navbar isBordered>
            <NavbarBrand className="w-1/5">
                <Link className="text-xl font-bold" href="/">Eventee</Link>
            </NavbarBrand>
            <NavbarContent as="div" className="w-3/5 items-center" justify="center">
                <Input
                    type="text"
                    placeholder="Search..."
                    startContent={<SearchIcon className="text-gray-500"/>}
                    onChange={(event) => {
                        if (window.location.pathname !== "/search") {
                            router.push("/search");
                        }
                        handleSearch(event);
                    }}
                />
            </NavbarContent>
            <NavbarContent as="div" className="w-1/5 items-center" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            size="sm"
                            src={authentication.state.account?.profileImageUrl}
                        />
                    </DropdownTrigger>
                    <DropdownMenu>
                        {authentication.state.isLoggedIn ?
                            (
                                <>
                                    <DropdownItem key="dashboard" className="gap-2">
                                        <p className="font-semibold">{authentication.state.account?.name}</p>
                                        <p className="font-semibold">{authentication.state.account?.email}</p>
                                    </DropdownItem>
                                    <DropdownSection showDivider title="Dashboard">
                                        <DropdownItem key="participant" href="/participant"
                                                      onClick={() => router.push("/participant")}>
                                            Participant
                                        </DropdownItem>
                                        <DropdownItem key="organizer" href="/organizer"
                                                      onClick={() => router.push("/organizer")}>
                                            Organizer
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection title="Account">
                                        <DropdownItem key="profile" href="/profile"
                                                      onClick={() => router.push("/profile")}>
                                            Profile
                                        </DropdownItem>
                                        <DropdownItem
                                            key="logout"
                                            color="danger"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </DropdownItem>
                                    </DropdownSection>
                                </>
                            )
                            :
                            (
                                <>
                                    <DropdownItem
                                        key="login"
                                        href="/login"
                                        onClick={() => router.push("/login")}
                                    >
                                        Login
                                    </DropdownItem>
                                    <DropdownItem
                                        key="register"
                                        href="/register"
                                        onClick={() => router.push("/register")}
                                    >
                                        Register
                                    </DropdownItem>
                                </>
                            )}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
};
