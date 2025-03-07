import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { Grid, Alert, Table } from "@trussworks/react-uswds"
/*
const createCsvString = (errors, warnings) =>
  "location,message,type\n" +
  errors
    .map(
      ({ path, message }) => `"${path}","${message.replace(/"/gi, "")}","error"`
    )

    .join("\n") +
  "\n" +
  warnings
    .map(
      ({ path, message }) =>
        `"${path}","${message.replace(/"/gi, "")}","warning"`
    )
    .join("\n")
*/
const ValidationResults = ({
  filename,
  valid,
  errors,
  warnings,
  maxErrors,
  locationHeader,
  loading,
  readError,
  didMount,
  startTimestamp,
  endTimestamp,
}) => {
  const resultsHeaderRef = useRef(null)
  /*
  const blob = new Blob([createCsvString(errors || [], warnings || [])], {
    type: "text/csv;charset=utf-8",
  })
  const downloadUrl = window.URL.createObjectURL(blob)
*/
  const atMaxErrors = errors.length >= maxErrors
  const atMaxWarnings = warnings.length >= maxErrors

  useEffect(() => {
    if (didMount && !loading && resultsHeaderRef.current) {
      resultsHeaderRef.current.scrollIntoView({
        behavior: "smooth",
        align: "top",
      })
      resultsHeaderRef.current.focus()
    }
  }, [didMount, loading])

  return (
    <Grid row gap>
      <div className="usa-prose width-full">
        <h2 id="validation-results-header" tabIndex="-1" ref={resultsHeaderRef}>
          Validation results
        </h2>

        <div id="validation-results-body">
          {loading && (
            <p className="font-sans-l loading-skeleton">
              Your file is processing. Some larger files may take a minute or
              two. Results will appear here once completed. If you are
              experiencing issues, please let us know at :{" "}
              <a href="mailto:PriceTransparencyHospitalCharges@cms.hhs.gov">
                PriceTransparencyHospitalCharges@cms.hhs.gov
              </a>
              .
            </p>
          )}
          {readError && (
            <Alert type={`error`} aria-live="polite" aria-atomic="true">
              <span>
                There&apos;s something preventing your file from being machine
                readable. Please check your file to make sure it is readable and
                then try again.
              </span>
            </Alert>
          )}
          {!loading && !readError && filename && (
            <>
              {/* <a
                className="usa-button"
                href={downloadUrl}
                download="cms-hpt-validator-results.csv"
              >
                Download results as spreadsheet
              </a> */}
              <h3>Errors</h3>
              <Alert
                type={valid ? `success` : `error`}
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-bold">
                  Validator run started at {startTimestamp}
                </span>
                <br />
                <span className="text-bold">
                  Validator run completed at {endTimestamp}
                </span>
                <br />
                {valid ? (
                  <>
                    <span className="text-bold">No errors found in file</span>:{" "}
                    <span className="text-underline">{filename}</span>
                  </>
                ) : (
                  <>
                    <span className="text-bold">
                      There
                      {errors.length === 1
                        ? " is 1 error"
                        : ` are ${atMaxErrors ? "at least " : ""}${
                            errors.length
                          } errors`}{" "}
                      found in the file
                    </span>
                    : <span className="text-underline">{filename}</span>
                    <br />
                    {atMaxErrors && (
                      <span>
                        The first {maxErrors} errors are shown below. See the{" "}
                        <a href="https://github.com/CMSgov/hospital-price-transparency/">
                          Hospital Price Transparency Data Dictionary GitHub
                          Repository
                        </a>{" "}
                        for detailed technical specifications to understand and
                        address these errors.
                      </span>
                    )}
                    {!atMaxErrors && (
                      <span>
                        See the{" "}
                        <a href="https://github.com/CMSgov/hospital-price-transparency/">
                          Hospital Price Transparency Data Dictionary GitHub
                          Repository
                        </a>{" "}
                        for detailed technical specifications to understand and
                        address these errors.
                      </span>
                    )}
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
                      {errors
                        .slice(0, maxErrors)
                        .map(({ path, message }, index) => (
                          <tr key={index}>
                            <td>{path}</td>
                            <td>{message}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Grid>
  )
}

ValidationResults.propTypes = {
  filename: PropTypes.string,
  valid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
  warnings: PropTypes.arrayOf(PropTypes.object),
  maxErrors: PropTypes.number,
  locationHeader: PropTypes.string,
  loading: PropTypes.bool,
  readError: PropTypes.bool,
  didMount: PropTypes.bool,
  timestamp: PropTypes.string,
}

export default ValidationResults
