import React, { useState, useMemo, useEffect, useContext, createContext } from 'react';
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

const TodoWrapperContext = createContext({})
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
    this.props.setHotkey("U",() => this.todoInputRef.current.focus(),true)
    console.log(storedTodoItems)
    this.setState({todoItems: storedTodoItems})
  }
  componentDidUpdate(prevProps,prevState){
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
  }
  handleSubmitItem(e,title){
    e.preventDefault()
    const id=uuidv4()
    this.setState( prevState => ({
      todoItems: [{title: title,description: "",id:id},...prevState.todoItems]
    }))

      fetch(URL+"/addtodoitem",{
	mode: 'cors',
	method: "POST",
	headers: {"Content-Type": "application/json",token: localStorage.getItem("token")},
	body: JSON.stringify({title: title})
      })
     .then( res => res.json())
     .then( res => {
       if(!res.message){console.log(res.error); return;};
       for(let i=0;i<this.state.todoItems.length;i++){
         if(this.state.todoItems[i].id == id){
           this.state.todoItems[i].id = res.todo_item.id;
           localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems));
           return;
     }}})
  }
  async handleChangeTitle(e,todoIndex,newTitle){
    e.preventDefault()
    this.state.todoItems[todoIndex].title = newTitle
    //this will not triger the componentWill update to avoid unneccessary re-render so we just save it manually
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
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
    this.state.todoItems[TodoIndex].description[descIndex] = desc
    //this will not triger the componentWill update to avoid unneccessary re-render so we just save it manually
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
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
        <Categories render={ ({categories,addCategory,deleteCategory}) => { 
          return (
            <TodoWrapperContext.Provider
              value={{
	        todoItems: this.state.todoItems,
	        handleSubmitItem:this.handleSubmitItem,
	        handlDeleteItem:this.handlDeleteItem,
	        handleAddDescription:this.handleAddDescription,
	        handleChangeDescription:this.handleChangeDescription,
	        handleRemoveDescription:this.handleRemoveDescription,
	        handleChangeTitle:this.handleChangeTitle,
                todoInputRef:this.todoInputRef,
                categories:categories,
                addCategory:addCategory,
                deleteCategory:deleteCategory,
              }}
            >
              <Todo/>
            </TodoWrapperContext.Provider>
          )
        }}/>
      
    )
  }
};


function Todo(){
  const {todoItems,categories} = useContext(TodoWrapperContext)
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems,categories}),[todoItems,categories])
  console.log('re-rendered')
  return (
    <StyledTodo>
      <TodoHeader/>
      {TodoItemsContainerWrapp}
    </StyledTodo>
  );
}
      
function TodoHeader(){
  const [input,setInput] = useState("")
  const [showDD,setShowDD] = useState(false)
  const {todoInputRef,handleSubmitItem,categories,addCategory,deleteCategory} = useContext(TodoWrapperContext)
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

function TodoItemsContainer({todoItems,categories}) {
  return (
    <TodoContainer>
      {
	todoItems.map( (todoItem,index) => {
//          if(isNaN(todoItem.id)) 
	  return (
            < TodoItem text={todoItem}
	    key={todoItem.id}
            id={todoItem.id}
	    index={index}
            categories={categories}/>
	  )
	})
      }
    </TodoContainer>
  )
}

function TodoItem({text,categories,index,id}) {
  return (
    <TodoItemContainer>
      <TodoTitle originalTitle={text.title} index={index} />
      <TodoSideBtns index={index} />
      <TodoItemDescription desc={text.description} index={index} />
    </TodoItemContainer>
  )
}

function TodoTitle({originalTitle,index}){
  const [title,setTitle] = useState(originalTitle)
  const {handleChangeTitle} = useContext(TodoWrapperContext)
  return (
    <TodoItemInputContainer onSubmit={e => { e.preventDefault(); handleChangeTitle(e,index,title)}}>
      <StyledTodoItem value={title} onChange={(e) => setTitle(e.target.value)} type="input" />
      <TitleSubmitButton onSubmit={e =>{ handleChangeTitle(e,index,title)}}></TitleSubmitButton>
    </TodoItemInputContainer>
    
  )
}

function TodoSideBtns({index}){
  const [showSlidingMenu,setShowSlidingMenu] = useState(false)
  const {handlDeleteItem,categories} = useContext(TodoWrapperContext)
  return (
    <div>
      <TodoSideBtuttons>
        <DeleteBtn onClick={ () => handlDeleteItem(index)}>X</DeleteBtn>
        
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
  )
}

const TodoItemDescription = ({desc,index}) => {
  const [showDescription,setShowDescription] = useState(false)
  return (
    <DescriptionContainer>
    { (Array.isArray(desc) && showDescription) &&
      desc.map( (description,descIndex) => {
	return (<DescriptionTextArea
		  desc={description}
		  descIndex={descIndex}
		  todoIndex={index}
		  key={uuidv4()} />
	)	
      })
    }
      {(showDescription || desc.length == 0) && <TodoDescriptionFooter todoIndex={index} desc={desc}/>}
      { desc.length > 0 && 
      <DescriptionButton onClick={ () =>{setShowDescription(!showDescription)}}>
	{showDescription ? "Hide Description" : "Show Description"}
      </DescriptionButton>
      }
    </DescriptionContainer>
  )
}

const TodoDescriptionFooter = ({todoIndex,desc}) => {
  const [inputValue,setInputValue] = useState("")
  const {handleAddDescription} = useContext(TodoWrapperContext)
  return (
    <>
      <DescritionInputContainer onSubmit={(e) =>{setInputValue("");handleAddDescription(e,todoIndex,inputValue)}}>
	<DescriptionInput placeholder="Description" value={inputValue}  onChange={(e) => setInputValue(e.target.value)} />
      </DescritionInputContainer>
    </>
  )
}

const DescriptionTextArea = ({desc,descIndex,todoIndex}) => {
  const [textAreatValue,setTextAreaValue] = useState(desc)
  const [changed,setChanged] = useState(false)
  const {handleChangeDescription,handleRemoveDescription} = useContext(TodoWrapperContext)
  return (
	  <DescriptionContentContainer>
	    <DescriptionContent value={textAreatValue} onChange={ e =>{if(!changed){setChanged(true)};setTextAreaValue(e.target.value)}} />
	    <DescriptionButtonContainer>
	      <DescriptionDeleteButton onClick={e => handleRemoveDescription(e,todoIndex,descIndex) }>
		X
	      </DescriptionDeleteButton>
	      { changed &&
		<DescriptionSaveButton onClick={(e) =>{setChanged(false);handleChangeDescription(e,todoIndex,textAreatValue,descIndex)}}>
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
