import QbfElement from "../QbForm/QbfElement"
import QbForm from "../QbForm/QbForm"
import QbfBoolean, {QbfBooleanValue} from "./QbfBoolean"

// ===============================================================================
export default abstract class QbfBooleanDisplayAbstract {
// ===============================================================================
  // **************************************
  // QbfBooleanDisplayAbstract: static
  // **************************************
  public static booleanDisplayList: QbfBooleanDisplayAbstract[] = []

  // ------------------------------------------------------------------------------
  public static onFocus(index: number, event: MouseEvent): void {
  // ------------------------------------------------------------------------------
    const elementAbstract = QbfBooleanDisplayAbstract.booleanDisplayList[index] as QbfBooleanDisplayAbstract
    if ( elementAbstract.manageCallbacks ) {
      const element = elementAbstract.parent as QbfBoolean
      element.sendEvent( "focus", element, null)
    }
  }

  // ------------------------------------------------------------------------------
  public static onClick(index: number, event: MouseEvent): void {
  // ------------------------------------------------------------------------------
    let propagate = true
    const elementAbstract = QbfBooleanDisplayAbstract.booleanDisplayList[index] as QbfBooleanDisplayAbstract

    if ( elementAbstract.manageCallbacks ) {
      const element = elementAbstract.parent as QbfBoolean
      propagate = element.sendEvent( "click", element, null)
    }
    if ( propagate ) {
      elementAbstract.changeStatus(event)
    }
  }

  // ------------------------------------------------------------------------------
  public static onKeyDown(index: number, event: KeyboardEvent): void {
  // ------------------------------------------------------------------------------
    if ( event.key === " " ) {
      event.preventDefault() // Prevent scroll
    }
  }

  // ------------------------------------------------------------------------------
  public static onKeyUp(index: number, event: KeyboardEvent): void {
  // ------------------------------------------------------------------------------
    if ( event.key === " " ) {
      let propagate = true
      const elementAbstract = QbfBooleanDisplayAbstract.booleanDisplayList[index] as QbfBooleanDisplayAbstract
      if ( elementAbstract.manageCallbacks ) {
        const element = elementAbstract.parent as QbfBoolean
        propagate = element.sendEvent( "keyUp", element, { key: event.key })
      }
      if ( propagate ) {
        elementAbstract.changeStatus(event)
      }
    }
  }

  // **************************************
  // QbfBooleanDisplayAbstract: static
  // **************************************
  public index: number
  public parent: QbfElement | null
  public path: string
  public booleanType: string
  public nbStates: number // can be 2 or 3
  public value: QbfBooleanValue
  public catchFocus: boolean
  public manageCallbacks: boolean
  public onChangeObjClass: string | null
  public onChangeFunction: string | null

  public abstract getType(): string

  // ---- CTOR --------------------------------------------------------------------
  // tslint:disable-next-line: member-ordering
  public constructor(parent: QbfElement | null,
                     path: string,
                     nbStates: number,
                     value: QbfBooleanValue,
                     catchFocus: boolean,
                     manageCallbacks: boolean,
                     onChangeObjClass: string | null,
                     onChangeFunction: string | null) {
  // ------------------------------------------------------------------------------
    this.index = QbfBooleanDisplayAbstract.booleanDisplayList.length
    QbfBooleanDisplayAbstract.booleanDisplayList.push(this)
    //
    this.parent = parent
    this.path = path
    this.booleanType = this.getType()
    this.nbStates = nbStates
    this.value = value
    this.catchFocus = catchFocus
    this.manageCallbacks = manageCallbacks
    this.onChangeObjClass = onChangeObjClass
    this.onChangeFunction = onChangeFunction
  }

  // ------------------------------------------------------------------------------
  public getElementId(): string {
  // ------------------------------------------------------------------------------
    return "_qbfBoolean_" + this.index
  }

  // ------------------------------------------------------------------------------
  public setValue(newValue: QbfBooleanValue): void {
  // ------------------------------------------------------------------------------
    this.value = newValue
    // Update display
    const div = QbForm.getElementById( this.getElementId() )
    if ( div ) {
      div.className = this.buildClassList()
    }
  }

  // ------------------------------------------------------------------------------
  public buildHtmlDiv(): string {
  // ------------------------------------------------------------------------------
    let html = ""

    const elementId = this.getElementId()
    const classList = this.buildClassList()
    html += "<div id=\"" + elementId + "\" class=\"" + classList + "\""
    if (this.parent && this.parent.inTable) {
      html += " style=\"width:100%;\""
    }
    html += ">"

    // obox
    html += "<div "
    if ( this.catchFocus ) {
      html += " tabindex=0"
    }
    if ( !this.parent || this.parent.editable ) {
      html += " onclick=\"QbForm.getClass('QbfBooleanDisplayAbstract').onClick(" + this.index + ",event)\""
       // 'onkeydown' to prevent scroll on keyDown
      html += " onkeydown=\"QbForm.getClass('QbfBooleanDisplayAbstract').onKeyDown(" + this.index + ",event)\""
      html += " onkeyup=\"QbForm.getClass('QbfBooleanDisplayAbstract').onKeyUp(" + this.index + ",event)\""
      html += " onfocus=\"QbForm.getClass('QbfBooleanDisplayAbstract').onFocus(" + this.index + ",event)\""
    }
    html += ">"
    // ibox + chekMark
    html += "<div><div></div></div>"
    html += "</div>" // obox

    html += "</div>"
    return html
  }

  // ------------------------------------------------------------------------------
  public buildClassList(): string {
  // ------------------------------------------------------------------------------
    let theme = "default"
    if ( this.parent ) {
      theme = this.parent.theme
    }
    const elementClass = "_qbf-" + theme + "_" + this.booleanType
    let elementClassList = elementClass
    switch (this.value) {
      case QbfBooleanValue.UNKNOWN:
        elementClassList += " " + elementClass + "_unknown"
        break
      case QbfBooleanValue.FALSE:
        elementClassList += " " + elementClass + "_false"
        break
      case QbfBooleanValue.TRUE:
        elementClassList += " " + elementClass + "_true"
        break
    }
    if ( this.parent ) {
      if ( !this.parent.editable ) {
        elementClassList += " " + elementClass + "_disabled"
      }
    }
    return elementClassList
  }

  // ------------------------------------------------------------------------------
  public changeStatus(event: Event): void {
  // ------------------------------------------------------------------------------
    const oldValue = this.value
    let newValue = this.value

    // calculate new value
    if (this.nbStates === 2) {
      switch (oldValue) {
        case QbfBooleanValue.UNKNOWN: newValue = QbfBooleanValue.TRUE; break
        case QbfBooleanValue.FALSE: newValue = QbfBooleanValue.TRUE; break
        case QbfBooleanValue.TRUE: newValue = QbfBooleanValue.FALSE; break
      }
    } else {
      // nbStates = 3
      switch (oldValue) {
        case QbfBooleanValue.UNKNOWN: newValue = QbfBooleanValue.TRUE; break
        case QbfBooleanValue.FALSE: newValue = QbfBooleanValue.UNKNOWN; break
        case QbfBooleanValue.TRUE: newValue = QbfBooleanValue.FALSE; break
      }
    }

    this.value = newValue
    // Update display
    const div = QbForm.getElementById( this.getElementId() )
    if ( div ) {
      const newClassName = this.buildClassList()
      div.className = newClassName
    }

    let propagate = true
    if ( this.manageCallbacks ) {
      const element = this.parent as QbfBoolean
      propagate = element.sendEvent( "change", element, { oldValue, newValue })
    }

    // Callback
    if ( this.onChangeObjClass && this.onChangeFunction && propagate ) {
      let parentId = "null"
      if ( this.parent ) {
        const parentPath = QbForm.convertPathToString(this.parent.elementPath)
        parentId = "\"" + parentPath + "\""
      }
      const command = "QbForm.getClass('" + this.onChangeObjClass + "')."
                     + this.onChangeFunction + "(" + parentId + "," + oldValue + "," + this.value + ")"
      // tslint:disable-next-line: no-eval
      eval(command)
    }
  }
}
