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

export function Portal({children}){
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

export function LoadingPopup({opened,onClose,text}){

  return (

    <Popup opened={opened} onClose={onClose}>
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <h1>{text}</h1>
      <style jsx>{`
.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #fff;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

        `}</style>

    </Popup>
  )
}

export default Popup;
