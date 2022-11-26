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

import styled from 'styled-components'
import { useState,useRef,useEffect} from 'react'
export const keyCodes = {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"d":68,"b":66,"a":65,"s":83,"i":73,"f":70,"k":75,"+":187,"p":80,"o":79,"u":85,"z":90,"t":84,"r":82,"e":69,"w":87,"g":71,"h":72,"j":74,"l":76,"#":191,"y":89,"x":88,"c":67,"v":86,"n":78,"m":77,",":188,".":190,"-":189,"ArrowRight":39,"ArrowLeft":37,"ArrowUp":38,"ArrowDown":40,"PageDown":34,"Clear":12,"Home":36,"PageUp":33,"End":35,"Delete":46,"Insert":45,"Control":17,"AltGraph":18,"Meta":92,"Alt":18,"Shift":16,"CapsLock":20,"Tab":9,"Escape":27,"F1":112,"F2":113,";":188,":":190,"_":189,"'":191,"*":187,"Q":81,"W":87,"E":69,"R":82,"T":84,"Z":90,"S":83,"A":65,"D":68,"I":73,"U":85,"O":79,"Y":89,"X":88,"C":67,"F":70,"V":86,"G":71,"B":66,"H":72,"N":78,"J":74,"M":77,"K":75,"L":76,"P":80,"Ö":192,"Ä":222,"Ü":186,"!":49,"\"":50,"§":51,"$":52,"%":53,"&":54,"/":55,"(":56,")":57,"=":48,"?":219,"°":220}

function App() {
  const [currentBg,setCurrentBg] = useState(localStorage.getItem('bg') ? localStorage.getItem('bg') : 'default.png')
  const [err,setErr] = useState(false)
  const [errMsg,setErrMsg] = useState("")
  const searchBarRef = useRef()
  const hotkeys = {}
  function setHotkey(key,fn){
    if(key in hotkeys){
      setErr(true)
      setErrMsg(`${key} is already in use`)
      return;
    }
    if(!(key in keyCodes)){
      setErr(true)
      setErrMsg("invalid key")
      return;
    }
    hotkeys[key] = fn;
  }
  useEffect( () => {
    document.body.addEventListener('keydown', e => {
      if(e.ctrlKey && e.shiftKey){
	if (Object.keys(hotkeys).indexOf(e.key) !== -1){
	  hotkeys[e.key]();
	}
      }else if(e.ctrlKey && e.key === "Enter"){
	searchBarRef.current.focus()
      }
    })
  },[])

  return (
    <>
      <Head>
	<SearchBar searchBarRef={searchBarRef} />
	<RecentApps  setHotkey={setHotkey} />
	<ChangeBg updateBg={ (newBg) => {setCurrentBg(newBg);localStorage.setItem('bg',newBg)}  } setHotkey={setHotkey} />
      </Head>
      <Main bg={currentBg}>
	<div>
	  <Weather/>
	</div>
	<MainContainer>
	  <DoubleScreen title1="Github" Component1={<GithubContainer />} title2="Mails" Component2={<MailsContainer />} />
	  <DoubleScreen title1="TODO" Component1={<TodoWrapper setHotkey={setHotkey} />} title2="Anime" Component2={<MailsContainer />} />
	</MainContainer>
      </Main>
      <FeedSection>
	<FeedContainer/>
      </FeedSection>
    </>
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
  padding-top: 350px;
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
