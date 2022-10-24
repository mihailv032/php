import {useState,React} from 'react'
import styled from 'styled-components'
import Popup from './popup'
const images = require('../images.json').images

function ChangeBg({toglePopup,showPopup,handlBgChange}){
//  const [value,Input] = useInput()
  return (
    <>
      { !showPopup && <BgBtn onClick={toglePopup}>Change BG</BgBtn> }
      <Popup  opened={showPopup} onClose={toglePopup}>
	<PopupWrapp>
	  <button style={xButton}  onClick={toglePopup}>x</button>
	  {
	    images.map( (image,index) => {
	      return (<img alt="" src={`./images/${image}`}  key={index} style={img} onClick={ () => handlBgChange(image)} /> )
	    })
	  }
	</PopupWrapp>
      </Popup>
    </>
  )
  
}

function ChangeBgContainer({updateBg}){
  const [showPopup,setShowPopup] = useState(false)

  const toglePopup = () => showPopup ? setShowPopup(false) : setShowPopup(true)
  const handlBgChange = (bg) => {updateBg(bg);toglePopup()}

  return (
    <ChangeBg toglePopup={ toglePopup }
	      showPopup={showPopup}
	      handlBgChange={handlBgChange}
    />
  )
}
const xButton = {
  "position": "absolute",
  "color": "black",
  "backgroud": "white",
  "top": "10px",
  "right": "10px",
  "cursort": "pointer",
  "width": "25px",
  "height": "25px",
}

const BgBtn = styled.button`
  width: 250px;
  height: 50px;
  background: transparent;
  borders: 2px solid grey;
  font-size: 20px;
  font-family: sans-serif;
  color: white;
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

export default ChangeBgContainer
