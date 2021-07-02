import QbfElement, { IQbfSchema } from "./QbfElement"
import QbfElementFactory from "./QbfElementFactory"
import QbfFilterAbstract from "./QbfFilterAbstract"
import QbfFramedElement from "./QbfFramedElement"
import QbfPropertyTools from "./QbfPropertyTools"
import { QbfSelectorImpl } from "./QbfSelector"

import { DraggableElement, DragMode } from "./DraggableElement"
import { QbfUnit, QbfUnitTools } from "./QbfUnit"

// Subtypes
import QbfBoolean from "../QbfBoolean/QbfBoolean"
import QbfBooleanDisplayAbstract from "../QbfBoolean/QbfBooleanDisplayAbstract"
import QbfBooleanDisplayCheckbox from "../QbfBoolean/QbfBooleanDisplayCheckbox"
import QbfBooleanDisplaySwitch from "../QbfBoolean/QbfBooleanDisplaySwitch"
import QbfButton from "../QbfButton/QbfButton"
import QbfChoice from "../QbfChoice/QbfChoice"
import QbfChoiceCombobox from "../QbfChoice/QbfChoiceCombobox"
import QbfChoiceRadio from "../QbfChoice/QbfChoiceRadio"
import QbfInputAbstract from "../QbfInput/QbfInputAbstract"
import QbfInteger from "../QbfInput/QbfInteger"
import QbfNumber from "../QbfInput/QbfNumber"
import QbfPassword from "../QbfInput/QbfPassword"
import QbfString from "../QbfInput/QbfString"

// ===========================================================
export default class QbForm {
// ===========================================================

  // **************************************
  // QbForm: static
  // **************************************
  public static initialized: boolean = false
  public static lastQbFormIndex: number = 0
  public static qbFormMap: Map<number, QbForm>
  public static classMap: Map<string, any>
  public static nonStandardPrefix: string = "_"

  // ---------------------------------------------------------
  public static init(): void {
  // ---------------------------------------------------------
    if (!QbForm.initialized) {
      QbForm.initialized = true

      QbfElementFactory.registerSelector( new QbfSelectorImpl() )

      QbForm.qbFormMap = new Map<number, QbForm>()
      QbForm.classMap = new Map<string, any>()

      QbForm.setClass("QbfElement", QbfElement)
      QbForm.setClass("QbfFramedElement", QbfFramedElement)
      QbForm.setClass("QbfElementFactory", QbfElementFactory)
      QbForm.setClass("QbfUnit", QbfUnit)
      QbForm.setClass("QbfUnitTools", QbfUnitTools)
      QbForm.setClass("DraggableElement", DraggableElement)
      QbForm.setClass("DragMode", DragMode)
      QbForm.setClass("QbfFilterAbstract", QbfFilterAbstract)
      QbForm.setClass("QbfPropertyTools", QbfPropertyTools)
      // Types
      QbForm.setClass("QbfNumber", QbfNumber)
      QbForm.setClass("QbfInteger", QbfInteger)
      QbForm.setClass("QbfString", QbfString)
      QbForm.setClass("QbfBoolean", QbfBoolean)
      QbForm.setClass("QbfBooleanDisplayAbstract", QbfBooleanDisplayAbstract)
      QbForm.setClass("QbfBooleanDisplayCheckbox", QbfBooleanDisplayCheckbox)
      QbForm.setClass("QbfBooleanDisplaySwitch", QbfBooleanDisplaySwitch)
      QbForm.setClass("QbfChoice", QbfChoice)
      QbForm.setClass("QbfChoiceCombobox", QbfChoiceCombobox)
      QbForm.setClass("QbfChoiceRadio", QbfChoiceRadio)
      QbForm.setClass("QbfPassword", QbfPassword)
      QbForm.setClass("QbfInputAbstract", QbfInputAbstract)
      QbForm.setClass("QbfPassword", QbfPassword)
      QbForm.setClass("QbfButton", QbfButton)
    }
  }

  // ---------------------------------------------------------
  public static getElementFromElementPath(elementPath: string | string[]): QbfElement[] {
  // ---------------------------------------------------------
    let result: QbfElement[] = []
    let elementPathEx: string[]
    if ( typeof elementPath === "string" ) {
      elementPathEx = QbForm.splitElementPath(elementPath)
    } else {
      elementPathEx = elementPath
    }
    if ( elementPathEx.length > 0 ) {
      const qbFormIdAsString = elementPathEx[0].replace("_qbf", "")
      const qbFormId: number = parseInt(qbFormIdAsString, 10)
      const qbForm = QbForm.qbFormMap.get(qbFormId)
      if (qbForm) {
        if ( elementPathEx.length === 1 || (elementPathEx.length === 2 && elementPathEx[1] === "/")) {
          if (qbForm.rootElement) {
            result = [ qbForm.rootElement ]
          }
        } else {
        // TODO: support meta-char
        const elementId: string = QbForm.convertPathToString(elementPathEx)
        const element: QbfElement | undefined = qbForm.elementMap.get(elementId)
        if (element) {
            result.push(element)
          }
        }
      }
    }
    return result
  }

  // ---------------------------------------------------------
  public static convertPathToString( elementPath: string[] ): string {
  // ---------------------------------------------------------
    let result = ""
    let first = true
    elementPath.forEach( (elementName: string) => {
      if ( first ) {
        first = false
      } else {
        result += "/"
      }
      result += QbForm.encodeElementName(elementName)
    })
    return result
  }

  // ---------------------------------------------------------
  public static convertToBoolean(value: any): boolean {
  // ---------------------------------------------------------
    let result = false
    const valueUp = value.toString().toUpperCase()
    if ( valueUp === "TRUE" || valueUp === "YES" || valueUp === "ON" || valueUp === "1" ) {
      result = true
    }
    return result
  }

  // ---------------------------------------------------------
  public static isDefined(value: any) {
  // ---------------------------------------------------------
    return ( value !== null && value !== undefined )
  }

  // ---------------------------------------------------------
  public static setClass(className: string, theClass: any): void {
  // ---------------------------------------------------------
    QbForm.classMap.set(className, theClass)
  }

  // ---------------------------------------------------------
  public static getClass(className: string): any {
  // ---------------------------------------------------------
    let result = null
    result = QbForm.classMap.get(className)
    if ( !result ) {
      result = null
    }
    return result
  }

  // ---------------------------------------------------------
  public static encodeElementName( str: string ): string {
  // ---------------------------------------------------------
    let result = str
    result = result.replace( "\\" , "\\\\")
    result = result.replace( "/" , "\\/")
    return result
  }

  // ---------------------------------------------------------
  public static splitElementPath( str: string ): string[] {
  // ---------------------------------------------------------
    const result: string[] = []
    const len: number = str.length
    let curFieldName: string = ""
    for ( let pos: number = 0; pos < len ; pos++ ) {
      const car = str[pos]
      if ( car === "\\" ) {
        if ( pos === (len - 1) ) {
          curFieldName += car
        } else {
        const car2: string = str[pos + 1]
        switch (car2) {
          case "\\":
            curFieldName += "\\"
            pos++
            break
          case "/":
            curFieldName += "/"
            pos++
            break
          default:
            curFieldName += car
          }
        }
      } else {
        if ( car === "/" ) {
          if ( curFieldName.length > 0 || result.length > 0 ) {
            result.push(curFieldName)
          }
          curFieldName = ""
        } else {
          curFieldName += car
        }
      }
    }
    result.push( curFieldName)
    return result
  }

  // ---------------------------------------------------------
  public static calculateStringWidth( str: string, classAndStyle: string ): number {
  // ---------------------------------------------------------
    let result = 0
    let html = ""
    const divId = "_qbForm_divToCalculateStringWidth_"
    let calculationDiv = QbForm.getElementById(divId)
    if (calculationDiv === null) {
      html = ""
      html += "<div id=\"" + divId + "\""
      html += " style=\""
      html += " position: absolute;"
      html += " height: fit-content;"
      html += " width: fit-content;"
      html += " white-space: nowrap;"
      html += "\"></div>"
      document.body.innerHTML += html
      calculationDiv = QbForm.getElementById(divId) as HTMLDivElement
    }
    if (calculationDiv) {
      html = ""
      html += "<div " + classAndStyle + " style=\"width: auto;\">"
      html += str
      html += "</div>"
      calculationDiv.innerHTML = html
      result = calculationDiv.clientWidth
    }
    return result
  }

  // ---------------------------------------------------------
  public static getCssStyleProperty( classNameList: string, property: string ): any {
  // ---------------------------------------------------------
    let result = null

    const classList: string[] = classNameList.split(" ")
    classList.forEach( (className: string) => {
      const classNameEx = "." + className

      const sheets = document.styleSheets
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0 ; i < sheets.length; i++ ) {
        const sheet = sheets[i]
        // tslint:disable-next-line:prefer-for-of
        for ( let j = 0 ; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j] as CSSStyleRule
          if ( rule.selectorText === classNameEx) {
            const resultEx = rule.style.width
            if (resultEx) {
              result = resultEx
            }
          }
        }
      }
    })
    return result
  }

  // ---------------------------------------------------------
  public static getElementById(id: string): HTMLElement | null {
  // ---------------------------------------------------------
    let result = document.getElementById(id)
    if (!result) {
      QbForm.qbFormMap.forEach( (qbForm: QbForm) => {
        if (!result && qbForm.shadowRoot) {
          result = qbForm.shadowRoot.getElementById(id)
        }
      })
    }
    return result
  }

  // ---------------------------------------------------------
  public static setHtmlElementVisibility( element: HTMLElement, visibility: boolean ): void {
  // ---------------------------------------------------------
    if ( visibility ) {
      element.style.removeProperty("display")
      element.style.removeProperty("width")
      element.style.removeProperty("height")
      element.style.removeProperty("border")
        } else {
      element.style.display = "none"
      element.style.width = "0px"
      element.style.height = "0px"
      element.style.border = "none"
    }
  }

  // ---------------------------------------------------------
  private static preProcessSchema( initialSchema: object ): IQbfSchema {
  // ---------------------------------------------------------
    // Convert JSON schema to QbForm Schema
    // - resolve $ref = "#..."
    const result: IQbfSchema = QbForm.preProcessSchema_recursive( initialSchema, initialSchema, [], [] )
    return result
  }

  // ---------------------------------------------------------
  private static preProcessSchema_recursive( allSchema: object,
                                             initialSchema: any,
                                             path: string[],
                                             previousReferences: string[] ): any {
  // ---------------------------------------------------------
    let result = initialSchema
    if (typeof initialSchema === "object") {
      result = {} as IQbfSchema
      const initialSchemaEx = initialSchema as IQbfSchema
      Object.keys(initialSchema).forEach( (key: string) => {
        const subObject = initialSchemaEx[key]
        if (subObject instanceof Object) {
          result[key] = QbForm.preProcessSchema_recursive(allSchema, subObject, [...path, key], previousReferences)
        } else {
          let isInDefinitions = false
          for (let i = 0; i < path.length; i++) {
            if (path[i] === "properties") {
              i++
            } else {
              if ( path[i] === "definitions" ) {
                isInDefinitions = true
              }
            }
          }
          if ( key === "$ref" && subObject.startsWith("#/") && !isInDefinitions ) {
            if ( previousReferences.indexOf(subObject) >= 0) {
              // tslint:disable-next-line:no-console
              console.log("ERROR: recursive definitions not supported in ", subObject)
            } else {
              const subObjectStr = subObject as unknown as string
              const objName = subObjectStr.replace("#/", "allSchema.").replace("/", ".")
              // tslint:disable-next-line:no-eval
              const expandedObj = eval( objName )
              const expandedObjEx = expandedObj as IQbfSchema
              const newPrevRefs = [ ...previousReferences, subObject ]
              Object.keys(expandedObj).forEach( (key2: string) => {
                result[key2] = QbForm.preProcessSchema_recursive( allSchema,
                                      expandedObjEx[key2], [...path, key2], newPrevRefs )
              })
            }
          } else {
            result[key] = subObject
          }
        }
      })
    }
    return result
  }

  // **************************************
  // QbForm: instance
  // **************************************
  public index: number = 0
  public parentHtmlElement: HTMLElement | null
  public schema: object
  public theme: string
  public rootElement: QbfElement | null
  public elementMap: Map<string, QbfElement>
  public style: HTMLStyleElement | null
  public shadowRoot: ShadowRoot | null

  // ---------------------------------------------------------
  public constructor(schema: object | string, theme: string = "default") {
  // ---------------------------------------------------------
    // Create style in document.head (if it doesn"t exist)
    let schemaAsObj: object = schema as unknown as object
    if (typeof schema === "string") {
      schemaAsObj = JSON.parse(schema) as unknown as object
    }
    QbForm.lastQbFormIndex++
    this.index = QbForm.lastQbFormIndex
    QbForm.qbFormMap.set(this.index, this)
    this.parentHtmlElement = null
    const schemaProcessed = QbForm.preProcessSchema(schemaAsObj)
    this.schema = schemaProcessed
    this.theme = theme
    this.style = null
    this.elementMap = new  Map<string, QbfElement>()
    this.shadowRoot = null
    const inTable = false
    this.rootElement = QbfElementFactory.createQbfElement(this, null, "_qbf" + this.index, inTable, this.schema)
  }

  // ---------------------------------------------------------
  public buildHtml(): string {
  // ---------------------------------------------------------
    if (!this.style) {
      this.style = document.createElement("style")
      if (this.shadowRoot) {
        this.shadowRoot.appendChild(this.style)
      } else {
        document.head.appendChild(this.style)
      }
    }
    let html = ""
    if (this.rootElement != null) {
      html += "<div id=\"_qbf" + this.index + "/_field\""
      html += " class=\"_qbf-root-" + this.rootElement.theme + "\""
      html += ">"
      html += this.rootElement.buildHtml()
      html += "</div>"
    }
    return html
  }

  // ---------------------------------------------------------
  public display(htmlElement: HTMLElement): void {
  // ---------------------------------------------------------
    if (htmlElement) {
      // Initialize QbfInputAbstract.htmlEncode
      QbfInputAbstract.htmlEncode("")
      //
      this.parentHtmlElement = htmlElement
      const html = this.buildHtml()
      htmlElement.innerHTML = html
    }
  }

  // ---------------------------------------------------------
  public setProperty(elementPath: string | string[], property: string, value: object): void {
  // ---------------------------------------------------------
    let elementPathEx = "_qbf" + this.index
    if (elementPath !== "/") {
      elementPathEx += elementPath
    }
    const qbFormElementList = QbForm.getElementFromElementPath(elementPathEx)
    qbFormElementList.forEach( (qbFormElement: QbfElement) => {
      qbFormElement.setProperty(property, value)
    })
  }

  // ---------------------------------------------------------
  public getProperty(elementPath: string | string[], property: string): any {
  // ---------------------------------------------------------
    let result: any = null
    let elementPathEx = "_qbf" + this.index
    if (elementPath !== "/") {
      elementPathEx += elementPath
    }
    const qbFormElementList = QbForm.getElementFromElementPath(elementPathEx)
    if ( qbFormElementList && qbFormElementList.length > 0 ) {
      const qbFormElement = qbFormElementList[0]
      result = qbFormElement.getProperty(property)
    }
    return result
  }

  // ---------------------------------------------------------
  public setCallback(elementPath: string | string[],
                     cbName: string,
                     cb: (elementPath: string[],
                          cbName: string,
                          input: object | null) => boolean): void {
  // ---------------------------------------------------------
    cbName = cbName.toLowerCase()
    let elementPathEx = "_qbf" + this.index
    if (elementPath !== "/") {
      elementPathEx += elementPath
    }
    const qbFormElementList = QbForm.getElementFromElementPath(elementPathEx)
    if ( qbFormElementList && qbFormElementList.length > 0 ) {
      qbFormElementList.forEach( (qbFormElement: QbfElement) => {
        qbFormElement.setCallback(cbName, cb)
      })
    }
  }
}
QbForm.init()
