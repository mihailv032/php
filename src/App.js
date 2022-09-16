import './App.css'

import TodoWrapper from './components/todo.js'
import ChangeBgContainer from './components/changebg.js'
import MailsContainer from './components/mails.js'

import styled from 'styled-components'
import {useState} from 'react'

function App() {
  const [currentBg,setCurrentBg] = useState(localStorage.getItem('bg') ? localStorage.getItem('bg') : 'default.png')
  console.log(currentBg)
  return (
    <>
      <Head>
	<ChangeBgContainer updateBg={ (newBg) => {setCurrentBg(newBg);localStorage.setItem('bg',newBg)}  } />
      </Head>
      <Main bg={currentBg}>
	<MainContainer>
	  <MailsContainer></MailsContainer>
	  <TodoWrapper/>
	</MainContainer>
      </Main>

    </>
  );
}

function AppHeader() {

}

const Head = styled.header`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width 100wh;
  height: 150px;

  background: #111111;

  box-sizing: border-box;

  position: fixed;
  left: 0;
  right: 0;

  color: white;
`

const Main = styled.main`
  padding: 100px;
  padding-top: 350px;
  background-image: ${ props => `url('./images/${props.bg}')`};
  height: 100vh;
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


export default App;
