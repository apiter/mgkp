export enum Direction {
    Left,
    Right,
    Up,
    Down
}

export enum XPlayerType {
    E_Defender = 0,
    E_Hunter = 1,
}

export enum XBuildType {
    bed = "bed",
    door = "door",
    tower = "tower",
    energy = "energy",
    mine = "mine",
    skill = "skill",
    eatMosquito = "eatMosquito",
    springBox = "springBox",
    knife = "knife",
    random = "random",
    entice = "entice",
    special = "special",
    stone = "stone",
    boxMonster = "boxMonster",
    doorkeeper = "doorkeeper",
    borrowMoney = "borrowMoney"
}

export enum XEffectType {
    Add_Coin = "Add_Coin",
    Add_Energy = "Add_Energy",
    Add_CoinAndEnergy = "Add_CoinAndEnergy",
    Door_AlwaysAddHp = "Door_AlwaysAddHp",
    Enemy_UseSkillBeDizzy = "Enemy_UseSkillBeDizzy",
    Door_NotGetDmgOnHpLow = "Door_NotGetDmgOnHpLow",
    Tower_GetCoinOnAtk = "Tower_GetCoinOnAtk",
    Tower_GetCoinOnAtk_1 = "Tower_GetCoinOnAtk_1",
    Enemy_SlowAtkSpd = "Enemy_SlowAtkSpd",
    Enemy_EscapeBeDizzy = "Enemy_EscapeBeDizzy",
    Door_FightBackOnBeAtk = "Door_FightBackOnBeAtk",
    Enemy_OnHpLowBeAtk = "Enemy_OnHpLowBeAtk",
    Tower_AddAtkDst = "Tower_AddAtkDst",
    Tower_AddAtkSpd = "Tower_AddAtkSpd",
    Tower_AddAtkSpdOnEnemyNear = "Tower_AddAtkSpdOnEnemyNear",
    Heal_Buildings = "Heal_Buildings",
    Door_GetCoinOnHurt = "Door_GetCoinOnHurt",
    Eat_Mosquito = "Eat_Mosquito",
    Door_EnemyBeDizzy = "Door_EnemyBeDizzy",
    Door_EnemyBeEscape = "Door_EnemyBeEscape",
    Enemy_EscapeBeSlowdown = "Enemy_EscapeBeSlowdown",
    Enemy_HpRateBeDizzy = "Enemy_HpRateBeDizzy",
}

export enum XGameMode {
    E_Defense = 0,
    E_AngelOrGhost = 2,
    E_Hunt = 1,
    E_SevenGhost = 3,
}

export enum XObjType {
    Map = 1,
    Number = 2,
    String = 3
}

export enum XSkinType {
    Human = "Human",
    Hunter = "Hunter", 
    Angel = "Angel", 
    Ghost = "Ghost", 
    Fighter = "Fighter"
}

export enum XGameStatus {
    E_GAME_READY = 1,
    E_GAME_START = 2,
    E_GAME_PAUSE = 3,
    E_GAME_FINISH = 4
}

export enum XBuffType {
    ATK_POW = 1,
    ATK_SPD = 2,
    ATK_DST = 3,
    ATK_SPLIT = 4,
    DYC_ATK_SPD = 5,
    INCOME_DOWN = 6,
    ENERGY_RATIO = 7,
    FIGHT_BACK = 8,
    SPEED_POW = 9,
    DEF_ROI = 10,
    DOOR_HP_INCREASE = 11,
    SPEED = 12
}

export enum XBuildResult {
    E_OK = 0,
    E_FAILD = 1,
    E_COIN_NOT_ENOUGH = 2,
    E_ENERGY_NOT_ENOUGH = 3,
    E_MAX_CNT = 4,
    E_MAX_LV = 5,
    E_NOT_HAVE_PREBUILD = 6,
    E_BED_IS_USED = 7,
    E_STAGE_NOT_ENOUGH = 8
}
