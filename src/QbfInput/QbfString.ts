import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfFilterAbstract from "../QbForm/QbfFilterAbstract"
import QbForm from "../QbForm/QbForm"
import QbfInputAbstract from "./QbfInputAbstract"

// ============================================================================
export default class QbfString extends QbfInputAbstract {
// ============================================================================
  // **************************************
  // QbfString: static
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
      const kstring = qbfElementList[0] as QbfString
      const oldValue = kstring.value
      const newValue = input.value
      kstring.value = newValue
      kstring.sendEvent("change", kstring, { oldValue, newValue })
    }
  }

  // --------------------------------------------------------------------------
  public static buildFilterCellHtml(parent: QbfElement, filterElementId: number, cellClassNames: string): string {
  // --------------------------------------------------------------------------
    let html = ""
    html += "<div class=\"" + cellClassNames + "\">"
    html += "  <input tabindex=\"-1\""
    html += "   onkeyUp=\"QbForm.getClass('QbfString').onFilterKeyUp(" + filterElementId + ",event)\""
    html += "></input>"
    html += "</div>"
    return html
  }

  // --------------------------------------------------------------------------
  public static onFilterKeyUp(filterElementId: number, event: KeyboardEvent): void {
  // --------------------------------------------------------------------------
    const filter = QbfFilterAbstract.getFilter(filterElementId)
    if (event.target) {
      const filterInput = event.target as HTMLInputElement
      filter.setValue("filter", filterInput.value)
      filter.apply()
    }
  }

  // **************************************
  // QbfString: instance
  // **************************************
  public value: string
  public defaultValue: string | null = null
  public maxLength: number | null = null
  public minLength: number | null = null
  public pattern: string | null = null
  public format: string | null = null

  // --------------------------------------------------------------------------
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // --------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    this.value = ""

    this.setLocalPropertyFromSchema(QbForm.nonStandardPrefix + "defaultValue", schema)
    this.setLocalPropertyFromSchema("maxLength", schema)
    this.setLocalPropertyFromSchema("minLength", schema)
    this.setLocalPropertyFromSchema("pattern", schema)
    this.setLocalPropertyFromSchema("format", schema)
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
    if (value) {
      this.value = value.toString()
    }
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
    }
    if (property === "maxLength") {
      this.maxLength = value
    }
    if (property === "minLength") {
      this.minLength = value
    }
    if (property === "pattern") {
      this.pattern = value
    }
    if (property === "format") {
      this.format = value
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
    if ( property === "maxLength" ) {
      result = this.maxLength
    }
    if ( property === "minLength" ) {
      result = this.minLength
    }
    if ( property === "pattern" ) {
      result = this.pattern
    }
    if ( property === "format" ) {
      result = this.format
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public buildInputCenterHtml(): string {
  // ------------------------------------------------------------------------------
    let html = ""
    const path = QbForm.convertPathToString(this.elementPath)
    const valueHtml = QbfInputAbstract.htmlEncode(this.value)
    html += "<input id=\"" + path + "_INPUTCENTER\""
    html += " value=\"" + valueHtml + "\""
    if (this.editable) {
      // Enabled
      html += " onfocus=\"QbForm.getClass('QbfString').onFocus(event)\""
      html += " onblur=\"QbForm.getClass('QbfString').onBlur(event)\""
      html += " onkeyup=\"QbForm.getClass('QbfString').onKeyUp(event)\""
      html += " onchange=\"QbForm.getClass('QbfString').onChange(event)\""
    } else {
      html += " disabled"
    }
    html += ">"
    return html
  }

  // --------------------------------------------------------------------------
  public compareTo(other: QbfElement): number {
  // --------------------------------------------------------------------------
    let result: number = 0
    if ( other instanceof QbfString ) {
      const otherAsQbfString = other as QbfString
      if ( this.value < otherAsQbfString.value ) { result = -1 }
      if ( this.value > otherAsQbfString.value ) { result = 1 }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public filter(filterData: Map<string, any>): boolean {
  // --------------------------------------------------------------------------
    let result = true
    let filterValue = filterData.get( "filter" )
    if ( filterValue) {
      filterValue = filterValue.toString().toLowerCase()
      result = ( this.value.toLowerCase().indexOf(filterValue) >= 0 )
    }
    return result
  }
}
