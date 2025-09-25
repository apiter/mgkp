import { _decorator, Component, Node } from 'cc';
import { XBufBase } from './XBufBase';
import { XBuffType } from '../xconfig/XEnum';
const { ccclass, property } = _decorator;

@ccclass('XAtkPowBuff')
export class XAtkPowBuff extends XBufBase {
    constructor(val_) {
        super(val_)
        this.type = XBuffType.ATK_POW
    }
}


