import React from 'react';
import { TokenManager } from '../TokenManager';
import { Button } from 'flowbite-react';
import { RiLogoutBoxLine } from "react-icons/ri";


export function LogoutButton  () {
    const handleLogout = () => {
        TokenManager.logout();
    };

    return (
        <Button onClick={handleLogout} color='gray' className='h-12'> <span className='flex items-center text-lg gap-2'><RiLogoutBoxLine />Logout</span></Button>
    );
};

export default LogoutButton;