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
    id: number;
    oldName: string;
    name: string;
    type: number;
    part: number;
    value: number;
    level: number;
    url: string
}

export interface XCfgMapCfgItem {
    id: number;
    path: string;
    name: string;
    row: number;
    column: number;
    defenderPointNum: number;
    hunterPointNum: number;
    smallMap: string;
    hideRoomCnt: number;
}

export interface XCfgMapData {
    compressionlevel: number,
    height: number,
    layers: any[],
    infinite: boolean,
    nextlayerid: number,
    nextobjectid: number,
    orientation: string,
    renderorder: string,
    tiledversion: string,
    tileheight: number,
    tilesets: any[],
    tilewidth: number,
    type: string,
    version: string,
    width: number
}

export interface XDifficultCfgItem {
    id: number;
    name: string;
    title: string;
    titleColor: string;
    bossId: number;
    upRate: number;
    isBreak: number;
    escLv: number;
    atkEscTime: number;
    moveSpeed: number;
    addHpLv: number;
    addHpRate: number;
    addExpLv: number;
    addExp: number;
    addMaxHp: number;
    addSkillLv: number;
}

export interface XCfgBuffItem {
    id: number;
    oldname: string;
    name: string;
    buffId: string;
    quality: string;
    isOpen: number;
    icon: string;
    des: string;
    buffDes: string;
    isRepeat: number;
    values: number[];
}

export interface XCfgHunterData {
    attackList:number[]
    hpList:number[]
    upAtcCntList:number[]
    hunterAttackList:number[]
    hunterHpList:number[]
}

export interface XCfgSpecialTowerData {
    id:number,
    oldname:string,
    name:string
    quality:string
    weight:number
    des:string
    diIcon:string
}

export interface XCfgSuperBuildingData {
    id:number,
    name:string,
    icon:string
    description:string
    upDes:string
}