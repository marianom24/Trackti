import CardComponent  from "../components/CardComponent";
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

const fetchData = (setData) => {
    api.get(`/stats?filter=daily&time_period=today`)
      .then(response => {
        const formattedData = response.data.map(item => ({
          category: item.category__title,
          totalTime: hoursFormater(item.total_time)
        }));
        setData(formattedData);
      });
};


export function TodayCard({ newEntryTrigger }){
    const [todayData, setTodayData] = useState([]);



    useEffect(()=>{
        fetchData(setTodayData)
    },[])
    useEffect(()=>{
        fetchData(setTodayData)
    },[newEntryTrigger])

    

    return(
        <CardComponent>
            <h2 className="dark:text-slate-200 font-bold text-2xl">Today</h2>
            <div className= "bg-slate-900 dark:bg-slate-400 h-1"></div>
            {!todayData &&(
                <p>Not entries today</p>
            )
            }
            {todayData.map((entry, index)=>(
            <p key={index} className="dark:text-white text-lg">You've spent <b>{entry.totalTime}</b> in <b>{entry.category}</b></p>))}            
        </CardComponent>


    )
}