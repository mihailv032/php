import React, {useState,useMemo} from 'react';
import * as Styled from './styledComponents/recentApps'
import Popup from './popup'

function RecentApps({addAppRef}){
  const addMore = (event,name,url) => {
    event.preventDefault()
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    setApps([{name:name,url:url,icon:favicon},...apps])
    setShowPopup(false)
  }
  
  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)
  return (
    <Styled.RecntAppsContainer>
      <Styled.RecentAppsWrapp>
	<AppContainer apps={apps}></AppContainer>
	<Styled.App onClick={ () => setShowPopup(!showPopup)} ref={addAppRef}>+</Styled.App>
	<Popup opened={showPopup} onClose={() => setShowPopup(false) } width="300px" height="500px">
	  <PopupContent submit={addMore} />
	</Popup>
      </Styled.RecentAppsWrapp>
    </Styled.RecntAppsContainer>
  )
}

function AppContainer({apps}) {
  return (
    <>
      {
	apps.map( (app,index) => {
	  return (
	    <App name={app.name} url={app.url} icon={app.icon} />
	  )
	})
      }
    </>
  )
}

function App({name,url,icon}){
  console.log(name)
  return (
    <a href={url}>
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
  return (
    <Styled.PopupWrapp>
      <Styled.AddApp onSubmit={(e) => submit(e,name,url)}>
	<Styled.AddAppTitle>Name</Styled.AddAppTitle>
	<Styled.Input value={name} onChange={(e) => setName(e.target.value)}/>
	<Styled.AddAppTitle>Url</Styled.AddAppTitle>
	<Styled.Input value={url} onChange={(e) => setUrl(e.target.value)}/>
	<Styled.Btn onSubmit={submit}>click me</Styled.Btn>
      </Styled.AddApp>
    </Styled.PopupWrapp>
  )
}

export default RecentApps;
