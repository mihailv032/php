import styled from 'styled-components'

export const StyledInput = styled.input`
  font-size: 25px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
  outline: none;
  }
`

export const StyledTodoItem = styled.div`
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
  `

export const TodoContainer = styled.div`
  position: relative;
  z-index: 0;
  overflow: scroll;
  max-height: 700px;
  box-sizing: border-box;
  padding-right: 50px;

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

export const DescriptionContentContainer = styled.form`
  width: 100%;
`

export const DescriptionContent = styled.textarea`
  margin: 0;
  background: #71797E;
  font-size: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  height: 50px;
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

