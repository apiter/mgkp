import { _decorator, Component, director, Node, Scheduler } from 'cc';
import { XBaseEffect } from './XBaseEffect';
import { XCfgEffectData } from '../xconfig/XCfgData';
import XBuildingModel from '../model/XBuildingModel';
import { XConst } from '../xconfig/XConst';
import XMgr from '../XMgr';
const { ccclass, property } = _decorator;

@ccclass('XDoorAlwaysAddHp')
export class XDoorAlwaysAddHp extends XBaseEffect {
 
     constructor(cfg_: XCfgEffectData, buildModel_: XBuildingModel) {
         super(cfg_, buildModel_)
         this.addValue = this.cfg.value[0] ;
         let duration = 1
 
         Scheduler.enableForTarget(this)
         director.getScheduler().schedule(this.exec, this, duration)
     }

     exec() {
        if(this._data.playerUuid == null)
            return
        const doors = this.getCurDoorModel()
        if(!doors || doors.length == 0)
            return
        for(let i = 0; i < doors.length; ++i) {
            const door = doors[i]
            XMgr.gameMgr.addHp(door, this.addValue)
        }
     }
}


