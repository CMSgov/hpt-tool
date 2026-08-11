import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { Grid, Alert, Table } from "@trussworks/react-uswds"
import { getFileExtension } from "../utils"

const createDownloadableResult = (
  filename,
  schemaVersion,
  startTime,
  endTime,
  locationHeader,
  errors,
  alerts
) => {
  const contents = [
    `Validating file: ${filename}`,
    `Using data dictionary version ${schemaVersion}`,
    `Validator run started at ${startTime}`,
    `Validator run completed at ${endTime}`,
  ]
  if (errors.length === 0) {
    contents.push("No errors found")
  } else {
    contents.push(
      `${locationHeader},Error description`,
      ...errors.map(
        ({ path, message }) => `"${path}","${message.replace(/"/gi, "")}"`
      )
    )
  }
  if (alerts.length === 0) {
    contents.push("No alerts found")
  } else {
    contents.push(
      `${locationHeader},Alert description`,
      ...alerts.map(
        ({ path, message }) => `"${path}","${message.replace(/"/gi, "")}"`
      )
    )
  }
  return contents.join("\n")
}

const getResultDownloadName = (filename) => {
  // trim off the extension and append .csv
  const shortName = filename.slice(0, filename.lastIndexOf("."))
  return `cms-hpt-validator-results-${shortName}.csv`
}

const getDataDictionaryUrl = (filename, schemaVersion) => {
  const extension = getFileExtension(filename)
  if (extension === "csv") {
    if (schemaVersion === "v2.1") {
      return "https://github.com/CMSgov/hospital-price-transparency/blob/master/archive/documentation/CSV/v2.1_README.md"
    } else if (schemaVersion === "v2.2") {
      return "https://github.com/CMSgov/hospital-price-transparency/blob/master/archive/documentation/CSV/v2.2_README.md"
    } else if (schemaVersion === "v3.0") {
      return "https://github.com/CMSgov/hospital-price-transparency/tree/master/documentation/CSV"
    } else {
      return "https://github.com/CMSgov/hospital-price-transparency/tree/master/documentation/CSV"
    }
  } else if (extension === "json") {
    if (schemaVersion === "v2.1") {
      return "https://github.com/CMSgov/hospital-price-transparency/blob/master/archive/documentation/JSON/v2.1_README.md"
    } else if (schemaVersion === "v2.2") {
      return "https://github.com/CMSgov/hospital-price-transparency/blob/master/archive/documentation/JSON/v2.2_README.md"
    } else if (schemaVersion === "v3.0") {
      return "https://github.com/CMSgov/hospital-price-transparency/tree/master/documentation/JSON"
    } else {
      return "https://github.com/CMSgov/hospital-price-transparency/tree/master/documentation/JSON"
    }
  } else {
    return "https://github.com/CMSgov/hospital-price-transparency/"
  }
}

const ValidationResults = ({
  filename,
  schemaVersion,
  valid,
  errors,
  warnings,
  alerts,
  maxErrors,
  locationHeader,
  loading,
  readError,
  didMount,
  startTimestamp,
  endTimestamp,
  schemaLabel,
  schemaDateLabel,
}) => {
  const resultsHeaderRef = useRef(null)

  const blob = new Blob(
    [
      createDownloadableResult(
        filename,
        schemaVersion,
        startTimestamp,
        endTimestamp,
        locationHeader,
        errors || [],
        alerts || []
      ),
    ],
    {
      type: "text/csv;charset=utf-8",
    }
  )
  const downloadUrl = window.URL.createObjectURL(blob)
  const downloadName = getResultDownloadName(filename)
  const dataDictionaryUrl = getDataDictionaryUrl(filename, schemaVersion)

  const atMaxErrors = (errors || []).length >= maxErrors
  const atMaxAlerts = (alerts || []).length >= maxErrors
  // slightly awkward, but we don't have type info for JSON alerts
  const showNineNinesGuidance = (alerts || []).some((alert) =>
    alert.message.startsWith("Nine 9s used for")
  )

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
              {
                <a
                  className="usa-button"
                  href={downloadUrl}
                  download={downloadName}
                >
                  Download results as spreadsheet
                </a>
              }
              <h3>Errors</h3>
              <Alert
                type={valid ? `success` : `error`}
                aria-live="polite"
                aria-atomic="true"
              >
                <span>
                  Requirements version: Requirements effective {schemaDateLabel}{" "}
                  ({schemaLabel})
                </span>
                <br />
                <span>Validator run started at {startTimestamp}</span>
                <br />
                <span>Validator run completed at {endTimestamp}</span>
                <br />
                {valid ? (
                  <>
                    <span>No errors found in file</span>:{" "}
                    <span className="text-underline">{filename}</span>
                  </>
                ) : (
                  <>
                    <span>
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
                      <span class="text-bold">
                        The first {maxErrors} errors are shown below. See the{" "}
                        <a href={dataDictionaryUrl}>
                          Hospital Price Transparency Data Dictionary GitHub
                          Repository
                        </a>{" "}
                        for detailed technical specifications to understand and
                        address these errors.
                      </span>
                    )}
                    {!atMaxErrors && (
                      <span class="text-bold">
                        See the{" "}
                        <a href={dataDictionaryUrl}>
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
              <h3>Alerts</h3>
              <Alert
                type={alerts.length === 0 ? "success" : "info"}
                aria-live="polite"
                aria-atomic="true"
              >
                {alerts.length === 0 ? (
                  <>
                    <span>No alerts found in file</span>:{" "}
                    <span className="text-underline">{filename}</span>
                  </>
                ) : (
                  <>
                    <span>
                      There
                      {alerts.length === 1
                        ? " is 1 alert"
                        : ` are ${atMaxAlerts ? "at least " : ""}${
                            alerts.length
                          } alerts`}{" "}
                      found in the file
                    </span>
                    : <span className="text-underline">{filename}</span>
                    <br />
                    {atMaxAlerts && (
                      <span class="text-bold">
                        The first {maxErrors} alerts are shown below.{" "}
                        {showNineNinesGuidance && (
                          <>
                            See the{" "}
                            <a href="https://www.cms.gov/files/document/updated-hpt-guidance-encoding-allowed-amounts.pdf">
                              CMS guidance
                            </a>{" "}
                            issued on May 22, 2025 to understand and address the
                            nine 9 alerts.
                          </>
                        )}
                      </span>
                    )}
                    {!atMaxAlerts && showNineNinesGuidance && (
                      <span class="text-bold">
                        See the{" "}
                        <a href="https://www.cms.gov/files/document/updated-hpt-guidance-encoding-allowed-amounts.pdf">
                          CMS guidance
                        </a>{" "}
                        issued on May 22, 2025 to understand and address the
                        nine 9 alerts.
                      </span>
                    )}
                  </>
                )}
              </Alert>
              {alerts.length > 0 && (
                <>
                  <Table className="width-full" bordered striped>
                    <thead>
                      <tr>
                        <th scope="col">{locationHeader}</th>
                        <th scope="col">Alert description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts
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
  schemaVersion: PropTypes.string,
  valid: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
  warnings: PropTypes.arrayOf(PropTypes.object),
  alerts: PropTypes.arrayOf(PropTypes.object),
  maxErrors: PropTypes.number,
  locationHeader: PropTypes.string,
  loading: PropTypes.bool,
  readError: PropTypes.bool,
  didMount: PropTypes.bool,
  timestamp: PropTypes.string,
}

export default ValidationResults
