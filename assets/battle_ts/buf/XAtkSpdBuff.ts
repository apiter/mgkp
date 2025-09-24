import { XBuffType } from "../xconfig/XEnum";
import { XBufBase } from "./XBufBase";

export class XAtkSpdBuff extends XBufBase {
    constructor(val_) {
        super(val_)
        this.type = XBuffType.ATK_SPD
    }
}


