import XMgr from "../XMgr";

export class XUserBattleInfoMgr {
	static energy() {	
		return XMgr.playerMgr.player.energy
	}

	static coin() {
		return XMgr.playerMgr.player.coin
	}
}


