import { v4 as uuid } from 'uuid';
import { useForm,UseFormReturnType  } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useState, useEffect, useContext, KeyboardEvent } from 'react'
import { Stack,Flex,Box,Button,Group, TextInput,Checkbox, Menu } from '@mantine/core';
import {HotkeysContext} from '../../hotkeys'
import {useDisclosure,useClickOutside} from '@mantine/hooks'

interface App {
  id: number|string
  name: string
  icon: string
  url: string
  hotkey: string
}

type AddAppInterface = Omit<App,"id">

interface AddAppArgs extends AddAppInterface{
  addHotkey: boolean
}
type AddApp = (values:AddAppArgs) => void


type UpdateApp = (index:number,values:AddAppInterface) => void

type DeleteApp = (index:number) => void
export default function FavoriteApps(){
  const [apps, setApps] = useState<App[]>([])
  const {setHotkeys,deleteHotkey} = useContext(HotkeysContext)

  const getFavIconUrl = (url:string) => {
    let urlForDomain:string|string[] = Array.from(url)
    if(urlForDomain.indexOf("/",9) !== -1){urlForDomain = urlForDomain.splice(0,urlForDomain.indexOf("/",8))}
    else if(urlForDomain.indexOf("?") !== -1){urlForDomain = urlForDomain.splice(0,urlForDomain.indexOf("?"))}
    urlForDomain=urlForDomain.join("")
    urlForDomain= urlForDomain.split(".")
    if(urlForDomain.length > 2){
      urlForDomain[0] = urlForDomain[0].slice(0,8)
      for(let i=1;i<urlForDomain.length -3;i++){
	delete urlForDomain[i]
      }
      urlForDomain=urlForDomain.filter( item => item )
    }
    urlForDomain[urlForDomain.length-2] = `${urlForDomain[urlForDomain.length-2]}.`
    urlForDomain=urlForDomain.join("")
    return `${urlForDomain}/favicon.ico`
  }

  const addApp:AddApp = (values) => {
    const favicon = getFavIconUrl(values.url)
    if(values.addHotkey) setHotkeys(values.hotkey,()=>window.open(values.url),false)
    setApps([{name:values.name,url:values.url,icon:favicon,hotkey: values.hotkey,id: uuid()},...apps])
  }

  const changeAppDetails:UpdateApp = (index,values):void => {
    const appArr = [...apps]
    const favicon = getFavIconUrl(values.url)
    appArr[index] = {name:values.name,url:values.name,icon:favicon,hotkey: values.hotkey,id: appArr[index].id}
    setApps(appArr)
  }

  const deleteApp:DeleteApp = (index:number):void =>{
    const appsArr = [...apps]
    const deletedApp = appsArr.splice(index,1)
    setApps(appsArr)
    if(deletedApp[0].hotkey) deleteHotkey(deletedApp[0].hotkey)
  }


  useEffect(() => {

    if(apps.length === 0){
      setHotkeys("KeyY",() => modals.open({title: "Add favourite app",children:<AddApp submitApp={addApp} />,centered:true}),true)
      const jsonapps = localStorage.getItem("apps")
      if(jsonapps !== null){
	const apps:App[] = JSON.parse(jsonapps)
	if(apps.length === 0) return;
	setApps(apps)
	apps.forEach(app => { app.hotkey && setHotkeys(app.hotkey,() => window.open(app.url),false)})
      }
    }
    localStorage.setItem("apps",JSON.stringify(apps))
  }, [apps])

  return (
    <Flex className="text-white space-x-4" align="center">
      {apps.map((app: App,i:number) => <Application app={app} key={app.id} updateApp={(values:AddAppArgs) =>{changeAppDetails(i,values)}}
						    deleteApp={()=> deleteApp(i) } />)}
      <span className="font-bold text-xl cursor-pointer" onClick={ () => modals.open({title: "Add favourite app",children:<AddApp submitApp={addApp} />,centered:true})}>
	+
      </span>
    </Flex>
  )
}

function Application({app,updateApp,deleteApp}:{app:App,updateApp:AddApp,deleteApp: () => void}){
  const [opened,{toggle,close}] = useDisclosure(false)
  const ref = useClickOutside(close)
  return (
    <div ref={ref}>
      <AppMenu opened={opened} app={app} updateApp={updateApp} deleteApp={deleteApp}>
	<a href={app.url} key={app.id} className="items-center" onContextMenu={ e =>{e.preventDefault();toggle()}}>
	  <img src={app.icon} alt={app.name} className="w-5 h-5" />
	</a>
      </AppMenu>
    </div>
  )
}

const AddApp = ({submitApp,formInitialValues}:{submitApp: AddApp,formInitialValues?: Omit<App, "id">}) => {

  const form:any =useForm({
    initialValues: {
      name: formInitialValues ? formInitialValues.name : "",
      url: formInitialValues ? formInitialValues.url : "",
      addHotkey: formInitialValues ? Boolean(formInitialValues.hotkey) : false,
      hotkey: formInitialValues ? formInitialValues.hotkey : ""
    },

    validate: {
      url: (value:string) => {
	if(value.trim().length < 10) return 'Url is too short';
	let checkUrl = Array.from(value).splice(0,8)
	if(checkUrl.join("") !== "https://") form.values.url = "https://"+value
	return null;
      },
      hotkey: (value:string) => form.values.addHotkey && !Boolean(value) && 'Hotkey is too short'
    },
  });

  return (
    <Box maw={340} mx="auto" mih={500}>
      <form onSubmit={form.onSubmit((values: AddAppArgs): void =>{submitApp(values)})} className="flex flex-col justify-between h-full">
	<Stack justify='between'>
          <TextInput
            label="Name"
            placeholder="porn"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
	  <TextInput
	    label="Url"
	    placeholder="https://pornhub.com"
	    key={form.key('url')}
	  {...form.getInputProps('url')}
	  />
          <Checkbox
            mt="md"
            label="Add Custom Hotkey"
            key={form.key('addHotkey')}
            {...form.getInputProps('addHotkey', { type: 'checkbox' })}
          />
	  {form.values.addHotkey &&
	   <HotkeyInput
	     label="Hotkey CTRL + Shift + "
	     placeholder="p"
	     key={form.key('hotkey')}
	   {...form.getInputProps('hotkey')}
	   /> 
	  }
	</Stack>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

interface CustomInputProps {
  value: string;
  defaultValue?: string;
  onChange?: (event: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

function HotkeyInput({value,defaultValue,onChange,onFocus,onBlur,error,}: CustomInputProps) {
  const [keyvalue,setKeyvalue] = useState<string>("")

  const handleOnChange = (e:KeyboardEvent) => {
    if(e.code === "Enter" || e.code === "Backspace"){e.preventDefault(); return;};
    if(value.length > 1 ) return;
    setKeyvalue(e.key);
    if(e.code && onChange)
      onChange(e.code)
  }
  return (
    <div>
      <TextInput
        value={keyvalue}
        defaultValue={defaultValue}
	onKeyDown={handleOnChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error && <div>{error}</div>}
    </div>
  );
}
function AppMenu({children,opened,updateApp,app,deleteApp}:
		 {children: React.ReactNode,opened:boolean,updateApp:AddApp,app:App,deleteApp: () => void}){
  return (
    <Menu shadow="md" opened={opened} transitionProps={{ transition: 'pop', duration: 300 }} withArrow >
      <Menu.Target>
	{children}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
	<Menu.Item onClick={() => modals.open({ title: "Add favourite app", children: <AddApp submitApp={updateApp} formInitialValues={app} />,centered:true})}>
	  <span>
            Update Details
	  </span>
        </Menu.Item>
        <Menu.Item
	  onClick={deleteApp}
          color="red"
        >
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>

    </Menu>
  )
}
