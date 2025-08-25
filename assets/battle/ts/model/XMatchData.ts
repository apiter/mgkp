import { XCfgMapCfgItem, XCfgMapDataItem } from "../xconfig/XCfgData";
import { XGameMode } from "../xconfig/XEnum";
import XPlayerModel from "./XPlayerModel";

export default class XMatchData {
    players: XPlayerModel[] = [];
    defenders: XPlayerModel[] = [];
    hunters: XPlayerModel[] = [];
    difficulty = 0;
    hideRoomIndex = 0;
    gameMode = XGameMode.E_Defense;

    mapCfg: XCfgMapCfgItem
    mapData: XCfgMapDataItem
    mineUuid: string = ""
}