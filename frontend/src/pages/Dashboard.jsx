import React, { useEffect, useState } from 'react';
import Timer from '../components/Timer.jsx';
import LinearChart from '../components/LineChart.jsx';
import { TokenManager } from '../TokenManager.js';
import LogoutButton from '../components/LogoutButton.jsx';
import { StatsCard } from '../components/StatsCard.jsx';
import { TodayCard } from '../components/TodayCard.jsx'
import MyFooter from '../components/MyFooter.jsx';
import { IoStatsChartSharp } from "react-icons/io5";
import { Button, DarkThemeToggle, Dropdown, DropdownItem} from 'flowbite-react';


function Dashboard() {
  const [username, setUsername] = useState(null)
  const [newEntryTrigger, setNewEntryTrigger] = useState(false);

  useEffect(() => {
    async function fetchUsername() {
      try {
        await TokenManager.retrieveSaveUsername();
        const user =  localStorage.getItem('username');
        setUsername(user);
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    }
    fetchUsername();
  }, []);


  return (
    <div className="bg-stone-100 dark:bg-slate-950">
      <nav className='h-20 w-full px-36 mx-auto mb-44 flex justify-between fixed top-0 z-10 items-center bg-stone-200 dark:bg-slate-950 border-b-2 border-gray-500 break:px-2 break:border-none '>
        <h1 className="text-2xl font-bold dark:text-white text-center ">{username}'s Dashboard</h1>
        <div className='flex gap-10 break:hidden'>
          <DarkThemeToggle className='border-2 border-slate-300 dark:border-none'/>
          <a href="#stats"><Button color='gray' className='h-12'><span className='flex items-center text-lg gap-2'><IoStatsChartSharp/>Statistics in charts</span></Button></a>
          <LogoutButton />
        </div>
        <div className='hidden break:inline'>
        <Dropdown label="Menu" color="dark" >
          <DropdownItem><a href="#stats"><Button color='gray' className='h-12'><span className='flex items-center text-lg gap-2'>Statistics in charts</span></Button></a></DropdownItem>
          <DropdownItem><LogoutButton /></DropdownItem>
        </Dropdown>
        </div>
      </nav>
      <section className='flex flex-col p-12 w-5/6 mx-auto mt-20 gap-20 break:flex-col small:w-full small:px-2'>
        <section className='grid grid-cols-2 gap-20 break:flex break:flex-col'>
          <Timer onSubmit={() => setNewEntryTrigger(prev => !prev)}/>
          <TodayCard newEntryTrigger={newEntryTrigger}/>
        </section>
        <StatsCard newEntryTrigger={newEntryTrigger} />
      </section>
      <section id="stats" className='w-5/6 mx-auto p-12 break:px-2 small:w-full'>
        <LinearChart newEntryTrigger={newEntryTrigger} />
      </section>
      <MyFooter />
    </div>
  );
}

export default Dashboard;