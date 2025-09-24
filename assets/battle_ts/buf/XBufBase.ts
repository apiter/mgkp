import { XBuffType } from "../xconfig/XEnum";

export class XBufBase  {
    _val = 0;
    _type:XBuffType 
    constructor(val_) {
        this._val = val_
    }

    get type() {
        return this._type
    }

    set type(v_) {
        this._type = v_
    }

    result(mul_) {
        return this._val * mul_
    }
}


