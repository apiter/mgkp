import { _decorator, Button, Component, director, Node } from 'cc';
import XMgr from '../XMgr';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
    @property(Button)
    againButton:Button = null

    protected onLoad(): void {
        this.againButton.node.active = false
        XMgr.ui = this
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    againClicked() {
        director.loadScene("loading")
    }

    showHunterWin() {
        this.againButton.node.active = true
    }
    showHunterFailed() {
        this.againButton.node.active = true
    }
}


