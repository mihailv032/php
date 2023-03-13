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
import Login from './components/login.js'
import {keyCodes} from './consts'
import styled from 'styled-components'

export const AppContext = createContext(false);



function App() {
  console.log('updated app.js')
  const [currentBg,setCurrentBg] = useState(localStorage.getItem('bg') ? localStorage.getItem('bg') : 'default.png')
  const [loggedIn,setLoggedIn] = useState(localStorage.getItem("token") ? true : false)//set true of fales explicitly just in case
  const [err,setErr] = useState(false)
  const [errMsg,setErrMsg] = useState("")
  const searchBarRef = useRef()
  const hotkeys = useRef()
  const keywords = useRef()
    
  function setWord(word,fn){
    for(let i=0;i<keywords.current.length;i++){if(keywords.current[i].wordObject.word == word) return;};
    keywords.current.push({letter: word[0], wordObject: {word: Array.from(word),current_index: 0},onType: () => fn()})
  }
  function setHotkey(key,fn){
    if(Object.keys(hotkeys.current).indexOf(key) !== -1){
      setErr(true)
      setErrMsg(`${key} is already in use`)
      return false;
    }
    if(!(key in keyCodes)){
      setErr(true)
      setErrMsg("invalid key")
      return false;
    }
    hotkeys.current[key] = fn;
    return true;
  }
  const deleteHotkey = key => {
    alert('here')
    alert(key)
    delete hotkeys.current[key]
  }
  useLayoutEffect( () => {
    hotkeys.current = {}
    keywords.current= []
    document.body.addEventListener('keydown', e => {
      if(e.ctrlKey && e.shiftKey){
	if (Object.keys(hotkeys.current).indexOf(e.key) !== -1){
	  hotkeys.current[e.key]();
          return;
	}
      }else if(e.ctrlKey && e.key === "Enter"){
	searchBarRef.current.focus()
        return;
      }
      if(document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return
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
