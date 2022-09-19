import React from 'react';
import {ContainerFeed} from './styledComponents/feed'

class FeedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //selection will be a tuple of component and api call t get data
      selection: "",
      data: {
	anime: {},
	nyt: {}
      },
      api: {
	anime: {
	  url: {
	    default:"https://api.myanimelist.net/v2/anime?q=one&limit=4",
	  },
	  header:{"Content-Type":"application/json",'X-MAL-CLIENT-ID': "97f19bb6ca11e00d2031a0258794dc52"}
	},
	nyt: {url: "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=y9pg09oq37Vdf5NP9DesBC7KeT368izV",
	      header:{}}
      },
      error: false
    }
    this.getData = this.getData.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
  }
  handleSelection() {

  }
  async getData(apiTarget,url='default'){
    try{
      const req = await fetch(this.state.api[apiTarget].url[url], {
	method: 'GET',
	mode: 'cors',
	headers: this.state.api[apiTarget].header,
      });
      const data = await req.text()
      console.log(data)
      return data
    }catch(err){
      console.log(err)
      this.setState({error: true})
      return {};
    }
  }
  async componentDidMount(){
    try{
      let selection = localStorage.getItem("selection") ? localStorage.getItem("selection") : false
      //if there is nothing in the local storage default to anime
      if (!selection) { selection = localStorage.getItem("defaultFeed") ? localStorage.getItem("defaultFeed") : "anime"}
      let data = localStorage.getItem(selection) ? localStorage.getItem(selection) : false
      if (!data) { data = await this.getData(selection) }
      else data = JSON.parse(data)
      console.log(data)
      localStorage.setItem("anime", JSON.stringify(data))
      this.state.data.anime = data
      this.setState( prevState => ({
	selection: selection,
      }))
    }catch(err){
      console.log(err)
      this.setState({error: true})
    }
  }
  render() {
    if(this.state.error){return <h1>something went wrong </h1>}
    return (
      <Feed data={this.state.data}
	    handleSelection={this.handleSelection}
	    selection={this.state.selection}
      />
    )
  }
};

function SelectionBar({handleSelection}){
  return (
    <div>
      <h1>anime</h1>
    </div>
  )
}


function Feed({data,selection,handleSelection}){
  const component = {
    anime: <Anime data={data.anime} />,
    nyt: <Nyt data={data.nyt} />
  }
  
  return (
    <ContainerFeed >
      <SelectionBar handleSelection={handleSelection} />
      {
	component.anime
      }
    </ContainerFeed>

  )
}

function AnimeContainer({data}){

  return <Anime data={data} />
}

function Anime({data}){
  if(Object.keys(data).length === 0){ return <h1>no data</h1>}
  console.log('here')
  return (
    <div>
      {
	data.data.map( anime => <AnimeCard key={anime.node.id} details={anime} />)
      }
    </div>
  )
}

function AnimeCard({details}){
  console.log('hale')
  return (
    <div>
      <h1>{details.node.title}</h1>
      <img alt="" src={details.node.main_picture.large} />
    </div>
  )
}

function Nyt(){
  return (
    <h1>new york times api</h1>
  )
}
export default FeedContainer;
