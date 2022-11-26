import React, {useState,useMemo,useEffect,useRef} from 'react'
import styled from 'styled-components'
import Popup from './popup'
const images = require('../images.json').images

export default function ChangeBg({updateBg,setHotkey}){
  const [showPopup,setShowPopup] = useState(false)
  const changeBgBtnRef = useRef()

  const toglePopup = () => showPopup ? setShowPopup(false) : setShowPopup(true)
  const handlBgChange = (bg) => {updateBg(bg);toglePopup()}
  useEffect( () => setHotkey(")", () => changeBgBtnRef.current.click()),[])
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
  width: 250px;
  height: 50px;
  background: transparent;
  borders: 2px solid grey;
  font-size: 20px;
  font-family: sans-serif;
  color: white;

  border: 1px solid white;
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
