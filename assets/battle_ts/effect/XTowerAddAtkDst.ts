import { XTowerBuffEffect } from './XTowerBuffEffect';
import { XBufBase } from '../buf/XBufBase';
import { XAtkDstBuff } from '../buf/XAtkDstBuff';

export class XTowerAddAtkDst extends XTowerBuffEffect {
    createBuff(): XBufBase {
        return new XAtkDstBuff(this.addValue)
    }
}


