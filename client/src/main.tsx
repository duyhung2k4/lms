import App from './App.tsx'
import themeGlobal from './theme/theme.global.ts'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { Provider } from "react-redux";
import { store } from './redux/store.ts'
import { Notifications } from '@mantine/notifications';

import "dayjs/locale/vi";
import dayjs from "dayjs";
dayjs.locale("vi");
import { DatesProvider } from "@mantine/dates";

import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import '@mantine/notifications/styles.css';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MantineProvider
          theme={themeGlobal}
          defaultColorScheme="dark"
        >
          <DatesProvider settings={{ locale: "vi" }}>
            <Notifications />
            <App />
          </DatesProvider>
        </MantineProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
