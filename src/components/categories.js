import React, {useState,useEffect} from 'react';
import ContextMenu from './dropdown'
import { v4 as uuidv4 } from 'uuid';
import * as Styled from './styledComponents/styled_categories'
import {URL} from '../consts'
import Popup from './popup';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
    this.addCategory = this.addCategory.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
  }
  async componentDidMount(){
    const categories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : false
    if(categories){
      categories.forEach( async ctg => {if(isNaN(ctg.id) && this.props.loggedIn){console.log(ctg.id);ctg.id = await this.handleSendToServer(ctg.name,ctg.description)}})
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
      console.log('here')
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
    console.log(delte_item)
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
    }
  }
  render() {
    return (
      <>
      {
        this.props.render({categories:this.state.categories,
                           addCategory: this.addCategory,
                           deleteCategory: this.deleteCategory,
        })
      }
      </>
    );
  }
};

export default Categories;

export function AddCategoryDD({opened,handleSubmit}){
  const [name,setName] = useState("")
  const [descritpion,setDescription] = useState("")
//  const [c
  return (
    <ContextMenu opened={opened} >
      <Styled.Container onSubmit={ e =>{e.preventDefault();handleSubmit(name,descritpion)}}>
        <div>
          <input name="" type="text" value={name} onChange={e => setName(e.target.value) } />       
          <label>category name</label>
        </div>
        <div>
          <input name="" type="text" value={descritpion} onChange={e => setDescription(e.target.value) } />
          <label>desciption</label>
        </div>
         <button onSubmit={e => {e.preventDefault();handleSubmit(name,descritpion)}}>Submit</button>
      </Styled.Container>
    </ContextMenu>
  )
}

export function CategoryBtn({name,deleteCategory,active,id}){
  const [showContext,setShowContext] = useState(false)
  const [showShare,setShowShare] = useState(false)
  return (
    <>
    <Styled.ContextWrapp onContextMenu={e => {e.preventDefault();setShowContext(!showContext)}}>
      <Styled.CategoryBtn active={active}>{name}</Styled.CategoryBtn>
        <ContextMenu opened={showContext} onClose={e => {e.preventDefault();setShowContext(!showContext)}}>
          <button>change</button>
          <button onClick={() => setShowShare(!showShare) }>share</button>
          <button onClick={deleteCategory}>delete</button>
        </ContextMenu>
    </Styled.ContextWrapp>
    <Popup opened={showShare} onClose={() => setShowShare(false) }><Share category_id={id} /></Popup>
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
      {
        results.map( ({name,id}) => {
          return (
            <Styled.Result key={id} onClick={selectUser(id,name)}>{name}</Styled.Result>
          )
        })
      }
    </Styled.ResultsContainer>
  )
}
