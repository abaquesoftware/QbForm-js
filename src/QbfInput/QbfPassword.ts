import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbForm from "../QbForm/QbForm"
import QbfInputAbstract from "./QbfInputAbstract"

// ============================================================================
export default class QbfPassword extends QbfInputAbstract {
// ============================================================================
  // **************************************
  // QbfPassword: static
  // **************************************
  // ------------------------------------------------------------------------------
  public static onChange(event: Event): void {
  // ------------------------------------------------------------------------------
    if (event.target) {
      const input = event.target as HTMLInputElement
      const elementPath = input.id.substr(0, input.id.length - "_INPUTCENTER".length)
      const qbfElementList: QbfElement[] =  QbForm.getElementFromElementPath(elementPath)
      const qbfPassword = qbfElementList[0] as QbfPassword
      const oldValue = qbfPassword.value
      qbfPassword.value = input.value
      const newValue = qbfPassword.value
      qbfPassword.sendEvent("change", qbfPassword, { oldValue, newValue })
    }
  }

  // **************************************
  // QbfPassword: instance
  // **************************************
  public value: string
  public defaultValue: string | null = null

  // ------------------------------------------------------------------------------
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // ------------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    this.pwdDisplayed = false
    this.eyeIcon = true
    this.value = ""

    this.setLocalPropertyFromSchema( QbForm.nonStandardPrefix + "defaultValue", schema)
    QbfInputAbstract.setInputProperties( this, schema, false )

    // Set default value
    if (this.defaultValue) {
      this.value = this.defaultValue
    }
  }

  // ------------------------------------------------------------------------------
  public setProperty(property: string, value: any): void {
  // ------------------------------------------------------------------------------
    let updateDisplay = false
    const schema: IQbfSchema = {}
    schema[property] = value

    if (property === "value") {
      this.setValue(value)
      updateDisplay = true
    } else {
        updateDisplay = this.setLocalProperty(property, value, true) || updateDisplay
        updateDisplay = QbfInputAbstract.setInputProperties(this, schema, true) || updateDisplay
    }
    if (updateDisplay) {
      this.updateDisplay()
    }
  }

  // --------------------------------------------------------------------------
  public setValue(value: any): void {
  // --------------------------------------------------------------------------
    this.value = value.toString()
  }

  // ------------------------------------------------------------------------------
  public setLocalPropertyFromSchema(property: string, schema: IQbfSchema): boolean {
  // ------------------------------------------------------------------------------
    let result = false
    if (schema[property]) {
      result = this.setLocalProperty(property, schema[property], false)
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public setLocalProperty(property: string, value: any, mustUpdateDisplay: boolean ): boolean {
  // ------------------------------------------------------------------------------
    let result = false
    if (property === QbForm.nonStandardPrefix + "defaultValue") {
      this.defaultValue = value.toString()
      result = true
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public getProperty( property: string): any {
  // ------------------------------------------------------------------------------
    let result: any = null
    result = QbfInputAbstract.getInputProperty(this, property)
    if ( property === "value") {
      result = this.value
    }
    if ( property === QbForm.nonStandardPrefix + "defaultValue" ) {
      result = this.defaultValue
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public buildInputCenterHtml(): string {
  // ------------------------------------------------------------------------------
    let html = ""
    // let qbFormId = this.qbForm.index
    const path = QbForm.convertPathToString(this.elementPath)
    const valueHtml = QbfInputAbstract.htmlEncode(this.value)
    if (this.editable) {
      // Enabled
      html += "<input id=\"" + path + "_INPUTCENTER\""
      html += " type=\"password\""
      html += " value=\"" + valueHtml + "\""
      html += " onfocus=\"QbForm.getClass('QbfInputAbstract').onFocus(event)\""
      html += " onblur=\"QbForm.getClass('QbfInputAbstract').onBlur(event)\""
      html += " onchange=\"QbForm.getClass('QbfPassword').onChange(event)\""
      html += "></input>"
    } else {
      // Disabled
      html += valueHtml
    }
    return html
  }

  // ------------------------------------------------------------------------------
  public compareTo( other: QbfElement): number {
  // ------------------------------------------------------------------------------
    return 0
  }

}
