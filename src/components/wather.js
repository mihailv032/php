import {useState,useEffect} from 'react'
import styles from './weather.module.css'
import ContextMenu from '../components/dropdown'

export default function Weather(){
  const WEATHER_API_KEY="c9f0a3624c0ce183678090945e46f304"
  //default coords are wolverhamptons
  const [coordinates,setCoordinates] = useState("coordinates" in localStorage ? JSON.parse(localStorage.getItem("coordinates")) : {lat:"52.5847651",lon:"-2.127567"});
  const [weatherData, setWeatherData] = useState("wateherData" in localStorage ? JSON.parse(localStorage.getItem("wateherData")) : null);
  const [showGetCoords,setShowCoords] = useState(false)
  useEffect( () => {
    const getData = async () => {
      try{
	if((weatherData !== null) && (weatherData.timestamp - Date.now()) > 7200000) return;
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&units=metric&lon=${coordinates.lon}&appid=${WEATHER_API_KEY}`
	const req = await fetch(url)
	const data = await req.json()
	data.timestamp = Date.now()
	setWeatherData(data)
	localStorage.setItem("wateherData", JSON.stringify(data))
      }catch(err){
	console.log(err)
      }
    }
    getData()
  },[coordinates])

  if(!weatherData) return;
  return (
    <div className={styles.container}>
      <img alt="" className={styles.img} src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
      <div className={styles.data}>{weatherData.main.temp} {weatherData.weather[0].description} {weatherData.main.description}</div>
      <div className={styles.data}>{Math.round(((Date.now() -weatherData.timestamp)/3600000)*100)/100}h ago</div>
      <button className={styles.toogleBtn} onClick={() => setShowCoords(!showGetCoords) }>{showGetCoords ? "Hide" : "Get Coordinates"}</button>
      <GetCoordinates setCoordinates={setCoordinates} opened={showGetCoords} />
    </div>
  )
}

function GetCoordinates({setCoordinates,opened}){
  const [city,setCity] = useState( "watherCity" in localStorage ? localStorage.getItem("watherCity") : "wolverhampton")
  const [remember,setRemember] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c9f0a3624c0ce183678090945e46f304`
    try{
      const coordinates = await fetch(url)
      setCoordinates({lat:coordinates.lat,lon:coordinates.lon})
      if(remember){
	localStorage.setItem("watherCity",city)
	localStorage.setItem("coordinates", JSON.stringify({lat:coordinates.lat,lon:coordinates.lon}))
      }
    }catch(err){
      console.log('could not get the coordinates')
    }
  }
  return (
    <ContextMenu opened={opened}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input name="" type="text" value={city} onChange={e => setCity(e.target.value) } />
        <span className={styles.rem}>rembember</span>
        <input name="" type="checkbox" checked={remember} onChange={ () => setRemember(!remember)} />
        <div>
	  <button onSubmit={handleSubmit} className={styles.btn}>Search</button>
        </div>
      </form>
    </ContextMenu>
  )
}
