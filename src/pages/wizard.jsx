import React from "react"
import Clipboard from "clipboard"
import { useEffect, useState } from "react"
import {
  Grid,
  Form,
  Radio,
  Button,
  Fieldset,
  Label,
  TextInput,
  FormGroup,
} from "@trussworks/react-uswds"
import Layout from "../layouts"

const Wizard = () => {
  const [state, setState] = useState({
    name: "",
    ein: "",
    fileType: "",
    npi: "",
  })

  useEffect(() => {
    new Clipboard("[data-clipboard-target]")
  }, [])

  return (
    <Layout>
      <div className="bg-base-lightest height-full">
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid desktop={{ col: 6 }} className="bg-white margin-x-auto">
              <h1>Format your file name</h1>
              <p>
                This tool helps you format your machine readable file as
                outlined in the{" "}
                <a
                  href="https://www.cms.gov/files/document/steps-machine-readable-file.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <em>
                    8 Steps to a Machine-Readable File of All Items and Service
                  </em>
                </a>
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
                  onChange={(e) => setState({ ...state, ein: e.target.value })}
                ></TextInput>
                <Label htmlFor="hospital-name">Name</Label>
                <TextInput
                  id="hospital-name"
                  name="hospital-name"
                  type="text"
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                ></TextInput>
                <FormGroup>
                  <Label htmlFor="hospital-npi">NPI (optional)</Label>
                  <TextInput
                    id="hospital-npi"
                    name="hospital-npi"
                    type="text"
                    onChange={(e) =>
                      setState({ ...state, npi: e.target.value })
                    }
                  />
                </FormGroup>
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
                  />
                  <Radio
                    id="input-json"
                    name="input-type"
                    label="JSON"
                    value="json"
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
                {state.ein || "<ein>"}_
                {state.name.replace(/\s/g, "-") || "<hospitalname>"}
                {state.npi ? `_${state.npi}` : ``}_standardcharges.
                {state.fileType || "<format>"}
              </pre>
            </Grid>
          </Grid>
        </section>
      </div>
    </Layout>
  )
}

export default Wizard
