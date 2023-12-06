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
import { validateCsv, validateJson, validateFilename } from "hpt-validator"
import Layout from "../layouts"

const MAX_ERRORS = 250
const STORAGE_PATH = "cms-hpt-validation-results"

// const SCHEMA_VERSIONS = ["v1.1", "v2.0"]

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
                  This validation tool checks whether the Hospital Price
                  Transparency machine-readable file matches CMS&apos; Version
                  1.1 of the{" "}
                  <a href="https://www.cms.gov/hospital-price-transparency/resources">
                    Version 1.1 of the Voluntary Sample Format
                  </a>{" "}
                  and Data Dictionary and will identify basic issues and errors
                  when the uploaded file&apos;s structure and encoded data do
                  not match Version 1.1 specifications.
                </p>
                <p>
                  <strong>
                    Note that this validator does not test against the new
                    required CMS template layout and data specifications that
                    hospitals must conform to by July 1, 2024,
                  </strong>{" "}
                  as outlined in the CY 2024 OPPS/ASC Final Rule. Implementation
                  guidance on the required CMS templates may be found on the{" "}
                  <a href="https://github.com/CMSgov/hospital-price-transparency">
                    Hospital Price Transparency Data Dictionary GitHub
                    repository.
                  </a>{" "}
                  Validator 2.0 that aligns with the required CMS Templates will
                  be available in Spring of 2024.
                </p>
                <p>
                  This tool runs in the web browser and does not store any data.
                  Uploading files here does not share these files with CMS. This
                  validator tool is intended to be used with machine readable
                  files that use the Version 1.1{" "}
                  <a href="https://www.cms.gov/hospital-price-transparency/resources">
                    Voluntary Sample Format
                  </a>{" "}
                  published by CMS and will not work for files that do not
                  follow this formatting layout.
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
          filenameValid={state.filenameValid}
          valid={state.valid}
          errors={state.errors}
          warnings={state.warnings}
          maxErrors={MAX_ERRORS}
          locationHeader={locationHeader}
          readError={state.readError}
          loading={state.loading}
          didMount={state.didMount}
        />
      </section>
    </Layout>
  )
}

export default Validator
