import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';
import {StyledInput,TodoContainer,TodoItemContainer,StyledTodoItem,DeleteBtn,DescriptionContainer,DescriptionButton,DescriptionContentContainer,DescriptionContent,DescriptionInput,DescritionInputContainer,InputContainer} from './styledComponents/todo'
class TodoWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      inputValue: ""
    }
    this.handlDeleteItem = this.handlDeleteItem.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddDescription = this.handleAddDescription.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
  }
  componentDidMount(){
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : []
    this.setState({todoItems: storedTodoItems})
  }
  componentDidUpdate(prevProps,prevState){
    if( !(prevState.todoItems != this.state.todoItems)) return;
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
  }

  handleSubmitItem(e){
    e.preventDefault()
    this.setState( prevState => ({
      todoItems: [{title: prevState.inputValue,description: ""},...prevState.todoItems],
      inputValue: ""
    }))
  }
  handleInput(e){
    this.setState({ inputValue: e.target.value })
  }
  handlDeleteItem(index){
    const todoItemsArr = [...this.state.todoItems]
    todoItemsArr.splice(index,1)
    this.setState({todoItems:  todoItemsArr})
  }
  handleAddDescription(e,index,desc){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    if(todoItems[index].description.length === 0){
      todoItems[index].description = [desc]
    }else todoItems[index].description = [desc,todoItems[index].description]
    this.setState({todoItems: todoItems})
  }
  handleChangeDescription(e,index,desc,descIndex){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    todoItems[index].description[descIndex] = desc
    this.setState({todoItems: todoItems})
  }
  render() {
    return <Todo
	     todoItems={this.state.todoItems}
	     inputValue={this.state.inputValue}
	     handleSubmitItem={this.handleSubmitItem}
	     handleInput={this.handleInput}
	     handlDeleteItem={this.handlDeleteItem}
    handleAddDescription={this.handleAddDescription}
    handleChangeDescription={this.handleChangeDescription} />
  }
};

function Todo({todoItems,inputValue,handleSubmitItem,handleInput,handlDeleteItem,handleAddDescription,handleChangeDescription}){
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems:todoItems,handlDeleteItem,handleAddDescription,handleChangeDescription}),[todoItems])
  return (
    <StyledTodo>
      <InputContainer onSubmit={handleSubmitItem}>
	<StyledInput name="" type="text" onChange={handleInput} value={inputValue} />
      </InputContainer>
      {TodoItemsContainerWrapp}
    </StyledTodo>
  );
}
      
function TodoItemsContainer({todoItems,handlDeleteItem,handleAddDescription,handleChangeDescription}) {
  return (
    <TodoContainer>
      {
	todoItems.map( (todoItem,index) => {
	  return (< TodoItem text={todoItem}
	    deleteItem={() => handlDeleteItem(index)}
	    key={uuidv4()}
	    handleAddDesc={handleAddDescription} 
	    index={index}
	    handleChangeDescription={handleChangeDescription}/>
	  )
	})
      }
    </TodoContainer>
  )
}

function TodoItem({text,deleteItem,handleAddDesc,index,handleChangeDescription}) {
  return (
    <TodoItemContainer>
      <StyledTodoItem>{text.title}</StyledTodoItem>
      <DeleteBtn onClick={deleteItem}>X</DeleteBtn>
      <TodoItemDescription desc={text.description}
			   handleAddDesc={handleAddDesc}
			   index={index}
			   handleChangeDescription={handleChangeDescription} />
    </TodoItemContainer>
  )
}

function TodoItemDescription({desc,handleAddDesc,index,handleChangeDescription}){
  const [showDescription,setShowDescription] = useState(false)
  const [inputValue,setInputValue] = useState("")
  const [textAreatValue,setTextAreaValue] = useState(desc)
  function handleShowDescription(index){
    setShowDescription(!showDescription)
  }
  function handleDescInput(e,index){
    let textArea = [...textAreatValue] 
    textArea[index] = e.target.value
    setTextAreaValue(textArea)
  }
  return (
    <DescriptionContainer>
    { (showDescription || (desc.length === 1 && desc[0].length < 30) ) &&
      desc.map( (description,descIndex) => {
	return (
	  <DescriptionContentContainer onSubmit={(e) => handleChangeDescription(e,index,description,descIndex)}>
	    <DescriptionContent value={textAreatValue[descIndex]} onChange={ e => handleDescInput(e,descIndex)} />
	  </DescriptionContentContainer>
      )})
    }
    { ((desc && desc.length !== 0 && showDescription) || !(desc && desc.length !== 0) || (desc.length === 1 && desc[0].length < 30)) &&
      <DescritionInputContainer onSubmit={(e) => handleAddDesc(e,index,inputValue)}>
	<DescriptionInput placeholder="Description" value={inputValue}  onChange={(e) => setInputValue(e.target.value)} />
      </DescritionInputContainer>
    }
    {  (desc && desc.length !== 0)  ? (desc.length !== 1) && 
      <DescriptionButton onClick={handleShowDescription}>
	{showDescription ? "Hide Description" : "Show Description"}
      </DescriptionButton> : null
      
    }
    </DescriptionContainer>
  )
}


const StyledTodo = styled.div`
  width: 400px;
  height: 500px;
`

export default TodoWrapper;
