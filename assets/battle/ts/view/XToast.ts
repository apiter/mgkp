import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('XToast')
export class XToast extends Component {
    
    static instance:XToast = null

    static show(str:string) {
        XToast.instance?.show(str)
    }

    protected onLoad(): void {
        XToast.instance = this
    }

    show(str:string) {
        let node = new Node
        let lb = node.addComponent(Label)
        lb.string = str
        lb.fontSize = 30
        node.parent = this.node

        this.scheduleOnce(()=>{
            node.destroy()
        }, 2)
    }
}


