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
  overflow-x: hidden;
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

export const TodoSideBtuttons = styled.div`
   position: absolute;
  top: 0;
  right: 0; 
`

export const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

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
  overflow:hidden;
  display:block;
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

export const TodoHeaderWrapp = styled.header`
  margin-bottom: 30px;
`
export const InputContainer = styled.form`
  display: flex;
  width: 100%;

`

export const CategorySvg = styled.img`
  margin-top: 10px;
  fill: #94d31b; 
  border: white;
  background-color: white;
  color: white;
  max-width: 50px;
  max-height: 50px;
`

export const ItemCategoriesContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: relative;

`

export const ItemCategoriesWrapper = styled.div`
  position: absolute;
  right: 25px;
  background: rgb(63,94,251);
  background: linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
  border-radius: 5px;
  padding: 10px;
  display: flex;
 `

export const SyncList = styled.button`
  position: relative;
  background: #444;
  color: #8A2BE2;
  text-decoration: none;
  text-transform: uppercase;
  border: none;
  letter-spacing: 0.1rem;
  font-size: 1rem;
  padding: 1rem 3rem;
  transition: 0.2s;
  margin-bottom: 10px;
&:hover {
  letter-spacing: 0.2rem;
  padding: 1.1rem 3.1rem;
  background: #8A2BE2;
  color: #8A2BE2;
  /* box-shadow: 0 0 35px #8A2BE2; */
  animation: box 0.5s ease-in;
}

&::before {
  content: "";
  position: absolute;
  inset: 2px;
  background: #272822;
}

& span {
  position: relative;
  z-index: 1;
}
& i {
  position: absolute;
  inset: 0;
  display: block;
}

& i::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 2px;
  left: 80%;
  top: -2px;
  border: 2px solid #8A2BE2;
  background: #272822;
  transition: 0.2s;
}

&:hover i::before {
  width: 15px;
  left: 20%;
  animation: move 3s infinite;
}

& i::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 2px;
  left: 20%;
  bottom: -2px;
  border: 2px solid #8A2BE2;
  background: #272822;
  transition: 0.2s;
}

&:hover i::after {
  width: 15px;
  left: 80%;
  animation: move 3s infinite;
}

@keyframes move {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes box {
  0% {
    box-shadow: #27272c;
  }
  50% {
    box-shadow: 0 0 25px #8A2BE2;
  }
  100% {
  box-shadow: #27272c;
  }
}
`

export const TodoCtgBtn = styled.button`
  background-color: ${props => props.active ? "transparent" : "red"}

`
