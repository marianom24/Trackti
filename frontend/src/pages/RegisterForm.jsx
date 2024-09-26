import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Label, TextInput, Button, Spinner, Alert } from 'flowbite-react';
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import MyFooter from '../components/MyFooter';
import PopoverPassword from '../components/PopoverPassword';
import api from '../api';
import NavTryDemo from '../components/NavTryDemo';

export function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setshowPassword] = useState('password');
    const [registerLoading, setRegisterLoading] = useState(false)
    const [successfulRegister, setSuccessfulRegister] = useState(false)
    const navigate = useNavigate();
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d).{8,}$/
    const passwordRequirements = `The password must contain at least 8 characters, 1 uppercase, 1 lowercase and 2 digits`


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
    const handleTogglePassword = (event) => {
      event.preventDefault();
      if (showPassword==='password'){
         setshowPassword('text')
      } else {
         setshowPassword('password')
      }
   }
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setRegisterLoading(true)
                
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setRegisterLoading(false)
            return;
        }else if(!passwordPattern.test(password)){
            setError(passwordRequirements);
            setRegisterLoading(fal)
            return
        }
        try{
            const response = await api.post(`/auth/users/`, {
                username: username,
                email: email,
                password: password
            });
            if (response.status === 201) {
              setSuccessfulRegister(true);
              setTimeout(() => {
                setSuccessfulRegister(false);
                navigate('/login');
              }, 2000);
            };
        }catch(error){
          if(error.response.status === 400){
            setError(Object.values(error.response.data))
          }else{
            setError("An unexpected error occurred.")
          }
          setRegisterLoading(false)
        }
    }

  return (
    <div className='h-screen flex flex-col bg-stone-50 dark:bg-black break:pt-28 break:gap-12 small:pt-30'>
      <NavTryDemo/>
      {successfulRegister&&(<Alert icon={FaCheck} className='h-20 flex items-center text-2xl'>Register successful</Alert>)}
      <section className='flex items-center dark:bg-black m-auto sm:pt:96'> 
        <Card className="max-w-sm mx-auto bg-transparent w-96 border">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block dark:text-white">
                <Label htmlFor="username" value="Your username" color="white"/>
              </div>
              <TextInput id="username" type="text" name='username' autoComplete="username"  value={username} onChange={handleInputChange} placeholder="Enter username" required />
            </div>
            
              <div>
                <div className="mb-2 block dark:text-white">
                  <Label htmlFor="email" value="Your email" color="white" />
                </div>
                <TextInput id="email" type="email"  name='email' value={email} onChange={handleInputChange} placeholder="Enter email" required />
              </div>

            <div className="relative">
              <div className="mb-2 block dark:text-white">
                <Label htmlFor="password" value="Your password" color="white"/>
              </div>
              <PopoverPassword>
                <TextInput id="password" type={showPassword} autoComplete="new-password" name='password' value={password} onChange={handleInputChange}required />
                <button type='button' tabIndex={-1} onClick={handleTogglePassword} className='absolute right-2 top-[37px] mt-2 mr-2'>
                  {showPassword==="password" ? <FaEye/> : <FaEyeSlash/>}
                </button>
              </PopoverPassword>
            </div>
              <div className="relative">
                <div className="mb-2 block dark:text-white">
                  <Label htmlFor="confirmPassword" value="Confirm your password"  color="white" />
                </div>
                <PopoverPassword>
                  <TextInput id="confirmPassword" type={showPassword} autoComplete="new-password"  name='confirmPassword' value={confirmPassword} onChange={handleInputChange} required />
                    <button type='button' tabIndex={-1} onClick={handleTogglePassword} className='absolute right-2 top-[37px] mt-2 mr-2'>
                    { showPassword==="password" ? <FaEye/> : <FaEyeSlash/>}
                    </button>
                  </PopoverPassword>
              </div>

            {error && <Alert color="failure">
              <span className="font-medium">{error}</span>
              </Alert>}

            <p className='text-sm dark:text-white'><Link to="/login">Do you already have an account?</Link></p>

            <Button type="submit" color="dark" className='flex gap-4'>
              {registerLoading&&(<Spinner/>)}
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