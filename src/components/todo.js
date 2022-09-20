import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';

class TodoWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: []
    }
  }
  componentWillMount(){
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : []
    console.log(storedTodoItems)
    this.setState({todoItems: storedTodoItems})
    console.log(storedTodoItems)
  }
  render() {
    return <Todo initialTodo={this.state.todoItems} />
  }
};

function Todo({initialTodo}){
  const [todoItems, setTodoItems] = useState(initialTodo)
  const [inputValue,setInputValue] = useState("")
  function handlSubmitItem(e){
    e.preventDefault()
    setTodoItems([...todoItems,inputValue])
  }
  
  function handlDeleteItem(index){
    const todoItemsArr = [...todoItems]
    todoItemsArr.splice(index,1)
    setTodoItems(todoItemsArr)
  }
  useEffect( () => {
    console.log(JSON.stringify(todoItems))
    localStorage.setItem("todoItems",JSON.stringify(todoItems))
  },[todoItems])
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems,handlDeleteItem}),[todoItems])
  return (
    <StyledTodo>
      <InputContainer onSubmit={handlSubmitItem}>
	<input style={styledInput} name="" type="text" onChange={e => setInputValue(e.target.value) } value={inputValue} />
	<button style={submitBtn} onClick={handlSubmitItem}>Submit</button>
      </InputContainer>
      {TodoItemsContainerWrapp}
    </StyledTodo>
  );
  
}
function TodoItemsContainer({todoItems,handlDeleteItem}) {
  return (
    <TodoContainer>
      {
	todoItems.map( (todoItem,index) => {
	  return < TodoItem text={todoItem} deleteItem={() => handlDeleteItem(index)} key={uuidv4()}/>
	})
      }
    </TodoContainer>
    
  )
}

function TodoItem({text,deleteItem}) {
  return (
    <TodoItemContainer>
      <StyledTodoItem>{text}</StyledTodoItem>
      <button style={submitBtn} onClick={deleteItem}>delete</button>
    </TodoItemContainer>
  )
}

const InputContainer = styled.form`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
`

const styledInput = {
  "fontSize": "20px",
  "width": "272px",
  "boxSizing": "border-box",
}

const StyledTodo = styled.div`
  width: 400px;
 height: 500px;
`

const TodoContainer = styled.div`
  
`

const StyledTodoItem = styled.div`
  display:flex;
  flex-wrap: wrapp;
  min-height: 50px;
  overflow-wrap: break-word;
word-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  width: 277px;

  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;

  box-sizing: border-box;
  background: white;
`

const TodoItemContainer = styled.div`
  display: flex;
  justifyContent: space-between;
  margin-bottom: 15px;
  align-items: center;
`


const submitBtn = {
  "background": "#933939",
  "width" : "110px",
  "color": "white",
  "fontWeight": "bold",
  "fontSize": "20px",
  "maxHeight":"40px",
  "paddingTop": "5px",
  "paddingBottom": "5px",
  "paddingLeft": "20px",
  "paddingRight": "20px",

  "border": "none",

  "marginLeft": "20px"
}

export default TodoWrapper;
