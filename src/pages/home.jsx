import React from "react"
import {
  Grid,
} from "@trussworks/react-uswds"
import Layout from "../layouts"

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
                <h1>Hospital Price Transparency</h1>
                <h1>TOOLS</h1>
                <p>
                The Centers for Medicare and Medicaid Services (CMS) has developed and maintains tools to support hospitals in meeting the machine-readable file (MRF) and accessibility requirements for Hospital Price Transparency.
                </p>
                <p>
                The <strong>online validator</strong> tests machine readable files against the new required CMS template layouts and data specifications as described at (<a href="#">45 CFR 180.50(c)</a>). The online validator runs in a user’s web browser, and it is recommended for nontechnical users. 
                </p>
                <p>
                The <strong>command-line interface (CLI) validator</strong> is a downloaded tool that runs locally in the user’s terminal that tests machine readable files against the new required CMS template layouts and data specifications as described at (<a href="#">45 CFR 180.50(c)</a>). We recommend that the CLI validator tool only be used by technically proficient users validating multiple files simultaneously or integrating the validator into a software pipeline.
                </p>
                <p>
                The <strong>MRF naming wizard</strong> assists users in generating the MRF file name in accordance with the naming convention requirements (<a href="#">45 CFR 180.50(d)(5)</a>).
                </p>
                <p>
                The <strong>TXT file generator</strong> assists users in generating a TXT file with the required attributes of information to improve accessibility to MRFs (45 CFR 180.50 (d)(6)(i)). 
                </p>
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
