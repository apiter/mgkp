export interface XUnlockData {
    way?: number;
    num?: number;
}
export interface XCfgSkinData {
    id: number;
    name: string;
    type: string;
    skinType: number;
    skinPath: string;
    headIcon: string;
    skinBedPath: string;
    skinShowPath: string
    unlock: XUnlockData
}

export interface XCfgShopData {
    id: number;
    name: string;
    buildId: number;
    group: number;
    unlock: XUnlockData;
    desc: string;
    icon: string;
    initialHave: number;
}

export interface XCfgHunterEquipData {
    id:number;
    oldName:string;
    name:string;
    type:number;
    part:number;
    value:number;
    level:number;
    url:string
}