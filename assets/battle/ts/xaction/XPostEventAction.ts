import { _decorator, Component, Node } from 'cc';
import XBTAction from '../bt2/XBTAction';
import { XBTCategory, XBTStatus } from '../bt2/XBTEnum';
import XBTTick from '../bt2/XBTTick';
import { XPlayerScript } from '../view/player/XPlayerScript';
import EventCenter from '../event/EventCenter';

export class XPostEventAction extends XBTAction {
    static NAME = "XPostEventAction"

    eventName = ""

    constructor(event) {
        super({
            name:XPostEventAction.NAME
        })
        this.eventName = event
    }

    tick(tick_: XBTTick): XBTStatus {
        const tartget = tick_.target as XPlayerScript
        EventCenter.emit(this.eventName, tartget.getDataModel())
        return XBTStatus.SUCCESS
    }
}

XPostEventAction.register(XPostEventAction.NAME, XBTCategory.ACTION)


