import ReactDOM from 'react-dom';
import {useState,useEffect, Children} from 'react'
import {Overlay,Container} from './styledComponents/popup'

const useMount = ({opened}) => {
  const [mounted,setMounted] = useState(false)

  useEffect( () => {
    if(opened && !mounted) {
      setMounted(true);
    } else if(!opened && mounted) {
      setTimeout( () => {
	setMounted(false)
      },300)
    }
  },[opened])
  return {
    mounted,
  }
}
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

function Popup({opened,onClose,children}){
  const {mounted} = useMount({opened})
  if (!mounted){
    return null;
  }
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
