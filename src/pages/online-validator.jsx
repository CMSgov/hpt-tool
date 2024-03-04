import React from "react"
import { useState } from "react"
import {
  Label,
  Grid,
  FormGroup,
  Fieldset,
  Radio,
} from "@trussworks/react-uswds"
import { FileInput } from "../components/FileInput"
import ValidationResults from "../components/ValidationResults"
import { validateCsv, validateJson, validateFilename } from "hpt-validator"
import Layout from "../layouts"

const MAX_ERRORS = 250
const STORAGE_PATH = "cms-hpt-validation-results"

const SCHEMA_VERSIONS = ["v1.1", "v2.0"]

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
      schemaVersion: "v1.1",
      filenameValid: true,
      fileUrl: "",
      pageUrl: "",
      loading: false,
      didMount: false,
      readError: false,
      errors: [],
      warnings: [],
    }
  )

  const validateFile = async (evt) => {
    const file = evt.target.files[0]
    const initialState = {
      filename: file.name,
      filenameValid: validateFilename(file.name),
      schemaVersion: state.schemaVersion,
    }
    setState({ ...state, ...initialState, readError: false, loading: true })
    const fileExt = getFileExtension(file.name)
    if (["csv", "json"].includes(fileExt)) {
      try {
        const { valid, errors } = await (fileExt === "csv"
          ? validateCsv(file, state.schemaVersion, { maxErrors: MAX_ERRORS })
          : validateJson(file, state.schemaVersion, { maxErrors: MAX_ERRORS }))
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
              gap
              desktop={{ col: 12 }}
              className="border-top border-base-lighter padding-top-4 desktop:border-0 desktop:padding-top-0"
            >
              <div className="usa-prose">
                <h1>Coming Sooooon</h1>
                <p>
                  Check back at this page in Spring 2024 for Validator 2.0. The
                  updated Validator will test Machine-readable files against the
                  new required CMS template layout and data specifications that
                  hospitals must conform to by July 1, 2024, as outlined in the{" "}
                  <a
                    href={
                      "https://www.federalregister.gov/documents/2023/11/22/2023-24293/medicare-program-hospital-outpatient-prospective-payment-and-ambulatory-surgical-center-payment"
                    }
                  >
                    CY 2024 OPPS/ASC Final Rule
                  </a>
                  .
                </p>
                <p>
                  Implementation guidance on the required CMS templates may be
                  found on the{" "}
                  <a
                    href="https://github.com/CMSgov/hospital-price-transparency"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hospital Price Transparency Data Dictionary GitHub
                    repository.
                  </a>
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

export default OnlineValidator
