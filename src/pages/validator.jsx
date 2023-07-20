import React from "react"
import { useState } from "react"
import { Label, Grid, FormGroup } from "@trussworks/react-uswds"
import { FileInput } from "../components/FileInput"
import ValidationResults from "../components/ValidationResults"
import { validateCsv, validateJson, validateFilename } from "hpt-validator"
import Layout from "../layouts"

const STORAGE_PATH = "cms-hpt-validation-results"

const getFileExtension = (filename) => {
  const splitFilename = filename.toLowerCase().split(".")
  if (splitFilename.length < 1) return null
  return splitFilename.slice(-1)[0]
}

const Validator = () => {
  const [state, setState] = useState(
    JSON.parse(window.sessionStorage.getItem(STORAGE_PATH)) || {
      valid: true,
      filename: "",
      filenameValid: true,
      fileUrl: "",
      pageUrl: "",
      loading: false,
      didMount: false,
      errors: [],
      warnings: [],
    }
  )

  const validateFile = async (evt) => {
    const file = evt.target.files[0]
    const initialState = {
      filename: file.name,
      filenameValid: validateFilename(file.name),
    }
    setState({ ...state, ...initialState, loading: true })
    const fileExt = getFileExtension(file.name)
    if (["csv", "json"].includes(fileExt)) {
      const { valid, errors } = await (fileExt === "csv"
        ? validateCsv(file)
        : validateJson(file))
      const stateObj = {
        ...initialState,
        valid,
        errors: errors.filter(({ warning }) => !warning),
        warnings: errors.filter(({ warning }) => warning),
        loading: false,
        didMount: true,
      }
      setState(stateObj)
      window.sessionStorage.setItem(STORAGE_PATH, JSON.stringify(stateObj))
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
                    Files must follow the voluntary sample format (.json or
                    .csv)
                  </Label>
                  <FileInput
                    id="file-input"
                    name="file-input"
                    accept=".csv,.json,text/csv,application/json"
                    onChange={validateFile}
                  />
                </FormGroup>
              </form>
              {state.loading && (
                <p aria-live="polite" aria-atomic="true" className="text-bold">
                  Loading file {state.filename}...
                </p>
              )}
              <p className="text-italic">
                Having trouble formatting your file name?
              </p>
              <p className="text-italic text-bold">
                <a href={`${import.meta.env.BASE_URL}filename-wizard/`}>
                  Leverage the file name wizard!
                </a>
              </p>
            </Grid>
            <Grid
              gap
              desktop={{ col: 6 }}
              className="border-top border-base-lighter padding-top-4 desktop:border-0 desktop:padding-top-0"
            >
              <div className="usa-prose">
                <h1>How this tool helps</h1>
                <p>
                  This validation tool helps identify basic issues in Hospital
                  Price Transparency machine readable files: it checks whether
                  the file matches the{" "}
                  <a href="https://www.cms.gov/hospital-price-transparency/resources">
                    voluntary sample format
                  </a>{" "}
                  published by CMS and will identify basic issues and errors for
                  invalid data.
                </p>
                <p>
                  A file that passes these basic validation checks{" "}
                  <strong>
                    does not mean that a file is guaranteed to be fully in
                    compliance
                  </strong>
                  .
                </p>
                <p>
                  This tool runs in the web browser, and uploading files here
                  does not share these files with CMS. This validator tool is
                  intended to be used with machine readable files that use the{" "}
                  <a href="https://www.cms.gov/hospital-price-transparency/resources">
                    voluntary sample format
                  </a>{" "}
                  published by CMS and will not work for files that do not use
                  this formatting.
                </p>
                <br></br>
                <hr></hr>
                <h2>Contact</h2>
                <p>
                  Have you run into an issue or have a question about this tool?
                  Please reach out to us at{" "}
                  <a href="mailto:PriceTransparencyHospitalCharges@cms.hhs.gov">
                    PriceTransparencyHospitalCharges@cms.hhs.gov
                  </a>
                  .
                </p>
              </div>
            </Grid>
          </Grid>
        </section>
      </div>
      <section className="grid-container usa-section">
        <ValidationResults
          filename={state.filename}
          filenameValid={state.filenameValid}
          valid={state.valid}
          errors={state.errors}
          warnings={state.warnings}
          locationHeader={locationHeader}
          loading={state.loading}
          didMount={state.didMount}
        />
      </section>
    </Layout>
  )
}

export default Validator
