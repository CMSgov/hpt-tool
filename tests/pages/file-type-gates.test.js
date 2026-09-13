import { expect, describe, test } from "vitest"

import { isFileAccepted } from "../../src/components/FileInput"
import { getFileExtension } from "../../src/pages/online-validator"

// The accept list the online validator hands to the file picker.
const ACCEPT = ".csv,.json,text/csv,application/json"

// Extensions validateFile is prepared to dispatch on.
const VALIDATED_EXTENSIONS = ["csv", "json"]

const validatorHandles = (filename) =>
  VALIDATED_EXTENSIONS.includes(getFileExtension(filename))

// The picker decides whether to accept a file at all, and the validator decides
// what to do with it. They have to agree. A file the picker accepts but the
// validator cannot dispatch leaves the results panel saying "Your file is
// processing" with nothing running behind it.
describe("the file picker and the validator agree on the file type", () => {
  test.each([
    { name: "123456789_test_standardcharges.csv", type: "text/csv" },
    { name: "123456789_test_standardcharges.json", type: "application/json" },
    // Windows with Excel registered reports this MIME for a .csv.
    {
      name: "123456789_TEST_STANDARDCHARGES.CSV",
      type: "application/vnd.ms-excel",
    },
    { name: "123456789_test_standardcharges.csv.txt", type: "text/plain" },
    { name: "123456789_test_standardcharges.jsonl", type: "" },
    { name: "123456789_test_standardcharges.csv.zip", type: "application/zip" },
    { name: "standardcharges.pdf", type: "application/pdf" },
    { name: "standardcharges", type: "" },
  ])("$name", (file) => {
    expect(isFileAccepted(file, ACCEPT)).toBe(validatorHandles(file.name))
  })
})

describe("isFileAccepted", () => {
  test("matches the extension on the final segment, not anywhere in the name", () => {
    expect(
      isFileAccepted(
        { name: "standardcharges.csv.txt", type: "text/plain" },
        ACCEPT
      )
    ).toBe(false)
    expect(
      isFileAccepted({ name: "standardcharges.jsonl", type: "" }, ACCEPT)
    ).toBe(false)
  })

  test("is case insensitive about the extension", () => {
    expect(
      isFileAccepted(
        { name: "STANDARDCHARGES.CSV", type: "application/octet-stream" },
        ACCEPT
      )
    ).toBe(true)
  })

  test("still accepts on MIME type alone", () => {
    expect(isFileAccepted({ name: "export", type: "text/csv" }, ACCEPT)).toBe(
      true
    )
  })
})
