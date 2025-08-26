import { assetManager, Node, sp } from "cc";

export default class XResUtil {
    public static loadSpineFromBundle(bundleName: string, path: string):Promise<Node> {
        return new Promise((resolve)=>{
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
        let node = new Node();
        let spine = node.addComponent(sp.Skeleton);
        spine.skeletonData = skeletonData;

        // 播放动画
        spine.setAnimation(0, "idle", true);
        return node
    }
}


