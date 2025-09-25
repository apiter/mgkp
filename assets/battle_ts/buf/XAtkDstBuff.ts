import { _decorator, Component, Node } from 'cc';
import { XBufBase } from './XBufBase';
import { XBuffType } from '../xconfig/XEnum';
const { ccclass, property } = _decorator;

@ccclass('XAtkDstBuff')
export class XAtkDstBuff extends XBufBase {
    constructor(val_) {
        super(val_)
        this.type = XBuffType.ATK_DST
    }
}


