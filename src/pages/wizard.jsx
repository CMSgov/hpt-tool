import React from "react"
import Clipboard from "clipboard"
import { useEffect, useState } from "react"
import {
  Alert,
  Grid,
  Form,
  Radio,
  Button,
  Fieldset,
  Label,
  TextInput,
  FormGroup,
} from "@trussworks/react-uswds"
import { validateFilename } from "@cmsgov/hpt-validator"
import Layout from "../layouts"

const STORAGE_PATH = "cms-hpt-file-name-wizard"

const EIN_REGEX = /^\d{2}-?\d{7}$/
const NPI_REGEX = /^\d{10}$/

const Wizard = () => {
  const [state, setState] = useState(
    JSON.parse(window.sessionStorage.getItem(STORAGE_PATH)) || {
      name: "",
      ein: "",
      fileType: "",
      showNpi: null,
      npi: "",
    }
  )

  useEffect(() => {
    new Clipboard("[data-clipboard-target]")
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_PATH, JSON.stringify(state))
  }, [state.name, state.ein, state.fileType, state.npi])

  const getFilename = () =>
    `${state.ein.replace(/-/g, "") || "<ein>"}${
      state.showNpi && state.npi ? `-${state.npi}` : ``
    }_${
      state.name.replace(/\s/g, "-").toLowerCase() || "<hospitalname>"
    }_standardcharges.${state.fileType || "<format>"}`

  const getAlertParams = () => {
    if (!(state.name.trim() && state.ein.trim() && state.fileType)) {
      return {
        type: "info",
        message: "Enter required parameters to validate file name",
      }
    }
    const isValid = validateFilename(getFilename())
    if (isValid) {
      return { type: "success", message: "File name is valid" }
    } else {
      if (!state.ein.match(EIN_REGEX)) {
        return {
          type: "error",
          message: `EIN must be 9 digits in the format XXXXXXXXX`,
        }
      } else if (state.showNpi && state.npi && !state.npi.match(NPI_REGEX)) {
        return {
          type: "error",
          message: `NPI must be 10 digits with no dashes`,
        }
      } else {
        // Should never happen - given valid input, we should always produce
        // a valid filename
        return { type: "error", message: `File name is invalid` }
      }
    }
  }

  const { type: alertType, message: alertMessage } = getAlertParams()

  return (
    <Layout>
      <div className="bg-base-lightest height-full">
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid desktop={{ col: 6 }} className="bg-white margin-x-auto">
              <h1>Format your file name</h1>
              <p>
                This tool helps you name your machine readable file in the
                CMS-specified naming convention as required at 45 CFR
                §180.50(d)(5).
              </p>
              <p>
                The output of the wizard automatically updates at the bottom of
                the form.
              </p>
              <Form className="margin-bottom-4">
                <Label htmlFor="hospital-ein">EIN</Label>
                <TextInput
                  id="hospital-ein"
                  name="hospital-ein"
                  type="text"
                  value={state.ein}
                  onChange={(e) => setState({ ...state, ein: e.target.value })}
                ></TextInput>
                <Label htmlFor="hospital-name">Hospital name</Label>
                <span className="usa-hint">
                  Enter the hospital&apos;s legal name
                </span>
                <TextInput
                  id="hospital-name"
                  name="hospital-name"
                  type="text"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                ></TextInput>
                <Fieldset
                  legend="Does your hospital have more than one location with distinct negotiated rates?"
                  className="usa-form-group"
                  onChange={(e) => {
                    setState({ ...state, showNpi: e.target.value === "yes" })
                  }}
                >
                  <Radio
                    id="npi-yes"
                    name="show-npi"
                    label="Yes"
                    value="yes"
                    defaultChecked={state.showNpi}
                  />
                  <Radio
                    id="npi-no"
                    name="show-npi"
                    label="No"
                    value="no"
                    defaultChecked={state.showNpi === false}
                  />
                </Fieldset>
                <div role="region" aria-live="polite">
                  {state.showNpi && (
                    <FormGroup>
                      <Label htmlFor="hospital-npi">NPI (optional)</Label>
                      <span className="usa-hint">
                        Enter the NPI for a hospital location
                      </span>
                      <TextInput
                        id="hospital-npi"
                        name="hospital-npi"
                        type="text"
                        value={state.npi}
                        onChange={(e) =>
                          setState({ ...state, npi: e.target.value })
                        }
                      />
                    </FormGroup>
                  )}
                </div>
                <Fieldset
                  legend="File type"
                  className="usa-form-group"
                  onChange={(e) =>
                    setState({ ...state, fileType: e.target.value })
                  }
                >
                  <Radio
                    id="input-csv"
                    name="input-type"
                    label="CSV"
                    value="csv"
                    defaultChecked={state.fileType === "csv"}
                  />
                  <Radio
                    id="input-json"
                    name="input-type"
                    label="JSON"
                    value="json"
                    defaultChecked={state.fileType === "json"}
                  />
                </Fieldset>
              </Form>
              <Button data-clipboard-target="#filename-wizard-output">
                Copy to clipboard
              </Button>
              <pre
                id="filename-wizard-output"
                className="display-block bg-base-lighter padding-x-1 padding-y-105"
              >
                {getFilename()}
              </pre>
              <Alert
                type={alertType}
                slim
                aria-live="polite"
                aria-atomic="true"
                className="margin-bottom-2"
              >
                {alertMessage}
              </Alert>
            </Grid>
          </Grid>
        </section>
      </div>
    </Layout>
  )
}

export default Wizard
