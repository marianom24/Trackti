import CardComponent from "./CardComponent"; 
import { useState, React, useEffect } from "react";
import api from "../api";

const hoursFormater = (mins)=>{
    const roundedMins = Math.round(mins)
    if (mins > 59){
        const hours = Math.floor(roundedMins / 60 );
        const minutes = roundedMins % 60;
        return `${hours.toString()}:${minutes.toString().padStart(2,'0')} hs`
    }else{
        return `${roundedMins.toString()} minutes`
    }
}

const fetchData = (setData, filter,  date) => {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }
    api.get(`/stats?filter=${filter}&date=${date}`)
      .then(response => {
        const formatedData = response.data.map((entry)=>({
            category: entry.category__title,
            total_time: hoursFormater(entry.total_time),
            average_time: hoursFormater(entry.average_time)
        }))
        setData(formatedData)
      })
      .catch(error => {
        console.error(`Error fetching ${filter} stats:`, error);
      });
  };
  

export function StatsCard({ newEntryTrigger }){
    const [monthlyStats, setMonthlyStats] = useState([])
    const [weeklyStats, setsWeeklyStats] = useState([])

    useEffect(()=>{
        fetchData(setsWeeklyStats,'weekly')
    },[])
    useEffect(()=>{
        fetchData(setMonthlyStats,'monthly')
    },[])

    useEffect(()=>{
        fetchData(setsWeeklyStats,'weekly')
        fetchData(setMonthlyStats,'monthly')
    },[newEntryTrigger])


    return(
        <div className="flex w-full gap-20 justify-center break:flex-col">
            <CardComponent className="bg-green-400 w-1/2">
                <h2 className="dark:text-slate-200 font-bold text-2xl">This week</h2>
                <div className="bg-black dark:bg-slate-400 h-1"></div>
                {weeklyStats.map((entry, index)=>(
                <p key={index} className="dark:text-white text-lg">You've spent <b>{entry.total_time}</b> in <b>{entry.category}</b> with an<br/>average time of <b>{entry.average_time}</b> per day</p>
                ))}

            </CardComponent>
            <CardComponent className="bg-transparent w-1/2">
                <h2 className="dark:text-slate-200 font-bold text-2xl">This month</h2>
                <div className="bg-black dark:bg-slate-400 h-1"></div>
                {monthlyStats.map((entry, index)=>(
                    <p key={index} className="dark:text-white text-lg">You've spent <b>{entry.total_time}</b> in <b>{entry.category}</b> with an<br/>average time of <b>{entry.average_time}</b> per day</p>                ))}
            </CardComponent>
        </div>
    )
}