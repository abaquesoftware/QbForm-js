import QbfChoice, {QbfChoiceDefinition} from "./QbfChoice"

import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"

// ===============================================================================
export default class QbfChoiceCombobox {
// ===============================================================================

  // ------------------------------------------------------------------------------
  public static buildHtmlDiv( element: QbfChoice): string {
  // ------------------------------------------------------------------------------
    const qbFormId = element.qbForm.index
    const path = QbForm.convertPathToString(element.elementPath)
    let inputClass = ""
    if ( element.inTable) {
      inputClass = "_qbftdc-" + element.theme + "_input _qbftdc-" + element.theme + "_input_hover"
    } else {
      inputClass = "_qbf-" + element.theme + "_input _qbf-" + element.theme + "_input_hover"
    }
    const inputClassAndStyle = element.buildHtmlClassAndStyle(QbForm.nonStandardPrefix,
                                                              element.displayProperties, inputClass)
    let html = ""
    html += "<div id=\"" + path + "_INPUT\" " + inputClassAndStyle + ">"
    html += "<select id=\"" + path + "_SELECT\" "
    html += " tabindex=0"
    html += " onfocus=\"QbForm.getClass('QbfChoiceCombobox').onFocus(event)\""
    html += " onclick=\"QbForm.getClass('QbfChoiceCombobox').onClick(event)\""
    html += " onblur=\"QbForm.getClass('QbfChoiceCombobox').onBlur(event)\""
    html += " onkeyup=\"QbForm.getClass('QbfChoiceCombobox').onKeyUp(event)\""
    html += " onchange=\"QbForm.getClass('QbfChoiceCombobox').onChange(event)\""
    html += ">"
    element.choiceDefinitionList.forEach( (choice: QbfChoiceDefinition) => {
      html += " <option value=\"" + choice.value + "\""
      if ( choice.value === element.value) {
        html += " selected"
      }
      html += ">" + choice.label + "</option>"
    })
    html += "</select>"
    html += "</div>"
    return html
  }

  // --------------------------------------------------------------------------
  public static onFocus(event: Event): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const htmlElement = event.target as HTMLElement
      const elementPath = htmlElement.id.substr(0, htmlElement.id.length - "_SELECT".length)
      const targetIdSuffix = "INPUT"
      const focus = true
      QbfFramedElement.setElementFocus (elementPath, targetIdSuffix, focus)
      const element = QbForm.getElementFromElementPath( elementPath )[0]
      element.sendEvent( "focus", element, null )
    }
  }

  // --------------------------------------------------------------------------
  public static onClick(event: Event): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const htmlElement = event.target as HTMLElement
      const elementPath = htmlElement.id.substr(0, htmlElement.id.length - "_SELECT".length)
      const element = QbForm.getElementFromElementPath( elementPath )[0]
      if ( element ) {
        element.sendEvent( "click", element, null )
      }
    }
  }

  // --------------------------------------------------------------------------
  public static onBlur(event: Event): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const element = event.target as HTMLElement
      const elementPath = element.id.substr(0, element.id.length - "_SELECT".length)
      const targetIdSuffix = "INPUT"
      const focus = false
      QbfFramedElement.setElementFocus (elementPath, targetIdSuffix, focus)
    }
  }

  // --------------------------------------------------------------------------
  public static onKeyUp(event: KeyboardEvent): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const htmlElement = event.target as HTMLElement
      const elementPath = htmlElement.id.substr(0, htmlElement.id.length - "_SELECT".length)
      const element = QbForm.getElementFromElementPath( elementPath )[0]
      element.sendEvent( "keyUp", element, { key: event.key } )
    }
  }

  // ------------------------------------------------------------------------------
  public static onChange(event: Event): void {
  // ------------------------------------------------------------------------------
    if (event.target) {
      const htmlElement = event.target as HTMLElement
      const elementPath = htmlElement.id.substr(0, htmlElement.id.length - "_SELECT".length)
      const element = QbForm.getElementFromElementPath(elementPath)[0]
      const elementSelectHtml = htmlElement as HTMLSelectElement
      const oldValue = element.getProperty("value")
      const newValue = elementSelectHtml.value
      element.setProperty("value", elementSelectHtml.value )
      element.sendEvent( "change", element, { oldValue, newValue })
    }
  }
}
