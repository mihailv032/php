import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';

class TodoWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      inputValues: ""
    }
    this.handlDeleteItem = this.handlDeleteItem.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }
  componentWillMount(){
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : []
    console.log(storedTodoItems)
    this.setState({todoItems: storedTodoItems})
    console.log(storedTodoItems)
  }
  componentDidUpdate(prevProps,prevState){
    if( !(prevState.todoItems != this.state.todoItems)) return;
    console.log(JSON.stringify(this.state.todoItems))
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
  }

  handleSubmitItem(e){
    e.preventDefault()
    this.setState( prevState => ({
      todoItems: [...prevState.todoItems,prevState.inputValue]
    }))
  }
  handleInput(e){
    this.setState( prevState => ({
      input: prevState.input+e.target.value
    }))
  }
  handlDeleteItem(index){
    const todoItemsArr = [...this.state.todoItems]
    todoItemsArr.splice(index,1)
    this.setState( prevState => ({
      todoItems: [...prevState.todoItems.slice(index,1)]
    }))
  }
  
  render() {
    return <Todo todoItems={this.state.todoItems}
    handleSubmitItem={this.handleSubmitItem}
    handleInput={this.handleInput}
    handlDeleteItem={this.handlDeleteItem}/>
  }
};

function Todo({todoItems,inputValue,handleSubmitItem,handleInput,handlDeleteItem}){
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems,handlDeleteItem}),[todoItems])
  return (
    <StyledTodo>
      <InputContainer onSubmit={handleSubmitItem}>
	<input style={styledInput} name="" type="text" onChange={handleInput} value={inputValue} />
	<button style={submitBtn} onClick={handleSubmitItem}>Submit</button>
      </InputContainer>
      {TodoItemsContainerWrapp}
    </StyledTodo>
  );
}
      
function TodoItemsContainer({todoItems,handlDeleteItem}) {
  console.log("render")
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
