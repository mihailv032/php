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
  flex-direction: column;
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

export const AppTitle = styled.span`
  font-size: 10px;
  border-bottom: 2px solid white;
`

export const PopupWrapp = styled.main`
  position: absolute;
  display: flex;
  justify-content: center;
  box-sizing: border-box;

  background: white;
  width: 300px;
  height: 500px;

  border-radius: 3px;
  padding-top: 30px;
  border: 1px solid rgba(0,0,0,0.8);
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
`

export const AddApp = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const AddAppTitle = styled.label`
  
`

export const Input = styled.input`

`

export const Btn = styled.button`
  margin-top: 20px;
  background: blue;
  border: none;
  color: white;
  width: 100px;
  border-radius: 5px;%;
  text-transform: capitalize;
`
