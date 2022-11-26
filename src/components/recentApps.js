import React, { useState, useMemo, useEffect,useRef} from 'react';
import * as Styled from './styledComponents/recentApps'
import Popup from './popup'
import {keyCodes} from '../App'

function RecentApps({setHotkey}){
  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)
  const addAppRef = useRef()
  const recntAppsRef = useRef()
  const addMore = (name,url,hotkey) => {
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    const newApps = [{name:name,url:url,icon:favicon,hotkey: hotkey},...apps]
    setApps(newApps)
    setShowPopup(false)
    localStorage.setItem("apps", JSON.stringify(newApps))
  }
  useEffect( () => {
    setHotkey("Y", () => addAppRef.current.click())
  },[])
   return (
    <Styled.RecntAppsContainer>
      <Styled.RecentAppsWrapp ref={recntAppsRef}>
	<AppContainer apps={apps} setHotkey={setHotkey} />
	<Styled.App onClick={ () => setShowPopup(!showPopup)} ref={addAppRef}>+</Styled.App>
      </Styled.RecentAppsWrapp>
	<Popup opened={showPopup} onClose={() => setShowPopup(false) } width="300px" height="500px">
	  <PopupContent submit={addMore} />
	</Popup>
    </Styled.RecntAppsContainer>
  )
}

function AppContainer({apps,setHotkey}) {
  return (
    <>
      {
	apps.map( (app,index) => {
	  return (
	    <App name={app.name} url={app.url} icon={app.icon} tabIndex={index} hotkey={app.hotkey} setHotkey={setHotkey} />
	  )
	})
      }
    </>
  )
}

function App({name,url,icon,hotkey,setHotkey}){
  const ref = useRef()
  useEffect( () =>{if(hotkey){setHotkey(hotkey, () => ref.current.click())}},[])
  return (
    <a href={url} ref={ref} title={hotkey}>
      <Styled.App>
	<img alt="" src={icon} />
	<Styled.AppTitle>{name}</Styled.AppTitle>
      </Styled.App>
      
    </a>
  )
}

function PopupContent({submit}){
  const [name,setName] = useState("")
  const [url,setUrl] = useState("")
  const [addHotkey,setAddHotkey] = useState(true)
  const [hotKey,setHotKey] = useState("")
  const [err,setErr] = useState({hotkey: false,url:false})
  const handleHotKey = e => {
    const key = e.target.value.length <= 1 ? e.target.value : e.target.value[e.target.value.length-1]
    if(!(key in keyCodes)) return;
    setHotKey(key)
  }
  const handleSubmit = e => {
    e.preventDefault()
    let sumbitUrl = url
    if(sumbitUrl.length === 0) return setErr(Object.assign({},err,{url:"you need to provide an url"}));
    let checkUrl = Array.from(sumbitUrl).splice(0,8)
    if(checkUrl.join("") !== "https://") sumbitUrl = "https://"+sumbitUrl
    if (addHotkey && hotKey.length === 0) return setErr(Object.assign({},err,{hotkey:"you need to enter a hot key"}))
    submit(name,sumbitUrl,addHotkey ? hotKey : false)
  }
  return (
    <Styled.PopupWrapp>
      <Styled.AddApp onSubmit={handleSubmit}>
	<Styled.AddAppTitle>Name</Styled.AddAppTitle>
	<Styled.Input value={name} onChange={(e) => setName(e.target.value)}/>
	<Styled.AddAppTitle>Url</Styled.AddAppTitle>
	<Styled.ErrorLabel>{err.url}</Styled.ErrorLabel>
	<Styled.Input value={url} onChange={(e) => setUrl(e.target.value)}/>
	<label>add custom hotkey</label>
	<input name="" type="checkbox" checked={addHotkey} onChange={ () => setAddHotkey(!addHotkey)} />
	<Styled.ErrorLabel>{err.hotkey}</Styled.ErrorLabel>
	{addHotkey && <Styled.Input name="" type="text" value={hotKey} onChange={handleHotKey} />}
	<Styled.Btn onSubmit={handleSubmit}>click me</Styled.Btn>
      </Styled.AddApp>
    </Styled.PopupWrapp>
  )
}

export default RecentApps;
