import React, {useMemo} from 'react';
import * as Styled from './styledComponents/feed'

class FeedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: "",
      data: {
	anime: {},
	nyt: {}
      },
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
      if(localStorage.getItem("selection")){
	this.setState({selection: localStorage.getItem("selection") })
      }
      const seasonalAnime = await this.getData("http://54.89.153.221:8080/api/mal?season=summer&offset=0&limit=10&year=2022")
      if(!seasonalAnime){
	this.setState( prevState => ({error: Object.assign({},prevState.error,{anime: true})}))
      }
      this.setState(prevState => ({
	data: Object.assign({},prevState.data,{anime: seasonalAnime})
      }))
    }catch(err){
      console.log(err)
      this.setState({error: true})
    }
  }
  async getData(url){
    try{
      const req = await fetch(url)
      const data = req.json()
      return data
    }catch(err){
      console.log(err)
      return false
    }
  }

  render() {
    if(this.state.error[this.state.selection]){return <h1>something went wrong </h1>}
    return (
      <Feed data={this.state.data}
	    handleSelection={this.handleSelection}
	    selection={this.state.selection} />
    )
  }
};


function Feed({data,selection,handleSelection}){
  const MomoizedNav = useMemo( () => SelectionBar({handleSelection:handleSelection,items: Object.keys(data)}),[])
  const FeedComponents = {
    anime: AnimeContainer({data: data.anime}),
    nyt: NytContainer({data: data.nyt})
  }
  return (
    <Styled.ContainerFeed>
      {MomoizedNav}
      {FeedComponents[selection]}
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

function AnimeContainer({data}){
  return <Anime data={data} />
}

function Anime({data}){
  if(Object.keys(data).length === 0){ return <Styled.NoData>no data</Styled.NoData>}
  return (
    <Styled.AnimeWrap>
      <Styled.AnimeNav>
	<Styled.NavWrapp>
	  <Styled.DropDown>
	    <Styled.DropDownTitle>Type of anime</Styled.DropDownTitle>
	    <Styled.DropDownItem>ff</Styled.DropDownItem>
	    <Styled.DropDownItem>2</Styled.DropDownItem>
	  </Styled.DropDown>
	  <Styled.DropDown>Season</Styled.DropDown>
	</Styled.NavWrapp>
      </Styled.AnimeNav>
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
	<Styled.AnimePreview alt="" src={details.node.main_picture.medium} />
      </a>
    </Styled.AnimeCardContainer>
  )
}

function NytContainer({data}){
  return <Nyt data={data} />

}
function Nyt({data}){
  return (
    <h1>new york times api</h1>
  )
}
export default FeedContainer;
