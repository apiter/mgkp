import { _decorator, Component, Node, Prefab } from 'cc';
import XMgr from '../XMgr';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('XPrefabMgr')
@executionOrder(-100)
export class XPrefabMgr extends Component {

    @property(Prefab)
    pf_health_bar: Prefab = null

    @property(Prefab)
    pf_upgradetip_01 = null

    protected onLoad(): void {
        XMgr.prefabMgr = this
    }
}


