import styled from 'styled-components'

export const Overlay = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background-color: rgba(0,0,0,0.6);
  z-index: 999999;
  cursor: pointer;
`

export const Container = styled.div`
  position: fixed;
  box-sizing: border-box;

  padding: 36px;
  z-index: 100;

  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const PopupContentWrapp = styled.div`
  min-width: ${ props => props.width ? props.width : "300px"};
  min-height: ${ props => props.height ? props.height : "500px"};
`
