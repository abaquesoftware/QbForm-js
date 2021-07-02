import QbfElement, {IQbfSchema} from "../QbForm/QbfElement"

// ===========================================================
export default class QbfPropertyTools {
// ===========================================================

  // --------------------------------------------------------------------------
  public static convertPropertyName( property: string): string {
  // --------------------------------------------------------------------------
    let result = ""
    for (const c of property) {
      if (c >= "A" && c <= "Z" ) {
        result += "-" + c.toLowerCase()
      } else {
        result += c
      }
    }
    return result
  }

  // --------------------------------------------------------------------------
  public static addDisplayProperties( schema: IQbfSchema,
                                      namePrefix: string,
                                      displayPropertyMap: Map<string, string>): boolean {
  // --------------------------------------------------------------------------
    let result = false
    Object.keys(schema).forEach( (property: string) => {
      if ((namePrefix === "" || property.startsWith(namePrefix))
          && property.length > namePrefix.length) {
        const propertyName = property.substr(namePrefix.length, 1).toLowerCase()
                            + property.substr(namePrefix.length + 1)
        if (QbfElement.displayPropertyNames.indexOf(propertyName) >= 0 ) {
          displayPropertyMap.set(propertyName, schema[property])
          result = true
        }
      }
    })
    return result
  }

  // --------------------------------------------------------------------------
  public static getElementDisplayProperty( property: string,
                                           displayPropertyMap: Map<string, string>,
                                           defaultValue: any): any {
  // --------------------------------------------------------------------------
    let result: any = defaultValue
    if (!result) {
      displayPropertyMap.forEach( (value: string, key: string) => {
        if ( key === property ) {
          result = value
        }
      })
    }
    return result
  }

  // --------------------------------------------------------------------------
  public static setDisplayProperty( htmlElement: HTMLElement,
                                    property: string,
                                    value: string): void {
  // --------------------------------------------------------------------------
    if (htmlElement) {
      if ( property === "class") {
        htmlElement.className = value
      } else {
        htmlElement.style.setProperty(property, value)
      }
    }
  }
}
