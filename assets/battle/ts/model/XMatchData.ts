import { XGameMode } from "../xconfig/XEnum";

export default class XMatchData {
    players= [];
    defenders= [];
    hunters= [];
    difficulty= 0;
    hideRoomIndex= 0;
    gameMode = XGameMode.E_Defense;

    mapCfg
    mapData
    mineUuid:string = ""
}