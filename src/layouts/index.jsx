import React from "react"
import PropTypes from "prop-types"
import HptHeader from "../components/HptHeader"
import HptFooter from "../components/HptFooter"

const Layout = (props) => {
  return (
    <>
      <HptHeader />
      <main id="main-content">{props.children}</main>
      <HptFooter />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout
