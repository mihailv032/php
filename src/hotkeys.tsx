import { createContext, useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';



interface HotkeysContextData {
  hotkeys: Hotkeys;
  setHotkeys: SetHokeys;
  deleteHotkey: deleteHotkey;

  words: WordObject[];
  setWord: SetWord
}
//THE KEY SHOULD BE THE KEYCODE OF THE KEY eg KeyA
interface Hotkeys {
  [key: string]:  () => void;
}

interface WordObject {
  word: string;
  current_index: number;
  onType: () => void;
}

type SetHokeys = (hotkey: string, handler: () => void,replace:boolean) => void;
type deleteHotkey = (hotkey: string) => void;

type SetWord = (word: string, onType: () => void) => void;
type deleteWord = (word: string) => void;

export const HotkeysContext = createContext<HotkeysContextData>({} as HotkeysContextData);

export default function HotkeysProvider({children}: {children: React.ReactNode}){
  const hotkeys = useRef<Hotkeys>({});
  const keywords = useRef<WordObject[]>([]);

  const setHotkeys:SetHokeys = (hotkey, handler,replace) => {
    if(Object.keys(hotkeys.current).includes(hotkey) && !replace){
      notifications.show({title:"hotkey already taken",message:"choose a diferent hotkey",autoClose:3000,icon:<IconCircleX /> });
      return;
    }
    hotkeys.current[hotkey] = handler;
  }

  const deleteHotkey:deleteHotkey = (hotkey) => {delete hotkeys.current[hotkey]};
  
  const setWord:SetWord = (word, onType) => {
    console.log(keywords.current)
    if(keywords.current.map(obj => obj.word).includes(word)){
      notifications.show({title:"word already taken",message:"choose a diferent word",autoClose:3000,icon:<IconCircleX /> });
      return;
    }
    keywords.current.push({word, current_index: 0, onType})
  }

  useEffect(() => {
    document.body.addEventListener('keydown',(e:KeyboardEvent) => {
      //if the user is typing in an input or textarea, don't trigger the hotkeys
      if(document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return
      if(e.ctrlKey && e.shiftKey){
	if (hotkeys.current[e.code]){
          e.preventDefault();
	  hotkeys.current[e.code]();
          return;
	}
      }
      keywords.current.forEach( (obj) => {
        if(obj.word[obj.current_index] === e.key){
          if(obj.current_index < obj.word.length-1){
	    console.log(obj.current_index)
            obj.current_index++;
            return;
          }
          obj.onType()
        }
        obj.current_index = 0;
      })
    })
  }, [])
  
  return (
    <HotkeysContext.Provider value={{hotkeys: hotkeys.current,setHotkeys,deleteHotkey,words: keywords.current, setWord}}>
      {children}
    </HotkeysContext.Provider>
  )
}
