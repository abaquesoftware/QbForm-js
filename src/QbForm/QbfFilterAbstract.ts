// ===========================================================
export default abstract class QbfFilterAbstract {
// ===========================================================

  // **************************************
  // QbfFilterAbstract: static
  // **************************************
  public static filterList: QbfFilterAbstract[] = []

  // ---------------------------------------------------------
  public static getFilter( filterId: number): QbfFilterAbstract {
  // ---------------------------------------------------------
    return QbfFilterAbstract.filterList[ filterId ]
  }

  // **************************************
  // QbfFilterAbstract: instance
  // **************************************
  public filterId: number
  public data: Map<string, any> = new Map<string, any>()

  public abstract apply( ): void

  // --- CTOR ------------------------------------------------
  // tslint:disable-next-line: member-ordering
  public constructor() {
  // ---------------------------------------------------------
    this.filterId = QbfFilterAbstract.filterList.length
    QbfFilterAbstract.filterList.push( this )
  }

  // ---------------------------------------------------------
  public setValue( key: string, value: any) {
  // ---------------------------------------------------------
    this.data.set(key, value)
  }

}
