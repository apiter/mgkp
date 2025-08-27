import { AssetManager, assetManager, error, SpriteAtlas } from "cc"

class XAtlasLoader {

    bundle: AssetManager.Bundle = null
    atlasMap: Map<string, SpriteAtlas> = new Map()

    init(): Promise<AssetManager.Bundle> {
        if (this.bundle)
            return new Promise(() => this.bundle)
        return new Promise((resolve) => {
            assetManager.loadBundle("res", (error, b) => {
                this.bundle = b
                resolve(b)
            })
        })
    }

    asyncFetchAtlas(atlasPath: string): Promise<SpriteAtlas> {
        if (this.atlasMap.get(atlasPath))
            return new Promise(() => this.atlasMap.get(atlasPath))
        return new Promise(async (resolve) => {
            let b = this.bundle || await this.init()
            b.load(atlasPath, SpriteAtlas, (err, atlas) => {
                if (err) {
                    error(err.message)
                    return resolve(null)
                }
                this.atlasMap.set(atlasPath, atlas)
                resolve(atlas)
            })
        })
    }

    async asyncFetchSpriteFrame(atlasPathWithFrameName: string) {
        const params = this.splitPath(atlasPathWithFrameName)
        const atlas = this.atlasMap.get(params[0]) || await this.asyncFetchAtlas(params[0])
        return atlas?.getSpriteFrame(params[1])
    }

    //res/tower/tower_5.png
    private splitPath(path: string) {
        // 去掉扩展名
        const noExt = path.replace(/\.[^/.]+$/, "");

        // 找到最后一个斜杠
        const lastSlash = noExt.lastIndexOf("/");

        // 分割
        const dir = noExt.substring(0, lastSlash);   // "res/tower"
        const name = noExt.substring(lastSlash + 1); // "tower_5"
        return [dir, name]
    }
}

export default new XAtlasLoader()


