import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfFilterAbstract from "../QbForm/QbfFilterAbstract"
import QbForm from "../QbForm/QbForm"
import QbfInputAbstract from "./QbfInputAbstract"

// ============================================================================
export default class QbfNumber extends QbfInputAbstract {
// ============================================================================
  // **************************************
  // QbfNumber: static
  // **************************************

  // --------------------------------------------------------------------------
  public static onFocus(event: Event): void {
  // --------------------------------------------------------------------------
    QbfInputAbstract.onFocus(event)
  }

  // --------------------------------------------------------------------------
  public static onBlur(event: Event): void {
  // --------------------------------------------------------------------------
    QbfInputAbstract.onBlur(event)
  }

  // --------------------------------------------------------------------------
  public static onKeyUp(event: KeyboardEvent): void {
  // --------------------------------------------------------------------------
    QbfInputAbstract.onKeyUp(event)
  }

  // --------------------------------------------------------------------------
  public static onChange(event: Event): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const input = event.target as HTMLInputElement
      const elementPath = input.id.substr(0, input.id.length - "_INPUTCENTER".length)
      const qbfElementList: QbfElement[] =  QbForm.getElementFromElementPath(elementPath)
      const kinteger = qbfElementList[0] as QbfNumber
      const oldValue = kinteger.value
      kinteger.value = Number.parseInt(input.value, 10)
      const newValue = kinteger.value
      kinteger.sendEvent("change", kinteger, { oldValue, newValue})
    }
  }

  // --------------------------------------------------------------------------
  public static buildFilterCellHtml(parent: QbfElement, filterElementId: number, cellClassNames: string): string {
  // --------------------------------------------------------------------------
    let onKeyUp = ""
    onKeyUp += "const filter = QbForm.getClass(\"QbfFilterAbstract\").getFilter(" + filterElementId + ");"
    onKeyUp += "const filterValue = event.target.value;"
    onKeyUp += "filter.setValue(\"filter\",filterValue);"
    onKeyUp += "filter.apply();"

    let html = ""
    html += "<div class=\"" + cellClassNames + "\">"
    html += "  <select tabindex=\"-1\""
    html += "    onChange=\"QbForm.getClass('QbfNumber').onChangeFilterOperator(" + filterElementId + ",event)\""
    html += ">"
    html += "    <option value=\"EQ\">=</option>"
    html += "    <option value=\"GE\">&ge;</option>"
    html += "    <option value=\"LE\">&le;</option>"
    html += "    <option value=\"GT\">&gt;</option>"
    html += "    <option value=\"LT\">&lt;</option>"
    html += "  </select>"
    html += "  <input tabindex=\"-1\""
    html += "    onkeyUp=\"QbForm.getClass('QbfNumber').onChangeFilterValue(" + filterElementId + ",event)\""
    html += "></input>"
    html += "</div>"
    return html
  }

  // --------------------------------------------------------------------------
  public static onChangeFilterOperator(filterElementId: number, event: Event): void {
  // --------------------------------------------------------------------------
    const filter = QbfFilterAbstract.getFilter(filterElementId)
    if (event.target) {
      const selectElement = event.target as HTMLSelectElement
      filter.setValue("operator", selectElement.value)
      filter.apply()
    }
  }

  // --------------------------------------------------------------------------
  public static onChangeFilterValue(filterElementId: number, event: KeyboardEvent): void {
  // --------------------------------------------------------------------------
    const filter = QbfFilterAbstract.getFilter(filterElementId)
    if (event.target) {
      const filterInput = event.target as HTMLInputElement
      filter.setValue("value", filterInput.value)
      filter.apply()
    }
  }

  // **************************************
  // QbfNumber: instance
  // **************************************
  public value: number
  public defaultValue: number | null = null
  public minimum: number | null = null
  public exclusiveMinimum: number | null = null
  public maximum: number | null = null
  public exclusiveMaximum: number | null = null
  public multipleOf: number | null = null

  // --------------------------------------------------------------------------
  public constructor(qbfForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // --------------------------------------------------------------------------
    super(qbfForm, parent, name, inTable, schema)
    this.value = 0
    this.setLocalPropertyFromSchema(QbForm.nonStandardPrefix + "defaultValue", schema)
    this.setLocalPropertyFromSchema("minimum", schema)
    this.setLocalPropertyFromSchema("exclusiveMinimum", schema)
    this.setLocalPropertyFromSchema("maximum", schema)
    this.setLocalPropertyFromSchema("exclusiveMaximum", schema)
    this.setLocalPropertyFromSchema("multipleOf", schema)
    QbfInputAbstract.setInputProperties( this, schema, false )
    // Set default value
    if (this.defaultValue) {
      this.value = this.defaultValue
    }
  }

  // --------------------------------------------------------------------------
  public setProperty(property: string, value: any): void {
  // --------------------------------------------------------------------------
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
    this.value = parseFloat(value)
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
    const result = false
    if (property === QbForm.nonStandardPrefix + "defaultValue") {
      this.defaultValue = parseInt(value.toString(), 10)
    }
    if (property === "minimum") {
      this.minimum = value
    }
    if (property === "exclusiveMinimum") {
      this.exclusiveMinimum = value
    }
    if (property === "maximum") {
      this.minimum = value
    }
    if (property === "exclusiveMaximum") {
      this.exclusiveMinimum = value
    }
    if (property === "multipleOf") {
      this.multipleOf = value
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public getProperty(property: string): any {
  // ------------------------------------------------------------------------------
    let result: any = null
    result = QbfInputAbstract.getInputProperty(this, property)
    if ( property === "value") {
      result = this.value
    }
    if ( property === QbForm.nonStandardPrefix + "defaultValue" ) {
      result = this.defaultValue
    }
    if ( property === "minimum" ) {
      result = this.minimum
    }
    if ( property === "exclusiveMinimum" ) {
      result = this.exclusiveMinimum
    }
    if ( property === "maximum" ) {
      result = this.minimum
    }
    if ( property === "exclusiveMaximum" ) {
      result = this.exclusiveMinimum
    }
    if ( property === "multipleOf" ) {
      result = this.multipleOf
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public buildInputCenterHtml(): string {
  // ------------------------------------------------------------------------------
    let html = ""
    const path = QbForm.convertPathToString(this.elementPath)
    const valueHtml = this.value

    if (this.editable) {
      // Enabled
      html += "<input id=\"" + path + "_INPUTCENTER\" style=\"text-align: right;\""
      html += " value=\"" + valueHtml + "\""
      html += " onfocus=\"QbForm.getClass('QbfNumber').onFocus(event)\""
      html += " onblur=\"QbForm.getClass('QbfNumber').onBlur(event)\""
      html += " onkeyup=\"QbForm.getClass('QbfNumber').onKeyUp(event)\""
      html += " onchange=\"QbForm.getClass('QbfNumber').onChange(event)\""
      html += "></input>"
    } else {
      // Disabled
      html += "<div style='text-align: left'>"
      html += valueHtml
      html += "</div>"
    }
    return html
  }

  // --------------------------------------------------------------------------
  public compareTo(other: QbfElement): number {
  // --------------------------------------------------------------------------
    let result: number = 0
    if ( other instanceof QbfNumber ) {
      const otherAsQbfNumber = other as QbfNumber
      if ( this.value < otherAsQbfNumber.value ) { result = -1 }
      if ( this.value > otherAsQbfNumber.value ) { result = 1 }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public filter(filterData: Map<string, any>): boolean {
  // --------------------------------------------------------------------------
    let result = true
    let filterOperator = filterData.get("operator")
    const filterValue = filterData.get("value")

    if (!filterOperator) { filterOperator = "EQ" }
    if (filterValue) {
      const value = parseInt(filterValue, 10)
      switch (filterOperator) {
        case "EQ":
          result = ( this.value === value )
          break
        case "GE":
          result = ( this.value >= value )
          break
        case "LE":
          result = ( this.value <= value )
          break
        case "GT":
          result = ( this.value > value )
          break
        case "LT":
          result = ( this.value < value )
          break
      }
    }
    return result
  }
}
