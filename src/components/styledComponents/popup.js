import styled from 'styled-components'

export const Overlay = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background-color: rgba(0,0,0,0.6);
  cursor: pointer;
`

export const Container = styled.div`
  position: fixed;
  box-sizing: border-box;

  padding: 36px;
  z-index: 1;

  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;

  display: flex;
  justify-content: center;
  align-items: center;
`
