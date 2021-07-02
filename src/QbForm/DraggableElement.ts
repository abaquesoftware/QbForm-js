import QbForm from "../QbForm/QbForm"

interface IWindowEx { [index: string]: any }

// ===========================================================
export enum DragMode {
// ===========================================================
  UNKNOWN,
  NONE,
  MOUSE,
  TOUCH,
}

// ===========================================================
export abstract class DraggableElement {
// ===========================================================
  // **************************************
  // DraggableElement: static
  // **************************************
  public static dragElementList: DraggableElement[] = []
  public static currentIndex: number = -1

  // ------------------------------------------------------------
  public static _scrollDiv(id: number): void {
  // ------------------------------------------------------------
    const hssub1DivName = "_dragObj_" + id + "hssub1"
    const hssub1Div = QbForm.getElementById(hssub1DivName)
    if (hssub1Div) {
      // alert("LOAD - " + id)
      hssub1Div.scrollTo( hssub1Div.scrollWidth / 2 , hssub1Div.scrollHeight / 2 )
    }
    const hsDivName = "_dragObj_" + id + "hs"
    const hotspotDiv = QbForm.getElementById(hsDivName)
    if (hotspotDiv) {
      hotspotDiv.focus()
    }
  }

  // ------------------------------------------------------------
  public static _onMouseDown(id: number, event: MouseEvent): void {
  // ------------------------------------------------------------
    if ( id < -1 || id >= DraggableElement.dragElementList.length ) {
      // tslint:disable-next-line:no-console
      console.log( "ERROR - DraggableElement #" + id + " doesn't exist")
      return
    }
    DraggableElement.currentIndex = id
    const dragElement: DraggableElement = DraggableElement.dragElementList[id]
    dragElement.dragMode = DragMode.MOUSE
    // const x = event.screenX
    // const y = event.screenY
    const x = event.pageX
    const y = event.pageY
    dragElement._onDragStart(x, y)
    dragElement.onDragStart(x, y, DragMode.MOUSE)
    // dragElement.onMouseDown(event)
  }

  // ------------------------------------------------------------
  public static _onMouseMove(id: number, event: MouseEvent): void {
  // ------------------------------------------------------------
    event.stopPropagation()
    event.preventDefault()
    event.stopImmediatePropagation()

    if ( id < -1 || id >= DraggableElement.dragElementList.length ) {
      // tslint:disable-next-line:no-console
      console.log( "ERROR - DraggableElement #" + id + " doesn't exist")
      return
    }
    const dragElement: DraggableElement = DraggableElement.dragElementList[id]
    if ( dragElement.dragMode === DragMode.MOUSE) {
      const x = event.pageX
      const y = event.pageY
      const [ deltaX, deltaY ] = dragElement._onDragMove(x, y)
      dragElement.onDragMove(deltaX, deltaY)
    }
    dragElement.onMouseMove(event)
  }

  // ------------------------------------------------------------
  public static _onMouseUp(id: number, event: MouseEvent): void {
  // ------------------------------------------------------------
    if ( id < -1 || id >= DraggableElement.dragElementList.length ) {
      // tslint:disable-next-line:no-console
      console.log( "ERROR - DraggableElement #" + id + " doesn't exist")
      return
    }
    const dragElement: DraggableElement = DraggableElement.dragElementList[id]
    if ( dragElement.dragMode === DragMode.MOUSE) {
      const x = event.pageX
      const y = event.pageY
      const [ deltaX, deltaY ] = dragElement._onDragEnd(x, y)
      dragElement.onDragEnd(deltaX, deltaY)
      dragElement.dragMode = DragMode.UNKNOWN
    }
    dragElement.onMouseUp(event)
  }

  // ------------------------------------------------------------
  public static _onTouchStart(id: number, event: TouchEvent): void {
  // ------------------------------------------------------------
    if ( id < -1 || id >= DraggableElement.dragElementList.length ) {
      // tslint:disable-next-line:no-console
      console.log( "ERROR - DraggableElement #" + id + " doesn't exist")
      return
    }
    DraggableElement.currentIndex = id
    const dragElement: DraggableElement = DraggableElement.dragElementList[id]
    dragElement.dragMode = DragMode.TOUCH

    const touchobj = event.changedTouches[0]
    const x = touchobj.pageX
    const y = touchobj.pageY
    dragElement._onDragStart(x, y)
    dragElement.onDragStart(x, y, DragMode.TOUCH)
    dragElement.onTouchStart(event)
  }

  // ------------------------------------------------------------
  public static _onTouchMove(id: number, event: TouchEvent): void {
  // ------------------------------------------------------------
    event.preventDefault()
    if ( id < -1 || id >= DraggableElement.dragElementList.length ) {
      // tslint:disable-next-line:no-console
      console.log( "ERROR - DraggableElement #" + id + " doesn't exist")
      return
    }
    const dragElement: DraggableElement = DraggableElement.dragElementList[id]
    if ( dragElement.dragMode === DragMode.TOUCH) {
      const touchobj = event.changedTouches[0]
      const x = touchobj.pageX
      const y = touchobj.pageY
      const [ deltaX, deltaY ] = dragElement._onDragMove(x, y)
      dragElement.onDragMove(deltaX, deltaY)
    }
  }

  // ------------------------------------------------------------
  public static _onTouchEnd(id: number, event: TouchEvent): void {
  // ------------------------------------------------------------
    if ( id < -1 || id >= DraggableElement.dragElementList.length ) {
      // tslint:disable-next-line:no-console
      console.log( "ERROR - DraggableElement #" + id + " doesn't exist")
      return
    }
    const dragElement: DraggableElement = DraggableElement.dragElementList[id]
    if ( dragElement.dragMode === DragMode.TOUCH) {
      const touchobj = event.changedTouches[0]
      const x = touchobj.pageX
      const y = touchobj.pageY
      const [ deltaX, deltaY ] = dragElement._onDragEnd(x, y)
      dragElement.onDragEnd(deltaX, deltaY)
      dragElement.dragMode = DragMode.UNKNOWN
    }
  }

  // **************************************
  // DraggableElement: instance
  // **************************************
  // Data
  public dragObjIndex: number = -1
  public dragMode: DragMode = DragMode.NONE
  public previousDivPosition: string = ""
  public dragInitX: number = -1
  public dragInitY: number = -1
  public dragInitLeft: string = ""
  public dragInitTop: string = ""
  public dragInitWidth: string = ""
  public dragInitHeight: string = ""
  public cursor: string | null = null

  // Mandatory abstract method
  public abstract getInnerHtml( ): string
  public abstract onDragStart(x: number, y: number, dragMode: DragMode): void
  public abstract onDragMove(deltaX: number, deltaY: number): void
  public abstract onDragEnd(deltaX: number, deltaY: number): void
  // Optional
  // tslint:disable:no-empty
  public onMouseDown(event: MouseEvent): void { }
  public onMouseMove(event: MouseEvent): void { }
  public onMouseUp(event: MouseEvent): void { }
  public onMouseEnter(event: MouseEvent): void { }
  public onMouseOut(event: MouseEvent): void { }
  public onTouchStart(event: TouchEvent): void { }
  public onTouchMove(event: TouchEvent): void { }
  public onTouchEnd(event: TouchEvent): void { }
  // tslint:enable:no-empty

  // ------------------------------------------------------------
  // tslint:disable-next-line: member-ordering
  public constructor() {
  // ------------------------------------------------------------
    this.dragObjIndex = DraggableElement.dragElementList.length
    DraggableElement.dragElementList.push(this)
  }

  // ------------------------------------------------------------
  public setCursor(cursor: string): void {
  // ------------------------------------------------------------
    this.cursor = cursor
  }

  // ------------------------------------------------------------
  public buildHtml(): string {
  // ------------------------------------------------------------
    const id: number = this.dragObjIndex
    let html: string = ""
    // --- main div
    html += "<div id=\"_dragObj_" + id + "\""
    html += " style=\""
    html += "  position: relative;"
    html += "  height: 100%;"
    if ( this.cursor ) { html += " cursor: " + this.cursor + ";" }
    html += "\" >"
    // --- user defned
    html += this.getInnerHtml()
    // --- hotspot (div)
    html += "<div id=\"_dragObj_" + id + "hs\" "
    html += " style=\""
    html += "  position: absolute;"
    html += "  left: 0px;"
    html += "  top: 0px;"
    html += "  width: 100%;"
    html += "  height: 100%;"
    html += "  z-index: 10000;"
    html += "  overflow: hidden;"
    html += "  touch-action: none;"
    html += "\""

    html += " onmousedown=\"QbForm.getClass('DraggableElement')._onMouseDown(" + id + ",event)\" "
    html += " onmouseup=\"QbForm.getClass('DraggableElement')._onMouseUp(" + id + ",event)\" "
    html += " onmousemove=\"QbForm.getClass('DraggableElement')._onMouseMove(" + id + ",event)\" "
    html += " ontouchstart=\"QbForm.getClass('DraggableElement')._onTouchStart(" + id + ",event)\" "
    html += " ontouchmove=\"QbForm.getClass('DraggableElement')._onTouchMove(" + id + ",event)\" "
    html += " ontouchend=\"QbForm.getClass('DraggableElement')._onTouchEnd(" + id + ",event)\" "
    html += ">"
    // --- hotspot (div)
    html += "</div>"
    // --- main div
    html += "</div>"
    return html
  }

  // ---------------------------------------------------
  public _onDragStart(x: number, y: number): void {
  // ---------------------------------------------------
    // set VV (visualViewport)
    let vvScale = 1
    let vvLeft = 0
    let vvTop = 0
    let vvWidth = 0
    let vvHeight = 0
    const windowEx = window as unknown as IWindowEx
    const visualViewport = windowEx.visualViewport
    if ( visualViewport ) {
      vvScale = visualViewport.scale
      vvLeft = visualViewport.offsetLeft
      vvTop = visualViewport.offsetTop
      vvHeight = visualViewport.height
      vvWidth = visualViewport.width
      vvHeight = visualViewport.height
      } else {
      // If visualViewport is not implemented (firefox)
      vvScale = 1
      vvLeft = 0
      vvTop = 0
      vvWidth = document.body.clientWidth
      vvHeight = document.body.clientHeight
    }

    const ratio1 = window.devicePixelRatio
    const ratio2 = vvScale
    // const ratio = ( ratio2 === 1 ) ? 1 : ratio1 * ratio2

    const id = DraggableElement.currentIndex
    // const dragElement = DraggableElement.dragElementList[id]
    const hsDivName = "_dragObj_" + id + "hs"
    const hotspotDiv = QbForm.getElementById(hsDivName)
    if (hotspotDiv) {
      // if ( dragElement.dragMode === DragMode.TOUCH )
      // const rect = hotspotDiv.getBoundingClientRect()
      // hotspotDiv.style.overflow="scroll"
      // hotspotDiv.style.left= "" + ( -rect.x ) + "px"
      // hotspotDiv.style.top= "" + ( -rect.y ) + "px"
      hotspotDiv.style.position = "fixed"
      hotspotDiv.style.left = "" + vvLeft + "px"
      hotspotDiv.style.top = "" + vvTop + "px"
      hotspotDiv.style.width = "" + vvWidth + "px"
      hotspotDiv.style.height = "" + vvHeight + "px"
      window.setTimeout("QbForm.getClass('DraggableElement')._scrollDiv(" + id + ")", 10)
    }
    this.dragInitX = x
    this.dragInitY = y
  }

  // ---------------------------------------------------
  public _onDragMove(x: number, y: number) {
  // ---------------------------------------------------
    const xDelta = x - this.dragInitX
    const yDelta = y - this.dragInitY
    return [ xDelta , yDelta ]
  }

  // ---------------------------------------------------
  public _onDragEnd(x: number, y: number) {
  // ---------------------------------------------------
    const id = DraggableElement.currentIndex
    const hsDivName = "_dragObj_" + id + "hs"
    const hotspotDiv = QbForm.getElementById(hsDivName)
    if (hotspotDiv) {
      DraggableElement._scrollDiv(id)
      const rect = hotspotDiv.getBoundingClientRect()
      hotspotDiv.style.position = "absolute"
      hotspotDiv.style.left = "0px"
      hotspotDiv.style.top = "0px"
      hotspotDiv.style.width = "100%"
      hotspotDiv.style.height = "100%"
      // hotspotDiv.style.overflow = "hidden"
    }
    const xDelta = x - this.dragInitX
    const yDelta = y - this.dragInitY
    return [ xDelta , yDelta ]
  }
}
