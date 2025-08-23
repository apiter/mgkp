define("loading/laya.core.min.js", function(require, module, exports) {
    window.Laya = function(t) {
        "use strict";

        function e(t, e) {
            for (var i = 0, s = e.length; i < s; i += 2)
                if ("length" == e[i]) t.length = e[i + 1].call(t);
                else {
                    function r() {
                        var s = e[i],
                            r = e[i + 1];
                        Object.defineProperty(t, s, {get: function() {
                                return delete this[s], this[s] = r.call(this)
                            },
                            set: function(t) {
                                delete this[s], this[s] = t
                            },
                            enumerable: !0,
                            configurable: !0
                        })
                    }
                    r()
                }
        }
        class i {}
        i.animationInterval = 50, i.isAntialias = !0, i.isAlpha = !1, i.premultipliedAlpha = !0, i.isStencil = !0, i.preserveDrawingBuffer = !1, i.webGL2D_MeshAllocMaxMem = !0, i.is2DPixelArtGame = !1, i.useWebGL2 = !0, i.printWebglOrder = !1, i.allowGPUInstanceDynamicBatch = !0, i.enableStaticBatch = !0, i.useRetinalCanvas = !1, window.Config = i;
        class s {
            static regClass(t) {
                s.__classMap[t.name] = t
            }
        }
        s.Laya = null, s.Timer = null, s.WorkerLoader = null, s.Dragging = null, s.GraphicsBounds = null, s.Sprite = null, s.TextRender = null, s.TextAtlas = null, s.timer = null, s.systemTimer = null, s.startTimer = null, s.updateTimer = null, s.lateTimer = null, s.physicsTimer = null, s.stage = null, s.Loader = null, s.loader = null, s.TTFLoader = null, s.SoundManager = null, s.WebAudioSound = null, s.AudioSound = null, s.ShaderCompile = null, s.ClassUtils = null, s.SceneUtils = null, s.Context = null, s.Render = null, s.MouseManager = null, s.Text = null, s.Browser = null, s.WebGL = null, s.Pool = null, s.Utils = null, s.Graphics = null, s.Submit = null, s.Stage = null, s.Resource = null, s.__classMap = {};
        class r {
            static getPoolBySign(t) {
                return r._poolDic[t] || (r._poolDic[t] = [])
            }
            static clearBySign(t) {
                r._poolDic[t] && (r._poolDic[t].length = 0)
            }
            static recover(t, e) {
                e[r.POOLSIGN] || (e[r.POOLSIGN] = !0, r.getPoolBySign(t).push(e))
            }
            static recoverByClass(t) {
                if (t) {
                    var e = t.__className || t.constructor._$gid;
                    e && r.recover(e, t)
                }
            }
            static _getClassSign(t) {
                var e = t.__className || t._$gid;
                return e || (t._$gid = e = r._CLSID + "", r._CLSID++), e
            }
            static createByClass(t) {
                return r.getItemByClass(r._getClassSign(t), t)
            }
            static getItemByClass(t, e) {
                if (!r._poolDic[t]) return new e;
                var i = r.getPoolBySign(t);
                if (i.length) {
                    var s = i.pop();
                    s[r.POOLSIGN] = !1
                } else s = new e;
                return s
            }
            static getItemByCreateFun(t, e, i = null) {
                var s = r.getPoolBySign(t),
                    a = s.length ? s.pop() : e.call(i);
                return a[r.POOLSIGN] = !1, a
            }
            static getItem(t) {
                var e = r.getPoolBySign(t),
                    i = e.length ? e.pop() : null;
                return i && (i[r.POOLSIGN] = !1), i
            }
        }
        r._CLSID = 0, r.POOLSIGN = "__InPool", r._poolDic = {};
        class a {
            static create(t) {
                var e = r.getItemByClass("AlphaCmd", a);
                return e.alpha = t, e
            }
            recover() {
                r.recover("AlphaCmd", this)
            }
            run(t, e, i) {
                t.alpha(this.alpha)
            }
            get cmdID() {
                return a.ID
            }
        }
        a.ID = "Alpha";
        class n {
            static create(t, e, i, s, a, h, o) {
                var l = r.getItemByClass("DrawCircleCmd", n);
                return l.x = t, l.y = e, l.radius = i, l.fillColor = s, l.lineColor = a, l.lineWidth = h, l.vid = o, l
            }
            recover() {
                this.fillColor = null, this.lineColor = null, r.recover("DrawCircleCmd", this)
            }
            run(t, e, i) {
                t._drawCircle(this.x + e, this.y + i, this.radius, this.fillColor, this.lineColor, this.lineWidth, this.vid)
            }
            get cmdID() {
                return n.ID
            }
        }
        n.ID = "DrawCircle";
        class h {
            static create(t, e, i, s, a) {
                var n = r.getItemByClass("DrawCurvesCmd", h);
                return n.x = t, n.y = e, n.points = i, n.lineColor = s, n.lineWidth = a, n
            }
            recover() {
                this.points = null, this.lineColor = null, r.recover("DrawCurvesCmd", this)
            }
            run(t, e, i) {
                this.points && t.drawCurves(this.x + e, this.y + i, this.points, this.lineColor, this.lineWidth)
            }
            get cmdID() {
                return h.ID
            }
        }
        h.ID = "DrawCurves";
        class o {
            static create(t, e, i, s, a) {
                var n = r.getItemByClass("DrawImageCmd", o);
                return n.texture = t, t._addReference(), n.x = e, n.y = i, n.width = s, n.height = a, n
            }
            recover() {
                this.texture && this.texture._removeReference(), this.texture = null, r.recover("DrawImageCmd", this)
            }
            run(t, e, i) {
                this.texture && t.drawTexture(this.texture, this.x + e, this.y + i, this.width, this.height)
            }
            get cmdID() {
                return o.ID
            }
        }
        o.ID = "DrawImage";
        class l {
            static create(t, e, i, s, a, n, h) {
                var o = r.getItemByClass("DrawLineCmd", l);
                return o.fromX = t, o.fromY = e, o.toX = i, o.toY = s, o.lineColor = a, o.lineWidth = n, o.vid = h, o
            }
            recover() {
                r.recover("DrawLineCmd", this)
            }
            run(t, e, i) {
                t._drawLine(e, i, this.fromX, this.fromY, this.toX, this.toY, this.lineColor, this.lineWidth, this.vid)
            }
            get cmdID() {
                return l.ID
            }
        }
        l.ID = "DrawLine";
        class _ {
            static create(t, e, i, s, a, n) {
                var h = r.getItemByClass("DrawLinesCmd", _);
                return h.x = t, h.y = e, h.points = i, h.lineColor = s, h.lineWidth = a, h.vid = n, h
            }
            recover() {
                this.points = null, this.lineColor = null, r.recover("DrawLinesCmd", this)
            }
            run(t, e, i) {
                this.points && t._drawLines(this.x + e, this.y + i, this.points, this.lineColor, this.lineWidth, this.vid)
            }
            get cmdID() {
                return _.ID
            }
        }
        _.ID = "DrawLines";
        class u {
            static create(t, e, i, s, a) {
                var n = r.getItemByClass("DrawPathCmd", u);
                return n.x = t, n.y = e, n.paths = i, n.brush = s, n.pen = a, n
            }
            recover() {
                this.paths = null, this.brush = null, this.pen = null, r.recover("DrawPathCmd", this)
            }
            run(t, e, i) {
                this.paths && t._drawPath(this.x + e, this.y + i, this.paths, this.brush, this.pen)
            }
            get cmdID() {
                return u.ID
            }
        }
        u.ID = "DrawPath";
        class c {
            static create(t, e, i, s, a, n, h, o, l) {
                var _ = r.getItemByClass("DrawPieCmd", c);
                return _.x = t, _.y = e, _.radius = i, _._startAngle = s, _._endAngle = a, _.fillColor = n, _.lineColor = h, _.lineWidth = o, _.vid = l, _
            }
            recover() {
                this.fillColor = null, this.lineColor = null, r.recover("DrawPieCmd", this)
            }
            run(t, e, i) {
                t._drawPie(this.x + e, this.y + i, this.radius, this._startAngle, this._endAngle, this.fillColor, this.lineColor, this.lineWidth, this.vid)
            }
            get cmdID() {
                return c.ID
            }
            get startAngle() {
                return 180 * this._startAngle / Math.PI
            }
            set startAngle(t) {
                this._startAngle = t * Math.PI / 180
            }
            get endAngle() {
                return 180 * this._endAngle / Math.PI
            }
            set endAngle(t) {
                this._endAngle = t * Math.PI / 180
            }
        }
        c.ID = "DrawPie";
        class d {
            static create(t, e, i, s, a, n, h, o) {
                var l = r.getItemByClass("DrawPolyCmd", d);
                return l.x = t, l.y = e, l.points = i, l.fillColor = s, l.lineColor = a, l.lineWidth = n, l.isConvexPolygon = h, l.vid = o, l
            }
            recover() {
                this.points = null, this.fillColor = null, this.lineColor = null, r.recover("DrawPolyCmd", this)
            }
            run(t, e, i) {
                this.points && t._drawPoly(this.x + e, this.y + i, this.points, this.fillColor, this.lineColor, this.lineWidth, this.isConvexPolygon, this.vid)
            }
            get cmdID() {
                return d.ID
            }
        }
        d.ID = "DrawPoly";
        class p {
            static create(t, e, i, s, a, n, h) {
                var o = r.getItemByClass("DrawRectCmd", p);
                return o.x = t, o.y = e, o.width = i, o.height = s, o.fillColor = a, o.lineColor = n, o.lineWidth = h, o
            }
            recover() {
                this.fillColor = null, this.lineColor = null, r.recover("DrawRectCmd", this)
            }
            run(t, e, i) {
                t.drawRect(this.x + e, this.y + i, this.width, this.height, this.fillColor, this.lineColor, this.lineWidth)
            }
            get cmdID() {
                return p.ID
            }
        }
        p.ID = "DrawRect";
        class f {
            constructor(t = 1, e = 0, i = 0, s = 1, r = 0, a = 0, n = 0) {
                if (this._bTransform = !1, null != f._createFun) return f._createFun(t, e, i, s, r, a, n);
                this.a = t, this.b = e, this.c = i, this.d = s, this.tx = r, this.ty = a, this._checkTransform()
            }
            identity() {
                return this.a = this.d = 1, this.b = this.tx = this.ty = this.c = 0, this._bTransform = !1, this
            }
            _checkTransform() {
                return this._bTransform = 1 !== this.a || 0 !== this.b || 0 !== this.c || 1 !== this.d
            }
            setTranslate(t, e) {
                return this.tx = t, this.ty = e, this
            }
            translate(t, e) {
                return this.tx += t, this.ty += e, this
            }
            scale(t, e) {
                return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this._bTransform = !0, this
            }
            rotate(t) {
                var e = Math.cos(t),
                    i = Math.sin(t),
                    s = this.a,
                    r = this.c,
                    a = this.tx;
                return this.a = s * e - this.b * i, this.b = s * i + this.b * e, this.c = r * e - this.d * i, this.d = r * i + this.d * e, this.tx = a * e - this.ty * i, this.ty = a * i + this.ty * e, this._bTransform = !0, this
            }
            skew(t, e) {
                var i = Math.tan(t),
                    s = Math.tan(e),
                    r = this.a,
                    a = this.b;
                return this.a += s * this.c, this.b += s * this.d, this.c += i * r, this.d += i * a, this
            }
            invertTransformPoint(t) {
                var e = this.a,
                    i = this.b,
                    s = this.c,
                    r = this.d,
                    a = this.tx,
                    n = e * r - i * s,
                    h = r / n,
                    o = -i / n,
                    l = -s / n,
                    _ = e / n,
                    u = (s * this.ty - r * a) / n,
                    c = -(e * this.ty - i * a) / n;
                return t.setTo(h * t.x + l * t.y + u, o * t.x + _ * t.y + c)
            }
            transformPoint(t) {
                return t.setTo(this.a * t.x + this.c * t.y + this.tx, this.b * t.x + this.d * t.y + this.ty)
            }
            transformPointN(t) {
                return t.setTo(this.a * t.x + this.c * t.y, this.b * t.x + this.d * t.y)
            }
            getScaleX() {
                return 0 === this.b ? this.a : Math.sqrt(this.a * this.a + this.b * this.b)
            }
            getScaleY() {
                return 0 === this.c ? this.d : Math.sqrt(this.c * this.c + this.d * this.d)
            }
            invert() {
                var t = this.a,
                    e = this.b,
                    i = this.c,
                    s = this.d,
                    r = this.tx,
                    a = t * s - e * i;
                return this.a = s / a, this.b = -e / a, this.c = -i / a, this.d = t / a, this.tx = (i * this.ty - s * r) / a, this.ty = -(t * this.ty - e * r) / a, this
            }
            setTo(t, e, i, s, r, a) {
                return this.a = t, this.b = e, this.c = i, this.d = s, this.tx = r, this.ty = a, this
            }
            concat(t) {
                var e = this.a,
                    i = this.c,
                    s = this.tx;
                return this.a = e * t.a + this.b * t.c, this.b = e * t.b + this.b * t.d, this.c = i * t.a + this.d * t.c, this.d = i * t.b + this.d * t.d, this.tx = s * t.a + this.ty * t.c + t.tx, this.ty = s * t.b + this.ty * t.d + t.ty, this
            }
            static mul(t, e, i) {
                var s = t.a,
                    r = t.b,
                    a = t.c,
                    n = t.d,
                    h = t.tx,
                    o = t.ty,
                    l = e.a,
                    _ = e.b,
                    u = e.c,
                    c = e.d,
                    d = e.tx,
                    p = e.ty;
                return 0 !== _ || 0 !== u ? (i.a = s * l + r * u, i.b = s * _ + r * c, i.c = a * l + n * u, i.d = a * _ + n * c, i.tx = l * h + u * o + d, i.ty = _ * h + c * o + p) : (i.a = s * l, i.b = r * c, i.c = a * l, i.d = n * c, i.tx = l * h + d, i.ty = c * o + p), i
            }
            static mul16(t, e, i) {
                var s = t.a,
                    r = t.b,
                    a = t.c,
                    n = t.d,
                    h = t.tx,
                    o = t.ty,
                    l = e.a,
                    _ = e.b,
                    u = e.c,
                    c = e.d,
                    d = e.tx,
                    p = e.ty;
                return 0 !== _ || 0 !== u ? (i[0] = s * l + r * u, i[1] = s * _ + r * c, i[4] = a * l + n * u, i[5] = a * _ + n * c, i[12] = l * h + u * o + d, i[13] = _ * h + c * o + p) : (i[0] = s * l, i[1] = r * c, i[4] = a * l, i[5] = n * c, i[12] = l * h + d, i[13] = c * o + p), i
            }
            scaleEx(t, e) {
                var i = this.a,
                    s = this.b,
                    r = this.c,
                    a = this.d;
                0 !== s || 0 !== r ? (this.a = t * i, this.b = t * s, this.c = e * r, this.d = e * a) : (this.a = t * i, this.b = 0 * a, this.c = 0 * i, this.d = e * a), this._bTransform = !0
            }
            rotateEx(t) {
                var e = Math.cos(t),
                    i = Math.sin(t),
                    s = this.a,
                    r = this.b,
                    a = this.c,
                    n = this.d;
                0 !== r || 0 !== a ? (this.a = e * s + i * a, this.b = e * r + i * n, this.c = -i * s + e * a, this.d = -i * r + e * n) : (this.a = e * s, this.b = i * n, this.c = -i * s, this.d = e * n), this._bTransform = !0
            }
            clone() {
                var t = f.create();
                return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t._bTransform = this._bTransform, t
            }
            copyTo(t) {
                return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t._bTransform = this._bTransform, t
            }
            toString() {
                return this.a + "," + this.b + "," + this.c + "," + this.d + "," + this.tx + "," + this.ty
            }
            destroy() {
                this.recover()
            }
            recover() {
                r.recover("Matrix", this.identity())
            }
            static create() {
                return r.getItemByClass("Matrix", f)
            }
        }
        f.EMPTY = new f, f.TEMP = new f, f._createFun = null;
        class m {
            constructor(t = 0, e = 0) {
                this.x = t, this.y = e
            }
            static create() {
                return r.getItemByClass("Point", m)
            }
            setTo(t, e) {
                return this.x = t, this.y = e, this
            }
            reset() {
                return this.x = this.y = 0, this
            }
            recover() {
                r.recover("Point", this.reset())
            }
            distance(t, e) {
                return Math.sqrt((this.x - t) * (this.x - t) + (this.y - e) * (this.y - e))
            }
            toString() {
                return this.x + "," + this.y
            }
            normalize() {
                var t = Math.sqrt(this.x * this.x + this.y * this.y);
                if (t > 0) {
                    var e = 1 / t;
                    this.x *= e, this.y *= e
                }
            }
            copy(t) {
                return this.setTo(t.x, t.y)
            }
        }
        m.TEMP = new m, m.EMPTY = new m;
        class g {
            constructor(t = 0, e = 0, i = 0, s = 0) {
                this.x = t, this.y = e, this.width = i, this.height = s
            }
            get right() {
                return this.x + this.width
            }
            get bottom() {
                return this.y + this.height
            }
            setTo(t, e, i, s) {
                return this.x = t, this.y = e, this.width = i, this.height = s, this
            }
            reset() {
                return this.x = this.y = this.width = this.height = 0, this
            }
            recover() {
                this != g.TEMP && this != g.EMPTY ? r.recover("Rectangle", this.reset()) : console.log("recover Temp or Empty:", this)
            }
            static create() {
                return r.getItemByClass("Rectangle", g)
            }
            copyFrom(t) {
                return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this
            }
            contains(t, e) {
                return !(this.width <= 0 || this.height <= 0) && (t >= this.x && t < this.right && e >= this.y && e < this.bottom)
            }
            intersects(t) {
                return !(t.x > this.x + this.width || t.x + t.width < this.x || t.y > this.y + this.height || t.y + t.height < this.y)
            }
            intersection(t, e = null) {
                return this.intersects(t) ? (e || (e = new g), e.x = Math.max(this.x, t.x), e.y = Math.max(this.y, t.y), e.width = Math.min(this.right, t.right) - e.x, e.height = Math.min(this.bottom, t.bottom) - e.y, e) : null
            }
            union(t, e = null) {
                return e || (e = new g), this.clone(e), t.width <= 0 || t.height <= 0 ? e : (e.addPoint(t.x, t.y), e.addPoint(t.right, t.bottom), this)
            }
            clone(t = null) {
                return t || (t = new g), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t
            }
            toString() {
                return this.x + "," + this.y + "," + this.width + "," + this.height
            }
            equals(t) {
                return !(!t || t.x !== this.x || t.y !== this.y || t.width !== this.width || t.height !== this.height)
            }
            addPoint(t, e) {
                return this.x > t && (this.width += this.x - t, this.x = t), this.y > e && (this.height += this.y - e, this.y = e), this.width < t - this.x && (this.width = t - this.x), this.height < e - this.y && (this.height = e - this.y), this
            }
            _getBoundPoints() {
                var t = g._temB;
                return t.length = 0, 0 == this.width || 0 == this.height ? t : (t.push(this.x, this.y, this.x + this.width, this.y, this.x, this.y + this.height, this.x + this.width, this.y + this.height), t)
            }
            static _getBoundPointS(t, e, i, s) {
                var r = g._temA;
                return r.length = 0, 0 == i || 0 == s ? r : (r.push(t, e, t + i, e, t, e + s, t + i, e + s), r)
            }
            static _getWrapRec(t, e = null) {
                if (!t || t.length < 1) return e ? e.setTo(0, 0, 0, 0) : g.TEMP.setTo(0, 0, 0, 0);
                e = e || g.create();
                var i, s, r, a, n, h = t.length,
                    o = m.TEMP;
                for (s = a = 99999, r = n = -s, i = 0; i < h; i += 2) o.x = t[i], o.y = t[i + 1], s = s < o.x ? s : o.x, a = a < o.y ? a : o.y, r = r > o.x ? r : o.x, n = n > o.y ? n : o.y;
                return e.setTo(s, a, r - s, n - a)
            }
            isEmpty() {
                return this.width <= 0 || this.height <= 0
            }
        }
        g.EMPTY = new g, g.TEMP = new g, g._temB = [], g._temA = [];
        class T {}
        T.ARRAY_BUFFER_TYPE_DATA = 0, T.ARRAY_BUFFER_TYPE_CMD = 1, T.ARRAY_BUFFER_REF_REFERENCE = 0, T.ARRAY_BUFFER_REF_COPY = 1, T.UPLOAD_SHADER_UNIFORM_TYPE_ID = 0, T.UPLOAD_SHADER_UNIFORM_TYPE_DATA = 1;
        var v, x, y, E, A, C, R = 1,
            b = 0;
        class S {
            static __init__() {
                var t = T.instance;
                S._depthFunc = t.LESS, S._blendEquation = t.FUNC_ADD, S._blendEquationRGB = t.FUNC_ADD, S._blendEquationAlpha = t.FUNC_ADD, R = t.ONE, b = t.ZERO, S._sFactorAlpha = t.ONE, S._dFactorAlpha = t.ZERO, S._activedTextureID = t.TEXTURE0;
                var e = t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
                S._activeTextures = new Array(e), S._glTextureIDs = [t.TEXTURE0, t.TEXTURE1, t.TEXTURE2, t.TEXTURE3, t.TEXTURE4, t.TEXTURE5, t.TEXTURE6, t.TEXTURE7, t.TEXTURE8, t.TEXTURE9, t.TEXTURE10, t.TEXTURE11, t.TEXTURE12, t.TEXTURE13, t.TEXTURE14, t.TEXTURE15, t.TEXTURE16, t.TEXTURE17, t.TEXTURE18, t.TEXTURE19, t.TEXTURE20, t.TEXTURE21, t.TEXTURE22, t.TEXTURE23, t.TEXTURE24, t.TEXTURE25, t.TEXTURE26, t.TEXTURE27, t.TEXTURE28, t.TEXTURE29, t.TEXTURE30, t.TEXTURE31];
                var i = t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),
                    s = t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS);
                S._maxUniformFragmentVectors = Math.min(i, s)
            }
            static useProgram(t, e) {
                return S._useProgram !== e && (t.useProgram(e), S._useProgram = e, !0)
            }
            static setDepthTest(t, e) {
                e !== S._depthTest && (S._depthTest = e, e ? t.enable(t.DEPTH_TEST) : t.disable(t.DEPTH_TEST))
            }
            static setDepthMask(t, e) {
                e !== S._depthMask && (S._depthMask = e, t.depthMask(e))
            }
            static setDepthFunc(t, e) {
                e !== S._depthFunc && (S._depthFunc = e, t.depthFunc(e))
            }
            static setStencilTest(t, e) {
                e !== S._stencilTest && (S._stencilTest = e, e ? t.enable(t.STENCIL_TEST) : t.disable(t.STENCIL_TEST))
            }
            static setStencilMask(t, e) {
                e !== S._stencilMask && (S._stencilMask = e, e ? t.stencilMask(255) : t.stencilMask(0))
            }
            static setStencilFunc(t, e, i) {
                e == S._stencilFunc && i == S._stencilRef || (S._stencilFunc = e, S._stencilRef = i, t.stencilFunc(e, i, 255))
            }
            static setstencilOp(t, e, i, s) {
                S._stencilOp_fail == e && S._stencilOp_zfail == i && S._stencilOp_zpass == s || (S._stencilOp_fail = e, S._stencilOp_zfail = i, S._stencilOp_zpass = s, t.stencilOp(e, i, s))
            }
            static setBlend(t, e) {
                e !== S._blend && (S._blend = e, e ? t.enable(t.BLEND) : t.disable(t.BLEND))
            }
            static setBlendEquation(t, e) {
                e !== S._blendEquation && (S._blendEquation = e, S._blendEquationRGB = S._blendEquationAlpha = null, t.blendEquation(e))
            }
            static setBlendEquationSeparate(t, e, i) {
                e === S._blendEquationRGB && i === S._blendEquationAlpha || (S._blendEquationRGB = e, S._blendEquationAlpha = i, S._blendEquation = null, t.blendEquationSeparate(e, i))
            }
            static setBlendFunc(t, e, i, s = !1) {
                (s || e !== R || i !== b) && (R = e, b = i, S._sFactorRGB = null, S._dFactorRGB = null, S._sFactorAlpha = null, S._dFactorAlpha = null, t.blendFunc(e, i))
            }
            static setBlendFuncSeperate(t, e, i, s, r) {
                e === S._sFactorRGB && i === S._dFactorRGB && s === S._sFactorAlpha && r === S._dFactorAlpha || (S._sFactorRGB = e, S._dFactorRGB = i, S._sFactorAlpha = s, S._dFactorAlpha = r, R = null, b = null, t.blendFuncSeparate(e, i, s, r))
            }
            static setCullFace(t, e) {
                e !== S._cullFace && (S._cullFace = e, e ? t.enable(t.CULL_FACE) : t.disable(t.CULL_FACE))
            }
            static setFrontFace(t, e) {
                e !== S._frontFace && (S._frontFace = e, t.frontFace(e))
            }
            static activeTexture(t, e) {
                S._activedTextureID !== e && (t.activeTexture(e), S._activedTextureID = e)
            }
            static bindTexture(t, e, i) {
                S._activeTextures[S._activedTextureID - t.TEXTURE0] !== i && (t.bindTexture(e, i), S._activeTextures[S._activedTextureID - t.TEXTURE0] = i)
            }
            static __init_native() {
                if (s.Render.supportWebGLPlusRendering) {
                    var t = S;
                    t.activeTexture = t.activeTextureForNative, t.bindTexture = t.bindTextureForNative
                }
            }
            static useProgramForNative(t, e) {
                return t.useProgram(e), !0
            }
            static setDepthTestForNative(t, e) {
                e ? t.enable(t.DEPTH_TEST) : t.disable(t.DEPTH_TEST)
            }
            static setDepthMaskForNative(t, e) {
                t.depthMask(e)
            }
            static setDepthFuncForNative(t, e) {
                t.depthFunc(e)
            }
            static setBlendForNative(t, e) {
                e ? t.enable(t.BLEND) : t.disable(t.BLEND)
            }
            static setBlendFuncForNative(t, e, i) {
                t.blendFunc(e, i)
            }
            static setCullFaceForNative(t, e) {
                e ? t.enable(t.CULL_FACE) : t.disable(t.CULL_FACE)
            }
            static setFrontFaceForNative(t, e) {
                t.frontFace(e)
            }
            static activeTextureForNative(t, e) {
                t.activeTexture(e)
            }
            static bindTextureForNative(t, e, i) {
                t.bindTexture(e, i)
            }
            static bindVertexArrayForNative(t, e) {
                t.bindVertexArray(e)
            }
            static getUniformMaxVector() {
                return S._maxUniformFragmentVectors
            }
        }
        S._activeTextures = new Array(1), S._useProgram = null, S._depthTest = !0, S._depthMask = !0, S._stencilTest = !1, S._blend = !1, S._cullFace = !1, S.mainContext = null;
        class w {
            constructor(t = null, e = null, i = null, s = !1) {
                this.once = s, this._id = 0, this.setTo(t, e, i, s)
            }
            setTo(t, e, i, s = !1) {
                return this._id = w._gid++, this.caller = t, this.method = e, this.args = i, this.once = s, this
            }
            run() {
                if (null == this.method) return null;
                var t = this._id,
                    e = this.method.apply(this.caller, this.args);
                return this._id === t && this.once && this.recover(), e
            }
            runWith(t) {
                if (null == this.method) return null;
                var e = this._id;
                if (null == t) var i = this.method.apply(this.caller, this.args);
                else i = this.args || t.unshift ? this.args ? this.method.apply(this.caller, this.args.concat(t)) : this.method.apply(this.caller, t) : this.method.call(this.caller, t);
                return this._id === e && this.once && this.recover(), i
            }
            clear() {
                return this.caller = null, this.method = null, this.args = null, this
            }
            recover() {
                this._id > 0 && (this._id = 0, this.clear())
            }
            static create(t, e, i = null, s = !0) {
                return new w(t, e, i, s)
            }
        }
        w._pool = [], w._gid = 1;
        class M {
            hasListener(t) {
                var e = this._events && this._events[t];
                return !!e
            }
            event(t, e = null) {
                if (!this._events || !this._events[t]) return !1;
                let i = !0;
                e && e.ignoreDestroyed && (i = !1);
                var s = this._events[t];
                if (s.run) {
                    let r = !1,
                        a = s.caller;
                    i && a && (a instanceof Fe || a instanceof di) && a.destroyed && (r = !0), t == Fi.Event.REMOVED && (r = !1), (s.once || r) && delete this._events[t], r || (null != e ? s.runWith(e) : s.run())
                } else {
                    for (var r = 0, a = s.length; r < a; r++) {
                        var n = s[r];
                        let h = !1;
                        i && n && n.caller && (n.caller instanceof Fe || n.caller instanceof di) && n.caller.destroyed && (h = !0), t == Fi.Event.REMOVED && (h = !1), n && !h && (null != e ? n.runWith(e) : n.run()), (!n || n.once || h) && (s.splice(r, 1), r--, a--)
                    }
                    0 === s.length && this._events && this._events[t] && !this._events[t].run && delete this._events[t]
                }
                return !0
            }
            on(t, e, i, s = null) {
                return this._createListener(t, e, i, s, !1)
            }
            once(t, e, i, s = null) {
                return this._createListener(t, e, i, s, !0)
            }
            _createListener(t, e, i, s, r, a = !0) {
                a && this.off(t, e, i, r);
                var n = I.create(e || this, i, s, r);
                this._events || (this._events = {});
                var h = this._events;
                return h[t] ? h[t].run ? h[t] = [h[t], n] : h[t].push(n) : h[t] = n, this
            }
            off(t, e, i, s = !1) {
                if (!this._events || !this._events[t]) return this;
                var r = this._events[t];
                if (null != r)
                    if (r.run) e && r.caller !== e || null != i && r.method !== i || s && !r.once || (delete this._events[t], r.recover());
                    else {
                        for (var a = 0, n = 0, h = r.length; n < h; n++) {
                            var o = r[n];
                            o ? !o || e && o.caller !== e || null != i && o.method !== i || s && !o.once || (a++, r[n] = null, o.recover()) : a++
                        }
                        a === h && delete this._events[t]
                    }
                return this
            }
            offAll(t = null) {
                var e = this._events;
                if (!e) return this;
                if (t) this._recoverHandlers(e[t]), delete e[t];
                else {
                    for (var i in e) this._recoverHandlers(e[i]);
                    this._events = null
                }
                return this
            }
            offAllCaller(t) {
                if (t && this._events)
                    for (var e in this._events) this.off(e, t, null);
                return this
            }
            _recoverHandlers(t) {
                if (t)
                    if (t.run) t.recover();
                    else
                        for (var e = t.length - 1; e > -1; e--) t[e] && (t[e].recover(), t[e] = null)
            }
            isMouseEvent(t) {
                return M.MOUSE_EVENTS[t] || !1
            }
        }
        M.MOUSE_EVENTS = {
            rightmousedown: !0,
            rightmouseup: !0,
            rightclick: !0,
            mousedown: !0,
            mouseup: !0,
            mousemove: !0,
            mouseover: !0,
            mouseout: !0,
            click: !0,
            doubleclick: !0
        };
        class I extends w {
            constructor(t, e, i, s) {
                super(t, e, i, s)
            }
            recover() {
                this._id > 0 && (this._id = 0, I._pool.push(this.clear()))
            }
            static create(t, e, i = null, s = !0) {
                return I._pool.length ? I._pool.pop().setTo(t, e, i, s) : new I(t, e, i, s)
            }
        }
        I._pool = [];
        class P {
            constructor(t) {
                this._url = P.formatURL(t), this._path = P.getPath(t)
            }
            get url() {
                return this._url
            }
            get path() {
                return this._path
            }
            static set basePath(t) {
                P._basePath = s.Laya._getUrlPath(), P._basePath = P.formatURL(t)
            }
            static get basePath() {
                return P._basePath
            }
            static formatURL(t) {
                if (!t) return "null path";
                if (t.indexOf(":") > 0) return t;
                P.exportSceneToJson && (t = P.getAdptedFilePath(t)), null != P.customFormat && (t = P.customFormat(t));
                var e = t.charAt(0);
                if ("." === e) return P._formatRelativePath(P._basePath + t);
                if ("~" === e) return P.rootPath + t.substring(1);
                if ("d" === e) {
                    if (0 === t.indexOf("data:image")) return t
                } else if ("/" === e) return t;
                return P._basePath + t
            }
            static _formatRelativePath(t) {
                for (var e = t.split("/"), i = 0, s = e.length; i < s; i++) ".." == e[i] && (e.splice(i - 1, 2), i -= 2);
                return e.join("/")
            }
            static getPath(t) {
                var e = t.lastIndexOf("/");
                return e > 0 ? t.substr(0, e + 1) : ""
            }
            static getFileName(t) {
                var e = t.lastIndexOf("/");
                return e > 0 ? t.substr(e + 1) : t
            }
            static getAdptedFilePath(t) {
                if (!P.exportSceneToJson || !t) return t;
                var e, i, s;
                for (i = P._adpteTypeList.length, e = 0; e < i; e++) s = P._adpteTypeList[e], t = t.replace(s[0], s[1]);
                return t
            }
        }
        P.version = {}, P.exportSceneToJson = !1, P._basePath = "", P.rootPath = "", P.customFormat = function(t) {
            var e = P.version[t];
            return !window.conch && e && (t += "?v=" + e), t
        }, P._adpteTypeList = [
            [".scene3d", ".json"],
            [".scene", ".json"],
            [".taa", ".json"],
            [".prefab", ".json"]
        ];
        class D extends M {
            constructor() {
                super(), this._id = 0, this._url = null, this._cpuMemory = 0, this._gpuMemory = 0, this._destroyed = !1, this._referenceCount = 0, this.lock = !1, this.name = null, this._id = ++D._uniqueIDCounter, this._destroyed = !1, this._referenceCount = 0, D._idResourcesMap[this.id] = this, this.lock = !1
            }
            static get cpuMemory() {
                return D._cpuMemory
            }
            static get gpuMemory() {
                return D._gpuMemory
            }
            static _addCPUMemory(t) {
                D._cpuMemory += t
            }
            static _addGPUMemory(t) {
                D._gpuMemory += t
            }
            static _addMemory(t, e) {
                D._cpuMemory += t, D._gpuMemory += e
            }
            static getResourceByID(t) {
                return D._idResourcesMap[t]
            }
            static getResourceByURL(t, e = 0) {
                return D._urlResourcesMap[t][e]
            }
            static destroyUnusedResources() {
                if (!Fi.isWXPlayable)
                    for (var t in D._idResourcesMap) {
                        var e = D._idResourcesMap[t];
                        e.lock || 0 !== e._referenceCount || e.destroy()
                    }
            }
            get id() {
                return this._id
            }
            get url() {
                return this._url
            }
            get cpuMemory() {
                return this._cpuMemory
            }
            get gpuMemory() {
                return this._gpuMemory
            }
            get destroyed() {
                return this._destroyed
            }
            get referenceCount() {
                return this._referenceCount
            }
            _setCPUMemory(t) {
                var e = t - this._cpuMemory;
                this._cpuMemory = t, D._addCPUMemory(e)
            }
            _setGPUMemory(t) {
                var e = t - this._gpuMemory;
                this._gpuMemory = t, D._addGPUMemory(e)
            }
            _setCreateURL(t) {
                var e;
                (t = P.formatURL(t), this._url !== t) && (this._url && (e = D._urlResourcesMap[this._url], e.splice(e.indexOf(this), 1), 0 === e.length && delete D._urlResourcesMap[this._url]), t && (e = D._urlResourcesMap[t], e || (D._urlResourcesMap[t] = e = []), e.push(this)), this._url = t)
            }
            _addReference(t = 1) {
                this._referenceCount += t
            }
            _removeReference(t = 1) {
                this._referenceCount -= t
            }
            _clearReference() {
                this._referenceCount = 0
            }
            _recoverResource() {}
            _disposeResource() {}
            _activeResource() {}
            destroy() {
                var t;
                if (!this._destroyed && (this._destroyed = !0, this.lock = !1, this._disposeResource(), delete D._idResourcesMap[this.id], this._url)) {
                    t = D._urlResourcesMap[this._url], t && (t.splice(t.indexOf(this), 1), 0 === t.length && delete D._urlResourcesMap[this._url]);
                    var e = s.Loader.loadedMap[this._url];
                    e == this && delete s.Loader.loadedMap[this._url]
                }
            }
        }
        D._uniqueIDCounter = 0, D._idResourcesMap = {}, D._urlResourcesMap = {}, D._cpuMemory = 0, D._gpuMemory = 0;
        class L extends D {
            constructor() {
                super(), this._width = -1, this._height = -1
            }
            get width() {
                return this._width
            }
            set width(t) {
                this._width = t
            }
            get height() {
                return this._height
            }
            set height(t) {
                this._height = t
            }
            _getSource() {
                throw "Bitmap: must override it."
            }
        }
        v = t.FilterMode || (t.FilterMode = {}), v[v.Point = 0] = "Point", v[v.Bilinear = 1] = "Bilinear", v[v.Trilinear = 2] = "Trilinear", x = t.TextureFormat || (t.TextureFormat = {}), x[x.R8G8B8 = 0] = "R8G8B8", x[x.R8G8B8A8 = 1] = "R8G8B8A8", x[x.R5G6B5 = 16] = "R5G6B5", x[x.Alpha8 = 2] = "Alpha8", x[x.DXT1 = 3] = "DXT1", x[x.DXT5 = 4] = "DXT5", x[x.ETC1RGB = 5] = "ETC1RGB", x[x.ETC2RGB = 6] = "ETC2RGB", x[x.ETC2RGBA = 7] = "ETC2RGBA", x[x.ETC2RGB_Alpha8 = 8] = "ETC2RGB_Alpha8", x[x.ETC2SRGB = 28] = "ETC2SRGB", x[x.PVRTCRGB_2BPPV = 9] = "PVRTCRGB_2BPPV", x[x.PVRTCRGBA_2BPPV = 10] = "PVRTCRGBA_2BPPV", x[x.PVRTCRGB_4BPPV = 11] = "PVRTCRGB_4BPPV", x[x.PVRTCRGBA_4BPPV = 12] = "PVRTCRGBA_4BPPV", x[x.R32G32B32A32 = 15] = "R32G32B32A32", x[x.R16G16B16A16 = 17] = "R16G16B16A16", x[x.ASTC4x4 = 18] = "ASTC4x4", x[x.ASTC4x4SRGB = 23] = "ASTC4x4SRGB", x[x.ASTC6x6 = 19] = "ASTC6x6", x[x.ASTC6x6SRGB = 24] = "ASTC6x6SRGB", x[x.ASTC8x8 = 20] = "ASTC8x8", x[x.ASTC8x8SRGB = 25] = "ASTC8x8SRGB", x[x.ASTC10x10 = 21] = "ASTC10x10", x[x.ASTC10x10SRGB = 26] = "ASTC10x10SRGB", x[x.ASTC12x12 = 22] = "ASTC12x12", x[x.ASTC12x12SRGB = 27] = "ASTC12x12SRGB", x[x.KTXTEXTURE = -1] = "KTXTEXTURE", x[x.PVRTEXTURE = -2] = "PVRTEXTURE", y = t.WarpMode || (t.WarpMode = {}), y[y.Repeat = 0] = "Repeat", y[y.Clamp = 1] = "Clamp", y[y.Mirrored = 2] = "Mirrored";
        class B extends L {
            constructor(e, i) {
                super(), this._wrapModeU = t.WarpMode.Repeat, this._wrapModeV = t.WarpMode.Repeat, this._filterMode = t.FilterMode.Bilinear, this._readyed = !1, this._width = -1, this._height = -1, this._format = e, this._mipmap = i, this._anisoLevel = 1, this._glTexture = T.instance.createTexture()
            }
            get mipmap() {
                return this._mipmap
            }
            get format() {
                return this._format
            }
            get wrapModeU() {
                return this._wrapModeU
            }
            set wrapModeU(t) {
                this._wrapModeU !== t && (this._wrapModeU = t, -1 !== this._width && this._setWarpMode(T.instance.TEXTURE_WRAP_S, t))
            }
            get wrapModeV() {
                return this._wrapModeV
            }
            set wrapModeV(t) {
                this._wrapModeV !== t && (this._wrapModeV = t, -1 !== this._height && this._setWarpMode(T.instance.TEXTURE_WRAP_T, t))
            }
            get filterMode() {
                return this._filterMode
            }
            set filterMode(t) {
                t !== this._filterMode && (this._filterMode = t, -1 !== this._width && -1 !== this._height && this._setFilterMode(t))
            }
            get anisoLevel() {
                return this._anisoLevel
            }
            set anisoLevel(t) {
                t !== this._anisoLevel && (this._anisoLevel = Math.max(1, Math.min(16, t)), -1 !== this._width && -1 !== this._height && this._setAnisotropy(t))
            }
            get mipmapCount() {
                return this._mipmapCount
            }
            set mipmapCount(t) {
                this._mipmapCount = t
            }
            get defaulteTexture() {
                throw "BaseTexture:must override it."
            }
            _getFormatByteCount() {
                switch (this._format) {
                    case t.TextureFormat.R8G8B8:
                        return 3;
                    case t.TextureFormat.R8G8B8A8:
                        return 4;
                    case t.TextureFormat.R5G6B5:
                    case t.TextureFormat.Alpha8:
                        return 1;
                    case t.TextureFormat.R16G16B16A16:
                        return 2;
                    case t.TextureFormat.R32G32B32A32:
                        return 4;
                    default:
                        throw "Texture2D: unknown format."
                }
            }
            _isPot(t) {
                return 0 == (t & t - 1)
            }
            _getGLFormat() {
                var e, i = T.instance,
                    s = T.layaGPUInstance;
                switch (this._format) {
                    case t.TextureFormat.R8G8B8:
                    case t.TextureFormat.R5G6B5:
                        e = i.RGB;
                        break;
                    case t.TextureFormat.R8G8B8A8:
                        e = i.RGBA;
                        break;
                    case t.TextureFormat.Alpha8:
                        e = i.ALPHA;
                        break;
                    case t.TextureFormat.R32G32B32A32:
                    case t.TextureFormat.R16G16B16A16:
                        e = i.RGBA;
                        break;
                    case t.TextureFormat.DXT1:
                        if (!s._compressedTextureS3tc) throw "BaseTexture: not support DXT1 format.";
                        e = s._compressedTextureS3tc.COMPRESSED_RGB_S3TC_DXT1_EXT;
                        break;
                    case t.TextureFormat.DXT5:
                        if (!s._compressedTextureS3tc) throw "BaseTexture: not support DXT5 format.";
                        e = s._compressedTextureS3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                        break;
                    case t.TextureFormat.ETC1RGB:
                        if (!s._compressedTextureEtc1) throw "BaseTexture: not support ETC1RGB format.";
                        e = s._compressedTextureEtc1.COMPRESSED_RGB_ETC1_WEBGL;
                        break;
                    case t.TextureFormat.ETC2RGB:
                        if (!s._compressedTextureETC) throw "BaseTexture: not support ETC2RGB format.";
                        e = s._compressedTextureETC.COMPRESSED_RGB8_ETC2;
                        break;
                    case t.TextureFormat.ETC2RGBA:
                        if (!s._compressedTextureETC) throw "BaseTexture: not support ETC2RGBA format.";
                        e = s._compressedTextureETC.COMPRESSED_RGBA8_ETC2_EAC;
                        break;
                    case t.TextureFormat.ETC2RGB_Alpha8:
                        if (!s._compressedTextureETC) throw "BaseTexture: not support ETC2SRGB_Alpha8 format.";
                        e = s._compressedTextureETC.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
                        break;
                    case t.TextureFormat.ETC2SRGB:
                        if (!s._compressedTextureETC) throw "BaseTexture: not support ETC2SRGB format.";
                        e = s._compressedTextureETC.COMPRESSED_SRGB8_ETC2;
                        break;
                    case t.TextureFormat.PVRTCRGB_2BPPV:
                        if (!s._compressedTexturePvrtc) throw "BaseTexture: not support PVRTCRGB_2BPPV format.";
                        e = s._compressedTexturePvrtc.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                        break;
                    case t.TextureFormat.PVRTCRGBA_2BPPV:
                        if (!s._compressedTexturePvrtc) throw "BaseTexture: not support PVRTCRGBA_2BPPV format.";
                        e = s._compressedTexturePvrtc.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                        break;
                    case t.TextureFormat.PVRTCRGB_4BPPV:
                        if (!s._compressedTexturePvrtc) throw "BaseTexture: not support PVRTCRGB_4BPPV format.";
                        e = s._compressedTexturePvrtc.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                        break;
                    case t.TextureFormat.PVRTCRGBA_4BPPV:
                        if (!s._compressedTexturePvrtc) throw "BaseTexture: not support PVRTCRGBA_4BPPV format.";
                        e = s._compressedTexturePvrtc.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                        break;
                    case t.TextureFormat.ASTC4x4:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC4x4 format.";
                        e = s._compressedTextureASTC.COMPRESSED_RGBA_ASTC_4x4_KHR;
                        break;
                    case t.TextureFormat.ASTC4x4SRGB:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC4x4_KHR format.";
                        e = s._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
                        break;
                    case t.TextureFormat.ASTC6x6:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC6x6 format.";
                        e = s._compressedTextureASTC.COMPRESSED_RGBA_ASTC_6x6_KHR;
                        break;
                    case t.TextureFormat.ASTC6x6SRGB:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC6x6_KHR format.";
                        e = s._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;
                        break;
                    case t.TextureFormat.ASTC8x8:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC8x8 format.";
                        e = s._compressedTextureASTC.COMPRESSED_RGBA_ASTC_8x8_KHR;
                        break;
                    case t.TextureFormat.ASTC8x8SRGB:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC8x8 format.";
                        e = s._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;
                        break;
                    case t.TextureFormat.ASTC10x10:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC10x10 format.";
                        e = s._compressedTextureASTC.COMPRESSED_RGBA_ASTC_10x10_KHR;
                        break;
                    case t.TextureFormat.ASTC10x10SRGB:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC10x10 format.";
                        e = s._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;
                        break;
                    case t.TextureFormat.ASTC12x12:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC12x12 format.";
                        e = s._compressedTextureASTC.COMPRESSED_RGBA_ASTC_12x12_KHR;
                        break;
                    case t.TextureFormat.ASTC12x12SRGB:
                        if (!s._compressedTextureASTC) throw "BaseTexture: not support ASTC12x12 format.";
                        e = s._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;
                        break;
                    default:
                        throw "BaseTexture: unknown texture format."
                }
                return e
            }
            _setFilterMode(e) {
                var i = T.instance;
                switch (S.bindTexture(i, this._glTextureType, this._glTexture), e) {
                    case t.FilterMode.Point:
                        this._mipmap ? i.texParameteri(this._glTextureType, i.TEXTURE_MIN_FILTER, i.NEAREST_MIPMAP_NEAREST) : i.texParameteri(this._glTextureType, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(this._glTextureType, i.TEXTURE_MAG_FILTER, i.NEAREST);
                        break;
                    case t.FilterMode.Bilinear:
                        this._mipmap ? i.texParameteri(this._glTextureType, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_NEAREST) : i.texParameteri(this._glTextureType, i.TEXTURE_MIN_FILTER, i.LINEAR), i.texParameteri(this._glTextureType, i.TEXTURE_MAG_FILTER, i.LINEAR);
                        break;
                    case t.FilterMode.Trilinear:
                        this._mipmap ? i.texParameteri(this._glTextureType, i.TEXTURE_MIN_FILTER, i.LINEAR_MIPMAP_LINEAR) : i.texParameteri(this._glTextureType, i.TEXTURE_MIN_FILTER, i.LINEAR), i.texParameteri(this._glTextureType, i.TEXTURE_MAG_FILTER, i.LINEAR);
                        break;
                    default:
                        throw new Error("BaseTexture:unknown filterMode value.")
                }
                S.bindTexture(i, this._glTextureType, null)
            }
            _setWarpMode(e, i) {
                var s = T.instance;
                if (S.bindTexture(s, this._glTextureType, this._glTexture), this._isPot(this._width) && this._isPot(this._height)) switch (i) {
                    case t.WarpMode.Repeat:
                        s.texParameteri(this._glTextureType, e, s.REPEAT);
                        break;
                    case t.WarpMode.Clamp:
                        s.texParameteri(this._glTextureType, e, s.CLAMP_TO_EDGE);
                        break;
                    case t.WarpMode.Mirrored:
                        s.texParameteri(this._glTextureType, e, s.MIRRORED_REPEAT)
                } else s.texParameteri(this._glTextureType, e, s.CLAMP_TO_EDGE);
                S.bindTexture(s, this._glTextureType, null)
            }
            _setAnisotropy(t) {
                var e = T.layaGPUInstance._extTextureFilterAnisotropic;
                if (e) {
                    t = Math.max(t, 1);
                    var i = T.instance;
                    S.bindTexture(i, this._glTextureType, this._glTexture), t = Math.min(i.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT), t), i.texParameterf(this._glTextureType, e.TEXTURE_MAX_ANISOTROPY_EXT, t), S.bindTexture(i, this._glTextureType, null)
                }
            }
            _disposeResource() {
                this._glTexture && (T.instance.deleteTexture(this._glTexture), this._glTexture = null, this._setGPUMemory(0))
            }
            _getSource() {
                return this._readyed ? this._glTexture : null
            }
            generateMipmap() {
                this._isPot(this.width) && this._isPot(this.height) && T.instance.generateMipmap(this._glTextureType)
            }
        }
        B._rgbmRange = 5, B.FORMAT_R8G8B8 = 0, B.FORMAT_R8G8B8A8 = 1, B.FORMAT_ALPHA8 = 2, B.FORMAT_DXT1 = 3,
            B.FORMAT_DXT5 = 4, B.FORMAT_ETC1RGB = 5, B.FORMAT_PVRTCRGB_2BPPV = 9, B.FORMAT_PVRTCRGBA_2BPPV = 10, B.FORMAT_PVRTCRGB_4BPPV = 11, B.FORMAT_PVRTCRGBA_4BPPV = 12, B.RENDERTEXTURE_FORMAT_RGBA_HALF_FLOAT = 14, B.FORMAT_R32G32B32A32 = 15, B.FORMAT_DEPTH_16 = 0, B.FORMAT_STENCIL_8 = 1, B.FORMAT_DEPTHSTENCIL_16_8 = 2, B.FORMAT_DEPTHSTENCIL_NONE = 3, B.FILTERMODE_POINT = 0, B.FILTERMODE_BILINEAR = 1, B.FILTERMODE_TRILINEAR = 2, B.WARPMODE_REPEAT = 0, B.WARPMODE_CLAMP = 1;
        class F {
            constructor(t = null) {
                this._xd_ = !0, this._allocated_ = 8, this._pos_ = 0, this._length = 0, t ? (this._u8d_ = new Uint8Array(t), this._d_ = new DataView(this._u8d_.buffer), this._length = this._d_.byteLength) : this._resizeBuffer(this._allocated_)
            }
            static getSystemEndian() {
                if (!F._sysEndian) {
                    var t = new ArrayBuffer(2);
                    new DataView(t).setInt16(0, 256, !0), F._sysEndian = 256 === new Int16Array(t)[0] ? F.LITTLE_ENDIAN : F.BIG_ENDIAN
                }
                return F._sysEndian
            }
            get buffer() {
                var t = this._d_.buffer;
                return t.byteLength === this._length ? t : t.slice(0, this._length)
            }
            get endian() {
                return this._xd_ ? F.LITTLE_ENDIAN : F.BIG_ENDIAN
            }
            set endian(t) {
                this._xd_ = t === F.LITTLE_ENDIAN
            }
            set length(t) {
                this._allocated_ < t ? this._resizeBuffer(this._allocated_ = Math.floor(Math.max(t, 2 * this._allocated_))) : this._allocated_ > t && this._resizeBuffer(this._allocated_ = t), this._length = t
            }
            get length() {
                return this._length
            }
            _resizeBuffer(t) {
                try {
                    var e = new Uint8Array(t);
                    null != this._u8d_ && (this._u8d_.length <= t ? e.set(this._u8d_) : e.set(this._u8d_.subarray(0, t))), this._u8d_ = e, this._d_ = new DataView(e.buffer)
                } catch (e) {
                    throw "Invalid typed array length:" + t
                }
            }
            getString() {
                return this.readString()
            }
            readString() {
                return this._rUTF(this.getUint16())
            }
            getFloat32Array(t, e) {
                return this.readFloat32Array(t, e)
            }
            readFloat32Array(t, e) {
                var i = t + e;
                i = i > this._length ? this._length : i;
                var s = new Float32Array(this._d_.buffer.slice(t, i));
                return this._pos_ = i, s
            }
            getUint8Array(t, e) {
                return this.readUint8Array(t, e)
            }
            readUint8Array(t, e) {
                var i = t + e;
                i = i > this._length ? this._length : i;
                var s = new Uint8Array(this._d_.buffer.slice(t, i));
                return this._pos_ = i, s
            }
            getInt16Array(t, e) {
                return this.readInt16Array(t, e)
            }
            readInt16Array(t, e) {
                var i = t + e;
                i = i > this._length ? this._length : i;
                var s = new Int16Array(this._d_.buffer.slice(t, i));
                return this._pos_ = i, s
            }
            getFloat32() {
                return this.readFloat32()
            }
            readFloat32() {
                if (this._pos_ + 4 > this._length) throw "getFloat32 error - Out of bounds";
                var t = this._d_.getFloat32(this._pos_, this._xd_);
                return this._pos_ += 4, t
            }
            getFloat64() {
                return this.readFloat64()
            }
            readFloat64() {
                if (this._pos_ + 8 > this._length) throw "getFloat64 error - Out of bounds";
                var t = this._d_.getFloat64(this._pos_, this._xd_);
                return this._pos_ += 8, t
            }
            writeFloat32(t) {
                this._ensureWrite(this._pos_ + 4), this._d_.setFloat32(this._pos_, t, this._xd_), this._pos_ += 4
            }
            writeFloat64(t) {
                this._ensureWrite(this._pos_ + 8), this._d_.setFloat64(this._pos_, t, this._xd_), this._pos_ += 8
            }
            getInt32() {
                return this.readInt32()
            }
            readInt32() {
                if (this._pos_ + 4 > this._length) throw "getInt32 error - Out of bounds";
                var t = this._d_.getInt32(this._pos_, this._xd_);
                return this._pos_ += 4, t
            }
            getUint32() {
                return this.readUint32()
            }
            readUint32() {
                if (this._pos_ + 4 > this._length) throw "getUint32 error - Out of bounds";
                var t = this._d_.getUint32(this._pos_, this._xd_);
                return this._pos_ += 4, t
            }
            writeInt32(t) {
                this._ensureWrite(this._pos_ + 4), this._d_.setInt32(this._pos_, t, this._xd_), this._pos_ += 4
            }
            writeUint32(t) {
                this._ensureWrite(this._pos_ + 4), this._d_.setUint32(this._pos_, t, this._xd_), this._pos_ += 4
            }
            getInt16() {
                return this.readInt16()
            }
            readInt16() {
                if (this._pos_ + 2 > this._length) throw "getInt16 error - Out of bounds";
                var t = this._d_.getInt16(this._pos_, this._xd_);
                return this._pos_ += 2, t
            }
            getUint16() {
                return this.readUint16()
            }
            readUint16() {
                if (this._pos_ + 2 > this._length) throw "getUint16 error - Out of bounds";
                var t = this._d_.getUint16(this._pos_, this._xd_);
                return this._pos_ += 2, t
            }
            writeUint16(t) {
                this._ensureWrite(this._pos_ + 2), this._d_.setUint16(this._pos_, t, this._xd_), this._pos_ += 2
            }
            writeInt16(t) {
                this._ensureWrite(this._pos_ + 2), this._d_.setInt16(this._pos_, t, this._xd_), this._pos_ += 2
            }
            getUint8() {
                return this.readUint8()
            }
            readUint8() {
                if (this._pos_ + 1 > this._length) throw "getUint8 error - Out of bounds";
                return this._u8d_[this._pos_++]
            }
            writeUint8(t) {
                this._ensureWrite(this._pos_ + 1), this._d_.setUint8(this._pos_, t), this._pos_++
            }
            _getUInt8(t) {
                return this._readUInt8(t)
            }
            _readUInt8(t) {
                return this._d_.getUint8(t)
            }
            _getUint16(t) {
                return this._readUint16(t)
            }
            _readUint16(t) {
                return this._d_.getUint16(t, this._xd_)
            }
            _getMatrix() {
                return this._readMatrix()
            }
            _readMatrix() {
                var t = new f(this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32());
                return t
            }
            _rUTF(t) {
                var e, i, s, r = this._pos_ + t,
                    a = String.fromCharCode,
                    n = this._u8d_,
                    h = [],
                    o = 0;
                for (h.length = 1e3; this._pos_ < r;)
                    if (e = n[this._pos_++], e < 128) 0 != e && (h[o++] = a(e));
                    else if (e < 224) h[o++] = a((63 & e) << 6 | 127 & n[this._pos_++]);
                else if (e < 240) i = n[this._pos_++], h[o++] = a((31 & e) << 12 | (127 & i) << 6 | 127 & n[this._pos_++]);
                else {
                    i = n[this._pos_++], s = n[this._pos_++];
                    const t = (15 & e) << 18 | (127 & i) << 12 | (127 & s) << 6 | 127 & n[this._pos_++];
                    if (t >= 65536) {
                        const e = t - 65536,
                            i = 55296 | e >> 10,
                            s = 56320 | 1023 & e;
                        h[o++] = a(i), h[o++] = a(s)
                    } else h[o++] = a(t)
                }
                return h.length = o, h.join("")
            }
            getCustomString(t) {
                return this.readCustomString(t)
            }
            readCustomString(t) {
                for (var e, i, s = "", r = 0, a = String.fromCharCode, n = this._u8d_; t > 0;)
                    if (e = n[this._pos_], e < 128) s += a(e), this._pos_++, t--;
                    else
                        for (r = e - 128, this._pos_++, t -= r; r > 0;) e = n[this._pos_++], i = n[this._pos_++], s += a(i << 8 | e), r--;
                return s
            }
            get pos() {
                return this._pos_
            }
            set pos(t) {
                this._pos_ = t
            }
            get bytesAvailable() {
                return this._length - this._pos_
            }
            clear() {
                this._pos_ = 0, this.length = 0
            }
            __getBuffer() {
                return this._d_.buffer
            }
            writeUTFBytes(t) {
                t += "";
                for (var e = 0, i = t.length; e < i; e++) {
                    var s = t.charCodeAt(e);
                    if (s <= 127) this.writeByte(s);
                    else if (s <= 2047) this._ensureWrite(this._pos_ + 2), this._u8d_.set([192 | s >> 6, 128 | 63 & s], this._pos_), this._pos_ += 2;
                    else if (s >= 55296 && s <= 56319) {
                        e++;
                        const i = t.charCodeAt(e);
                        if (!Number.isNaN(i) && i >= 56320 && i <= 57343) {
                            const t = 64 + (1023 & s),
                                e = 1023 & i,
                                r = 240 | t >> 8 & 63,
                                a = 128 | t >> 2 & 63,
                                n = 128 | (3 & t) << 4 | e >> 6 & 15,
                                h = 128 | 63 & e;
                            this._ensureWrite(this._pos_ + 4), this._u8d_.set([r, a, n, h], this._pos_), this._pos_ += 4
                        }
                    } else s <= 65535 ? (this._ensureWrite(this._pos_ + 3), this._u8d_.set([224 | s >> 12, 128 | s >> 6 & 63, 128 | 63 & s], this._pos_), this._pos_ += 3) : (this._ensureWrite(this._pos_ + 4), this._u8d_.set([240 | s >> 18, 128 | s >> 12 & 63, 128 | s >> 6 & 63, 128 | 63 & s], this._pos_), this._pos_ += 4)
                }
            }
            writeUTFString(t) {
                var e = this.pos;
                this.writeUint16(1), this.writeUTFBytes(t);
                var i = this.pos - e - 2;
                this._d_.setUint16(e, i, this._xd_)
            }
            writeUTFString32(t) {
                var e = this.pos;
                this.writeUint32(1), this.writeUTFBytes(t);
                var i = this.pos - e - 4;
                this._d_.setUint32(e, i, this._xd_)
            }
            readUTFString() {
                return this.readUTFBytes(this.getUint16())
            }
            readUTFString32() {
                return this.readUTFBytes(this.getUint32())
            }
            getUTFString() {
                return this.readUTFString()
            }
            readUTFBytes(t = -1) {
                if (0 === t) return "";
                var e = this.bytesAvailable;
                if (t > e) throw "readUTFBytes error - Out of bounds";
                return t = t > 0 ? t : e, this._rUTF(t)
            }
            getUTFBytes(t = -1) {
                return this.readUTFBytes(t)
            }
            writeByte(t) {
                this._ensureWrite(this._pos_ + 1), this._d_.setInt8(this._pos_, t), this._pos_ += 1
            }
            readByte() {
                if (this._pos_ + 1 > this._length) throw "readByte error - Out of bounds";
                return this._d_.getInt8(this._pos_++)
            }
            getByte() {
                return this.readByte()
            }
            _ensureWrite(t) {
                this._length < t && (this._length = t), this._allocated_ < t && (this.length = t)
            }
            writeArrayBuffer(t, e = 0, i = 0) {
                if (e < 0 || i < 0) throw "writeArrayBuffer error - Out of bounds";
                0 == i && (i = t.byteLength - e), this._ensureWrite(this._pos_ + i);
                var s = new Uint8Array(t);
                this._u8d_.set(s.subarray(e, e + i), this._pos_), this._pos_ += i
            }
            readArrayBuffer(t) {
                var e;
                return e = this._u8d_.buffer.slice(this._pos_, this._pos_ + t), this._pos_ = this._pos_ + t, e
            }
        }
        F.BIG_ENDIAN = "bigEndian", F.LITTLE_ENDIAN = "littleEndian", F._sysEndian = null, E = t.RenderTextureFormat || (t.RenderTextureFormat = {}), E[E.R8G8B8 = 0] = "R8G8B8", E[E.R8G8B8A8 = 1] = "R8G8B8A8", E[E.Alpha8 = 2] = "Alpha8", E[E.R16G16B16A16 = 14] = "R16G16B16A16", E[E.Depth = 15] = "Depth", E[E.ShadowMap = 16] = "ShadowMap", A = t.RenderTextureDepthFormat || (t.RenderTextureDepthFormat = {}), A[A.DEPTH_16 = 0] = "DEPTH_16", A[A.STENCIL_8 = 1] = "STENCIL_8", A[A.DEPTHSTENCIL_24_8 = 2] = "DEPTHSTENCIL_24_8", A[A.DEPTHSTENCIL_NONE = 3] = "DEPTHSTENCIL_NONE", A[A.DEPTH_32 = 4] = "DEPTH_32", A[A.DEPTHSTENCIL_16_8 = 2] = "DEPTHSTENCIL_16_8", C = t.RTDEPTHATTACHMODE || (t.RTDEPTHATTACHMODE = {}), C[C.RENDERBUFFER = 0] = "RENDERBUFFER", C[C.TEXTURE = 1] = "TEXTURE";
        class O {
            static get maxTextureCount() {
                return this._maxTextureCount
            }
            static get maxTextureSize() {
                return this._maxTextureSize
            }
            static get shaderCapailityLevel() {
                return this._shaderCapailityLevel
            }
            static supportTextureFormat(e) {
                switch (e) {
                    case t.TextureFormat.R32G32B32A32:
                        return !(!T.layaGPUInstance._isWebGL2 && !T.layaGPUInstance._oesTextureFloat);
                    case t.TextureFormat.R16G16B16A16:
                        return !(!T.layaGPUInstance._isWebGL2 && !T.layaGPUInstance._oesTextureHalfFloat);
                    default:
                        return !0
                }
            }
            static supportRenderTextureFormat(e) {
                switch (e) {
                    case t.RenderTextureFormat.R16G16B16A16:
                        return !!(T.layaGPUInstance._isWebGL2 && T.layaGPUInstance._extColorBufferFloat || T.layaGPUInstance._oesTextureHalfFloat && T.layaGPUInstance._oesTextureHalfFloatLinear);
                    case t.RenderTextureFormat.Depth:
                        return !(!T.layaGPUInstance._isWebGL2 && !T.layaGPUInstance._webgl_depth_texture);
                    case t.RenderTextureFormat.ShadowMap:
                        return !!T.layaGPUInstance._isWebGL2;
                    default:
                        return !0
                }
            }
        }
        class N {
            static __init__() {
                for (var t = 0; t < 256; ++t) {
                    var e = t - 127;
                    e < -27 ? (N._baseTable[0 | t] = 0, N._baseTable[256 | t] = 32768, N._shiftTable[0 | t] = 24, N._shiftTable[256 | t] = 24) : e < -14 ? (N._baseTable[0 | t] = 1024 >> -e - 14, N._baseTable[256 | t] = 1024 >> -e - 14 | 32768, N._shiftTable[0 | t] = -e - 1, N._shiftTable[256 | t] = -e - 1) : e <= 15 ? (N._baseTable[0 | t] = e + 15 << 10, N._baseTable[256 | t] = e + 15 << 10 | 32768, N._shiftTable[0 | t] = 13, N._shiftTable[256 | t] = 13) : e < 128 ? (N._baseTable[0 | t] = 31744, N._baseTable[256 | t] = 64512, N._shiftTable[0 | t] = 24, N._shiftTable[256 | t] = 24) : (N._baseTable[0 | t] = 31744, N._baseTable[256 | t] = 64512, N._shiftTable[0 | t] = 13, N._shiftTable[256 | t] = 13)
                }
                for (N._mantissaTable[0] = 0, t = 1; t < 1024; ++t) {
                    var i = t << 13;
                    for (e = 0; 0 == (8388608 & i);) e -= 8388608, i <<= 1;
                    i &= -8388609, e += 947912704, N._mantissaTable[t] = i | e
                }
                for (t = 1024; t < 2048; ++t) N._mantissaTable[t] = 939524096 + (t - 1024 << 13);
                for (N._exponentTable[0] = 0, t = 1; t < 31; ++t) N._exponentTable[t] = t << 23;
                for (N._exponentTable[31] = 1199570944, N._exponentTable[32] = 2147483648, t = 33; t < 63; ++t) N._exponentTable[t] = 2147483648 + (t - 32 << 23);
                for (N._exponentTable[63] = 3347054592, N._offsetTable[0] = 0, t = 1; t < 64; ++t) N._offsetTable[t] = 32 === t ? 0 : 1024
            }
            static roundToFloat16Bits(t) {
                N._floatView[0] = t;
                var e = N._uint32View[0],
                    i = e >> 23 & 511;
                return N._baseTable[i] + ((8388607 & e) >> N._shiftTable[i])
            }
            static convertToNumber(t) {
                var e = t >> 10;
                return N._uint32View[0] = N._mantissaTable[N._offsetTable[e] + (1023 & t)] + N._exponentTable[e], N._floatView[0]
            }
        }
        N._buffer = new ArrayBuffer(4), N._floatView = new Float32Array(N._buffer), N._uint32View = new Uint32Array(N._buffer), N._baseTable = new Uint32Array(512), N._shiftTable = new Uint32Array(512), N._mantissaTable = new Uint32Array(2048), N._exponentTable = new Uint32Array(64), N._offsetTable = new Uint32Array(64);
        class U extends B {
            constructor(e = 0, i = 0, s = t.TextureFormat.R8G8B8A8, r = !0, a = !1) {
                super(s, r);
                var n = T.instance;
                this._glTextureType = n.TEXTURE_2D, this._width = e, this._height = i, this._canRead = a, this._setWarpMode(n.TEXTURE_WRAP_S, this._wrapModeU), this._setWarpMode(n.TEXTURE_WRAP_T, this._wrapModeV), this._setFilterMode(this._filterMode), this._setAnisotropy(this._anisoLevel);
                var h = this._gpuCompressFormat();
                if (r) {
                    var o = Math.max(Math.ceil(Math.log2(e)) + 1, Math.ceil(Math.log2(i)) + 1);
                    if (!h)
                        for (var l = 0; l < o; l++) this._setPixels(null, l, Math.max(e >> l, 1), Math.max(i >> l, 1));
                    this._mipmapCount = o, this._setGPUMemory(e * i * 4 * (1 + 1 / 3))
                } else h || this._setPixels(null, 0, e, i), this._mipmapCount = 1, this._setGPUMemory(e * i * 4)
            }
            static __init__() {
                var e = new Uint8Array(3);
                e[0] = 128, e[1] = 128, e[2] = 128, U.grayTexture = new U(1, 1, t.TextureFormat.R8G8B8, !1, !1), U.grayTexture.setPixels(e), U.grayTexture.lock = !0, e[0] = 255, e[1] = 255, e[2] = 255, U.whiteTexture = new U(1, 1, t.TextureFormat.R8G8B8, !1, !1), U.whiteTexture.setPixels(e), U.whiteTexture.lock = !0, e[0] = 0, e[1] = 0, e[2] = 0, U.blackTexture = new U(1, 1, t.TextureFormat.R8G8B8, !1, !1), U.blackTexture.setPixels(e), U.blackTexture.lock = !0, U.erroTextur = U.whiteTexture
            }
            static _parse(e, i = null, s = null) {
                var r = s ? new U(s[0], s[1], s[2], s[3], s[4]) : new U(0, 0);
                switch (i && (r.wrapModeU = i.wrapModeU, r.wrapModeV = i.wrapModeV, r.filterMode = i.filterMode, r.anisoLevel = i.anisoLevel), r._format) {
                    case t.TextureFormat.R8G8B8:
                    case t.TextureFormat.R8G8B8A8:
                        r.loadImageSource(e);
                        break;
                    case t.TextureFormat.DXT1:
                    case t.TextureFormat.DXT5:
                    case t.TextureFormat.ETC1RGB:
                    case t.TextureFormat.PVRTCRGB_2BPPV:
                    case t.TextureFormat.PVRTCRGBA_2BPPV:
                    case t.TextureFormat.PVRTCRGB_4BPPV:
                    case t.TextureFormat.PVRTCRGBA_4BPPV:
                    case t.TextureFormat.ETC2RGB:
                    case t.TextureFormat.ETC2RGBA:
                    case t.TextureFormat.ETC2SRGB:
                    case t.TextureFormat.ASTC4x4:
                    case t.TextureFormat.ASTC6x6:
                    case t.TextureFormat.ASTC8x8:
                    case t.TextureFormat.ASTC10x10:
                    case t.TextureFormat.ASTC12x12:
                    case t.TextureFormat.KTXTEXTURE:
                    case t.TextureFormat.PVRTEXTURE:
                        r.setCompressData(e);
                        break;
                    default:
                        throw "Texture2D:unkonwn format."
                }
                return r
            }
            static _SimpleAnimatorTextureParse(e, i = null, s = null) {
                var r, a, n = new F(e),
                    h = n.readUTFString();
                switch (h) {
                    case "LAYAANIMATORTEXTURE:0000":
                        var o = n.readInt32(),
                            l = n.readInt32();
                        r = new Float32Array(o * o * 4), a = new Float32Array(n.readArrayBuffer(4 * l)), r.set(a, 0);
                        var _ = new U(o, o, t.TextureFormat.R32G32B32A32, !1, !1);
                        _.setPixels(r, 0), _.filterMode = t.FilterMode.Point;
                        break;
                    case "LAYACOMPRESSANIMATORTEXTURE:0000":
                        o = n.readInt32(), l = n.readInt32();
                        if (r = new Uint16Array(n.readArrayBuffer(2 * l)), O.supportTextureFormat(t.TextureFormat.R16G16B16A16)) a = new Uint16Array(o * o * 4), a.set(r, 0), _ = new U(o, o, t.TextureFormat.R16G16B16A16, !1, !1), _.setPixels(a, 0), _.filterMode = t.FilterMode.Point;
                        else {
                            console.log("The platform does not support 16-bit floating-point textures"), O.supportTextureFormat(t.TextureFormat.R32G32B32A32) || console.error("The platform does not support 32-bit floating-point textures"), a = new Float32Array(o * o * 4);
                            for (var u = 0, c = r.length; u < c; u++) a[u] = N.convertToNumber(r[u]);
                            _ = new U(o, o, t.TextureFormat.R32G32B32A32, !1, !1), _.setPixels(a, 0), _.filterMode = t.FilterMode.Point
                        }
                        break;
                    default:
                        throw "Laya3D:unknow version."
                }
                return _
            }
            static load(t, e) {
                s.loader.create(t, e, null, s.Loader.TEXTURE2D)
            }
            get defaulteTexture() {
                return U.grayTexture
            }
            _gpuCompressFormat() {
                return this._format != t.TextureFormat.R8G8B8A8 && this._format != t.TextureFormat.R8G8B8 && this._format != t.TextureFormat.R16G16B16A16 && this._format != t.TextureFormat.R32G32B32A32 && this._format != t.TextureFormat.R5G6B5 && this._format != t.TextureFormat.Alpha8
            }
            _setPixels(e, i, s, r) {
                var a = T.instance,
                    n = this._glTextureType,
                    h = this._getGLFormat();
                switch (S.bindTexture(a, n, this._glTexture), this.format) {
                    case t.TextureFormat.R8G8B8:
                    case t.TextureFormat.R8G8B8A8:
                        a.pixelStorei(a.UNPACK_ALIGNMENT, 1), a.texImage2D(n, i, h, s, r, 0, h, a.UNSIGNED_BYTE, e), a.pixelStorei(a.UNPACK_ALIGNMENT, 4);
                        break;
                    case t.TextureFormat.R5G6B5:
                        a.pixelStorei(a.UNPACK_ALIGNMENT, 2), a.texImage2D(n, i, h, s, r, 0, h, a.UNSIGNED_SHORT_5_6_5, e), a.pixelStorei(a.UNPACK_ALIGNMENT, 4);
                        break;
                    case t.TextureFormat.R32G32B32A32:
                        T.layaGPUInstance._isWebGL2 ? a.texImage2D(n, i, a.RGBA32F, s, r, 0, h, a.FLOAT, e) : a.texImage2D(n, i, a.RGBA, s, r, 0, h, a.FLOAT, e);
                        break;
                    case t.TextureFormat.R16G16B16A16:
                        T.layaGPUInstance._isWebGL2 ? a.texImage2D(n, i, a.RGBA16F, s, r, 0, h, a.HALF_FLOAT, e) : a.texImage2D(n, i, a.RGBA, s, r, 0, h, T.layaGPUInstance._oesTextureHalfFloat.HALF_FLOAT_OES, e);
                        break;
                    default:
                        a.texImage2D(n, i, h, s, r, 0, h, a.UNSIGNED_BYTE, e)
                }
            }
            _calcualatesCompressedDataSize(e, i, s) {
                switch (e) {
                    case t.TextureFormat.DXT1:
                        return (i + 3 >> 2) * (s + 3 >> 2) * 8;
                    case t.TextureFormat.DXT5:
                        return (i + 3 >> 2) * (s + 3 >> 2) * 16;
                    case t.TextureFormat.PVRTCRGB_4BPPV:
                    case t.TextureFormat.PVRTCRGBA_4BPPV:
                        return Math.floor((Math.max(i, 8) * Math.max(s, 8) * 4 + 7) / 8);
                    case t.TextureFormat.PVRTCRGB_2BPPV:
                    case t.TextureFormat.PVRTCRGBA_2BPPV:
                        return Math.floor((Math.max(i, 16) * Math.max(s, 8) * 2 + 7) / 8);
                    default:
                        return 0
                }
            }
            _pharseDDS(e) {
                const i = 827611204,
                    s = 894720068,
                    r = 4,
                    a = 131072,
                    n = 542327876,
                    h = 31,
                    o = 0,
                    l = 1,
                    _ = 2,
                    u = 3,
                    c = 4,
                    d = 7,
                    p = 20,
                    f = 21;
                var m = new Int32Array(e, 0, h);
                if (m[o] != n) throw "Invalid magic number in DDS header";
                if (!(m[p] & r)) throw "Unsupported format, must contain a FourCC code";
                var g = m[f];
                switch (this._format) {
                    case t.TextureFormat.DXT1:
                        if (g !== i) throw "the FourCC code is not same with texture format.";
                        break;
                    case t.TextureFormat.DXT5:
                        if (g !== s) throw "the FourCC code is not same with texture format.";
                        break;
                    default:
                        throw "unknown texture format."
                }
                var T = 1;
                if (m[_] & a) {
                    if (T = Math.max(1, m[d]), !this._mipmap) throw "the mipmap is not same with Texture2D."
                } else if (this._mipmap) throw "the mipmap is not same with Texture2D.";
                var v = m[c],
                    x = m[u];
                this._width = v, this._height = x;
                var y = m[l] + 4;
                this._upLoadCompressedTexImage2D(e, v, x, T, y, 0)
            }
            _pharseKTX(e) {
                const i = 13,
                    s = 4,
                    r = 7,
                    a = 6,
                    n = 11,
                    h = 12;
                var o = new Uint8Array(e, 0, 12);
                if (171 != o[0] || 75 != o[1] || 84 != o[2] || 88 != o[3] || 32 != o[4] || 49 != o[5] || 49 != o[6] || 187 != o[7] || 13 != o[8] || 10 != o[9] || 26 != o[10] || 10 != o[11]) throw "Invalid fileIdentifier in KTX header";
                var l = new Int32Array(o.buffer, o.length, i),
                    _ = l[s];
                if (this._format = -1, T.layaGPUInstance._compressedTextureASTC) switch (_) {
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_RGBA_ASTC_4x4_KHR:
                        this._format = t.TextureFormat.ASTC4x4;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:
                        this._format = t.TextureFormat.ASTC4x4SRGB;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:
                        this._format = t.TextureFormat.ASTC6x6SRGB;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:
                        this._format = t.TextureFormat.ASTC8x8SRGB;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:
                        this._format = t.TextureFormat.ASTC10x10SRGB;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:
                        this._format = t.TextureFormat.ASTC12x12SRGB;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_RGBA_ASTC_6x6_KHR:
                        this._format = t.TextureFormat.ASTC6x6;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_RGBA_ASTC_8x8_KHR:
                        this._format = t.TextureFormat.ASTC8x8;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_RGBA_ASTC_10x10_KHR:
                        this._format = t.TextureFormat.ASTC10x10;
                        break;
                    case T.layaGPUInstance._compressedTextureASTC.COMPRESSED_RGBA_ASTC_12x12_KHR:
                        this._format = t.TextureFormat.ASTC12x12
                }
                if (T.layaGPUInstance._compressedTextureEtc1) switch (_) {
                    case T.layaGPUInstance._compressedTextureEtc1.COMPRESSED_RGB_ETC1_WEBGL:
                        this._format = t.TextureFormat.ETC1RGB
                }
                if (T.layaGPUInstance._compressedTextureETC) switch (_) {
                    case T.layaGPUInstance._compressedTextureETC.COMPRESSED_RGBA8_ETC2_EAC:
                        this._format = t.TextureFormat.ETC2RGBA;
                        break;
                    case T.layaGPUInstance._compressedTextureETC.COMPRESSED_RGB8_ETC2:
                        this._format = t.TextureFormat.ETC2RGB;
                        break;
                    case T.layaGPUInstance._compressedTextureETC.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:
                        this._format = t.TextureFormat.ETC2RGB_Alpha8;
                        break;
                    case T.layaGPUInstance._compressedTextureETC.COMPRESSED_SRGB8_ETC2:
                        this._format = t.TextureFormat.ETC2SRGB
                }
                if (-1 == this._format) throw "unknown texture format.";
                var u = l[n],
                    c = l[a],
                    d = l[r];
                this._width = c, this._height = d;
                var p = 64 + l[h];
                this._upLoadKTXCompressedTexImage2D(e, c, d, u, p, 4)
            }
            _pharsePVR(e) {
                const i = 0,
                    s = 1,
                    r = 2,
                    a = 3,
                    n = 55727696,
                    h = 13,
                    o = 0,
                    l = 2,
                    _ = 6,
                    u = 7,
                    c = 11,
                    d = 12;
                var p = new Int32Array(e, 0, h);
                if (p[o] != n) throw "Invalid magic number in PVR header";
                var f = p[l];
                switch (f) {
                    case i:
                        this._format = t.TextureFormat.PVRTCRGB_2BPPV;
                        break;
                    case r:
                        this._format = t.TextureFormat.PVRTCRGB_4BPPV;
                        break;
                    case s:
                        this._format = t.TextureFormat.PVRTCRGBA_2BPPV;
                        break;
                    case a:
                        this._format = t.TextureFormat.PVRTCRGBA_4BPPV;
                        break;
                    default:
                        throw "Texture2D:unknown PVR format."
                }
                var m = p[c],
                    g = p[u],
                    T = p[_];
                this._width = g, this._height = T;
                var v = p[d] + 52;
                this._upLoadCompressedTexImage2D(e, g, T, m, v, 0)
            }
            _upLoadCompressedTexImage2D(t, e, i, s, r, a) {
                var n = T.instance,
                    h = this._glTextureType;
                S.bindTexture(n, h, this._glTexture);
                for (var o = this._getGLFormat(), l = r, _ = 0; _ < s; _++) {
                    l += a;
                    var u = this._calcualatesCompressedDataSize(this._format, e, i),
                        c = new Uint8Array(t, l, u);
                    n.compressedTexImage2D(h, _, o, e, i, 0, c), e = Math.max(e >> 1, 1), i = Math.max(i >> 1, 1), l += u
                }
                var d = l;
                this._setGPUMemory(d), this._readyed = !0, this._activeResource()
            }
            _upLoadKTXCompressedTexImage2D(t, e, i, s, r, a) {
                var n = T.instance,
                    h = this._glTextureType;
                S.bindTexture(n, h, this._glTexture);
                for (var o = this._getGLFormat(), l = r, _ = 0; _ < s; _++) {
                    var u = new Int32Array(t, l, 1)[0];
                    l += a;
                    var c = new Uint8Array(t, l, u);
                    n.compressedTexImage2D(h, _, o, e, i, 0, c), e = Math.max(e >> 1, 1), i = Math.max(i >> 1, 1), l += u, l += 3 - (u + 3) % 4
                }
                var d = l;
                this._setGPUMemory(d), this._readyed = !0, this._activeResource()
            }
            loadImageSource(e, i = !1) {
                var r = T.instance,
                    a = e.width,
                    n = e.height;
                this._width = a, this._height = n, this._isPot(a) && this._isPot(n) || (this._mipmap = !1), this._setWarpMode(r.TEXTURE_WRAP_S, this._wrapModeU), this._setWarpMode(r.TEXTURE_WRAP_T, this._wrapModeV), this._setFilterMode(this._filterMode), S.bindTexture(r, this._glTextureType, this._glTexture);
                var h = this._getGLFormat();
                s.Render.isConchApp ? (e.setPremultiplyAlpha && e.setPremultiplyAlpha(i), r.texImage2D(this._glTextureType, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, e)) : (i && r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), this.format == t.TextureFormat.R5G6B5 ? r.texImage2D(this._glTextureType, 0, r.RGB, r.RGB, r.UNSIGNED_SHORT_5_6_5, e) : r.texImage2D(this._glTextureType, 0, h, h, r.UNSIGNED_BYTE, e), i && r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1)), this._mipmap ? (r.generateMipmap(this._glTextureType), this._setGPUMemory(a * n * 4 * (1 + 1 / 3))) : this._setGPUMemory(a * n * 4), this._canRead && (s.Render.isConchApp && e._nativeObj ? this._pixels = new Uint8Array(e._nativeObj.getImageData(0, 0, a, n)) : (s.Browser.canvas.size(a, n), s.Browser.canvas.clear(), s.Browser.context.drawImage(e, 0, 0, a, n), this._pixels = new Uint8Array(s.Browser.context.getImageData(0, 0, a, n).data.buffer))), this._readyed = !0, this._activeResource()
            }
            setPixels(t, e = 0) {
                if (this._gpuCompressFormat()) throw "Texture2D:the format is GPU compression format.";
                if (!t) throw "Texture2D:pixels can't be null.";
                var i = Math.max(this._width >> e, 1),
                    s = Math.max(this._height >> e, 1),
                    r = i * s * this._getFormatByteCount();
                if (t.length < r) throw "Texture2D:pixels length should at least " + r + ".";
                this._setPixels(t, e, i, s), this._canRead && (this._pixels = t), this._readyed = !0, this._activeResource()
            }
            setSubPixels(e, i, s, r, a, n = 0) {
                if (this._gpuCompressFormat()) throw "Texture2D:the format is GPU compression format.";
                if (!a) throw "Texture2D:pixels can't be null.";
                var h = T.instance,
                    o = this._glTextureType;
                S.bindTexture(h, o, this._glTexture);
                var l = this._getGLFormat();
                switch (this.format) {
                    case t.TextureFormat.R8G8B8:
                        h.pixelStorei(h.UNPACK_ALIGNMENT, 1), h.texSubImage2D(o, n, e, i, s, r, l, h.UNSIGNED_BYTE, a), h.pixelStorei(h.UNPACK_ALIGNMENT, 4);
                        break;
                    case t.TextureFormat.R5G6B5:
                        h.pixelStorei(h.UNPACK_ALIGNMENT, 2), h.texSubImage2D(o, n, e, i, s, r, l, h.UNSIGNED_SHORT_5_6_5, a), h.pixelStorei(h.UNPACK_ALIGNMENT, 4);
                        break;
                    case t.TextureFormat.R32G32B32A32:
                        h.texSubImage2D(o, n, e, i, s, r, l, h.FLOAT, a);
                        break;
                    default:
                        h.texSubImage2D(o, n, e, i, s, r, l, h.UNSIGNED_BYTE, a)
                }
                this._readyed = !0, this._activeResource()
            }
            setCompressData(e) {
                switch (this._format) {
                    case t.TextureFormat.DXT1:
                    case t.TextureFormat.DXT5:
                        this._pharseDDS(e);
                        break;
                    case t.TextureFormat.ETC1RGB:
                    case t.TextureFormat.ETC2RGB:
                    case t.TextureFormat.ETC2RGBA:
                    case t.TextureFormat.ETC2RGB_Alpha8:
                    case t.TextureFormat.ETC2SRGB:
                    case t.TextureFormat.ASTC4x4:
                    case t.TextureFormat.ASTC4x4SRGB:
                    case t.TextureFormat.ASTC6x6:
                    case t.TextureFormat.ASTC6x6SRGB:
                    case t.TextureFormat.ASTC8x8:
                    case t.TextureFormat.ASTC8x8SRGB:
                    case t.TextureFormat.ASTC10x10:
                    case t.TextureFormat.ASTC10x10SRGB:
                    case t.TextureFormat.ASTC12x12:
                    case t.TextureFormat.ASTC12x12SRGB:
                    case t.TextureFormat.KTXTEXTURE:
                        this._pharseKTX(e);
                        break;
                    case t.TextureFormat.PVRTCRGB_2BPPV:
                    case t.TextureFormat.PVRTCRGBA_2BPPV:
                    case t.TextureFormat.PVRTCRGB_4BPPV:
                    case t.TextureFormat.PVRTCRGBA_4BPPV:
                    case t.TextureFormat.PVRTEXTURE:
                        this._pharsePVR(e);
                        break;
                    default:
                        throw "Texture2D:unkonwn format."
                }
                1 == this.mipmapCount || this.width != 1 << this.mipmapCount - 1 && this.height != 1 << this.mipmapCount ? this._mipmap = !1 : this._mipmap = !0;
                let i = T.instance;
                this._setWarpMode(i.TEXTURE_WRAP_S, this._wrapModeU), this._setWarpMode(i.TEXTURE_WRAP_T, this._wrapModeV), this._setFilterMode(this._filterMode)
            }
            getPixels() {
                if (this._canRead) return this._pixels;
                throw new Error("Texture2D: must set texture canRead is true.")
            }
        }
        U.TEXTURE2D = "TEXTURE2D", U.grayTexture = null, U.whiteTexture = null, U.blackTexture = null, U.erroTextur = null;
        class G extends D {
            constructor() {
                super()
            }
        }
        class k {
            static mat2MatArray(t, e) {
                var i = t,
                    s = e;
                return s[0] = i.a, s[1] = i.b, s[2] = k.EMPTYMAT4_ARRAY[2], s[3] = k.EMPTYMAT4_ARRAY[3], s[4] = i.c, s[5] = i.d, s[6] = k.EMPTYMAT4_ARRAY[6], s[7] = k.EMPTYMAT4_ARRAY[7], s[8] = k.EMPTYMAT4_ARRAY[8], s[9] = k.EMPTYMAT4_ARRAY[9], s[10] = k.EMPTYMAT4_ARRAY[10], s[11] = k.EMPTYMAT4_ARRAY[11], s[12] = i.tx, s[13] = i.ty, s[14] = k.EMPTYMAT4_ARRAY[14], s[15] = k.EMPTYMAT4_ARRAY[15], e
            }
            static restoreTempArray() {
                k.TEMPMAT4_ARRAY[0] = 1, k.TEMPMAT4_ARRAY[1] = 0, k.TEMPMAT4_ARRAY[4] = 0, k.TEMPMAT4_ARRAY[5] = 1, k.TEMPMAT4_ARRAY[12] = 0, k.TEMPMAT4_ARRAY[13] = 0
            }
            static clear() {
                k.worldScissorTest = !1, k.worldAlpha = 1
            }
        }
        k._MAXSIZE = 99999999, k.EMPTYMAT4_ARRAY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], k.TEMPMAT4_ARRAY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], k.worldMatrix4 = k.TEMPMAT4_ARRAY, k.worldMatrix = new f, k.matWVP = null, k.worldAlpha = 1, k.worldScissorTest = !1, k.width = 0, k.height = 0;
        class W extends B {
            constructor(e, i, s = t.RenderTextureFormat.R8G8B8, r = t.RenderTextureDepthFormat.DEPTH_16) {
                super(s, !1), this._mgrKey = 0, this._glTextureType = T.instance.TEXTURE_2D, this._width = e, this._height = i, this._depthStencilFormat = r, this._create(e, i), this.lock = !0
            }
            static get currentActive() {
                return W._currentActive
            }
            get depthStencilFormat() {
                return this._depthStencilFormat
            }
            get defaulteTexture() {
                return U.grayTexture
            }
            getIsReady() {
                return !0
            }
            get sourceWidth() {
                return this._width
            }
            get sourceHeight() {
                return this._height
            }
            get offsetX() {
                return 0
            }
            get offsetY() {
                return 0
            }
            _create(e, i) {
                var s = T.instance;
                this._frameBuffer = s.createFramebuffer(), S.bindTexture(s, this._glTextureType, this._glTexture);
                var r = this._getGLFormat();
                if (s.texImage2D(this._glTextureType, 0, r, e, i, 0, r, s.UNSIGNED_BYTE, null), this._setGPUMemory(e * i * 4), s.bindFramebuffer(s.FRAMEBUFFER, this._frameBuffer), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, this._glTexture, 0), this._depthStencilFormat !== t.RenderTextureDepthFormat.DEPTHSTENCIL_NONE) switch (this._depthStencilBuffer = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, this._depthStencilBuffer), this._depthStencilFormat) {
                    case t.RenderTextureDepthFormat.DEPTH_16:
                        s.renderbufferStorage(s.RENDERBUFFER, s.DEPTH_COMPONENT16, e, i), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.RENDERBUFFER, this._depthStencilBuffer);
                        break;
                    case t.RenderTextureDepthFormat.STENCIL_8:
                        s.renderbufferStorage(s.RENDERBUFFER, s.STENCIL_INDEX8, e, i), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.STENCIL_ATTACHMENT, s.RENDERBUFFER, this._depthStencilBuffer);
                        break;
                    case t.RenderTextureDepthFormat.DEPTHSTENCIL_24_8:
                        s.renderbufferStorage(s.RENDERBUFFER, s.DEPTH_STENCIL, e, i), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.RENDERBUFFER, this._depthStencilBuffer)
                }
                s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindRenderbuffer(s.RENDERBUFFER, null), this._setWarpMode(s.TEXTURE_WRAP_S, this._wrapModeU), this._setWarpMode(s.TEXTURE_WRAP_T, this._wrapModeV), this._setFilterMode(this._filterMode), this._setAnisotropy(this._anisoLevel), this._readyed = !0, this._activeResource()
            }
            generateMipmap() {
                this._isPot(this.width) && this._isPot(this.height) ? (this._mipmap = !0, T.instance.generateMipmap(this._glTextureType), this._setFilterMode(this._filterMode), this._setGPUMemory(this.width * this.height * 4 * (1 + 1 / 3))) : (this._mipmap = !1, this._setGPUMemory(this.width * this.height * 4))
            }
            static pushRT() {
                W.rtStack.push({
                    rt: W._currentActive,
                    w: k.width,
                    h: k.height
                })
            }
            static popRT() {
                var t = T.instance,
                    e = W.rtStack.pop();
                e && (W._currentActive != e.rt && (T.instance.bindFramebuffer(t.FRAMEBUFFER, e.rt ? e.rt._frameBuffer : null), W._currentActive = e.rt), t.viewport(0, 0, e.w, e.h), k.width = e.w, k.height = e.h)
            }
            start() {
                var t = T.instance;
                T.instance.bindFramebuffer(t.FRAMEBUFFER, this._frameBuffer), this._lastRT = W._currentActive, W._currentActive = this, this._readyed = !0, t.viewport(0, 0, this._width, this._height), this._lastWidth = k.width, this._lastHeight = k.height, k.width = this._width, k.height = this._height, G.activeShader = null
            }
            end() {
                var t = T.instance;
                t.bindFramebuffer(t.FRAMEBUFFER, null), W._currentActive = null, this._readyed = !0
            }
            restore() {
                var t = T.instance;
                this._lastRT != W._currentActive && (T.instance.bindFramebuffer(t.FRAMEBUFFER, this._lastRT ? this._lastRT._frameBuffer : null), W._currentActive = this._lastRT), this._readyed = !0, t.viewport(0, 0, this._lastWidth, this._lastHeight), k.width = this._lastWidth, k.height = this._lastHeight, G.activeShader = null
            }
            clear(t = 0, e = 0, i = 0, s = 1) {
                var r = T.instance;
                r.clearColor(t, e, i, s);
                var a = r.COLOR_BUFFER_BIT;
                switch (this._depthStencilFormat) {
                    case r.DEPTH_COMPONENT16:
                        a |= r.DEPTH_BUFFER_BIT;
                        break;
                    case r.STENCIL_INDEX8:
                        a |= r.STENCIL_BUFFER_BIT;
                        break;
                    case r.DEPTH_STENCIL:
                        a |= r.DEPTH_BUFFER_BIT, a |= r.STENCIL_BUFFER_BIT
                }
                r.clear(a)
            }
            getData(t, e, i, r) {
                if (s.Render.isConchApp && 2 == window.conchConfig.threadMode) throw "native 2 thread mode use getDataAsync";
                var a = T.instance;
                a.bindFramebuffer(a.FRAMEBUFFER, this._frameBuffer);
                var n = a.checkFramebufferStatus(a.FRAMEBUFFER) === a.FRAMEBUFFER_COMPLETE;
                if (!n) return a.bindFramebuffer(a.FRAMEBUFFER, null), null;
                var h = new Uint8Array(this._width * this._height * 4),
                    o = this._getGLFormat();
                return a.readPixels(t, e, i, r, o, a.UNSIGNED_BYTE, h), a.bindFramebuffer(a.FRAMEBUFFER, null), h
            }
            getDataAsync(t, e, i, s, r) {
                var a = T.instance;
                a.bindFramebuffer(a.FRAMEBUFFER, this._frameBuffer), a.readPixelsAsync(t, e, i, s, a.RGBA, a.UNSIGNED_BYTE, function(t) {
                    r(new Uint8Array(t))
                }), a.bindFramebuffer(a.FRAMEBUFFER, null)
            }
            recycle() {}
            _disposeResource() {
                if (this._frameBuffer) {
                    var t = T.instance;
                    t.deleteTexture(this._glTexture), t.deleteFramebuffer(this._frameBuffer), t.deleteRenderbuffer(this._depthStencilBuffer), this._glTexture = null, this._frameBuffer = null, this._depthStencilBuffer = null, this._setGPUMemory(0)
                }
            }
        }
        W.rtStack = [], W.defuv = [0, 0, 1, 0, 1, 1, 0, 1], W.flipyuv = [0, 1, 1, 1, 1, 0, 0, 0];
        class Y {
            static getRT(e, i) {
                var s;
                return e |= 0, i |= 0, e >= 1e4 && console.error("getRT error! w too big"), s = new W(e, i, t.RenderTextureFormat.R8G8B8A8, -1), s
            }
            static releaseRT(t) {
                t.destroy()
            }
        }
        Y.dict = {};
        class V {
            static _init_(t) {
                V.fns = [V.BlendNormal, V.BlendAdd, V.BlendMultiply, V.BlendScreen, V.BlendOverlay, V.BlendLight, V.BlendMask, V.BlendDestinationOut, V.BlendAddOld], V.targetFns = [V.BlendNormalTarget, V.BlendAddTarget, V.BlendMultiplyTarget, V.BlendScreenTarget, V.BlendOverlayTarget, V.BlendLightTarget, V.BlendMask, V.BlendDestinationOut, V.BlendAddTargetOld]
            }
            static BlendNormal(t) {
                S.setBlendFunc(t, t.ONE, t.ONE_MINUS_SRC_ALPHA, !0)
            }
            static BlendAddOld(t) {
                S.setBlendFunc(t, t.ONE, t.DST_ALPHA, !0)
            }
            static BlendAdd(t) {
                S.setBlendFunc(t, t.ONE, t.ONE, !0)
            }
            static BlendMultiply(t) {
                S.setBlendFunc(t, t.DST_COLOR, t.ONE_MINUS_SRC_ALPHA, !0)
            }
            static BlendScreen(t) {
                S.setBlendFunc(t, t.ONE, t.ONE, !0)
            }
            static BlendOverlay(t) {
                S.setBlendFunc(t, t.ONE, t.ONE_MINUS_SRC_COLOR, !0)
            }
            static BlendLight(t) {
                S.setBlendFunc(t, t.ONE, t.ONE, !0)
            }
            static BlendNormalTarget(t) {
                S.setBlendFunc(t, t.ONE, t.ONE_MINUS_SRC_ALPHA, !0)
            }
            static BlendAddTargetOld(t) {
                S.setBlendFunc(t, t.ONE, t.DST_ALPHA, !0)
            }
            static BlendAddTarget(t) {
                S.setBlendFunc(t, t.ONE, t.ONE, !0)
            }
            static BlendMultiplyTarget(t) {
                S.setBlendFunc(t, t.DST_COLOR, t.ONE_MINUS_SRC_ALPHA, !0)
            }
            static BlendScreenTarget(t) {
                S.setBlendFunc(t, t.ONE, t.ONE, !0)
            }
            static BlendOverlayTarget(t) {
                S.setBlendFunc(t, t.ONE, t.ONE_MINUS_SRC_COLOR, !0)
            }
            static BlendLightTarget(t) {
                S.setBlendFunc(t, t.ONE, t.ONE, !0)
            }
            static BlendMask(t) {
                S.setBlendFunc(t, t.ZERO, t.SRC_ALPHA, !0)
            }
            static BlendDestinationOut(t) {
                S.setBlendFunc(t, t.ZERO, t.ZERO, !0)
            }
        }
        V.activeBlendFunction = null, V.NAMES = ["normal", "add", "multiply", "screen", "overlay", "light", "mask", "destination-out", "add_old"], V.TOINT = {
            normal: 0,
            add: 1,
            multiply: 2,
            screen: 3,
            overlay: 4,
            light: 5,
            mask: 6,
            "destination-out": 7,
            lighter: 1,
            lighter_old: 8,
            add_old: 8
        }, V.NORMAL = "normal", V.MASK = "mask", V.LIGHTER = "lighter";
        class X {
            constructor(t, e, i) {
                this._value = 0, this._name2int = t, this._int2name = e, this._int2nameMap = i
            }
            add(t) {
                return this._value |= "string" == typeof t ? this._name2int[t] : t, this._value
            }
            addInt(t) {
                return this._value |= t, this._value
            }
            remove(t) {
                return this._value &= "string" == typeof t ? ~this._name2int[t] : ~t, this._value
            }
            isDefine(t) {
                return (this._value & t) === t
            }
            getValue() {
                return this._value
            }
            setValue(t) {
                this._value = t
            }
            toNameDic() {
                var t = this._int2nameMap[this._value];
                return t || X._toText(this._value, this._int2name, this._int2nameMap)
            }
            static _reg(t, e, i, s) {
                i[t] = e, s[e] = t
            }
            static _toText(t, e, i) {
                var s = i[t];
                if (s) return s;
                for (var r = {}, a = 1, n = 0; n < 32 && (a = 1 << n, !(a > t)); n++)
                    if (t & a) {
                        var h = e[a];
                        h && (r[h] = "")
                    }
                return i[t] = r, r
            }
            static _toInt(t, e) {
                for (var i = t.split("."), s = 0, r = 0, a = i.length; r < a; r++) {
                    var n = e[i[r]];
                    if (!n) throw new Error("Defines to int err:" + t + "/" + i[r]);
                    s |= n
                }
                return s
            }
        }
        class H extends X {
            constructor() {
                super(H.__name2int, H.__int2name, H.__int2nameMap)
            }
            static __init__() {
                H.reg("TEXTURE2D", H.TEXTURE2D), H.reg("PRIMITIVE", H.PRIMITIVE), H.reg("GLOW_FILTER", H.FILTERGLOW), H.reg("BLUR_FILTER", H.FILTERBLUR), H.reg("COLOR_FILTER", H.FILTERCOLOR), H.reg("COLOR_ADD", H.COLORADD), H.reg("WORLDMAT", H.WORLDMAT), H.reg("FILLTEXTURE", H.FILLTEXTURE), H.reg("MVP3D", H.MVP3D), H.reg("MOSAIC_FILTER", H.FILTERMOSAIC)
            }
            static reg(t, e) {
                this._reg(t, e, H.__name2int, H.__int2name)
            }
            static toText(t, e, i) {
                return this._toText(t, e, i)
            }
            static toInt(t) {
                return this._toInt(t, H.__name2int)
            }
        }
        H.TEXTURE2D = 1, H.PRIMITIVE = 4, H.FILTERGLOW = 8, H.FILTERBLUR = 16, H.FILTERCOLOR = 32, H.COLORADD = 64, H.WORLDMAT = 128, H.FILLTEXTURE = 256, H.SKINMESH = 512, H.MVP3D = 2048, H.FILTERMOSAIC = 4096, H.NOOPTMASK = H.FILTERGLOW | H.FILTERBLUR | H.FILTERCOLOR | H.FILLTEXTURE | H.FILTERMOSAIC, H.__name2int = {}, H.__int2name = [], H.__int2nameMap = [];
        class z {
            static show(t = 0, e = 0) {
                z._StatRender.show(t, e)
            }
            static enable() {
                z._StatRender.enable()
            }
            static hide() {
                z._StatRender.hide()
            }
            static clear() {
                z.trianglesFaces = z.renderBatches = z.savedRenderBatches = z.shaderCall = z.spriteRenderUseCacheCount = z.frustumCulling = z.octreeNodeCulling = z.canvasNormal = z.canvasBitmap = z.canvasReCache = 0
            }
            static set onclick(t) {
                z._StatRender.set_onclick(t)
            }
        }
        z.FPS = 0, z.loopCount = 0, z.shaderCall = 0, z.renderBatches = 0, z.savedRenderBatches = 0, z.trianglesFaces = 0, z.spriteCount = 0, z.spriteRenderUseCacheCount = 0, z.frustumCulling = 0, z.octreeNodeCulling = 0, z.canvasNormal = 0, z.canvasBitmap = 0, z.canvasReCache = 0, z.renderSlow = !1, z._fpsData = [], z._timer = 0, z._count = 0, z._StatRender = null;
        class K {
            constructor() {
                this._strsToID = {}, this._idToStrs = [], this._length = 0
            }
            add(t) {
                var e = this._strsToID[t];
                return null != e ? e : (this._idToStrs[this._length] = t, this._strsToID[t] = this._length++)
            }
            getID(t) {
                var e = this._strsToID[t];
                return null == e ? -1 : e
            }
            getName(t) {
                var e = this._idToStrs[t];
                return null == e ? void 0 : e
            }
        }
        class j extends G {
            constructor(t, e, i = null, s = null, r = null) {
                if (super(), this._attribInfo = null, this.customCompile = !1, this._curActTexIndex = 0, this.tag = {}, this._program = null, this._params = null, this._paramsMap = {}, !t || !e) throw "Shader Error";
                this._attribInfo = r, this._id = ++j._count, this._vs = t, this._ps = e, this._nameMap = s || {}, null != i && (j.sharders[i] = this), this.recreateResource(), this.lock = !0
            }
            static getShader(t) {
                return j.sharders[t]
            }
            static create(t, e, i = null, s = null, r = null) {
                return new j(t, e, i, s, r)
            }
            static withCompile(t, e, i, s) {
                if (i && j.sharders[i]) return j.sharders[i];
                var r = j._preCompileShader[j.SHADERNAME2ID * t];
                if (!r) throw new Error("withCompile shader err!" + t);
                return r.createShader(e, i, s, null)
            }
            static withCompile2D(t, e, i, s, r, a = null) {
                if (s && j.sharders[s]) return j.sharders[s];
                var n = j._preCompileShader[j.SHADERNAME2ID * t + e];
                if (!n) throw new Error("withCompile shader err!" + t + " " + e);
                return n.createShader(i, s, r, a)
            }
            static addInclude(t, e) {
                s.ShaderCompile.addInclude(t, e)
            }
            static preCompile(t, e, i, r) {
                var a = j.SHADERNAME2ID * t;
                j._preCompileShader[a] = new s.ShaderCompile(e, i, r)
            }
            static preCompile2D(t, e, i, r, a) {
                var n = j.SHADERNAME2ID * t + e;
                j._preCompileShader[n] = new s.ShaderCompile(i, r, a)
            }
            recreateResource() {
                this._compile(), this._setGPUMemory(0)
            }
            _disposeResource() {
                S.mainContext.deleteShader(this._vshader), S.mainContext.deleteShader(this._pshader), S.mainContext.deleteProgram(this._program), this._vshader = this._pshader = this._program = null, this._params = null, this._paramsMap = {}, this._setGPUMemory(0), this._curActTexIndex = 0
            }
            _compile() {
                if (this._vs && this._ps && !this._params) {
                    var t;
                    this._reCompile = !0, this._params = [], this.customCompile && (t = s.ShaderCompile.preGetParams(this._vs, this._ps));
                    var e, i, r, a, n = S.mainContext;
                    this._program = n.createProgram(), this._vshader = j._createShader(n, this._vs, n.VERTEX_SHADER), this._pshader = j._createShader(n, this._ps, n.FRAGMENT_SHADER), n.attachShader(this._program, this._vshader), n.attachShader(this._program, this._pshader);
                    var h = this._attribInfo ? this._attribInfo.length : 0;
                    for (i = 0; i < h; i += 2) n.bindAttribLocation(this._program, this._attribInfo[i + 1], this._attribInfo[i]);
                    if (n.linkProgram(this._program), !this.customCompile && !n.getProgramParameter(this._program, n.LINK_STATUS)) throw n.getProgramInfoLog(this._program);
                    var o = this.customCompile ? t.uniforms.length : n.getProgramParameter(this._program, n.ACTIVE_UNIFORMS);
                    for (i = 0; i < o; i++) {
                        var l = this.customCompile ? t.uniforms[i] : n.getActiveUniform(this._program, i);
                        a = n.getUniformLocation(this._program, l.name), e = {
                            vartype: "uniform",
                            glfun: null,
                            ivartype: 1,
                            location: a,
                            name: l.name,
                            type: l.type,
                            isArray: !1,
                            isSame: !1,
                            preValue: null,
                            indexOfParams: 0
                        }, e.name.indexOf("[0]") > 0 && (e.name = e.name.substr(0, e.name.length - 3), e.isArray = !0, e.location = n.getUniformLocation(this._program, e.name)), this._params.push(e)
                    }
                    for (i = 0, r = this._params.length; i < r; i++) switch (e = this._params[i], e.indexOfParams = i, e.index = 1, e.value = [e.location, null], e.codename = e.name, e.name = this._nameMap[e.codename] ? this._nameMap[e.codename] : e.codename, this._paramsMap[e.name] = e, e._this = this, e.uploadedValue = [], e.type) {
                        case n.INT:
                            e.fun = e.isArray ? this._uniform1iv : this._uniform1i;
                            break;
                        case n.FLOAT:
                            e.fun = e.isArray ? this._uniform1fv : this._uniform1f;
                            break;
                        case n.FLOAT_VEC2:
                            e.fun = e.isArray ? this._uniform_vec2v : this._uniform_vec2;
                            break;
                        case n.FLOAT_VEC3:
                            e.fun = e.isArray ? this._uniform_vec3v : this._uniform_vec3;
                            break;
                        case n.FLOAT_VEC4:
                            e.fun = e.isArray ? this._uniform_vec4v : this._uniform_vec4;
                            break;
                        case n.SAMPLER_2D:
                            e.fun = this._uniform_sampler2D;
                            break;
                        case n.SAMPLER_CUBE:
                            e.fun = this._uniform_samplerCube;
                            break;
                        case n.FLOAT_MAT4:
                            e.glfun = n.uniformMatrix4fv, e.fun = this._uniformMatrix4fv;
                            break;
                        case n.BOOL:
                            e.fun = this._uniform1i;
                            break;
                        case n.FLOAT_MAT2:
                        case n.FLOAT_MAT3:
                        default:
                            throw new Error("compile shader err!")
                    }
                }
            }
            static _createShader(t, e, i) {
                var s = t.createShader(i);
                return t.shaderSource(s, e), t.compileShader(s), t.getShaderParameter(s, t.COMPILE_STATUS) ? s : (console.log(t.getShaderInfoLog(s)), null)
            }
            getUniform(t) {
                return this._paramsMap[t]
            }
            _uniform1f(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e ? (S.mainContext.uniform1f(t.location, i[0] = e), 1) : 0
            }
            _uniform1fv(t, e) {
                if (e.length < 4) {
                    var i = t.uploadedValue;
                    return i[0] !== e[0] || i[1] !== e[1] || i[2] !== e[2] || i[3] !== e[3] ? (S.mainContext.uniform1fv(t.location, e), i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], 1) : 0
                }
                return S.mainContext.uniform1fv(t.location, e), 1
            }
            _uniform_vec2(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e[0] || i[1] !== e[1] ? (S.mainContext.uniform2f(t.location, i[0] = e[0], i[1] = e[1]), 1) : 0
            }
            _uniform_vec2v(t, e) {
                if (e.length < 2) {
                    var i = t.uploadedValue;
                    return i[0] !== e[0] || i[1] !== e[1] || i[2] !== e[2] || i[3] !== e[3] ? (S.mainContext.uniform2fv(t.location, e), i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], 1) : 0
                }
                return S.mainContext.uniform2fv(t.location, e), 1
            }
            _uniform_vec3(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e[0] || i[1] !== e[1] || i[2] !== e[2] ? (S.mainContext.uniform3f(t.location, i[0] = e[0], i[1] = e[1], i[2] = e[2]), 1) : 0
            }
            _uniform_vec3v(t, e) {
                return S.mainContext.uniform3fv(t.location, e), 1
            }
            _uniform_vec4(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e[0] || i[1] !== e[1] || i[2] !== e[2] || i[3] !== e[3] ? (S.mainContext.uniform4f(t.location, i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3]), 1) : 0
            }
            _uniform_vec4v(t, e) {
                return S.mainContext.uniform4fv(t.location, e), 1
            }
            _uniformMatrix2fv(t, e) {
                return S.mainContext.uniformMatrix2fv(t.location, !1, e), 1
            }
            _uniformMatrix3fv(t, e) {
                return S.mainContext.uniformMatrix3fv(t.location, !1, e), 1
            }
            _uniformMatrix4fv(t, e) {
                return S.mainContext.uniformMatrix4fv(t.location, !1, e), 1
            }
            _uniform1i(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e ? (S.mainContext.uniform1i(t.location, i[0] = e), 1) : 0
            }
            _uniform1iv(t, e) {
                return S.mainContext.uniform1iv(t.location, e), 1
            }
            _uniform_ivec2(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e[0] || i[1] !== e[1] ? (S.mainContext.uniform2i(t.location, i[0] = e[0], i[1] = e[1]), 1) : 0
            }
            _uniform_ivec2v(t, e) {
                return S.mainContext.uniform2iv(t.location, e), 1
            }
            _uniform_vec3i(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e[0] || i[1] !== e[1] || i[2] !== e[2] ? (S.mainContext.uniform3i(t.location, i[0] = e[0], i[1] = e[1], i[2] = e[2]), 1) : 0
            }
            _uniform_vec3vi(t, e) {
                return S.mainContext.uniform3iv(t.location, e), 1
            }
            _uniform_vec4i(t, e) {
                var i = t.uploadedValue;
                return i[0] !== e[0] || i[1] !== e[1] || i[2] !== e[2] || i[3] !== e[3] ? (S.mainContext.uniform4i(t.location, i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3]), 1) : 0
            }
            _uniform_vec4vi(t, e) {
                return S.mainContext.uniform4iv(t.location, e), 1
            }
            _uniform_sampler2D(t, e) {
                var i = S.mainContext,
                    s = t.uploadedValue;
                return null == s[0] ? (s[0] = this._curActTexIndex, i.uniform1i(t.location, this._curActTexIndex), S.activeTexture(i, i.TEXTURE0 + this._curActTexIndex), S.bindTexture(i, i.TEXTURE_2D, e), this._curActTexIndex++, 1) : (S.activeTexture(i, i.TEXTURE0 + s[0]), S.bindTexture(i, i.TEXTURE_2D, e), 0)
            }
            _uniform_samplerCube(t, e) {
                var i = S.mainContext,
                    s = t.uploadedValue;
                return null == s[0] ? (s[0] = this._curActTexIndex, i.uniform1i(t.location, this._curActTexIndex), S.activeTexture(i, i.TEXTURE0 + this._curActTexIndex), S.bindTexture(i, i.TEXTURE_CUBE_MAP, e), this._curActTexIndex++, 1) : (S.activeTexture(i, i.TEXTURE0 + s[0]), S.bindTexture(i, i.TEXTURE_CUBE_MAP, e), 0)
            }
            _noSetValue(t) {
                console.log("no....:" + t.name)
            }
            uploadOne(t, e) {
                S.useProgram(S.mainContext, this._program);
                var i = this._paramsMap[t];
                i.fun.call(this, i, e)
            }
            uploadTexture2D(t) {
                var e = S;
                e._activeTextures[0] !== t && (e.bindTexture(S.mainContext, T.instance.TEXTURE_2D, t), e._activeTextures[0] = t)
            }
            upload(t, e = null) {
                G.activeShader = G.bindShader = this;
                var i = S.mainContext;
                S.useProgram(i, this._program), this._reCompile ? (e = this._params, this._reCompile = !1) : e = e || this._params;
                for (var s, r, a = e.length, n = 0, h = 0; h < a; h++) s = e[h], null !== (r = t[s.name]) && (n += s.fun.call(this, s, r));
                z.shaderCall += n
            }
            uploadArray(t, e, i) {
                G.activeShader = this, G.bindShader = this, S.useProgram(S.mainContext, this._program);
                this._params;
                for (var s, r, a = 0, n = e - 2; n >= 0; n -= 2) r = this._paramsMap[t[n]], r && (s = t[n + 1], null != s && (i && i[r.name] && i[r.name].bind(), a += r.fun.call(this, r, s)));
                z.shaderCall += a
            }
            getParams() {
                return this._params
            }
            setAttributesLocation(t) {
                this._attribInfo = t
            }
        }
        j._count = 0, j._preCompileShader = {}, j.SHADERNAME2ID = 2e-4, j.nameKey = new K, j.sharders = new Array(32);
        class q extends j {
            constructor(t, e, i = null, s = null, r = null) {
                super(t, e, i, s, r), this._params2dQuick2 = null, this._shaderValueWidth = 0, this._shaderValueHeight = 0
            }
            _disposeResource() {
                super._disposeResource(), this._params2dQuick2 = null
            }
            upload2dQuick2(t) {
                this.upload(t, this._params2dQuick2 || this._make2dQuick2())
            }
            _make2dQuick2() {
                if (!this._params2dQuick2) {
                    this._params2dQuick2 = [];
                    for (var t, e = this._params, i = 0, s = e.length; i < s; i++) t = e[i], "size" !== t.name && this._params2dQuick2.push(t)
                }
                return this._params2dQuick2
            }
            static create(t, e, i = null, s = null, r = null) {
                return new q(t, e, i, s, r)
            }
        }
        class Z {
            constructor(t, e) {
                this.defines = new H, this.size = [0, 0], this.alpha = 1, this.ALPHA = 1, this.subID = 0, this.ref = 1, this._cacheID = 0, this.clipMatDir = [s.Context._MAXSIZE, 0, 0, s.Context._MAXSIZE], this.clipMatPos = [0, 0], this.clipOff = [0, 0], this.mainID = t, this.subID = e, this.textureHost = null, this.texture = null, this.color = null, this.colorAdd = null, this.u_mmat2 = null, this._cacheID = t | e, this._inClassCache = Z._cache[this._cacheID], t > 0 && !this._inClassCache && (this._inClassCache = Z._cache[this._cacheID] = [], this._inClassCache._length = 0), this.clear()
            }
            static _initone(t, e) {
                Z._typeClass[t] = e, Z._cache[t] = [], Z._cache[t]._length = 0
            }
            static __init__() {}
            setValue(t) {}
            _ShaderWithCompile() {
                var t = j.withCompile2D(0, this.mainID, this.defines.toNameDic(), this.mainID | this.defines._value, q.create, this._attribLocation);
                return t
            }
            upload() {
                var t = k;
                k.worldMatrix4 === k.TEMPMAT4_ARRAY || this.defines.addInt(H.WORLDMAT), this.mmat = t.worldMatrix4, k.matWVP && (this.defines.addInt(H.MVP3D), this.u_MvpMatrix = k.matWVP.elements);
                var e = j.sharders[this.mainID | this.defines._value] || this._ShaderWithCompile();
                e._shaderValueWidth !== t.width || e._shaderValueHeight !== t.height ? (this.size[0] = t.width, this.size[1] = t.height, e._shaderValueWidth = t.width, e._shaderValueHeight = t.height, e.upload(this, null)) : e.upload(this, e._params2dQuick2 || e._make2dQuick2())
            }
            setFilters(t) {
                if (this.filters = t, t)
                    for (var e, i = t.length, s = 0; s < i; s++) e = t[s], e && (this.defines.add(e.type), e.action.setValue(this))
            }
            clear() {
                this.defines._value = this.subID, this.clipOff[0] = 0
            }
            release() {
                --this.ref < 1 && (this._inClassCache && (this._inClassCache[this._inClassCache._length++] = this), this.clear(), this.filters = null, this.ref = 1, this.clipOff[0] = 0)
            }
            static create(t, e) {
                var i = Z._cache[t | e];
                return i._length ? i[--i._length] : new Z._typeClass[t | e](e)
            }
        }
        Z._cache = [], Z._typeClass = [], Z.TEMPMAT4_ARRAY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        class Q {
            constructor() {
                this.clear()
            }
            clear() {
                this.submitType = -1, this.blendShader = this.other = 0
            }
            copyFrom(t) {
                this.other = t.other, this.blendShader = t.blendShader, this.submitType = t.submitType
            }
            copyFrom2(t, e, i) {
                this.other = i, this.submitType = e
            }
            equal3_2(t, e, i) {
                return this.submitType === e && this.other === i && this.blendShader === t.blendShader
            }
            equal4_2(t, e, i) {
                return this.submitType === e && this.other === i && this.blendShader === t.blendShader
            }
            equal_3(t) {
                return this.submitType === t.submitType && this.blendShader === t.blendShader
            }
            equal(t) {
                return this.other === t.other && this.submitType === t.submitType && this.blendShader === t.blendShader
            }
        }
        class $ {
            constructor() {
                this._ref = 1, this._key = new Q
            }
            renderSubmit() {
                return this.fun.apply(this._this, this.args), 1
            }
            getRenderType() {
                return 0
            }
            releaseRender() {
                if (--this._ref < 1) {
                    var t = $.POOL;
                    t[t._length++] = this
                }
            }
            static create(t, e, i) {
                var s = $.POOL._length ? $.POOL[--$.POOL._length] : new $;
                return s.fun = e, s.args = t, s._this = i, s._ref = 1, s._key.clear(), s
            }
        }
        $.POOL = [], $.POOL._length = 0;
        class J {
            constructor() {}
            get type() {
                return -1
            }
        }
        J.BLUR = 16, J.COLOR = 32, J.GLOW = 8, J.MOSAIC = 4096, J._filter = function(t, e, i, s) {
            var r = e,
                a = this._next;
            if (a) {
                var n = t.filters,
                    h = n.length;
                if (1 == h && n[0].type == J.COLOR) return e.save(), e.setColorFilter(n[0]), a._fun.call(a, t, e, i, s), void e.restore();
                var o, l = Z.create(H.TEXTURE2D, 0),
                    _ = m.TEMP,
                    u = r._curMat,
                    c = f.create();
                u.copyTo(c);
                var d = 0,
                    p = 0,
                    T = !1,
                    v = null,
                    x = t._cacheStyle.filterCache || null;
                if (x && 0 == t.getRepaint()) {
                    if (T = t._isHaveGlowFilter() || !1, T && (d = 50, p = 25), o = t.getBounds(), o.width <= 0 || o.height <= 0) return;
                    o.width += d + 8, o.height += d + 8, o.x -= t.pivotX + 4, o.y -= t.pivotY + 4, _.x = o.x * c.a + o.y * c.c, _.y = o.y * c.d + o.x * c.b, o.x = _.x, o.y = _.y, _.x = o.width * c.a + o.height * c.c, _.y = o.height * c.d + o.width * c.b, o.width = _.x, o.height = _.y
                } else {
                    T = t._isHaveGlowFilter(), T && (d = 50, p = 25), o = new g, o.copyFrom(t.getSelfBounds()), o.x += t.x, o.y += t.y, o.x -= t.pivotX + 4, o.y -= t.pivotY + 4;
                    var y = o.x,
                        E = o.y;
                    if (o.width += d + 8, o.height += d + 8, _.x = o.x * c.a + o.y * c.c, _.y = o.y * c.d + o.x * c.b, o.x = _.x, o.y = _.y, _.x = o.width * c.a + o.height * c.c, _.y = o.height * c.d + o.width * c.b, o.width = _.x, o.height = _.y, o.width <= 0 || o.height <= 0) return;
                    x && Y.releaseRT(x), v = Y.getRT(o.width, o.height);
                    var A = x = Y.getRT(o.width, o.height);
                    t._getCacheStyle().filterCache = x, r.pushRT(), r.useRT(v);
                    var C = t.x - y + p,
                        R = t.y - E + p;
                    a._fun.call(a, t, e, C, R), r.useRT(A);
                    for (var b = 0; b < h; b++) {
                        0 != b && (r.useRT(v), r.drawTarget(A, 0, 0, o.width, o.height, f.TEMP.identity(), l, null, V.TOINT.overlay), r.useRT(A));
                        var S = n[b];
                        switch (S.type) {
                            case J.BLUR:
                            case J.GLOW:
                            case J.MOSAIC:
                                S._glRender && S._glRender.render(v, e, o.width, o.height, S);
                                break;
                            case J.COLOR:
                                r.setColorFilter(S), r.drawTarget(v, 0, 0, o.width, o.height, f.EMPTY.identity(), Z.create(H.TEXTURE2D, 0)), r.setColorFilter(null)
                        }
                    }
                    r.popRT()
                }
                if (i = i - p - t.x, s = s - p - t.y, _.setTo(i, s), c.transformPoint(_), i = _.x + o.x, s = _.y + o.y, r._drawRenderTexture(x, i, s, o.width, o.height, f.TEMP.identity(), 1, W.defuv), v) {
                    var w = $.create([v], function(t) {
                        t.destroy()
                    }, this);
                    v = null, e.addRenderObject(w)
                }
                c.destroy()
            }
        };
        class tt {
            static toRadian(t) {
                return t * tt._pi2
            }
            static toAngle(t) {
                return t * tt._pi
            }
            static toHexColor(t) {
                if (t < 0 || isNaN(t)) return null;
                for (var e = t.toString(16); e.length < 6;) e = "0" + e;
                return "#" + e
            }
            static getGID() {
                return tt._gid++
            }
            static concatArray(t, e) {
                if (!e) return t;
                if (!t) return e;
                var i, s = e.length;
                for (i = 0; i < s; i++) t.push(e[i]);
                return t
            }
            static clearArray(t) {
                return t ? (t.length = 0, t) : t
            }
            static copyArray(t, e) {
                if (t || (t = []), !e) return t;
                t.length = e.length;
                var i, s = e.length;
                for (i = 0; i < s; i++) t[i] = e[i];
                return t
            }
            static getGlobalRecByPoints(t, e, i, s, r) {
                var a, n;
                a = m.create().setTo(e, i), a = t.localToGlobal(a), n = m.create().setTo(s, r), n = t.localToGlobal(n);
                var h = g._getWrapRec([a.x, a.y, n.x, n.y]);
                return a.recover(), n.recover(), h
            }
            static getGlobalPosAndScale(t) {
                return tt.getGlobalRecByPoints(t, 0, 0, 1, 1)
            }
            static bind(t, e) {
                var i = t;
                return i = t.bind(e), i
            }
            static updateOrder(t) {
                if (!t || t.length < 2) return !1;
                for (var e, i, s, r = 1, a = t.length; r < a;) {
                    for (e = r, s = t[e], i = t[e]._zOrder; --e > -1 && t[e]._zOrder > i;) t[e + 1] = t[e];
                    t[e + 1] = s, r++
                }
                return !0
            }
            static transPointList(t, e, i) {
                var s, r = t.length;
                for (s = 0; s < r; s += 2) t[s] += e, t[s + 1] += i
            }
            static parseInt(t, e = 0) {
                var i = parseInt(t, e);
                return isNaN(i) ? 0 : i
            }
            static getFileExtension(t) {
                tt._extReg.lastIndex = t.lastIndexOf(".");
                var e = tt._extReg.exec(t);
                return e && e.length > 1 ? e[1].toLowerCase() : null
            }
            static getFilecompatibleExtension(t) {
                var e = t.split("."),
                    i = e.length;
                return e.length > 2 ? e[i - 2] + "." + e[i - 1] : null
            }
            static getTransformRelativeToWindow(t, e, i) {
                var s = tt.gStage,
                    r = tt.getGlobalPosAndScale(t),
                    a = s._canvasTransform.clone(),
                    n = a.tx,
                    h = a.ty;
                a.rotate(-Math.PI / 180 * s.canvasDegree), a.scale(s.clientScaleX, s.clientScaleY);
                var o, l, _, u, c = s.canvasDegree % 180 != 0;
                return c ? (o = i + r.y, l = e + r.x, o *= a.d, l *= a.a, 90 == s.canvasDegree ? (o = n - o, l += h) : (o += n, l = h - l)) : (o = e + r.x, l = i + r.y, o *= a.a, l *= a.d, o += n, l += h), l += s._safariOffsetY, c ? (_ = a.d * r.height, u = a.a * r.width) : (_ = a.a * r.width, u = a.d * r.height), {
                    x: o,
                    y: l,
                    scaleX: _,
                    scaleY: u
                }
            }
            static fitDOMElementInArea(t, e, i, s, r, a) {
                t._fitLayaAirInitialized || (t._fitLayaAirInitialized = !0, t.style.transformOrigin = t.style.webKittransformOrigin = "left top", t.style.position = "absolute");
                var n = tt.getTransformRelativeToWindow(e, i, s);
                t.style.transform = t.style.webkitTransform = "scale(" + n.scaleX + "," + n.scaleY + ") rotate(" + tt.gStage.canvasDegree + "deg)", t.style.width = r + "px", t.style.height = a + "px", t.style.left = n.x + "px", t.style.top = n.y + "px"
            }
            static isOkTextureList(t) {
                if (!t) return !1;
                var e, i, s = t.length;
                for (e = 0; e < s; e++)
                    if (i = t[e], !i || !i._getSource()) return !1;
                return !0
            }
            static isOKCmdList(t) {
                if (!t) return !1;
                var e, i = t.length;
                for (e = 0; e < i; e++) t[e];
                return !0
            }
            static getQueryString(t) {
                if (s.Browser.onMiniGame) return null;
                if (!window.location || !window.location.search) return null;
                var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
                    i = window.location.search.substr(1).match(e);
                return null != i ? unescape(i[2]) : null
            }
            static profile(t) {
                if (!t) throw Error("profile key is unexpected !!!");
                this.profileMap[t] = s.Browser.now()
            }
            static profileEnd(t, e = 20) {
                if (!t) throw Error("profile key is unexpected !!!");
                if (this.profileMap[t]) {
                    let i = Fi.Browser.now() - this.profileMap[t];
                    return delete this.profileMap[t], i > e && console.log("################ " + t + ": " + i + "ms"), i
                }
                return 0
            }
        }
        tt.profileMap = {}, tt.gStage = null, tt._gid = 1, tt._pi = 180 / Math.PI, tt._pi2 = Math.PI / 180, tt._extReg = /\.(\w+)\??/g, tt.parseXMLFromString = function(t) {
            var e;
            if (t = t.replace(/>\s+</g, "><"), e = (new DOMParser).parseFromString(t, "text/xml"), e.firstChild.textContent.indexOf("This page contains the following errors") > -1) throw new Error(e.firstChild.firstChild.textContent);
            return e
        };
        class et {
            constructor(t) {
                if (this.arrColor = [], null == t || "none" == t) return this.strColor = "#00000000", this.numColor = 0, void(this.arrColor = [0, 0, 0, 0]);
                var e, i, s;
                if ("string" == typeof t)
                    if (t.indexOf("rgba(") >= 0 || t.indexOf("rgb(") >= 0) {
                        var r, a, n = t;
                        for (r = n.indexOf("("), a = n.indexOf(")"), n = n.substring(r + 1, a), this.arrColor = n.split(","), i = this.arrColor.length, e = 0; e < i; e++) this.arrColor[e] = parseFloat(this.arrColor[e]), e < 3 && (this.arrColor[e] = Math.round(this.arrColor[e]));
                        s = 4 == this.arrColor.length ? 256 * (256 * (256 * this.arrColor[0] + this.arrColor[1]) + this.arrColor[2]) + Math.round(255 * this.arrColor[3]) : 256 * (256 * this.arrColor[0] + this.arrColor[1]) + this.arrColor[2], this.strColor = t
                    } else {
                        if (this.strColor = t, "#" === t.charAt(0) && (t = t.substr(1)), i = t.length, 3 === i || 4 === i) {
                            var h = "";
                            for (e = 0; e < i; e++) h += t[e] + t[e];
                            t = h
                        }
                        s = parseInt(t, 16)
                    } else s = t, this.strColor = tt.toHexColor(s);
                this.strColor.indexOf("rgba") >= 0 || 9 === this.strColor.length ? (this.arrColor = [((4278190080 & s) >>> 24) / 255, ((16711680 & s) >> 16) / 255, ((65280 & s) >> 8) / 255, (255 & s) / 255], this.numColor = (4278190080 & s) >>> 24 | (16711680 & s) >> 8 | (65280 & s) << 8 | (255 & s) << 24) : (this.arrColor = [((16711680 & s) >> 16) / 255, ((65280 & s) >> 8) / 255, (255 & s) / 255, 1], this.numColor = 4278190080 | (16711680 & s) >> 16 | 65280 & s | (255 & s) << 16), this.arrColor.__id = ++et._COLODID
            }
            static _initDefault() {
                for (var t in et._DEFAULT = {}, et._COLOR_MAP) et._SAVE[t] = et._DEFAULT[t] = new et(et._COLOR_MAP[t]);
                return et._DEFAULT
            }
            static _initSaveMap() {
                for (var t in et._SAVE_SIZE = 0, et._SAVE = {}, et._DEFAULT) et._SAVE[t] = et._DEFAULT[t]
            }
            static create(t) {
                var e = t + "",
                    i = et._SAVE[e];
                return null != i ? i : (et._SAVE_SIZE < 1e3 && et._initSaveMap(), et._SAVE[e] = new et(t))
            }
        }
        et._SAVE = {}, et._SAVE_SIZE = 0, et._COLOR_MAP = {
            purple: "#800080",
            orange: "#ffa500",
            white: "#FFFFFF",
            red: "#FF0000",
            green: "#00FF00",
            blue: "#0000FF",
            black: "#000000",
            yellow: "#FFFF00",
            gray: "#808080"
        }, et._DEFAULT = et._initDefault(), et._COLODID = 1;
        class it extends J {
            constructor(t = null) {
                super(), t || (t = this._copyMatrix(it.IDENTITY_MATRIX)), this._mat = new Float32Array(16), this._alpha = new Float32Array(4), this._specColor = new Float32Array(4), this.setByMatrix(t)
            }
            get specColor() {
                return this._specColor
            }
            set specColor(t) {
                this._specColor[0] = t.x, this._specColor[1] = t.y, this._specColor[2] = t.z, this._specColor[3] = t.w
            }
            gray() {
                return this.setByMatrix(it.GRAY_MATRIX)
            }
            color(t = 0, e = 0, i = 0, s = 1) {
                return this.setByMatrix([1, 0, 0, 0, t, 0, 1, 0, 0, e, 0, 0, 1, 0, i, 0, 0, 0, 1, s])
            }
            setColor(t) {
                var e = et.create(t).arrColor,
                    i = [0, 0, 0, 0, 256 * e[0], 0, 0, 0, 0, 256 * e[1], 0, 0, 0, 0, 256 * e[2], 0, 0, 0, 1, 0];
                return this.setByMatrix(i)
            }
            setByMatrix(t) {
                this._matrix != t && this._copyMatrix(t);
                for (var e = 0, i = 0, s = 0; s < 20; s++) s % 5 != 4 ? this._mat[e++] = t[s] : this._alpha[i++] = t[s];
                return this
            }
            get type() {
                return J.COLOR
            }
            adjustColor(t, e, i, s) {
                return this.adjustHue(s), this.adjustContrast(e), this.adjustBrightness(t), this.adjustSaturation(i), this
            }
            adjustBrightness(t) {
                return t = this._clampValue(t, 100), 0 == t || isNaN(t) ? this : this._multiplyMatrix([1, 0, 0, 0, t, 0, 1, 0, 0, t, 0, 0, 1, 0, t, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1])
            }
            adjustContrast(t) {
                if (t = this._clampValue(t, 100), 0 == t || isNaN(t)) return this;
                var e;
                t < 0 ? e = 127 + t / 100 * 127 : (e = t % 1, e = 0 == e ? it.DELTA_INDEX[t] : it.DELTA_INDEX[t << 0] * (1 - e) + it.DELTA_INDEX[1 + (t << 0)] * e, e = 127 * e + 127);
                var i = e / 127,
                    s = .5 * (127 - e);
                return this._multiplyMatrix([i, 0, 0, 0, s, 0, i, 0, 0, s, 0, 0, i, 0, s, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1])
            }
            adjustSaturation(t) {
                if (t = this._clampValue(t, 100), 0 == t || isNaN(t)) return this;
                var e = 1 + (t > 0 ? 3 * t / 100 : t / 100),
                    i = 1 - e,
                    s = .3086 * i,
                    r = .6094 * i,
                    a = .082 * i;
                return this._multiplyMatrix([s + e, r, a, 0, 0, s, r + e, a, 0, 0, s, r, a + e, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1])
            }
            adjustHue(t) {
                if (t = this._clampValue(t, 180) / 180 * Math.PI, 0 == t || isNaN(t)) return this;
                var e = Math.cos(t),
                    i = Math.sin(t),
                    s = .213,
                    r = .715,
                    a = .072;
                return this._multiplyMatrix([s + e * (1 - s) + i * -s, r + e * -r + i * -r, a + e * -a + i * (1 - a), 0, 0, s + e * -s + .143 * i, r + e * (1 - r) + .14 * i, a + e * -a + -.283 * i, 0, 0, s + e * -s + i * -(1 - s), r + e * -r + i * r, a + e * (1 - a) + i * a, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1])
            }
            reset() {
                return this.setByMatrix(this._copyMatrix(it.IDENTITY_MATRIX))
            }
            _multiplyMatrix(t) {
                var e = [];
                this._matrix = this._fixMatrix(this._matrix);
                for (var i = 0; i < 5; i++) {
                    for (var s = 0; s < 5; s++) e[s] = this._matrix[s + 5 * i];
                    for (s = 0; s < 5; s++) {
                        for (var r = 0, a = 0; a < 5; a++) r += t[s + 5 * a] * e[a];
                        this._matrix[s + 5 * i] = r
                    }
                }
                return this.setByMatrix(this._matrix)
            }
            _clampValue(t, e) {
                return Math.min(e, Math.max(-e, t))
            }
            _fixMatrix(t = null) {
                return null == t ? it.IDENTITY_MATRIX : (t.length < it.LENGTH ? t = t.slice(0, t.length).concat(it.IDENTITY_MATRIX.slice(t.length, it.LENGTH)) : t.length > it.LENGTH && (t = t.slice(0, it.LENGTH)), t)
            }
            _copyMatrix(t) {
                var e = it.LENGTH;
                this._matrix || (this._matrix = []);
                for (var i = 0; i < e; i++) this._matrix[i] = t[i];
                return this._matrix
            }
        }
        it.DELTA_INDEX = [0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10], it.GRAY_MATRIX = [.3086, .6094, .082, 0, 0, .3086, .6094, .082, 0, 0, .3086, .6094, .082, 0, 0, 0, 0, 0, 1, 0], it.IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], it.LENGTH = 25;
        class st {
            constructor() {
                this.colorFlt = null, this.uv = null
            }
            static create(t, e, i, s, a, n, h, o, l, _) {
                var u = r.getItemByClass("DrawTextureCmd", st);
                return u.texture = t, t._addReference(), u.x = e, u.y = i, u.width = s, u.height = a, u.matrix = n, u.alpha = h, u.color = o, u.blendMode = l, u.uv = null == _ ? null : _, o && (u.colorFlt = new it, u.colorFlt.setColor(o)), u
            }
            recover() {
                this.texture && this.texture._removeReference(), this.texture = null, this.matrix = null, r.recover("DrawTextureCmd", this)
            }
            run(t, e, i) {
                this.texture && t.drawTextureWithTransform(this.texture, this.x, this.y, this.width, this.height, this.matrix, e, i, this.alpha, this.blendMode, this.colorFlt, this.uv)
            }
            get cmdID() {
                return st.ID
            }
        }
        st.ID = "DrawTexture";
        class rt {
            static create(t, e, i, s, a, n, h, o) {
                var l = r.getItemByClass("FillTextureCmd", rt);
                return l.texture = t, l.x = e, l.y = i, l.width = s, l.height = a, l.type = n, l.offset = h, l.other = o, l
            }
            recover() {
                this.texture = null, this.offset = null, this.other = null, r.recover("FillTextureCmd", this)
            }
            run(t, e, i) {
                t.fillTexture(this.texture, this.x + e, this.y + i, this.width, this.height, this.type, this.offset, this.other)
            }
            get cmdID() {
                return rt.ID
            }
        }
        rt.ID = "FillTexture";
        class at {
            static create() {
                var t = r.getItemByClass("RestoreCmd", at);
                return t
            }
            recover() {
                r.recover("RestoreCmd", this)
            }
            run(t, e, i) {
                t.restore()
            }
            get cmdID() {
                return at.ID
            }
        }
        at.ID = "Restore";
        class nt {
            static create(t, e, i) {
                var s = r.getItemByClass("RotateCmd", nt);
                return s.angle = t, s.pivotX = e, s.pivotY = i, s
            }
            recover() {
                r.recover("RotateCmd", this)
            }
            run(t, e, i) {
                t._rotate(this.angle, this.pivotX + e, this.pivotY + i)
            }
            get cmdID() {
                return nt.ID
            }
        }
        nt.ID = "Rotate";
        class ht {
            static create(t, e, i, s) {
                var a = r.getItemByClass("ScaleCmd", ht);
                return a.scaleX = t, a.scaleY = e, a.pivotX = i, a.pivotY = s, a
            }
            recover() {
                r.recover("ScaleCmd", this)
            }
            run(t, e, i) {
                t._scale(this.scaleX, this.scaleY, this.pivotX + e, this.pivotY + i)
            }
            get cmdID() {
                return ht.ID
            }
        }
        ht.ID = "Scale";
        class ot {
            static create(t, e, i) {
                var s = r.getItemByClass("TransformCmd", ot);
                return s.matrix = t, s.pivotX = e, s.pivotY = i, s
            }
            recover() {
                this.matrix = null, r.recover("TransformCmd", this)
            }
            run(t, e, i) {
                t._transform(this.matrix, this.pivotX + e, this.pivotY + i)
            }
            get cmdID() {
                return ot.ID
            }
        }
        ot.ID = "Transform";
        class lt {
            static create(t, e) {
                var i = r.getItemByClass("TranslateCmd", lt);
                return i.tx = t, i.ty = e, i
            }
            recover() {
                r.recover("TranslateCmd", this)
            }
            run(t, e, i) {
                t.translate(this.tx, this.ty)
            }
            get cmdID() {
                return lt.ID
            }
        }
        lt.ID = "Translate";
        class _t {
            constructor() {
                this._controlPoints = [new m, new m, new m], this._calFun = this.getPoint2
            }
            _switchPoint(t, e) {
                var i = this._controlPoints.shift();
                i.setTo(t, e), this._controlPoints.push(i)
            }
            getPoint2(t, e) {
                var i = this._controlPoints[0],
                    s = this._controlPoints[1],
                    r = this._controlPoints[2],
                    a = Math.pow(1 - t, 2) * i.x + 2 * t * (1 - t) * s.x + Math.pow(t, 2) * r.x,
                    n = Math.pow(1 - t, 2) * i.y + 2 * t * (1 - t) * s.y + Math.pow(t, 2) * r.y;
                e.push(a, n)
            }
            getPoint3(t, e) {
                var i = this._controlPoints[0],
                    s = this._controlPoints[1],
                    r = this._controlPoints[2],
                    a = this._controlPoints[3],
                    n = Math.pow(1 - t, 3) * i.x + 3 * s.x * t * (1 - t) * (1 - t) + 3 * r.x * t * t * (1 - t) + a.x * Math.pow(t, 3),
                    h = Math.pow(1 - t, 3) * i.y + 3 * s.y * t * (1 - t) * (1 - t) + 3 * r.y * t * t * (1 - t) + a.y * Math.pow(t, 3);
                e.push(n, h)
            }
            insertPoints(t, e) {
                var i, s;
                for (t = t > 0 ? t : 5, s = 1 / t, i = 0; i <= 1; i += s) this._calFun(i, e)
            }
            getBezierPoints(t, e = 5, i = 2) {
                var s, r;
                if (r = t.length, r < 2 * (i + 1)) return [];
                var a = [];
                switch (i) {
                    case 2:
                        this._calFun = this.getPoint2;
                        break;
                    case 3:
                        this._calFun = this.getPoint3;
                        break;
                    default:
                        return []
                }
                for (; this._controlPoints.length <= i;) this._controlPoints.push(m.create());
                for (s = 0; s < 2 * i; s += 2) this._switchPoint(t[s], t[s + 1]);
                for (s = 2 * i; s < r; s += 2) this._switchPoint(t[s], t[s + 1]), s / 2 % i == 0 && this.insertPoints(e, a);
                return a
            }
        }
        _t.I = new _t;
        class ut {
            static multiply(t, e, i) {
                return (t.x - i.x) * (e.y - i.y) - (e.x - i.x) * (t.y - i.y)
            }
            static dis(t, e) {
                return (t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y)
            }
            static _getPoints(t, e = !1, i = null) {
                for (ut._mPointList || (ut._mPointList = []); ut._mPointList.length < t;) ut._mPointList.push(new m);
                return i || (i = []), i.length = 0, e ? ut.getFrom(i, ut._mPointList, t) : ut.getFromR(i, ut._mPointList, t), i
            }
            static getFrom(t, e, i) {
                var s;
                for (s = 0; s < i; s++) t.push(e[s]);
                return t
            }
            static getFromR(t, e, i) {
                var s;
                for (s = 0; s < i; s++) t.push(e.pop());
                return t
            }
            static pListToPointList(t, e = !1) {
                var i, s = t.length / 2,
                    r = ut._getPoints(s, e, ut._tempPointList);
                for (i = 0; i < s; i++) r[i].setTo(t[i + i], t[i + i + 1]);
                return r
            }
            static pointListToPlist(t) {
                var e, i, s = t.length,
                    r = ut._temPList;
                for (r.length = 0, e = 0; e < s; e++) i = t[e], r.push(i.x, i.y);
                return r
            }
            static scanPList(t) {
                return tt.copyArray(t, ut.pointListToPlist(ut.scan(ut.pListToPointList(t, !0))))
            }
            static scan(t) {
                var e, i, s, r, a, n = 0,
                    h = t.length,
                    o = {};
                for (r = ut._temArr, r.length = 0, h = t.length, e = h - 1; e >= 0; e--) s = t[e], a = s.x + "_" + s.y, a in o || (o[a] = !0, r.push(s));
                for (h = r.length, tt.copyArray(t, r), e = 1; e < h; e++)(t[e].y < t[n].y || t[e].y == t[n].y && t[e].x < t[n].x) && (n = e);
                for (s = t[0], t[0] = t[n], t[n] = s, e = 1; e < h - 1; e++) {
                    for (n = e, i = e + 1; i < h; i++)(ut.multiply(t[i], t[n], t[0]) > 0 || 0 == ut.multiply(t[i], t[n], t[0]) && ut.dis(t[0], t[i]) < ut.dis(t[0], t[n])) && (n = i);
                    s = t[e], t[e] = t[n], t[n] = s
                }
                if (r = ut._temArr, r.length = 0, t.length < 3) return tt.copyArray(r, t);
                for (r.push(t[0], t[1], t[2]), e = 3; e < h; e++) {
                    for (; r.length >= 2 && ut.multiply(t[e], r[r.length - 1], r[r.length - 2]) >= 0;) r.pop();
                    t[e] && r.push(t[e])
                }
                return r
            }
        }
        ut._tempPointList = [], ut._temPList = [], ut._temArr = [];
        class ct {
            constructor(t) {
                this.setValue(t)
            }
            static create(t) {
                if (t) {
                    var e = t instanceof et ? t : et.create(t);
                    return e._drawStyle || (e._drawStyle = new ct(t))
                }
                return ct.DEFAULT
            }
            setValue(t) {
                this._color = t ? t instanceof et ? t : et.create(t) : et.create("#000000")
            }
            reset() {
                this._color = et.create("#000000")
            }
            toInt() {
                return this._color.numColor
            }
            equal(t) {
                return "string" == typeof t ? this._color.strColor === t : t instanceof et && this._color.numColor === t.numColor
            }
            toColorStr() {
                return this._color.strColor
            }
        }
        ct.DEFAULT = new ct("#000000");
        class dt {
            constructor() {
                this._lastOriX = 0, this._lastOriY = 0, this.paths = [], this._curPath = null
            }
            beginPath(t) {
                this.paths.length = 1, this._curPath = this.paths[0] = new pt, this._curPath.convex = t
            }
            closePath() {
                this._curPath.loop = !0
            }
            newPath() {
                this._curPath = new pt, this.paths.push(this._curPath)
            }
            addPoint(t, e) {
                this._curPath.path.push(t, e)
            }
            push(t, e) {
                this._curPath ? this._curPath.path.length > 0 && (this._curPath = new pt, this.paths.push(this._curPath)) : (this._curPath = new pt, this.paths.push(this._curPath));
                var i = this._curPath;
                i.path = t.slice(), i.convex = e
            }
            reset() {
                this.paths.length = 0
            }
        }
        class pt {
            constructor() {
                this.path = [], this.loop = !1, this.convex = !1
            }
        }
        class ft {
            constructor(t = ft.TYPE_2D) {
                this.clipInfoID = -1, this._mesh = null, this._blendFn = null, this._id = 0, this._renderType = 0, this._parent = null, this._key = new Q, this._startIdx = 0, this._numEle = 0, this._ref = 1, this.shaderValue = null, this._renderType = t, this._id = ++ft.ID
            }
            static __init__() {
                var t = ft.RENDERBASE = new ft(-1);
                t.shaderValue = new Z(0, 0), t.shaderValue.ALPHA = 1, t._ref = 4294967295
            }
            getID() {
                return this._id
            }
            getRenderType() {
                return this._renderType
            }
            toString() {
                return "ibindex:" + this._startIdx + " num:" + this._numEle + " key=" + this._key
            }
            renderSubmit() {
                return 1
            }
            releaseRender() {}
        }
        ft.TYPE_2D = 1e4, ft.TYPE_CANVAS = 10003, ft.TYPE_CMDSETRT = 10004, ft.TYPE_CUSTOM = 10005, ft.TYPE_BLURRT = 10006, ft.TYPE_CMDDESTORYPRERT = 10007, ft.TYPE_DISABLESTENCIL = 10008, ft.TYPE_OTHERIBVB = 10009, ft.TYPE_PRIMITIVE = 10010, ft.TYPE_RT = 10011, ft.TYPE_BLUR_RT = 10012, ft.TYPE_TARGET = 10013, ft.TYPE_CHANGE_VALUE = 10014, ft.TYPE_SHAPE = 10015, ft.TYPE_TEXTURE = 10016, ft.TYPE_FILLTEXTURE = 10017, ft.KEY_ONCE = -1, ft.KEY_FILLRECT = 1, ft.KEY_DRAWTEXTURE = 2, ft.KEY_VG = 3, ft.KEY_TRIANGLES = 4, ft.ID = 1, ft.preRender = null;
        class mt {
            constructor() {}
            static _createArray() {
                var t = [];
                return t._length = 0, t
            }
            static _init() {
                var t = mt._namemap = {};
                return t[mt.TYPE_ALPHA] = "ALPHA", t[mt.TYPE_FILESTYLE] = "fillStyle", t[mt.TYPE_FONT] = "font", t[mt.TYPE_LINEWIDTH] = "lineWidth", t[mt.TYPE_STROKESTYLE] = "strokeStyle", t[mt.TYPE_ENABLEMERGE] = "_mergeID", t[mt.TYPE_MARK] = t[mt.TYPE_TRANSFORM] = t[mt.TYPE_TRANSLATE] = [], t[mt.TYPE_TEXTBASELINE] = "textBaseline", t[mt.TYPE_TEXTALIGN] = "textAlign", t[mt.TYPE_GLOBALCOMPOSITEOPERATION] = "_nBlendType", t[mt.TYPE_SHADER] = "shader", t[mt.TYPE_FILTERS] = "filters", t[mt.TYPE_COLORFILTER] = "_colorFiler", t
            }
            isSaveMark() {
                return !1
            }
            restore(t) {
                this._dataObj[this._valueName] = this._value, mt.POOL[mt.POOL._length++] = this, this._newSubmit && (t._curSubmit = ft.RENDERBASE)
            }
            static save(t, e, i, s) {
                if ((t._saveMark._saveuse & e) !== e) {
                    t._saveMark._saveuse |= e;
                    var r = mt.POOL,
                        a = r._length > 0 ? r[--r._length] : new mt;
                    a._value = i[a._valueName = mt._namemap[e]], a._dataObj = i, a._newSubmit = s;
                    var n = t._save;
                    n[n._length++] = a
                }
            }
        }
        mt.TYPE_ALPHA = 1, mt.TYPE_FILESTYLE = 2, mt.TYPE_FONT = 8, mt.TYPE_LINEWIDTH = 256, mt.TYPE_STROKESTYLE = 512, mt.TYPE_MARK = 1024, mt.TYPE_TRANSFORM = 2048, mt.TYPE_TRANSLATE = 4096, mt.TYPE_ENABLEMERGE = 8192, mt.TYPE_TEXTBASELINE = 16384, mt.TYPE_TEXTALIGN = 32768, mt.TYPE_GLOBALCOMPOSITEOPERATION = 65536, mt.TYPE_CLIPRECT = 131072, mt.TYPE_CLIPRECT_STENCIL = 262144, mt.TYPE_IBVB = 524288, mt.TYPE_SHADER = 1048576, mt.TYPE_FILTERS = 2097152, mt.TYPE_FILTERS_TYPE = 4194304, mt.TYPE_COLORFILTER = 8388608, mt.POOL = mt._createArray(), mt._namemap = mt._init();
        class gt {
            constructor() {
                this._globalClipMatrix = new f, this._clipInfoID = -1, this._clipRect = new g, this.incache = !1
            }
            isSaveMark() {
                return !1
            }
            restore(t) {
                this._globalClipMatrix.copyTo(t._globalClipMatrix), this._clipRect.clone(t._clipRect), t._clipInfoID = this._clipInfoID, gt.POOL[gt.POOL._length++] = this, t._clipInCache = this.incache
            }
            static save(t) {
                if ((t._saveMark._saveuse & mt.TYPE_CLIPRECT) != mt.TYPE_CLIPRECT) {
                    t._saveMark._saveuse |= mt.TYPE_CLIPRECT;
                    var e = gt.POOL,
                        i = e._length > 0 ? e[--e._length] : new gt;
                    t._globalClipMatrix.copyTo(i._globalClipMatrix), t._clipRect.clone(i._clipRect), i._clipInfoID = t._clipInfoID, i.incache = t._clipInCache;
                    var s = t._save;
                    s[s._length++] = i
                }
            }
        }
        gt.POOL = mt._createArray();
        class Tt {
            constructor() {
                this._saveuse = 0
            }
            isSaveMark() {
                return !0
            }
            restore(t) {
                t._saveMark = this._preSaveMark, Tt.POOL[Tt.POOL._length++] = this
            }
            static Create(t) {
                var e = Tt.POOL,
                    i = e._length > 0 ? e[--e._length] : new Tt;
                return i._saveuse = 0, i._preSaveMark = t._saveMark, t._saveMark = i, i
            }
        }
        Tt.POOL = mt._createArray();
        class vt {
            constructor() {
                this._matrix = new f
            }
            isSaveMark() {
                return !1
            }
            restore(t) {
                t._curMat = this._savematrix, vt.POOL[vt.POOL._length++] = this
            }
            static save(t) {
                var e = t._saveMark;
                if ((e._saveuse & mt.TYPE_TRANSFORM) !== mt.TYPE_TRANSFORM) {
                    e._saveuse |= mt.TYPE_TRANSFORM;
                    var i = vt.POOL,
                        s = i._length > 0 ? i[--i._length] : new vt;
                    s._savematrix = t._curMat, t._curMat = t._curMat.copyTo(s._matrix);
                    var r = t._save;
                    r[r._length++] = s
                }
            }
        }
        vt.POOL = mt._createArray();
        class xt {
            constructor() {
                this._mat = new f
            }
            isSaveMark() {
                return !1
            }
            restore(t) {
                this._mat.copyTo(t._curMat), xt.POOL[xt.POOL._length++] = this
            }
            static save(t) {
                var e = xt.POOL,
                    i = e._length > 0 ? e[--e._length] : new xt;
                t._curMat.copyTo(i._mat);
                var s = t._save;
                s[s._length++] = i
            }
        }
        xt.POOL = mt._createArray();
        class yt {
            constructor() {
                this._nativeVertexArrayObject = T.layaGPUInstance.createVertexArray()
            }
            bind() {
                yt._curBindedBufferState !== this && (T.layaGPUInstance.bindVertexArray(this._nativeVertexArrayObject), yt._curBindedBufferState = this)
            }
            unBind() {
                if (yt._curBindedBufferState !== this) throw "BufferState: must call bind() function first.";
                T.layaGPUInstance.bindVertexArray(null), yt._curBindedBufferState = null
            }
            destroy() {
                T.layaGPUInstance.deleteVertexArray(this._nativeVertexArrayObject)
            }
            bindForNative() {
                T.instance.bindVertexArray(this._nativeVertexArrayObject), yt._curBindedBufferState = this
            }
            unBindForNative() {
                T.instance.bindVertexArray(null), yt._curBindedBufferState = null
            }
        }
        class Et extends yt {
            constructor() {
                super()
            }
        }
        class At {
            constructor() {
                this._byteLength = 0, this._glBuffer = T.instance.createBuffer()
            }
            get bufferUsage() {
                return this._bufferUsage
            }
            _bindForVAO() {}
            bind() {
                return !1
            }
            destroy() {
                this._glBuffer && (T.instance.deleteBuffer(this._glBuffer), this._glBuffer = null)
            }
        }
        class Ct {}
        Ct.loopStTm = 0, Ct.loopCount = 0;
        class Rt extends At {
            constructor() {
                super(), this._maxsize = 0, this._upload = !0, this._uploadSize = 0, this._bufferSize = 0, this._u8Array = null
            }
            static __int__(t) {}
            get bufferLength() {
                return this._buffer.byteLength
            }
            set byteLength(t) {
                this.setByteLength(t)
            }
            setByteLength(t) {
                this._byteLength !== t && (t <= this._bufferSize || this._resizeBuffer(2 * t + 256, !0), this._byteLength = t)
            }
            needSize(t) {
                var e = this._byteLength;
                if (t) {
                    var i = this._byteLength + t;
                    i <= this._bufferSize || this._resizeBuffer(i << 1, !0), this._byteLength = i
                }
                return e
            }
            _bufferData() {
                this._maxsize = Math.max(this._maxsize, this._byteLength), Ct.loopCount % 30 == 0 && (this._buffer.byteLength > this._maxsize + 64 && (this._buffer = this._buffer.slice(0, this._maxsize + 64), this._bufferSize = this._buffer.byteLength, this._checkArrayUse()), this._maxsize = this._byteLength), this._uploadSize < this._buffer.byteLength && (this._uploadSize = this._buffer.byteLength, T.instance.bufferData(this._bufferType, this._uploadSize, this._bufferUsage)), T.instance.bufferSubData(this._bufferType, 0, new Uint8Array(this._buffer, 0, this._byteLength))
            }
            _bufferSubData(t = 0, e = 0, i = 0) {
                if (this._maxsize = Math.max(this._maxsize, this._byteLength), Ct.loopCount % 30 == 0 && (this._buffer.byteLength > this._maxsize + 64 && (this._buffer = this._buffer.slice(0, this._maxsize + 64), this._bufferSize = this._buffer.byteLength, this._checkArrayUse()), this._maxsize = this._byteLength), this._uploadSize < this._buffer.byteLength && (this._uploadSize = this._buffer.byteLength, T.instance.bufferData(this._bufferType, this._uploadSize, this._bufferUsage)), e || i) {
                    var s = this._buffer.slice(e, i);
                    T.instance.bufferSubData(this._bufferType, t, s)
                } else T.instance.bufferSubData(this._bufferType, t, this._buffer)
            }
            _checkArrayUse() {}
            _bind_uploadForVAO() {
                return !!this._upload && (this._upload = !1, this._bindForVAO(), this._bufferData(), !0)
            }
            _bind_upload() {
                return !!this._upload && (this._upload = !1, this.bind(), this._bufferData(), !0)
            }
            _bind_subUpload(t = 0, e = 0, i = 0) {
                return !!this._upload && (this._upload = !1, this.bind(), this._bufferSubData(t, e, i), !0)
            }
            _resizeBuffer(t, e) {
                var i = this._buffer;
                if (t <= i.byteLength) return this;
                var s = this._u8Array;
                if (e && i && i.byteLength > 0) {
                    var r = new ArrayBuffer(t),
                        a = s && s.buffer == i ? s : new Uint8Array(i);
                    s = this._u8Array = new Uint8Array(r), s.set(a, 0), i = this._buffer = r
                } else i = this._buffer = new ArrayBuffer(t), this._u8Array = null;
                return this._checkArrayUse(), this._upload = !0, this._bufferSize = i.byteLength, this
            }
            append(t) {
                var e, i;
                this._upload = !0, e = t.byteLength, t instanceof Uint8Array ? (this._resizeBuffer(this._byteLength + e, !0), i = new Uint8Array(this._buffer, this._byteLength)) : t instanceof Uint16Array ? (this._resizeBuffer(this._byteLength + e, !0), i = new Uint16Array(this._buffer, this._byteLength)) : t instanceof Float32Array && (this._resizeBuffer(this._byteLength + e, !0), i = new Float32Array(this._buffer, this._byteLength)), i.set(t, 0), this._byteLength += e, this._checkArrayUse()
            }
            appendU16Array(t, e) {
                this._resizeBuffer(this._byteLength + 2 * e, !0);
                var i = new Uint16Array(this._buffer, this._byteLength, e);
                if (6 == e) i[0] = t[0], i[1] = t[1], i[2] = t[2], i[3] = t[3], i[4] = t[4], i[5] = t[5];
                else if (e >= 100) i.set(new Uint16Array(t.buffer, 0, e));
                else
                    for (var s = 0; s < e; s++) i[s] = t[s];
                this._byteLength += 2 * e, this._checkArrayUse()
            }
            appendEx(t, e) {
                var i, s;
                this._upload = !0, i = t.byteLength, this._resizeBuffer(this._byteLength + i, !0), s = new e(this._buffer, this._byteLength), s.set(t, 0), this._byteLength += i, this._checkArrayUse()
            }
            appendEx2(t, e, i, s = 1) {
                var r, a, n;
                for (this._upload = !0, r = i * s, this._resizeBuffer(this._byteLength + r, !0), a = new e(this._buffer, this._byteLength), n = 0; n < i; n++) a[n] = t[n];
                this._byteLength += r, this._checkArrayUse()
            }
            getBuffer() {
                return this._buffer
            }
            setNeedUpload() {
                this._upload = !0
            }
            getNeedUpload() {
                return this._upload
            }
            upload() {
                var t = T.instance,
                    e = this._bind_upload();
                return t.bindBuffer(this._bufferType, null), this._bufferType == t.ARRAY_BUFFER && (At._bindedVertexBuffer = null), this._bufferType == t.ELEMENT_ARRAY_BUFFER && (At._bindedIndexBuffer = null), G.activeShader = null, e
            }
            subUpload(t = 0, e = 0, i = 0) {
                var s = T.instance,
                    r = this._bind_subUpload();
                return s.bindBuffer(this._bufferType, null), this._bufferType == s.ARRAY_BUFFER && (At._bindedVertexBuffer = null), this._bufferType == s.ELEMENT_ARRAY_BUFFER && (At._bindedIndexBuffer = null), G.activeShader = null, r
            }
            _disposeResource() {
                this._upload = !0, this._uploadSize = 0
            }
            clear() {
                this._byteLength = 0, this._upload = !0
            }
        }
        Rt.FLOAT32 = 4, Rt.SHORT = 2;
        class bt extends Rt {
            constructor(t = 35044) {
                super(), this._bufferUsage = t, this._bufferType = T.instance.ELEMENT_ARRAY_BUFFER, this._buffer = new ArrayBuffer(8)
            }
            _checkArrayUse() {
                this._uint16Array && (this._uint16Array = new Uint16Array(this._buffer))
            }
            getUint16Array() {
                return this._uint16Array || (this._uint16Array = new Uint16Array(this._buffer))
            }
            _bindForVAO() {
                var t = T.instance;
                t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this._glBuffer)
            }
            bind() {
                if (At._bindedIndexBuffer !== this._glBuffer) {
                    var t = T.instance;
                    return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this._glBuffer), At._bindedIndexBuffer = this._glBuffer, !0
                }
                return !1
            }
            destory() {
                this._uint16Array = null, this._buffer = null
            }
            disposeResource() {
                this._disposeResource()
            }
        }
        bt.create = function(t = 35044) {
            return new bt(t)
        };
        class St extends Rt {
            constructor(t, e) {
                super(), this._vertexStride = t, this._bufferUsage = e, this._bufferType = T.instance.ARRAY_BUFFER, this._buffer = new ArrayBuffer(8), this._floatArray32 = new Float32Array(this._buffer), this._uint32Array = new Uint32Array(this._buffer)
            }
            get vertexStride() {
                return this._vertexStride
            }
            getFloat32Array() {
                return this._floatArray32
            }
            appendArray(t) {
                var e = this._byteLength >> 2;
                this.setByteLength(this._byteLength + 4 * t.length);
                var i = this.getFloat32Array();
                i.set(t, e), this._upload = !0
            }
            _checkArrayUse() {
                this._floatArray32 && (this._floatArray32 = new Float32Array(this._buffer)), this._uint32Array && (this._uint32Array = new Uint32Array(this._buffer))
            }
            deleteBuffer() {
                super._disposeResource()
            }
            _bindForVAO() {
                var t = T.instance;
                t.bindBuffer(t.ARRAY_BUFFER, this._glBuffer)
            }
            bind() {
                if (At._bindedVertexBuffer !== this._glBuffer) {
                    var t = T.instance;
                    return t.bindBuffer(t.ARRAY_BUFFER, this._glBuffer), At._bindedVertexBuffer = this._glBuffer, !0
                }
                return !1
            }
            destroy() {
                super.destroy(), this._byteLength = 0, this._upload = !0, this._buffer = null, this._floatArray32 = null
            }
        }
        St.create = function(t, e = 35048) {
            return new St(t, e)
        };
        class wt {
            constructor(t, e, s) {
                this._stride = 0, this.vertNum = 0, this.indexNum = 0, this._applied = !1, this._quadNum = 0, this.canReuse = !1, this._stride = t, this._vb = new St(t, T.instance.DYNAMIC_DRAW), e ? this._vb._resizeBuffer(e, !1) : i.webGL2D_MeshAllocMaxMem && this._vb._resizeBuffer(65536 * t, !1), this._ib = new bt, s && this._ib._resizeBuffer(s, !1)
            }
            cloneWithNewVB() {
                var t = new wt(this._stride, 0, 0);
                return t._ib = this._ib, t._quadNum = this._quadNum, t._attribInfo = this._attribInfo, t
            }
            cloneWithNewVBIB() {
                var t = new wt(this._stride, 0, 0);
                return t._attribInfo = this._attribInfo, t
            }
            getVBW() {
                return this._vb.setNeedUpload(), this._vb
            }
            getVBR() {
                return this._vb
            }
            getIBR() {
                return this._ib
            }
            getIBW() {
                return this._ib.setNeedUpload(), this._ib
            }
            createQuadIB(t) {
                this._quadNum = t, this._ib._resizeBuffer(6 * t * 2, !1), this._ib.byteLength = this._ib.bufferLength;
                for (var e = this._ib.getUint16Array(), i = 0, s = 0, r = 0; r < t; r++) e[i++] = s, e[i++] = s + 2, e[i++] = s + 1, e[i++] = s, e[i++] = s + 3, e[i++] = s + 2, s += 4;
                this._ib.setNeedUpload()
            }
            setAttributes(t) {
                if (this._attribInfo = t, this._attribInfo.length % 3 != 0) throw "Mesh2D setAttributes error!"
            }
            configVAO(t) {
                if (!this._applied) {
                    this._applied = !0, this._vao || (this._vao = new Et), this._vao.bind(), this._vb._bindForVAO();
                    for (var e = this._attribInfo.length / 3, i = 0, s = 0; s < e; s++) {
                        var r = this._attribInfo[i + 1],
                            a = this._attribInfo[i],
                            n = this._attribInfo[i + 2];
                        t.enableVertexAttribArray(s), t.vertexAttribPointer(s, r, a, !1, this._stride, n), i += 3
                    }
                    this._vao.unBind()
                }
            }
            useMesh(t) {
                this._applied || this.configVAO(t), this._vao.bind(), this._vb.bind(), this._ib._bind_upload() || this._ib._bindForVAO(), this._vb._bind_upload() || this._vb.bind()
            }
            getEleNum() {
                return this._ib.getBuffer().byteLength / 2
            }
            releaseMesh() {}
            destroy() {}
            clearVB() {
                this._vb.clear()
            }
        }
        wt._gvaoid = 0;
        class Mt extends wt {
            constructor() {
                super(Mt.const_stride, 4, 4), this.canReuse = !0, this.setAttributes(Mt._fixattriInfo), Mt._fixib ? (this._ib = Mt._fixib, this._quadNum = Mt._maxIB) : (this.createQuadIB(Mt._maxIB), Mt._fixib = this._ib)
            }
            static __int__() {
                Mt._fixattriInfo = [5126, 4, 0, 5121, 4, 16, 5121, 4, 20]
            }
            static getAMesh(t) {
                var e = null;
                return e = Mt._POOL.length ? Mt._POOL.pop() : new Mt, t && e._vb._resizeBuffer(65536 * Mt.const_stride, !1), e
            }
            releaseMesh() {
                this._vb.setByteLength(0), this.vertNum = 0, this.indexNum = 0, Mt._POOL.push(this)
            }
            destroy() {
                this._vb.destroy(), this._vb.deleteBuffer()
            }
            addQuad(t, e, i, s) {
                var r = this._vb,
                    a = r._byteLength >> 2;
                r.setByteLength(a + Mt.const_stride << 2);
                var n = r._floatArray32 || r.getFloat32Array(),
                    h = r._uint32Array,
                    o = a,
                    l = s ? 255 : 0;
                n[o++] = t[0], n[o++] = t[1], n[o++] = e[0], n[o++] = e[1], h[o++] = i, h[o++] = l, n[o++] = t[2], n[o++] = t[3], n[o++] = e[2], n[o++] = e[3], h[o++] = i, h[o++] = l, n[o++] = t[4], n[o++] = t[5], n[o++] = e[4], n[o++] = e[5], h[o++] = i, h[o++] = l, n[o++] = t[6], n[o++] = t[7], n[o++] = e[6], n[o++] = e[7], h[o++] = i, h[o++] = l, r._upload = !0
            }
        }
        Mt.const_stride = 24, Mt._maxIB = 16384, Mt._POOL = [];
        class It extends wt {
            constructor() {
                super(It.const_stride, 4, 4), this.canReuse = !0, this.setAttributes(It._fixattriInfo)
            }
            static __init__() {
                It._fixattriInfo = [5126, 4, 0, 5121, 4, 16, 5121, 4, 20]
            }
            static getAMesh(t) {
                var e;
                return e = It._POOL.length ? It._POOL.pop() : new It, t && e._vb._resizeBuffer(65536 * It.const_stride, !1), e
            }
            addData(t, e, i, s, r) {
                var a = this._vb,
                    n = this._ib,
                    h = t.length >> 1,
                    o = a.needSize(h * It.const_stride),
                    l = o >> 2,
                    _ = a._floatArray32 || a.getFloat32Array(),
                    u = a._uint32Array,
                    c = 0,
                    d = s.a,
                    p = s.b,
                    f = s.c,
                    m = s.d,
                    g = s.tx,
                    T = s.ty,
                    v = 0;
                for (v = 0; v < h; v++) {
                    var x = t[c],
                        y = t[c + 1];
                    _[l] = x * d + y * f + g, _[l + 1] = x * p + y * m + T, _[l + 2] = e[c], _[l + 3] = e[c + 1], u[l + 4] = r, u[l + 5] = 255, l += 6, c += 2
                }
                a.setNeedUpload();
                var E = this.vertNum,
                    A = i.length,
                    C = n.needSize(i.byteLength),
                    R = n.getUint16Array(),
                    b = C >> 1;
                if (E > 0) {
                    var S = b + A,
                        w = 0;
                    for (v = b; v < S; v++, w++) R[v] = i[w] + E
                } else R.set(i, b);
                n.setNeedUpload(), this.vertNum += h, this.indexNum += i.length
            }
            releaseMesh() {
                this._vb.setByteLength(0), this._ib.setByteLength(0), this.vertNum = 0, this.indexNum = 0, It._POOL.push(this)
            }
            destroy() {
                this._ib.destroy(), this._vb.destroy(), this._ib.disposeResource(), this._vb.deleteBuffer()
            }
        }
        It.const_stride = 24, It._POOL = [];
        class Pt extends wt {
            constructor() {
                super(Pt.const_stride, 4, 4), this.canReuse = !0, this.setAttributes(Pt._fixattriInfo)
            }
            static __init__() {
                Pt._fixattriInfo = [5126, 2, 0, 5121, 4, 8]
            }
            static getAMesh(t) {
                var e;
                return e = Pt._POOL.length ? Pt._POOL.pop() : new Pt, t && e._vb._resizeBuffer(65536 * Pt.const_stride, !1), e
            }
            addVertAndIBToMesh(t, e, i, s) {
                for (var r = this._vb.needSize(e.length / 2 * Pt.const_stride), a = r >> 2, n = this._vb._floatArray32 || this._vb.getFloat32Array(), h = this._vb._uint32Array, o = 0, l = e.length / 2, _ = 0; _ < l; _++) n[a++] = e[o], n[a++] = e[o + 1], o += 2, h[a++] = i;
                this._vb.setNeedUpload(), this._ib.append(new Uint16Array(s)), this._ib.setNeedUpload(), this.vertNum += l, this.indexNum += s.length
            }
            releaseMesh() {
                this._vb.setByteLength(0), this._ib.setByteLength(0), this.vertNum = 0, this.indexNum = 0, Pt._POOL.push(this)
            }
            destroy() {
                this._ib.destroy(), this._vb.destroy(), this._ib.disposeResource(), this._vb.deleteBuffer()
            }
        }
        Pt.const_stride = 12, Pt._POOL = [];
        class Dt {
            constructor(t, e) {
                this.submitStartPos = 0, this.submitEndPos = 0, this.touches = [], this.submits = [], this.sprite = null, this.meshlist = [], this.cachedClipInfo = new f, this.oldTx = 0, this.oldTy = 0, this.invMat = new f, this.context = t, this.sprite = e, t._globalClipMatrix.copyTo(this.cachedClipInfo)
            }
            startRec() {
                let t = this.context;
                t._charSubmitCache && t._charSubmitCache._enable && (t._charSubmitCache.enable(!1, t), t._charSubmitCache.enable(!0, t)), t._incache = !0, this.touches.length = 0, t.touches = this.touches, t._globalClipMatrix.copyTo(this.cachedClipInfo), this.submits.length = 0, this.submitStartPos = t._submits._length;
                for (var e = 0, i = this.meshlist.length; e < i; e++) {
                    var s = this.meshlist[e];
                    s.canReuse ? s.releaseMesh() : s.destroy()
                }
                this.meshlist.length = 0, this._mesh = Mt.getAMesh(!1), this._pathMesh = Pt.getAMesh(!1), this._triangleMesh = It.getAMesh(!1), this.meshlist.push(this._mesh), this.meshlist.push(this._pathMesh), this.meshlist.push(this._triangleMesh), t._curSubmit = ft.RENDERBASE, this._oldMesh = t._mesh, this._oldPathMesh = t._pathMesh, this._oldTriMesh = t._triangleMesh, this._oldMeshList = t.meshlist, t._mesh = this._mesh, t._pathMesh = this._pathMesh, t._triangleMesh = this._triangleMesh, t.meshlist = this.meshlist, this.oldTx = t._curMat.tx, this.oldTy = t._curMat.ty, t._curMat.tx = 0, t._curMat.ty = 0, t._curMat.copyTo(this.invMat), this.invMat.invert()
            }
            endRec() {
                let t = this.context;
                t._charSubmitCache && t._charSubmitCache._enable && (t._charSubmitCache.enable(!1, t), t._charSubmitCache.enable(!0, t));
                var e = t._submits;
                this.submitEndPos = e._length;
                for (var i = this.submitEndPos - this.submitStartPos, s = 0; s < i; s++) this.submits.push(e[this.submitStartPos + s]);
                e._length -= i, t._mesh = this._oldMesh, t._pathMesh = this._oldPathMesh, t._triangleMesh = this._oldTriMesh, t.meshlist = this._oldMeshList, t._curSubmit = ft.RENDERBASE, t._curMat.tx = this.oldTx, t._curMat.ty = this.oldTy, t.touches = null, t._incache = !1
            }
            isCacheValid() {
                var t = this.context._globalClipMatrix;
                return t.a == this.cachedClipInfo.a && t.b == this.cachedClipInfo.b && t.c == this.cachedClipInfo.c && t.d == this.cachedClipInfo.d && t.tx == this.cachedClipInfo.tx && t.ty == this.cachedClipInfo.ty
            }
            flushsubmit() {
                var t = ft.RENDERBASE;
                this.submits.forEach(function(e) {
                    e != ft.RENDERBASE && (ft.preRender = t, t = e, e.renderSubmit())
                })
            }
            releaseMem() {}
        }
        Dt.matI = new f;
        var Lt = "/*\r\n\ttexture和fillrect使用的。\r\n*/\r\nattribute vec4 posuv;\r\nattribute vec4 attribColor;\r\nattribute vec4 attribFlags;\r\n//attribute vec4 clipDir;\r\n//attribute vec2 clipRect;\r\nuniform vec4 clipMatDir;\r\nuniform vec2 clipMatPos;\t\t// 这个是全局的，不用再应用矩阵了。\r\nvarying vec2 cliped;\r\nuniform vec2 size;\r\nuniform vec2 clipOff;\t\t\t// 使用要把clip偏移。cacheas normal用. 只用了[0]\r\n#ifdef WORLDMAT\r\n\tuniform mat4 mmat;\r\n#endif\r\n#ifdef MVP3D\r\n\tuniform mat4 u_MvpMatrix;\r\n#endif\r\nvarying vec4 v_texcoordAlpha;\r\nvarying vec4 v_color;\r\nvarying float v_useTex;\r\n\r\nvoid main() {\r\n\r\n\tvec4 pos = vec4(posuv.xy,0.,1.);\r\n#ifdef WORLDMAT\r\n\tpos=mmat*pos;\r\n#endif\r\n\tvec4 pos1  =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,0.,1.0);\r\n#ifdef MVP3D\r\n\tgl_Position=u_MvpMatrix*pos1;\r\n#else\r\n\tgl_Position=pos1;\r\n#endif\r\n\tv_texcoordAlpha.xy = posuv.zw;\r\n\t//v_texcoordAlpha.z = attribColor.a/255.0;\r\n\tv_color = attribColor/255.0;\r\n\tv_color.xyz*=v_color.w;//反正后面也要预乘\r\n\t\r\n\tv_useTex = attribFlags.r/255.0;\r\n\tfloat clipw = length(clipMatDir.xy);\r\n\tfloat cliph = length(clipMatDir.zw);\r\n\t\r\n\tvec2 clpos = clipMatPos.xy;\r\n\t#ifdef WORLDMAT\r\n\t\t// 如果有mmat，需要修改clipMatPos,因为 这是cacheas normal （如果不是就错了）， clipMatPos被去掉了偏移\r\n\t\tif(clipOff[0]>0.0){\r\n\t\t\tclpos.x+=mmat[3].x;\t//tx\t最简单处理\r\n\t\t\tclpos.y+=mmat[3].y;\t//ty\r\n\t\t}\r\n\t#endif\r\n\tvec2 clippos = pos.xy - clpos;\t//pos已经应用矩阵了，为了减的有意义，clip的位置也要缩放\r\n\tif(clipw>20000. && cliph>20000.)\r\n\t\tcliped = vec2(0.5,0.5);\r\n\telse {\r\n\t\t//转成0到1之间。/clipw/clipw 表示clippos与normalize之后的clip朝向点积之后，再除以clipw\r\n\t\tcliped=vec2( dot(clippos,clipMatDir.xy)/clipw/clipw, dot(clippos,clipMatDir.zw)/cliph/cliph);\r\n\t}\r\n\r\n}",
            Bt = "\n    /*    \n        texture和fillrect使用的。    \n    */    \n    #if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了    \n    precision highp float;    \n    #else    \n    precision mediump float;    \n    #endif    \n        \n    varying vec4 v_texcoordAlpha;    \n    varying vec4 v_color;    \n    varying float v_useTex;    \n    uniform sampler2D texture;    \n    varying vec2 cliped;    \n        \n    #ifdef BLUR_FILTER    \n    uniform vec4 strength_sig2_2sig2_gauss1;//TODO模糊的过程中会导致变暗变亮      \n    uniform vec2 blurInfo;   \n        \n    #define PI 3.141593    \n        \n    float getGaussian(float x, float y){    \n        return strength_sig2_2sig2_gauss1.w*exp(-(x*x+y*y)/strength_sig2_2sig2_gauss1.z);    \n    }    \n        \n    vec4 blur(){    \n        const float blurw = 9.0;    \n        vec4 vec4Color = vec4(0.0,0.0,0.0,0.0);    \n        vec2 halfsz=vec2(blurw,blurw)/2.0/blurInfo;        \n        vec2 startpos=v_texcoordAlpha.xy-halfsz;    \n        vec2 ctexcoord = startpos;    \n        vec2 step = 1.0/blurInfo;  //每个像素          \n            \n        for(float y = 0.0;y<=blurw; ++y){    \n            ctexcoord.x=startpos.x;    \n            for(float x = 0.0;x<=blurw; ++x){    \n                //TODO 纹理坐标的固定偏移应该在vs中处理    \n                vec4Color += texture2D(texture, ctexcoord)*getGaussian(x-blurw/2.0,y-blurw/2.0);    \n                ctexcoord.x+=step.x;    \n            }    \n            ctexcoord.y+=step.y;    \n        }    \n        //vec4Color.w=1.0;  这个会导致丢失alpha。以后有时间再找模糊会导致透明的问题    \n        return vec4Color;    \n    }    \n    #endif    \n        \n    #ifdef COLOR_FILTER    \n    uniform vec4 colorAlpha;    \n    uniform mat4 colorMat;    \n    #endif    \n        \n    #ifdef GLOW_FILTER    \n    uniform vec4 u_color;    \n    uniform vec4 u_blurInfo1;    \n    uniform vec4 u_blurInfo2;    \n    #endif    \n        \n    #ifdef COLOR_ADD    \n    uniform vec4 colorAdd;    \n    #endif   \n    \n    #ifdef MOSAIC_FILTER    \n    uniform float grid;    \n    #endif    \n    \n        \n    #ifdef FILLTEXTURE        \n    uniform vec4 u_TexRange;//startu,startv,urange, vrange    \n    #endif    \n    void main() {    \n        if(cliped.x<0.) discard;    \n        if(cliped.x>1.) discard;    \n        if(cliped.y<0.) discard;    \n        if(cliped.y>1.) discard;    \n            \n    #ifdef FILLTEXTURE        \n        vec4 color= texture2D(texture, fract(v_texcoordAlpha.xy)*u_TexRange.zw + u_TexRange.xy);    \n    #else    \n        vec4 color= texture2D(texture, v_texcoordAlpha.xy);   \n    #endif    \n    \n        \n    if(v_useTex<=0.)color = vec4(1.,1.,1.,1.);    \n    color.a*=v_color.w;    \n    //color.rgb*=v_color.w;    \n    color.rgb*=v_color.rgb;    \n\n    gl_FragColor=color;    \n        \n    #ifdef COLOR_ADD    \n        gl_FragColor = vec4(colorAdd.rgb,colorAdd.a*gl_FragColor.a);    \n        gl_FragColor.xyz *= colorAdd.a;    \n    #endif    \n        \n    #ifdef BLUR_FILTER    \n        gl_FragColor =   blur();    \n        gl_FragColor.w*=v_color.w;       \n    #endif    \n        \n    #ifdef COLOR_FILTER    \n        mat4 alphaMat =colorMat;    \n        \n        alphaMat[0][3] *= gl_FragColor.a;    \n        alphaMat[1][3] *= gl_FragColor.a;    \n        alphaMat[2][3] *= gl_FragColor.a;    \n        \n        gl_FragColor = gl_FragColor * alphaMat;    \n        gl_FragColor += colorAlpha/255.0*gl_FragColor.a;    \n    #endif    \n        \n    #ifdef GLOW_FILTER    \n        const float c_IterationTime = 10.0;    \n        float floatIterationTotalTime = c_IterationTime * c_IterationTime;    \n        vec4 vec4Color = vec4(0.0,0.0,0.0,0.0);    \n        vec2 vec2FilterDir = vec2(-(u_blurInfo1.z)/u_blurInfo2.x,-(u_blurInfo1.w)/u_blurInfo2.y);    \n        vec2 vec2FilterOff = vec2(u_blurInfo1.x/u_blurInfo2.x/c_IterationTime * 2.0,u_blurInfo1.y/u_blurInfo2.y/c_IterationTime * 2.0);    \n        float maxNum = u_blurInfo1.x * u_blurInfo1.y;    \n        vec2 vec2Off = vec2(0.0,0.0);    \n        float floatOff = c_IterationTime/2.0;    \n        for(float i = 0.0;i<=c_IterationTime; ++i){    \n            for(float j = 0.0;j<=c_IterationTime; ++j){    \n                vec2Off = vec2(vec2FilterOff.x * (i - floatOff),vec2FilterOff.y * (j - floatOff));    \n                vec4Color += texture2D(texture, v_texcoordAlpha.xy + vec2FilterDir + vec2Off)/floatIterationTotalTime;    \n            }    \n        }    \n        gl_FragColor = vec4(u_color.rgb,vec4Color.a * u_blurInfo2.z);    \n        gl_FragColor.rgb *= gl_FragColor.a;       \n    #endif    \n\n    // add by engine-group\n    // 马赛克效果\n    #ifdef MOSAIC_FILTER    \n        float clip = grid;\n        float x = floor(v_texcoordAlpha.x * clip);\n        float y = floor(v_texcoordAlpha.y * clip);\n        color= texture2D(texture, vec2(1.0 / clip * x, 1.0 / clip * y));  \n        gl_FragColor =  color;    \n        gl_FragColor.w*=v_color.w;   \n\n    #endif \n    // end add\n    }\n    \n    ",
            Ft = "attribute vec4 position;\r\nattribute vec4 attribColor;\r\n//attribute vec4 clipDir;\r\n//attribute vec2 clipRect;\r\nuniform vec4 clipMatDir;\r\nuniform vec2 clipMatPos;\r\n#ifdef WORLDMAT\r\n\tuniform mat4 mmat;\r\n#endif\r\nuniform mat4 u_mmat2;\r\n//uniform vec2 u_pos;\r\nuniform vec2 size;\r\nvarying vec4 color;\r\n//vec4 dirxy=vec4(0.9,0.1, -0.1,0.9);\r\n//vec4 clip=vec4(100.,30.,300.,600.);\r\nvarying vec2 cliped;\r\nvoid main(){\r\n\t\r\n#ifdef WORLDMAT\r\n\tvec4 pos=mmat*vec4(position.xy,0.,1.);\r\n\tgl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\r\n#else\r\n\tgl_Position =vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\r\n#endif\t\r\n\tfloat clipw = length(clipMatDir.xy);\r\n\tfloat cliph = length(clipMatDir.zw);\r\n\tvec2 clippos = position.xy - clipMatPos.xy;\t//pos已经应用矩阵了，为了减的有意义，clip的位置也要缩放\r\n\tif(clipw>20000. && cliph>20000.)\r\n\t\tcliped = vec2(0.5,0.5);\r\n\telse {\r\n\t\t//clipdir是带缩放的方向，由于上面clippos是在缩放后的空间计算的，所以需要把方向先normalize一下\r\n\t\tcliped=vec2( dot(clippos,clipMatDir.xy)/clipw/clipw, dot(clippos,clipMatDir.zw)/cliph/cliph);\r\n\t}\r\n  //pos2d.x = dot(clippos,dirx);\r\n  color=attribColor/255.;\r\n}",
            Ot = "precision mediump float;\r\n//precision mediump float;\r\nvarying vec4 color;\r\n//uniform float alpha;\r\nvarying vec2 cliped;\r\nvoid main(){\r\n\t//vec4 a=vec4(color.r, color.g, color.b, 1);\r\n\t//a.a*=alpha;\r\n    gl_FragColor= color;// vec4(color.r, color.g, color.b, alpha);\r\n\tgl_FragColor.rgb*=color.a;\r\n\tif(cliped.x<0.) discard;\r\n\tif(cliped.x>1.) discard;\r\n\tif(cliped.y<0.) discard;\r\n\tif(cliped.y>1.) discard;\r\n}",
            Nt = "attribute vec2 position;\r\nattribute vec2 texcoord;\r\nattribute vec4 color;\r\nuniform vec2 size;\r\nuniform float offsetX;\r\nuniform float offsetY;\r\nuniform mat4 mmat;\r\nuniform mat4 u_mmat2;\r\nvarying vec2 v_texcoord;\r\nvarying vec4 v_color;\r\nvoid main() {\r\n  vec4 pos=mmat*u_mmat2*vec4(offsetX+position.x,offsetY+position.y,0,1 );\r\n  gl_Position = vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\r\n  v_color = color;\r\n  v_color.rgb *= v_color.a;\r\n  v_texcoord = texcoord;  \r\n}",
            Ut = "precision mediump float;\r\nvarying vec2 v_texcoord;\r\nvarying vec4 v_color;\r\nuniform sampler2D texture;\r\nuniform float alpha;\r\nvoid main() {\r\n\tvec4 t_color = texture2D(texture, v_texcoord);\r\n\tgl_FragColor = t_color.rgba * v_color;\r\n\tgl_FragColor *= alpha;\r\n}";
        class Gt {
            constructor() {
                this.ALPHA = 1, this.defines = new H, this.shaderType = 0, this.fillStyle = ct.DEFAULT, this.strokeStyle = ct.DEFAULT
            }
            destroy() {
                this.defines = null, this.filters = null
            }
            static __init__() {
                j.preCompile2D(0, H.TEXTURE2D, Lt, Bt, null), j.preCompile2D(0, H.PRIMITIVE, Ft, Ot, null), j.preCompile2D(0, H.SKINMESH, Nt, Ut, null)
            }
        }
        class kt {
            constructor() {
                var t = T.instance;
                this.ib = bt.create(t.DYNAMIC_DRAW), this.vb = St.create(8)
            }
            static getInstance() {
                return kt.instance = kt.instance || new kt
            }
            addSkinMesh(t) {
                t.getData2(this.vb, this.ib, this.vb._byteLength / 32)
            }
            reset() {
                this.vb.clear(), this.ib.clear()
            }
        }
        class Wt {
            static createLine2(t, e, i, s, r, a) {
                if (t.length < 4) return null;
                var n = Wt.tempData.length > t.length + 2 ? Wt.tempData : new Array(t.length + 2);
                n[0] = t[0], n[1] = t[1];
                var h = 2,
                    o = 0,
                    l = t.length;
                for (o = 2; o < l; o += 2) Math.abs(t[o] - t[o - 2]) + Math.abs(t[o + 1] - t[o - 1]) > .01 && (n[h++] = t[o], n[h++] = t[o + 1]);
                a && Math.abs(t[0] - n[h - 2]) + Math.abs(t[1] - n[h - 1]) > .01 && (n[h++] = t[0], n[h++] = t[1]);
                var _ = r;
                l = h / 2;
                var u, c, d, p, f, m, g, T, v, x, y, E, A, C, R, b, S, w, M, I, P = i / 2;
                for (d = n[0], p = n[1], f = n[2], m = n[3], v = -(p - m), x = d - f, I = Math.sqrt(v * v + x * x), v = v / I * P, x = x / I * P, _.push(d - v, p - x, d + v, p + x), o = 1; o < l - 1; o++) d = n[2 * (o - 1)], p = n[2 * (o - 1) + 1], f = n[2 * o], m = n[2 * o + 1], g = n[2 * (o + 1)], T = n[2 * (o + 1) + 1], v = -(p - m), x = d - f, I = Math.sqrt(v * v + x * x), v = v / I * P, x = x / I * P, y = -(m - T), E = f - g, I = Math.sqrt(y * y + E * E), y = y / I * P, E = E / I * P, A = -x + p - (-x + m), C = -v + f - (-v + d), R = (-v + d) * (-x + m) - (-v + f) * (-x + p), b = -E + T - (-E + m), S = -y + f - (-y + g), w = (-y + g) * (-E + m) - (-y + f) * (-E + T), M = A * S - b * C, Math.abs(M) < .1 ? (M += 10.1, _.push(f - v, m - x, f + v, m + x)) : (u = (C * w - S * R) / M, c = (b * R - A * w) / M, _.push(u, c, f - (u - f), m - (c - m)));
                for (d = n[h - 4], p = n[h - 3], f = n[h - 2], m = n[h - 1], v = -(p - m), x = d - f, I = Math.sqrt(v * v + x * x), v = v / I * P, x = x / I * P, _.push(f - v, m - x, f + v, m + x), o = 1; o < l; o++) e.push(s + 2 * (o - 1), s + 2 * (o - 1) + 1, s + 2 * o + 1, s + 2 * o + 1, s + 2 * o, s + 2 * (o - 1));
                return _
            }
            static createLineTriangle(t, e, i, s, r, a, n) {
                var h = t.slice(),
                    o = h.length,
                    l = h[0],
                    _ = h[1],
                    u = h[2],
                    c = h[2],
                    d = 0,
                    p = 0,
                    f = 0,
                    m = 0,
                    g = o / 2;
                if (!(g <= 1) && 2 != g) {
                    for (var T = new Array(4 * g), v = 0, x = 0, y = 0; y < g - 1; y++) l = h[x++], _ = h[x++], u = h[x++], c = h[x++], f = u - l, m = c - _, 0 != f && 0 != m && (d = Math.sqrt(f * f + m * m), d > .001 && (p = 4 * v, T[p] = l, T[p + 1] = _, T[p + 2] = f / d, T[p + 3] = m / d, v++));
                    for (s ? (l = h[o - 2], _ = h[o - 1], u = h[0], c = h[1], f = u - l, m = c - _, 0 != f && 0 != m && (d = Math.sqrt(f * f + m * m), d > .001 && (p = 4 * v, T[p] = l, T[p + 1] = _, T[p + 2] = f / d, T[p + 3] = m / d, v++))) : (p = 4 * v, T[p] = l, T[p + 1] = _, T[p + 2] = f / d, T[p + 3] = m / d, v++), x = 0, y = 0; y < g; y++) l = h[x], _ = h[x + 1], u = h[x + 2], c = h[x + 3]
                }
            }
        }
        Wt.tempData = new Array(256);
        class Yt {
            constructor(t, e, i) {
                this.i = t, this.x = e, this.y = i, this.prev = null, this.next = null, this.z = null, this.prevZ = null, this.nextZ = null, this.steiner = !1
            }
        }
        class Vt {
            static earcut(t, e, i) {
                i = i || 2;
                var s, r, a, n, h, o, l, _ = e && e.length,
                    u = _ ? e[0] * i : t.length,
                    c = Vt.linkedList(t, 0, u, i, !0),
                    d = [];
                if (!c) return d;
                if (_ && (c = Vt.eliminateHoles(t, e, c, i)), t.length > 80 * i) {
                    s = a = t[0], r = n = t[1];
                    for (var p = i; p < u; p += i) h = t[p], o = t[p + 1], h < s && (s = h), o < r && (r = o), h > a && (a = h), o > n && (n = o);
                    l = Math.max(a - s, n - r), l = 0 !== l ? 1 / l : 0
                }
                return Vt.earcutLinked(c, d, i, s, r, l), d
            }
            static linkedList(t, e, i, s, r) {
                var a, n;
                if (r === Vt.signedArea(t, e, i, s) > 0)
                    for (a = e; a < i; a += s) n = Vt.insertNode(a, t[a], t[a + 1], n);
                else
                    for (a = i - s; a >= e; a -= s) n = Vt.insertNode(a, t[a], t[a + 1], n);
                return n && Vt.equals(n, n.next) && (Vt.removeNode(n), n = n.next), n
            }
            static filterPoints(t, e) {
                if (!t) return t;
                e || (e = t);
                var i, s = t;
                do {
                    if (i = !1, s.steiner || !Vt.equals(s, s.next) && 0 !== Vt.area(s.prev, s, s.next)) s = s.next;
                    else {
                        if (Vt.removeNode(s), s = e = s.prev, s === s.next) break;
                        i = !0
                    }
                } while (i || s !== e);
                return e
            }
            static earcutLinked(t, e, i, s, r, a, n = null) {
                if (t) {
                    !n && a && Vt.indexCurve(t, s, r, a);
                    for (var h, o, l = t; t.prev !== t.next;)
                        if (h = t.prev, o = t.next, a ? Vt.isEarHashed(t, s, r, a) : Vt.isEar(t)) e.push(h.i / i), e.push(t.i / i), e.push(o.i / i), Vt.removeNode(t), t = o.next, l = o.next;
                        else if (t = o, t === l) {
                        n ? 1 === n ? (t = Vt.cureLocalIntersections(t, e, i), Vt.earcutLinked(t, e, i, s, r, a, 2)) : 2 === n && Vt.splitEarcut(t, e, i, s, r, a) : Vt.earcutLinked(Vt.filterPoints(t, null), e, i, s, r, a, 1);
                        break
                    }
                }
            }
            static isEar(t) {
                var e = t.prev,
                    i = t,
                    s = t.next;
                if (Vt.area(e, i, s) >= 0) return !1;
                for (var r = t.next.next; r !== t.prev;) {
                    if (Vt.pointInTriangle(e.x, e.y, i.x, i.y, s.x, s.y, r.x, r.y) && Vt.area(r.prev, r, r.next) >= 0) return !1;
                    r = r.next
                }
                return !0
            }
            static isEarHashed(t, e, i, s) {
                var r = t.prev,
                    a = t,
                    n = t.next;
                if (Vt.area(r, a, n) >= 0) return !1;
                for (var h = r.x < a.x ? r.x < n.x ? r.x : n.x : a.x < n.x ? a.x : n.x, o = r.y < a.y ? r.y < n.y ? r.y : n.y : a.y < n.y ? a.y : n.y, l = r.x > a.x ? r.x > n.x ? r.x : n.x : a.x > n.x ? a.x : n.x, _ = r.y > a.y ? r.y > n.y ? r.y : n.y : a.y > n.y ? a.y : n.y, u = Vt.zOrder(h, o, e, i, s), c = Vt.zOrder(l, _, e, i, s), d = t.nextZ; d && d.z <= c;) {
                    if (d !== t.prev && d !== t.next && Vt.pointInTriangle(r.x, r.y, a.x, a.y, n.x, n.y, d.x, d.y) && Vt.area(d.prev, d, d.next) >= 0) return !1;
                    d = d.nextZ
                }
                for (d = t.prevZ; d && d.z >= u;) {
                    if (d !== t.prev && d !== t.next && Vt.pointInTriangle(r.x, r.y, a.x, a.y, n.x, n.y, d.x, d.y) && Vt.area(d.prev, d, d.next) >= 0) return !1;
                    d = d.prevZ
                }
                return !0
            }
            static cureLocalIntersections(t, e, i) {
                var s = t;
                do {
                    var r = s.prev,
                        a = s.next.next;
                    !Vt.equals(r, a) && Vt.intersects(r, s, s.next, a) && Vt.locallyInside(r, a) && Vt.locallyInside(a, r) && (e.push(r.i / i), e.push(s.i / i), e.push(a.i / i), Vt.removeNode(s), Vt.removeNode(s.next), s = t = a), s = s.next
                } while (s !== t);
                return s
            }
            static splitEarcut(t, e, i, s, r, a) {
                var n = t;
                do {
                    for (var h = n.next.next; h !== n.prev;) {
                        if (n.i !== h.i && Vt.isValidDiagonal(n, h)) {
                            var o = Vt.splitPolygon(n, h);
                            return n = Vt.filterPoints(n, n.next), o = Vt.filterPoints(o, o.next), Vt.earcutLinked(n, e, i, s, r, a), void Vt.earcutLinked(o, e, i, s, r, a)
                        }
                        h = h.next
                    }
                    n = n.next
                } while (n !== t)
            }
            static eliminateHoles(t, e, i, s) {
                var r, a, n, h, o, l = [];
                for (r = 0, a = e.length; r < a; r++) n = e[r] * s, h = r < a - 1 ? e[r + 1] * s : t.length, o = Vt.linkedList(t, n, h, s, !1), o === o.next && (o.steiner = !0), l.push(Vt.getLeftmost(o));
                for (l.sort(Vt.compareX), r = 0; r < l.length; r++) Vt.eliminateHole(l[r], i), i = Vt.filterPoints(i, i.next);
                return i
            }
            static compareX(t, e) {
                return t.x - e.x
            }
            static eliminateHole(t, e) {
                if (e = Vt.findHoleBridge(t, e), e) {
                    var i = Vt.splitPolygon(e, t);
                    Vt.filterPoints(i, i.next)
                }
            }
            static findHoleBridge(t, e) {
                var i, s = e,
                    r = t.x,
                    a = t.y,
                    n = -1 / 0;
                do {
                    if (a <= s.y && a >= s.next.y && s.next.y !== s.y) {
                        var h = s.x + (a - s.y) * (s.next.x - s.x) / (s.next.y - s.y);
                        if (h <= r && h > n) {
                            if (n = h, h === r) {
                                if (a === s.y) return s;
                                if (a === s.next.y) return s.next
                            }
                            i = s.x < s.next.x ? s : s.next
                        }
                    }
                    s = s.next
                } while (s !== e);
                if (!i) return null;
                if (r === n) return i.prev;
                var o, l = i,
                    _ = i.x,
                    u = i.y,
                    c = 1 / 0;
                for (s = i.next; s !== l;) r >= s.x && s.x >= _ && r !== s.x && Vt.pointInTriangle(a < u ? r : n, a, _, u, a < u ? n : r, a, s.x, s.y) && (o = Math.abs(a - s.y) / (r - s.x), (o < c || o === c && s.x > i.x) && Vt.locallyInside(s, t) && (i = s, c = o)), s = s.next;
                return i
            }
            static indexCurve(t, e, i, s) {
                var r = t;
                do {
                    null === r.z && (r.z = Vt.zOrder(r.x, r.y, e, i, s)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next
                } while (r !== t);
                r.prevZ.nextZ = null, r.prevZ = null, Vt.sortLinked(r)
            }
            static sortLinked(t) {
                var e, i, s, r, a, n, h, o, l = 1;
                do {
                    for (i = t, t = null, a = null, n = 0; i;) {
                        for (n++, s = i, h = 0, e = 0; e < l && (h++, s = s.nextZ, s); e++);
                        for (o = l; h > 0 || o > 0 && s;) 0 !== h && (0 === o || !s || i.z <= s.z) ? (r = i, i = i.nextZ, h--) : (r = s, s = s.nextZ, o--), a ? a.nextZ = r : t = r,
                            r.prevZ = a, a = r;
                        i = s
                    }
                    a.nextZ = null, l *= 2
                } while (n > 1);
                return t
            }
            static zOrder(t, e, i, s, r) {
                return t = 32767 * (t - i) * r, e = 32767 * (e - s) * r, t = 16711935 & (t | t << 8), t = 252645135 & (t | t << 4), t = 858993459 & (t | t << 2), t = 1431655765 & (t | t << 1), e = 16711935 & (e | e << 8), e = 252645135 & (e | e << 4), e = 858993459 & (e | e << 2), e = 1431655765 & (e | e << 1), t | e << 1
            }
            static getLeftmost(t) {
                var e = t,
                    i = t;
                do {
                    e.x < i.x && (i = e), e = e.next
                } while (e !== t);
                return i
            }
            static pointInTriangle(t, e, i, s, r, a, n, h) {
                return (r - n) * (e - h) - (t - n) * (a - h) >= 0 && (t - n) * (s - h) - (i - n) * (e - h) >= 0 && (i - n) * (a - h) - (r - n) * (s - h) >= 0
            }
            static isValidDiagonal(t, e) {
                return t.next.i !== e.i && t.prev.i !== e.i && !Vt.intersectsPolygon(t, e) && Vt.locallyInside(t, e) && Vt.locallyInside(e, t) && Vt.middleInside(t, e)
            }
            static area(t, e, i) {
                return (e.y - t.y) * (i.x - e.x) - (e.x - t.x) * (i.y - e.y)
            }
            static equals(t, e) {
                return t.x === e.x && t.y === e.y
            }
            static intersects(t, e, i, s) {
                return !!(Vt.equals(t, e) && Vt.equals(i, s) || Vt.equals(t, s) && Vt.equals(i, e)) || Vt.area(t, e, i) > 0 != Vt.area(t, e, s) > 0 && Vt.area(i, s, t) > 0 != Vt.area(i, s, e) > 0
            }
            static intersectsPolygon(t, e) {
                var i = t;
                do {
                    if (i.i !== t.i && i.next.i !== t.i && i.i !== e.i && i.next.i !== e.i && Vt.intersects(i, i.next, t, e)) return !0;
                    i = i.next
                } while (i !== t);
                return !1
            }
            static locallyInside(t, e) {
                return Vt.area(t.prev, t, t.next) < 0 ? Vt.area(t, e, t.next) >= 0 && Vt.area(t, t.prev, e) >= 0 : Vt.area(t, e, t.prev) < 0 || Vt.area(t, t.next, e) < 0
            }
            static middleInside(t, e) {
                var i = t,
                    s = !1,
                    r = (t.x + e.x) / 2,
                    a = (t.y + e.y) / 2;
                do {
                    i.y > a != i.next.y > a && i.next.y !== i.y && r < (i.next.x - i.x) * (a - i.y) / (i.next.y - i.y) + i.x && (s = !s), i = i.next
                } while (i !== t);
                return s
            }
            static splitPolygon(t, e) {
                var i = new Yt(t.i, t.x, t.y),
                    s = new Yt(e.i, e.x, e.y),
                    r = t.next,
                    a = e.prev;
                return t.next = e, e.prev = t, i.next = r, r.prev = i, s.next = i, i.prev = s, a.next = s, s.prev = a, s
            }
            static insertNode(t, e, i, s) {
                var r = new Yt(t, e, i);
                return s ? (r.next = s.next, r.prev = s, s.next.prev = r, s.next = r) : (r.prev = r, r.next = r), r
            }
            static removeNode(t) {
                t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), t.nextZ && (t.nextZ.prevZ = t.prevZ)
            }
            static signedArea(t, e, i, s) {
                for (var r = 0, a = e, n = i - s; a < i; a += s) r += (t[n] - t[a]) * (t[a + 1] + t[n + 1]), n = a;
                return r
            }
        }
        class Xt {}
        Xt.BYTES_PE = 4, Xt.BYTES_PIDX = 2, Xt.defaultMatrix4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], Xt.defaultMinusYMatrix4 = [1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], Xt.uniformMatrix3 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], Xt._TMPARRAY = [], Xt._OFFSETX = 0, Xt._OFFSETY = 0;
        class Ht extends ft {
            constructor(t = ft.TYPE_2D) {
                super(t)
            }
            renderSubmit() {
                if (0 === this._numEle || !this._mesh || 0 == this._numEle) return 1;
                var t = this.shaderValue.textureHost;
                if (t) {
                    var e = t._getSource();
                    if (!e) return 1;
                    this.shaderValue.texture = e
                }
                var i = S.mainContext;
                return this._mesh.useMesh(i), this.shaderValue.upload(), V.activeBlendFunction !== this._blendFn && (S.setBlend(i, !0), this._blendFn(i), V.activeBlendFunction = this._blendFn), i.drawElements(i.TRIANGLES, this._numEle, i.UNSIGNED_SHORT, this._startIdx), z.renderBatches++, z.trianglesFaces += this._numEle / 3, 1
            }
            releaseRender() {
                ft.RENDERBASE != this && --this._ref < 1 && (Ht.POOL[Ht._poolSize++] = this, this.shaderValue.release(), this.shaderValue = null, this._mesh = null, this._parent && (this._parent.releaseRender(), this._parent = null))
            }
            static create(t, e, i) {
                var s = Ht._poolSize ? Ht.POOL[--Ht._poolSize] : new Ht;
                s._ref = 1, s._mesh = e, s._key.clear(), s._startIdx = e.indexNum * Xt.BYTES_PIDX, s._numEle = 0;
                var r = t._nBlendType;
                s._blendFn = t._targets ? V.targetFns[r] : V.fns[r], s.shaderValue = i, s.shaderValue.setValue(t._shader2D);
                var a = t._shader2D.filters;
                return a && s.shaderValue.setFilters(a), s
            }
            static createShape(t, e, i, s) {
                var r = Ht._poolSize ? Ht.POOL[--Ht._poolSize] : new Ht;
                r._mesh = e, r._numEle = i, r._startIdx = 2 * e.indexNum, r._ref = 1, r.shaderValue = s, r.shaderValue.setValue(t._shader2D);
                var a = t._nBlendType;
                return r._key.blendShader = a, r._blendFn = t._targets ? V.targetFns[a] : V.fns[a], r
            }
        }
        Ht._poolSize = 0, Ht.POOL = [];
        class zt extends ft {
            constructor() {
                super(ft.TYPE_2D), this._matrix = new f, this._matrix4 = Xt.defaultMatrix4.concat(), this.shaderValue = new Z(0, 0)
            }
            static create(t, e, i) {
                var s = zt.POOL._length ? zt.POOL[--zt.POOL._length] : new zt;
                s.canv = t, s._ref = 1, s._numEle = 0;
                var r = s.shaderValue;
                return r.alpha = e, r.defines.setValue(0), i && i.length && r.setFilters(i), s
            }
            renderSubmit() {
                var t = k.worldAlpha,
                    e = k.worldMatrix4,
                    i = k.worldMatrix,
                    s = k.worldFilters,
                    r = k.worldShaderDefines,
                    a = this.shaderValue,
                    n = this._matrix,
                    h = this._matrix4,
                    o = f.TEMP;
                return f.mul(n, i, o), h[0] = o.a, h[1] = o.b, h[4] = o.c, h[5] = o.d, h[12] = o.tx, h[13] = o.ty, k.worldMatrix = o.clone(), k.worldMatrix4 = h, k.worldAlpha = k.worldAlpha * a.alpha, a.filters && a.filters.length && (k.worldFilters = a.filters, k.worldShaderDefines = a.defines), this.canv.flushsubmit(), k.worldAlpha = t, k.worldMatrix4 = e, k.worldMatrix.destroy(), k.worldMatrix = i, k.worldFilters = s, k.worldShaderDefines = r, 1
            }
            releaseRender() {
                if (--this._ref < 1) {
                    var t = zt.POOL;
                    this._mesh = null, t[t._length++] = this
                }
            }
            getRenderType() {
                return ft.TYPE_CANVAS
            }
        }
        zt.POOL = [], zt.POOL._length = 0;
        class Kt {
            constructor() {
                this.blendType = 0, this._ref = 1, this._key = new Q
            }
            renderSubmit() {
                var t = S.mainContext;
                this._mesh.useMesh(t);
                var e = this.srcRT;
                return e && (this.shaderValue.texture = e._getSource(), this.shaderValue.upload(), this.blend(), z.renderBatches++, z.trianglesFaces += this._numEle / 3, t.drawElements(t.TRIANGLES, this._numEle, t.UNSIGNED_SHORT, this._startIdx)), 1
            }
            blend() {
                if (V.activeBlendFunction !== V.fns[this.blendType]) {
                    var t = S.mainContext;
                    t.enable(t.BLEND), V.fns[this.blendType](t), V.activeBlendFunction = V.fns[this.blendType]
                }
            }
            getRenderType() {
                return 0
            }
            releaseRender() {
                if (--this._ref < 1) {
                    var t = Kt.POOL;
                    t[t._length++] = this
                }
            }
            static create(t, e, i, s) {
                var r = Kt.POOL._length ? Kt.POOL[--Kt.POOL._length] : new Kt;
                if (r._mesh = e, r.srcRT = s, r._startIdx = e.indexNum * Xt.BYTES_PIDX, r._ref = 1, r._key.clear(), r._numEle = 0, r.blendType = t._nBlendType, r._key.blendShader = r.blendType, r.shaderValue = i, r.shaderValue.setValue(t._shader2D), t._colorFiler) {
                    var a = t._colorFiler;
                    i.defines.add(a.type), i.colorMat = a._mat, i.colorAlpha = a._alpha
                }
                return r
            }
        }
        Kt.POOL = [], Kt.POOL._length = 0;
        class jt extends ft {
            constructor(t = ft.TYPE_2D) {
                super(t)
            }
            releaseRender() {
                --this._ref < 1 && (jt.POOL[jt._poolSize++] = this, this.shaderValue.release(), this._mesh = null, this._parent && (this._parent.releaseRender(), this._parent = null))
            }
            renderSubmit() {
                if (0 === this._numEle) return 1;
                var t = this.shaderValue.textureHost;
                if (t) {
                    var e = t ? t._getSource() : null;
                    if (!e) return 1
                }
                var i = S.mainContext;
                this._mesh.useMesh(i);
                var s = ft.preRender,
                    r = ft.preRender._key;
                return 0 === this._key.blendShader && this._key.submitType === r.submitType && this._key.blendShader === r.blendShader && G.activeShader && ft.preRender.clipInfoID == this.clipInfoID && s.shaderValue.defines._value === this.shaderValue.defines._value && 0 == (this.shaderValue.defines._value & H.NOOPTMASK) ? G.activeShader.uploadTexture2D(e) : (V.activeBlendFunction !== this._blendFn && (S.setBlend(i, !0), this._blendFn(i), V.activeBlendFunction = this._blendFn), this.shaderValue.texture = e, this.shaderValue.upload()), i.drawElements(i.TRIANGLES, this._numEle, i.UNSIGNED_SHORT, this._startIdx), z.renderBatches++, z.trianglesFaces += this._numEle / 3, 1
            }
            static create(t, e, i) {
                var s = jt._poolSize ? jt.POOL[--jt._poolSize] : new jt(ft.TYPE_TEXTURE);
                s._mesh = e, s._key.clear(), s._key.submitType = ft.KEY_DRAWTEXTURE, s._ref = 1, s._startIdx = e.indexNum * Xt.BYTES_PIDX, s._numEle = 0;
                var r = t._nBlendType;
                if (s._key.blendShader = r, s._blendFn = t._targets ? V.targetFns[r] : V.fns[r], s.shaderValue = i, t._colorFiler) {
                    var a = t._colorFiler;
                    i.defines.add(a.type), i.colorMat = a._mat, i.colorAlpha = a._alpha
                }
                return s
            }
        }
        jt._poolSize = 0, jt.POOL = [];
        class qt {
            constructor() {
                this._data = [], this._ndata = 0, this._clipid = -1, this._clipMatrix = new f, this._enable = !1
            }
            clear() {
                this._tex = null, this._imgId = -1, this._ndata = 0, this._enable = !1, this._colorFiler = null
            }
            destroy() {
                this.clear(), this._data.length = 0, this._data = null
            }
            add(t, e, i, s, r, a) {
                this._ndata > 0 && (this._tex != e || this._imgId != i || this._clipid >= 0 && this._clipid != t._clipInfoID) && this.submit(t), this._clipid = t._clipInfoID, t._globalClipMatrix.copyTo(this._clipMatrix), this._tex = e, this._imgId = i, this._colorFiler = t._colorFiler, this._data[this._ndata] = s, this._data[this._ndata + 1] = r, this._data[this._ndata + 2] = a, this._ndata += 3
            }
            getPos() {
                return 0 == qt.__nPosPool ? new Array(8) : qt.__posPool[--qt.__nPosPool]
            }
            enable(t, e) {
                t !== this._enable && (this._enable = t, this._enable || this.submit(e))
            }
            submit(t) {
                var e = this._ndata;
                if (e) {
                    var i = t._mesh,
                        s = t._colorFiler;
                    t._colorFiler = this._colorFiler;
                    var r = jt.create(t, i, Z.create(H.TEXTURE2D, 0));
                    t._submits[t._submits._length++] = t._curSubmit = r, r.shaderValue.textureHost = this._tex, r._key.other = this._imgId, t._colorFiler = s, t._copyClipInfo(r, this._clipMatrix), r.clipInfoID = this._clipid;
                    for (var a = 0; a < e; a += 3) i.addQuad(this._data[a], this._data[a + 1], this._data[a + 2], !0), qt.__posPool[qt.__nPosPool++] = this._data[a];
                    e /= 3, r._numEle += 6 * e, i.indexNum += 6 * e, i.vertNum += 4 * e, t._drawCount += e, this._ndata = 0, Ct.loopCount % 100 == 0 && (this._data.length = 0)
                }
            }
        }
        qt.__posPool = [], qt.__nPosPool = 0;
        class Zt {
            constructor(t = 0, e = 0, i = 0) {
                this.atlasID = 0, this._width = 0, this._height = 0, this._texCount = 0, this._rowInfo = null, this._cells = null, this._used = 0, this._cells = null, this._rowInfo = null, this.atlasID = i, this._init(t, e)
            }
            addRect(t, e, i, s) {
                return !!this._get(e, i, s) && (this._fill(s.x, s.y, e, i, t), this._texCount++, !0)
            }
            _release() {
                this._cells = null, this._rowInfo = null
            }
            _init(t, e) {
                return this._width = t, this._height = e, this._release(), 0 != this._width && (this._cells = new Uint8Array(this._width * this._height * 3), this._rowInfo = new Uint8Array(this._height), this._used = 0, this._clear(), !0)
            }
            _get(t, e, i) {
                if (t > this._width || e > this._height) return !1;
                for (var s = -1, r = -1, a = this._width, n = this._height, h = this._cells, o = 0; o < n; o++)
                    if (!(this._rowInfo[o] < t))
                        for (var l = 0; l < a;) {
                            var _ = 3 * (o * a + l);
                            if (0 != h[_] || h[_ + 1] < t || h[_ + 2] < e) l += h[_ + 1];
                            else {
                                s = l, r = o;
                                for (var u = 0; u < t; u++)
                                    if (h[3 * u + _ + 2] < e) {
                                        s = -1;
                                        break
                                    }
                                if (!(s < 0)) return i.x = s, i.y = r, !0;
                                l += h[_ + 1]
                            }
                        }
                    return !1
            }
            _fill(t, e, i, s, r) {
                var a = this._width,
                    n = this._height;
                this._check(t + i <= a && e + s <= n);
                for (var h = e; h < s + e; ++h) {
                    this._check(this._rowInfo[h] >= i), this._rowInfo[h] -= i;
                    for (var o = 0; o < i; o++) {
                        var l = 3 * (t + h * a + o);
                        this._check(0 == this._cells[l]), this._cells[l] = r, this._cells[l + 1] = i, this._cells[l + 2] = s
                    }
                }
                if (t > 0)
                    for (h = 0; h < s; ++h) {
                        var _ = 0;
                        for (o = t - 1; o >= 0 && 0 == this._cells[3 * ((e + h) * a + o)]; --o, ++_);
                        for (o = _; o > 0; --o) this._cells[3 * ((e + h) * a + t - o) + 1] = o, this._check(o > 0)
                    }
                if (e > 0)
                    for (o = t; o < t + i; ++o) {
                        for (_ = 0, h = e - 1; h >= 0 && 0 == this._cells[3 * (o + h * a)]; --h, _++);
                        for (h = _; h > 0; --h) this._cells[3 * (o + (e - h) * a) + 2] = h, this._check(h > 0)
                    }
                this._used += i * s / (this._width * this._height)
            }
            _check(t) {
                0 == t && console.log("xtexMerger 错误啦")
            }
            _clear() {
                this._texCount = 0;
                for (var t = 0; t < this._height; t++) this._rowInfo[t] = this._width;
                for (var e = 0; e < this._height; e++)
                    for (var i = 0; i < this._width; i++) {
                        var s = 3 * (e * this._width + i);
                        this._cells[s] = 0, this._cells[s + 1] = this._width - i, this._cells[s + 2] = this._width - e
                    }
            }
        }
        class Qt extends D {
            constructor(t, e) {
                super(), this._texW = 0, this._texH = 0, this.__destroyed = !1, this._discardTm = 0, this.genID = 0, this.bitmap = {
                    id: 0,
                    _glTexture: null
                }, this.curUsedCovRate = 0, this.curUsedCovRateAtlas = 0, this.lastTouchTm = 0, this.ri = null, this._texW = t || Qt.gTextRender.atlasWidth, this._texH = e || Qt.gTextRender.atlasWidth, this.bitmap.id = this.id, this.lock = !0
            }
            recreateResource() {
                if (!this._source) {
                    var t = T.instance,
                        e = this._source = t.createTexture();
                    this.bitmap._glTexture = e, S.bindTexture(t, t.TEXTURE_2D, e), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this._texW, this._texH, 0, t.RGBA, t.UNSIGNED_BYTE, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), Qt.gTextRender.debugUV && this.fillWhite()
                }
            }
            addChar(t, e, i, r = null) {
                if (Qt.gTextRender.isWan1Wan) return this.addCharCanvas(t, e, i, r);
                !this._source && this.recreateResource();
                var a = T.instance;
                S.bindTexture(a, a.TEXTURE_2D, this._source), !s.Render.isConchApp && a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
                var n, h, o, l, _ = t.data;
                return t.data instanceof Uint8ClampedArray && (_ = new Uint8Array(_.buffer)), a.texSubImage2D(a.TEXTURE_2D, 0, e, i, t.width, t.height, a.RGBA, a.UNSIGNED_BYTE, _), !s.Render.isConchApp && a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), n = e / this._texW, h = i / this._texH, o = (e + t.width) / this._texW, l = (i + t.height) / this._texH, r = r || new Array(8), r[0] = n, r[1] = h, r[2] = o, r[3] = h, r[4] = o, r[5] = l, r[6] = n, r[7] = l, r
            }
            addCharCanvas(t, e, i, r = null) {
                !this._source && this.recreateResource();
                var a, n, h, o, l = T.instance;
                return S.bindTexture(l, l.TEXTURE_2D, this._source), !s.Render.isConchApp && l.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), l.texSubImage2D(l.TEXTURE_2D, 0, e, i, l.RGBA, l.UNSIGNED_BYTE, t), !s.Render.isConchApp && l.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.Render.isConchApp ? (a = e / this._texW, n = i / this._texH, h = (e + t.width) / this._texW, o = (i + t.height) / this._texH) : (a = (e + 1) / this._texW, n = (i + 1) / this._texH, h = (e + t.width - 1) / this._texW, o = (i + t.height - 1) / this._texH), r = r || new Array(8), r[0] = a, r[1] = n, r[2] = h, r[3] = n, r[4] = h, r[5] = o, r[6] = a, r[7] = o, r
            }
            fillWhite() {
                !this._source && this.recreateResource();
                var t = T.instance,
                    e = new Uint8Array(this._texW * this._texH * 4);
                e.fill(255), t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this._texW, this._texH, t.RGBA, t.UNSIGNED_BYTE, e)
            }
            discard() {
                s.stage.setGlobalRepaint(), this.destroy()
            }
            static getTextTexture(t, e) {
                return new Qt(t, e)
            }
            destroy() {
                this.__destroyed = !0;
                var t = T.instance;
                this._source && t.deleteTexture(this._source), this._source = null
            }
            static clean() {
                var t = Ct.loopStTm;
                if (0 === Qt.cleanTm && (Qt.cleanTm = t), t - Qt.cleanTm >= Qt.gTextRender.checkCleanTextureDt) {
                    for (var e = 0; e < Qt.poolLen; e++) {
                        var i = Qt.pool[e];
                        t - i._discardTm >= Qt.gTextRender.destroyUnusedTextureDt && (i.destroy(), Qt.pool[e] = Qt.pool[Qt.poolLen - 1], Qt.poolLen--, e--)
                    }
                    Qt.cleanTm = t
                }
            }
            touchRect(t, e) {
                this.lastTouchTm != e && (this.curUsedCovRate = 0, this.curUsedCovRateAtlas = 0, this.lastTouchTm = e);
                var i = Qt.gTextRender.atlasWidth * Qt.gTextRender.atlasWidth,
                    r = s.TextAtlas.atlasGridW * s.TextAtlas.atlasGridW;
                this.curUsedCovRate += t.bmpWidth * t.bmpHeight / i, this.curUsedCovRateAtlas += Math.ceil(t.bmpWidth / s.TextAtlas.atlasGridW) * Math.ceil(t.bmpHeight / s.TextAtlas.atlasGridW) / (i / r)
            }
            get texture() {
                return this
            }
            _getSource() {
                return this._source
            }
            drawOnScreen(t, e) {}
        }
        Qt.gTextRender = null, Qt.pool = new Array(10), Qt.poolLen = 0, Qt.cleanTm = 0;
        class $t {
            constructor() {
                this.texWidth = 1024, this.texHeight = 1024, this.texture = null, this.charMaps = {}, this.texHeight = this.texWidth = s.TextRender.atlasWidth, this.texture = Qt.getTextTexture(this.texWidth, this.texHeight), this.texWidth / $t.atlasGridW > 256 && ($t.atlasGridW = Math.ceil(this.texWidth / 256)), this.atlasgrid = new Zt(this.texWidth / $t.atlasGridW, this.texHeight / $t.atlasGridW, this.texture.id)
            }
            setProtecteDist(t) {}
            getAEmpty(t, e, i) {
                var s = this.atlasgrid.addRect(1, Math.ceil(t / $t.atlasGridW), Math.ceil(e / $t.atlasGridW), i);
                return s && (i.x *= $t.atlasGridW, i.y *= $t.atlasGridW), s
            }
            get usedRate() {
                return this.atlasgrid._used
            }
            destroy() {
                for (var t in this.charMaps) {
                    var e = this.charMaps[t];
                    e.deleted = !0
                }
                this.texture.discard()
            }
            printDebugInfo() {}
        }
        $t.atlasGridW = 16;
        class Jt {
            setTo(t, e, i) {
                return this.type = t, this.currentTarget = e, this.target = i, this
            }
            stopPropagation() {
                this._stoped = !0
            }
            get touches() {
                if (!this.nativeEvent) return null;
                var t = this.nativeEvent.touches;
                if (t)
                    for (var e = s.stage, i = 0, r = t.length; i < r; i++) {
                        var a = t[i],
                            n = m.TEMP;
                        n.setTo(a.clientX, a.clientY), e._canvasTransform.invertTransformPoint(n), e.transform.invertTransformPoint(n), a.stageX = n.x, a.stageY = n.y
                    }
                return t
            }
            get altKey() {
                return this.nativeEvent.altKey
            }
            get ctrlKey() {
                return this.nativeEvent.ctrlKey
            }
            get shiftKey() {
                return this.nativeEvent.shiftKey
            }
            get charCode() {
                return this.nativeEvent.charCode
            }
            get keyLocation() {
                return this.nativeEvent.location || this.nativeEvent.keyLocation
            }
            get stageX() {
                return s.stage.mouseX
            }
            get stageY() {
                return s.stage.mouseY
            }
        }
        Jt.EMPTY = new Jt, Jt.MOUSE_DOWN = "mousedown", Jt.MOUSE_UP = "mouseup", Jt.CLICK = "click", Jt.RIGHT_MOUSE_DOWN = "rightmousedown", Jt.RIGHT_MOUSE_UP = "rightmouseup", Jt.RIGHT_CLICK = "rightclick", Jt.MOUSE_MOVE = "mousemove", Jt.MOUSE_OVER = "mouseover", Jt.MOUSE_OUT = "mouseout", Jt.MOUSE_WHEEL = "mousewheel", Jt.ROLL_OVER = "mouseover", Jt.ROLL_OUT = "mouseout", Jt.DOUBLE_CLICK = "doubleclick", Jt.CHANGE = "change", Jt.CHANGED = "changed", Jt.RESIZE = "resize", Jt.ADDED = "added", Jt.REMOVED = "removed", Jt.ACTIVED = "actived", Jt.DISPLAY = "display", Jt.UNDISPLAY = "undisplay", Jt.ERROR = "error", Jt.COMPLETE = "complete", Jt.LOADED = "loaded", Jt.READY = "ready", Jt.PROGRESS = "progress", Jt.INPUT = "input", Jt.RENDER = "render", Jt.OPEN = "open", Jt.MESSAGE = "message", Jt.CLOSE = "close", Jt.KEY_DOWN = "keydown", Jt.KEY_PRESS = "keypress", Jt.KEY_UP = "keyup", Jt.FRAME = "enterframe", Jt.DRAG_START = "dragstart", Jt.DRAG_MOVE = "dragmove", Jt.DRAG_END = "dragend", Jt.ENTER = "enter", Jt.SELECT = "select", Jt.BLUR = "blur", Jt.FOCUS = "focus", Jt.VISIBILITY_CHANGE = "visibilitychange", Jt.FOCUS_CHANGE = "focuschange", Jt.PLAYED = "played", Jt.PAUSED = "paused", Jt.STOPPED = "stopped", Jt.START = "start", Jt.END = "end", Jt.COMPONENT_ADDED = "componentadded", Jt.COMPONENT_REMOVED = "componentremoved", Jt.RELEASED = "released", Jt.LINK = "link", Jt.LABEL = "label", Jt.FULL_SCREEN_CHANGE = "fullscreenchange", Jt.DEVICE_LOST = "devicelost", Jt.TRANSFORM_CHANGED = "transformchanged", Jt.ANIMATION_CHANGED = "animationchanged", Jt.TRAIL_FILTER_CHANGE = "trailfilterchange", Jt.TRIGGER_ENTER = "triggerenter", Jt.TRIGGER_STAY = "triggerstay", Jt.TRIGGER_EXIT = "triggerexit", Jt.BEFORE_UPDATE = "beforeupdate", Jt.AFTER_UPDATE = "afterupdate", Jt.POSITION_CHANGED = "positionchanged", Jt.LIST_ITEMS_CHANGED = "listitemschanged", Jt.STAGE_MOUSEDOWN = "stagemousedown", Jt.DESTORYED = "destroyed", Jt.VISIBLE = "visible";
        class te extends M {
            constructor(t = null, e = null, i = 0, s = 0) {
                super(), this.uvrect = [0, 0, 1, 1], this._destroyed = !1, this._referenceCount = 0, this.$_GID = 0, this.offsetX = 0, this.offsetY = 0, this._w = 0, this._h = 0, this.sourceWidth = 0, this.sourceHeight = 0, this.url = null, this.scaleRate = 1, this.setTo(t, e, i, s)
            }
            static moveUV(t, e, i) {
                for (var s = 0; s < 8; s += 2) i[s] += t, i[s + 1] += e;
                return i
            }
            static create(t, e, i, s, r, a = 0, n = 0, h = 0, o = 0) {
                return te._create(t, e, i, s, r, a, n, h, o)
            }
            static _create(t, e, i, s, r, a = 0, n = 0, h = 0, o = 0, l = null) {
                var _, u = t instanceof te,
                    c = u ? t.uv : te.DEF_UV,
                    d = u ? t.bitmap : t;
                d.width && e + s > d.width && (s = d.width - e), d.height && i + r > d.height && (r = d.height - i), l ? (_ = l, _.setTo(d, null, h || s, o || r)) : _ = new te(d, null, h || s, o || r), _.width = s, _.height = r, _.offsetX = a, _.offsetY = n;
                var p = 1 / d.width,
                    f = 1 / d.height;
                e *= p, i *= f, s *= p, r *= f;
                var m = _.uv[0],
                    g = _.uv[1],
                    T = _.uv[4],
                    v = _.uv[5],
                    x = T - m,
                    y = v - g,
                    E = te.moveUV(c[0], c[1], [e, i, e + s, i, e + s, i + r, e, i + r]);
                _.uv = new Float32Array([m + E[0] * x, g + E[1] * y, T - (1 - E[2]) * x, g + E[3] * y, T - (1 - E[4]) * x, v - (1 - E[5]) * y, m + E[6] * x, v - (1 - E[7]) * y]);
                var A = d.scaleRate;
                return A && 1 != A ? (_.sourceWidth /= A, _.sourceHeight /= A, _.width /= A, _.height /= A, _.scaleRate = A, _.offsetX /= A, _.offsetY /= A) : _.scaleRate = 1, _
            }
            static createFromTexture(t, e, i, s, r) {
                var a = t.scaleRate;
                1 != a && (e *= a, i *= a, s *= a, r *= a);
                var n = g.TEMP.setTo(e - t.offsetX, i - t.offsetY, s, r),
                    h = n.intersection(te._rect1.setTo(0, 0, t.width, t.height), te._rect2);
                if (!h) return null;
                var o = te.create(t, h.x, h.y, h.width, h.height, h.x - n.x, h.y - n.y, s, r);
                return o
            }
            get uv() {
                return this._uv
            }
            set uv(t) {
                this.uvrect[0] = Math.min(t[0], t[2], t[4], t[6]), this.uvrect[1] = Math.min(t[1], t[3], t[5], t[7]), this.uvrect[2] = Math.max(t[0], t[2], t[4], t[6]) - this.uvrect[0], this.uvrect[3] = Math.max(t[1], t[3], t[5], t[7]) - this.uvrect[1], this._uv = t
            }
            get width() {
                return this._w ? this._w : this.bitmap ? this.uv && this.uv !== te.DEF_UV ? (this.uv[2] - this.uv[0]) * this.bitmap.width : this.bitmap.width : 0
            }
            set width(t) {
                this._w = t, this.sourceWidth || (this.sourceWidth = t)
            }
            get height() {
                return this._h ? this._h : this.bitmap ? this.uv && this.uv !== te.DEF_UV ? (this.uv[5] - this.uv[1]) * this.bitmap.height : this.bitmap.height : 0
            }
            set height(t) {
                this._h = t, this.sourceHeight || (this.sourceHeight = t)
            }
            get bitmap() {
                return this._bitmap
            }
            set bitmap(t) {
                this._bitmap && this._bitmap._removeReference(this._referenceCount), this._bitmap = t, t && t._addReference(this._referenceCount)
            }
            get destroyed() {
                return this._destroyed
            }
            _addReference() {
                this._bitmap && this._bitmap._addReference(), this._referenceCount++
            }
            _removeReference() {
                this._bitmap && this._bitmap._removeReference(), this._referenceCount--
            }
            _getSource(t = null) {
                return this._destroyed || !this._bitmap ? null : (this.recoverBitmap(t), this._bitmap.destroyed ? null : this.bitmap._getSource())
            }
            _onLoaded(t, e) {
                if (e)
                    if (e == this);
                    else if (e instanceof te) {
                    var i = e;
                    te._create(e, 0, 0, i.width, i.height, 0, 0, i.sourceWidth, i.sourceHeight, this)
                } else this.bitmap = e, this.sourceWidth = this._w = e.width, this.sourceHeight = this._h = e.height;
                else;
                t && t.run(), this.event(Jt.READY, this)
            }
            getIsReady() {
                return !this._destroyed && !!this._bitmap
            }
            setTo(t = null, e = null, i = 0, s = 0) {
                this.bitmap = t, this.sourceWidth = i, this.sourceHeight = s, t && (this._w = t.width, this._h = t.height, this.sourceWidth = this.sourceWidth || t.width, this.sourceHeight = this.sourceHeight || t.height), this.uv = e || te.DEF_UV
            }
            load(t, e = null) {
                this._destroyed || s.loader.load(t, w.create(this, this._onLoaded, [e]), null, "htmlimage", 1, !0)
            }
            getTexturePixels(t, e, i, r) {
                var a, n, h, o = this.bitmap,
                    l = this._w,
                    _ = this._h,
                    u = this.sourceWidth,
                    c = this.sourceHeight,
                    d = o.width,
                    p = o.height,
                    f = this.offsetX,
                    m = this.offsetY;
                let g = i,
                    T = r;
                if (t + i > l + f && (g -= t + i - l - f), t + i > u && (i -= t + i - u), e + r > _ + m && (T -= e + r - _ - m), e + r > c && (r -= e + r - c), i <= 0 || r <= 0) return null;
                let v = f > t ? f - t : 0,
                    x = m > e ? m - e : 0,
                    y = t > f ? t - f : 0,
                    E = e > m ? e - m : 0;
                g -= v, T -= x;
                var A = 4 * i,
                    C = null;
                try {
                    C = o.getPixels()
                } catch (t) {}
                if (C) {
                    if (0 == t && 0 == e && i == d && r == p) return C;
                    let s = this._uv.slice(),
                        o = Math.round(s[0] * d),
                        l = Math.round(s[1] * p);
                    var R = new Uint8Array(i * r * 4);
                    for (A = 4 * d, n = (l + E) * A, a = 4 * o + 4 * y + n, h = 0; h < T; h++) R.set(C.slice(a, a + 4 * g), 4 * i * (h + x) + 4 * v), a += A;
                    return R
                }
                var b = new s.Context;
                b.size(i, r), b.asBitmap = !0;
                var S = null;
                if (0 != t || 0 != e || i != d || r != p) {
                    S = this._uv.slice();
                    var w = S[0],
                        M = S[1],
                        I = S[2] - w,
                        P = S[7] - M,
                        D = I / l,
                        L = P / _;
                    S = [w + y * D, M + E * L, w + (y + g) * D, M + E * L, w + (y + g) * D, M + (E + T) * L, w + y * D, M + (E + T) * L]
                }
                b._drawTextureM(this, v, x, g, T, null, 1, S), b._targets.start(), b.flush(), b._targets.end(), b._targets.restore();
                var B = b._targets.getData(0, 0, i, r);
                for (b.destroy(), R = new Uint8Array(i * r * 4), a = 0, n = (r - 1) * A, h = r - 1; h >= 0; h--) R.set(B.slice(n, n + A), a), a += A, n -= A;
                return R
            }
            getPixels(t, e, i, s) {
                return this.getTexturePixels(t, e, i, s)
            }
            recoverBitmap(t = null) {
                var e = this._bitmap.url;
                if (!this._destroyed && (!this._bitmap || this._bitmap.destroyed) && e) {
                    let i = s.Loader.loadedMap[e];
                    i ? (this.bitmap = i, t && t()) : s.loader.load(e, w.create(this, e => {
                        this.bitmap = e, t && t()
                    }), null, "htmlimage", 1, !0)
                }
            }
            disposeBitmap() {
                !this._destroyed && this._bitmap && this._bitmap.destroy()
            }
            destroy(t = !1) {
                if (!this._destroyed) {
                    this._destroyed = !0;
                    var e = this._bitmap;
                    e && (e._removeReference(this._referenceCount), (0 === e.referenceCount || t) && e.destroy(), e = null), this.url && this === s.loader.getRes(this.url) && s.Loader.clearRes(this.url)
                }
            }
        }
        te.DEF_UV = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), te.NO_UV = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]), te.INV_UV = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), te._rect1 = new g, te._rect2 = new g;
        class ee {
            constructor(t) {
                this._font = "14px Arial", this._family = "Arial", this._size = 14, this._italic = !1, this._bold = !1, this._id = ee._gfontID++, this.setFont(t || this._font)
            }
            static Parse(t) {
                if (t === ee._lastFont) return ee._lastFontInfo;
                var e = ee._cache[t];
                return e || (e = ee._cache[t] = new ee(t)), ee._lastFont = t, ee._lastFontInfo = e, e
            }
            setFont(t) {
                this._font = t;
                var e = t.split(" "),
                    i = e.length;
                if (i < 2) 1 == i && e[0].indexOf("px") > 0 && (this._size = parseInt(e[0]));
                else {
                    for (var s = -1, r = 0; r < i; r++)
                        if (e[r].indexOf("px") > 0 || e[r].indexOf("pt") > 0) {
                            s = r, this._size = parseInt(e[r]), this._size <= 0 && (console.error("font parse error:" + t), this._size = 14);
                            break
                        }
                    var a = s + 1,
                        n = e[a];
                    for (a++; a < i; a++) n += " " + e[a];
                    this._family = n.split(",")[0], this._italic = e.indexOf("italic") >= 0, this._bold = e.indexOf("bold") >= 0
                }
            }
        }
        ee.EMPTY = new ee(null), ee._cache = {}, ee._gfontID = 0, ee._lastFont = "";
        class ie {
            constructor() {
                this.save = [], this.toUpperCase = null, this.width = -1, this.pageChars = [], this.startID = 0, this.startIDStroke = 0, this.lastGCCnt = 0, this.splitRender = !1, this.scalex = 1, this.scaley = 1
            }
            setText(t) {
                this.changed = !0, this._text = t, this.width = -1, this.cleanCache()
            }
            toString() {
                return this._text
            }
            get length() {
                return this._text ? this._text.length : 0
            }
            charCodeAt(t) {
                return this._text ? this._text.charCodeAt(t) : NaN
            }
            charAt(t) {
                return this._text ? this._text.charAt(t) : null
            }
            cleanCache() {
                let t = this.pageChars;
                for (var e of t) {
                    var i = e.tex,
                        s = e.words;
                    1 == s.length && i && i.ri && i.destroy()
                }
                this.pageChars = [], this.startID = 0, this.scalex = 1, this.scaley = 1
            }
        }
        class se {
            constructor() {
                this.char = "", this.deleted = !1, this.uv = new Array(8), this.pos = 0, this.orix = 0, this.oriy = 0, this.touchTick = 0, this.isSpace = !1
            }
            touch() {
                var t = Ct.loopCount;
                this.touchTick != t && this.tex.touchRect(this, t), this.touchTick = t
            }
        }
        class re {
            constructor() {
                this.fontsz = 16
            }
            getWidth(t, e) {
                return 0
            }
            scale(t, e) {}
            get canvasWidth() {
                return 0
            }
            set canvasWidth(t) {}
            getCharBmp(t, e, i, s, r, a, n, h, o, l, _ = null) {
                return null
            }
        }
        class ae {
            static __init__() {
                var t = window.Laya || s.Laya;
                if (ae._window) return ae._window;
                var e = ae._window = window,
                    i = ae._document = e.document,
                    r = ae.userAgent = e.navigator.userAgent,
                    a = e.navigator.maxTouchPoints || 0,
                    n = e.navigator.platform;
                "my" in ae.window && (r.indexOf("TB/") > -1 || r.indexOf("Taobao/") > -1 || r.indexOf("TM/") > -1 ? (window.tbMiniGame(t, t), t.TBMiniAdapter ? t.TBMiniAdapter.enable() : console.error("请先添加淘宝适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-6-0")) : r.indexOf("AlipayMiniGame") > -1 && (window.aliPayMiniGame(t, t), t.ALIMiniAdapter ? t.ALIMiniAdapter.enable() : console.error("请先添加阿里小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-6-0"))), -1 == r.indexOf("OPPO") && r.indexOf("MiniGame") > -1 && "wx" in ae.window && ("tt" in ae.window ? (window.ttMiniGame(t, t), t.TTMiniAdapter ? t.TTMiniAdapter.enable() : console.error("请引入字节跳动小游戏的适配库")) : "bl" in ae.window ? (window.biliMiniGame(t, t), t.BLMiniAdapter ? t.BLMiniAdapter.enable() : console.error("请引入bilibili小游戏的适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-7-0")) : "qq" in ae.window ? (window.qqMiniGame(t, t), t.QQMiniAdapter ? t.QQMiniAdapter.enable() : console.error("请引入手机QQ小游戏的适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-0-0")) : (window.wxMiniGame(t, t), t.MiniAdpter ? t.MiniAdpter.enable() : console.error("请先添加小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0"))), "hbs" in ae.window && (window.hwMiniGame(t, t), t.HWMiniAdapter ? t.HWMiniAdapter.enable() : console.error("请先添加小游戏适配库!")), r.indexOf("SwanGame") > -1 && (window.bdMiniGame(t, t), t.BMiniAdapter ? t.BMiniAdapter.enable() : console.error("请先添加百度小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-1-0")), r.indexOf("QuickGame") > -1 && (window.miMiniGame(t, t), t.KGMiniAdapter ? t.KGMiniAdapter.enable() : console.error("请先添加小米小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-2-0")), r.indexOf("OPPO") > -1 && r.indexOf("MiniGame") > -1 && (window.qgMiniGame(t, t), t.QGMiniAdapter ? t.QGMiniAdapter.enable() : console.error("请先添加OPPO小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-3-0")), r.indexOf("VVGame") > -1 && (window.vvMiniGame(t, t), t.VVMiniAdapter ? t.VVMiniAdapter.enable() : console.error("请先添加VIVO小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-5-4-0")), e.trace = console.log, e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(t) {
                    return e.setTimeout(t, 1e3 / 60)
                };
                var h = i.body.style;
                h.margin = 0, h.overflow = "hidden", h["-webkit-user-select"] = "none", h["-webkit-tap-highlight-color"] = "rgba(200,200,200,0)";
                for (var o = i.getElementsByTagName("meta"), l = 0, _ = !1, u = "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"; l < o.length;) {
                    var c = o[l];
                    if ("viewport" == c.name) {
                        c.content = u, _ = !0;
                        break
                    }
                    l++
                }
                return _ || (c = i.createElement("meta"), c.name = "viewport", c.content = u, i.getElementsByTagName("head")[0].appendChild(c)), ae.onMobile = !!window.conch || r.indexOf("Mobile") > -1, ae.onIOS = !!r.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), ae.onIPhone = r.indexOf("iPhone") > -1, ae.onMac = r.indexOf("Mac OS X") > -1, ae.onIPad = r.indexOf("iPad") > -1 || "MacIntel" === n && a > 1, ae.onAndroid = r.indexOf("Android") > -1 || r.indexOf("Adr") > -1, ae.onWP = r.indexOf("Windows Phone") > -1, ae.onQQBrowser = r.indexOf("QQBrowser") > -1, ae.onMQQBrowser = r.indexOf("MQQBrowser") > -1 || r.indexOf("Mobile") > -1 && r.indexOf("QQ") > -1, ae.onIE = !!e.ActiveXObject || "ActiveXObject" in e, ae.onWeiXin = r.indexOf("MicroMessenger") > -1, ae.onSafari = r.indexOf("Safari") > -1, ae.onPC = !ae.onMobile, ae.onFirefox = r.indexOf("Firefox") > -1, ae.onEdge = r.indexOf("Edge") > -1, ae.onMiniGame = r.indexOf("MiniGame") > -1, ae.onBDMiniGame = r.indexOf("SwanGame") > -1, ae.onLayaRuntime = !!window.conch, r.indexOf("OPPO") > -1 && r.indexOf("MiniGame") > -1 ? (ae.onQGMiniGame = !0, ae.onMiniGame = !1) : "qq" in ae.window && r.indexOf("MiniGame") > -1 ? (ae.onQQMiniGame = !0, ae.onMiniGame = !1) : "bl" in ae.window && r.indexOf("MiniGame") > -1 ? (ae.onBLMiniGame = !0, ae.onMiniGame = !1) : "tt" in ae.window && r.indexOf("MiniGame") > -1 && (ae.onTTMiniGame = !0, ae.onMiniGame = !1), ae.onHWMiniGame = "hbs" in ae.window, ae.onVVMiniGame = r.indexOf("VVGame") > -1, ae.onKGMiniGame = r.indexOf("QuickGame") > -1, r.indexOf("AlipayMiniGame") > -1 && (ae.onAlipayMiniGame = !0, ae.onMiniGame = !1), (r.indexOf("TB/") > -1 || r.indexOf("Taobao/") > -1 || r.indexOf("TM/") > -1) && (ae.onTBMiniGame = !0), e
            }
            static get _isMiniGame() {
                return ae.onMiniGame || ae.onBDMiniGame || ae.onQGMiniGame || ae.onKGMiniGame || ae.onVVMiniGame || ae.onAlipayMiniGame || ae.onQQMiniGame || ae.onBLMiniGame || ae.onTTMiniGame || ae.onHWMiniGame || ae.onTBMiniGame
            }
            static createElement(t) {
                return ae.__init__(), ae._document.createElement(t)
            }
            static getElementById(t) {
                return ae.__init__(), ae._document.getElementById(t)
            }
            static removeElement(t) {
                t && t.parentNode && t.parentNode.removeChild(t)
            }
            static now() {
                return Date.now()
            }
            static get clientWidth() {
                return ae.__init__(), ae._window.innerWidth || ae._document.body.clientWidth
            }
            static get clientHeight() {
                return ae.__init__(), ae._window.innerHeight || ae._document.body.clientHeight || ae._document.documentElement.clientHeight
            }
            static get width() {
                return ae.__init__(), (s.stage && s.stage.canvasRotation ? ae.clientHeight : ae.clientWidth) * ae.pixelRatio
            }
            static get height() {
                return ae.__init__(), (s.stage && s.stage.canvasRotation ? ae.clientWidth : ae.clientHeight) * ae.pixelRatio
            }
            static get pixelRatio() {
                return ae._pixelRatio < 0 && (ae.__init__(), ae.userAgent.indexOf("Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)") > -1 ? ae._pixelRatio = 2 : (ae._pixelRatio = ae._window.devicePixelRatio || 1, ae._pixelRatio < 1 && (ae._pixelRatio = 1))), ae._pixelRatio
            }
            static get container() {
                return ae._container || (ae.__init__(), ae._container = ae.createElement("div"), ae._container.id = "layaContainer", ae._document.body.appendChild(ae._container)), ae._container
            }
            static set container(t) {
                ae._container = t
            }
            static get window() {
                return ae._window || ae.__init__()
            }
            static get document() {
                return ae.__init__(), ae._document
            }
        }
        ae._pixelRatio = -1, ae.mainCanvas = null, ae.hanzi = new RegExp("^[一-龥]$"), ae.fontMap = {}, ae.measureText = function(t, e) {
            var i = ae.hanzi.test(t);
            if (i && ae.fontMap[e]) return ae.fontMap[e];
            var s = ae.context;
            s.font = e;
            var r = s.measureText(t);
            return i && (ae.fontMap[e] = r), r
        };
        class ne extends re {
            constructor(t, e, i = !0, s = !0, r = !1) {
                super(), this.ctx = null, this.lastScaleX = 1, this.lastScaleY = 1, this.maxTexW = 0, this.maxTexH = 0, this.scaleFontSize = !0, this.showDbgInfo = !1, this.supportImageData = !0, this.maxTexW = t, this.maxTexH = e, this.scaleFontSize = i, this.supportImageData = s, this.showDbgInfo = r, ne.canvas || (ne.canvas = ae.createElement("canvas"), ne.canvas.width = 1024, ne.canvas.height = 512, ne.canvas.style && (ne.canvas.style.left = "-10000px", ne.canvas.style.position = "absolute"), window.document.body.appendChild(ne.canvas), this.ctx = ne.canvas.getContext("2d"))
            }
            get canvasWidth() {
                return ne.canvas.width
            }
            set canvasWidth(t) {
                ne.canvas.width != t && (ne.canvas.width = t, t > 2048 && console.warn("画文字设置的宽度太大，超过2048了"), this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.scale(this.lastScaleX, this.lastScaleY))
            }
            getWidth(t, e) {
                return this.ctx ? (this.ctx._lastFont != t && (this.ctx.font = t, this.ctx._lastFont = t), this.ctx.measureText(e).width) : 0
            }
            scale(t, e) {
                if (!this.supportImageData) return this.lastScaleX = t, void(this.lastScaleY = e);
                this.lastScaleX == t && this.lastScaleY == e || (this.ctx.setTransform(t, 0, 0, e, 0, 0), this.lastScaleX = t, this.lastScaleY = e)
            }
            getCharBmp(t, e, i, s, r, a, n, h, o, l, _ = null) {
                if (!this.supportImageData) return this.getCharCanvas(t, e, i, s, r, a, n, h, o, l);
                var u = this.ctx,
                    c = this.fontsz;
                u.font != e && (u.font = e, u._lastFont = e), a.width = u.measureText(t).width;
                var d = a.width * this.lastScaleX,
                    p = a.height * this.lastScaleY;
                d += (n + o) * this.lastScaleX, p += (h + l) * this.lastScaleY, d = Math.ceil(d), p = Math.ceil(p), d = Math.min(d, ne.canvas.width), p = Math.min(p, ne.canvas.height);
                var f = d + 2 * i + 1,
                    m = p + 2 * i + 1;
                _ && (f = Math.max(f, _[0] + _[2] + 1), m = Math.max(m, _[1] + _[3] + 1)), u.clearRect(0, 0, f / this.lastScaleX + 1, m / this.lastScaleY + 1), u.save(), u.textBaseline = "middle", i > 0 && (u.lineJoin = "round", u.strokeStyle = r, u.lineWidth = i, u.strokeText(t, n, h + c / 2)), s && (u.fillStyle = s, u.fillText(t, n, h + c / 2)), this.showDbgInfo && (u.strokeStyle = "#ff0000", u.strokeRect(1, 1, d - 2, p - 2), u.strokeStyle = "#00ff00",
                    u.strokeRect(n, h, a.width, a.height)), _ && (-1 == _[2] && (_[2] = Math.ceil((a.width + 2 * i) * this.lastScaleX)), _[2] <= 0 && (_[2] = 1));
                var g = _ ? u.getImageData(_[0], _[1], _[2], _[3] + 1) : u.getImageData(0, 0, d, p + 1);
                return u.restore(), a.bmpWidth = g.width, a.bmpHeight = g.height, g
            }
            getCharCanvas(t, e, i, s, r, a, n, h, o, l) {
                var _ = this.ctx;
                _.font != e && (_.font = e, _._lastFont = e), a.width = _.measureText(t).width;
                var u = a.width * this.lastScaleX,
                    c = a.height * this.lastScaleY;
                u += (n + o) * this.lastScaleX, c += (h + l) * this.lastScaleY + 1, u = Math.min(u, this.maxTexW), c = Math.min(c, this.maxTexH), ne.canvas.width = Math.min(u + 1, this.maxTexW), ne.canvas.height = Math.min(c + 1, this.maxTexH), _.font = e, _.clearRect(0, 0, u + 1 + i, c + 1 + i), _.setTransform(1, 0, 0, 1, 0, 0), _.save(), this.scaleFontSize && _.scale(this.lastScaleX, this.lastScaleY), _.translate(n, h), _.textAlign = "left";
                var d = this.fontsz;
                return _.textBaseline = "middle", i > 0 ? (_.strokeStyle = r, _.fillStyle = s, _.lineWidth = i, _.fillAndStrokeText ? _.fillAndStrokeText(t, 0, d / 2) : (_.strokeText(t, 0, d / 2), _.fillText(t, 0, d / 2))) : s && (_.fillStyle = s, _.fillText(t, 0, d / 2)), this.showDbgInfo && (_.strokeStyle = "#ff0000", _.strokeRect(0, 0, u, c), _.strokeStyle = "#00ff00", _.strokeRect(0, 0, a.width, a.height)), _.restore(), a.bmpWidth = ne.canvas.width, a.bmpHeight = ne.canvas.height, ne.canvas
            }
        }
        ne.canvas = null;
        class he extends re {
            constructor() {
                super(), this.lastFont = "", this.lastScaleX = 1, this.lastScaleY = 1
            }
            getWidth(t, e) {
                return window.conchTextCanvas ? (window.conchTextCanvas.font = t, this.lastFont = t, window.conchTextCanvas.measureText(e).width) : 0
            }
            scale(t, e) {
                this.lastScaleX = t, this.lastScaleY = e
            }
            getCharBmp(t, e, i, s, r, a, n, h, o, l, _ = null) {
                if (!window.conchTextCanvas) return null;
                window.conchTextCanvas.font = e, this.lastFont = e;
                a.width = window.conchTextCanvas.measureText(t).width, a.height;
                window.conchTextCanvas.scale && window.conchTextCanvas.scale(this.lastScaleX, this.lastScaleY);
                var u = et.create(r),
                    c = u.numColor,
                    d = et.create(s),
                    p = d.numColor,
                    f = window.conchTextCanvas.getTextBitmapData(t, p, i > 2 ? 2 : i, c);
                return a.bmpWidth = f.width, a.bmpHeight = f.height, f
            }
        }
        class oe {
            constructor() {
                this.fontSizeInfo = {}, this.mapFont = {}, this.fontID = 0, this.fontScaleX = 1, this.fontScaleY = 1, this._curStrPos = 0, this.textAtlases = [], this.isoTextures = [], this.lastFont = null, this.fontSizeW = 0, this.fontSizeH = 0, this.fontSizeOffX = 0, this.fontSizeOffY = 0, this.renderPerChar = !0, this.tmpAtlasPos = new m, this.textureMem = 0, s.TextAtlas = $t;
                var t = !1,
                    e = s.Laya.MiniAdpter;
                e && e.systemInfo && e.systemInfo.system && (t = "ios 10.1.1" === e.systemInfo.system.toLowerCase()), (s.Browser.onMiniGame || s.Browser.onTTMiniGame || s.Browser.onBLMiniGame || s.Browser.onAlipayMiniGame || s.Browser.onTBMiniGame) && !t && (oe.isWan1Wan = !0), this.charRender = s.Render.isConchApp ? new he : new ne(2048, 2048, oe.scaleFontWithCtx, !oe.isWan1Wan, !1), oe.textRenderInst = this, s.Laya.textRender = this, oe.atlasWidth2 = oe.atlasWidth * oe.atlasWidth
            }
            setFont(t) {
                if (this.lastFont != t) {
                    this.lastFont = t;
                    var e = this.getFontSizeInfo(t._family),
                        i = e >> 24,
                        s = e >> 16 & 255,
                        r = e >> 8 & 255,
                        a = 255 & e,
                        n = t._size / oe.standardFontSize;
                    this.fontSizeOffX = Math.ceil(i * n), this.fontSizeOffY = Math.ceil(s * n), this.fontSizeW = Math.ceil(r * n), this.fontSizeH = Math.ceil(a * n), t._font.indexOf("italic") >= 0 ? this.fontStr = t._font.replace("italic", "") : this.fontStr = t._font
                }
            }
            getNextChar(t) {
                var e = t.length,
                    i = this._curStrPos;
                if (!t.substring) return null;
                if (i >= e) return null;
                for (var s = i, r = 0; s < e; s++) {
                    var a = t.charCodeAt(s);
                    if (a >>> 11 == 27) {
                        if (1 == r) break;
                        r = 1, s++
                    } else if (65038 === a || 65039 === a);
                    else if (8205 == a) r = 2;
                    else if (0 == r) r = 1;
                    else if (1 == r) break
                }
                return this._curStrPos = s, t.substring(i, s)
            }
            filltext(t, e, i, r, a, n, h, o, l, _ = 0) {
                if (!(e.length <= 0)) {
                    var u = ee.Parse(a),
                        c = 0;
                    switch (l) {
                        case "center":
                            c = s.Context.ENUM_TEXTALIGN_CENTER;
                            break;
                        case "right":
                            c = s.Context.ENUM_TEXTALIGN_RIGHT
                    }
                    this._fast_filltext(t, e, null, i, r, u, n, h, o, c, _)
                }
            }
            fillWords(t, e, i, s, r, a, n, h) {
                if (e && !(e.length <= 0)) {
                    var o = "string" == typeof r ? ee.Parse(r) : r;
                    this._fast_filltext(t, null, e, i, s, o, a, n, h, 0, 0)
                }
            }
            _fast_filltext(t, e, i, r, a, n, h, o, l, _, u = 0) {
                if ((!e || e.length >= 1) && !(i && i.length < 1)) {
                    if (l < 0 && (l = 0), this.setFont(n), this.fontScaleX = this.fontScaleY = 1, oe.scaleFontWithCtx) {
                        var c = 1,
                            d = 1;
                        if (s.Render.isConchApp && !window.conchTextCanvas.scale || (c = t.getMatScaleX(), d = t.getMatScaleY()), c < 1e-4 || d < .1) return;
                        c > 1 && (this.fontScaleX = c), d > 1 && (this.fontScaleY = d)
                    }
                    n._italic && (t._italicDeg = 13);
                    var p = e,
                        f = !i && e instanceof ie,
                        m = e && e.toString(),
                        g = !!i,
                        T = f ? p.pageChars : [],
                        v = 0;
                    switch (f ? (m = p._text, v = p.width, v < 0 && (v = p.width = this.charRender.getWidth(this.fontStr, m))) : v = m ? this.charRender.getWidth(this.fontStr, m) : 0, _) {
                        case s.Context.ENUM_TEXTALIGN_CENTER:
                            r -= v / 2;
                            break;
                        case s.Context.ENUM_TEXTALIGN_RIGHT:
                            r -= v
                    }
                    p && T && this.hasFreedText(T) && (T = p.pageChars = []);
                    var x = null,
                        y = this.renderPerChar = !f || oe.forceSplitRender || g || f && p.splitRender;
                    if (!T || T.length < 1)
                        if (f && (p.scalex = this.fontScaleX, p.scaley = this.fontScaleY), y) {
                            var E, A = 0,
                                C = 0;
                            for (this._curStrPos = 0;;) {
                                if (i) {
                                    var R = i[this._curStrPos++];
                                    R ? (E = R.char, A = R.x, C = R.y) : E = null
                                } else E = this.getNextChar(m);
                                if (!E) break;
                                if (x = this.getCharRenderInfo(E, n, h, o, l, !1), !x) break;
                                if (x.isSpace);
                                else {
                                    var b = T[x.tex.id];
                                    if (b) b = b.words;
                                    else {
                                        var S = {
                                            texgen: x.tex.genID,
                                            tex: x.tex,
                                            words: new Array
                                        };
                                        T[x.tex.id] = S, b = S.words
                                    }
                                    b.push({
                                        ri: x,
                                        x: A,
                                        y: C,
                                        w: x.bmpWidth / this.fontScaleX,
                                        h: x.bmpHeight / this.fontScaleY
                                    }), A += x.width
                                }
                            }
                        } else {
                            var w = s.Render.isConchApp ? 0 : n._size / 3 | 0,
                                M = oe.noAtlas || (v + w + w) * this.fontScaleX > oe.atlasWidth;
                            x = this.getCharRenderInfo(m, n, h, o, l, M), T[0] = {
                                texgen: x.tex.genID,
                                tex: x.tex,
                                words: [{
                                    ri: x,
                                    x: 0,
                                    y: 0,
                                    w: x.bmpWidth / this.fontScaleX,
                                    h: x.bmpHeight / this.fontScaleY
                                }]
                            }
                        }
                    this._drawResortedWords(t, r, a, T), t._italicDeg = 0
                }
            }
            _drawResortedWords(t, e, i, r) {
                var a = !!t._charSubmitCache && t._charSubmitCache._enable,
                    n = t._curMat;
                for (var h in r) {
                    var o = r[h];
                    if (o) {
                        var l = o.words,
                            _ = l.length;
                        if (!(_ <= 0))
                            for (var u = r[h].tex, c = 0; c < _; c++) {
                                var d = l[c],
                                    p = d.ri;
                                if (!p.isSpace) {
                                    if (p.touch(), t.drawTexAlign = !0, s.Render.isConchApp) t._drawTextureM(u.texture, e + d.x - p.orix, i + d.y - p.oriy, d.w, d.h, null, 1, p.uv);
                                    else {
                                        let s = u;
                                        t._inner_drawTexture(s.texture, s.id, e + d.x - p.orix, i + d.y - p.oriy, d.w, d.h, n, p.uv, 1, a)
                                    }
                                    t.touches && t.touches.push(p)
                                }
                            }
                    }
                }
            }
            hasFreedText(t) {
                for (let s in t) {
                    var e = t[s];
                    if (e) {
                        var i = e.tex;
                        if (i.__destroyed || i.genID != e.texgen) return !0
                    }
                }
                return !1
            }
            getCharRenderInfo(t, e, i, r, a, n = !1) {
                var h = this.mapFont[e._family];
                null == h && (this.mapFont[e._family] = h = this.fontID++);
                var o = t + "_" + h + "_" + e._size + "_" + i;
                a > 0 && (o += "_" + r + a), e._bold && (o += "P"), 1 == this.fontScaleX && 1 == this.fontScaleY || (o += (20 * this.fontScaleX | 0) + "_" + (20 * this.fontScaleY | 0));
                var l, _, u = 0,
                    c = this.textAtlases.length;
                if (!n)
                    for (u = 0; u < c; u++)
                        if (_ = this.textAtlases[u], l = _.charMaps[o], l) return l.touch(), l;
                l = new se, this.charRender.scale(this.fontScaleX, this.fontScaleY), l.char = t, l.height = e._size;
                var d = s.Render.isConchApp ? 0 : e._size / 3 | 0,
                    p = null;
                a || (a = 0);
                var f = Math.ceil((this.charRender.getWidth(this.fontStr, t) + 2 * a) * this.fontScaleX);
                if (f > this.charRender.canvasWidth && (this.charRender.canvasWidth = Math.min(2048, f + 2 * d)), n) {
                    if (this.charRender.fontsz = e._size, p = this.charRender.getCharBmp(t, this.fontStr, a, i, r, l, d, d, d, d, null), p) {
                        var m = Qt.getTextTexture(p.width, p.height);
                        m.addChar(p, 0, 0, l.uv), l.tex = m, l.orix = d, l.oriy = d, m.ri = l, this.isoTextures.push(m)
                    }
                } else {
                    var g = t.length,
                        T = 1 * a,
                        v = Math.ceil((this.fontSizeW + 2 * T) * this.fontScaleX),
                        x = Math.ceil((this.fontSizeH + 2 * T) * this.fontScaleY);
                    oe.imgdtRect[0] = (d - this.fontSizeOffX - T) * this.fontScaleX | 0, oe.imgdtRect[1] = (d - this.fontSizeOffY - T) * this.fontScaleY | 0, this.renderPerChar || 1 == g ? (oe.imgdtRect[2] = Math.max(f, v), oe.imgdtRect[3] = Math.max(f, x)) : (oe.imgdtRect[2] = -1, oe.imgdtRect[3] = x), this.charRender.fontsz = e._size, p = this.charRender.getCharBmp(t, this.fontStr, a, i, r, l, d, d, d, d, oe.imgdtRect), p && (_ = this.addBmpData(p, l), oe.isWan1Wan ? (l.orix = d, l.oriy = d) : (l.orix = this.fontSizeOffX + T, l.oriy = this.fontSizeOffY + T), _.charMaps[o] = l)
                }
                return l
            }
            addBmpData(t, e) {
                for (var i, s = t.width, r = t.height, a = this.textAtlases.length, n = !1, h = 0; h < a && (i = this.textAtlases[h], n = i.getAEmpty(s, r, this.tmpAtlasPos), !n); h++);
                if (!n) {
                    if (i = new $t, this.textAtlases.push(i), n = i.getAEmpty(s, r, this.tmpAtlasPos), !n) throw "err1";
                    this.cleanAtlases()
                }
                return n && (i.texture.addChar(t, this.tmpAtlasPos.x, this.tmpAtlasPos.y, e.uv), e.tex = i.texture), i
            }
            GC() {
                for (var t = 0, e = this.textAtlases.length, i = 0, s = oe.destroyAtlasDt, r = 0, a = Ct.loopCount, n = -1, h = 0, o = null, l = null; t < e; t++) {
                    if (l = this.textAtlases[t], o = l.texture, o) {
                        o.curUsedCovRate, r += o.curUsedCovRateAtlas;
                        var _ = l.usedRate - o.curUsedCovRateAtlas;
                        h < _ && (h = _, n = t)
                    }
                    i = a - l.texture.lastTouchTm, i > s && (oe.showLog && console.log(l.texture.id), l.destroy(), this.textAtlases[t] = this.textAtlases[e - 1], e--, t--, n = -1)
                }
                for (this.textAtlases.length = e, e = this.isoTextures.length, t = 0; t < e; t++) o = this.isoTextures[t], i = a - o.lastTouchTm, i > oe.destroyUnusedTextureDt && (o.ri.deleted = !0, o.ri.tex = null, o.destroy(), this.isoTextures[t] = this.isoTextures[e - 1], e--, t--);
                this.isoTextures.length = e;
                var u = this.textAtlases.length > 1 && this.textAtlases.length - r >= 2;
                (oe.atlasWidth * oe.atlasWidth * 4 * this.textAtlases.length > oe.cleanMem || u || oe.simClean) && (oe.simClean = !1, oe.showLog && console.log("清理使用率低的贴图。总使用率:", r, ":", this.textAtlases.length, "最差贴图:" + n), n >= 0 && (l = this.textAtlases[n], l.destroy(), this.textAtlases[n] = this.textAtlases[this.textAtlases.length - 1], this.textAtlases.length = this.textAtlases.length - 1)), Qt.clean()
            }
            cleanAtlases() {}
            getCharBmp(t) {}
            checkBmpLine(t, e, i, s) {
                this.bmpData32.buffer != t.data.buffer && (this.bmpData32 = new Uint32Array(t.data.buffer));
                for (var r = t.width * e + i, a = i; a < s; a++)
                    if (0 != this.bmpData32[r++]) return !0;
                return !1
            }
            updateBbx(t, e, i = !1) {
                var s = t.width,
                    r = t.height,
                    a = 0,
                    n = e[1],
                    h = 0,
                    o = n;
                if (this.checkBmpLine(t, n, 0, s))
                    for (;;) {
                        if (o = (n + h) / 2 | 0, o + 1 >= n) {
                            e[1] = o;
                            break
                        }
                        this.checkBmpLine(t, o, 0, s) ? n = o : h = o
                    }
                if (e[3] > r) e[3] = r;
                else if (o = n = e[3], h = r, this.checkBmpLine(t, n, 0, s))
                    for (;;) {
                        if (o = (n + h) / 2 | 0, o - 1 <= n) {
                            e[3] = o;
                            break
                        }
                        this.checkBmpLine(t, o, 0, s) ? n = o : h = o
                    }
                if (!i) {
                    var l = e[0],
                        _ = s * e[1];
                    for (o = e[1]; o < e[3]; o++) {
                        for (a = 0; a < l; a++)
                            if (0 != this.bmpData32[_ + a]) {
                                l = a;
                                break
                            }
                        _ += s
                    }
                    e[0] = l;
                    var u = e[2];
                    for (_ = s * e[1], o = e[1]; o < e[3]; o++) {
                        for (a = u; a < s; a++)
                            if (0 != this.bmpData32[_ + a]) {
                                u = a;
                                break
                            }
                        _ += s
                    }
                    e[2] = u
                }
            }
            getFontSizeInfo(t) {
                var e = this.fontSizeInfo[t];
                if (null != e) return e;
                var i = "bold " + oe.standardFontSize + "px " + t;
                if (oe.isWan1Wan) {
                    this.fontSizeW = 1.5 * this.charRender.getWidth(i, "有"), this.fontSizeH = 1.5 * oe.standardFontSize;
                    var r = this.fontSizeW << 8 | this.fontSizeH;
                    return this.fontSizeInfo[t] = r, r
                }
                oe.pixelBBX[0] = oe.standardFontSize / 2, oe.pixelBBX[1] = oe.standardFontSize / 2, oe.pixelBBX[2] = oe.standardFontSize, oe.pixelBBX[3] = oe.standardFontSize;
                var a = 16,
                    n = 16,
                    h = 16,
                    o = 16;
                this.charRender.scale(1, 1), oe.tmpRI.height = oe.standardFontSize, this.charRender.fontsz = oe.standardFontSize;
                var l = this.charRender.getCharBmp("g", i, 0, "red", null, oe.tmpRI, a, n, h, o);
                s.Render.isConchApp && (l.data = new Uint8ClampedArray(l.data)), this.bmpData32 = new Uint32Array(l.data.buffer), this.updateBbx(l, oe.pixelBBX, !1), l = this.charRender.getCharBmp("有", i, 0, "red", null, oe.tmpRI, n, n, h, o), s.Render.isConchApp && (l.data = new Uint8ClampedArray(l.data)), this.bmpData32 = new Uint32Array(l.data.buffer), oe.pixelBBX[2] < a + oe.tmpRI.width && (oe.pixelBBX[2] = a + oe.tmpRI.width), this.updateBbx(l, oe.pixelBBX, !1), s.Render.isConchApp && (a = 0, n = 0);
                var _ = Math.max(a - oe.pixelBBX[0], 0),
                    u = Math.max(n - oe.pixelBBX[1], 0),
                    c = oe.pixelBBX[2] - oe.pixelBBX[0],
                    d = oe.pixelBBX[3] - oe.pixelBBX[1],
                    p = _ << 24 | u << 16 | c << 8 | d;
                return this.fontSizeInfo[t] = p, p
            }
            printDbgInfo() {
                for (var t in console.log("图集个数:" + this.textAtlases.length + ",每个图集大小:" + oe.atlasWidth + "x" + oe.atlasWidth, " 用canvas:", oe.isWan1Wan), console.log("图集占用空间:" + oe.atlasWidth * oe.atlasWidth * 4 / 1024 / 1024 * this.textAtlases.length + "M"), console.log("缓存用到的字体:"), this.mapFont) {
                    var e = this.getFontSizeInfo(t),
                        i = e >> 24,
                        s = e >> 16 & 255,
                        r = e >> 8 & 255,
                        a = 255 & e;
                    console.log("    " + t, " off:", i, s, " size:", r, a)
                }
                var n = 0;
                console.log("缓存数据:");
                var h = 0,
                    o = 0;
                this.textAtlases.forEach(function(t) {
                    var e = t.texture.id,
                        i = Ct.loopCount - t.texture.lastTouchTm,
                        s = i > 0 ? i + "帧以前" : "当前帧";
                    for (var r in h += t.texture.curUsedCovRate, o += t.texture.curUsedCovRateAtlas, console.log("--图集(id:" + e + ",当前使用率:" + (1e3 * t.texture.curUsedCovRate | 0) + "‰", "当前图集使用率:", (100 * t.texture.curUsedCovRateAtlas | 0) + "%", "图集使用率:", 100 * t.usedRate | 0, "%, 使用于:" + s + ")--:"), t.charMaps) {
                        var a = t.charMaps[r];
                        console.log("     off:", a.orix, a.oriy, " bmp宽高:", a.bmpWidth, a.bmpHeight, "无效:", a.deleted, "touchdt:", Ct.loopCount - a.touchTick, "位置:", a.uv[0] * oe.atlasWidth | 0, a.uv[1] * oe.atlasWidth | 0, "字符:", a.char, "key:", r), n++
                    }
                }), console.log("独立贴图文字(" + this.isoTextures.length + "个):"), this.isoTextures.forEach(function(t) {
                    console.log("    size:", t._texW, t._texH, "touch间隔:", Ct.loopCount - t.lastTouchTm, "char:", t.ri.char)
                }), console.log("总缓存:", n, "总使用率:", h, "总当前图集使用率:", o)
            }
            showAtlas(t, e, i, r, a, n) {
                if (!this.textAtlases[t]) return console.log("没有这个图集"), null;
                var h = new s.Sprite,
                    o = this.textAtlases[t].texture,
                    l = {
                        width: oe.atlasWidth,
                        height: oe.atlasWidth,
                        sourceWidth: oe.atlasWidth,
                        sourceHeight: oe.atlasWidth,
                        offsetX: 0,
                        offsetY: 0,
                        getIsReady: function() {
                            return !0
                        },
                        _addReference: function() {},
                        _removeReference: function() {},
                        _getSource: function() {
                            return o._getSource()
                        },
                        bitmap: {
                            id: o.id
                        },
                        _uv: te.DEF_UV
                    };
                return h.size = function(t, i) {
                    return this.width = t, this.height = i, h.graphics.clear(), h.graphics.drawRect(0, 0, h.width, h.height, e), h.graphics.drawTexture(l, 0, 0, h.width, h.height), this
                }, h.graphics.drawRect(0, 0, a, n, e), h.graphics.drawTexture(l, 0, 0, a, n), h.pos(i, r), s.stage.addChild(h), h
            }
            filltext_native(t, e, i, r, a, n, h, o, l, _, u = 0) {
                if (!(e && e.length <= 0 || i && i.length < 1)) {
                    var c = ee.Parse(n),
                        d = 0;
                    switch (_) {
                        case "center":
                            d = s.Context.ENUM_TEXTALIGN_CENTER;
                            break;
                        case "right":
                            d = s.Context.ENUM_TEXTALIGN_RIGHT
                    }
                    return this._fast_filltext(t, e, i, r, a, c, h, o, l, d, u)
                }
            }
        }
        oe.useOldCharBook = !1, oe.atlasWidth = 1024, oe.noAtlas = !1, oe.forceSplitRender = !1, oe.forceWholeRender = !1, oe.scaleFontWithCtx = !0, oe.standardFontSize = 32, oe.destroyAtlasDt = 10, oe.checkCleanTextureDt = 2e3, oe.destroyUnusedTextureDt = 3e3, oe.cleanMem = 104857600, oe.isWan1Wan = !1, oe.showLog = !1, oe.debugUV = !1, oe.tmpRI = new se, oe.pixelBBX = [0, 0, 0, 0], oe.imgdtRect = [0, 0, 0, 0], oe.simClean = !1, Qt.gTextRender = oe;
        class le {
            constructor() {
                if (this._tmpMatrix = new f, this._drawTexToDrawTri_Vert = new Float32Array(8), this._drawTexToDrawTri_Index = new Uint16Array([0, 1, 2, 0, 2, 3]), this._tempUV = new Float32Array(8), this._drawTriUseAbsMatrix = !1, this._id = ++le._COUNT, this._other = null, this._renderNextSubmitIndex = 0, this._path = null, this._drawCount = 1, this._width = le._MAXSIZE, this._height = le._MAXSIZE, this._renderCount = 0, this._submits = null, this._curSubmit = null, this._submitKey = new Q, this._pathMesh = null, this._triangleMesh = null, this.meshlist = [], this._transedPoints = new Array(8), this._temp4Points = new Array(8), this._clipRect = le.MAXCLIPRECT, this._globalClipMatrix = new f(le._MAXSIZE, 0, 0, le._MAXSIZE, 0, 0), this._clipInCache = !1, this._clipInfoID = 0, this._clipID_Gen = 0, this._lastMatScaleX = 1, this._lastMatScaleY = 1, this._lastMat_a = 1, this._lastMat_b = 0, this._lastMat_c = 0, this._lastMat_d = 1, this._nBlendType = 0, this._save = null, this._targets = null, this._charSubmitCache = null, this._saveMark = null, this._shader2D = new Gt, this.sprite = null, this._italicDeg = 0, this._lastTex = null, this._fillColor = 0, this._flushCnt = 0, this.defTexture = null, this._colorFiler = null, this.drawTexAlign = !1, this._incache = !1, this.isMain = !1, le._contextcount++, le._textRender = le._textRender || new oe, !this.defTexture) {
                    var t = new U(2, 2);
                    t.setPixels(new Uint8Array(16)), t.lock = !0, this.defTexture = new te(t)
                }
                this._lastTex = this.defTexture, this.clear()
            }
            static __init__() {
                le.MAXCLIPRECT = new g(0, 0, le._MAXSIZE, le._MAXSIZE), _e.DEFAULT = new _e
            }
            drawImage(...t) {}
            getImageData(...t) {}
            measureText(t) {
                return null
            }
            setTransform(...t) {}
            $transform(t, e, i, s, r, a) {}
            get lineJoin() {
                return ""
            }
            set lineJoin(t) {}
            get lineCap() {
                return ""
            }
            set lineCap(t) {}
            get miterLimit() {
                return ""
            }
            set miterLimit(t) {}
            clearRect(t, e, i, s) {}
            _drawRect(t, e, i, s, r) {
                z.renderBatches++, r && (this.fillStyle = r), this.fillRect(t, e, i, s, null)
            }
            drawTexture2(t, e, i, s, r, a) {}
            transformByMatrix(t, e, i) {
                this.transform(t.a, t.b, t.c, t.d, t.tx + e, t.ty + i)
            }
            saveTransform(t) {
                this.save()
            }
            restoreTransform(t) {
                this.restore()
            }
            drawRect(t, e, i, s, r, a, n) {
                var h = this;
                null != r && (h.fillStyle = r, h.fillRect(t, e, i, s)), null != a && (h.strokeStyle = a, h.lineWidth = n, h.strokeRect(t, e, i, s))
            }
            alpha(t) {
                this.globalAlpha *= t
            }
            _transform(t, e, i) {
                this.translate(e, i), this.transform(t.a, t.b, t.c, t.d, t.tx, t.ty), this.translate(-e, -i)
            }
            _rotate(t, e, i) {
                this.translate(e, i), this.rotate(t), this.translate(-e, -i)
            }
            _scale(t, e, i, s) {
                this.translate(i, s), this.scale(t, e), this.translate(-i, -s)
            }
            _drawLine(t, e, i, s, r, a, n, h, o) {
                this.beginPath(), this.strokeStyle = n, this.lineWidth = h, this.moveTo(t + i, e + s), this.lineTo(t + r, e + a), this.stroke()
            }
            _drawLines(t, e, i, s, r, a) {
                this.beginPath(), this.strokeStyle = s, this.lineWidth = r, this.addPath(i.slice(), !1, !1, t, e), this.stroke()
            }
            drawCurves(t, e, i, s, r) {
                this.beginPath(), this.strokeStyle = s, this.lineWidth = r, this.moveTo(t + i[0], e + i[1]);
                for (var a = 2, n = i.length; a < n;) this.quadraticCurveTo(t + i[a++], e + i[a++], t + i[a++], e + i[a++]);
                this.stroke()
            }
            _fillAndStroke(t, e, i, s = !1) {
                null != t && (this.fillStyle = t, this.fill()), null != e && i > 0 && (this.strokeStyle = e, this.lineWidth = i, this.stroke())
            }
            _drawCircle(t, e, i, s, r, a, n) {
                z.renderBatches++, this.beginPath(!0), this.arc(t, e, i, 0, le.PI2), this.closePath(), this._fillAndStroke(s, r, a)
            }
            _drawPie(t, e, i, s, r, a, n, h, o) {
                this.beginPath(), this.moveTo(t, e), this.arc(t, e, i, s, r), this.closePath(), this._fillAndStroke(a, n, h)
            }
            _drawPoly(t, e, i, s, r, a, n, h) {
                this.beginPath(), this.addPath(i.slice(), !0, n, t, e), this.closePath(), this._fillAndStroke(s, r, a, n)
            }
            _drawPath(t, e, i, s, r) {
                this.beginPath();
                for (var a = 0, n = i.length; a < n; a++) {
                    var h = i[a];
                    switch (h[0]) {
                        case "moveTo":
                            this.moveTo(t + h[1], e + h[2]);
                            break;
                        case "lineTo":
                            this.lineTo(t + h[1], e + h[2]);
                            break;
                        case "arcTo":
                            this.arcTo(t + h[1], e + h[2], t + h[3], e + h[4], h[5]);
                            break;
                        case "closePath":
                            this.closePath()
                    }
                }
                null != s && (this.fillStyle = s.fillStyle, this.fill()), null != r && (this.strokeStyle = r.strokeStyle, this.lineWidth = r.lineWidth || 1, this.lineJoin = r.lineJoin, this.lineCap = r.lineCap, this.miterLimit = r.miterLimit, this.stroke())
            }
            static set2DRenderConfig() {
                var t = T.instance;
                S.setBlend(t, !0), S.setBlendEquation(t, t.FUNC_ADD), V.activeBlendFunction = null, S.setBlendFunc(t, t.ONE, t.ONE_MINUS_SRC_ALPHA), S.setDepthTest(t, !1), S.setCullFace(t, !1), S.setDepthMask(t, !0), S.setFrontFace(t, t.CCW), t.viewport(0, 0, k.width, k.height), t.enable(t.SCISSOR_TEST), t.scissor(0, 0, k.width, k.height)
            }
            clearBG(t, e, i, s) {
                var r = S.mainContext;
                r.clearColor(t, e, i, s), r.clear(r.COLOR_BUFFER_BIT)
            }
            _getSubmits() {
                return this._submits
            }
            _releaseMem(t = !1) {
                if (this._submits) {
                    this._curMat && this._curMat.destroy(), this._curMat = null, this._shader2D.destroy(), this._shader2D = null, this._charSubmitCache.clear();
                    for (var e = 0, i = this._submits._length; e < i; e++) this._submits[e].releaseRender();
                    var s;
                    for (this._submits.length = 0, this._submits._length = 0, this._submits = null, this._curSubmit = null, this._path = null, this._save = null, e = 0, s = this.meshlist.length; e < s; e++) {
                        var r = this.meshlist[e];
                        r.destroy()
                    }
                    this.meshlist.length = 0, this.sprite = null, t || (this._targets && this._targets.destroy(), this._targets = null)
                }
            }
            destroy(t = !1) {
                --le._contextcount, this.sprite = null, this._releaseMem(t), this._charSubmitCache && this._charSubmitCache.destroy(), this._mesh.destroy(), t || (this._targets && this._targets.destroy(), this._targets = null)
            }
            clear() {
                this._submits || (this._other = _e.DEFAULT, this._curMat = f.create(), this._charSubmitCache = new qt, this._mesh = Mt.getAMesh(this.isMain), this.meshlist.push(this._mesh), this._pathMesh = Pt.getAMesh(this.isMain), this.meshlist.push(this._pathMesh), this._triangleMesh = It.getAMesh(this.isMain), this.meshlist.push(this._triangleMesh), this._submits = [], this._save = [Tt.Create(this)], this._save.length = 10, this._shader2D = new Gt), this._submitKey.clear(), this._mesh.clearVB(), this._drawCount = 1, this._other = _e.DEFAULT, this._other.lineWidth = this._shader2D.ALPHA = 1, this._nBlendType = 0, this._clipRect = le.MAXCLIPRECT, this._curSubmit = ft.RENDERBASE, ft.RENDERBASE._ref = 16777215, ft.RENDERBASE._numEle = 0, this._shader2D.fillStyle = this._shader2D.strokeStyle = ct.DEFAULT;
                for (var t = 0, e = this._submits._length; t < e; t++) this._submits[t].releaseRender();
                this._submits._length = 0, this._curMat.identity(), this._other.clear(), this._saveMark = this._save[0], this._save._length = 1
            }
            size(e, i) {
                this._width == e && this._height == i || (this._width = e, this._height = i, this._targets && (this._targets.destroy(), this._targets = new W(e, i, t.RenderTextureFormat.R8G8B8A8, -1)), this.isMain && (S.mainContext.viewport(0, 0, e, i), k.width = e, k.height = i)), 0 === e && 0 === i && this._releaseMem()
            }
            set asBitmap(e) {
                if (e) {
                    let e = this._targets;
                    if (!this._width || !this._height) throw Error("asBitmap no size!");
                    e && e.width == this._width && e.height == this._height || (e && e.destroy(), this._targets = new W(this._width, this._height, t.RenderTextureFormat.R8G8B8A8, -1))
                } else this._targets && this._targets.destroy(), this._targets = null
            }
            getMatScaleX() {
                return this._lastMat_a == this._curMat.a && this._lastMat_b == this._curMat.b ? this._lastMatScaleX : (this._lastMatScaleX = this._curMat.getScaleX(), this._lastMat_a = this._curMat.a, this._lastMat_b = this._curMat.b, this._lastMatScaleX)
            }
            getMatScaleY() {
                return this._lastMat_c == this._curMat.c && this._lastMat_d == this._curMat.d ? this._lastMatScaleY : (this._lastMatScaleY = this._curMat.getScaleY(), this._lastMat_c = this._curMat.c, this._lastMat_d = this._curMat.d, this._lastMatScaleY)
            }
            setFillColor(t) {
                this._fillColor = t
            }
            getFillColor() {
                return this._fillColor
            }
            set fillStyle(t) {
                this._shader2D.fillStyle.equal(t) || (mt.save(this, mt.TYPE_FILESTYLE, this._shader2D, !1), this._shader2D.fillStyle = ct.create(t), this._submitKey.other = -this._shader2D.fillStyle.toInt())
            }
            get fillStyle() {
                return this._shader2D.fillStyle
            }
            set globalAlpha(t) {
                t = Math.floor(1e3 * t) / 1e3, t != this._shader2D.ALPHA && (mt.save(this, mt.TYPE_ALPHA, this._shader2D, !1), this._shader2D.ALPHA = t)
            }
            get globalAlpha() {
                return this._shader2D.ALPHA
            }
            set textAlign(t) {
                this._other.textAlign === t || (this._other = this._other.make(), mt.save(this, mt.TYPE_TEXTALIGN, this._other, !1), this._other.textAlign = t)
            }
            get textAlign() {
                return this._other.textAlign
            }
            set textBaseline(t) {
                this._other.textBaseline === t || (this._other = this._other.make(), mt.save(this, mt.TYPE_TEXTBASELINE, this._other, !1), this._other.textBaseline = t)
            }
            get textBaseline() {
                return this._other.textBaseline
            }
            set globalCompositeOperation(t) {
                var e = V.TOINT[t];
                null == e || this._nBlendType === e || (mt.save(this, mt.TYPE_GLOBALCOMPOSITEOPERATION, this, !0), this._curSubmit = ft.RENDERBASE, this._nBlendType = e)
            }
            get globalCompositeOperation() {
                return V.NAMES[this._nBlendType]
            }
            set strokeStyle(t) {
                this._shader2D.strokeStyle.equal(t) || (mt.save(this, mt.TYPE_STROKESTYLE, this._shader2D, !1), this._shader2D.strokeStyle = ct.create(t), this._submitKey.other = -this._shader2D.strokeStyle.toInt())
            }
            get strokeStyle() {
                return this._shader2D.strokeStyle
            }
            translate(t, e) {
                0 === t && 0 === e || (xt.save(this), this._curMat._bTransform ? (vt.save(this), this._curMat.tx += t * this._curMat.a + e * this._curMat.c, this._curMat.ty += t * this._curMat.b + e * this._curMat.d) : (this._curMat.tx = t, this._curMat.ty = e))
            }
            set lineWidth(t) {
                this._other.lineWidth === t || (this._other = this._other.make(), mt.save(this, mt.TYPE_LINEWIDTH, this._other, !1), this._other.lineWidth = t)
            }
            get lineWidth() {
                return this._other.lineWidth
            }
            save() {
                this._save[this._save._length++] = Tt.Create(this)
            }
            restore() {
                var t = this._save._length,
                    e = this._nBlendType;
                if (!(t < 1)) {
                    for (var i = t - 1; i >= 0; i--) {
                        var s = this._save[i];
                        if (s.restore(this), s.isSaveMark()) return void(this._save._length = i)
                    }
                    e != this._nBlendType && (this._curSubmit = ft.RENDERBASE)
                }
            }
            set font(t) {
                this._other = this._other.make(), mt.save(this, mt.TYPE_FONT, this._other, !1)
            }
            fillText(t, e, i, s, r, a, n = 0, h = "") {
                le._textRender.filltext(this, t, e, i, s, r, h, n, a)
            }
            drawText(t, e, i, s, r, a) {
                le._textRender.filltext(this, t, e, i, s, r, null, 0, a)
            }
            fillWords(t, e, i, s, r) {
                le._textRender.fillWords(this, t, e, i, s, r, null, 0)
            }
            strokeWord(t, e, i, s, r, a, n) {
                le._textRender.filltext(this, t, e, i, s, null, r, a, n)
            }
            fillBorderText(t, e, i, s, r, a, n, h) {
                le._textRender.filltext(this, t, e, i, s, r, a, n, h)
            }
            fillBorderWords(t, e, i, s, r, a, n) {
                le._textRender.fillWords(this, t, e, i, s, r, a, n)
            }
            _fast_filltext(t, e, i, s, r, a, n, h, o = 0) {
                le._textRender._fast_filltext(this, t, null, e, i, s, r, a, n, h, o)
            }
            _fillRect(t, e, i, s, r) {
                var a = this._curSubmit,
                    n = a && a._key.submitType === ft.KEY_DRAWTEXTURE && a._key.blendShader === this._nBlendType;
                this._mesh.vertNum + 4 > le._MAXVERTNUM && (this._mesh = Mt.getAMesh(this.isMain), this.meshlist.push(this._mesh), n = !1), n && (n = n && this.isSameClipInfo(a)), this.transformQuad(t, e, i, s, 0, this._curMat, this._transedPoints), this.clipedOff(this._transedPoints) || (this._mesh.addQuad(this._transedPoints, te.NO_UV, r, !1), n || (a = this._curSubmit = jt.create(this, this._mesh, Z.create(H.TEXTURE2D, 0)), this._submits[this._submits._length++] = a, this._copyClipInfo(a, this._globalClipMatrix), a.shaderValue.textureHost = this._lastTex, a._key.other = this._lastTex && this._lastTex.bitmap ? this._lastTex.bitmap.id : -1, a._renderType = ft.TYPE_TEXTURE), this._curSubmit._numEle += 6, this._mesh.indexNum += 6, this._mesh.vertNum += 4)
            }
            fillRect(t, e, i, s, r) {
                var a = r ? ct.create(r) : this._shader2D.fillStyle,
                    n = this.mixRGBandAlpha(a.toInt());
                this._fillRect(t, e, i, s, n)
            }
            fillTexture(t, e, i, r, a, n, h, o) {
                t._getSource() ? this._fillTexture(t, t.width, t.height, t.uvrect, e, i, r, a, n, h.x, h.y) : this.sprite && s.systemTimer.callLater(this, this._repaintSprite)
            }
            _fillTexture(t, e, i, s, r, a, n, h, o, l, _) {
                var u = this._curSubmit;
                this._mesh.vertNum + 4 > le._MAXVERTNUM && (this._mesh = Mt.getAMesh(this.isMain), this.meshlist.push(this._mesh));
                var c = !0,
                    d = !0;
                switch (o) {
                    case "repeat":
                        break;
                    case "repeat-x":
                        d = !1;
                        break;
                    case "repeat-y":
                        c = !1;
                        break;
                    case "no-repeat":
                        c = d = !1
                }
                var p = this._temp4Points,
                    f = 0,
                    m = 0,
                    g = 0,
                    T = 0,
                    v = 0,
                    x = 0;
                if (l < 0 ? (g = r, f = -l % e / e) : g = r + l, _ < 0 ? (T = a, m = -_ % i / i) : T = a + _, v = r + n, x = a + h, !c && (v = Math.min(v, r + l + e)), !d && (x = Math.min(x, a + _ + i)), !(v < r || x < a || g > v || T > x)) {
                    var y = (v - r - l) / e,
                        E = (x - a - _) / i;
                    if (this.transformQuad(g, T, v - g, x - T, 0, this._curMat, this._transedPoints), p[0] = f, p[1] = m, p[2] = y, p[3] = m, p[4] = y, p[5] = E, p[6] = f, p[7] = E, !this.clipedOff(this._transedPoints)) {
                        var A = this._mixRGBandAlpha(4294967295, this._shader2D.ALPHA);
                        this._mesh.addQuad(this._transedPoints, p, A, !0);
                        var C = Z.create(H.TEXTURE2D, 0);
                        C.defines.add(H.FILLTEXTURE), C.u_TexRange = s.concat(), u = this._curSubmit = jt.create(this, this._mesh, C), this._submits[this._submits._length++] = u, this._copyClipInfo(u, this._globalClipMatrix), u.shaderValue.textureHost = t, u._renderType = ft.TYPE_TEXTURE, this._curSubmit._numEle += 6, this._mesh.indexNum += 6, this._mesh.vertNum += 4
                    }
                    this.breakNextMerge()
                }
            }
            setColorFilter(t) {
                mt.save(this, mt.TYPE_COLORFILTER, this, !0), this._colorFiler = t, this._curSubmit = ft.RENDERBASE
            }
            drawTexture(t, e, i, s, r) {
                this._drawTextureM(t, e, i, s, r, null, 1, null)
            }
            drawTextures(t, e, i, r) {
                if (t._getSource())
                    for (var a = e.length / 2, n = 0, h = t.bitmap.id, o = 0; o < a; o++) this._inner_drawTexture(t, h, e[n++] + i, e[n++] + r, 0, 0, null, null, 1, !1);
                else this.sprite && s.systemTimer.callLater(this, this._repaintSprite)
            }
            _drawTextureAddSubmit(t, e) {
                var i = null;
                i = jt.create(this, this._mesh, Z.create(H.TEXTURE2D, 0)), this._submits[this._submits._length++] = i, i.shaderValue.textureHost = e, i._key.other = t, i._renderType = ft.TYPE_TEXTURE, this._curSubmit = i
            }
            _drawTextureM(t, e, i, s, r, a, n, h) {
                var o = this.sprite;
                return !!t._getSource(function() {
                    o && o.repaint()
                }) && this._inner_drawTexture(t, t.bitmap.id, e, i, s, r, a, h, n, !1)
            }
            _drawRenderTexture(t, e, i, s, r, a, n, h) {
                return this._inner_drawTexture(t, -1, e, i, s, r, a, h, 1, !1)
            }
            submitDebugger() {
                this._submits[this._submits._length++] = $.create([], function() {}, this)
            }
            _copyClipInfo(t, e) {
                var i = t.shaderValue.clipMatDir;
                i[0] = e.a, i[1] = e.b, i[2] = e.c, i[3] = e.d;
                var s = t.shaderValue.clipMatPos;
                s[0] = e.tx, s[1] = e.ty, t.clipInfoID = this._clipInfoID, this._clipInCache && (t.shaderValue.clipOff[0] = 1)
            }
            isSameClipInfo(t) {
                return t.clipInfoID === this._clipInfoID
            }
            _useNewTex2DSubmit(t, e) {
                this._mesh.vertNum + e > le._MAXVERTNUM && (this._mesh = Mt.getAMesh(this.isMain), this.meshlist.push(this._mesh));
                var i = jt.create(this, this._mesh, Z.create(H.TEXTURE2D, 0));
                this._submits[this._submits._length++] = this._curSubmit = i, i.shaderValue.textureHost = t, this._copyClipInfo(i, this._globalClipMatrix)
            }
            _drawTexRect(t, e, i, s, r) {
                this.transformQuad(t, e, i, s, this._italicDeg, this._curMat, this._transedPoints);
                var a = this._transedPoints;
                a[0] = a[0] + .5 | 0, a[1] = a[1] + .5 | 0, a[2] = a[2] + .5 | 0, a[3] = a[3] + .5 | 0, a[4] = a[4] + .5 | 0, a[5] = a[5] + .5 | 0, a[6] = a[6] + .5 | 0, a[7] = a[7] + .5 | 0, this.clipedOff(this._transedPoints) || (this._mesh.addQuad(this._transedPoints, r, this._fillColor, !0), this._curSubmit._numEle += 6, this._mesh.indexNum += 6, this._mesh.vertNum += 4)
            }
            drawCallOptimize(t) {
                return this._charSubmitCache.enable(t, this), t
            }
            _inner_drawTexture(t, e, i, s, r, a, n, h, o, l) {
                if (r <= 0 || a <= 0) return !1;
                var _ = this._curSubmit._key;
                if (h = h || t._uv, _.submitType === ft.KEY_TRIANGLES && _.other === e) {
                    var u = this._drawTexToDrawTri_Vert;
                    u[0] = i, u[1] = s, u[2] = i + r, u[3] = s, u[4] = i + r, u[5] = s + a, u[6] = i, u[7] = s + a, this._drawTriUseAbsMatrix = !0;
                    var c = this._tempUV;
                    return c[0] = h[0], c[1] = h[1], c[2] = h[2], c[3] = h[3], c[4] = h[4], c[5] = h[5], c[6] = h[6], c[7] = h[7], this.drawTriangles(t, 0, 0, u, c, this._drawTexToDrawTri_Index, n || this._curMat, o, null, null), this._drawTriUseAbsMatrix = !1, !0
                }
                var d = this._mesh,
                    p = this._curSubmit,
                    f = l ? this._charSubmitCache.getPos() : this._transedPoints;
                if (this.transformQuad(i, s, r || t.width, a || t.height, this._italicDeg, n || this._curMat, f), this.drawTexAlign) {
                    var m = Math.round;
                    f[0] = m(f[0]), f[1] = m(f[1]), f[2] = m(f[2]), f[3] = m(f[3]), f[4] = m(f[4]), f[5] = m(f[5]), f[6] = m(f[6]), f[7] = m(f[7]), this.drawTexAlign = !1
                }
                var g = this._mixRGBandAlpha(4294967295, this._shader2D.ALPHA * o);
                if (l) return this._charSubmitCache.add(this, t, e, f, h, g), !0;
                this._drawCount++;
                var T = e >= 0 && _.submitType === ft.KEY_DRAWTEXTURE && _.other === e;
                return T && (T = T && this.isSameClipInfo(p)), this._lastTex = t, d.vertNum + 4 > le._MAXVERTNUM && (d = this._mesh = Mt.getAMesh(this.isMain), this.meshlist.push(d), T = !1), d.addQuad(f, h, g, !0), T || (this._submits[this._submits._length++] = this._curSubmit = p = jt.create(this, d, Z.create(H.TEXTURE2D, 0)), p.shaderValue.textureHost = t, p._key.other = e, this._copyClipInfo(p, this._globalClipMatrix)), p._numEle += 6, d.indexNum += 6, d.vertNum += 4, !0
            }
            transform4Points(t, e, i) {
                var s = e.tx,
                    r = e.ty,
                    a = e.a,
                    n = e.b,
                    h = e.c,
                    o = e.d,
                    l = t[0],
                    _ = t[1],
                    u = t[2],
                    c = t[3],
                    d = t[4],
                    p = t[5],
                    f = t[6],
                    m = t[7];
                e._bTransform ? (i[0] = l * a + _ * h + s, i[1] = l * n + _ * o + r, i[2] = u * a + c * h + s, i[3] = u * n + c * o + r, i[4] = d * a + p * h + s, i[5] = d * n + p * o + r, i[6] = f * a + m * h + s, i[7] = f * n + m * o + r) : (i[0] = l + s, i[1] = _ + r, i[2] = u + s, i[3] = c + r, i[4] = d + s, i[5] = p + r, i[6] = f + s, i[7] = m + r)
            }
            clipedOff(t) {
                return this._clipRect.width <= 0 || this._clipRect.height <= 0
            }
            transformQuad(t, e, i, s, r, a, n) {
                var h = 0;
                0 != r && (h = Math.tan(r * Math.PI / 180) * s);
                var o = t + i,
                    l = e + s,
                    _ = a.tx,
                    u = a.ty,
                    c = a.a,
                    d = a.b,
                    p = a.c,
                    f = a.d,
                    m = t + h,
                    g = e,
                    T = o + h,
                    v = e,
                    x = o,
                    y = l,
                    E = t,
                    A = l;
                a._bTransform ? (n[0] = m * c + g * p + _, n[1] = m * d + g * f + u, n[2] = T * c + v * p + _, n[3] = T * d + v * f + u, n[4] = x * c + y * p + _, n[5] = x * d + y * f + u, n[6] = E * c + A * p + _, n[7] = E * d + A * f + u) : (n[0] = m + _, n[1] = g + u, n[2] = T + _, n[3] = v + u, n[4] = x + _, n[5] = y + u, n[6] = E + _, n[7] = A + u)
            }
            pushRT() {
                this.addRenderObject($.create(null, W.pushRT, this))
            }
            popRT() {
                this.addRenderObject($.create(null, W.popRT, this)), this.breakNextMerge()
            }
            useRT(t) {
                function e(t) {
                    if (!t) throw "error useRT";
                    t.start(), t.clear(0, 0, 0, 0)
                }
                this.addRenderObject($.create([t], e, this)), this.breakNextMerge()
            }
            RTRestore(t) {
                function e(t) {
                    t.restore()
                }
                this.addRenderObject($.create([t], e, this)), this.breakNextMerge()
            }
            breakNextMerge() {
                this._curSubmit = ft.RENDERBASE
            }
            _repaintSprite() {
                this.sprite && this.sprite.repaint()
            }
            drawTextureWithTransform(t, e, i, s, r, a, n, h, o, l, _ = null, u) {
                var c, d = this._curMat;
                l && (c = this.globalCompositeOperation, this.globalCompositeOperation = l);
                var p = this._colorFiler;
                if (_ && this.setColorFilter(_), !a) return this._drawTextureM(t, e + n, i + h, s, r, d, o, u), l && (this.globalCompositeOperation = c), void(_ && this.setColorFilter(p));
                var m = this._tmpMatrix;
                m.a = a.a, m.b = a.b, m.c = a.c, m.d = a.d, m.tx = a.tx + n, m.ty = a.ty + h, m._bTransform = a._bTransform, a && d._bTransform ? (f.mul(m, d, m), a = m, a._bTransform = !0) : (m.tx += d.tx, m.ty += d.ty, a = m), this._drawTextureM(t, e, i, s, r, a, o, u), l && (this.globalCompositeOperation = c), _ && this.setColorFilter(p)
            }
            _flushToTarget(t, e) {
                k.worldScissorTest = !1;
                var i = T.instance;
                i.disable(i.SCISSOR_TEST);
                var r = k.worldAlpha,
                    a = k.worldMatrix4,
                    n = k.worldMatrix;
                k.worldMatrix = f.EMPTY, k.restoreTempArray(), k.worldMatrix4 = k.TEMPMAT4_ARRAY, k.worldAlpha = 1, G.activeShader = null, s.Browser.onIOS && i.flush(), e.start(), t._submits._length > 0 && e.clear(0, 0, 0, 0), t._curSubmit = ft.RENDERBASE, t.flush(), t.clear(), e.restore(), t._curSubmit = ft.RENDERBASE, G.activeShader = null, k.worldAlpha = r, k.worldMatrix4 = a, k.worldMatrix = n
            }
            drawCanvas(t, e, i, s, r) {
                if (t) {
                    var a, n = t.context;
                    if (n._targets) n._submits._length > 0 && (a = $.create([n, n._targets], this._flushToTarget, this), this._submits[this._submits._length++] = a), this._drawRenderTexture(n._targets, e, i, s, r, null, 1, W.flipyuv), this._curSubmit = ft.RENDERBASE;
                    else {
                        var h = t;
                        h.touches && h.touches.forEach(function(t) {
                            t.touch()
                        }), a = zt.create(t, this._shader2D.ALPHA, this._shader2D.filters), this._submits[this._submits._length++] = a, a._key.clear();
                        var o = a._matrix;
                        this._curMat.copyTo(o);
                        var l = o.tx,
                            _ = o.ty;
                        o.tx = o.ty = 0, o.transformPoint(m.TEMP.setTo(e, i)),
                            o.translate(m.TEMP.x + l, m.TEMP.y + _), f.mul(h.invMat, o, o), this._curSubmit = ft.RENDERBASE
                    }
                }
            }
            drawTarget(t, e, i, s, r, a, n, h = null, o = -1) {
                if (this._drawCount++, this._mesh.vertNum + 4 > le._MAXVERTNUM && (this._mesh = Mt.getAMesh(this.isMain), this.meshlist.push(this._mesh)), this.transformQuad(e, i, s, r, 0, a || this._curMat, this._transedPoints), !this.clipedOff(this._transedPoints)) {
                    this._mesh.addQuad(this._transedPoints, h || te.DEF_UV, 4294967295, !0);
                    var l = this._curSubmit = Kt.create(this, this._mesh, n, t);
                    return l.blendType = -1 == o ? this._nBlendType : o, this._copyClipInfo(l, this._globalClipMatrix), l._numEle = 6, this._mesh.indexNum += 6, this._mesh.vertNum += 4, this._submits[this._submits._length++] = l, this._curSubmit = ft.RENDERBASE, !0
                }
                return this._curSubmit = ft.RENDERBASE, !1
            }
            drawTriangles(t, e, i, r, a, n, h, o, l, _, u = 4294967295) {
                if (t._getSource()) {
                    var c = null;
                    _ && (c = this.globalCompositeOperation, this.globalCompositeOperation = _), this._drawCount++;
                    var d = this._tmpMatrix,
                        p = this._triangleMesh,
                        m = null,
                        g = !1;
                    l && (m = this._colorFiler, this._colorFiler = l, this._curSubmit = ft.RENDERBASE, g = m != l);
                    var T = t.bitmap,
                        v = this._curSubmit._key,
                        x = v.submitType === ft.KEY_TRIANGLES && v.other === T.id && v.blendShader == this._nBlendType;
                    if (p.vertNum + r.length / 2 > le._MAXVERTNUM && (p = this._triangleMesh = It.getAMesh(this.isMain), this.meshlist.push(p), x = !1), !x) {
                        var y = this._curSubmit = jt.create(this, p, Z.create(H.TEXTURE2D, 0));
                        y.shaderValue.textureHost = t, y._renderType = ft.TYPE_TEXTURE, y._key.submitType = ft.KEY_TRIANGLES, y._key.other = T.id, this._copyClipInfo(y, this._globalClipMatrix), this._submits[this._submits._length++] = y
                    }
                    var E = this._mixRGBandAlpha(u, this._shader2D.ALPHA * o);
                    this._drawTriUseAbsMatrix ? p.addData(r, a, n, h, E) : (h ? (d.a = h.a, d.b = h.b, d.c = h.c, d.d = h.d, d.tx = h.tx + e, d.ty = h.ty + i) : (d.a = 1, d.b = 0, d.c = 0, d.d = 1, d.tx = e, d.ty = i), f.mul(d, this._curMat, d), p.addData(r, a, n, d || this._curMat, E)), this._curSubmit._numEle += n.length, g && (this._colorFiler = m, this._curSubmit = ft.RENDERBASE), _ && (this.globalCompositeOperation = c)
                } else this.sprite && s.systemTimer.callLater(this, this._repaintSprite)
            }
            transform(t, e, i, s, r, a) {
                vt.save(this), f.mul(f.TEMP.setTo(t, e, i, s, r, a), this._curMat, this._curMat), this._curMat._checkTransform()
            }
            _transformByMatrix(t, e, i) {
                t.setTranslate(e, i), f.mul(t, this._curMat, this._curMat), t.setTranslate(0, 0), this._curMat._bTransform = !0
            }
            setTransformByMatrix(t) {
                t.copyTo(this._curMat)
            }
            rotate(t) {
                vt.save(this), this._curMat.rotateEx(t)
            }
            scale(t, e) {
                vt.save(this), this._curMat.scaleEx(t, e)
            }
            clipRect(t, e, i, s) {
                gt.save(this), this._clipRect == le.MAXCLIPRECT ? this._clipRect = new g(t, e, i, s) : (this._clipRect.width = i, this._clipRect.height = s, this._clipRect.x = t, this._clipRect.y = e), this._clipID_Gen++, this._clipID_Gen %= 1e4, this._clipInfoID = this._clipID_Gen;
                var r = this._globalClipMatrix,
                    a = r.tx,
                    n = r.ty,
                    h = a + r.a,
                    o = n + r.d;
                if (this._clipRect.width >= le._MAXSIZE ? (r.a = r.d = le._MAXSIZE, r.b = r.c = r.tx = r.ty = 0) : (this._curMat._bTransform ? (r.tx = this._clipRect.x * this._curMat.a + this._clipRect.y * this._curMat.c + this._curMat.tx, r.ty = this._clipRect.x * this._curMat.b + this._clipRect.y * this._curMat.d + this._curMat.ty, r.a = this._clipRect.width * this._curMat.a, r.b = this._clipRect.width * this._curMat.b, r.c = this._clipRect.height * this._curMat.c, r.d = this._clipRect.height * this._curMat.d) : (r.tx = this._clipRect.x + this._curMat.tx, r.ty = this._clipRect.y + this._curMat.ty, r.a = this._clipRect.width, r.b = r.c = 0, r.d = this._clipRect.height), this._incache && (this._clipInCache = !0)), r.a > 0 && r.d > 0) {
                    var l = r.tx + r.a,
                        _ = r.ty + r.d;
                    l <= a || _ <= n || r.tx >= h || r.ty >= o ? (r.a = -.1, r.d = -.1) : (r.tx < a && (r.a -= a - r.tx, r.tx = a), l > h && (r.a -= l - h), r.ty < n && (r.d -= n - r.ty, r.ty = n), _ > o && (r.d -= _ - o), r.a <= 0 && (r.a = -.1), r.d <= 0 && (r.d = -.1))
                }
            }
            drawMesh(t, e, i, s, r, a, n, h, o = 0) {}
            addRenderObject(t) {
                this._submits[this._submits._length++] = t
            }
            submitElement(t, e) {
                this.isMain;
                var i = this._submits,
                    s = i._length;
                e < 0 && (e = i._length);
                for (var r = ft.RENDERBASE; t < e;) this._renderNextSubmitIndex = t + 1, i[t] !== ft.RENDERBASE ? (ft.preRender = r, r = i[t], t += r.renderSubmit()) : t++;
                return s
            }
            flush() {
                this._clipID_Gen = 0;
                var t = this.submitElement(0, this._submits._length);
                this._path && this._path.reset(), kt.instance && kt.getInstance().reset(), this._curSubmit = ft.RENDERBASE;
                for (var e = 0, i = this.meshlist.length; e < i; e++) {
                    var s = this.meshlist[e];
                    s.canReuse ? s.releaseMesh() : s.destroy()
                }
                return this.meshlist.length = 0, this._mesh = Mt.getAMesh(this.isMain), this._pathMesh = Pt.getAMesh(this.isMain), this._triangleMesh = It.getAMesh(this.isMain), this.meshlist.push(this._mesh, this._pathMesh, this._triangleMesh), this._flushCnt++, this._flushCnt % 60 == 0 && this.isMain && oe.textRenderInst && oe.textRenderInst.GC(), t
            }
            beginPath(t = !1) {
                var e = this._getPath();
                e.beginPath(t)
            }
            closePath() {
                this._path.closePath()
            }
            addPath(t, e, i, s, r) {
                for (var a = 0, n = 0, h = t.length / 2; n < h; n++) {
                    var o = t[a] + s,
                        l = t[a + 1] + r;
                    t[a] = o, t[a + 1] = l, a += 2
                }
                this._getPath().push(t, i)
            }
            fill() {
                var t = this._curMat,
                    e = this._getPath(),
                    i = this._curSubmit,
                    s = i._key.submitType === ft.KEY_VG && i._key.blendShader === this._nBlendType;
                s && (s = s && this.isSameClipInfo(i)), s || (this._curSubmit = this.addVGSubmit(this._pathMesh));
                for (var r, a = this.mixRGBandAlpha(this.fillStyle.toInt()), n = 0, h = 0, o = e.paths.length; h < o; h++) {
                    var l = e.paths[h],
                        _ = l.path.length / 2;
                    if (!(_ < 3 || 3 == _ && !l.convex)) {
                        var u, c, d, p, f = l.path.concat(),
                            m = 0;
                        if (t._bTransform)
                            for (m = 0; m < _; m++) u = m << 1, c = u + 1, d = f[u], p = f[c], f[u] = t.a * d + t.c * p + t.tx, f[c] = t.b * d + t.d * p + t.ty;
                        else
                            for (m = 0; m < _; m++) u = m << 1, c = u + 1, d = f[u], p = f[c], f[u] = d + t.tx, f[c] = p + t.ty;
                        this._pathMesh.vertNum + _ > le._MAXVERTNUM && (this._curSubmit._numEle += n, n = 0, this._pathMesh = Pt.getAMesh(this.isMain), this._curSubmit = this.addVGSubmit(this._pathMesh));
                        var g = this._pathMesh.vertNum;
                        if (l.convex) {
                            var T = _ - 2;
                            r = new Array(3 * T);
                            for (var v = 0, x = 0; x < T; x++) r[v++] = g, r[v++] = x + 1 + g, r[v++] = x + 2 + g
                        } else if (r = Vt.earcut(f, null, 2), g > 0)
                            for (var y = 0; y < r.length; y++) r[y] += g;
                        this._pathMesh.addVertAndIBToMesh(this, f, a, r), n += r.length
                    }
                }
                this._curSubmit._numEle += n
            }
            addVGSubmit(t) {
                var e = Ht.createShape(this, t, 0, Z.create(H.PRIMITIVE, 0));
                return e._key.submitType = ft.KEY_VG, this._submits[this._submits._length++] = e, this._copyClipInfo(e, this._globalClipMatrix), e
            }
            stroke() {
                if (this.lineWidth > 0) {
                    var t = this.mixRGBandAlpha(this.strokeStyle._color.numColor),
                        e = this._getPath(),
                        i = this._curSubmit,
                        s = i._key.submitType === ft.KEY_VG && i._key.blendShader === this._nBlendType;
                    s && (s = s && this.isSameClipInfo(i)), s || (this._curSubmit = this.addVGSubmit(this._pathMesh));
                    for (var r = 0, a = 0, n = e.paths.length; a < n; a++) {
                        var h = e.paths[a];
                        if (!(h.path.length <= 0)) {
                            var o = [],
                                l = [],
                                _ = 2 * h.path.length;
                            if (!(_ < 2)) {
                                this._pathMesh.vertNum + _ > le._MAXVERTNUM && (this._curSubmit._numEle += r, r = 0, this._pathMesh = Pt.getAMesh(this.isMain), this.meshlist.push(this._pathMesh), this._curSubmit = this.addVGSubmit(this._pathMesh)), Wt.createLine2(h.path, o, this.lineWidth, this._pathMesh.vertNum, l, h.loop);
                                var u, c, d, p, f = l.length / 2,
                                    m = this._curMat,
                                    g = 0;
                                if (m._bTransform)
                                    for (g = 0; g < f; g++) u = g << 1, c = u + 1, d = l[u], p = l[c], l[u] = m.a * d + m.c * p + m.tx, l[c] = m.b * d + m.d * p + m.ty;
                                else
                                    for (g = 0; g < f; g++) u = g << 1, c = u + 1, d = l[u], p = l[c], l[u] = d + m.tx, l[c] = p + m.ty;
                                this._pathMesh.addVertAndIBToMesh(this, l, t, o), r += o.length
                            }
                        }
                    }
                    this._curSubmit._numEle += r
                }
            }
            moveTo(t, e) {
                var i = this._getPath();
                i.newPath(), i._lastOriX = t, i._lastOriY = e, i.addPoint(t, e)
            }
            lineTo(t, e) {
                var i = this._getPath();
                Math.abs(t - i._lastOriX) < .001 && Math.abs(e - i._lastOriY) < .001 || (i._lastOriX = t, i._lastOriY = e, i.addPoint(t, e))
            }
            arcTo(t, e, i, s, r) {
                var a = 0,
                    n = 0,
                    h = 0,
                    o = this._path._lastOriX - t,
                    l = this._path._lastOriY - e,
                    _ = Math.sqrt(o * o + l * l);
                if (!(_ <= 1e-6)) {
                    var u = o / _,
                        c = l / _,
                        d = i - t,
                        p = s - e,
                        f = d * d + p * p,
                        m = Math.sqrt(f);
                    if (!(m <= 1e-6)) {
                        var g = d / m,
                            T = p / m,
                            v = u + g,
                            x = c + T,
                            y = Math.sqrt(v * v + x * x);
                        if (!(y <= 1e-6)) {
                            var E = v / y,
                                A = x / y,
                                C = Math.acos(E * u + A * c),
                                R = Math.PI / 2 - C;
                            _ = r * Math.tan(R);
                            var b = _ * u + t,
                                S = _ * c + e,
                                w = Math.sqrt(_ * _ + r * r),
                                M = t + E * w,
                                I = e + A * w,
                                P = u * T - c * g,
                                D = 0,
                                L = 0,
                                B = 0;
                            if (P >= 0) {
                                D = 2 * R;
                                var F = D / le.SEGNUM;
                                L = Math.sin(F), B = Math.cos(F)
                            } else D = 2 * -R, F = D / le.SEGNUM, L = Math.sin(F), B = Math.cos(F);
                            var O = this._path._lastOriX,
                                N = this._path._lastOriY,
                                U = b,
                                G = S;
                            (Math.abs(U - this._path._lastOriX) > .1 || Math.abs(G - this._path._lastOriY) > .1) && (n = U, h = G, O = U, N = G, this._path._lastOriX = n, this._path._lastOriY = h, this._path.addPoint(n, h));
                            var k = b - M,
                                W = S - I;
                            for (a = 0; a < le.SEGNUM; a++) {
                                var Y = k * B + W * L,
                                    V = -k * L + W * B;
                                n = Y + M, h = V + I, (Math.abs(O - n) > .1 || Math.abs(N - h) > .1) && (this._path._lastOriX = n, this._path._lastOriY = h, this._path.addPoint(n, h), O = n, N = h), k = Y, W = V
                            }
                        }
                    }
                }
            }
            arc(t, e, i, s, r, a = !1, n = !0) {
                var h, o, l = 0,
                    _ = 0,
                    u = 0,
                    c = 0,
                    d = 0,
                    p = 0;
                if (_ = r - s, a)
                    if (Math.abs(_) >= 2 * Math.PI) _ = 2 * -Math.PI;
                    else
                        for (; _ > 0;) _ -= 2 * Math.PI;
                else if (Math.abs(_) >= 2 * Math.PI) _ = 2 * Math.PI;
                else
                    for (; _ < 0;) _ += 2 * Math.PI;
                var f = this.getMatScaleX(),
                    m = this.getMatScaleY(),
                    g = i * (f > m ? f : m),
                    T = 2 * Math.PI * g;
                o = 0 | Math.max(T / 10, 10);
                var v = this._getPath();
                for (h = 0; h <= o; h++) l = s + _ * (h / o), u = Math.cos(l), c = Math.sin(l), d = t + u * i, p = e + c * i, d == this._path._lastOriX && p == this._path._lastOriY || v.addPoint(d, p);
                u = Math.cos(r), c = Math.sin(r), d = t + u * i, p = e + c * i, d == this._path._lastOriX && p == this._path._lastOriY || v.addPoint(d, p)
            }
            quadraticCurveTo(t, e, i, s) {
                for (var r = _t.I, a = r.getBezierPoints([this._path._lastOriX, this._path._lastOriY, t, e, i, s], 30, 2), n = 0, h = a.length / 2; n < h; n++) this.lineTo(a[2 * n], a[2 * n + 1]);
                this.lineTo(i, s)
            }
            mixRGBandAlpha(t) {
                return this._mixRGBandAlpha(t, this._shader2D.ALPHA)
            }
            _mixRGBandAlpha(t, e) {
                if (e >= 1) return t;
                var i = (4278190080 & t) >>> 24;
                return 0 != i ? i *= e : i = 255 * e, 16777215 & t | i << 24
            }
            strokeRect(t, e, i, s, r) {
                if (this.lineWidth > 0) {
                    var a = this.mixRGBandAlpha(this.strokeStyle._color.numColor),
                        n = this.lineWidth / 2;
                    this._fillRect(t - n, e - n, i + this.lineWidth, this.lineWidth, a), this._fillRect(t - n, e - n + s, i + this.lineWidth, this.lineWidth, a), this._fillRect(t - n, e + n, this.lineWidth, s - this.lineWidth, a), this._fillRect(t - n + i, e + n, this.lineWidth, s - this.lineWidth, a)
                }
            }
            clip() {}
            drawParticle(t, e, i) {
                i.x = t, i.y = e, this._submits[this._submits._length++] = i
            }
            _getPath() {
                return this._path || (this._path = new dt)
            }
            get canvas() {
                return this._canvas
            }
            _fillTexture_h(t, e, i, s, r, a, n, h) {
                s <= 0 && console.error("_fillTexture_h error: oriw must>0");
                for (var o = a, l = Math.floor(h / s), _ = h % s, u = 0; u < l; u++) this._inner_drawTexture(t, e, o, n, s, r, this._curMat, i, 1, !1), o += s;
                if (_ > 0) {
                    var c = i[2] - i[0],
                        d = i[0] + c * (_ / s),
                        p = le.tmpuv1;
                    p[0] = i[0], p[1] = i[1], p[2] = d, p[3] = i[3], p[4] = d, p[5] = i[5], p[6] = i[6], p[7] = i[7], this._inner_drawTexture(t, e, o, n, _, r, this._curMat, p, 1, !1)
                }
            }
            _fillTexture_v(t, e, i, s, r, a, n, h) {
                r <= 0 && console.error("_fillTexture_v error: orih must>0");
                for (var o = n, l = Math.floor(h / r), _ = h % r, u = 0; u < l; u++) this._inner_drawTexture(t, e, a, o, s, r, this._curMat, i, 1, !1), o += r;
                if (_ > 0) {
                    var c = i[7] - i[1],
                        d = i[1] + c * (_ / r),
                        p = le.tmpuv1;
                    p[0] = i[0], p[1] = i[1], p[2] = i[2], p[3] = i[3], p[4] = i[4], p[5] = d, p[6] = i[6], p[7] = d, this._inner_drawTexture(t, e, a, o, s, _, this._curMat, p, 1, !1)
                }
            }
            drawTextureWithSizeGrid(t, e, i, s, r, a, n, h) {
                if (t._getSource()) {
                    e += n, i += h;
                    var o = t.uv,
                        l = t.bitmap.width,
                        _ = t.bitmap.height,
                        u = t.sourceWidth,
                        c = t.sourceHeight,
                        d = a[0],
                        p = a[3],
                        f = a[1],
                        m = a[2],
                        g = a[4];
                    s == u && (p = f = 0), r == c && (d = m = 0);
                    var T = d / _,
                        v = p / l,
                        x = f / l,
                        y = m / _,
                        E = t.bitmap.id,
                        A = this._curMat,
                        C = this._tempUV,
                        R = 1,
                        b = 1;
                    p + f > s && (R = s / (p + f)), d + m > r && (b = r / (d + m)), p *= R, f *= R, d *= b, m *= b;
                    var S = o[0],
                        w = o[1],
                        M = o[4],
                        I = o[5],
                        P = S,
                        D = w,
                        L = M,
                        B = I;
                    if (p && d && (L = S + v, B = w + T, C[0] = S, C[1] = w, C[2] = L, C[3] = w, C[4] = L, C[5] = B, C[6] = S, C[7] = B, this._inner_drawTexture(t, E, e, i, p, d, A, C, 1, !1)), f && d && (P = M - x, D = w, L = M, B = w + T, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, this._inner_drawTexture(t, E, s - f + e, 0 + i, f, d, A, C, 1, !1)), p && m && (P = S, D = I - y, L = S + v, B = I, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, this._inner_drawTexture(t, E, 0 + e, r - m + i, p, m, A, C, 1, !1)), f && m && (P = M - x, D = I - y, L = M, B = I, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, this._inner_drawTexture(t, E, s - f + e, r - m + i, f, m, A, C, 1, !1)), d && (P = S + v, D = w, L = M - x, B = w + T, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, g ? this._fillTexture_h(t, E, C, t.width - p - f, d, p + e, i, s - p - f) : this._inner_drawTexture(t, E, p + e, i, s - p - f, d, A, C, 1, !1)), m && (P = S + v, D = I - y, L = M - x, B = I, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, g ? this._fillTexture_h(t, E, C, t.width - p - f, m, p + e, r - m + i, s - p - f) : this._inner_drawTexture(t, E, p + e, r - m + i, s - p - f, m, A, C, 1, !1)), p && (P = S, D = w + T, L = S + v, B = I - y, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, g ? this._fillTexture_v(t, E, C, p, t.height - d - m, e, d + i, r - d - m) : this._inner_drawTexture(t, E, e, d + i, p, r - d - m, A, C, 1, !1)), f && (P = M - x, D = w + T, L = M, B = I - y, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, g ? this._fillTexture_v(t, E, C, f, t.height - d - m, s - f + e, d + i, r - d - m) : this._inner_drawTexture(t, E, s - f + e, d + i, f, r - d - m, A, C, 1, !1)), P = S + v, D = w + T, L = M - x, B = I - y, C[0] = P, C[1] = D, C[2] = L, C[3] = D, C[4] = L, C[5] = B, C[6] = P, C[7] = B, g) {
                        var F = le.tmpUVRect;
                        F[0] = P, F[1] = D, F[2] = L - P, F[3] = B - D, this._fillTexture(t, t.width - p - f, t.height - d - m, F, p + e, d + i, s - p - f, r - d - m, "repeat", 0, 0)
                    } else this._inner_drawTexture(t, E, p + e, d + i, s - p - f, r - d - m, A, C, 1, !1)
                }
            }
        }
        le.ENUM_TEXTALIGN_DEFAULT = 0, le.ENUM_TEXTALIGN_CENTER = 1, le.ENUM_TEXTALIGN_RIGHT = 2, le._SUBMITVBSIZE = 32e3, le._MAXSIZE = 99999999, le._MAXVERTNUM = 65535, le.MAXCLIPRECT = null, le._COUNT = 0, le.SEGNUM = 32, le._contextcount = 0, le.PI2 = 2 * Math.PI, le._textRender = null, le.tmpuv1 = [0, 0, 0, 0, 0, 0, 0, 0], le.tmpUV = [0, 0, 0, 0, 0, 0, 0, 0], le.tmpUVRect = [0, 0, 0, 0];
        class _e {
            constructor() {
                this.lineWidth = 1
            }
            clear() {
                this.lineWidth = 1, this.textAlign = this.textBaseline = null
            }
            make() {
                return this === _e.DEFAULT ? new _e : this
            }
        }
        class ue {
            static _uint8ArraySlice() {
                for (var t = this, e = t.length, i = new Uint8Array(t.length), s = 0; s < e; s++) i[s] = t[s];
                return i
            }
            static _float32ArraySlice() {
                for (var t = this, e = t.length, i = new Float32Array(t.length), s = 0; s < e; s++) i[s] = t[s];
                return i
            }
            static _uint16ArraySlice(...t) {
                var e, i, s, r = this;
                if (0 === t.length)
                    for (e = r.length, i = new Uint16Array(e), s = 0; s < e; s++) i[s] = r[s];
                else if (2 === t.length) {
                    var a = t[0],
                        n = t[1];
                    if (n > a)
                        for (e = n - a, i = new Uint16Array(e), s = a; s < n; s++) i[s - a] = r[s];
                    else i = new Uint16Array(0)
                }
                return i
            }
            static _nativeRender_enable() {}
            static enable() {
                return !0
            }
            static inner_enable() {
                return Float32Array.prototype.slice || (Float32Array.prototype.slice = ue._float32ArraySlice), Uint16Array.prototype.slice || (Uint16Array.prototype.slice = ue._uint16ArraySlice), Uint8Array.prototype.slice || (Uint8Array.prototype.slice = ue._uint8ArraySlice), !0
            }
            static onStageResize(t, e) {
                null != S.mainContext && (S.mainContext.viewport(0, 0, t, e), k.width = t, k.height = e)
            }
        }
        ue._isWebGL2 = !1, ue.isNativeRender_enable = !1;
        class ce {
            constructor() {}
        }(function() {
            function t(t) {
                window.console && window.console.error && window.console.error(t)
            }

            function e(t) {
                window.console && window.console.log && window.console.log(t)
            }

            function i(e, i) {
                r[e] = !0, void 0 !== i && t(i)
            }

            function s(t) {
                var e = t.getError;
                t.getError = function() {
                    var i;
                    do {
                        i = e.apply(t), i != t.NO_ERROR && (r[i] = !0)
                    } while (i != t.NO_ERROR);
                    for (var s in r)
                        if (r[s]) return delete r[s], parseInt(s);
                    return t.NO_ERROR
                }
            }
            var r = {},
                a = function t(e) {
                    var i = e.gl;
                    this.ext = e, this.isAlive = !0, this.hasBeenBound = !1, this.elementArrayBuffer = null, this.attribs = new Array(e.maxVertexAttribs);
                    for (var s = 0; s < this.attribs.length; s++) {
                        var r = new t.VertexAttrib(i);
                        this.attribs[s] = r
                    }
                    this.maxAttrib = 0
                };
            a.VertexAttrib = function(t) {
                this.enabled = !1, this.buffer = null, this.size = 4, this.type = t.FLOAT, this.normalized = !1, this.stride = 16, this.offset = 0, this.cached = "", this.recache()
            }, a.VertexAttrib.prototype.recache = function() {
                this.cached = [this.size, this.type, this.normalized, this.stride, this.offset].join(":")
            };
            var n = function(t) {
                var i = this;
                this.gl = t, s(t);
                var r = this.original = {
                    getParameter: t.getParameter,
                    enableVertexAttribArray: t.enableVertexAttribArray,
                    disableVertexAttribArray: t.disableVertexAttribArray,
                    bindBuffer: t.bindBuffer,
                    getVertexAttrib: t.getVertexAttrib,
                    vertexAttribPointer: t.vertexAttribPointer
                };
                t.getParameter = function(t) {
                    return t == i.VERTEX_ARRAY_BINDING_OES ? i.currentVertexArrayObject == i.defaultVertexArrayObject ? null : i.currentVertexArrayObject : r.getParameter.apply(this, arguments)
                }, t.enableVertexAttribArray = function(t) {
                    var e = i.currentVertexArrayObject;
                    e.maxAttrib = Math.max(e.maxAttrib, t);
                    var s = e.attribs[t];
                    return s.enabled = !0, r.enableVertexAttribArray.apply(this, arguments)
                }, t.disableVertexAttribArray = function(t) {
                    var e = i.currentVertexArrayObject;
                    e.maxAttrib = Math.max(e.maxAttrib, t);
                    var s = e.attribs[t];
                    return s.enabled = !1, r.disableVertexAttribArray.apply(this, arguments)
                }, t.bindBuffer = function(e, s) {
                    switch (e) {
                        case t.ARRAY_BUFFER:
                            i.currentArrayBuffer = s;
                            break;
                        case t.ELEMENT_ARRAY_BUFFER:
                            i.currentVertexArrayObject.elementArrayBuffer = s
                    }
                    return r.bindBuffer.apply(this, arguments)
                }, t.getVertexAttrib = function(e, s) {
                    var a = i.currentVertexArrayObject,
                        n = a.attribs[e];
                    switch (s) {
                        case t.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:
                            return n.buffer;
                        case t.VERTEX_ATTRIB_ARRAY_ENABLED:
                            return n.enabled;
                        case t.VERTEX_ATTRIB_ARRAY_SIZE:
                            return n.size;
                        case t.VERTEX_ATTRIB_ARRAY_STRIDE:
                            return n.stride;
                        case t.VERTEX_ATTRIB_ARRAY_TYPE:
                            return n.type;
                        case t.VERTEX_ATTRIB_ARRAY_NORMALIZED:
                            return n.normalized;
                        default:
                            return r.getVertexAttrib.apply(this, arguments)
                    }
                }, t.vertexAttribPointer = function(t, e, s, a, n, h) {
                    var o = i.currentVertexArrayObject;
                    o.maxAttrib = Math.max(o.maxAttrib, t);
                    var l = o.attribs[t];
                    return l.buffer = i.currentArrayBuffer, l.size = e, l.type = s, l.normalized = a, l.stride = n, l.offset = h, l.recache(), r.vertexAttribPointer.apply(this, arguments)
                }, t.instrumentExtension && t.instrumentExtension(this, "OES_vertex_array_object"), t.canvas.addEventListener("webglcontextrestored", function() {
                    e("OESVertexArrayObject emulation library context restored"), i.reset_()
                }, !0), this.reset_()
            };
            n.prototype.VERTEX_ARRAY_BINDING_OES = 34229, n.prototype.reset_ = function() {
                var t = void 0 !== this.vertexArrayObjects;
                if (t)
                    for (var e = 0; e < this.vertexArrayObjects.length; ++e) this.vertexArrayObjects.isAlive = !1;
                var i = this.gl;
                this.maxVertexAttribs = i.getParameter(i.MAX_VERTEX_ATTRIBS), this.defaultVertexArrayObject = new a(this), this.currentVertexArrayObject = null, this.currentArrayBuffer = null, this.vertexArrayObjects = [this.defaultVertexArrayObject], this.bindVertexArrayOES(null)
            }, n.prototype.createVertexArrayOES = function() {
                var t = new a(this);
                return this.vertexArrayObjects.push(t), t
            }, n.prototype.deleteVertexArrayOES = function(t) {
                t.isAlive = !1, this.vertexArrayObjects.splice(this.vertexArrayObjects.indexOf(t), 1), this.currentVertexArrayObject == t && this.bindVertexArrayOES(null)
            }, n.prototype.isVertexArrayOES = function(t) {
                return !!(t && t instanceof a && t.hasBeenBound && t.ext == this)
            }, n.prototype.bindVertexArrayOES = function(t) {
                var e = this.gl;
                if (!t || t.isAlive) {
                    var s = this.original,
                        r = this.currentVertexArrayObject;
                    this.currentVertexArrayObject = t || this.defaultVertexArrayObject, this.currentVertexArrayObject.hasBeenBound = !0;
                    var a = this.currentVertexArrayObject;
                    if (r != a) {
                        r && a.elementArrayBuffer == r.elementArrayBuffer || s.bindBuffer.call(e, e.ELEMENT_ARRAY_BUFFER, a.elementArrayBuffer);
                        for (var n = this.currentArrayBuffer, h = Math.max(r ? r.maxAttrib : 0, a.maxAttrib), o = 0; o <= h; o++) {
                            var l = a.attribs[o],
                                _ = r ? r.attribs[o] : null;
                            if (r && l.enabled == _.enabled || (l.enabled ? s.enableVertexAttribArray.call(e, o) : s.disableVertexAttribArray.call(e, o)), l.enabled) {
                                var u = !1;
                                r && l.buffer == _.buffer || (n != l.buffer && (s.bindBuffer.call(e, e.ARRAY_BUFFER, l.buffer), n = l.buffer), u = !0), (u || l.cached != _.cached) && s.vertexAttribPointer.call(e, o, l.size, l.type, l.normalized, l.stride, l.offset)
                            }
                        }
                        this.currentArrayBuffer != n && s.bindBuffer.call(e, e.ARRAY_BUFFER, this.currentArrayBuffer)
                    }
                } else i(e.INVALID_OPERATION, "bindVertexArrayOES: attempt to bind deleted arrayObject")
            }, window._setupVertexArrayObject = function(t) {
                var e = t.getSupportedExtensions;
                t.getSupportedExtensions = function() {
                    var t = e.call(this) || [];
                    return t.indexOf("OES_vertex_array_object") < 0 && t.push("OES_vertex_array_object"), t
                };
                var i = t.getExtension;
                t.getExtension = function(t) {
                    var e = i.call(this, t);
                    return e || ("OES_vertex_array_object" !== t ? null : (this.__OESVertexArrayObject || (console.log("Setup OES_vertex_array_object polyfill"), this.__OESVertexArrayObject = new n(this)), this.__OESVertexArrayObject))
                }
            }
        })();
        class de {
            constructor(t, e) {
                this._gl = null, this._vaoExt = null, this._angleInstancedArrays = null, this._isWebGL2 = !1, this._oesTextureHalfFloat = null, this._oes_element_index_uint = null, this._oesTextureHalfFloatLinear = null, this._oesTextureFloat = null, this._extShaderTextureLod = null, this._extTextureFilterAnisotropic = null, this._compressedTextureS3tc = null, this._compressedTexturePvrtc = null, this._compressedTextureEtc1 = null, this._compressedTextureETC = null, this._compressedTextureASTC = null, this._webgl_depth_texture = null, this._extColorBufferFloat = null, this._gl = t, this._isWebGL2 = e;
                var i = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),
                    r = t.getParameter(t.MAX_TEXTURE_SIZE);
                e ? (this._extColorBufferFloat = this._getExtension("EXT_color_buffer_float"), O._shaderCapailityLevel = 35) : (s.Render.isConchApp || window._setupVertexArrayObject && window._setupVertexArrayObject(t), this._vaoExt = this._getExtension("OES_vertex_array_object"), this._angleInstancedArrays = this._getExtension("ANGLE_instanced_arrays"), this._oesTextureHalfFloat = this._getExtension("OES_texture_half_float"), this._oesTextureHalfFloatLinear = this._getExtension("OES_texture_half_float_linear"), this._oesTextureFloat = this._getExtension("OES_texture_float"), this._oes_element_index_uint = this._getExtension("OES_element_index_uint"), this._extShaderTextureLod = this._getExtension("EXT_shader_texture_lod"), this._webgl_depth_texture = this._getExtension("WEBGL_depth_texture"), O._shaderCapailityLevel = 30), this._extTextureFilterAnisotropic = this._getExtension("EXT_texture_filter_anisotropic"), this._compressedTextureS3tc = this._getExtension("WEBGL_compressed_texture_s3tc"), this._compressedTexturePvrtc = this._getExtension("WEBGL_compressed_texture_pvrtc"), this._compressedTextureEtc1 = this._getExtension("WEBGL_compressed_texture_etc1"), this._compressedTextureETC = this._getExtension("WEBGL_compressed_texture_etc"), this._compressedTextureASTC = this._getExtension("WEBGL_compressed_texture_astc"), O._maxTextureCount = i, O._maxTextureSize = r
            }
            _getExtension(t) {
                var e = de._extentionVendorPrefixes;
                for (var i in e) {
                    var s = this._gl.getExtension(e[i] + t);
                    if (s) return s
                }
                return null
            }
            createVertexArray() {
                return this._isWebGL2 ? this._gl.createVertexArray() : this._vaoExt.createVertexArrayOES()
            }
            bindVertexArray(t) {
                this._isWebGL2 ? this._gl.bindVertexArray(t) : this._vaoExt.bindVertexArrayOES(t)
            }
            deleteVertexArray(t) {
                this._isWebGL2 ? this._gl.deleteVertexArray(t) : this._vaoExt.deleteVertexArrayOES(t)
            }
            isVertexArray(t) {
                this._isWebGL2 ? this._gl.isVertexArray(t) : this._vaoExt.isVertexArrayOES(t)
            }
            drawElementsInstanced(t, e, i, s, r) {
                this._isWebGL2 ? this._gl.drawElementsInstanced(t, e, i, s, r) : this._angleInstancedArrays.drawElementsInstancedANGLE(t, e, i, s, r)
            }
            drawArraysInstanced(t, e, i, s) {
                this._isWebGL2 ? this._gl.drawArraysInstanced(t, e, i, s) : this._angleInstancedArrays.drawArraysInstancedANGLE(t, e, i, s)
            }
            vertexAttribDivisor(t, e) {
                this._isWebGL2 ? this._gl.vertexAttribDivisor(t, e) : this._angleInstancedArrays.vertexAttribDivisorANGLE(t, e)
            }
            supportInstance() {
                return !(!this._isWebGL2 && !this._angleInstancedArrays || !i.allowGPUInstanceDynamicBatch)
            }
            supportElementIndexUint32() {
                return !(!this._isWebGL2 && !this._oes_element_index_uint)
            }
        }
        de._extentionVendorPrefixes = ["", "WEBKIT_", "MOZ_"];
        class pe {
            constructor(t, e, i) {
                this._timeId = 0, pe._Render = this, pe._mainCanvas = i;
                let r = pe._mainCanvas.source;
                var a;
                r.id = "layaCanvas", r.width = t, r.height = e, pe.isConchApp && document.body.appendChild(r), this.initRender(pe._mainCanvas, t, e), a = s.Browser.onPC ? function(t) {
                    s.stage._loop(), pe._customRequestAnimationFrame && pe._loopFunction ? pe._customRequestAnimationFrame(pe._loopFunction) : window.requestAnimationFrame(a)
                } : function(t) {
                    try {
                        s.stage._loop()
                    } catch (t) {
                        Fi.isWXPlayable ? console.error(t) : window.onerror(t.message, null, null, null, t)
                    }
                    pe._customRequestAnimationFrame && pe._loopFunction ? pe._customRequestAnimationFrame(pe._loopFunction) : window.requestAnimationFrame(a)
                }, window.requestAnimationFrame(a), s.stage.on("visibilitychange", this, this._onVisibilitychange)
            }
            static customRequestAnimationFrame(t, e) {
                pe._customRequestAnimationFrame = t, pe._loopFunction = e
            }
            _onVisibilitychange() {
                s.stage.isVisibility ? 0 != this._timeId && window.clearInterval(this._timeId) : this._timeId = window.setInterval(this._enterFrame, 1e3)
            }
            initRender(t, e, s) {
                function r(t) {
                    var e, s = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
                    i.useWebGL2 && !ae.onBDMiniGame || s.shift();
                    for (var r = 0; r < s.length; r++) {
                        try {
                            e = t.getContext(s[r], {
                                stencil: i.isStencil,
                                alpha: i.isAlpha,
                                antialias: i.isAntialias,
                                premultipliedAlpha: i.premultipliedAlpha,
                                preserveDrawingBuffer: i.preserveDrawingBuffer
                            })
                        } catch (t) {}
                        if (e) return "webgl2" === s[r] && (ue._isWebGL2 = !0), e
                    }
                    return null
                }
                if (window.__first_canvas_gl) {
                    var a = T.instance = S.mainContext = window.__first_canvas_gl;
                    window._isWebGL2 && (ue._isWebGL2 = !0)
                } else a = T.instance = S.mainContext = r(pe._mainCanvas.source);
                if (i.printWebglOrder && this._replaceWebglcall(a), !a) return !1;
                T.instance = a, T.layaGPUInstance = new de(a, ue._isWebGL2), t.size(e, s), le.__init__(), ft.__init__();
                var n = new le;
                return n.isMain = !0, pe._context = n, t._setContext(n), H.__init__(), Z.__init__(), Gt.__init__(), Rt.__int__(a), V._init_(a), !0
            }
            _replaceWebglcall(t) {
                var e = {};
                for (const i in t) "function" == typeof t[i] && "getError" != i && "__SPECTOR_Origin_getError" != i && "__proto__" != i && (e[i] = t[i], t[i] = function() {
                    let s = [];
                    for (let t = 0; t < arguments.length; t++) s.push(arguments[t]);
                    let r = e[i].apply(t, s);
                    console.log(Ct.loopCount + ":gl." + i + ":" + s);
                    let a = t.getError();
                    return a && console.log(a), r
                })
            }
            _enterFrame(t = null) {
                s.stage._loop()
            }
            static get context() {
                return pe._context
            }
            static get canvas() {
                return pe._mainCanvas.source
            }
        }
        pe.supportWebGLPlusAnimation = !1, pe.supportWebGLPlusRendering = !1, pe.isConchApp = !1, pe.isConchApp = null != window.conch, pe.isConchApp ? pe.supportWebGLPlusRendering = !1 : null != window.qq && null != window.qq.webglPlus && (pe.supportWebGLPlusRendering = !1);
        class fe {
            static create(t, e, i, s, a, n, h, o, l, _, u) {
                var c = r.getItemByClass("DrawTrianglesCmd", fe);
                if (c.texture = t, c.x = e, c.y = i, c.vertices = s, c.uvs = a, c.indices = n, c.matrix = h, c.alpha = o, l) {
                    c.color = new it;
                    var d = et.create(l).arrColor;
                    c.color.color(255 * d[0], 255 * d[1], 255 * d[2], 255 * d[3])
                }
                return c.blendMode = _, c.colorNum = u, c
            }
            recover() {
                this.texture = null, this.vertices = null, this.uvs = null, this.indices = null, this.matrix = null, r.recover("DrawTrianglesCmd", this)
            }
            run(t, e, i) {
                t.drawTriangles(this.texture, this.x + e, this.y + i, this.vertices, this.uvs, this.indices, this.matrix, this.alpha, this.color, this.blendMode, this.colorNum)
            }
            get cmdID() {
                return fe.ID
            }
        }
        fe.ID = "DrawTriangles";
        class me {
            constructor() {}
            static create(t, e, i, s, a, n) {
                var h = r.getItemByClass("Draw9GridTexture", me);
                return h.texture = t, t._addReference(), h.x = e, h.y = i, h.width = s, h.height = a, h.sizeGrid = n, h
            }
            recover() {
                this.texture._removeReference(), r.recover("Draw9GridTexture", this)
            }
            run(t, e, i) {
                t.drawTextureWithSizeGrid(this.texture, this.x, this.y, this.width, this.height, this.sizeGrid, e, i)
            }
            get cmdID() {
                return me.ID
            }
        }
        me.ID = "Draw9GridTexture";
        class ge {
            static create() {
                var t = r.getItemByClass("SaveCmd", ge);
                return t
            }
            recover() {
                r.recover("SaveCmd", this)
            }
            run(t, e, i) {
                t.save()
            }
            get cmdID() {
                return ge.ID
            }
        }
        ge.ID = "Save";
        class Te {
            constructor() {
                this._cacheBoundsType = !1
            }
            destroy() {
                this._graphics = null, this._cacheBoundsType = !1, this._temp && (this._temp.length = 0), this._rstBoundPoints && (this._rstBoundPoints.length = 0), this._bounds && this._bounds.recover(), this._bounds = null, r.recover("GraphicsBounds", this)
            }
            static create() {
                return r.getItemByClass("GraphicsBounds", Te)
            }
            reset() {
                this._temp && (this._temp.length = 0)
            }
            getBounds(t = !1) {
                return (!this._bounds || !this._temp || this._temp.length < 1 || t != this._cacheBoundsType) && (this._bounds = g._getWrapRec(this.getBoundPoints(t), this._bounds)), this._cacheBoundsType = t, this._bounds
            }
            getBoundPoints(t = !1) {
                return (!this._temp || this._temp.length < 1 || t != this._cacheBoundsType) && (this._temp = this._getCmdPoints(t)), this._cacheBoundsType = t, this._rstBoundPoints = tt.copyArray(this._rstBoundPoints, this._temp)
            }
            _getCmdPoints(t = !1) {
                var e, i = this._graphics.cmds;
                if (e = this._temp || (this._temp = []), e.length = 0, i || null == this._graphics._one || (Te._tempCmds.length = 0, Te._tempCmds.push(this._graphics._one), i = Te._tempCmds), !i) return e;
                var s = Te._tempMatrixArrays;
                s.length = 0;
                var r = Te._initMatrix;
                r.identity();
                for (var f, m, T = Te._tempMatrix, v = 0, x = i.length; v < x; v++) switch (f = i[v], f.cmdID) {
                    case a.ID:
                    case ge.ID:
                        s.push(r), r = r.clone();
                        break;
                    case at.ID:
                        r = s.pop();
                        break;
                    case ht.ID:
                        T.identity(), T.translate(-f.pivotX, -f.pivotY), T.scale(f.scaleX, f.scaleY), T.translate(f.pivotX, f.pivotY), this._switchMatrix(r, T);
                        break;
                    case nt.ID:
                        T.identity(), T.translate(-f.pivotX, -f.pivotY), T.rotate(f.angle), T.translate(f.pivotX, f.pivotY), this._switchMatrix(r, T);
                        break;
                    case lt.ID:
                        T.identity(), T.translate(f.tx, f.ty), this._switchMatrix(r, T);
                        break;
                    case ot.ID:
                        T.identity(), T.translate(-f.pivotX, -f.pivotY), T.concat(f.matrix), T.translate(f.pivotX, f.pivotY), this._switchMatrix(r, T);
                        break;
                    case o.ID:
                    case rt.ID:
                        Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, f.width, f.height), r);
                        break;
                    case st.ID:
                        r.copyTo(T), f.matrix && T.concat(f.matrix), Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, f.width, f.height), T);
                        break;
                    case o.ID:
                        if (m = f.texture, t) f.width && f.height ? Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, f.width, f.height), r) : Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, m.width, m.height), r);
                        else {
                            var y = (f.width || m.sourceWidth) / m.width,
                                E = (f.height || m.sourceHeight) / m.height,
                                A = y * m.sourceWidth,
                                C = E * m.sourceHeight,
                                R = m.offsetX > 0 ? m.offsetX : 0,
                                b = m.offsetY > 0 ? m.offsetY : 0;
                            R *= y, b *= E, Te._addPointArrToRst(e, g._getBoundPointS(f.x - R, f.y - b, A, C), r)
                        }
                        break;
                    case rt.ID:
                        f.width && f.height ? Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, f.width, f.height), r) : (m = f.texture, Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, m.width, m.height), r));
                        break;
                    case st.ID:
                        var S;
                        f.matrix ? (r.copyTo(T), T.concat(f.matrix), S = T) : S = r, t ? f.width && f.height ? Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, f.width, f.height), S) : (m = f.texture, Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, m.width, m.height), S)) : (m = f.texture, y = (f.width || m.sourceWidth) / m.width, E = (f.height || m.sourceHeight) / m.height, A = y * m.sourceWidth, C = E * m.sourceHeight, R = m.offsetX > 0 ? m.offsetX : 0, b = m.offsetY > 0 ? m.offsetY : 0, R *= y, b *= E, Te._addPointArrToRst(e, g._getBoundPointS(f.x - R, f.y - b, A, C), S));
                        break;
                    case p.ID:
                        Te._addPointArrToRst(e, g._getBoundPointS(f.x, f.y, f.width, f.height), r);
                        break;
                    case n.ID:
                        Te._addPointArrToRst(e, g._getBoundPointS(f.x - f.radius, f.y - f.radius, f.radius + f.radius, f.radius + f.radius), r);
                        break;
                    case l.ID:
                        var w;
                        Te._tempPoints.length = 0, w = .5 * f.lineWidth, f.fromX == f.toX ? Te._tempPoints.push(f.fromX + w, f.fromY, f.toX + w, f.toY, f.fromX - w, f.fromY, f.toX - w, f.toY) : f.fromY == f.toY ? Te._tempPoints.push(f.fromX, f.fromY + w, f.toX, f.toY + w, f.fromX, f.fromY - w, f.toX, f.toY - w) : Te._tempPoints.push(f.fromX, f.fromY, f.toX, f.toY), Te._addPointArrToRst(e, Te._tempPoints, r);
                        break;
                    case h.ID:
                        Te._addPointArrToRst(e, _t.I.getBezierPoints(f.points), r, f.x, f.y);
                        break;
                    case _.ID:
                    case d.ID:
                        Te._addPointArrToRst(e, f.points, r, f.x, f.y);
                        break;
                    case u.ID:
                        Te._addPointArrToRst(e, this._getPathPoints(f.paths), r, f.x, f.y);
                        break;
                    case c.ID:
                        Te._addPointArrToRst(e, this._getPiePoints(f.x, f.y, f.radius, f.startAngle, f.endAngle), r);
                        break;
                    case fe.ID:
                        Te._addPointArrToRst(e, this._getTriAngBBXPoints(f.vertices), r);
                        break;
                    case me.ID:
                        Te._addPointArrToRst(e, this._getDraw9GridBBXPoints(f), r)
                }
                return e.length > 200 ? e = tt.copyArray(e, g._getWrapRec(e)._getBoundPoints()) : e.length > 8 && (e = ut.scanPList(e)), e
            }
            _switchMatrix(t, e) {
                e.concat(t), e.copyTo(t)
            }
            static _addPointArrToRst(t, e, i, s = 0, r = 0) {
                var a, n;
                for (n = e.length, a = 0; a < n; a += 2) Te._addPointToRst(t, e[a] + s, e[a + 1] + r, i)
            }
            static _addPointToRst(t, e, i, s) {
                var r = m.TEMP;
                r.setTo(e || 0, i || 0), s.transformPoint(r), t.push(r.x, r.y)
            }
            _getPiePoints(t, e, i, s, r) {
                var a = Te._tempPoints;
                Te._tempPoints.length = 0;
                var n = Math.PI / 180,
                    h = r - s;
                if (h >= 360 || h <= -360) return a.push(t - i, e - i), a.push(t + i, e - i), a.push(t + i, e + i), a.push(t - i, e + i), a;
                a.push(t, e);
                var o = h % 360;
                o < 0 && (o += 360);
                var l = s + o,
                    _ = s * n,
                    u = l * n;
                a.push(t + i * Math.cos(_), e + i * Math.sin(_)), a.push(t + i * Math.cos(u), e + i * Math.sin(u));
                for (var c = 90 * Math.ceil(s / 90), d = 90 * Math.floor(l / 90), p = c; p <= d; p += 90) {
                    var f = p * n;
                    a.push(t + i * Math.cos(f), e + i * Math.sin(f))
                }
                return a
            }
            _getTriAngBBXPoints(t) {
                var e = t.length;
                if (e < 2) return [];
                for (var i = t[0], s = t[1], r = i, a = s, n = 2; n < e;) {
                    var h = t[n++],
                        o = t[n++];
                    i > h && (i = h), s > o && (s = o), r < h && (r = h), a < o && (a = o)
                }
                return [i, s, r, s, r, a, i, a]
            }
            _getDraw9GridBBXPoints(t) {
                var e = 0,
                    i = 0,
                    s = t.width,
                    r = t.height;
                return [e, i, s, i, s, r, e, r]
            }
            _getPathPoints(t) {
                var e, i, s, r = Te._tempPoints;
                for (r.length = 0, i = t.length, e = 0; e < i; e++) s = t[e], s.length > 1 && (r.push(s[1], s[2]), s.length > 3 && r.push(s[3], s[4]));
                return r
            }
        }
        Te._tempMatrix = new f, Te._initMatrix = new f, Te._tempPoints = [], Te._tempMatrixArrays = [], Te._tempCmds = [];
        class ve {}
        ve.ALPHA = 1, ve.TRANSFORM = 2, ve.BLEND = 4, ve.CANVAS = 8, ve.FILTERS = 16, ve.MASK = 32, ve.CLIP = 64, ve.STYLE = 128, ve.TEXTURE = 256, ve.GRAPHICS = 512, ve.LAYAGL3D = 1024, ve.CUSTOM = 2048, ve.ONECHILD = 4096, ve.CHILDS = 8192, ve.REPAINT_NONE = 0, ve.REPAINT_NODE = 1, ve.REPAINT_CACHE = 2, ve.REPAINT_ALL = 3;
        class xe {
            static create(t, e, i, s) {
                var a = r.getItemByClass("ClipRectCmd", xe);
                return a.x = t, a.y = e, a.width = i, a.height = s, a
            }
            recover() {
                r.recover("ClipRectCmd", this)
            }
            run(t, e, i) {
                t.clipRect(this.x + e, this.y + i, this.width, this.height)
            }
            get cmdID() {
                return xe.ID
            }
        }
        xe.ID = "ClipRect";
        class ye {
            static create(t, e) {
                var i = r.getItemByClass("DrawTexturesCmd", ye);
                return i.texture = t, t._addReference(), i.pos = e, i
            }
            recover() {
                this.texture._removeReference(), this.texture = null, this.pos = null, r.recover("DrawTexturesCmd", this)
            }
            run(t, e, i) {
                t.drawTextures(this.texture, this.pos, e, i)
            }
            get cmdID() {
                return ye.ID
            }
        }
        ye.ID = "DrawTextures";
        class Ee {
            constructor() {
                this._textIsWorldText = !1, this._fontColor = 4294967295, this._strokeColor = 0, this._fontObj = Ee._defFontObj, this._nTexAlign = 0
            }
            static create(t, e, i, s, a, n, h, o, l) {
                var _ = r.getItemByClass("FillTextCmd", Ee);
                return _.text = t, _._textIsWorldText = t instanceof ie, _._words = e, _.x = i, _.y = s, _.font = a, _.color = n, _.textAlign = h, _._lineWidth = o, _._borderColor = l, _
            }
            recover() {
                r.recover("FillTextCmd", this)
            }
            run(t, e, i) {
                s.stage.isGlobalRepaint() && this._textIsWorldText && this._text.cleanCache(), this._words ? le._textRender.fillWords(t, this._words, this.x + e, this.y + i, this._fontObj, this._color, this._borderColor, this._lineWidth) : this._textIsWorldText ? t._fast_filltext(this._text, this.x + e, this.y + i, this._fontObj, this._color, this._borderColor, this._lineWidth, this._nTexAlign, 0) : le._textRender.filltext(t, this._text, this.x + e, this.y + i, this.font, this.color, this._borderColor, this._lineWidth, this._textAlign)
            }
            get cmdID() {
                return Ee.ID
            }
            get text() {
                return this._text
            }
            set text(t) {
                this._text = t, this._textIsWorldText = t instanceof ie, this._textIsWorldText && this._text.cleanCache()
            }
            get font() {
                return this._font
            }
            set font(t) {
                this._font = t, this._fontObj = ee.Parse(t), this._textIsWorldText && this._text.cleanCache()
            }
            get color() {
                return this._color
            }
            set color(t) {
                this._color = t, this._fontColor = et.create(t).numColor, this._textIsWorldText && this._text.cleanCache()
            }
            get textAlign() {
                return this._textAlign
            }
            set textAlign(t) {
                switch (this._textAlign = t, t) {
                    case "center":
                        this._nTexAlign = s.Context.ENUM_TEXTALIGN_CENTER;
                        break;
                    case "right":
                        this._nTexAlign = s.Context.ENUM_TEXTALIGN_RIGHT;
                        break;
                    default:
                        this._nTexAlign = s.Context.ENUM_TEXTALIGN_DEFAULT
                }
                this._textIsWorldText && this._text.cleanCache()
            }
        }
        Ee.ID = "FillText", Ee._defFontObj = new ee(null);
        class Ae {
            constructor() {}
            static regCacheByFunction(t, e) {
                var i;
                Ae.unRegCacheByFunction(t, e), i = {
                    tryDispose: t,
                    getCacheList: e
                }, Ae._cacheList.push(i)
            }
            static unRegCacheByFunction(t, e) {
                var i, s;
                for (s = Ae._cacheList.length, i = 0; i < s; i++)
                    if (Ae._cacheList[i].tryDispose == t && Ae._cacheList[i].getCacheList == e) return void Ae._cacheList.splice(i, 1)
            }
            static forceDispose() {
                var t, e = Ae._cacheList.length;
                for (t = 0; t < e; t++) Ae._cacheList[t].tryDispose(!0)
            }
            static beginCheck(t = 15e3) {
                s.systemTimer.loop(t, null, Ae._checkLoop)
            }
            static stopCheck() {
                s.systemTimer.clear(null, Ae._checkLoop)
            }
            static _checkLoop() {
                var t = Ae._cacheList;
                if (!(t.length < 1)) {
                    var e, i, r = s.Browser.now();
                    for (i = e = t.length; e > 0 && (Ae._index++, Ae._index = Ae._index % i, t[Ae._index].tryDispose(!1), !(s.Browser.now() - r > Ae.loopTimeLimit));) e--
                }
            }
        }
        Ae.loopTimeLimit = 2, Ae._cacheList = [], Ae._index = 0;
        class Ce {
            constructor() {
                this.useDic = {}, this.shapeDic = {}, this.shapeLineDic = {}, this._id = 0, this._checkKey = !1, this._freeIdArray = [], Ae.regCacheByFunction(this.startDispose.bind(this), this.getCacheList.bind(this))
            }
            static getInstance() {
                return Ce.instance = Ce.instance || new Ce
            }
            getId() {
                return this._id++
            }
            addShape(t, e) {
                this.shapeDic[t] = e, this.useDic[t] || (this.useDic[t] = !0)
            }
            addLine(t, e) {
                this.shapeLineDic[t] = e, this.shapeLineDic[t] || (this.shapeLineDic[t] = !0)
            }
            getShape(t) {
                this._checkKey && null != this.useDic[t] && (this.useDic[t] = !0)
            }
            deleteShape(t) {
                this.shapeDic[t] && (this.shapeDic[t] = null, delete this.shapeDic[t]), this.shapeLineDic[t] && (this.shapeLineDic[t] = null, delete this.shapeLineDic[t]), null != this.useDic[t] && delete this.useDic[t]
            }
            getCacheList() {
                var t, e = [];
                for (t in this.shapeDic) e.push(this.shapeDic[t]);
                for (t in this.shapeLineDic) e.push(this.shapeLineDic[t]);
                return e
            }
            startDispose(t) {
                var e;
                for (e in this.useDic) this.useDic[e] = !1;
                this._checkKey = !0
            }
            endDispose() {
                if (this._checkKey) {
                    var t;
                    for (t in this.useDic) this.useDic[t] || this.deleteShape(t);
                    this._checkKey = !1
                }
            }
        }
        class Re {
            constructor() {
                this._sp = null, this._one = null, this._render = this._renderEmpty, this._cmds = null, this._vectorgraphArray = null, this._graphicBounds = null, this.autoDestroy = !1, this._createData()
            }
            _createData() {}
            _clearData() {}
            _destroyData() {}
            destroy() {
                this.clear(!0), this._graphicBounds && this._graphicBounds.destroy(), this._graphicBounds = null, this._vectorgraphArray = null, this._sp && (this._sp._renderType = 0, this._sp._setRenderType(0), this._sp = null), this._destroyData()
            }
            clear(t = !0) {
                if (t) {
                    var e = this._one;
                    if (this._cmds) {
                        var i, s = this._cmds.length;
                        for (i = 0; i < s; i++) e = this._cmds[i], e.recover();
                        this._cmds = null
                    } else e && e.recover()
                } else this._cmds = null;
                if (this._one = null, this._render = this._renderEmpty, this._clearData(), this._sp && (this._sp._renderType &= ~ve.GRAPHICS, this._sp._setRenderType(this._sp._renderType)), this._repaint(), this._vectorgraphArray) {
                    for (i = 0, s = this._vectorgraphArray.length; i < s; i++) Ce.getInstance().deleteShape(this._vectorgraphArray[i]);
                    this._vectorgraphArray.length = 0
                }
            }
            _clearBoundsCache() {
                this._graphicBounds && this._graphicBounds.reset()
            }
            _initGraphicBounds() {
                this._graphicBounds || (this._graphicBounds = Te.create(), this._graphicBounds._graphics = this)
            }
            _repaint() {
                this._clearBoundsCache(), this._sp && this._sp.repaint()
            }
            _isOnlyOne() {
                return !this._cmds || 0 === this._cmds.length
            }
            get cmds() {
                return this._cmds
            }
            set cmds(t) {
                this._sp && (this._sp._renderType |= ve.GRAPHICS, this._sp._setRenderType(this._sp._renderType)), this._cmds = t, this._render = this._renderAll, this._repaint()
            }
            getBounds(t = !1) {
                return this._initGraphicBounds(), this._graphicBounds.getBounds(t)
            }
            getBoundPoints(t = !1) {
                return this._initGraphicBounds(), this._graphicBounds.getBoundPoints(t)
            }
            drawImage(t, e = 0, i = 0, s = 0, r = 0) {
                if (!t) return null;
                if (s || (s = t.sourceWidth), r || (r = t.sourceHeight), t.getIsReady()) {
                    var a = s / t.sourceWidth,
                        n = r / t.sourceHeight;
                    if (s = t.width * a, r = t.height * n, s <= 0 || r <= 0) return null;
                    e += t.offsetX * a, i += t.offsetY * n
                }
                this._sp && (this._sp._renderType |= ve.GRAPHICS, this._sp._setRenderType(this._sp._renderType));
                var h = o.create.call(this, t, e, i, s, r);
                return null == this._one ? (this._one = h, this._render = this._renderOneImg) : this._saveToCmd(null, h), this._repaint(), h
            }
            drawTexture(t, e = 0, i = 0, s = 0, r = 0, a = null, n = 1, h = null, o = null, l) {
                if (!t || n < .01) return null;
                if (!t.getIsReady()) return null;
                if (s || (s = t.sourceWidth), r || (r = t.sourceHeight), t.getIsReady()) {
                    var _ = s / t.sourceWidth,
                        u = r / t.sourceHeight;
                    if (s = t.width * _, r = t.height * u, s <= 0 || r <= 0) return null;
                    e += t.offsetX * _, i += t.offsetY * u
                }
                this._sp && (this._sp._renderType |= ve.GRAPHICS, this._sp._setRenderType(this._sp._renderType));
                var c = st.create.call(this, t, e, i, s, r, a, n, h, o, l);
                return this._repaint(), this._saveToCmd(null, c)
            }
            drawTextures(t, e) {
                return t ? this._saveToCmd(pe._context.drawTextures, ye.create.call(this, t, e)) : null
            }
            drawTriangles(t, e, i, s, r, a, n = null, h = 1, o = null, l = null, _ = 4294967295) {
                return this._saveToCmd(pe._context.drawTriangles, fe.create.call(this, t, e, i, s, r, a, n, h, o, l, _))
            }
            fillTexture(t, e, i, s = 0, r = 0, a = "repeat", n = null) {
                return t && t.getIsReady() ? this._saveToCmd(pe._context._fillTexture, rt.create.call(this, t, e, i, s, r, a, n || m.EMPTY, {})) : null
            }
            _saveToCmd(t, e) {
                return this._sp && (this._sp._renderType |= ve.GRAPHICS, this._sp._setRenderType(this._sp._renderType)), null == this._one ? (this._one = e, this._render = this._renderOne) : (this._render = this._renderAll, 0 === (this._cmds || (this._cmds = [])).length && this._cmds.push(this._one), this._cmds.push(e)), this._repaint(), e
            }
            clipRect(t, e, i, s) {
                return this._saveToCmd(pe._context.clipRect, xe.create.call(this, t, e, i, s))
            }
            fillText(t, e, i, r, a, n) {
                return this._saveToCmd(pe._context.fillText, Ee.create.call(this, t, null, e, i, r || s.Text.defaultFontStr(), a, n, 0, ""))
            }
            fillBorderText(t, e, i, r, a, n, h, o) {
                return this._saveToCmd(pe._context.fillText, Ee.create.call(this, t, null, e, i, r || s.Text.defaultFontStr(), a, n, h, o))
            }
            fillWords(t, e, i, r, a) {
                return this._saveToCmd(pe._context.fillText, Ee.create.call(this, null, t, e, i, r || s.Text.defaultFontStr(), a, "", 0, null))
            }
            fillBorderWords(t, e, i, r, a, n, h) {
                return this._saveToCmd(pe._context.fillText, Ee.create.call(this, null, t, e, i, r || s.Text.defaultFontStr(), a, "", h, n))
            }
            strokeText(t, e, i, r, a, n, h) {
                return this._saveToCmd(pe._context.fillText, Ee.create.call(this, t, null, e, i, r || s.Text.defaultFontStr(), null, h, n, a))
            }
            alpha(t) {
                return this._saveToCmd(pe._context.alpha, a.create.call(this, t))
            }
            transform(t, e = 0, i = 0) {
                return this._saveToCmd(pe._context._transform, ot.create.call(this, t, e, i))
            }
            rotate(t, e = 0, i = 0) {
                return this._saveToCmd(pe._context._rotate, nt.create.call(this, t, e, i))
            }
            scale(t, e, i = 0, s = 0) {
                return this._saveToCmd(pe._context._scale, ht.create.call(this, t, e, i, s))
            }
            translate(t, e) {
                return this._saveToCmd(pe._context.translate, lt.create.call(this, t, e))
            }
            save() {
                return this._saveToCmd(pe._context._save, ge.create.call(this))
            }
            restore() {
                return this._saveToCmd(pe._context.restore, at.create.call(this))
            }
            replaceText(t) {
                this._repaint();
                var e = this._cmds;
                if (e) {
                    for (var i = e.length - 1; i > -1; i--)
                        if (this._isTextCmd(e[i])) return e[i].text = t, !0
                } else if (this._one && this._isTextCmd(this._one)) return this._one.text = t, !0;
                return !1
            }
            _isTextCmd(t) {
                var e = t.cmdID;
                return e == Ee.ID
            }
            replaceTextColor(t) {
                this._repaint();
                var e = this._cmds;
                if (e)
                    for (var i = e.length - 1; i > -1; i--) this._isTextCmd(e[i]) && this._setTextCmdColor(e[i], t);
                else this._one && this._isTextCmd(this._one) && this._setTextCmdColor(this._one, t)
            }
            _setTextCmdColor(t, e) {
                var i = t.cmdID;
                switch (i) {
                    case Ee.ID:
                        t.color = e
                }
            }
            loadImage(t, e = 0, i = 0, r = 0, a = 0, n = null) {
                var h = s.Loader.getRes(t);
                h ? h.getIsReady() ? this.drawImage(h, e, i, r, a) : h.once(Jt.READY, this, this.drawImage, [h, e, i, r, a]) : (h = new te, h.load(t), s.Loader.cacheTexture(t, h), h.once(Jt.READY, this, this.drawImage, [h, e, i, r, a])), null != n && (h.getIsReady() ? n.call(this._sp) : h.on(Jt.READY, this._sp, n))
            }
            _renderEmpty(t, e, i, s) {}
            _renderAll(t, e, i, s) {
                for (var r = this._cmds, a = 0, n = r.length; a < n; a++) r[a].run(e, i, s)
            }
            _renderOne(t, e, i, s) {
                e.sprite = t, this._one.run(e, i, s)
            }
            _renderOneImg(t, e, i, s) {
                e.sprite = t, this._one.run(e, i, s)
            }
            drawLine(t, e, i, s, r, a = 1) {
                var n = a < 1 || a % 2 == 0 ? 0 : .5;
                return this._saveToCmd(pe._context._drawLine, l.create.call(this, t + n, e + n, i + n, s + n, r, a, 0))
            }
            drawLines(t, e, i, s, r = 1) {
                if (!i || i.length < 4) return null;
                var a = r < 1 || r % 2 == 0 ? 0 : .5;
                return this._saveToCmd(pe._context._drawLines, _.create.call(this, t + a, e + a, i, s, r, 0))
            }
            drawCurves(t, e, i, s, r = 1) {
                return this._saveToCmd(pe._context.drawCurves, h.create.call(this, t, e, i, s, r))
            }
            drawRect(t, e, i, s, r, a = null, n = 1) {
                var h = n >= 1 && a ? n / 2 : 0,
                    o = a ? n : 0;
                return this._saveToCmd(pe._context.drawRect, p.create.call(this, t + h, e + h, i - o, s - o, r, a, n))
            }
            drawCircle(t, e, i, s, r = null, a = 1) {
                var h = a >= 1 && r ? a / 2 : 0;
                return this._saveToCmd(pe._context._drawCircle, n.create.call(this, t, e, i - h, s, r, a, 0))
            }
            drawPie(t, e, i, s, r, a, n = null, h = 1) {
                var o = h >= 1 && n ? h / 2 : 0,
                    l = n ? h : 0;
                return this._saveToCmd(pe._context._drawPie, c.create.call(this, t + o, e + o, i - l, tt.toRadian(s), tt.toRadian(r), a, n, h, 0))
            }
            drawPoly(t, e, i, s, r = null, a = 1) {
                var n = !1;
                n = !(i.length > 6);
                var h = a >= 1 && r ? a % 2 == 0 ? 0 : .5 : 0;
                return this._saveToCmd(pe._context._drawPoly, d.create.call(this, t + h, e + h, i, s, r, a, n, 0))
            }
            drawPath(t, e, i, s = null, r = null) {
                return this._saveToCmd(pe._context._drawPath, u.create.call(this, t, e, i, s, r))
            }
            draw9Grid(t, e = 0, i = 0, s = 0, r = 0, a) {
                this._saveToCmd(null, me.create(t, e, i, s, r, a))
            }
        }
        class be {}
        be.NOT_ACTIVE = 1, be.ACTIVE_INHIERARCHY = 2, be.AWAKED = 4, be.NOT_READY = 8, be.DISPLAY = 16, be.HAS_ZORDER = 32, be.HAS_MOUSE = 64, be.DISPLAYED_INSTAGE = 128, be.DRAWCALL_OPTIMIZE = 256;
        class Se {
            static __init__() {
                Se.map[ve.ALPHA | ve.TRANSFORM | ve.GRAPHICS] = Se.alpha_transform_drawLayaGL, Se.map[ve.ALPHA | ve.GRAPHICS] = Se.alpha_drawLayaGL, Se.map[ve.TRANSFORM | ve.GRAPHICS] = Se.transform_drawLayaGL, Se.map[ve.TRANSFORM | ve.CHILDS] = Se.transform_drawNodes, Se.map[ve.ALPHA | ve.TRANSFORM | ve.TEXTURE] = Se.alpha_transform_drawTexture, Se.map[ve.ALPHA | ve.TEXTURE] = Se.alpha_drawTexture, Se.map[ve.TRANSFORM | ve.TEXTURE] = Se.transform_drawTexture, Se.map[ve.GRAPHICS | ve.CHILDS] = Se.drawLayaGL_drawNodes
            }
            static transform_drawTexture(t, e, i, s) {
                t._style;
                var r = t.texture;
                e.saveTransform(Se.curMat), e.transformByMatrix(t.transform, i, s);
                var a = t._width || r.sourceWidth,
                    n = t._height || r.sourceHeight,
                    h = a / r.sourceWidth,
                    o = n / r.sourceHeight;
                if (a = r.width * h, n = r.height * o, a <= 0 || n <= 0) return null;
                var l = -t.pivotX + r.offsetX * h,
                    _ = -t.pivotY + r.offsetY * o;
                e.drawTexture(r, l, _, a, n), e.restoreTransform(Se.curMat)
            }
            static alpha_drawTexture(t, e, i, s) {
                var r, a = t._style,
                    n = t.texture;
                if ((r = a.alpha) > .01 || t._needRepaint()) {
                    var h = e.globalAlpha;
                    e.globalAlpha *= r;
                    var o = t._width || n.width,
                        l = t._height || n.height,
                        _ = o / n.sourceWidth,
                        u = l / n.sourceHeight;
                    if (o = n.width * _, l = n.height * u, o <= 0 || l <= 0) return null;
                    var c = i - a.pivotX + n.offsetX * _,
                        d = s - a.pivotY + n.offsetY * u;
                    e.drawTexture(n, c, d, o, l), e.globalAlpha = h
                }
            }
            static alpha_transform_drawTexture(t, e, i, s) {
                var r, a = t._style,
                    n = t.texture;
                if ((r = a.alpha) > .01 || t._needRepaint()) {
                    var h = e.globalAlpha;
                    e.globalAlpha *= r, e.saveTransform(Se.curMat), e.transformByMatrix(t.transform, i, s);
                    var o = t._width || n.sourceWidth,
                        l = t._height || n.sourceHeight,
                        _ = o / n.sourceWidth,
                        u = l / n.sourceHeight;
                    if (o = n.width * _, l = n.height * u, o <= 0 || l <= 0) return null;
                    var c = -a.pivotX + n.offsetX * _,
                        d = -a.pivotY + n.offsetY * u;
                    e.drawTexture(n, c, d, o, l), e.restoreTransform(Se.curMat), e.globalAlpha = h
                }
            }
            static alpha_transform_drawLayaGL(t, e, i, s) {
                var r, a = t._style;
                if ((r = a.alpha) > .01 || t._needRepaint()) {
                    var n = e.globalAlpha;
                    e.globalAlpha *= r, e.saveTransform(Se.curMat), e.transformByMatrix(t.transform, i, s), t._graphics && t._graphics._render(t, e, -a.pivotX, -a.pivotY), e.restoreTransform(Se.curMat), e.globalAlpha = n
                }
            }
            static alpha_drawLayaGL(t, e, i, s) {
                var r, a = t._style;
                if ((r = a.alpha) > .01 || t._needRepaint()) {
                    var n = e.globalAlpha;
                    e.globalAlpha *= r, t._graphics && t._graphics._render(t, e, i - a.pivotX, s - a.pivotY), e.globalAlpha = n
                }
            }
            static transform_drawLayaGL(t, e, i, s) {
                var r = t._style;
                e.saveTransform(Se.curMat), e.transformByMatrix(t.transform, i, s), t._graphics && t._graphics._render(t, e, -r.pivotX, -r.pivotY), e.restoreTransform(Se.curMat)
            }
            static transform_drawNodes(t, e, i, s) {
                var r = t._getBit(be.DRAWCALL_OPTIMIZE) && e.drawCallOptimize(!0),
                    a = t._style;
                e.saveTransform(Se.curMat), e.transformByMatrix(t.transform, i, s), i = -a.pivotX, s = -a.pivotY;
                var n, h = t._children,
                    o = h.length;
                if (a.viewport) {
                    var l, _, u = a.viewport,
                        c = u.x,
                        d = u.y,
                        p = u.right,
                        f = u.bottom;
                    for (m = 0; m < o; ++m)(n = h[m])._visible && (l = n._x) < p && l + n.width > c && (_ = n._y) < f && _ + n.height > d && n.render(e, i, s)
                } else
                    for (var m = 0; m < o; ++m)(n = h[m])._visible && n.render(e, i, s);
                e.restoreTransform(Se.curMat), r && e.drawCallOptimize(!1)
            }
            static drawLayaGL_drawNodes(t, e, i, s) {
                var r = t._getBit(be.DRAWCALL_OPTIMIZE) && e.drawCallOptimize(!0),
                    a = t._style;
                i -= a.pivotX, s -= a.pivotY, t._graphics && t._graphics._render(t, e, i, s);
                var n, h = t._children,
                    o = h.length;
                if (a.viewport) {
                    var l, _, u = a.viewport,
                        c = u.x,
                        d = u.y,
                        p = u.right,
                        f = u.bottom;
                    for (m = 0; m < o; ++m)(n = h[m])._visible && (l = n._x) < p && l + n.width > c && (_ = n._y) < f && _ + n.height > d && n.render(e, i, s)
                } else
                    for (var m = 0; m < o; ++m)(n = h[m])._visible && n.render(e, i, s);
                r && e.drawCallOptimize(!1)
            }
        }
        Se.map = [], Se.curMat = new f;
        class we {
            constructor(t, e) {
                if (Se.map[t]) return this._fun = Se.map[t], void(this._next = we.NORENDER);
                switch (this._next = e || we.NORENDER, t) {
                    case 0:
                        return void(this._fun = this._no);
                    case ve.ALPHA:
                        return void(this._fun = this._alpha);
                    case ve.TRANSFORM:
                        return void(this._fun = this._transform);
                    case ve.BLEND:
                        return void(this._fun = this._blend);
                    case ve.CANVAS:
                        return void(this._fun = this._canvas);
                    case ve.MASK:
                        return void(this._fun = this._mask);
                    case ve.CLIP:
                        return void(this._fun = this._clip);
                    case ve.STYLE:
                        return void(this._fun = this._style);
                    case ve.GRAPHICS:
                        return void(this._fun = this._graphics);
                    case ve.CHILDS:
                        return void(this._fun = this._children);
                    case ve.CUSTOM:
                        return void(this._fun = this._custom);
                    case ve.TEXTURE:
                        return void(this._fun = this._texture);
                    case ve.FILTERS:
                        return void(this._fun = J._filter);
                    case we.INIT:
                        return void(this._fun = we._initRenderFun)
                }
                this.onCreate(t)
            }
            static __init__() {
                var t, e, i;
                for (Se.__init__(), i = new we(we.INIT, null), e = we.renders.length = 2 * ve.CHILDS, t = 0; t < e; t++) we.renders[t] = i;
                we.renders[0] = new we(0, null)
            }
            static _initRenderFun(t, e, i, s) {
                var r = t._renderType,
                    a = we.renders[r] = we._getTypeRender(r);
                a._fun(t, e, i, s)
            }
            static _getTypeRender(t) {
                if (Se.map[t]) return new we(t, null);
                for (var e = null, i = ve.CHILDS; i > 0;) i & t && (e = new we(i, e)), i >>= 1;
                return e
            }
            onCreate(t) {}
            _style(t, e, i, s) {
                var r = t._style;
                null != r.render && r.render(t, e, i, s);
                var a = this._next;
                a._fun.call(a, t, e, i, s)
            }
            _no(t, e, i, s) {}
            _custom(t, e, i, s) {
                t.customRender(e, i, s), this._next._fun.call(this._next, t, e, 0, 0)
            }
            _clip(t, e, i, s) {
                var r = this._next;
                if (r != we.NORENDER) {
                    var a = t._style.scrollRect,
                        n = a.width,
                        h = a.height;
                    0 !== n && 0 !== h && (e.save(), e.clipRect(i, s, n, h), r._fun.call(r, t, e, i - a.x, s - a.y), e.restore())
                }
            }
            _texture(t, e, i, s) {
                var r = t.texture;
                if (r._getSource()) {
                    var a = t._width || r.sourceWidth,
                        n = t._height || r.sourceHeight,
                        h = a / r.sourceWidth,
                        o = n / r.sourceHeight;
                    if (a = r.width * h, n = r.height * o, a <= 0 || n <= 0) return;
                    var l = i - t.pivotX + r.offsetX * h,
                        _ = s - t.pivotY + r.offsetY * o;
                    e.drawTexture(r, l, _, a, n)
                }
                var u = this._next;
                u != we.NORENDER && u._fun.call(u, t, e, i, s)
            }
            _graphics(t, e, i, s) {
                var r = t._style,
                    a = t._graphics;
                a && a._render(t, e, i - r.pivotX, s - r.pivotY);
                var n = this._next;
                n != we.NORENDER && n._fun.call(n, t, e, i, s)
            }
            _image(t, e, i, s) {
                var r = t._style;
                e.drawTexture2(i, s, r.pivotX, r.pivotY, t.transform, t._graphics._one)
            }
            _image2(t, e, i, s) {
                var r = t._style;
                e.drawTexture2(i, s, r.pivotX, r.pivotY, t.transform, t._graphics._one)
            }
            _alpha(t, e, i, s) {
                var r, a = t._style;
                if ((r = a.alpha) > .01 || t._needRepaint()) {
                    var n = e.globalAlpha;
                    e.globalAlpha *= r;
                    var h = this._next;
                    h._fun.call(h, t, e, i, s), e.globalAlpha = n
                }
            }
            _transform(t, e, i, s) {
                var r = t.transform,
                    a = this._next;
                t._style;
                r && a != we.NORENDER ? (e.save(), e.transform(r.a, r.b, r.c, r.d, r.tx + i, r.ty + s), a._fun.call(a, t, e, 0, 0), e.restore()) : a != we.NORENDER && a._fun.call(a, t, e, i, s)
            }
            _children(t, e, i, s) {
                var r, a = t._style,
                    n = t._children,
                    h = n.length;
                i -= t.pivotX, s -= t.pivotY;
                var o = t._getBit(be.DRAWCALL_OPTIMIZE) && e.drawCallOptimize(!0);
                if (a.viewport) {
                    var l, _, u = a.viewport,
                        c = u.x,
                        d = u.y,
                        p = u.right,
                        f = u.bottom;
                    for (m = 0; m < h; ++m)(r = n[m])._visible && (l = r._x) < p && l + r.width > c && (_ = r._y) < f && _ + r.height > d && r.render(e, i, s)
                } else
                    for (var m = 0; m < h; ++m)(r = n[m])._visible && r.render(e, i, s);
                o && e.drawCallOptimize(!1)
            }
            _canvas(t, e, i, r) {
                var a = t._cacheStyle,
                    n = this._next;
                if (a.enableCanvasRender) {
                    "bitmap" === a.cacheAs ? z.canvasBitmap++ : z.canvasNormal++;
                    var h = !1,
                        o = !1;
                    if (a.canvas) {
                        var l = a.canvas,
                            _ = (l.context, l.touches);
                        if (_)
                            for (var u = 0; u < _.length; u++)
                                if (_[u].deleted) {
                                    o = !0;
                                    break
                                }
                        h = l.isCacheValid && !l.isCacheValid()
                    }
                    if (t._needRepaint() || !a.canvas || o || h || s.stage.isGlobalRepaint())
                        if ("normal" === a.cacheAs) {
                            if (e._targets) return void n._fun.call(n, t, e, i, r);
                            this._canvas_webgl_normal_repaint(t, e)
                        } else this._canvas_repaint(t, e, i, r);
                    var c = a.cacheRect;
                    e.drawCanvas(a.canvas, i + c.x, r + c.y, c.width, c.height)
                } else n._fun.call(n, t, e, i, r)
            }
            _canvas_repaint(t, e, i, s) {
                var r, a, n, h, o, l, _, u, c, d = t._cacheStyle,
                    p = this._next,
                    f = d.canvas,
                    m = d.cacheAs;
                if (c = d._calculateCacheRect(t, m, i, s), _ = c.x, u = c.y, h = d.cacheRect, o = h.width * _, l = h.height * u, a = h.x, n = h.y, "bitmap" === m && (o > 2048 || l > 2048)) return console.warn("cache bitmap size larger than 2048,cache ignored"), d.releaseContext(), void p._fun.call(p, t, e, i, s);
                if (f || (d.createContext(), f = d.canvas), r = f.context, r.sprite = t, (f.width != o || f.height != l) && f.size(o, l), "bitmap" === m ? r.asBitmap = !0 : "normal" === m && (r.asBitmap = !1), r.clear(), 1 != _ || 1 != u) {
                    var g = r;
                    g.save(), g.scale(_, u), p._fun.call(p, t, r, -a, -n), g.restore(), t._applyFilters()
                } else g = r, p._fun.call(p, t, r, -a, -n), t._applyFilters();
                d.staticCache && (d.reCache = !1), z.canvasReCache++
            }
            _canvas_webgl_normal_repaint(t, e) {
                var i = t._cacheStyle,
                    s = this._next,
                    r = i.canvas,
                    a = i.cacheAs;
                i._calculateCacheRect(t, a, 0, 0), r || (r = new Dt(e, t), i.canvas = r);
                var n = r.context;
                r.startRec(), s._fun.call(s, t, n, t.pivotX, t.pivotY), t._applyFilters(), z.canvasReCache++, r.endRec()
            }
            _blend(t, e, i, s) {
                var r = t._style,
                    a = this._next;
                r.blendMode ? (e.save(), e.globalCompositeOperation = r.blendMode, a._fun.call(a, t, e, i, s), e.restore()) : a._fun.call(a, t, e, i, s)
            }
            _mask(t, e, i, s) {
                var r = this._next,
                    a = t.mask,
                    n = e;
                if (a) {
                    n.save();
                    var h = n.globalCompositeOperation,
                        o = new g;
                    if (o.copyFrom(a.getBounds()), o.width = Math.round(o.width), o.height = Math.round(o.height), o.x = Math.round(o.x), o.y = Math.round(o.y), o.width > 0 && o.height > 0) {
                        var l = o.width,
                            _ = o.height,
                            u = Y.getRT(l, _);
                        n.breakNextMerge(), n.pushRT(), n.addRenderObject($.create([n, u, l, _], we.tmpTarget, this)), a.render(n, -o.x, -o.y), n.breakNextMerge(), n.popRT(), n.save();
                        let e = .1;
                        n.clipRect(i + o.x - t.getStyle().pivotX + e, s + o.y - t.getStyle().pivotY + e, l - 2 * e, _ - 2 * e), r._fun.call(r, t, n, i, s), n.restore(), h = n.globalCompositeOperation, n.addRenderObject($.create(["mask"], we.setBlendMode, this));
                        var c = Z.create(H.TEXTURE2D, 0),
                            d = te.INV_UV;
                        n.drawTarget(u, i + o.x - t.getStyle().pivotX, s + o.y - t.getStyle().pivotY, l, _, f.TEMP.identity(), c, d, 6), n.addRenderObject($.create([u], we.recycleTarget, this)), n.addRenderObject($.create([h], we.setBlendMode, this))
                    }
                    n.restore()
                } else r._fun.call(r, t, e, i, s)
            }
            static tmpTarget(t, e, i, s) {
                e.start(), e.clear(0, 0, 0, 0)
            }
            static recycleTarget(t) {
                Y.releaseRT(t)
            }
            static setBlendMode(t) {
                var e = S.mainContext;
                V.targetFns[V.TOINT[t]](e)
            }
        }
        we.INIT = 69905, we.renders = [], we.NORENDER = new we(0, null), we.tempUV = new Array(8);
        class Me extends L {
            constructor(t = !1) {
                super(), this._source = t ? ae.createElement("canvas") : this, this.lock = !0
            }
            get source() {
                return this._source
            }
            _getSource() {
                return this._source
            }
            clear() {
                this._ctx && (this._ctx.clear ? this._ctx.clear() : this._ctx.clearRect(0, 0, this._width, this._height)), this._texture && (this._texture.destroy(), this._texture = null)
            }
            destroy() {
                super.destroy(), this._setCPUMemory(0), this._ctx && this._ctx.destroy && this._ctx.destroy(), this._ctx = null
            }
            release() {}
            get context() {
                return this._ctx ? this._ctx : (this._source == this ? this._ctx = new s.Context : this._ctx = this._source.getContext(s.Render.isConchApp ? "layagl" : "2d"), this._ctx._canvas = this, this._ctx)
            }
            _setContext(t) {
                this._ctx = t
            }
            getContext(t, e = null) {
                return this.context
            }
            getMemSize() {
                return 0
            }
            size(t, e) {
                (this._width != t || this._height != e || this._source && (this._source.width != t || this._source.height != e)) && (this._width = t, this._height = e, this._setCPUMemory(t * e * 4), this._ctx && this._ctx.size && this._ctx.size(t, e), this._source && (this._source.height = e, this._source.width = t), this._texture && (this._texture.destroy(), this._texture = null))
            }
            getTexture() {
                if (!this._texture) {
                    var t = new U;
                    t.loadImageSource(this.source), this._texture = new te(t)
                }
                return this._texture
            }
            toBase64(t, e) {
                if (this._source) {
                    if (s.Render.isConchApp) {
                        var i = window;
                        if (2 == i.conchConfig.threadMode) throw "native 2 thread mode use toBase64Async";
                        var r = this._ctx._targets.sourceWidth,
                            a = this._ctx._targets.sourceHeight,
                            n = this._ctx._targets.getData(0, 0, r, a);
                        return i.conchToBase64FlipY ? i.conchToBase64FlipY(t, e, n.buffer, r, a) : i.conchToBase64(t, e, n.buffer, r, a)
                    }
                    return this._source.toDataURL(t, e)
                }
                return null
            }
            toBase64Async(t, e, i) {
                var s = this._ctx._targets.sourceWidth,
                    r = this._ctx._targets.sourceHeight;
                this._ctx._targets.getDataAsync(0, 0, s, r, function(a) {
                    let n = window;
                    var h = n.conchToBase64FlipY ? n.conchToBase64FlipY(t, e, a.buffer, s, r) : n.conchToBase64(t, e, a.buffer, s, r);
                    i(h)
                })
            }
        }
        class Ie {
            contains(t, e) {
                return !!Ie._isHitGraphic(t, e, this.hit) && !Ie._isHitGraphic(t, e, this.unHit)
            }
            static _isHitGraphic(t, e, i) {
                if (!i) return !1;
                var s, r, a, n = i.cmds;
                if (!n && i._one && (n = Ie._cmds, n.length = 1, n[0] = i._one), !n) return !1;
                for (r = n.length, s = 0; s < r; s++)
                    if (a = n[s], a) {
                        switch (a.cmdID) {
                            case "Translate":
                                t -= a.tx, e -= a.ty
                        }
                        if (Ie._isHitCmd(t, e, a)) return !0
                    }
                return !1
            }
            static _isHitCmd(t, e, i) {
                if (!i) return !1;
                var s = !1;
                switch (i.cmdID) {
                    case "DrawRect":
                        Ie._rect.setTo(i.x, i.y, i.width, i.height), s = Ie._rect.contains(t, e);
                        break;
                    case "DrawCircle":
                        var r;
                        t -= i.x, e -= i.y, r = t * t + e * e, s = r < i.radius * i.radius;
                        break;
                    case "DrawPoly":
                        t -= i.x, e -= i.y, s = Ie._ptInPolygon(t, e, i.points)
                }
                return s
            }
            static _ptInPolygon(t, e, i) {
                var s = Ie._ptPoint;
                s.setTo(t, e);
                var r, a, n, h, o, l = 0;
                o = i.length;
                for (var _ = 0; _ < o; _ += 2)
                    if (r = i[_], a = i[_ + 1], n = i[(_ + 2) % o], h = i[(_ + 3) % o], a != h && !(s.y < Math.min(a, h) || s.y >= Math.max(a, h))) {
                        var u = (s.y - a) * (n - r) / (h - a) + r;
                        u > s.x && l++
                    }
                return l % 2 == 1
            }
            get hit() {
                return this._hit || (this._hit = new s.Graphics), this._hit
            }
            set hit(t) {
                this._hit = t
            }
            get unHit() {
                return this._unHit || (this._unHit = new s.Graphics), this._unHit
            }
            set unHit(t) {
                this._unHit = t
            }
        }
        Ie._cmds = [], Ie._rect = new g, Ie._ptPoint = new m;
        class Pe {
            static regClass(t, e) {
                Pe._classMap[t] = e
            }
            static regShortClassName(t) {
                for (var e = 0; e < t.length; e++) {
                    var i = t[e],
                        s = i.name;
                    Pe._classMap[s] = i
                }
            }
            static getRegClass(t) {
                return Pe._classMap[t]
            }
            static getClass(t) {
                var e = Pe._classMap[t] || Pe._classMap["Laya." + t] || t,
                    i = s.Laya;
                return "string" == typeof e ? s.__classMap[e] || i[t] : e
            }
            static getInstance(t) {
                var e = Pe.getClass(t);
                return e ? new e : (console.warn("[error] Undefined class:", t), null)
            }
            static createByJson(t, e = null, i = null, s = null, r = null) {
                "string" == typeof t && (t = JSON.parse(t));
                var a = t.props;
                if (!e && (e = r ? r.runWith(t) : Pe.getInstance(a.runtime || t.type), !e)) return null;
                var n = t.child;
                if (n)
                    for (var h = 0, o = n.length; h < o; h++) {
                        var l = n[h];
                        if ("render" !== l.props.name && "render" !== l.props.renderType || !e._$set_itemRender)
                            if ("Graphic" == l.type) Pe._addGraphicsToSprite(l, e);
                            else if (Pe._isDrawType(l.type)) Pe._addGraphicToSprite(l, e, !0);
                        else {
                            var _ = Pe.createByJson(l, null, i, s, r);
                            "Script" === l.type ? "owner" in _ ? _.owner = e : "target" in _ && (_.target = e) : "mask" == l.props.renderType ? e.mask = _ : e.addChild(_)
                        } else e.itemRender = l
                    }
                if (a)
                    for (var u in a) {
                        var c = a[u];
                        "var" === u && i ? i[c] = e : c instanceof Array && e[u] instanceof Function ? e[u].apply(e, c) : e[u] = c
                    }
                return s && t.customProps && s.runWith([e, t]), e.created && e.created(), e
            }
            static _addGraphicsToSprite(t, e) {
                var i = t.child;
                if (i && !(i.length < 1)) {
                    var s, r, a = Pe._getGraphicsFromSprite(t, e),
                        n = 0,
                        h = 0;
                    for (t.props && (n = Pe._getObjVar(t.props, "x", 0), h = Pe._getObjVar(t.props, "y", 0)), 0 != n && 0 != h && a.translate(n, h), r = i.length, s = 0; s < r; s++) Pe._addGraphicToGraphics(i[s], a);
                    0 != n && 0 != h && a.translate(-n, -h)
                }
            }
            static _addGraphicToSprite(t, e, i = !1) {
                var s = i ? Pe._getGraphicsFromSprite(t, e) : e.graphics;
                Pe._addGraphicToGraphics(t, s)
            }
            static _getGraphicsFromSprite(t, e) {
                if (!t || !t.props) return e.graphics;
                var i = t.props.renderType;
                if ("hit" === i || "unHit" === i) {
                    var s = e._style.hitArea || (e.hitArea = new Ie);
                    s[i] || (s[i] = new Re);
                    var r = s[i]
                }
                return r || (r = e.graphics), r
            }
            static _getTransformData(t) {
                var e;
                ("pivotX" in t || "pivotY" in t) && (e = e || new f, e.translate(-Pe._getObjVar(t, "pivotX", 0), -Pe._getObjVar(t, "pivotY", 0)));
                var i = Pe._getObjVar(t, "scaleX", 1),
                    s = Pe._getObjVar(t, "scaleY", 1),
                    r = Pe._getObjVar(t, "rotation", 0);
                Pe._getObjVar(t, "skewX", 0), Pe._getObjVar(t, "skewY", 0);
                return 1 == i && 1 == s && 0 == r || (e = e || new f, e.scale(i, s), e.rotate(.0174532922222222 * r)), e
            }
            static _addGraphicToGraphics(t, e) {
                var i, s;
                if ((i = t.props, i) && (s = Pe.DrawTypeDic[t.type], s)) {
                    var r = e,
                        a = Pe._getParams(i, s[1], s[2], s[3]),
                        n = Pe._tM;
                    (n || 1 != Pe._alpha) && (r.save(), n && r.transform(n), 1 != Pe._alpha && r.alpha(Pe._alpha)), r[s[0]].apply(r, a), (n || 1 != Pe._alpha) && r.restore()
                }
            }
            static _adptLineData(t) {
                return t[2] = parseFloat(t[0]) + parseFloat(t[2]), t[3] = parseFloat(t[1]) + parseFloat(t[3]), t
            }
            static _adptTextureData(t) {
                return t[0] = s.Loader.getRes(t[0]), t
            }
            static _adptLinesData(t) {
                return t[2] = Pe._getPointListByStr(t[2]), t
            }
            static _isDrawType(t) {
                return "Image" !== t && t in Pe.DrawTypeDic
            }
            static _getParams(t, e, i = 0, s = null) {
                var r, a, n, h = Pe._temParam;
                for (h.length = e.length, a = e.length, r = 0; r < a; r++) h[r] = Pe._getObjVar(t, e[r][0], e[r][1]);
                return Pe._alpha = Pe._getObjVar(t, "alpha", 1), n = Pe._getTransformData(t), n ? (i || (i = 0), n.translate(h[i], h[i + 1]), h[i] = h[i + 1] = 0, Pe._tM = n) : Pe._tM = null, s && Pe[s] && (h = Pe[s](h)), h
            }
            static _getPointListByStr(t) {
                var e, i, s = t.split(",");
                for (i = s.length, e = 0; e < i; e++) s[e] = parseFloat(s[e]);
                return s
            }
            static _getObjVar(t, e, i) {
                return e in t ? t[e] : i
            }
        }
        Pe.DrawTypeDic = {
            Rect: ["drawRect", [
                ["x", 0],
                ["y", 0],
                ["width", 0],
                ["height", 0],
                ["fillColor", null],
                ["lineColor", null],
                ["lineWidth", 1]
            ]],
            Circle: ["drawCircle", [
                ["x", 0],
                ["y", 0],
                ["radius", 0],
                ["fillColor", null],
                ["lineColor", null],
                ["lineWidth", 1]
            ]],
            Pie: ["drawPie", [
                ["x", 0],
                ["y", 0],
                ["radius", 0],
                ["startAngle", 0],
                ["endAngle", 0],
                ["fillColor", null],
                ["lineColor", null],
                ["lineWidth", 1]
            ]],
            Image: ["drawTexture", [
                ["x", 0],
                ["y", 0],
                ["width", 0],
                ["height", 0]
            ]],
            Texture: ["drawTexture", [
                ["skin", null],
                ["x", 0],
                ["y", 0],
                ["width", 0],
                ["height", 0]
            ], 1, "_adptTextureData"],
            FillTexture: ["fillTexture", [
                ["skin", null],
                ["x", 0],
                ["y", 0],
                ["width", 0],
                ["height", 0],
                ["repeat", null]
            ], 1, "_adptTextureData"],
            FillText: ["fillText", [
                ["text", ""],
                ["x", 0],
                ["y", 0],
                ["font", null],
                ["color", null],
                ["textAlign", null]
            ], 1],
            Line: ["drawLine", [
                ["x", 0],
                ["y", 0],
                ["toX", 0],
                ["toY", 0],
                ["lineColor", null],
                ["lineWidth", 0]
            ], 0, "_adptLineData"],
            Lines: ["drawLines", [
                ["x", 0],
                ["y", 0],
                ["points", ""],
                ["lineColor", null],
                ["lineWidth", 0]
            ], 0, "_adptLinesData"],
            Curves: ["drawCurves", [
                ["x", 0],
                ["y", 0],
                ["points", ""],
                ["lineColor", null],
                ["lineWidth", 0]
            ], 0, "_adptLinesData"],
            Poly: ["drawPoly", [
                ["x", 0],
                ["y", 0],
                ["points", ""],
                ["fillColor", null],
                ["lineColor", null],
                ["lineWidth", 1]
            ], 0, "_adptLinesData"]
        }, Pe._temParam = [], Pe._classMap = {};
        class De {
            reset() {
                return this.bounds && this.bounds.recover(), this.userBounds && this.userBounds.recover(), this.bounds = null, this.userBounds = null, this.temBM = null, this
            }
            recover() {
                r.recover("BoundsStyle", this.reset())
            }
            static create() {
                return r.getItemByClass("BoundsStyle", De)
            }
        }
        class Le {
            constructor() {
                this.reset()
            }
            needBitmapCache() {
                return this.cacheForFilters || !!this.mask
            }
            needEnableCanvasRender() {
                return "none" != this.userSetCache || this.cacheForFilters || !!this.mask
            }
            releaseContext() {
                if (this.canvas && this.canvas.size) {
                    r.recover("CacheCanvas", this.canvas), this.canvas.size(0, 0);
                    try {
                        this.canvas.width = 0, this.canvas.height = 0
                    } catch (t) {}
                }
                this.canvas = null
            }
            createContext() {
                if (!this.canvas) {
                    this.canvas = r.getItem("CacheCanvas") || new Me(!1);
                    var t = this.canvas.context;
                    t || (t = this.canvas.getContext("2d"))
                }
            }
            releaseFilterCache() {
                var t = this.filterCache;
                t && (t.destroy(), t.recycle(), this.filterCache = null)
            }
            recover() {
                this !== Le.EMPTY && r.recover("SpriteCache", this.reset())
            }
            reset() {
                return this.releaseContext(), this.releaseFilterCache(), this.cacheAs = "none", this.enableCanvasRender = !1, this.userSetCache = "none", this.cacheForFilters = !1, this.staticCache = !1, this.reCache = !0, this.mask = null, this.maskParent = null, this.filterCache = null, this.filters = null, this.hasGlowFilter = !1, this.cacheRect && this.cacheRect.recover(), this.cacheRect = null, this
            }
            static create() {
                return r.getItemByClass("SpriteCache", Le)
            }
            _calculateCacheRect(t, e, i, s) {
                var r, a = t._cacheStyle;
                if (a.cacheRect || (a.cacheRect = g.create()), "bitmap" === e ? (r = t.getSelfBounds(), r.width = r.width + 2 * Le.CANVAS_EXTEND_EDGE, r.height = r.height + 2 * Le.CANVAS_EXTEND_EDGE, r.x = r.x - t.pivotX, r.y = r.y - t.pivotY, r.x = r.x - Le.CANVAS_EXTEND_EDGE, r.y = r.y - Le.CANVAS_EXTEND_EDGE, r.x = Math.floor(r.x + i) - i, r.y = Math.floor(r.y + s) - s, r.width = Math.floor(r.width), r.height = Math.floor(r.height), a.cacheRect.copyFrom(r)) : a.cacheRect.setTo(-t._style.pivotX, -t._style.pivotY, 1, 1), r = a.cacheRect, t._style.scrollRect) {
                    var n = t._style.scrollRect;
                    r.x -= n.x, r.y -= n.y
                }
                return Le._scaleInfo.setTo(1, 1), Le._scaleInfo
            }
        }
        Le.EMPTY = new Le, Le._scaleInfo = new m, Le.CANVAS_EXTEND_EDGE = 16;
        class Be {
            constructor() {
                this.reset()
            }
            reset() {
                return this.scaleX = this.scaleY = 1, this.skewX = this.skewY = 0, this.pivotX = this.pivotY = this.rotation = 0, this.alpha = 1, this.scrollRect && this.scrollRect.recover(), this.scrollRect = null, this.viewport && this.viewport.recover(), this.viewport = null, this.hitArea = null, this.dragging = null, this.blendMode = null, this
            }
            recover() {
                this !== Be.EMPTY && r.recover("SpriteStyle", this.reset())
            }
            static create() {
                return r.getItemByClass("SpriteStyle", Be)
            }
        }
        Be.EMPTY = new Be;
        class Fe extends M {
            constructor() {
                super(), this._bits = 0, this._children = Fe.ARRAY_EMPTY, this._extUIChild = Fe.ARRAY_EMPTY, this._parent = null, this.name = "", this.destroyed = !1, this.createGLBuffer()
            }
            createGLBuffer() {}
            _setBit(t, e) {
                if (t === be.DISPLAY) {
                    var i = this._getBit(t);
                    i != e && this._updateDisplayedInstage()
                }
                e ? this._bits |= t : this._bits &= ~t
            }
            _getBit(t) {
                return 0 != (this._bits & t)
            }
            _setUpNoticeChain() {
                this._getBit(be.DISPLAY) && this._setBitUp(be.DISPLAY)
            }
            _setBitUp(t) {
                var e = this;
                for (e._setBit(t, !0), e = e._parent; e;) {
                    if (e._getBit(t)) return;
                    e._setBit(t, !0), e = e._parent
                }
            }
            on(t, e, i, s = null) {
                return t !== Jt.DISPLAY && t !== Jt.UNDISPLAY || this._getBit(be.DISPLAY) || this._setBitUp(be.DISPLAY), this._createListener(t, e, i, s, !1)
            }
            once(t, e, i, s = null) {
                return t !== Jt.DISPLAY && t !== Jt.UNDISPLAY || this._getBit(be.DISPLAY) || this._setBitUp(be.DISPLAY), this._createListener(t, e, i, s, !0)
            }
            destroy(t = !0) {
                this.destroyed = !0, this._destroyAllComponent(), this._children && (t ? this.destroyChildren() : this.removeChildren()), this._cacheStyle && this.mask && !this.mask.destroyed && t && this.mask.destroy(), this._parent && this._parent.removeChild(this), this.onDestroy(), this._children = null, this.event(Jt.DESTORYED, {
                    ignoreDestroyed: !0
                }), this.offAll()
            }
            onDestroy() {}
            destroyChildren() {
                for (; this._children && this._children.length > 0;) this._children[0].destroy(!0)
            }
            addChild(t) {
                if (!t || this.destroyed || t === this) return t;
                if (t._zOrder && this._setBit(be.HAS_ZORDER, !0),
                    t._parent === this) {
                    var e = this.getChildIndex(t);
                    e !== this._children.length - 1 && (this._children.splice(e, 1), this._children.push(t), this._childChanged())
                } else t._parent && t._parent.removeChild(t), this._children === Fe.ARRAY_EMPTY && (this._children = []), this._children.push(t), t._setParent(this), this._childChanged();
                return t
            }
            addInputChild(t) {
                if (this._extUIChild == Fe.ARRAY_EMPTY) this._extUIChild = [t];
                else {
                    if (this._extUIChild.indexOf(t) >= 0) return null;
                    this._extUIChild.push(t)
                }
                return null
            }
            removeInputChild(t) {
                var e = this._extUIChild.indexOf(t);
                e >= 0 && this._extUIChild.splice(e, 1)
            }
            addChildren(...t) {
                for (var e = 0, i = t.length; e < i;) this.addChild(t[e++])
            }
            addChildAt(t, e) {
                if (!t || this.destroyed || t === this) return t;
                if (t._zOrder && this._setBit(be.HAS_ZORDER, !0), e >= 0 && e <= this._children.length) {
                    if (t._parent === this) {
                        var i = this.getChildIndex(t);
                        this._children.splice(i, 1), this._children.splice(e, 0, t), this._childChanged()
                    } else t._parent && t._parent.removeChild(t), this._children === Fe.ARRAY_EMPTY && (this._children = []), this._children.splice(e, 0, t), t._setParent(this);
                    return t
                }
                throw new Error("appendChildAt:The index is out of bounds")
            }
            getChildIndex(t) {
                return this._children.indexOf(t)
            }
            getChildByName(t) {
                var e = this._children;
                if (e)
                    for (var i = 0, s = e.length; i < s; i++) {
                        var r = e[i];
                        if (r && r.name === t) return r
                    }
                return null
            }
            getChildAt(t) {
                return this._children[t] || null
            }
            setChildIndex(t, e) {
                var i = this._children;
                if (e < 0 || e >= i.length) throw new Error("setChildIndex:The index is out of bounds.");
                var s = this.getChildIndex(t);
                if (s < 0) throw new Error("setChildIndex:node is must child of this object.");
                return i.splice(s, 1), i.splice(e, 0, t), this._childChanged(), t
            }
            _childChanged(t = null) {}
            removeChild(t) {
                if (!this._children) return t;
                var e = this._children.indexOf(t);
                return this.removeChildAt(e)
            }
            removeSelf() {
                return this._parent && this._parent.removeChild(this), this
            }
            removeChildByName(t) {
                var e = this.getChildByName(t);
                return e && this.removeChild(e), e
            }
            removeChildAt(t) {
                var e = this.getChildAt(t);
                return e && (this._children.splice(t, 1), e._setParent(null)), e
            }
            removeChildren(t = 0, e = 2147483647) {
                if (this._children && this._children.length > 0) {
                    var i = this._children;
                    if (0 === t && e >= i.length - 1) {
                        var s = i;
                        this._children = Fe.ARRAY_EMPTY
                    } else s = i.splice(t, e - t + 1);
                    for (var r = 0, a = s.length; r < a; r++) s[r]._setParent(null)
                }
                return this
            }
            replaceChild(t, e) {
                var i = this._children.indexOf(e);
                return i > -1 ? (this._children.splice(i, 1, t), e._setParent(null), t._setParent(this), t) : null
            }
            get numChildren() {
                return this._children.length
            }
            get parent() {
                return this._parent
            }
            _setParent(t) {
                this._parent !== t && (t ? (this._parent = t, this._onAdded(), this.event(Jt.ADDED), this._getBit(be.DISPLAY) && (this._setUpNoticeChain(), t.displayedInStage && this._displayChild(this, !0)), t._childChanged(this)) : (this._onRemoved(), this.event(Jt.REMOVED), this._parent._childChanged(), this._getBit(be.DISPLAY) && this._displayChild(this, !1), this._parent = t))
            }
            get displayedInStage() {
                return this._getBit(be.DISPLAY) ? this._getBit(be.DISPLAYED_INSTAGE) : (this._setBitUp(be.DISPLAY), this._getBit(be.DISPLAYED_INSTAGE))
            }
            _updateDisplayedInstage() {
                var t;
                t = this;
                for (var e = s.stage, i = !1; t;) {
                    if (t._getBit(be.DISPLAY)) {
                        i = t._getBit(be.DISPLAYED_INSTAGE);
                        break
                    }
                    if (t === e || t._getBit(be.DISPLAYED_INSTAGE)) {
                        i = !0;
                        break
                    }
                    t = t._parent
                }
                this._setBit(be.DISPLAYED_INSTAGE, i)
            }
            _setDisplay(t) {
                this._getBit(be.DISPLAYED_INSTAGE) !== t && (this._setBit(be.DISPLAYED_INSTAGE, t), t ? this.event(Jt.DISPLAY) : this.event(Jt.UNDISPLAY))
            }
            _displayChild(t, e) {
                var i = t._children;
                if (i)
                    for (var s = 0, r = i.length; s < r; s++) {
                        var a = i[s];
                        a && (a._getBit(be.DISPLAY) && (a._children.length > 0 ? this._displayChild(a, e) : a._setDisplay(e)))
                    }
                t._setDisplay(e)
            }
            contains(t) {
                if (t === this) return !0;
                for (; t;) {
                    if (t._parent === this) return !0;
                    t = t._parent
                }
                return !1
            }
            timerLoop(t, e, i, r = null, a = !0, n = !1) {
                var h = this.scene ? this.scene.timer : s.timer;
                h.loop(t, e, i, r, a, n)
            }
            timerOnce(t, e, i, r = null, a = !0) {
                var n = this.scene ? this.scene.timer : s.timer;
                n._create(!1, !1, t, e, i, r, a)
            }
            frameLoop(t, e, i, r = null, a = !0) {
                var n = this.scene ? this.scene.timer : s.timer;
                n._create(!0, !0, t, e, i, r, a)
            }
            frameOnce(t, e, i, r = null, a = !0) {
                var n = this.scene ? this.scene.timer : s.timer;
                n._create(!0, !1, t, e, i, r, a)
            }
            clearTimer(t, e) {
                var i = this.scene ? this.scene.timer : s.timer;
                i.clear(t, e)
            }
            callLater(t, e = null) {
                var i = this.scene ? this.scene.timer : s.timer;
                i.callLater(this, t, e)
            }
            runCallLater(t) {
                var e = this.scene ? this.scene.timer : s.timer;
                e.runCallLater(this, t)
            }
            get scene() {
                return this._scene
            }
            get ccActive() {
                return this.active
            }
            set ccActive(t) {
                this.visible = t, this.active = t
            }
            get active() {
                return !this._getBit(be.NOT_READY) && !this._getBit(be.NOT_ACTIVE)
            }
            set active(t) {
                if (t = !!t, !this._getBit(be.NOT_ACTIVE) !== t) {
                    if (this._activeChangeScripts && 0 !== this._activeChangeScripts.length) throw t ? "Node: can't set the main inActive node active in hierarchy,if the operate is in main inActive node or it's children script's onDisable Event." : "Node: can't set the main active node inActive in hierarchy,if the operate is in main active node or it's children script's onEnable Event.";
                    this._setBit(be.NOT_ACTIVE, !t), this._parent && this._parent.activeInHierarchy && (t ? this._processActive() : this._processInActive()), this.event(Jt.ACTIVED)
                }
            }
            get activeInHierarchy() {
                return this._getBit(be.ACTIVE_INHIERARCHY)
            }
            _onActive() {
                z.spriteCount++
            }
            _onInActive() {
                z.spriteCount--
            }
            _onActiveInScene() {}
            _onInActiveInScene() {}
            _parse(t, e) {}
            _setBelongScene(t) {
                if (!this._scene) {
                    this._scene = t, this._onActiveInScene();
                    for (var e = 0, i = this._children.length; e < i; e++) this._children[e]._setBelongScene(t)
                }
            }
            _setUnBelongScene() {
                if (this._scene !== this) {
                    this._onInActiveInScene(), this._scene = null;
                    for (var t = 0, e = this._children.length; t < e; t++) this._children[t]._setUnBelongScene()
                }
            }
            onAwake() {}
            onEnable() {}
            _processActive() {
                this._activeChangeScripts || (this._activeChangeScripts = []), this._activeHierarchy(this._activeChangeScripts), this._activeScripts()
            }
            _activeHierarchy(t) {
                if (this._setBit(be.ACTIVE_INHIERARCHY, !0), this._components)
                    for (var e = 0, i = this._components.length; e < i; e++) {
                        var s = this._components[e];
                        s._isScript() ? s._enabled && t.push(s) : s._setActive(!0)
                    }
                for (this._onActive(), e = 0, i = this._children.length; e < i; e++) {
                    var r = this._children[e];
                    !r._getBit(be.NOT_ACTIVE) && !r._getBit(be.NOT_READY) && r._activeHierarchy(t)
                }
                this._getBit(be.AWAKED) || (this._setBit(be.AWAKED, !0), this.onAwake()), this.onEnable()
            }
            _activeScripts() {
                for (var t = 0, e = this._activeChangeScripts.length; t < e; t++) {
                    var i = this._activeChangeScripts[t],
                        s = i.owner;
                    s && !i._awaked && (i._awaked = !0, i._onAwake()), s && s.activeInHierarchy && i._onEnable()
                }
                this._activeChangeScripts.length = 0
            }
            _processInActive() {
                this._activeChangeScripts || (this._activeChangeScripts = []), this._inActiveHierarchy(this._activeChangeScripts), this._inActiveScripts()
            }
            _inActiveHierarchy(t) {
                if (this._onInActive(), this._components)
                    for (var e = 0, i = this._components.length; e < i; e++) {
                        var s = this._components[e];
                        !s._isScript() && s._setActive(!1), s._isScript() && s._enabled && t.push(s)
                    }
                for (this._setBit(be.ACTIVE_INHIERARCHY, !1), e = 0, i = this._children.length; e < i; e++) {
                    var r = this._children[e];
                    r && !r._getBit(be.NOT_ACTIVE) && r._inActiveHierarchy(t)
                }
                this.onDisable()
            }
            _inActiveScripts() {
                for (var t = 0, e = this._activeChangeScripts.length; t < e; t++) this._activeChangeScripts[t].owner && this._activeChangeScripts[t]._onDisable();
                this._activeChangeScripts.length = 0
            }
            onDisable() {}
            _onAdded() {
                if (this._activeChangeScripts && 0 !== this._activeChangeScripts.length) throw "Node: can't set the main inActive node active in hierarchy,if the operate is in main inActive node or it's children script's onDisable Event.";
                var t = this._parent.scene;
                t && this._setBelongScene(t), this._parent.activeInHierarchy && this.active && this._processActive()
            }
            _onRemoved() {
                if (this._activeChangeScripts && 0 !== this._activeChangeScripts.length) throw "Node: can't set the main active node inActive in hierarchy,if the operate is in main active node or it's children script's onEnable Event.";
                this._parent.activeInHierarchy && this.active && this._processInActive(), this._parent.scene && this._setUnBelongScene()
            }
            _addComponentInstance(t) {
                this._components = this._components || [], this._components.push(t), t.owner = this, t._onAdded(), this.activeInHierarchy && t._setActive(!0)
            }
            _destroyComponent(t) {
                if (this._components)
                    for (var e = 0, i = this._components.length; e < i; e++) {
                        var s = this._components[e];
                        if (s === t) {
                            s._destroy(), this._components.splice(e, 1);
                            break
                        }
                    }
            }
            _destroyAllComponent() {
                if (this._components) {
                    for (var t = 0, e = this._components.length; t < e; t++) {
                        var i = this._components[t];
                        i && i._destroy()
                    }
                    this._components.length = 0
                }
            }
            _cloneTo(t, e, i) {
                var s = t;
                if (this._components)
                    for (var r = 0, a = this._components.length; r < a; r++) {
                        var n = s.addComponent(this._components[r].constructor);
                        this._components[r]._cloneTo(n)
                    }
            }
            addComponentIntance(t) {
                if (t.owner) throw "Node:the component has belong to other node.";
                if (t.isSingleton && this.getComponent(t.constructor)) throw "Node:the component is singleton,can't add the second one.";
                return this._addComponentInstance(t), t
            }
            addComponent(t) {
                var e = r.createByClass(t);
                if (!e) throw t.toString() + "组件不存在";
                if (e._destroyed = !1, e.isSingleton && this.getComponent(t)) throw "无法实例" + t + "组件，" + t + "组件已存在！";
                return this._addComponentInstance(e), e
            }
            getComponent(t) {
                if (this._components)
                    for (var e = 0, i = this._components.length; e < i; e++) {
                        var s = this._components[e];
                        if (s instanceof t) return s
                    }
                return null
            }
            getComponents(t) {
                var e;
                if (this._components)
                    for (var i = 0, s = this._components.length; i < s; i++) {
                        var r = this._components[i];
                        r instanceof t && (e = e || [], e.push(r))
                    }
                return e
            }
            get timer() {
                return this.scene ? this.scene.timer : s.timer
            }
        }
        Fe.ARRAY_EMPTY = [], Pe.regClass("laya.display.Node", Fe), Pe.regClass("Laya.Node", Fe);
        class Oe extends Fe {
            constructor() {
                super(), this._x = 0, this._y = 0, this._width = 0, this._height = 0, this._visible = !0, this._mouseState = 0, this._zOrder = 0, this._renderType = 0, this._transform = null, this._tfChanged = !1, this._repaint = ve.REPAINT_NONE, this._texture = null, this._style = Be.EMPTY, this._cacheStyle = Le.EMPTY, this._boundStyle = null, this._graphics = null, this.mouseThrough = !1, this.autoSize = !1, this.hitTestPrior = !1
            }
            destroy(t = !0) {
                super.destroy(t), this._style && this._style.recover(), this._cacheStyle && this._cacheStyle.recover(), this._boundStyle && this._boundStyle.recover(), this._transform && this._transform.recover(), this._style = null, this._cacheStyle = null, this._boundStyle = null, this._transform = null, this._graphics && this._graphics.autoDestroy && this._graphics.destroy(), this._graphics = null, this.texture = null
            }
            updateZOrder() {
                tt.updateOrder(this._children) && this.repaint()
            }
            _getBoundsStyle() {
                return this._boundStyle || (this._boundStyle = De.create()), this._boundStyle
            }
            _setCustomRender() {}
            set customRenderEnable(t) {
                t && (this._renderType |= ve.CUSTOM, this._setRenderType(this._renderType), this._setCustomRender())
            }
            get cacheAs() {
                return this._cacheStyle.cacheAs
            }
            _setCacheAs(t) {}
            set cacheAs(t) {
                t !== this._cacheStyle.userSetCache && (this.mask && "normal" === t || (this._setCacheAs(t), this._getCacheStyle().userSetCache = t, this._checkCanvasEnable(), this.repaint()))
            }
            _checkCanvasEnable() {
                var t = this._cacheStyle.needEnableCanvasRender();
                this._getCacheStyle().enableCanvasRender = t, t ? (this._cacheStyle.needBitmapCache() ? this._cacheStyle.cacheAs = "bitmap" : this._cacheStyle.cacheAs = this._cacheStyle.userSetCache, this._cacheStyle.reCache = !0, this._renderType |= ve.CANVAS) : (this._cacheStyle.cacheAs = "none", this._cacheStyle.releaseContext(), this._renderType &= ~ve.CANVAS), this._setCacheAs(this._cacheStyle.cacheAs), this._setRenderType(this._renderType)
            }
            get staticCache() {
                return this._cacheStyle.staticCache
            }
            set staticCache(t) {
                this._getCacheStyle().staticCache = t, t || this.reCache()
            }
            reCache() {
                this._cacheStyle.reCache = !0, this._repaint |= ve.REPAINT_CACHE
            }
            getRepaint() {
                return this._repaint
            }
            _setX(t) {
                this._x = t
            }
            _setY(t) {
                this._y = t
            }
            _setWidth(t, e) {}
            _setHeight(t, e) {}
            get x() {
                return this._x
            }
            set x(t) {
                if (!this.destroyed && this._x !== t) {
                    this._setX(t), this.parentRepaint(ve.REPAINT_CACHE);
                    var e = this._cacheStyle.maskParent;
                    e && e.repaint(ve.REPAINT_CACHE), this.event(Jt.POSITION_CHANGED)
                }
            }
            get y() {
                return this._y
            }
            set y(t) {
                if (!this.destroyed && this._y !== t) {
                    this._setY(t), this.parentRepaint(ve.REPAINT_CACHE);
                    var e = this._cacheStyle.maskParent;
                    e && e.repaint(ve.REPAINT_CACHE), this.event(Jt.POSITION_CHANGED)
                }
            }
            get width() {
                return this.get_width()
            }
            set width(t) {
                this.set_width(t)
            }
            set_width(t) {
                this._width !== t && (this._width = t, this._setWidth(this.texture, t), this._setTranformChange())
            }
            get_width() {
                return this.autoSize ? this.texture ? this.texture.width : this._graphics || 0 !== this._children.length ? this.getSelfBounds().width : 0 : this._width || (this.texture ? this.texture.width : 0)
            }
            get height() {
                return this.get_height()
            }
            set height(t) {
                this.set_height(t)
            }
            set_height(t) {
                this._height !== t && (this._height = t, this._setHeight(this.texture, t), this._setTranformChange())
            }
            get_height() {
                return this.autoSize ? this.texture ? this.texture.height : this._graphics || 0 !== this._children.length ? this.getSelfBounds().height : 0 : this._height || (this.texture ? this.texture.height : 0)
            }
            get displayWidth() {
                return this.width * this.scaleX
            }
            get displayHeight() {
                return this.height * this.scaleY
            }
            setSelfBounds(t) {
                this._getBoundsStyle().userBounds = t
            }
            getBounds() {
                return this._getBoundsStyle().bounds = g._getWrapRec(this._boundPointsToParent())
            }
            getSelfBounds() {
                return this._boundStyle && this._boundStyle.userBounds ? this._boundStyle.userBounds : this._graphics || 0 !== this._children.length || this._texture ? this._getBoundsStyle().bounds = g._getWrapRec(this._getBoundPointsM(!1)) : g.TEMP.setTo(0, 0, this.width, this.height)
            }
            _boundPointsToParent(t = !1) {
                var e = 0,
                    i = 0;
                this._style && (e = this.pivotX, i = this.pivotY, t = t || 0 !== this._style.rotation, this._style.scrollRect && (e += this._style.scrollRect.x, i += this._style.scrollRect.y));
                var s = this._getBoundPointsM(t);
                if (!s || s.length < 1) return s;
                if (8 != s.length && (s = t ? ut.scanPList(s) : g._getWrapRec(s, g.TEMP)._getBoundPoints()), !this.transform) return tt.transPointList(s, this._x - e, this._y - i), s;
                var r, a = m.TEMP,
                    n = s.length;
                for (r = 0; r < n; r += 2) a.x = s[r], a.y = s[r + 1], this.toParentPoint(a), s[r] = a.x, s[r + 1] = a.y;
                return s
            }
            getGraphicBounds(t = !1) {
                return this._graphics ? this._graphics.getBounds(t) : g.TEMP.setTo(0, 0, 0, 0)
            }
            _getBoundPointsM(t = !1) {
                if (this._boundStyle && this._boundStyle.userBounds) return this._boundStyle.userBounds._getBoundPoints();
                if (this._boundStyle || this._getBoundsStyle(), this._boundStyle.temBM || (this._boundStyle.temBM = []), this._style.scrollRect) {
                    var e = tt.clearArray(this._boundStyle.temBM),
                        i = g.TEMP;
                    return i.copyFrom(this._style.scrollRect), tt.concatArray(e, i._getBoundPoints()), e
                }
                var s, r, a, n;
                s = this._graphics ? this._graphics.getBoundPoints() : tt.clearArray(this._boundStyle.temBM), this._texture && (i = g.TEMP, i.setTo(0, 0, this.width || this._texture.width, this.height || this._texture.height), tt.concatArray(s, i._getBoundPoints())), n = this._children;
                for (var h = 0, o = n.length; h < o; h++) r = n[h], r instanceof Oe && !0 === r._visible && (a = r._boundPointsToParent(t), a && (s = s ? tt.concatArray(s, a) : a));
                return s
            }
            _getCacheStyle() {
                return this._cacheStyle === Le.EMPTY && (this._cacheStyle = Le.create()), this._cacheStyle
            }
            getStyle() {
                return this._style === Be.EMPTY && (this._style = Be.create()), this._style
            }
            setStyle(t) {
                this._style = t
            }
            get scaleX() {
                return this._style.scaleX
            }
            set scaleX(t) {
                this.set_scaleX(t)
            }
            _setScaleX(t) {
                this._style.scaleX = t
            }
            get scaleY() {
                return this._style.scaleY
            }
            set scaleY(t) {
                this.set_scaleY(t)
            }
            _setScaleY(t) {
                this._style.scaleY = t
            }
            set_scaleX(t) {
                var e = this.getStyle();
                e.scaleX !== t && (this._setScaleX(t), this._setTranformChange())
            }
            get_scaleX() {
                return this._style.scaleX
            }
            set_scaleY(t) {
                var e = this.getStyle();
                e.scaleY !== t && (this._setScaleY(t), this._setTranformChange())
            }
            get_scaleY() {
                return this._style.scaleY
            }
            get rotation() {
                return this._style.rotation
            }
            set rotation(t) {
                var e = this.getStyle();
                e.rotation !== t && (this._setRotation(t), this._setTranformChange())
            }
            _setRotation(t) {
                this._style.rotation = t
            }
            get skewX() {
                return this._style.skewX
            }
            set skewX(t) {
                var e = this.getStyle();
                e.skewX !== t && (this._setSkewX(t), this._setTranformChange())
            }
            _setSkewX(t) {
                this._style.skewX = t
            }
            get skewY() {
                return this._style.skewY
            }
            set skewY(t) {
                var e = this.getStyle();
                e.skewY !== t && (this._setSkewY(t), this._setTranformChange())
            }
            _setSkewY(t) {
                this._style.skewY = t
            }
            _createTransform() {
                return f.create()
            }
            _adjustTransform() {
                this._tfChanged = !1;
                var t = this._style,
                    e = t.scaleX,
                    i = t.scaleY,
                    s = t.skewX,
                    r = t.skewY,
                    a = t.rotation,
                    n = this._transform || (this._transform = this._createTransform());
                if (a || 1 !== e || 1 !== i || 0 !== s || 0 !== r) {
                    n._bTransform = !0;
                    var h = .0174532922222222 * (a - s),
                        o = .0174532922222222 * (a + r),
                        l = Math.cos(o),
                        _ = Math.sin(o),
                        u = Math.sin(h),
                        c = Math.cos(h);
                    n.a = e * l, n.b = e * _, n.c = -i * u, n.d = i * c, n.tx = n.ty = 0
                } else n.identity(), this._renderType &= ~ve.TRANSFORM, this._setRenderType(this._renderType);
                return n
            }
            _setTransform(t) {}
            get transform() {
                return this._tfChanged ? this._adjustTransform() : this._transform
            }
            set transform(t) {
                this.set_transform(t)
            }
            get_transform() {
                return this._tfChanged ? this._adjustTransform() : this._transform
            }
            set_transform(t) {
                this._tfChanged = !1;
                var e = this._transform || (this._transform = this._createTransform());
                t.copyTo(e), this._setTransform(e), t && (this._x = e.tx, this._y = e.ty, e.tx = e.ty = 0), t ? this._renderType |= ve.TRANSFORM : this._renderType &= ~ve.TRANSFORM, this._setRenderType(this._renderType), this.parentRepaint()
            }
            _setPivotX(t) {
                var e = this.getStyle();
                e.pivotX = t
            }
            _getPivotX() {
                return this._style.pivotX
            }
            _setPivotY(t) {
                var e = this.getStyle();
                e.pivotY = t
            }
            _getPivotY() {
                return this._style.pivotY
            }
            get pivotX() {
                return this._getPivotX()
            }
            set pivotX(t) {
                this._setPivotX(t), this.repaint()
            }
            get pivotY() {
                return this._getPivotY()
            }
            set pivotY(t) {
                this._setPivotY(t), this.repaint()
            }
            _setAlpha(t) {
                if (this._style.alpha !== t) {
                    var e = this.getStyle();
                    e.alpha = t, 1 !== t ? this._renderType |= ve.ALPHA : this._renderType &= ~ve.ALPHA, this._setRenderType(this._renderType), this.parentRepaint()
                }
            }
            _getAlpha() {
                return this._style.alpha
            }
            get alpha() {
                return this._getAlpha()
            }
            set alpha(t) {
                t = t < 0 ? 0 : t > 1 ? 1 : t, this._setAlpha(t)
            }
            get visible() {
                return this.get_visible()
            }
            set visible(t) {
                this.set_visible(t)
            }
            get_visible() {
                return this._visible
            }
            set_visible(t) {
                this._visible !== t && (this._visible = t, this.parentRepaint(ve.REPAINT_ALL), this.event(Jt.VISIBLE))
            }
            _setBlendMode(t) {}
            get blendMode() {
                return this._style.blendMode
            }
            set blendMode(t) {
                this._setBlendMode(t), this.getStyle().blendMode = t, t && "source-over" != t ? this._renderType |= ve.BLEND : this._renderType &= ~ve.BLEND, this._setRenderType(this._renderType), this.parentRepaint()
            }
            get graphics() {
                return this._graphics || (this.graphics = new Re, this._graphics.autoDestroy = !0), this._graphics
            }
            _setGraphics(t) {}
            _setGraphicsCallBack() {}
            set graphics(t) {
                this._graphics && (this._graphics._sp = null), this._graphics = t, t ? (this._setGraphics(t), this._renderType |= ve.GRAPHICS, t._sp = this) : this._renderType &= ~ve.GRAPHICS, this._setRenderType(this._renderType), this.repaint()
            }
            get scrollRect() {
                return this._style.scrollRect
            }
            _setScrollRect(t) {}
            set scrollRect(t) {
                this.getStyle().scrollRect = t, this._setScrollRect(t), this.repaint(), t ? this._renderType |= ve.CLIP : this._renderType &= ~ve.CLIP, this._setRenderType(this._renderType)
            }
            pos(t, e, i = !1) {
                if (this._x !== t || this._y !== e) {
                    if (this.destroyed) return this;
                    if (i) {
                        this._setX(t), this._setY(e), this.parentRepaint(ve.REPAINT_CACHE);
                        var s = this._cacheStyle.maskParent;
                        s && s.repaint(ve.REPAINT_CACHE)
                    } else this.x = t, this.y = e;
                    this.event(Jt.POSITION_CHANGED)
                }
                return this
            }
            pivot(t, e) {
                return this.pivotX = t, this.pivotY = e, this
            }
            size(t, e) {
                return this.width = t, this.height = e, this
            }
            scale(t, e, i = !1) {
                var s = this.getStyle();
                if (s.scaleX != t || s.scaleY != e) {
                    if (this.destroyed) return this;
                    i ? (this._setScaleX(t), this._setScaleY(e), this._setTranformChange()) : (this.scaleX = t, this.scaleY = e)
                }
                return this
            }
            skew(t, e) {
                return this.skewX = t, this.skewY = e, this
            }
            render(t, e, i) {
                we.renders[this._renderType]._fun(this, t, e + this._x, i + this._y), this._repaint = 0
            }
            drawToCanvas(t, e, i, s) {
                return Oe.drawToCanvas(this, this._renderType, t, e, i, s)
            }
            drawToTexture(t, e, i, s, r = null) {
                return Oe.drawToTexture(this, this._renderType, t, e, i, s, r)
            }
            drawToTexture3D(t, e, i) {
                throw "not implement"
            }
            static drawToCanvas(t, e, i, s, r, a) {
                r |= 0, a |= 0, i |= 0, s |= 0;
                var n = new le;
                n.size(i, s), n.asBitmap = !0, n._targets.start(), n._targets.clear(0, 0, 0, 0), we.renders[e]._fun(t, n, r, a), n.flush(), n._targets.end(), n._targets.restore();
                var h = n._targets.getData(0, 0, i, s);
                n.destroy();
                var o = new Me(!0);
                o.size(i, s);
                for (var l = o.getContext("2d"), _ = l.getImageData(0, 0, i, s), u = 4 * i, c = _.data, d = s - 1, p = d * u, f = 0; d >= 0; d--) c.set(h.subarray(f, f + u), p), p -= u, f += u;
                o = new Me(!0);
                o.size(i, s);
                l = o.getContext("2d");
                return l.putImageData(_, 0, 0), o
            }
            static drawToTexture(t, e, i, s, r, a, n = null) {
                Oe.drawtocanvCtx || (Oe.drawtocanvCtx = new le), r -= t.x, a -= t.y, r |= 0, a |= 0, i |= 0, s |= 0;
                var h = n ? Oe.drawtocanvCtx : new le;
                if (h.clear(), n && h._targets && (h._targets.destroy(), h._targets = null), h.size(i, s), n ? h._targets = n : h.asBitmap = !0, h._targets && (h._targets.start(), h._targets.clear(0, 0, 0, 0), we.renders[e]._fun(t, h, r, a), h.flush(), h._targets.end(), h._targets.restore()), !n) {
                    var o = new te(h._targets, te.INV_UV);
                    return h.destroy(!0), o
                }
                return h._targets = null, t._repaint = 0, n
            }
            customRender(t, e, i) {
                this._repaint = ve.REPAINT_ALL
            }
            _applyFilters() {}
            get filters() {
                return this._cacheStyle.filters
            }
            _setColorFilter(t) {}
            set filters(t) {
                t && 0 === t.length && (t = null), this._cacheStyle.filters != t && (this._getCacheStyle().filters = t ? t.slice() : null, t && t.length ? (this._setColorFilter(t[0]), this._renderType |= ve.FILTERS) : (this._setColorFilter(null), this._renderType &= ~ve.FILTERS), this._setRenderType(this._renderType), t && t.length > 0 ? (this._getBit(be.DISPLAY) || this._setBitUp(be.DISPLAY), 1 == t.length && t[0] instanceof it || (this._getCacheStyle().cacheForFilters = !0, this._checkCanvasEnable())) : this._cacheStyle.cacheForFilters && (this._cacheStyle.cacheForFilters = !1, this._checkCanvasEnable()), this._getCacheStyle().hasGlowFilter = this._isHaveGlowFilter(), this.repaint())
            }
            _isHaveGlowFilter() {
                var t, e;
                if (this.filters)
                    for (t = 0; t < this.filters.length; t++)
                        if (this.filters[t].type == J.GLOW) return !0;
                for (t = 0, e = this._children.length; t < e; t++)
                    if (this._children[t]._isHaveGlowFilter()) return !0;
                return !1
            }
            localToGlobal(t, e = !1, i = null) {
                !0 === e && (t = new m(t.x, t.y));
                var r = this;
                for (i = i || s.stage; r && !r.destroyed && r != i;) t = r.toParentPoint(t), r = r.parent;
                return t
            }
            globalToLocal(t, e = !1, i = null) {
                e && (t = new m(t.x, t.y));
                var r = this,
                    a = [];
                for (i = i || s.stage; r && !r.destroyed && r != i;) a.push(r), r = r.parent;
                for (var n = a.length - 1; n >= 0;) r = a[n], t = r.fromParentPoint(t), n--;
                return t
            }
            toParentPoint(t) {
                if (!t) return t;
                t.x -= this.pivotX, t.y -= this.pivotY, this.transform && this._transform.transformPoint(t), t.x += this._x, t.y += this._y;
                var e = this._style.scrollRect;
                return e && (t.x -= e.x, t.y -= e.y), t
            }
            fromParentPoint(t) {
                if (!t) return t;
                t.x -= this._x, t.y -= this._y;
                var e = this._style.scrollRect;
                return e && (t.x += e.x, t.y += e.y), this.transform && this._transform.invertTransformPoint(t), t.x += this.pivotX, t.y += this.pivotY, t
            }
            fromStagePoint(t) {
                return t
            }
            on(t, e, i, s = null) {
                return 1 !== this._mouseState && this.isMouseEvent(t) ? (this.mouseEnabled = !0, this._setBit(be.HAS_MOUSE, !0), this._parent && this._onDisplay(), this._createListener(t, e, i, s, !1)) : super.on(t, e, i, s)
            }
            once(t, e, i, s = null) {
                return 1 !== this._mouseState && this.isMouseEvent(t) ? (this.mouseEnabled = !0, this._setBit(be.HAS_MOUSE, !0), this._parent && this._onDisplay(), this._createListener(t, e, i, s, !0)) : super.once(t, e, i, s)
            }
            _onDisplay(t) {
                if (1 !== this._mouseState) {
                    var e = this;
                    for (e = e.parent; e && 1 !== e._mouseState && !e._getBit(be.HAS_MOUSE);) e.mouseEnabled = !0, e._setBit(be.HAS_MOUSE, !0), e = e.parent
                }
            }
            _setParent(t) {
                super._setParent(t), t && this._getBit(be.HAS_MOUSE) && this._onDisplay()
            }
            loadImage(t, e = null) {
                function i() {
                    this.repaint(ve.REPAINT_ALL), e && e.run()
                }
                if (t) {
                    var r = s.Loader.textureMap[P.formatURL(t)];
                    r || (r = new te, r.load(t), s.Loader.cacheTexture(t, r)), this.texture = r, r.getIsReady() ? i.call(this) : r.once(Jt.READY, this, i)
                } else this.texture = null, i.call(this);
                return this
            }
            static fromImage(t) {
                return (new Oe).loadImage(t)
            }
            repaint(t = ve.REPAINT_CACHE) {
                this._repaint & t || (this._repaint |= t, this.parentRepaint(t)), this._cacheStyle && this._cacheStyle.maskParent && this._cacheStyle.maskParent.repaint(t)
            }
            _needRepaint() {
                return this._repaint & ve.REPAINT_CACHE && this._cacheStyle.enableCanvasRender && this._cacheStyle.reCache
            }
            _childChanged(t = null) {
                this._children.length ? this._renderType |= ve.CHILDS : this._renderType &= ~ve.CHILDS, this._setRenderType(this._renderType), t && this._getBit(be.HAS_ZORDER) && s.systemTimer.callLater(this, this.updateZOrder), this.repaint(ve.REPAINT_ALL)
            }
            parentRepaint(t = ve.REPAINT_CACHE) {
                var e = this._parent;
                !e || e._repaint & t || (e._repaint |= t, e.parentRepaint(t))
            }
            get stage() {
                return s.stage
            }
            get hitArea() {
                return this._style.hitArea
            }
            set hitArea(t) {
                this.getStyle().hitArea = t
            }
            _setMask(t) {}
            get mask() {
                return this._cacheStyle.mask
            }
            set mask(t) {
                t && this.mask && this.mask._cacheStyle.maskParent || (this._getCacheStyle().mask = t, this._setMask(t), this._checkCanvasEnable(), t ? t._getCacheStyle().maskParent = this : this.mask && (this.mask._getCacheStyle().maskParent = null), this._renderType |= ve.MASK, this._setRenderType(this._renderType), this.parentRepaint(ve.REPAINT_ALL))
            }
            get mouseEnabled() {
                return this._mouseState > 1
            }
            set mouseEnabled(t) {
                this._mouseState = t ? 2 : 1
            }
            startDrag(t = null, e = !1, i = 0, r = 300, a = null, n = !1, h = .92) {
                this._style.dragging || (this.getStyle().dragging = new s.Dragging), this._style.dragging.start(this, t, e, i, r, a, n, h)
            }
            stopDrag() {
                this._style.dragging && this._style.dragging.stop()
            }
            _setDisplay(t) {
                t || this._cacheStyle && (this._cacheStyle.releaseContext(), this._cacheStyle.releaseFilterCache(), this._cacheStyle.hasGlowFilter && (this._cacheStyle.hasGlowFilter = !1)), super._setDisplay(t)
            }
            hitTestPoint(t, e) {
                var i = this.globalToLocal(m.TEMP.setTo(t, e));
                t = i.x, e = i.y;
                var s = this._style.hitArea ? this._style.hitArea : this._width > 0 && this._height > 0 ? g.TEMP.setTo(0, 0, this._width, this._height) : this.getSelfBounds();
                return s.contains(t, e)
            }
            getMousePoint() {
                return this.globalToLocal(m.TEMP.setTo(s.stage.mouseX, s.stage.mouseY))
            }
            get globalScaleX() {
                for (var t = 1, e = this; e && e !== s.stage;) t *= e.scaleX, e = e.parent;
                return t
            }
            get globalRotation() {
                for (var t = 0, e = this; e && e !== s.stage;) t += e.rotation, e = e.parent;
                return t
            }
            get globalScaleY() {
                for (var t = 1, e = this; e && e !== s.stage;) t *= e.scaleY, e = e.parent;
                return t
            }
            get mouseX() {
                return this.getMousePoint().x
            }
            get mouseY() {
                return this.getMousePoint().y
            }
            get zOrder() {
                return this._zOrder
            }
            set zOrder(t) {
                this._zOrder != t && (this._zOrder = t, this._parent && (t && this._parent._setBit(be.HAS_ZORDER, !0), s.systemTimer.callLater(this._parent, this.updateZOrder)))
            }
            get texture() {
                return this._texture
            }
            _setTexture(t) {}
            set texture(t) {
                "string" == typeof t ? this.loadImage(t) : this._texture != t && (this._texture && this._texture._removeReference(), this._texture = t, t && t._addReference(), this._setTexture(t), this._setWidth(this._texture, this.width), this._setHeight(this._texture, this.height), t ? this._renderType |= ve.TEXTURE : this._renderType &= ~ve.TEXTURE, this._setRenderType(this._renderType), this.repaint())
            }
            get viewport() {
                return this._style.viewport
            }
            set viewport(t) {
                var e;
                "string" == typeof t && (e = t.split(","), e.length > 3 && (t = new g(parseFloat(e[0]), parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]))));
                this.getStyle().viewport = t
            }
            _setRenderType(t) {}
            _setTranformChange() {
                this._tfChanged = !0, this._renderType |= ve.TRANSFORM, this.parentRepaint(ve.REPAINT_CACHE)
            }
            _setBgStyleColor(t, e, i, s, r) {}
            _setBorderStyleColor(t, e, i, s, r, a) {}
            captureMouseEvent(t) {
                s.MouseManager.instance.setCapture(this, t)
            }
            releaseMouseEvent() {
                s.MouseManager.instance.releaseCapture()
            }
            set drawCallOptimize(t) {
                this._setBit(be.DRAWCALL_OPTIMIZE, t)
            }
            get drawCallOptimize() {
                return this._getBit(be.DRAWCALL_OPTIMIZE)
            }
        }
        Pe.regClass("laya.display.Sprite", Oe), Pe.regClass("Laya.Sprite", Oe);
        class Ne extends Be {
            constructor() {
                super(...arguments), this.italic = !1
            }
            reset() {
                return super.reset(), this.italic = !1, this.align = "left", this.wordWrap = !1, this.leading = 0, this.padding = [0, 0, 0, 0], this.bgColor = null, this.borderColor = null, this.asPassword = !1, this.stroke = 0, this.strokeColor = "#000000", this.bold = !1, this.underline = !1, this.underlineColor = null, this.currBitmapFont = null, this
            }
            recover() {
                this !== Ne.EMPTY && r.recover("TextStyle", this.reset())
            }
            static create() {
                return r.getItemByClass("TextStyle", Ne)
            }
            render(t, e, i, s) {
                (this.bgColor || this.borderColor) && e.drawRect(i - this.pivotX, s - this.pivotY, t.width, t.height, this.bgColor, this.borderColor, 1)
            }
        }
        Ne.EMPTY = new Ne;
        class Ue extends Oe {
            constructor() {
                super(), this._textWidth = 0, this._textHeight = 0, this._lines = [], this._lineWidths = [], this._startX = 0, this._startY = 0, this._charSize = {}, this._valign = "top", this._fontSize = Ue.defaultFontSize, this._font = Ue.defaultFont, this._color = "#000000", this._singleCharRender = !1, this.overflow = Ue.VISIBLE, this._style = Ne.EMPTY
            }
            static defaultFontStr() {
                return Ue.defaultFontSize + "px " + Ue.defaultFont
            }
            getStyle() {
                return this._style === Ne.EMPTY && (this._style = Ne.create()), this._style
            }
            _getTextStyle() {
                return this._style === Ne.EMPTY && (this._style = Ne.create()), this._style
            }
            static registerBitmapFont(t, e) {
                Ue._bitmapFonts || (Ue._bitmapFonts = {}), Ue._bitmapFonts[t] = e
            }
            static unregisterBitmapFont(t, e = !0) {
                if (Ue._bitmapFonts && Ue._bitmapFonts[t]) {
                    var i = Ue._bitmapFonts[t];
                    e && i.destroy(), delete Ue._bitmapFonts[t]
                }
            }
            destroy(t = !0) {
                super.destroy(t), this._clipPoint = null, this._lines = null, this._lineWidths = null, this._words && this._words.forEach(function(t) {
                    t.cleanCache()
                }), this._words = null, this._charSize = null
            }
            _getBoundPointsM(t = !1) {
                var e = g.TEMP;
                return e.setTo(0, 0, this.width, this.height), e._getBoundPoints()
            }
            getGraphicBounds(t = !1) {
                var e = g.TEMP;
                return e.setTo(0, 0, this.width, this.height), e
            }
            get width() {
                return this._width ? this._width : this.textWidth + this.padding[1] + this.padding[3]
            }
            set width(t) {
                t != this._width && (super.set_width(t), this.isChanged = !0, this.borderColor && this._setBorderStyleColor(0, 0, this.width, this.height, this.borderColor, 1))
            }
            _getCSSStyle() {
                return this._style
            }
            get height() {
                return this._height ? this._height : this.textHeight
            }
            set height(t) {
                t != this._height && (super.set_height(t), this.isChanged = !0, this.borderColor && this._setBorderStyleColor(0, 0, this.width, this.height, this.borderColor, 1))
            }
            get textWidth() {
                return this._isChanged && s.systemTimer.runCallLater(this, this.typeset), this._textWidth
            }
            get textHeight() {
                return this._isChanged && s.systemTimer.runCallLater(this, this.typeset), this._textHeight
            }
            get text() {
                return this._text || ""
            }
            get_text() {
                return this._text || ""
            }
            set_text(t) {
                this._text !== t && (this.lang(t + ""), this.isChanged = !0, this.event(Jt.CHANGE), this.borderColor && this._setBorderStyleColor(0, 0, this.width, this.height, this.borderColor, 1))
            }
            set text(t) {
                this.set_text(t)
            }
            lang(t, e = null, i = null, s = null, r = null, a = null, n = null, h = null, o = null, l = null, _ = null) {
                if (t = Ue.langPacks && Ue.langPacks[t] ? Ue.langPacks[t] : t, arguments.length < 2) this._text = t;
                else {
                    for (var u = 0, c = arguments.length; u < c; u++) t = t.replace("{" + u + "}", arguments[u + 1]);
                    this._text = t
                }
            }
            get font() {
                return this._font
            }
            set font(t) {
                this._style.currBitmapFont && (this._getTextStyle().currBitmapFont = null, this.scale(1, 1)), Ue._bitmapFonts && Ue._bitmapFonts[t] && (this._getTextStyle().currBitmapFont = Ue._bitmapFonts[t]), this._font = t, this.isChanged = !0
            }
            get fontSize() {
                return this._fontSize
            }
            set fontSize(t) {
                this._fontSize != t && (this._fontSize = t, this.isChanged = !0)
            }
            get bold() {
                return this._style.bold
            }
            set bold(t) {
                this._getTextStyle().bold = t, this.isChanged = !0
            }
            get color() {
                return this._color
            }
            set color(t) {
                this.set_color(t)
            }
            get_color() {
                return this._color
            }
            set_color(t) {
                this._color != t && (this._color = t, !this._isChanged && this._graphics ? this._graphics.replaceTextColor(this.color) : this.isChanged = !0)
            }
            get italic() {
                return this._style.italic
            }
            set italic(t) {
                this._getTextStyle().italic = t, this.isChanged = !0
            }
            get align() {
                return this._style.align
            }
            set align(t) {
                this._getTextStyle().align = t, this.isChanged = !0
            }
            get valign() {
                return this._valign
            }
            set valign(t) {
                this._valign = t, this.isChanged = !0
            }
            get wordWrap() {
                return this._style.wordWrap
            }
            set wordWrap(t) {
                this._getTextStyle().wordWrap = t, this.isChanged = !0
            }
            get leading() {
                return this._style.leading
            }
            set leading(t) {
                this._getTextStyle().leading = t, this.isChanged = !0
            }
            get padding() {
                return this._style.padding
            }
            set padding(t) {
                if ("string" == typeof t) {
                    var e, i, s;
                    for (e = t.split(","), s = e.length; e.length < 4;) e.push(0);
                    for (i = 0; i < s; i++) e[i] = parseFloat(e[i]) || 0;
                    t = e
                }
                this._getTextStyle().padding = t, this.isChanged = !0
            }
            get bgColor() {
                return this._style.bgColor
            }
            set bgColor(t) {
                this.set_bgColor(t)
            }
            set_bgColor(t) {
                this._getTextStyle().bgColor = t, this._renderType |= ve.STYLE, this._setBgStyleColor(0, 0, this.width, this.height, t), this._setRenderType(this._renderType), this.isChanged = !0
            }
            get_bgColor() {
                return this._style.bgColor
            }
            get borderColor() {
                return this._style.borderColor
            }
            set borderColor(t) {
                this._getTextStyle().borderColor = t, this._renderType |= ve.STYLE, this._setBorderStyleColor(0, 0, this.width, this.height, t, 1), this._setRenderType(this._renderType), this.isChanged = !0
            }
            get stroke() {
                return this._style.stroke
            }
            set stroke(t) {
                this._getTextStyle().stroke = t, this.isChanged = !0
            }
            get strokeColor() {
                return this._style.strokeColor
            }
            set strokeColor(t) {
                this._getTextStyle().strokeColor = t, this.isChanged = !0
            }
            set isChanged(t) {
                this._isChanged !== t && (this._isChanged = t, t && s.systemTimer.callLater(this, this.typeset))
            }
            _getContextFont() {
                return (this.italic ? "italic " : "") + (this.bold ? "bold " : "") + this.fontSize + "px " + (s.Browser.onIPhone && Ue.fontFamilyMap[this.font] || this.font)
            }
            _isPassWordMode() {
                var t = this._style,
                    e = t.asPassword;
                return "prompt" in this && this.prompt == this._text && (e = !1), e
            }
            _getPassWordTxt(t) {
                var e, i = t.length;
                e = "";
                for (var s = i; s > 0; s--) e += "●";
                return e
            }
            _renderText() {
                var t = this.padding,
                    e = this._lines.length;
                this.overflow != Ue.VISIBLE && (e = Math.min(e, Math.floor((this.height - t[0] - t[2]) / (this.leading + this._charSize.height)) + 1));
                var i = this.scrollY / (this._charSize.height + this.leading) | 0,
                    r = this.graphics;
                r.clear(!0);
                var a = this._getContextFont();
                s.Browser.context.font = a;
                var n = t[3],
                    h = "left",
                    o = this._lines,
                    l = this.leading + this._charSize.height,
                    _ = this._style.currBitmapFont;
                _ && (l = this.leading + _.getMaxHeight());
                var u = t[0];
                !_ && this._width > 0 && this._textWidth <= this._width && ("right" == this.align ? (h = "right", n = this._width - t[1]) : "center" == this.align && (h = "center", n = .5 * this._width + t[3] - t[1]));
                let c = 1;
                if (_ && _.autoScaleSize && (c = _.fontSize / this.fontSize), this._height > 0) {
                    var d = this._textHeight > this._height ? "top" : this.valign;
                    "middle" === d ? u = .5 * (this._height - e / c * l) + t[0] - t[2] : "bottom" === d && (u = this._height - e / c * l - t[2])
                }
                if (this._clipPoint) {
                    var p, f;
                    if (r.save(), _ && _.autoScaleSize) p = this._width ? this._width - t[3] - t[1] : this._textWidth, f = this._height ? this._height - t[0] - t[2] : this._textHeight, p *= c, f *= c, r.clipRect(t[3], t[0], p, f);
                    else r.clipRect(t[3], t[0], this._width ? this._width - t[3] - t[1] : this._textWidth, this._height ? this._height - t[0] - t[2] : this._textHeight);
                    this.repaint()
                }
                var m = this._style,
                    g = m.asPassword;
                "prompt" in this && this.prompt == this._text && (g = !1);
                for (var T = 0, v = 0, x = Math.min(this._lines.length, e + i) || 1, y = i; y < x; y++) {
                    var E, A = o[y];
                    if (g) {
                        let t = A.length;
                        A = "";
                        for (var C = t; C > 0; C--) A += "●"
                    }
                    if (null == A && (A = ""), T = n - (this._clipPoint ? this._clipPoint.x : 0), v = u + l * y - (this._clipPoint ? this._clipPoint.y : 0), this.underline && this._drawUnderline(h, T, v, y), _) {
                        var R = this.width;
                        _.autoScaleSize && (R = this.width * c, T *= c, v *= c), _._drawText(A, this, T, v, this.align, R)
                    } else this._words || (this._words = []), this._words.length > y - i ? E = this._words[y - i] : (E = new ie, this._words.push(E)), E.setText(A), E.splitRender = this._singleCharRender, m.stroke ? r.fillBorderText(E, T, v, a, this.color, h, m.stroke, m.strokeColor) : r.fillText(E, T, v, a, this.color, h)
                }
                if (_ && _.autoScaleSize) {
                    var b = 1 / c;
                    this.scale(b, b)
                }
                this._clipPoint && r.restore(), this._startX = n, this._startY = u
            }
            _drawUnderline(t, e, i, s) {
                var r = this._lineWidths[s];
                switch (t) {
                    case "center":
                        e -= r / 2;
                        break;
                    case "right":
                        e -= r
                }
                i += this._charSize.height, this._graphics.drawLine(e, i, e + r, i, this.underlineColor || this.color, 1)
            }
            typeset() {
                if (this._isChanged = !1, !this._text) return this._clipPoint = null, this._textWidth = this._textHeight = 0, void this.graphics.clear(!0);
                s.Render.isConchApp ? window.conchTextCanvas.font = this._getContextFont() : s.Browser.context.font = this._getContextFont(), this._lines.length = 0, this._lineWidths.length = 0, this._isPassWordMode() ? this._parseLines(this._getPassWordTxt(this._text)) : this._parseLines(this._text), this._evalTextSize(), this._checkEnabledViewportOrNot() ? this._clipPoint || (this._clipPoint = new m(0, 0)) : this._clipPoint = null, this._renderText()
            }
            _evalTextSize() {
                var t, e;
                t = Math.max.apply(this, this._lineWidths);
                let i = this._style.currBitmapFont;
                if (i) {
                    let t = i.getMaxHeight();
                    i.autoScaleSize && (t = this.fontSize), e = this._lines.length * (t + this.leading) + this.padding[0] + this.padding[2]
                } else e = this._lines.length * (this._charSize.height + this.leading) + this.padding[0] + this.padding[2], this._lines.length && (e -= this.leading);
                t == this._textWidth && e == this._textHeight || (this._textWidth = t, this._textHeight = e)
            }
            _checkEnabledViewportOrNot() {
                return this.overflow == Ue.SCROLL && (this._width > 0 && this._textWidth > this._width || this._height > 0 && this._textHeight > this._height)
            }
            changeText(t) {
                this._text !== t && (this.lang(t + ""), this._graphics && this._graphics.replaceText(this._text) || this.typeset())
            }
            _parseLines(t) {
                var e = this.wordWrap || this.overflow == Ue.HIDDEN;
                if (e) var i = this._getWordWrapWidth();
                var r = this._style.currBitmapFont;
                if (r) this._charSize.width = r.getMaxWidth(), this._charSize.height = r.getMaxHeight();
                else {
                    var a = null;
                    a = s.Render.isConchApp ? window.conchTextCanvas.measureText(Ue._testWord) : s.Browser.context.measureText(Ue._testWord), a || (a = {
                        width: 100
                    }), this._charSize.width = a.width, this._charSize.height = a.height || this.fontSize
                }
                for (var n = t.replace(/\r\n/g, "\n").split("\n"), h = 0, o = n.length; h < o; h++) {
                    var l = n[h];
                    e ? this._parseLine(l, i) : (this._lineWidths.push(this._getTextWidth(l)), this._lines.push(l))
                }
            }
            _parseLine(t, e) {
                var i = this._lines,
                    s = 0,
                    r = 0,
                    a = 0,
                    n = 0;
                if (r = this._getTextWidth(t), r <= e) return i.push(t), void this._lineWidths.push(r);
                r = this._charSize.width, s = Math.floor(e / r), 0 == s && (s = 1), r = this._getTextWidth(t.substring(0, s)), a = r;
                for (var h = s, o = t.length; h < o; h++)
                    if (r = this._getTextWidth(t.charAt(h)), a += r, a > e)
                        if (this.wordWrap) {
                            var l = t.substring(n, h),
                                _ = l.charCodeAt(l.length - 1);
                            if (_ < 19968 || _ > 40869) {
                                var u = /(?:[^\s\!-\/])+$/.exec(l);
                                u && u.index >= .8 * l.length && (h = u.index + n, 0 == u.index ? h += l.length : l = t.substring(n, h))
                            }
                            if (i.push(l), this._lineWidths.push(a - r), n = h, !(h + s < o)) {
                                i.push(t.substring(n, o)), this._lineWidths.push(this._getTextWidth(i[i.length - 1])), n = -1;
                                break
                            }
                            h += s, r = this._getTextWidth(t.substring(n, h)), a = r, h--
                        } else if (this.overflow == Ue.HIDDEN) return i.push(t.substring(0, h)), void this._lineWidths.push(this._getTextWidth(i[i.length - 1]));
                this.wordWrap && -1 != n && (i.push(t.substring(n, o)), this._lineWidths.push(this._getTextWidth(i[i.length - 1])))
            }
            _getTextWidth(t) {
                var e = this._style.currBitmapFont;
                if (e) {
                    let i = e.getTextWidth(t);
                    return e.autoScaleSize && (i *= this.fontSize / e.fontSize), i
                }
                if (s.Render.isConchApp) return window.conchTextCanvas.measureText(t).width; {
                    let e = s.Browser.context.measureText(t) || {
                        width: 100
                    };
                    return e.width
                }
            }
            _getWordWrapWidth() {
                var t, e = this.padding,
                    i = this._style.currBitmapFont;
                return t = (i && i.autoScaleSize, this._width), t <= 0 && (t = this.wordWrap ? 100 : s.Browser.width), t <= 0 && (t = 100), t - e[3] - e[1]
            }
            getCharPoint(t, e = null) {
                this._isChanged && s.systemTimer.runCallLater(this, this.typeset);
                for (var i = 0, r = this._lines, a = 0, n = 0, h = r.length; n < h; n++) {
                    if (i += r[n].length, t < i) {
                        var o = n;
                        break
                    }
                    a = i
                }
                var l = (this.italic ? "italic " : "") + (this.bold ? "bold " : "") + this.fontSize + "px " + this.font;
                s.Browser.context.font = l;
                var _ = this._getTextWidth(this._text.substring(a, t)),
                    u = e || new m;
                return u.setTo(this._startX + _ - (this._clipPoint ? this._clipPoint.x : 0), this._startY + o * (this._charSize.height + this.leading) - (this._clipPoint ? this._clipPoint.y : 0))
            }
            set scrollX(t) {
                if (!(this.overflow != Ue.SCROLL || this.textWidth < this._width) && this._clipPoint) {
                    t = t < this.padding[3] ? this.padding[3] : t;
                    var e = this._textWidth - this._width;
                    t = t > e ? e : t, this._clipPoint.x = t, this._renderText()
                }
            }
            get scrollX() {
                return this._clipPoint ? this._clipPoint.x : 0
            }
            set scrollY(t) {
                if (!(this.overflow != Ue.SCROLL || this.textHeight < this._height) && this._clipPoint) {
                    t = t < this.padding[0] ? this.padding[0] : t;
                    var e = this._textHeight - this._height;
                    t = t > e ? e : t, this._clipPoint.y = t, this._renderText()
                }
            }
            get scrollY() {
                return this._clipPoint ? this._clipPoint.y : 0
            }
            get maxScrollX() {
                return this.textWidth < this._width ? 0 : this._textWidth - this._width
            }
            get maxScrollY() {
                return this.textHeight < this._height ? 0 : this._textHeight - this._height
            }
            get lines() {
                return this._isChanged && this.typeset(), this._lines
            }
            get underlineColor() {
                return this._style.underlineColor
            }
            set underlineColor(t) {
                this._getTextStyle().underlineColor = t, this._isChanged || this._renderText()
            }
            get underline() {
                return this._style.underline
            }
            set underline(t) {
                this._getTextStyle().underline = t
            }
            set singleCharRender(t) {
                this._singleCharRender = t
            }
            get singleCharRender() {
                return this._singleCharRender
            }
        }
        Ue.VISIBLE = "visible", Ue.SCROLL = "scroll", Ue.HIDDEN = "hidden", Ue.defaultFontSize = 12, Ue.defaultFont = "Arial", Ue.isComplexText = !1, Ue.fontFamilyMap = {
            "报隶": "报隶-简",
            "黑体": "黑体-简",
            "楷体": "楷体-简",
            "兰亭黑": "兰亭黑-简",
            "隶变": "隶变-简",
            "凌慧体": "凌慧体-简",
            "翩翩体": "翩翩体-简",
            "苹方": "苹方-简",
            "手札体": "手札体-简",
            "宋体": "宋体-简",
            "娃娃体": "娃娃体-简",
            "魏碑": "魏碑-简",
            "行楷": "行楷-简",
            "雅痞": "雅痞-简",
            "圆体": "圆体-简"
        }, Ue._testWord = "游", Ue.CharacterCache = !0, Ue.RightToLeft = !1, s.regClass(Ue), Pe.regClass("laya.display.Text", Ue), Pe.regClass("Laya.Text", Ue);
        class Ge extends Ue {
            constructor() {
                super(), this._multiline = !1, this._editable = !0, this._maxChars = 1e5, this._type = "text", this._prompt = "", this._promptColor = "#A9A9A9", this._originColor = "#000000", this._content = "", Ge.IOS_IFRAME = s.Browser.onIOS && s.Browser.window.top != s.Browser.window.self, this._width = 100, this._height = 20, this.multiline = !1, this.overflow = Ue.SCROLL, this.on(Jt.MOUSE_DOWN, this, this._onMouseDown), this.on(Jt.UNDISPLAY, this, this._onUnDisplay)
            }
            static __init__() {
                if (Ge._createInputElement(), s.Browser.onMobile) {
                    var t = !1;
                    (s.Browser.onMiniGame || s.Browser.onBDMiniGame || s.Browser.onQGMiniGame || s.Browser.onKGMiniGame || s.Browser.onVVMiniGame || s.Browser.onAlipayMiniGame || s.Browser.onQQMiniGame || s.Browser.onBLMiniGame || s.Browser.onTTMiniGame || s.Browser.onHWMiniGame || s.Browser.onTBMiniGame) && (t = !0), s.Render.canvas.addEventListener(Ge.IOS_IFRAME ? t ? "touchend" : "click" : "touchend", Ge._popupInputMethod)
                }
            }
            static _popupInputMethod(t) {
                if (Ge.isInputting) {
                    var e = Ge.inputElement;
                    e.focus()
                }
            }
            static _createInputElement() {
                Ge._initInput(Ge.area = s.Browser.createElement("textarea")), Ge._initInput(Ge.input = s.Browser.createElement("input")), Ge.inputContainer = s.Browser.createElement("div"), Ge.inputContainer.style.position = "absolute", Ge.inputContainer.style.zIndex = "1E5", s.Browser.container.appendChild(Ge.inputContainer), Ge.inputContainer.setPos = function(t, e) {
                    Ge.inputContainer.style.left = t + "px", Ge.inputContainer.style.top = e + "px"
                }
            }
            static _initInput(t) {
                var e = t.style;
                e.cssText = "position:absolute;overflow:hidden;resize:none;transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-o-transform-origin:0 0;", e.resize = "none", e.backgroundColor = "transparent", e.border = "none", e.outline = "none", e.zIndex = "1", t.addEventListener("input", Ge._processInputting), t.addEventListener("mousemove", Ge._stopEvent), t.addEventListener("mousedown", Ge._stopEvent), t.addEventListener("touchmove", Ge._stopEvent), t.setFontFace = function(e) {
                    t.style.fontFamily = e
                }, s.Render.isConchApp || (t.setColor = function(e) {
                    t.style.color = e
                }, t.setFontSize = function(e) {
                    t.style.fontSize = e + "px"
                })
            }
            static _processInputting(t) {
                var e = Ge.inputElement.target;
                if (e) {
                    var i = Ge.inputElement.value;
                    e._restrictPattern && (i = i.replace(/\u2006|\x27/g, ""), e._restrictPattern.test(i) && (i = i.replace(e._restrictPattern, ""), Ge.inputElement.value = i)), e._text = i, e.event(Jt.INPUT)
                }
            }
            static _stopEvent(t) {
                "touchmove" == t.type && t.preventDefault(), t.stopPropagation && t.stopPropagation()
            }
            setSelection(t, e) {
                this.focus = !0, Ge.inputElement.selectionStart = t, Ge.inputElement.selectionEnd = e
            }
            get multiline() {
                return this._multiline
            }
            set multiline(t) {
                this._multiline = t, this.valign = t ? "top" : "middle"
            }
            get nativeInput() {
                return this._multiline ? Ge.area : Ge.input
            }
            _onUnDisplay(t = null) {
                this.focus = !1
            }
            _onMouseDown(t) {
                this.focus = !0
            }
            _syncInputTransform() {
                var t = this.nativeInput,
                    e = tt.getTransformRelativeToWindow(this, this.padding[3], this.padding[0]),
                    i = this._width - this.padding[1] - this.padding[3],
                    r = this._height - this.padding[0] - this.padding[2];
                s.Render.isConchApp ? (t.setScale(e.scaleX, e.scaleY), t.setSize(i, r), t.setPos(e.x, e.y)) : (Ge.inputContainer.style.transform = Ge.inputContainer.style.webkitTransform = "scale(" + e.scaleX + "," + e.scaleY + ") rotate(" + s.stage.canvasDegree + "deg)", t.style.width = i + "px", t.style.height = r + "px", Ge.inputContainer.style.left = e.x + "px", Ge.inputContainer.style.top = e.y + "px")
            }
            select() {
                this.nativeInput.select()
            }
            get focus() {
                return this._focus
            }
            set focus(t) {
                var e = this.nativeInput;
                this._focus !== t && (t ? (e.target ? e.target._focusOut() : this._setInputMethod(), e = this.nativeInput, e.target = this, this._focusIn()) : (e.target = null, this._focusOut(), s.Browser.document.body.scrollTop = 0, e.blur(), s.Render.isConchApp ? e.setPos(-1e4, -1e4) : Ge.inputContainer.contains(e) && Ge.inputContainer.removeChild(e)))
            }
            _setInputMethod() {
                Ge.input.parentElement && Ge.inputContainer.removeChild(Ge.input), Ge.area.parentElement && Ge.inputContainer.removeChild(Ge.area), s.Browser.onAndroid && (Ge.input = Ge.inputElement = s.Browser.createElement("input"), Ge._initInput(Ge.input)), Ge.inputElement = this._multiline ? Ge.area : Ge.input, Ge.inputContainer.appendChild(Ge.inputElement), Ue.RightToLeft && (Ge.inputElement.style.direction = "rtl")
            }
            _focusIn() {
                Ge.isInputting = !0;
                var t = this.nativeInput;
                Ge.input && (Ge.input.type = this._type), this._focus = !0;
                var e = t.style;
                e.whiteSpace = this.wordWrap ? "pre-wrap" : "nowrap", this._setPromptColor(), t.readOnly = !this._editable, s.Render.isConchApp && (t.setType(this._type), t.setForbidEdit(!this._editable)), t.maxLength = this._maxChars, t.value = this._content, t.placeholder = this._prompt, s.stage.off(Jt.KEY_DOWN, this, this._onKeyDown), s.stage.on(Jt.KEY_DOWN, this, this._onKeyDown), s.stage.focus = this, this.event(Jt.FOCUS), s.Browser.onPC && t.focus(), s.Browser.onMiniGame || s.Browser.onBDMiniGame || s.Browser.onQGMiniGame || s.Browser.onKGMiniGame || s.Browser.onVVMiniGame || s.Browser.onAlipayMiniGame || s.Browser.onQQMiniGame || s.Browser.onBLMiniGame || s.Browser.onTTMiniGame || s.Browser.onHWMiniGame || s.Browser.onTBMiniGame || (this._text = null), this.typeset(), t.setColor(this._originColor), t.setFontSize(this.fontSize), t.setFontFace(s.Browser.onIPhone && Ue.fontFamilyMap[this.font] || this.font), s.Render.isConchApp && t.setMultiAble && t.setMultiAble(this._multiline), e.lineHeight = this.leading + this.fontSize + "px", e.fontStyle = this.italic ? "italic" : "normal", e.fontWeight = this.bold ? "bold" : "normal", e.textAlign = this.align, e.padding = "0 0", this._syncInputTransform(), !s.Render.isConchApp && s.Browser.onPC && s.systemTimer.frameLoop(1, this, this._syncInputTransform)
            }
            _setPromptColor() {
                Ge.promptStyleDOM = s.Browser.getElementById("promptStyle"), Ge.promptStyleDOM || (Ge.promptStyleDOM = s.Browser.createElement("style"), Ge.promptStyleDOM.setAttribute("id", "promptStyle"), s.Browser.document.head.appendChild(Ge.promptStyleDOM)), Ge.promptStyleDOM.innerText = "input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {color:" + this._promptColor + "}input:-moz-placeholder, textarea:-moz-placeholder {color:" + this._promptColor + "}input::-moz-placeholder, textarea::-moz-placeholder {color:" + this._promptColor + "}input:-ms-input-placeholder, textarea:-ms-input-placeholder {color:" + this._promptColor + "}"
            }
            _focusOut() {
                Ge.isInputting && (Ge.isInputting = !1, this._focus = !1, this._text = null, this._content = this.nativeInput.value, this.destroyed || (this._content ? (super.set_text(this._content), super.set_color(this._originColor)) : (super.set_text(this._prompt), super.set_color(this._promptColor))), s.stage.off(Jt.KEY_DOWN, this, this._onKeyDown), s.stage.focus = null, this.destroyed || (this.event(Jt.BLUR), this.event(Jt.CHANGE)), s.Render.isConchApp && this.nativeInput.blur(), s.Browser.onPC && s.systemTimer.clear(this, this._syncInputTransform))
            }
            _onKeyDown(t) {
                13 === t.keyCode && (s.Browser.onMobile && !this._multiline && (this.focus = !1), this.event(Jt.ENTER))
            }
            miniGameTxt(t) {
                this.destroyed || (super.set_color(this._originColor), t += "", this._multiline || (t = t.replace(/\r?\n/g, "")), this._content = t, t ? super.set_text(t) : (super.set_text(this._prompt), super.set_color(this.promptColor)))
            }
            set text(t) {
                super.set_color(this._originColor), t += "", this._focus ? (this.nativeInput.value = t || "", this.event(Jt.CHANGE)) : (this._multiline || (t = t.replace(/\r?\n/g, "")), this._content = t, t ? super.set_text(t) : (super.set_text(this._prompt), super.set_color(this.promptColor)))
            }
            get text() {
                return this._focus ? this.nativeInput.value : this._content || ""
            }
            changeText(t) {
                this._content = t, this._focus ? (this.nativeInput.value = t || "", this.event(Jt.CHANGE)) : super.changeText(t)
            }
            set color(t) {
                this._focus && this.nativeInput.setColor(t), super.set_color(this._content ? t : this._promptColor), this._originColor = t
            }
            get color() {
                return super.color
            }
            set bgColor(t) {
                super.set_bgColor(t), s.Render.isConchApp && this.nativeInput.setBgColor(t)
            }
            get bgColor() {
                return super.bgColor
            }
            get restrict() {
                return this._restrictPattern ? this._restrictPattern.source : ""
            }
            set restrict(t) {
                t ? (t = "[^" + t + "]", t.indexOf("^^") > -1 && (t = t.replace("^^", "")), this._restrictPattern = new RegExp(t, "g")) : this._restrictPattern = null
            }
            set editable(t) {
                this._editable = t, s.Render.isConchApp && Ge.input.setForbidEdit(!t)
            }
            get editable() {
                return this._editable
            }
            get maxChars() {
                return this._maxChars
            }
            set maxChars(t) {
                t <= 0 && (t = 1e5), this._maxChars = t
            }
            get prompt() {
                return this._prompt
            }
            set prompt(t) {
                !this._text && t && super.set_color(this._promptColor), this.promptColor = this._promptColor, this._text ? super.set_text(this._text == this._prompt ? t : this._text) : super.set_text(t), this._prompt = Ue.langPacks && Ue.langPacks[t] ? Ue.langPacks[t] : t
            }
            get promptColor() {
                return this._promptColor
            }
            set promptColor(t) {
                this._promptColor = t, this._content || super.set_color(t)
            }
            get type() {
                return this._type
            }
            set type(t) {
                this._getTextStyle().asPassword = "password" === t, this._type = t
            }
        }
        Ge.TYPE_TEXT = "text", Ge.TYPE_PASSWORD = "password", Ge.TYPE_EMAIL = "email", Ge.TYPE_URL = "url", Ge.TYPE_NUMBER = "number", Ge.TYPE_RANGE = "range", Ge.TYPE_DATE = "date", Ge.TYPE_MONTH = "month", Ge.TYPE_WEEK = "week", Ge.TYPE_TIME = "time", Ge.TYPE_DATE_TIME = "datetime", Ge.TYPE_DATE_TIME_LOCAL = "datetime-local", Ge.TYPE_SEARCH = "search", Ge.IOS_IFRAME = !1, Ge.inputHeight = 45, Ge.isInputting = !1, Pe.regClass("laya.display.Input", Ge), Pe.regClass("Laya.Input", Ge);
        class ke {
            constructor() {
                this.preOvers = [], this.preDowns = [], this.preRightDowns = [], this.enable = !0, this._event = new Jt, this._lastClickTime = 0
            }
            _clearTempArrs() {
                ke._oldArr.length = 0, ke._newArr.length = 0, ke._tEleArr.length = 0
            }
            getTouchFromArr(t, e) {
                var i, s, r;
                for (s = e.length, i = 0; i < s; i++)
                    if (r = e[i], r.id == t) return r;
                return null
            }
            removeTouchFromArr(t, e) {
                var i;
                for (i = e.length - 1; i >= 0; i--) e[i].id == t && e.splice(i, 1)
            }
            createTouchO(t, e) {
                var i;
                return i = r.getItem("TouchData") || {}, i.id = e, i.tar = t, i
            }
            onMouseDown(t, e, i = !1) {
                var s, r, a, n;
                this.enable && (s = this.getTouchFromArr(e, this.preOvers), a = this.getEles(t, null, ke._tEleArr), s ? s.tar = t : (r = this.createTouchO(t, e), this.preOvers.push(r)), ae.onMobile && this.sendEvents(a, Jt.MOUSE_OVER), n = i ? this.preDowns : this.preRightDowns, s = this.getTouchFromArr(e, n), s ? s.tar = t : (r = this.createTouchO(t, e), n.push(r)), Fi.stage.event(Fi.Event.STAGE_MOUSEDOWN, this._event), this.sendEvents(a, i ? Jt.MOUSE_DOWN : Jt.RIGHT_MOUSE_DOWN), this._clearTempArrs())
            }
            sendEvents(t, e) {
                var i, s, r;
                for (s = t.length, this._event._stoped = !1, r = t[0], i = 0; i < s; i++) {
                    var a = t[i];
                    if (a.destroyed) return;
                    if (a.event(e, this._event.setTo(e, a, r)), this._event._stoped) break
                }
            }
            getEles(t, e = null, i = null) {
                for (i ? i.length = 0 : i = []; t && t != e;) i.push(t), t = t.parent;
                return i
            }
            checkMouseOutAndOverOfMove(t, e, i = 0) {
                var s, r, a, n;
                if (e != t)
                    if (e.contains(t)) r = this.getEles(t, e, ke._tEleArr), this.sendEvents(r, Jt.MOUSE_OVER);
                    else if (t.contains(e)) r = this.getEles(e, t, ke._tEleArr), this.sendEvents(r, Jt.MOUSE_OUT);
                else {
                    var h, o, l;
                    for (r = ke._tEleArr, r.length = 0, h = this.getEles(e, null, ke._oldArr), o = this.getEles(t, null, ke._newArr), n = h.length, a = 0; a < n; a++) {
                        if (s = h[a], l = o.indexOf(s), l >= 0) {
                            o.splice(l, o.length - l);
                            break
                        }
                        r.push(s)
                    }
                    r.length > 0 && this.sendEvents(r, Jt.MOUSE_OUT), o.length > 0 && this.sendEvents(o, Jt.MOUSE_OVER)
                }
            }
            onMouseMove(t, e) {
                var i, s;
                this.enable && (i = this.getTouchFromArr(e, this.preOvers), i ? (this.checkMouseOutAndOverOfMove(t, i.tar), i.tar = t, s = this.getEles(t, null, ke._tEleArr)) : (s = this.getEles(t, null, ke._tEleArr), this.sendEvents(s, Jt.MOUSE_OVER), this.preOvers.push(this.createTouchO(t, e))), this.sendEvents(s, Jt.MOUSE_MOVE), this._clearTempArrs())
            }
            getLastOvers() {
                return ke._tEleArr.length = 0, this.preOvers.length > 0 && this.preOvers[0].tar ? this.getEles(this.preOvers[0].tar, null, ke._tEleArr) : (ke._tEleArr.push(s.stage), ke._tEleArr)
            }
            stageMouseOut() {
                var t;
                t = this.getLastOvers(), this.preOvers.length = 0, this.sendEvents(t, Jt.MOUSE_OUT)
            }
            onMouseUp(t, e, i = !1) {
                if (this.enable) {
                    var s, a, n, h, o, l, _, u, c = ae.onMobile;
                    if (a = this.getEles(t, null, ke._tEleArr), this.sendEvents(a, i ? Jt.MOUSE_UP : Jt.RIGHT_MOUSE_UP), u = i ? this.preDowns : this.preRightDowns, s = this.getTouchFromArr(e, u), s) {
                        var d, p = ae.now();
                        if (d = p - this._lastClickTime < 300, this._lastClickTime = p, t == s.tar) _ = a;
                        else
                            for (n = this.getEles(s.tar, null, ke._oldArr), _ = ke._newArr, _.length = 0, o = n.length, h = 0; h < o; h++) l = n[h], a.indexOf(l) >= 0 && _.push(l);
                        _.length > 0 && this.sendEvents(_, i ? Jt.CLICK : Jt.RIGHT_CLICK), i && d && this.sendEvents(_, Jt.DOUBLE_CLICK), this.removeTouchFromArr(e, u), s.tar = null, r.recover("TouchData", s)
                    } else;
                    s = this.getTouchFromArr(e, this.preOvers), s && c && (_ = this.getEles(s.tar, null, _), _ && _.length > 0 && this.sendEvents(_, Jt.MOUSE_OUT), this.removeTouchFromArr(e, this.preOvers), s.tar = null, r.recover("TouchData", s)), this._clearTempArrs()
                }
            }
        }
        ke.I = new ke, ke._oldArr = [], ke._newArr = [], ke._tEleArr = [];
        class We {
            constructor() {
                this.mouseX = 0, this.mouseY = 0, this.disableMouseEvent = !1, this.mouseDownTime = 0, this.mouseMoveAccuracy = 2, this._event = new Jt, this._captureSp = null, this._captureChain = [], this._captureExlusiveMode = !1, this._hitCaputreSp = !1, this._point = new m, this._rect = new g, this._lastMoveTimer = 0, this._prePoint = new m, this._touchIDs = {}, this._curTouchID = NaN, this._id = 1
            }
            __init__(t, e) {
                this._stage = t;
                var i = this;
                e.oncontextmenu = function(t) {
                    if (We.enabled) return !1
                }, e.addEventListener("mousedown", function(t) {
                    We.enabled && (ae.onIE || t.cancelable && t.preventDefault(), i.mouseDownTime = ae.now(), i.runEvent(t))
                }), e.addEventListener("mouseup", function(t) {
                    We.enabled && (t.cancelable && t.preventDefault(), i.mouseDownTime = -ae.now(), i.runEvent(t))
                }, !0), e.addEventListener("mousemove", function(t) {
                    if (We.enabled) {
                        t.cancelable && t.preventDefault();
                        var e = ae.now();
                        if (e - i._lastMoveTimer < 10) return;
                        i._lastMoveTimer = e, i.runEvent(t)
                    }
                }, !0), e.addEventListener("mouseout", function(t) {
                    We.enabled && i.runEvent(t)
                }), e.addEventListener("mouseover", function(t) {
                    We.enabled && i.runEvent(t)
                }), e.addEventListener("touchstart", function(t) {
                    We.enabled && (We._isFirstTouch || Ge.isInputting || t.cancelable && t.preventDefault(), i.mouseDownTime = ae.now(), i.runEvent(t))
                }), e.addEventListener("touchend", function(t) {
                    We.enabled ? (We._isFirstTouch || Ge.isInputting || t.cancelable && t.preventDefault(), We._isFirstTouch = !1, i.mouseDownTime = -ae.now(), i.runEvent(t)) : i._curTouchID = NaN
                }, !0), e.addEventListener("touchmove", function(t) {
                    We.enabled && (t.cancelable && t.preventDefault(), i.runEvent(t))
                }, !0), e.addEventListener("touchcancel", function(t) {
                    We.enabled ? (t.cancelable && t.preventDefault(), i.runEvent(t)) : i._curTouchID = NaN
                }, !0), e.addEventListener("mousewheel", function(t) {
                    We.enabled && i.runEvent(t)
                }), e.addEventListener("DOMMouseScroll", function(t) {
                    We.enabled && i.runEvent(t)
                })
            }
            initEvent(t, e = null) {
                var i, s = this;
                s._event._stoped = !1, s._event.nativeEvent = e || t, s._target = null, this._point.setTo(t.pageX || t.clientX, t.pageY || t.clientY), this._stage._canvasTransform && (this._stage._canvasTransform.invertTransformPoint(this._point), s.mouseX = this._point.x, s.mouseY = this._point.y), s._event.touchId = t.identifier || 0, this._tTouchID = s._event.touchId, i = ke.I._event, i._stoped = !1, i.nativeEvent = s._event.nativeEvent, i.touchId = s._event.touchId
            }
            checkMouseWheel(t) {
                this._event.delta = t.wheelDelta ? .025 * t.wheelDelta : -t.detail;
                for (var e = ke.I.getLastOvers(), i = 0, s = e.length; i < s; i++) {
                    var r = e[i];
                    r.event(Jt.MOUSE_WHEEL, this._event.setTo(Jt.MOUSE_WHEEL, r, this._target))
                }
            }
            onMouseMove(t) {
                ke.I.onMouseMove(t, this._tTouchID)
            }
            onMouseDown(t) {
                if (Ge.isInputting && s.stage.focus && s.stage.focus.focus && !s.stage.focus.contains(this._target)) {
                    var e = s.stage.focus._tf || s.stage.focus,
                        i = t._tf || t;
                    i instanceof Ge && i.multiline == e.multiline ? e._focusOut() : e.focus = !1
                }
                ke.I.onMouseDown(t, this._tTouchID, this._isLeftMouse)
            }
            onMouseUp(t) {
                ke.I.onMouseUp(t, this._tTouchID, this._isLeftMouse)
            }
            check(t, e, i, s) {
                this._point.setTo(e, i), t.fromParentPoint(this._point), e = this._point.x, i = this._point.y;
                var r = t._style.scrollRect;
                if (r && (this._rect.setTo(r.x, r.y, r.width, r.height), !this._rect.contains(e, i))) return !1;
                if (!this.disableMouseEvent) {
                    if (t.hitTestPrior && !t.mouseThrough && !this.hitTest(t, e, i)) return !1;
                    for (var a = t._children.length - 1; a > -1; a--) {
                        var n = t._children[a];
                        if (!n.destroyed && n._mouseState > 1 && n._visible && this.check(n, e, i, s)) return !0
                    }
                    for (a = t._extUIChild.length - 1; a >= 0; a--) {
                        var h = t._extUIChild[a];
                        if (!h.destroyed && h._mouseState > 1 && h._visible && this.check(h, e, i, s)) return !0
                    }
                }
                var o = !(!t.hitTestPrior || t.mouseThrough || this.disableMouseEvent) || this.hitTest(t, e, i);
                return o ? (this._target = t, s.call(this, t), this._target == this._hitCaputreSp && (this._hitCaputreSp = !0)) : s === this.onMouseUp && t === this._stage && (this._target = this._stage, s.call(this, this._target)), o
            }
            hitTest(t, e, i) {
                if (t.hitTest) return t.hitTest(e, i);
                var s = !1;
                t.scrollRect && (e -= t._style.scrollRect.x, i -= t._style.scrollRect.y);
                var r = t._style.hitArea;
                return r && r._hit ? r.contains(e, i) : ((t.width > 0 && t.height > 0 || t.mouseThrough || r) && (s = t.mouseThrough ? t.getGraphicBounds().contains(e, i) : (r || this._rect.setTo(0, 0, t.width, t.height)).contains(e, i)), s)
            }
            _checkAllBaseUI(t, e, i) {
                var s = this.handleExclusiveCapture(this.mouseX, this.mouseY, i);
                return !!s || (s = this.check(this._stage, this.mouseX, this.mouseY, i), this.handleCapture(this.mouseX, this.mouseY, i) || s)
            }
            check3DUI(t, e, i) {
                for (var s = this._stage._3dUI, r = 0, a = !1; r < s.length; r++) {
                    var n = s[r];
                    this._stage._curUIBase = n, !n.destroyed && n._mouseState > 1 && n._visible && (a = a || this.check(n, this.mouseX, this.mouseY, i))
                }
                return this._stage._curUIBase = this._stage, a
            }
            handleExclusiveCapture(t, e, i) {
                if (this._captureExlusiveMode && this._captureSp && this._captureChain.length > 0) {
                    var s;
                    this._point.setTo(t, e);
                    for (var r = 0; r < this._captureChain.length; r++) s = this._captureChain[r], s.fromParentPoint(this._point);
                    return this._target = s, i.call(this, s), !0
                }
                return !1
            }
            handleCapture(t, e, i) {
                if (!this._hitCaputreSp && this._captureSp && this._captureChain.length > 0) {
                    var s;
                    this._point.setTo(t, e);
                    for (var r = 0; r < this._captureChain.length; r++) s = this._captureChain[r], s.fromParentPoint(this._point);
                    return this._target = s, i.call(this, s), !0
                }
                return !1
            }
            runEvent(t) {
                var e, i, s;
                switch ("mousemove" !== t.type && (this._prePoint.x = this._prePoint.y = -1e6), t.type) {
                    case "mousedown":
                        this._touchIDs[0] = this._id++, We._isTouchRespond ? We._isTouchRespond = !1 : (this._isLeftMouse = 0 === t.button, this.initEvent(t), this._checkAllBaseUI(this.mouseX, this.mouseY, this.onMouseDown));
                        break;
                    case "mouseup":
                        this._isLeftMouse = 0 === t.button, this.initEvent(t), this._checkAllBaseUI(this.mouseX, this.mouseY, this.onMouseUp);
                        break;
                    case "mousemove":
                        Math.abs(this._prePoint.x - t.clientX) + Math.abs(this._prePoint.y - t.clientY) >= this.mouseMoveAccuracy && (this._prePoint.x = t.clientX, this._prePoint.y = t.clientY, this.initEvent(t), this._checkAllBaseUI(this.mouseX, this.mouseY, this.onMouseMove));
                        break;
                    case "touchstart":
                        We._isTouchRespond = !0, this._isLeftMouse = !0;
                        var r = t.changedTouches;
                        for (e = 0, i = r.length; e < i; e++) s = r[e], (We.multiTouchEnabled || isNaN(this._curTouchID)) && (this._curTouchID = s.identifier, this._id % 200 == 0 && (this._touchIDs = {}), this._touchIDs[s.identifier] = this._id++, this.initEvent(s, t), this._checkAllBaseUI(this.mouseX, this.mouseY, this.onMouseDown));
                        break;
                    case "touchend":
                    case "touchcancel":
                        We._isTouchRespond = !0, this._isLeftMouse = !0;
                        var a = t.changedTouches;
                        for (e = 0, i = a.length; e < i; e++) {
                            var n;
                            if (s = a[e], We.multiTouchEnabled || s.identifier == this._curTouchID) this._curTouchID = NaN, this.initEvent(s, t), n = this._checkAllBaseUI(this.mouseX, this.mouseY, this.onMouseUp), n || this.onMouseUp(null)
                        }
                        break;
                    case "touchmove":
                        var h = t.changedTouches;
                        for (e = 0, i = h.length; e < i; e++) s = h[e], (We.multiTouchEnabled || s.identifier == this._curTouchID) && (this.initEvent(s, t), this._checkAllBaseUI(this.mouseX, this.mouseY, this.onMouseMove));
                        break;
                    case "wheel":
                    case "mousewheel":
                    case "DOMMouseScroll":
                        this.checkMouseWheel(t);
                        break;
                    case "mouseout":
                        ke.I.stageMouseOut();
                        break;
                    case "mouseover":
                        this._stage.event(Jt.MOUSE_OVER, this._event.setTo(Jt.MOUSE_OVER, this._stage, this._stage))
                }
            }
            setCapture(t, e = !1) {
                this._captureSp = t, this._captureExlusiveMode = e, this._captureChain.length = 0, this._captureChain.push(t);
                for (var i = t; i != s.stage && i != s.stage._curUIBase && (i = i.parent, i);) this._captureChain.splice(0, 0, i)
            }
            releaseCapture() {
                console.log("release capture"), this._captureSp = null
            }
        }
        We.instance = new We, We.enabled = !0, We.multiTouchEnabled = !0, We._isFirstTouch = !0;
        class Ye {
            constructor() {
                this._pool = [], this._map = {}, this._laters = []
            }
            _update() {
                let t = this._laters,
                    e = t.length;
                if (e > 0) {
                    for (let i = 0, s = e - 1; i <= s; i++) {
                        let e = t[i];
                        this._map[e.key] = null, null !== e.method && (e.run(), e.clear()), this._pool.push(e), i === s && (s = t.length - 1)
                    }
                    t.length = 0
                }
            }
            _getHandler(t, e) {
                var i = t ? t.$_GID || (t.$_GID = s.Utils.getGID()) : 0,
                    r = e.$_TID || (e.$_TID = s.Timer._mid++);
                return this._map[i + "." + r]
            }
            callLater(t, e, i = null) {
                if (null == this._getHandler(t, e)) {
                    let a;
                    a = this._pool.length ? this._pool.pop() : new Ve, a.caller = t, a.method = e, a.args = i;
                    var s = t ? t.$_GID : 0,
                        r = e.$_TID;
                    a.key = s + "." + r, this._map[a.key] = a, this._laters.push(a)
                }
            }
            runCallLater(t, e) {
                var i = this._getHandler(t, e);
                i && null != i.method && (this._map[i.key] = null, i.run(), i.clear())
            }
        }
        Ye.I = new Ye;
        class Ve {
            clear() {
                this.caller = null, this.method = null, this.args = null
            }
            run() {
                var t = this.caller;
                if (t && t.destroyed) return this.clear();
                var e = this.method,
                    i = this.args;
                null != e && (i ? e.apply(t, i) : e.call(t))
            }
        }
        class Xe {}
        Xe.createShaderCondition = function(t) {
            var e = "(function() {return " + t + ";})";
            return window.Laya._runScript(e)
        }, Xe.changeWebGLSize = function(t, e) {
            ue.onStageResize(t, e)
        };
        class He {
            static setPerformanceDataTool(t) {
                this.performanceTool = t
            }
            static begainSample(t) {
                this.performanceTool && this.performanceTool.enable && this.performanceTool.BegainSample(t)
            }
            static endSample(t) {
                return this.performanceTool && this.performanceTool.enable ? this.performanceTool.EndSample(t) : 0
            }
            static expoertFile(t) {
                if (this.performanceTool) return this.performanceTool.enable ? this.performanceTool.exportPerformanceFile() : null
            }
            static showFunSampleFun(t) {
                this.performanceTool.showFunSampleFun(t)
            }
            static set enable(t) {
                this.performanceTool && (this.performanceTool.enable = t)
            }
            static get enable() {
                return !!this.performanceTool && this._enable
            }
            static set enableDataExport(t) {
                this.performanceTool && (this.performanceTool.enableDataExport = t)
            }
            static get enableDataExport() {
                return !!this.performanceTool && this.performanceTool.enableDataExport
            }
        }
        He.performanceTool = null, He._enable = !1, He.PERFORMANCE_LAYA = "Laya", He.PERFORMANCE_LAYA_3D = "Laya/3D", He.PERFORMANCE_LAYA_2D = "Laya/2D", He.PERFORMANCE_LAYA_3D_PRERENDER = "Laya/3D/PreRender", He.PERFORMANCE_LAYA_3D_UPDATESCRIPT = "Laya/3D/UpdateScript", He.PERFORMANCE_LAYA_3D_PHYSICS = "Laya/3D/Physics", He.PERFORMANCE_LAYA_3D_PHYSICS_SIMULATE = "Laya/3D/Physics/simulate", He.PERFORMANCE_LAYA_3D_PHYSICS_CHARACTORCOLLISION = "Laya/3D/Physics/updataCharacters&Collisions", He.PERFORMANCE_LAYA_3D_PHYSICS_EVENTSCRIPTS = "Laya/3D/Physics/eventScripts", He.PERFORMANCE_LAYA_3D_RENDER = "Laya/3D/Render", He.PERFORMANCE_LAYA_3D_RENDER_SHADOWMAP = "Laya/3D/Render/ShadowMap", He.PERFORMANCE_LAYA_3D_RENDER_CLUSTER = "Laya/3D/Render/Cluster", He.PERFORMANCE_LAYA_3D_RENDER_CULLING = "Laya/3D/Render/Culling", He.PERFORMANCE_LAYA_3D_RENDER_RENDERDEPTHMDOE = "Laya/3D/Render/RenderDepthMode", He.PERFORMANCE_LAYA_3D_RENDER_RENDEROPAQUE = "Laya/3D/Render/RenderOpaque", He.PERFORMANCE_LAYA_3D_RENDER_RENDERCOMMANDBUFFER = "Laya/3D/Render/RenderCommandBuffer", He.PERFORMANCE_LAYA_3D_RENDER_RENDERTRANSPARENT = "Laya/3D/Render/RenderTransparent", He.PERFORMANCE_LAYA_3D_RENDER_POSTPROCESS = "Laya/3D/Render/PostProcess", window.PerformancePlugin = He;
        class ze extends Oe {
            constructor() {
                super(), this.offset = new m, this._frameRate = "fast", this.designWidth = 0, this.designHeight = 0, this.canvasRotation = !1, this.canvasDegree = 0, this.renderingEnabled = !0, this.screenAdaptationEnabled = !0, this._canvasTransform = new f, this._screenMode = "none", this._scaleMode = "noscale", this._alignV = "top", this._alignH = "left", this._bgColor = "black", this._mouseMoveTime = 0, this._renderCount = 0, this._safariOffsetY = 0, this._frameStartTime = 0, this._previousOrientation = ae.window.orientation, this._wgColor = [0, 0, 0, 1], this._scene3Ds = [], this._globalRepaintSet = !1, this._globalRepaintGet = !1, this._3dUI = [], this._curUIBase = null, this.useRetinalCanvas = !1, super.set_transform(this._createTransform()), this.mouseEnabled = !0, this.hitTestPrior = !0, this.autoSize = !1, this._setBit(be.DISPLAYED_INSTAGE, !0), this._setBit(be.ACTIVE_INHIERARCHY, !0), this._isFocused = !0, this._isVisibility = !0, this.useRetinalCanvas = i.useRetinalCanvas;
                var t = ae.window;
                t.addEventListener("focus", () => {
                    this._isFocused = !0, this.event(Jt.FOCUS), this.event(Jt.FOCUS_CHANGE)
                }), t.addEventListener("blur", () => {
                    this._isFocused = !1, this.event(Jt.BLUR), this.event(Jt.FOCUS_CHANGE), this._isInputting() && (Ge.inputElement.target.focus = !1)
                });
                var e = "visibilityState",
                    s = "visibilitychange",
                    r = t.document;
                void 0 !== r.hidden ? (s = "visibilitychange",
                    e = "visibilityState") : void 0 !== r.mozHidden ? (s = "mozvisibilitychange", e = "mozVisibilityState") : void 0 !== r.msHidden ? (s = "msvisibilitychange", e = "msVisibilityState") : void 0 !== r.webkitHidden && (s = "webkitvisibilitychange", e = "webkitVisibilityState"), t.document.addEventListener(s, () => {
                    "hidden" == ae.document[e] ? (this._isVisibility = !1, this._isInputting() && (Ge.inputElement.target.focus = !1)) : this._isVisibility = !0, this.renderingEnabled = this._isVisibility, this.event(Jt.VISIBILITY_CHANGE)
                }), t.addEventListener("resize", () => {
                    var t = ae.window.orientation;
                    null != t && t != this._previousOrientation && this._isInputting() && (Ge.inputElement.target.focus = !1), this._previousOrientation = t, this._isInputting() || (ae.onSafari && (this._safariOffsetY = (ae.window.__innerHeight || ae.document.body.clientHeight || ae.document.documentElement.clientHeight) - ae.window.innerHeight), this._resetCanvas())
                }), t.addEventListener("orientationchange", t => {
                    this._resetCanvas()
                }), this.on(Jt.MOUSE_MOVE, this, this._onmouseMove), ae.onMobile && this.on(Jt.MOUSE_DOWN, this, this._onmouseMove)
            }
            _isInputting() {
                return ae.onMobile && Ge.isInputting
            }
            set width(t) {
                this.designWidth = t, super.set_width(t), s.systemTimer.callLater(this, this._changeCanvasSize)
            }
            get width() {
                return super.get_width()
            }
            set height(t) {
                this.designHeight = t, super.set_height(t), s.systemTimer.callLater(this, this._changeCanvasSize)
            }
            get height() {
                return super.get_height()
            }
            set transform(t) {
                super.set_transform(t)
            }
            get transform() {
                return this._tfChanged && this._adjustTransform(), this._transform = this._transform || this._createTransform()
            }
            get isFocused() {
                return this._isFocused
            }
            get isVisibility() {
                return this._isVisibility
            }
            _changeCanvasSize() {
                this.setScreenSize(ae.clientWidth * ae.pixelRatio, ae.clientHeight * ae.pixelRatio)
            }
            _resetCanvas() {
                this.screenAdaptationEnabled && this._changeCanvasSize()
            }
            setScreenSize(t, e) {
                var i = !1;
                if (this._screenMode !== ze.SCREEN_NONE) {
                    var s = t / e < 1 ? ze.SCREEN_VERTICAL : ze.SCREEN_HORIZONTAL;
                    if (i = s !== this._screenMode, i) {
                        var r = e;
                        e = t, t = r
                    }
                }
                this.canvasRotation = i;
                var a = pe._mainCanvas,
                    n = (a.source.style, this._canvasTransform.identity()),
                    h = this._scaleMode,
                    o = t / this.designWidth,
                    l = e / this.designHeight,
                    _ = this.useRetinalCanvas ? t : this.designWidth,
                    u = this.useRetinalCanvas ? e : this.designHeight,
                    c = t,
                    d = e,
                    p = ae.pixelRatio;
                switch (this._width = this.designWidth, this._height = this.designHeight, h) {
                    case ze.SCALE_NOSCALE:
                        o = l = 1, c = this.designWidth, d = this.designHeight;
                        break;
                    case ze.SCALE_SHOWALL:
                        o = l = Math.min(o, l), _ = c = Math.round(this.designWidth * o), u = d = Math.round(this.designHeight * l);
                        break;
                    case ze.SCALE_NOBORDER:
                        o = l = Math.max(o, l), c = Math.round(this.designWidth * o), d = Math.round(this.designHeight * l);
                        break;
                    case ze.SCALE_FULL:
                        o = l = 1, this._width = _ = t, this._height = u = e;
                        break;
                    case ze.SCALE_FIXED_WIDTH:
                        l = o, this._height = u = Math.round(e / o);
                        break;
                    case ze.SCALE_FIXED_HEIGHT:
                        o = l, this._width = _ = Math.round(t / l);
                        break;
                    case ze.SCALE_FIXED_AUTO:
                        t / e < this.designWidth / this.designHeight ? (l = o, this._height = u = Math.round(e / o)) : (o = l, this._width = _ = Math.round(t / l))
                }
                this.useRetinalCanvas && (c = _ = t, d = u = e), o *= this.scaleX, l *= this.scaleY, 1 === o && 1 === l ? this.transform.identity() : (this.transform.a = this._formatData(o / (c / _)), this.transform.d = this._formatData(l / (d / u))), a.size(_, u), Xe.changeWebGLSize(_, u), n.scale(c / _ / p, d / u / p), this._alignH === ze.ALIGN_LEFT ? this.offset.x = 0 : this._alignH === ze.ALIGN_RIGHT ? this.offset.x = t - c : this.offset.x = .5 * (t - c) / p, this._alignV === ze.ALIGN_TOP ? this.offset.y = 0 : this._alignV === ze.ALIGN_BOTTOM ? this.offset.y = e - d : this.offset.y = .5 * (e - d) / p, this.offset.x = Math.round(this.offset.x), this.offset.y = Math.round(this.offset.y), n.translate(this.offset.x, this.offset.y), this._safariOffsetY && n.translate(0, this._safariOffsetY), this.canvasDegree = 0, i && (this._screenMode === ze.SCREEN_HORIZONTAL ? (n.rotate(Math.PI / 2), n.translate(e / p, 0), this.canvasDegree = 90) : (n.rotate(-Math.PI / 2), n.translate(0, t / p), this.canvasDegree = -90)), n.a = this._formatData(n.a), n.d = this._formatData(n.d), n.tx = this._formatData(n.tx), n.ty = this._formatData(n.ty), super.set_transform(this.transform), Fi.isWXPlayable ? this._safariOffsetY && n.translate(0, -this._safariOffsetY) : (ze._setStageStyle(a, _, u, n), this._safariOffsetY && n.translate(0, -this._safariOffsetY)), this.visible = !0, this._repaint |= ve.REPAINT_CACHE, this.event(Jt.RESIZE)
            }
            static _setStageStyle(t, e, i, s) {
                var r = t.source.style;
                r.transformOrigin = r.webkitTransformOrigin = r.msTransformOrigin = r.mozTransformOrigin = r.oTransformOrigin = "0px 0px 0px", r.transform = r.webkitTransform = r.msTransform = r.mozTransform = r.oTransform = "matrix(" + s.toString() + ")", r.width = e, r.height = i, s.translate(parseInt(r.left) || 0, parseInt(r.top) || 0)
            }
            _formatData(t) {
                return Math.abs(t) < 1e-6 ? 0 : Math.abs(1 - t) < .001 ? t > 0 ? 1 : -1 : t
            }
            get scaleMode() {
                return this._scaleMode
            }
            set scaleMode(t) {
                this._scaleMode = t, s.systemTimer.callLater(this, this._changeCanvasSize)
            }
            get alignH() {
                return this._alignH
            }
            set alignH(t) {
                this._alignH = t, s.systemTimer.callLater(this, this._changeCanvasSize)
            }
            get alignV() {
                return this._alignV
            }
            set alignV(t) {
                this._alignV = t, s.systemTimer.callLater(this, this._changeCanvasSize)
            }
            get bgColor() {
                return this._bgColor
            }
            set bgColor(t) {
                this._bgColor = t, this._wgColor = t ? et.create(t).arrColor : null, pe.canvas.style.background = t || "none"
            }
            get mouseX() {
                return Math.round(We.instance.mouseX / this.clientScaleX)
            }
            get mouseY() {
                return Math.round(We.instance.mouseY / this.clientScaleY)
            }
            getMousePoint() {
                return m.TEMP.setTo(this.mouseX, this.mouseY)
            }
            get clientScaleX() {
                return this._transform ? this._transform.getScaleX() : 1
            }
            get clientScaleY() {
                return this._transform ? this._transform.getScaleY() : 1
            }
            get screenMode() {
                return this._screenMode
            }
            set screenMode(t) {
                this._screenMode = t
            }
            repaint(t = ve.REPAINT_CACHE) {
                this._repaint |= t
            }
            parentRepaint(t = ve.REPAINT_CACHE) {}
            _loop() {
                return this._globalRepaintGet = this._globalRepaintSet, this._globalRepaintSet = !1, this.render(pe._context, 0, 0), !0
            }
            getFrameTm() {
                return this._frameStartTime
            }
            _onmouseMove(t) {
                this._mouseMoveTime = ae.now()
            }
            getTimeFromFrameStart() {
                return ae.now() - this._frameStartTime
            }
            set visible(t) {
                this.visible !== t && (super.set_visible(t), ze._setVisibleStyle(t))
            }
            static _setVisibleStyle(t) {
                var e = pe._mainCanvas.source.style;
                e.visibility = t ? "visible" : "hidden"
            }
            get visible() {
                return super.visible
            }
            render(t, e, i) {
                if (window.conch) this.renderToNative(t, e, i);
                else {
                    if (this._frameRate === ze.FRAME_SLEEP) {
                        var s = ae.now();
                        if (!(s - this._frameStartTime >= 1e3)) return;
                        this._frameStartTime = s
                    } else {
                        if (!this._visible) return this._renderCount++, void(this._renderCount % 5 == 0 && (Ye.I._update(), z.loopCount++, Ct.loopCount = z.loopCount, this._updateTimers()));
                        this._frameStartTime = ae.now(), Ct.loopStTm = this._frameStartTime
                    }
                    this._renderCount++;
                    var r = this._frameRate === ze.FRAME_MOUSE ? this._frameStartTime - this._mouseMoveTime < 2e3 ? ze.FRAME_FAST : ze.FRAME_SLOW : this._frameRate,
                        a = r !== ze.FRAME_SLOW,
                        n = this._renderCount % 2 == 0;
                    if (z.renderSlow = !a, a || n) {
                        if (this.event(Fi.Event.BEFORE_UPDATE), Ye.I._update(), z.loopCount++, Ct.loopCount = z.loopCount, He.begainSample(He.PERFORMANCE_LAYA), this.renderingEnabled) {
                            for (var h = 0, o = this._scene3Ds.length; h < o; h++) this._scene3Ds[h]._update();
                            t.clear(), super.render(t, e, i), z._StatRender.renderNotCanvas(t, e, i)
                        }
                        this.renderingEnabled && !window.__renderingFlag && (ze.clear(this._bgColor), t.flush(), Ce.instance && Ce.getInstance().endDispose()), this._updateTimers(), He.endSample(He.PERFORMANCE_LAYA), this.event(Fi.Event.AFTER_UPDATE)
                    }
                }
            }
            renderToNative(t, e, i) {
                if (this._renderCount++, this._visible) {
                    if (this._frameStartTime = ae.now(), Ye.I._update(), z.loopCount++, Ct.loopCount = z.loopCount, this.event(Fi.Event.BEFORE_UPDATE), this.renderingEnabled) {
                        for (var s = 0, r = this._scene3Ds.length; s < r; s++) this._scene3Ds[s]._update();
                        t.clear(), super.render(t, e, i), z._StatRender.renderNotCanvas(t, e, i)
                    }
                    this.renderingEnabled && (ze.clear(this._bgColor), t.flush(), Ce.instance && Ce.getInstance().endDispose()), this._updateTimers(), this.event(Fi.Event.AFTER_UPDATE)
                } else this._renderCount % 5 == 0 && (Ye.I._update(), z.loopCount++, Ct.loopCount = z.loopCount, this._updateTimers())
            }
            _updateTimers() {
                s.systemTimer._update(), s.startTimer._update(), s.physicsTimer._update(), s.updateTimer._update(), s.lateTimer._update(), s.timer._update()
            }
            set fullScreenEnabled(t) {
                var e = ae.document,
                    i = pe.canvas;
                t ? (i.addEventListener("mousedown", this._requestFullscreen), i.addEventListener("touchstart", this._requestFullscreen), e.addEventListener("fullscreenchange", this._fullScreenChanged), e.addEventListener("mozfullscreenchange", this._fullScreenChanged), e.addEventListener("webkitfullscreenchange", this._fullScreenChanged), e.addEventListener("msfullscreenchange", this._fullScreenChanged)) : (i.removeEventListener("mousedown", this._requestFullscreen), i.removeEventListener("touchstart", this._requestFullscreen), e.removeEventListener("fullscreenchange", this._fullScreenChanged), e.removeEventListener("mozfullscreenchange", this._fullScreenChanged), e.removeEventListener("webkitfullscreenchange", this._fullScreenChanged), e.removeEventListener("msfullscreenchange", this._fullScreenChanged))
            }
            get frameRate() {
                return s.Render.isConchApp ? this._frameRateNative : this._frameRate
            }
            set frameRate(t) {
                if (s.Render.isConchApp) {
                    var e = window.conch;
                    switch (t) {
                        case ze.FRAME_FAST:
                            e.config.setLimitFPS(60);
                            break;
                        case ze.FRAME_MOUSE:
                            e.config.setMouseFrame(2e3);
                            break;
                        case ze.FRAME_SLOW:
                            e.config.setSlowFrame(!0);
                            break;
                        case ze.FRAME_SLEEP:
                            e.config.setLimitFPS(1)
                    }
                    this._frameRateNative = t
                } else this._frameRate = t
            }
            _requestFullscreen() {
                var t = ae.document.documentElement;
                t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : t.msRequestFullscreen && t.msRequestFullscreen()
            }
            _fullScreenChanged() {
                s.stage.event(Jt.FULL_SCREEN_CHANGE)
            }
            exitFullscreen() {
                var t = ae.document;
                t.exitFullscreen ? t.exitFullscreen() : t.mozCancelFullScreen ? t.mozCancelFullScreen() : t.webkitExitFullscreen && t.webkitExitFullscreen()
            }
            isGlobalRepaint() {
                return this._globalRepaintGet
            }
            setGlobalRepaint() {
                this._globalRepaintSet = !0
            }
            add3DUI(t) {
                var e = t.rootView;
                this._3dUI.indexOf(e) >= 0 || this._3dUI.push(e)
            }
            remove3DUI(t) {
                var e = t.rootView,
                    i = this._3dUI.indexOf(e);
                return i >= 0 && (this._3dUI.splice(i, 1), !0)
            }
        }
        ze.SCALE_NOSCALE = "noscale", ze.SCALE_EXACTFIT = "exactfit", ze.SCALE_SHOWALL = "showall", ze.SCALE_NOBORDER = "noborder", ze.SCALE_FULL = "full", ze.SCALE_FIXED_WIDTH = "fixedwidth", ze.SCALE_FIXED_HEIGHT = "fixedheight", ze.SCALE_FIXED_AUTO = "fixedauto", ze.ALIGN_LEFT = "left", ze.ALIGN_RIGHT = "right", ze.ALIGN_CENTER = "center", ze.ALIGN_TOP = "top", ze.ALIGN_MIDDLE = "middle", ze.ALIGN_BOTTOM = "bottom", ze.SCREEN_NONE = "none", ze.SCREEN_HORIZONTAL = "horizontal", ze.SCREEN_VERTICAL = "vertical", ze.FRAME_FAST = "fast", ze.FRAME_SLOW = "slow", ze.FRAME_MOUSE = "mouse", ze.FRAME_SLEEP = "sleep", ze.clear = function(t) {
            le.set2DRenderConfig();
            var e = T.instance;
            k.worldScissorTest && e.disable(e.SCISSOR_TEST);
            var r = pe.context,
                a = 0 == r._submits._length || i.preserveDrawingBuffer ? et.create(t).arrColor : s.stage._wgColor;
            a ? r.clearBG(a[0], a[1], a[2], a[3]) : r.clearBG(0, 0, 0, 0), k.clear()
        }, Pe.regClass("laya.display.Stage", ze), Pe.regClass("Laya.Stage", ze);
        class Ke {
            static __init__() {
                Ke._addEvent("keydown"), Ke._addEvent("keypress"), Ke._addEvent("keyup")
            }
            static _addEvent(t) {
                s.Browser.document.addEventListener(t, function(e) {
                    Ke._dispatch(e, t)
                }, !0)
            }
            static _dispatch(t, e) {
                if (Ke.enabled) {
                    Ke._event._stoped = !1, Ke._event.nativeEvent = t, Ke._event.keyCode = t.keyCode || t.which || t.charCode, "keydown" === e ? Ke._pressKeys[Ke._event.keyCode] = !0 : "keyup" === e && (Ke._pressKeys[Ke._event.keyCode] = null);
                    for (var i = s.stage.focus && null != s.stage.focus.event && s.stage.focus.displayedInStage ? s.stage.focus : s.stage, r = i; r;) r.event(e, Ke._event.setTo(e, r, i)), r = r.parent
                }
            }
            static hasKeyDown(t) {
                return Ke._pressKeys[t]
            }
        }
        Ke._pressKeys = {}, Ke.enabled = !0, Ke._event = new Jt;
        class je extends M {
            constructor() {
                super(...arguments), this.isStopped = !1
            }
            set volume(t) {}
            get volume() {
                return 1
            }
            get position() {
                return 0
            }
            get duration() {
                return 0
            }
            play() {}
            stop() {
                this.completeHandler && this.completeHandler.runWith(!1)
            }
            pause() {}
            resume() {}
            __runComplete(t) {
                t && t.runWith(!0)
            }
        }
        class qe extends je {
            constructor(t) {
                super(), this._audio = null, this._onEnd = this.__onEnd.bind(this), this._resumePlay = this.__resumePlay.bind(this), t.addEventListener("ended", this._onEnd), this._audio = t
            }
            __onEnd(t) {
                if (1 == this.loops) return this.completeHandler && (s.systemTimer.once(10, this, this.__runComplete, [this.completeHandler], !1), this.completeHandler = null), this.stop(), void this.event(Jt.COMPLETE);
                this.loops > 0 && this.loops--, this.startTime = 0, this.play()
            }
            __resumePlay() {
                if (this._audio && this._audio.removeEventListener("canplay", this._resumePlay), !this.isStopped) try {
                    this._audio.currentTime = this.startTime, ae.container.appendChild(this._audio), this._audio.play()
                } catch (t) {
                    this.event(Jt.ERROR)
                }
            }
            play() {
                this.isStopped = !1;
                try {
                    this._audio.playbackRate = s.SoundManager.playbackRate, this._audio.currentTime = this.startTime
                } catch (t) {
                    return void this._audio.addEventListener("canplay", this._resumePlay)
                }
                s.SoundManager.addChannel(this), ae.container.appendChild(this._audio), "play" in this._audio && this._audio.play()
            }
            get position() {
                return this._audio ? this._audio.currentTime : 0
            }
            get duration() {
                return this._audio ? this._audio.duration : 0
            }
            stop() {
                super.stop(), this.isStopped = !0, s.SoundManager.removeChannel(this), this.completeHandler = null, this._audio && ("pause" in this._audio && s.Render.isConchApp && this._audio.stop(), this._audio.pause(), this._audio.removeEventListener("ended", this._onEnd), this._audio.removeEventListener("canplay", this._resumePlay), s.Browser.onIE || this._audio != s.AudioSound._musicAudio && s.Pool.recover("audio:" + this.url, this._audio), ae.removeElement(this._audio), this._audio = null, s.SoundManager.autoReleaseSound && s.SoundManager.disposeSoundLater(this.url))
            }
            pause() {
                this.isStopped = !0, s.SoundManager.removeChannel(this), this._audio && ("pause" in this._audio && this._audio.pause(), s.SoundManager.autoReleaseSound && s.SoundManager.disposeSoundLater(this.url))
            }
            resume() {
                var t = this._audio;
                t && (this.isStopped = !1, 0 == t.readyState && (t.src = this.url, t.addEventListener("canplay", this._resumePlay), t.load && t.load()), s.SoundManager.addChannel(this), "play" in t && t.play())
            }
            set volume(t) {
                this._audio && (this._audio.volume = t)
            }
            get volume() {
                return this._audio ? this._audio.volume : 1
            }
        }
        class Ze extends M {
            constructor() {
                super(...arguments), this.loaded = !1
            }
            dispose() {
                var t = Ze._audioCache[this.url];
                r.clearBySign("audio:" + this.url), t && (pe.isConchApp || (t.src = ""), delete Ze._audioCache[this.url])
            }
            static _initMusicAudio() {
                Ze._musicAudio || (Ze._musicAudio || (Ze._musicAudio = ae.createElement("audio")), pe.isConchApp || ae.document.addEventListener("mousedown", Ze._makeMusicOK))
            }
            static _makeMusicOK() {
                ae.document.removeEventListener("mousedown", Ze._makeMusicOK), Ze._musicAudio.src ? Ze._musicAudio.play() : (Ze._musicAudio.src = "", Ze._musicAudio.load())
            }
            load(t) {
                function e() {
                    r(), n.loaded = !0, n.event(Jt.COMPLETE)
                }

                function i() {
                    a.load = null, r(), n.event(Jt.ERROR)
                }

                function r() {
                    a.removeEventListener("canplaythrough", e), a.removeEventListener("error", i)
                }
                var a;
                if (t = P.formatURL(t), this.url = t, t == s.SoundManager._bgMusic ? (Ze._initMusicAudio(), a = Ze._musicAudio, a.src != t && (delete Ze._audioCache[a.src], a = null)) : a = Ze._audioCache[t], a && a.readyState >= 2) this.event(Jt.COMPLETE);
                else {
                    a || (t == s.SoundManager._bgMusic ? (Ze._initMusicAudio(), a = Ze._musicAudio) : a = ae.createElement("audio"), Ze._audioCache[t] = a, a.src = t), a.addEventListener("canplaythrough", e), a.addEventListener("error", i);
                    var n = this;
                    this.audio = a, a.load ? a.load() : i()
                }
            }
            play(t = 0, e = 0) {
                if (!this.url) return null;
                var i, a;
                if (this.url == s.SoundManager._bgMusic ? (i = Ze._musicAudio, "" != i.src && i.src != this.url && (delete Ze._audioCache[i.src], Ze._audioCache[this.url] = i)) : i = Ze._audioCache[this.url], !i) return null;
                a = r.getItem("audio:" + this.url), pe.isConchApp ? a || (a = ae.createElement("audio"), a.src = this.url) : this.url == s.SoundManager._bgMusic ? (Ze._initMusicAudio(), a = Ze._musicAudio, a.src = this.url) : a = a || i.cloneNode(!0);
                var n = new qe(a);
                return n.url = this.url, n.loops = e, n.startTime = t, n.play(), s.SoundManager.addChannel(n), n
            }
            get duration() {
                var t;
                return t = Ze._audioCache[this.url], t ? t.duration : 0
            }
        }
        Ze._audioCache = {};
        class Qe extends je {
            constructor() {
                super(), this.bufferSource = null, this._currentTime = 0, this._volume = 1, this._startTime = 0, this._pauseTime = 0, this.context = s.WebAudioSound.ctx, this._onPlayEnd = tt.bind(this.__onPlayEnd, this), this.context.createGain ? this.gain = this.context.createGain() : this.gain = this.context.createGainNode()
            }
            play() {
                if (s.SoundManager.addChannel(this), this.isStopped = !1, this._clearBufferSource(), this.audioBuffer) {
                    if (this.startTime >= this.duration) return this.stop();
                    var t = this.context,
                        e = this.gain,
                        i = t.createBufferSource();
                    this.bufferSource = i, i.buffer = this.audioBuffer, i.connect(e), e && e.disconnect(), e.connect(t.destination), i.onended = this._onPlayEnd, this._startTime = ae.now(), this.gain.gain.setTargetAtTime ? this.gain.gain.setTargetAtTime(this._volume, this.context.currentTime, Qe.SetTargetDelay) : this.gain.gain.value = this._volume, 0 == this.loops && (i.loop = !0), i.playbackRate.setTargetAtTime ? i.playbackRate.setTargetAtTime(s.SoundManager.playbackRate, this.context.currentTime, Qe.SetTargetDelay) : i.playbackRate.value = s.SoundManager.playbackRate, i.start(0, this.startTime), this._currentTime = 0
                }
            }
            __onPlayEnd() {
                if (1 == this.loops) return this.completeHandler && (s.timer.once(10, this, this.__runComplete, [this.completeHandler], !1), this.completeHandler = null), this.stop(), void this.event(Jt.COMPLETE);
                this.loops > 0 && this.loops--, this.startTime = 0, this.play()
            }
            get position() {
                return this.bufferSource ? (ae.now() - this._startTime) / 1e3 + this.startTime : 0
            }
            get duration() {
                return this.audioBuffer ? this.audioBuffer.duration : 0
            }
            _clearBufferSource() {
                if (this.bufferSource) {
                    var t = this.bufferSource;
                    t.stop ? t.stop(0) : t.noteOff(0), t.disconnect(0), t.onended = null, Qe._tryCleanFailed || this._tryClearBuffer(t), this.bufferSource = null
                }
            }
            _tryClearBuffer(t) {
                try {
                    t.buffer = null
                } catch (t) {
                    Qe._tryCleanFailed = !0
                }
            }
            stop() {
                super.stop(), this._clearBufferSource(), this.audioBuffer = null, this.gain && this.gain.disconnect(), this.isStopped = !0, s.SoundManager.removeChannel(this), this.completeHandler = null, s.SoundManager.autoReleaseSound && s.SoundManager.disposeSoundLater(this.url)
            }
            pause() {
                this.isStopped || (this._pauseTime = this.position), this._clearBufferSource(), this.gain && this.gain.disconnect(), this.isStopped = !0, s.SoundManager.removeChannel(this), s.SoundManager.autoReleaseSound && s.SoundManager.disposeSoundLater(this.url)
            }
            resume() {
                this.startTime = this._pauseTime, this.play()
            }
            set volume(t) {
                this._volume = t, this.isStopped || (this.gain.gain.setTargetAtTime ? this.gain.gain.setTargetAtTime(t, this.context.currentTime, Qe.SetTargetDelay) : this.gain.gain.value = t)
            }
            get volume() {
                return this._volume
            }
        }
        Qe._tryCleanFailed = !1, Qe.SetTargetDelay = .001;
        class $e extends M {
            constructor() {
                super(...arguments), this.loaded = !1, this._disposed = !1
            }
            static decode() {
                $e.buffs.length <= 0 || $e.isDecoding || ($e.isDecoding = !0, $e.tInfo = $e.buffs.shift(), $e.ctx.decodeAudioData($e.tInfo.buffer, $e._done, $e._fail))
            }
            static _done(t) {
                $e.e.event("loaded:" + $e.tInfo.url, t), $e.isDecoding = !1, $e.decode()
            }
            static _fail() {
                $e.e.event("err:" + $e.tInfo.url, null), $e.isDecoding = !1, $e.decode()
            }
            static _playEmptySound() {
                if (null != $e.ctx) {
                    var t = $e.ctx.createBufferSource();
                    t.buffer = $e._miniBuffer, t.connect($e.ctx.destination), t.start(0, 0, 0)
                }
            }
            static _unlock() {
                $e._unlocked || ($e._playEmptySound(), "running" == $e.ctx.state && (window.document.removeEventListener("mousedown", $e._unlock, !0), window.document.removeEventListener("touchend", $e._unlock, !0), window.document.removeEventListener("touchstart", $e._unlock, !0), $e._unlocked = !0))
            }
            static initWebAudio() {
                "running" != $e.ctx.state && ($e._unlock(), window.document.addEventListener("mousedown", $e._unlock, !0), window.document.addEventListener("touchend", $e._unlock, !0), window.document.addEventListener("touchstart", $e._unlock, !0))
            }
            load(t) {
                var e = this;
                if (t = P.formatURL(t), this.url = t, this.audioBuffer = $e._dataCache[t], this.audioBuffer) this._loaded(this.audioBuffer);
                else if ($e.e.on("loaded:" + t, this, this._loaded), $e.e.on("err:" + t, this, this._err), !$e.__loadingSound[t]) {
                    $e.__loadingSound[t] = !0;
                    var i = new XMLHttpRequest;
                    i.open("GET", t, !0), i.responseType = "arraybuffer", i.onload = function() {
                        e._disposed ? e._removeLoadEvents() : (e.data = i.response, $e.buffs.push({
                            buffer: e.data,
                            url: e.url
                        }), $e.decode())
                    }, i.onerror = function(t) {
                        e._err()
                    }, i.send()
                }
            }
            _err() {
                this._removeLoadEvents(), $e.__loadingSound[this.url] = !1, this.event(Jt.ERROR)
            }
            _loaded(t) {
                this._removeLoadEvents(), this._disposed || (this.audioBuffer = t, $e._dataCache[this.url] = this.audioBuffer, this.loaded = !0, this.event(Jt.COMPLETE))
            }
            _removeLoadEvents() {
                $e.e.off("loaded:" + this.url, this, this._loaded), $e.e.off("err:" + this.url, this, this._err)
            }
            __playAfterLoaded() {
                if (this.__toPlays) {
                    var t, e, i, s;
                    for (i = this.__toPlays, e = i.length, t = 0; t < e; t++) s = i[t], s[2] && !s[2].isStopped && this.play(s[0], s[1], s[2]);
                    this.__toPlays.length = 0
                }
            }
            play(t = 0, e = 0, i = null) {
                return i = i || new Qe, this.audioBuffer || this.url && (this.__toPlays || (this.__toPlays = []), this.__toPlays.push([t, e, i]), this.once(Jt.COMPLETE, this, this.__playAfterLoaded), this.load(this.url)), i.url = this.url, i.loops = e, i.audioBuffer = this.audioBuffer, i.startTime = t, i.play(), s.SoundManager.addChannel(i), i
            }
            get duration() {
                return this.audioBuffer ? this.audioBuffer.duration : 0
            }
            dispose() {
                this._disposed = !0, delete $e._dataCache[this.url], delete $e.__loadingSound[this.url], this.audioBuffer = null, this.data = null, this.__toPlays = []
            }
        }
        $e._dataCache = {}, $e.webAudioEnabled = window.AudioContext || window.webkitAudioContext || window.mozAudioContext, $e.ctx = $e.webAudioEnabled ? new(window.AudioContext || window.webkitAudioContext || window.mozAudioContext) : void 0, $e.buffs = [], $e.isDecoding = !1, $e._miniBuffer = $e.ctx ? $e.ctx.createBuffer(1, 1, 22050) : void 0, $e.e = new M, $e._unlocked = !1, $e.__loadingSound = {};
        class Je {
            static __init__() {
                var t = s.Browser.window,
                    e = !!(t.AudioContext || t.webkitAudioContext || t.mozAudioContext);
                return e && $e.initWebAudio(), Je._soundClass = e ? $e : Ze, ae.onTBMiniGame || Ze._initMusicAudio(), Je._musicClass = Ze, e
            }
            static addChannel(t) {
                Je._channels.indexOf(t) >= 0 || Je._channels.push(t)
            }
            static removeChannel(t) {
                var e;
                for (e = Je._channels.length - 1; e >= 0; e--) Je._channels[e] == t && Je._channels.splice(e, 1)
            }
            static disposeSoundLater(t) {
                Je._lastSoundUsedTimeDic[t] = s.Browser.now(), Je._isCheckingDispose || (Je._isCheckingDispose = !0, s.timer.loop(5e3, null, Je._checkDisposeSound))
            }
            static _checkDisposeSound() {
                var t, e = s.Browser.now(),
                    i = !1;
                for (t in Je._lastSoundUsedTimeDic) e - Je._lastSoundUsedTimeDic[t] > 3e4 ? (delete Je._lastSoundUsedTimeDic[t], Je.disposeSoundIfNotUsed(t)) : i = !0;
                i || (Je._isCheckingDispose = !1, s.timer.clear(null, Je._checkDisposeSound))
            }
            static disposeSoundIfNotUsed(t) {
                var e;
                for (e = Je._channels.length - 1; e >= 0; e--)
                    if (Je._channels[e].url == t) return;
                Je.destroySound(t)
            }
            static set autoStopMusic(t) {
                s.stage.off(Jt.BLUR, null, Je._stageOnBlur), s.stage.off(Jt.FOCUS, null, Je._stageOnFocus), s.stage.off(Jt.VISIBILITY_CHANGE, null, Je._visibilityChange), Je._autoStopMusic = t, t && (s.stage.on(Jt.BLUR, null, Je._stageOnBlur), s.stage.on(Jt.FOCUS, null, Je._stageOnFocus), s.stage.on(Jt.VISIBILITY_CHANGE, null, Je._visibilityChange))
            }
            static get autoStopMusic() {
                return Je._autoStopMusic
            }
            static _visibilityChange() {
                s.stage.isVisibility ? Je._stageOnFocus() : Je._stageOnBlur()
            }
            static _stageOnBlur() {
                Je._isActive = !1, Je._musicChannel && (Je._musicChannel.isStopped || (Je._blurPaused = !0, Je._musicChannel.pause())), Je.stopAllSound(), s.stage.once(Jt.MOUSE_DOWN, null, Je._stageOnFocus)
            }
            static _recoverWebAudio() {
                $e.ctx && "running" != $e.ctx.state && $e.ctx.resume && $e.ctx.resume()
            }
            static _stageOnFocus() {
                Je._isActive = !0, Je._recoverWebAudio(), s.stage.off(Jt.MOUSE_DOWN, null, Je._stageOnFocus), Je._blurPaused && Je._musicChannel && Je._musicChannel.isStopped && (Je._blurPaused = !1, Je._musicChannel.resume())
            }
            static set muted(t) {
                t != Je._muted && (t && Je.stopAllSound(), Je.musicMuted = t, Je._muted = t)
            }
            static get muted() {
                return Je._muted
            }
            static set soundMuted(t) {
                Je._soundMuted = t
            }
            static get soundMuted() {
                return Je._soundMuted
            }
            static set musicMuted(t) {
                t != Je._musicMuted && (t ? (Je._bgMusic && Je._musicChannel && !Je._musicChannel.isStopped ? s.Render.isConchApp ? Je._musicChannel._audio && (Je._musicChannel._audio.muted = !0) : Je._musicChannel.pause() : Je._musicChannel = null, Je._musicMuted = t) : (Je._musicMuted = t, Je._bgMusic && Je._musicChannel && (s.Render.isConchApp ? Je._musicChannel._audio && (Je._musicChannel._audio.muted = !1) : Je._musicChannel.resume())))
            }
            static get musicMuted() {
                return Je._musicMuted
            }
            static get useAudioMusic() {
                return Je._useAudioMusic
            }
            static set useAudioMusic(t) {
                Je._useAudioMusic = t, Je._musicClass = t ? Ze : null
            }
            static playSound(t, e = 1, i = null, r = null, a = 0) {
                if (!Je._isActive || !t) return null;
                if (Je._muted) return null;
                if (Je._recoverWebAudio(), t = P.formatURL(t), t == Je._bgMusic) {
                    if (Je._musicMuted) return null
                } else {
                    if (s.Render.isConchApp) {
                        var n = tt.getFileExtension(t);
                        if ("wav" != n && "ogg" != n) return alert("The sound only supports wav or ogg format,for optimal performance reason,please refer to the official website document."), null
                    }
                    if (Je._soundMuted) return null
                }
                var h, o;
                return ae._isMiniGame || (h = s.loader.getRes(t)), r || (r = Je._soundClass), h || (h = new r, h.load(t), ae._isMiniGame || s.Loader.cacheRes(t, h)), o = h.play(a, e), o ? (o.url = t, o.volume = t == Je._bgMusic ? Je.musicVolume : Je.soundVolume, o.completeHandler = i, o) : null
            }
            static destroySound(t) {
                var e = s.loader.getRes(t);
                e && (s.Loader.clearRes(t), e.dispose())
            }
            static playMusic(t, e = 0, i = null, s = 0) {
                return t = P.formatURL(t), Je._bgMusic = t, Je._musicChannel && Je._musicChannel.stop(), Je._musicChannel = Je.playSound(t, e, i, Je._musicClass, s)
            }
            static stopSound(t) {
                var e, i;
                for (t = P.formatURL(t), e = Je._channels.length - 1; e >= 0; e--) i = Je._channels[e], i.url == t && i.stop()
            }
            static stopAll() {
                var t, e;
                for (Je._bgMusic = null, t = Je._channels.length - 1; t >= 0; t--) e = Je._channels[t], e.stop()
            }
            static stopAllSound() {
                var t, e;
                for (t = Je._channels.length - 1; t >= 0; t--) e = Je._channels[t], e.url != Je._bgMusic && e.stop()
            }
            static stopMusic() {
                Je._musicChannel && Je._musicChannel.stop(), Je._bgMusic = null
            }
            static setSoundVolume(t, e = null) {
                var i, s;
                if (e) e = P.formatURL(e), Je._setVolume(e, t);
                else
                    for (Je.soundVolume = t, i = Je._channels.length - 1; i >= 0; i--) s = Je._channels[i], s.url != Je._bgMusic && (s.volume = t)
            }
            static setMusicVolume(t) {
                Je.musicVolume = t, Je._setVolume(Je._bgMusic, t)
            }
            static _setVolume(t, e) {
                var i, s;
                for (t = P.formatURL(t), i = Je._channels.length - 1; i >= 0; i--) s = Je._channels[i], s.url == t && (s.volume = e)
            }
        }
        Je.musicVolume = 1, Je.soundVolume = 1, Je.playbackRate = 1, Je._useAudioMusic = !0, Je._muted = !1, Je._soundMuted = !1, Je._musicMuted = !1, Je._bgMusic = null, Je._musicChannel = null, Je._channels = [], Je._blurPaused = !1, Je._isActive = !0, Je._lastSoundUsedTimeDic = {}, Je._isCheckingDispose = !1, Je.autoReleaseSound = !0;
        class ti {
            create() {
                return this.json ? s.SceneUtils.createByData(null, this.json) : null
            }
        }
        class ei {
            constructor() {
                this._fontCharDic = {}, this._fontWidthMap = {}, this._maxWidth = 0, this._spaceWidth = 10, this.fontSize = 12, this.autoScaleSize = !1, this.letterSpacing = 0
            }
            loadFont(t, e) {
                this._path = t, this._complete = e, t && -1 !== t.indexOf(".fnt") ? s.loader.load([{
                    url: t,
                    type: s.Loader.XML
                }, {
                    url: t.replace(".fnt", ".png"),
                    type: s.Loader.IMAGE
                }], w.create(this, this._onLoaded)) : console.error('Bitmap font configuration information must be a ".fnt" file')
            }
            _onLoaded() {
                this.parseFont(s.Loader.getRes(this._path), s.Loader.getRes(this._path.replace(".fnt", ".png"))), this._complete && this._complete.run()
            }
            parseFont(t, e) {
                if (null != t && null != e) {
                    this._texture = e;
                    var i = 1,
                        s = t.getElementsByTagName("info");
                    if (!s[0].getAttributeNode) return this.parseFont2(t, e);
                    this.fontSize = parseInt(s[0].getAttributeNode("size").nodeValue);
                    var r = s[0].getAttributeNode("padding").nodeValue,
                        a = r.split(",");
                    this._padding = [parseInt(a[0]), parseInt(a[1]), parseInt(a[2]), parseInt(a[3])];
                    var n = t.getElementsByTagName("char"),
                        h = 0;
                    for (h = 0; h < n.length; h++) {
                        var o = n[h],
                            l = parseInt(o.getAttributeNode("id").nodeValue),
                            _ = parseInt(o.getAttributeNode("xoffset").nodeValue) / i,
                            u = parseInt(o.getAttributeNode("yoffset").nodeValue) / i,
                            c = parseInt(o.getAttributeNode("xadvance").nodeValue) / i,
                            d = new g;
                        d.x = parseInt(o.getAttributeNode("x").nodeValue), d.y = parseInt(o.getAttributeNode("y").nodeValue), d.width = parseInt(o.getAttributeNode("width").nodeValue), d.height = parseInt(o.getAttributeNode("height").nodeValue);
                        var p = te.create(e, d.x, d.y, d.width, d.height, _, u);
                        this._maxWidth = Math.max(this._maxWidth, c + this.letterSpacing), this._fontCharDic[l] = p, this._fontWidthMap[l] = c
                    }
                }
            }
            parseFont2(t, e) {
                if (null != t && null != e) {
                    this._texture = e;
                    var i = 1,
                        s = t.getElementsByTagName("info");
                    this.fontSize = parseInt(s[0].attributes.size.nodeValue);
                    var r = s[0].attributes.padding.nodeValue,
                        a = r.split(",");
                    this._padding = [parseInt(a[0]), parseInt(a[1]), parseInt(a[2]), parseInt(a[3])];
                    var n = t.getElementsByTagName("char"),
                        h = 0;
                    for (h = 0; h < n.length; h++) {
                        var o = n[h].attributes,
                            l = parseInt(o.id.nodeValue),
                            _ = parseInt(o.xoffset.nodeValue) / i,
                            u = parseInt(o.yoffset.nodeValue) / i,
                            c = parseInt(o.xadvance.nodeValue) / i,
                            d = new g;
                        d.x = parseInt(o.x.nodeValue), d.y = parseInt(o.y.nodeValue), d.width = parseInt(o.width.nodeValue), d.height = parseInt(o.height.nodeValue);
                        var p = te.create(e, d.x, d.y, d.width, d.height, _, u);
                        this._maxWidth = Math.max(this._maxWidth, c + this.letterSpacing), this._fontCharDic[l] = p, this._fontWidthMap[l] = c
                    }
                }
            }
            getCharTexture(t) {
                return this._fontCharDic[t.charCodeAt(0)]
            }
            destroy() {
                if (this._texture) {
                    for (var t in this._fontCharDic) {
                        var e = this._fontCharDic[t];
                        e && e.destroy()
                    }
                    this._texture.destroy(), this._fontCharDic = null, this._fontWidthMap = null, this._texture = null, this._complete = null, this._padding = null
                }
            }
            setSpaceWidth(t) {
                this._spaceWidth = t
            }
            getCharWidth(t) {
                var e = t.charCodeAt(0);
                return this._fontWidthMap[e] ? this._fontWidthMap[e] + this.letterSpacing : " " === t ? this._spaceWidth + this.letterSpacing : 0
            }
            getTextWidth(t) {
                for (var e = 0, i = 0, s = t.length; i < s; i++) e += this.getCharWidth(t.charAt(i));
                return e
            }
            getMaxWidth() {
                return this._maxWidth
            }
            getMaxHeight() {
                return this.fontSize
            }
            _drawText(t, e, i, s, r, a) {
                var n, h = this.getTextWidth(t),
                    o = 0;
                "center" === r && (o = (a - h) / 2), "right" === r && (o = a - h);
                for (var l = 0, _ = 0, u = t.length; _ < u; _++) n = this.getCharTexture(t.charAt(_)), n && (e.graphics.drawImage(n, i + l + o, s), l += this.getCharWidth(t.charAt(_)))
            }
        }
        Pe.regClass("laya.display.BitmapFont", ei), Pe.regClass("Laya.BitmapFont", ei);
        class ii extends M {
            constructor() {
                super(...arguments), this._http = new XMLHttpRequest
            }
            send(t, e = null, i = "get", s = "text", r = null) {
                this._responseType = s, this._data = null, (ae.onVVMiniGame || ae.onQGMiniGame || ae.onQQMiniGame || ae.onAlipayMiniGame || ae.onBLMiniGame || ae.onHWMiniGame || ae.onTTMiniGame || ae.onTBMiniGame) && (t = ii._urlEncode(t)), this._url = t;
                var a = this,
                    n = this._http;
                n.open(i, t, !0);
                let h = !1;
                if (r)
                    for (var o = 0; o < r.length; o++) n.setRequestHeader(r[o++], r[o]);
                else window.conch || (e && "string" != typeof e ? (n.setRequestHeader("Content-Type", "application/json"), e instanceof ArrayBuffer || "string" == typeof e || (h = !0)) : n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"));
                let l = "arraybuffer" !== s ? "text" : "arraybuffer";
                n.responseType = l, n.dataType && (n.dataType = l), n.onerror = function(t) {
                    a._onError(t)
                }, n.onabort = function(t) {
                    a._onAbort(t)
                }, n.onprogress = function(t) {
                    a._onProgress(t)
                }, n.onload = function(t) {
                    a._onLoad(t)
                }, ae.onBLMiniGame && ae.onAndroid && !e && (e = {}), n.send(h ? JSON.stringify(e) : e)
            }
            _onProgress(t) {
                t && t.lengthComputable && this.event(Jt.PROGRESS, t.loaded / t.total)
            }
            _onAbort(t) {
                this.error("Request was aborted by user")
            }
            _onError(t) {
                this.error("Request failed Status:" + this._http.status + " text:" + this._http.statusText)
            }
            _onLoad(t) {
                var e = this._http,
                    i = void 0 !== e.status ? e.status : 200;
                200 === i || 204 === i || 0 === i ? this.complete() : this.error("[" + e.status + "]" + e.statusText + ":" + e.responseURL)
            }
            error(t) {
                this.clear(), console.warn(this.url, t), this.event(Jt.ERROR, t)
            }
            complete() {
                this.clear();
                var t = !0;
                try {
                    "json" === this._responseType ? this._data = JSON.parse(this._http.responseText) : "xml" === this._responseType ? this._data = tt.parseXMLFromString(this._http.responseText) : this._data = this._http.response || this._http.responseText
                } catch (e) {
                    t = !1, this.error(e.message)
                }
                t && this.event(Jt.COMPLETE, this._data instanceof Array ? [this._data] : this._data)
            }
            clear() {
                var t = this._http;
                t.onerror = t.onabort = t.onprogress = t.onload = null
            }
            get url() {
                return this._url
            }
            get data() {
                return this._data
            }
            get http() {
                return this._http
            }
        }
        ii._urlEncode = encodeURI;
        class si extends M {
            constructor() {
                super(...arguments), this._customParse = !1
            }
            static getTypeFromUrl(t) {
                var e = tt.getFileExtension(t);
                return e ? si.typeMap[e] : (console.warn("Not recognize the resources suffix", t), "text")
            }
            load(t, e = null, i = !0, r = null, a = !1, n = s.WorkerLoader.enable) {
                if (t) {
                    var h;
                    if (si.setGroup(t, "666"), this._url = t, 0 !== t.indexOf("data:image") || e ? t = P.formatURL(t) : e = si.IMAGE, this._type = e || (e = si.getTypeFromUrl(this._url)), this._cache = i, this._useWorkerLoader = n, this._data = null, n && s.WorkerLoader.enableWorkerLoader(),
                        e == si.IMAGE ? (h = si.textureMap[t], h && (!h.bitmap || h.bitmap && h.bitmap.destroyed) && (h = null)) : h = si.loadedMap[t], !a && h) return this._data = h, this.event(Jt.PROGRESS, 1), void this.event(Jt.COMPLETE, this._data);
                    if (r && si.setGroup(t, r), null != si.parserMap[e]) return this._customParse = !0, void(si.parserMap[e] instanceof w ? si.parserMap[e].runWith(this) : si.parserMap[e].call(null, this));
                    this._loadResourceFilter(e, t)
                } else this.onLoaded(null)
            }
            _loadResourceFilter(t, e) {
                this._loadResource(t, e)
            }
            _loadResource(t, e) {
                switch (t) {
                    case si.IMAGE:
                    case "htmlimage":
                    case "nativeimage":
                        this._loadImage(e);
                        break;
                    case si.SOUND:
                        this._loadSound(e);
                        break;
                    case si.TTF:
                        this._loadTTF(e);
                        break;
                    case si.ATLAS:
                    case si.PREFAB:
                    case si.PLF:
                        this._loadHttpRequestWhat(e, si.JSON);
                        break;
                    case si.FONT:
                        this._loadHttpRequestWhat(e, si.XML);
                        break;
                    case si.PLFB:
                        this._loadHttpRequestWhat(e, si.BUFFER);
                        break;
                    default:
                        this._loadHttpRequestWhat(e, t)
                }
            }
            _loadHttpRequest(t, e, i, s, r, a, n, h) {
                ae.onVVMiniGame || ae.onHWMiniGame ? this._http = new ii : this._http || (this._http = new ii), a && this._http.on(Jt.PROGRESS, r, a), s && this._http.on(Jt.COMPLETE, i, s), this._http.on(Jt.ERROR, n, h), this._http.send(t, null, "get", e)
            }
            _loadHtmlImage(t, e, i, s, r) {
                function a() {
                    var e = n;
                    e.onload = null, e.onerror = null, delete si._imgCache[t]
                }
                var n, h = function() {
                        a(), r.call(s)
                    },
                    o = function() {
                        try {
                            a(), i.call(e, n)
                        } catch (t) {
                            Fi.isWXPlayable ? console.error(t) : window.onerror(t.message, null, null, null, t)
                        }
                    };
                n = new ae.window.Image, n.crossOrigin = "", n.onload = o, n.onerror = h, n.src = t, si._imgCache[t] = n
            }
            _loadHttpRequestWhat(t, e) {
                si.preLoadedMap[t] ? this.onLoaded(si.preLoadedMap[t]) : this._loadHttpRequest(t, e, this, this.onLoaded, this, this.onProgress, this, this.onError)
            }
            _loadTTF(t) {
                t = P.formatURL(t);
                var e = new s.TTFLoader;
                e.complete = w.create(this, this.onLoaded), e.load(t)
            }
            _loadImage(t, e = !0) {
                var i = this;
                e && (t = P.formatURL(t));
                var s = function() {
                    i.event(Jt.ERROR, "Load image failed")
                };
                if ("nativeimage" === this._type) this._loadHtmlImage(t, this, this.onLoaded, this, s);
                else {
                    var r = tt.getFileExtension(t);
                    "bin" == r && this._url && (r = tt.getFileExtension(this._url)), "ktx" === r || "pvr" === r ? this._loadHttpRequest(t, si.BUFFER, this, this.onLoaded, this, this.onProgress, this, this.onError) : this._loadHtmlImage(t, this, this.onLoaded, this, s)
                }
            }
            _loadSound(t) {
                function e() {
                    s(), a.onLoaded(r)
                }

                function i() {
                    s(), r.dispose(), a.event(Jt.ERROR, "Load sound failed")
                }

                function s() {
                    r.offAll()
                }
                var r = new Je._soundClass,
                    a = this;
                r.on(Jt.COMPLETE, this, e), r.on(Jt.ERROR, this, i), r.load(t)
            }
            onProgress(t) {
                this._type === si.ATLAS ? this.event(Jt.PROGRESS, .3 * t) : this._originType == si.HIERARCHY ? this.event(Jt.PROGRESS, t / 3) : this.event(Jt.PROGRESS, t)
            }
            onError(t) {
                this.event(Jt.ERROR, t)
            }
            onLoaded(e = null) {
                var i = this._type;
                if (i == si.PLFB) this.parsePLFBData(e), this.complete(e);
                else if (i == si.PLF) this.parsePLFData(e), this.complete(e);
                else if (i === si.IMAGE) {
                    let i;
                    if (e instanceof ArrayBuffer) {
                        var s = tt.getFileExtension(this._url);
                        let r;
                        switch (s) {
                            case "ktx":
                                r = t.TextureFormat.ETC1RGB;
                                break;
                            case "pvr":
                                r = t.TextureFormat.PVRTCRGBA_4BPPV;
                                break;
                            default:
                                return void console.error("unknown format", s)
                        }
                        i = new U(0, 0, r, !1, !1), i.wrapModeU = t.WarpMode.Clamp, i.wrapModeV = t.WarpMode.Clamp, i.setCompressData(e), i._setCreateURL(this.url)
                    } else e instanceof U ? i = e : (i = new U(e.width, e.height, 1, !1, !1), i.wrapModeU = t.WarpMode.Clamp, i.wrapModeV = t.WarpMode.Clamp, i.loadImageSource(e, !0), i._setCreateURL(e.src));
                    var r = new te(i);
                    r.url = this._url, this.complete(r)
                } else if (i === si.SOUND || "nativeimage" === i) this.complete(e);
                else if ("htmlimage" === i) {
                    let i = new U(e.width, e.height, 1, !1, !1);
                    i.wrapModeU = t.WarpMode.Clamp, i.wrapModeV = t.WarpMode.Clamp, i.loadImageSource(e, !0), i._setCreateURL(e.src), this.complete(i)
                } else if (i === si.ATLAS) {
                    if (e.frames) {
                        var a = [];
                        if (!this._data) {
                            if (this._data = e, e.meta && e.meta.image) {
                                a = e.meta.image.split(",");
                                var n = this._url.indexOf("/") >= 0 ? "/" : "\\",
                                    h = this._url.lastIndexOf(n),
                                    o = h >= 0 ? this._url.substr(0, h + 1) : "",
                                    l = null;
                                ae.onAndroid && e.meta.compressTextureAndroid && (l = ".ktx"), ae.onIOS && e.meta.compressTextureIOS && (l = e.meta.astc ? ".ktx" : ".pvr");
                                for (var _ = 0, u = a.length; _ < u; _++) a[_] = l ? o + a[_].replace(".png", l) : o + a[_]
                            } else a = [this._url.replace(".json", ".png")];
                            a.reverse(), e.toLoads = a, e.pics = []
                        }
                        this.event(Jt.PROGRESS, .3 + 1 / a.length * .6);
                        var c = P.formatURL(a.pop());
                        s = tt.getFileExtension(c), i = si.IMAGE;
                        return "pvr" != s && "ktx" != s || (i = si.BUFFER), this._loadResourceFilter(i, c)
                    }
                    if (!(e instanceof U))
                        if (e instanceof ArrayBuffer) {
                            c = this._http ? this._http.url : this._url;
                            s = tt.getFileExtension(c);
                            let i;
                            switch (s) {
                                case "ktx":
                                    i = t.TextureFormat.ETC1RGB;
                                    break;
                                case "pvr":
                                    i = t.TextureFormat.PVRTCRGBA_4BPPV;
                                    break;
                                default:
                                    return void console.error("unknown format", s)
                            }
                            let r = new U(0, 0, i, !1, !1);
                            r.wrapModeU = t.WarpMode.Clamp, r.wrapModeV = t.WarpMode.Clamp, r.setCompressData(e), r._setCreateURL(c), e = r
                        } else {
                            let i = new U(e.width, e.height, 1, !1, !1);
                            i.wrapModeU = t.WarpMode.Clamp, i.wrapModeV = t.WarpMode.Clamp, i.loadImageSource(e, !0), i._setCreateURL(e.src), e = i
                        }
                    if (this._data.pics.push(e), this._data.toLoads.length > 0) {
                        this.event(Jt.PROGRESS, .3 + 1 / this._data.toLoads.length * .6);
                        c = P.formatURL(this._data.toLoads.pop()), s = tt.getFileExtension(c), i = si.IMAGE;
                        return "pvr" != s && "ktx" != s || (i = si.BUFFER), this._loadResourceFilter(i, c)
                    }
                    var d = this._data.frames,
                        p = this._url.split("?")[0],
                        f = this._data.meta && this._data.meta.prefix ? this._data.meta.prefix : p.substring(0, p.lastIndexOf(".")) + "/",
                        m = this._data.pics,
                        g = P.formatURL(this._url),
                        T = si.atlasMap[g] || (si.atlasMap[g] = []);
                    T.dir = f;
                    var v = 1;
                    if (this._data.meta && this._data.meta.scale && 1 != this._data.meta.scale)
                        for (var x in v = parseFloat(this._data.meta.scale), d) {
                            var y, E = d[x],
                                A = m[E.frame.idx ? E.frame.idx : 0];
                            c = f + x, A.scaleRate = v, y = te._create(A, E.frame.x, E.frame.y, E.frame.w, E.frame.h, E.spriteSourceSize.x, E.spriteSourceSize.y, E.sourceSize.w, E.sourceSize.h, si.getRes(c)), si.cacheTexture(c, y), y.url = c, T.push(c)
                        } else
                            for (x in d) E = d[x], A = m[E.frame.idx ? E.frame.idx : 0], c = f + x, y = te._create(A, E.frame.x, E.frame.y, E.frame.w, E.frame.h, E.spriteSourceSize.x, E.spriteSourceSize.y, E.sourceSize.w, E.sourceSize.h, si.getRes(c)), si.cacheTexture(c, y), y.url = c, T.push(c);
                    delete this._data.pics, this.complete(this._data)
                } else if (i === si.FONT) {
                    if (!e._source) return this._data = e, this.event(Jt.PROGRESS, .5), this._loadResourceFilter(si.IMAGE, this._url.replace(".fnt", ".png"));
                    var C = new ei;
                    C.parseFont(this._data, new te(e));
                    var R = this._url.split(".fnt")[0].split("/"),
                        b = R[R.length - 1];
                    Ue.registerBitmapFont(b, C), this._data = C, this.complete(this._data)
                } else if (i === si.PREFAB) {
                    var S = new ti;
                    S.json = e, this.complete(S)
                } else this.complete(e)
            }
            parsePLFData(t) {
                var e, i, s;
                for (e in t) switch (s = t[e], e) {
                    case "json":
                    case "text":
                        for (i in s) si.preLoadedMap[P.formatURL(i)] = s[i];
                        break;
                    default:
                        for (i in s) si.preLoadedMap[P.formatURL(i)] = s[i]
                }
            }
            parsePLFBData(t) {
                var e, i, s;
                for (e = new F(t), s = e.getInt32(), i = 0; i < s; i++) this.parseOnePLFBFile(e)
            }
            parseOnePLFBFile(t) {
                var e, i, s;
                i = t.getUTFString(), e = t.getInt32(), s = t.readArrayBuffer(e), si.preLoadedMap[P.formatURL(i)] = s
            }
            complete(t) {
                this._data = t, this._customParse ? this.event(Jt.LOADED, t instanceof Array ? [t] : t) : (si._loaders.push(this), si._isWorking || si.checkNext())
            }
            static checkNext() {
                si._isWorking = !0;
                for (var t = ae.now(); si._startIndex < si._loaders.length;)
                    if (si._loaders[si._startIndex].endLoad(), si._startIndex++, ae.now() - t > si.maxTimeOut) return console.warn("loader callback cost a long time:" + (ae.now() - t) + " url=" + si._loaders[si._startIndex - 1].url), void s.systemTimer.frameOnce(1, null, si.checkNext);
                si._loaders.length = 0, si._startIndex = 0, si._isWorking = !1
            }
            endLoad(t = null) {
                t && (this._data = t), this._cache && si.cacheRes(this._url, this._data), this.event(Jt.PROGRESS, 1), this.event(Jt.COMPLETE, this.data instanceof Array ? [this.data] : this.data)
            }
            get url() {
                return this._url
            }
            get type() {
                return this._type
            }
            get cache() {
                return this._cache
            }
            get data() {
                return this._data
            }
            static clearRes(t) {
                t = P.formatURL(t);
                var e = si.getAtlas(t);
                if (e) {
                    for (var i = 0, s = e.length; i < s; i++) {
                        var r = e[i],
                            a = si.getRes(r);
                        delete si.textureMap[r], a && a.destroy()
                    }
                    e.length = 0, delete si.atlasMap[t]
                }
                var n = si.textureMap[t];
                n && (n.destroy(), delete si.textureMap[t]);
                var h = si.loadedMap[t];
                h && delete si.loadedMap[t]
            }
            static clearTextureRes(t) {
                t = P.formatURL(t);
                var e = si.getAtlas(t);
                if (e && e.length > 0) e.forEach(function(t) {
                    var e = si.getRes(t);
                    e instanceof te && e.disposeBitmap()
                });
                else {
                    var i = si.getRes(t);
                    i instanceof te && i.disposeBitmap()
                }
            }
            static getRes(t) {
                var e = si.textureMap[P.formatURL(t)];
                return e || si.loadedMap[P.formatURL(t)]
            }
            static getAtlas(t) {
                return si.atlasMap[P.formatURL(t)]
            }
            static cacheRes(t, e) {
                t = P.formatURL(t), null != si.loadedMap[t] ? console.warn("Resources already exist,is repeated loading:", t) : e instanceof te ? (si.loadedMap[t] = e.bitmap, si.textureMap[t] = e) : si.loadedMap[t] = e
            }
            static cacheResForce(t, e) {
                si.loadedMap[t] = e
            }
            static cacheTexture(t, e) {
                t = P.formatURL(t), null != si.textureMap[t] ? console.warn("Resources already exist,is repeated loading:", t) : si.textureMap[t] = e
            }
            static setGroup(t, e) {
                si.groupMap[e] || (si.groupMap[e] = []), si.groupMap[e].push(t)
            }
            static clearResByGroup(t) {
                if (si.groupMap[t]) {
                    var e, i = si.groupMap[t],
                        s = i.length;
                    for (e = 0; e < s; e++) si.clearRes(i[e]);
                    i.length = 0
                }
            }
        }
        si.TEXT = "text", si.JSON = "json", si.PREFAB = "prefab", si.XML = "xml", si.BUFFER = "arraybuffer", si.IMAGE = "image", si.SOUND = "sound", si.ATLAS = "atlas", si.FONT = "font", si.TTF = "ttf", si.PLF = "plf", si.PLFB = "plfb", si.HIERARCHY = "HIERARCHY", si.MESH = "MESH", si.MATERIAL = "MATERIAL", si.TEXTURE2D = "TEXTURE2D", si.TEXTURECUBE = "TEXTURECUBE", si.ANIMATIONCLIP = "ANIMATIONCLIP", si.AVATAR = "AVATAR", si.TERRAINHEIGHTDATA = "TERRAINHEIGHTDATA", si.TERRAINRES = "TERRAIN", si.typeMap = {
            ttf: "ttf",
            png: "image",
            jpg: "image",
            jpeg: "image",
            ktx: "image",
            pvr: "image",
            txt: "text",
            json: "json",
            prefab: "prefab",
            xml: "xml",
            als: "atlas",
            atlas: "atlas",
            mp3: "sound",
            ogg: "sound",
            wav: "sound",
            part: "json",
            fnt: "font",
            plf: "plf",
            plfb: "plfb",
            scene: "json",
            ani: "json",
            sk: "arraybuffer",
            wasm: "arraybuffer"
        }, si.parserMap = {}, si.maxTimeOut = 100, si.groupMap = {}, si.loadedMap = {}, si.atlasMap = {}, si.textureMap = {}, si.preLoadedMap = {}, si._imgCache = {}, si._loaders = [], si._isWorking = !1, si._startIndex = 0;
        class ri {
            static enable(t, e = null) {
                s.loader.load(t, w.create(null, ri._onInfoLoaded, [e]), null, si.JSON)
            }
            static _onInfoLoaded(t, e) {
                var i, s, r, a, n;
                for (i in e)
                    for (r = e[i], s = r[0], r = r[1], n = r.length, a = 0; a < n; a++) ri._fileLoadDic[s + r[a]] = i;
                t && t.run()
            }
            static getFileLoadPath(t) {
                return ri._fileLoadDic[t] || t
            }
        }
        ri._fileLoadDic = {};
        class ai extends M {
            constructor() {
                super(), this.retryNum = 1, this.retryDelay = 0, this.maxLoader = 5, this._loaders = [], this._loaderCount = 0, this._resInfos = [], this._infoPool = [], this._maxPriority = 5, this._failRes = {}, this._statInfo = {
                    count: 1,
                    loaded: 1
                };
                for (var t = 0; t < this._maxPriority; t++) this._resInfos[t] = []
            }
            getProgress() {
                return this._statInfo.loaded / this._statInfo.count
            }
            resetProgress() {
                this._statInfo.count = this._statInfo.loaded = 1
            }
            create(t, e = null, i = null, s = null, r = null, a = null, n = 1, h = !0) {
                this._create(t, !0, e, i, s, r, a, n, h)
            }
            _create(t, e, i = null, s = null, r = null, a = null, n = null, h = 1, o = !0) {
                if (t instanceof Array) {
                    var l = !0,
                        _ = t,
                        u = _.length,
                        c = 0;
                    if (s) var d = w.create(s.caller, s ? s.method : null, s.args, !1);
                    for (var p = 0; p < u; p++) {
                        var f = _[p];
                        "string" == typeof f && (f = _[p] = {
                            url: f
                        }), f.progress = 0
                    }
                    for (p = 0; p < u; p++) {
                        f = _[p];
                        var m = s ? w.create(null, function(t, e) {
                                t.progress = e;
                                for (var i = 0, s = 0; s < u; s++) {
                                    var r = _[s];
                                    i += r.progress
                                }
                                var a = i / u;
                                d.runWith(a)
                            }, [f], !1) : null,
                            g = s || i ? w.create(null, function(t, e = null) {
                                c++, t.progress = 1, e || (l = !1), c === u && i && i.runWith(l)
                            }, [f]) : null;
                        this._createOne(f.url, e, g, m, f.type || r, f.constructParams || a, f.propertyParams || n, f.priority || h, o)
                    }
                } else this._createOne(t, e, i, s, r, a, n, h, o)
            }
            _createOne(t, e, i = null, r = null, a = null, n = null, h = null, o = 1, l = !0) {
                var _ = this.getRes(t);
                if (_) !e && _ instanceof D && _._addReference(), r && r.runWith(1), i && i.runWith(_);
                else {
                    var u = ai.createMap[tt.getFilecompatibleExtension(t)] ? tt.getFilecompatibleExtension(t) : tt.getFileExtension(t);
                    if (a || (a = ai.createMap[u] ? ai.createMap[u][0] : null), !a) return void this.load(t, i, r, a, o, l);
                    var c = si.parserMap;
                    if (!c[a]) return void this.load(t, i, r, a, o, l);
                    this._createLoad(t, w.create(null, function(r) {
                        r && (!e && r instanceof D && r._addReference(), r._setCreateURL(t)), i && i.runWith(r), s.loader.event(t)
                    }), r, a, n, h, o, l, !0)
                }
            }
            load(t, e = null, i = null, r = null, a = 1, n = !0, h = null, o = !1, l = s.WorkerLoader.enable) {
                if (t instanceof Array) return this._loadAssets(t, e, i, r, a, n, h);
                var _;
                if (r || (r = 0 === t.indexOf("data:image") ? si.IMAGE : si.getTypeFromUrl(t)), r === si.IMAGE ? (_ = si.textureMap[P.formatURL(t)], _ && (!_.bitmap || _.bitmap && _.bitmap.destroyed) && (_ = null)) : _ = si.loadedMap[P.formatURL(t)], o || null == _) {
                    var u;
                    u = t, t = ri.getFileLoadPath(t), t != u && "nativeimage" !== r ? r = si.ATLAS : u = null;
                    var c = ai._resMap[t];
                    c ? (e && (u ? e && c._createListener(Jt.COMPLETE, this, this._resInfoLoaded, [u, e], !1, !1) : e && c._createListener(Jt.COMPLETE, e.caller, e.method, e.args, !1, !1)), i && c._createListener(Jt.PROGRESS, i.caller, i.method, i.args, !1, !1)) : (c = this._infoPool.length ? this._infoPool.pop() : new ni, c.url = t, c.type = r, c.cache = n, c.group = h, c.ignoreCache = o, c.useWorkerLoader = l, c.originalUrl = u, e && c.on(Jt.COMPLETE, e.caller, e.method, e.args), i && c.on(Jt.PROGRESS, i.caller, i.method, i.args), ai._resMap[t] = c, a = a < this._maxPriority ? a : this._maxPriority - 1, this._resInfos[a].push(c), this._statInfo.count++, this.event(Jt.PROGRESS, this.getProgress()), this._next())
                } else s.systemTimer.callLater(this, function() {
                    i && i.runWith(1), e && e.runWith(_ instanceof Array ? [_] : _), this._loaderCount || this.event(Jt.COMPLETE)
                });
                return this
            }
            _resInfoLoaded(t, e) {
                e.runWith(si.getRes(t))
            }
            _createLoad(t, e = null, i = null, r = null, a = null, n = null, h = 1, o = !0, l = !1) {
                if (t instanceof Array) return this._loadAssets(t, e, i, r, h, o);
                var _ = si.getRes(t);
                if (null != _) s.systemTimer.frameOnce(1, this, function() {
                    i && i.runWith(1), e && e.runWith(_), this._loaderCount || this.event(Jt.COMPLETE)
                });
                else {
                    var u = ai._resMap[t];
                    u ? (e && u._createListener(Jt.COMPLETE, e.caller, e.method, e.args, !1, !1), i && u._createListener(Jt.PROGRESS, i.caller, i.method, i.args, !1, !1)) : (u = this._infoPool.length ? this._infoPool.pop() : new ni, u.url = t, u.type = r, u.cache = !1, u.ignoreCache = l, u.originalUrl = null, u.group = null, u.createCache = o, u.createConstructParams = a, u.createPropertyParams = n, e && u.on(Jt.COMPLETE, e.caller, e.method, e.args), i && u.on(Jt.PROGRESS, i.caller, i.method, i.args), ai._resMap[t] = u, h = h < this._maxPriority ? h : this._maxPriority - 1, this._resInfos[h].push(u), this._statInfo.count++, this.event(Jt.PROGRESS, this.getProgress()), this._next())
                }
                return this
            }
            _next() {
                if (!(this._loaderCount >= this.maxLoader)) {
                    for (var t = 0; t < this._maxPriority; t++)
                        for (var e = this._resInfos[t]; e.length > 0;) {
                            var i = e.shift();
                            if (i) return this._doLoad(i)
                        }
                    this._loaderCount || this.event(Jt.COMPLETE)
                }
            }
            _doLoad(t) {
                function e(e = null) {
                    i.offAll(), i._data = null, i._customParse = !1, s._loaders.push(i), s._endLoad(t, e instanceof Array ? [e] : e), s._loaderCount--, s._next()
                }
                this._loaderCount++;
                var i = this._loaders.length ? this._loaders.pop() : new si;
                i.on(Jt.COMPLETE, null, e), i.on(Jt.PROGRESS, null, function(e) {
                    t.event(Jt.PROGRESS, e)
                }), i.on(Jt.ERROR, null, function(t) {
                    e(null)
                });
                var s = this;
                i._constructParams = t.createConstructParams, i._propertyParams = t.createPropertyParams, i._createCache = t.createCache, i.load(t.url, t.type, t.cache, t.group, t.ignoreCache, t.useWorkerLoader)
            }
            _endLoad(t, e) {
                var i = t.url;
                if (null == e) {
                    var r = this._failRes[i] || 0;
                    if (r < this.retryNum) return console.warn("[warn]Retry to load:", i), this._failRes[i] = r + 1, void s.systemTimer.once(this.retryDelay, this, this._addReTry, [t], !1);
                    si.clearRes(i), console.warn("[error]Failed to load:", i), this.event(Jt.ERROR, i)
                }
                this._failRes[i] && (this._failRes[i] = 0), delete ai._resMap[i], t.originalUrl && (e = si.getRes(t.originalUrl)), t.event(Jt.COMPLETE, e), t.offAll(), this._infoPool.push(t), this._statInfo.loaded++, this.event(Jt.PROGRESS, this.getProgress())
            }
            _addReTry(t) {
                this._resInfos[this._maxPriority - 1].push(t), this._next()
            }
            clearRes(t) {
                si.clearRes(t)
            }
            clearTextureRes(t) {
                si.clearTextureRes(t)
            }
            getRes(t) {
                return si.getRes(t)
            }
            cacheRes(t, e) {
                si.cacheRes(t, e)
            }
            setGroup(t, e) {
                si.setGroup(t, e)
            }
            clearResByGroup(t) {
                si.clearResByGroup(t)
            }
            static cacheRes(t, e) {
                si.cacheRes(t, e)
            }
            clearUnLoaded() {
                for (var t = 0; t < this._maxPriority; t++) {
                    for (var e = this._resInfos[t], i = e.length - 1; i > -1; i--) {
                        var s = e[i];
                        s && (s.offAll(), this._infoPool.push(s))
                    }
                    e.length = 0
                }
                this._loaderCount = 0, ai._resMap = {}
            }
            cancelLoadByUrls(t) {
                if (t)
                    for (var e = 0, i = t.length; e < i; e++) this.cancelLoadByUrl(t[e])
            }
            cancelLoadByUrl(t) {
                for (var e = 0; e < this._maxPriority; e++)
                    for (var i = this._resInfos[e], s = i.length - 1; s > -1; s--) {
                        var r = i[s];
                        r && r.url === t && (i[s] = null, r.offAll(), this._infoPool.push(r))
                    }
                ai._resMap[t] && delete ai._resMap[t]
            }
            _loadAssets(t, e = null, i = null, s = null, r = 1, a = !0, n = null) {
                function h(t, i = null) {
                    _++, t.progress = 1, i || (d = !1), _ === l && e && e.runWith(d)
                }

                function o(t, e) {
                    if (null != i) {
                        t.progress = e;
                        for (var s = 0, r = 0; r < c.length; r++) {
                            var a = c[r];
                            if (a) {
                                let t = null == a.progress ? 0 : a.progress;
                                s += null == a.size ? 0 : a.size * t
                            }
                        }
                        var n = s / u;
                        i.runWith(n)
                    }
                }
                for (var l = t.length, _ = 0, u = 0, c = [], d = !0, p = 0; p < l; p++) {
                    let l, _ = t[p];
                    l = "string" == typeof _ ? {
                        url: _,
                        type: s,
                        size: 1,
                        priority: r
                    } : _, l.size || (l.size = 1), l.progress = 0, u += l.size, c.push(l);
                    var f = i ? w.create(null, o, [l], !1) : null,
                        m = e || i ? w.create(null, h, [l]) : null;
                    this.load(l.url, m, f, l.type, l.priority || 1, a, l.group || n, !1, l.useWorkerLoader)
                }
                return this
            }
            decodeBitmaps(t) {
                var e, i, r = t.length;
                for (i = s.Render._context, e = 0; e < r; e++) {
                    var a, n;
                    if (a = si.getAtlas(t[e]), a) this._decodeTexture(a[0], i);
                    else n = this.getRes(t[e]), n && n instanceof te && this._decodeTexture(n, i)
                }
            }
            _decodeTexture(t, e) {
                var i = t.bitmap;
                if (t && i) {
                    var s = i.source || i.image;
                    if (s && s instanceof HTMLImageElement) {
                        e.drawImage(s, 0, 0, 1, 1);
                        e.getImageData(0, 0, 1, 1)
                    }
                }
            }
        }
        ai._resMap = {}, ai.createMap = {
            atlas: [null, si.ATLAS]
        };
        class ni extends M {}
        class hi {
            static __init__() {
                return hi._baseClass || (hi._baseClass = oi, oi.init()), hi.items = hi._baseClass.items, hi.support = hi._baseClass.support, hi.support
            }
            static setItem(t, e) {
                hi._baseClass.setItem(t, e)
            }
            static getItem(t) {
                return hi._baseClass.getItem(t)
            }
            static setJSON(t, e) {
                hi._baseClass.setJSON(t, e)
            }
            static getJSON(t) {
                return hi._baseClass.getJSON(t)
            }
            static removeItem(t) {
                hi._baseClass.removeItem(t)
            }
            static clear() {
                hi._baseClass.clear()
            }
        }
        hi.support = !1;
        class oi {
            static init() {
                try {
                    oi.support = !0, oi.items = window.localStorage, oi.setItem("laya", "1"), oi.removeItem("laya")
                } catch (t) {
                    oi.support = !1
                }
                oi.support || console.log("LocalStorage is not supprot or browser is private mode.")
            }
            static setItem(t, e) {
                try {
                    oi.support && oi.items.setItem(t, e)
                } catch (t) {
                    console.warn("set localStorage failed", t)
                }
            }
            static getItem(t) {
                return oi.support ? oi.items.getItem(t) : null
            }
            static setJSON(t, e) {
                try {
                    oi.support && oi.items.setItem(t, JSON.stringify(e))
                } catch (t) {
                    console.warn("set localStorage failed", t)
                }
            }
            static getJSON(t) {
                try {
                    let e = JSON.parse(oi.support ? oi.items.getItem(t) : null);
                    return e
                } catch (e) {
                    return oi.items.getItem(t)
                }
            }
            static removeItem(t) {
                oi.support && oi.items.removeItem(t)
            }
            static clear() {
                oi.support && oi.items.clear()
            }
        }
        oi.support = !1;
        class li {
            load(t) {
                this._url = t;
                var e = t.toLowerCase().split(".ttf")[0].split("/");
                this.fontName = e[e.length - 1], s.Render.isConchApp ? this._loadConch() : window.FontFace ? this._loadWithFontFace() : this._loadWithCSS()
            }
            _loadConch() {
                this._http = new ii, this._http.on(Jt.ERROR, this, this._onErr), this._http.on(Jt.COMPLETE, this, this._onHttpLoaded), this._http.send(this._url, null, "get", si.BUFFER)
            }
            _onHttpLoaded(t = null) {
                window.conchTextCanvas.setFontFaceFromBuffer(this.fontName, t), this._clearHttp(), this._complete()
            }
            _clearHttp() {
                this._http && (this._http.off(Jt.ERROR, this, this._onErr), this._http.off(Jt.COMPLETE, this, this._onHttpLoaded), this._http = null)
            }
            _onErr() {
                this._clearHttp(), this.err && (this.err.runWith("fail:" + this._url), this.err = null)
            }
            _complete() {
                s.systemTimer.clear(this, this._complete), s.systemTimer.clear(this, this._checkComplete), this._div && this._div.parentNode && (this._div.parentNode.removeChild(this._div), this._div = null), this.complete && (this.complete.runWith(this), this.complete = null)
            }
            _checkComplete() {
                s.Browser.measureText(li._testString, this._fontTxt).width != this._txtWidth && this._complete()
            }
            _loadWithFontFace() {
                var t = new window.FontFace(this.fontName, "url('" + this._url + "')");
                document.fonts.add(t);
                var e = this;
                t.loaded.then(function() {
                    e._complete()
                }), t.load()
            }
            _createDiv() {
                this._div = ae.createElement("div"), this._div.innerHTML = "laya";
                var t = this._div.style;
                t.fontFamily = this.fontName, t.position = "absolute", t.left = "-100px", t.top = "-100px", document.body.appendChild(this._div)
            }
            _loadWithCSS() {
                var t = ae.createElement("style");
                t.type = "text/css", document.body.appendChild(t), t.textContent = "@font-face { font-family:'" + this.fontName + "'; src:url('" + this._url + "');}", this._fontTxt = "40px " + this.fontName, this._txtWidth = ae.measureText(li._testString, this._fontTxt).width;
                var e = this;
                t.onload = function() {
                    s.systemTimer.once(1e4, e, e._complete)
                }, s.systemTimer.loop(20, this, this._checkComplete), this._createDiv()
            }
        }
        li._testString = "LayaTTFFont";
        class _i {
            static linearNone(t, e, i, s) {
                return i * t / s + e
            }
            static linearIn(t, e, i, s) {
                return i * t / s + e
            }
            static linearInOut(t, e, i, s) {
                return i * t / s + e
            }
            static linearOut(t, e, i, s) {
                return i * t / s + e
            }
            static bounceIn(t, e, i, s) {
                return i - _i.bounceOut(s - t, 0, i, s) + e
            }
            static bounceInOut(t, e, i, s) {
                return t < .5 * s ? .5 * _i.bounceIn(2 * t, 0, i, s) + e : .5 * _i.bounceOut(2 * t - s, 0, i, s) + .5 * i + e
            }
            static bounceOut(t, e, i, s) {
                return (t /= s) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
            }
            static backIn(t, e, i, s, r = 1.70158) {
                return i * (t /= s) * t * ((r + 1) * t - r) + e
            }
            static backInOut(t, e, i, s, r = 1.70158) {
                return (t /= .5 * s) < 1 ? .5 * i * (t * t * ((1 + (r *= 1.525)) * t - r)) + e : i / 2 * ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) + e
            }
            static backOut(t, e, i, s, r = 1.70158) {
                return i * ((t = t / s - 1) * t * ((r + 1) * t + r) + 1) + e
            }
            static elasticIn(t, e, i, s, r = 0, a = 0) {
                var n;
                return 0 == t ? e : 1 == (t /= s) ? e + i : (a || (a = .3 * s), !r || i > 0 && r < i || i < 0 && r < -i ? (r = i, n = a / 4) : n = a / _i.PI2 * Math.asin(i / r), -r * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * s - n) * _i.PI2 / a) + e)
            }
            static elasticInOut(t, e, i, s, r = 0, a = 0) {
                var n;
                return 0 == t ? e : 2 == (t /= .5 * s) ? e + i : (a || (a = s * (.3 * 1.5)), !r || i > 0 && r < i || i < 0 && r < -i ? (r = i, n = a / 4) : n = a / _i.PI2 * Math.asin(i / r), t < 1 ? r * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * s - n) * _i.PI2 / a) * -.5 + e : r * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * s - n) * _i.PI2 / a) * .5 + i + e)
            }
            static elasticOut(t, e, i, s, r = 0, a = 0) {
                var n;
                return 0 == t ? e : 1 == (t /= s) ? e + i : (a || (a = .3 * s), !r || i > 0 && r < i || i < 0 && r < -i ? (r = i, n = a / 4) : n = a / _i.PI2 * Math.asin(i / r), r * Math.pow(2, -10 * t) * Math.sin((t * s - n) * _i.PI2 / a) + i + e)
            }
            static strongIn(t, e, i, s) {
                return i * (t /= s) * t * t * t * t + e
            }
            static strongInOut(t, e, i, s) {
                return (t /= .5 * s) < 1 ? .5 * i * t * t * t * t * t + e : .5 * i * ((t -= 2) * t * t * t * t + 2) + e
            }
            static strongOut(t, e, i, s) {
                return i * ((t = t / s - 1) * t * t * t * t + 1) + e
            }
            static sineInOut(t, e, i, s) {
                return .5 * -i * (Math.cos(Math.PI * t / s) - 1) + e
            }
            static sineIn(t, e, i, s) {
                return -i * Math.cos(t / s * _i.HALF_PI) + i + e
            }
            static sineOut(t, e, i, s) {
                return i * Math.sin(t / s * _i.HALF_PI) + e
            }
            static quintIn(t, e, i, s) {
                return i * (t /= s) * t * t * t * t + e
            }
            static quintInOut(t, e, i, s) {
                return (t /= .5 * s) < 1 ? .5 * i * t * t * t * t * t + e : .5 * i * ((t -= 2) * t * t * t * t + 2) + e
            }
            static quintOut(t, e, i, s) {
                return i * ((t = t / s - 1) * t * t * t * t + 1) + e
            }
            static quartIn(t, e, i, s) {
                return i * (t /= s) * t * t * t + e
            }
            static quartInOut(t, e, i, s) {
                return (t /= .5 * s) < 1 ? .5 * i * t * t * t * t + e : .5 * -i * ((t -= 2) * t * t * t - 2) + e
            }
            static quartOut(t, e, i, s) {
                return -i * ((t = t / s - 1) * t * t * t - 1) + e
            }
            static cubicIn(t, e, i, s) {
                return i * (t /= s) * t * t + e
            }
            static cubicInOut(t, e, i, s) {
                return (t /= .5 * s) < 1 ? .5 * i * t * t * t + e : .5 * i * ((t -= 2) * t * t + 2) + e
            }
            static cubicOut(t, e, i, s) {
                return i * ((t = t / s - 1) * t * t + 1) + e
            }
            static quadIn(t, e, i, s) {
                return i * (t /= s) * t + e
            }
            static quadInOut(t, e, i, s) {
                return (t /= .5 * s) < 1 ? .5 * i * t * t + e : .5 * -i * (--t * (t - 2) - 1) + e
            }
            static quadOut(t, e, i, s) {
                return -i * (t /= s) * (t - 2) + e
            }
            static expoIn(t, e, i, s) {
                return 0 == t ? e : i * Math.pow(2, 10 * (t / s - 1)) + e - .001 * i
            }
            static expoInOut(t, e, i, s) {
                return 0 == t ? e : t == s ? e + i : (t /= .5 * s) < 1 ? .5 * i * Math.pow(2, 10 * (t - 1)) + e : .5 * i * (2 - Math.pow(2, -10 * --t)) + e
            }
            static expoOut(t, e, i, s) {
                return t == s ? e + i : i * (1 - Math.pow(2, -10 * t / s)) + e
            }
            static circIn(t, e, i, s) {
                return -i * (Math.sqrt(1 - (t /= s) * t) - 1) + e
            }
            static circInOut(t, e, i, s) {
                return (t /= .5 * s) < 1 ? .5 * -i * (Math.sqrt(1 - t * t) - 1) + e : .5 * i * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
            }
            static circOut(t, e, i, s) {
                return i * Math.sqrt(1 - (t = t / s - 1) * t) + e
            }
        }
        _i.HALF_PI = .5 * Math.PI, _i.PI2 = 2 * Math.PI;
        class ui {
            constructor() {
                this.gid = 0, this.repeat = 1, this._count = 0
            }
            static to(t, e, i, s = null, r = null, a = 0, n = !1, h = !0) {
                return (new ui).to(t, e, i, s, r, a, n)
            }
            static from(t, e, i, s = null, r = null, a = 0, n = !1, h = !0) {
                return (new ui).from(t, e, i, s, r, a, n)
            }
            to(t, e, i, s = null, r = null, a = 0, n = !1) {
                return this._create(t, e, i, s, r, a, n, !0, !1, !0)
            }
            from(t, e, i, s = null, r = null, a = 0, n = !1) {
                return this._create(t, e, i, s, r, a, n, !1, !1, !0)
            }
            _create(t, e, i, r, a, n, h, o, l, _) {
                if (!t) throw new Error("Tween:target is null");
                this._target = t, this._duration = i, this._ease = r || e.ease || ui.easeNone, this._complete = a || e.complete, this._delay = n, this._props = [], this._usedTimer = 0, this._startTimer = s.timer.currTimer, this._usedPool = l, this._delayParam = null, this.update = e.update;
                var u = t.$_GID || (t.$_GID = tt.getGID());
                return ui.tweenMap[u] ? (h && ui.clearTween(t), ui.tweenMap[u].push(this)) : ui.tweenMap[u] = [this], _ ? n <= 0 ? this.firstStart(t, e, o) : (this._delayParam = [t, e, o], s.timer.once(n, this, this.firstStart, this._delayParam)) : this._initProps(t, e, o), this
            }
            firstStart(t, e, i) {
                this._delayParam = null, t.destroyed ? this.clear() : (this._initProps(t, e, i), this._beginLoop())
            }
            _initProps(t, e, i) {
                for (var s in e)
                    if ("number" == typeof t[s]) {
                        var r = i ? t[s] : e[s],
                            a = i ? e[s] : t[s];
                        this._props.push([s, r, a - r]), i || (t[s] = r)
                    }
            }
            _beginLoop() {
                s.timer.frameLoop(1, this, this._doEase)
            }
            _doEase() {
                this._updateEase(s.timer.currTimer)
            }
            _updateEase(t) {
                var e = this._target;
                if (e) {
                    if (e.destroyed) return ui.clearTween(e);
                    var i = this._usedTimer = t - this._startTimer - this._delay;
                    if (!(i < 0)) {
                        if (i >= this._duration) return this.complete();
                        for (var s = i > 0 ? this._ease(i, 0, 1, this._duration) : 0, r = this._props, a = 0, n = r.length; a < n; a++) {
                            var h = r[a];
                            e[h[0]] = h[1] + s * h[2]
                        }
                        this.update && this.update.runWith([this, s])
                    }
                }
            }
            set progress(t) {
                var e = t * this._duration;
                this._startTimer = s.timer.currTimer - this._delay - e
            }
            complete() {
                if (this._target) {
                    s.timer.runTimer(this, this.firstStart);
                    for (var t = this._target, e = this._props, i = this._complete, r = 0, a = e.length; r < a; r++) {
                        var n = e[r];
                        t[n[0]] = n[1] + n[2]
                    }
                    this.update && this.update.runWith(this), this._count++, 0 != this.repeat && this._count >= this.repeat ? (this.clear(), i && i.run()) : this.restart()
                }
            }
            pause() {
                s.timer.clear(this, this._beginLoop), s.timer.clear(this, this._doEase), s.timer.clear(this, this.firstStart);
                var t, e = s.timer.currTimer;
                t = e - this._startTimer - this._delay, t < 0 && (this._usedTimer = t)
            }
            setStartTime(t) {
                this._startTimer = t
            }
            static pauseAll(t) {
                if (t && t.$_GID) {
                    var e = ui.tweenMap[t.$_GID];
                    if (e)
                        for (var i = 0, s = e.length; i < s; i++) e[i].pause()
                }
            }
            static resumeAll(t) {
                if (t && t.$_GID) {
                    var e = ui.tweenMap[t.$_GID];
                    if (e)
                        for (var i = 0, s = e.length; i < s; i++) e[i].resume()
                }
            }
            static clearAll(t) {
                if (t && t.$_GID) {
                    var e = ui.tweenMap[t.$_GID];
                    if (e) {
                        for (var i = 0, s = e.length; i < s; i++) e[i]._clear();
                        e.length = 0
                    }
                }
            }
            static clear(t) {
                t.clear()
            }
            static clearTween(t) {
                ui.clearAll(t)
            }
            clear() {
                this._target && (this._remove(), this._clear())
            }
            _clear() {
                this.pause(), s.timer.clear(this, this.firstStart), this._complete = null, this._target = null, this._ease = null, this._props = null, this._delayParam = null, this.repeat = 1, this._count = 0, this._usedPool && (this.update = null, r.recover("tween", this))
            }
            recover() {
                this._usedPool = !0, this._clear()
            }
            _remove() {
                var t = ui.tweenMap[this._target.$_GID];
                if (t)
                    for (var e = 0, i = t.length; e < i; e++)
                        if (t[e] === this) {
                            t.splice(e, 1);
                            break
                        }
            }
            restart() {
                if (this.pause(), this._usedTimer = 0, this._startTimer = s.timer.currTimer, this._delayParam) s.timer.once(this._delay, this, this.firstStart, this._delayParam);
                else {
                    for (var t = this._props, e = 0, i = t.length; e < i; e++) {
                        var r = t[e];
                        this._target[r[0]] = r[1]
                    }
                    s.timer.once(this._delay, this, this._beginLoop)
                }
            }
            resume() {
                if (this._usedTimer >= this._duration) return this.complete();
                this._startTimer = s.timer.currTimer - this._usedTimer - this._delay, this._delayParam ? this._usedTimer < 0 ? s.timer.once(-this._usedTimer, this, this.firstStart, this._delayParam) : this.firstStart.apply(this, this._delayParam) : this._beginLoop()
            }
            static easeNone(t, e, i, s) {
                return i * t / s + e
            }
        }
        ui.tweenMap = [];
        class ci {
            constructor() {
                this.ratio = .92, this.maxOffset = 60, this._dragging = !1, this._clickOnly = !0
            }
            start(t, e, i, r, a, n, h, o = .92) {
                this.clearTimer(), this.target = t, this.area = e, this.hasInertia = i, this.elasticDistance = e ? r : 0, this.elasticBackTime = a, this.data = n, this._disableMouseEvent = h, this.ratio = o, this._parent = t.parent, this._clickOnly = !0, this._dragging = !0, this._elasticRateX = this._elasticRateY = 1, this._lastX = this._parent.mouseX, this._lastY = this._parent.mouseY, s.stage.on(Jt.MOUSE_UP, this, this.onStageMouseUp), s.stage.on(Jt.MOUSE_OUT, this, this.onStageMouseUp), s.systemTimer.frameLoop(1, this, this.loop)
            }
            clearTimer() {
                s.systemTimer.clear(this, this.loop), s.systemTimer.clear(this, this.tweenMove), this._tween && (this._tween.recover(), this._tween = null)
            }
            stop() {
                this._dragging && (We.instance.disableMouseEvent = !1, s.stage.off(Jt.MOUSE_UP, this, this.onStageMouseUp), s.stage.off(Jt.MOUSE_OUT, this, this.onStageMouseUp), this._dragging = !1, this.target && this.area && this.backToArea(), this.clear())
            }
            loop() {
                var t = this._parent.getMousePoint(),
                    e = t.x,
                    i = t.y,
                    r = e - this._lastX,
                    a = i - this._lastY;
                if (this._clickOnly) {
                    if (!(Math.abs(r * s.stage._canvasTransform.getScaleX()) > 1 || Math.abs(a * s.stage._canvasTransform.getScaleY()) > 1)) return;
                    this._clickOnly = !1, this._offsets || (this._offsets = []), this._offsets.length = 0, this.target.event(Jt.DRAG_START, this.data), We.instance.disableMouseEvent = this._disableMouseEvent
                } else this._offsets.push(r, a);
                0 === r && 0 === a || (this._lastX = e, this._lastY = i, this.target.x += r * this._elasticRateX, this.target.y += a * this._elasticRateY, this.area && this.checkArea(), this.target.event(Jt.DRAG_MOVE, this.data))
            }
            checkArea() {
                if (this.elasticDistance <= 0) this.backToArea();
                else {
                    if (this.target._x < this.area.x) var t = this.area.x - this.target._x;
                    else t = this.target._x > this.area.x + this.area.width ? this.target._x - this.area.x - this.area.width : 0;
                    if (this._elasticRateX = Math.max(0, 1 - t / this.elasticDistance), this.target._y < this.area.y) var e = this.area.y - this.target.y;
                    else e = this.target._y > this.area.y + this.area.height ? this.target._y - this.area.y - this.area.height : 0;
                    this._elasticRateY = Math.max(0, 1 - e / this.elasticDistance)
                }
            }
            backToArea() {
                this.target.x = Math.min(Math.max(this.target._x, this.area.x), this.area.x + this.area.width), this.target.y = Math.min(Math.max(this.target._y, this.area.y), this.area.y + this.area.height)
            }
            onStageMouseUp(t) {
                if (We.instance.disableMouseEvent = !1, s.stage.off(Jt.MOUSE_UP, this, this.onStageMouseUp), s.stage.off(Jt.MOUSE_OUT, this, this.onStageMouseUp), s.systemTimer.clear(this, this.loop), !this._clickOnly && this.target)
                    if (this.hasInertia) {
                        this._offsets.length < 1 && this._offsets.push(this._parent.mouseX - this._lastX, this._parent.mouseY - this._lastY), this._offsetX = this._offsetY = 0;
                        for (var e = this._offsets.length, i = Math.min(e, 6), r = this._offsets.length - i, a = e - 1; a > r; a--) this._offsetY += this._offsets[a--], this._offsetX += this._offsets[a];
                        this._offsetX = this._offsetX / i * 2, this._offsetY = this._offsetY / i * 2, Math.abs(this._offsetX) > this.maxOffset && (this._offsetX = this._offsetX > 0 ? this.maxOffset : -this.maxOffset), Math.abs(this._offsetY) > this.maxOffset && (this._offsetY = this._offsetY > 0 ? this.maxOffset : -this.maxOffset), s.systemTimer.frameLoop(1, this, this.tweenMove)
                    } else this.elasticDistance > 0 ? this.checkElastic() : this.clear()
            }
            checkElastic() {
                var t = NaN,
                    e = NaN;
                if (this.target.x < this.area.x ? t = this.area.x : this.target._x > this.area.x + this.area.width && (t = this.area.x + this.area.width), this.target.y < this.area.y ? e = this.area.y : this.target._y > this.area.y + this.area.height && (e = this.area.y + this.area.height), isNaN(t) && isNaN(e)) this.clear();
                else {
                    var i = {};
                    isNaN(t) || (i.x = t), isNaN(e) || (i.y = e), this._tween = ui.to(this.target, i, this.elasticBackTime, _i.sineOut, w.create(this, this.clear), 0, !1, !1)
                }
            }
            tweenMove() {
                this._offsetX *= this.ratio * this._elasticRateX, this._offsetY *= this.ratio * this._elasticRateY, this.target.x += this._offsetX, this.target.y += this._offsetY, this.area && this.checkArea(), this.target.event(Jt.DRAG_MOVE, this.data), (Math.abs(this._offsetX) < 1 && Math.abs(this._offsetY) < 1 || this._elasticRateX < .5 || this._elasticRateY < .5) && (s.systemTimer.clear(this, this.tweenMove), this.elasticDistance > 0 ? this.checkElastic() : this.clear())
            }
            clear() {
                if (this.target) {
                    this.clearTimer();
                    var t = this.target;
                    this.target = null, this._parent = null, t.event(Jt.DRAG_END, this.data)
                }
            }
        }
        class di {
            constructor() {
                this._id = tt.getGID(), this._resetComp()
            }
            get id() {
                return this._id
            }
            get enabled() {
                return this._enabled
            }
            set enabled(t) {
                this._enabled != t && (this._enabled = t, this.owner && (t ? this.owner.activeInHierarchy && this._onEnable() : this.owner.activeInHierarchy && this._onDisable()))
            }
            get isSingleton() {
                return !0
            }
            get destroyed() {
                return this._destroyed
            }
            _isScript() {
                return !1
            }
            _resetComp() {
                this._indexInList = -1, this._enabled = !0, this._awaked = !1, this.owner = null
            }
            _getIndexInList() {
                return this._indexInList
            }
            _setIndexInList(t) {
                this._indexInList = t
            }
            _onAdded() {}
            _onAwake() {}
            _onEnable() {}
            _onDisable() {}
            _onDestroy() {}
            onReset() {}
            _parse(t, e = null) {}
            _parseInteractive(t = null, e = null) {}
            _cloneTo(t) {}
            _setActive(t) {
                t ? (this._awaked || (this._awaked = !0, this._onAwake()), this._enabled && this._onEnable()) : this._enabled && this._onDisable()
            }
            destroy() {
                this.owner && this.owner._destroyComponent(this)
            }
            _destroy() {
                this.owner.activeInHierarchy && this._enabled && this._setActive(!1), this._onDestroy(), this._destroyed = !0, this.onReset !== di.prototype.onReset ? (this.onReset(), this._resetComp(), r.recoverByClass(this)) : this._resetComp()
            }
        }
        class pi extends Oe {
            constructor() {
                super(), this.wrapMode = 0, this._interval = i.animationInterval, this._isReverse = !1, this._frameRateChanged = !1, this._setBitUp(be.DISPLAY)
            }
            play(t = 0, e = !0, i = "") {
                this._isPlaying = !0, this._actionName = i, this.index = "string" == typeof t ? this._getFrameByLabel(t) : t, this.loop = e, this._isReverse = this.wrapMode === pi.WRAP_REVERSE, 0 == this.index && this._isReverse && (this.index = this.count - 1), this.interval > 0 && this.timerLoop(this.interval, this, this._frameLoop, null, !0, !0)
            }
            get interval() {
                return this._interval
            }
            set interval(t) {
                this._interval != t && (this._frameRateChanged = !0, this._interval = t, this._isPlaying && t > 0 && this.timerLoop(t, this, this._frameLoop, null, !0, !0))
            }
            _getFrameByLabel(t) {
                for (var e = 0; e < this._count; e++) {
                    var i = this._labels[e];
                    if (i && i.indexOf(t) > -1) return e
                }
                return 0
            }
            _frameLoop() {
                if (this._controlNode && !this._controlNode.destroyed) {
                    if (this._isReverse) {
                        if (this._index--, this._index < 0) {
                            if (!this.loop) return this._index = 0, this.stop(), void this.event(Jt.COMPLETE);
                            this.wrapMode == pi.WRAP_PINGPONG ? (this._index = this._count > 0 ? 1 : 0, this._isReverse = !1) : this._index = this._count - 1, this.event(Jt.COMPLETE)
                        }
                    } else if (this._index++, this._index >= this._count) {
                        if (!this.loop) return this._index--, this.stop(), void this.event(Jt.COMPLETE);
                        this.wrapMode == pi.WRAP_PINGPONG ? (this._index = this._count - 2 >= 0 ? this._count - 2 : 0, this._isReverse = !0) : this._index = 0, this.event(Jt.COMPLETE)
                    }
                    this.index = this._index
                } else this.clearTimer(this, this._frameLoop)
            }
            _setControlNode(t) {
                this._controlNode && (this._controlNode.off(Jt.DISPLAY, this, this._resumePlay), this._controlNode.off(Jt.UNDISPLAY, this, this._resumePlay)), this._controlNode = t, t && t != this && (t.on(Jt.DISPLAY, this, this._resumePlay), t.on(Jt.UNDISPLAY, this, this._resumePlay))
            }
            _setDisplay(t) {
                super._setDisplay(t), this._resumePlay()
            }
            _resumePlay() {
                this._isPlaying && (this._controlNode.displayedInStage ? this.play(this._index, this.loop, this._actionName) : this.clearTimer(this, this._frameLoop))
            }
            stop() {
                this._isPlaying = !1, this.clearTimer(this, this._frameLoop)
            }
            get isPlaying() {
                return this._isPlaying
            }
            addLabel(t, e) {
                this._labels || (this._labels = {}), this._labels[e] || (this._labels[e] = []), this._labels[e].push(t)
            }
            removeLabel(t) {
                if (t) {
                    if (this._labels)
                        for (var e in this._labels) this._removeLabelFromList(this._labels[e], t)
                } else this._labels = null
            }
            _removeLabelFromList(t, e) {
                if (t)
                    for (var i = t.length - 1; i >= 0; i--) t[i] == e && t.splice(i, 1)
            }
            gotoAndStop(t) {
                this.index = "string" == typeof t ? this._getFrameByLabel(t) : t, this.stop()
            }
            get index() {
                return this._index
            }
            set index(t) {
                if (this._index = t, this._displayToIndex(t), this._labels && this._labels[t])
                    for (var e = this._labels[t], i = 0, s = e.length; i < s; i++) this.event(Jt.LABEL, e[i])
            }
            _displayToIndex(t) {}
            get count() {
                return this._count
            }
            clear() {
                return this.stop(), this._labels = null, this
            }
        }
        pi.WRAP_POSITIVE = 0, pi.WRAP_REVERSE = 1, pi.WRAP_PINGPONG = 2, Pe.regClass("laya.display.AnimationBase", pi), Pe.regClass("Laya.AnimationBase", pi);
        class fi {
            static subtractVector3(t, e, i) {
                i[0] = t[0] - e[0], i[1] = t[1] - e[1], i[2] = t[2] - e[2]
            }
            static lerp(t, e, i) {
                return t * (1 - i) + e * i
            }
            static scaleVector3(t, e, i) {
                i[0] = t[0] * e, i[1] = t[1] * e, i[2] = t[2] * e
            }
            static lerpVector3(t, e, i, s) {
                var r = t[0],
                    a = t[1],
                    n = t[2];
                s[0] = r + i * (e[0] - r), s[1] = a + i * (e[1] - a), s[2] = n + i * (e[2] - n)
            }
            static lerpVector4(t, e, i, s) {
                var r = t[0],
                    a = t[1],
                    n = t[2],
                    h = t[3];
                s[0] = r + i * (e[0] - r), s[1] = a + i * (e[1] - a), s[2] = n + i * (e[2] - n), s[3] = h + i * (e[3] - h)
            }
            static slerpQuaternionArray(t, e, i, s, r, a, n) {
                var h, o, l, _, u, c = t[e + 0],
                    d = t[e + 1],
                    p = t[e + 2],
                    f = t[e + 3],
                    m = i[s + 0],
                    g = i[s + 1],
                    T = i[s + 2],
                    v = i[s + 3];
                return o = c * m + d * g + p * T + f * v, o < 0 && (o = -o, m = -m, g = -g, T = -T, v = -v), 1 - o > 1e-6 ? (h = Math.acos(o), l = Math.sin(h), _ = Math.sin((1 - r) * h) / l, u = Math.sin(r * h) / l) : (_ = 1 - r, u = r), a[n + 0] = _ * c + u * m, a[n + 1] = _ * d + u * g, a[n + 2] = _ * p + u * T, a[n + 3] = _ * f + u * v, a
            }
            static getRotation(t, e, i, s) {
                return Math.atan2(s - e, i - t) / Math.PI * 180
            }
            static sortBigFirst(t, e) {
                return t == e ? 0 : e > t ? 1 : -1
            }
            static sortSmallFirst(t, e) {
                return t == e ? 0 : e > t ? -1 : 1
            }
            static sortNumBigFirst(t, e) {
                return parseFloat(e) - parseFloat(t)
            }
            static sortNumSmallFirst(t, e) {
                return parseFloat(t) - parseFloat(e)
            }
            static sortByKey(t, e = !1, i = !0) {
                var s;
                return s = e ? i ? fi.sortNumBigFirst : fi.sortBigFirst : i ? fi.sortNumSmallFirst : fi.sortSmallFirst,
                    function(e, i) {
                        return s(e[t], i[t])
                    }
            }
        }
        class mi extends pi {
            constructor() {
                super(), void 0 === mi._sortIndexFun && (mi._sortIndexFun = fi.sortByKey("index", !1, !0))
            }
            static _sortIndexFun(t, e) {
                return t.index - e.index
            }
            _setUp(t, e) {
                this._targetDic = t, this._animationData = e, this.interval = 1e3 / e.frameRate, e.parsed ? (this._count = e.count, this._labels = e.labels, this._usedFrames = e.animationNewFrames) : (this._usedFrames = [], this._calculateDatas(), e.parsed = !0, e.labels = this._labels, e.count = this._count, e.animationNewFrames = this._usedFrames)
            }
            clear() {
                return super.clear(), this._targetDic = null, this._animationData = null, this
            }
            _displayToIndex(t) {
                if (this._animationData) {
                    t < 0 && (t = 0), t > this._count && (t = this._count);
                    var e, i = this._animationData.nodes,
                        s = i.length;
                    for (e = 0; e < s; e++) this._displayNodeToFrame(i[e], t)
                }
            }
            _displayNodeToFrame(t, e, i = null) {
                i || (i = this._targetDic);
                var s = i[t.target];
                if (s) {
                    var r, a, n, h, o = t.frames,
                        l = t.keys,
                        _ = l.length;
                    for (h = 0; h < _; h++) r = l[h], a = o[r], n = a.length > e ? a[e] : a[a.length - 1], s[r] = n;
                    var u, c = t.funkeys;
                    if (_ = c.length, 0 != _)
                        for (h = 0; h < _; h++) r = c[h], u = o[r], void 0 !== u[e] && s[r] && s[r].apply(s, u[e])
                }
            }
            _calculateDatas() {
                if (this._animationData) {
                    var t, e, i = this._animationData.nodes,
                        s = i.length;
                    for (this._count = 0, t = 0; t < s; t++) e = i[t], this._calculateKeyFrames(e);
                    this._count += 1
                }
            }
            _calculateKeyFrames(t) {
                var e, i, s = t.keyframes,
                    r = t.target;
                for (e in t.frames || (t.frames = {}), t.keys ? t.keys.length = 0 : t.keys = [], t.funkeys ? t.funkeys.length = 0 : t.funkeys = [], t.initValues || (t.initValues = {}), s) {
                    var a = -1 != e.indexOf("()");
                    if (i = s[e], a && (e = e.substr(0, e.length - 2)), t.frames[e] || (t.frames[e] = []), a) {
                        t.funkeys.push(e);
                        for (var n = t.frames[e], h = 0; h < i.length; h++) {
                            var o = i[h];
                            n[o.index] = o.value, o.index > this._count && (this._count = o.index)
                        }
                    } else this._targetDic && this._targetDic[r] && (t.initValues[e] = this._targetDic[r][e]), i.sort(mi._sortIndexFun), t.keys.push(e), this._calculateNodePropFrames(i, t.frames[e], e, r)
                }
            }
            resetNodes() {
                if (this._targetDic && this._animationData) {
                    var t, e, i, s = this._animationData.nodes,
                        r = s.length;
                    for (t = 0; t < r; t++)
                        if (e = s[t], i = e.initValues, i) {
                            var a, n = this._targetDic[e.target];
                            if (n)
                                for (a in i) n[a] = i[a]
                        }
                }
            }
            _calculateNodePropFrames(t, e, i, s) {
                var r, a = t.length - 1;
                for (e.length = t[a].index + 1, r = 0; r < a; r++) this._dealKeyFrame(t[r]), this._calculateFrameValues(t[r], t[r + 1], e);
                0 == a && (e[0] = t[0].value, this._usedFrames && (this._usedFrames[t[0].index] = !0)), this._dealKeyFrame(t[r])
            }
            _dealKeyFrame(t) {
                t.label && "" != t.label && this.addLabel(t.label, t.index)
            }
            _calculateFrameValues(t, e, i) {
                var s, r, a = t.index,
                    n = e.index,
                    h = t.value,
                    o = e.value - t.value,
                    l = n - a,
                    _ = this._usedFrames;
                if (n > this._count && (this._count = n), t.tween)
                    for (r = _i[t.tweenMethod], null == r && (r = _i.linearNone), s = a; s < n; s++) i[s] = r(s - a, h, o, l), _ && (_[s] = !0);
                else
                    for (s = a; s < n; s++) i[s] = h;
                _ && (_[t.index] = !0, _[e.index] = !0), i[e.index] = e.value
            }
        }
        Pe.regClass("laya.display.FrameAnimation", mi), Pe.regClass("Laya.FrameAnimation", mi);
        class gi {
            constructor() {
                this._obj = {}, gi._maps.push(this)
            }
            static __init__() {
                gi.I = new gi, gi.supportWeakMap || s.systemTimer.loop(gi.delInterval, null, gi.clearCache)
            }
            static clearCache() {
                for (var t = 0, e = gi._maps.length; t < e; t++) {
                    var i = gi._maps[t];
                    i._obj = {}
                }
            }
            set(t, e) {
                null != t && (gi.supportWeakMap || ("string" == typeof t || "number" == typeof t ? this._obj[t] = e : (t.$_GID || (t.$_GID = tt.getGID()), this._obj[t.$_GID] = e)))
            }
            get(t) {
                return null == t ? null : gi.supportWeakMap ? void 0 : "string" == typeof t || "number" == typeof t ? this._obj[t] : this._obj[t.$_GID]
            }
            del(t) {
                null != t && (gi.supportWeakMap || ("string" == typeof t || "number" == typeof t ? delete this._obj[t] : delete this._obj[this._obj.$_GID]))
            }
            has(t) {
                return null != t && (!gi.supportWeakMap && ("string" == typeof t || "number" == typeof t ? null != this._obj[t] : null != this._obj[this._obj.$_GID]))
            }
        }
        gi.supportWeakMap = !1, gi.delInterval = 6e5, gi._maps = [];
        class Ti {
            static __init() {
                Ti._funMap = new gi
            }
            static getBindFun(t) {
                var e = Ti._funMap.get(t);
                if (null == e) {
                    var i = '"' + t + '"';
                    i = i.replace(/^"\${|}"$/g, "").replace(/\${/g, '"+').replace(/}/g, '+"');
                    var s = "(function(data){if(data==null)return;with(data){try{\nreturn " + i + "\n}catch(e){}}})";
                    e = window.Laya._runScript(s), Ti._funMap.set(t, e)
                }
                return e
            }
            static createByData(t, e) {
                var i = xi.create();
                if (t = Ti.createComp(e, t, t, null, i), t._setBit(be.NOT_READY, !0), "_idMap" in t && (t._idMap = i._idMap), e.animations) {
                    var s, r, a, n = [],
                        h = e.animations,
                        o = h.length;
                    for (s = 0; s < o; s++) {
                        switch (r = new mi, a = h[s], r._setUp(i._idMap, a), t[a.name] = r, r._setControlNode(t), a.action) {
                            case 1:
                                r.play(0, !1);
                                break;
                            case 2:
                                r.play(0, !0)
                        }
                        r.animationName = a.name, n.push(r)
                    }
                    t._aniList = n
                }
                return "Scene" === t._$componentType && t._width > 0 && null == e.props.hitTestPrior && !t.mouseThrough && (t.hitTestPrior = !0), i.beginLoad(t), t
            }
            static createInitTool() {
                return xi.create()
            }
            static createComp(t, e = null, i = null, r = null, a = null) {
                if ("Scene3D" == t.type || "Sprite3D" == t.type) {
                    var n = [],
                        h = s.Laya.Utils3D._createSceneByJsonForMaker(t, n, a);
                    return "Sprite3D" == t.type ? s.Laya.StaticBatchManager.combine(h, n) : s.Laya.StaticBatchManager.combine(null, n), h
                }
                if (e = e || Ti.getCompInstance(t), !e) return t.props && t.props.runtime ? console.warn("runtime not found:" + t.props.runtime) : console.warn("can not create:" + t.type), null;
                var o = t.child;
                if (o)
                    for (var l = "List" == e._$componentType, _ = 0, u = o.length; _ < u; _++) {
                        var c = o[_];
                        if ("itemRender" in e && ("render" == c.props.name || "render" === c.props.renderType)) e.itemRender = c;
                        else if ("Graphic" == c.type) s.ClassUtils._addGraphicsToSprite(c, e);
                        else if (s.ClassUtils._isDrawType(c.type)) s.ClassUtils._addGraphicToSprite(c, e, !0);
                        else {
                            if (l) {
                                var d = [],
                                    p = Ti.createComp(c, null, i, d, a);
                                d.length && (p._$bindData = d)
                            } else p = Ti.createComp(c, null, i, r, a);
                            "Script" == c.type ? p instanceof di ? e._addComponentInstance(p) : "owner" in p ? p.owner = e : "target" in p && (p.target = e) : "mask" == c.props.renderType || "mask" == c.props.name ? e.mask = p : p instanceof Fe && e.addChild(p)
                        }
                    }
                var f = t.props;
                for (var m in f) {
                    var g = f[m];
                    "string" == typeof g && (g.indexOf("@node:") >= 0 || g.indexOf("@Prefab:") >= 0) ? a && a.addNodeRef(e, m, g) : Ti.setCompValue(e, m, g, i, r)
                }
                return e._afterInited && e._afterInited(), t.compId && a && a._idMap && (a._idMap[t.compId] = e), e
            }
            static setCompValue(t, e, i, r = null, a = null) {
                if ("string" == typeof i && i.indexOf("${") > -1) {
                    if (Ti._sheet || (Ti._sheet = s.ClassUtils.getClass("laya.data.Table")), !Ti._sheet) return void console.warn("Can not find class Sheet");
                    if (a) a.push(t, e, i);
                    else if (r) {
                        -1 == i.indexOf("].") && (i = i.replace(".", "[0]."));
                        var n, h, o = new vi(t, e, i);
                        o.exe(r);
                        for (var l = i.replace(/\[.*?\]\./g, "."); null != (n = Ti._parseWatchData.exec(l));) {
                            for (var _ = n[1]; null != (h = Ti._parseKeyWord.exec(_));) {
                                var u = h[0],
                                    c = r._watchMap[u] || (r._watchMap[u] = []);
                                c.push(o), Ti._sheet.I.notifer.on(u, r, r.changeData, [u])
                            }
                            c = r._watchMap[_] || (r._watchMap[_] = []), c.push(o), Ti._sheet.I.notifer.on(_, r, r.changeData, [_])
                        }
                    }
                } else "var" === e && r ? r[i] = t : t[e] = "true" === i || "false" !== i && i
            }
            static getCompInstance(t) {
                if ("UIView" == t.type && t.props && t.props.pageData) return Ti.createByData(null, t.props.pageData);
                var e = t.props && t.props.runtime || t.type,
                    i = s.ClassUtils.getClass(e);
                if (!i) throw "Can not find class " + e;
                if ("Script" === t.type && i.prototype._doAwake) {
                    var a = r.createByClass(i);
                    return a._destroyed = !1, a
                }
                return t.props && "renderType" in t.props && "instance" == t.props.renderType ? (i.instance || (i.instance = new i), i.instance) : new i
            }
        }
        Ti._parseWatchData = /\${(.*?)}/g, Ti._parseKeyWord = /[a-zA-Z_][a-zA-Z0-9_]*(?:(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)/g;
        class vi {
            constructor(t, e, i) {
                this.comp = t, this.prop = e, this.value = i
            }
            exe(t) {
                var e = Ti.getBindFun(this.value);
                this.comp[this.prop] = e.call(this, t)
            }
        }
        class xi {
            reset() {
                this._nodeRefList = null, this._initList = null, this._idMap = null, this._loadList = null, this._scene = null
            }
            recover() {
                this.reset(), r.recover("InitTool", this)
            }
            static create() {
                var t = r.getItemByClass("InitTool", xi);
                return t._idMap = {}, t
            }
            addLoadRes(t, e = null) {
                this._loadList || (this._loadList = []), s.loader.getRes(t) || (e ? this._loadList.push({
                    url: t,
                    type: e
                }) : this._loadList.push(t))
            }
            addNodeRef(t, e, i) {
                this._nodeRefList || (this._nodeRefList = []), this._nodeRefList.push([t, e, i]), i.indexOf("@Prefab:") >= 0 && this.addLoadRes(i.replace("@Prefab:", ""), si.PREFAB)
            }
            setNodeRef() {
                if (this._nodeRefList)
                    if (this._idMap) {
                        var t, e, i;
                        for (e = this._nodeRefList.length, t = 0; t < e; t++) i = this._nodeRefList[t], i[0][i[1]] = this.getReferData(i[2]);
                        this._nodeRefList = null
                    } else this._nodeRefList = null
            }
            getReferData(t) {
                var e;
                if (t.indexOf("@Prefab:") >= 0) return e = si.getRes(t.replace("@Prefab:", "")), e;
                if (t.indexOf("@arr:") >= 0) {
                    var i, s, r, a;
                    for (t = t.replace("@arr:", ""), i = t.split(","), r = i.length, s = 0; s < r; s++) a = i[s], i[s] = a ? this._idMap[a.replace("@node:", "")] : null;
                    return i
                }
                return this._idMap[t.replace("@node:", "")]
            }
            addInitItem(t) {
                this._initList || (this._initList = []), this._initList.push(t)
            }
            doInits() {
                this._initList && (this._initList = null)
            }
            finish() {
                this.setNodeRef(), this.doInits(), this._scene._setBit(be.NOT_READY, !1), this._scene.parent && this._scene.parent.activeInHierarchy && this._scene.active && this._scene._processActive(), this._scene.event("onViewCreated"), this.recover()
            }
            beginLoad(t) {
                this._scene = t, !this._loadList || this._loadList.length < 1 ? this.finish() : s.loader.load(this._loadList, w.create(this, this.finish))
            }
        }
        class yi {
            show(t = 0, e = 0) {}
            enable() {}
            hide() {}
            set_onclick(t) {}
            isCanvasRender() {
                return !0
            }
            renderNotCanvas(t, e, i) {}
        }
        class Ei extends yi {
            constructor() {
                super(...arguments), this._show = !1, this._useCanvas = !1, this._height = 100, this._view = []
            }
            show(t = 0, e = 0) {
                ae._isMiniGame || s.Render.isConchApp || (this._useCanvas = !0), this._show = !0, z._fpsData.length = 60, this._view[0] = {
                    title: "FPS(WebGL)",
                    value: "_fpsStr",
                    color: "yellow",
                    units: "int"
                }, this._view[1] = {
                    title: "Sprite",
                    value: "_spriteStr",
                    color: "white",
                    units: "int"
                }, this._view[2] = {
                    title: "RenderBatches",
                    value: "renderBatches",
                    color: "white",
                    units: "int"
                }, this._view[3] = {
                    title: "SavedRenderBatches",
                    value: "savedRenderBatches",
                    color: "white",
                    units: "int"
                }, this._view[4] = {
                    title: "CPUMemory",
                    value: "cpuMemory",
                    color: "yellow",
                    units: "M"
                }, this._view[5] = {
                    title: "GPUMemory",
                    value: "gpuMemory",
                    color: "yellow",
                    units: "M"
                }, this._view[6] = {
                    title: "Shader",
                    value: "shaderCall",
                    color: "white",
                    units: "int"
                }, this._view[7] = {
                    title: "Canvas",
                    value: "_canvasStr",
                    color: "white",
                    units: "int"
                }, pe.is3DMode && (this._view[0].title = "FPS(3D)", this._view[8] = {
                    title: "TriFaces",
                    value: "trianglesFaces",
                    color: "white",
                    units: "int"
                }, this._view[9] = {
                    title: "FrustumCulling",
                    value: "frustumCulling",
                    color: "white",
                    units: "int"
                }, this._view[10] = {
                    title: "OctreeNodeCulling",
                    value: "octreeNodeCulling",
                    color: "white",
                    units: "int"
                }), this._useCanvas ? this.createUIPre(t, e) : this.createUI(t, e), this.enable()
            }
            createUIPre(t, e) {
                var i = ae.pixelRatio;
                this._width = 180 * i, this._vx = 120 * i, this._height = i * (12 * this._view.length + 3 * i) + 4, Ei._fontSize = 12 * i;
                for (var s = 0; s < this._view.length; s++) this._view[s].x = 4, this._view[s].y = s * Ei._fontSize + 2 * i;
                this._canvas || (this._canvas = new Me(!0), this._canvas.size(this._width, this._height), this._ctx = this._canvas.getContext("2d"), this._ctx.textBaseline = "top", this._ctx.font = Ei._fontSize + "px Arial", this._canvas.source.style.cssText = "pointer-events:none;background:rgba(150,150,150,0.8);z-index:100000;position: absolute;direction:ltr;left:" + t + "px;top:" + e + "px;width:" + this._width / i + "px;height:" + this._height / i + "px;"), ae.onKGMiniGame || ae.container.appendChild(this._canvas.source), this._first = !0, this.loop(), this._first = !1
            }
            createUI(t, e) {
                var i = this._sp,
                    s = ae.pixelRatio;
                i || (i = new Oe, this._leftText = new Ue, this._leftText.pos(5, 5), this._leftText.color = "#ffffff", i.addChild(this._leftText), this._txt = new Ue, this._txt.pos(130 * s, 5), this._txt.color = "#ffffff", i.addChild(this._txt), this._sp = i), i.pos(t, e);
                for (var r = "", a = 0; a < this._view.length; a++) {
                    var n = this._view[a];
                    r += n.title + "\n"
                }
                this._leftText.text = r;
                var h = 138 * s,
                    o = s * (12 * this._view.length + 3 * s) + 4;
                this._txt.fontSize = Ei._fontSize * s, this._leftText.fontSize = Ei._fontSize * s, i.size(h, o), i.graphics.clear(), i.graphics.alpha(.5), i.graphics.drawRect(0, 0, h + 110, o + 30, "#999999"), i.graphics.alpha(2), this.loop()
            }
            enable() {
                s.systemTimer.frameLoop(1, this, this.loop)
            }
            hide() {
                this._show = !1, s.systemTimer.clear(this, this.loop), this._canvas && ae.removeElement(this._canvas.source)
            }
            set_onclick(t) {
                this._sp && this._sp.on("click", this._sp, t), this._canvas && (this._canvas.source.onclick = t, this._canvas.source.style.pointerEvents = "")
            }
            loop() {
                z._count++;
                var t = ae.now();
                if (!(t - z._timer < 1e3)) {
                    var e = z._count;
                    if (z.FPS = Math.round(1e3 * e / (t - z._timer)), this._show) {
                        z.trianglesFaces = Math.round(z.trianglesFaces / e), this._useCanvas ? z.renderBatches = Math.round(z.renderBatches / e) : z.renderBatches = Math.round(z.renderBatches / e) - 1, z.savedRenderBatches = Math.round(z.savedRenderBatches / e), z.shaderCall = Math.round(z.shaderCall / e), z.spriteRenderUseCacheCount = Math.round(z.spriteRenderUseCacheCount / e), z.canvasNormal = Math.round(z.canvasNormal / e), z.canvasBitmap = Math.round(z.canvasBitmap / e), z.canvasReCache = Math.ceil(z.canvasReCache / e), z.frustumCulling = Math.round(z.frustumCulling / e), z.octreeNodeCulling = Math.round(z.octreeNodeCulling / e);
                        var i = z.FPS > 0 ? Math.floor(1e3 / z.FPS).toString() : " ";
                        z._fpsStr = z.FPS + (z.renderSlow ? " slow" : "") + " " + i, z._spriteStr = z.spriteCount + (z.spriteRenderUseCacheCount ? "/" + z.spriteRenderUseCacheCount : ""), z._canvasStr = z.canvasReCache + "/" + z.canvasNormal + "/" + z.canvasBitmap, z.cpuMemory = D.cpuMemory, z.gpuMemory = D.gpuMemory, this._useCanvas ? this.renderInfoPre() : this.renderInfo(), z.clear()
                    }
                    z._count = 0, z._timer = t
                }
            }
            renderInfoPre() {
                var t, e, i = 0;
                if (this._canvas) {
                    var s = this._ctx;
                    for (s.clearRect(this._first ? 0 : this._vx, 0, this._width, this._height), i = 0; i < this._view.length; i++) t = this._view[i], this._first && (s.fillStyle = "white", s.fillText(t.title, t.x, t.y)), s.fillStyle = t.color, e = z[t.value], "M" == t.units && (e = Math.floor(e / 1048576 * 100) / 100 + " M"), s.fillText(e + "", t.x + this._vx, t.y)
                }
            }
            renderInfo() {
                for (var t = "", e = 0; e < this._view.length; e++) {
                    var i = this._view[e],
                        s = z[i.value];
                    "M" == i.units && (s = Math.floor(s / 1048576 * 100) / 100 + " M"), "K" == i.units && (s = Math.floor(s / 1024 * 100) / 100 + " K"), t += s + "\n"
                }
                this._txt.text = t
            }
            isCanvasRender() {
                return this._useCanvas
            }
            renderNotCanvas(t, e, i) {
                this._show && this._sp && this._sp.render(t, 0, 0)
            }
        }
        Ei._fontSize = 12;
        class Ai {
            constructor(t = !0) {
                this.scale = 1, this.currTimer = Date.now(), this.currFrame = 0, this._delta = 0, this._lastTimer = Date.now(), this._map = {}, this._handlers = [], this._temp = [], this._count = 0, t && Ai.gSysTimer && Ai.gSysTimer.frameLoop(1, this, this._update), this.speed = 1
            }
            get delta() {
                return this._delta
            }
            _update() {
                if (this.scale <= 0 || this.speed <= 0) return this._lastTimer = Date.now(), void(this._delta = 0);
                var t = this.currFrame = this.currFrame + this.scale * this.speed,
                    e = Date.now(),
                    i = e - this._lastTimer > 3e4;
                this._delta = (e - this._lastTimer) * this.scale * this.speed;
                var s = this.currTimer = this.currTimer + this._delta;
                this._lastTimer = e;
                var r = this._handlers;
                this._count = 0;
                for (var a = 0, n = r.length; a < n; a++) {
                    var h = r[a];
                    if (null !== h.method) {
                        var o = h.userFrame ? t : s;
                        if (o >= h.exeTime)
                            if (h.repeat)
                                if (!h.jumpFrame || i) h.exeTime += h.delay, h.run(!1), o > h.exeTime && (h.exeTime += Math.ceil((o - h.exeTime) / h.delay) * h.delay);
                                else
                                    for (; o >= h.exeTime;) h.exeTime += h.delay, h.run(!1);
                        else h.run(!0)
                    } else this._count++
                }(this._count > 30 || t % 200 == 0) && this._clearHandlers()
            }
            _clearHandlers() {
                for (var t = this._handlers, e = 0, i = t.length; e < i; e++) {
                    var s = t[e];
                    null !== s.method ? this._temp.push(s) : this._recoverHandler(s)
                }
                this._handlers = this._temp, t.length = 0, this._temp = t
            }
            _recoverHandler(t) {
                this._map[t.key] == t && delete this._map[t.key], t.clear(), Ai._pool.push(t)
            }
            _create(t, e, i, s, r, a, n) {
                if (!i) return r.apply(s, a), null;
                if (n) {
                    var h = this._getHandler(s, r);
                    if (h) return h.repeat = e, h.userFrame = t, h.delay = i, h.caller = s, h.method = r, h.args = a, h.exeTime = i + (t ? this.currFrame : this.currTimer + Date.now() - this._lastTimer), h
                }
                return h = Ai._pool.length > 0 ? Ai._pool.pop() : new Ci, h.repeat = e, h.userFrame = t, h.delay = i, h.caller = s, h.method = r, h.args = a, h.exeTime = i + (t ? this.currFrame : this.currTimer + Date.now() - this._lastTimer), this._indexHandler(h), this._handlers.push(h), h
            }
            _indexHandler(t) {
                var e = t.caller,
                    i = t.method,
                    r = e ? e.$_GID || (e.$_GID = s.Utils.getGID()) : 0,
                    a = i.$_TID || (i.$_TID = Ai._mid++);
                t.key = r + "_" + a, this._map[t.key] = t
            }
            once(t, e, i, s = null, r = !0) {
                this._create(!1, !1, t, e, i, s, r)
            }
            loop(t, e, i, s = null, r = !0, a = !1) {
                var n = this._create(!1, !0, t, e, i, s, r);
                n && (n.jumpFrame = a)
            }
            frameOnce(t, e, i, s = null, r = !0) {
                this._create(!0, !1, t, e, i, s, r)
            }
            frameLoop(t, e, i, s = null, r = !0) {
                this._create(!0, !0, t, e, i, s, r)
            }
            toString() {
                return " handlers:" + this._handlers.length + " pool:" + Ai._pool.length
            }
            clear(t, e) {
                var i = this._getHandler(t, e);
                i && i.clear()
            }
            clearAll(t) {
                if (t)
                    for (var e = 0, i = this._handlers.length; e < i; e++) {
                        var s = this._handlers[e];
                        s.caller === t && s.clear()
                    }
            }
            _getHandler(t, e) {
                var i = t ? t.$_GID || (t.$_GID = s.Utils.getGID()) : 0,
                    r = e.$_TID || (e.$_TID = Ai._mid++),
                    a = i + "_" + r;
                return this._map[a]
            }
            callLater(t, e, i = null) {
                Ye.I.callLater(t, e, i)
            }
            runCallLater(t, e) {
                Ye.I.runCallLater(t, e)
            }
            runTimer(t, e) {
                var i = this._getHandler(t, e);
                i && null != i.method && (this._map[i.key] = null, i.run(!0))
            }
            pause() {
                this.scale = 0
            }
            resume() {
                this.scale = 1
            }
        }
        Ai.gSysTimer = null, Ai._pool = [], Ai._mid = 1;
        class Ci {
            clear() {
                this.caller = null, this.method = null, this.args = null
            }
            run(t) {
                var e = this.caller;
                if (e && e.destroyed) return this.clear();
                var i = this.method,
                    s = this.args;
                t && this.clear(), null != i && (s ? i.apply(e, s) : i.call(e))
            }
        }
        class Ri extends Z {
            constructor(t) {
                super(H.SKINMESH, 0), this.offsetX = 300, this.offsetY = 0;
                var e = S.mainContext,
                    i = 8 * Xt.BYTES_PE;
                this.position = [2, e.FLOAT, !1, i, 0], this.texcoord = [2, e.FLOAT, !1, i, 2 * Xt.BYTES_PE], this.color = [4, e.FLOAT, !1, i, 4 * Xt.BYTES_PE]
            }
        }
        class bi extends Z {
            constructor(t) {
                super(H.PRIMITIVE, 0), this._attribLocation = ["position", 0, "attribColor", 1]
            }
        }
        class Si extends Z {
            constructor(t = 0) {
                super(H.TEXTURE2D, t), this.strength = 0, this.blurInfo = null, this.colorMat = null, this.colorAlpha = null, this._attribLocation = ["posuv", 0, "attribColor", 1, "attribFlags", 2]
            }
            clear() {
                this.texture = null, this.shader = null, this.defines._value = this.subID
            }
        }
        class wi {
            constructor(t) {
                this.codes = {}, this.funs = {}, this.curUseID = -1, this.funnames = "", this.script = t;
                for (var e, i, r = 0; r = t.indexOf("#begin", r), !(r < 0);) {
                    for (i = r + 5; i = t.indexOf("#end", i), !(i < 0) && "i" === t.charAt(i + 4);) i += 5;
                    if (i < 0) throw "add include err,no #end:" + t;
                    e = t.indexOf("\n", r);
                    var a = s.ShaderCompile.splitToWords(t.substr(r, e - r), null);
                    "code" == a[1] ? this.codes[a[2]] = t.substr(e + 1, i - e - 1) : "function" == a[1] && (e = t.indexOf("function", r), e += "function".length, this.funs[a[3]] = t.substr(e + 1, i - e - 1), this.funnames += a[3] + ";"), r = i + 1
                }
            }
            getWith(t = null) {
                var e = t ? this.codes[t] : this.script;
                if (!e) throw "get with error:" + t;
                return e
            }
            getFunsScript(t) {
                var e = "";
                for (var i in this.funs) t.indexOf(i + ";") >= 0 && (e += this.funs[i]);
                return e
            }
        }
        class Mi {
            constructor(t) {
                this.childs = [], this.text = "", this.useFuns = "", this.z = 0, this.includefiles = t
            }
            setParent(t) {
                t.childs.push(this), this.z = t.z + 1, this.parent = t
            }
            setCondition(t, e) {
                t && (this.conditionType = e, t = t.replace(/(\s*$)/g, ""), this.condition = function() {
                    return this[t]
                }, this.condition.__condition = t)
            }
            toscript(t, e) {
                return this._toscript(t, e, ++Mi.__id)
            }
            _toscript(t, e, i) {
                if (this.childs.length < 1 && !this.text) return e;
                e.length;
                if (this.condition) {
                    var r = !!this.condition.call(t);
                    if (this.conditionType === s.ShaderCompile.IFDEF_ELSE && (r = !r), !r) return e
                }
                if (this.noCompile && this.text && e.push(this.text), this.childs.length > 0 && this.childs.forEach(function(s, r, a) {
                        s._toscript(t, e, i)
                    }), this.includefiles.length > 0 && this.useFuns.length > 0)
                    for (var a, n = 0, h = this.includefiles.length; n < h; n++) this.includefiles[n].curUseID != i && (a = this.includefiles[n].file.getFunsScript(this.useFuns), a.length > 0 && (this.includefiles[n].curUseID = i, e[0] = a + e[0]));
                return e
            }
        }
        Mi.__id = 1;
        class Ii {
            constructor(t, e, i) {
                function s(t) {
                    t = t.replace(Ii._clearCR, "");
                    var e = [],
                        i = new Mi(e);
                    return r._compileToTree(i, t.split("\n"), 0, e, r.defs), i
                }
                this.defs = {};
                let r = this;
                var a = Date.now();
                this._VS = s(t), this._PS = s(e), this._nameMap = i, Date.now() - a > 2 && console.log("ShaderCompile use time:" + (Date.now() - a) + "  size:" + t.length + "/" + e.length)
            }
            static __init__() {
                var t = T.instance;
                Ii.shaderParamsMap = {
                    float: t.FLOAT,
                    int: t.INT,
                    bool: t.BOOL,
                    vec2: t.FLOAT_VEC2,
                    vec3: t.FLOAT_VEC3,
                    vec4: t.FLOAT_VEC4,
                    ivec2: t.INT_VEC2,
                    ivec3: t.INT_VEC3,
                    ivec4: t.INT_VEC4,
                    bvec2: t.BOOL_VEC2,
                    bvec3: t.BOOL_VEC3,
                    bvec4: t.BOOL_VEC4,
                    mat2: t.FLOAT_MAT2,
                    mat3: t.FLOAT_MAT3,
                    mat4: t.FLOAT_MAT4,
                    sampler2D: t.SAMPLER_2D,
                    samplerCube: t.SAMPLER_CUBE
                }
            }
            static _parseOne(t, e, i, s, r, a) {
                var n = {
                    type: Ii.shaderParamsMap[i[s + 1]],
                    name: i[s + 2],
                    size: isNaN(parseInt(i[s + 3])) ? 1 : parseInt(i[s + 3])
                };
                return a && ("attribute" == r ? t.push(n) : e.push(n)), ":" == i[s + 3] && (n.type = i[s + 4], s += 2), s += 2, s
            }
            static addInclude(t, e) {
                if (!e || 0 === e.length) throw new Error("add shader include file err:" + t);
                if (Ii.includes[t]) throw new Error("add shader include file err, has add:" + t);
                Ii.includes[t] = new wi(e)
            }
            static preGetParams(t, e) {
                var i, s, r = [t, e],
                    a = {},
                    n = [],
                    h = [],
                    o = {},
                    l = {};
                a.attributes = n, a.uniforms = h, a.defines = o;
                for (var _ = 0; _ < 2; _++) {
                    r[_] = r[_].replace(Ii._removeAnnotation, "");
                    var u, c = r[_].match(Ii._reg);
                    for (i = 0, s = c.length; i < s; i++) {
                        var d = c[i];
                        if ("attribute" == d || "uniform" == d) i = Ii._parseOne(n, h, c, i, d, !0);
                        else {
                            if ("#define" == d) {
                                d = c[++i], l[d] = 1;
                                continue
                            }
                            if ("#ifdef" == d) {
                                u = c[++i];
                                o[u] = o[u] || [];
                                for (i++; i < s; i++)
                                    if (d = c[i], "attribute" == d || "uniform" == d) i = Ii._parseOne(n, h, c, i, d, !!l[u]);
                                    else if ("#else" == d)
                                    for (i++; i < s; i++)
                                        if (d = c[i], "attribute" == d || "uniform" == d) i = Ii._parseOne(n, h, c, i, d, !l[u]);
                                        else if ("#endif" == d) break
                            }
                        }
                    }
                }
                return a
            }
            static splitToWords(t, e) {
                for (var i, s, r = [], a = -1, n = 0, h = t.length; n < h; n++)
                    if (i = t.charAt(n), " \t=+-*/&%!<>()'\",;".indexOf(i) >= 0) {
                        if (a >= 0 && n - a > 1 && (s = t.substr(a, n - a), r.push(s)), '"' == i || "'" == i) {
                            var o = t.indexOf(i, n + 1);
                            if (o < 0) throw "Sharder err:" + t;
                            r.push(t.substr(n + 1, o - n - 1)), n = o, a = -1;
                            continue
                        }
                        "(" == i && e && r.length > 0 && (s = r[r.length - 1] + ";", "vec4;main;".indexOf(s) < 0 && (e.useFuns += s)), a = -1
                    } else a < 0 && (a = n);
                return a < h && h - a > 1 && (s = t.substr(a, h - a), r.push(s)), r
            }
            _compileToTree(t, e, i, s, r) {
                var a, n, h, o, l, _, u, c, d, p, f;
                for (d = i; d < e.length; d++)
                    if (h = e[d], !(h.length < 1) && (_ = h.indexOf("//"), 0 !== _)) {
                        if (_ >= 0 && (h = h.substr(0, _)), a = c || new Mi(s), c = null, a.text = h, a.noCompile = !0, (_ = h.indexOf("#")) >= 0) {
                            for (o = "#", f = _ + 1, p = h.length; f < p; f++) {
                                var m = h.charAt(f);
                                if (" " === m || "\t" === m || "?" === m) break;
                                o += m
                            }
                            switch (a.name = o, o) {
                                case "#ifdef":
                                case "#ifndef":
                                    if (a.src = h, a.noCompile = null != h.match(/[!&|()=<>]/), a.noCompile ? console.log("function():Boolean{return " + h.substr(_ + a.name.length) + "}") : (u = h.replace(/^\s*/, "").split(/\s+/), a.setCondition(u[1], "#ifdef" === o ? Ii.IFDEF_YES : Ii.IFDEF_ELSE), a.text = "//" + a.text), a.setParent(t), t = a, r)
                                        for (u = h.substr(f).split(Ii._splitToWordExps3), f = 0; f < u.length; f++) h = u[f], h.length && (r[h] = !0);
                                    continue;
                                case "#if":
                                    if (a.src = h, a.noCompile = !0, a.setParent(t), t = a, r)
                                        for (u = h.substr(f).split(Ii._splitToWordExps3), f = 0; f < u.length; f++) h = u[f], h.length && "defined" != h && (r[h] = !0);
                                    continue;
                                case "#else":
                                    a.src = h, t = t.parent, n = t.childs[t.childs.length - 1], a.noCompile = n.noCompile, a.noCompile || (a.condition = n.condition, a.conditionType = n.conditionType == Ii.IFDEF_YES ? Ii.IFDEF_ELSE : Ii.IFDEF_YES, a.text = "//" + a.text + " " + n.text + " " + a.conditionType), a.setParent(t), t = a;
                                    continue;
                                case "#endif":
                                    t = t.parent, n = t.childs[t.childs.length - 1], a.noCompile = n.noCompile, a.noCompile || (a.text = "//" + a.text), a.setParent(t);
                                    continue;
                                case "#include":
                                    u = Ii.splitToWords(h, null);
                                    var g = Ii.includes[u[1]];
                                    if (!g) throw "ShaderCompile error no this include file:" + u[1];
                                    if ((_ = u[0].indexOf("?")) < 0) {
                                        a.setParent(t), h = g.getWith("with" == u[2] ? u[3] : null), this._compileToTree(a, h.split("\n"), 0, s, r), a.text = "";
                                        continue
                                    }
                                    a.setCondition(u[0].substr(_ + 1), Ii.IFDEF_YES), a.text = g.getWith("with" == u[2] ? u[3] : null);
                                    break;
                                case "#import":
                                    u = Ii.splitToWords(h, null), l = u[1], s.push({
                                        node: a,
                                        file: Ii.includes[l],
                                        ofs: a.text.length
                                    });
                                    continue
                            }
                        } else {
                            if (n = t.childs[t.childs.length - 1], n && !n.name) {
                                s.length > 0 && Ii.splitToWords(h, n), c = a, n.text += "\n" + h;
                                continue
                            }
                            s.length > 0 && Ii.splitToWords(h, a)
                        }
                        a.setParent(t)
                    }
            }
            createShader(t, e, i, s) {
                var r = {},
                    a = "";
                if (t)
                    for (var n in t) a += "#define " + n + "\n", r[n] = !0;
                var h = this._VS.toscript(r, []),
                    o = this._PS.toscript(r, []);
                return (i || j.create)(a + h.join("\n"), a + o.join("\n"), e, this._nameMap, s)
            }
        }
        Ii.IFDEF_NO = 0, Ii.IFDEF_YES = 1, Ii.IFDEF_ELSE = 2, Ii.IFDEF_PARENT = 3, Ii._removeAnnotation = new RegExp("(/\\*([^*]|[\\r\\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/)|(//.*)", "g"), Ii._reg = new RegExp("(\".*\")|('.*')|([#\\w\\*-\\.+/()=<>{}\\\\]+)|([,;:\\\\])", "g"), Ii._splitToWordExps = new RegExp("[(\".*\")]+|[('.*')]+|([ \\t=\\+\\-*/&%!<>!%(),;])", "g"), Ii.includes = {}, Ii._clearCR = new RegExp("\r", "g"), Ii._splitToWordExps3 = new RegExp("[ \\t=\\+\\-*/&%!<>!%(),;\\|]", "g");
        class Pi extends M {
            constructor() {
                super(), this.worker = new Worker(Pi.workerPath);
                let t = this;
                this.worker.onmessage = function(e) {
                    t.workerMessage(e.data)
                }
            }
            static __init__() {
                return null == Pi._preLoadFun && (!!Worker && (Pi._preLoadFun = si.prototype._loadImage, si.prototype._loadImage = Pi.prototype._loadImage, Pi.I || (Pi.I = new Pi), !0))
            }
            static workerSupported() {
                return !!Worker
            }
            static enableWorkerLoader() {
                Pi._tryEnabled || (Pi.enable = !0, Pi._tryEnabled = !0)
            }
            static set enable(t) {
                Pi._enable != t && (Pi._enable = t, t && null == Pi._preLoadFun && (Pi._enable = Pi.__init__()))
            }
            static get enable() {
                return Pi._enable
            }
            workerMessage(t) {
                if (t) switch (t.type) {
                    case "Image":
                        this.imageLoaded(t);
                        break;
                    case "Disable":
                        Pi.enable = !1
                }
            }
            imageLoaded(t) {
                if (t.dataType && "imageBitmap" == t.dataType) {
                    var e = t.imageBitmap;
                    console.log("load:", t.url), this.event(t.url, e)
                } else this.event(t.url, null)
            }
            loadImage(t) {
                this.worker.postMessage(t)
            }
            _loadImage(e) {
                function i() {
                    Pi.I.off(e, s, a)
                }
                var s = this;
                let r = s.type;
                if (this._useWorkerLoader && Pi._enable) {
                    e = P.formatURL(e);
                    var a = function(a) {
                        if (i(), a) {
                            var n = a;
                            "nativeimage" !== r && (n = new U, n.wrapModeU = t.WarpMode.Clamp, n.wrapModeV = t.WarpMode.Clamp, n.loadImageSource(a, !0)), s.onLoaded(n)
                        } else Pi._preLoadFun.call(s, e)
                    };
                    Pi.I.on(e, s, a), Pi.I.loadImage(e)
                } else Pi._preLoadFun.call(s, e)
            }
        }
        Pi.workerPath = "libs/workerloader.js", Pi._enable = !1, Pi._tryEnabled = !1;
        class Di {
            static set cursor(t) {
                Di._style.cursor = t
            }
            static get cursor() {
                return Di._style.cursor
            }
            static __init__() {
                Di._style = ae.document.body.style
            }
            static hide() {
                "none" != Di.cursor && (Di._preCursor = Di.cursor, Di.cursor = "none")
            }
            static show() {
                "none" == Di.cursor && (Di._preCursor ? Di.cursor = Di._preCursor : Di.cursor = "auto")
            }
        }
        class Li extends wt {
            constructor(t) {
                super(Li.const_stride, 4 * t * Li.const_stride, 4), this.canReuse = !0, this.setAttributes(Li._fixattriInfo), this.createQuadIB(t), this._quadNum = t
            }
            static __init__() {
                var t = T.instance;
                Li._fixattriInfo = [t.FLOAT, 4, 0, t.FLOAT, 3, 16, t.FLOAT, 3, 28, t.FLOAT, 4, 40, t.FLOAT, 4, 56, t.FLOAT, 3, 72, t.FLOAT, 2, 84, t.FLOAT, 4, 92, t.FLOAT, 1, 108, t.FLOAT, 1, 112]
            }
            setMaxParticleNum(t) {
                this._vb._resizeBuffer(4 * t * Li.const_stride, !1), this.createQuadIB(t)
            }
            static getAMesh(t) {
                if (Li._POOL.length) {
                    var e = Li._POOL.pop();
                    return e.setMaxParticleNum(t), e
                }
                return new Li(t)
            }
            releaseMesh() {
                this._vb.setByteLength(0), this.vertNum = 0, this.indexNum = 0, Li._POOL.push(this)
            }
            destroy() {
                this._ib.destroy(), this._vb.destroy(), this._vb.deleteBuffer()
            }
        }
        Li.const_stride = 116, Li._POOL = [];
        class Bi extends L {}
        Bi.create = function(e, i, s) {
            var r = new U(e, i, s, !1, !1);
            return r.wrapModeU = t.WarpMode.Clamp, r.wrapModeV = t.WarpMode.Clamp, r
        };
        class Fi {
            static __init(t) {
                t.forEach(function(t) {
                    t.__init$ && t.__init$()
                })
            }
            static init(e, i, ...r) {
                if (!Fi._isinit) {
                    Fi._isinit = !0, ArrayBuffer.prototype.slice || (ArrayBuffer.prototype.slice = Fi._arrayBufferSlice), ae.__init__();
                    var a = ae.mainCanvas = new Me(!0);
                    if (Fi.isWXPlayable || Fi._setStyleInfo(a), ae.onKGMiniGame || ae.onAlipayMiniGame || ae.container.appendChild(a.source), ae.canvas = new Me(!0), ae.context = ae.canvas.getContext("2d"), ae.supportWebAudio = Je.__init__(), ae.supportLocalStorage = hi.__init__(), Fi.systemTimer = new Ai(!1), t.systemTimer = Ai.gSysTimer = Fi.systemTimer, Fi.startTimer = new Ai(!1), Fi.physicsTimer = new Ai(!1), Fi.updateTimer = new Ai(!1), Fi.lateTimer = new Ai(!1), Fi.timer = new Ai(!1), t.startTimer = s.startTimer = Fi.startTimer, t.lateTimer = s.lateTimer = Fi.lateTimer, t.updateTimer = s.updateTimer = Fi.updateTimer, s.systemTimer = Fi.systemTimer, t.timer = s.timer = Fi.timer, t.physicsTimer = s.physicsTimer = Fi.physicsTimer, Fi.loader = new ai, s.Laya = Fi, t.loader = s.loader = Fi.loader, gi.__init__(), Ti.__init(), Di.__init__(), ue.inner_enable(), r)
                        for (var n = 0, h = r.length; n < h; n++) r[n] && r[n].enable && r[n].enable();
                    return s.Render.isConchApp && Fi.enableNative(), Fi.enableWebGLPlus(), Ae.beginCheck(), t.stage = Fi.stage = new ze, s.stage = Fi.stage, tt.gStage = Fi.stage, P.rootPath = P._basePath = Fi._getUrlPath(), Mt.__int__(), Pt.__init__(), It.__init__(), Fi.render = new pe(0, 0, ae.mainCanvas), t.render = Fi.render, Fi.stage.size(e, i),
                        window.stage = Fi.stage, S.__init__(), Li.__init__(), Ii.__init__(), we.__init__(), Ke.__init__(), We.instance.__init__(Fi.stage, pe.canvas), Ge.__init__(), Je.autoStopMusic = !0, z._StatRender = new Ei, Z._initone(H.TEXTURE2D, Si), Z._initone(H.TEXTURE2D | H.FILTERGLOW, Si), Z._initone(H.PRIMITIVE, bi), Z._initone(H.SKINMESH, Ri), pe.canvas
                }
            }
            static _setStyleInfo(t) {
                let e = t.source.style;
                e.position = "absolute", e.top = e.left = "0px", e.background = "#000000"
            }
            static _getUrlPath() {
                return P.getPath(location.protocol + "//" + location.host + location.pathname)
            }
            static _arrayBufferSlice(t, e) {
                var i = this,
                    s = new Uint8Array(i, t, e - t),
                    r = new Uint8Array(s.length);
                return r.set(s), r.buffer
            }
            static alertGlobalError(t) {
                if (!Fi.isWXPlayable) {
                    var e = 0;
                    ae.window.onerror = t && "function" == typeof t ? t : function(t, i, s, r, a) {
                        e++ < 5 && a && console.error("出错啦，请把此信息截图给研发商\n" + t + "\n" + a.stack)
                    }
                }
            }
            static _runScript(t) {
                return ae.window[Fi._evcode](t)
            }
            static enableDebugPanel(t = "libs/laya.debugtool.js") {
                if (window.Laya.DebugPanel) window.Laya.DebugPanel.enable();
                else {
                    var e = ae.createElement("script");
                    e.onload = function() {
                        window.Laya.DebugPanel.enable()
                    }, e.src = t, ae.document.body.appendChild(e)
                }
            }
            static enableWebGLPlus() {
                S.__init_native()
            }
            static enableNative() {
                Fi.isNativeRender_enable || (i.useRetinalCanvas = !0, Fi.isNativeRender_enable = !0, pe.supportWebGLPlusRendering && (j.prototype.uploadTexture2D = function(t) {
                    var e = T.instance;
                    e.bindTexture(e.TEXTURE_2D, t)
                }), k.width = ae.window.innerWidth, k.height = ae.window.innerHeight, ae.measureText = function(t, e) {
                    return window.conchTextCanvas.font = e, window.conchTextCanvas.measureText(t)
                }, ze.clear = function(t) {
                    le.set2DRenderConfig();
                    var e = et.create(t).arrColor,
                        i = T.instance;
                    e && i.clearColor(e[0], e[1], e[2], e[3]), i.clear(i.COLOR_BUFFER_BIT | i.DEPTH_BUFFER_BIT | i.STENCIL_BUFFER_BIT), k.clear()
                }, Oe.drawToCanvas = function(t, e, i, s, r, a) {
                    r -= t.x, a -= t.y, r |= 0, a |= 0, i |= 0, s |= 0;
                    var n = new le;
                    n.size(i, s), n.asBitmap = !0, n._targets.start(), we.renders[e]._fun(t, n, r, a), n.flush(), n._targets.end(), n._targets.restore();
                    var h = new te(n._targets, te.INV_UV);
                    return n.destroy(!0), h
                }, Object.defineProperty(W.prototype, "uv", {get: function() {
                        return this._uv
                    },
                    set: function(t) {
                        this._uv = t
                    }
                }), Me.prototype.getTexture = function() {
                    return this._texture || (this._texture = this.context._targets, this._texture.uv = W.flipyuv, this._texture.bitmap = this._texture), this._texture
                })
            }
        }
        Fi.stage = null, Fi.systemTimer = null, Fi.startTimer = null, Fi.physicsTimer = null, Fi.updateTimer = null, Fi.lateTimer = null, Fi.timer = null, Fi.loader = null, Fi.version = "2.13.1beta", Fi._isinit = !1, Fi.isWXOpenDataContext = !1, Fi.isWXPlayable = !1, Fi.isWXPosMsg = !1, Fi.__classmap = null, Fi.Config = i, Fi.TextRender = oe, Fi.EventDispatcher = M, Fi.SoundChannel = je, Fi.Stage = ze, Fi.Render = pe, Fi.Browser = ae, Fi.Sprite = Oe, Fi.Node = Fe, Fi.Context = le, Fi.WebGL = ue, Fi.Handler = w, Fi.RunDriver = Xe, Fi.Utils = tt, Fi.Input = Ge, Fi.Loader = si, Fi.LocalStorage = hi, Fi.SoundManager = Je, Fi.URL = P, Fi.Event = Jt, Fi.Matrix = f, Fi.HTMLImage = Bi, Fi.Laya = Fi, Fi._evcode = "eval", Fi.isNativeRender_enable = !1, Fi.__classmap = s.__classMap, s.Timer = Ai, s.Dragging = ci, s.GraphicsBounds = Te, s.Sprite = Oe, s.TextRender = oe, s.Loader = si, s.TTFLoader = li, s.WebAudioSound = $e, s.SoundManager = Je, s.ShaderCompile = Ii, s.ClassUtils = Pe, s.SceneUtils = Ti, s.Context = le, s.Render = pe, s.MouseManager = We, s.Text = Ue, s.Browser = ae, s.WebGL = ue, s.AudioSound = Ze, s.Pool = r, s.Utils = tt, s.Graphics = Re, s.Submit = Ht, s.Stage = ze, s.Resource = D, s.WorkerLoader = Pi;
        var Oi = window._layalibs;
        if (Oi) {
            Oi.sort(function(t, e) {
                return t.i - e.i
            });
            for (var Ni = 0; Ni < Oi.length; Ni++) Oi[Ni].f(window, window.document, Fi)
        }
        let Ui = window;
        Ui.Laya ? (Ui.Laya.Laya = Fi, Object.assign(Ui.Laya, Fi)) : Ui.Laya = Fi;
        var Gi, ki, Wi, Yi = Fi.__init,
            Vi = Fi.init,
            Xi = Fi.version,
            Hi = Fi.alertGlobalError,
            zi = Fi.enableDebugPanel;
        class Ki extends di {get isSingleton() {
                return !1
            }
            constructor() {
                super()
            }
            onAwake() {}
            onEnable() {}
            onStart() {}
            onUpdate() {}
            onLateUpdate() {}
            onDisable() {}
            onDestroy() {}
        }
        class ji extends di {get isSingleton() {
                return !1
            }
            _onAwake() {
                this.onAwake(), this.onStart !== ji.prototype.onStart && s.startTimer.callLater(this, this.onStart)
            }
            _onEnable() {
                var t = ji.prototype;
                this.onTriggerEnter !== t.onTriggerEnter && this.owner.on(Jt.TRIGGER_ENTER, this, this.onTriggerEnter), this.onTriggerStay !== t.onTriggerStay && this.owner.on(Jt.TRIGGER_STAY, this, this.onTriggerStay), this.onTriggerExit !== t.onTriggerExit && this.owner.on(Jt.TRIGGER_EXIT, this, this.onTriggerExit), this.onMouseDown !== t.onMouseDown && this.owner.on(Jt.MOUSE_DOWN, this, this.onMouseDown), this.onMouseUp !== t.onMouseUp && this.owner.on(Jt.MOUSE_UP, this, this.onMouseUp), this.onClick !== t.onClick && this.owner.on(Jt.CLICK, this, this.onClick), this.onStageMouseDown !== t.onStageMouseDown && s.stage.on(Jt.MOUSE_DOWN, this, this.onStageMouseDown), this.onStageMouseUp !== t.onStageMouseUp && s.stage.on(Jt.MOUSE_UP, this, this.onStageMouseUp), this.onStageClick !== t.onStageClick && s.stage.on(Jt.CLICK, this, this.onStageClick), this.onStageMouseMove !== t.onStageMouseMove && s.stage.on(Jt.MOUSE_MOVE, this, this.onStageMouseMove), this.onDoubleClick !== t.onDoubleClick && this.owner.on(Jt.DOUBLE_CLICK, this, this.onDoubleClick), this.onRightClick !== t.onRightClick && this.owner.on(Jt.RIGHT_CLICK, this, this.onRightClick), this.onMouseMove !== t.onMouseMove && this.owner.on(Jt.MOUSE_MOVE, this, this.onMouseMove), this.onMouseOver !== t.onMouseOver && this.owner.on(Jt.MOUSE_OVER, this, this.onMouseOver), this.onMouseOut !== t.onMouseOut && this.owner.on(Jt.MOUSE_OUT, this, this.onMouseOut), this.onKeyDown !== t.onKeyDown && s.stage.on(Jt.KEY_DOWN, this, this.onKeyDown), this.onKeyPress !== t.onKeyPress && s.stage.on(Jt.KEY_PRESS, this, this.onKeyPress), this.onKeyUp !== t.onKeyUp && s.stage.on(Jt.KEY_UP, this, this.onKeyUp), this.onUpdate !== t.onUpdate && s.updateTimer.frameLoop(1, this, this.onUpdate), this.onLateUpdate !== t.onLateUpdate && s.lateTimer.frameLoop(1, this, this.onLateUpdate), this.onPreRender !== t.onPreRender && s.lateTimer.frameLoop(1, this, this.onPreRender), this.onEnable()
            }
            _onDisable() {
                this.owner.offAllCaller(this), s.stage.offAllCaller(this), s.startTimer.clearAll(this), s.updateTimer.clearAll(this), s.lateTimer.clearAll(this), this.onDisable()
            }
            _isScript() {
                return !0
            }
            _onDestroy() {
                this.onDestroy()
            }
            onAwake() {}
            onEnable() {}
            onStart() {}
            onTriggerEnter(t, e, i) {}
            onTriggerStay(t, e, i) {}
            onTriggerExit(t, e, i) {}
            onMouseDown(t) {}
            onMouseUp(t) {}
            onClick(t) {}
            onStageMouseDown(t) {}
            onStageMouseUp(t) {}
            onStageClick(t) {}
            onStageMouseMove(t) {}
            onDoubleClick(t) {}
            onRightClick(t) {}
            onMouseMove(t) {}
            onMouseOver(t) {}
            onMouseOut(t) {}
            onKeyDown(t) {}
            onKeyPress(t) {}
            onKeyUp(t) {}
            onUpdate() {}
            onLateUpdate() {}
            onPreRender() {}
            onPostRender() {}
            onDisable() {}
            onDestroy() {}
        }
        class qi extends mi {
            constructor() {
                super(...arguments), this._nodeIDAniDic = {}
            }
            _parseNodeList(t) {
                this._nodeList || (this._nodeList = []), this._nodeDefaultProps[t.compId] = t.props, t.compId && this._nodeList.push(t.compId);
                var e = t.child;
                if (e) {
                    var i, s = e.length;
                    for (i = 0; i < s; i++) this._parseNodeList(e[i])
                }
            }
            _calGraphicData(t) {
                var e;
                if (this._setUp(null, t), this._createGraphicData(), this._nodeIDAniDic)
                    for (e in this._nodeIDAniDic) this._nodeIDAniDic[e] = null
            }
            _createGraphicData() {
                var t, e, i = [],
                    s = this.count,
                    r = this._usedFrames;
                for (r || (r = []), t = 0; t < s; t++) !r[t] && e || (e = this._createFrameGraphic(t)), i.push(e);
                this._gList = i
            }
            _createFrameGraphic(t) {
                var e = new Re;
                return qi._rootMatrix || (qi._rootMatrix = new f), this._updateNodeGraphic(this._rootNode, t, qi._rootMatrix, e), e
            }
            _updateNodeGraphic(t, e, i, s, r = 1) {
                var a, n, h;
                a = this._nodeGDic[t.compId] = this._getNodeGraphicData(t.compId, e, this._nodeGDic[t.compId]), a.resultTransform || (a.resultTransform = new f), n = a.resultTransform, f.mul(a.transform, i, n);
                var o = a.alpha * r;
                if (!(o < .01)) {
                    a.skin && (h = this._getTextureByUrl(a.skin), h && (n._checkTransform() ? (s.drawTexture(h, 0, 0, a.width, a.height, n, o), a.resultTransform = null) : s.drawTexture(h, n.tx, n.ty, a.width, a.height, null, o)));
                    var l, _, u = t.child;
                    if (u)
                        for (_ = u.length, l = 0; l < _; l++) this._updateNodeGraphic(u[l], e, n, s, o)
                }
            }
            _updateNoChilds(t, e) {
                if (t.skin) {
                    var i = this._getTextureByUrl(t.skin);
                    if (i) {
                        var s, r = t.transform;
                        r._checkTransform(), s = !r._bTransform, s ? e.drawTexture(i, r.tx, r.ty, t.width, t.height, null, t.alpha) : e.drawTexture(i, 0, 0, t.width, t.height, r.clone(), t.alpha)
                    }
                }
            }
            _updateNodeGraphic2(t, e, i) {
                var s;
                if (s = this._nodeGDic[t.compId] = this._getNodeGraphicData(t.compId, e, this._nodeGDic[t.compId]), t.child) {
                    var r, a, n, h = s.transform;
                    h._checkTransform(), r = !h._bTransform, a = r && (0 != h.tx || 0 != h.ty), n = h._bTransform || 1 != s.alpha, n && i.save(), 1 != s.alpha && i.alpha(s.alpha), r ? a && i.translate(h.tx, h.ty) : i.transform(h.clone());
                    var o, l, _, u = t.child;
                    if (s.skin && (o = this._getTextureByUrl(s.skin), o && i.drawImage(o, 0, 0, s.width, s.height)), u)
                        for (_ = u.length, l = 0; l < _; l++) this._updateNodeGraphic2(u[l], e, i);
                    n ? i.restore() : r ? a && i.translate(-h.tx, -h.ty) : i.transform(h.clone().invert())
                } else this._updateNoChilds(s, i)
            }
            _calculateKeyFrames(t) {
                super._calculateKeyFrames(t), this._nodeIDAniDic[t.target] = t
            }
            getNodeDataByID(t) {
                return this._nodeIDAniDic[t]
            }
            _getParams(t, e, i, s) {
                var r = qi._temParam;
                r.length = e.length;
                var a, n = e.length;
                for (a = 0; a < n; a++) r[a] = this._getObjVar(t, e[a][0], i, e[a][1], s);
                return r
            }
            _getObjVar(t, e, i, s, r) {
                if (e in t) {
                    var a = t[e];
                    return i >= a.length && (i = a.length - 1), t[e][i]
                }
                return e in r ? r[e] : s
            }
            _getNodeGraphicData(t, e, i) {
                i || (i = new Zi), i.transform ? i.transform.identity() : i.transform = new f;
                var s = this.getNodeDataByID(t);
                if (!s) return i;
                var r, a, n, h = s.frames,
                    o = this._getParams(h, qi._drawTextureCmd, e, this._nodeDefaultProps[t]),
                    l = o[0],
                    _ = o[5],
                    u = o[6],
                    c = o[13],
                    d = o[14],
                    p = o[7],
                    m = o[8],
                    g = o[9],
                    T = o[11],
                    v = o[12];
                r = o[3], a = o[4], 0 != r && 0 != a || (l = null), -1 == r && (r = 0), -1 == a && (a = 0), i.skin = l, i.width = r, i.height = a, l && (n = this._getTextureByUrl(l), n ? (r || (r = n.sourceWidth), a || (a = n.sourceHeight)) : console.warn("lost skin:", l, ",you may load pics first")), i.alpha = o[10];
                var x = i.transform;
                0 != c && (_ = c * r), 0 != d && (u = d * a), 0 == _ && 0 == u || x.translate(-_, -u);
                var y = null;
                if (g || 1 !== p || 1 !== m || T || v) {
                    y = qi._tempMt, y.identity(), y._bTransform = !0;
                    var E = .0174532922222222 * (g - T),
                        A = .0174532922222222 * (g + v),
                        C = Math.cos(A),
                        R = Math.sin(A),
                        b = Math.sin(E),
                        S = Math.cos(E);
                    y.a = p * C, y.b = p * R, y.c = -m * b, y.d = m * S, y.tx = y.ty = 0
                }
                return y && (x = f.mul(x, y, x)), x.translate(o[1], o[2]), i
            }
            _getTextureByUrl(t) {
                return si.getRes(t)
            }
            setAniData(t, e = null) {
                if (t.animations) {
                    this._nodeDefaultProps = {}, this._nodeGDic = {}, this._nodeList && (this._nodeList.length = 0), this._rootNode = t, this._parseNodeList(t);
                    var i, s, r = {},
                        a = [],
                        n = t.animations,
                        h = n.length;
                    for (i = 0; i < h; i++)
                        if (s = n[i], this._labels = null, (!e || e == s.name) && s) {
                            try {
                                this._calGraphicData(s)
                            } catch (t) {
                                console.warn("parse animation fail:" + s.name + ",empty animation created"), this._gList = []
                            }
                            var o = {};
                            o.interval = 1e3 / s.frameRate, o.frames = this._gList, o.labels = this._labels, o.name = s.name, a.push(o), r[s.name] = o
                        }
                    this.animationList = a, this.animationDic = r
                }
                qi._temParam.length = 0
            }
            parseByData(t) {
                var e, i;
                e = t.nodeRoot, i = t.aniO, delete t.nodeRoot, delete t.aniO, this._nodeDefaultProps = {}, this._nodeGDic = {}, this._nodeList && (this._nodeList.length = 0), this._rootNode = e, this._parseNodeList(e), this._labels = null;
                try {
                    this._calGraphicData(i)
                } catch (t) {
                    console.warn("parse animation fail:" + i.name + ",empty animation created"), this._gList = []
                }
                var s = t;
                return s.interval = 1e3 / i.frameRate, s.frames = this._gList, s.labels = this._labels, s.name = i.name, s
            }
            setUpAniData(t) {
                if (t.animations) {
                    var e, i, s = {},
                        r = [],
                        a = t.animations,
                        n = a.length;
                    for (e = 0; e < n; e++)
                        if (i = a[e], i) {
                            var h = {};
                            h.name = i.name, h.aniO = i, h.nodeRoot = t, r.push(h), s[i.name] = h
                        }
                    this.animationList = r, this.animationDic = s
                }
            }
            _clear() {
                this.animationList = null, this.animationDic = null, this._gList = null, this._nodeGDic = null
            }
            static parseAnimationByData(t) {
                var e;
                return qi._I || (qi._I = new qi), e = qi._I.parseByData(t), qi._I._clear(), e
            }
            static parseAnimationData(t) {
                var e;
                return qi._I || (qi._I = new qi), qi._I.setUpAniData(t), e = {}, e.animationList = qi._I.animationList, e.animationDic = qi._I.animationDic, qi._I._clear(), e
            }
        }
        qi._drawTextureCmd = [
            ["skin", null],
            ["x", 0],
            ["y", 0],
            ["width", -1],
            ["height", -1],
            ["pivotX", 0],
            ["pivotY", 0],
            ["scaleX", 1],
            ["scaleY", 1],
            ["rotation", 0],
            ["alpha", 1],
            ["skewX", 0],
            ["skewY", 0],
            ["anchorX", 0],
            ["anchorY", 0]
        ], qi._temParam = [], qi._tempMt = new f;
        class Zi {
            constructor() {
                this.alpha = 1
            }
        }
        class Qi extends pi {
            constructor() {
                super(), this._setControlNode(this)
            }
            destroy(t = !0) {
                this.stop(), super.destroy(t), this._frames = null, this._labels = null
            }
            play(t = 0, e = !0, i = "") {
                i && this._setFramesFromCache(i, !0), super.play(t, e, i)
            }
            _setFramesFromCache(t, e = !1) {
                if (this._url && (t = this._url + "#" + t), t && Qi.framesMap[t]) {
                    var i = Qi.framesMap[t];
                    return i instanceof Array ? (this._frames = Qi.framesMap[t], this._count = this._frames.length) : (i.nodeRoot && (Qi.framesMap[t] = qi.parseAnimationByData(i), i = Qi.framesMap[t]), this._frames = i.frames, this._count = this._frames.length, this._frameRateChanged || (this._interval = i.interval), this._labels = this._copyLabels(i.labels)), !0
                }
                return e && console.log("ani not found:", t), !1
            }
            _copyLabels(t) {
                if (!t) return null;
                var e, i;
                for (i in e = {}, t) e[i] = tt.copyArray([], t[i]);
                return e
            }
            _frameLoop() {
                this._visible && this._style.alpha > .01 && this._frames && super._frameLoop()
            }
            _displayToIndex(t) {
                this._frames && (this.graphics = this._frames[t])
            }
            get frames() {
                return this._frames
            }
            set frames(t) {
                this._frames = t, t && (this._count = t.length, this._actionName && this._setFramesFromCache(this._actionName, !0), this.index = this._index)
            }
            set source(t) {
                t.indexOf(".ani") > -1 ? this.loadAnimation(t) : t.indexOf(".json") > -1 || t.indexOf("als") > -1 || t.indexOf("atlas") > -1 ? this.loadAtlas(t) : this.loadImages(t.split(","))
            }
            set autoAnimation(t) {
                this.play(0, !0, t)
            }
            set autoPlay(t) {
                t ? this.play() : this.stop()
            }
            clear() {
                return super.clear(), this.stop(), this.graphics = null, this._frames = null, this._labels = null, this
            }
            loadImages(t, e = "") {
                return this._url = "", this._setFramesFromCache(e) || (this.frames = Qi.framesMap[e] ? Qi.framesMap[e] : Qi.createFrames(t, e)), this
            }
            loadAtlas(t, e = null, i = "") {
                this._url = "";
                var r = this;
                if (!r._setFramesFromCache(i)) {
                    function a(s) {
                        t === s && (r.frames = Qi.framesMap[i] ? Qi.framesMap[i] : Qi.createFrames(t, i), e && e.run())
                    }
                    si.getAtlas(t) ? a(t) : s.loader.load(t, w.create(null, a, [t]), null, si.ATLAS)
                }
                return this
            }
            loadAnimation(t, e = null, i = null) {
                this._url = t;
                var r = this;
                return this._actionName || (this._actionName = ""), r._setFramesFromCache(this._actionName) ? (r._setFramesFromCache(this._actionName, !0), this.index = 0, e && e.run()) : !i || si.getAtlas(i) ? this._loadAnimationData(t, e, i) : s.loader.load(i, w.create(this, this._loadAnimationData, [t, e, i]), null, si.ATLAS), this
            }
            _loadAnimationData(t, e = null, i = null) {
                function r(i) {
                    if (si.getRes(i)) {
                        if (t === i) {
                            var s;
                            if (Qi.framesMap[t + "#"]) a._setFramesFromCache(a._actionName, !0), a.index = 0, a._resumePlay();
                            else {
                                var r = qi.parseAnimationData(si.getRes(t));
                                if (!r) return;
                                var n, h, o = r.animationList,
                                    l = o.length;
                                for (n = 0; n < l; n++) s = o[n], Qi.framesMap[t + "#" + s.name] = s, h || (h = s);
                                h && (Qi.framesMap[t + "#"] = h, a._setFramesFromCache(a._actionName, !0), a.index = 0), a._resumePlay()
                            }
                            e && e.run()
                        }
                        si.clearRes(t)
                    } else Qi.framesMap[t + "#"] && (a._setFramesFromCache(a._actionName, !0), a.index = 0, a._resumePlay(), e && e.run())
                }
                if (!i || si.getAtlas(i)) {
                    var a = this;
                    si.getRes(t) ? r(t) : s.loader.load(t, w.create(null, r, [t]), null, si.JSON)
                } else console.warn("atlas load fail:" + i)
            }
            static createFrames(t, e) {
                var i;
                if ("string" == typeof t) {
                    var s = si.getAtlas(t);
                    if (s && s.length) {
                        i = [];
                        for (var r = 0, a = s.length; r < a; r++) {
                            var n = new Re;
                            n.drawImage(si.getRes(s[r]), 0, 0), i.push(n)
                        }
                    }
                } else if (t instanceof Array)
                    for (i = [], r = 0, a = t.length; r < a; r++) n = new Re, n.loadImage(t[r], 0, 0), i.push(n);
                return e && (Qi.framesMap[e] = i), i
            }
            static clearCache(t) {
                var e, i = Qi.framesMap,
                    s = t + "#";
                for (e in i) e !== t && 0 !== e.indexOf(s) || delete Qi.framesMap[e]
            }
        }
        Qi.framesMap = {}, s.regClass(Qi), Pe.regClass("laya.display.Animation", Qi), Pe.regClass("Laya.Animation", Qi);
        class $i extends mi {
            constructor() {
                super(...arguments), this._initData = {}
            }
            set target(t) {
                this._target && this._target.off($i.EFFECT_BEGIN, this, this._onOtherBegin), this._target = t, this._target && this._target.on($i.EFFECT_BEGIN, this, this._onOtherBegin), this._addEvent()
            }
            get target() {
                return this._target
            }
            _onOtherBegin(t) {
                t !== this && this.stop()
            }
            set playEvent(t) {
                this._playEvent = t, t && this._addEvent()
            }
            _addEvent() {
                this._target && this._playEvent && (this._setControlNode(this._target), this._target.on(this._playEvent, this, this._onPlayAction))
            }
            _onPlayAction() {
                this.play(0, !1)
            }
            play(t = 0, e = !0, i = "") {
                this._target && (this._target.event($i.EFFECT_BEGIN, [this]), this._recordInitData(), super.play(t, e, i))
            }
            _recordInitData() {
                var t, e, i;
                if (this._aniKeys)
                    for (e = this._aniKeys.length, t = 0; t < e; t++) i = this._aniKeys[t], this._initData[i] = this._target[i]
            }
            set effectClass(t) {
                if (this._effectClass = Pe.getClass(t), this._effectClass) {
                    var e = this._effectClass.uiView;
                    if (e) {
                        var i = e.animations;
                        if (i && i[0]) {
                            var s = i[0];
                            this._setUp({}, s), s.nodes && s.nodes[0] && (this._aniKeys = s.nodes[0].keys)
                        }
                    }
                }
            }
            set effectData(t) {
                if (t) {
                    var e = t.animations;
                    if (e && e[0]) {
                        var i = e[0];
                        this._setUp({}, i), i.nodes && i.nodes[0] && (this._aniKeys = i.nodes[0].keys)
                    }
                }
            }
            _displayToIndex(t) {
                if (this._animationData) {
                    t < 0 && (t = 0), t > this._count && (t = this._count);
                    var e, i = this._animationData.nodes,
                        s = i.length;
                    for (s = s > 1 ? 1 : s, e = 0; e < s; e++) this._displayNodeToFrame(i[e], t)
                }
            }
            _displayNodeToFrame(t, e, i = null) {
                if (this._target) {
                    var s, r, a, n, h, o, l, _, u, c = this._target,
                        d = t.frames,
                        p = t.keys,
                        f = p.length,
                        m = t.secondFrames;
                    for (n = 0; n < f; n++) s = p[n], r = d[s], h = m[s], -1 == h ? a = this._initData[s] : e < h ? (l = t.keyframes[s], _ = l[0], _.tween ? (o = _i[_.tweenMethod], null == o && (o = _i.linearNone), u = l[1], a = o(e, this._initData[s], u.value - this._initData[s], u.index)) : a = this._initData[s]) : a = r.length > e ? r[e] : r[r.length - 1], c[s] = a
                }
            }
            _calculateKeyFrames(t) {
                super._calculateKeyFrames(t);
                var e, i, s = t.keyframes,
                    r = (t.target, {});
                for (e in t.secondFrames = r, s) i = s[e], i.length <= 1 ? r[e] = -1 : r[e] = i[1].index
            }
        }
        $i.EFFECT_BEGIN = "effectbegin", Pe.regClass("laya.display.EffectAnimation", $i), Pe.regClass("Laya.EffectAnimation", $i);
        class Ji extends M {
            constructor() {
                super(), this._completeHandler = new w(this, this.onOneLoadComplete), this.reset()
            }
            reset() {
                this._toLoadList = [], this._isLoading = !1, this.totalCount = 0
            }
            get leftCount() {
                return this._isLoading ? this._toLoadList.length + 1 : this._toLoadList.length
            }
            get loadedCount() {
                return this.totalCount - this.leftCount
            }
            load(t, e = !1, i = !0) {
                var s, r;
                if (t instanceof Array)
                    for (r = t.length, s = 0; s < r; s++) this._addToLoadList(t[s], e);
                else this._addToLoadList(t, e);
                i && this._checkNext()
            }
            _addToLoadList(t, e = !1) {
                this._toLoadList.indexOf(t) >= 0 || si.getRes(t) || (e ? this._toLoadList.push({
                    url: t
                }) : this._toLoadList.push(t), this.totalCount++)
            }
            _checkNext() {
                if (!this._isLoading) {
                    if (0 == this._toLoadList.length) return void this.event(Jt.COMPLETE);
                    var t;
                    t = this._toLoadList.pop(), "string" == typeof t ? this.loadOne(t) : this.loadOne(t.url, !0)
                }
            }
            loadOne(t, e = !1) {
                this._curUrl = t;
                var i = tt.getFileExtension(this._curUrl);
                e ? s.loader.create(t, this._completeHandler) : Ji.LoadableExtensions[i] ? s.loader.load(t, this._completeHandler, null, Ji.LoadableExtensions[i]) : t != ri.getFileLoadPath(t) || Ji.No3dLoadTypes[i] || !ai.createMap[i] ? s.loader.load(t, this._completeHandler) : s.loader.create(t, this._completeHandler)
            }
            onOneLoadComplete() {
                this._isLoading = !1, si.getRes(this._curUrl) || console.log("Fail to load:", this._curUrl);
                var t, e = tt.getFileExtension(this._curUrl);
                Ji.LoadableExtensions[e] && (t = si.getRes(this._curUrl), t && t instanceof ti && (t = t.json), t && (t.loadList && this.load(t.loadList, !1, !1), t.loadList3D && this.load(t.loadList3D, !0, !1)));
                "sk" == e && this.load(this._curUrl.replace(".sk", ".png"), !1, !1), this.event(Jt.PROGRESS, this.getProgress()), this._checkNext()
            }
            getProgress() {
                return this.loadedCount / this.totalCount
            }
        }
        Ji.LoadableExtensions = {
            scene: si.JSON,
            scene3d: si.JSON,
            ani: si.JSON,
            ui: si.JSON,
            prefab: si.PREFAB
        }, Ji.No3dLoadTypes = {
            png: !0,
            jpg: !0,
            txt: !0
        };
        class ts extends Oe {
            constructor(t = !0) {
                super(), this.autoDestroyAtClosed = !1, this.url = null, this._viewCreated = !1, this._idMap = null, this._$componentType = "Scene", ts.unDestroyedScenes.push(this), this._scene = this, t && this.createChildren()
            }
            createChildren() {}
            static setUIMap(t) {
                let e = s.loader.getRes(t);
                if (!e) throw "请提前加载uimap的json，再使用该接口设置！";
                for (let t in e) s.Loader.loadedMap[P.formatURL(t + ".scene")] = e[t]
            }
            loadScene(t) {
                var e = t.indexOf(".") > -1 ? t : t + ".scene",
                    i = s.loader.getRes(e);
                if (i) this.createView(i);
                else {
                    this._setBit(be.NOT_READY, !0), s.loader.resetProgress();
                    var r = new Ji;
                    r.on(Jt.COMPLETE, this, this._onSceneLoaded, [e]), r.load(e)
                }
            }
            _onSceneLoaded(t) {
                this.createView(s.Loader.getRes(t))
            }
            createView(t) {
                t && !this._viewCreated && (this._viewCreated = !0, Ti.createByData(this, t))
            }
            getNodeByID(t) {
                return this._idMap ? this._idMap[t] : null
            }
            open(t = !0, e = null) {
                t && ts.closeAll(), ts.root.addChild(this), this.onOpened(e)
            }
            onOpened(t) {}
            close(t = null) {
                this.onClosed(t), this.autoDestroyAtClosed ? this.destroy() : this.removeSelf()
            }
            onClosed(t = null) {}
            destroy(t = !0) {
                this._idMap = null, super.destroy(t);
                for (var e = ts.unDestroyedScenes, i = e.length - 1; i > -1; i--)
                    if (e[i] === this) return void e.splice(i, 1)
            }
            set scaleX(t) {
                super.get_scaleX() != t && (super.set_scaleX(t), this.event(Jt.RESIZE))
            }
            get scaleX() {
                return super.scaleX
            }
            set scaleY(t) {
                super.get_scaleY() != t && (super.set_scaleY(t), this.event(Jt.RESIZE))
            }
            get scaleY() {
                return super.scaleY
            }
            get width() {
                if (this._width) return this._width;
                for (var t = 0, e = this.numChildren - 1; e > -1; e--) {
                    var i = this.getChildAt(e);
                    i._visible && (t = Math.max(i._x + i.width * i.scaleX, t))
                }
                return t
            }
            set width(t) {
                super.get_width() != t && (super.set_width(t), this.callLater(this._sizeChanged))
            }
            get height() {
                if (this._height) return this._height;
                for (var t = 0, e = this.numChildren - 1; e > -1; e--) {
                    var i = this.getChildAt(e);
                    i._visible && (t = Math.max(i._y + i.height * i.scaleY, t))
                }
                return t
            }
            set height(t) {
                super.get_height() != t && (super.set_height(t), this.callLater(this._sizeChanged))
            }
            _sizeChanged() {
                this.event(Jt.RESIZE)
            }
            static get root() {
                return ts._root || (ts._root = s.stage.addChild(new Oe), ts._root.name = "root", s.stage.on("resize", null, () => {
                    ts._root.size(s.stage.width, s.stage.height), ts._root.event(Jt.RESIZE)
                }), ts._root.size(s.stage.width, s.stage.height), ts._root.event(Jt.RESIZE)), ts._root
            }
            get timer() {
                return this._timer || s.timer
            }
            set timer(t) {
                this._timer = t
            }
            static load(t, e = null, i = null) {
                function r(t) {
                    ts._loadPage && ts._loadPage.event("progress", t), i && i.runWith(t)
                }

                function a() {
                    n.off(Jt.PROGRESS, null, r);
                    var i = s.Loader.getRes(t);
                    if (!i) throw "Can not find scene:" + t;
                    if (!i.props) throw "Scene data is error:" + t;
                    var a = i.props.runtime ? i.props.runtime : i.type,
                        h = s.ClassUtils.getClass(a);
                    if ("instance" == i.props.renderType) var o = h.instance || (h.instance = new h);
                    else o = new h;
                    if (!(o && o instanceof Fe)) throw "Can not find scene:" + a;
                    o.url = t, o._viewCreated ? e && e.runWith(o) : (o.on("onViewCreated", null, function() {
                        e && e.runWith(o)
                    }), o.createView(i)), ts.hideLoadingPage()
                }
                s.loader.resetProgress();
                var n = new Ji;
                n.on(Jt.PROGRESS, null, r), n.once(Jt.COMPLETE, null, a), n.load(t)
            }
            static open(t, e = !0, i = null, s = null, r = null) {
                if (i instanceof w) {
                    var a = s;
                    s = i, i = a
                }
                ts.showLoadingPage(), ts.load(t, w.create(null, this._onSceneLoaded, [e, s, i]), r)
            }
            static _onSceneLoaded(t, e, i, s) {
                s.open(t, i), e && e.runWith(s)
            }
            static close(t, e = "") {
                for (var i = !1, s = ts.unDestroyedScenes, r = 0, a = s.length; r < a; r++) {
                    var n = s[r];
                    n && n.parent && n.url === t && n.name == e && (n.close(), i = !0)
                }
                return i
            }
            static closeAll() {
                for (var t = ts.root, e = 0, i = t.numChildren; e < i; e++) {
                    var s = t.getChildAt(0);
                    s instanceof ts ? s.close("closeByCloseAll") : s.removeSelf()
                }
            }
            static destroy(t, e = "") {
                for (var i = !1, s = [].concat(ts.unDestroyedScenes), r = 0, a = s.length; r < a; r++) {
                    var n = s[r];
                    n.url !== t || n.name != e || n.destroyed || (n.destroy(), i = !0)
                }
                return i
            }
            static gc() {
                D.destroyUnusedResources()
            }
            static setLoadingPage(t) {
                ts._loadPage != t && (ts._loadPage = t)
            }
            static showLoadingPage(t = null, e = 500) {
                ts._loadPage && (s.systemTimer.clear(null, ts._showLoading), s.systemTimer.clear(null, ts._hideLoading), s.systemTimer.once(e, null, ts._showLoading, [t], !1))
            }
            static _showLoading(t) {
                s.stage.addChild(ts._loadPage), ts._loadPage.onOpened(t)
            }
            static _hideLoading() {
                ts._loadPage.close()
            }
            static hideLoadingPage(t = 500) {
                ts._loadPage && (s.systemTimer.clear(null, ts._showLoading), s.systemTimer.clear(null, ts._hideLoading), s.systemTimer.once(t, null, ts._hideLoading))
            }
        }
        ts.unDestroyedScenes = [], s.regClass(ts), Pe.regClass("laya.display.Scene", ts), Pe.regClass("Laya.Scene", ts);
        class es {
            static create(t) {
                var e = r.getItemByClass("DrawParticleCmd", es);
                return e._templ = t, e
            }
            recover() {
                this._templ = null, r.recover("DrawParticleCmd", this)
            }
            run(t, e, i) {
                t.drawParticle(e, i, this._templ)
            }
            get cmdID() {
                return es.ID
            }
        }
        es.ID = "DrawParticleCmd";
        class is {
            constructor() {}
            paramChanged() {
                Fi.systemTimer.callLater(this, this.buildFilter)
            }
            buildFilter() {
                this._target && this.addFilter(this._target)
            }
            addFilter(t) {
                var e;
                t && (t.filters ? (e = t.filters, e.indexOf(this._filter) < 0 && (e.push(this._filter), t.filters = tt.copyArray([], e))) : t.filters = [this._filter])
            }
            removeFilter(t) {
                t && (t.filters = null)
            }
            set target(t) {
                this._target != t && (this._target = t, this.paramChanged())
            }
        }
        class ss {
            render(t, e, i, s, r) {
                var a = Z.create(H.TEXTURE2D, 0);
                this.setShaderInfo(a, r, t.width, t.height), e.drawTarget(t, 0, 0, i, s, f.EMPTY.identity(), a)
            }
            setShaderInfo(t, e, i, s) {
                t.defines.add(J.BLUR);
                var r = t;
                ss.blurinfo[0] = i, ss.blurinfo[1] = s, r.blurInfo = ss.blurinfo;
                var a = e.strength / 3,
                    n = a * a;
                e.strength_sig2_2sig2_gauss1[0] = e.strength, e.strength_sig2_2sig2_gauss1[1] = n, e.strength_sig2_2sig2_gauss1[2] = 2 * n, e.strength_sig2_2sig2_gauss1[3] = 1 / (2 * Math.PI * n), r.strength_sig2_2sig2_gauss1 = e.strength_sig2_2sig2_gauss1
            }
        }
        ss.blurinfo = new Array(2);
        class rs extends J {
            constructor(t = 4) {
                super(), this.strength_sig2_2sig2_gauss1 = [], this.strength = t, this._glRender = new ss
            }
            get type() {
                return J.BLUR
            }
            getStrenth_sig2_2sig2_native() {
                this.strength_sig2_native || (this.strength_sig2_native = new Float32Array(4));
                var t = this.strength / 3,
                    e = t * t;
                return this.strength_sig2_native[0] = this.strength, this.strength_sig2_native[1] = e, this.strength_sig2_native[2] = 2 * e, this.strength_sig2_native[3] = 1 / (2 * Math.PI * e), this.strength_sig2_native
            }
        }
        class as extends is {
            constructor() {
                super(), this._strength = 4, this._filter = new rs(this.strength)
            }
            buildFilter() {
                this._filter = new rs(this.strength), super.buildFilter()
            }
            get strength() {
                return this._strength
            }
            set strength(t) {
                this._strength = t
            }
        }
        Pe.regClass("laya.effect.BlurFilterSetter", as), Pe.regClass("Laya.BlurFilterSetter", as);
        class ns {
            render(t, e, i, s, r) {
                var a = Z.create(H.TEXTURE2D, 0);
                this.setShaderInfo(a, r, t.width, t.height), e.drawTarget(t, 0, 0, i, s, f.EMPTY.identity(), a)
            }
            setShaderInfo(t, e, i, s) {
                t.defines.add(J.MOSAIC);
                var r = t;
                r.grid = Math.ceil(i / e._blockSize)
            }
        }
        class hs extends J {
            constructor(t) {
                super(), this._blockSize = t, this._glRender = new ns
            }
            get type() {
                return J.MOSAIC
            }
            get blockSize() {
                return this._blockSize
            }
            set blockSize(t) {
                this._blockSize = t
            }
        }
        class os extends is {
            constructor() {
                super(), this._blockSize = 20, this._filter = new hs(this.blockSize)
            }
            buildFilter() {
                this._filter = new hs(this.blockSize), super.buildFilter()
            }
            get blockSize() {
                return this._blockSize
            }
            set blockSize(t) {
                this._blockSize = t
            }
        }
        Pe.regClass("laya.effect.MosaicFilterSetter", os), Pe.regClass("Laya.MosaicFilterSetter", os);
        class ls {
            constructor() {
                this._curState = 0, this.effectScale = 1.5, this.tweenTime = 300
            }
            set target(t) {
                this._tar = t, t.on(Jt.MOUSE_DOWN, this, this.toChangedState), t.on(Jt.MOUSE_UP, this, this.toInitState), t.on(Jt.MOUSE_OUT, this, this.toInitState)
            }
            toChangedState() {
                this._curState = 1, this._curTween && ui.clear(this._curTween), this._curTween = ui.to(this._tar, {
                    scaleX: this.effectScale,
                    scaleY: this.effectScale
                }, this.tweenTime, _i[this.effectEase], w.create(this, this.tweenComplete))
            }
            toInitState() {
                2 != this._curState && (this._curTween && ui.clear(this._curTween), this._curState = 2, this._curTween = ui.to(this._tar, {
                    scaleX: 1,
                    scaleY: 1
                }, this.tweenTime, _i[this.backEase], w.create(this, this.tweenComplete)))
            }
            tweenComplete() {
                this._curState = 0, this._curTween = null
            }
        }
        class _s extends is {
            constructor() {
                super(), this._brightness = 0, this._contrast = 0, this._saturation = 0, this._hue = 0, this._red = 0, this._green = 0, this._blue = 0, this._alpha = 0, this._filter = new it
            }
            buildFilter() {
                this._filter.reset(), this._filter.color(this.red, this.green, this.blue, this.alpha), this._filter.adjustHue(this.hue), this._filter.adjustContrast(this.contrast), this._filter.adjustBrightness(this.brightness), this._filter.adjustSaturation(this.saturation), super.buildFilter()
            }
            get brightness() {
                return this._brightness
            }
            set brightness(t) {
                this._brightness = t, this.paramChanged()
            }
            get contrast() {
                return this._contrast
            }
            set contrast(t) {
                this._contrast = t, this.paramChanged()
            }
            get saturation() {
                return this._saturation
            }
            set saturation(t) {
                this._saturation = t, this.paramChanged()
            }
            get hue() {
                return this._hue
            }
            set hue(t) {
                this._hue = t, this.paramChanged()
            }
            get red() {
                return this._red
            }
            set red(t) {
                this._red = t, this.paramChanged()
            }
            get green() {
                return this._green
            }
            set green(t) {
                this._green = t, this.paramChanged()
            }
            get blue() {
                return this._blue
            }
            set blue(t) {
                this._blue = t, this.paramChanged()
            }
            get color() {
                return this._color
            }
            set color(t) {
                var e;
                this._color = t, e = et.create(t), this._red = 255 * e.arrColor[0], this._green = 255 * e.arrColor[1], this._blue = 255 * e.arrColor[2], this.paramChanged()
            }
            get alpha() {
                return this._alpha
            }
            set alpha(t) {
                this._alpha = t, this.paramChanged()
            }
        }
        Pe.regClass("laya.effect.ColorFilterSetter", _s), Pe.regClass("Laya.ColorFilterSetter", _s);
        class us extends di {
            constructor() {
                super(...arguments), this.duration = 1e3, this.delay = 0, this.repeat = 0, this.autoDestroyAtComplete = !0
            }
            _onAwake() {
                this.target = this.target || this.owner, this.autoDestroyAtComplete && (this._comlete = w.create(this.target, this.target.destroy, null, !1)), this.eventName ? this.owner.on(this.eventName, this, this._exeTween) : this._exeTween()
            }
            _exeTween() {
                this._tween = this._doTween(), this._tween.repeat = this.repeat
            }
            _doTween() {
                return null
            }
            onReset() {
                this.duration = 1e3, this.delay = 0, this.repeat = 0, this.ease = null, this.target = null, this.eventName && (this.owner.off(this.eventName, this, this._exeTween), this.eventName = null), this._comlete && (this._comlete.recover(), this._comlete = null), this._tween && (this._tween.clear(), this._tween = null)
            }
        }
        class cs extends us {
            _doTween() {
                return this.target.alpha = 0, ui.to(this.target, {
                    alpha: 1
                }, this.duration, _i[this.ease], this._comlete, this.delay)
            }
        }
        class ds extends us {
            _doTween() {
                return this.target.alpha = 1, ui.to(this.target, {
                    alpha: 0
                }, this.duration, _i[this.ease], this._comlete, this.delay)
            }
        }
        class ps {
            setShaderInfo(t, e, i, s) {
                t.defines.add(s.type);
                var r = t;
                r.u_blurInfo1 = s._sv_blurInfo1;
                var a = s._sv_blurInfo2;
                a[0] = e, a[1] = i, r.u_blurInfo2 = a, r.u_color = s.getColor()
            }
            render(t, e, i, s, r) {
                var a = i,
                    n = s,
                    h = Z.create(H.TEXTURE2D, 0);
                this.setShaderInfo(h, a, n, r);
                var o = Z.create(H.TEXTURE2D, 0),
                    l = f.TEMP.identity();
                e.drawTarget(t, 0, 0, a, n, l, h), e.drawTarget(t, 0, 0, a, n, l, o)
            }
        }
        class fs extends J {
            constructor(t, e = 4, i = 6, s = 6) {
                super(), this._elements = new Float32Array(9), this._sv_blurInfo1 = new Array(4), this._sv_blurInfo2 = [0, 0, 1, 0], this._color = new et(t), this.blur = Math.min(e, 20), this.offX = i, this.offY = s, this._sv_blurInfo1[0] = this._sv_blurInfo1[1] = this.blur, this._sv_blurInfo1[2] = i, this._sv_blurInfo1[3] = -s, this._glRender = new ps
            }
            get type() {
                return rs.GLOW
            }
            get offY() {
                return this._elements[6]
            }
            set offY(t) {
                this._elements[6] = t, this._sv_blurInfo1[3] = -t
            }
            get offX() {
                return this._elements[5]
            }
            set offX(t) {
                this._elements[5] = t, this._sv_blurInfo1[2] = t
            }
            getColor() {
                return this._color.arrColor
            }
            get blur() {
                return this._elements[4]
            }
            set blur(t) {
                this._elements[4] = t, this._sv_blurInfo1[0] = this._sv_blurInfo1[1] = t
            }
            getColorNative() {
                this._color_native || (this._color_native = new Float32Array(4));
                var t = this.getColor();
                return this._color_native[0] = t[0], this._color_native[1] = t[1], this._color_native[2] = t[2], this._color_native[3] = t[3], this._color_native
            }
            getBlurInfo1Native() {
                return this._blurInof1_native || (this._blurInof1_native = new Float32Array(4)), this._blurInof1_native[0] = this._blurInof1_native[1] = this.blur, this._blurInof1_native[2] = this.offX, this._blurInof1_native[3] = this.offY, this._blurInof1_native
            }
            getBlurInfo2Native() {
                return this._blurInof2_native || (this._blurInof2_native = new Float32Array(4)), this._blurInof2_native[2] = 1, this._blurInof2_native
            }
        }
        class ms extends is {
            constructor() {
                super(), this._color = "#ff0000", this._blur = 4, this._offX = 6, this._offY = 6, this._filter = new fs(this._color)
            }
            buildFilter() {
                this._filter = new fs(this.color, this.blur, this.offX, this.offY), super.buildFilter()
            }
            get color() {
                return this._color
            }
            set color(t) {
                this._color = t, this.paramChanged()
            }
            get blur() {
                return this._blur
            }
            set blur(t) {
                this._blur = t, this.paramChanged()
            }
            get offX() {
                return this._offX
            }
            set offX(t) {
                this._offX = t, this.paramChanged()
            }
            get offY() {
                return this._offY
            }
            set offY(t) {
                this._offY = t, this.paramChanged()
            }
        }
        Pe.regClass("laya.effect.GlowFilterSetter", ms), Pe.regClass("Laya.GlowFilterSetter", ms);
        class gs {}
        gs.STANDARD = 0, gs.LEFT = 1, gs.RIGHT = 2, gs.NUM_PAD = 3;
        class Ts {}
        Ts.NUMBER_0 = 48, Ts.NUMBER_1 = 49, Ts.NUMBER_2 = 50, Ts.NUMBER_3 = 51, Ts.NUMBER_4 = 52, Ts.NUMBER_5 = 53, Ts.NUMBER_6 = 54, Ts.NUMBER_7 = 55, Ts.NUMBER_8 = 56, Ts.NUMBER_9 = 57, Ts.A = 65, Ts.B = 66, Ts.C = 67, Ts.D = 68, Ts.E = 69, Ts.F = 70, Ts.G = 71, Ts.H = 72, Ts.I = 73, Ts.J = 74, Ts.K = 75, Ts.L = 76, Ts.M = 77, Ts.N = 78, Ts.O = 79, Ts.P = 80, Ts.Q = 81, Ts.R = 82, Ts.S = 83, Ts.T = 84, Ts.U = 85, Ts.V = 86, Ts.W = 87, Ts.X = 88, Ts.Y = 89, Ts.Z = 90, Ts.F1 = 112, Ts.F2 = 113, Ts.F3 = 114, Ts.F4 = 115,
            Ts.F5 = 116, Ts.F6 = 117, Ts.F7 = 118, Ts.F8 = 119, Ts.F9 = 120, Ts.F10 = 121, Ts.F11 = 122, Ts.F12 = 123, Ts.F13 = 124, Ts.F14 = 125, Ts.F15 = 126, Ts.NUMPAD = 21, Ts.NUMPAD_0 = 96, Ts.NUMPAD_1 = 97, Ts.NUMPAD_2 = 98, Ts.NUMPAD_3 = 99, Ts.NUMPAD_4 = 100, Ts.NUMPAD_5 = 101, Ts.NUMPAD_6 = 102, Ts.NUMPAD_7 = 103, Ts.NUMPAD_8 = 104, Ts.NUMPAD_9 = 105, Ts.NUMPAD_ADD = 107, Ts.NUMPAD_DECIMAL = 110, Ts.NUMPAD_DIVIDE = 111, Ts.NUMPAD_ENTER = 108, Ts.NUMPAD_MULTIPLY = 106, Ts.NUMPAD_SUBTRACT = 109, Ts.SEMICOLON = 186, Ts.EQUAL = 187, Ts.COMMA = 188, Ts.MINUS = 189, Ts.PERIOD = 190, Ts.SLASH = 191, Ts.BACKQUOTE = 192, Ts.LEFTBRACKET = 219, Ts.BACKSLASH = 220, Ts.RIGHTBRACKET = 221, Ts.QUOTE = 222, Ts.ALTERNATE = 18, Ts.BACKSPACE = 8, Ts.CAPS_LOCK = 20, Ts.COMMAND = 15, Ts.CONTROL = 17, Ts.DELETE = 46, Ts.ENTER = 13, Ts.ESCAPE = 27, Ts.PAGE_UP = 33, Ts.PAGE_DOWN = 34, Ts.END = 35, Ts.HOME = 36, Ts.LEFT = 37, Ts.UP = 38, Ts.RIGHT = 39, Ts.DOWN = 40, Ts.SHIFT = 16, Ts.SPACE = 32, Ts.TAB = 9, Ts.INSERT = 45;
        class vs {
            constructor(t, e, i, s) {
                this._idata = []
            }
            getArrayData() {
                return this._idata
            }
            getPtrID() {
                return 0
            }
            beginEncoding() {}
            endEncoding() {}
            clearEncoding() {
                this._idata.length = 0
            }
            getCount() {
                return this._idata.length
            }
            add_ShaderValue(t) {
                this._idata.push(t)
            }
            addShaderUniform(t) {
                this.add_ShaderValue(t)
            }
        }
        class xs {
            static uploadShaderUniforms(t, e, i, s) {
                for (var r = i._data, a = e.getArrayData(), n = 0, h = 0, o = a.length; h < o; h++) {
                    var l = a[h];
                    if (s || -1 !== l.textureID) {
                        var _ = r[l.dataOffset];
                        null != _ && (n += l.fun.call(l.caller, l, _))
                    }
                }
                return n
            }
            static uploadCustomUniform(t, e, i, s) {
                var r = 0,
                    a = e[i];
                return a && null != s && (r += a.fun.call(a.caller, a, s)), r
            }
            static uploadShaderUniformsForNative(t, e, i) {
                var s = T.UPLOAD_SHADER_UNIFORM_TYPE_ID;
                i._runtimeCopyValues.length > 0 && (s = T.UPLOAD_SHADER_UNIFORM_TYPE_DATA);
                var r = i._data;
                return T.instance.uploadShaderUniforms(e, r, s)
            }
        }
        class ys {
            constructor() {}
            static getMCDName(t) {
                return ys._typeToNameDic[t]
            }
            static showRenderTypeInfo(t, e = !1) {
                if (e || !ys.showedDic[t]) {
                    if (ys.showedDic[t] = !0, !ys._rendertypeToStrDic[t]) {
                        var i, s = [];
                        for (i = 1; i <= t;) i & t && s.push(ys.getMCDName(i & t)), i <<= 1;
                        ys._rendertypeToStrDic[t] = s.join(",")
                    }
                    console.log("cmd:", ys._rendertypeToStrDic[t])
                }
            }
            static __init__() {
                ys._typeToNameDic[ve.ALPHA] = "ALPHA", ys._typeToNameDic[ve.TRANSFORM] = "TRANSFORM", ys._typeToNameDic[ve.TEXTURE] = "TEXTURE", ys._typeToNameDic[ve.GRAPHICS] = "GRAPHICS", ys._typeToNameDic[ve.ONECHILD] = "ONECHILD", ys._typeToNameDic[ve.CHILDS] = "CHILDS", ys._typeToNameDic[ve.TRANSFORM | ve.ALPHA] = "TRANSFORM|ALPHA", ys._typeToNameDic[ve.CANVAS] = "CANVAS", ys._typeToNameDic[ve.BLEND] = "BLEND", ys._typeToNameDic[ve.FILTERS] = "FILTERS", ys._typeToNameDic[ve.MASK] = "MASK", ys._typeToNameDic[ve.CLIP] = "CLIP", ys._typeToNameDic[ve.LAYAGL3D] = "LAYAGL3D"
            }
            render(t, e, i) {
                ys._addType(this._renderType), ys.showRenderTypeInfo(this._renderType), we.renders[this._renderType]._fun(this, t, e + this._x, i + this._y), this._repaint = 0
            }
            _stageRender(t, e, i) {
                ys._countStart(), ys._PreStageRender.call(s.stage, t, e, i), ys._countEnd()
            }
            static _countStart() {
                var t;
                for (t in ys._countDic) ys._countDic[t] = 0
            }
            static _countEnd() {
                ys._i++, ys._i > 60 && (ys.showCountInfo(), ys._i = 0)
            }
            static _addType(t) {
                ys._countDic[t] ? ys._countDic[t] += 1 : ys._countDic[t] = 1
            }
            static showCountInfo() {
                var t;
                for (t in console.log("==================="), ys._countDic) console.log("count:" + ys._countDic[t]), ys.showRenderTypeInfo(t, !0)
            }
            static enableQuickTest() {
                ys.__init__(), Oe.prototype.render = ys.prototype.render, ys._PreStageRender = ze.prototype.render, ze.prototype.render = ys.prototype._stageRender
            }
        }
        ys.showedDic = {}, ys._rendertypeToStrDic = {}, ys._typeToNameDic = {}, ys._countDic = {}, ys._i = 0;
        class Es extends M {
            load(t) {}
            play(t = 0, e = 0) {
                return null
            }
            get duration() {
                return 0
            }
            dispose() {}
        }
        class As extends Oe {
            constructor() {
                super(), this.visible = !1, this.on(Jt.ADDED, this, this._onParentChange), this.on(Jt.REMOVED, this, this._onParentChange)
            }
            _onParentChange() {
                this.target = this.parent
            }
            play(t = 1, e = null) {
                isNaN(t) && (t = 1), this.url && (this.stop(), this._channel = Je.playSound(this.url, t, e))
            }
            stop() {
                this._channel && !this._channel.isStopped && this._channel.stop(), this._channel = null
            }
            _setPlayAction(t, e, i, s = !0) {
                this[i] && t && (s ? t.on(e, this, this[i]) : t.off(e, this, this[i]))
            }
            _setPlayActions(t, e, i, s = !0) {
                if (t && e) {
                    var r, a, n = e.split(",");
                    for (a = n.length, r = 0; r < a; r++) this._setPlayAction(t, n[r], i, s)
                }
            }
            set playEvent(t) {
                this._playEvents = t, t && this._tar && this._setPlayActions(this._tar, t, "play")
            }
            set target(t) {
                this._tar && (this._setPlayActions(this._tar, this._playEvents, "play", !1), this._setPlayActions(this._tar, this._stopEvents, "stop", !1)), this._tar = t, this._tar && (this._setPlayActions(this._tar, this._playEvents, "play", !0), this._setPlayActions(this._tar, this._stopEvents, "stop", !0))
            }
            set stopEvent(t) {
                this._stopEvents = t, t && this._tar && this._setPlayActions(this._tar, t, "stop")
            }
        }
        Pe.regClass("laya.media.SoundNode", As), Pe.regClass("Laya.SoundNode", As);
        class Cs {
            static enable(t, e, i = 2) {
                Cs.type = i, s.loader.load(t, w.create(null, Cs.onManifestLoaded, [e]), null, si.JSON)
            }
            static onManifestLoaded(t, e) {
                Cs.manifest = e, P.customFormat = Cs.addVersionPrefix, t.run(), e || console.warn("资源版本清单文件不存在，不使用资源版本管理。忽略ERR_FILE_NOT_FOUND错误。")
            }
            static addVersionPrefix(t) {
                return Cs.manifest && Cs.manifest[t] ? Cs.type == Cs.FILENAME_VERSION ? Cs.manifest[t] : Cs.manifest[t] + "/" + t : t
            }
        }
        Cs.FOLDER_VERSION = 1, Cs.FILENAME_VERSION = 2, Cs.type = Cs.FOLDER_VERSION;
        class Rs extends M {
            constructor(t = null, e = 0, i = null, s = null) {
                super(), this.disableInput = !1, this.protocols = [], this._byteClass = i || F, this.protocols = s, this.endian = Rs.BIG_ENDIAN, t && e > 0 && e < 65535 && this.connect(t, e)
            }
            get input() {
                return this._input
            }
            get output() {
                return this._output
            }
            get connected() {
                return this._connected
            }
            get endian() {
                return this._endian
            }
            set endian(t) {
                this._endian = t, null != this._input && (this._input.endian = t), null != this._output && (this._output.endian = t)
            }
            connect(t, e) {
                var i = "ws://" + t + ":" + e;
                this.connectByUrl(i)
            }
            connectByUrl(t) {
                null != this._socket && this.close(), this._socket && this.cleanSocket(), this.protocols && 0 != this.protocols.length ? this._socket = new ae.window.WebSocket(t, this.protocols) : this._socket = new ae.window.WebSocket(t), this._socket.binaryType = "arraybuffer", this._output = new this._byteClass, this._output.endian = this.endian, this._input = new this._byteClass, this._input.endian = this.endian, this._addInputPosition = 0, this._socket.onopen = (t => {
                    this._onOpen(t)
                }), this._socket.onmessage = (t => {
                    this._onMessage(t)
                }), this._socket.onclose = (t => {
                    this._onClose(t)
                }), this._socket.onerror = (t => {
                    this._onError(t)
                })
            }
            cleanSocket() {
                this.close(), this._connected = !1, this._socket.onopen = null, this._socket.onmessage = null, this._socket.onclose = null, this._socket.onerror = null, this._socket = null
            }
            close() {
                if (null != this._socket) try {
                    this._socket.close()
                } catch (t) {}
            }
            _onOpen(t) {
                this._connected = !0, this.event(Jt.OPEN, t)
            }
            _onMessage(t) {
                if (t && t.data) {
                    var e = t.data;
                    if (this.disableInput && e) this.event(Jt.MESSAGE, e);
                    else {
                        this._input.length > 0 && this._input.bytesAvailable < 1 && (this._input.clear(), this._addInputPosition = 0);
                        var i = this._input.pos;
                        !this._addInputPosition && (this._addInputPosition = 0), this._input.pos = this._addInputPosition, e && ("string" == typeof e ? this._input.writeUTFBytes(e) : this._input.writeArrayBuffer(e), this._addInputPosition = this._input.pos, this._input.pos = i), this.event(Jt.MESSAGE, e)
                    }
                }
            }
            _onClose(t) {
                this._connected = !1, this.event(Jt.CLOSE, t)
            }
            _onError(t) {
                this.event(Jt.ERROR, t)
            }
            send(t) {
                this._socket.send(t)
            }
            flush() {
                if (this._output && this._output.length > 0) {
                    var t;
                    try {
                        this._socket && this._socket.send(this._output.__getBuffer().slice(0, this._output.length))
                    } catch (e) {
                        t = e
                    }
                    this._output.endian = this.endian, this._output.clear(), t && this.event(Jt.ERROR, t)
                }
            }
        }
        Rs.LITTLE_ENDIAN = "littleEndian", Rs.BIG_ENDIAN = "bigEndian", Wi = t.TextureDecodeFormat || (t.TextureDecodeFormat = {}), Wi[Wi.Normal = 0] = "Normal", Wi[Wi.RGBM = 1] = "RGBM";
        class bs extends B {
            constructor() {
                var e = T.instance;
                super(e.RGB, !1), this._glTextureType = e.TEXTURE_2D, this._width = 1, this._height = 1, this._wrapModeU = this._wrapModeV = t.WarpMode.Clamp, this._filterMode = t.FilterMode.Bilinear, this._setWarpMode(e.TEXTURE_WRAP_S, this._wrapModeU), this._setWarpMode(e.TEXTURE_WRAP_T, this._wrapModeV), this._setFilterMode(this._filterMode), this._needUpdate = !1, this._readyed = !0, bs._videoTexturePool.push(this)
            }
            static _update() {
                for (var t = bs._videoTexturePool, e = 0, i = t.length; e < i; e++) {
                    var s = t[e];
                    s && s._updateVideoData()
                }
            }
            get video() {
                return this._video
            }
            set video(t) {
                t && t instanceof HTMLVideoElement && (this._video = t, Fi.Browser.onMobile && (this._video["x5-playsInline"] = !0, this._video["x5-playsinline"] = !0, this._video.x5PlaysInline = !0, this._video.playsInline = !0, this._video["webkit-playsInline"] = !0, this._video["webkit-playsinline"] = !0, this._video.webkitPlaysInline = !0, this._video.playsinline = !0, this._video.style.playsInline = !0, this._video.crossOrigin = "anonymous", this._video.setAttribute("crossorigin", "anonymous"), this._video.setAttribute("playsinline", "true"), this._video.setAttribute("x5-playsinline", "true"), this._video.setAttribute("webkit-playsinline", "true"), this._video.autoplay = !0))
            }
            _updateVideoData() {
                if (this._video && this._needUpdate) {
                    var t = T.instance;
                    S.bindTexture(t, this._glTextureType, this._glTexture), t.texImage2D(this._glTextureType, 0, t.RGB, t.RGB, t.UNSIGNED_BYTE, this._video)
                }
            }
            videoPlay() {
                this._video.play(), this._needUpdate = !0
            }
            videoPause() {
                this._video.pause(), this._needUpdate = !1
            }
            destroy() {
                super.destroy(), this._video = null
            }
        }
        bs._videoTexturePool = new Array;
        class Ss {
            static changeDefinition(t, e) {
                window.Laya[t] = e;
                var i = t + "=classObj";
                window.eval(i)
            }
        }
        class ws {
            constructor() {
                this.reset()
            }
            setData(t, e, i, s) {
                return this.char = t, this.charNum = t.charCodeAt(0), this.x = this.y = 0, this.width = e, this.height = i, this.style = s, this.isWord = !ws._isWordRegExp.test(t), this
            }
            reset() {
                return this.x = this.y = this.width = this.height = 0, this.isWord = !1, this.char = null, this.charNum = 0, this.style = null, this
            }
            recover() {
                r.recover("HTMLChar", this.reset())
            }
            static create() {
                return r.getItemByClass("HTMLChar", ws)
            }
            _isChar() {
                return !0
            }
            _getCSSStyle() {
                return this.style
            }
        }
        ws._isWordRegExp = new RegExp("[\\w.]", "");
        class Ms {
            static enable() {
                Ms._logdiv || (Ms._logdiv = ae.createElement("div"), Ms._logdiv.style.cssText = "border:white;padding:4px;overflow-y:auto;z-index:1000000;background:rgba(100,100,100,0.6);color:white;position: absolute;left:0px;top:0px;width:100%;height:50%;", ae.document.body.appendChild(Ms._logdiv), Ms._btn = ae.createElement("button"), Ms._btn.innerText = "Hide", Ms._btn.style.cssText = "z-index:1000001;position: absolute;left:10px;top:10px;", Ms._btn.onclick = Ms.toggle, ae.document.body.appendChild(Ms._btn))
            }
            static toggle() {
                var t = Ms._logdiv.style;
                "" === t.display ? (Ms._btn.innerText = "Show", t.display = "none") : (Ms._btn.innerText = "Hide", t.display = "")
            }
            static print(t) {
                Ms._logdiv && (Ms._count >= Ms.maxCount && Ms.clear(), Ms._count++, Ms._logdiv.innerText += t + "\n", Ms.autoScrollToBottom && Ms._logdiv.scrollHeight - Ms._logdiv.scrollTop - Ms._logdiv.clientHeight < 50 && (Ms._logdiv.scrollTop = Ms._logdiv.scrollHeight))
            }
            static clear() {
                Ms._logdiv.innerText = "", Ms._count = 0
            }
        }
        Ms._count = 0, Ms.maxCount = 50, Ms.autoScrollToBottom = !0;
        let Is = 300;
        class Ps {
            constructor(t, e, i, s) {
                this.scale = 1, this.datas = new Array(Is), this.datapos = 0, this.id = t, this.color = e, this.name = i, this.scale = s
            }
            addData(t) {
                this.datas[this.datapos] = t, this.datapos++, this.datapos %= Is
            }
        }
        class Ds extends Oe {
            constructor() {
                super(), this.datas = [], this.xdata = new Array(Ds.DATANUM), this.ydata = new Array(Ds.DATANUM), this.hud_width = 800, this.hud_height = 200, this.gMinV = 0, this.gMaxV = 100, this.textSpace = 40, this.sttm = 0, Ds.inst = this, this._renderType |= ve.CUSTOM, this._setRenderType(this._renderType), this._setCustomRender(), this.addDataDef(0, 16777215, "frame", 1), this.addDataDef(1, 65280, "update", 1), this.addDataDef(2, 16711680, "flush", 1), Ds._now = performance ? performance.now.bind(performance) : Date.now
            }
            now() {
                return Ds._now()
            }
            start() {
                this.sttm = Ds._now()
            }
            end(t) {
                var e = Ds._now() - this.sttm;
                this.updateValue(t, e)
            }
            config(t, e) {
                this.hud_width = t, this.hud_height = e
            }
            addDataDef(t, e, i, s) {
                this.datas[t] = new Ps(t, e, i, s)
            }
            updateValue(t, e) {
                this.datas[t].addData(e)
            }
            v2y(t) {
                this._y, this.hud_height, this.gMinV, this.gMaxV;
                return this._y + this.hud_height * (1 - (t - this.gMinV) / this.gMaxV)
            }
            drawHLine(t, e, i, s) {
                var r = this._x,
                    a = (this._x, this.hud_width, this.v2y(e));
                t.fillText(s, r, a - 6, null, "green", null), r += this.textSpace, t.fillStyle = i, t.fillRect(r, a, this._x + this.hud_width, 1, null)
            }
            customRender(t, e, i) {
                var s = performance.now();
                Ds._lastTm <= 0 && (Ds._lastTm = s), this.updateValue(0, s - Ds._lastTm), Ds._lastTm = s, t.save(), t.fillRect(this._x, this._y, this.hud_width, this.hud_height + 4, "#000000cc"), t.globalAlpha = .9, this.drawHLine(t, 0, "green", "    0"), this.drawHLine(t, 10, "green", "  10"), this.drawHLine(t, 16.667, "red", " "), this.drawHLine(t, 20, "green", "50|20"), this.drawHLine(t, 33.334, "yellow", ""), this.drawHLine(t, 16.667 * 3, "yellow", ""), this.drawHLine(t, 66.668, "yellow", ""), this.drawHLine(t, 50, "green", "20|50"), this.drawHLine(t, 100, "green", "10|100");
                for (var r = 0, a = this.datas.length; r < a; r++) {
                    var n = this.datas[r];
                    if (n) {
                        var h = n.datas.length,
                            o = (this.hud_width - this.textSpace) / h,
                            l = n.datapos,
                            _ = this._x + this.textSpace;
                        t.fillStyle = n.color;
                        for (var u = h; l < u; l++) {
                            var c = this.v2y(n.datas[l] * n.scale);
                            t.fillRect(_, c, o, this.hud_height + this._y - c, null), _ += o
                        }
                        for (l = 0; l < n.datapos; l++) c = this.v2y(n.datas[l] * n.scale), t.fillRect(_, c, o, this.hud_height + this._y - c, null), _ += o
                    }
                }
                t.restore()
            }
        }
        Ds._lastTm = 0, Ds._now = null, Ds.DATANUM = 300, Ds.drawTexTm = 0;
        class Ls {
            constructor() {
                this.maxCount = 1e3
            }
            getCacheList() {
                return r.getPoolBySign(this.sign)
            }
            tryDispose(t) {
                var e;
                e = r.getPoolBySign(this.sign), e.length > this.maxCount && e.splice(this.maxCount, e.length - this.maxCount)
            }
            static addPoolCacheManager(t, e = 100) {
                var i;
                i = new Ls, i.sign = t, i.maxCount = e, Ae.regCacheByFunction(tt.bind(i.tryDispose, i), tt.bind(i.getCacheList, i))
            }
        }
        class Bs extends M {
            constructor() {
                super(...arguments), this._tweenDic = {}, this._tweenDataList = [], this._currTime = 0, this._lastTime = 0, this._startTime = 0, this._index = 0, this._gidIndex = 0, this._firstTweenDic = {}, this._startTimeSort = !1, this._endTimeSort = !1, this._loopKey = !1, this.scale = 1, this._frameRate = 60, this._frameIndex = 0, this._total = 0
            }
            static to(t, e, i, s = null, r = 0) {
                return (new Bs).to(t, e, i, s, r)
            }
            static from(t, e, i, s = null, r = 0) {
                return (new Bs).from(t, e, i, s, r)
            }
            to(t, e, i, s = null, r = 0) {
                return this._create(t, e, i, s, r, !0)
            }
            from(t, e, i, s = null, r = 0) {
                return this._create(t, e, i, s, r, !1)
            }
            _create(t, e, i, s, a, n) {
                var h = r.getItemByClass("tweenData", Fs);
                return h.isTo = n, h.type = 0, h.target = t, h.duration = i, h.data = e, h.startTime = this._startTime + a, h.endTime = h.startTime + h.duration, h.ease = s, this._startTime = Math.max(h.endTime, this._startTime), this._tweenDataList.push(h), this._startTimeSort = !0, this._endTimeSort = !0, this
            }
            addLabel(t, e) {
                var i = r.getItemByClass("tweenData", Fs);
                return i.type = 1, i.data = t, i.endTime = i.startTime = this._startTime + e, this._labelDic || (this._labelDic = {}), this._labelDic[t] = i, this._tweenDataList.push(i), this
            }
            removeLabel(t) {
                if (this._labelDic && this._labelDic[t]) {
                    var e = this._labelDic[t];
                    if (e) {
                        var i = this._tweenDataList.indexOf(e);
                        i > -1 && this._tweenDataList.splice(i, 1)
                    }
                    delete this._labelDic[t]
                }
            }
            gotoTime(t) {
                if (null != this._tweenDataList && 0 != this._tweenDataList.length) {
                    var e, i, s, a;
                    for (var n in this._firstTweenDic)
                        if (i = this._firstTweenDic[n], i)
                            for (var h in i) h in i.diyTarget && (i.diyTarget[h] = i[h]);
                    for (n in this._tweenDic) e = this._tweenDic[n], e.clear(), delete this._tweenDic[n];
                    if (this._index = 0, this._gidIndex = 0, this._currTime = t, this._lastTime = ae.now(), null == this._endTweenDataList || this._endTimeSort) {
                        function o(t, e) {
                            return t.endTime > e.endTime ? 1 : t.endTime < e.endTime ? -1 : 0
                        }
                        this._endTimeSort = !1, this._endTweenDataList = s = this._tweenDataList.concat(), s.sort(o)
                    } else s = this._endTweenDataList;
                    for (var l = 0, _ = s.length; l < _; l++)
                        if (a = s[l], 0 == a.type) {
                            if (!(t >= a.endTime)) break;
                            this._index = Math.max(this._index, l + 1);
                            var u = a.data;
                            if (a.isTo)
                                for (var c in u) a.target[c] = u[c]
                        }
                    for (l = 0, _ = this._tweenDataList.length; l < _; l++) a = this._tweenDataList[l], 0 == a.type && t >= a.startTime && t < a.endTime && (this._index = Math.max(this._index, l + 1), this._gidIndex++, e = r.getItemByClass("tween", ui), e._create(a.target, a.data, a.duration, a.ease, w.create(this, this._animComplete, [this._gidIndex]), 0, !1, a.isTo, !0, !1), e.setStartTime(this._currTime - (t - a.startTime)), e._updateEase(this._currTime), e.gid = this._gidIndex, this._tweenDic[this._gidIndex] = e)
                }
            }
            gotoLabel(t) {
                if (null != this._labelDic) {
                    var e = this._labelDic[t];
                    e && this.gotoTime(e.startTime)
                }
            }
            pause() {
                s.timer.clear(this, this._update)
            }
            resume() {
                this.play(this._currTime, this._loopKey)
            }
            play(t = 0, e = !1) {
                if (this._tweenDataList) {
                    if (this._startTimeSort) {
                        function i(t, e) {
                            return t.startTime > e.startTime ? 1 : t.startTime < e.startTime ? -1 : 0
                        }
                        this._startTimeSort = !1, this._tweenDataList.sort(i);
                        for (var r = 0, a = this._tweenDataList.length; r < a; r++) {
                            var n = this._tweenDataList[r];
                            if (null != n && 0 == n.type) {
                                var h = n.target,
                                    o = h.$_GID || (h.$_GID = tt.getGID()),
                                    l = null;
                                for (var _ in null == this._firstTweenDic[o] ? (l = {}, l.diyTarget = h, this._firstTweenDic[o] = l) : l = this._firstTweenDic[o], n.data) null == l[_] && (l[_] = h[_])
                            }
                        }
                    }
                    "string" == typeof t ? this.gotoLabel(t) : this.gotoTime(t), this._loopKey = e, this._lastTime = ae.now(), s.timer.frameLoop(1, this, this._update)
                }
            }
            _update() {
                if (this._currTime >= this._startTime) {
                    if (!this._loopKey) {
                        for (var t in this._tweenDic) e = this._tweenDic[t], e.complete();
                        return this.pause(), void this._complete()
                    }
                    if (this._complete(), !this._tweenDataList) return;
                    this.gotoTime(0)
                }
                var e, i = ae.now(),
                    s = i - this._lastTime,
                    a = this._currTime += s * this.scale;
                for (t in this._lastTime = i, this._tweenDic) e = this._tweenDic[t], e._updateEase(a);
                if (0 != this._tweenDataList.length && this._index < this._tweenDataList.length) {
                    var n = this._tweenDataList[this._index];
                    a >= n.startTime && (this._index++, 0 == n.type ? (this._gidIndex++, e = r.getItemByClass("tween", ui), e._create(n.target, n.data, n.duration, n.ease, w.create(this, this._animComplete, [this._gidIndex]), 0, !1, n.isTo, !0, !1), e.setStartTime(a), e.gid = this._gidIndex, this._tweenDic[this._gidIndex] = e, e._updateEase(a)) : this.event(Jt.LABEL, n.data))
                }
            }
            _animComplete(t) {
                var e = this._tweenDic[t];
                e && delete this._tweenDic[t]
            }
            _complete() {
                this.event(Jt.COMPLETE)
            }
            get index() {
                return this._frameIndex
            }
            set index(t) {
                this._frameIndex = t, this.gotoTime(this._frameIndex / this._frameRate * 1e3)
            }
            get total() {
                return this._total = Math.floor(this._startTime / 1e3 * this._frameRate), this._total
            }
            reset() {
                var t, e, i, r;
                if (this._labelDic)
                    for (t in this._labelDic) delete this._labelDic[t];
                for (t in this._tweenDic) e = this._tweenDic[t], e.clear(), delete this._tweenDic[t];
                for (t in this._firstTweenDic) delete this._firstTweenDic[t];
                if (this._endTweenDataList = null, this._tweenDataList && this._tweenDataList.length)
                    for (r = this._tweenDataList.length, i = 0; i < r; i++) this._tweenDataList[i] && this._tweenDataList[i].destroy();
                this._tweenDataList.length = 0, this._currTime = 0, this._lastTime = 0, this._startTime = 0, this._index = 0, this._gidIndex = 0, this.scale = 1, s.timer.clear(this, this._update)
            }
            destroy() {
                this.reset(), this._labelDic = null, this._tweenDic = null, this._tweenDataList = null, this._firstTweenDic = null
            }
        }
        class Fs {
            constructor() {
                this.type = 0, this.isTo = !0
            }
            destroy() {
                this.target = null, this.ease = null, this.data = null, this.isTo = !0, this.type = 0, r.recover("tweenData", this)
            }
        }
        class Os {
            constructor() {}
        }
        class Ns {
            characterMapContains(t) {
                for (var e = 0; e < Ns.charsMap.length; ++e)
                    if (Ns.charsMap[e][0] === t) return !0;
                return !1
            }
            getCharRep(t) {
                for (var e = 0; e < Ns.charsMap.length; ++e)
                    if (Ns.charsMap[e][0] === t) return Ns.charsMap[e];
                return !1
            }
            getCombCharRep(t, e) {
                for (var i = 0; i < Ns.combCharsMap.length; ++i)
                    if (Ns.combCharsMap[i][0][0] === t && Ns.combCharsMap[i][0][1] === e) return Ns.combCharsMap[i];
                return !1
            }
            isTransparent(t) {
                for (var e = 0; e < Ns.transChars.length; ++e)
                    if (Ns.transChars[e] === t) return !0;
                return !1
            }
            getOriginalCharsFromCode(t) {
                var e;
                for (e = 0; e < Ns.charsMap.length; ++e)
                    if (Ns.charsMap[e].indexOf(t) > -1) return String.fromCharCode(Ns.charsMap[e][0]);
                for (e = 0; e < Ns.combCharsMap.length; ++e)
                    if (Ns.combCharsMap[e].indexOf(t) > -1) return String.fromCharCode(Ns.combCharsMap[e][0][0]) + String.fromCharCode(Ns.combCharsMap[e][0][1]);
                return String.fromCharCode(t)
            }
            convertArabic(t) {
                for (var e, i, s = "", r = 0; r < t.length; ++r) {
                    var a = t.charCodeAt(r);
                    if (this.characterMapContains(a)) {
                        for (var n = null, h = null, o = r - 1, l = r + 1; o >= 0 && this.isTransparent(t.charCodeAt(o)); --o);
                        for (n = o >= 0 ? t.charCodeAt(o) : null, e = !!n && this.getCharRep(n), (!e || null == e[2] && null == e[3]) && (n = null); l < t.length && this.isTransparent(t.charCodeAt(l)); ++l);
                        if (h = l < t.length ? t.charCodeAt(l) : null, e = !!h && this.getCharRep(h), (!e || null == e[3] && null == e[4]) && (h = null), 1604 === a && null != h && (1570 === h || 1571 === h || 1573 === h || 1575 === h)) {
                            i = this.getCombCharRep(a, h), s += null != n ? String.fromCharCode(i[4]) : String.fromCharCode(i[1]), ++r;
                            continue
                        }
                        if (e = this.getCharRep(a), null != n && null != h && null != e[3]) {
                            s += String.fromCharCode(e[3]);
                            continue
                        }
                        if (null != n && null != e[4]) {
                            s += String.fromCharCode(e[4]);
                            continue
                        }
                        if (null != h && null != e[2]) {
                            s += String.fromCharCode(e[2]);
                            continue
                        }
                        s += String.fromCharCode(e[1])
                    } else s += String.fromCharCode(a)
                }
                return s
            }
            convertArabicBack(t) {
                var e, i, s = "";
                for (i = 0; i < t.length; ++i) e = t.charCodeAt(i), s += this.getOriginalCharsFromCode(e);
                return s
            }
        }
        Ns.charsMap = [
            [1569, 65152, null, null, null],
            [1570, 65153, null, null, 65154],
            [1571, 65155, null, null, 65156],
            [1572, 65157, null, null, 65158],
            [1573, 65159, null, null, 65160],
            [1574, 65161, 65163, 65164, 65162],
            [1575, 65165, null, null, 65166],
            [1576, 65167, 65169, 65170, 65168],
            [1577, 65171, null, null, 65172],
            [1578, 65173, 65175, 65176, 65174],
            [1579, 65177, 65179, 65180, 65178],
            [1580, 65181, 65183, 65184, 65182],
            [1581, 65185, 65187, 65188, 65186],
            [1582, 65189, 65191, 65192, 65190],
            [1583, 65193, null, null, 65194],
            [1584, 65195, null, null, 65196],
            [1585, 65197, null, null, 65198],
            [1586, 65199, null, null, 65200],
            [1587, 65201, 65203, 65204, 65202],
            [1588, 65205, 65207, 65208, 65206],
            [1589, 65209, 65211, 65212, 65210],
            [1590, 65213, 65215, 65216, 65214],
            [1591, 65217, 65219, 65220, 65218],
            [1592, 65221, 65223, 65224, 65222],
            [1593, 65225, 65227, 65228, 65226],
            [1594, 65229, 65231, 65232, 65230],
            [1600, 1600, 1600, 1600, 1600],
            [1601, 65233, 65235, 65236, 65234],
            [1602, 65237, 65239, 65240, 65238],
            [1603, 65241, 65243, 65244, 65242],
            [1604, 65245, 65247, 65248, 65246],
            [1605, 65249, 65251, 65252, 65250],
            [1606, 65253, 65255, 65256, 65254],
            [1607, 65257, 65259, 65260, 65258],
            [1608, 65261, null, null, 65262],
            [1609, 65263, null, null, 65264],
            [1610, 65265, 65267, 65268, 65266],
            [1662, 64342, 64344, 64345, 64343],
            [1740, 64508, 64510, 64511, 64509],
            [1670, 64378, 64380, 64381, 64379],
            [1705, 64398, 64400, 64401, 64399],
            [1711, 64402, 64404, 64405, 64403],
            [1688, 64394, null, null, 64395]
        ], Ns.combCharsMap = [
            [
                [1604, 1570], 65269, null, null, 65270
            ],
            [
                [1604, 1571], 65271, null, null, 65272
            ],
            [
                [1604, 1573], 65273, null, null, 65274
            ],
            [
                [1604, 1575], 65275, null, null, 65276
            ]
        ], Ns.transChars = [1552, 1554, 1555, 1556, 1557, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1619, 1620, 1621, 1622, 1623, 1624, 1648, 1750, 1751, 1752, 1753, 1754, 1755, 1756, 1759, 1760, 1761, 1762, 1763, 1764, 1767, 1768, 1770, 1771, 1772, 1773];
        class Us {
            static ArrayMul(t, e, i) {
                if (t)
                    if (e)
                        for (var s, r, a, n, h = 0; h < 4; h++) s = t[h], r = t[h + 4], a = t[h + 8], n = t[h + 12], i[h] = s * e[0] + r * e[1] + a * e[2] + n * e[3], i[h + 4] = s * e[4] + r * e[5] + a * e[6] + n * e[7], i[h + 8] = s * e[8] + r * e[9] + a * e[10] + n * e[11], i[h + 12] = s * e[12] + r * e[13] + a * e[14] + n * e[15];
                    else Us.copyArray(t, i);
                else Us.copyArray(e, i)
            }
            static copyArray(t, e) {
                if (t && e)
                    for (var i = 0; i < t.length; i++) e[i] = t[i]
            }
        }
        return t.AlphaCmd = a, t.Animation = Qi, t.AnimationBase = pi, t.ArabicReshaper = Ns, t.AtlasGrid = Zt, t.AtlasInfoManager = ri, t.AudioSound = Ze, t.AudioSoundChannel = qe, t.BasePoly = Wt, t.BaseShader = G, t.BaseTexture = B, t.Bezier = _t, t.Bitmap = L, t.BitmapFont = ei, t.BlendMode = V, t.BlurFilter = rs, t.BlurFilterGLRender = ss, t.BlurFilterSetter = as, t.MosaicFilter = hs, t.BoundsStyle = De, t.Browser = ae, t.Buffer = At, t.Buffer2D = Rt, t.BufferState2D = Et, t.BufferStateBase = yt, t.ButtonEffect = ls, t.Byte = F, t.CONST3D2D = Xt, t.CacheManger = Ae, t.CacheStyle = Le, t.CallLater = Ye, t.CharRenderInfo = se, t.CharRender_Canvas = ne, t.CharRender_Native = he, t.CharSubmitCache = qt, t.ClassUtils = Pe, t.ClipRectCmd = xe, t.ColorFilter = it, t.ColorFilterSetter = _s, t.ColorUtils = et, t.CommandEncoder = vs, t.CommonScript = Ki, t.Component = di, t.Config = i, t.Const = be, t.Context = le, t.Dragging = ci, t.Draw9GridTexture = me, t.DrawCircleCmd = n, t.DrawCurvesCmd = h, t.DrawImageCmd = o, t.DrawLineCmd = l, t.DrawLinesCmd = _, t.DrawParticleCmd = es, t.DrawPathCmd = u, t.DrawPieCmd = c, t.DrawPolyCmd = d, t.DrawRectCmd = p, t.DrawStyle = ct, t.DrawTextureCmd = st, t.DrawTexturesCmd = ye, t.DrawTrianglesCmd = fe, t.Earcut = Vt, t.EarcutNode = Yt, t.Ease = _i, t.EffectAnimation = $i, t.EffectBase = us, t.Event = Jt, t.EventDispatcher = M, t.FadeIn = cs, t.FadeOut = ds, t.FillTextCmd = Ee, t.FillTextureCmd = rt, t.Filter = J, t.FilterSetterBase = is, t.FontInfo = ee, t.FrameAnimation = mi, t.GlowFilter = fs, t.GlowFilterGLRender = ps, t.GlowFilterSetter = ms, t.GrahamScan = ut, t.GraphicAnimation = qi, t.Graphics = Re, t.GraphicsBounds = Te, t.HTMLCanvas = Me, t.HTMLChar = ws, t.HTMLImage = Bi, t.HalfFloatUtils = N, t.Handler = w, t.HitArea = Ie, t.HttpRequest = ii, t.ICharRender = re, t.ILaya = s, t.IStatRender = yi, t.IndexBuffer2D = bt, t.InlcudeFile = wi, t.Input = Ge, t.KeyBoardManager = Ke, t.KeyLocation = gs, t.Keyboard = Ts, t.Laya = Fi, t.LayaGL = T, t.LayaGLQuickRunner = Se, t.LayaGLRunner = xs, t.LayaGPU = de, t.Loader = si, t.LoaderManager = ai, t.LocalStorage = hi, t.Log = Ms, t.MathUtil = fi, t.MatirxArray = Us, t.Matrix = f, t.Mesh2D = wt, t.MeshParticle2D = Li, t.MeshQuadTexture = Mt, t.MeshTexture = It, t.MeshVG = Pt, t.Mouse = Di, t.MouseManager = We, t.Node = Fe, t.Path = dt, t.PerfData = Ps, t.PerfHUD = Ds, t.PerformancePlugin = He, t.Point = m, t.Pool = r, t.PoolCache = Ls, t.Prefab = ti, t.PrimitiveSV = bi, t.QuickTestTool = ys, t.Rectangle = g, t.Render = pe, t.RenderInfo = Ct, t.RenderSprite = we, t.RenderState2D = k, t.RenderTexture2D = W, t.Resource = D, t.ResourceVersion = Cs, t.RestoreCmd = at, t.RotateCmd = nt, t.RunDriver = Xe, t.SaveBase = mt, t.SaveClipRect = gt, t.SaveCmd = ge, t.SaveMark = Tt, t.SaveTransform = vt, t.SaveTranslate = xt, t.ScaleCmd = ht, t.Scene = ts, t.SceneLoader = Ji, t.SceneUtils = Ti, t.Script = ji, t.Shader = j, t.Shader2D = Gt, t.Shader2X = q, t.ShaderCompile = Ii, t.ShaderDefines2D = H, t.ShaderDefinesBase = X, t.ShaderNode = Mi, t.ShaderValue = Os, t.SkinMeshBuffer = kt, t.SkinSV = Ri, t.Socket = Rs, t.Sound = Es, t.SoundChannel = je, t.SoundManager = Je, t.SoundNode = As, t.Sprite = Oe, t.SpriteConst = ve, t.SpriteStyle = Be, t.Stage = ze, t.Stat = z, t.StatUI = Ei, t.StringKey = K, t.Submit = Ht, t.SubmitBase = ft, t.SubmitCMD = $, t.SubmitCanvas = zt, t.SubmitKey = Q, t.SubmitTarget = Kt, t.SubmitTexture = jt, t.System = Ss, t.SystemUtils = O, t.TTFLoader = li, t.Text = Ue, t.TextAtlas = $t, t.TextRender = oe, t.TextStyle = Ne, t.TextTexture = Qt, t.Texture = te, t.Texture2D = U, t.TextureSV = Si, t.TimeLine = Bs, t.Timer = Ai, t.TouchManager = ke, t.TransformCmd = ot, t.TranslateCmd = lt, t.Tween = ui, t.URL = P, t.Utils = tt, t.Value2D = Z, t.VectorGraphManager = Ce, t.VertexArrayObject = ce, t.VertexBuffer2D = St, t.VideoTexture = bs, t.WeakObject = gi, t.WebAudioSound = $e, t.WebAudioSoundChannel = Qe, t.WebGL = ue, t.WebGLCacheAsNormalCanvas = Dt, t.WebGLContext = S, t.WebGLRTMgr = Y, t.WordText = ie, t.WorkerLoader = Pi, t.__init = Yi, t._static = e, t.alertGlobalError = Hi, t.enableDebugPanel = zi, t.init = Vi, t.isWXOpenDataContext = Gi, t.isWXPosMsg = ki, t.version = Xi, t.static = e, t
    }({});
});
define("loading/laya.wxmini.min.js", function(require, module, exports) {
    window.wxMiniGame = function(e, t) {
        "use strict";

        function ImageDataPolyfill() {
            let e, i, a;
            if (3 == arguments.length) {
                if (!(arguments[0] instanceof Uint8ClampedArray)) throw new Error("Failed to construct 'ImageData': parameter 1 is not of type 'Uint8ClampedArray'.");
                if (arguments[0].length % 4 != 0) throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of 4.");
                if (arguments[0].length !== arguments[1] * arguments[2] * 4) throw new Error("Failed to construct 'ImageData': The input data length is not equal to (4 * width * height).");
                a = arguments[0], e = arguments[1], i = arguments[2]
            } else if (2 == arguments.length) e = arguments[0], i = arguments[1], a = new Uint8ClampedArray(arguments[0] * arguments[1] * 4);
            else if (arguments.length < 2) throw new Error("Failed to construct 'ImageData': 2 arguments required, but only " + arguments.length + " present.");
            let n = t.Browser.canvas.getContext("2d").getImageData(0, 0, e, i);
            for (let e = 0; e < a.length; e += 4) n.data[e] = a[e], n.data[e + 1] = a[e + 1], n.data[e + 2] = a[e + 2], n.data[e + 3] = a[e + 3];
            return n
        }
        class i {
            static isLocalNativeFile(e) {
                var a = -1 == e.indexOf("http://") && -1 == e.indexOf("https://"),
                    n = "" != t.URL.rootPath ? t.URL.rootPath : t.URL._basePath;
                "" == n || a || (n = e.split(n)[1]) && (e = n, a = !0);
                for (var o = 0, s = l.nativefiles.length; o < s; o++)
                    if (-1 != e.indexOf(l.nativefiles[o])) {
                        a = !0;
                        break
                    }
                if (a)
                    for (o = 0, s = l.remotefiles.length; o < s; o++)
                        if (-1 != e.indexOf(l.remotefiles[o])) {
                            try {
                                i.fs.accessSync(e), a = !0
                            } catch (e) {
                                a = !1
                            }
                            break
                        }
                return a
            }
            static isLocalNativeZipFile(e) {
                for (var t = 0, i = l.nativezipfiles.length; t < i; t++)
                    if (-1 != e.indexOf(l.nativezipfiles[t])) return !0;
                return !1
            }
            static isNetFile(e) {
                return (-1 != e.indexOf("http://") || -1 != e.indexOf("https://")) && -1 == e.indexOf(l.window.wx.env.USER_DATA_PATH)
            }
            static getFileInfo(e) {
                var t = e,
                    a = i.fakeObj[t];
                return null == a ? null : a
            }
            static read(e, a = "utf8", n = null, o = "", s = !1, r = "") {
                var l;
                l = "" == o || -1 == o.indexOf("http://") && -1 == o.indexOf("https://") ? e : i.getFileNativePath(e), l = t.URL.getAdptedFilePath(l), i.fs.readFile({
                    filePath: l,
                    encoding: a,
                    success: function(e) {
                        null != n && n.runWith([0, e])
                    },
                    fail: function(e) {
                        e && "" != o ? i.downFiles(o, a, n, o, s, r) : null != n && n.runWith([1])
                    }
                })
            }
            static isFile(e) {
                let t;
                try {
                    t = i.fs.statSync(e)
                } catch (e) {
                    return !1
                }
                return t.isFile()
            }
            static downFiles(e, t = "utf8", a = null, n = "", o = !1, s = "", r = !0) {
                i.down({
                    url: e,
                    success: function(l) {
                        200 === l.statusCode ? i.readFile(l.tempFilePath, t, a, n, o, s, r) : 403 === l.statusCode ? null != a && a.runWith([0, e]) : null != a && a.runWith([1, l])
                    },
                    fail: function(e) {
                        null != a && a.runWith([1, e])
                    }
                }).onProgressUpdate((function(e) {
                    null != a && a.runWith([2, e.progress])
                }))
            }
            static readFile(e, a = "utf8", n = null, o = "", s = !1, r = "", d = !0) {
                e = t.URL.getAdptedFilePath(e), i.fs.readFile({
                    filePath: e,
                    encoding: a,
                    success: function(t) {
                        if ((-1 != o.indexOf("http://") || -1 != o.indexOf("https://")) && -1 == e.indexOf(l.window.wx.env.USER_DATA_PATH) && (l.AutoCacheDownFile || s)) {
                            let s = !1;
                            if (l.cacheExcludes)
                                for (const e of l.cacheExcludes)
                                    if (o.includes(e)) {
                                        s = !0;
                                        break
                                    }
                            if (!s) return null != n && n.runWith([0, t]), void i.copyTOCache(e, o, null, a, d)
                        }
                        null != n && n.runWith([0, t])
                    },
                    fail: function(e) {
                        e && null != n && n.runWith([1, e])
                    }
                })
            }
            static downOtherFiles(e, t = null, a = "", n = !1, o = !0) {
                i.down({
                    url: e,
                    success: function(e) {
                        200 === e.statusCode ? (l.autoCacheFile || n) && -1 == a.indexOf("qlogo.cn") && -1 == a.indexOf(".php") ? (null != t && t.runWith([0, e.tempFilePath]), i.copyTOCache(e.tempFilePath, a, null, "", o)) : null != t && t.runWith([0, e.tempFilePath]) : null != t && t.runWith([1, e])
                    },
                    fail: function(e) {
                        null != t && t.runWith([1, e])
                    }
                })
            }
            static copyFile(e, t, a = null) {
                i.fs.copyFile({
                    srcPath: e,
                    destPath: t,
                    success: function() {
                        a && a.runWith(0)
                    },
                    fail: function(e) {
                        a && a.runWith([1, e])
                    }
                })
            }
            static downLoadFile(e, a = "", n = null, o = "utf8") {
                window.navigator.userAgent.indexOf("MiniGame") < 0 ? t.Laya.loader.load(e, n) : a == t.Loader.IMAGE || a == t.Loader.SOUND ? i.downOtherFiles(e, n, e, !0, !1) : i.downFiles(e, o, n, e, !0, a, !1)
            }
            static copyTOCache(e, a, n, o = "", s = !0) {
                if (!t.Laya.isWXPlayable) {
                    var r = e.split("/"),
                        d = r[r.length - 1],
                        u = a,
                        c = i.getFileInfo(a),
                        h = i.getFileNativePath(d);
                    i.fakeObj[u] = {
                        md5: d,
                        readyUrl: a,
                        size: 0,
                        times: t.Browser.now(),
                        encoding: o,
                        tempFilePath: e
                    };
                    var f = l.sizeLimit,
                        p = 4194304,
                        v = i.getCacheUseSize();
                    c ? c.readyUrl != a ? i.fs.getFileInfo({
                        filePath: e,
                        success: function(t) {
                            s && v + p + t.size >= f && (t.size > l.minClearSize && (l.minClearSize = t.size), i.onClearCacheRes()), i.deleteFile(e, a, n, o, t.size)
                        },
                        fail: function(e) {
                            null != n && n.runWith([1, e])
                        }
                    }) : null != n && n.runWith([0]) : i.fs.getFileInfo({
                        filePath: e,
                        success: function(t) {
                            s && v + p + t.size >= f && (t.size > l.minClearSize && (l.minClearSize = t.size), i.onClearCacheRes()), i.fs.copyFile({
                                srcPath: e,
                                destPath: h,
                                success: function(e) {
                                    i.onSaveFile(a, d, !0, o, n, t.size)
                                },
                                fail: function(e) {
                                    null != n && n.runWith([1, e])
                                }
                            })
                        },
                        fail: function(e) {
                            null != n && n.runWith([1, e])
                        }
                    })
                }
            }
            static onClearCacheRes() {
                var e = l.minClearSize,
                    t = [];
                for (var a in i.filesListObj) "fileUsedSize" != a && t.push(i.filesListObj[a]);
                i.sortOn(t, "times", i.NUMERIC);
                for (var n = 0, o = 1, s = t.length; o < s; o++) {
                    var r = t[o];
                    if (n >= e) break;
                    n += r.size, i.deleteFile("", r.readyUrl)
                }
            }
            static sortOn(e, t, a = 0) {
                return a == i.NUMERIC ? e.sort((function(e, i) {
                    return e[t] - i[t]
                })) : a == (i.NUMERIC | i.DESCENDING) ? e.sort((function(e, i) {
                    return i[t] - e[t]
                })) : e.sort((function(e, i) {
                    return e[t] - i[t]
                }))
            }
            static getFileNativePath(e) {
                return i.fileNativeDir + "/" + e
            }
            static deleteFile(e, t = "", a = null, n = "", o = 0) {
                var s = i.getFileInfo(t),
                    r = i.getFileNativePath(s.md5);
                if (i.fs.unlink({
                        filePath: r,
                        success: function(s) {
                            if ("" != e) {
                                var r = i.getFileNativePath(e);
                                i.fs.copyFile({
                                    srcPath: e,
                                    destPath: r,
                                    success: function(s) {
                                        i.onSaveFile(t, e, !0, n, a, o)
                                    },
                                    fail: function(e) {
                                        null != a && a.runWith([1, e])
                                    }
                                })
                            } else i.onSaveFile(t, e, !1, n, a, o)
                        },
                        fail: function(e) {
                            null != a && a.runWith([1, e])
                        }
                    }), t && "" != t && -1 != t.indexOf(".zip")) {
                    var d = l.zipHeadFiles[t];
                    if (d) try {
                        i.fs.rmdirSync(d, !0)
                    } catch (e) {
                        console.log("目录:" + d + "delete fail"), console.log(e)
                    }
                }
            }
            static deleteAll() {
                var e = [];
                for (var t in i.filesListObj) "fileUsedSize" != t && e.push(i.filesListObj[t]);
                for (var a = 1, n = e.length; a < n; a++) {
                    var o = e[a];
                    i.deleteFile("", o.readyUrl)
                }
                i.filesListObj && i.filesListObj.fileUsedSize && (i.filesListObj.fileUsedSize = 0), i.writeFilesList("", JSON.stringify({}), !1)
            }
            static onSaveFile(e, a, n = !0, o = "", s = null, r = 0) {
                var l = e;
                if (null == i.filesListObj.fileUsedSize && (i.filesListObj.fileUsedSize = 0), n) {
                    var d = i.getFileNativePath(a);
                    i.filesListObj[l] = {
                        md5: a,
                        readyUrl: e,
                        size: r,
                        times: t.Browser.now(),
                        encoding: o,
                        tempFilePath: d
                    }, i.filesListObj.fileUsedSize = parseInt(i.filesListObj.fileUsedSize) + r, i.writeFilesList(l, JSON.stringify(i.filesListObj), !0), null != s && s.runWith([0])
                } else if (i.filesListObj[l]) {
                    var u = parseInt(i.filesListObj[l].size);
                    i.filesListObj.fileUsedSize = parseInt(i.filesListObj.fileUsedSize) - u, i.fakeObj[l].md5 == i.filesListObj[l].md5 && delete i.fakeObj[l], delete i.filesListObj[l], i.writeFilesList(l, JSON.stringify(i.filesListObj), !1), null != s && s.runWith([0])
                }
            }
            static writeFilesList(e, t, a) {
                var n = i.fileNativeDir + "/" + i.fileListName;
                i.fs.writeFile({
                    filePath: n,
                    encoding: "utf8",
                    data: t,
                    success: function(e) {},
                    fail: function(e) {}
                }), !l.isZiYu && l.isPosMsgYu && l.window.wx.postMessage({
                    url: e,
                    data: i.filesListObj[e],
                    isLoad: "filenative",
                    isAdd: a
                })
            }
            static getCacheUseSize() {
                return i.filesListObj && i.filesListObj.fileUsedSize ? i.filesListObj.fileUsedSize : 0
            }
            static getCacheList(e, t) {
                let a;
                try {
                    a = i.fs.statSync(e)
                } catch (e) {
                    a = null
                }
                a ? i.readSync(i.fileListName, "utf8", t) : (i.fs.mkdirSync(e, !0), t && t.runWith([1]))
            }
            static existDir(e, t) {
                i.fs.mkdir({
                    dirPath: e,
                    success: function(e) {
                        null != t && t.runWith([0, {
                            data: JSON.stringify({})
                        }])
                    },
                    fail: function(e) {
                        -1 != e.errMsg.indexOf("file already exists") ? i.readSync(i.fileListName, "utf8", t) : null != t && t.runWith([1, e])
                    }
                })
            }
            static readSync(e, t = "utf8", a = null, n = "") {
                var o, s = i.getFileNativePath(e);
                try {
                    o = i.fs.readFileSync(s, t), null != a && a.runWith([0, {
                        data: o
                    }])
                } catch (e) {
                    null != a && a.runWith([1])
                }
            }
            static setNativeFileDir(e) {
                i.fileNativeDir = l.window.wx.env.USER_DATA_PATH + e
            }
        }
        i.fs = window.wx.getFileSystemManager(), i.down = window.wx.downloadFile, i.filesListObj = {}, i.fakeObj = {}, i.fileListName = "layaairfiles.txt", i.ziyuFileData = {}, i.ziyuFileTextureData = {}, i.loadPath = "", i.DESCENDING = 2, i.NUMERIC = 16;
        class a extends t.SoundChannel {
            constructor(e) {
                super(), this._sound = e, this._audio = e._sound, this._onCanplay = this.onCanPlay.bind(this), this._onError = this.onError.bind(this), this._onEnd = this.__onEnd.bind(this), this.addEventListener()
            }
            addEventListener() {
                this._audio.onError(this._onError), this._audio.onCanplay(this._onCanplay)
            }
            offEventListener() {
                this._audio.offError(this._onError), this._audio.offCanplay(this._onCanplay), this._audio.offEnded(this._onEnd)
            }
            onError(e) {
                console.log("-----1---------------minisound-----url:", this.url), console.log(e), this.event(t.Event.ERROR), this._audio && (this._sound.dispose(), this.offEventListener(), this._sound = this._audio = null)
            }
            onCanPlay() {
                this._audio && (this.event(t.Event.COMPLETE), this.offEventListener(), this._audio.onEnded(this._onEnd), this.isStopped ? this.stop() : this.play())
            }
            __onEnd() {
                if (1 == this.loops) return this.completeHandler && (t.Laya.systemTimer.once(10, this, this.__runComplete, [this.completeHandler], !1), this.completeHandler = null), this.stop(), void this.event(t.Event.COMPLETE);
                this.loops > 0 && this.loops--, this.startTime = 0, this.play()
            }
            play() {
                this.isStopped = !1, t.SoundManager.addChannel(this), this._audio && this._audio.play()
            }
            set startTime(e) {
                this._audio && (this._audio.startTime = e)
            }
            set autoplay(e) {
                this._audio && (this._audio.autoplay = e)
            }
            get autoplay() {
                return !!this._audio && this._audio.autoplay
            }
            get position() {
                return this._audio ? this._audio.currentTime : 0
            }
            get duration() {
                return this._audio ? this._audio.duration : 0
            }
            stop() {
                super.stop(), this.isStopped = !0, t.SoundManager.removeChannel(this), this.completeHandler = null, this._audio && (this._audio.stop(), this.loop || (this.offEventListener(), this._sound.dispose(), this._sound = null, this._audio = null))
            }
            pause() {
                this.isStopped = !0, this._audio && this._audio.pause()
            }
            get loop() {
                return !!this._audio && this._audio.loop
            }
            set loop(e) {
                this._audio && (this._audio.loop = e)
            }
            resume() {
                this.isStopped = !1, t.SoundManager.addChannel(this), this._audio && this._audio.play()
            }
            set volume(e) {
                this._audio && (this._audio.volume = e)
            }
            get volume() {
                return this._audio ? this._audio.volume : 0
            }
        }
        class n extends t.EventDispatcher {
            constructor() {
                super(), this.loaded = !1, this._sound = n._createSound()
            }
            static _createSound() {
                return n._id++, l.window.wx.createInnerAudioContext()
            }
            load(e) {
                if (i.isLocalNativeFile(e)) {
                    if (!i.isLocalNativeZipFile(e) && i.isNetFile(e))
                        if ("" != i.loadPath) e = e.split(i.loadPath)[1];
                        else {
                            var a = "" != t.URL.rootPath ? t.URL.rootPath : t.URL._basePath;
                            "" != a && (e = e.split(a)[1])
                        }
                } else e = t.URL.formatURL(e);
                if (this.url = e, this.readyUrl = e, l.autoCacheFile && i.getFileInfo(e)) this.onDownLoadCallBack(e, 0);
                else if (l.autoCacheFile)
                    if (i.isLocalNativeFile(e)) {
                        if (l.subNativeFiles && 0 == l.subNativeheads.length)
                            for (var n in l.subNativeFiles) {
                                var o = l.subNativeFiles[n];
                                l.subNativeheads = l.subNativeheads.concat(o);
                                for (let e = 0; e < o.length; e++) l.subMaps[o[e]] = n + "/" + o[e]
                            }
                        if (l.subNativeFiles && -1 != e.indexOf("/")) {
                            var s = e.split("/")[0] + "/";
                            if (s && -1 != l.subNativeheads.indexOf(s)) {
                                var r = l.subMaps[s];
                                e = e.replace(s, r)
                            }
                        }
                        this.onDownLoadCallBack(e, 0)
                    } else i.isNetFile(e) ? i.downOtherFiles(e, t.Handler.create(this, this.onDownLoadCallBack, [e]), e) : this.onDownLoadCallBack(e, 0);
                else this.onDownLoadCallBack(e, 0)
            }
            onDownLoadCallBack(e, a, n = null) {
                var o;
                if (!a && this._sound)
                    if (l.autoCacheFile) {
                        if (n) o = n;
                        else if (i.isLocalNativeFile(e)) {
                            var s = "" != t.URL.rootPath ? t.URL.rootPath : t.URL._basePath,
                                r = e;
                            "" == s || -1 == e.indexOf("http://") && -1 == e.indexOf("https://") || (o = e.split(s)[1]), o || (o = r), -1 == o.indexOf(l.window.wx.env.USER_DATA_PATH) && i.isLocalNativeZipFile(o) && (o = i.getFileNativePath(o))
                        } else {
                            var d = i.getFileInfo(e);
                            o = d && d.md5 ? d.tempFilePath || i.getFileNativePath(d.md5) : e
                        }
                        this._sound.src = this.readyUrl = o
                    } else this._sound.src = this.readyUrl = e;
                else this.event(t.Event.ERROR)
            }
            play(e = 0, i = 0) {
                if (!this.url) return null;
                var n = new a(this);
                return n.url = this.url, n.loops = i, n.loop = 0 === i, n.startTime = e, n.isStopped = !1, t.SoundManager.addChannel(n), n
            }
            get duration() {
                return this._sound.duration
            }
            dispose() {
                this._sound && (this._sound.destroy(), this._sound = null, this.readyUrl = this.url = null)
            }
        }
        n._id = 0;
        class o {
            constructor() {}
            static _createInputElement() {
                t.Input._initInput(t.Input.area = t.Browser.createElement("textarea")), t.Input._initInput(t.Input.input = t.Browser.createElement("input")), t.Input.inputContainer = t.Browser.createElement("div"), t.Input.inputContainer.style.position = "absolute", t.Input.inputContainer.style.zIndex = 1e5, t.Browser.container.appendChild(t.Input.inputContainer), t.Laya.stage.on("resize", null, o._onStageResize), l.window.wx.onWindowResize && l.window.wx.onWindowResize((function(e) {})), t.SoundManager._soundClass = n, t.SoundManager._musicClass = n;
                var e = l.systemInfo.model,
                    i = l.systemInfo.system;
                e && -1 != e.indexOf("iPhone") && (t.Browser.onIPhone = !0, t.Browser.onIOS = !0, t.Browser.onIPad = !0, t.Browser.onAndroid = !1), !i || -1 == i.indexOf("Android") && -1 == i.indexOf("Adr") || (t.Browser.onAndroid = !0, t.Browser.onIPhone = !1, t.Browser.onIOS = !1, t.Browser.onIPad = !1)
            }
            static _onStageResize() {
                t.Laya.stage._canvasTransform.identity().scale(t.Browser.width / t.Render.canvas.width / t.Browser.pixelRatio, t.Browser.height / t.Render.canvas.height / t.Browser.pixelRatio)
            }
            static wxinputFocus(e) {
                var i = t.Input.inputElement.target;
                i && !i.editable || (l.window.wx.offKeyboardConfirm(), l.window.wx.offKeyboardInput(), l.window.wx.showKeyboard({
                    defaultValue: i.text,
                    maxLength: i.maxChars,
                    multiple: i.multiline,
                    confirmHold: !0,
                    confirmType: i.confirmType || "done",
                    success: function(e) {},
                    fail: function(e) {}
                }), l.window.wx.onKeyboardConfirm((function(e) {
                    var a = e ? e.value : "";
                    i._restrictPattern && (a = a.replace(/\u2006|\x27/g, ""), i._restrictPattern.test(a) && (a = a.replace(i._restrictPattern, ""))), i.text = a, i.event(t.Event.INPUT), o.inputEnter(), i.event("confirm"), i.event("enter")
                })), l.window.wx.onKeyboardInput((function(e) {
                    var a = e ? e.value : "";
                    if (!i.multiline && -1 != a.indexOf("\n")) {
                        if ("\n" == a) return void o.inputEnter();
                        a = a.replace(/\n/g, "")
                    }
                    i._restrictPattern && (a = a.replace(/\u2006|\x27/g, ""), i._restrictPattern.test(a) && (a = a.replace(i._restrictPattern, ""))), i.text = a, i.miniGameTxt && i.miniGameTxt(a), i.event(t.Event.INPUT)
                })))
            }
            static inputEnter() {
                t.Input.inputElement.target ? t.Input.inputElement.target.destroyed || (t.Input.inputElement.target.focus = !1) : o.hideKeyboard()
            }
            static wxinputblur() {
                o.hideKeyboard()
            }
            static hideKeyboard() {
                l.window.wx.offKeyboardConfirm(), l.window.wx.offKeyboardInput(), l.window.wx.hideKeyboard({
                    success: function(e) {
                        console.log("隐藏键盘")
                    },
                    fail: function(e) {
                        console.log("隐藏键盘出错:" + (e ? e.errMsg : ""))
                    }
                }), l.window.wx.onKeyboardConfirm((function(e) {
                    l.window.wx.hideKeyboard({
                        success: function(e) {
                            console.log("隐藏键盘")
                        },
                        fail: function(e) {
                            console.log("隐藏键盘出错:" + (e ? e.errMsg : ""))
                        }
                    })
                }))
            }
        }
        class s extends t.EventDispatcher {
            constructor() {
                super()
            }
            _loadResourceFilter(e, a) {
                var n = this;
                if (this.sourceUrl = t.URL.formatURL(a), i.isNetFile(a))
                    if ("" != i.loadPath) a = a.split(i.loadPath)[1];
                    else {
                        var o = "" != t.URL.rootPath ? t.URL.rootPath : t.URL._basePath,
                            r = a;
                        "" != o && (a = a.split(o)[1]), a || (a = r)
                    }
                if (l.subNativeFiles && 0 == l.subNativeheads.length)
                    for (var d in l.subNativeFiles) {
                        var u = l.subNativeFiles[d];
                        l.subNativeheads = l.subNativeheads.concat(u);
                        for (var c = 0; c < u.length; c++) l.subMaps[u[c]] = d + "/" + u[c]
                    }
                if (l.subNativeFiles && -1 != a.indexOf("/")) {
                    var h = a.split("/")[0] + "/";
                    if (h && -1 != l.subNativeheads.indexOf(h)) {
                        var f = l.subMaps[h];
                        a = a.replace(h, f)
                    }
                }
                switch (e) {
                    case t.Loader.IMAGE:
                    case "htmlimage":
                    case "nativeimage":
                        s._transformImgUrl(a, e, n);
                        break;
                    case t.Loader.SOUND:
                        n._loadSound(a);
                        break;
                    default:
                        n._loadResource(e, a)
                }
            }
            _loadSound(e) {
                var a = this;
                if (l.autoCacheFile) {
                    var n = t.URL.formatURL(e);
                    i.isLocalNativeFile(e) || i.getFileInfo(n) ? s.onDownLoadCallBack(e, a, 0) : i.isNetFile(n) ? i.downOtherFiles(n, t.Handler.create(s, s.onDownLoadCallBack, [n, a]), n) : s.onDownLoadCallBack(e, a, 0)
                } else s.onDownLoadCallBack(e, a, 0)
            }
            static onDownLoadCallBack(e, a, n, o = null) {
                if (n) a.event(t.Event.ERROR, "Load sound failed");
                else {
                    var s;
                    if (l.autoCacheFile)
                        if (o) s = o;
                        else if (i.isLocalNativeFile(e)) - 1 == (s = e).indexOf(l.window.wx.env.USER_DATA_PATH) && i.isLocalNativeZipFile(s) && (s = i.getFileNativePath(s));
                    else {
                        var r = i.getFileInfo(e);
                        s = r && r.md5 ? r.tempFilePath || i.getFileNativePath(r.md5) : e
                    } else s = t.URL.formatURL(e);
                    e = s;
                    var d = new t.SoundManager._soundClass;
                    d.load(e), a.onLoaded(d)
                }
            }
            complete(e) {
                e instanceof t.Resource ? e._setCreateURL(this.sourceUrl) : e instanceof t.Texture && e.bitmap instanceof t.Resource && e.bitmap._setCreateURL(this.sourceUrl), this.originComplete(e)
            }
            _loadHttpRequestWhat(e, a) {
                var n = this,
                    o = l.getUrlEncode(e, a),
                    r = t.URL.formatURL(e);
                if (t.Loader.preLoadedMap[r]) n.onLoaded(t.Loader.preLoadedMap[r]);
                else if (l.AutoCacheDownFile)
                    if (i.isLocalNativeFile(e) || i.getFileInfo(r)) {
                        var d = e,
                            u = i.getFileInfo(r);
                        u && u.md5 && (d = u.tempFilePath || i.getFileNativePath(u.md5)), i.readFile(d, o, new t.Handler(s, s.onReadNativeCallBack, [e, a, n]), e)
                    } else i.isNetFile(r) ? i.downFiles(r, o, new t.Handler(s, s.onReadNativeCallBack, [e, a, n]), r, !0) : i.readFile(e, o, new t.Handler(s, s.onReadNativeCallBack, [e, a, n]), e);
                else i.isNetFile(r) ? n._loadHttpRequest(r, a, n, n.onLoaded, n, n.onProgress, n, n.onError) : (-1 == e.indexOf(l.window.wx.env.USER_DATA_PATH) && i.isLocalNativeZipFile(e) && (e = i.getFileNativePath(e)), i.readFile(e, o, new t.Handler(s, s.onReadNativeCallBack, [e, a, n]), e))
            }
            static onReadNativeCallBack(e, i = null, a = null, n = 0, o = null) {
                if (n) 1 == n && a._loadHttpRequest(e, i, a, a.onLoaded, a, a.onProgress, a, a.onError);
                else {
                    var s;
                    s = i == t.Loader.JSON || i == t.Loader.ATLAS || i == t.Loader.PREFAB || i == t.Loader.PLF ? l.getJson(o.data) : i == t.Loader.XML ? t.Utils.parseXMLFromString(o.data) : o.data, !l.isZiYu && l.isPosMsgYu && i != t.Loader.BUFFER && l.window.wx.postMessage({
                        url: e,
                        data: s,
                        isLoad: "filedata"
                    });
                    try {
                        a.onLoaded(s)
                    } catch (e) {
                        "string" == typeof e ? console.error(e) : window.onerror(e.message, null, null, null, e)
                    }
                }
            }
            static _transformImgUrl(e, a, n) {
                if (l.isZiYu || i.isLocalNativeFile(e)) return i.isLocalNativeZipFile(e) && (e = i.getFileNativePath(e)), void n._loadImage(e, !1);
                if (l.autoCacheFile) {
                    var o = t.URL.formatURL(e);
                    i.isLocalNativeFile(e) || i.getFileInfo(o) ? s.onCreateImage(e, n) : i.isNetFile(o) ? i.downOtherFiles(o, new t.Handler(s, s.onDownImgCallBack, [e, n]), o) : s.onCreateImage(e, n, !0)
                } else n._loadImage(e)
            }
            static onDownImgCallBack(e, t, i, a = "") {
                i ? t.onError(null) : s.onCreateImage(e, t, !1, a)
            }
            static onCreateImage(e, a, n = !1, o = "") {
                var s;
                if (l.autoCacheFile)
                    if (n)
                        if (l.isZiYu) {
                            var r = t.URL.formatURL(e);
                            s = i.ziyuFileTextureData[r] ? i.ziyuFileTextureData[r] : e
                        } else s = e;
                else if ("" != o) s = o;
                else {
                    var d = i.getFileInfo(t.URL.formatURL(e));
                    s = d.tempFilePath || i.getFileNativePath(d.md5)
                } else s = n ? e : o;
                a._loadImage(s, !1)
            }
        }
        class r {
            constructor() {}
            static __init__() {
                r.items = r
            }
            static setItem(e, i) {
                if (t.Laya.isWXPlayable) return null;
                try {
                    l.window.wx.setStorageSync(e, i)
                } catch (t) {
                    l.window.wx.setStorage({
                        key: e,
                        data: i
                    })
                }
            }
            static getItem(e) {
                return t.Laya.isWXPlayable ? null : l.window.wx.getStorageSync(e)
            }
            static setJSON(e, i) {
                t.Laya.isWXPlayable || r.setItem(e, i)
            }
            static getJSON(e) {
                return t.Laya.isWXPlayable ? null : r.getItem(e)
            }
            static removeItem(e) {
                t.Laya.isWXPlayable || l.window.wx.removeStorageSync(e)
            }
            static clear() {
                t.Laya.isWXPlayable || l.window.wx.clearStorageSync()
            }
            static getStorageInfoSync() {
                if (t.Laya.isWXPlayable) return null;
                try {
                    var e = l.window.wx.getStorageInfoSync();
                    return console.log(e.keys), console.log(e.currentSize), console.log(e.limitSize), e
                } catch (e) {}
                return null
            }
        }
        r.support = !0;
        class l {
            static getJson(e) {
                return JSON.parse(e)
            }
            static enable() {
                l.init(t.Laya.isWXPosMsg, t.Laya.isWXOpenDataContext)
            }
            static init(e = !1, a = !1) {
                l._inited || (l._inited = !0, l.window = window, l.window.hasOwnProperty("wx") && (l.window.navigator.userAgent.indexOf("MiniGame") < 0 || (l.isZiYu = a, l.isPosMsgYu = e, l.EnvConfig = {}, l.isZiYu || t.Laya.isWXPlayable || (i.setNativeFileDir("/layaairGame"), i.getCacheList(i.fileNativeDir, t.Handler.create(l, l.onMkdirCallBack))), l.systemInfo = l.window.wx.getSystemInfoSync(), l.window.focus = function() {}, t.Laya._getUrlPath = function() {
                    return ""
                }, l.window.logtime = function(e) {}, l.window.alertTimeLog = function(e) {}, l.window.resetShareInfo = function() {}, l.window.CanvasRenderingContext2D = function() {}, l.window.CanvasRenderingContext2D.prototype = l.window.wx.createCanvas().getContext("2d").__proto__, l.window.document.body.appendChild = function() {}, l.EnvConfig.pixelRatioInt = 0, t.Browser._pixelRatio = l.pixelRatio(), l._preCreateElement = t.Browser.createElement, t.Browser.createElement = l.createElement, t.RunDriver.createShaderCondition = l.createShaderCondition, t.Utils.parseXMLFromString = l.parseXMLFromString, t.Input._createInputElement = o._createInputElement, window.ImageData || (window.ImageData = ImageDataPolyfill), t.Loader.prototype._loadResourceFilter = s.prototype._loadResourceFilter, t.Loader.prototype.originComplete = t.Loader.prototype.complete, t.Loader.prototype.complete = s.prototype.complete, t.Loader.prototype._loadSound = s.prototype._loadSound, t.Loader.prototype._loadHttpRequestWhat = s.prototype._loadHttpRequestWhat, t.LocalStorage._baseClass = r, r.__init__(), l.window.wx.onMessage && l.window.wx.onMessage(l._onMessage))))
            }
            static _onMessage(e) {
                switch (e.type) {
                    case "changeMatrix":
                        t.Laya.stage.transform.identity(), t.Laya.stage._width = e.w, t.Laya.stage._height = e.h, t.Laya.stage._canvasTransform = new t.Matrix(e.a, e.b, e.c, e.d, e.tx, e.ty);
                        break;
                    case "display":
                        t.Laya.stage.frameRate = e.rate || t.Stage.FRAME_FAST;
                        break;
                    case "undisplay":
                        t.Laya.stage.frameRate = t.Stage.FRAME_SLEEP
                }
                "opendatacontext" == e.isLoad ? e.url && (i.ziyuFileData[e.url] = e.atlasdata, i.ziyuFileTextureData[e.imgReadyUrl] = e.imgNativeUrl) : "openJsondatacontext" == e.isLoad ? e.url && (i.ziyuFileData[e.url] = e.atlasdata) : "openJsondatacontextPic" == e.isLoad && (i.ziyuFileTextureData[e.imgReadyUrl] = e.imgNativeUrl)
            }
            static loadZip(e, t, a, n, o = 0) {
                var s = i.fs;
                if (s && s.unzip) {
                    l.nativefiles.push(t), l.nativezipfiles.push(t);
                    var r = i.fileNativeDir + "/" + t;
                    l.zipHeadFiles[e] = t, s.access({
                        path: r,
                        success: function(t) {
                            if (1 == o) {
                                try {
                                    s.rmdirSync(r, !0)
                                } catch (e) {
                                    console.log("目录删除成功"), console.log(e)
                                }
                                s.mkdir({
                                    dirPath: r,
                                    recursive: !0,
                                    success: function(t) {
                                        l.downZip(e, r, s, a, n)
                                    }.bind(this),
                                    fail: function(e) {
                                        null != a && a.runWith([{
                                            errCode: 3,
                                            errMsg: "创建压缩包目录失败",
                                            wxData: e
                                        }])
                                    }.bind(this)
                                })
                            } else if (2 == o) l.downZip(e, r, s, a, n);
                            else {
                                i.getFileInfo(e) ? null != a && a.runWith([{
                                    errCode: 0,
                                    errMsg: "zip包目录存在，直接返回完成",
                                    wxData: t
                                }]) : l.downZip(e, r, s, a, n)
                            }
                        }.bind(this),
                        fail: function(t) {
                            t && -1 != t.errMsg.indexOf("access:fail no such file or directory") && s.mkdir({
                                dirPath: r,
                                recursive: !0,
                                success: function(t) {
                                    l.downZip(e, r, s, a, n)
                                }.bind(this),
                                fail: function(e) {
                                    null != a && a.runWith([{
                                        errCode: 3,
                                        errMsg: "创建压缩包目录失败",
                                        wxData: e
                                    }])
                                }.bind(this)
                            })
                        }.bind(this)
                    })
                } else null != a && a.runWith([{
                    errCode: 2,
                    errMsg: "微信压缩接口不支持"
                }])
            }
            static downZip(e, t, a, n, o) {
                var s = {
                    zipFilePath: e,
                    targetPath: t,
                    success: function(e) {
                        null != n && n.runWith([{
                            errCode: 0,
                            errMsg: "解压成功",
                            wxData: e
                        }])
                    }.bind(this),
                    fail: function(e) {
                        null != n && n.runWith([{
                            errCode: 1,
                            errMsg: "解压失败",
                            wxData: e
                        }])
                    }.bind(this)
                }; - 1 == e.indexOf("http://") && -1 == e.indexOf("https://") ? a.unzip(s) : window.wx.downloadFile({
                    url: e,
                    success: function(t) {
                        200 === t.statusCode ? (s.zipFilePath = t.tempFilePath, a.unzip(s), i.copyTOCache(t.tempFilePath, e, null, "utf8", !0)) : null != n && n.runWith([{
                            errCode: 4,
                            errMsg: "远端下载zip包失败",
                            wxData: t
                        }])
                    }.bind(this),
                    fail: function(e) {
                        null != n && n.runWith([{
                            errCode: 4,
                            errMsg: "远端下载zip包失败",
                            wxData: e
                        }])
                    }.bind(this)
                }).onProgressUpdate((function(e) {
                    null != o && o.runWith([{
                        errCode: 5,
                        errMsg: "zip包下载中",
                        progress: e.progress
                    }])
                }))
            }
            static getUrlEncode(e, t) {
                return "arraybuffer" == t ? "" : "utf8"
            }
            static downLoadFile(e, t = "", a = null, n = "utf8") {
                i.getFileInfo(e) ? null != a && a.runWith([0]) : i.downLoadFile(e, t, a, n)
            }
            static remove(e, t = null) {
                i.deleteFile("", e, t, "", 0)
            }
            static removeAll() {
                i.deleteAll()
            }
            static hasNativeFile(e) {
                return i.isLocalNativeFile(e)
            }
            static getFileInfo(e) {
                return i.getFileInfo(e)
            }
            static getFileList() {
                return i.filesListObj
            }
            static exitMiniProgram() {
                l.window.wx.exitMiniProgram()
            }
            static onMkdirCallBack(e, t) {
                e ? (i.fakeObj = {}, i.filesListObj = {}) : (i.filesListObj = JSON.parse(t.data), i.fakeObj = JSON.parse(t.data));
                let a = [];
                try {
                    a = i.fs.readdirSync(i.fileNativeDir)
                } catch (e) {
                    return
                }
                if (a && a.length) {
                    var n, o, s = {};
                    for (let e in i.filesListObj) "fileUsedSize" != e && (s[(n = i.filesListObj[e]).md5] = n.readyUrl);
                    for (let e = 0, t = a.length; e < t; e++)
                        if ((o = a[e]) != i.fileListName) {
                            if (!s[o]) {
                                let e = i.getFileNativePath(o);
                                i.fs.unlink({
                                    filePath: e,
                                    success: function(e) {
                                        console.log("删除无引用的磁盘文件:" + o)
                                    }
                                })
                            }
                            delete s[o]
                        }
                    for (let e in s) delete i.filesListObj[s[e]], delete i.fakeObj[s[e]], console.log("删除错误记录：", s[e])
                }
            }
            static pixelRatio() {
                if (!l.EnvConfig.pixelRatioInt) {
                    if (t.isWXPlayable && window._playableCanvasErr) return l.EnvConfig.pixelRatioInt = 1, 1;
                    try {
                        return l.EnvConfig.pixelRatioInt = l.systemInfo.pixelRatio, l.systemInfo.pixelRatio
                    } catch (e) {}
                }
                return l.EnvConfig.pixelRatioInt
            }
            static createElement(e) {
                var t;
                if ("canvas" == e) return 1 == l.idx ? l.isZiYu ? (t = l.window.sharedCanvas).style = {} : t = l.window.canvas : t = l.window.wx.createCanvas(), l.idx++, t;
                if ("textarea" == e || "input" == e) return l.onCreateInput(e);
                if ("div" == e) {
                    var i = l._preCreateElement(e);
                    return i.contains = function(e) {
                        return null
                    }, i.removeChild = function(e) {}, i
                }
                return l._preCreateElement(e)
            }
            static onCreateInput(e) {
                var t = l._preCreateElement(e);
                return t.focus = o.wxinputFocus, t.blur = o.wxinputblur, t.style = {}, t.value = 0, t.parentElement = {}, t.placeholder = {}, t.type = {}, t.setColor = function(e) {}, t.setType = function(e) {}, t.setFontFace = function(e) {}, t.addEventListener = function(e) {}, t.contains = function(e) {
                    return null
                }, t.removeChild = function(e) {}, t
            }
            static createShaderCondition(e) {
                return function() {
                    return this[e.replace("this.", "")]
                }
            }
            static sendAtlasToOpenDataContext(e) {
                if (!l.isZiYu) {
                    var i = t.Loader.getRes(e);
                    if (!i) throw Error("传递的url没有获取到对应的图集数据信息，请确保图集已经过！");
                    if (i.meta && i.meta.image)
                        for (var a = i.meta.image.split(","), n = e.indexOf("/") >= 0 ? "/" : "\\", o = e.lastIndexOf(n), s = o >= 0 ? e.substr(0, o + 1) : "", r = 0, d = a.length; r < d; r++) a[r] = s + a[r];
                    else a = [e.replace(".json", ".png")];
                    for (r = 0; r < a.length; r++) {
                        var u = a[r];
                        l.postInfoToContext(t.Laya.URL.formatURL(e), t.Laya.URL.formatURL(u), i)
                    }
                }
            }
            static postInfoToContext(e, a, n) {
                var o = {
                        frames: n.frames,
                        meta: n.meta
                    },
                    s = a,
                    r = i.getFileInfo(t.URL.formatURL(a));
                if (r) var d = r.tempFilePath || i.getFileNativePath(r.md5);
                else d = s;
                if (!d) throw Error("获取图集的磁盘url路径不存在！");
                l.window.wx.postMessage({
                    url: e,
                    atlasdata: o,
                    imgNativeUrl: d,
                    imgReadyUrl: s,
                    isLoad: "opendatacontext"
                })
            }
            static sendSinglePicToOpenDataContext(e) {
                var a = t.Laya.URL.formatURL(e),
                    n = i.getFileInfo(a);
                if (n) {
                    var o = n.tempFilePath || i.getFileNativePath(n.md5);
                    e = a
                } else o = e;
                if (!o) throw Error("获取图集的磁盘url路径不存在！");
                l.window.wx.postMessage({
                    url: a,
                    imgNativeUrl: o,
                    imgReadyUrl: a,
                    isLoad: "openJsondatacontextPic"
                })
            }
            static sendJsonDataToDataContext(e) {
                if (!l.isZiYu) {
                    e = t.Laya.URL.formatURL(e);
                    var i = t.Loader.getRes(e);
                    if (!i) throw Error("传递的url没有获取到对应的图集数据信息，请确保图集已经过！");
                    l.window.wx.postMessage({
                        url: e,
                        atlasdata: i,
                        isLoad: "openJsondatacontext"
                    })
                }
            }
        }
        l._inited = !1, l.autoCacheFile = !0, l.minClearSize = 5242880, l.sizeLimit = 209715200, l.nativefiles = ["layaNativeDir", "wxlocal"], l.nativezipfiles = [], l.zipRequestHead = "", l.zipHeadFiles = {}, l.subNativeFiles = [], l.subNativeheads = [], l.subMaps = [], l.AutoCacheDownFile = !1, l.remotefiles = [], l.cacheExcludes = [], l.parseXMLFromString = function(e) {
            var t;
            e = e.replace(/>\s+</g, "><");
            try {
                t = (new l.window.Parser.DOMParser).parseFromString(e, "text/xml")
            } catch (e) {
                throw Error("需要引入xml解析库文件")
            }
            return t
        }, l.idx = 1;
        class d extends t.EventDispatcher {
            constructor() {
                super()
            }
            static __init__() {
                try {
                    var e;
                    if (!(e = t.Accelerator)) return;
                    e.prototype.on = d.prototype.on, e.prototype.off = d.prototype.off
                } catch (e) {}
            }
            static startListen(e) {
                if (d._callBack = e, !d._isListening) {
                    d._isListening = !0;
                    try {
                        l.window.wx.onAccelerometerChange(d.onAccelerometerChange)
                    } catch (e) {}
                }
            }
            static stopListen() {
                d._isListening = !1;
                try {
                    l.window.wx.stopAccelerometer({})
                } catch (e) {}
            }
            static onAccelerometerChange(e) {
                var t;
                (t = {}).acceleration = e, t.accelerationIncludingGravity = e, t.rotationRate = {}, null != d._callBack && d._callBack(t)
            }
            on(e, t, i, a = null) {
                return super.on(e, t, i, a), d.startListen(this.onDeviceOrientationChange), this
            }
            off(e, t, i, a = !1) {
                return this.hasListener(e) || d.stopListen(), super.off(e, t, i, a)
            }
        }
        d._isListening = !1;
        class u {
            constructor() {}
            static __init__() {
                l.window.navigator.geolocation.getCurrentPosition = u.getCurrentPosition, l.window.navigator.geolocation.watchPosition = u.watchPosition, l.window.navigator.geolocation.clearWatch = u.clearWatch
            }
            static getCurrentPosition(e = null, t = null, i = null) {
                var a;
                (a = {}).success = function(t) {
                    null != e && e(t)
                }, a.fail = t, l.window.wx.getLocation(a)
            }
            static watchPosition(e = null, i = null, a = null) {
                var n;
                return u._curID++, (n = {}).success = e, n.error = i, u._watchDic[u._curID] = n, t.Laya.systemTimer.loop(1e3, null, u._myLoop), u._curID
            }
            static clearWatch(e) {
                delete u._watchDic[e], u._hasWatch() || t.Laya.systemTimer.clear(null, u._myLoop)
            }
            static _hasWatch() {
                var e;
                for (e in u._watchDic)
                    if (u._watchDic[e]) return !0;
                return !1
            }
            static _myLoop() {
                u.getCurrentPosition(u._mySuccess, u._myError)
            }
            static _mySuccess(e) {
                var i, a = {};
                for (i in a.coords = e, a.timestamp = t.Browser.now(), u._watchDic) u._watchDic[i].success && u._watchDic[i].success(a)
            }
            static _myError(e) {
                var t;
                for (t in u._watchDic) u._watchDic[t].error && u._watchDic[t].error(e)
            }
        }
        u._watchDic = {}, u._curID = 0;
        e.ImageDataPolyfill = ImageDataPolyfill, e.MiniAccelerator = d, e.MiniAdpter = l, e.MiniFileMgr = i, e.MiniInput = o, e.MiniLoader = s, e.MiniLocalStorage = r, e.MiniLocation = u, e.MiniSound = n, e.MiniSoundChannel = a, e.MiniVideo = class {
            constructor(e = 320, t = 240) {
                this.videoend = !1, this.videourl = "", this.videoElement = l.window.wx.createVideo({
                    width: e,
                    height: t,
                    autoplay: !0
                })
            }
            static __init__() {}
            on(e, t, i) {
                "loadedmetadata" == e ? (this.onPlayFunc = i.bind(t), this.videoElement.onPlay = this.onPlayFunction.bind(this)) : "ended" == e && (this.onEndedFunC = i.bind(t), this.videoElement.onEnded = this.onEndedFunction.bind(this)), this.videoElement.onTimeUpdate = this.onTimeUpdateFunc.bind(this)
            }
            onTimeUpdateFunc(e) {
                this.position = e.position, this._duration = e.duration
            }
            get duration() {
                return this._duration
            }
            onPlayFunction() {
                this.videoElement && (this.videoElement.readyState = 200), console.log("=====视频加载完成========"), null != this.onPlayFunc && this.onPlayFunc()
            }
            onEndedFunction() {
                this.videoElement && (this.videoend = !0, console.log("=====视频播放完毕========"), null != this.onEndedFunC && this.onEndedFunC())
            }
            off(e, t, i) {
                "loadedmetadata" == e ? (this.onPlayFunc = i.bind(t), this.videoElement.offPlay = this.onPlayFunction.bind(this)) : "ended" == e && (this.onEndedFunC = i.bind(t), this.videoElement.offEnded = this.onEndedFunction.bind(this))
            }
            load(e) {
                this.videoElement && (this.videoElement.src = e)
            }
            play() {
                this.videoElement && (this.videoend = !1, this.videoElement.play())
            }
            pause() {
                this.videoElement && (this.videoend = !0, this.videoElement.pause())
            }
            get currentTime() {
                return this.videoElement ? this.videoElement.initialTime : 0
            }
            set currentTime(e) {
                this.videoElement && (this.videoElement.initialTime = e)
            }
            get videoWidth() {
                return this.videoElement ? this.videoElement.width : 0
            }
            get videoHeight() {
                return this.videoElement ? this.videoElement.height : 0
            }
            get ended() {
                return this.videoend
            }
            get loop() {
                return !!this.videoElement && this.videoElement.loop
            }
            set loop(e) {
                this.videoElement && (this.videoElement.loop = e)
            }
            get playbackRate() {
                return this.videoElement ? this.videoElement.playbackRate : 0
            }
            set playbackRate(e) {
                this.videoElement && (this.videoElement.playbackRate = e)
            }
            get muted() {
                return !!this.videoElement && this.videoElement.muted
            }
            set muted(e) {
                this.videoElement && (this.videoElement.muted = e)
            }
            get paused() {
                return !!this.videoElement && this.videoElement.paused
            }
            size(e, t) {
                this.videoElement && (this.videoElement.width = e, this.videoElement.height = t)
            }
            get x() {
                return this.videoElement ? this.videoElement.x : 0
            }
            set x(e) {
                this.videoElement && (this.videoElement.x = e)
            }
            get y() {
                return this.videoElement ? this.videoElement.y : 0
            }
            set y(e) {
                this.videoElement && (this.videoElement.y = e)
            }
            get currentSrc() {
                return this.videoElement.src
            }
            destroy() {
                this.videoElement && this.videoElement.destroy(), this.videoElement = null, this.onEndedFunC = null, this.onPlayFunc = null, this.videoend = !1, this.videourl = null
            }
            reload() {
                this.videoElement && (this.videoElement.src = this.videourl)
            }
        }
    };
});
var global = (function() {
    return this
})();
if (!global && typeof GameGlobal !== 'undefined') global = GameGlobal;
var pluginInfoMap = {};;
global.requirePlugin = global.requirePlugin || function(path) {
    var position = path.indexOf('/');
    var alias = '';
    var pagePath = '';
    if (position !== -1) {
        alias = path.substr(0, position);
        pagePath = path.substr(position + 1, path.length);
    } else {
        alias = path;
    }
    if (pluginInfoMap.hasOwnProperty(alias)) {
        var realPath = '';
        if (pagePath.length === 0) {
            realPath = '__plugin__/' + pluginInfoMap[alias].appid;
            return require(realPath);
        } else {
            realPath = '__plugin__/' + pluginInfoMap[alias].appid + '/' + pagePath;
            return require(realPath);
        }
    } else {
        console.error('not found alias: ', alias);
        throw new Error('Plugin ' + alias + ' is not defined.')
    }
};
define("loading/game.js", function(require, module, exports) {

});
require("loading/game.js");