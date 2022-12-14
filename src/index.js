/*
 * @Author: lmk
 * @Date: 2021-07-07 23:23:36
 * @LastEditTime: 2022-08-19 18:21:25
 * @LastEditors: lmk
 * @Description: 
 */
import React from 'react';
import {render} from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './locales'
// import VConsole from 'vconsole';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { isIosPlatform } from './utils';
import { patchHttpsUrl } from './api/updata';
import "@/utils/extension"

if (document.readyState === "loading" && isIosPlatform()) {
  patchHttpsUrl()
}

if(!process.env.NODE_ENV === "development"){
  Sentry.init({
    dsn: "https://ce70d202b4be4f7685dbf1ed40a55227@o1162849.ingest.sentry.io/6274250",
    integrations: [new BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

render(<App />, document.getElementById('root'));
// new VConsole();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
