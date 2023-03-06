import styled from 'styled-components'

export const TodoItemInputContainer = styled.form`
  width: 100%;
`
export const TitleSubmitButton = styled.button` //needed for the submit to work -_-
  display: none;
`
export const StyledInput = styled.input`
  font-size: 25px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
  outline: none;
  }
`

export const StyledTodoItem = styled.input`
  display:flex;
  flex-wrap: wrapp;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  width: 100%;
  
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  
  box-sizing: border-box;
  background: white;

  text-align: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 20px;

  border: none;

  &:focus {
  outline: none;
  }
  `

export const TodoContainer = styled.div`
  position: relative;
  z-index: 0;
  overflow-y: auto;
  max-width: 500px;
  max-height: 60vh;
  box-sizing: border-box;
`

export const TodoItemContainer = styled.div`
  position: relative;
  padding-right: 30px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 15px;
  align-items: center;
  box-sizing: border-box;
`

export const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  font-weight: bold;
  width : 20px;
  height: 20px;
  border-radius: 100%;
  color: #933939;
  background: white;
  fontWeight: bold;
  fontSize: 20px;
  maxHeight:40p;
  
  border: none;
`

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #71797E;
  width: 100%;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: white;
  font-size: 17px;
`

export const DescriptionButton = styled.button`
  width: 100%;
  background: #404447;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 17px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
`

export const DescriptionContentContainer = styled.div`
  width: 100%;
  position: relative;
`

export const DescriptionContent = styled.textarea`
  margin: 0;
  background: #71797E;
  font-size: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid black;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: white;
  &:focus {
  outline: none;
  }
`

export const DescriptionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: red;
  max-width: 20px;
  position: absolute;
  right: 0;
  top: 0;
`

export const DescriptionDeleteButton = styled.button`
  width: 20px;
  height: 20px;
  background: red;
  border: none;
  color: white;
`
export const DescriptionSaveButton = styled.button`
  width: 20px;
  height: 20px;
  border: none
  background: green;
  color: white;
`

export const DescritionInputContainer = styled.form`
  width: 100%;
`

export const DescriptionInput = styled.input`
  width: 100%;
  margin: 0px;
  text-align: center;
  background: #5b6266;
  border: none;
  box-sizing: border-box;
  color: white;
  font-size: 20px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;

  &:focus {
  outline: none;
  }

`

export const InputContainer = styled.form`
  display: flex;
  width: 100%;
  margin-bottom: 30px;

`

