import styled from 'styled-components'

export const Contianer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  border-radius: 5px;
  z-index: 9999999999;
  background-color: ${props => props.color};
  color: white;
  padding: 30px;
  overflow: auto;
  width: 300px;
  max-width: 300px;
  word-wrap: break-word   ;
  height: 80px;
  text-align: center;

  & h3 {
    font-weight: 300;
  }
  & button {
    position: absolute;
    top: 12px;
    right: 5px;
    background: none;
    color: white;
    border: none;
    font-size: medium;
    cursor: pointer;
  }
`
