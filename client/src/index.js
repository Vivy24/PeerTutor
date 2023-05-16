import React from "react"
import "./index.css"
import ReactDom from "react-dom"
import App from "./App"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store/index.js"
const root = document.getElementById("root")

ReactDom.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  root
)
