import Popup, {LoadingPopup} from './popup.js'
import { useState, useEffect, useContext } from 'react'
import {URL} from '../consts'
import {AppContext} from '../App'
import {
  LoginForm,
  LoginBtn,
  RegisterBtn,
  Input,
  Err,
}from './styledComponents/login'

export default function Login(){
  const [opened,setOpened] = useState(false)
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [inputErr,setInputErr] = useState({})
  const [err,setErr] = useState(false)
  const {setWord,setHotkey,loggedIn,setLoggedIn} = useContext(AppContext)
  const [loading,setLoading] = useState(false)
  useEffect( () => {setWord("login",() =>{setHotkey('Escape', () =>setOpened(false));setOpened(true);})},[])
    
  async function handleSubmit(e){
    e.preventDefault()
    if(name.length === 0) return setInputErr(Object.assign({},inputErr,{name:"you must provide a valid usre name"}))
    if(password.length === 0) return setInputErr(Object.assign({},inputErr,{password:"you must provide a valid password"}))
    try{
      setLoading(true)
      const req = await fetch(URL+"/login",{
	mode: 'cors',
	method: "POST",
        credentials: 'include',
	withCredentials: true,
	headers: {"Content-Type": "application/json",},
	body: JSON.stringify({user_name: name, password: password})
      })
      const res = await req.json()
      setLoading(false)
      if(!res.message){ return setErr(res.error ? res.error : "something went wrong")}
      localStorage.setItem("refresh_token", res.refresh_token)
      setLoggedIn(true)
      setOpened(false)
      return;
    }catch(err){
      console.log(err)
      setLoading(false)
      return setErr("something went wrong")
    }
  }
  if(loggedIn) return;
  return (
    <>
    <LoadingPopup opened={loading} text="loading" />
    <Popup opened={opened} onClose={() => setOpened(false) }>
      <LoginForm onSubmit={handleSubmit}>
	{err && <Err>{err}</Err>}
        <label>user name</label>
	{inputErr.name && <Err>{inputErr.name}</Err>}
        <Input name="" type="text" value={name} onChange={e =>{if(inputErr.name){setInputErr(Object.assign({},inputErr,{name:false}))};setName(e.target.value)}} />
        <label>password</label>
	{inputErr.password && <Err>{inputErr.password}</Err>}
        <Input name="" type="password" value={password} onChange={ e =>{if(inputErr.password){setInputErr(Object.assign({},inputErr,{password:false}))};setPassword(e.target.value)}} />
	<div style={{margin: "auto"}}><LoginBtn onSubmit={handleSubmit} role="button"><span>Login</span></LoginBtn></div>
	<RegisterBtn>create an account</RegisterBtn>
      </LoginForm>
    </Popup>
    </>
  )
}

export function Register({}){
  const [opened,setOpened] = useState(false)
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [repeatPassword,setRepeatPassword] = useState("")
  const [inputErr,setInputErr] = useState({})
  const [err,setErr] = useState(false)
  const {setWord,setHotkey,loggedIn,setLoggedIn} = useContext(AppContext)
  const [loading,setLoading] = useState(false)
  useEffect( () => {setWord("register",() =>{setHotkey('Escape', () =>setOpened(false));setOpened(true);})},[])
    
  async function handleSubmit(e){
    e.preventDefault()
    if(name.length === 0) return setInputErr(Object.assign({},inputErr,{name:"you must provide a valid usre name"}))
    if(password.length === 0) return setInputErr(Object.assign({},inputErr,{password:"you must provide a valid password"}))
    if(password !== repeatPassword) return setInputErr(Object.assign({},inputErr,{password:"you must enter the same password in both fields"}))
    try{
      setLoading(true)
      const req = await fetch(URL+"/createuser",{
	mode: 'cors',
	method: "POST",
        credentials: 'include',
	withCredentials: true,
	headers: {"Content-Type": "application/json",},
	body: JSON.stringify({user_name: name, password: password})
      })
      const res = await req.json()
      setLoading(false)
      if(!res.message){ return setErr(res.error ? res.error : "something went wrong")}
      localStorage.setItem("refresh_token", res.refresh_token)
      setLoggedIn(true)
      setOpened(false)
      return;
    }catch(err){
      console.log(err)
      setLoading(false)
      return setErr("something went wrong")
    }
  }
  return (
    <>
    <LoadingPopup opened={loading} text="loading" />
    <Popup opened={opened} onClose={() => setOpened(false) }>
      <LoginForm onSubmit={handleSubmit}>
	{err && <Err>{err}</Err>}
        <label>user name</label>
	{inputErr.name && <Err>{inputErr.name}</Err>}
        <Input name="" type="text" value={name} onChange={e =>{if(inputErr.name){setInputErr(Object.assign({},inputErr,{name:false}))};setName(e.target.value)}} />
        <label>password</label>
	{inputErr.password && <Err>{inputErr.password}</Err>}
        <Input name="" type="password" value={password} onChange={ e =>{if(inputErr.password){setInputErr(Object.assign({},inputErr,{password:false}))};setPassword(e.target.value)}} />
	<label>Repeat password</label>
	{inputErr.password && <Err>{inputErr.password}</Err>}
        <Input name="" type="password" value={repeatPassword} onChange={ e =>{if(inputErr.password){setInputErr(Object.assign({},inputErr,{password:false}))};setRepeatPassword(e.target.value)}} />
	<div style={{margin: "auto"}}><LoginBtn onSubmit={handleSubmit} role="button"><span>Login</span></LoginBtn></div>
	<RegisterBtn>create an account</RegisterBtn>
      </LoginForm>
    </Popup>
    </>
  )
}
