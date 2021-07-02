import QbfChoice, {QbfChoiceDefinition} from "./QbfChoice"

import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"

// ===============================================================================
export default class QbfChoiceRadio {
// ===============================================================================
  // **************************************
  // QbfChoiceRadio: static
  // **************************************
  // ------------------------------------------------------------------------------
  public static buildHtmlDiv( element: QbfChoice): string {
  // ------------------------------------------------------------------------------
    // const qbFormId = element.qbForm.index
    const path = QbForm.convertPathToString(element.elementPath)
    const inputClass = ""
    const inputClassAndStyle = element.buildHtmlClassAndStyle(QbForm.nonStandardPrefix,
                                                              element.displayProperties, inputClass)
    let html = ""
    html += "<div id=\"" + path + "_INPUT\" " + inputClassAndStyle + ">"
    let index = 0
    element.choiceDefinitionList.forEach( (choice: QbfChoiceDefinition) => {
      if ( index > 0 ) { html += "&nbsp;&nbsp;&nbsp;&nbsp;" }
      let label = choice.label
      if (!label) { label = choice.value }
      html += "<input type=\"radio\""
      html += " name=\"" + path + "_INPUT\""
      html += " id=\"" + path + "/" + index + "\""
      html += " value=\"" + choice.value.toString() + "\""
      html += " onchange=\"QbForm.getClass('QbfChoiceRadio').onChange(event)\""
      html += " onclick=\"QbForm.getClass('QbfChoiceRadio').onClick(event)\""
      html += " onfocus=\"QbForm.getClass('QbfChoiceRadio').onFocus(event)\""
      if ( choice.value === element.value) {
        html += " checked"
      }
      html += ">"
      html += "<label id=\"" + path + "/" + index + "\""
      html += "  for=\"" + path + "/" + index + "\""
      html += "  tabindex=0"
      html += "  onkeyup=\"QbForm.getClass('QbfChoiceRadio').onKeyUp(event)\""
      html += ">"
      html += label.replace(" ", "&nbsp;")
      html += "</label>"
      html += "</input>"
      index++
    })
    html += "</div>"
    return html
  }

  // --------------------------------------------------------------------------
  public static getElementPath(event: Event): string | null {
  // --------------------------------------------------------------------------
    let elementPath = null
    if (event.target) {
      const htmlElement = event.target as HTMLElement
      const elementId = htmlElement.id
      const fields = elementId.split("/")
      const indexAsString = fields[fields.length - 1]
      elementPath = elementId.substr( 0, elementId.length - indexAsString.length - 1 )
    }
    return elementPath
  }

  // --------------------------------------------------------------------------
  public static onFocus(event: Event): void {
  // --------------------------------------------------------------------------
    const elementPath = QbfChoiceRadio.getElementPath(event)
    if (elementPath) {
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
    const elementPath = QbfChoiceRadio.getElementPath(event)
    if (elementPath) {
      const element = QbForm.getElementFromElementPath( elementPath )[0]
      if (element) {
        element.sendEvent( "click", element, null )
      }
    }
  }

  // ------------------------------------------------------------------------------
  public static onChange(event: Event): void {
  // ------------------------------------------------------------------------------
    const elementPath = QbfChoiceRadio.getElementPath(event)
    if (elementPath) {
      const element = QbForm.getElementFromElementPath(elementPath)[0]
      const oldValue = element.getProperty("value")
      const htmlElementList = document.getElementsByName(elementPath + "_INPUT")
      if (htmlElementList) {
        htmlElementList.forEach( (htmlElement: HTMLElement) => {
          const choice = htmlElement as HTMLInputElement
          if (choice.checked) {
            element.setProperty("value", choice.value )
          }
        })
      }
      const newValue = element.getProperty("value")
      element.sendEvent( "change", element, { oldValue, newValue })
    }
  }
  // ------------------------------------------------------------------------------
  public static onKeyUp( event: KeyboardEvent): void {
  // ------------------------------------------------------------------------------
    const elementPath = QbfChoiceRadio.getElementPath(event)
    if (elementPath) {
      const element = QbForm.getElementFromElementPath( elementPath )[0]
      const oldValue = element.getProperty("value")
      element.sendEvent( "keyUp", element, {key: event.key } )

      if (event.key === " " || event.key === "Enter" ) {
        event.preventDefault()
        const htmlElementList = document.getElementsByName(elementPath + "_INPUT")
        if (htmlElementList) {
          htmlElementList.forEach( (htmlElement: HTMLElement) => {
            const choice = htmlElement as HTMLInputElement
            if (choice.labels) {
              if (event.target === choice.labels[0]) {
                choice.checked = true
                element.setProperty("set-value-with-no-display-update", choice.value )
                const newValue = element.getProperty("value")
                if (newValue !== oldValue) {
                  element.sendEvent( "change", element, { oldValue, newValue })
                }
              }
            }
          })
        }
      }
    }
  }
}
