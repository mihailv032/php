import styled from 'styled-components'

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10000;

  background-color: white;
  border-radius: 10px;
`

export const CategoryBtn = styled.button`
  background: ${ props => props.active ? "initial" : "#FF4742"};
  border: 1px solid #FF4742;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 10px;
  outline: none;
  padding: 2px 5px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover{
  background-color: initial;
  background-position: 0 0;
  color: #FF4742;

  }
`
