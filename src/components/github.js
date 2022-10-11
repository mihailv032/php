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
      data:{},
      rememberUser: false,
      err: false
    }
    this.getAccountData = this.getAccountData.bind(this)
    this.getReposData = this.getReposData.bind(this)
    this.setAcc = this.setAcc.bind(this)
    this.changeUser = this.changeUser.bind(this)
    this.handleRememberUser = this.handleRememberUser.bind(this)
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
	userName: userName
      }}),
      userName: userName
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
  render() {
    if(!this.state.data[this.state.userName] || this.state.err){
      return (
	<GitAccTitleContainer onSubmit={e => this.changeUser(e,this.state.userName) }>
	  {this.state.err && <h1>Something went wrong try entering the user name</h1>}
	  <GitAccTitle value={this.state.userName}
	    onChange={(e) => this.setState({userName: e.target.value}) } />
	  <h1>rembember user</h1>
	  <input name="" type="checkbox" value="" onClick={this.handleRememberUser} />
	</GitAccTitleContainer>
      )
    }
    return (
      <Github account={this.state.data[this.state.userName].account}
	      repos={this.state.data[this.state.userName].repos }
	      userName={this.state.userName}
	      changeUser={this.changeUser}
	      handleRememberUser={this.handleRememberUser} />
    );
  }
};

function Github({account,repos,userName,handleRememberUser,changeUser}) {
  const [name,setName] = useState(userName)
  const [forked,setForked] = useState(false)
  const MainSectionMemoized = useMemo( () => GitMainSection({repos,userName,forked}),[repos,userName,forked])

  return (
    <GitWrapp>
      <GitHeader>
	<a href={`https://github.com/${name}`}>
	  <img alt="" src={account.avatar_url} style={{width: "100px",height: "100px",borderRadius: "100%"}} />
	</a>
	<GitAccTitleContainer onSubmit={e => changeUser(e,name) }>
	  <GitAccTitle value={name} onChange={(e) => setName(e.target.value) } />
	  <h1>Rembember User</h1>
	  <input name="" type="checkbox" value="" onClick={handleRememberUser} />
	</GitAccTitleContainer>
	<h1>{forked ? "Hidke" : "Show"} Forked</h1>
	<input name="" type="checkbox" value="" onClick={ () => setForked(!forked)} />
      </GitHeader>
      <GitMain>
	{MainSectionMemoized}
      </GitMain>
    </GitWrapp>
  )
}

function GitMainSection({repos,userName,forked}) {
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
      restCommits: []
    }
  }
  async componentDidMount(){
    if(!this.state.userName) return;
    if(!this.state.details) return;
    const isCommits = localStorage.getItem(`commits${this.state.details.id}`) ?
		  JSON.parse(localStorage.getItem(`commits${this.state.details.id}`)) : false
    let commits; 
    if(!isCommits){
      console.log('fetching')
      const req = await fetch(`https://api.github.com/repos/${this.state.userName}/${this.state.details.name}/commits`)
      commits = await req.json()
    }else {//check if commits are outdated
      console.log(isCommits.commits)
      commits = isCommits.commits
    }
    if(!commits) return;
    const recentCommits = commits.splice(0,5)
    const restCommits = commits
    this.setState({commits: recentCommits,restCommits:restCommits})
    if(!isCommits){
      const today = new Date().toString()
      localStorage.setItem(`commits${this.state.details.id}`, JSON.stringify({date:today,commits: commits}))
    }
  }
  
  render(){
    return <GitRepo details={this.state.details} commits={this.state.commits} allCommits={this.state.restCommits} />
  }
}

function GitRepo({details,commits,allCommits}){
  const [cloneUrlSsh, setCloneUrl] = useState(true)
  const [showAllCommits,setShowAllCommits] = useState(false)
  let created = new Date(details.created_at);
  created = created.getDate() + '/' + (created.getMonth() + 1) + '/' +  created.getFullYear();
  return (
    <GitRepoContainer>
      <GitRepoHeader>
	<GitRepoTitle>
	  <a href={details.html_url}>{details.name}</a>
	</GitRepoTitle>
	<RepoCreated>
	  Created: {created}
	</RepoCreated>
      </GitRepoHeader>
      <GitRepoMain>
	{
	  commits.map( commit => {
	    let date = new Date(commit.commit.author.date)
	    date = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
	    return (
	      <CommitMessage key={commit.sha}>
		<CommitDate>Commit Date: {date}</CommitDate>
		{commit.commit.message}
	      </CommitMessage>
	    )
	  })
	}
	{
	  showAllCommits ?
	  allCommits.map( commit => {
	    let date = new Date(commit.commit.author.date)
	    date = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
	    return (
	      <CommitMessage key={commit.sha}><CommitDate>Commit Date: {date}</CommitDate> {commit.commit.message} </CommitMessage>
	    )
	  }) : null
	}
	{ allCommits.length >= 1 &&
	  <ToggleCommitsContainer>
	    <ToggleCommitsBtn onClick={ () => setShowAllCommits(!showAllCommits) }>
	      Show {showAllCommits ? "Less" : "More"}
	    </ToggleCommitsBtn>
	  </ToggleCommitsContainer>
	}
	<RepoCloneContainer>
	  <RepoClone readOnly={true} value={cloneUrlSsh ? details.ssh_url : details.clone_url} />
	  <RepoCloneBtn onClick={ () => setCloneUrl(!cloneUrlSsh) }>{cloneUrlSsh ? "SSH" : "HTTPS"}</RepoCloneBtn>
	</RepoCloneContainer>
      </GitRepoMain>
    </GitRepoContainer>
  )
}

export default GithubContainer;
