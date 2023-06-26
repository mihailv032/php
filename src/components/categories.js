import React, {useState,useEffect, useRef}from 'react';
import ContextMenu from './dropdown'
import { v4 as uuidv4 } from 'uuid';
import * as Styled from './styledComponents/styled_categories'
import {URL} from '../consts'
import Popup from './popup';
import "./styles/categories.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faTrash,faSliders } from '@fortawesome/free-solid-svg-icons'


class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
    this.addCategory = this.addCategory.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
    this.handleChangeCategoryOrder = this.handleChangeCategoryOrder.bind(this)
  }
  async componentDidMount(){
    const categories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : false
    if(categories){
      categories.forEach( async ctg => {
	if(isNaN(ctg.id) && this.props.loggedIn){
	  let old_id = ctg.id
	  ctg.id = await this.handleSendToServer(ctg.name,ctg.description)
	  this.props.handleUpdateCategoryId(old_id,ctg.id)
	}
      })
      this.setState({categories: categories})
    }
    if(!this.props.loggedIn) return;
    fetch(URL+"/getallusercategories", {
        mode: 'cors',
        credentials: 'include',
        withCredentials: true ,
        method: "GET",
        headers: {"Content-Type": "application/json"},

    }).then( res => res.json())
    .then( res =>{console.log(res);if(res.message){this.setState({categories: res.categories})}})
  }
  async componentDidUpdate(){
    localStorage.setItem("categories", JSON.stringify(this.state.categories))
  }
  async addCategory(name,description=""){
    if(!name) return;
    let id;
    if(this.props.loggedIn){ id = await this.handleSendToServer(name,description); if(!id) id=uuidv4()}
    else id = uuidv4()
    this.setState(prevState => ({categories: [{name:name,description:description,id:id},...prevState.categories]}))

  }
  async handleSendToServer(name,description){
    try{
      const req = await fetch(URL+"/addtodocategory",{
        mode: 'cors',
        method: "POST",
        credentials: "include",
        withCredentials: true ,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({category_name: name, description : description})
      })
      const res = await req.json()
      if(!res.message){console.log(res.error); return false};
      return res.category.id;
    }catch(err){
      console.log(err)
      return false;
    }
      
  }
  deleteCategory(index){
    const categories = [...this.state.categories]
    const delte_item = categories.splice(index,1)
    this.setState({categories:  categories})
    this.props.handleRemoveCategoryFromAllItems(delte_item[0].id)
    if(isNaN(delte_item[0].id) || !this.props.loggedIn) return;
    try{
      fetch(URL+"/deletecategory", {
        mode: 'cors',
        method: "POST",
        credentials: "include",
        withCredentials: true ,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: delte_item[0].id})
      })
    }catch(err){
      console.log(err)
      //TOOD add notification here
    }
  }
  handleChangeCategoryOrder(dragIndex,hoverIndex){
    let categories = [...this.state.categories]
    const draggCtg = categories.splice(dragIndex,1)
    categories.splice(hoverIndex,0,draggCtg[0])
    this.setState({categories: categories})
  }
  render() {
    return (
      <>
      {
        this.props.render({categories:this.state.categories,
                           addCategory: this.addCategory,
			   handleChangeCategoryOrder: this.handleChangeCategoryOrder,
                           deleteCategory: this.deleteCategory,
        })
      }
      </>
    );
  }
};

export default Categories;

export function AddCategoryDD({opened,onClose,handleSubmit}){
  const [name,setName] = useState("")
  const [descritpion,setDescription] = useState("")

  return (
    <ContextMenu opened={opened} >
	<ul className="ddcontainer" >
	  <Styled.Container onSubmit={ e =>{e.preventDefault();setName("");setDescription("");onClose();handleSubmit(name,descritpion)}}>
            <div>
              <input name="" placeholder="category name" type="text" value={name} onChange={e => setName(e.target.value) } className="dditems"/>       
            </div>
            <div>
              <input name="" placeholder="category description" type="text" value={descritpion} onChange={e => setDescription(e.target.value) } className="dditems"/>
            </div>
            <button onSubmit={e => {e.preventDefault();setName("");setDescription("");onClose();handleSubmit(name,descritpion)}}>Submit</button>
	  </Styled.Container>
	</ul>
    </ContextMenu>
  )
}

export function CategoryBtn({name,deleteCategory,active,id}){
  const [showContext,setShowContext] = useState(false)
  const [showShare,setShowShare] = useState(false)
  const controlRef = useRef()//needed to fix closing the contextMenu when closing by second clicking on the btn again

  return (
    <>
      <Styled.ContextWrapp onContextMenu={e => {e.preventDefault();if(controlRef.current){return};setShowContext(!showContext)}}>
      <Styled.CategoryBtn active={active}>{name}</Styled.CategoryBtn>
      <ContextMenu opened={showContext} onClose={e =>{e.preventDefault();setShowContext(false)}} >
	<ul className="ddcontainer" ref={controlRef}>
	  <li className="dditems" onClick={(e) =>{e.stopPropagation();console.log('change')} }>change <FontAwesomeIcon icon={faSliders} /></li>
	  <li className="dditems" onClick={(e) =>{e.stopPropagation(); setShowShare(!showShare)}}>share <FontAwesomeIcon icon={faEnvelope} /></li>
	  <li className="dditems" onClick={ e  =>{e.stopPropagation(); deleteCategory()}}>delete <FontAwesomeIcon icon={faTrash} /></li>
	</ul>
      </ContextMenu>
      
      
      </Styled.ContextWrapp>
      <Popup opened={showShare} onClose={(e) =>{e.stopPropagation();setShowShare(false)} }><Share category_id={id} /></Popup>
    </>
  )
}

function Share(){
  const [name,setName] = useState("")
  const [selectedUser,setSelectedUser] = useState("")
  return (
    <Styled.ShareContainer>
      <Styled.Inp name="" placeholder="user name" type="text" value={name} onChange={e => setName(e.target.value) } />
      <UsersResults input={name} selectUser={setSelectedUser} />
      <Styled.ShareBtn><span>Share</span></Styled.ShareBtn>
    </Styled.ShareContainer>
  )
}

function UsersResults({input,selectUser}){
  const [results,setResults] = useState([])
  useEffect( () => {
    async function getUsers(){
      if(input.length === 0) return;
      try{
        const req = await fetch(URL+"/getusers",{
          mode: 'cors',
          credentials: 'include',
          withCredentials: true ,
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({input: input})
        })
        const res = await req.json()
        if(!res.message) return;
        setResults(res.users)
      }catch(err){
        console.log(err)
      }
    }
    getUsers()
  },[input])
  return (
    <Styled.ResultsContainer>
      {results.length === 0 && <Styled.Result>No users found</Styled.Result>}
      {results.map( ({name,id}) => <Styled.Result key={id} onClick={ () => selectUser(id,name)}>{name}</Styled.Result>)}
    </Styled.ResultsContainer>
  )
}
