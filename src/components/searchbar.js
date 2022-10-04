import {useState} from 'react'
import styled from 'styled-components'

function SearchBar(){
  const [input,setInput] = useState("")
  return (
    <form action="https://www.google.com/search"
	  method="get"
	  target="_blank"
	  id="search-form" >
      <Input name="q" type="text" placeholder="search..." autocomplete="off" autofocus
      value={input}
      onChange={ (e) => setInput(e.target.value)}
      />
    </form>
  )
}

const Input = styled.input`
  font-size: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  width: 500px;
  &:focus {
  outline: none;
  }
`
export default SearchBar
