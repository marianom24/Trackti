import { useState, useEffect } from 'react'
import React from 'react';
import '../index.css'
import { Button, Card, Alert } from 'flowbite-react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Dropdown, DropdownItem } from "flowbite-react";
import api from '../api.js';


function Timer({ onSubmit }){
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [inputMinutes, setInputMinutes] = useState(0); /*variable to storage the time determinated by the user*/
    const [category, setCategory] = useState('Category')
    const [elapsedTime, setElapsedTime] = useState(0); // New state to store elapsed time in seconds

    const categories = ['Work', 'Study', 'Read', 'Workout'];
    const handleCategory = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(()=>{
        let interval = null
        if(isRunning && (minutes > 0 || seconds > 0)){
            interval = setInterval(() => {
                if (seconds > 0){
                    setSeconds(seconds - 1);
                }else if(minutes > 0){
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }else if(isRunning &&(minutes === 0 && seconds === 0)){
            setIsRunning(false);
            setMinutes(inputMinutes);
            setSeconds(0);
            handleSubmit()
        }
        return () => clearInterval(interval);
    },[isRunning, minutes, seconds])

    const handleStart = ()=>{
        if(isRunning){
            return
        }else{
            if (category !== 'Category'){
                setIsRunning(true);
                setInputMinutes(minutes);
                setElapsedTime(0);
                setErrorMessage('');
            }else{
                setErrorMessage('Please select a category')
            }
        }
    };
    const handleStop = ()=>{
        setIsRunning(false);
        if (isRunning && elapsedTime > 120){
            setMinutes(inputMinutes);
            setSeconds(0);
            handleSubmit()
        } else if((isRunning && elapsedTime < 120)){
            setMinutes(inputMinutes);
            setSeconds(0);
            setErrorMessage(`Come on, I won’t store a time less than 2 mins, you can do it better!`);
        }
    };
    const addTime = () => {
        if (!isRunning && minutes < 120) {
            setMinutes(minutes + 5);
        }
    };
    const lessTime = () => {
        if (!isRunning && minutes > 5) {
            setMinutes(minutes - 5);
        }
    };
    const handleSubmit = async () => {
        const hours = Math.floor(elapsedTime / 3600);
        const remainingSeconds = elapsedTime % 3600;
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        const duration = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        const date = new Date().toISOString().split('T')[0];
        const formData = {
            user: localStorage.getItem('username'),
            category: category,
            createdDate: date,
            duration: duration,
        };

        try {
            const response = await api.post(`/time-entries`, formData);
            onSubmit();
            setErrorMessage(''); // Clear error message if request is successful
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Failed to submit. Please try again.');
        }
    };

    return (
        <Card className="w-full h-80 space-y-6 bg-transparent dark:bg-transparent shadow-lg rounded-lg border-2 border-black dark:border-white">
            <Dropdown label={category} color='gray'>
                {categories.map((category, index) => (
                    <DropdownItem key={index} onClick={()=> handleCategory(category)}>{category}</DropdownItem>
                ))}
            </Dropdown>
            <div className="flex text-4xl font-bold text-center justify-between items-center ">
                <Button onClick={lessTime} color='gray' className="w-10 rounded-full items-center">
                    <FaAngleLeft />
                </Button>
            <p className='text-6xl dark:text-white px-6'>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
                <Button onClick={addTime} color='gray' className=" w-10 rounded-full items-center">
                    <FaAngleRight  />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleStart} color='dark' className='align-center dark:bg-black dark:border-white'>
                <p className='text-xl'>Start</p>
            </Button>
            <Button onClick={handleStop} color='failure'>
            <p className='text-xl'>Stop</p>
            </Button>
            </div>
            {errorMessage && (
                <Alert color="indigo" className='shadow-md'>
                    <span className="font-medium">{errorMessage}</span> 
                </Alert>
            )}
      </Card>
    );
}
export default Timer