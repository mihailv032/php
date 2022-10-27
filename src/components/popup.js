import ReactDOM from 'react-dom';
import {useState,useEffect, useRef} from 'react'
import {Overlay,Container,PopupContentWrapp} from './styledComponents/popup'
import {CSSTransition} from 'react-transition-group'
import styles from './popup.module.css';

const contentAnimation = {
  enter: styles.contentAnimationEnter,
  enterActive: styles.contentAnimationEnterActive,
  exit: styles.contentAnimationExit,
  exitActive: styles.contentAnimationExitActive,
}

const overlayAnimation = {
  enter: styles.overlayAnimationEnter,
  enterActive: styles.overlayAnimationEnterActive
}

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

function Popup({opened,onClose,children,width,height}){
  const {mounted} = useMount({opened})
  if (!mounted){
    return null;
  }

  return (
    <Portal>
      <PopupLayout onClose={onClose} opened={opened} width={width} height={height}>
	{children}
      </PopupLayout>
    </Portal>
  )
}


function PopupLayout({opened,onClose,children,width,height}){
  const overlayRef = useRef()
  const popupContenRef = useRef()
  
  const [animationIn,setAnimationIn] = useState(false)
  useEffect( () => {
    setAnimationIn(opened)
  },[opened])

  return (
    <Container>
      <CSSTransition nodeRef={overlayRef} timeout={300} mountOnEnter unmountOnExit in={animationIn} classNames={overlayAnimation}>
	<Overlay ref={overlayRef} onClick={onClose}  role="button" tabIndex='0' />
      </CSSTransition>
      <CSSTransition nodeRef={popupContenRef}
		     timeout={300}
		     mountOnEnter
		     unmountOnExit
		     classNames={contentAnimation}
		     in={animationIn}>
	<PopupContentWrapp width={width} height={height} ref={popupContenRef} role="dialog" className={styles.content}>{children}</PopupContentWrapp>
      </CSSTransition>
    </Container>
    
  )
}



export default Popup;
