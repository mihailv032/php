import {useState, useContext, useEffect} from 'react'
import {AppContext} from '../context'
import Popup from "./popup"
export default function TicTacToe(){
  const {setWord} = useContext(AppContext)
  const [opened,setOpened] = useState(false)
//  const keyCombs = new Map();
  
  
  useEffect( () => setWord(["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],() => setOpened(true)),[])
  return (
    <Popup opened={opened} onClose={() => setOpened(false) }>
      <div>
        <h1></h1>
      </div>
    </Popup>
  )
}
