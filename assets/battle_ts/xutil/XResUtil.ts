import { assetManager, ImageAsset, Node, sp, SpriteFrame } from "cc";

export default class XResUtil {
    static ResBundleName = "res"
    static SpineBundleName = "spines"

    public static loadSpineFromBundle(bundleName: string, path: string): Promise<Node> {
        return new Promise((resolve) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    console.error('加载 bundle 出错:', err);
                    return;
                }
                bundle.load(path, sp.SkeletonData, (err, skeletonData) => {
                    if (err) {
                        console.error('加载 Spine 出错:', err);
                        return;
                    }
                    const node = this.packSpineToNode(skeletonData);
                    resolve(node)
                });
            });
        })
    }

    /**
     * 给 spineNode 添加 Spine 动画
     */
    private static packSpineToNode(skeletonData: sp.SkeletonData) {
        let node = new Node(skeletonData.name);
        let spine = node.addComponent(sp.Skeleton);
        spine.skeletonData = skeletonData;

        // 播放动画
        spine.setAnimation(0, "idle", true);
        return node
    }

    public static loadSpriteFromBundle(bundleName_: string, pathInBundle_: string): Promise<SpriteFrame> {
        return new Promise((resolve) => {
            assetManager.loadBundle(bundleName_, (err, bundle) => {
                if (err) {
                    console.error('加载 bundle 出错:', err);
                    return;
                }
                
                bundle.load(pathInBundle_, ImageAsset, (err, frame) => {
                    if (err) {
                        console.error('加载 SpriteFrame 出错:', err);
                        return;
                    }
                    resolve(SpriteFrame.createWithImage(frame))
                });
            });
        })
    }
}


