import React, { useState, useMemo, useEffect, useRef, useContext } from 'react'
import {AppContext} from '../context'
import styled from 'styled-components'
import Popup from './popup'
const images = require('../images.json').images

export default function ChangeBg({updateBg}){
  const [showPopup,setShowPopup] = useState(false)
  const changeBgBtnRef = useRef()
  const {setHotkey} = useContext(AppContext)
  const toglePopup = () => showPopup ? setShowPopup(false) : setShowPopup(true)
  const handlBgChange = (bg) => {updateBg(bg);toglePopup()}
  useEffect( () =>{setHotkey(")", () => changeBgBtnRef.current.click())},[])
  const MemoizedIMgs = useMemo( () => {
    return (
      <PopupWrapp>
	<button style={xButton}  onClick={toglePopup}>x</button>
	{
	  images.map( (image,index) => {
	    return (<img alt="" src={`./images/${image}`}  key={index} style={img} onClick={ () => handlBgChange(image)} /> )
	  })
	}
      </PopupWrapp>
      
    )
  },[])
  return (
    <>
      <BgBtn onClick={toglePopup} ref={changeBgBtnRef}>Change BG</BgBtn>
      <Popup  opened={showPopup} onClose={toglePopup} width="1087px" height="80vh">
	{MemoizedIMgs}
      </Popup>
    </>
  )
  
}

const xButton = {
  "position": "absolute",
  "color": "white",
  "background": "#933939",
  "borderRadius": "30px",
  "top": "10px",
  "right": "10px",
  "cursor": "pointer",
  "width": "25px",
  "height": "25px",
  "border": "none"
}

const BgBtn = styled.button`
  width: 200px;
  height: 50px;

  border: 1px solid white;

  --border: 5px;    /* the border width */
  --slant: 0.7em;   /* control the slanted corners */
  --color: #f3738a; /* the color */
  
  font-size: 25px;
  padding: 0.4em 1.2em;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #f3738a;
  background: 
     linear-gradient(to bottom left,#f3738a  50%,#0000 50.1%) top right,
     linear-gradient(to top   right,#f3738a  50%,#0000 50.1%) bottom left;
  background-size: calc(var(--slant) + 1.3*var(--border)) calc(var(--slant) + 1.3*var(--border));
  background-repeat: no-repeat;
  box-shadow:
    0 0 0 200px inset var(--s,#0000),
    0 0 0 var(--border) inset #f3738a;
  clip-path: 
      polygon(0 0, calc(100% - var(--slant)) 0, 100% var(--slant),
              100% 100%, var(--slant) 100%,0 calc(100% - var(--slant))
             );
  transition: color var(--t,0.3s), background-size 0.3s;

  &:focus-visible {
  outline-offset: calc(-1*var(--border));
  outline: var(--border) solid #000c;
  clip-path: none;
  background-size: 0 0;
  } 
  &:hover,
  &:active{
  background-size: 100% 100%;
  color: #fff;
  --t: 0.2s 0.1s;
  }
  &:active {
  --s: #0005;
  transition: none;
  }
`

const PopupWrapp = styled.div`
  display: flex;
  padding: 25px;
  padding: 25px;
  flex-wrap: wrap;
  position: absolute;
  height: 80vh;
  max-width: 1087px;
  background-color: #f8f8f8;
  z-index: 4;
  overflow:scroll;
  box-sizing: border-box;
`
const img={
  "width":"340px",
  "height":"300px",
  "padding": "20px",
  "boxSizing": "border-box"
}
