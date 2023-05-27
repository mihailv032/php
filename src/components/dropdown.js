import { useState, useRef, useEffect } from 'react'
import {useMount} from './popup'
import {CSSTransition} from 'react-transition-group'
import {ANIMATION_TIME} from '../consts'
import styles from './styles/context.module.css'

const contextAnimation = {
  enter: styles.contentAnimationEnter,
  enterActive: styles.contentAnimationEnterActive,
  exit: styles.contentAnimationExit,
  exitActive: styles.contentAnimationExitActive,
}

const slidingMenuAnimation = {
  enter: styles.slidingEnter,
  enterActive: styles.slidingActive,
  exit: styles.slidingAnimationExit,
  exitActive: styles.slidingAnimationExitActive,

}
export default function ContextMenu({opened,onClose,children}){
  const {mounted} = useMount({opened})
  if (!mounted){
    return null;
  }

  return (
    <ContextMenuContent opened={opened} onClose={onClose}>
      {children}
    </ContextMenuContent>
  )
}

function ContextMenuContent({children,onClose,opened}){
  const containerRef = useRef()
  const contentRef = useRef()
  const [animationIn,setAnimationIn] = useState(false)

  useEffect( () => containerRef.current.focus(),[])
  useEffect( () => setAnimationIn(opened),[opened])
  return (
    <div tabIndex={0} ref={containerRef} onBlur={onClose} style={{position: "absolute"}} >
      <CSSTransition nodeRef={contentRef} timeout={ANIMATION_TIME} mountOnEnter unmountOnExit in={animationIn} classNames={contextAnimation}>
	<div ref={contentRef} className={styles.container}>
	  {children}
	</div>
      </CSSTransition>
    </div>
  )
}

export function SlidingMenu({opened,onClose,children}){
  const {mounted} = useMount({opened})
  if (!mounted){
    return null;
  }
  return (
    <SlidingMenuContent opened={opened} onClose={onClose}>
      {children}
    </SlidingMenuContent>
  )
}

function SlidingMenuContent({children,onClose,opened}){
  const [animationIn,setAnimationIn] = useState(false)
  const containerRef = useRef()
  const contentRef = useRef()

  useEffect( () => setAnimationIn(opened),[opened])

  return (
    <CSSTransition nodeRef={contentRef} timeout={ANIMATION_TIME} mountOnEnter unmountOnExit in={animationIn} classNames={slidingMenuAnimation}>
      <div ref={contentRef} className={styles.slidingContainer}>
        {children}
      </div>
    </CSSTransition>
  )
}
