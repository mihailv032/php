import React, { useState, useMemo, useEffect,useRef} from 'react';
import * as Styled from './styledComponents/recentApps'
import Popup from './popup'
import {keyCodes,hotkeys} from '../App'
import ContextMenu from './dropdown'

function RecentApps({setHotkey,deleteHotkey}){
  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)

  const addAppRef = useRef()
  const recntAppsRef = useRef()
  const addMore = (name,url,hotkey) => {
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    const newApps = [{name:name,url:url,icon:favicon,hotkey: hotkey},...apps]
    setApps(newApps)
    setShowPopup(false)
  }
  const changeAppDetails = (index,name,url,hotkey) => {
//    alert('here')
    const appArr = [...apps]
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    appArr[index] = {name:name,url:url,icon:favicon,hotkey: hotkey}
    setApps(appArr)
  }
  const deleteApp = index =>{
    const appsArr = [...apps]
    const deletedApp = appsArr.splice(index,1)
    setApps(appsArr)
    if(deletedApp.hotkey) deleteHotkey(deletedApp.hotkey)
  }
  //cannot use the setShowPopup because the callback does not have access the latest showPopup value
  useEffect( () => setHotkey("Y", () => addAppRef.current.click()),[])
  useEffect( () => localStorage.setItem("apps", JSON.stringify(apps)),[apps])
  return (
    <Styled.RecntAppsContainer>
      <Styled.RecentAppsWrapp ref={recntAppsRef}>
	<AppContainer apps={apps} setHotkey={setHotkey} changeAppDetails={changeAppDetails} deleteApp={deleteApp} />
	<Styled.App onClick={ () => setShowPopup(!showPopup)} ref={addAppRef}>+</Styled.App>
      </Styled.RecentAppsWrapp>
      <Popup opened={showPopup} onClose={() => setShowPopup(false) } width="300px" height="500px">
	<PopupContent submit={addMore} />
      </Popup>

    </Styled.RecntAppsContainer>
  )
}

function AppContainer({apps,setHotkey,changeAppDetails,deleteApp}) {
  return (
    <>
      {
	apps.map( (app,index) => {
	  return (
	    <span key={app.url}>
	      <App name={app.name} url={app.url} icon={app.icon}
		   tabIndex={index}
		   hotkey={app.hotkey} setHotkey={setHotkey}
		   changeAppDetails={ (name,url,hotkey) => changeAppDetails(index,name,url,hotkey)}
		   deleteApp={ () => deleteApp(index)} />
	    </span>
	  )
	})
      }
    </>
  )
}

function App({name,url,icon,hotkey,setHotkey,changeAppDetails,deleteApp}){
  const ref = useRef()
  const [showContext,setShowContext] = useState(false)
  const [showChangeDetails,setShowDetails] = useState(false)

  useEffect( () => {
    if(hotkey){setHotkey(hotkey, () => ref.current.click())}
    
  },[])
  const handleContext = e => {
    e.preventDefault()
    setShowContext(!showContext)
  }
  return (
    <div onContextMenu={handleContext}>
      <a href={url} ref={ref} title={hotkey ? hotkey : "not hotkey was added for this app"} >
	<Styled.App>
	  <img alt="" src={icon} />
	  <Styled.AppTitle>{name}</Styled.AppTitle>
	</Styled.App>
      </a>
      <RightClickMenu opened={showContext} handleClose={() => setShowContext(false) } deleteApp={deleteApp} changeAppDetails={() => setShowDetails(true) } />
      <Popup opened={showChangeDetails} onClose={ () => setShowDetails(false)}>
	<PopupContent submit={ (name,url,hotkey) =>{setShowDetails(false);changeAppDetails(name,url,hotkey);}} nameProp={name} urlProp={url} hotkeyProp={hotkey ? hotkey : ""} />
      </Popup>
    </div>
  )
}

function PopupContent({submit,nameProp="",urlProp="",hotkeyProp=""}){
  const [name,setName] = useState(nameProp)
  const [url,setUrl] = useState(urlProp)
  const [addHotkey,setAddHotkey] = useState(false)
  const [hotKey,setHotKey] = useState(hotkeyProp)
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
	<input name="" type="checkbox" checked={addHotkey} onChange={ () => setAddHotkey(!addHotkey)} tabIndex={0}/>
	<Styled.ErrorLabel>{err.hotkey}</Styled.ErrorLabel>
	{addHotkey && <Styled.Input name="" type="text" value={hotKey} onChange={handleHotKey} tabIndex={1} />}
	<Styled.Btn onSubmit={handleSubmit}>click me</Styled.Btn>
      </Styled.AddApp>
    </Styled.PopupWrapp>
  )
}

function RightClickMenu({opened,handleClose,changeAppDetails,deleteApp}){
  return (
    <ContextMenu opened={opened} onClose={handleClose}>
      <Styled.ContexMenutWrapp>
	<Styled.ContextMenuItem onClick={changeAppDetails}>change details</Styled.ContextMenuItem>
	<Styled.ContextMenuItem onClick={deleteApp}>Delete</Styled.ContextMenuItem>
      </Styled.ContexMenutWrapp>
    </ContextMenu>
  )
}

export default RecentApps;
