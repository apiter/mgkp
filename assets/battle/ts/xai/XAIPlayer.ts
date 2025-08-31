import { XBTStatus, XEPolicy } from "../bt2/XBTEnum";
import { XBTSequence } from "../bt2/XBTSequence";
import { XFindEmptyBedAct } from "../xcdt/XFindEmptyBedAct";
import { XNotInBedCdt } from "../xcdt/XNotInBedCdt";
import { XOneTrueCdt } from "../xcdt/XOneTrueCdt";
import { XAIModel } from "./XAIModel";

export class XPlayerAI extends XAIModel {
    constructor(e, t = null) {
        super(e, t)
    }
    notInBed(e) {
        let t = new XOneTrueCdt(new XNotInBedCdt);
        return t.add(e), t
    }
    findBed(e) {
        let t = new XFindEmptyBedAct;
        return new XBTSequence({
            children: [t, e],
            continuePolicy: XBTStatus.SUCCESS,
            successPolicy: XEPolicy.RequireAll
        })
    }
    // findMapBuild(e) {
    //     let t = new XFindMapBuildAct;
    //     return new fx.BTSequence({
    //         children: [t, e],
    //         continuePolicy: Ie.SUCCESS,
    //         successPolicy: fx.EPolicy.RequireAll
    //     })
    // }
    // takeMapBuild() {
    //     let e = new XTakeMapBuildAction;
    //     return new fx.BTSequence({
    //         children: [e],
    //         continuePolicy: Ie.SUCCESS,
    //         successPolicy: fx.EPolicy.RequireAll
    //     })
    // }
    // gotoBed() {
    //     let e = new XGotoBedAction;
    //     return new fx.BTSequence({
    //         children: [e],
    //         continuePolicy: Ie.SUCCESS,
    //         successPolicy: fx.EPolicy.RequireAll
    //     })
    // }
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
    // upOrBuild() {
    //     let e = new XUpgradeAction;
    //     return new fx.BTSequence({
    //         children: [(new XCanUpgradeCdt).bindout(e), e],
    //         continuePolicy: Ie.SUCCESS,
    //         successPolicy: fx.EPolicy.RequireAll
    //     })
    // }
}


