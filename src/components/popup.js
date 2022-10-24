import ReactDOM from 'react-dom';
import {useState,useEffect, Children} from 'react'
import {Overlay,Container} from './styledComponents/popup'

function Portal({children}){
  const [container] = useState( () => document.createElement('div'));

  useEffect( () => {
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    };
  },[]);
  return ReactDOM.createPortal(children,container)
}

function PopupOverlay({children,onClose}){

}

function Popup({opened,onClose,children}){
  if (!opened) return;
  return (
    <Portal>
      <Container>
	<Overlay onClick={onClose} role="button" tabindex='0'/>
	{children}
      </Container>
    </Portal>
  )
}

export default Popup;
