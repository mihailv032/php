import styled from 'styled-components'

export const RecntAppsContainer = styled.div`
  min-width: 50vw;
  max-width: 50vw;
`

export const RecentAppsWrapp = styled.main`
  display: flex;
  align-items: center;
  height: 100px;
  overflow-x: auto;

  &::-webkit-scrollbar {
  height: 10px;
  }
  &::-webkit-scrollbar-thumb {
  border-radius: 10px;

  background: rgb(126,0,255);
  background: linear-gradient(180deg, rgba(126,0,255,1) 9%, rgba(180,16,218,1) 100%, rgba(180,16,218,1) 100%);
  }
  &::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
  }
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
