import './App.css'
import { Button,Title, Flex,Center, BackgroundImage, ScrollArea} from "@mantine/core"
import Nav from './ui_elements/nav/nav'
import { useState, createContext, useRef, useLayoutEffect } from 'react'
import Github from './ui_elements/github/github'
import Todo from './ui_elements/todo/todo'

type AppContextType = (url:string) => void

export const AppContext = createContext<AppContextType>(() => {})

export type ChangeBg = (url:string) => void

function App() {
  const bgImgRef= useRef<HTMLImageElement>(null)
  const changeBg:ChangeBg = (url) => {
    localStorage.setItem("bgimg",url)
    if(bgImgRef.current)
      bgImgRef.current.src = url
  }
  useLayoutEffect(() => {
    const url = localStorage.getItem("bgimg")
    if(url !== null && bgImgRef.current)
      bgImgRef.current.src = url
  },[])
  return (
    <AppContext.Provider value={changeBg}>
    <BackgroundImage ref={bgImgRef} className='absolute h-full w-full bg-no-repeat bg-cover bg-center object-none z-[-1]' src={"./images/ign_waifu.png"}>
      <div className="py-24 max-h-screen h-screen w-screen">
	<Nav />
	<Header />
	<ScrollArea h="1000" className='max-h-full'>
	  <Center className="w-screen">
	    <Flex className="justify-between w-3/4 xl:flex-row flex-col space-y-5 ">
	      <Github />
	      <Todo />
	    </Flex>
	  </Center>
	</ScrollArea>
      </div>
    </BackgroundImage>
    </AppContext.Provider>
  )
}

function Header(){
  const [date] = useState(new Date())
  return (
    <Flex direction='column' justify='center' align="center" className="text-white">
      <Title order={1} className="underline">Welcome</Title>
      <Title order={3}>Today is {`${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`}</Title>
      <Button>Click me</Button>
    </Flex>
  )
}


export default App
