import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';
import {StyledInput,
	TodoContainer,
	TodoSideBtuttons,
	TodoItemContainer,
	StyledTodoItem,
	DeleteBtn,
	DescriptionContainer,
	DescriptionButton,
	DescriptionContentContainer,
	DescriptionContent,
	DescriptionInput,
	DescritionInputContainer,
	InputContainer,
	DescriptionDeleteButton,
	DescriptionSaveButton,
	DescriptionButtonContainer,
	TodoItemInputContainer,
	TitleSubmitButton} from './styledComponents/todo'
class TodoWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      inputValue: ""
    }
    this.todoInputRef = React.createRef();

    this.handlDeleteItem = this.handlDeleteItem.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddDescription = this.handleAddDescription.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleRemoveDescription = this.handleRemoveDescription.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
  }
  componentDidMount(){
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : []
    this.setState({todoItems: storedTodoItems})
    this.props.setHotkey("U",() => this.todoInputRef.current.focus())
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
  handleChangeTitle(e,todoIndex,newTitle){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    todoItems[todoIndex].title = newTitle
    this.setState({todoItems: todoItems})
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
    }else todoItems[index].description = [desc,...todoItems[index].description]
    this.setState({todoItems: todoItems})
  }
  handleChangeDescription(e,TodoIndex,desc,descIndex){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    todoItems[TodoIndex].description[descIndex] = desc
    this.setState({todoItems: todoItems})
  }
  handleRemoveDescription(e,todoIndex,descIndex){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    todoItems[todoIndex].description.splice(descIndex,1)
    console.log(todoItems[todoIndex].description)
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
	     handleChangeDescription={this.handleChangeDescription}
	     handleRemoveDescription={this.handleRemoveDescription}
	     handleChangeTitle={this.handleChangeTitle} todoInputRef={this.todoInputRef} />
  }
};

function Todo({todoItems,inputValue,handleSubmitItem,handleInput,handlDeleteItem,handleAddDescription,handleChangeDescription,handleRemoveDescription,handleChangeTitle,todoInputRef}){
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems:todoItems,handlDeleteItem,handleAddDescription,handleChangeDescription,handleRemoveDescription,handleChangeTitle}),[todoItems])
  return (
    <StyledTodo>
      <InputContainer onSubmit={handleSubmitItem}>
	<StyledInput name="" type="text" onChange={handleInput} value={inputValue} ref={todoInputRef} />
      </InputContainer>
      {TodoItemsContainerWrapp}
{/*      <TodoItemsContainer
	todoItems={todoItems}
	handlDeleteItem={handlDeleteItem}
	handleAddDescription={handleAddDescription}
	handleChangeDescription={handleChangeDescription}
      />*/}
    </StyledTodo>
  );
}
      
function TodoItemsContainer({todoItems,handlDeleteItem,handleAddDescription,handleChangeDescription,handleRemoveDescription,handleChangeTitle}) {
  return (
    <TodoContainer>
      {
	todoItems.map( (todoItem,index) => {
	  return (< TodoItem text={todoItem}
	    deleteItem={() => handlDeleteItem(index)}
	    key={uuidv4()}
	    handleAddDesc={handleAddDescription} 
	    index={index}
	    handleChangeDescription={handleChangeDescription}
	    handleRemoveDescription={handleRemoveDescription}
	    handleChangeTitle={handleChangeTitle}/>
	  )
	})
      }
    </TodoContainer>
  )
}

function TodoItem({text,deleteItem,handleAddDesc,index,handleChangeDescription,handleRemoveDescription,handleChangeTitle}) {
  const [title,setTitle] = useState(text.title)
  const MemoizedTodoDescription = useMemo( () => {
    return (
      <TodoItemDescription desc={text.description}
			   handleAddDesc={handleAddDesc}
			   index={index}
			   handleChangeDescription={handleChangeDescription}
			   handleRemoveDescription={handleRemoveDescription} />
      
    )
  },[text,index])
  return (
    <TodoItemContainer>
      <TodoItemInputContainer onSubmit={e =>{ handleChangeTitle(e,index,title)}}>
	<StyledTodoItem value={title} onChange={(e) => setTitle(e.target.value)} type="input" />
	<TitleSubmitButton onSubmit={e =>{ handleChangeTitle(e,index,title)}}></TitleSubmitButton>
      </TodoItemInputContainer>
      <div>
	<TodoSideBtuttons>
	  <DeleteBtn onClick={deleteItem}>X</DeleteBtn>
	  <h5>ctg</h5>
	</TodoSideBtuttons>
      </div>
      {MemoizedTodoDescription}
    </TodoItemContainer>
  )
}

const TodoItemDescription = ({desc,handleAddDesc,index,handleChangeDescription,handleRemoveDescription}) => {
  const [showDescription,setShowDescription] = useState(false)
  function handleShowDescription(){
    setShowDescription(!showDescription)
  }
  return (
    <DescriptionContainer>
    { (Array.isArray(desc)) && (showDescription || (desc.length === 1 && desc[0].length <= 35) ) &&
      desc.map( (description,descIndex) => {
	return (<DescriptionTextArea
		  desc={description}
		  descIndex={descIndex}
		  handleChangeDescription={handleChangeDescription}
		  handleRemoveDescription={handleRemoveDescription}
		  todoIndex={index}
		  key={uuidv4()} />
	)	
      })
    }
    { ((desc && desc.length !== 0 && showDescription) || !(desc && desc.length !== 0) || (desc.length === 1 && desc[0].length <= 35)) &&
      <DescriptionInputWrapp
	handleAddDesc={handleAddDesc}
	todoIndex={index} />
    }
    {  (desc && desc.length !== 0)  ? (desc.length !== 1 || desc[0].length > 35) && 
      <DescriptionButton onClick={handleShowDescription}>
	{showDescription ? "Hide Description" : "Show Description"}
      </DescriptionButton> : null
      
    }
    </DescriptionContainer>
  )
}

const DescriptionInputWrapp = ({handleAddDesc,todoIndex}) => {
  const [inputValue,setInputValue] = useState("")
  return (
      <DescritionInputContainer onSubmit={(e) => handleAddDesc(e,todoIndex,inputValue)}>
	<DescriptionInput placeholder="Description" value={inputValue}  onChange={(e) => setInputValue(e.target.value)} />
      </DescritionInputContainer>
  )
}

const DescriptionTextArea = ({desc,descIndex,handleChangeDescription,todoIndex,handleRemoveDescription}) => {
  const [textAreatValue,setTextAreaValue] = useState(desc)
  return (
	  <DescriptionContentContainer>
	    <DescriptionContent value={textAreatValue} onChange={ e => setTextAreaValue(e.target.value)} />
	    <DescriptionButtonContainer>
	      <DescriptionDeleteButton onClick={e => handleRemoveDescription(e,todoIndex,descIndex) }>
		X
	      </DescriptionDeleteButton>
	      { textAreatValue !== desc &&
		<DescriptionSaveButton onClick={(e) => handleChangeDescription(e,todoIndex,textAreatValue,descIndex)}>
		✔️
	      </DescriptionSaveButton>
	      }
	    </DescriptionButtonContainer>
	  </DescriptionContentContainer>

  )
}

const StyledTodo = styled.div`
  width: 100%;
  height: 500px;
`

export default TodoWrapper;
