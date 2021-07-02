import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"
import QbForm from "../QbForm/QbForm"
import QbfSelector from "./QbfSelector"

// ===========================================================
export default class QbfElementFactory {
// ===========================================================

  public static selectorList: QbfSelector[] = []

  // ---------------------------------------------------------
  public static registerSelector(selector: QbfSelector) {
  // ---------------------------------------------------------
    QbfElementFactory.selectorList.push(selector)
  }

  // ---------------------------------------------------------
  public static getElementClassFromSchema(schema: object): any | null {
  // ---------------------------------------------------------
    const qbfSchema = schema as IQbfSchema
    // find konfClass
    let qbfClass: any | null = null
    let selectorPriority = -1
    QbfElementFactory.selectorList.forEach( (selector: QbfSelector) => {
      if ( !qbfClass || selector.getPriority() >= selectorPriority ) {
        const foundClass = selector.findElementClass(qbfSchema)
        if (foundClass) {
          qbfClass = foundClass
          selectorPriority = selector.getPriority()
        }
      }
    })
    return qbfClass
  }

  // ---------------------------------------------------------
  public static createQbfElement(qbForm: QbForm,
                                 parent: QbfElement | null,
                                 name: string,
                                 inTable: boolean,
                                 schema: object): QbfElement | null {
  // ---------------------------------------------------------
    let result: QbfElement | null = null
    const qbfClass = QbfElementFactory.getElementClassFromSchema( schema )
    if (qbfClass) {
      const qbfSchema = schema as IQbfSchema
      result = new qbfClass(qbForm, parent, name, inTable, qbfSchema)
    }
    return result
  }
}
