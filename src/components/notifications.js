import { forwardRef, useEffect, useState, useImperativeHandle } from 'react'
import {Contianer} from './styledComponents/notifications'
import {Portal} from './popup'

export const Notifications = forwardRef( ({},ref) => {
  const [opened,setOpen] = useState(false)
  const [msg,setMsg] = useState("")
  const [types] = useState({"success":{"color":"#5CB85C"},"error":{color: "#D8524E"},"warning":{color: "#FFC400"},"info":{color:"#393939"}})
  const [type,setType] = useState(types.warning)
  let timeoutId;
  useImperativeHandle(ref, () => ({
    //show message; setMessage type and set message content
    showMessage(msg="Something Went Wrong",type="error"){setOpen(true);setMsg(msg);setType(Object.keys(types).indexOf(type) !== -1 ? types[type] : types.info)}}))
  useEffect( () =>{if(opened){timeoutId = setTimeout(() => setOpen(false), 3000)}},[opened])
  if(!opened) return;
  return (
    <Portal>
      <Contianer color={type.color} onMouseEnter={() => clearTimeout(timeoutId)}>
	<button onClick={() => setOpen(false) }>X</button>
	<h3>{msg}</h3>
      </Contianer>
    </Portal>
    
  )
})

