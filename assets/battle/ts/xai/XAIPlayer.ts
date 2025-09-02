import { XBTStatus, XEPolicy } from "../bt2/XBTEnum";
import { XBTSequence } from "../bt2/XBTSequence";
import { XPlayerScript } from "../view/player/XPlayerScript";
import { XFindMapBuildAct } from "../xaction/XFindMapBuildAct";
import { XGotoBedAction } from "../xaction/XGotoBedAction";
import { XTakeMapBuildAction } from "../xaction/XTakeMapBuildAction";
import { XUpgradeAction } from "../xaction/XUpgradeAction";
import { XCanUpgradeCdt } from "../xcdt/XCanUpgradeCdt";
import { XFindEmptyBedAct } from "../xcdt/XFindEmptyBedAct";
import { XNotInBedCdt } from "../xcdt/XNotInBedCdt";
import { XOneTrueCdt } from "../xcdt/XOneTrueCdt";
import { XAIModel } from "./XAIModel";

export class XPlayerAI extends XAIModel {
    constructor(playerScript: XPlayerScript, blackBoard = null) {
        super(playerScript, blackBoard)
    }
    notInBed(child_) {
        let t = new XOneTrueCdt(new XNotInBedCdt);
        t.add(child_)
        return t
    }
    findBed(child_) {
        let t = new XFindEmptyBedAct;
        return new XBTSequence({
            title: "findBed",
            children: [t, child_],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
    findMapBuild(e) {
        let t = new XFindMapBuildAct();
        return new XBTSequence({
            title: "findMapBuild",
            children: [t, e],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
    takeMapBuild() {
        return new XBTSequence({
            title:"takeMapBuild",
            children: [new XTakeMapBuildAction],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
    gotoBed() {
        let e = new XGotoBedAction;
        return new XBTSequence({
            title:"gotoBed",
            children: [e],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
    // canRepaire(e, t) {
    //     let i = new XAllTrueCdt(new XShouldFixCdt, new XTimeIntervalCdt(e));
    //     return i.add(t), i
    // }
    // repaire() {
    //     let e = new XRepaireAction;
    //     return new fx.BTSequence({
    //         children: [e],
    //         continuePolicy: Ie.SUCCESS,
    //         successPolicy: fx.EPolicy.RequireAll
    //     })
    // }
    upOrBuild() {
        let e = new XUpgradeAction;
        return new XBTSequence({
            title: "upOrBuild",
            children: [(new XCanUpgradeCdt).bindout(e), e],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
}


