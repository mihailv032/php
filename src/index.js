import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import HotkeysProvider from './hotkeys';
import './index.css'
import '@mantine/core/styles.css'; import '@mantine/notifications/styles.css';

import { Button,createTheme, Input, MantineProvider,Menu,Textarea } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  colors: {
    moron: [
      '#933939',
      '#933939',
      '#C55D5D',
      '#F4A3A3',
      '#FFC7C7',
      '#FFEBEB',
      '#933939',
      '#C55D5D',
      '#E27D7D',
      '#933939',
    ],
    main: [
      '#933939',
      '#933939',
      '#933939',
      '#933939',
      '#933939',
      '#933939',
      '#933939',
      '#933939',
      '#933939',
      '#933939',
    ],
    secondary: [
      "#1A1B1D",
      "#1E1E1E",
      "#2A2B2E",
      "#1A1B1D",
      "#1E1E1E",
      "#2A2B2E",
      "#1A1B1D",
      "#1E1E1E",
      "#2A2B2E",
      "#1A1B1D",
      "#1E1E1E",
      
    ]
  },
  primaryColor: "moron",
  components: {
    Input:Input.extend({
      styles: {
	input: {
	  backgroundColor: '#1E1E1E',
	  color: 'white',
	  borderRadius: "6px",
	  border: 0,
	  '&:focus': {
	    border: 0,
	  },
	},
      },
    }),
    Menu:Menu.extend({
      styles: {
	dropdown: {
	  backgroundColor: '#232323',
	  color: 'white',
	  borderRadius: "6px",
	  border: 0,
	  '&:focus': {
	    border: 0,
	  },
	},
	item:{
	  "&:hover": {
	    backgroundColor: '#2A2B2E',
	  },
	},
	arrow:{
	  bgColor: '#232323',
	  border: '1px solid #232323',
	  outline: 'none',
	}
      }
    }),
    Button:Button.extend({
      styles: {
	root: {
	  outline: 'none',
	}
      }
    }),
    Textarea:Textarea.extend({
      styles: {
	input: {
	  backgroundColor: '#272727',
	  color: 'white',
	  border: 0,
	  borderRadius: "6px",
	  '&:focus': {
	    border: 0,
	  },
	},
      }
    })
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <ModalsProvider>
	<HotkeysProvider>
  	  <App />
	</HotkeysProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
)
