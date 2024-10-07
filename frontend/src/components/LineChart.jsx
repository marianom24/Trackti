import { Button, Datepicker } from "flowbite-react";
import { useState, React, useEffect } from "react";
import api from "../api";
import CardComponent from "./CardComponent";

import {LineChart,Line,XAxis,YAxis,Tooltip,Legend, ResponsiveContainer} from "recharts";


const fetchData = (setData, setErrorMessage, timePeriod,  date) => {
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }
  api.get(`/stats?filter=daily&date=${date}&time_period=${timePeriod}`)
    .then(response => {
      const groupedData = response.data.reduce((acc, item) => {
        const date = item.createdDate;
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][item.category__title] = item.total_time;
        return acc;
      }, {});

      const transformedData = Object.values(groupedData);
      if (transformedData.length === 0){
        setErrorMessage("You don't have entries this day")
      }else{
        setErrorMessage('')
      }
      
      setData(transformedData);
    })
};

export function LinearChart({newEntryTrigger}) {
  const [date, setDate] =useState([ new Date().toISOString().split('T')[0]]);
  const [errorMessage, setErrorMessage] = useState('');
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    fetchData(setWeekData, setErrorMessage, 'week'); /*Fetch for first rendering*/ 
  }, []);

  useEffect(() => {
    fetchData(setMonthData, setErrorMessage, 'month', date);/*Re-fetching when a new entry is sent*/ 
    fetchData(setWeekData, setErrorMessage, 'week', date);
  }, [newEntryTrigger, date]);


  useEffect(() => {
    setCurrentData(weekData); /*Setting for re-rendering*/ 
  }, [weekData]);

  const handleDatePicker = (date)=>{
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate)
    }

  const handleSwitchTime = (time)=>{
    if (time === 'weekly'){
      setCurrentData(weekData)
    }else if (time === 'monthly'){
      setCurrentData(monthData)
    }

  }

  return (
    <CardComponent className="bg-stone-700 flex flex-col w-full items-center dark:bg-transparent">
      <h1 className="flex dark:text-white text-2xl py-2 font-bold w-full sm:text-center">Your time in charts</h1>
      <div className="bg-black dark:bg-slate-400 h-1 w-full mb-2"></div>
      <div className="flex justify-between pb-5 w-full items-center">
        <Button.Group className="flex justify-center w-auto">
          <Button color="gray" onClick={() => handleSwitchTime('weekly')}>Week</Button>
          <Button color="gray" onClick={() => handleSwitchTime('monthly')}>Month</Button>
        </Button.Group>
        <Datepicker weekStart={1} onSelectedDateChanged={handleDatePicker} />
      </div>
      {errorMessage && (
          <div className="bg-red-500 text-white p-2 w-86 rounded mx-auto mb-4">
            {errorMessage}
          </div>
        )}

      <ResponsiveContainer  width="100%" height={400} aspect={16/9}>
        <LineChart data={currentData}>
          <XAxis dataKey="date" padding={{ left: 20, right: 30, bottom: 10}}/>
          <YAxis />
          <Tooltip />
          <Legend  wrapperStyle={{ paddingTop: 20 }}  />
          <Line connectNulls type="monotone" dataKey="Read" stroke="#FF5733" />
          <Line connectNulls type="monotone" dataKey="Study" stroke="#33c230" />
          <Line connectNulls type="monotone" dataKey="Work" stroke="#3357FF" />
          <Line connectNulls type="monotone" dataKey="Workout" stroke="#FF33A1" />
        </LineChart>
      </ResponsiveContainer>

    </CardComponent>


  );
}

export default LinearChart