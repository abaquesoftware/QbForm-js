import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"

// ============================================================================
export default class QbfButton extends QbfFramedElement {
// ============================================================================
  // **************************************
  // QbfButton: static
  // **************************************
  // --------------------------------------------------------------------------
  public static onClick(event: MouseEvent): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const htmlElement = event.target as HTMLElement
      const element = QbForm.getElementFromElementPath(htmlElement.id)[0] as QbfButton
      element.sendEvent( "click", element, null )
    }
  }

  // **************************************
  // QbfButton: instance
  // **************************************
  public buttonLabel: string

  // ------------------------------------------------------------------------------
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // ------------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    this.buttonLabel = this.name
    this.storage = false
    const buttonLabel = schema[QbForm.nonStandardPrefix + "buttonLabel"]
    if (buttonLabel) {
      this.buttonLabel = buttonLabel
    }
  }

  // ------------------------------------------------------------------------------
  public setProperty(property: string, value: any): void {
  // ------------------------------------------------------------------------------
  }

  // ------------------------------------------------------------------------------
  public getProperty( property: string): any {
  // ------------------------------------------------------------------------------
    let result: any = null
    if ( property === "value") {
      result = null
    }
    return result
  }

  // --------------------------------------------------------------------------
  public buildCanvasHtml(): string {
  // --------------------------------------------------------------------------
    const path = QbForm.convertPathToString( this.elementPath )
    let html = ""
    html += "<button id=\"" + path + "\""
    html += " onClick=\"QbForm.getClass('QbfButton').onClick(event)\""
    html += ">"
    html += this.buttonLabel
    html += "</button>"
    return html
  }
}
