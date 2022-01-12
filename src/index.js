/*
 * @Author: lmk
 * @Date: 2021-07-07 23:23:36
 * @LastEditTime: 2022-01-12 18:42:36
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
import MisesExtensionController from  './utils/postMessage'
window.mises = new MisesExtensionController()
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
// new VConsole();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
