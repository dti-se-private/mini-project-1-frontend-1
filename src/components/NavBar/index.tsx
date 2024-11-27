import { FC } from 'react';
import { Avatar, Input } from '@nextui-org/react';

const NavBar: FC = () => {
    return (
        <header className="flex w-full items-center justify-between px-4 py-2 space-x-4 bg-white shadow-md">
            <span className="w-1/5 md:w-2/5 text-xl font-semibold text-left">Eventee</span>
            <div className="flex w-3/5 md:w-1/5 justify-center space-x-2">
                <Input type="text" placeholder="Search"/>
            </div>
            <div className="flex w-1/5 md:w-2/5 justify-end">
                <Avatar src="/profile-pic.jpg" size="md"/>
            </div>
        </header>
    );
};

export default NavBar;