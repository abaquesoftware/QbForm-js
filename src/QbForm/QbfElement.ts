import QbForm from "../QbForm/QbForm"
import QbfPropertyTools from "./QbfPropertyTools"

// ===========================================================
export interface IQbfSchema {
// ===========================================================
    [index: string]: any
}

// ===========================================================
export default abstract class QbfElement {
// ===========================================================

  // **************************************
  // QbfElement: static
  // **************************************

  public static displayPropertyNames = [
    // size
    "width", "maxWidth", "minWidth", "height", "minHeight", "maxHeight",
    // background
    "background", "backgroundColor", "backgroundImage", "backgroundRepeat",
    "backgroundAttachment", "backgroundPosition",
    // border
    "border", "borderTop", "borderRight", "borderBottom", "borderLeft", "borderColor",
    // font
    "color", "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize",
    "lineHeight", "fontFamily", "textAlign",
    // margin
    "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
    // padding
    "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    // overflow
    "overflow", "overflowX", "overflowY",
    // other
    "opacity", "cursor", "pointerEvents", "touchAction",
  ]

  public static cellPrefix: string = "cell"
  public static labelPrefix: string = "label"

  // Static functions to manage display properties
  // --------------------------------------------------------------------------
  public static setElementProperties(element: QbfElement, schema: IQbfSchema): boolean {
  // --------------------------------------------------------------------------
    let result = false
    const keyList = Object.keys(schema)
    if ( keyList.indexOf( QbForm.nonStandardPrefix + "label") >= 0 ) {
      element.label = schema[ QbForm.nonStandardPrefix + "label"]
      const path = QbForm.convertPathToString(element.elementPath)
      const labelHtml: HTMLElement | null =  QbForm.getElementById(path + "_label")
      if (labelHtml) {
        labelHtml.innerHTML = (element.label) ? (element.label) : ""
      }
    }
    if ( keyList.indexOf(QbForm.nonStandardPrefix + "visibility") >= 0 ) {
      element.visibility = schema[QbForm.nonStandardPrefix + "visibility"]
      const path = QbForm.convertPathToString(element.elementPath)
      const fieldHtml: HTMLElement | null =  QbForm.getElementById(path)
      const trHtml = fieldHtml?.parentElement?.parentElement
      if ( trHtml ) {
        const className = "_qbf-" + element.theme + "_invisible"
        if (element.visibility ) {
          trHtml.classList.remove(className)
        } else {
          if ( !trHtml.classList.contains(className) ) {
            trHtml.classList.add(className)
          }
        }
      }
    }
    if ( keyList.indexOf(QbForm.nonStandardPrefix + "editable") >= 0 ) {
      const editable = schema[QbForm.nonStandardPrefix + "editable"]
      if ( element.editable !== editable ) {
        element.editable = editable
        result = true
      }
    }
    if ( keyList.indexOf(QbForm.nonStandardPrefix + "storage") >= 0 ) {
      element.storage = schema[QbForm.nonStandardPrefix + "storage"]
    }
    result = QbfPropertyTools.addDisplayProperties( schema, "", element.elementDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties( schema, QbForm.nonStandardPrefix + QbfElement.cellPrefix,
                                                    element.cellDisplayProperties) || result
    result = QbfPropertyTools.addDisplayProperties( schema, QbForm.nonStandardPrefix + QbfElement.labelPrefix,
                                                    element.labelDisplayProperties) || result
    return result
  }

  // --------------------------------------------------------------------------
  public static getElementProperty( element: QbfElement, property: string): any {
  // --------------------------------------------------------------------------
    let result: any = null
    property = QbForm.nonStandardPrefix + property
    if ( property === "label" ) {
      result = element.label
    }
    if ( property === "visibility" ) {
      result = element.visibility
    }
    if ( property === "editable" ) {
      result = element.editable
    }
    if ( property === "storage" ) {
      result = element.storage
    }
    if ( !result ) {
      result = QbfPropertyTools.getElementDisplayProperty( property,
                                                           element.elementDisplayProperties, result) || result
      result = QbfPropertyTools.getElementDisplayProperty( property,
                                                           element.cellDisplayProperties, result) || result
      result = QbfPropertyTools.getElementDisplayProperty( property,
                                                           element.labelDisplayProperties, result) || result
    }
    return result
  }

  // --------------------------------------------------------------------------
  public static buildFilterCellHtml(parent: QbfElement, filterId: number, classNames: string): string {
  // --------------------------------------------------------------------------
    return ""
  }

  // **************************************
  // QbfElement: instance
  // **************************************
  public qbForm: QbForm
  public parent: QbfElement | null
  public name: string
  public theme: string = "default"
  public isTable: boolean = false
  public inTable: boolean
  public elementPath: string[] = []
  public label: string | null = null
  public editable: boolean = true
  public visibility: boolean = true
  public storage: boolean = true
  public cbMap: Map<string, (element: string[], cbName: string, input: object | null) => boolean>
              = new Map<string, (element: string[], cbName: string, input: object | null) => boolean>()

  // display properties
  public elementDisplayProperties: Map<string, string> = new Map<string, string>()
  public cellDisplayProperties: Map<string, string> = new Map<string, string>()
  public labelDisplayProperties: Map<string, string> = new Map<string, string>()

  // public cssClassMap: Map<string, string>

  // Mandatory (must be implemented)
  public abstract setProperty( property: string, value: any): void
  public abstract getProperty( property: string): any
  public abstract buildHtml(): string
  // Optional
  public compareTo(other: QbfElement): number { return 0 }

  // --------------------------------------------------------------------------
  // tslint:disable-next-line: member-ordering
  public constructor(qbForm: QbForm,
                     parent: QbfElement | null,
                     name: string,
                     inTable: boolean,
                     schema: IQbfSchema) {
  // --------------------------------------------------------------------------
    this.qbForm = qbForm
    this.parent = parent
    this.name = name
    this.inTable = inTable
    this.theme = "default"
    if ( parent ) {
      this.theme = parent.theme
    } else {
      this.theme = qbForm.theme
    }
    if ( parent && ( parent.name !== "/" || parent.parent ) ) {
      this.elementPath = [ ...parent.elementPath , name ]
    } else {
      this.elementPath = [ name ]
    }
    const id = QbForm.convertPathToString( this.elementPath )
    this.qbForm.elementMap.set(id, this)
    this.label = null
    this.cbMap = new Map<string, (inputParam: object | null) => boolean>()

    this.label = this.name
    // this.cssClassMap = new Map<string, string>()
    QbfElement.setElementProperties( this, schema)
  }

  // --------------------------------------------------------------------------
  public setCallback( cbName: string, cb: (element: string[], cbName: string, input: object | null) => boolean): void {
  // --------------------------------------------------------------------------
    this.cbMap.set(cbName, cb)
  }

  // --------------------------------------------------------------------------
  public sendEvent( eventName: string, targetElement: QbfElement, params: any): boolean {
  // --------------------------------------------------------------------------
    let propagate = true
    eventName = eventName.toLowerCase()
    const cb = this.cbMap.get("on" + eventName )
    if ( cb ) {
      propagate = cb( targetElement.elementPath, eventName, params )
    }
    if ( propagate && this.parent) {
      propagate = this.parent.sendEvent(eventName, targetElement, params )
    }
    return propagate
  }

  // type = "", "cell", "inputLeft", ...
  // --------------------------------------------------------------------------
  public buildStyle(type: string, displayPropertyMap: Map<string, string>): string | null {
  // --------------------------------------------------------------------------
    let result = null
    if (displayPropertyMap.size > 0) {
      let propertyExists = false
      displayPropertyMap.forEach( (value: string, key: string) => {
        if (key !== QbForm.nonStandardPrefix + "class") {
          propertyExists = true
        }
      })
      if ( propertyExists ) {
        const cssSheet = this.qbForm.style?.sheet
        if ( cssSheet ) {
          let cssRuleName = QbForm.convertPathToString( this.elementPath )
          while ( cssRuleName.indexOf("/") > -1 ) {
            cssRuleName = cssRuleName.replace("/", "__")
          }
          cssRuleName += "_" + type
          cssSheet.insertRule("." + cssRuleName + " {}")
          displayPropertyMap.forEach( (value: string, key: string) => {
            if (key !== QbForm.nonStandardPrefix + "class") {
              const keyEx = (key.startsWith(QbForm.nonStandardPrefix)) ?
                            key.substr(QbForm.nonStandardPrefix.length) : key
              const propertyName = QbfPropertyTools.convertPropertyName(keyEx)
              cssSheet?.addRule( "." + cssRuleName, propertyName + ": " + value )
            }
          })
          result = cssRuleName
        }
      }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public buildHtmlClassAndStyle(type: string, displayPropertyMap: Map<string, string>, initialClass: string): string {
  // --------------------------------------------------------------------------
    let result: string = ""
    if (displayPropertyMap.size > 0 || initialClass !== "") {
      const className = displayPropertyMap.get(QbForm.nonStandardPrefix + "class")
      const styleClassName = this.buildStyle(type, displayPropertyMap)

      if (initialClass !== "" || !className || styleClassName ) {
        result += " class=\""
        if ( initialClass !== "" )  { result += initialClass + " " }
        if ( className ) { result += className + " " }
        if ( styleClassName ) { result += styleClassName + " " }
        result += "\""
      }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public buildLabelHtml(): string {
  // --------------------------------------------------------------------------
    const path = QbForm.convertPathToString(this.elementPath)
    const labelClass = "_qbf-" + this.theme + "_label"
    let labelClassAndStyle = this.buildHtmlClassAndStyle("label", this.labelDisplayProperties, labelClass)
    if ( !this.visibility ) {
      labelClassAndStyle += " _qbf-" + this.theme + "_invisible"
    }

    let html = ""
    // Label
    if ( this.name !== "/" && this.parent !== null) {
      html += "<div " + labelClassAndStyle + ">" + this.label + "</div>"
    }
    return html
  }

  // --------------------------------------------------------------------------
  public filter(filterData: Map<string, any>): boolean {
  // --------------------------------------------------------------------------
    return true
  }

  // --------------------------------------------------------------------------
  public setElemenProperty(property: string, value: string): void {
  // --------------------------------------------------------------------------
    property = property.toLowerCase()
    if (QbfElement.displayPropertyNames.indexOf(property) >= 0) {
      this.elementDisplayProperties.set(property, value)
      const elementPath = QbForm.convertPathToString(this.elementPath)
      const htmlElement = QbForm.getElementById(elementPath)
      if (htmlElement) {
        QbfPropertyTools.setDisplayProperty(htmlElement, property, value)
      }
    }
  }

  // --------------------------------------------------------------------------
  public getCell(): HTMLTableDataCellElement | null {
  // --------------------------------------------------------------------------
    const elementPath = QbForm.convertPathToString(this.elementPath)
    let htmlElement = QbForm.getElementById(elementPath)
    let childElement = null
    let result = null
    while (result === null && htmlElement && (childElement !== htmlElement) ) {
      if (htmlElement instanceof HTMLTableDataCellElement) {
        result = htmlElement
      } else {
        childElement = htmlElement
        htmlElement = htmlElement.parentElement
      }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public getLabel(): HTMLTableDataCellElement | null {
  // --------------------------------------------------------------------------
    let result = null
    const elementPath = QbForm.convertPathToString(this.elementPath)
    const htmlElement = QbForm.getElementById(elementPath)
    const cellHtml = this.getCell()
    if ( htmlElement && cellHtml ) {
      const rowHtml = cellHtml.parentElement
      if (rowHtml) {
        result = rowHtml.children[0] as HTMLTableDataCellElement
      }
    }
    if (result === htmlElement) {
      result = null
    }
    return result
  }

  // --------------------------------------------------------------------------
  public setCellDisplayProperty(property: string, value: string): void {
  // --------------------------------------------------------------------------
    const cellPrefix = QbForm.nonStandardPrefix + QbfElement.cellPrefix
    property = property.toLowerCase()
    if (property.startsWith(cellPrefix)) {
      property = property.substr(cellPrefix.length)
    }
    if (QbfElement.displayPropertyNames.indexOf(property) >= 0) {
      this.elementDisplayProperties.set(property, value)
      const cellHtml = this.getCell()
      if (cellHtml) {
        QbfPropertyTools.setDisplayProperty(cellHtml, property, value)
      }
    }
  }

  // --------------------------------------------------------------------------
  public setLabelDisplayProperty(property: string, value: string): void {
  // --------------------------------------------------------------------------
    const labelPrefix = QbForm.nonStandardPrefix + QbfElement.labelPrefix
    property = property.toLowerCase()
    if (property.startsWith(labelPrefix)) {
      property = property.substr(labelPrefix.length)
    }
    if (QbfElement.displayPropertyNames.indexOf(property) >= 0) {
      this.elementDisplayProperties.set(property, value)
      const labelHtml = this.getLabel()
      if (labelHtml) {
        QbfPropertyTools.setDisplayProperty(labelHtml, property, value)
      }
    }
  }
}
