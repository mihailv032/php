import React, { useState, useMemo, useEffect, useContext} from 'react';
import { AppContext } from '../App';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';
import {SlidingMenu} from '../components/dropdown'
import Categories, {AddCategoryDD} from '../components/categories'
import {URL} from '../consts'
import {StyledInput,
	TodoContainer,
        ItemCategoriesWrapper,
        ItemCategoriesContainer,
        CategoryBtn,
	TodoSideBtuttons,
        TodoHeaderWrapp,
        CategorySvg,
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
    }
    this.todoInputRef = React.createRef();

    this.handlDeleteItem = this.handlDeleteItem.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleAddDescription = this.handleAddDescription.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleRemoveDescription = this.handleRemoveDescription.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
  }

  componentDidMount(){
    console.log(this.context)
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : []
    console.log(storedTodoItems)
    this.setState({todoItems: storedTodoItems})
  }
  componentDidUpdate(prevProps,prevState){
//    if( !(prevState.todoItems != this.state.todoItems)) return;
    if((prevProps.loggedIn != this.props.loggedIn) && this.props.loggedIn) this.migration()
    this.props.setHotkey("U",() => this.todoInputRef.current.focus())
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
  }
  handleSubmitItem(e,title){
    e.preventDefault()
    
    this.setState( prevState => ({
      todoItems: [{title: title,description: "",id:uuidv4()},...prevState.todoItems]
    }))
  }
  async handleChangeTitle(e,todoIndex,newTitle){
    e.preventDefault()
    let todoItems = this.state.todoItems
    todoItems[todoIndex].title = newTitle
    this.setState({todoItems: todoItems})
  }
  async handlDeleteItem(index){
    const todoItemsArr = [...this.state.todoItems]
    todoItemsArr.splice(index,1)
    this.setState({todoItems:  todoItemsArr})
  }
  async handleAddDescription(e,index,desc){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    if(todoItems[index].description.length === 0){
      todoItems[index].description = [desc]
    }else todoItems[index].description = [desc,...todoItems[index].description]
    this.setState({todoItems: todoItems})
  }
  async handleChangeDescription(e,TodoIndex,desc,descIndex){
    e.preventDefault()
    let todoItems = this.state.todoItems
    todoItems[TodoIndex].description[descIndex] = desc
    this.setState({todoItems: todoItems})
  }
  async handleRemoveDescription(e,todoIndex,descIndex){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    todoItems[todoIndex].description.splice(descIndex,1)
    console.log(todoItems[todoIndex].description)
    this.setState({todoItems: todoItems})
  }
  migration(){
    const newItems = []
    
    try{
      this.state.todoItems.forEach( ({title,id,description,categories}) => {
        //if the item was only stored locally then the id would be uuid which is nan
        if(!isNaN(id)){return newItems.push({title,id,description,categories})};
        fetch(URL+"/addtodoitem",{
	  mode: 'cors',
	  method: "POST",
	  headers: {"Content-Type": "application/json",token: localStorage.getItem("token")},
	  body: JSON.stringify({title: title, description: description, categories: categories})
        })
      }) 
    }catch(err){
      console.log(err)
    }
  }
  async syncItem(item_index){
    const todoitems = [...this.state.todoItems]
    if(!todoitems[item_index]) return;
    const req = await fetch(URL+"/addtodoitem",{
      mode: 'cors',
      method: "POST",
      headers: {"Content-Type": "application/json",token: localStorage.getItem("token")},
      body: JSON.stringify(todoitems[item_index])
    })
    const res = await req.json()
    if(!res.message) return;
    todoitems[item_index].id=res.todo_item.id
      this.setState({todoItems: todoitems})
  }
  async addCategoryToItem(itemIndex,category_id){
    
  }
  async removeCategoryFromItem(itemIndex,cateogry_id){

  }
  render() {
    return (
      <>
        <Categories render={ ({categories,addCategory,deleteCategory}) => { 
          return (
            <Todo
	      todoItems={this.state.todoItems}
	      handleSubmitItem={this.handleSubmitItem}
	      handlDeleteItem={this.handlDeleteItem}
	      handleAddDescription={this.handleAddDescription}
	      handleChangeDescription={this.handleChangeDescription}
	      handleRemoveDescription={this.handleRemoveDescription}
	      handleChangeTitle={this.handleChangeTitle}
              todoInputRef={this.todoInputRef}
              categories={categories}
              addCategory={addCategory}
              deleteCategory={deleteCategory} />
          )
        }}/>
      </>
    )
  }
};


function Todo({todoItems,handleSubmitItem,handlDeleteItem,handleAddDescription,handleChangeDescription,handleRemoveDescription,handleChangeTitle,todoInputRef,categories,addCategory,deleteCategory}){
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems:todoItems,handlDeleteItem,handleAddDescription,handleChangeDescription,handleRemoveDescription,handleChangeTitle,categories:categories}),[todoItems,categories])
  console.log('re-rendered')
  return (
    <StyledTodo>
      <TodoHeader handleSubmitItem={handleSubmitItem}
                  todoInputRef={todoInputRef} categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} />
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
      
function TodoHeader({todoInputRef,handleSubmitItem,categories,addCategory,deleteCategory}){
  const [input,setInput] = useState("")
  const [showDD,setShowDD] = useState(false)

  return (
    <TodoHeaderWrapp>
      <InputContainer onSubmit={e =>{handleSubmitItem(e,input);setInput("")}}>
        <StyledInput name="" type="text" onChange={e => setInput(e.target.value)} value={input} ref={todoInputRef} />
      </InputContainer>
      <CategoryBtn onClick={() => setShowDD(!showDD) }>Add New Category</CategoryBtn>
      {
        categories.map( ({category_id,name,description}) => {
          return <CategoryBtn key={category_id} alt={description}>{name}</CategoryBtn>         
        })
      }
      <AddCategoryDD opened={showDD} handleSubmit={addCategory} />
    </TodoHeaderWrapp>
  )
}

function TodoItemsContainer({todoItems,handlDeleteItem,handleAddDescription,handleChangeDescription,handleRemoveDescription,handleChangeTitle,categories}) {
  return (
    <TodoContainer>
      {
	todoItems.map( (todoItem,index) => {
//          if(isNaN(todoItem.id)) 
	  return (< TodoItem text={todoItem}
	    deleteItem={() => handlDeleteItem(index)}
	    key={todoItem.id}
	    handleAddDesc={handleAddDescription} 
            id={todoItem.id}
	    index={index}
            categories={categories}
	    handleChangeDescription={handleChangeDescription}
	    handleRemoveDescription={handleRemoveDescription}
	    handleChangeTitle={handleChangeTitle}/>
	  )
	})
      }
    </TodoContainer>
  )
}

function TodoItem({text,categories,deleteItem,handleAddDesc,index,handleChangeDescription,handleRemoveDescription,handleChangeTitle,id}) {
  const [title,setTitle] = useState(text.title)
  const [showSlidingMenu,setShowSlidingMenu] = useState(false)
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
        <h3>{}</h3>
	<TodoSideBtuttons>
	  <DeleteBtn onClick={deleteItem}>X</DeleteBtn>

          <ItemCategoriesContainer>
          <CategorySvg alt="" src="./category-icon.svg" onClick={() => setShowSlidingMenu(!showSlidingMenu) } />
          {showSlidingMenu && <ItemCategoriesWrapper>
            <SlidingMenu opened={showSlidingMenu}>
              {
                categories.map( ({name}) => {
                  return <button>{name}</button>
                })
              }
            </SlidingMenu>
          </ItemCategoriesWrapper>}
          </ItemCategoriesContainer>
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
