import 'antd/dist/antd.css'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
import App from './App'

Amplify.configure(config)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
