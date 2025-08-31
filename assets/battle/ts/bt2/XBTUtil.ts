import { XEffectType } from "../xconfig/XEnum";
import { XEPolicy } from "./XBTEnum";
import { XBTSequence } from "./XBTSequence";

export default class XBTUtil {
    static bt_sequenceOr(e, t = XEPolicy.RequireOne) {
        return new XBTSequence({
            children: e,
            successPolicy: t
        })
    }
}


