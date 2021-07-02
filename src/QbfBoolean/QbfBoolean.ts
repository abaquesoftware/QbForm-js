import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfFilterAbstract from "../QbForm/QbfFilterAbstract"
import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"

import QbfBooleanDisplayAbstract from "./QbfBooleanDisplayAbstract"
import QbfBooleanDisplayCheckbox from "./QbfBooleanDisplayCheckbox"
import QbfBooleanDisplaySwitch from "./QbfBooleanDisplaySwitch"

// ===============================================================================
export enum QbfBooleanValue {
// ===============================================================================
  UNKNOWN = -1 ,
  FALSE = 0 ,
  TRUE = 1 ,
}

interface IQbfGridColumn {
  definition: object,
  header: object
}

interface IQbfGridColumnDefinition {
  schema: IQbfSchema
}

interface IQbfGridHeader {
  qbfFilter: QbfFilterAbstract
}

// ===============================================================================
export default class QbfBoolean extends QbfFramedElement {
// ===============================================================================
  // **************************************
  // QbfBoolean: static
  // **************************************
  // --------------------------------------------------------------------------
  public static buildFilterCellHtml(parent: QbfElement, filterElementId: number, cellClassNames: string): string {
  // --------------------------------------------------------------------------
    const path = QbForm.convertPathToString( parent.elementPath ) +  "_filter"
    const nbStates = 3
    const value = QbfBooleanValue.UNKNOWN
    const catchFocus = false
    const manageCallbacks = false
    const onChangeObjClass = "QbfBoolean"
    const onChangeFunction = "onFilterChange"

    const theme = ( parent ) ? parent.theme : "default"

    let booleanType = "checkbox"
    if (parent.hasOwnProperty("definition")) {
      const parentEx = parent as unknown as IQbfGridColumn
      const colDef = parentEx.definition as unknown as IQbfGridColumnDefinition
      const colSchema = colDef.schema
      const display = colSchema[QbForm.nonStandardPrefix + "display"]
      if (colSchema.type === "boolean" && display ) {
        booleanType = display
      }
    }
    let html = ""
    html += "<div class=\"_qbftFilterCell-" + theme + "\">"
    switch (booleanType) {
      case "switch":
        const filterSwitchModel: QbfBooleanDisplaySwitch = new QbfBooleanDisplaySwitch(parent, path, nbStates,
          value, catchFocus, manageCallbacks,
          onChangeObjClass, onChangeFunction)
        html += filterSwitchModel.buildHtmlDiv()
        break
      case "checkbox":
      default:
        const filterCheckboxModel: QbfBooleanDisplayCheckbox = new QbfBooleanDisplayCheckbox(parent, path, nbStates,
          value, catchFocus, manageCallbacks,
          onChangeObjClass, onChangeFunction)
        html += filterCheckboxModel.buildHtmlDiv()
        break
    }
    html += "</div>"

    return html
  }

  // --------------------------------------------------------------------------
  public static onFilterChange(parentId: string, oldValue: QbfBooleanValue, newValue: QbfBooleanValue): void {
  // --------------------------------------------------------------------------
    const element = QbForm.getElementFromElementPath(parentId)[0] as unknown as IQbfGridColumn
    const header = element.header as IQbfGridHeader
    const filter = header.qbfFilter
    filter.setValue("filter", newValue)
    filter.apply()
  }

  // **************************************
  // QbfBoolean: instance
  // **************************************
  public display: string = "checkbox"
  public defaultValue: QbfBooleanValue
  public booleanDisplay: QbfBooleanDisplayAbstract

  // ------------------------------------------------------------------------------
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // ------------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    if (schema[ QbForm.nonStandardPrefix + "display"]) {
      const display = schema[ QbForm.nonStandardPrefix + "display"].toLowerCase()
      if (display === "checkbox" || display === "switch") {
        this.display = display
      }
    }

    this.defaultValue = QbfBooleanValue.FALSE
    if ( schema[ QbForm.nonStandardPrefix + "defaultValue"]) {
      this.defaultValue = QbfBooleanValue.FALSE
      const defValueAsBoolean = QbForm.convertToBoolean( schema[ QbForm.nonStandardPrefix + "defaultValue"] )
      this.defaultValue = defValueAsBoolean ? QbfBooleanValue.TRUE : QbfBooleanValue.FALSE
    }

    const path = QbForm.convertPathToString(this.elementPath)
    const nbStates = 2
    const catchFocus = true
    const manageCallbacks = true
    const onChangeObjClass = null
    const onChangeObjFunction = null
    switch (this.display) {
      case "switch":
        this.booleanDisplay = new QbfBooleanDisplaySwitch(this, path, nbStates, this.defaultValue, catchFocus,
                                                          manageCallbacks, onChangeObjClass, onChangeObjFunction)
        break
      default:
      case "checkbox":
        this.booleanDisplay = new QbfBooleanDisplayCheckbox(this, path, nbStates, this.defaultValue, catchFocus,
                                                            manageCallbacks, onChangeObjClass, onChangeObjFunction)
        break
    }
  }

  // ------------------------------------------------------------------------------
  public setProperty(property: string, value: any): void {
  // ------------------------------------------------------------------------------
    if (property === "value") {
      this.booleanDisplay.value = value ? QbfBooleanValue.TRUE : QbfBooleanValue.FALSE
    }
  }

  // ------------------------------------------------------------------------------
  public getProperty(property: string): any {
  // ------------------------------------------------------------------------------
    let result: any = null
    if ( property === "value") {
      result = ( this.booleanDisplay.value === QbfBooleanValue.TRUE )
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public buildCanvasHtml(): string {
  // ------------------------------------------------------------------------------
    return this.booleanDisplay.buildHtmlDiv()
  }

  // ------------------------------------------------------------------------------
  public compareTo(other: QbfElement): number {
  // ------------------------------------------------------------------------------
    let result: number = 0
    if ( other instanceof QbfBoolean ) {
      const otherAsQbfBoolean = other as QbfBoolean
      if ( !this.booleanDisplay.value && other.booleanDisplay.value ) { result = -1 }
      if ( this.booleanDisplay.value && !other.booleanDisplay.value ) { result = 1 }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public filter(filterData: Map<string, any>): boolean {
  // --------------------------------------------------------------------------
    let result = true
    const filterValue = filterData.get("filter")
    if (   filterValue !== null
        && filterValue !== undefined
        && filterValue !== QbfBooleanValue.UNKNOWN ) {
      result = (this.booleanDisplay.value === filterValue )
    }
    return result
  }
}
