import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import classnames from "classnames"

const SPACER_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

export const FileInput = ({
  name,
  id,
  disabled,
  className,
  accept,
  onChange,
  onDrop,
  ...inputProps
}) => {
  const internalRef = useRef(null)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showError, setShowError] = useState(false)
  const [hideDragText, setHideDragText] = useState(false)

  useEffect(() => {
    if (typeof navigator === "undefined") return

    const hideDragText =
      /rv:11.0/i.test(navigator?.userAgent) ||
      /Edge\/\d./i.test(navigator?.userAgent)

    setHideDragText(hideDragText)
  }, [typeof navigator])

  const fileInputClasses = classnames(
    "usa-file-input",
    {
      "usa-file-input--disabled": disabled,
    },
    className
  )

  const targetClasses = classnames("usa-file-input__target", {
    "usa-file-input--drag": isDragging,
    "has-invalid-file": showError,
  })

  const instructionClasses = classnames("usa-file-input__instructions", {
    "display-none": !!file,
  })

  const preventInvalidFiles = (e) => {
    setShowError(false)

    if (accept) {
      const acceptedTypes = accept.split(",")
      let allFilesAllowed = true
      for (let i = 0; i < e.target.files.length; i += 1) {
        const file = e.target.files[parseInt(`${i}`)]
        if (allFilesAllowed) {
          for (let j = 0; j < acceptedTypes.length; j += 1) {
            const fileType = acceptedTypes[parseInt(`${j}`)]
            allFilesAllowed =
              file.name.indexOf(fileType) > 0 ||
              file.type.includes(fileType.replace(/\*/g, ""))
            if (allFilesAllowed) break
          }
        } else break
      }

      if (!allFilesAllowed) {
        setFile(null)
        setShowError(true)
        e.preventDefault()
        e.stopPropagation()
      }
      return allFilesAllowed
    }
  }

  // Event handlers
  const handleDragOver = () => setIsDragging(true)
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => {
    setIsDragging(false)
    if (onDrop) onDrop(e)
  }

  const handleChange = (e) => {
    const allFilesAllowed = preventInvalidFiles(e)
    if (allFilesAllowed) {
      setFile(e.target.files.length > 0 ? e.target.files[0] : null)
      if (onChange) onChange(e)
    }
    // Clear out the value to allow for the same filename to trigger the onChange multiple times in a row.
    e.target.value = null
  }

  return (
    <div
      data-testid="file-input"
      className={fileInputClasses}
      aria-disabled={disabled}
    >
      <div
        data-testid="file-input-droptarget"
        className={targetClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file && (
          <div
            data-testid="file-input-preview-heading"
            className="usa-file-input__preview-heading"
          >
            Selected file
            <span className="usa-file-input__choose">Change file</span>
          </div>
        )}
        <div
          data-testid="file-input-instructions"
          className={instructionClasses}
          aria-hidden="true"
        >
          {!hideDragText && (
            <span className="usa-file-input__drag-text">
              Drag file here or{" "}
            </span>
          )}
          <span className="usa-file-input__choose">choose from folder</span>
        </div>

        {file && (
          <div className="usa-file-input__preview" aria-hidden="true">
            <img
              src={SPACER_GIF}
              className="usa-file-input__preview-image usa-file-input__preview-image--generic"
            />
            {file.name}
          </div>
        )}
        <div data-testid="file-input-box" className="usa-file-input__box"></div>
        {showError && (
          <div
            data-testid="file-input-error"
            className="usa-file-input__accepted-files-message"
          >
            This is not a valid file type.
          </div>
        )}
        <input
          {...inputProps}
          ref={internalRef}
          type="file"
          data-testid="file-input-input"
          name={name}
          id={id}
          className="usa-file-input__input"
          disabled={disabled}
          onChange={handleChange}
          accept={accept}
        />
      </div>
    </div>
  )
}

FileInput.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  onDrop: PropTypes.func,
}

export default FileInput
