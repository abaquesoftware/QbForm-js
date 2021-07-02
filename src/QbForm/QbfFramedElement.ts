import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbForm from "../QbForm/QbForm"
import QbfPropertyTools from "./QbfPropertyTools"

// ============================================================================
export default abstract class QbfFramedElement extends QbfElement {
// ============================================================================
  // **************************************
  // QbfFramedElement: static
  // **************************************
  // Property name prefixes
  public static frameBox = "frameBox"
  public static frameTop = "frameTop"
  public static frameBottom = "frameBottom"
  public static frameLeft = "frameLeft"
  public static frameRight = "frameRight"

  // --------------------------------------------------------------------------
  public static setFramedElementProperties(element: QbfFramedElement, schema: IQbfSchema): boolean {
  // --------------------------------------------------------------------------
    let result = false
    const schemaKeys = Object.keys(schema)
    if ( schemaKeys.indexOf(QbForm.nonStandardPrefix + "frameBoxText") >= 0 ) {
      element.frameBoxText = schema[QbForm.nonStandardPrefix + "frameBoxText"]
    }
    if (schema[QbForm.nonStandardPrefix + "frameTopText"]) {
      element.frameTopText = schema[QbForm.nonStandardPrefix + "frameTopText"]
      result = true
    }
    if (schema[QbForm.nonStandardPrefix + "frameBottomText"]) {
      element.frameBottomText = schema[QbForm.nonStandardPrefix + "frameBottomText"]
      result = true
    }
    if (schema[QbForm.nonStandardPrefix + "frameLeftText"]) {
      element.frameLeftText = schema[QbForm.nonStandardPrefix + "frameLeftText"]
      result = true
    }
    if (schema[QbForm.nonStandardPrefix + "frameRightText"]) {
      element.frameRightText = schema[QbForm.nonStandardPrefix + "frameRightText"]
      result = true
    }
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfFramedElement.frameBox,
                                                   element.frameBoxDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfFramedElement.frameTop,
                                                   element.frameTopDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfFramedElement.frameBottom,
                                                   element.frameBottomDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfFramedElement.frameLeft,
                                                   element.frameLeftDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfFramedElement.frameRight,
                                                   element.frameRightDisplayProperties) || result
    result = QbfElement.setElementProperties(element, schema ) || result
    return result
  }

  // --------------------------------------------------------------------------
  public static getFramedElementProperty(element: QbfFramedElement, property: string): any {
  // --------------------------------------------------------------------------
    let result: any = null
    result = QbfElement.getElementProperty(element, property)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.frameBoxDisplayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.frameTopDisplayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.frameBottomDisplayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.frameLeftDisplayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.frameRightDisplayProperties, result)
    return result
  }

  // --------------------------------------------------------------------------
  public static setElementFocus(elementPath: string, targetIdSuffix: string, focus: boolean): void {
  // --------------------------------------------------------------------------
    // Update class
    const elementDataHtml = QbForm.getElementById(elementPath + "_" + targetIdSuffix)
    if (elementDataHtml) {
      // Build a list of all existing classes
      const CssRuleNameList: string[] = []
      let xCssRule = null
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < document.styleSheets.length; i++) {
        let bOk = false
        try {
          const styleSheet: CSSStyleSheet = document.styleSheets[i]
          xCssRule = styleSheet.rules
          bOk = true
        } catch (e) {
          if (e.name !== "SecurityError") { throw e }
        }
        if ( bOk && xCssRule ) {
          // tslint:disable-next-line: prefer-for-of
          for (let j = 0; j < xCssRule.length; j++) {
            const cssRule: CSSRule = xCssRule[j]
            if (cssRule instanceof CSSStyleRule) {
              CssRuleNameList.push(cssRule.selectorText)
            }
          }
        }
      }

      // Parse classes of "elementDataHtml"
      elementDataHtml.classList.forEach( (className: string) => {
        if (focus) {
          // Case 1 : focus = true
          if (className.startsWith("_") && CssRuleNameList.indexOf("." + className + "_focus") >= 0) {
          if (elementDataHtml) {
              elementDataHtml.classList.add(className + "_focus")
            }
          }
          if (className.startsWith("_") && className.endsWith("_hover") ) {
            if (elementDataHtml) {
              elementDataHtml.classList.remove(className)
            }
          }
        } else {
          // Case 2 : focus = false
          if (className.startsWith("_") && className.endsWith("_focus")) {
            if (elementDataHtml) {
              const hoverClassName = className.replace("_focus", "_hover")
              elementDataHtml.classList.replace(className, hoverClassName)
            }
          }
        }
      })
    }
  }

  // **************************************
  // QbfFramedElement: instance
  // **************************************
  // Display properties
  public frameBoxDisplayProperties: Map<string, string> = new Map<string, string>()
  public frameTopDisplayProperties: Map<string, string> = new Map<string, string>()
  public frameBottomDisplayProperties: Map<string, string> = new Map<string, string>()
  public frameLeftDisplayProperties: Map<string, string> = new Map<string, string>()
  public frameRightDisplayProperties: Map<string, string> = new Map<string, string>()
  // Prefix/Suffix
  public frameBoxText: string | null = null
  public frameTopText: string = ""
  public frameBottomText: string = ""
  public frameLeftText: string = ""
  public frameRightText: string = ""

  public abstract buildCanvasHtml(): string

  // --------------------------------------------------------------------------
  // tslint:disable-next-line: member-ordering
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // --------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    QbfFramedElement.setFramedElementProperties (this, schema)
  }

  // --------------------------------------------------------------------------
  public buildHtml(): string {
  // --------------------------------------------------------------------------
    const path = QbForm.convertPathToString(this.elementPath)
    const cellClass = this.inTable ? "_qbft-" + this.theme + "_cell" : "_qbf-" + this.theme + "_cell"
    const divClass = "_qbf-" + this.theme + "_div"
    const frameBoxClass = "_qbf-" + this.theme + "_frameBox"
    const frameTopClass = "_qbf-" + this.theme + "_frameTop"
    const frameBottomClass = "_qbf-" + this.theme + "_frameBottom"
    const frameLeftClass = "_qbf-" + this.theme + "_frameLeft"
    const frameRightClass = "_qbf-" + this.theme + "_frameRight"

    const divClassAndStyle = this.buildHtmlClassAndStyle("", this.cellDisplayProperties, divClass)
    let cellClassAndStyle = this.buildHtmlClassAndStyle("cell", this.cellDisplayProperties, cellClass)
    const frameBoxClassAndStyle = this.buildHtmlClassAndStyle("frameBox",
                                                              this.frameBoxDisplayProperties, frameBoxClass)
    const frameTopClassAndStyle = this.buildHtmlClassAndStyle("frameTop",
                                                              this.frameTopDisplayProperties, frameTopClass)
    const frameBottomClassAndStyle = this.buildHtmlClassAndStyle("frameBottom",
                                                                 this.frameBottomDisplayProperties, frameBottomClass)
    const frameLeftClassAndStyle = this.buildHtmlClassAndStyle("frameLeft",
                                                               this.frameLeftDisplayProperties, frameLeftClass)
    const frameRightClassAndStyle = this.buildHtmlClassAndStyle("frameRight",
                                                               this.frameRightDisplayProperties, frameRightClass)

    if ( !this.visibility ) {
      cellClassAndStyle += " _qbf-" + this.theme + "_invisible"
    }

    let html = ""
    if (this.inTable) {
      html += "<div id=\"" + path + "_cell\" " + cellClassAndStyle + ">"
      html += this.buildCanvasHtml()
      html += "</div>"
    } else {
      // Cell
      html += "<div id=\"" + path + "_cell\" " + cellClassAndStyle + ">"
      if (this.frameBoxText !== null ) {
        html += "<fieldset " + frameBoxClassAndStyle + ">"
        if (this.frameBoxText !== "" ) {
          html += "<legend>" + this.frameBoxText + "</legend>"
        }
      }
      html += "<div id=\"" + path + "_FRAMETOP\" " + frameTopClassAndStyle + ">"
      html += this.frameTopText
      html += "</div>"
      html += "<div class=\"_qbf-" + this.theme + "_frameCenter\">"

      html += "<div id=\"" + path + "_FRAMELEFT\" " + frameLeftClassAndStyle + ">"
      html += this.frameLeftText
      html += "</div>"
      html += "<div id=\"" + path + "_CANVAS\"" + divClassAndStyle + ">"
      html += this.buildCanvasHtml()
      html += "</div>"
      html += "<div id=\"" + path + "_FRAMERIGHT\" " + frameRightClassAndStyle + ">"
      html += this.frameRightText
      html += "</div>"

      html += "</div>" // Frame Center

      html += "<div id=\"" + path + "_FRAMEBOTTOM\" " + frameBottomClassAndStyle + ">"
      html += this.frameBottomText
      html += "</div>"

      if (this.frameBoxText !== null ) {
        html += "</fieldset>"
      }

      html += "</div>"
    }
    return html
  }

  // ------------------------------------------------------------------------------
  public updateDisplay(): void {
  // ------------------------------------------------------------------------------
    const path = QbForm.convertPathToString(this.elementPath)
    if (this.inTable) {
      const cellElement = QbForm.getElementById(path + "_cell")
      const tableCellElement = cellElement?.parentElement
      if (tableCellElement) {
        const html = this.buildHtml()
        tableCellElement.innerHTML = html
      }
    } else {
      const fieldLabelElement = QbForm.getElementById(path + "_fieldLabel")
      if ( fieldLabelElement ) {
        const html = this.buildLabelHtml()
        fieldLabelElement.innerHTML = html
      }
      const fieldElement = QbForm.getElementById(path + "_field")
      if ( fieldElement ) {
        const html = this.buildHtml()
        fieldElement.innerHTML = html
      }
    }
  }
}
