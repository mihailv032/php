import {useState} from 'react'
import {
  DoubleScreenContainer,
  DoubleScreenBtn,
  DoubleScreenBtnContainer
} from './styledComponents/doubleScreen'

export default function DoubleScreen({title1, Component1, title2,Component2}){
  const [selection,setSelection] = useState(title1)
  return (
    <DoubleScreenContainer>
      <DoubleScreenBtnContainer>
	<DoubleScreenBtn onClick={() => setSelection(title1)}>{title1}</DoubleScreenBtn>
	<DoubleScreenBtn onClick={() => setSelection(title2)}>{title2}</DoubleScreenBtn>
      </DoubleScreenBtnContainer>
      {selection === title1 && Component1}
      {selection === title2 && Component2}
    </DoubleScreenContainer>
  )
}

