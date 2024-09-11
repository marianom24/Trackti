import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Card, Label, TextInput, Checkbox, Button } from 'flowbite-react';
import MyFooter from '../components/MyFooter';
import api from '../api';

export function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event)=>{
        const { name, value } = event.target;
        if(name === 'username'){
            setUsername(value)
        }else if(name === 'email'){
            setEmail(value)
        }else if(name === 'password'){
            setPassword(value)
        }else if(name === 'confirmPassword'){
            setConfirmPassword(value)
        }
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
                
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try{
            const response = await api.post(`/auth/users/`, {
                username: username,
                email: email,
                password: password
            });
            if (response.status === 201) {
                <Navigate to='/login' />
            }
        }catch(errror){
            setError('The form data is not valid');
        }
    }

  return (
    <div className='h-screen flex flex-col'>
      <section className='flex items-center dark:bg-black h-[100vh]'>
        <Card className="max-w-sm mx-auto mt-10 bg-transparent w-96">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block dark:text-white">
                <Label htmlFor="username" value="Your username" color="white"/>
              </div>
              <TextInput id="username" type="text" name='username' value={username} onChange={handleInputChange} placeholder="Enter username" required />
            </div>
            
              <div>
                <div className="mb-2 block dark:text-white">
                  <Label htmlFor="email" value="Your email" color="white" />
                </div>
                <TextInput id="email" type="email"  name='email' value={email} onChange={handleInputChange} placeholder="Enter email" required />
              </div>

            <div>
              <div className="mb-2 block dark:text-white">
                <Label htmlFor="password" value="Your password" color="white"/>
              </div>
              <TextInput id="password" type="password"  name='password' value={password} onChange={handleInputChange}required />
            </div>
              <div>
                <div className="mb-2 block dark:text-white">
                  <Label htmlFor="confirmPassword" value="Confirm your password"  color="white" />
                </div>
                <TextInput id="confirmPassword" type="password"  name='confirmPassword' value={confirmPassword} onChange={handleInputChange} required />
              </div>

            {error && <p className="text-red-500">{error}</p>}

            <p className='text-sm dark:text-white'><Link to="/login">Do you already have an account?</Link></p>

            <Button type="submit" color="purple">
              Register
            </Button>
          </form>
        </Card>
      </section>
      <footer className="w-full">
        <MyFooter />
      </footer>
    </div>
  );
}

export default RegisterForm