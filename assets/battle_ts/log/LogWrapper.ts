import { debug } from "cc"

export enum XLogModule {
    XLogModuleBT,
    XLogModuleShuZhi,
    XLogModuleBattle,
    XLogModuleBuild,
    XLogModuleGameFlow,
    XLogMuduleTemp
}

export default class LogWrapper {
    static allowModules = [XLogModule.XLogModuleBT, XLogModule.XLogMuduleTemp, XLogModule.XLogModuleGameFlow]
    static log(tag_: string, msg_: string, params_: { [key: string]: any } = {}, modules_: XLogModule[] = [XLogModule.XLogMuduleTemp]) {
        this._canLog(modules_) &&
            console.log(`[${tag_}] ${msg_} ${this._paramsToString(params_)}`)
    }

    static _canLog(modules_: XLogModule[]) {
        for (let i = 0; i < modules_.length; ++i) {
            let module = modules_[i]
            if (this.allowModules.indexOf(module) >= 0)
                return true
        }
        return false
    }

    static _paramsToString(params_: { [key: string]: any }) {
        let str = ""
        for (const key in params_) {
            str += key + ":" + (params_[key].toString()) + ","
        }
        return str.slice(0, -1)
    }
}


