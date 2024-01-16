import React from "react"
import Clipboard from "clipboard"
import { useEffect, useState } from "react"
import validator from "validator"

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

const urlRegex = new RegExp(
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
)

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
      state.hospitals.some(
        (hospital) => !validator.isEmail(hospital.contactEmail)
      )
    ) {
      return {
        type: "error",
        message: "Not a valid point-of-contact email",
      }
    }

    if (
      state.hospitals.some((hospital) => !!hospital.mrfUrl) &&
      state.hospitals.some((hospital) => !hospital.mrfUrl.match(urlRegex))
    ) {
      return {
        type: "error",
        message: "Not a valid machine-readable file URL",
      }
    }

    if (
      state.hospitals.some((hospital) => !!hospital.sourcePageUrl) &&
      state.hospitals.some(
        (hospital) => !hospital.sourcePageUrl.match(urlRegex)
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
                As finalized in the <a href={"https://www.federalregister.gov/documents/2023/11/22/2023-24293/medicare-program-hospital-outpatient-prospective-payment-and-ambulatory-surgical-center-payment"}>CY2024 OPPS/ASC Final Rule</a>, beginning
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
                access to hospital MRFs. Please refer to <a href={"https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-E/part-180#p-180.50(d)(6)"}>45 CFR 180.50 (d)(6)</a>
                and discussion at 88 FR <a href={"https://www.federalregister.gov/documents/2023/11/22/2023-24293/medicare-program-hospital-outpatient-prospective-payment-and-ambulatory-surgical-center-payment#p-5069"}>82111</a>-<a href={"https://www.federalregister.gov/documents/2023/11/22/2023-24293/medicare-program-hospital-outpatient-prospective-payment-and-ambulatory-surgical-center-payment#p-5088"}>82113</a>.
              </p>

              <h3 className="margin-bottom-0">
                <u>TXT technical specifications</u>
              </h3>
              <p>
                {" "}
                Steps:
                <ol>
                  <li>
                    Generate a TXT file based on the schema or via the TXT File
                    Generator that includes the required information indicated
                    below.
                  </li>
                  <li>
                    If the MRF contains standard charge information for more
                    than one location, create a separate entry for each of the
                    inpatient locations and standalone emergency hospitals in
                    the TXT file (i.e., repeat the five attributes required in
                    the TXT file with other location names).
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
                <u>Requirements for the TXT File</u>
              </h3>
              <table className="usa-table">
                <thead>
                  <tr>
                    <th>Required Information</th>
                    <th>Attribute: Value</th>
                    <th>Instruction</th>
                  </tr>
                </thead>
                <tr>
                  <td>Hospital Location Name</td>
                  <td>location-name: [hospital location name]</td>
                  <td>
                    Indicate the hospital location name that corresponds to the
                    standard charge information contained in the MRF.
                  </td>
                </tr>
                <tr>
                  <td>Source page URL</td>
                  <td>source-page-url: [URL]</td>
                  <td>
                    Indicates the source page URL is the URL of the public
                    webpage you have selected to host the MRF (i.e., the webpage
                    from which the MRF can be directly downloaded).
                  </td>
                </tr>
                <tr>
                  <td>Machine-readable file URL</td>
                  <td>mrf-url: [URL]</td>
                  <td>Indicate the URL of the MRF.</td>
                </tr>
                <tr>
                  <td>POC Name</td>
                  <td>contact-name: [name]</td>
                  <td>
                    Indicate the name of a point of contact (POC) that is
                    capable of answering technical questions about your
                    hospital’s MRF and the data contained in it.
                  </td>
                </tr>
                <tr>
                  <td>Contact email</td>
                  <td>contact-email: [email]</td>
                  <td>
                    Indicate the email address of the POC you have designated to
                    answer technical questions about your hospital’s MRF and the
                    data contained in it.
                  </td>
                </tr>
              </table>
              <h3 className="margin-bottom-0">
                <u>Example #1 TXT File</u>
              </h3>
              <p>
                This TXT file example demonstrates a scenario in which a
                hospital has two locations (“Example Hospital East” and “Example
                Hospital West”), each with its own set of standard charges.
                Under the regulation, the hospital must maintain a separate MRF
                for each location. A single TXT file, hosted in the root folder
                of the hospital’s website, would include information for both
                locations and their corresponding MRFs as separate entries.
              </p>
              <p>
                In this example, the hospital’s website hosts the directly
                downloadable links to the MRFs on the same source page, so the
                source page URL is the same for both entries. However, the MRF
                URL for each of the entries is unique.{" "}
              </p>
              <p>
                Finally, in this example, the POC for the first MRF is a person
                (Jon Snow) that can be reached at jsnow@example.com.
              </p>
              <p id="generator-output">
                location-name: Example Hospital East
                <br />
                source-page-url: https://example.com/price-transparency
                <br />
                mrf-url:
                https://example.com/price-transparency/123456789_Example-Hospital-East_standardcharges.csv
                <br />
                contact-name: Jon Snow <br />
                contact-email: jsnow@example.com <br />
                <br />
                location-name: Example Hospital West
                <br />
                source-page-url: https://example.com/price-transparency <br />
                mrf-url:
                https://example.com/price-transparency/987654321_Example-Hospital-West_standardcharges.json
                <br />
                contact-name: Jane Doe <br />
                contact-email: jdoe@example2.com <br />
              </p>
              <h3 className="margin-bottom-0">
                <u>Example #2 TXT File</u>
              </h3>
              <p>
                This TXT file example demonstrates a scenario in which a
                hospital has two locations (“Sample Hospital” and “Sample
                Standalone Emergency Department”) that share the same set of
                standard charges. Under the regulation, it is permissible for
                the two locations to share a single MRF. A single TXT file would
                include information for both locations as separate entries and
                repeat the shared source page URL and MRF URL.
              </p>
              <p>
                In this example, the hospital’s “vendor” hosts the single MRF
                for the hospital on the vendor’s website. The TXT file should
                indicate the vendor’s source page URL and the MRF URL
                established by the vendor for the MRF.
              </p>
              <p>
                Finally, in this example, the POC for the file is a team of
                people (MRF Department) that share an email address
                (MRFteam@sample.com).
              </p>
              <p id="generator-output">
                location-name: Sample Hospital <br />
                source-page-url:
                https://vendor.com/hospital-price-transparency-files/links/samplehospital.aspx
                <br />
                mrf-url:
                https://vendor.com/hospital-price-transparency-files/links
                /101010101_Sample_standardcharges.csv
                <br />
                contact-name: MRF Department
                <br />
                contact-email: MRFteam@sample.com
                <br />
                <br />
                location-name: Sample Standalone Emergency Department
                <br />
                source-page-url:
                https://vendor.com/hospital-price-transparency-files/links/samplehospital.aspx
                <br />
                mrf-url:
                https://vendor.com/hospital-price-transparency-files/links
                /101010101_Sample_standardcharges.csv
                <br />
                contact-name: MRF Department
                <br />
                contact-email: MRFteam@sample.com
                <br />
              </p>
            </Grid>
          </Grid>
        </section>
      </div>
    </Layout>
  )
}

export default TxtGenerator
