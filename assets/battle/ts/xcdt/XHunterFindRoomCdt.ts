import { _decorator, Component, Node } from 'cc';
import { XBTCondition } from '../bt2/XBTCondition';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
import { XBTCategory } from '../bt2/XBTEnum';
const { ccclass, property } = _decorator;

@ccclass('XHunterFindRoomCdt')
export class XHunterFindRoomCdt extends XBTCondition {
    static NAME = "XHunterFindRoomCdt"
    constructor(child_ = null) {
        super({ child: child_, title: "", name: XHunterFindRoomCdt.NAME, properties: null })
    }

    satisfy(data_: XBTTick): boolean {
        const playerScript = data_.target as XPlayerScript
        if (!playerScript.getCurTarget()) {
            let allRoomIDs = playerScript.getAllRoomIdRand()
            let playerModel = playerScript.getDataModel()

            let targetBuildModel = null

            let roomModel = playerScript.getRoomModel(allRoomIDs[0])
            if (roomModel) {
                const roomDoor = roomModel.doorModel
                if (roomDoor?.isOpen || roomDoor?.isDie) {
                    const bed = roomModel.bedModelList[0]
                    if (bed.isDie) {
                        console.debug(`[${playerScript.skinCfg?.name}] 找到攻击房间[${roomModel.id}]但没床了`)
                        return false
                    }
                    if (!bed.isUsed) {
                        console.debug(`[${playerScript.skinCfg?.name}] 找到攻击房间[${roomModel.id}]但床没人`)
                        return false
                    }
                    targetBuildModel = bed
                    console.debug(`[${playerScript.skinCfg?.name}] 找到攻击房间床[${roomModel.id}]`)
                } else {
                    targetBuildModel = roomDoor
                    console.debug(`[${playerScript.skinCfg?.name}] 找到攻击房间门[${roomModel.id}]`)
                }
            }

            if (!targetBuildModel) {
                return false;
            }
            playerScript.setCurTarget(targetBuildModel)
        }
        return true
    }
}
XHunterFindRoomCdt.register(XHunterFindRoomCdt.NAME, XBTCategory.CONDITION);


