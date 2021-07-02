import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbForm from "../QbForm/QbForm"

import QbfBoolean from "../QbfBoolean/QbfBoolean"
import QbfButton from "../QbfButton/QbfButton"
import QbfChoice from "../QbfChoice/QbfChoice"
import QbfInteger from "../QbfInput/QbfInteger"
import QbfNumber from "../QbfInput/QbfNumber"
import QbfPassword from "../QbfInput/QbfPassword"
import QbfString from "../QbfInput/QbfString"
import QbfObject from "../QbfObject/QbfObject"

// ============================================================================
export default interface IQbfSelector {
// ============================================================================
  findElementClass(schema: IQbfSchema): (new (qbForm: QbForm,
                                              parent: QbfElement | null,
                                              name: string,
                                              inTable: boolean,
                                              schema: IQbfSchema) => QbfElement) | null

  getPriority(): number
}

// ============================================================================
export class QbfSelectorImpl implements IQbfSelector {
// ============================================================================

  // --------------------------------------------------------------------------
  public findElementClass(schema: IQbfSchema): (new (qbForm: QbForm,
                                                     parent: QbfElement | null,
                                                     name: string,
                                                     inTable: boolean,
                                                     schema: IQbfSchema) => QbfElement) | null {
  // --------------------------------------------------------------------------
    let result = null
    const schemaEnum = schema.enum
    if ( schemaEnum ) {
      result = QbfChoice
    } else {
      let type = schema.type
      if ( type ) {
        type = type.toString().toUpperCase()
        switch (type) {
          case "STRING":
            const display = schema[ QbForm.nonStandardPrefix + "display" ]
            if (display && display === "password") {
              result = QbfPassword
            } else {
              result = QbfString
            }
            break
          case "NUMBER": result = QbfNumber; break
          case "INTEGER": result = QbfInteger; break
          case "OBJECT": result = QbfObject; break
          case "BOOLEAN": result = QbfBoolean; break
          // Not in JSON Schema specs
          case "BUTTON": result = QbfButton; break
        }
      }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public getPriority() {
  // --------------------------------------------------------------------------
    return 0
  }
}
