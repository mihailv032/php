import styled from 'styled-components'

export const RecntAppsContainer = styled.div`
  min-width: 50vw;
  max-width: 50vw;
  overflow: scroll;
`

export const RecentAppsWrapp = styled.main`
  display: flex;
  align-items: center;
  height: 100px;
overflow: scroll;
`
export const App = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 50px;
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 20px;
`

export const PopupWrapp = styled.main`
  position: absolute;
  display: flex;
  justify-content: center;
  padding-top: 100px;
  box-sizing: border-box;
  top: 100px;
  left: 0;
  width: 100vw;
  height: 70vh;
  background: black;
`

export const AddApp = styled.form`
  display: flex;
  flex-direction: column;
`

export const AddAppTitle = styled.label`

`

export const Input = styled.input`

`
