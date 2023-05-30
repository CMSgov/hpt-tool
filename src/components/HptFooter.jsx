import React from "react"
import { Footer, FooterNav, Logo } from "@trussworks/react-uswds"
import logoImg from "../static/media/logo-cms.svg"

const HptFooter = () => {
  return (
    <Footer
      size="slim"
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-12">
            <FooterNav
              size="slim"
              links={[
                <a
                  key="about"
                  className="usa-footer__primary-link"
                  href="https://www.cms.gov/hospital-price-transparency"
                >
                  About Hospital Price Transparency
                </a>,
                <a
                  key="resources"
                  className="usa-footer__primary-link"
                  href="https://www.cms.gov/hospital-price-transparency/resources"
                >
                  Resources
                </a>,
              ]}
            />
          </div>
        </div>
      }
      secondary={
        <Logo
          size="slim"
          image={
            <img
              className="usa-footer__logo-img"
              alt="Centers for Medicare and Medicaid Services"
              src={logoImg}
            />
          }
          heading={
            <p className="usa-footer__logo-heading">
              Centers for Medicare and Medicaid Services
            </p>
          }
        />
      }
    />
  )
}

export default HptFooter
