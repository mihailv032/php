import React, {useState} from 'react';
import ContextMenu from '../components/dropdown'
import { v4 as uuidv4 } from 'uuid';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
    this.addCategory = this.addCategory.bind(this)
  }
  async componentDidMount(){
    const categories = localStorage.getItem("categories") ? JSON.parse(localStorage.getItem("categories")) : false
    if(!categories) return;
    this.setState({categories: categories})
  }
  async componentDidUpdate(){
    localStorage.setItem("categories", JSON.stringify(this.state.categories))
  }
  addCategory(name,description="",priority=0){
    if(!name) return;
    this.setState(prevState => ({categories: [{name:name,description:description,priority: priority,id:uuidv4()},...prevState.categories]}))
  }
  async deleteCategory(index){

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
  const [priority,setPriority] = useState("")
//  const [c
  return (
    <ContextMenu opened={opened} >
      <form onSubmit={ e =>{e.preventDefault();handleSubmit(name,descritpion,priority)}}>
         <input name="" type="text" value={name} onChange={e => setName(e.target.value) } />       
         <input name="" type="text" value={descritpion} onChange={e => setDescription(e.target.value) } />
         <input name="" type="text"  value={priority} onChange={e =>{if(isNaN(e.target.value)){return};setPriority(e.target.value) }} />
         <button onSubmit={e => {e.preventDefault();handleSubmit(name,descritpion,priority)}}>Submit</button>
      </form>
    </ContextMenu>
  )
}
