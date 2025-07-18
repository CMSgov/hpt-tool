import React from "react"
import { useState } from "react"
import {
  Label,
  Grid,
  FormGroup,
  // Fieldset,
  // Radio,
} from "@trussworks/react-uswds"
import { FileInput } from "../components/FileInput"
import ValidationResults from "../components/ValidationResults"
import { validateCsv, validateJson } from "@cmsgov/hpt-validator"
import Layout from "../layouts"

const MAX_ERRORS = 250
const STORAGE_PATH = "cms-hpt-validation-results"

// const SCHEMA_VERSIONS = ["v1.1", "v2.0"]

const getFileExtension = (filename) => {
  const splitFilename = filename.toLowerCase().split(".")
  if (splitFilename.length < 1) return null
  return splitFilename.slice(-1)[0]
}

const OnlineValidator = () => {
  const [state, setState] = useState(
    JSON.parse(window.sessionStorage.getItem(STORAGE_PATH)) || {
      valid: true,
      filename: "",
      schemaVersion: "v2.0",
      fileUrl: "",
      pageUrl: "",
      loading: false,
      didMount: false,
      readError: false,
      errors: [],
      warnings: [],
      alerts: [],
      startTimestamp: "",
      endTimestamp: "",
    }
  )

  const validateFile = async (evt) => {
    const file = evt.target.files[0]
    const initialState = {
      filename: file.name,
      schemaVersion: state.schemaVersion,
    }
    setState({ ...state, ...initialState, readError: false, loading: true })
    const fileExt = getFileExtension(file.name)
    if (["csv", "json"].includes(fileExt)) {
      try {
        const startTimestamp = new Date().toString()
        const { valid, errors, alerts } = await (fileExt === "csv"
          ? validateCsv(file, state.schemaVersion, { maxErrors: MAX_ERRORS })
          : validateJson(file, state.schemaVersion, { maxErrors: MAX_ERRORS }))
        const stateObj = {
          ...initialState,
          valid,
          errors: errors.filter(({ warning }) => !warning),
          warnings: errors.filter(({ warning }) => warning),
          alerts,
          loading: false,
          didMount: true,
          startTimestamp,
          endTimestamp: new Date().toString(),
        }
        setState(stateObj)
        window.sessionStorage.setItem(STORAGE_PATH, JSON.stringify(stateObj))
      } catch (error) {
        console.error(error)
        setState({
          ...initialState,
          loading: false,
          didMount: true,
          readError: true,
        })
      }
    }
  }

  const locationHeader =
    getFileExtension(state.filename) === "csv" ? "CSV cell" : "JSON location"

  return (
    <Layout>
      <div className="bg-base-lightest">
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid
              desktop={{ col: 6 }}
              className="bg-white flex-align-self-start margin-bottom-4"
            >
              <form action="" method="GET">
                <FormGroup>
                  <Label htmlFor="file-input">
                    <p className="font-sans-xl text-bold margin-bottom-0">
                      Upload file
                    </p>
                    Files must be in a required CMS template format (.json or
                    .csv)
                  </Label>
                  <FileInput
                    id="file-input"
                    name="file-input"
                    accept=".csv,.json,text/csv,application/json"
                    onChange={validateFile}
                  />
                </FormGroup>
                {/* TODO: Add this back in when multiple versions are allowed in the schema */}
                {/* <Fieldset
                  legend={<span className="text-bold">Schema version</span>}
                  className="usa-form-group margin-top-0"
                  onChange={(e) => {
                    setState({ ...state, schemaVersion: e.target.value })
                  }}
                >
                  {SCHEMA_VERSIONS.map((version) => (
                    <Radio
                      key={version}
                      id={`schema-version-${version}`}
                      name="schema-version"
                      label={version}
                      value={version}
                      defaultChecked={state.schemaVersion === version}
                    />
                  ))}
                </Fieldset> */}
              </form>
              {state.loading && (
                <p aria-live="polite" aria-atomic="true" className="text-bold">
                  Loading file {state.filename}...
                </p>
              )}
            </Grid>
            <Grid
              gap
              desktop={{ col: 6 }}
              className="border-top border-base-lighter padding-top-4 desktop:border-0 desktop:padding-top-0"
            >
              <div className="usa-prose">
                <h1>About This Tool</h1>
                <p>
                  <strong>
                    Please note: Leveraging the Validator helps ensure adherence
                    to CMS form and manner requirements (45 CFR 180.50(c)(2)),
                    but it does not certify that your MRF fully complies with
                    all HPT requirements at 45 CFR 180.50.
                  </strong>
                </p>
                <p>
                  The V2.0 Online Validator tool assists your hospital in
                  developing a machine- readable file (MRF) to ensure it
                  conforms to the required form and manner requirements (45 CFR
                  180.50(c)(2)). These form and manner requirements are
                  described in the{" "}
                  <a href="https://www.federalregister.gov/documents/2023/11/22/2023-24293/medicare-program-hospital-outpatient-prospective-payment-and-ambulatory-surgical-center-payment">
                    CY 2024 OPPS/ASC Final Rule
                  </a>
                  , and detailed technical specifications can be found in the{" "}
                  <a href="https://github.com/CMSgov/hospital-price-transparency/">
                    Hospital Price Transparency Data Dictionary GitHub
                    Repository
                  </a>
                  .
                </p>
                <p>
                  The Online Validator reviews your uploaded MRF against the
                  required CMS template layout and data specifications. The
                  Online Validator will generate an output consisting of
                  &apos;errors&apos; and &apos;alerts&apos;. &apos;Errors&apos;
                  are generated if your MRF does not conform to the form and
                  manner requirements specified in the data dictionary.
                  &apos;Alerts&apos; are generated if your MRF contains nine 9s
                  (999999999) in the estimated allowed amount data element,
                  which are to be replaced with actual dollar amounts as
                  indicated in{" "}
                  <a href="https://www.cms.gov/files/document/updated-hpt-guidance-encoding-allowed-amounts.pdf">
                    CMS guidance
                  </a>{" "}
                  issued on May 22, 2025. The Online Validator stops reviewing
                  an MRF if there are more than 250 errors. Additionally for CSV
                  MRFs, the Online Validator stops reviewing if an error is
                  found in row 1 through 3 (i.e., errors in the general data
                  element headers, general data element values, and standard
                  charges, item/service, and coding headers). You should
                  therefore address each error displayed and run your MRF
                  through the Online Validator repeatedly until no more errors
                  are generated.
                </p>
                <p>
                  Additionally, the Online Validator tool runs in a web browser
                  and does not store, record, report, or share any information
                  with CMS related to your hospital&apos;s use of the tool. In
                  short, CMS does not track individual hospitals&apos; use of
                  the Online Validator. However, if your hospital becomes
                  subject to a compliance review, CMS may use the Validator to
                  assess whether your hospital meets the form and manner
                  requirements.
                </p>
                <p>
                  For a video demonstration of how to use the CMS Hospital Price
                  Transparency Online Validator tool, please visit{" "}
                  <a
                    target="_blank"
                    href="https://www.youtube.com/watch?v=e6b9kN9B11c"
                    rel="noreferrer"
                  >
                    https://www.youtube.com/watch?v=e6b9kN9B11c
                  </a>{" "}
                </p>
                <p>
                  For frequently asked questions and answers about the
                  validator, please refer to the{" "}
                  <a href="https://www.cms.gov/files/document/hospital-price-transparency-validator-faqs.pdf">
                    Validator FAQs
                  </a>
                  . Additional resources are available on the{" "}
                  <a href="https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency/resources">
                    Hospital Price Transparency Resources Page
                  </a>
                  . For other validator questions or concerns, you may email{" "}
                  <a href="mailto:PriceTransparencyHospitalCharges@cms.hhs.gov">
                    PriceTransparencyHospitalCharges@cms.hhs.gov
                  </a>
                </p>
                <br></br>
                <hr></hr>
              </div>
            </Grid>
          </Grid>
        </section>
      </div>
      <section className="grid-container usa-section">
        <ValidationResults
          filename={state.filename}
          valid={state.valid}
          errors={state.errors}
          warnings={state.warnings}
          alerts={state.alerts}
          maxErrors={MAX_ERRORS}
          locationHeader={locationHeader}
          readError={state.readError}
          loading={state.loading}
          didMount={state.didMount}
          startTimestamp={state.startTimestamp}
          endTimestamp={state.endTimestamp}
        />
      </section>
    </Layout>
  )
}

export default OnlineValidator
