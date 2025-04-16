import { Modal } from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useEffect,useContext} from 'react';
import {HotkeysContext} from '../../hotkeys'

export default function Settings(){
  const [opened, {open,close}] = useDisclosure(false);
  const {setWord} = useContext(HotkeysContext);

  useEffect( () => {
    setWord('settings', open);
  }, [])
  return (
    <Modal opened={opened} onClose={close} title="Settings">
      <h1>kuraw</h1>
    </Modal>
  )
}
