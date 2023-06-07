import React, {memo,useEffect,useLayoutEffect,useRef, useMemo, useState} from 'react';
import {CSSTransition} from 'react-transition-group'
import * as Styled from './styledComponents/feed'
import {URL} from '../consts'
import {useMount} from './popup'
import {Overlay} from './styledComponents/popup'
import styles from './feed.module.css';
import { faFileExcel,faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingSpinner from './loading'
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
    if(this.state.selectionOptions.indexOf(newSelection) === -1) return;
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
      <Feed handleSelection={this.handleSelection} items={this.state.selectionOptions} selection={this.state.selection} />
    )
  }
};


function Feed({handleSelection,items,selection}){
  const MomoizedNav = useMemo( () => SelectionBar({handleSelection:handleSelection,items: items}),[])

  return (
    <Styled.ContainerFeed>
      {MomoizedNav}
      <AnimeContainer show={selection === "anime" } />
      <NytContainer   show={selection === "nyt" } />
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

function AnimeContainer({show}){
  const seasons = ["winter","spring","summer","fall"]
  const [err,setErr] = useState({seasonal:false,top:false,suggested:false})
  const [type, setType] = useState("animeType" in localStorage ? localStorage.getItem("animeType") : "seasonal")
  const [loading,setLoading] = useState(true)
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
    if(!setCurrData()){
      getSeasonalAnime()
	.then( (res) => setCurrData())
	.catch( (err) => {setErr(Object.assign({},err,{[type]:true}));console.log(err)})
    }
  },[type,year,season]);
  
  const getData = async url => {
    try{
      setLoading(true)
      const req = await fetch(url)
      const data = await req.json()
      setLoading(false)
      return data
    }catch(err){
      setLoading(false)
      console.log(err);
      return new Error(err);
    }
  }
  const getSeasonalAnime = async () => {
    try{
      const url = URL + `/api/mal/seasonal?season=${season}&offset=0&limit=100&year=${year}`
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
  console.log(Object.keys(data[type]))
  if(!show) return;
  if(loading) return <div className={styles.loadingContainer}><LoadingSpinner /><h1 style={{color: "black"}}>Loading</h1></div>
  return (
    <>
      <MemoizedAnimeNav type={type} setType={setType} season={season} setSeason={setSeason} year={year} setYear={setYear}/>
      <Anime data={currentData}
	     err={err}
	     type={type} setType={setType}
	     season={season} setSeason={setSeason}
	     year={year} setYear={setYear}/>
    </>
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
  if (err[type] || !data){ return (
    <>
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", textTransform: "capitalize",fontSize: "100px",paddingTop: "40px"}}>
	<FontAwesomeIcon icon={faFileExcel} />
	<h1 style={{fontSize: "30px"}}>No anime </h1>
      </div>
    </>
  )}
  return (
    <Styled.AnimeWrap>
      <Styled.AnimeContainerWeap>
	<Styled.AnimeContainer>
	  {
	    data.map( anime => <AnimeCard key={anime.node.id} details={anime.node} />)
	  }
	</Styled.AnimeContainer>
      </Styled.AnimeContainerWeap>
      
    </Styled.AnimeWrap>
  )
}
  
function AnimeCard({details}){
  const [showOverlay,setShowOverlay] = useState(false)

  return (
    <Styled.AnimeCardContainer>
      <div style={{position: 'relative', height: "100%"}}>
	<Styled.AnimeCardTitleWrapp/>
	<Styled.AnimeCardTitle title={details.title}>
	  {details.title.length > 20 ? `${details.title.slice(0,20)}...` : details.title}
	  <h6 className={styles.overlayH}>Top {details.rank}</h6>
	</Styled.AnimeCardTitle>
      </div>
      <span onMouseLeave={() => setShowOverlay(false)} onMouseEnter={() => setShowOverlay(true)}>
	<a href={`https://myanimelist.net/anime/${details.id}`}  >
	  <Styled.AnimePreview alt="" src={details.main_picture.large} />
	</a>
	<CardOverlayContainer showOverlay={showOverlay} id={details.id} title={details.title} />
      </span>
      <div style={{display: "flex",marginTop: "20px", justifyContent: "space-between"}}>
	<h1 style={{margin: 0}}><FontAwesomeIcon icon={faStar} /> {details.mean ? details.mean.toFixed(2) : "N/A"}</h1>
	<Styled.AddToListBtn> Add to list</Styled.AddToListBtn>
      </div>
    </Styled.AnimeCardContainer>
  )
}

const overlayAnimation = {
  enter: styles.overlayEnter,
  enterActive: styles.overlayEnterActive,
  exit: styles.overlayExit,
  exitActive: styles.overlayExitActive,
}

function CardOverlayContainer({showOverlay,id,title}){
  const [details,setDetails] = useState(false)

  useEffect( () => {
    async function getDetails(){
      try{
	console.log('called')
	const req = await fetch(`${URL}/api/mal/animedetails?id=${id}`)
	const res = await req.json()
	console.log(res)
	let startDate = res.message.start_date.split("-")
	startDate.splice(1,0,"/")
	startDate.splice(3,0,"/")
	startDate.reverse().join("")
	res.message.start_date = startDate
	if(res.message.end_date){
	  let endDate= res.message.end_date.split("-")
	  endDate.splice(1,0,"/")
	  endDate.splice(3,0,"/")
	  endDate.reverse().join("")
	  res.message.end_date=endDate
	}
	setDetails(res.message)
      }catch(err){
	console.log(err)
      }
    }
    if(!details && showOverlay) getDetails()
  },[showOverlay])
  if(!details){return (
    <CardOverlay opened={showOverlay}>
      <div className={styles.loadingContainer}><LoadingSpinner /><h1>Loading</h1></div>
    </CardOverlay>
  )}
  return (
    <CardOverlay opened={showOverlay}>
      <Styled.AnimeCardOverlayContent>
	<h5>{title}</h5>
	<h5 className={styles.overlayH}>episodes: {details.num_episodes ? details.num_episodes : "?"}</h5>
	<h5 className={styles.overlayH}><span>Start Date: {details.start_date}</span>{details.end_date && <span> End Date: {details.end_date}</span>}</h5>
	<h5 className={styles.overlayH}>Broadcasted on {details.broadcast ? details.broadcast.day_of_the_week : "Unknown"}</h5>
	<h5 className={styles.overlayH}>source: {details.source}</h5>
	<div>
	  <h5 className={styles.overlayH}>studios:</h5>
	  {
	    details?.studios?.map(studio => <h6 key={studio.id}><a href={`https://myanimelist.net/anime/producer/${studio.id}`}>{studio.name}</a></h6>)
	  }
	</div>
	<div>
	  <h3 className={styles.overlayH}>genres</h3>
	  {
	    details?.genres?.map(genre => <h6 key={genre.id}><a href={`https://myanimelist.net/anime/genre/${genre.id}`}>{genre.name}</a></h6>)
	  }
	</div>
	<div>
	  <h3 className={styles.overlayH}>Synopsis</h3>
	  {details?.synopsis}
	</div>
	<div>
	  <h3 className={styles.overlayH}>{details?.related_anime?.length === 0 && "No"} Related Anime</h3>
	  {
	    details?.related_anime?.map( anime => {
	      return <h5 className={styles.overlayH}>{anime.relation_type}: <a href={`https://myanimelist.net/anime/${anime.node.id}`}>{anime.node.title}</a></h5>
	    })
	  }
	</div>
	<Styled.AddToListBtn style={{color: "white"}}><a href={`https://myanimelist.net/anime/${id}`}>Check ON MAL</a></Styled.AddToListBtn>
      </Styled.AnimeCardOverlayContent>
    </CardOverlay>
  )
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

function NytContainer({show}){

  if(!show) return;
  return <Nyt />

}
function Nyt(){
  return (
    <h1>new york times api</h1>
  )
}
export default FeedContainer;

