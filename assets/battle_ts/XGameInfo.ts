import { XRandomUtil } from "./xutil/XRandomUtil"

export default class XGameInfo {
    static getMapId() {
        return XRandomUtil.getIntRandom(0, 6)
    }

    static getDiffcultLv() {
        return 1
    }
}


