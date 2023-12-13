import React from "react"
import Clipboard from "clipboard"
import { useEffect, useState } from "react"
import validator from 'validator'

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

const urlRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/)


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
      state.hospitals.some((hospital) => !!hospital.contactEmail) &&
      state.hospitals.some((hospital) =>
        !validator.isEmail(hospital.contactEmail)
      )
    ) {
      return {
        type: "error",
        message: "Not a valid point-of-contact email",
      }
    }

    if (
      state.hospitals.some((hospital) => !!hospital.mrfUrl) &&
      state.hospitals.some((hospital) =>
        !hospital.mrfUrl.match(urlRegex)
      )
    ) {
      return {
        type: "error",
        message: "Not a valid machine-readable file URL",
      }
    }

    if (
      state.hospitals.some((hospital) => !!hospital.sourcePageUrl) &&
      state.hospitals.some((hospital) =>
        !hospital.sourcePageUrl.match(urlRegex)
      )
    ) {
      return {
        type: "error",
        message: "Not a valid source page URL",
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

  const { type: alertTypes, message: alertMessages } = getAlertParams()

  return (
    <Layout>
      <div className="bg-base-lightest">
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid
              desktop={{ col: 6 }}
              className="bg-white display-flex flex-column flex-align-self-start margin-bottom-4"
            >
              <h2 className="margin-bottom-0">TXT File Generator</h2>
              <form action="" method="GET">
                {state.hospitals.map((hospital, index) => (
                  <FormGroup key={index}>
                    <Label htmlFor={`name-${index}`}>
                      Hospital Location Name
                    </Label>
                    <TextInput
                      id={`name-${index}`}
                      name={`name-${index}`}
                      placeholder="Hospital Location Name"
                      value={hospital.name}
                      onChange={(e) =>
                        updateHospital(index, { name: e.target.value })
                      }
                    />
                    <Label
                      className="margin-top-1"
                      htmlFor={`source-page-url-${index}`}
                    >
                      Source Page URL
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
                      Machine-Readable File URL
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
                      POC Name
                    </Label>
                    <TextInput
                      id={`contact-name-${index}`}
                      name={`contact-name-${index}`}
                      placeholder="POC Name"
                      value={hospital.contactName}
                      onChange={(e) =>
                        updateHospital(index, { contactName: e.target.value })
                      }
                    />
                    <Label
                      className="margin-top-1"
                      htmlFor={`contact-email-${index}`}
                    >
                      Contact Email
                    </Label>
                    <TextInput
                      id={`contact-email-${index}`}
                      name={`contact-email-${index}`}
                      placeholder="Contact Email"
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
                type={alertTypes}
                slim
                aria-live="polite"
                aria-atomic="true"
              >
                {alertMessages}
              </Alert>
              <hr className="width-full margin-top-3 margin-bottom-3" />
              <Grid className="generator-results-row" row>
                <h3 className="margin-y-0">Results</h3>
                <a
                  href={state.downloadUrl}
                  download="cms-hpt.txt"
                  className={
                    "usa-button margin-right-0" +
                    (alertTypes === "success" ? "" : " usa-button--disabled")
                  }
                  onClick={(e) => {
                    if (alertTypes !== "success") {
                      e.preventDefault()
                    }
                  }}
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
              <h2 className="margin-bottom-0">TXT File Instructions</h2>
              <h3 className="margin-bottom-0">
                <u>Background</u>
              </h3>
              <p>
                As finalized in the CY2024 OPPS/ASC Final Rule, beginning
                January 1, 2024, each hospital must ensure that the public
                website it selects to host its machine-readable file (MRF)
                establishes and maintains, in the form and manner specified by
                CMS:
                <ul>
                  <li>
                    A TXT file in the root folder that includes:
                    <ul>
                      <li>
                        {" "}
                        The hospital location name that corresponds to the MRF;
                      </li>
                      <li> The source page URL that hosts the MRF;</li>
                      <li> A direct link to the MRF (the MRF URL); and</li>
                      <li> Hospital point of contact information.</li>
                    </ul>
                  </li>
                  <li>
                    A link in the footer on its website, including but not
                    limited to the homepage, that is labeled “Price
                    Transparency” and links directly to the publicly available
                    webpage that hosts the link to the MRF.
                  </li>
                </ul>
                The purpose of these requirements is to facilitate automated
                access to hospital MRFs. Please refer to 45 CFR 180.50 (d)(6)
                and discussion at 88 FR 82111-82113.
              </p>

              <h3 className="margin-bottom-0">
                <u>TXT technical specifications</u>
              </h3>
              <p>
                {" "}
                Steps:
                <ol>
                  <li>
                    Generate a TXT file that includes the required information
                    indicated below.
                  </li>
                  <li>
                    If the MRF contains standard charge information for more
                    than one location, create an entry for each of the inpatient
                    locations and standalone emergency hospitals in the TXT
                    file.
                  </li>
                  <li>Name the file “cms-hpt.txt”.</li>
                  <li>
                    Place the TXT file on the root of the domain of the public
                    website your hospital has selected to host its
                    machine-readable file (MRF), without regard to page
                    structure. As an example, a hospital with the website
                    https://hospital.com would locate its file at
                    https://hospital.com/cms-hpt.txt
                  </li>
                </ol>
              </p>
              <h3 className="margin-bottom-0">
                <u>Required Information for the TXT File</u>
              </h3>
              <table className="usa-table">
                <thead>
                  <tr>
                    <th>Attribute: Value</th>
                    <th>Name</th>
                    <th>Definition</th>
                  </tr>
                </thead>
                <tr>
                  <td>location-name: [hospital location name]</td>
                  <td>Hospital Location Name</td>
                  <td>
                    Indicate the hospital location name that corresponds to the
                    standard charge information contained in the MRF.
                  </td>
                </tr>
                <tr>
                  <td>source-page-url: [URL]</td>
                  <td>Source page URL</td>
                  <td>
                    The source page URL is the URL of the public webpage you
                    have selected to host the MRF.
                  </td>
                </tr>
                <tr>
                  <td>mrf-url: [URL]</td>
                  <td>Machine-readable file URL</td>
                  <td>Indicate the URL of the MRF.</td>
                </tr>
                <tr>
                  <td>contact-name: [name]</td>
                  <td>POC Name</td>
                  <td>
                    Indicate the name of a point of contact (POC) that is
                    capable of answering technical questions about your
                    hospital’s MRF and the data contained in it.
                  </td>
                </tr>
                <tr>
                  <td>contact-email: [email]</td>
                  <td>Contact email</td>
                  <td>
                    Indicate the email address of the POC you have designated to
                    answer technical questions about your hospital’s MRF and the
                    data contained in it.
                  </td>
                </tr>
              </table>
              <h3 className="margin-bottom-0">
                <u>Example TXT File</u>
              </h3>
              <p id="generator-output">
                location-name: Test Hospital <br />
                source-page-url: https://example.com <br />
                mrf-url: https://example.com/HPT <br />
                contact-name: Jon Snow <br />
                contact-email: jsnow@example.com <br />
                <br />
                location-name: Test Hospital 2 <br />
                source-page-url: https://example2.com <br />
                mrf-url: https://example2.com/HPT <br />
                contact-name: Jane Doe <br />
                contact-email: jdoe@example2.com <br />
              </p>
            </Grid>
          </Grid>
        </section>
      </div>
    </Layout>
  )
}

export default TxtGenerator
