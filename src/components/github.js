//TODO remove getAccountData


import React, { useMemo, useState } from 'react';
import {GitWrapp,
	GitHeader,
	GitRepoMain,
	GitRepoContainer,
	GitMain,
	RepoClone,
	GitRepoHeader,
	GitRepoTitle,
	CommitMessage,
	CommitDate,
	RepoCreated,
	ToggleCommitsBtn,
	ToggleCommitsContainer,
	RepoCloneContainer,
	RepoCloneBtn,
	GitAccTitle,
	GitAccTitleContainer} from './styledComponents/github'

class GithubContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      userName: "",
      inputValue: "",
      forked: false,
      data:{},
      rememberUser: false,
      err: false
    }
    this.getAccountData = this.getAccountData.bind(this)
    this.getReposData = this.getReposData.bind(this)
    this.setAcc = this.setAcc.bind(this)
    this.changeUser = this.changeUser.bind(this)
    this.handleRememberUser = this.handleRememberUser.bind(this)
    this.handleForked = this.handleForked.bind(this)
  }

  async componentDidMount(){
    try{
      let userName = localStorage.getItem("userName") ? localStorage.getItem("userName") : ""
      console.log(userName.length)
      if(userName.length === 0) return;
      let account = localStorage.getItem("gitAcc") ? JSON.parse(localStorage.getItem("gitAcc")) : false
      let repos = localStorage.getItem("gitRepos") ? JSON.parse(localStorage.getItem("gitRepos")) : false
      if(!account) account = await this.getAccountData(userName)
      if(!repos) repos = await this.getReposData()
      this.setAcc(userName,account,repos)
    }catch(err){
      console.log(err)
      this.setState({err: true})
    }

  }
  setAcc(userName,account,repos){
    if (!Array.isArray(repos)){this.setState({err: true}); return};
    if (!repos) { this.setState({err: true}); return};
    console.log(userName)
    this.setState( prevState => ({
      data: Object.assign({},prevState.data,{[userName] : {
	account: account,
	repos : repos,
	userName: userName,
      }}),
      userName: userName,
    }))
    if(this.state.err) this.setState({err: false})
    if(this.state.rememberUser){
      console.log('here')
      localStorage.setItem("gitAcc", JSON.stringify(account))
      localStorage.setItem("gitRepos", JSON.stringify(repos))
      localStorage.setItem("userName", userName)
    }
  }
  async changeUser(e,userName){
    console.log('here')
    e.preventDefault()
    const acc = await this.getAccountData(userName)
    const repos = await this.getReposData(userName)
    this.setAcc(userName,acc,repos)
  }

  async getAccountData(userName){
    try{
      const accountReq = await fetch(`https://api.github.com/users/${userName}`)
       const data = await accountReq.json()
      return data;
    }catch(err){
      console.log(err)
      return false;
    }
    
  }
  async getReposData(userName){
    try{
      const reposReq = await fetch(`https://api.github.com/users/${userName}/repos`)
      const repos = await reposReq.json()
      return repos;
    }catch(err){
      console.log(err)
      return false;
    }
  }
  handleRememberUser(){
    this.setState( prevState => ({rememberUser: !prevState.rememberUser}))
  }
  handleForked(){
    this.setState( prevState => ({forked: !prevState.forked}))
  }
  render() {
    return (
      <Github account={this.state.data[this.state.userName]?.account}
	      repos={this.state.data[this.state.userName]?.repos }
	      userName={this.state.userName}
	      changeUser={this.changeUser}
	      handleRememberUser={this.handleRememberUser}
	      forked={this.state.forked} handleForked={this.handleForked} />
    );
  }
};

function Github({account,repos,userName,handleRememberUser,changeUser,forked,handlehandleForked}) {
  const MainSectionMemoized = useMemo( () => GitMainSection({repos,userName,forked}),[repos,userName,forked])

  return (
    <GitWrapp>
      <GitHeader>
	<a href={`https://github.com/${account ? userName  : ""}`}>
	  <img alt="" src={account ? account.avatar_url : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png"} style={{width: "100px",height: "100px",borderRadius: "100%"}} />
	</a>
	<GitTtitleContainer handleRememberUser={handleRememberUser} changeUser={changeUser} />
	{repos && <> <h1>{forked ? "Hidke" : "Show"} Forked</h1>
	<input name="" type="checkbox" value="" defaultChecked={forked} onClick={handlehandleForked} /> </>}
      </GitHeader>
      {repos && <GitMain>
	{MainSectionMemoized}
      </GitMain>}
    </GitWrapp>
  )
}

function GitTtitleContainer({err=false,changeUser,handleRememberUser}){
  const [user_name,setUserName] = useState("")
  return (
    <GitAccTitleContainer onSubmit={e => changeUser(e,user_name) }>
      {err && <h1>Something went wrong try entering the user name</h1>}
      <GitAccTitle value={user_name}
		   onChange={(e) => setUserName(e.target.value) } placeholder="enter your user name" />
      <h1>Rembember User</h1>
      <input name="" type="checkbox" onClick={handleRememberUser} />
    </GitAccTitleContainer>
    
  )
}
function GitMainSection({repos,userName,forked}) {
  if(!repos) return;
  return (
    <>
      {
	repos.map( repo => {
	  return forked ? <GitReposContainer details={repo} key={repo.id} userName={userName} /> :
		 repo.fork === false ? <GitReposContainer details={repo} userName={userName} key={repo.id} /> : null
	})
      }
    </>
  )
}
class GitReposContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      details : props.details,
      userName : props.userName,
      commits: [],
      restCommits: [],
      created: "",
      showAllCommits: false,
      loading: false
    }
    this.previewCommitsLength = 5
    this.toggleShowCommits = this.toggleShowCommits.bind(this)
    this.toggleShowAllCommits = this.toggleShowAllCommits.bind(this)
    this.getCommits = this.getCommits.bind(this)
  }
  async componentDidMount(){
    if(!this.state.userName) return;
    if(!this.state.details) return;
    let created = new Date(this.state.details.created_at);
    created = created.getDate() + '/' + (created.getMonth() + 1) + '/' +  created.getFullYear();

    this.setState({created: created})
  }
  getCommitsFromLocalStorage(){
    return localStorage.getItem(`commits${this.state.details.id}`) ?
		  JSON.parse(localStorage.getItem(`commits${this.state.details.id}`)) : false
  }
  async getCommits(){
    alert('hre')
    this.setState({loading: true})
    const req = await fetch(`https://api.github.com/repos/${this.state.userName}/${this.state.details.name}/commits`)
    const commits = await req.json()
    const today = Date.now()
    localStorage.setItem(`commits${this.state.details.id}`, JSON.stringify({timestamp:today,commits: commits}))
    this.setCommits(commits)
    this.setState({loading: false})
  }
  setCommits(commits){
    console.log(commits)
    const recentCommits = commits.splice(0,this.previewCommitsLength)
    const restCommits = commits
    this.setState({commits: recentCommits,restCommits:restCommits})
  }
  toggleShowAllCommits(){
    let commits;
    if(this.state.commits.length > this.previewCommitsLength){commits = [...this.state.commits].splice(0,this.previewCommitsLength)}
    else{commits = [...this.state.commits,...this.state.restCommits]}
    this.setState( prevState => ({showAllCommits: !prevState.showAllCommits,commits:commits}))
  }
  //the main work with commits happens here
  async toggleShowCommits(){
    if(this.state.commits.length > 0){this.setState({commits: []}); return;};
    const commits = this.getCommitsFromLocalStorage()
    if(commits){
      if((Date.now() - commits.timestamp) > 108000000) { await this.getCommits() }
      else{this.setCommits(commits.commits);}
    }else{ await this.getCommits()}
  }
  render(){
    return (<GitRepo details={this.state.details}
                     commits={this.state.commits}
                     created={this.state.created}
                     showAllCommits={this.state.showAllCommits}
                     toggleShowCommits={this.toggleShowCommits}
                     toggleShowAllCommits={this.toggleShowAllCommits}
                     loading={this.state.loading}
                     getCommits={this.getCommits} />
    )
  }
}

function GitRepo({details,commits,created,showAllCommits,toggleShowAllCommits,loading,toggleShowCommits}){
  const [cloneUrlSsh, setCloneUrl] = useState(true)
  return (
    <GitRepoContainer>
      <GitRepoHeader>
	<GitRepoTitle>
	  <a href={details.html_url}>{details.name}</a>
	</GitRepoTitle>
	<RepoCreated>
	  Created: {created}
	</RepoCreated>
        {<button onClick={toggleShowCommits}>{commits.length > 0 ? "hide" : "show"} commits</button>}
      </GitRepoHeader>
      <GitRepoMain>
        {loading && <h1>Loading</h1>}
	{
          commits && 
	  commits.map( commit => {
	    let date = new Date(commit.commit.author.date)
	    date = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
	    return (
	      <CommitMessage key={commit.sha}>
		<CommitDate>Commit Date: {date}</CommitDate>
		{commit.commit.message}
	      </CommitMessage>
	    )
	  })}
	{ commits.length >= 5 && <ToggleCommitsContainer>
	<ToggleCommitsBtn onClick={ toggleShowAllCommits }>
	  Show {showAllCommits ? "Less" : "More"}
	</ToggleCommitsBtn>
	</ToggleCommitsContainer>}

	<RepoCloneContainer>
	  <RepoClone readOnly={true} value={cloneUrlSsh ? details.ssh_url : details.clone_url} />
	  <RepoCloneBtn onClick={ () => setCloneUrl(!cloneUrlSsh) }>{cloneUrlSsh ? "SSH" : "HTTPS"}</RepoCloneBtn>
	</RepoCloneContainer>
      </GitRepoMain>
    </GitRepoContainer>
  )
}

export default GithubContainer;
