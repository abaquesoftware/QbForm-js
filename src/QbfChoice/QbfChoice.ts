import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfFilterAbstract from "../QbForm/QbfFilterAbstract"
import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"
import QbfPropertyTools from "../QbForm/QbfPropertyTools"

import KChoiceCombobox from "./QbfChoiceCombobox"
import KChoiceRadio from "./QbfChoiceRadio"

// ===============================================================================
export class QbfChoiceDefinition {
// ===============================================================================
  public value: any
  public label: string

  // ------------------------------------------------------------------------------
  public constructor(value: any, label: string ) {
  // ------------------------------------------------------------------------------
    this.value = value
    this.label = label
  }
}

interface IQbfGridColumn {
  definition: object
}

interface IQbfGridColumnDefinition {
  schema: IQbfSchema
}

// ===============================================================================
// tslint:disable-next-line: max-classes-per-file
export default class KChoice extends QbfFramedElement {
// ===============================================================================
  // **************************************
  // QbfChoice: static
  // **************************************
  // --------------------------------------------------------------------------
  public static buildFilterCellHtml(parent: QbfElement, filterElementId: number, cellClassNames: string): string {
  // --------------------------------------------------------------------------
    const path = QbForm.convertPathToString( parent.elementPath ) +  "_filter"
    const choiceValueList: any[] = [ "<{no-filter}>" ]
    const choiceLabelList: any[] = [ "" ]
    if (parent.hasOwnProperty("definition")) {
      const parentEx = parent as unknown as IQbfGridColumn
      const colDef = parentEx.definition as unknown as IQbfGridColumnDefinition
      const colSchema = colDef.schema
      if (colSchema?.enum) {
        for (const index of Object.keys(colSchema.enum)) {
          choiceValueList.push(colSchema.enum[index])
        }
      }
      const enumLabelList = colSchema[ QbForm.nonStandardPrefix + "enumLabels"]
      if (enumLabelList) {
        for (const index of Object.keys(enumLabelList)) {
          choiceLabelList.push(enumLabelList[index])
        }
      }
    }
    let html = ""
    html += "<div id=\"" + path + "\" >"
    html += "<select id=\"" + path + "_SELECT\" "
    html += " tabindex=0"
    html += " onchange=\"QbForm.getClass('QbfChoice').onFilterChange(" + filterElementId + ",event)\""
    html += ">"
    for (let i = 0; i < choiceValueList.length; i++ ) {
      const choiceValue = choiceValueList[i]
      const choiceLabel = (i < choiceLabelList.length) ? choiceLabelList[i] : choiceValueList[i]
      html += " <option value=\"" + choiceValue + "\""
      /*
      if ( choiceValue === element.value) {
        html += " selected"
      }
      */
      html += ">" + choiceLabel + "</option>"
    }
    html += "</select>"
    html += "</div>"
    return html
  }

  // --------------------------------------------------------------------------
  public static onFilterChange(filterElementId: number, event: Event): void {
  // --------------------------------------------------------------------------
    const filter = QbfFilterAbstract.getFilter(filterElementId)
    if (event.target) {
      const choiceHtmlElement = event.target as HTMLSelectElement
      filter.setValue("filter", choiceHtmlElement.value)
      filter.apply()
    }
  }

  // **************************************
  // QbfChoice: instance
  // **************************************
  public value: any
  public defaultValue: any = null
  public display: string = "combobox"
  public choiceDefinitionList: QbfChoiceDefinition[]

  public displayProperties: Map<string, string> = new Map<string, string>()

  // ------------------------------------------------------------------------------
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // ------------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    this.value = null
    this.choiceDefinitionList = []

    this.setLocalPropertyFromSchema(QbForm.nonStandardPrefix + "defaultValue", schema)
    this.setLocalPropertyFromSchema(QbForm.nonStandardPrefix + "display", schema)
    this.setLocalPropertyFromSchema("enum", schema)
    this.setLocalPropertyFromSchema(QbForm.nonStandardPrefix + "enumLabels", schema)

    QbfPropertyTools.addDisplayProperties(schema, "", this.displayProperties)

    // Default value = first choice
    if (this.value === null && this.choiceDefinitionList.length > 0 ) {
      this.value = this.choiceDefinitionList[0].value
    }
  }

  // ------------------------------------------------------------------------------
  public setProperty(property: string, value: any): void {
  // ------------------------------------------------------------------------------
    let updateDisplay = false
    const schema: IQbfSchema = {}
    schema[property] = value
    if ( property === "value" || property === "set-value-with-no-display-update") {
      this.setValue(value)
      if ( property === "value" ) { updateDisplay = true }
    } else {
      // set local property
      updateDisplay = this.setLocalProperty(property, value, true) || updateDisplay

      // set other properties
      updateDisplay = QbfFramedElement.setFramedElementProperties(this, schema) || updateDisplay
    }
    updateDisplay = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix ,
                                                          this.displayProperties) || updateDisplay
    if (updateDisplay) {
      this.updateDisplay()
    }
  }

  // ------------------------------------------------------------------------------
  public setValue(value: any): void {
  // ------------------------------------------------------------------------------
    this.value = value
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
  public setLocalProperty(property: string, value: any, mustUpdateDisplay: boolean): boolean {
  // ------------------------------------------------------------------------------
    let result = false
    if (property === QbForm.nonStandardPrefix + "defaultValue") {
      this.defaultValue = value
      this.value = this.defaultValue
      result = true
    }

    if (property === QbForm.nonStandardPrefix + "display") {
      const display = value.toLowerCase()
      if ( display === "combobox" || display === "radio" ) {
        this.display = display
        result = true
      }
    }

    // -- enum
    if ( property === "enum" && (typeof value === "object") ) {
      if (!this.choiceDefinitionList) {
        this.choiceDefinitionList = []
      }
      const enumList = value
      const len = Object.keys(enumList).length
      for (let i = 0; i < len; i++) {
        const enumValue = enumList[i]
        if (this.choiceDefinitionList) {
          if ( i < this.choiceDefinitionList.length) {
            this.choiceDefinitionList[i].value = enumValue
          } else {
            const newValue = new QbfChoiceDefinition(enumValue, enumValue.toString())
            this.choiceDefinitionList.push(newValue)
          }
        }
      }
      result = true
    }

    // -- enum Labels
    if ( property === QbForm.nonStandardPrefix + "enumLabels" && (typeof value === "object") ) {
      if (!this.choiceDefinitionList) {
        this.choiceDefinitionList = []
      }
      const enumLabelList = value
      const len = Object.keys(enumLabelList).length
      for (let i = 0; i < len; i++) {
        const label = enumLabelList[i]
        if (this.choiceDefinitionList) {
            if ( i < this.choiceDefinitionList.length) {
              this.choiceDefinitionList[i].label = label
          } else {
            const newValue = new QbfChoiceDefinition(label, label)
            this.choiceDefinitionList.push(newValue)
          }
        }
      }
      result = true
    }
    return result
  }

  // ------------------------------------------------------------------------------
  public getProperty(property: string): any {
  // ------------------------------------------------------------------------------
    let result: any = QbfFramedElement.getFramedElementProperty(this, property)
    result = QbfPropertyTools.getElementDisplayProperty(property, this.displayProperties, result)

    if (!result) {
      if ( property === "value") {
        result = this.value
      }
      if ( property === QbForm.nonStandardPrefix + "defaultValue") {
        result = this.defaultValue
      }
      if (property === QbForm.nonStandardPrefix + "display") {
        result = this.display
      }
      if (property === "enum") {
        result = []
        this.choiceDefinitionList.forEach( (choice: QbfChoiceDefinition) => {
          result.push(choice.value)
        })
      }
      if (property === QbForm.nonStandardPrefix + "enumLabels") {
        result = []
        this.choiceDefinitionList.forEach( (choice: QbfChoiceDefinition) => {
          result.push(choice.label)
        })
      }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public buildCanvasHtml(): string {
  // --------------------------------------------------------------------------
    let html = ""
    // Display KChoice itself
    switch (this.display) {
      case "radio":
        html += KChoiceRadio.buildHtmlDiv(this)
        break
      case "combobox":
      default:
        html += KChoiceCombobox.buildHtmlDiv(this)
        break
    }
    return html
  }

  // ------------------------------------------------------------------------------
  public compareTo(other: QbfElement): number {
  // ------------------------------------------------------------------------------
    let result: number = 0
    if ( other instanceof KChoice ) {
      const otherAsKChoice = other as KChoice
      if ( !this.value && other.value ) { result = -1 }
      if ( this.value && !other.value ) { result = 1 }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public filter(filterData: Map<string, any>): boolean {
  // --------------------------------------------------------------------------
    let result = true
    const filterValue = filterData.get("filter")
    if (filterValue !== "<{no-filter}>") { result = ( this.value === filterValue ) }
    return result
  }

}
