import ReactDOM from 'react-dom';
import {useState,useEffect, useRef} from 'react'
import {Overlay,Container,PopupContentWrapp} from './styledComponents/popup'
import {CSSTransition} from 'react-transition-group'
import styles from './popup.module.css';
import {ANIMATION_TIME} from '../consts'

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

export const useMount = ({opened}) => {
  const [mounted,setMounted] = useState(false)
  const timerRef = useRef()
  useEffect( () => {
    if(opened && !mounted) {
      setMounted(true);
      timerRef.current = null
    } else if(!opened && mounted) {
      timerRef.current = setTimeout( () => {
	setMounted(false)
	timerRef.current = null
      },ANIMATION_TIME)
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
  const containerRef = useRef()
  const [animationIn,setAnimationIn] = useState(false)
  function handleFocus(e){
    e.preventDefault()
    e.stopPropagation()
    containerRef.current.focus()
  }
  useEffect( () => {
    if (opened){
      setTimeout( () => containerRef.current.focus(),ANIMATION_TIME)
      document.body.style.overflowY = "hidden"
    }
    setAnimationIn(opened)
    return () => document.body.style.overflowY = "auto"
  },[opened])
  return (
    <div tabIndex={2} >
      <a href="#" onFocus={handleFocus} className={styles.focusKeeper} />
      <div  tabIndex={0} className={styles.container} ref={containerRef}>
	<CSSTransition nodeRef={overlayRef} timeout={ANIMATION_TIME} mountOnEnter unmountOnExit in={animationIn} classNames={overlayAnimation}>
	  <Overlay ref={overlayRef} onClick={onClose}  role="button" tabIndex={1} />
	</CSSTransition>
	<CSSTransition nodeRef={popupContenRef}
		       timeout={ANIMATION_TIME}
		       mountOnEnter
		       unmountOnExit
		       classNames={contentAnimation}
		       in={animationIn}>
	  <PopupContentWrapp width={width} height={height} ref={popupContenRef} role="dialog" className={styles.content}>
	    {children}
	  </PopupContentWrapp>
	</CSSTransition>
      </div>
      <a href="#" onFocus={handleFocus} className={styles.focusKeeper}/>
    </div>
  )
}



export default Popup;
