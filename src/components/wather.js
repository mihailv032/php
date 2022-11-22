import {useState,useEffect} from 'react'

export default function Weather(){
  const WEATHER_API_KEY="c9f0a3624c0ce183678090945e46f304"
  //default coords are wolverhamptons
  const [coordinates,setCoordinates] = useState("coordinates" in localStorage ? JSON.parse(localStorage.getItem("coordinates")) : {lat:"52.5847651",lon:"-2.127567"});
  const [weatherData, setWeatherData] = useState("wateherData" in localStorage ? JSON.parse(localStorage.getItem("wateherData")) : null);
  const [rembember,setRemember] = useState(false)

  useEffect( () => {
    const getData = async () => {
      try{
	if(weatherData !== null) return;
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&units=metric&lon=${coordinates.lon}&appid=${WEATHER_API_KEY}`
	const req = await fetch(url)
	const data = await req.json()
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
    <div>
      <span>rembember</span>
      <input name="" type="checkbox" checked={rembember} onChange={ () => setRemember(!rembember)} />
      <img alt="" src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
      <div>{weatherData.main.temp}</div>
      <span>{weatherData.weather[0].description}</span>
      <span>{weatherData.main.description}</span>
      <GetCoordinates setCoordinates={setCoordinates} rembember={rembember} />
    </div>
  )
}

function GetCoordinates({setCoordinates,rembember}){
  const [city,setCity] = useState( "watherCity" in localStorage ? localStorage.getItem("watherCity") : "wolverhampton")
  async function handleSubmit(e){
    e.preventDefault()
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c9f0a3624c0ce183678090945e46f304`
    try{
      const coordinates = await fetch(url)
      setCoordinates({lat:coordinates.lat,lon:coordinates.lon})
      if(rembember){
	localStorage.setItem("watherCity",city)
	localStorage.setItem("coordinates", JSON.stringify({lat:coordinates.lat,lon:coordinates.lon}))
      }
    }catch(err){
      console.log('f')
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="" type="text" value={city} onChange={e => setCity(e.target.value) } />
      <button onSubmit={handleSubmit}></button>
    </form>
  )
}
