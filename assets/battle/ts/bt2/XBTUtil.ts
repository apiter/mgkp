import { XEffectType } from "../xconfig/XEnum";
import XBTBaseNode from "./XBTBaseNode";
import { XEPolicy } from "./XBTEnum";
import { XBTSequence } from "./XBTSequence";

export default class XBTUtil {
    static bt_sequenceOr(children_: XBTBaseNode[], t = XEPolicy.RequireOne, title_ = "") {
        return new XBTSequence({
            title: title_,
            children: children_,
            successPolicy: t
        })
    }
}


