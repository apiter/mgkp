import { _decorator, assetManager, Component, director, Node } from 'cc';
import { XBattleEntrance } from './battle_ts/XBattleEntrance';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    start() {
        assetManager.loadBundle('battle', (err, bundle)=>{
            XBattleEntrance.loadRes()
            bundle.loadScene("game", (err, scene)=>{
                director.runScene(scene)
            })
        })
    }

    update(deltaTime: number) {

    }
}


