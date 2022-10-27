import React, {useEffect,useLayoutEffect, useMemo, useState} from 'react';
import * as Styled from './styledComponents/feed'
import {URL} from '../consts'

class FeedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: "",
      selectionOptions: ["anime","nyt"],
      error: {}
    }
    this.handleSelection = this.handleSelection.bind(this)
  }
  handleSelection(newSelection) {
    if(Object.keys(this.state.data).indexOf(newSelection) == -1) return;
    this.setState({selection: newSelection})
    localStorage.setItem("selection", newSelection)
  }
  async componentDidMount(){
    try{
      if(localStorage.getItem("selection")){this.setState({selection: localStorage.getItem("selection") })}
      else this.setState({selection: "anime"})
    }catch(err){
      console.log(err)
      this.setState({error: true})
    }
  }
  render() {
    return (
      <Feed handleSelection={this.handleSelection}
	    selection={this.state.selection}
	    selectionOptions={this.state.selectionOptions} />
    )
  }
};


function Feed({selection,selectionOptions,handleSelection}){
  const MomoizedNav = useMemo( () => SelectionBar({handleSelection:handleSelection,items: selectionOptions}),[])
  const FeedComponents = {
    anime: AnimeContainer(),
    nyt: NytContainer()
  }
  return (
    <Styled.ContainerFeed>
      {MomoizedNav}
      {selection && <AnimeContainer/>}
    </Styled.ContainerFeed>
    
  )
}

function SelectionBar({handleSelection,items}){
  return (
    <Styled.FeedNav>
      <Styled.NavWrapp>
	{
	  items.map( (item,index) => {
	    return (
	      <Styled.NavItems key={index} onClick={() => handleSelection(item) }>{item}</Styled.NavItems>
	    )
	  })
	}
      </Styled.NavWrapp>
    </Styled.FeedNav>
  )
}

function FeedContent({selection}){

}

function AnimeContainer(){
  const seasons = ["winter","spring","summer","fall"]
  const [err,setErr] = useState(false)
  const [type,setType] = useState("seasonal")
  const [season,setSeason] = useState(
    "animeSeason" in localStorage ? JSON.parse(localStorage.getItem("animeSeason")) : seasons[Math.round((new Date().getMonth()+1)/4)]
  )
  const [year,setYear] = useState(
    "animeYear" in localStorage ? JSON.parse(localStorage.getItem("animeYear")) : String(new Date().getFullYear())
  )
  const [currentData,setCurrentData] = useState()
  const [data,setData] = useState({
    seasonal: {},
    top: {},
    suggested: {}
  })
  const getData = async url => {
    try{
      const req = await fetch(url)
      const data = await req.json()
      return data
    }catch(err){
      console.log(err);
      return false;
    }
  }
  useLayoutEffect( () => {
    const getSeasonalAnime = async () => {
      try{
	const url = URL + `/api/mal?season=${season}&offset=0&limit=100&year=${year}`
	console.log(url)
	const seasonalAnime = await getData(url)
	if(!seasonalAnime){
	  console.log('no animes')
	}
	console.log('setting year')
	let updatedData = Object.assign({},data)
	console.log()
	console.log(typeof(year))
	if(Object.keys(updatedData.seasonal).indexOf(year) === -1){
	  updatedData =
	  Object.assign({},updatedData,
			{seasonal: Object.assign({},updatedData.seasonal,{
			  year: Object.assign({})
			}
	  )})
	}
	console.log(Object.keys(updatedData))
	updatedData.seasonal[year][season] = seasonalAnime
	setData(updatedData)
      }catch(err){
	console.log(err)
	console.log('err')
      }
    }
    
    getSeasonalAnime()
  },[])
  useEffect( () => {
      console.log(data[type])
      console.log(Object.keys(data.seasonal))
      console.log(data[type][year])
    if(data[type]){
      if(data[type][year]){
	if(data[type][year][season]){
	  setCurrentData(data[type][year][season]);
	}else{ setErr(true); console.log("data")};
      }else{ setErr(true); console.log('year')};
    }else{ setErr(true); console.log('season') };
  },[type,data,year,season]);
  console.log(Object.keys(data[type]))
  return (
    <Anime data={currentData}
	   err={err}
	   type={type} setType={setType}
	   season={season} setSeason={setSeason}
	   year={year} setYear={setYear}/>
  )
}

function AnimeNav({type,setType,season,setSeason,year,setYear}){

  return (
      <Styled.AnimeNav>
	<Styled.NavWrapp>
	  <Styled.DropDown>
	    <Styled.DropDownTitle >Types of anime</Styled.DropDownTitle>
	    <Styled.DropDownItem selected={type === 'top' ? true : false } onClick={ () => setType("top")}>
	      Top
	    </Styled.DropDownItem>
	    <Styled.DropDownItem selected={type === 'seasonal' ? true : false } onClick={() => setType('seasonal')}>
	      Seasonal
	    </Styled.DropDownItem>
	    <Styled.DropDownItem selected={type === 'suggested' ? true : false } onClick={() => setType("suggested")}>
	      Suggested
	    </Styled.DropDownItem>
	  </Styled.DropDown>
	  { type === "seasonal" && <Styled.DropDown>
	    <Styled.DropDownTitle >Season</Styled.DropDownTitle>
	    <Styled.DropDownItem selected={season === 'spring' ? true : false } onClick={ () => setSeason("spring") }>
	      Spring
	    </Styled.DropDownItem>
	    <Styled.DropDownItem selected={season === 'summer' ? true : false } onClick={ () => setSeason("summer") }>
	      Summer
	    </Styled.DropDownItem>
	    <Styled.DropDownItem selected={season === 'fall' ? true : false }   onClick={ () => setSeason("fall") }>
	      Fall
	    </Styled.DropDownItem>
	    <Styled.DropDownItem selected={season === 'winter' ? true : false } onClick={ () => setSeason("winter") }>
	      Winter
	    </Styled.DropDownItem>
	  </Styled.DropDown>}
	  { type === "seasonal" && <Styled.NavInput placeholder="year" value={year} />}
	</Styled.NavWrapp>
      </Styled.AnimeNav>
)
}

function Anime({data,err,type,setType,year,setYear,season,setSeason}){
  const MemoizedNav = useMemo( () => AnimeNav({type,setType,year,setYear,season,setSeason}),[type,year,season])
  if (err || !data){ return (
    <>
      {MemoizedNav}
      <h1>NO anime</h1>
    </>
  )}
  return (
    <Styled.AnimeWrap>
      {MemoizedNav}
      <Styled.AnimeContainerWeap>
	<Styled.AnimeContainer>
	  {
	    data.data.map( anime => <AnimeCard key={anime.node.id} details={anime} />)
	  }
	</Styled.AnimeContainer>
      </Styled.AnimeContainerWeap>
    </Styled.AnimeWrap>
  )
}
  
function AnimeCard({details}){
  return (
    <Styled.AnimeCardContainer>
      <Styled.AnimeCardTitle>{details.node.title}</Styled.AnimeCardTitle>
      <a href={`https://myanimelist.net/anime/${details.node.id}`}>
	<Styled.AnimePreview alt="" src={details.node.main_picture.large} />
      </a>
    </Styled.AnimeCardContainer>
  )
}

function NytContainer(){
  return <Nyt />

}
function Nyt(){
  return (
    <h1>new york times api</h1>
  )
}
export default FeedContainer;

