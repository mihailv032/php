import {Burger,Box,Input,Flex,Switch,Button,CloseButton,Menu,MultiSelect} from "@mantine/core";
import {useState, useEffect, useRef} from "react";
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { v4 as uuid } from 'uuid';
//import Category from "./categories";

interface CategoryInterface {
  name:string,
  description:string,
  user_id:number|null
  id:number|string
}

interface TodoItemInterface {
  name: string,
  description:string,
  user_id:number|null,
  id:number|string,
  categories: CategoryInterface[]
}

type AddItem = (name:string) => void

type SetActiveCategories = (categories:string[]) => void

export default function TodoContainer(){
  const [activeCategory,setActiveCategory] = useState<CategoryInterface[]>([])
  const [todoItems,setTodoItems] = useState<TodoItemInterface[]>([])
  const [showTodo,setShowTodo] = useState<TodoItemInterface[]>([])

  useEffect(() => {
    filterItems()
  },[activeCategory])

  const filterItems = () => {
    setShowTodo(todoItems.filter((todo:TodoItemInterface):boolean =>
      todo.categories.some( category => activeCategory.includes(category))))
  }

  const addItem:AddItem = (name) => {
    const item:TodoItemInterface = {name, id:uuid(),description:"",user_id:null,categories:[]}
    setTodoItems([...todoItems,item])
  }

  const setActiveCategories:SetActiveCategories = (categoriesNames) =>{
    const ctgs:CategoryInterface[] = []

    setActiveCategory([...ctgs])
    filterItems()
  }

  return (
    <div>
      <TodoHeader addItem={addItem} setActiveCategories={setActiveCategories} />
      <TodoList todos={showTodo} />
    </div>
    
  )
}

function TodoHeader({addItem,setActiveCategories}:{addItem:AddItem,setActiveCategories:SetActiveCategories}){
  return (
    <Box className="max-w-[475px]">
      <TodoItemInput addItem={addItem} />
      <TodoCategories setActiveCategories={setActiveCategories} categories={[{name:"name",description:"",id:1, user_id:1},{name:"n",description:"",id:2, user_id:1},{name:"rame",description:"",id:4, user_id:1}]} />
    </Box>
  )
}

function TodoItemInput({addItem}:{addItem:AddItem}){
  const [name,setName] = useState<string>('')
  return (
    <form className="w-[475px] flex bg-secondary-100 px-4 py-4 rounded-md items-center space-x-4" onSubmit={e => { e.preventDefault();addItem(name);setName("")} }>
      <span className="text-white font-bold text-lg cursor-pointer">+</span>
      <Input placeholder="add todo item" className="bg-secondary-200 w-full" value={name} onChange={e => setName(e.target.value) } />
    </form>
  )
}

function TodoCategories({categories,setActiveCategories}:{categories:CategoryInterface[],setActiveCategories:SetActiveCategories}){
  return (
    <Flex className="space-x-4 flex-wrap space-y-2 items-center">
      <Switch />
      <MultiSelect placeholder="pick categories" data={categories.map((category:CategoryInterface):{label:string,value:string} => {
	return {label:category.name,value: String(category.id)}
      })}
		   onChange={setActiveCategories}
		   comboboxProps={{ transitionProps: { transition: 'pop', duration: 300 } }}
      />
      <AddCategoryMenu />
    </Flex>
  )
}

function AddCategoryMenu(){
  const [ctgName,setCtgName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)


  return (
    <Menu transitionProps={{ transition: 'scale-y', duration: 300 }} withArrow closeOnClickOutside={true} closeOnEscape={true} closeOnItemClick={false}
	  onOpen={() => setTimeout(() => {inputRef.current?.focus()}, 100)}>
      <Menu.Target>
	<Button >Add Category</Button>
      </Menu.Target>
      <Menu.Dropdown >
	<Menu.Item variant="black">
	  <form onSubmit={e => {e.preventDefault();notifications.show({title:"could not add category",message:"because yes",autoClose:3000 })} }>
	    <Flex direction="column" gap="xs">
	      <Input value={ctgName} onChange={e => setCtgName(e.target.value) } ref={inputRef} />
	      <Button size="xs" type="submit">Submit</Button>
	    </Flex>
	  </form>
	</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

function TodoList({todos}:{todos:TodoItemInterface[]}){
  return (
    <Flex className="flex-col space-y-4 my-4">
      {
	todos.map( todo => <TodoItem key={todo.id} />)
      }
      <TodoItem />
      <TodoItem />
      <TodoItem />
    </Flex>
  )
}

function TodoItem(){
  const [opened, { toggle }] = useDisclosure();
  const [title,setTitle] = useState<string>('')

  return (
    <Flex className="bg-secondary-100 rounded-md p-4 space-x-2">
      <Flex className="flex-col flex-1">
	<input type="text" placeholder="todo item title"value={title} onChange={e=>setTitle(e.target.value)} className="bg-secondary-200 rounded-t-md text-white px-2 py-1 outline-none"/>
	<textarea className="h-10 bg-secondary-300 rounded-b-md outline-none resize-none text-white px-2 py1-" />
      </Flex>
      <Flex className="flex-col justify-center">
	<CloseButton variant="transparent" size="md" />
	<Burger opened={opened} onClick={toggle} aria-label="Toggle categories" size="sm" />
      </Flex>
    </Flex>
  )
}

