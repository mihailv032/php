import styled from 'styled-components'

export const NoData = styled.main`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  font-weight: bold;
  text-transform: capitalize;
  margin-top: 50px;
`

export const FeedNav = styled.nav`
  display: flex;
  background: #111111;
  width: 100vw;
  height: 100px;
  align-items: center;
  justify-content: center;
`
export const NavWrapp = styled.ul`
  list-style-type: none;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  list-style: none;
`

export const DropDownTitle = styled.li`
  position: relative;
  display: block;
  color: white;
  background: #61002d;
  font-weight: bold;
  text-transform: capitalize;
  font-size: 24px;
  width: 100%;
  z-index: 100;
`
export const DropDownItem = styled.li`
  box-sizing: border-box;
  display: block;
  color: white;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 10px;
  padding-left: 10px;
  box-sizing: border-box;
  border: none;
  position: absolute;
  background: ${ props => props.selected ? "#2e51a2" : "#4165BA"};
  top: 0;
  width: 100%;
  transition: transform 0.5s;
  z-index: 1;
  &:hover {
  background: #193880;
  }
`



export const DropDown = styled.ul`
  list-style-type: none;
  margin-left: 10px;
  margin-right: 10px;
  position: relative;
  width: 180px;
  padding: 0;
  margin-left: 10px;
  margin-right: 10px;
  z-index: 100;
  list-style: none;
  cursor: pointer;
  box-sizing: border-box;
  &: hover ${DropDownItem}:nth-child(2) {
  transform: translate(0,25px);
  }
  &: hover ${DropDownItem}:nth-child(3) {
  transform: translate(0,53px);
  }
  &: hover ${DropDownItem}:nth-child(4) {
  transform: translate(0,81px);
  }
  &: hover ${DropDownItem}:nth-child(5) {
  transform: translate(0,110px);
  }
`

export const NavInput = styled.input`
  color: white;
  width: 55px;
  background: #61002d;
  font-weight: bold;
  text-transform: capitalize;
  font-size: 24px;
  border: none;

  &:focus {
  outline: none;
  }
`

export const NavItems = styled.li`
  color: white;
  margin-left: 20px;
  margin-right: 20px;
  text-transform: capitalize;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
`
export const ContainerFeed = styled.main`
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin-bottom: 50px;
`

export const AnimeNav = styled.nav`
  width: 100vw;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #61002d;
  box-sizing: border-box;
`

export const AnimeWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  justify-content: center;
  background: white;
`

export const AnimeContainerWeap = styled.div`
  display: flex;
  width: 100vw;
  justify-content: center;
`

export const AnimeContainer = styled.main`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  max-width: 80vw;
  margin-top: 100px;
`

export const AnimeCardContainer = styled.section`
  margin-left: 30px;
  margin-right: 30px;
  max-width: 400px;
  height: 750px;
  max-height: 750px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
`

export const AnimeCardOverlayContent = styled.div`
  cursor: default;
  background: rgba(0,0,0,0.2);
  color: white;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  text-transform: capitalize;
  & > div {
  position: relative;
  max-height: 150px;
  overflow-y: auto;
  border-bottom: 2px solid white;
  }

  & > div > h6 {
  margin: 0px;
  }
`

export const AnimeCardOverlaySynopsis = styled.section`
  max-height: 300px;
  overflow-y: auto;
`

export const AnimeCardTitle = styled.h1`
  font-weight: bold;
  font-size: 1.5vw;
  text-align: center;
  margin-bottom: 10px;
`

export const AnimePreview = styled.img`
  width: 400px;
  height: 600px;
`

export const Input = styled.input`
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

export const AddToListBtn = styled.button`
  display: inline-block;
  background: #4F74C8;
  border: 0px;
  color:  white;
  text-transform: capitalize;
  &: hover {
    background: transparent;
  border: 2px solid #4F74C8;
  color: black;
  }
`
