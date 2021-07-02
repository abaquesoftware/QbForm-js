import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfElementFactory from "../QbForm/QbfElementFactory"
import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"

// ============================================================================
export default class QbfObject extends QbfFramedElement {
// ============================================================================
  // **************************************
  // QbfObject: instance
  // **************************************
  public fieldList: Map<string, QbfElement>

  // --------------------------------------------------------------------------
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // --------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    // Display
    if (this.parent && !this.frameBoxText && Object.keys(schema).indexOf("frameBoxText") < 0) {
      this.frameBoxText = ""
    }
    // Field List
    this.fieldList = new Map<string, QbfElement>()
    if (schema.properties) {
      const schemaList = schema.properties as IQbfSchema
      Object.keys(schemaList).forEach( (subName: string) => {
        const subSchema = schemaList[subName] as IQbfSchema
        const subElement = QbfElementFactory.createQbfElement(qbForm, this, subName, inTable, subSchema)
        if ( this.fieldList != null && subElement != null ) {
          this.fieldList.set(subElement.name, subElement)
        }
      })
    }
  }

  // --------------------------------------------------------------------------
  public setProperty(property: string, value: any): void {
  // --------------------------------------------------------------------------
    let updateDisplay = false
    if ( property === "value") {
      this.setValue(value)
    } else {
      // set other properties
      const schema: IQbfSchema = {}
      schema[property] = value
      updateDisplay = QbfFramedElement.setFramedElementProperties(this, schema) || updateDisplay
    }
    if (updateDisplay) {
      this.updateDisplay()
    }
  }

  // --------------------------------------------------------------------------
  public setValue(value: any): void {
  // --------------------------------------------------------------------------
    if ( typeof value === "object") {
      Object.keys(value).map( (fieldName: string) => {
        const field = this.fieldList.get(fieldName)
        if (field) {
          field.setProperty("value", value[fieldName])
        }
      })
    }
  }

  // ------------------------------------------------------------------------------
  public getProperty( property: string): any {
  // ------------------------------------------------------------------------------
    let result: any = null
    if ( property === "value") {
      result = this.getValue()
    } else {
      result = QbfFramedElement.getFramedElementProperty(this, property)
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public getValue(): any {
  // ------------------------------------------------------------------------------
    const result: {[key: string]: any} = {}
    this.fieldList.forEach( (element: QbfElement) => {
      if (element.storage) {
        const elementValue = element.getProperty("value")
        result[element.name] = elementValue
      }
    })
    return result
  }

  // --------------------------------------------------------------------------
  public buildCanvasHtml(): string {
  // --------------------------------------------------------------------------
    const path = QbForm.convertPathToString(this.elementPath)
    let html = ""
    html += "<div id=\"" + path + "_cell\""
    html += " class=\"_qbf-" + this.theme + "\""
    html += ">"
    this.fieldList.forEach( (subElement: QbfElement): void => {
      const subPath = QbForm.convertPathToString(subElement.elementPath)
      html += "<div id=\"" + subPath + "_fieldLabel\""
      html += " class=\"_qbf-" + this.theme + "_fieldLabel\""
      html += ">"
      html += subElement.buildLabelHtml()
      html += "</div>"
      html += "<div id=\"" + subPath + "_field\""
      html += " class=\"_qbf-" + this.theme + "_field\""
      html += ">"
      html += subElement.buildHtml()
      html += "</div>"
    })
    html += "</div>"
    return html
  }
}
