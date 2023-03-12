import Popup, {useMount} from './popup.js'
import { useState, useEffect, useRef } from 'react'
import {URL} from '../consts'
import {
  LoginForm,
  LoginBtn,
  RegisterBtn,
  Input,
  Err,
}from './styledComponents/login'

export default function Login({setWord}){
  const [opened,setOpened] = useState(false)
  const [name,setName] = useState("")
  const [password,setPassword] = useState("")
  const [inputErr,setInputErr] = useState({})
  const [err,setErr] = useState(false)
  useEffect( () => {setWord("login",() => setOpened(true))},[])
  async function handleSubmit(e){
    e.preventDefault()
    if(name.length === 0) return setInputErr(Object.assign({},inputErr,{name:"you must provide a valid usre name"}))
    if(password.length === 0) return setInputErr(Object.assign({},inputErr,{password:"you must provide a valid password"}))
    try{
      const req = await fetch(URL+"/login",{
	mode: 'cors',
	method: "POST",
	headers: {"Content-Type": "application/json",},
	body: JSON.stringify({user_name: name, password: password})
      })
      const res = await req.json()
      if(!res.message){ return setErr(res.error ? res.error : "something went wrong")}
      localStorage.setItem("token", res.token)
      localStorage.setItem("refresh_token", res.refresh_token)
      setOpened(false)
      return;
    }catch(err){
      console.log(err)
      return setErr("something went wrong")
    }
  }
  return (
    <Popup opened={opened} onClose={() => setOpened(false) }>
      <LoginForm onSubmit={handleSubmit}>
	{err && <Err>{err}</Err>}
        <label>user name</label>
	{inputErr.name && <Err>{inputErr.name}</Err>}
        <Input name="" type="text" value={name} onChange={e =>{if(inputErr.name){setInputErr(Object.assign({},inputErr,{name:false}))};setName(e.target.value)}} />
        <label>password</label>
	{inputErr.password && <Err>{inputErr.password}</Err>}
        <Input name="" type="password" value={password} onChange={ e =>{if(inputErr.password){setInputErr(Object.assign({},inputErr,{password:false}))};setPassword(e.target.value)}} />
	<div style={{margin: "auto"}}><LoginBtn onSubmit={handleSubmit} role="button"><span class="text">Login</span></LoginBtn></div>
	<RegisterBtn>create an account</RegisterBtn>
      </LoginForm>
    </Popup>
  )
}

export function Register({}){

}
