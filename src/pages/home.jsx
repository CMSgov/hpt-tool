import React from "react"
import { Grid } from "@trussworks/react-uswds"
import Layout from "../layouts"
import dollarIcon from "../static/media/dollar-icon.png"
import cliClient from "../static/media/cli-client.png"
import namingWizard from "../static/media/naming-wizard.png"
import onlineValidator from "../static/media/online-validator.png"
import txtGenerator from "../static/media/txt-generator.png"
import banner from "../static/media/banner.png"

const Home = () => {
  return (
    <Layout>
      <div className="bg-base-lightest">
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid
              gap
              desktop={{ col: 12 }}
              className="border-top border-base-lighter padding-top-4 desktop:border-0 desktop:padding-top-0"
            >
              <div className="usa-prose">
                <img
                  alt="Hospital Price Transparency"
                  src={dollarIcon}
                  width="100px"
                />
                <img
                  alt="Hospital Price Transparency"
                  src={banner}
                  width="600px"
                />
                <br></br>
                <div>
                  The Centers for Medicare and Medicaid Services (CMS) has
                  developed and maintains tools to support hospitals in meeting
                  some of the machine-readable file (MRF) requirements for
                  Hospital Price Transparency.
                </div>
                <br></br>
                <div className="grid-col-12">
                  The <strong>online validator</strong> tests machine readable
                  files against the required CMS template layouts and data
                  specifications (
                  <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-E/part-180/subpart-B/section-180.50#p-180.50(c)">
                    45 CFR 180.50(c)
                  </a>
                  (2)). The online validator runs in a user’s web browser, and
                  it is recommended for nontechnical users.
                </div>
                <br></br>
                <div className="grid-col-12">
                  The <strong>command-line interface (CLI) validator</strong>{" "}
                  tests machine readable files against the required CMS template
                  layouts and data specifications (
                  <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-E/part-180/subpart-B/section-180.50#p-180.50(c)">
                    45 CFR 180.50(c)
                  </a>
                  (2)). The CLI is a downloaded tool that runs locally in the
                  user’s terminal, and it is recommended for technically
                  proficient users validating multiple files simultaneously or
                  integrating the validator into a software pipeline.
                </div>
                <br></br>
                <div className="grid-col-12">
                  The <strong>MRF naming wizard</strong> assists users in
                  generating the MRF file name in accordance with the naming
                  convention requirements (
                  <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-E/part-180/subpart-B/section-180.50#p-180.50(d)(5)">
                    45 CFR 180.50(d)(5)
                  </a>
                  ).
                </div>
                <br></br>
                <div className="grid-col-12">
                  The <strong>TXT file generator</strong> assists users in
                  generating a TXT file with the required attributes of
                  information to improve accessibility to MRFs (
                  <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-E/part-180#p-180.50(d)(6)">
                    45 CFR 180.50 (d)(6)(i)
                  </a>
                  ).
                </div>
                <br></br>
                <div className="grid-row grid-gap">
                  <div className="grid-col-3">
                    <a href={`${import.meta.env.BASE_URL}online-validator/`}>
                      <img
                        alt="Hospital Price Transparency"
                        src={onlineValidator}
                        width="150px"
                      />
                    </a>
                  </div>
                  <div className="grid-col-3">
                    <a href={`https://github.com/CMSgov/hpt-validator-cli`}>
                      <img
                        alt="Hospital Price Transparency"
                        src={cliClient}
                        width="150px"
                      />
                    </a>
                  </div>
                  <div className="grid-col-3">
                    <a href={`${import.meta.env.BASE_URL}filename-wizard/`}>
                      <img
                        alt="Hospital Price Transparency"
                        src={namingWizard}
                        width="150px"
                      />
                    </a>
                  </div>

                  <div className="grid-col-3">
                    <a href={`${import.meta.env.BASE_URL}txt-generator/`}>
                      <img
                        alt="Hospital Price Transparency"
                        src={txtGenerator}
                        width="150px"
                      />
                    </a>
                  </div>
                </div>
                <br></br>
                <hr></hr>
              </div>
            </Grid>
          </Grid>
        </section>
      </div>
    </Layout>
  )
}

export default Home
