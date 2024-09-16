import { Button, Spinner, DarkThemeToggle } from "flowbite-react"
import { RiLoginBoxLine } from "react-icons/ri";
import { TokenManager } from '../TokenManager';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";



export function NavTryDemo(){
    const [loadingDemo, setLoadingDemo] = useState(false)
    const navigate = useNavigate();
    const demoUsername = import.meta.env.VITE_DEMO_USERNAME;
    const demoPassword = import.meta.env.VITE_DEMO_USERNAME_PASS;

    const handleLoginDemo = async()=>{
        try{
            setLoadingDemo(true)
            const response = await api.post('/token/', {
                username: demoUsername,
                password: demoPassword
                });
            const access_token = response.data.access;
            const refresh_token = response.data.refresh;
    
            TokenManager.saveAccessToken(access_token);
            TokenManager.saveRefreshToken(refresh_token);
            navigate('/dashboard');
        }catch(error){
            alert('An unexpected error occurred');
            setLoadingDemo(false)
        }
    }
    return(
        <nav className='h-20 w-full px-36 mx-auto flex justify-between fixed top-0 z-10 mb-32 items-center bg-white dark:bg-black border-b border-gray-500 break:px-2'>
            <h1 className="text-2xl font-bold dark:text-white break:ml-6">Trackti</h1>
            <div className="flex gap-10">
                <DarkThemeToggle className='border-2 border-slate-300 dark:border-none'/>
                <Button color="purple" className="flex" onClick={handleLoginDemo}>
                    <span className="font-bold text-lg flex items-center gap-4 max-w-30">
                        {loadingDemo? <Spinner/> : <RiLoginBoxLine/>}
                        Try demo
                    </span>
                </Button>
            </div>
        </nav>
    )
}

export default NavTryDemo