import { _decorator, Component, EventTouch, instantiate, Node } from 'cc';
import XMgr from '../../XMgr';
const { ccclass, property } = _decorator;

interface XShowBuildMenuParams {
    gridX: number,
    gridY: number,
    level: number,
    angle: number
}

@ccclass('XBuildMenuScript')
export class XBuildMenuScript extends Component {

    _params: XShowBuildMenuParams = null

    static show(params_: XShowBuildMenuParams) {
        const dialogNode = instantiate(XMgr.prefabMgr.pf_build_menu)
        dialogNode.parent = XMgr.gameUI.node
        const comp = dialogNode.getComponent(XBuildMenuScript)
        comp.init(params_)
    }

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, ()=>{
            this.node.destroy()
        }, this)
    }

    init(params_: XShowBuildMenuParams) {
        this._params = params_
    }

    onClicked(event: EventTouch, btnParam) {
        const target = event.target as Node
        console.log("param:", btnParam)

        XMgr.buildingMgr.build(XMgr.playerMgr.mineUuid, btnParam, this._params.gridX, this._params.gridY, this._params.angle, this._params.level)

        this.node.destroy()
    }
}


