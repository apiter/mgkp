import { _decorator, assetManager, Component, director, Node } from 'cc';
import { XBattleEntrance } from './battle_ts/XBattleEntrance';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    start() {
        XBattleEntrance.enter()
    }

    update(deltaTime: number) {

    }
}


