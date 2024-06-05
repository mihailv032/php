import { Popover, Box,Input,Checkbox,Flex, Text, Menu, Avatar, Stack, Card, Button, FloatingIndicator, UnstyledButton,ScrollArea,Badge, Select,Breadcrumbs } from '@mantine/core'
import { useState, useEffect, useRef, memo, useContext} from 'react'
import { IconSettings,IconRotate,IconCircleCheck, IconGitBranch,IconChevronsDown, IconChevronsUp,IconFolder,IconFile } from '@tabler/icons-react';
import {octokit} from './octokit'
import { addTimestamp, checkTimestamp } from '../../utils/timestamps'
import { useClipboard } from '@mantine/hooks';
import './styles.css';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { Endpoints } from "@octokit/types";
import { HotkeysContext } from '../../hotkeys';


type Unpacked<T> = T extends (infer U)[] ? U : T;
type Repo = Endpoints["GET /users/{username}/repos"]["response"]["data"]
type User = Endpoints["GET /users/{username}"]["response"]["data"]
type Branch = Endpoints["GET /repos/{owner}/{repo}/branches"]["response"]["data"]
type Commit = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"]
type Content = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"]

export default function GithubContainer(){
  // @ts-ignore:
  const [user, setUser] = useState<User|null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  // @ts-ignore:
  const [repos, setRepos] = useState<Repo|null>(localStorage.getItem('repos') ? JSON.parse(localStorage.getItem('repos')) : null)
  const [showForked,setShowForked] = useState<boolean>(false)
 
  const updateUser = async (username:string,rememberUser:boolean):Promise<void> => {
    if(username.length === 0 ) return;
    try{
      const usr  = await octokit.request('GET /users/{username}',{
	username: username,
      })
      const user = usr.data
      console.log(user)
      setUser(user)
      if(rememberUser){
	addTimestamp(user)
	localStorage.setItem('user',JSON.stringify(user))
      }
      updateRepos()
    }catch(err){

    }
  }

  const updateRepos = async () => {
    console.log("user")
    if(!user) return;
    notifications.show({title:"Fetching Repos",message:"Please wait",autoClose:3000, loading: true })
    try{
      let repos = await octokit.request(`GET /users/{username}/repos`,{
	username: user.login,
      })

      console.log(repos)
      const rp = repos.data
      setRepos(rp)
      addTimestamp(rp)
      localStorage.setItem('repos',JSON.stringify(rp))

    }catch(err){
      console.log(err)
    }
  }

  return (
    <ScrollArea h="700">
    <Box className="w-[500px] px-6">
      <Header user={user} updateUser={updateUser} showForked={showForked} refetchRepos={updateRepos} setShowForked={setShowForked} />
      <Repos repos={repos} />
    </Box>
    </ScrollArea>
  )
}

const Header = memo(({user,updateUser,showForked,refetchRepos,setShowForked}:
		     {user: User|null,updateUser: (username: string,remember:boolean) => Promise<void>,
		      showForked: boolean, refetchRepos: () => void, setShowForked: (a:boolean) => void}) =>
{
  const remember = useRef(false)
  const [username, setUsername] = useState(user ? user.login : '')
  const githubAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const {setHotkeys} = useContext(HotkeysContext)
  useEffect( () => {
    if(!setHotkeys) return;
    setHotkeys("KeyG",() => githubAnchorRef.current?.click(),true)
  },[githubAnchorRef,setHotkeys])
  return (
    <form className="space-y-5 flex flex-col items-center w-full" onSubmit={ (e) =>{e.preventDefault();updateUser(username,remember.current)}}>
      <Flex align="center" justify="space-around" className="space-x-4 bg-secondary-100 rounded-t-md px-8 py-2 w-full relative">
	<GithubSettings remember={remember.current} showForked={showForked} refetchRepos={refetchRepos} setShowForked={setShowForked} />


	<a href={`https://github.com/${user ? user.login : ""}`} ref={githubAnchorRef}>
	  <Avatar color="blue" radius="xl" src={user ? user.avatar_url : "./github-mark-white.png"} />
	  <Text>{user ? user.name : ""}</Text>
	</a>
	<Input size="md" value={username} onChange={ e => setUsername(e.target.value)} placeholder="nickname" />
      </Flex>
    </form >
  )
})

const GithubSettings = memo( ({remember,showForked,refetchRepos,setShowForked}:
			      {remember:boolean,showForked:boolean,refetchRepos: () => void,setShowForked: (a:boolean) => void}) => {
  const [_,setOpened] = useState(false) //the state is used to force the component to re-render to update the 
  const [token,setToken] = useState(localStorage.getItem('github_token') || '')
  return (
    <Menu transitionProps={{transition:'fade',duration:300}} withArrow onClose={() => setOpened(false) } onOpen={() => setOpened(true) } closeOnClickOutside={true} closeOnEscape={true} closeOnItemClick={false}>
      <Menu.Target>
	<IconSettings size={24} className="absolute right-5 top-1 z-10 cursor-pointer" />
      </Menu.Target>
      <Menu.Dropdown >
	<Menu.Item variant="black">
          <Menu.Label>Remember User</Menu.Label>
	  <Flex direction="column" gap="xs" align="center">
	    <Checkbox onChange={ () =>{remember = !remember}} defaultChecked={remember} />
	  </Flex>
	</Menu.Item>
	<Menu.Label>Show Forked repos</Menu.Label>
	<Menu.Item variant="black">
	  <Flex direction="column" gap="xs" align="center">
	    <Checkbox onChange={ () => setShowForked(!showForked)} checked={showForked} />
	  </Flex>
	</Menu.Item>
        <Menu.Item leftSection={<IconRotate stroke={2} />} onClick={refetchRepos}>
          Refetch Repos
        </Menu.Item>
	<Menu.Label>Github Token</Menu.Label>
	<Menu.Item variant="black">
	  <form onSubmit={e => {e.preventDefault();localStorage.setItem("github_token", token);
notifications.show({title:"github token",message:"token successfully added",autoClose:3000, icon:<IconCircleCheck/>, color: "teal"})}}>
	    <Flex direction="column" gap="xs">
	      <Input value={token} onChange={ e => setToken(e.target.value)}/>
	    </Flex>
	  </form>
	</Menu.Item>
      </Menu.Dropdown>

    </Menu>
  )
})

function Repos({repos}:{repos: Repo|null}){
  if(!repos) return <Text>Loading...</Text>
  return (
    <Stack className="bg-secondary-100 py-5 px-4">
      {
	repos.map( (repo) => <Repo key={repo.id} repo={repo} /> )
      }
    </Stack>
  )
}

function Repo({repo}:{repo: Unpacked<Repo>}){
  const [activeBranch, setActiveBranch] = useState(repo.default_branch)

  return (
    <Card >
      <RepoHeader repo={repo} setActiveBranch={setActiveBranch} activeBranch={activeBranch} />
      <RepoBody repo={repo} branch={activeBranch} />
    </Card>
  )
}

function RepoHeader({repo,activeBranch,setActiveBranch}: {repo: Unpacked<Repo>,activeBranch: string|undefined,setActiveBranch: (branch: string|undefined) => void}){
  const [activeCloneUrl, setActiveCloneUrl] = useState(0);
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  // @ts-ignore:
  const [branches, setBranches] = useState<any>(localStorage.getItem(`${repo.id}_branches`) ? JSON.parse(localStorage.getItem(`${repo.id}_branches`)) : [{name: activeBranch}])
  const clipboard = useClipboard({ timeout: 1000 });

  const fetchBranches = async () => {
    try{
      const localstorageBranches = localStorage.getItem(`${repo.id}_branches`)
      if(localstorageBranches){
	let repos = JSON.parse(localstorageBranches)
	if(checkTimestamp(repos,Date.now() - 1000 * 60 * 60 * 24 * 7)){
	  return;
	}
      }
      let branches = await octokit.request(`GET {url}`,{
	url: repo.branches_url
      })
      branches = branches.data
      setBranches(branches)
      addTimestamp(branches)
      localStorage.setItem(`${repo.id}_branches`,JSON.stringify(branches))
      console.log(branches)
    }catch(err){
      console.log(err)
    }
  }

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };
  

  const repo_clone_urls = [repo.ssh_url,repo.clone_url]
  const cloneMethod = ["ssh","https"].map((item,index) => (
    <UnstyledButton
      key={item}
      className="control"
      ref={setControlRef(index)}
      onClick={() => setActiveCloneUrl(index)}
      mod={{ activeCloseUrl: activeCloneUrl === index }}
    >
      <span className="controlLabel">{item}</span>
    </UnstyledButton>
  ));

  return (
    <header className="relative">
      <Flex justify='space-between'>
	<Flex gap="7" wrap="wrap">
	  <Badge color="teal">{repo.visibility}</Badge> 
	  <a href={repo.html_url}><Text className="overflow-x-auto">{repo.name}</Text></a>
	</Flex>
	<Stack gap="5" mx="10" align="flex-end">
	  <Badge color="main" >{repo.language}</Badge>
	  <Select className="w-40 text-center" value={activeBranch} data={branches.map((b:Unpacked<Branch>) => b.name)}
		  onDropdownOpen={fetchBranches} leftSection={<IconGitBranch stroke={2} className="cursor-pointer"/>} rightSection={<span/>}
		  onChange={(val) => val ? setActiveBranch(val): ""} />
	</Stack>
      </Flex>
      <Flex align='center' justify="center" mt="20" className="space-x-2">
	<div className="root" ref={setRootRef}>
	  {cloneMethod}
	  <FloatingIndicator
            target={controlsRefs[activeCloneUrl]}
            parent={rootRef}
            className="indicator"
	  />
	</div>
	<Popover opened={clipboard.copied} position="top" withArrow>
	  <Popover.Target>
	    <Button className="!text-white" color={clipboard.copied ? 'teal' : 'secondary'} variant="light" radius="md" onClick={() => clipboard.copy(repo_clone_urls[activeCloneUrl])}>
              {repo_clone_urls[activeCloneUrl]}
	    </Button>
	  </Popover.Target>
	  <Popover.Dropdown color="teal">
            <Text size="xs">copied to the clipboard</Text>
	  </Popover.Dropdown>
	</Popover>
      </Flex>
    </header>
  )
}

function RepoBody({repo,branch}:{repo: Unpacked<Repo>,branch: string|undefined}){
  const [commits, setCommits] = useState<Commit|null>(null)
  const [contents, setContents] = useState<Content|null>(null)
  const [opened, {toggle}] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState(0)
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

  const fetchCommits = async () => {
    try{
      let commits = await octokit.request(`GET /repos/{owner}/{repo}/commits`,{
	owner: repo.owner.login,
	repo: repo.name,
      })
      const commit = commits.data
      addTimestamp(commit)
      setCommits(commit)
      localStorage.setItem(`${repo.id}_${branch}_commits`,JSON.stringify(commit))
    }catch(err){
      console.log(err)
    }
  }
  
  const fetchContents = async (path="./"):Promise<Content> => {
    let contents = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}?ref=${branch}`,{
      owner: repo.owner.login,
      repo: repo.name,
      path: path
    })
    const content = contents.data
    addTimestamp(content)
    setContents(content)
    localStorage.setItem(`${repo.id}_${branch}_${path}_contents`,JSON.stringify(content))
    return content
  }
  const getContents = async (path:string):Promise<Content> => {
   let content = localStorage.getItem(`${repo.id}_${branch}_${path}_contents`)
    if(content){
      if(checkTimestamp(content,Date.now() - 1000 * 60 * 60 * 24 * 7)){
	content = JSON.parse(content)
	// @ts-ignore: 
	setContents(content)
	// @ts-ignore: 
	return content
      }
    }
    let contents = await fetchContents(path)
    return contents
  }

  useEffect(() => {
    if(!opened) return;
    //"./" == root path 
    getContents("./")
     const commits = localStorage.getItem(`${repo.id}_${branch}_commits`)
    if(commits){
      if(checkTimestamp(commits,Date.now() - 1000 * 60 * 60 * 24 * 7))
	setCommits(JSON.parse(commits))
    } else fetchCommits()
  },[opened,branch])
  
  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const tabs = ["Content","Commits"].map((item,index) => (
    <UnstyledButton key={item} className="control"
      ref={setControlRef(index)} onClick={() => setActiveTab(index)}
      mod={{ activeCloseUrl: activeTab === index }}>
      <span className="controlLabel">{item}</span>
    </UnstyledButton>
  ));

    
  if(!opened) return <Flex align="center" justify="center"><IconChevronsDown stroke={2} className="cursor-pointer" onClick={toggle} /></Flex>
  return (
    <Stack align="center" justify="center">
      <IconChevronsUp stroke={2} className="cursor-pointer" onClick={toggle}/>
      <Flex align='center' justify="center" className="space-x-2">
	<div className="root" ref={setRootRef}>
	  {tabs}
	  <FloatingIndicator target={controlsRefs[activeTab]} parent={rootRef} className="indicator" />
	</div>
      </Flex>
      {activeTab === 0 ? <RepoContent contents={contents} branch={branch} getContents={getContents} /> : <RepoCommits commits={commits} />}
      <IconChevronsUp stroke={2} className="cursor-pointer" onClick={toggle}/>
    </Stack>
  )
}


function usePrevious(value:string) {
  const ref = useRef('');
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


interface RepoPath {
  label: string
  content: Content|null
}

function RepoContent({contents,branch,getContents}:{contents: Content|null,branch: string|undefined,getContents: (path:string) => Promise<Content>}){
  const [paths, setPaths] = useState<RepoPath[]>([{label:"./",content:contents}])
  const prevBranch = usePrevious(branch ? branch : "")

  const openFolder = async (path:string) => {
    const pths = [...paths]
    pths.shift()
    let contents = await getContents(pths.map(path => `${path.label}/`).join("")+path)
    setPaths([...paths,{label:path,content:contents}])
  }

  useEffect(() => {
    if(!paths[0].content || prevBranch !== branch){setPaths([{label:"./",content:contents}])}
  },[contents,branch])

  if(!paths[paths.length-1].content) return <Text>Loading...</Text>
  return (
    <Stack className="w-full">
      <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
	{
          paths.map( (path,index) => (
	    <span className="cursor-pointer" key={index} onClick={() => setPaths(paths.slice(0,index+1))}>{path.label}</span>))
	}
      </Breadcrumbs>

      {
	// @ts-ignore:
	paths[paths.length-1].content !==null && paths[paths.length-1].content.map( (item:Unpacked<Content>) =>(
	  <Flex className="w-full cursor-pointer" key={item.name}>
	    <Text onClick={ () => item.type === "dir" ? openFolder(item.name) : null }>
	      {item.type !== "dir" ? <a href={item.html_url ? item.html_url : "#"} className="flex"><IconFile stroke={2} />{item.name}</a> :
	       <span className="flex"><IconFolder stroke={2} />{item.name}</span>}
	    </Text>
	  </Flex>
	))
      }
    </Stack>
  )
}

function RepoCommits({commits}:{commits: Commit|null}){
  
  if(!commits) return <Text>Loading...</Text>
  return (
    <Stack>
      {
	commits.map( (commit) =>(
	  <Flex justify="space-between" className="border-b-2">
	    <Text><a href={commit.html_url}>{commit.commit.message}</a></Text> 
	    <Text ml="10">{commit.commit.committer?.date ? new Intl.DateTimeFormat("en-GB").format(new Date(commit.commit.committer?.date)): ""}</Text>
	  </Flex>
	))}
    </Stack>
  )
}
