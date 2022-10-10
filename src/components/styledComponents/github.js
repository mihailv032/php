import styled from 'styled-components'

export const GitWrapp = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 1000px;
  overflow-y:scroll;
  max-width: 500px;
  padding-right: 20px;
  box-sizing: border-box;
`

export const GitHeader = styled.header`
  display: flex;
  flex-direction : column;
  align-items: center;
  box-sizing: border-box;
`
export const RepoCreated = styled.h4`
  box-sizing: border-box;
`
export const GitMain = styled.main`
  width: 100%;
  box-sizing: border-box;
`


export const GitRepoContainer = styled.section`
  width: 100%;
  color: white;
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: border-box;
`

export const GitRepoHeader = styled.header`
  display:flex;
  flex-direction: column;
  width: 100%;
  background: #1c121f;
  padding-right: 20px;
  padding-left: 20px;
  box-sizing: border-box;
`

export const GitRepoTitle = styled.h1`
  font-family: sans-serif;
  text-transform: capitalize;
`
export const GitAccTitle = styled.input`
  font-family: sans-serif;
  text-transform: capitalize;
  background: transparent;
  color: black;
  font-weight: bold;
  border: none;
  text-align: center;
  font-size: 32pt;
  &:focus{
  outline: none;
  }
`
export const GitRepoMain = styled.main`
  width: 100%;
  padding-right: 20px;
  padding-left: 20px;
  background: #1a0f1c;
  box-sizing: border-box;
`

export const RepoCloneContainer = styled.div`
  width: 100%;
  border-top: 2px solid white;
  padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`

export const RepoClone = styled.input`
  width: 100%;
  border: none;
  text-align: center;
  color: white;
  background: transparent;
  font-size: 15px;
  &:focus{
  outline: none;
  }
`
export const RepoCloneBtn = styled.button`
  borders: none;
  cursor: pointer;
  color: white;
  font-weight: bold;
  background: none;
  margin-top: 10px;
  border: none;
`

export const Avatar = styled.img`
  
`

export const CommitMessage = styled.p`
  font-size: 25px;
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 2px solid white;
`
export const CommitDate = styled.span`
  margin-bottom: 20px;
  color: #bab8ba;
  display: block;
`

export const ToggleCommitsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
`
export const ToggleCommitsBtn = styled.button`
  border: none;
  background: transparent;
  color: #bab8ba;
  font-size: 20px;
  text-transform: capitalize;
  cursor: pointer;
`
