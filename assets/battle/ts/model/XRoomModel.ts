import { Vec2 } from "cc"

export class XRoomModel {
    id: number = 0
    x: number = 0
    y: number = 0
    hideDoorHp = 3
    aiMult = 1
    coin = 0
    energy = 0
    grids = []
    walls = []
    buildings = []
    preBuildings = []
    bedModelList = []
    active = true
    towers = []
    doorPosArr: Vec2[] = []
    doorPos: Vec2
    doorRot:number
}