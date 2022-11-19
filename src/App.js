import './App.css'
import GithubContainer from './components/github'
import TodoWrapper from './components/todo'
import MailsContainer from './components/mails'
import ChangeBgContainer from './components/changebg.js'
import FeedContainer from './components/feed.js'
import RecentApps from './components/recentApps'
import SearchBar from './components/searchbar'
import DoubleScreen from './components/doubleScreen'

import styled from 'styled-components'
import { useState,useRef,useEffect} from 'react'

function App() {
  const [currentBg,setCurrentBg] = useState(localStorage.getItem('bg') ? localStorage.getItem('bg') : 'default.png')
  const searchBarRef = useRef()
  const changeBgBtnRef = useRef()
  const addAppRef = useRef()
  useEffect( () => {
    if(searchBarRef.current === null) return;
    if(changeBgBtnRef.current === null) return;
    document.body.addEventListener('keydown', e => {
      if(e.ctrlKey && e.key === "Enter"){
	searchBarRef.current.focus()
      }else if(e.key === "c"){
	changeBgBtnRef.current.click()//for some reason current.click() doesnt work
      }else if(e.key === "a") {
	addAppRef.current.click()
      }
    })
  },[searchBarRef,changeBgBtnRef])

  return (
    <>
      <Head>
	<SearchBar searchBarRef={searchBarRef} />
	<RecentApps addAppRef={addAppRef} />
	<ChangeBgContainer updateBg={ (newBg) => {setCurrentBg(newBg);localStorage.setItem('bg',newBg)}  } changeBgBtnRef={changeBgBtnRef} />
      </Head>
      <Main bg={currentBg}>
	<MainContainer>
	  <DoubleScreen title1="Github" Component1={<GithubContainer />} title2="Mails" Component2={<MailsContainer />} />
	  <DoubleScreen title1="TODO" Component1={<TodoWrapper />} title2="Anime" Component2={<MailsContainer />} />
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
