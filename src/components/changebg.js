import {useState,React} from 'react'
import styled from 'styled-components'
const images = require('../images.json').images
console.log(images)

function ChangeBg({toglePopup,showPopup,handlBgChange}){
//  const [value,Input] = useInput()
  return (
    <>
      { !showPopup && <BgBtn onClick={toglePopup}>Change BG</BgBtn> }
      { showPopup &&
      <Popup>
	<button style={xButton}  onClick={toglePopup}>x</button>
	{
	  images.map( (image,index) => {
	    return (<img alt="" src={`./images/${image}`}  key={index} style={img} onClick={ () => handlBgChange(image)} /> )
	  })
	}
      </Popup>
      }
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
  "cursort": "pointer"
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

const Popup = styled.div`
  padding: 20px;
  padding-top: 100px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: absolute;
  top: 20%;
  min-width: 200px;
  max-width: 80%;
  height: 80vh;
  background-color: grey;
  z-index: 19999;
  overflow:scroll;
`
const img={
  "width":"300px",
  "height":"300px",
  "padding": "20px",
}

export default ChangeBgContainer
