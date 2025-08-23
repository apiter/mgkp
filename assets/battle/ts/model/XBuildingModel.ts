import XBaseModel from "./XBaseModel"

export default class XBuildingModel extends XBaseModel {
    canHandle = true
    isPlayerDelete = false
    id = 0
    x = 0
    y = 0
    rotation = 0
    playerUuid = ""
    
    constructor(id_, roomId_, lv_, x_, y_, rotation_) {
        super()
        this.canHandle = !0
        this.isPlayerDelete = !1
        this.id = id_
        this.roomId = roomId_

        this.lv = lv_
        this.x = x_
        this.y = y_
        this.rotation = rotation_
    }

    get msgKey() {
        return `bd_${this.x}_${this.y}`
    }
}