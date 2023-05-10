import { useState, useRef, useLayoutEffect,createContext } from 'react'

import './App.css'
import GithubContainer from './components/github'
import TodoWrapper from './components/todo'
import MailsContainer from './components/mails'
import ChangeBg from './components/changebg.js'
import FeedContainer from './components/feed.js'
import RecentApps from './components/recentApps'
import SearchBar from './components/searchbar'
import DoubleScreen from './components/doubleScreen'
import Weather from './components/wather'
import Popup from './components/popup'
import Login, {Register,Logout} from './components/login.js'
import {keyCodes,URL,TOKEN_LIFE_TIME} from './consts'
import TicTacToe from './components/game'
import styled from 'styled-components'

export const AppContext = createContext(false);

async function handleJwt(setLoggedIn){
  console.log(localStorage.getItem("refresh_token"))
  if(!localStorage.getItem("refresh_token")) return false;
  if(await refreshToken()){setLoggedIn(true)}
  const intervalId = setInterval( async () =>{
    if(!(await refreshToken())){
      setLoggedIn(false);
      clearInterval(intervalId)
      return;
    }
  },TOKEN_LIFE_TIME)
}

async function refreshToken(){
  if(!localStorage.getItem("refresh_token")) return false;
  try{
    const req = await fetch(URL+"/token", {
      mode: 'cors',
      method: "POST",
      credentials: "include",
      withCredentials: true ,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({refresh_token: localStorage.getItem("refresh_token")})
    })
    const res = await req.json()
    if(!res.message){console.log(res.error); return false;};
    return true;
  }catch(err){
    console.log(err)
    return false;
  }
}
function parseJwt(token) {
  console.log(token)
  if (!token) {
    return false;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
const hotkeys = []
function App() {
  const [currentBg,setCurrentBg] = useState(localStorage.getItem('bg') ? localStorage.getItem('bg') : 'default.png')
  const [loggedIn,setLoggedIn] = useState(false);
  const [err,setErr] = useState(false);
  const [errMsg,setErrMsg] = useState("");
  const searchBarRef = useRef();
  const keywords = useRef();
    
  function setWord(word,fn){
    for(let i=0;i<keywords.current.length;i++){if(keywords.current[i].wordObject.word == word) return;};
    keywords.current.push({letter: word[0], wordObject: {word: Array.from(word),current_index: 0},onType: () => fn()})
  }
  function setHotkey(key,fn,replace=false){
    console.log('her')
    if(!replace && (Object.keys(hotkeys).indexOf(key) !== -1)){
      console.log('heafd')
        console.log(key)
      console.trace(fn)
      setErr(true)
      setErrMsg(`${key} is already in use`)
      return false;
    }
    if(!(key in keyCodes)){
      setErr(true)
      setErrMsg("invalid key")
      return false;
    }
    hotkeys[key] = fn;
    return true;
  }
  const deleteHotkey = key => {
    alert('here')
    alert(key)
    delete hotkeys[key]
  }
  useLayoutEffect( () => {
    //handle jwt 
    handleJwt(setLoggedIn)
    keywords.current= []
    document.body.addEventListener('keydown', e => {
      
      if(document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return
      if(e.ctrlKey && e.shiftKey){
	if (Object.keys(hotkeys).indexOf(e.key) !== -1){
          e.preventDefault();
	  hotkeys[e.key]();
          return;
	}
      }else if(e.ctrlKey && e.key === "Enter"){
	searchBarRef.current.focus()
        return;
      }
      keywords.current.forEach( (obj) => {
        if(obj.letter === e.key){
          if(obj.wordObject.current_index < obj.wordObject.word.length-1){
            obj.wordObject.current_index += 1
            obj.letter=obj.wordObject.word[obj.wordObject.current_index]
            return;
          }
          obj.onType()
        }
        obj.wordObject.current_index = 0;obj.letter=obj.wordObject.word[0]
      })
    })
  },[])

  return (
    <AppContext.Provider value={{loggedIn,setLoggedIn,setHotkey,deleteHotkey,setWord}}>
      <Head>
	<SearchBar searchBarRef={searchBarRef} />
	<RecentApps />
	<ChangeBg updateBg={ (newBg) => {setCurrentBg(newBg);localStorage.setItem('bg',newBg)}  }/>
      </Head>
      <Main bg={currentBg}>
	<div>
	  <Weather/>
	</div>
	<MainContainer>
	  <DoubleScreen title1="Github" Component1={<GithubContainer />} title2="Mails" Component2={<MailsContainer />} />
	  <DoubleScreen title1="TODO" Component1={<TodoWrapper setHotkey={setHotkey} loggedIn={loggedIn} />} title2="Anime" Component2={<MailsContainer />} />
	</MainContainer>
      </Main>
      <FeedSection>
	<FeedContainer/>
      </FeedSection>
      <Login />
      <Logout />
      <Register />
      <TicTacToe />
    </AppContext.Provider>
  );
}

const Head = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width 100wh;
  height: 100px;

  background: #111111;

  box-sizing: border-box;

  position: fixed;
  z-index: 100000;
  left: 0;
  right: 0;

  color: white;
`

const Main = styled.main`
  padding: 100px;
  padding-top: 200px;
  background-image: ${ props => `url('./images/${props.bg}')`};
  min-height: 90vh;
  height: 1220px;
  width: 100wh;
  background-size: cover;
  display: flex;
  flex-direction: column;
 box-sizing: border-box; 
 
`



const MainContainer = styled.main`
  display: flex;
  width: 100%;
  justify-content: space-between
`
const FeedSection = styled.section`
  display: flex;
  width: 100wh;
  min-height: 100vh;
`

export default App;
