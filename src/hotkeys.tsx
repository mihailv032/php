import { createContext, useLayoutEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';



interface HotkeysContextData {
  hotkeys: Hotkeys;
  setHotkeys: SetHokeys;
  deleteHotkey: deleteHotkey;
}

interface Hotkeys {
  [key: string]:  () => void;
}


type SetHokeys = (hotkey: string, handler: () => void,replace:boolean) => void;
type deleteHotkey = (hotkey: string) => void;

export const HotkeysContext = createContext<HotkeysContextData>({} as HotkeysContextData);

export default function HotkeysProvider({children}: {children: React.ReactNode}){
  const hotkeys = useRef<Hotkeys>({});

  const setHotkeys:SetHokeys = (hotkey, handler,replace) => {

    if(Object.keys(hotkeys.current).includes(hotkey) && !replace){
      notifications.show({title:"hotkey already taken",message:"choose a diferent hotkey",autoClose:3000 });
      return;
    }
    hotkeys.current[hotkey] = handler;
  }

  const deleteHotkey:deleteHotkey = (hotkey) => {delete hotkeys.current[hotkey]};

  useLayoutEffect(() => {
    document.body.addEventListener('keydown', e => {
      console.log(e.code)
      if(document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return
      if(e.ctrlKey && e.shiftKey){
	if (hotkeys.current[e.code]){
          e.preventDefault();
	  hotkeys.current[e.code]();
          return;
	}
      }else if(e.ctrlKey && e.key === "Enter"){
	//searchBarRef.current.focus()
        return;
      }
//      keywords.current.forEach( (obj) => {
//        if(obj.letter === e.key){
//          if(obj.wordObject.current_index < obj.wordObject.word.length-1){
//            obj.wordObject.current_index += 1
//            obj.letter=obj.wordObject.word[obj.wordObject.current_index]
//            return;
//          }
//          obj.onType()
//        }
//        obj.wordObject.current_index = 0;obj.letter=obj.wordObject.word[0]
//      })
    })
  }, [])
  
  return (
    <HotkeysContext.Provider value={{hotkeys: hotkeys.current,setHotkeys,deleteHotkey}}>
      {children}
    </HotkeysContext.Provider>
  )
}
