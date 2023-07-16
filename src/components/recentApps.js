import React, { useState, useLayoutEffect, useEffect, useRef, useContext, useCallback } from 'react';
import {AppContext} from '../context'
import * as Styled from './styledComponents/recentApps'
import Popup from './popup'
import {keyCodes,hotkeys} from '../consts'
import ContextMenu from './dropdown'
import { DndProvider,useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


function RecentApps(){
  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)
  const {setHotkey,deleteHotkey} = useContext(AppContext)

  const addAppRef = useRef()
  const recntAppsRef = useRef()

  const getFavIconUrl = (url) => {
    let urlForDomain = Array.from(url)
    if(urlForDomain.indexOf("/",9) !== -1){urlForDomain = urlForDomain.splice(0,urlForDomain.indexOf("/",8))}
    else if(urlForDomain.indexOf("?") !== -1){urlForDomain = urlForDomain.splice(0,urlForDomain.indexOf("?"))}
    urlForDomain=urlForDomain.join("")
    urlForDomain= urlForDomain.split(".")
    console.log(urlForDomain)
    if(urlForDomain.length > 2){
      console.log(8-urlForDomain[0].length)
      console.log(urlForDomain[0].length)
      urlForDomain[0] = urlForDomain[0].slice(0,8)
      console.log(urlForDomain)
      for(let i=1;i<urlForDomain.length -3;i++){
	delete urlForDomain[i]
      }
      urlForDomain=urlForDomain.filter( item =>{if(item) return item})
    }
    urlForDomain[urlForDomain.length-2] = `${urlForDomain[urlForDomain.length-2]}.`
    urlForDomain=urlForDomain.join("")
    return `${urlForDomain}/favicon.ico`
  }
  const addMore = (name,url,hotkey) => {
    const favicon = getFavIconUrl(url)
    const newApps = [{name:name,url:url,icon:favicon,hotkey: hotkey},...apps]
    setApps(newApps)
    setShowPopup(false)
  }
  const changeAppDetails = (index,name,url,hotkey) => {
    const appArr = [...apps]
    const favicon = getFavIconUrl(url)
    appArr[index] = {name:name,url:url,icon:favicon,hotkey: hotkey}
    setApps(appArr)
  }
  const deleteApp = index =>{
    const appsArr = [...apps]
    const deletedApp = appsArr.splice(index,1)
    setApps(appsArr)
    if(deletedApp[0].hotkey) deleteHotkey(deletedApp[0].hotkey)
  }
  function handleAppDrag(dragIndex,hoverIndex){
    let appsArr = [...apps]
    const draggApp = appsArr.splice(dragIndex,1)
    appsArr.splice(hoverIndex,0,draggApp[0])
    setApps(appsArr)
  }
  //cannot use the setShowPopup because the callback does not have access the latest showPopup value
  useLayoutEffect( () =>{setHotkey("Y", () => addAppRef.current.click(),true)},[])
  useEffect( () => localStorage.setItem("apps", JSON.stringify(apps)),[apps])
  return (
    <Styled.RecntAppsContainer>
      <Styled.RecentAppsWrapp ref={recntAppsRef}>
	<DndProvider backend={HTML5Backend}>
	  <AppContainer apps={apps} changeAppDetails={changeAppDetails} deleteApp={deleteApp} handleAppDrag={handleAppDrag} />
	</DndProvider>
	<Styled.App onClick={ () => setShowPopup(!showPopup)} ref={addAppRef}>+</Styled.App>
      </Styled.RecentAppsWrapp>
      <Popup opened={showPopup} onClose={() => setShowPopup(false) } width="300px" height="500px">
	<PopupContent submit={addMore} />
      </Popup>
      
    </Styled.RecntAppsContainer>
  )
}

function AppContainer({apps,changeAppDetails,deleteApp,handleAppDrag}) {
  const moveApp = (dragIndex,hoverIndex) => handleAppDrag(dragIndex,hoverIndex)
  return (
    <>
      {
	apps.map( (app,index) => <App
	key={app.url}
	index={index}
	name={app.name} url={app.url} icon={app.icon}
	handleAppDrag={handleAppDrag}
	hotkey={app.hotkey} 
	moveApp={moveApp}
	changeAppDetails={ (name,url,hotkey) => changeAppDetails(index,name,url,hotkey)}
	deleteApp={ () => deleteApp(index)}      /> )
      }
    </>
  )
}

function App({name,url,icon,hotkey,changeAppDetails,deleteApp,index,moveApp}){
  const ref = useRef(null)
  const [showContext,setShowContext] = useState(false)
  const [showChangeDetails,setShowDetails] = useState(false)
  const {setHotkey,deleteHotkey} = useContext(AppContext)
  const controlRef = useRef()//needed to fix closing the contextMenu when closing by second clicking on the btn again
  const [{ handlerId }, drop] = useDrop({
    accept: "App",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveApp(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: "App",
    item: () => {
      return { handlerId:url, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  useEffect( () => {
    if(hotkey && ref.current){
      if(!setHotkey(hotkey, () => ref.current.click())){changeAppDetails(name,url,false)}
    }else if(index < 10 && ref.current){
      const keys = ["!","@","#","$","%","^","&","*","("]
      setHotkey(keys[index], () => ref.current.click())
    }
    
  },[ref,hotkey])
  const handleContext = e => {
    e.preventDefault()
    if(controlRef.current) return;
    setShowContext(!showContext)
  }
  drag(drop(ref))
  return (
    <div onContextMenu={handleContext}>
      <a href={url} ref={ref} data-handler-id={handlerId} title={hotkey ? hotkey : "no hotkey for this site"} >
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
