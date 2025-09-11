import { Vec2 } from "cc"
import XBuildingModel from "./XBuildingModel"

export class XRoomModel {
    id: number = 0
    x: number = 0
    y: number = 0
    hideDoorHp = 3
    aiMult = 1
    coin = 0
    energy = 0
    grids:Vec2[] = []
    walls = []
    buildings:XBuildingModel[] = []
    preBuildings = []
    bedModelList:XBuildingModel[] = []
    active = true
    towers = []
    doorPosArr: Vec2[] = []
    doorPos: Vec2
    doorModel: XBuildingModel

    players = []
}