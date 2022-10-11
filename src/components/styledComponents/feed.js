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
  display: flex;
  justify-content: space-between;
  list-style: none;
`

export const DropDownTitle = styled.li`
  position: relative;
  display: block;
  background: #61002d;
  width: 100%;
  z-index: 100;
`
export const DropDownItem = styled.li`
  display: block;
  background: white;
  position: absolute;
  top: 0;
  width: 90%;
  transition: transform 0.5s;
  z-index: 1;
`

export const DropDown = styled.ul`
  position: relative;
  padding: 0;
  margin-left: 10px;
  margin-right: 10px;
  z-index: 100;
  list-style: none;
  &: hover:nth-child(2)  {
  transform: translate(0,20px);
  }
  &:nth-child(2){
  color: white;
  transition-delay: 3s;
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
`

export const AnimeCardTitle = styled.h1`
  font-weight: bold;
  font-size: 30px;
  text-align: center;
  overflow-wrap: break-word;
`

export const AnimePreview = styled.img`
  width: 400px;
  height: 600px;
`
