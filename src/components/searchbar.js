import {useState} from 'react'
import styled from 'styled-components'

function SearchBar(){
  return (
    <form action="https://www.google.com/search" method="get" target="_blank" id="search-form">
      <Input name="q" type="text" placeholder="search..." autocomplete="off" autofocus />
    </form>
  )
}

const Input = styled.input`
  font-size: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  width: 300px;
  &:focus {
  outline: none;
  }
`
export default SearchBar
