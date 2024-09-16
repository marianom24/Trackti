import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Label, TextInput, Checkbox, Button, Alert } from 'flowbite-react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MyFooter from '../components/MyFooter';
import NavTryDemo from '../components/NavTryDemo';
import { TokenManager } from '../TokenManager';
import api from '../api'

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setshowPassword] = useState('password');
    const navigate = useNavigate();

    const handleTogglePassword = (event) => {
      event.preventDefault();
      if (showPassword==='password'){
         setshowPassword('text')
      } else {
         setshowPassword('password')
      }
   }
    
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      
      if (name === 'username') {
          setUsername(value);
      } else if (name === 'password') {
          setPassword(value);
      }
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const response = await api.post('/token/', {
          username: username,
          password: password
        });
        
        const access_token = response.data.access;
        const refresh_token = response.data.refresh;

        TokenManager.saveAccessToken(access_token);
        TokenManager.saveRefreshToken(refresh_token);
        navigate('/dashboard');
      }catch (error){
        setError('Credentials are incorrect, please try again');
    }

  };

  return (
    <div className="h-screen flex flex-col  dark:bg-black break:gap-12 break:pt-28">
      <NavTryDemo/>
      <section className='flex relative m-auto'>
        <Card className="max-w-sm mx-auto w-96 bg-transparent small:w-80">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block dark:text-white">
                <Label htmlFor="username" value="Your username" color='white' />
              </div>
              <TextInput id="username" type="text" name='username' value={username} onChange={handleInputChange} placeholder="Enter username" required />
            </div>

            <div>
              <div className="mb-2 block dark:text-white">
                <Label htmlFor="password" value="Your password" color="white"/>
              </div>
              <div className='relative'>
                <TextInput id="password"  type={showPassword} name='password' value={password} onChange={handleInputChange} required />
                <button type='button' tabIndex={-1} onClick={handleTogglePassword} className='absolute right-2 top-[5px] mt-2 mr-2'>
                  {showPassword==="password" ? <FaEye/> : <FaEyeSlash/>}
                </button>
              </div>

            </div>

            {error && <Alert color="failure">
              <span className="font-medium">{error}</span>
            </Alert>}

            <div className="flex items-center gap-2 text-white">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <p className='text-sm dark:text-white'><Link to="/register">Don't have an account?</Link></p>
            <Button type="submit" color="dark">
              Login
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

export default LoginForm