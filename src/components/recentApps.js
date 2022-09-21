import React, {useState} from 'react';
import * as styled from './styledComponents/recentApps'


function RecentApps(){
  const addMore = (name,url) => {
    alert('f')
  }

  const [apps, setApps] = useState(localStorage.getItem("apps") ? JSON.parse(localStorage.getItem("apps")) : [] )
  const [showPopup,setShowPopup] = useState(false)
  return (
    <styled.RecentAppsWrapp>
      {showPopup && <Popup handleSubmit={addMore} />}
      {
	apps.map( (app,index) => {
	  return <App details={app} key={index} />
	  
	})
      }
      <styled.App onClick={ () =>  setShowPopup(!showPopup)}><h1>+</h1></styled.App>
    </styled.RecentAppsWrapp>
  )
}

function App({name,url}){
  console.log(name)
  return (
    <styled.App>
      <h1>kjk</h1>
      {name}
    </styled.App>
  )
}

function Popup(){
  return (
    <div></div>
  )
}

export default RecentApps;
