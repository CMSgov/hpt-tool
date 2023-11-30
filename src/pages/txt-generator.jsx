import React from "react"
import Clipboard from "clipboard"
import { useEffect, useState } from "react"
import {
  Alert,
  Grid,
  Button,
  Label,
  TextInput,
  FormGroup,
} from "@trussworks/react-uswds"
import Layout from "../layouts"

const txtFileOutput = (hospitals) =>
  hospitals
    .map(
      ({
        name,
        sourcePageUrl,
        mrfUrl,
        contactName,
        contactEmail,
      }) => `location-name: ${name}
source-page-url: ${sourcePageUrl}
mrf-url: ${mrfUrl}
contact-name: ${contactName}
contact-email: ${contactEmail}`
    )
    .join("\n\n")

const removeIndex = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
]

const TxtGenerator = () => {
  const baseHospital = {
    name: "",
    sourcePageUrl: "",
    mrfUrl: "",
    contactName: "",
    contactEmail: "",
  }
  const [state, setState] = useState({
    hospitals: [{ ...baseHospital }],
    downloadUrl: "",
  })

  useEffect(() => {
    new Clipboard("[data-clipboard-target]")
  }, [])

  useEffect(() => {
    let blob = new Blob([txtFileOutput(state.hospitals)], {
      type: "text/plain;charset=utf8",
    })
    setState({
      ...state,
      downloadUrl: window.URL.createObjectURL(blob),
    })
  }, [state.hospitals])

  const updateHospital = (index, updatedHospital) => {
    const hospitals = [...state.hospitals]
    hospitals[index] = { ...hospitals[index], ...updatedHospital }
    setState({ ...state, hospitals })
  }

  const getAlertParams = () => {
    if (
      state.hospitals.length === 1 &&
      Object.values(state.hospitals[0]).every((v) => !v.trim())
    ) {
      return {
        type: "info",
        message: "Fill in hospital fields to generate file",
      }
    }
    if (
      state.hospitals.every((hospital) =>
        Object.values(hospital).every((v) => v.trim())
      )
    ) {
      return {
        type: "success",
        message: "Generated file is valid",
      }
    } else {
      return {
        type: "error",
        message: "All fields must be filled in for each hospital",
      }
    }
  }

  const { type: alertType, message: alertMessage } = getAlertParams()

  return (
    <Layout>
      <div className="bg-base-lightest">
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid
              desktop={{ col: 6 }}
              className="bg-white display-flex flex-column flex-align-self-start margin-bottom-4"
            >
              <h2 className="margin-bottom-0">TXT Generator</h2>
              <form action="" method="GET">
                {state.hospitals.map((hospital, index) => (
                  <FormGroup key={index}>
                    <Label htmlFor={`name-${index}`}>Hospital name</Label>
                    <TextInput
                      id={`name-${index}`}
                      name={`name-${index}`}
                      placeholder="Hospital name"
                      value={hospital.name}
                      onChange={(e) =>
                        updateHospital(index, { name: e.target.value })
                      }
                    />
                    <Label
                      className="margin-top-1"
                      htmlFor={`source-page-url-${index}`}
                    >
                      Source page URL
                    </Label>
                    <TextInput
                      id={`source-page-url-${index}`}
                      name={`source-page-url-${index}`}
                      placeholder="Source page URL"
                      value={hospital.sourcePageUrl}
                      onChange={(e) =>
                        updateHospital(index, { sourcePageUrl: e.target.value })
                      }
                    />
                    <Label
                      className="margin-top-1"
                      htmlFor={`mrf-url-${index}`}
                    >
                      Machine-readable file URL
                    </Label>
                    <TextInput
                      id={`mrf-url-${index}`}
                      name={`mrf-url-${index}`}
                      placeholder="MRF URL"
                      value={hospital.mrfUrl}
                      onChange={(e) =>
                        updateHospital(index, { mrfUrl: e.target.value })
                      }
                    />
                    <Label
                      className="margin-top-1"
                      htmlFor={`contact-name-${index}`}
                    >
                      Contact name
                    </Label>
                    <TextInput
                      id={`contact-name-${index}`}
                      name={`contact-name-${index}`}
                      placeholder="Contact name"
                      value={hospital.contactName}
                      onChange={(e) =>
                        updateHospital(index, { contactName: e.target.value })
                      }
                    />
                    <Label
                      className="margin-top-1"
                      htmlFor={`contact-email-${index}`}
                    >
                      Contact email
                    </Label>
                    <TextInput
                      id={`contact-email-${index}`}
                      name={`contact-email-${index}`}
                      placeholder="Contact email"
                      value={hospital.contactEmail}
                      onChange={(e) =>
                        updateHospital(index, { contactEmail: e.target.value })
                      }
                    />
                    {state.hospitals.length > 1 ? (
                      <Button
                        type="button"
                        className="display-flex margin-top-2"
                        variation="solid"
                        onClick={() =>
                          setState({
                            ...state,
                            hospitals: removeIndex(state.hospitals, index),
                          })
                        }
                      >
                        Delete
                      </Button>
                    ) : (
                      ``
                    )}
                  </FormGroup>
                ))}
              </form>
              <Button
                type="button"
                className="margin-top-2 flex-align-self-end margin-right-0"
                onClick={() =>
                  setState({
                    ...state,
                    hospitals: [...state.hospitals, baseHospital],
                  })
                }
              >
                Add
              </Button>
              <Alert
                type={alertType}
                slim
                aria-live="polite"
                aria-atomic="true"
              >
                {alertMessage}
              </Alert>
              <hr className="width-full margin-top-3 margin-bottom-3" />
              <Grid className="generator-results-row" row>
                <h3 className="margin-y-0">Results</h3>
                <a
                  href={state.downloadUrl}
                  download="cms-hpt.txt"
                  className="usa-button margin-right-0"
                >
                  Download
                </a>
              </Grid>

              <pre id="generator-output">{txtFileOutput(state.hospitals)}</pre>
            </Grid>
            <Grid
              gap
              desktop={{ col: 6 }}
              className="border-top border-base-lighter padding-top-4 desktop:border-0 desktop:padding-top-0"
            >
              <div className="usa-prose">
                <h1>How this tool helps</h1>
                <p>
                  This tool generates <code>cms-hpt.txt</code> files that can be
                  placed at the root of a hospital&apos;s domain including
                  information to improve discoverability of machine readable
                  files.
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
    </Layout>
  )
}

export default TxtGenerator
