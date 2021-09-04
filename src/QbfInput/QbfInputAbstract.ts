import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbfFramedElement from "../QbForm/QbfFramedElement"
import QbForm from "../QbForm/QbForm"
import QbfPropertyTools from "../QbForm/QbfPropertyTools"

// ============================================================================
export default abstract class QbfInputAbstract extends QbfFramedElement {
// ============================================================================
  // **************************************
  // QbfInputAbstract: static
  // **************************************
  public static textAreaForHtmlEncodingID: string = "__QbfToolEncodingArea"
  public static listDiv: HTMLDivElement | null = null
  public static listElement: QbfInputAbstract | null = null
  public static overListValue: boolean = false
  public static lastBlurEvent: Event | null = null
  // Property name prefixes
  public static input = ""
  public static inputLeft = "inputLeft"
  public static inputCenter = "inputCenter"
  public static inputRight = "inputRight"

  // --------------------------------------------------------------------------
  public static setInputProperties(element: QbfInputAbstract,
                                   schema: IQbfSchema,
                                   setFrameProperties: boolean = true): boolean {
  // --------------------------------------------------------------------------
    let result = false
    if ( setFrameProperties ) {
      result = result || QbfFramedElement.setFramedElementProperties( element, schema )
    }
    if (schema[QbForm.nonStandardPrefix + "inputLeftText"]) {
      element.inputLeftText = schema[QbForm.nonStandardPrefix + "inputLeftText"]
      result = true
    }
    if (schema[QbForm.nonStandardPrefix + "inputRightText"]) {
      element.inputRightText = schema[QbForm.nonStandardPrefix + "inputRightText"]
      result = true
    }
    // -- suggestedEnum
    const suggestedEnum = schema[QbForm.nonStandardPrefix + "suggestedEnum"]
    if ( suggestedEnum && (typeof suggestedEnum === "object") ) {
      element.suggestedEnum = []
      const len = Object.keys(suggestedEnum).length
      for (let i = 0; i < len; i++) {
        element.suggestedEnum.push(suggestedEnum[i])
      }
      result = true
    }
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfInputAbstract.input,
                                                                   element.displayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfInputAbstract.inputLeft,
                                                                   element.inputLeftDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfInputAbstract.inputCenter,
                                                                   element.inputCenterDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties(schema, QbForm.nonStandardPrefix + QbfInputAbstract.inputRight,
                                                                   element.inputRightDisplayProperties) || result
    return result
  }

  // --------------------------------------------------------------------------
  public static getInputProperty(element: QbfInputAbstract, property: string): any {
  // --------------------------------------------------------------------------
    let result: any = QbfFramedElement.getFramedElementProperty(element, property)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.displayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.inputLeftDisplayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.inputCenterDisplayProperties, result)
    result = QbfPropertyTools.getElementDisplayProperty(property, element.inputRightDisplayProperties, result)
    return result
  }

  // --------------------------------------------------------------------------
  public static icon_onMouseOver(path: string, event: MouseEvent): void {
  // --------------------------------------------------------------------------
    const tableHtml = QbForm.getElementById(path + "_INPUT") as HTMLTableRowElement
    if (tableHtml ) {
      const qbfElementList: QbfElement[] = QbForm.getElementFromElementPath(path)
      const element = qbfElementList[0] as QbfInputAbstract
      element.overListIcon = true
      if (element.inTable) {
        tableHtml.classList.remove("_qbftdc-" + element.theme + "_input_hover")
      } else {
        tableHtml.classList.remove("_qbf-" + element.theme + "_input_hover")
      }
    }
  }

  // --------------------------------------------------------------------------
  public static icon_onMouseLeave(path: string, event: MouseEvent): void {
  // --------------------------------------------------------------------------
    const tableHtml = QbForm.getElementById(path + "_INPUT") as HTMLTableRowElement
    if (tableHtml ) {
      const qbfElementList: QbfElement[] =  QbForm.getElementFromElementPath(path)
      const element = qbfElementList[0] as QbfInputAbstract
      element.overListIcon = false
      if (element.inTable) {
        tableHtml.classList.add("_qbftdc-" + element.theme + "_input_hover")
      } else {
        tableHtml.classList.add("_qbf-" + element.theme + "_input_hover")
      }
    }
  }

  // --------------------------------------------------------------------------
  public static htmlEncode(data: any): string | null {
  // --------------------------------------------------------------------------
    const result = data.replace("&", "&amp;")
                       .replace("<", "&lt;")
                       .replace(">", "&gt;")
                       .replace('"', "&quot;")
                       .replace("'", "&#039;")
    return result
  }

  // --------------------------------------------------------------------------
  public static onFocus(event: Event): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const input = event.target as HTMLInputElement
      const elementPath = input.id.substr(0, input.id.length - "_INPUTCENTER".length)
      const targetIdSuffix = "INPUT"
      const focus = true
      QbfFramedElement.setElementFocus(elementPath, targetIdSuffix, focus)
      const qbfElementList: QbfElement[] = QbForm.getElementFromElementPath(elementPath)
      const element = qbfElementList[0] as QbfInputAbstract
      if ( !element.focusWithNoList ) {
        // Update List display
        const qbFormId = 1
        // const qbForm = QbForm.qbFormMap.get(qbFormId)
        if (element.suggestedEnum) {
          element.listDisplayed = true
          element.updateListDisplay()
        }
      }
      element.focusWithNoList = false

      element.sendEvent( "focus", element, null )
    }
  }

  // --------------------------------------------------------------------------
  public static onBlur(event: Event): void {
  // --------------------------------------------------------------------------
    setTimeout( QbfInputAbstract.onBlurDelayed , 200, event )
  }

  // --------------------------------------------------------------------------
  public static onBlurDelayed(event: Event): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const input = event.target as HTMLInputElement
      const elementPath = input.id.substr(0, input.id.length - "_INPUTCENTER".length)
      const targetIdSuffix = "INPUT"
      const qbfElementList: QbfElement[] = QbForm.getElementFromElementPath(elementPath)
      const element = qbfElementList[0] as QbfInputAbstract
      if (element) {
        if (element.noBlur) {
          element.focusWithNoList = true
          const functionEx = "QbForm.getElementById('" + input.id + "')?.focus()"
          setTimeout( functionEx , 0 )
        } else {
            element.listDisplayed = false
            const focus = false
            QbfFramedElement.setElementFocus(elementPath, targetIdSuffix, focus)
            element.updateListDisplay()
        }
        element.noBlur = false
      }
    }
  }

  // --------------------------------------------------------------------------
  public static onKeyUp(event: KeyboardEvent): void {
  // --------------------------------------------------------------------------
    if (event.target) {
      const input = event.target as HTMLInputElement
      const elementPath = input.id.substr(0, input.id.length - "_INPUTCENTER".length)
      const qbfElementList: QbfElement[] = QbForm.getElementFromElementPath(elementPath)
      const element = qbfElementList[0] as QbfInputAbstract
      if (element.listDisplayed) {
        const inputHtml = event.target as HTMLInputElement
        if (inputHtml && QbfInputAbstract.listDiv) {
          const pattern = inputHtml.value.toLowerCase()
          const html = element.buildListHtml(pattern)
          QbfInputAbstract.listDiv.innerHTML = html
        }
      }
      element.sendEvent("keyUp", element, { key: event.key } )
    }
  }

  // ------------------------------------------------------------------------------
  public static onChangePasswordDisplay(event: Event): void {
  // ------------------------------------------------------------------------------
    if (event.target) {
      const eyeDiv = event.target as HTMLInputElement
      const elementPath = eyeDiv.id.substring(0, eyeDiv.id.length - "_PWDDISPLAY".length)
      const inputHtml = QbForm.getElementById(elementPath + "_INPUTCENTER") as HTMLInputElement
      const qbfElementList: QbfElement[] =  QbForm.getElementFromElementPath(elementPath)
      const input = qbfElementList[0] as QbfInputAbstract
      const classPrefix = input.inTable ? "_qbftdc" : "_qbf"
      if (inputHtml) {
        input.pwdDisplayed = !input.pwdDisplayed
        if (input.pwdDisplayed) {
          if ( inputHtml ) {
            inputHtml.type = "text"
          }
          if ( eyeDiv ) {
            eyeDiv.className = classPrefix + "-" + input.theme + "_input_eyeIcon_on"
          }
        } else {
          if ( inputHtml ) {
            inputHtml.type = "password"
          }
          if ( eyeDiv ) {
            eyeDiv.className = classPrefix + "-" + input.theme + "_input_eyeIcon_off"
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------------------
  public static onShowList(event: Event): void {
  // ------------------------------------------------------------------------------
    if (event.target) {
      const listIconDiv = event.target as HTMLInputElement
      const elementPath = listIconDiv.id.substring(0, listIconDiv.id.length - "_LISTICON".length)
      const qbfElementList: QbfElement[] =  QbForm.getElementFromElementPath(elementPath)
      const element = qbfElementList[0] as QbfInputAbstract
      const inputHtml = QbForm.getElementById(elementPath + "_INPUT") as HTMLTableCellElement
      element.listDisplayed = !element.listDisplayed
      element.focusWithNoList = true
      element.noBlur = true
      element.updateListDisplay()
      inputHtml.focus()
    }
  }

  // ------------------------------------------------------------------------------
  public static onClickOnListValue(elementPath: string, valueIndex: number): void {
  // ------------------------------------------------------------------------------
    QbfInputAbstract.overListValue = false
    const inputCenterPath = elementPath + "_INPUTCENTER"
    const inputCenterHtml = QbForm.getElementById(inputCenterPath) as HTMLInputElement
    const qbfElementList: QbfElement[] =  QbForm.getElementFromElementPath(elementPath)
    const element = qbfElementList[0] as QbfInputAbstract
    if (inputCenterHtml && element && element.suggestedEnum) {
      const value: any = element.suggestedEnum[valueIndex]
      inputCenterHtml.value = value
      element.setProperty("value", value)

      element.listDisplayed = false
      element.updateListDisplay()
      element.focusWithNoList = true
      inputCenterHtml.focus()
      element.noBlur = true
    }
  }

  // **************************************
  // QbfInputAbstract: instance
  // **************************************
  // Display properties
  public displayProperties: Map<string, string> = new Map<string, string>()
  public inputLeftDisplayProperties: Map<string, string> = new Map<string, string>()
  public inputCenterDisplayProperties: Map<string, string> = new Map<string, string>()
  public inputRightDisplayProperties: Map<string, string> = new Map<string, string>()
  public eyeIconDisplayProperties: Map<string, string> = new Map<string, string>()
  public listIconDisplayProperties: Map<string, string> = new Map<string, string>()
  // Left/Right
  public inputLeftText: string = ""
  public inputRightText: string = ""
  // list
  public suggestedEnum: any[] | null = null
  public listDisplayed: boolean = false
  public overListIcon: boolean = false
  // password display
  public pwdDisplayed: boolean = true
  public eyeIcon: boolean = false // add eye indicator to dataSuffix (password)
  // focus management
  public focusWithNoList: boolean = false
  public noBlur: boolean = false

  public abstract buildInputCenterHtml(): string

  // --------------------------------------------------------------------------
  // tslint:disable-next-line: member-ordering
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // --------------------------------------------------------------------------
    super(qbForm, parent, name, inTable, schema)
    QbfInputAbstract.setInputProperties (this, schema, false)
  }

  // --------------------------------------------------------------------------
  public buildCanvasHtml(): string {
  // --------------------------------------------------------------------------
    // const qbFormId = this.qbForm.index
    const path = QbForm.convertPathToString(this.elementPath)
    let inputClass = "_qbf-" + this.theme + "_input"
    let inputLeftClass = "_qbf-" + this.theme + "_input_left"
    let inputRightClass = "_qbf-" + this.theme + "_input_right"
    let eyeIconClass = "_qbf-" + this.theme + "_input_eyeIcon_off"
    let listIconClass = "_qbf-" + this.theme + "_input_listIcon"
    if (this.editable) {
      inputClass += " _qbf-" + this.theme + "_input_hover"
    } else {
      inputClass += " _qbf-" + this.theme + "_input_disabled"
      inputLeftClass = " _qbf-" + this.theme + "_input_left_disabled"
      inputRightClass = " _qbf-" + this.theme + "_input_right_disabled"
      eyeIconClass += " _qbf-" + this.theme + "_input_eyeIcon_off_disabled"
      listIconClass += " _qbf-" + this.theme + "_input_listIcon_disabled"
    }
    if ( this.inTable) {
      inputClass = "_qbftdc-" + this.theme + "_input"
      inputLeftClass = "_qbftdc-" + this.theme + "_input_left"
      inputRightClass = "_qbftdc-" + this.theme + "_input_right"
      eyeIconClass = "_qbftdc-" + this.theme + "_input_eyeIcon_off"
      listIconClass = "_qbftdc-" + this.theme + "_input_listIcon"
      if (this.editable) {
        inputClass += " _qbftdc-" + this.theme + "_input_hover"
        inputLeftClass += " _qbftdc-" + this.theme + "_input_left_hover"
        inputRightClass += " _qbftdc-" + this.theme + "_input_right_hover"
      } else {
        inputClass += " _qbftdc-" + this.theme + "_input_disabled"
        inputLeftClass += " _qbftdc-" + this.theme + "_input_left_disabled"
        inputRightClass += " _qbftdc-" + this.theme + "_input_right_disabled"
        eyeIconClass += " _qbftdc-" + this.theme + "_input_eyeIcon_off_disabled"
        listIconClass += " _qbftdc-" + this.theme + "_input_listIcon_disabled"
      }

    }
    const inputClassAndStyle = this.buildHtmlClassAndStyle(QbForm.nonStandardPrefix,
                                                         this.displayProperties, inputClass)
    const inputLeftClassAndStyle = this.buildHtmlClassAndStyle(QbForm.nonStandardPrefix + "inputLeft",
                                                             this.inputLeftDisplayProperties, inputLeftClass)
    const inputRightClassAndStyle = this.buildHtmlClassAndStyle(QbForm.nonStandardPrefix + "inputRight",
                                                              this.inputRightDisplayProperties, inputRightClass)
    const eyeIconClassAndStyle = this.buildHtmlClassAndStyle(QbForm.nonStandardPrefix + "eyeIcon",
                                                           this.eyeIconDisplayProperties, eyeIconClass)
    const listIconClassAndStyle = this.buildHtmlClassAndStyle(QbForm.nonStandardPrefix + "listIcon",
                                                             this.listIconDisplayProperties, listIconClass)

    let html = ""
    html += "<div id=\"" + path + "_INPUT\"" + inputClassAndStyle + ">"

    html += "<div id=\"" + path + "_INPUTLEFT\"" + inputLeftClassAndStyle  + ">"
    html += this.inputLeftText
    html += "</div>"

    html += "<div style=\"flex: 1;\">"
    html += this.buildInputCenterHtml()
    html += "</div>"

    html += "<div id=\"" + path + "_INPUTRIGHT\"" + inputRightClassAndStyle + ">"
    html += this.inputRightText
    html += "</div>"
    // -- eyeIcon (password)
    if (this.eyeIcon) {
      const divWidthAsAny = QbForm.getCssStyleProperty(eyeIconClass, "width")
      const divWidth = (divWidthAsAny) ? divWidthAsAny.toString() : "25px"
      html += "<div "
      html += " class=\"_qbf-" + this.theme + "_input_eyeIcon_cell\""
      html += " style=\"width: " + divWidth + ";\""
      html += ">"
      html += "&nbsp;"
      html += "<div id=\"" + path + "_PWDDISPLAY\"" + eyeIconClassAndStyle
      if (this.editable) {
        html += " onclick=\"QbForm.getClass('QbfInputAbstract').onChangePasswordDisplay(event)\""
        html += " onmouseover=\"QbForm.getClass('QbfInputAbstract').icon_onMouseOver('" + path + "',event)\""
        html += " onmouseleave=\"QbForm.getClass('QbfInputAbstract').icon_onMouseLeave('" + path + "',event)\""
      }
      html += "></div>"
      html += "</div>"
    }
    // -- listIcon
    if ( this.suggestedEnum) {
      const divWidthAsAny = QbForm.getCssStyleProperty(listIconClass, "width")
      const divWidth = (divWidthAsAny) ? divWidthAsAny.toString() : "25px"
      html += "<div"
      html += " class=\"_qbf-" + this.theme + "_input_listIcon_cell\""
      html += " style=\"width: " + divWidth + ";\""
      html += ">"
      html += "&nbsp;"
      html += "<div id=\"" + path + "_LISTICON\"" + listIconClassAndStyle
      if (this.editable) {
        html += " onclick=\"QbForm.getClass('QbfInputAbstract').onShowList(event)\""
        html += " onmouseover=\"QbForm.getClass('QbfInputAbstract').icon_onMouseOver('" + path + "',event)\""
        html += " onmouseleave=\"QbForm.getClass('QbfInputAbstract').icon_onMouseLeave('" + path + "',event)\""
      }
      html += "></div>"
      html += "</div>"
    }

    html += "</div>" // path_INPUT
    return html
  }

  // ------------------------------------------------------------------------------
  public updateListDisplay(): void {
  // ------------------------------------------------------------------------------
    // Create listDiv (if needed)
    if (!QbfInputAbstract.listDiv) {
      QbfInputAbstract.listDiv = document.createElement("div")
      document.body.appendChild(QbfInputAbstract.listDiv)
      QbfInputAbstract.listDiv.style.visibility = "hidden"
      QbfInputAbstract.listDiv.style.position = "absolute"
    }
    const listDiv = QbfInputAbstract.listDiv
    if ( this.listDisplayed ) {
      // - - - - - - - - - - - - -
      // Case 1: DISPLAY ON
      // - - - - - - - - - - - - -
      const path = QbForm.convertPathToString(this.elementPath)
      const inputPath = path + "_INPUT"
      const inputHtml = QbForm.getElementById(inputPath) as HTMLDivElement
      if (listDiv && inputHtml) {
        const rect = inputHtml.getBoundingClientRect()
        const xPos = rect.x + window.scrollX - 2
        const yPos = rect.y + rect.height + window.scrollY + 2
        const width = rect.width + 100
        listDiv.className = "_qbf-" + this.theme + "_input_list"
        listDiv.style.left = "" + xPos + "px"
        listDiv.style.top = "" + yPos + "px"
        listDiv.style.width = "" + width + "px"
        let pattern = ""
        const inputCenterHtml = QbForm.getElementById(path + "_INPUTCENTER") as HTMLInputElement
        if ( inputCenterHtml ) {
          pattern = inputCenterHtml.value
        }
        const html = this.buildListHtml(inputCenterHtml.value)
        listDiv.innerHTML = html
        listDiv.style.visibility = "visible"
        QbfInputAbstract.listElement = this
      }
    } else {
      // - - - - - - - - - - - - -
      // Case 2: DISPLAY OFF
      // - - - - - - - - - - - - -
      if ( QbfInputAbstract.listElement === this ) {
        listDiv.style.visibility = "hidden"
        QbfInputAbstract.listElement = this
        QbfInputAbstract.overListValue = false
      }
      QbfInputAbstract.overListValue = false
    }
  }

  // ------------------------------------------------------------------------------
  public buildListHtml(pattern: string): string {
  // ------------------------------------------------------------------------------
    // const qbFormId = this.qbForm.index
    const path = QbForm.convertPathToString(this.elementPath)
    let html = ""
    html += "<table>"
    if (this.suggestedEnum) {
      let elementIndex = 0
      this.suggestedEnum.forEach( (value: any) => {
        const valueLowcase = value.toLowerCase()
        if ( valueLowcase.indexOf(pattern) >= 0 ) {
          html += "<tr>"
          html += "<td"
          html += " onclick=\"QbForm.getClass('QbfInputAbstract').onClickOnListValue('" + path + "'," + elementIndex + ")\""
          html += " onmousedown=\"QbForm.getClass('QbfInputAbstract').overListValue = true\""
          html += ">" + value.toString() + "</td></tr>"
        }
        elementIndex++
      })
    }
    html += "</table>"
    return html
  }
}
