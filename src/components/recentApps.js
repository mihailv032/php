import React, {useState,useMemo} from 'react';
import * as Styled from './styledComponents/recentApps'
import Popup from './popup'

function RecentApps(){
  const addMore = (event,name,url) => {
    event.preventDefault()
    if(url){
      
    }
    setApps([{name:name,url:url},...apps])
    setShowPopup(false)
  }

  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)
  return (
    <Styled.RecntAppsContainer>
      <Styled.RecentAppsWrapp>
	<AppContainer apps={apps}></AppContainer>
	<Styled.App onClick={ () =>  setShowPopup(!showPopup)}>+</Styled.App>
	<Popup opened={showPopup} onClose={() => setShowPopup(false) }>
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
	  <App name={app.name} url={app.url} />
	)
      })
    }
    </>
  )
}

function App({name,url}){
  console.log(name)
  return (
    <Styled.App>
      <a href={url} method="get" target="_blank">{name}</a>
    </Styled.App>
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
