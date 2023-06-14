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
  background: #1E1E1E;
  border: none;
  border-radius: 5px;
  color: white;
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
  color: white;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  
  box-sizing: border-box;
  background: #1E1E1E;

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
  max-height: 40vh;
  box-sizing: border-box;
`

export const TodoItemContainer = styled.div`
  background: #1A1B1D;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 5px;
  border-radius: 5px;

  position: relative;
  display: flex;
  width: 100%;
  margin-bottom: 15px;
  align-items: center;
  box-sizing: border-box;
`

export const TodoSideBtuttons = styled.div`
  margin-left: 10px;
  height: 100%;
`

export const DeleteBtn = styled.button`
  background: transparent;
  font-weight: bold;
  width : 20px;
  height: 20px;
  border-radius: 100%;
  color: #933939;
  fontWeight: bold;
  fontSize: 20px;
  maxHeight:40p;
  cursor: pointer;
  border: none;
`

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

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
  resize: none;
  margin: 0;

  background-color:rgba(30, 30, 30, 0.5);
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
  max-width: 20px;
  position: absolute;
  right: 0;
  top: 0;
`
export const DescriptionBtns = styled.button`
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  color: white;
  cursort: pointer;
`

export const DescritionInputContainer = styled.form`
  width: 100%;
`

export const DescriptionInput = styled.input`
  width: 100%;
  margin: 0px;
  text-align: center;
  background: #272727;
  
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
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background: #1A1B1D;
  padding-left: 10px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 5px;
`

export const CategorySvg = styled.button`
  margin-top: 10px;
  border: 0;
  color: white;
  font-size: 16px;
  background: none;
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
  background: linear-gradient(153deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
  border-radius: 5px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
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

export const TodoCtgBtn = styled.a`
  cursor: pointer;
  position: relative;
  display: inline-block !importatn;
  flex-shrink: 0;
  padding: 5px 10px;
  color: #FF86FF;
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.5s;
  letter-spacing: 4px;
  overflow: hidden;
  margin-right: 50px;
  &:hover{
    background: #FF86FF;
    color: #050801;
    box-shadow: 0 0 5px #FF86FF,
                0 0 25px #FF86FF,
                0 0 50px #FF86FF,
                0 0 200px #FF86FF;
  }
  & span{
    cursor: pointer;
    position: absolute;
    display: block;
  }
& span:nth-child(1){
    cursor: pointer;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg,transparent,#FF86FF);
    animation: animate1 1s linear infinite;
}
  @keyframes animate1{
    0%{
     left: -100%;
    }
    50%,100%{
      left: 100%;
    }
  }
  & span:nth-child(2){
    cursor: pointer;
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg,transparent,#FF86FF);
    animation: animate2 1s linear infinite;
    animation-delay: 0.25s;
}
@keyframes animate2{
    0%{
        top: -100%;
    }
    50%,100%{
        top: 100%;
    }
}
& span:nth-child(3){
    cursor: pointer;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg,transparent,#FF86FF);
    animation: animate3 1s linear infinite;
    animation-delay: 0.50s;
}
@keyframes animate3{
    0%{
        right: -100%;
    }
    50%,100%{
        right: 100%;
    }
}


& span:nth-child(4){
    cursor: pointer;
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg,transparent,#FF86FF);
    animation: animate4 1s linear infinite;
    animation-delay: 0.75s;
}
@keyframes animate4{
    0%{
        bottom: -100%;
    }
    50%,100%{
        bottom: 100%;
    }
}
  ${props => props.active ? "background: #FF86FF;color: #000" : ""}
`

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 22px;

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  & input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
  }
  & span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  & span:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  }

  & input:checked + span {
    background-color: #FF4742;
  }

  & input:focus + span {
    box-shadow: 0 0 1px #FF4742;
  }

  & input:checked + span:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }
  
  & span {
    border-radius: 34px;
  }
  
  & span:before {
    border-radius: 50%;
  }

`
