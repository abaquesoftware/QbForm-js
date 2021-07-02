// ===========================================================
export enum QbfUnit {
// ===========================================================
  UNKNOWN = "UNKNOWN" ,
  // Metric prefix
  Y = "Y",
  Z = "Z",
  E = "E",
  P = "P",
  T = "T",
  G = "G",
  M = "M",
  K = "K",
  k = "k",
  U = "U", // unit
  u = "u", // unit
  m = "m",
  micro = "µ",
  n = "n",
  p = "p",
  f = "f",
  a = "a",
  z = "z",
  y = "y",
  // binary prefix
  Yi = "Yi",
  Zi = "Zi",
  Ei = "Ei",
  Pi = "Pi",
  Ti = "Ti",
  Gi = "Gi",
  Mi = "Mi",
  Ki = "Ki",
  ki = "Ki",
  // CSS units
  BLOCK = "<block>",
  PIXEL = "px",
  PERCENT = "%",
  FILL = "*",
}

// ==========================================================
export class QbfUnitTools {
// ==========================================================

  // --------------------------------------------------------
  public static getUnitConversionFactor(unit: QbfUnit): number | null {
  // --------------------------------------------------------
    let result: number | null = null
    switch (unit) {
      // Metric prefix
      case QbfUnit.Y: result = 1000000000000000000000000; break
      case QbfUnit.Z: result = 1000000000000000000000; break
      case QbfUnit.E: result = 1000000000000000000; break
      case QbfUnit.P: result = 1000000000000000; break
      case QbfUnit.T: result = 1000000000000; break
      case QbfUnit.G: result = 1000000000; break
      case QbfUnit.M: result = 1000000; break
      case QbfUnit.K: result = 1000; break
      case QbfUnit.k: result = 1000; break
      case QbfUnit.U: result = 1; break
      case QbfUnit.u: result = 1; break
      case QbfUnit.m: result = 0.001; break
      case QbfUnit.micro: result = 0.000001; break
      case QbfUnit.n: result = 0.000000001; break
      case QbfUnit.p: result = 0.000000000001; break
      case QbfUnit.f: result = 0.000000000000001; break
      case QbfUnit.a: result = 0.000000000000000001; break
      case QbfUnit.z: result = 0.000000000000000000001; break
      case QbfUnit.y: result = 0.000000000000000000000001; break
      // Binary Prefix
      case QbfUnit.Yi: result = 1208925819614629174706176; break
      case QbfUnit.Zi: result = 1180591620717411303424; break
      case QbfUnit.Ei: result = 1152921504606846976; break
      case QbfUnit.Pi: result = 1125899906842624; break
      case QbfUnit.Ti: result = 1099511627776; break
      case QbfUnit.Gi: result = 1073741824; break
      case QbfUnit.Mi: result = 1048576; break
      case QbfUnit.Ki: result = 1024; break
      case QbfUnit.ki: result = 1024; break
    }
    return result
  }

  // --------------------------------------------------------
  public static extractNumber( valueWithUnit: string | null ): number {
  // --------------------------------------------------------
    let result: number = 0
    if (valueWithUnit) {
      let digitsOnly = ""
      for (const c of valueWithUnit) {
        if (( c >= "0" && c <= "9" ) || c === "." ) {
          digitsOnly += c
        }
      }
      if ( digitsOnly !== "" ) {
        result = Number.parseFloat(digitsOnly)
      }
    }
    return result
  }

  // --------------------------------------------------------
  public static extractUnit( valueWithUnit: string | null ): QbfUnit {
  // --------------------------------------------------------
    let result: QbfUnit = QbfUnit.U
    if (!valueWithUnit || valueWithUnit === "") {
      result = QbfUnit.BLOCK
    } else if (valueWithUnit === "*") {
      result = QbfUnit.FILL
    } else if (valueWithUnit.toUpperCase().endsWith("PX")) {
      result = QbfUnit.PIXEL
    } else if (valueWithUnit.endsWith("%") || valueWithUnit.toUpperCase().endsWith("FR")) {
      result = QbfUnit.PERCENT
    } else {
      // TODO : parse all prefixes
    }
    return result
    }
  }
