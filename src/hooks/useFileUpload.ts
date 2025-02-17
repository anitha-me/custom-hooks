import { useState, useEffect } from "react";
import { read, utils } from "xlsx";

import { SheetData } from "../pages/Questions/UploadQuestions";
import { formatFileSize } from "../utils/formatter";

const useFileUpload = (
  maxSize: number = 25000000,
  fileTypes: string[] | null,
  file: File | null
) => {
  const [rows, setRows] = useState<SheetData[] | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (file) {
      if (isValid(file)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataObject = read(event.target?.result);
          const sheets = dataObject.SheetNames;
          if (sheets.length) {
            const rows: SheetData[] = utils.sheet_to_json(
              dataObject.Sheets[sheets[0]]
            );
            setRows(rows);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } else {
      setRows(null);
      setValidationMessage(null);
    }
  }, [file]);

  const isValid = (file: File) => {
    if (file.size <= maxSize) {
      if (
        fileTypes &&
        fileTypes.find((type) => {
          return type === file.type;
        })
      ) {
        return true;
      } else {
        setValidationMessage(
          `File type should be in ( ${fileTypes?.join()} ) `
        );
        return false;
      }
    } else {
      setValidationMessage(
        `Maximum size allowed for the file is ${formatFileSize(maxSize)}`
      );
      setRows(null);
      return false;
    }
  };

  return { rows, validationMessage };
};

export default useFileUpload;
