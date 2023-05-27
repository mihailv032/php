import React, { useState, useLayoutEffect, useEffect,useRef, useContext} from 'react';
import {AppContext} from '../context'
import * as Styled from './styledComponents/recentApps'
import Popup from './popup'
import {keyCodes,hotkeys} from '../consts'
import ContextMenu from './dropdown'

function RecentApps(){
  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)
  const {setHotkey,deleteHotkey} = useContext(AppContext)

  const addAppRef = useRef()
  const recntAppsRef = useRef()
  const addMore = (name,url,hotkey) => {
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    const newApps = [{name:name,url:url,icon:favicon,hotkey: hotkey},...apps]

    setApps(newApps)
    setShowPopup(false)
  }
  const changeAppDetails = (index,name,url,hotkey) => {
    const appArr = [...apps]
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    appArr[index] = {name:name,url:url,icon:favicon,hotkey: hotkey}
    setApps(appArr)
  }
  const deleteApp = index =>{
    const appsArr = [...apps]
    const deletedApp = appsArr.splice(index,1)
    setApps(appsArr)
    if(deletedApp[0].hotkey) deleteHotkey(deletedApp[0].hotkey)
  }
  //cannot use the setShowPopup because the callback does not have access the latest showPopup value
  useLayoutEffect( () =>{setHotkey("Y", () => addAppRef.current.click())},[])
  useEffect( () => localStorage.setItem("apps", JSON.stringify(apps)),[apps])
  return (
    <Styled.RecntAppsContainer>
      <Styled.RecentAppsWrapp ref={recntAppsRef}>
	<AppContainer apps={apps} changeAppDetails={changeAppDetails} deleteApp={deleteApp} />
	<Styled.App onClick={ () => setShowPopup(!showPopup)} ref={addAppRef}>+</Styled.App>
      </Styled.RecentAppsWrapp>
      <Popup opened={showPopup} onClose={() => setShowPopup(false) } width="300px" height="500px">
	<PopupContent submit={addMore} />
      </Popup>

    </Styled.RecntAppsContainer>
  )
}

function AppContainer({apps,changeAppDetails,deleteApp}) {
  return (
    <>
      {
	apps.map( (app,index) => {
	  return (
	    <span key={app.url}>
	      <App name={app.name} url={app.url} icon={app.icon}
		   tabIndex={index}
		   hotkey={app.hotkey} 
		   changeAppDetails={ (name,url,hotkey) => changeAppDetails(index,name,url,hotkey)}
		   deleteApp={ () => deleteApp(index)} />
	    </span>
	  )
	})
      }
    </>
  )
}

function App({name,url,icon,hotkey,changeAppDetails,deleteApp}){
  const ref = useRef()
  const [showContext,setShowContext] = useState(false)
  const [showChangeDetails,setShowDetails] = useState(false)
  const {setHotkey,deleteHotkey} = useContext(AppContext)
  const controlRef = useRef()//needed to fix closing the contextMenu when closing by second clicking on the btn again
  useEffect( () => {
    if(hotkey && ref.current){if(!setHotkey(hotkey, () => ref.current.click())){changeAppDetails(name,url,false)}}
    
  },[ref,hotkey])
  const handleContext = e => {
    e.preventDefault()
    if(controlRef.current) return;
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
      <RightClickMenu controlRef={controlRef} opened={showContext} handleClose={() => setShowContext(false) } deleteApp={deleteApp} changeAppDetails={() => setShowDetails(true) } />
      <Popup opened={showChangeDetails} onClose={ () => setShowDetails(false)}>
	<PopupContent submit={ (name,url,hotkey) =>{setShowDetails(false);changeAppDetails(name,url,hotkey);}} nameProp={name} urlProp={url} hotkeyProp={hotkey ? hotkey : ""} />
      </Popup>
    </div>
  )
}

function PopupContent({submit,nameProp="",urlProp="",hotkeyProp=""}){
  const [name,setName] = useState(nameProp)
  const [url,setUrl] = useState(urlProp)
  const [addHotkey,setAddHotkey] = useState(hotkeyProp ? true : false)
  const [hotKey,setHotKey] = useState(hotkeyProp)
  const [err,setErr] = useState({hotkey: false,url:false})

  const handleHotKey = e => {
    const key = e.target.value.length <= 1 ? e.target.value : e.target.value[e.target.value.length-1]
    if(!(key in keyCodes)) return;
    setHotKey(key.toUpperCase())
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
	{addHotkey &&
         <>
         <span>ctrl+Shift+</span>
         <Styled.Input name="" type="text" value={hotKey} onChange={handleHotKey} /> </>}
	<Styled.Btn onSubmit={handleSubmit}>click me</Styled.Btn>
      </Styled.AddApp>
    </Styled.PopupWrapp>
  )
}

function RightClickMenu({opened,handleClose,changeAppDetails,deleteApp,controlRef}){
  return (
    <ContextMenu opened={opened} onClose={handleClose}>
      <Styled.ContexMenutWrapp>
	<Styled.ContextMenuItem onClick={changeAppDetails} ref={controlRef}>change details</Styled.ContextMenuItem>
	<Styled.ContextMenuItem onClick={deleteApp}>Delete</Styled.ContextMenuItem>
      </Styled.ContexMenutWrapp>
    </ContextMenu>
  )
}

export default RecentApps;
