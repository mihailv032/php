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
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : "qwe"
    console.log(storedTodoItems)
    this.setState({todoItems: storedTodoItems})
    console.log('hre')
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

const styledInput = {
  "fontSize": "20px",
  "width": "277px"
}

const StyledTodo = styled.div`
  width: 400px;
 height: 500px;
`

const TodoContainer = styled.div`
  
`

const StyledTodoItem = styled.div`
  display:flex;
`

const TodoItemContainer = styled.div`
  display: flex;
  justifyContent: space-between;
  marginTop: 15px;
  marginBottom: 15px;
`

const InputContainer = styled.form`
  display: flex;
  width: 100%;
`

const submitBtn = {
  "background": "#933939",
  "color": "white",
  "fontWeight": "bold",
  "fontSize": "20px",

  "paddingTop": "5px",
  "paddingBottom": "5px",
  "paddingLeft": "20px",
  "paddingRight": "20px",

  "border": "none",

  "marginLeft": "20px"
}

export default TodoWrapper;
