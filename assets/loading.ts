import { _decorator, Component, Node } from 'cc';
import { XBattleEntrance } from './XBattleEntrance';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    start() {
        XBattleEntrance.loadRes()
    }

    update(deltaTime: number) {

    }
}


