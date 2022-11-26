import React, {memo,useEffect,useLayoutEffect,useRef, useMemo, useState} from 'react';
import {CSSTransition} from 'react-transition-group'
import * as Styled from './styledComponents/feed'
import {URL} from '../consts'
import {useMount} from './popup'
import {Overlay} from './styledComponents/popup'
import styles from './feed.module.css';

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
    if(Object.keys(this.state.data).indexOf(newSelection) === -1) return;
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
  async fetchAnime(){
    
  }
  async fetchNyt(){

  }
  render() {
    return (
      <Feed parentThis={this} 
      />
    )
  }
};


function Feed({parentThis}){
  const MomoizedNav = useMemo( () => SelectionBar({handleSelection:parentThis.handleSelection,items: parentThis.state.selectionOptions}),[])
  const FeedComponents = {
    anime: AnimeContainer(),
    nyt: NytContainer()
  }
  return (
    <Styled.ContainerFeed>
      {MomoizedNav}
      {parentThis.state.selection && <AnimeContainer/>}
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

function AnimeContainer(){
  const seasons = ["winter","spring","summer","fall"]
  const [err,setErr] = useState({seasonal:false,top:false,suggested:false})
  const [type, setType] = useState("animeType" in localStorage ? localStorage.getItem("animeType") : "seasonal")
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
  useEffect( () => {//only for setting data
    function setCurrData(){//returns true if succeded and false otherwise
      if(type === "seasonal"){
	if(err[type]) return false;
	if(data[type][year]){
	  if(data[type][year][season]){
	    setCurrentData(data[type][year][season])
	    return true;
	  }else return false;
	}else return false;
      }else return false;
    }
    const getSeasonalAnime = async () => {
      try{
	const url = URL + `/api/mal?season=${season}&offset=0&limit=100&year=${year}`
	const seasonalAnime = await getData(url)
	console.log(seasonalAnime)
	if(!seasonalAnime){
	  setErr(Object.assign({},err,{seasonal:true}))
	  console.log('no animes')
	  return new Error("could not get seasonal anime");
	}
	let updatedData = Object.assign({},data)
	if(Object.keys(updatedData.seasonal).indexOf(year) === -1) updatedData.seasonal[year] = {};
	updatedData.seasonal[year][season] = seasonalAnime.data
	setData(updatedData)
      }catch(err){
	console.log(err)
	console.log('err')
	return err
      }
    }
    if(!setCurrData()){
      getSeasonalAnime()
      .then( (res) => setCurrData())
      .catch( (err) => {setErr(Object.assign({},err,{[type]:true}));console.log(err)})
    }
  },[year,season]);
  console.log(Object.keys(data[type]))
  return (
    <Anime data={currentData}
	   err={err}
	   type={type} setType={setType}
	   season={season} setSeason={setSeason}
	   year={year} setYear={setYear}/>
  )
}

const MemoizedAnimeNav = memo(function AnimeNav({type,setType,season,setSeason,year,setYear}){
  const [displayYear,setDisplayYear] = useState(year)
  const handleYear = e => {
    if (isNaN(e.target.value)) return;
    const year = new Date().getFullYear()
    if (+year < +e.target.value) return;
    setDisplayYear(e.target.value)
  }

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
	  { type === "seasonal" &&
	    <form onSubmit={ e => {e.preventDefault();setYear(displayYear)}}>
	      <Styled.NavInput placeholder="year" value={displayYear} onChange={handleYear} />
	      <button style={{ display: "none"}} onSubmit={ e => {e.preventDefault();setYear(displayYear)}}></button>
	    </form>
	  }
	</Styled.NavWrapp>
      </Styled.AnimeNav>
  )
})

function Anime({data,err,type,setType,year,setYear,season,setSeason}){
  const MemoizedAnimeCards = useMemo( () => {
    if (err[type] || !data) return 
    return (
      <Styled.AnimeContainerWeap>
	<Styled.AnimeContainer>
	  {
	    data.map( anime => <AnimeCard key={anime.node.id} details={anime.node} />)
	  }
	</Styled.AnimeContainer>
      </Styled.AnimeContainerWeap>
      
    )
  },[data])
  if (err[type] || !data){ return (
    <>
      <MemoizedAnimeNav type={type} setType={setType}
	   season={season} setSeason={setSeason}
	   year={year} setYear={setYear}/>
      <h1>NO anime</h1>
    </>
  )}
  return (
    <Styled.AnimeWrap>
      <MemoizedAnimeNav type={type} setType={setType}
	   season={season} setSeason={setSeason}
	   year={year} setYear={setYear}/>
      {MemoizedAnimeCards}
    </Styled.AnimeWrap>
  )
}
  
function AnimeCard({details}){
  const [cropTitle,setCropTitle] = useState(true)
  const [showOverlay,setShowOverlay] = useState(false)
  const MemoizedContent = useMemo( () => {
    return (
      <>
	<a href={`https://myanimelist.net/anime/${details.id}`}  >
	  <Styled.AnimePreview alt="" src={details.main_picture.large} />
	</a>
	<h1>{details.mean}</h1>
      </>
    )
  },[details])
  const MemoizedOverlayContent = useMemo( () => {
    if (!Array.isArray(details.genres)) return;
    return (
	<Styled.AnimeCardOverlayContent>
	  <h5>episodes: {details.num_episodes}</h5>
	  <div>
	    <h3>studios</h3>
	    {
	      details.studios.map(studio => <h6 key={studio.id}>{studio.name}</h6>)
	    }
	  </div>
	  <div>
	    <h3>genres</h3>
	  {
	    details.genres.map(genre => <h6 key={genre.id}>{genre.name}</h6>)
	  }
	  </div>
	  <Styled.AnimeCardOverlaySynopsis>
	    {details.synopsis}
	  </Styled.AnimeCardOverlaySynopsis>
	</Styled.AnimeCardOverlayContent>
    )
  },[details,showOverlay])
  return (
    <Styled.AnimeCardContainer>
      <Styled.AnimeCardTitle onMouseEnter={ () => setCropTitle(false)} onMouseLeave={() => setCropTitle(true)}>
	{details.title.length > 24 && cropTitle ? `${details.title.slice(0,24)}...` : details.title}
      </Styled.AnimeCardTitle>
      <span onMouseLeave={() => setShowOverlay(false)} onMouseEnter={() => setShowOverlay(true)}>
	<CardOverlay opened={showOverlay}>
	  {MemoizedOverlayContent}
	</CardOverlay>
	  {MemoizedContent}
      </span>
    </Styled.AnimeCardContainer>
  )
}

const overlayAnimation = {
  enter: styles.overlayEnter,
  enterActive: styles.overlayEnterActive,
  exit: styles.overlayExit,
  exitActive: styles.overlayExitActive,
}

function CardOverlay({opened,children}){
  const {mounted} = useMount({opened})
  if(!mounted) return;
  return (
    <OverlayLayout opened={opened}>
      {children}
    </OverlayLayout>
  )
}

function OverlayLayout({opened,children}){
  const overlayRef = useRef()
  const [animationIn,setAnimationIn] = useState(false)
  useEffect( () => {
    setAnimationIn(opened)
  },[opened])

  return (
    <CSSTransition nodeRef={overlayRef} timeout={300} mountOnEnter unmountOnExit in={animationIn} classNames={overlayAnimation}>
    <Overlay ref={overlayRef}>
      <div>
	{children}
      </div>
    </Overlay>
    </CSSTransition>
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

