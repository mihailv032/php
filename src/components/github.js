import React, { useState } from 'react';
import {GitWrapp,GitHeader,GitRepoMain,GitRepoContainer,GitMain,RepoClone,GitRepoHeader,GitRepoTitle,CommitMessage,CommitDate,RepoCreated,ToggleCommitsBtn,ToggleCommitsContainer,RepoCloneContainer,RepoCloneBtn} from './styledComponents/github'

class GithubContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      userName: "mishgun032",
      data:{},
      err: false
    }
  }
  async componentDidMount(){
    try{
      let userName = localStorage.getItem("userName") ? localStorage.getItem("userName") : "mishgun032"
      let account = localStorage.getItem("gitAcc") ? JSON.parse(localStorage.getItem("gitAcc")) : false
      let repos = localStorage.getItem("gitRepos") ? JSON.parse(localStorage.getItem("gitRepos")) : false
      if(!account){
	console.log('fetching')
	const accountReq = await fetch(`https://api.github.com/users/${userName}`)
	account = await accountReq.json()
      }
      if(!repos){
	console.log('fetching')
	const reposReq = await fetch(`https://api.github.com/users/${userName}/repos`)
	repos = await reposReq.json()
      }
      if (!Array.isArray(repos)){this.setState({err: true}); return};
      if (!repos) { this.setState({err: true}); return};
      this.setState( prevState => ({
	data: Object.assign({},prevState.data,{[userName] : {
	  account: account,
	  repos : repos,
	  userName: userName
	}})
      }))
      localStorage.setItem("gitAcc", JSON.stringify(account))
      localStorage.setItem("gitRepos", JSON.stringify(repos))
      localStorage.setItem("userName", userName)
    }catch(err){
      console.log(err)
      this.setState({err: true})
    }

  }

  render() {
    if(this.state.err){ return <h1>Something went wrong</h1>}
    if(!this.state.data[this.state.userName]){ return <h1>Something went wrong</h1> }
    return (
      <Github account={this.state.data[this.state.userName].account}
	      repos={this.state.data[this.state.userName].repos }
	      userName={this.state.userName} />
    );
  }
};

function Github({account,repos,userName}) {
  const [forked,setForked] = useState(false)
  return (
    <GitWrapp>
      <GitHeader>
	<img alt="" src={account.avatar_url} style={{width: "100px",height: "100px",borderRadius: "100%"}} />
	<GitRepoTitle>{userName}</GitRepoTitle>
      </GitHeader>
      <GitMain>
	{
	  repos.map( repo => {
	    return forked ? <GitReposContainer details={repo} key={repo.id} userName={userName} /> :
		   repo.fork === false ? <GitReposContainer details={repo} userName={userName} key={repo.id} /> : null
	  })
	}
      </GitMain>
    </GitWrapp>
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
	    return (
	      <CommitMessage key={commit.sha}><CommitDate>Commit Date: {date}</CommitDate> {commit.commit.message} </CommitMessage>
	    )
	  }) : null
	}
	{ allCommits.length >= 1 &&
	  <ToggleCommitsContainer>
	    <ToggleCommitsBtn onClick={ () => setShowAllCommits(!showAllCommits) }>
	      show {showAllCommits ? "Less" : "More"}
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
