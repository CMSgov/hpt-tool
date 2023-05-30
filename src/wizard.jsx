import "./polyfills.js"
import React from "react"
import ReactDOM from "react-dom/client"
import Wizard from "./pages/wizard"

import "@trussworks/react-uswds/lib/uswds.css"
import "@trussworks/react-uswds/lib/index.css"

import "./css/style.css"

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <Wizard />
  </React.StrictMode>
)
