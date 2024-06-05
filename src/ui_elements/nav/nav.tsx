import { useEffect, useRef, useContext, memo, useCallback } from 'react'
import { Flex, Input,ScrollArea } from '@mantine/core';
import type {FC, ReactElement} from "react"
import FavoriteApps from './favapps';
import {AppContext} from '../../App'
import {HotkeysContext} from '../../hotkeys'
import { modals } from '@mantine/modals';
import images from '../../images.json'
import { IconSearch } from '@tabler/icons-react';
import type {ChangeBg} from '../../App'

const Nav:FC = () => {
  return (
    <nav className="bg-black absolute top-0 left-0 right-0 flex w-screen h-20 items-center justify-between px-24">
      <Searchbar />
      <FavoriteApps />
      <ChooseBg />
    </nav>
  )
}

function Searchbar(){
  const {setHotkeys} = useContext(HotkeysContext)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
    if(inputRef.current) setHotkeys("KeyS", () => inputRef.current?.focus(),true)
  }, [inputRef])
  return (
    <form action="https://www.google.com/search" method="get" id="search-form" >
      <Input name="q" type="text" placeholder="saerch" variant="filled" className="w-96" ref={inputRef} leftSection={<IconSearch />}/>
    </form>
  )
}



function ChooseBg(){
  const updateBg = useContext(AppContext)
  const changeBgBtnRef = useRef()
  const {setHotkeys} = useContext(HotkeysContext)
  const openModal = useCallback(()=>modals.open({title: "Change Background",children:<Images updateBg={updateBg} />,
						 centered:true, size: "auto",scrollAreaComponent: ScrollArea.Autosize }),[]) 
  
  useEffect( () =>{setHotkeys("Digit0", openModal,true)},[changeBgBtnRef])

  return (
    <>
      <button onClick={openModal}>
	Change BG
      </button>
    </>
  )
  
}

const Images = memo( ({updateBg}:{updateBg: ChangeBg}) => {
  return (
    <Flex className="w-[80vw] h-[80vh] flex-wrap">
      {
	//images = json data
	images.data.map( (image:string,index:number):ReactElement => {
	  return (
	    <img alt="" src={`./images/${image}`}  className="cursor-pointer w-[340px] h-[340px] m-4" key={index}
		 onClick={ () => updateBg(`./images/${image}`)} /> )
	})
      }
    </Flex>
  )
})

export default Nav
