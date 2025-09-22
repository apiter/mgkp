import { assetManager, director } from "cc"
import XMgr from "./XMgr"

export class XBattleEntrance {
    static async enter() {
        assetManager.loadBundle('battle', (err, bundle) => {
            bundle.loadScene("game", async (err, scene) => {
                XMgr.init()
                await XMgr.cfg.load()
                director.runScene(scene)
            })
        })
    }
}


