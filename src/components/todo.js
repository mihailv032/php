import React, { useState, useMemo, useCallback, useContext, createContext } from 'react';
import { AppContext } from '../context';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';
import {SlidingMenu} from '../components/dropdown'
import Categories, {AddCategoryDD,CategoryBtn} from '../components/categories'
import {CategoryBtn as CtgBtn} from '../components/styledComponents/styled_categories'
import {URL} from '../consts'
import { faBars,faXmark,faPlus,faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {StyledInput,
	TodoContainer,
        Switch,
	SyncList,
        TodoCtgBtn,
        ItemCategoriesWrapper,
        ItemCategoriesContainer,
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
	DescriptionBtns,
	DescriptionButtonContainer,
	TodoItemInputContainer,
	TitleSubmitButton} from './styledComponents/todo'

const TodoWrapperContext = createContext({})
class TodoWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      selectedCategories: [],
      showFiltered: true,
      displayedTodoItems: []//todo items to be shown on the screen
    }
    this.todoInputRef = React.createRef();
    this.handleToggleCategory = this.handleToggleCategory.bind(this)
    this.handleToggleItemCategory=this.handleToggleItemCategory.bind(this)
    this.handleRemoveCategoryFromAllItems=this.handleRemoveCategoryFromAllItems.bind(this)
    this.handleUpdateCategoryId = this.handleUpdateCategoryId.bind(this)
    this.handlDeleteItem = this.handlDeleteItem.bind(this)
    this.handleSubmitItem = this.handleSubmitItem.bind(this)
    this.handleAddDescription = this.handleAddDescription.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleRemoveDescription = this.handleRemoveDescription.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.syncAllItems = this.syncAllItems.bind(this)
    this.syncItem = this.syncItem.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
  }
  static contextType = AppContext
  componentDidMount(){
    const storedTodoItems = localStorage.getItem("todoItems") ? JSON.parse(localStorage.getItem("todoItems")) : []
    this.context.setHotkey("U",() => this.todoInputRef.current.focus(),true)
    console.log(storedTodoItems)
    storedTodoItems.forEach(({ notSynced },index) =>{if (notSynced) this.syncItem(index)})
    if(this.state.showFiltered){this.state.todoItems=storedTodoItems;this.filterItems()}
    else this.setState({ todoItems: storedTodoItems, displayedTodoItems: storedTodoItems })
  }
  componentDidUpdate(prevProps,prevState){
    if((prevProps.loggedIn !== this.props.loggedIn) && this.props.loggedIn)
      this.state.todoItems.forEach(({ notSynced },index) =>{if (notSynced) this.updateItem(index)})
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
  }
  async handleSubmitItem(e,title){
    e.preventDefault()
    if(title.length === 0) return;
    let id;
    if (this.props.loggedIn) { id = await this.handleSendItemToServer(title); if(!id) id=uuidv4() }
    else id=uuidv4();
    const todoItems = [{title: title,description: [],id:id, categories: this.state.selectedCategories},...this.state.todoItems]
    if(this.state.showFiltered){this.state.todoItems=todoItems;this.filterItems()}
    else this.setState( prevState => ({todoItems: todoItems,displayedTodoItems: todoItems}))
  }
  toggleFilter(){
    if(this.state.showFiltered){
      return this.setState( prevState => ({displayedTodoItems: prevState.todoItems,showFiltered: false}))
    }
    this.filterItems()
  }
  filterItems(){
    const filtered = this.state.todoItems.filter( item =>{
      for(let i=0;i<this.state.selectedCategories.length; i++){
        if(item.categories.indexOf(this.state.selectedCategories[i]) !== -1) return item;
      }
      if(this.state.selectedCategories.length === 0){if(item.categories.length === 0) return item}
    })
    console.log(filtered)
    this.setState({displayedTodoItems: filtered, showFiltered: true})
  }
  async handleSendItemToServer(title){
    try{
      const req = await fetch(URL+"/addtodoitem",{
        mode: 'cors',
        credentials: 'include',
        withCredentials: true ,
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: title,category_id: this.state.selectedCategories})
      })
      const res = await req.json()
      if(!res.message){this.context?.showMessageRef.current.showMessage(res.error ? res.error : "could not synchronize todo items", "error"); return false;};
      return res.todo_item.id
    }catch(err){
      console.log(err)
      this.context?.showMessageRef.current.showMessage("could not synchronize todo items", "error")
      return false
    }
  }
  async handleChangeTitle(e,id,newTitle){
    e.preventDefault()
    let index;
    for(let i=0;i<this.state.todoItems.length; i++){
      if(this.state.todoItems[i].id === id){
        index=i;
        this.state.todoItems[i].title = newTitle; 
        localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems));
	break;
      }
    }
    if(this.props.loggedIn && index !== undefined) this.handleChangeItem(id,index)
  }
  handlDeleteItem(id){
    const todoItemsArr = [...this.state.todoItems]
    let index;
    console.log(id)
    for(let i=0;i<todoItemsArr.length; i++){
      console.log(todoItemsArr[i].id)
      if(todoItemsArr[i].id == id){index=i; break}
    }
    //if the item does not exist
    if(index == undefined) return;
    todoItemsArr.splice(index,1)
    if(this.state.showFiltered){this.state.todoItems=todoItemsArr;this.filterItems()}
    else this.setState({todoItems:  todoItemsArr, displayedTodoItems: todoItemsArr})
    
    if(!this.props.loggedIn) return;
    try{
      fetch(URL+"/deletetodoitem",{
        mode: 'cors',
        method: "POST",
        credentials: "include",
        withCredentials: true ,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: id})
      })
    }catch(err){
      console.log(err)
      this.context?.showMessageRef.current.showMessage("could not delete item", "error")
    }
  }
  async handleAddDescription(e,id,desc){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    let index;
    for(let i=0; i<todoItems.length;i++){
      if(todoItems[i].id == id){index=i;break;}
    }
    if(index == undefined) return;
    if(todoItems[index].description.length === 0){
      todoItems[index].description = [desc]
    }else todoItems[index].description = [...todoItems[index].description,desc]
    if(this.state.showFiltered){this.state.todoItems=todoItems;this.filterItems()}
    else this.setState({todoItems: todoItems, displayedTodoItems: todoItems})
    if(this.props.loggedIn) this.handleChangeItem(id,index)    
  }
  async handleChangeDescription(e,id,desc,descIndex){
    e.preventDefault()
    let index;
    for(let i=0;i<this.state.todoItems.length;i++){if(this.state.todoItems[i].id==id){index=i; break}}
    if(index == undefined) return;
    this.state.todoItems[index].description[descIndex] = desc
    localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
    if(this.props.loggedIn) this.handleChangeItem(id,index)       
  }
  async handleRemoveDescription(e,id,descIndex){
    e.preventDefault()
    let todoItems = [...this.state.todoItems]
    let index;
    for(let i=0;i<todoItems.length;i++){if(todoItems[i].id==id){index=i; break}}
    if(index == undefined) return;
    todoItems[index].description.splice(descIndex,1)
    if(this.state.showFiltered){this.state.todoItems=todoItems;this.filterItems()}
    else this.setState({todoItems: todoItems, displayedTodoItems: todoItems})
    
    this.handleChangeItem(id,index)       
  }
  async syncAllItems(){
    if(!this.props.loggedIn) return;
    try{
      this.state.todoItems.forEach( ({title,id,description,categories},index) => {
        //if the item was only stored locally then the id would be uuid which is nan
        if(isNaN(id)){return this.syncItem(index)}
      }) 
      const req = await fetch(URL+"/gettodoitems",{
	mode: 'cors',
	method: "GET",
	credentials: "include",
	withCredentials: true ,
	headers: {"Content-Type": "application/json"},
      })
      const res = await req.json()
      console.log(res)
      if(!res.message){ console.log(res.error); return}
      const itesm = res.todo_items.reduce( (acum,val,index) =>{
	acum[index] = {title: val.name,id: val.id,description: val.desc ? val.desc : []};
	acum[index].categories = val.category_items.reduce( (acum,val,index) =>{acum[index] = val.category_id; return acum},[])
	return acum},[])
      this.setState({todoItems: itesm})
      this.context?.showMessageRef.current.showMessage("All items synchronized", "success")
      console.log(res.todo_items)
    }catch(err){
      console.log(err)
      this.context?.showMessageRef.current.showMessage("could not sync with the server", "error")
    }
  }
  async syncItem(item_index){
    if(!this.props.loggedIn) return;
    const todoitems = [...this.state.todoItems]
    if(!todoitems[item_index]) return;
    try{
      const req = await fetch(URL+"/addtodoitem",{
        mode: 'cors',
        method: "POST",
        credentials: "include",
        withCredentials: true ,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(todoitems[item_index])
      })
      const res = await req.json()
      if(!res.message) return;
      todoitems[item_index].id=res.todo_item.id
      localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
    }catch(err){
      this.context?.showMessageRef.current.showMessage("could not synchronize the item with the server", "error")
      console.log(err)
    }
  }
  async handleChangeItem(id,index=false){
    try{
      const req = await fetch(URL+"/changetodoitem",{
        mode: 'cors',
        method: "POST",
        credentials: "include",
        withCredentials: true ,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: id,
          description : this.state.todoItems[index].description,
          title: this.state.todoItems[index].title})
      })
      const res = await req.json()
      console.log(res)
      if (!res.message) {console.log(res.error);this.state.todoItems[index].notSynced = true;}
      localStorage.setItem("todoItems", JSON.stringify(this.state.todoItems))
    }catch(err){
      console.log(err)
      this.state.todoItems[index].notSynced = true;
      localStorage.setItem("todoItems", JSON.stringify(this.state.todoItems))
      this.context?.showMessageRef.current.showMessage("could not update item on server", "error")
    } 
  }
  async updateItem(id){
    try{
      this.handleChangeItem(id)
//      this.state.todoItems[item_index].categories.forEach( (id,index) => {
//        //      fetch(
//      })
    }catch(err){
      console.log(err)
    }
  }
  async handleToggleCategory(id) {
    if(id == undefined) return 
    const categories = [...this.state.selectedCategories]
    const indx = categories.indexOf(id)
    if(indx != -1){categories.splice(indx,1)}
    else{categories.push(id)}
    this.setState( ({selectedCategories: categories}))

    // the assigment of state is needed because the setState is async and the filterItems will not get the new ctgs in time to update
    if(this.state.showFiltered){this.state.selectedCategories = categories ;this.filterItems()}
  }
  async handleToggleItemCategory(id,category_id){
    if(id == undefined || category_id == undefined) return;
    let index;
    for(let i=0;i<this.state.todoItems.length;i++){if(this.state.todoItems[i].id==id){index=i; break}}
    if(index == undefined) return;
    if(Array.isArray(this.state.todoItems[index].categories)){
      if (this.state.todoItems[index].categories.indexOf(category_id) !== -1) this.removeCategoryFromItem(index,category_id)
      else this.addCategoryToItem(index,category_id)
    }else{this.addCategoryToItem(index,category_id)}
  }
  async addCategoryToItem(itemIndex,category_id){
    console.log('addctg')
    const todoItems = [...this.state.todoItems]
    todoItems[itemIndex].categories ? todoItems[itemIndex].categories.push(category_id) : todoItems[itemIndex].categories = [category_id]
    if(!this.props.loggedIn || isNaN(this.state.todoItems[itemIndex].id) || isNaN(category_id)){
      todoItems[itemIndex].notSynced = true;this.setState({todoItems: todoItems}); return;}
    else {this.setState({todoItems: todoItems})}
    try{
      const req = await fetch(URL+"/addcategorytoitem",{
        mode: 'cors',
        credentials: 'include',
        withCredentials: true ,
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({category_id: category_id,item_id: this.state.todoItems[itemIndex].id})
      })
      const res = await req.json()
      if (!res.message) { console.log(res.error); this.state.todoItems[itemIndex].notSynced = true; localStorage.setItem("todoItems", JSON.stringify(this.state.todoItems)); return false;};
      return res.todo_item.id
    }catch(err){
      console.log(err)
      this.state.todoItems[itemIndex].notSynced = true
      localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems))
      this.context?.showMessageRef.current.showMessage("could not add the category on the server", "error")
      return false
    }
    
  }
  async removeCategoryFromItem(itemIndex,category_id){
    if(itemIndex == undefined || category_id == undefined) return;
    const todoItems = [...this.state.todoItems]
    if(!Array.isArray(todoItems[itemIndex].categories)) return;
    const ctgIndex=todoItems[itemIndex].categories.indexOf(category_id)
    if(ctgIndex === -1) return;
    todoItems[itemIndex].categories.splice(ctgIndex,1)
    const update = (this.props.loggedIn && !isNaN(this.state.todoItems[itemIndex].id) && !isNaN(category_id)) 
    if(!update) todoItems[itemIndex].notSynced = true;
    if(this.state.showFiltered){
      this.state.todoItems = todoItems //avoid extra re-render
      this.filterItems()
    }else this.setState({todoItems: todoItems})
    if(!update) return;
    try{
      const req = await fetch(URL+"/removecategoryfromitem",{
        mode: 'cors',
        credentials: 'include',
        withCredentials: true ,
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({category_id: category_id,item_id: this.state.todoItems[itemIndex].id})
      })
      const res = await req.json()
      if(!res.message){console.log(res.error); return false;};
      return res.todo_item.id
    }catch(err){
      console.log(err)
      this.context?.showMessageRef.current.showMessage("could not remove the category", "error")
      return false
    }
    
  }
  handleRemoveCategoryFromAllItems(id){//for the case when category is deleted
    const todoItems = [...this.state.todoItems]
    const selectedCtgs = [...this.state.selectedCategories]
    const ctgId = selectedCtgs.indexOf(id)
    if(ctgId !== -1) selectedCtgs.splice(ctgId,1)
    todoItems.forEach( item => {
      const ctgId = item.categories.indexOf(id)
      if(ctgId !== -1) item.categories.splice(ctgId,1)
    })
    this.setState({todoItems: todoItems,selectedCategories: selectedCtgs})
  }
  handleUpdateCategoryId(oldId,newId){//when the category is being synced with the server it will receive a new id
    const todoItems = [...this.state.todoItems]
    todoItems.forEach( (item,index) => {
      const ctgId = item.categories.indexOf(oldId)
      if(ctgId !== -1){
	if(!this.props.loggedIn){item.categories.splice(ctgId,1,newId)}
	else {
	  item.categories.splice(ctgId,1)
	  this.addCategoryToItem(index,newId)
	}
      }
    })
    if(!this.props.loggedIn){
      this.state.todoItems = todoItems//no need to actually re-render the app
      localStorage.setItem("todoItems",JSON.stringify(this.state.todoItems));
    }
  }
  render() {
    return (
      <Categories loggedIn={this.props.loggedIn} handleRemoveCategoryFromAllItems={this.handleRemoveCategoryFromAllItems} handleUpdateCategoryId={this.handleUpdateCategoryId}
		  render={ ({categories,addCategory,deleteCategory}) => { 
          return (
            <TodoWrapperContext.Provider
              value={{
	        todoItems: this.state.displayedTodoItems,
	        handleSubmitItem:this.handleSubmitItem,
		syncAllItems: this.syncAllItems,
	        handlDeleteItem:this.handlDeleteItem,
                handleToggleCategory: this.handleToggleCategory,
		handleToggleItemCategory: this.handleToggleItemCategory,
                toggleFilter: this.toggleFilter,
	        handleAddDescription:this.handleAddDescription,
                selectedCategories: this.state.selectedCategories,
	        handleChangeDescription:this.handleChangeDescription,
	        handleRemoveDescription:this.handleRemoveDescription,
		showFiltered: this.state.showFiltered,
		loggedIn: this.props.loggedIn,
	        handleChangeTitle:this.handleChangeTitle,
		syncItem: this.syncItem,
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
  const {todoItems,syncItem,categories} = useContext(TodoWrapperContext)
  const TodoItemsContainerWrapp = useMemo( () => TodoItemsContainer({todoItems,categories,syncItem}),[todoItems])
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
  const {todoInputRef,loggedIn,handleToggleCategory,toggleFilter,showFiltered,selectedCategories,handleSubmitItem,categories,addCategory,deleteCategory,syncAllItems} = useContext(TodoWrapperContext)
  return (
    <TodoHeaderWrapp>
      {loggedIn && <SyncList onClick={syncAllItems}><span>Sync with server</span><i></i></SyncList>}
      <InputContainer onSubmit={e =>{handleSubmitItem(e,input);setInput("")}}>

	{/* DELETEBTN TAG IS USED BACAUSE I COULD NOT BE BOTHERED TO WRITE A DIFFERENT CLASS FOR THIS BTN*/}
	<DeleteBtn onSubmit={e =>{handleSubmitItem(e,input);setInput("")}} style={{marginRight: "10px"}}>
	  <FontAwesomeIcon icon={faPlus} style={{fill: "white"}} inverse size="lg" />
	</DeleteBtn>
	<StyledInput placeholder='Add Description' type="text" onChange={e => setInput(e.target.value)} value={input} ref={todoInputRef} />
      </InputContainer>
      <Switch ><input type="checkbox" onClick={toggleFilter} checked={showFiltered} /><span></span></Switch>
      <CtgBtn onClick={() => setShowDD(!showDD) } onContextMenu={(e) =>{e.preventDefault(); setShowDD(!showDD)}}>Add New Category</CtgBtn>
      <AddCategoryDD opened={showDD} handleSubmit={addCategory} onClose={() => setShowDD(!showDD)} />
      {
	categories.map( (category,index) => {
          return (<span  onClick={() => handleToggleCategory(category.id) } title={category.description} key={category.id}><CategoryBtn id={category.id} key={category.id} active={selectedCategories.indexOf(category.id) != -1 } name={category.name} deleteCategory={ () => deleteCategory(index)} /></span>)
        })
      }
    </TodoHeaderWrapp>
  )
}

function TodoItemsContainer({todoItems,categories,syncItem}) {
  console.log('herender item')
  return (
    <TodoContainer>
      {
	todoItems.map( (todoItem,index) => {
          if(isNaN(todoItem.id)) syncItem(index)
	  return (
            < TodoItem text={todoItem}
	    key={todoItem.id}
            id={todoItem.id}
	    index={index}
            categories={categories}
            itemCategories={todoItem.categories}
            />
	  )
	})
      }
    </TodoContainer>
  )
}

function TodoItem({text,categories,index,id,itemCategories}) {
  return (
    <TodoItemContainer>
      <div style={{width: "100%"}}>
	<TodoTitle originalTitle={text.title} id={id} />
	<TodoItemDescription desc={text.description} id={id} />
      </div>
      <TodoSideBtns itemid={id} ctgs={itemCategories} />
    </TodoItemContainer>
  )
}

function TodoTitle({originalTitle,id}){
  const [title,setTitle] = useState(originalTitle)
  const {handleChangeTitle} = useContext(TodoWrapperContext)
  return (
    <TodoItemInputContainer onSubmit={e => { e.preventDefault(); handleChangeTitle(e,id,title)}}>
      <StyledTodoItem value={title} onChange={(e) => setTitle(e.target.value)} type="input" />
      <TitleSubmitButton onSubmit={e =>{ handleChangeTitle(e,id,title)}}></TitleSubmitButton>
    </TodoItemInputContainer>
    
  )
}

function TodoSideBtns({itemid,ctgs}){
  const [showSlidingMenu,setShowSlidingMenu] = useState(false)
  const {handlDeleteItem,categories,handleToggleItemCategory} = useContext(TodoWrapperContext)
  return (
      <TodoSideBtuttons>
        <DeleteBtn onClick={ () => handlDeleteItem(itemid)}><svg xmlns="http://www.w3.org/2000/svg" height="1em" style={{fill: "white"}} viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg></DeleteBtn>
        <ItemCategoriesContainer>
	  <CategorySvg onClick={() => setShowSlidingMenu(!showSlidingMenu) }> <FontAwesomeIcon icon={faBars} /></CategorySvg>
	  
          {showSlidingMenu && <ItemCategoriesWrapper>
            <SlidingMenu opened={showSlidingMenu}>
	      {categories.length === 0 && <h6 style={{color: "#fcfcfcfc"}}>No Categories</h6> }
              {
                categories.map( ({name,id},indx) => {
                  return (
		    <>
		      <TodoCtgBtn key={id} active={ctgs.indexOf(id) !== -1 } onClick={ () => handleToggleItemCategory(itemid,id)}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			{name}
		      </TodoCtgBtn>
		    </>
		  )
                })
              }
            </SlidingMenu>
          </ItemCategoriesWrapper>}
        </ItemCategoriesContainer>
      </TodoSideBtuttons>
  )
}

const TodoItemDescription = ({desc,id}) => {
  const [showDescription,setShowDescription] = useState(false)
  return (
    <DescriptionContainer>
    { (showDescription && Array.isArray(desc)) &&
      desc.map( (description,descIndex) => {
	return (<DescriptionTextArea
		  desc={description}
		  descIndex={descIndex}
		  todoid={id}
		  key={uuidv4()} />
	)	
      })
    }
      {(showDescription || desc.length === 0) && <TodoDescriptionFooter id={id} desc={desc}/>}
      { desc.length > 0 && 
      <DescriptionButton onClick={ () =>{setShowDescription(!showDescription)}}>
	{showDescription ? "Hide Description" : "Show Description"}
      </DescriptionButton>
      }
    </DescriptionContainer>
  )
}

const TodoDescriptionFooter = ({id,desc}) => {
  const [inputValue,setInputValue] = useState("")
  const {handleAddDescription} = useContext(TodoWrapperContext)
  return (
    <>
      <DescritionInputContainer onSubmit={(e) =>{setInputValue("");handleAddDescription(e,id,inputValue)}}>
	<DescriptionInput placeholder="Description" value={inputValue}  onChange={(e) => setInputValue(e.target.value)} />
      </DescritionInputContainer>
    </>
  )
}

const DescriptionTextArea = ({desc,descIndex,todoid}) => {
  const [textAreatValue,setTextAreaValue] = useState(desc)
  const [changed,setChanged] = useState(false)
  const {handleChangeDescription,handleRemoveDescription} = useContext(TodoWrapperContext)
  return (
	  <DescriptionContentContainer>
	    <DescriptionContent value={textAreatValue} onChange={ e =>{if(!changed){setChanged(true)};setTextAreaValue(e.target.value)}} />
	    <DescriptionButtonContainer>
	      <DescriptionBtns onClick={e => handleRemoveDescription(e,todoid,descIndex) }><FontAwesomeIcon icon={faXmark} reverse /></DescriptionBtns>
	      { changed &&
		<DescriptionBtns onClick={(e) =>{setChanged(false);handleChangeDescription(e,todoid,textAreatValue,descIndex)}}>
		  <FontAwesomeIcon icon={faCheck} />
	      </DescriptionBtns>
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
