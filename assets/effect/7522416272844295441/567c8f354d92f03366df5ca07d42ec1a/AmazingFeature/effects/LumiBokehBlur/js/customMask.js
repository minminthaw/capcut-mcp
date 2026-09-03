const Amaz = effect.Amaz;
const cv = Amaz.JSWrapCV;
const SCRIPT_NAME = 'customMask';
/**
 * System script is NOT recommended to be used anymore.
 * Avoid using system script unless you really have to.
 */
class customMask {
    constructor() {
        this.name = SCRIPT_NAME;
        this.dis = 7
        this.curTime = 0
    }

    /** onInit is called before onStart(). */
    onInit() { }

    /** onStart is called before the first onUpdate() call. */
    onStart() {
        this.effect_lua = this.entity.getComponent('ScriptComponent')
        this.customMaskMat = this.entity.searchEntity("customMask").getComponent("MeshRenderer").material;
    }

    jsArrayToAmzVec(contours) {
        let result = new Amaz.Vector();
        for (let index = 0; index < contours.length; index++) {
            let contour = contours[index];
            let vec2Vec = new Amaz.Vec2Vector();
            Amaz.AmazingUtil.arrayBufferToPrimitiveVector(contour, vec2Vec);
            result.pushBack(vec2Vec)
        }
        return result
    }
    /** onUpdate is called once every frame. */
    onUpdate(deltaTime) {

        if (this.effect_lua.properties.has("customMaskTex")) {
            this.mask = this.effect_lua.properties.get("customMaskTex").image
            if(this.mask == null){
                this.mask = this.effect_lua.properties.get("customMaskTex").getImage()
            }
            let mat = cv.Mat(this.mask);
            cv.resize(mat, mat, [100, 100])
            cv.cvtColor(mat, mat, 0xb);
            cv.threshold(mat, mat, 125, 255, 0)
            let elem = cv.getStructuringElement(2, [4, 4]);
            cv.erode(mat, mat, elem);
            // cv.dilate(mat, mat, elem);
            let intensity = this.effect_lua.properties.get("sample") / 80
            let quality = this.effect_lua.properties.get("quality")
            quality = Math.max(Math.min(quality, 1.0), 0.0)
            let intensitySize =  1 + 25 * intensity + 75 * quality
            cv.resize(mat, mat, [intensitySize, intensitySize])
            let contours = new Array();
            cv.findContours(mat, contours, 2, 1);
            let vec2vec = this.jsArrayToAmzVec(contours);
            let centerVector = new Amaz.Vec2Vector()
            let posVecNum = 0
            // this.startIndex += 2
            for (let i = 0; i < vec2vec.size(); ++i) {
                let vec2 = vec2vec.get(i)
                for (let i = 0; i < vec2.size(); i += 4) {
                    let pos = vec2.get(i)
                    centerVector.pushBack(new Amaz.Vector2f(pos.x * 1.0 / mat.cols, pos.y * 1.0 / mat.rows))
                    posVecNum++
                }
            }
            this.customMaskMat.setVec2Vector("posVec", centerVector)
            this.customMaskMat.setInt("posVecNum", posVecNum)
        }
        
    }

    /** onLateUpdate is called once every frame after onUpdate(). */
    onLateUpdate(deltaTime) { }

    /** onEvent is called when an event arrives. */
    onEvent(event) {
    }
    /** onDestroy is called when this script instance is destroyed. */
    onDestroy() { }

}

exports.customMask = customMask;