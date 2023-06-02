import React from "react"
import PropTypes from "prop-types"
import { Grid, Alert, Table } from "@trussworks/react-uswds"

const ValidationResults = ({
  filename,
  filenameValid,
  valid,
  errors,
  warnings,
  locationHeader,
}) => (
  <Grid row gap>
    <div className="usa-prose width-full">
      <h2>Validation results</h2>
      <h3>Filename</h3>
      <Alert
        type={filenameValid ? `success` : `error`}
        aria-live="polite"
        aria-atomic="true"
      >
        {filenameValid ? (
          <>
            <span className="text-bold">Filename valid</span>:{" "}
            <span className="text-underline">{filename}</span>
          </>
        ) : (
          <>
            <span className="text-bold">Filename invalid</span>:{" "}
            <span className="text-underline">{filename}</span>
            <br />
            <span>
              Must match format:
              &lt;ein&gt;_&lt;hospitalname&gt;_standardcharges.[json|csv].{" "}
              <a href={`${import.meta.env.BASE_URL}filename-wizard`}>
                Click here to use the file name wizard.
              </a>
            </span>
          </>
        )}
      </Alert>
      <h3>Errors</h3>
      <Alert
        type={valid ? `success` : `error`}
        aria-live="polite"
        aria-atomic="true"
      >
        {valid ? (
          <>
            <span className="text-bold">No errors found in file</span>:{" "}
            <span className="text-underline">{filename}</span>
          </>
        ) : (
          <>
            <span className="text-bold">
              {errors.length === 1 ? "1 error" : `${errors.length} errors`}{" "}
              found in file
            </span>
            : <span className="text-underline">{filename}</span>
          </>
        )}
      </Alert>
      {errors.length > 0 && (
        <>
          <Table className="width-full" bordered striped>
            <thead>
              <tr>
                <th scope="col">{locationHeader}</th>
                <th scope="col">Error description</th>
              </tr>
            </thead>
            <tbody>
              {errors.map(({ path, message }, index) => (
                <tr key={index}>
                  <td>{path}</td>
                  <td>{message}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p>
            For further information about resolving these issues, please refer
            to the document:{" "}
            <a href="https://www.cms.gov/files/document/steps-machine-readable-file.pdf">
              8 Steps to a Machine-Readable File
            </a>
          </p>
        </>
      )}
      <h3>Warnings</h3>
      <Alert type={warnings.length === 0 ? `success` : `warning`}>
        {warnings.length === 0 ? (
          <>
            <span className="text-bold">No warnings found in file</span>:{" "}
            <span className="text-underline">{filename}</span>
          </>
        ) : (
          <>
            <span className="text-bold">
              {warnings.length === 1
                ? "1 warning"
                : `${warnings.length} warnings`}{" "}
              for file
            </span>
            : <span className="text-underline">{filename}</span>
            <br />
            <span>
              These items are not required changes, but addressing them could
              save time in the future.
            </span>
          </>
        )}
      </Alert>
      {warnings.length > 0 && (
        <Table className="width-full" bordered striped>
          <thead>
            <tr>
              <th scope="col">{locationHeader}</th>
              <th scope="col">Error description</th>
            </tr>
          </thead>
          <tbody>
            {warnings.map(({ path, message }, index) => (
              <tr key={index}>
                <td>{path}</td>
                <td>{message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  </Grid>
)

ValidationResults.propTypes = {
  filename: PropTypes.string,
  filenameValid: PropTypes.bool,
  valid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
  warnings: PropTypes.arrayOf(PropTypes.object),
  locationHeader: PropTypes.string,
}

export default ValidationResults
