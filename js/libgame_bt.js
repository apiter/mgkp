define("libs/min/fx.d2.min.js", function(require, module, exports) {
    window.pako = function r(t, e, a) {
        function h(u, f) {
            if (!e[u]) {
                if (!t[u]) {
                    var g = "function" == typeof require && require;
                    if (!f && g) return g(u, !0);
                    if (n) return n(u, !0);
                    var _ = new Error("Cannot find module '" + u + "'");
                    throw _.code = "MODULE_NOT_FOUND", _
                }
                var p = e[u] = {
                    exports: {}
                };
                t[u][0].call(p.exports, (function(e) {
                    return h(t[u][1][e] || e)
                }), p, p.exports, r, t, e, a)
            }
            return e[u].exports
        }
        for (var n = "function" == typeof require && require, u = 0; u < a.length; u++) h(a[u]);
        return h
    }({
        1: [function(t, e, a) {
            "use strict";
            var n = t("./zlib/deflate"),
                u = t("./utils/common"),
                f = t("./utils/strings"),
                g = t("./zlib/messages"),
                _ = t("./zlib/zstream"),
                p = Object.prototype.toString;

            function c(t) {
                if (!(this instanceof c)) return new c(t);
                this.options = u.assign({
                    level: -1,
                    method: 8,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: 0,
                    to: ""
                }, t || {});
                var e = this.options;
                e.raw && 0 < e.windowBits ? e.windowBits = -e.windowBits : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _, this.strm.avail_out = 0;
                var a = n.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
                if (0 !== a) throw new Error(g[a]);
                if (e.header && n.deflateSetHeader(this.strm, e.header), e.dictionary) {
                    var y;
                    if (y = "string" == typeof e.dictionary ? f.string2buf(e.dictionary) : "[object ArrayBuffer]" === p.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, 0 !== (a = n.deflateSetDictionary(this.strm, y))) throw new Error(g[a]);
                    this._dict_set = !0
                }
            }

            function i(t, e) {
                var a = new c(e);
                if (a.push(t, !0), a.err) throw a.msg || g[a.err];
                return a.result
            }
            c.prototype.push = function(t, e) {
                var a, g, _ = this.strm,
                    y = this.options.chunkSize;
                if (this.ended) return !1;
                g = e === ~~e ? e : !0 === e ? 4 : 0, "string" == typeof t ? _.input = f.string2buf(t) : "[object ArrayBuffer]" === p.call(t) ? _.input = new Uint8Array(t) : _.input = t, _.next_in = 0, _.avail_in = _.input.length;
                do {
                    if (0 === _.avail_out && (_.output = new u.Buf8(y), _.next_out = 0, _.avail_out = y), 1 !== (a = n.deflate(_, g)) && 0 !== a) return this.onEnd(a), !(this.ended = !0);
                    0 !== _.avail_out && (0 !== _.avail_in || 4 !== g && 2 !== g) || ("string" === this.options.to ? this.onData(f.buf2binstring(u.shrinkBuf(_.output, _.next_out))) : this.onData(u.shrinkBuf(_.output, _.next_out)))
                } while ((0 < _.avail_in || 0 === _.avail_out) && 1 !== a);
                return 4 === g ? (a = n.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, 0 === a) : 2 !== g || (this.onEnd(0), !(_.avail_out = 0))
            }, c.prototype.onData = function(t) {
                this.chunks.push(t)
            }, c.prototype.onEnd = function(t) {
                0 === t && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = u.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
            }, a.Deflate = c, a.deflate = i, a.deflateRaw = function(t, e) {
                return (e = e || {}).raw = !0, i(t, e)
            }, a.gzip = function(t, e) {
                return (e = e || {}).gzip = !0, i(t, e)
            }
        }, {
            "./utils/common": 3,
            "./utils/strings": 4,
            "./zlib/deflate": 8,
            "./zlib/messages": 13,
            "./zlib/zstream": 15
        }],
        2: [function(t, e, a) {
            "use strict";
            var n = t("./zlib/inflate"),
                u = t("./utils/common"),
                f = t("./utils/strings"),
                g = t("./zlib/constants"),
                _ = t("./zlib/messages"),
                p = t("./zlib/zstream"),
                y = t("./zlib/gzheader"),
                m = Object.prototype.toString;

            function s(t) {
                if (!(this instanceof s)) return new s(t);
                this.options = u.assign({
                    chunkSize: 16384,
                    windowBits: 0,
                    to: ""
                }, t || {});
                var e = this.options;
                e.raw && 0 <= e.windowBits && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(0 <= e.windowBits && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), 15 < e.windowBits && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new p, this.strm.avail_out = 0;
                var a = n.inflateInit2(this.strm, e.windowBits);
                if (a !== g.Z_OK) throw new Error(_[a]);
                this.header = new y, n.inflateGetHeader(this.strm, this.header)
            }

            function o(t, e) {
                var a = new s(e);
                if (a.push(t, !0), a.err) throw a.msg || _[a.err];
                return a.result
            }
            s.prototype.push = function(t, e) {
                var a, _, p, y, b, w, x = this.strm,
                    v = this.options.chunkSize,
                    S = this.options.dictionary,
                    E = !1;
                if (this.ended) return !1;
                _ = e === ~~e ? e : !0 === e ? g.Z_FINISH : g.Z_NO_FLUSH, "string" == typeof t ? x.input = f.binstring2buf(t) : "[object ArrayBuffer]" === m.call(t) ? x.input = new Uint8Array(t) : x.input = t, x.next_in = 0, x.avail_in = x.input.length;
                do {
                    if (0 === x.avail_out && (x.output = new u.Buf8(v), x.next_out = 0, x.avail_out = v), (a = n.inflate(x, g.Z_NO_FLUSH)) === g.Z_NEED_DICT && S && (w = "string" == typeof S ? f.string2buf(S) : "[object ArrayBuffer]" === m.call(S) ? new Uint8Array(S) : S, a = n.inflateSetDictionary(this.strm, w)), a === g.Z_BUF_ERROR && !0 === E && (a = g.Z_OK, E = !1), a !== g.Z_STREAM_END && a !== g.Z_OK) return this.onEnd(a), !(this.ended = !0);
                    x.next_out && (0 !== x.avail_out && a !== g.Z_STREAM_END && (0 !== x.avail_in || _ !== g.Z_FINISH && _ !== g.Z_SYNC_FLUSH) || ("string" === this.options.to ? (p = f.utf8border(x.output, x.next_out), y = x.next_out - p, b = f.buf2string(x.output, p), x.next_out = y, x.avail_out = v - y, y && u.arraySet(x.output, x.output, p, y, 0), this.onData(b)) : this.onData(u.shrinkBuf(x.output, x.next_out)))), 0 === x.avail_in && 0 === x.avail_out && (E = !0)
                } while ((0 < x.avail_in || 0 === x.avail_out) && a !== g.Z_STREAM_END);
                return a === g.Z_STREAM_END && (_ = g.Z_FINISH), _ === g.Z_FINISH ? (a = n.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === g.Z_OK) : _ !== g.Z_SYNC_FLUSH || (this.onEnd(g.Z_OK), !(x.avail_out = 0))
            }, s.prototype.onData = function(t) {
                this.chunks.push(t)
            }, s.prototype.onEnd = function(t) {
                t === g.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = u.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
            }, a.Inflate = s, a.inflate = o, a.inflateRaw = function(t, e) {
                return (e = e || {}).raw = !0, o(t, e)
            }, a.ungzip = o
        }, {
            "./utils/common": 3,
            "./utils/strings": 4,
            "./zlib/constants": 6,
            "./zlib/gzheader": 9,
            "./zlib/inflate": 11,
            "./zlib/messages": 13,
            "./zlib/zstream": 15
        }],
        3: [function(t, e, a) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            a.assign = function(t) {
                for (var e, a, n = Array.prototype.slice.call(arguments, 1); n.length;) {
                    var u = n.shift();
                    if (u) {
                        if ("object" != typeof u) throw new TypeError(u + "must be non-object");
                        for (var f in u) e = u, a = f, Object.prototype.hasOwnProperty.call(e, a) && (t[f] = u[f])
                    }
                }
                return t
            }, a.shrinkBuf = function(t, e) {
                return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t)
            };
            var u = {
                    arraySet: function(t, e, a, n, u) {
                        if (e.subarray && t.subarray) t.set(e.subarray(a, a + n), u);
                        else
                            for (var f = 0; f < n; f++) t[u + f] = e[a + f]
                    },
                    flattenChunks: function(t) {
                        var e, a, n, u, f, g;
                        for (e = n = 0, a = t.length; e < a; e++) n += t[e].length;
                        for (g = new Uint8Array(n), e = u = 0, a = t.length; e < a; e++) f = t[e], g.set(f, u), u += f.length;
                        return g
                    }
                },
                f = {
                    arraySet: function(t, e, a, n, u) {
                        for (var f = 0; f < n; f++) t[u + f] = e[a + f]
                    },
                    flattenChunks: function(t) {
                        return [].concat.apply([], t)
                    }
                };
            a.setTyped = function(t) {
                t ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, u)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, f))
            }, a.setTyped(n)
        }, {}],
        4: [function(t, e, a) {
            "use strict";
            var n = t("./common"),
                u = !0,
                f = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (t) {
                u = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (t) {
                f = !1
            }
            for (var g = new n.Buf8(256), _ = 0; _ < 256; _++) g[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;

            function d(t, e) {
                if (e < 65534 && (t.subarray && f || !t.subarray && u)) return String.fromCharCode.apply(null, n.shrinkBuf(t, e));
                for (var a = "", g = 0; g < e; g++) a += String.fromCharCode(t[g]);
                return a
            }
            g[254] = g[254] = 1, a.string2buf = function(t) {
                var e, a, u, f, g, _ = t.length,
                    p = 0;
                for (f = 0; f < _; f++) 55296 == (64512 & (a = t.charCodeAt(f))) && f + 1 < _ && 56320 == (64512 & (u = t.charCodeAt(f + 1))) && (a = 65536 + (a - 55296 << 10) + (u - 56320), f++), p += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
                for (e = new n.Buf8(p), f = g = 0; g < p; f++) 55296 == (64512 & (a = t.charCodeAt(f))) && f + 1 < _ && 56320 == (64512 & (u = t.charCodeAt(f + 1))) && (a = 65536 + (a - 55296 << 10) + (u - 56320), f++), e[g++] = a < 128 ? a : (e[g++] = a < 2048 ? 192 | a >>> 6 : (e[g++] = a < 65536 ? 224 | a >>> 12 : (e[g++] = 240 | a >>> 18, 128 | a >>> 12 & 63), 128 | a >>> 6 & 63), 128 | 63 & a);
                return e
            }, a.buf2binstring = function(t) {
                return d(t, t.length)
            }, a.binstring2buf = function(t) {
                for (var e = new n.Buf8(t.length), a = 0, u = e.length; a < u; a++) e[a] = t.charCodeAt(a);
                return e
            }, a.buf2string = function(t, e) {
                var a, n, u, f, _ = e || t.length,
                    p = new Array(2 * _);
                for (a = n = 0; a < _;)
                    if ((u = t[a++]) < 128) p[n++] = u;
                    else if (4 < (f = g[u])) p[n++] = 65533, a += f - 1;
                else {
                    for (u &= 2 === f ? 31 : 3 === f ? 15 : 7; 1 < f && a < _;) u = u << 6 | 63 & t[a++], f--;
                    p[n++] = 1 < f ? 65533 : u < 65536 ? u : (u -= 65536, p[n++] = 55296 | u >> 10 & 1023, 56320 | 1023 & u)
                }
                return d(p, n)
            }, a.utf8border = function(t, e) {
                var a;
                for ((e = e || t.length) > t.length && (e = t.length), a = e - 1; 0 <= a && 128 == (192 & t[a]);) a--;
                return a < 0 || 0 === a ? e : a + g[t[a]] > e ? a : e
            }
        }, {
            "./common": 3
        }],
        5: [function(t, e, a) {
            "use strict";
            e.exports = function(t, e, a, n) {
                for (var u = 65535 & t | 0, f = t >>> 16 & 65535 | 0, g = 0; 0 !== a;) {
                    for (a -= g = 2e3 < a ? 2e3 : a; f = f + (u = u + e[n++] | 0) | 0, --g;);
                    u %= 65521, f %= 65521
                }
                return u | f << 16 | 0
            }
        }, {}],
        6: [function(t, e, a) {
            "use strict";
            e.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }, {}],
        7: [function(t, e, a) {
            "use strict";
            var n = function() {
                for (var t, e = [], a = 0; a < 256; a++) {
                    t = a;
                    for (var n = 0; n < 8; n++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                    e[a] = t
                }
                return e
            }();
            e.exports = function(t, e, a, u) {
                var f = n,
                    g = u + a;
                t ^= -1;
                for (var _ = u; _ < g; _++) t = t >>> 8 ^ f[255 & (t ^ e[_])];
                return -1 ^ t
            }
        }, {}],
        8: [function(t, e, a) {
            "use strict";
            var n, u = t("../utils/common"),
                f = t("./trees"),
                g = t("./adler32"),
                _ = t("./crc32"),
                p = t("./messages"),
                y = -2,
                m = 258,
                b = 262,
                w = 113;

            function N(t, e) {
                return t.msg = p[e], e
            }

            function O(t) {
                return (t << 1) - (4 < t ? 9 : 0)
            }

            function D(t) {
                for (var e = t.length; 0 <= --e;) t[e] = 0
            }

            function I(t) {
                var e = t.state,
                    a = e.pending;
                a > t.avail_out && (a = t.avail_out), 0 !== a && (u.arraySet(t.output, e.pending_buf, e.pending_out, a, t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0))
            }

            function U(t, e) {
                f._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, I(t.strm)
            }

            function T(t, e) {
                t.pending_buf[t.pending++] = e
            }

            function F(t, e) {
                t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e
            }

            function L(t, e) {
                var a, n, u = t.max_chain_length,
                    f = t.strstart,
                    g = t.prev_length,
                    _ = t.nice_match,
                    p = t.strstart > t.w_size - b ? t.strstart - (t.w_size - b) : 0,
                    y = t.window,
                    w = t.w_mask,
                    x = t.prev,
                    v = t.strstart + m,
                    S = y[f + g - 1],
                    E = y[f + g];
                t.prev_length >= t.good_match && (u >>= 2), _ > t.lookahead && (_ = t.lookahead);
                do {
                    if (y[(a = e) + g] === E && y[a + g - 1] === S && y[a] === y[f] && y[++a] === y[f + 1]) {
                        f += 2, a++;
                        do {} while (y[++f] === y[++a] && y[++f] === y[++a] && y[++f] === y[++a] && y[++f] === y[++a] && y[++f] === y[++a] && y[++f] === y[++a] && y[++f] === y[++a] && y[++f] === y[++a] && f < v);
                        if (n = m - (v - f), f = v - m, g < n) {
                            if (t.match_start = e, _ <= (g = n)) break;
                            S = y[f + g - 1], E = y[f + g]
                        }
                    }
                } while ((e = x[e & w]) > p && 0 != --u);
                return g <= t.lookahead ? g : t.lookahead
            }

            function H(t) {
                var e, a, n, f, p, y, m, w, x, v, S = t.w_size;
                do {
                    if (f = t.window_size - t.lookahead - t.strstart, t.strstart >= S + (S - b)) {
                        for (u.arraySet(t.window, t.window, S, S, 0), t.match_start -= S, t.strstart -= S, t.block_start -= S, e = a = t.hash_size; n = t.head[--e], t.head[e] = S <= n ? n - S : 0, --a;);
                        for (e = a = S; n = t.prev[--e], t.prev[e] = S <= n ? n - S : 0, --a;);
                        f += S
                    }
                    if (0 === t.strm.avail_in) break;
                    if (y = t.strm, m = t.window, w = t.strstart + t.lookahead, v = void 0, (x = f) < (v = y.avail_in) && (v = x), a = 0 === v ? 0 : (y.avail_in -= v, u.arraySet(m, y.input, y.next_in, v, w), 1 === y.state.wrap ? y.adler = g(y.adler, m, v, w) : 2 === y.state.wrap && (y.adler = _(y.adler, m, v, w)), y.next_in += v, y.total_in += v, v), t.lookahead += a, t.lookahead + t.insert >= 3)
                        for (p = t.strstart - t.insert, t.ins_h = t.window[p], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[p + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[p + 3 - 1]) & t.hash_mask, t.prev[p & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = p, p++, t.insert--, !(t.lookahead + t.insert < 3)););
                } while (t.lookahead < b && 0 !== t.strm.avail_in)
            }

            function j(t, e) {
                for (var a, n;;) {
                    if (t.lookahead < b) {
                        if (H(t), t.lookahead < b && 0 === e) return 1;
                        if (0 === t.lookahead) break
                    }
                    if (a = 0, t.lookahead >= 3 && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== a && t.strstart - a <= t.w_size - b && (t.match_length = L(t, a)), t.match_length >= 3)
                        if (n = f._tr_tally(t, t.strstart - t.match_start, t.match_length - 3), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= 3) {
                            for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, 0 != --t.match_length;);
                            t.strstart++
                        } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
                    else n = f._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
                    if (n && (U(t, !1), 0 === t.strm.avail_out)) return 1
                }
                return t.insert = t.strstart < 2 ? t.strstart : 2, 4 === e ? (U(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? 1 : 2
            }

            function K(t, e) {
                for (var a, n, u;;) {
                    if (t.lookahead < b) {
                        if (H(t), t.lookahead < b && 0 === e) return 1;
                        if (0 === t.lookahead) break
                    }
                    if (a = 0, t.lookahead >= 3 && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = 2, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - b && (t.match_length = L(t, a), t.match_length <= 5 && (1 === t.strategy || 3 === t.match_length && 4096 < t.strstart - t.match_start) && (t.match_length = 2)), t.prev_length >= 3 && t.match_length <= t.prev_length) {
                        for (u = t.strstart + t.lookahead - 3, n = f._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - 3), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= u && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 != --t.prev_length;);
                        if (t.match_available = 0, t.match_length = 2, t.strstart++, n && (U(t, !1), 0 === t.strm.avail_out)) return 1
                    } else if (t.match_available) {
                        if ((n = f._tr_tally(t, 0, t.window[t.strstart - 1])) && U(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1
                    } else t.match_available = 1, t.strstart++, t.lookahead--
                }
                return t.match_available && (n = f._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < 2 ? t.strstart : 2, 4 === e ? (U(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? 1 : 2
            }

            function M(t, e, a, n, u) {
                this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = n, this.func = u
            }

            function P() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new u.Buf16(1146), this.dyn_dtree = new u.Buf16(122), this.bl_tree = new u.Buf16(78), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new u.Buf16(16), this.heap = new u.Buf16(573), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new u.Buf16(573), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
            }

            function Y(t) {
                var e;
                return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = 2, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? 42 : w, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = 0, f._tr_init(e), 0) : N(t, y)
            }

            function q(t) {
                var e, a = Y(t);
                return 0 === a && ((e = t.state).window_size = 2 * e.w_size, D(e.head), e.max_lazy_match = n[e.level].max_lazy, e.good_match = n[e.level].good_length, e.nice_match = n[e.level].nice_length, e.max_chain_length = n[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0), a
            }

            function G(t, e, a, n, f, g) {
                if (!t) return y;
                var _ = 1;
                if (-1 === e && (e = 6), n < 0 ? (_ = 0, n = -n) : 15 < n && (_ = 2, n -= 16), f < 1 || 9 < f || 8 !== a || n < 8 || 15 < n || e < 0 || 9 < e || g < 0 || 4 < g) return N(t, y);
                8 === n && (n = 9);
                var p = new P;
                return (t.state = p).strm = t, p.wrap = _, p.gzhead = null, p.w_bits = n, p.w_size = 1 << p.w_bits, p.w_mask = p.w_size - 1, p.hash_bits = f + 7, p.hash_size = 1 << p.hash_bits, p.hash_mask = p.hash_size - 1, p.hash_shift = ~~((p.hash_bits + 3 - 1) / 3), p.window = new u.Buf8(2 * p.w_size), p.head = new u.Buf16(p.hash_size), p.prev = new u.Buf16(p.w_size), p.lit_bufsize = 1 << f + 6, p.pending_buf_size = 4 * p.lit_bufsize, p.pending_buf = new u.Buf8(p.pending_buf_size), p.d_buf = 1 * p.lit_bufsize, p.l_buf = 3 * p.lit_bufsize, p.level = e, p.strategy = g, p.method = a, q(t)
            }
            n = [new M(0, 0, 0, 0, (function(t, e) {
                var a = 65535;
                for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5);;) {
                    if (t.lookahead <= 1) {
                        if (H(t), 0 === t.lookahead && 0 === e) return 1;
                        if (0 === t.lookahead) break
                    }
                    t.strstart += t.lookahead, t.lookahead = 0;
                    var n = t.block_start + a;
                    if ((0 === t.strstart || t.strstart >= n) && (t.lookahead = t.strstart - n, t.strstart = n, U(t, !1), 0 === t.strm.avail_out)) return 1;
                    if (t.strstart - t.block_start >= t.w_size - b && (U(t, !1), 0 === t.strm.avail_out)) return 1
                }
                return t.insert = 0, 4 === e ? (U(t, !0), 0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (U(t, !1), t.strm.avail_out), 1)
            })), new M(4, 4, 8, 4, j), new M(4, 5, 16, 8, j), new M(4, 6, 32, 32, j), new M(4, 4, 16, 16, K), new M(8, 16, 32, 32, K), new M(8, 16, 128, 128, K), new M(8, 32, 128, 256, K), new M(32, 128, 258, 1024, K), new M(32, 258, 258, 4096, K)], a.deflateInit = function(t, e) {
                return G(t, e, 8, 15, 8, 0)
            }, a.deflateInit2 = G, a.deflateReset = q, a.deflateResetKeep = Y, a.deflateSetHeader = function(t, e) {
                return t && t.state ? 2 !== t.state.wrap ? y : (t.state.gzhead = e, 0) : y
            }, a.deflate = function(t, e) {
                var a, u, g, p;
                if (!t || !t.state || 5 < e || e < 0) return t ? N(t, y) : y;
                if (u = t.state, !t.output || !t.input && 0 !== t.avail_in || 666 === u.status && 4 !== e) return N(t, 0 === t.avail_out ? -5 : y);
                if (u.strm = t, a = u.last_flush, u.last_flush = e, 42 === u.status)
                    if (2 === u.wrap) t.adler = 0, T(u, 31), T(u, 139), T(u, 8), u.gzhead ? (T(u, (u.gzhead.text ? 1 : 0) + (u.gzhead.hcrc ? 2 : 0) + (u.gzhead.extra ? 4 : 0) + (u.gzhead.name ? 8 : 0) + (u.gzhead.comment ? 16 : 0)), T(u, 255 & u.gzhead.time), T(u, u.gzhead.time >> 8 & 255), T(u, u.gzhead.time >> 16 & 255), T(u, u.gzhead.time >> 24 & 255), T(u, 9 === u.level ? 2 : 2 <= u.strategy || u.level < 2 ? 4 : 0), T(u, 255 & u.gzhead.os), u.gzhead.extra && u.gzhead.extra.length && (T(u, 255 & u.gzhead.extra.length), T(u, u.gzhead.extra.length >> 8 & 255)), u.gzhead.hcrc && (t.adler = _(t.adler, u.pending_buf, u.pending, 0)), u.gzindex = 0, u.status = 69) : (T(u, 0), T(u, 0), T(u, 0), T(u, 0), T(u, 0), T(u, 9 === u.level ? 2 : 2 <= u.strategy || u.level < 2 ? 4 : 0), T(u, 3), u.status = w);
                    else {
                        var b = 8 + (u.w_bits - 8 << 4) << 8;
                        b |= (2 <= u.strategy || u.level < 2 ? 0 : u.level < 6 ? 1 : 6 === u.level ? 2 : 3) << 6, 0 !== u.strstart && (b |= 32), b += 31 - b % 31, u.status = w, F(u, b), 0 !== u.strstart && (F(u, t.adler >>> 16), F(u, 65535 & t.adler)), t.adler = 1
                    }
                if (69 === u.status)
                    if (u.gzhead.extra) {
                        for (g = u.pending; u.gzindex < (65535 & u.gzhead.extra.length) && (u.pending !== u.pending_buf_size || (u.gzhead.hcrc && u.pending > g && (t.adler = _(t.adler, u.pending_buf, u.pending - g, g)), I(t), g = u.pending, u.pending !== u.pending_buf_size));) T(u, 255 & u.gzhead.extra[u.gzindex]), u.gzindex++;
                        u.gzhead.hcrc && u.pending > g && (t.adler = _(t.adler, u.pending_buf, u.pending - g, g)), u.gzindex === u.gzhead.extra.length && (u.gzindex = 0, u.status = 73)
                    } else u.status = 73;
                if (73 === u.status)
                    if (u.gzhead.name) {
                        g = u.pending;
                        do {
                            if (u.pending === u.pending_buf_size && (u.gzhead.hcrc && u.pending > g && (t.adler = _(t.adler, u.pending_buf, u.pending - g, g)), I(t), g = u.pending, u.pending === u.pending_buf_size)) {
                                p = 1;
                                break
                            }
                            T(u, p = u.gzindex < u.gzhead.name.length ? 255 & u.gzhead.name.charCodeAt(u.gzindex++) : 0)
                        } while (0 !== p);
                        u.gzhead.hcrc && u.pending > g && (t.adler = _(t.adler, u.pending_buf, u.pending - g, g)), 0 === p && (u.gzindex = 0, u.status = 91)
                    } else u.status = 91;
                if (91 === u.status)
                    if (u.gzhead.comment) {
                        g = u.pending;
                        do {
                            if (u.pending === u.pending_buf_size && (u.gzhead.hcrc && u.pending > g && (t.adler = _(t.adler, u.pending_buf, u.pending - g, g)), I(t), g = u.pending, u.pending === u.pending_buf_size)) {
                                p = 1;
                                break
                            }
                            T(u, p = u.gzindex < u.gzhead.comment.length ? 255 & u.gzhead.comment.charCodeAt(u.gzindex++) : 0)
                        } while (0 !== p);
                        u.gzhead.hcrc && u.pending > g && (t.adler = _(t.adler, u.pending_buf, u.pending - g, g)), 0 === p && (u.status = 103)
                    } else u.status = 103;
                if (103 === u.status && (u.gzhead.hcrc ? (u.pending + 2 > u.pending_buf_size && I(t), u.pending + 2 <= u.pending_buf_size && (T(u, 255 & t.adler), T(u, t.adler >> 8 & 255), t.adler = 0, u.status = w)) : u.status = w), 0 !== u.pending) {
                    if (I(t), 0 === t.avail_out) return u.last_flush = -1, 0
                } else if (0 === t.avail_in && O(e) <= O(a) && 4 !== e) return N(t, -5);
                if (666 === u.status && 0 !== t.avail_in) return N(t, -5);
                if (0 !== t.avail_in || 0 !== u.lookahead || 0 !== e && 666 !== u.status) {
                    var x = 2 === u.strategy ? function(t, e) {
                        for (var a;;) {
                            if (0 === t.lookahead && (H(t), 0 === t.lookahead)) {
                                if (0 === e) return 1;
                                break
                            }
                            if (t.match_length = 0, a = f._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (U(t, !1), 0 === t.strm.avail_out)) return 1
                        }
                        return t.insert = 0, 4 === e ? (U(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? 1 : 2
                    }(u, e) : 3 === u.strategy ? function(t, e) {
                        for (var a, n, u, g, _ = t.window;;) {
                            if (t.lookahead <= m) {
                                if (H(t), t.lookahead <= m && 0 === e) return 1;
                                if (0 === t.lookahead) break
                            }
                            if (t.match_length = 0, t.lookahead >= 3 && 0 < t.strstart && (n = _[u = t.strstart - 1]) === _[++u] && n === _[++u] && n === _[++u]) {
                                g = t.strstart + m;
                                do {} while (n === _[++u] && n === _[++u] && n === _[++u] && n === _[++u] && n === _[++u] && n === _[++u] && n === _[++u] && n === _[++u] && u < g);
                                t.match_length = m - (g - u), t.match_length > t.lookahead && (t.match_length = t.lookahead)
                            }
                            if (t.match_length >= 3 ? (a = f._tr_tally(t, 1, t.match_length - 3), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = f._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (U(t, !1), 0 === t.strm.avail_out)) return 1
                        }
                        return t.insert = 0, 4 === e ? (U(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (U(t, !1), 0 === t.strm.avail_out) ? 1 : 2
                    }(u, e) : n[u.level].func(u, e);
                    if (3 !== x && 4 !== x || (u.status = 666), 1 === x || 3 === x) return 0 === t.avail_out && (u.last_flush = -1), 0;
                    if (2 === x && (1 === e ? f._tr_align(u) : 5 !== e && (f._tr_stored_block(u, 0, 0, !1), 3 === e && (D(u.head), 0 === u.lookahead && (u.strstart = 0, u.block_start = 0, u.insert = 0))), I(t), 0 === t.avail_out)) return u.last_flush = -1, 0
                }
                return 4 !== e ? 0 : u.wrap <= 0 ? 1 : (2 === u.wrap ? (T(u, 255 & t.adler), T(u, t.adler >> 8 & 255), T(u, t.adler >> 16 & 255), T(u, t.adler >> 24 & 255), T(u, 255 & t.total_in), T(u, t.total_in >> 8 & 255), T(u, t.total_in >> 16 & 255), T(u, t.total_in >> 24 & 255)) : (F(u, t.adler >>> 16), F(u, 65535 & t.adler)), I(t), 0 < u.wrap && (u.wrap = -u.wrap), 0 !== u.pending ? 0 : 1)
            }, a.deflateEnd = function(t) {
                var e;
                return t && t.state ? 42 !== (e = t.state.status) && 69 !== e && 73 !== e && 91 !== e && 103 !== e && e !== w && 666 !== e ? N(t, y) : (t.state = null, e === w ? N(t, -3) : 0) : y
            }, a.deflateSetDictionary = function(t, e) {
                var a, n, f, _, p, m, b, w, x = e.length;
                if (!t || !t.state) return y;
                if (2 === (_ = (a = t.state).wrap) || 1 === _ && 42 !== a.status || a.lookahead) return y;
                for (1 === _ && (t.adler = g(t.adler, e, x, 0)), a.wrap = 0, x >= a.w_size && (0 === _ && (D(a.head), a.strstart = 0, a.block_start = 0, a.insert = 0), w = new u.Buf8(a.w_size), u.arraySet(w, e, x - a.w_size, a.w_size, 0), e = w, x = a.w_size), p = t.avail_in, m = t.next_in, b = t.input, t.avail_in = x, t.next_in = 0, t.input = e, H(a); a.lookahead >= 3;) {
                    for (n = a.strstart, f = a.lookahead - 2; a.ins_h = (a.ins_h << a.hash_shift ^ a.window[n + 3 - 1]) & a.hash_mask, a.prev[n & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = n, n++, --f;);
                    a.strstart = n, a.lookahead = 2, H(a)
                }
                return a.strstart += a.lookahead, a.block_start = a.strstart, a.insert = a.lookahead, a.lookahead = 0, a.match_length = a.prev_length = 2, a.match_available = 0, t.next_in = m, t.input = b, t.avail_in = p, a.wrap = _, 0
            }, a.deflateInfo = "pako deflate (from Nodeca project)"
        }, {
            "../utils/common": 3,
            "./adler32": 5,
            "./crc32": 7,
            "./messages": 13,
            "./trees": 14
        }],
        9: [function(t, e, a) {
            "use strict";
            e.exports = function() {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
            }
        }, {}],
        10: [function(t, e, a) {
            "use strict";
            e.exports = function(t, e) {
                var a, n, u, f, g, _, p, y, m, b, w, x, v, S, E, C, A, k, B, R, z, V, Z, $, J;
                a = t.state, n = t.next_in, $ = t.input, u = n + (t.avail_in - 5), f = t.next_out, J = t.output, g = f - (e - t.avail_out), _ = f + (t.avail_out - 257), p = a.dmax, y = a.wsize, m = a.whave, b = a.wnext, w = a.window, x = a.hold, v = a.bits, S = a.lencode, E = a.distcode, C = (1 << a.lenbits) - 1, A = (1 << a.distbits) - 1;
                t: do {
                    v < 15 && (x += $[n++] << v, v += 8, x += $[n++] << v, v += 8), k = S[x & C];
                    e: for (;;) {
                        if (x >>>= B = k >>> 24, v -= B, 0 == (B = k >>> 16 & 255)) J[f++] = 65535 & k;
                        else {
                            if (!(16 & B)) {
                                if (0 == (64 & B)) {
                                    k = S[(65535 & k) + (x & (1 << B) - 1)];
                                    continue e
                                }
                                if (32 & B) {
                                    a.mode = 12;
                                    break t
                                }
                                t.msg = "invalid literal/length code", a.mode = 30;
                                break t
                            }
                            R = 65535 & k, (B &= 15) && (v < B && (x += $[n++] << v, v += 8), R += x & (1 << B) - 1, x >>>= B, v -= B), v < 15 && (x += $[n++] << v, v += 8, x += $[n++] << v, v += 8), k = E[x & A];
                            i: for (;;) {
                                if (x >>>= B = k >>> 24, v -= B, !(16 & (B = k >>> 16 & 255))) {
                                    if (0 == (64 & B)) {
                                        k = E[(65535 & k) + (x & (1 << B) - 1)];
                                        continue i
                                    }
                                    t.msg = "invalid distance code", a.mode = 30;
                                    break t
                                }
                                if (z = 65535 & k, v < (B &= 15) && (x += $[n++] << v, (v += 8) < B && (x += $[n++] << v, v += 8)), p < (z += x & (1 << B) - 1)) {
                                    t.msg = "invalid distance too far back", a.mode = 30;
                                    break t
                                }
                                if (x >>>= B, v -= B, (B = f - g) < z) {
                                    if (m < (B = z - B) && a.sane) {
                                        t.msg = "invalid distance too far back", a.mode = 30;
                                        break t
                                    }
                                    if (Z = w, (V = 0) === b) {
                                        if (V += y - B, B < R) {
                                            for (R -= B; J[f++] = w[V++], --B;);
                                            V = f - z, Z = J
                                        }
                                    } else if (b < B) {
                                        if (V += y + b - B, (B -= b) < R) {
                                            for (R -= B; J[f++] = w[V++], --B;);
                                            if (V = 0, b < R) {
                                                for (R -= B = b; J[f++] = w[V++], --B;);
                                                V = f - z, Z = J
                                            }
                                        }
                                    } else if (V += b - B, B < R) {
                                        for (R -= B; J[f++] = w[V++], --B;);
                                        V = f - z, Z = J
                                    }
                                    for (; 2 < R;) J[f++] = Z[V++], J[f++] = Z[V++], J[f++] = Z[V++], R -= 3;
                                    R && (J[f++] = Z[V++], 1 < R && (J[f++] = Z[V++]))
                                } else {
                                    for (V = f - z; J[f++] = J[V++], J[f++] = J[V++], J[f++] = J[V++], 2 < (R -= 3););
                                    R && (J[f++] = J[V++], 1 < R && (J[f++] = J[V++]))
                                }
                                break
                            }
                        }
                        break
                    }
                } while (n < u && f < _);
                n -= R = v >> 3, x &= (1 << (v -= R << 3)) - 1, t.next_in = n, t.next_out = f, t.avail_in = n < u ? u - n + 5 : 5 - (n - u), t.avail_out = f < _ ? _ - f + 257 : 257 - (f - _), a.hold = x, a.bits = v
            }
        }, {}],
        11: [function(t, e, a) {
            "use strict";
            var n = t("../utils/common"),
                u = t("./adler32"),
                f = t("./crc32"),
                g = t("./inffast"),
                _ = t("./inftrees"),
                p = -2;

            function L(t) {
                return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24)
            }

            function r() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
            }

            function s(t) {
                var e;
                return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = 1, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new n.Buf32(852), e.distcode = e.distdyn = new n.Buf32(592), e.sane = 1, e.back = -1, 0) : p
            }

            function o(t) {
                var e;
                return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, s(t)) : p
            }

            function l(t, e) {
                var a, n;
                return t && t.state ? (n = t.state, e < 0 ? (a = 0, e = -e) : (a = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || 15 < e) ? p : (null !== n.window && n.wbits !== e && (n.window = null), n.wrap = a, n.wbits = e, o(t))) : p
            }

            function h(t, e) {
                var a, n;
                return t ? (n = new r, (t.state = n).window = null, 0 !== (a = l(t, e)) && (t.state = null), a) : p
            }
            var y, m, b = !0;

            function H(t) {
                if (b) {
                    var e;
                    for (y = new n.Buf32(512), m = new n.Buf32(32), e = 0; e < 144;) t.lens[e++] = 8;
                    for (; e < 256;) t.lens[e++] = 9;
                    for (; e < 280;) t.lens[e++] = 7;
                    for (; e < 288;) t.lens[e++] = 8;
                    for (_(1, t.lens, 0, 288, y, 0, t.work, {
                            bits: 9
                        }), e = 0; e < 32;) t.lens[e++] = 5;
                    _(2, t.lens, 0, 32, m, 0, t.work, {
                        bits: 5
                    }), b = !1
                }
                t.lencode = y, t.lenbits = 9, t.distcode = m, t.distbits = 5
            }

            function j(t, e, a, u) {
                var f, g = t.state;
                return null === g.window && (g.wsize = 1 << g.wbits, g.wnext = 0, g.whave = 0, g.window = new n.Buf8(g.wsize)), u >= g.wsize ? (n.arraySet(g.window, e, a - g.wsize, g.wsize, 0), g.wnext = 0, g.whave = g.wsize) : (u < (f = g.wsize - g.wnext) && (f = u), n.arraySet(g.window, e, a - u, f, g.wnext), (u -= f) ? (n.arraySet(g.window, e, a - u, u, 0), g.wnext = u, g.whave = g.wsize) : (g.wnext += f, g.wnext === g.wsize && (g.wnext = 0), g.whave < g.wsize && (g.whave += f))), 0
            }
            a.inflateReset = o, a.inflateReset2 = l, a.inflateResetKeep = s, a.inflateInit = function(t) {
                return h(t, 15)
            }, a.inflateInit2 = h, a.inflate = function(t, e) {
                var a, y, m, b, w, x, v, S, E, C, A, k, B, R, z, V, Z, $, J, tt, et, it, st, at, nt = 0,
                    rt = new n.Buf8(4),
                    ot = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return p;
                12 === (a = t.state).mode && (a.mode = 13), w = t.next_out, m = t.output, v = t.avail_out, b = t.next_in, y = t.input, x = t.avail_in, S = a.hold, E = a.bits, C = x, A = v, it = 0;
                t: for (;;) switch (a.mode) {
                    case 1:
                        if (0 === a.wrap) {
                            a.mode = 13;
                            break
                        }
                        for (; E < 16;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        if (2 & a.wrap && 35615 === S) {
                            rt[a.check = 0] = 255 & S, rt[1] = S >>> 8 & 255, a.check = f(a.check, rt, 2, 0), E = S = 0, a.mode = 2;
                            break
                        }
                        if (a.flags = 0, a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & S) << 8) + (S >> 8)) % 31) {
                            t.msg = "incorrect header check", a.mode = 30;
                            break
                        }
                        if (8 != (15 & S)) {
                            t.msg = "unknown compression method", a.mode = 30;
                            break
                        }
                        if (E -= 4, et = 8 + (15 & (S >>>= 4)), 0 === a.wbits) a.wbits = et;
                        else if (et > a.wbits) {
                            t.msg = "invalid window size", a.mode = 30;
                            break
                        }
                        a.dmax = 1 << et, t.adler = a.check = 1, a.mode = 512 & S ? 10 : 12, E = S = 0;
                        break;
                    case 2:
                        for (; E < 16;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        if (a.flags = S, 8 != (255 & a.flags)) {
                            t.msg = "unknown compression method", a.mode = 30;
                            break
                        }
                        if (57344 & a.flags) {
                            t.msg = "unknown header flags set", a.mode = 30;
                            break
                        }
                        a.head && (a.head.text = S >> 8 & 1), 512 & a.flags && (rt[0] = 255 & S, rt[1] = S >>> 8 & 255, a.check = f(a.check, rt, 2, 0)), E = S = 0, a.mode = 3;
                    case 3:
                        for (; E < 32;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        a.head && (a.head.time = S), 512 & a.flags && (rt[0] = 255 & S, rt[1] = S >>> 8 & 255, rt[2] = S >>> 16 & 255, rt[3] = S >>> 24 & 255, a.check = f(a.check, rt, 4, 0)), E = S = 0, a.mode = 4;
                    case 4:
                        for (; E < 16;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        a.head && (a.head.xflags = 255 & S, a.head.os = S >> 8), 512 & a.flags && (rt[0] = 255 & S, rt[1] = S >>> 8 & 255, a.check = f(a.check, rt, 2, 0)), E = S = 0, a.mode = 5;
                    case 5:
                        if (1024 & a.flags) {
                            for (; E < 16;) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            a.length = S, a.head && (a.head.extra_len = S), 512 & a.flags && (rt[0] = 255 & S, rt[1] = S >>> 8 & 255, a.check = f(a.check, rt, 2, 0)), E = S = 0
                        } else a.head && (a.head.extra = null);
                        a.mode = 6;
                    case 6:
                        if (1024 & a.flags && (x < (k = a.length) && (k = x), k && (a.head && (et = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Array(a.head.extra_len)), n.arraySet(a.head.extra, y, b, k, et)), 512 & a.flags && (a.check = f(a.check, y, k, b)), x -= k, b += k, a.length -= k), a.length)) break t;
                        a.length = 0, a.mode = 7;
                    case 7:
                        if (2048 & a.flags) {
                            if (0 === x) break t;
                            for (k = 0; et = y[b + k++], a.head && et && a.length < 65536 && (a.head.name += String.fromCharCode(et)), et && k < x;);
                            if (512 & a.flags && (a.check = f(a.check, y, k, b)), x -= k, b += k, et) break t
                        } else a.head && (a.head.name = null);
                        a.length = 0, a.mode = 8;
                    case 8:
                        if (4096 & a.flags) {
                            if (0 === x) break t;
                            for (k = 0; et = y[b + k++], a.head && et && a.length < 65536 && (a.head.comment += String.fromCharCode(et)), et && k < x;);
                            if (512 & a.flags && (a.check = f(a.check, y, k, b)), x -= k, b += k, et) break t
                        } else a.head && (a.head.comment = null);
                        a.mode = 9;
                    case 9:
                        if (512 & a.flags) {
                            for (; E < 16;) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            if (S !== (65535 & a.check)) {
                                t.msg = "header crc mismatch", a.mode = 30;
                                break
                            }
                            E = S = 0
                        }
                        a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0), t.adler = a.check = 0, a.mode = 12;
                        break;
                    case 10:
                        for (; E < 32;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        t.adler = a.check = L(S), E = S = 0, a.mode = 11;
                    case 11:
                        if (0 === a.havedict) return t.next_out = w, t.avail_out = v, t.next_in = b, t.avail_in = x, a.hold = S, a.bits = E, 2;
                        t.adler = a.check = 1, a.mode = 12;
                    case 12:
                        if (5 === e || 6 === e) break t;
                    case 13:
                        if (a.last) {
                            S >>>= 7 & E, E -= 7 & E, a.mode = 27;
                            break
                        }
                        for (; E < 3;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        switch (a.last = 1 & S, E -= 1, 3 & (S >>>= 1)) {
                            case 0:
                                a.mode = 14;
                                break;
                            case 1:
                                if (H(a), a.mode = 20, 6 !== e) break;
                                S >>>= 2, E -= 2;
                                break t;
                            case 2:
                                a.mode = 17;
                                break;
                            case 3:
                                t.msg = "invalid block type", a.mode = 30
                        }
                        S >>>= 2, E -= 2;
                        break;
                    case 14:
                        for (S >>>= 7 & E, E -= 7 & E; E < 32;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        if ((65535 & S) != (S >>> 16 ^ 65535)) {
                            t.msg = "invalid stored block lengths", a.mode = 30;
                            break
                        }
                        if (a.length = 65535 & S, E = S = 0, a.mode = 15, 6 === e) break t;
                    case 15:
                        a.mode = 16;
                    case 16:
                        if (k = a.length) {
                            if (x < k && (k = x), v < k && (k = v), 0 === k) break t;
                            n.arraySet(m, y, b, k, w), x -= k, b += k, v -= k, w += k, a.length -= k;
                            break
                        }
                        a.mode = 12;
                        break;
                    case 17:
                        for (; E < 14;) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        if (a.nlen = 257 + (31 & S), S >>>= 5, E -= 5, a.ndist = 1 + (31 & S), S >>>= 5, E -= 5, a.ncode = 4 + (15 & S), S >>>= 4, E -= 4, 286 < a.nlen || 30 < a.ndist) {
                            t.msg = "too many length or distance symbols", a.mode = 30;
                            break
                        }
                        a.have = 0, a.mode = 18;
                    case 18:
                        for (; a.have < a.ncode;) {
                            for (; E < 3;) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            a.lens[ot[a.have++]] = 7 & S, S >>>= 3, E -= 3
                        }
                        for (; a.have < 19;) a.lens[ot[a.have++]] = 0;
                        if (a.lencode = a.lendyn, a.lenbits = 7, st = {
                                bits: a.lenbits
                            }, it = _(0, a.lens, 0, 19, a.lencode, 0, a.work, st), a.lenbits = st.bits, it) {
                            t.msg = "invalid code lengths set", a.mode = 30;
                            break
                        }
                        a.have = 0, a.mode = 19;
                    case 19:
                        for (; a.have < a.nlen + a.ndist;) {
                            for (; V = (nt = a.lencode[S & (1 << a.lenbits) - 1]) >>> 16 & 255, Z = 65535 & nt, !((z = nt >>> 24) <= E);) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            if (Z < 16) S >>>= z, E -= z, a.lens[a.have++] = Z;
                            else {
                                if (16 === Z) {
                                    for (at = z + 2; E < at;) {
                                        if (0 === x) break t;
                                        x--, S += y[b++] << E, E += 8
                                    }
                                    if (S >>>= z, E -= z, 0 === a.have) {
                                        t.msg = "invalid bit length repeat", a.mode = 30;
                                        break
                                    }
                                    et = a.lens[a.have - 1], k = 3 + (3 & S), S >>>= 2, E -= 2
                                } else if (17 === Z) {
                                    for (at = z + 3; E < at;) {
                                        if (0 === x) break t;
                                        x--, S += y[b++] << E, E += 8
                                    }
                                    E -= z, et = 0, k = 3 + (7 & (S >>>= z)), S >>>= 3, E -= 3
                                } else {
                                    for (at = z + 7; E < at;) {
                                        if (0 === x) break t;
                                        x--, S += y[b++] << E, E += 8
                                    }
                                    E -= z, et = 0, k = 11 + (127 & (S >>>= z)), S >>>= 7, E -= 7
                                }
                                if (a.have + k > a.nlen + a.ndist) {
                                    t.msg = "invalid bit length repeat", a.mode = 30;
                                    break
                                }
                                for (; k--;) a.lens[a.have++] = et
                            }
                        }
                        if (30 === a.mode) break;
                        if (0 === a.lens[256]) {
                            t.msg = "invalid code -- missing end-of-block", a.mode = 30;
                            break
                        }
                        if (a.lenbits = 9, st = {
                                bits: a.lenbits
                            }, it = _(1, a.lens, 0, a.nlen, a.lencode, 0, a.work, st), a.lenbits = st.bits, it) {
                            t.msg = "invalid literal/lengths set", a.mode = 30;
                            break
                        }
                        if (a.distbits = 6, a.distcode = a.distdyn, st = {
                                bits: a.distbits
                            }, it = _(2, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, st), a.distbits = st.bits, it) {
                            t.msg = "invalid distances set", a.mode = 30;
                            break
                        }
                        if (a.mode = 20, 6 === e) break t;
                    case 20:
                        a.mode = 21;
                    case 21:
                        if (6 <= x && 258 <= v) {
                            t.next_out = w, t.avail_out = v, t.next_in = b, t.avail_in = x, a.hold = S, a.bits = E, g(t, A), w = t.next_out, m = t.output, v = t.avail_out, b = t.next_in, y = t.input, x = t.avail_in, S = a.hold, E = a.bits, 12 === a.mode && (a.back = -1);
                            break
                        }
                        for (a.back = 0; V = (nt = a.lencode[S & (1 << a.lenbits) - 1]) >>> 16 & 255, Z = 65535 & nt, !((z = nt >>> 24) <= E);) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        if (V && 0 == (240 & V)) {
                            for ($ = z, J = V, tt = Z; V = (nt = a.lencode[tt + ((S & (1 << $ + J) - 1) >> $)]) >>> 16 & 255, Z = 65535 & nt, !($ + (z = nt >>> 24) <= E);) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            S >>>= $, E -= $, a.back += $
                        }
                        if (S >>>= z, E -= z, a.back += z, a.length = Z, 0 === V) {
                            a.mode = 26;
                            break
                        }
                        if (32 & V) {
                            a.back = -1, a.mode = 12;
                            break
                        }
                        if (64 & V) {
                            t.msg = "invalid literal/length code", a.mode = 30;
                            break
                        }
                        a.extra = 15 & V, a.mode = 22;
                    case 22:
                        if (a.extra) {
                            for (at = a.extra; E < at;) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            a.length += S & (1 << a.extra) - 1, S >>>= a.extra, E -= a.extra, a.back += a.extra
                        }
                        a.was = a.length, a.mode = 23;
                    case 23:
                        for (; V = (nt = a.distcode[S & (1 << a.distbits) - 1]) >>> 16 & 255, Z = 65535 & nt, !((z = nt >>> 24) <= E);) {
                            if (0 === x) break t;
                            x--, S += y[b++] << E, E += 8
                        }
                        if (0 == (240 & V)) {
                            for ($ = z, J = V, tt = Z; V = (nt = a.distcode[tt + ((S & (1 << $ + J) - 1) >> $)]) >>> 16 & 255, Z = 65535 & nt, !($ + (z = nt >>> 24) <= E);) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            S >>>= $, E -= $, a.back += $
                        }
                        if (S >>>= z, E -= z, a.back += z, 64 & V) {
                            t.msg = "invalid distance code", a.mode = 30;
                            break
                        }
                        a.offset = Z, a.extra = 15 & V, a.mode = 24;
                    case 24:
                        if (a.extra) {
                            for (at = a.extra; E < at;) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            a.offset += S & (1 << a.extra) - 1, S >>>= a.extra, E -= a.extra, a.back += a.extra
                        }
                        if (a.offset > a.dmax) {
                            t.msg = "invalid distance too far back", a.mode = 30;
                            break
                        }
                        a.mode = 25;
                    case 25:
                        if (0 === v) break t;
                        if (k = A - v, a.offset > k) {
                            if ((k = a.offset - k) > a.whave && a.sane) {
                                t.msg = "invalid distance too far back", a.mode = 30;
                                break
                            }
                            B = k > a.wnext ? (k -= a.wnext, a.wsize - k) : a.wnext - k, k > a.length && (k = a.length), R = a.window
                        } else R = m, B = w - a.offset, k = a.length;
                        for (v < k && (k = v), v -= k, a.length -= k; m[w++] = R[B++], --k;);
                        0 === a.length && (a.mode = 21);
                        break;
                    case 26:
                        if (0 === v) break t;
                        m[w++] = a.length, v--, a.mode = 21;
                        break;
                    case 27:
                        if (a.wrap) {
                            for (; E < 32;) {
                                if (0 === x) break t;
                                x--, S |= y[b++] << E, E += 8
                            }
                            if (A -= v, t.total_out += A, a.total += A, A && (t.adler = a.check = a.flags ? f(a.check, m, A, w - A) : u(a.check, m, A, w - A)), A = v, (a.flags ? S : L(S)) !== a.check) {
                                t.msg = "incorrect data check", a.mode = 30;
                                break
                            }
                            E = S = 0
                        }
                        a.mode = 28;
                    case 28:
                        if (a.wrap && a.flags) {
                            for (; E < 32;) {
                                if (0 === x) break t;
                                x--, S += y[b++] << E, E += 8
                            }
                            if (S !== (4294967295 & a.total)) {
                                t.msg = "incorrect length check", a.mode = 30;
                                break
                            }
                            E = S = 0
                        }
                        a.mode = 29;
                    case 29:
                        it = 1;
                        break t;
                    case 30:
                        it = -3;
                        break t;
                    case 31:
                        return -4;
                    default:
                        return p
                }
                return t.next_out = w, t.avail_out = v, t.next_in = b, t.avail_in = x, a.hold = S, a.bits = E, (a.wsize || A !== t.avail_out && a.mode < 30 && (a.mode < 27 || 4 !== e)) && j(t, t.output, t.next_out, A - t.avail_out) ? (a.mode = 31, -4) : (C -= t.avail_in, A -= t.avail_out, t.total_in += C, t.total_out += A, a.total += A, a.wrap && A && (t.adler = a.check = a.flags ? f(a.check, m, A, t.next_out - A) : u(a.check, m, A, t.next_out - A)), t.data_type = a.bits + (a.last ? 64 : 0) + (12 === a.mode ? 128 : 0) + (20 === a.mode || 15 === a.mode ? 256 : 0), (0 === C && 0 === A || 4 === e) && 0 === it && (it = -5), it)
            }, a.inflateEnd = function(t) {
                if (!t || !t.state) return p;
                var e = t.state;
                return e.window && (e.window = null), t.state = null, 0
            }, a.inflateGetHeader = function(t, e) {
                var a;
                return t && t.state ? 0 == (2 & (a = t.state).wrap) ? p : ((a.head = e).done = !1, 0) : p
            }, a.inflateSetDictionary = function(t, e) {
                var a, n = e.length;
                return t && t.state ? 0 !== (a = t.state).wrap && 11 !== a.mode ? p : 11 === a.mode && u(1, e, n, 0) !== a.check ? -3 : j(t, e, n, n) ? (a.mode = 31, -4) : (a.havedict = 1, 0) : p
            }, a.inflateInfo = "pako inflate (from Nodeca project)"
        }, {
            "../utils/common": 3,
            "./adler32": 5,
            "./crc32": 7,
            "./inffast": 10,
            "./inftrees": 12
        }],
        12: [function(t, e, a) {
            "use strict";
            var n = t("../utils/common"),
                u = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                f = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                g = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                _ = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            e.exports = function(t, e, a, p, y, m, b, w) {
                var x, v, S, E, C, A, k, B, R, z = w.bits,
                    V = 0,
                    Z = 0,
                    $ = 0,
                    J = 0,
                    tt = 0,
                    et = 0,
                    it = 0,
                    st = 0,
                    at = 0,
                    nt = 0,
                    rt = null,
                    ot = 0,
                    lt = new n.Buf16(16),
                    ht = new n.Buf16(16),
                    ct = null,
                    ut = 0;
                for (V = 0; V <= 15; V++) lt[V] = 0;
                for (Z = 0; Z < p; Z++) lt[e[a + Z]] ++;
                for (tt = z, J = 15; 1 <= J && 0 === lt[J]; J--);
                if (J < tt && (tt = J), 0 === J) return y[m++] = 20971520, y[m++] = 20971520, w.bits = 1, 0;
                for ($ = 1; $ < J && 0 === lt[$]; $++);
                for (tt < $ && (tt = $), V = st = 1; V <= 15; V++)
                    if (st <<= 1, (st -= lt[V]) < 0) return -1;
                if (0 < st && (0 === t || 1 !== J)) return -1;
                for (ht[1] = 0, V = 1; V < 15; V++) ht[V + 1] = ht[V] + lt[V];
                for (Z = 0; Z < p; Z++) 0 !== e[a + Z] && (b[ht[e[a + Z]] ++] = Z);
                if (A = 0 === t ? (rt = ct = b, 19) : 1 === t ? (rt = u, ot -= 257, ct = f, ut -= 257, 256) : (rt = g, ct = _, -1), V = $, C = m, it = Z = nt = 0, S = -1, E = (at = 1 << (et = tt)) - 1, 1 === t && 852 < at || 2 === t && 592 < at) return 1;
                for (;;) {
                    for (k = V - it, R = b[Z] < A ? (B = 0, b[Z]) : b[Z] > A ? (B = ct[ut + b[Z]], rt[ot + b[Z]]) : (B = 96, 0), x = 1 << V - it, $ = v = 1 << et; y[C + (nt >> it) + (v -= x)] = k << 24 | B << 16 | R | 0, 0 !== v;);
                    for (x = 1 << V - 1; nt & x;) x >>= 1;
                    if (0 !== x ? (nt &= x - 1, nt += x) : nt = 0, Z++, 0 == --lt[V]) {
                        if (V === J) break;
                        V = e[a + b[Z]]
                    }
                    if (tt < V && (nt & E) !== S) {
                        for (0 === it && (it = tt), C += $, st = 1 << (et = V - it); et + it < J && !((st -= lt[et + it]) <= 0);) et++, st <<= 1;
                        if (at += 1 << et, 1 === t && 852 < at || 2 === t && 592 < at) return 1;
                        y[S = nt & E] = tt << 24 | et << 16 | C - m | 0
                    }
                }
                return 0 !== nt && (y[C + nt] = V - it << 24 | 64 << 16 | 0), w.bits = tt, 0
            }
        }, {
            "../utils/common": 3
        }],
        13: [function(t, e, a) {
            "use strict";
            e.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }, {}],
        14: [function(t, e, a) {
            "use strict";
            var n = t("../utils/common");

            function i(t) {
                for (var e = t.length; 0 <= --e;) t[e] = 0
            }
            var u = 256,
                f = 286,
                g = 30,
                _ = 15,
                p = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                y = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                b = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                w = new Array(576);
            i(w);
            var x = new Array(60);
            i(x);
            var v = new Array(512);
            i(v);
            var S = new Array(256);
            i(S);
            var E = new Array(29);
            i(E);
            var C, A, k, B = new Array(g);

            function I(t, e, a, n, u) {
                this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = n, this.max_length = u, this.has_stree = t && t.length
            }

            function r(t, e) {
                this.dyn_tree = t, this.max_code = 0, this.stat_desc = e
            }

            function U(t) {
                return t < 256 ? v[t] : v[256 + (t >>> 7)]
            }

            function T(t, e) {
                t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255
            }

            function F(t, e, a) {
                t.bi_valid > 16 - a ? (t.bi_buf |= e << t.bi_valid & 65535, T(t, t.bi_buf), t.bi_buf = e >> 16 - t.bi_valid, t.bi_valid += a - 16) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a)
            }

            function L(t, e, a) {
                F(t, a[2 * e], a[2 * e + 1])
            }

            function H(t, e) {
                for (var a = 0; a |= 1 & t, t >>>= 1, a <<= 1, 0 < --e;);
                return a >>> 1
            }

            function j(t, e, a) {
                var n, u, f = new Array(16),
                    g = 0;
                for (n = 1; n <= _; n++) f[n] = g = g + a[n - 1] << 1;
                for (u = 0; u <= e; u++) {
                    var p = t[2 * u + 1];
                    0 !== p && (t[2 * u] = H(f[p] ++, p))
                }
            }

            function K(t) {
                var e;
                for (e = 0; e < f; e++) t.dyn_ltree[2 * e] = 0;
                for (e = 0; e < g; e++) t.dyn_dtree[2 * e] = 0;
                for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
                t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0
            }

            function M(t) {
                8 < t.bi_valid ? T(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0
            }

            function P(t, e, a, n) {
                var u = 2 * e,
                    f = 2 * a;
                return t[u] < t[f] || t[u] === t[f] && n[e] <= n[a]
            }

            function Y(t, e, a) {
                for (var n = t.heap[a], u = a << 1; u <= t.heap_len && (u < t.heap_len && P(e, t.heap[u + 1], t.heap[u], t.depth) && u++, !P(e, n, t.heap[u], t.depth));) t.heap[a] = t.heap[u], a = u, u <<= 1;
                t.heap[a] = n
            }

            function q(t, e, a) {
                var n, f, g, _, m = 0;
                if (0 !== t.last_lit)
                    for (; n = t.pending_buf[t.d_buf + 2 * m] << 8 | t.pending_buf[t.d_buf + 2 * m + 1], f = t.pending_buf[t.l_buf + m], m++, 0 === n ? L(t, f, e) : (L(t, (g = S[f]) + u + 1, e), 0 !== (_ = p[g]) && F(t, f -= E[g], _), L(t, g = U(--n), a), 0 !== (_ = y[g]) && F(t, n -= B[g], _)), m < t.last_lit;);
                L(t, 256, e)
            }

            function G(t, e) {
                var a, n, u, f = e.dyn_tree,
                    g = e.stat_desc.static_tree,
                    p = e.stat_desc.has_stree,
                    y = e.stat_desc.elems,
                    m = -1;
                for (t.heap_len = 0, t.heap_max = 573, a = 0; a < y; a++) 0 !== f[2 * a] ? (t.heap[++t.heap_len] = m = a, t.depth[a] = 0) : f[2 * a + 1] = 0;
                for (; t.heap_len < 2;) f[2 * (u = t.heap[++t.heap_len] = m < 2 ? ++m : 0)] = 1, t.depth[u] = 0, t.opt_len--, p && (t.static_len -= g[2 * u + 1]);
                for (e.max_code = m, a = t.heap_len >> 1; 1 <= a; a--) Y(t, f, a);
                for (u = y; a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], Y(t, f, 1), n = t.heap[1], t.heap[--t.heap_max] = a, t.heap[--t.heap_max] = n, f[2 * u] = f[2 * a] + f[2 * n], t.depth[u] = (t.depth[a] >= t.depth[n] ? t.depth[a] : t.depth[n]) + 1, f[2 * a + 1] = f[2 * n + 1] = u, t.heap[1] = u++, Y(t, f, 1), 2 <= t.heap_len;);
                t.heap[--t.heap_max] = t.heap[1],
                    function(t, e) {
                        var a, n, u, f, g, p, y = e.dyn_tree,
                            m = e.max_code,
                            b = e.stat_desc.static_tree,
                            w = e.stat_desc.has_stree,
                            x = e.stat_desc.extra_bits,
                            v = e.stat_desc.extra_base,
                            S = e.stat_desc.max_length,
                            E = 0;
                        for (f = 0; f <= _; f++) t.bl_count[f] = 0;
                        for (y[2 * t.heap[t.heap_max] + 1] = 0, a = t.heap_max + 1; a < 573; a++) S < (f = y[2 * y[2 * (n = t.heap[a]) + 1] + 1] + 1) && (f = S, E++), y[2 * n + 1] = f, m < n || (t.bl_count[f] ++, g = 0, v <= n && (g = x[n - v]), p = y[2 * n], t.opt_len += p * (f + g), w && (t.static_len += p * (b[2 * n + 1] + g)));
                        if (0 !== E) {
                            do {
                                for (f = S - 1; 0 === t.bl_count[f];) f--;
                                t.bl_count[f] --, t.bl_count[f + 1] += 2, t.bl_count[S] --, E -= 2
                            } while (0 < E);
                            for (f = S; 0 !== f; f--)
                                for (n = t.bl_count[f]; 0 !== n;) m < (u = t.heap[--a]) || (y[2 * u + 1] !== f && (t.opt_len += (f - y[2 * u + 1]) * y[2 * u], y[2 * u + 1] = f), n--)
                        }
                    }(t, e), j(f, m, t.bl_count)
            }

            function X(t, e, a) {
                var n, u, f = -1,
                    g = e[1],
                    _ = 0,
                    p = 7,
                    y = 4;
                for (0 === g && (p = 138, y = 3), e[2 * (a + 1) + 1] = 65535, n = 0; n <= a; n++) u = g, g = e[2 * (n + 1) + 1], ++_ < p && u === g || (_ < y ? t.bl_tree[2 * u] += _ : 0 !== u ? (u !== f && t.bl_tree[2 * u] ++, t.bl_tree[32] ++) : _ <= 10 ? t.bl_tree[34] ++ : t.bl_tree[36] ++, f = u, y = (_ = 0) === g ? (p = 138, 3) : u === g ? (p = 6, 3) : (p = 7, 4))
            }

            function W(t, e, a) {
                var n, u, f = -1,
                    g = e[1],
                    _ = 0,
                    p = 7,
                    y = 4;
                for (0 === g && (p = 138, y = 3), n = 0; n <= a; n++)
                    if (u = g, g = e[2 * (n + 1) + 1], !(++_ < p && u === g)) {
                        if (_ < y)
                            for (; L(t, u, t.bl_tree), 0 != --_;);
                        else 0 !== u ? (u !== f && (L(t, u, t.bl_tree), _--), L(t, 16, t.bl_tree), F(t, _ - 3, 2)) : _ <= 10 ? (L(t, 17, t.bl_tree), F(t, _ - 3, 3)) : (L(t, 18, t.bl_tree), F(t, _ - 11, 7));
                        f = u, y = (_ = 0) === g ? (p = 138, 3) : u === g ? (p = 6, 3) : (p = 7, 4)
                    }
            }
            i(B);
            var R = !1;

            function Q(t, e, a, u) {
                var f, g, _;
                F(t, 0 + (u ? 1 : 0), 3), g = e, _ = a, M(f = t), T(f, _), T(f, ~_), n.arraySet(f.pending_buf, f.window, g, _, f.pending), f.pending += _
            }
            a._tr_init = function(t) {
                R || (function() {
                    var t, e, a, n, u, b = new Array(16);
                    for (n = a = 0; n < 28; n++)
                        for (E[n] = a, t = 0; t < 1 << p[n]; t++) S[a++] = n;
                    for (S[a - 1] = n, n = u = 0; n < 16; n++)
                        for (B[n] = u, t = 0; t < 1 << y[n]; t++) v[u++] = n;
                    for (u >>= 7; n < g; n++)
                        for (B[n] = u << 7, t = 0; t < 1 << y[n] - 7; t++) v[256 + u++] = n;
                    for (e = 0; e <= _; e++) b[e] = 0;
                    for (t = 0; t <= 143;) w[2 * t + 1] = 8, t++, b[8] ++;
                    for (; t <= 255;) w[2 * t + 1] = 9, t++, b[9] ++;
                    for (; t <= 279;) w[2 * t + 1] = 7, t++, b[7] ++;
                    for (; t <= 287;) w[2 * t + 1] = 8, t++, b[8] ++;
                    for (j(w, 287, b), t = 0; t < g; t++) x[2 * t + 1] = 5, x[2 * t] = H(t, 5);
                    C = new I(w, p, 257, f, _), A = new I(x, y, 0, g, _), k = new I(new Array(0), m, 0, 19, 7)
                }(), R = !0), t.l_desc = new r(t.dyn_ltree, C), t.d_desc = new r(t.dyn_dtree, A), t.bl_desc = new r(t.bl_tree, k), t.bi_buf = 0, t.bi_valid = 0, K(t)
            }, a._tr_stored_block = Q, a._tr_flush_block = function(t, e, a, n) {
                var f, g, _ = 0;
                0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function(t) {
                    var e, a = 4093624447;
                    for (e = 0; e <= 31; e++, a >>>= 1)
                        if (1 & a && 0 !== t.dyn_ltree[2 * e]) return 0;
                    if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;
                    for (e = 32; e < u; e++)
                        if (0 !== t.dyn_ltree[2 * e]) return 1;
                    return 0
                }(t)), G(t, t.l_desc), G(t, t.d_desc), _ = function(t) {
                    var e;
                    for (X(t, t.dyn_ltree, t.l_desc.max_code), X(t, t.dyn_dtree, t.d_desc.max_code), G(t, t.bl_desc), e = 18; 3 <= e && 0 === t.bl_tree[2 * b[e] + 1]; e--);
                    return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e
                }(t), f = t.opt_len + 3 + 7 >>> 3, (g = t.static_len + 3 + 7 >>> 3) <= f && (f = g)) : f = g = a + 5, a + 4 <= f && -1 !== e ? Q(t, e, a, n) : 4 === t.strategy || g === f ? (F(t, 2 + (n ? 1 : 0), 3), q(t, w, x)) : (F(t, 4 + (n ? 1 : 0), 3), function(t, e, a, n) {
                    var u;
                    for (F(t, e - 257, 5), F(t, a - 1, 5), F(t, n - 4, 4), u = 0; u < n; u++) F(t, t.bl_tree[2 * b[u] + 1], 3);
                    W(t, t.dyn_ltree, e - 1), W(t, t.dyn_dtree, a - 1)
                }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, _ + 1), q(t, t.dyn_ltree, t.dyn_dtree)), K(t), n && M(t)
            }, a._tr_tally = function(t, e, a) {
                return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & a, t.last_lit++, 0 === e ? t.dyn_ltree[2 * a] ++ : (t.matches++, e--, t.dyn_ltree[2 * (S[a] + u + 1)] ++, t.dyn_dtree[2 * U(e)] ++), t.last_lit === t.lit_bufsize - 1
            }, a._tr_align = function(t) {
                var e;
                F(t, 2, 3), L(t, 256, w), 16 === (e = t).bi_valid ? (T(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8)
            }
        }, {
            "../utils/common": 3
        }],
        15: [function(t, e, a) {
            "use strict";
            e.exports = function() {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
            }
        }, {}],
        "/": [function(t, e, a) {
            "use strict";
            var n = {};
            (0, t("./lib/utils/common").assign)(n, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), e.exports = n
        }, {
            "./lib/deflate": 1,
            "./lib/inflate": 2,
            "./lib/utils/common": 3,
            "./lib/zlib/constants": 6
        }]
    }, {}, [])("/"), 
    window.fx = function(t) {
        "use strict";
        class e {
            constructor(t = 0, e = 0) {
                this.x = t, this.y = e
            }
            setValue(t, e) {
                return this.x = t, this.y = e, this
            }
            static scale(t, e, a) {
                a.x = t.x * e, a.y = t.y * e
            }
            fromArray(t, e = 0) {
                return this.x = t[e + 0], this.y = t[e + 1], this
            }
            toArray(t, e = 0) {
                t[e + 0] = this.x, t[e + 1] = this.y
            }
            cloneTo(t) {
                var e = t;
                e.x = this.x, e.y = this.y
            }
            from(t) {
                return this.x = t.x, this.y = t.y, this
            }
            isZero() {
                return this.lengthSqr() < 1e-6
            }
            distance(t) {
                let e = this.x - t.x,
                    a = this.y - t.y;
                return Math.sqrt(e * e + a * a)
            }
            distanceSq(t) {
                let e = this.x - t.x,
                    a = this.y - t.y;
                return e * e + a * a
            }
            sub(t) {
                return this.x -= t.x, this.y -= t.y, this
            }
            subOut(t) {
                let a = new e;
                return a.x = this.x - t.x, a.y = this.y - t.y, a
            }
            scale(t, a = !1) {
                let n = a ? new e(this.x, this.y) : this;
                return n.x *= t, n.y *= t, this
            }
            mul(t, a) {
                return (a = a || new e).x = this.x * t, a.y = this.y * t, a
            }
            fuzzyEquals(t, e) {
                return this.x - e <= t.x && t.x <= this.x + e && this.y - e <= t.y && t.y <= this.y + e
            }
            dot(t) {
                return this.x * t.x + this.y * t.y
            }
            cross(t) {
                return this.x * t.y - this.y * t.x
            }
            len() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            }
            lengthSqr() {
                return this.x * this.x + this.y * this.y
            }
            magSqr() {
                return this.lengthSqr()
            }
            normalize(t = 1) {
                let e = this.x,
                    a = this.y,
                    n = e * e + a * a;
                return n > 0 && (n = t / Math.sqrt(n), this.x = e * n, this.y = a * n), this
            }
            add(t) {
                return this.x += t.x, this.y += t.y, this
            }
            angle(t) {
                var e = this.magSqr(),
                    a = t.magSqr();
                if (0 === e || 0 === a) return console.warn("Can't get angle between zero vector"), 0;
                var n = this.dot(t) / Math.sqrt(e * a);
                return n = Math.clamp(n, -1, 1), Math.acos(n)
            }
            signAngle(t) {
                var e = this.angle(t);
                return this.cross(t) < 0 ? -e : e
            }
            rotate(t) {
                if (!t) return this;
                let e = this.x,
                    a = this.y;
                return this.x = e * Math.cos(t) - a * Math.sin(t), this.y = a * Math.cos(t) + e * Math.sin(t), this
            }
            static dot(t, e) {
                return t.x * e.x + t.y * e.y
            }
            static normalize(t, e) {
                var a = t.x,
                    n = t.y,
                    u = a * a + n * n;
                u > 0 && (u = 1 / Math.sqrt(u), e.x = a * u, e.y = n * u)
            }
            static scalarLength(t) {
                var e = t.x,
                    a = t.y;
                return Math.sqrt(e * e + a * a)
            }
            clone() {
                var t = new e;
                return this.cloneTo(t), t
            }
            forNativeElement(t = null) {
                t ? (this.elements = t, this.elements[0] = this.x, this.elements[1] = this.y) : this.elements = new Float32Array([this.x, this.y]), e.rewriteNumProperty(this, "x", 0), e.rewriteNumProperty(this, "y", 1)
            }
            static rewriteNumProperty(t, e, a) {
                Object.defineProperty(t, e, {get: function() {
                        return this.elements[a]
                    },
                    set: function(t) {
                        this.elements[a] = t
                    },
                    configurable: !0
                })
            }
            static lerp(t, e, a, n) {
                var u = t.x,
                    f = t.y;
                n.x = u + a * (e.x - u), n.y = f + a * (e.y - f)
            }
            lerp(t, a, n) {
                return n = n || new e, e.lerp(this, t, a, n), n
            }
            equal(t, e = 1e-6) {
                return Math.abs(this.x - t.x) < e && Math.abs(this.y - t.y) < e
            }
        }
        e.ZERO = new e(0, 0), e.ONE = new e(1, 1);
        class a {
            constructor(t = 0, e = 0, a = 0) {
                this.x = t, this.y = e, this.z = a
            }
            static distance(t, e) {
                var a = t.x - e.x,
                    n = t.y - e.y,
                    u = t.z - e.z;
                return Math.sqrt(a * a + n * n + u * u)
            }
            static min(t, e, a) {
                a.x = Math.min(t.x, e.x), a.y = Math.min(t.y, e.y), a.z = Math.min(t.z, e.z)
            }
            static max(t, e, a) {
                a.x = Math.max(t.x, e.x), a.y = Math.max(t.y, e.y), a.z = Math.max(t.z, e.z)
            }
            static add(t, e, a) {
                a.x = t.x + e.x, a.y = t.y + e.y, a.z = t.z + e.z
            }
            static subtract(t, e, a) {
                a.x = t.x - e.x, a.y = t.y - e.y, a.z = t.z - e.z
            }
            static cross(t, e, a) {
                var n = t.x,
                    u = t.y,
                    f = t.z,
                    g = e.x,
                    _ = e.y,
                    p = e.z;
                a.x = u * p - f * _, a.y = f * g - n * p, a.z = n * _ - u * g
            }
            static dot(t, e) {
                return t.x * e.x + t.y * e.y + t.z * e.z
            }
            static scalarLength(t) {
                var e = t.x,
                    a = t.y,
                    n = t.z;
                return Math.sqrt(e * e + a * a + n * n)
            }
            static scalarLengthSquared(t) {
                var e = t.x,
                    a = t.y,
                    n = t.z;
                return e * e + a * a + n * n
            }
            static normalize(t, e) {
                var a = t.x,
                    n = t.y,
                    u = t.z,
                    f = a * a + n * n + u * u;
                f > 0 && (f = 1 / Math.sqrt(f), e.x = a * f, e.y = n * f, e.z = u * f)
            }
            static multiply(t, e, a) {
                a.x = t.x * e.x, a.y = t.y * e.y, a.z = t.z * e.z
            }
            static scale(t, e, a) {
                a.x = t.x * e, a.y = t.y * e, a.z = t.z * e
            }
            static lerp(t, e, a, n) {
                var u = t.x,
                    f = t.y,
                    g = t.z;
                n.x = u + a * (e.x - u), n.y = f + a * (e.y - f), n.z = g + a * (e.z - g)
            }
            static Clamp(t, e, a, n) {
                var u = t.x,
                    f = t.y,
                    g = t.z,
                    _ = e.x,
                    p = e.y,
                    y = e.z,
                    m = a.x,
                    b = a.y,
                    w = a.z;
                u = (u = u > m ? m : u) < _ ? _ : u, f = (f = f > b ? b : f) < p ? p : f, g = (g = g > w ? w : g) < y ? y : g, n.x = u, n.y = f, n.z = g
            }
            normalize(t = 1) {
                let e = this.x,
                    a = this.y,
                    n = e * e + a * a;
                return n > 0 && (n = t / Math.sqrt(n), this.x = e * n, this.y = a * n), this
            }
            setValue(t, e, a) {
                this.x = t, this.y = e, this.z = a
            }
        }
        a.ZERO = new a(0, 0, 0), a.ONE = new a(1, 1, 1), a.UnitX = new a(1, 0, 0), a.UnitY = new a(0, 1, 0), a.UnitZ = new a(0, 0, 1);
        class n {
            constructor(t = 0, e = 0, a = 0, n = 0) {
                this.x = t, this.y = e, this.z = a, this.w = n
            }
        }
        const u = {
            x: .3,
            y: .59,
            z: .11
        };
        class f {
            static isGetterSetter(t, e) {
                let a = Object.getOwnPropertyDescriptor(t, e) || {};
                return a.get || a.set
            }
            static isNumber(t) {
                return !isNaN(t) && ("number" == typeof t || t instanceof Number)
            }
            static isStrNumber(t) {
                return Number.isFinite(+t)
            }
            static isString(t) {
                return "string" == typeof t || t instanceof String
            }
            static isFunction(t) {
                return t && "function" == typeof t
            }
            static isFunctionEx(t, e) {
                return "function" == typeof t[e]
            }
            static isObject(t) {
                return t && "object" == typeof t && !1 === Array.isArray(t)
            }
            static isBool(t) {
                return "boolean" == typeof t
            }
            static getDeepFunctions(t) {
                if (t && t !== Object.prototype) {
                    let e = Object.getOwnPropertyNames(t).filter((e => this.isGetterSetter(t, e) || this.isFunctionEx(t, e))),
                        a = this.getDeepFunctions(Object.getPrototypeOf(t));
                    return a && (e = e.concat(a)), e
                }
            }
            static getUniqueDeepFunctions(t) {
                return Array.from(new Set(this.getDeepFunctions(t)))
            }
            static getUserFunctions(t) {
                let e = this.getUniqueDeepFunctions(t);
                return e = e.filter((t => "constructor" !== t && !~t.indexOf("__"))), e
            }
            static enableLog() {
                Laya.Log.enable();
                let t = console.log;
                console.log = function(e) {
                    Laya.Log.print(e), t(e)
                }
            }
            static profile(t) {
                if (!t) throw Error("profile key is unexpected !!!");
                this.profileMap[t] = Laya.Browser.now()
            }
            static profileEnd(t, e = 0) {
                if (!t) throw Error("profile key is unexpected !!!");
                if (this.profileMap[t]) {
                    let a = Laya.Browser.now() - this.profileMap[t];
                    return delete this.profileMap[t], a > e && console.log("%c################ %s: %sms", "color:#00aa00", t, a), a
                }
                return 0
            }
            static isEmpty(t) {
                for (const e in t) return !1;
                return !0
            }
            static getGID() {
                return Laya.Utils.getGID()
            }
            static isOnMiniGame() {
                if (Laya.isWXPlayable) return !0;
                let t = window.sdk.Sdk;
                return !!window.biliMiniGame || (t.isOnToutiao() || t.isOnWeiXin() || t.isOnQQ() || t.isOnOppo() || t.isOnBaidu() || t.isOnVivo() || t.isOnKuaiShou() || t.isOnXiaoMi() || t.isOnHuaWei() || t.isOnALIPAY())
            }
            static isOnPC() {
                if (Laya.isWXPlayable) return !1;
                let t = Laya.Browser,
                    e = t._window || window,
                    a = t.userAgent || e.navigator.userAgent,
                    n = e.location.href;
                return -1 != a.indexOf("Windows") && !n.includes("http")
            }
            static isOnNativeAndroid() {
                if (!window.conchConfig) return !1;
                return "Conch-android" == window.conchConfig.getOS()
            }
            static isOnNativeIos() {
                if (!window.conchConfig) return !1;
                return "Conch-ios" == window.conchConfig.getOS()
            }
            static isOnIOS() {
                if (this.isOnNativeIos()) return !0;
                let t = Laya.Browser,
                    e = t._window || window;
                return !!(t.userAgent || e.navigator.userAgent).match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            }
            static isQMP() {
                if (void 0 !== this.sIsQMP) return this.sIsQMP;
                let t = !1,
                    e = Laya.Browser.clientWidth,
                    a = Laya.Browser.clientHeight;
                if (console.log("isQMP userAgent:", Laya.Browser.window.navigator.userAgent, e, a), Laya.Browser.onAndroid) t = Laya.stage.scaleMode == Laya.Stage.SCREEN_VERTICAL ? a / e > 2 : e / a > 2;
                else {
                    let n = /iPhone/gi.test(Laya.Browser.window.navigator.userAgent) && 375 == Math.min(a, e) && 812 == Math.max(a, e),
                        u = 414 == Math.min(a, e) && 896 == Math.max(a, e),
                        f = Laya.MiniAdpter,
                        g = Laya.BMiniAdapter;
                    (Laya.Browser.onMiniGame && !Laya.Browser.onAndroid && -1 != f.systemInfo.model.indexOf("iPhone X") || Laya.Browser.onBDMiniGame && !Laya.Browser.onAndroid && -1 != g.systemInfo.model.indexOf("iPhone X") || n || u) && (t = !0)
                }
                return console.log("isQMP = ", t), this.sIsQMP = t, t
            }
            static isNotchScreenDevice() {
                if (void 0 !== this.sNotchScreen) return this.sNotchScreen;
                let t = null;
                if (Laya.isWXPlayable) window.wx && (t = wx.getSystemInfoSync());
                else {
                    t = Laya.ClassUtils.getRegClass("Sdk").instance.getSystemInfo()
                }
                let e = Laya.LocalStorage.getItem("testNotch");
                if (this.isOnPC() && e && (t.model = "iPhone X"), t && t.model) {
                    for (let e of this.NotchScreenCfg) {
                        if (-1 != t.model.indexOf(e.model)) {
                            this.sNotchScreen = e;
                            break
                        }
                        let a = e.model.replace(/\s/g, "");
                        if (-1 != t.model.indexOf(a)) {
                            this.sNotchScreen = e;
                            break
                        }
                    }
                    if (!this.sNotchScreen)
                        if (t.safeArea) {
                            if (Laya.stage.scaleMode == Laya.Stage.SCREEN_VERTICAL || Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_AUTO && Laya.stage.screenMode == Laya.Stage.SCREEN_VERTICAL) {
                                let e = t.safeArea.top || 0;
                                if (e > 20) {
                                    let a = Math.max(t.screenHeight - t.safeArea.bottom, 0);
                                    this.sNotchScreen = {
                                        model: t.model,
                                        notchTop: e,
                                        notchBottom: a
                                    }
                                }
                            } else {
                                let e = t.safeArea.left || 0;
                                if (e > 20) {
                                    let a = Math.max(t.screenWidth - t.safeArea.right, 0);
                                    this.sNotchScreen = {
                                        model: t.model,
                                        notchTop: e,
                                        notchBottom: a
                                    }
                                }
                            }
                            this.sNotchScreen || (this.sNotchScreen = null)
                        } else {
                            if (Laya.stage.scaleMode == Laya.Stage.SCREEN_VERTICAL || Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_AUTO && Laya.stage.screenMode == Laya.Stage.SCREEN_VERTICAL) {
                                let e = null;
                                Laya.isWXPlayable ? window.wx && wx.getMenuButtonBoundingClientRect && (e = wx.getMenuButtonBoundingClientRect()) : e = window.sdk.Sdk.instance.getMenuButtonBoundingClientRect(), e && e.top > 20 ? this.sNotchScreen = {
                                    model: t.model,
                                    notchTop: e.top,
                                    notchBottom: 20
                                } : this.sNotchScreen = null
                            }!this.sNotchScreen && this.isQMP() && (this.sNotchScreen = {
                                model: t.model,
                                notchTop: 30,
                                notchBottom: 20
                            })
                        }
                }
                return this.sNotchScreen ? console.log("isNotchScreenDevice: ", JSON.stringify(this.sNotchScreen)) : console.log("isNotchScreenDevice: false"), this.sNotchScreen
            }
            static randomArray(t) {
                if (!t || 0 == t.length) return t;
                let e = t.length;
                for (; e;) {
                    let a = Math.floor(Math.random() * e--);
                    [t[a], t[e]] = [t[e], t[a]]
                }
                return t
            }
            static randomArrayEx(t) {
                if (!t || 0 == t.length) return [];
                let e = (t = t.slice()).length;
                for (; e;) {
                    let a = Math.floor(Math.random() * e--);
                    [t[a], t[e]] = [t[e], t[a]]
                }
                return t
            }
            static diffArray(t, e, a = !1) {
                return t && 0 != t.length ? e && 0 != e.length ? a ? t.filter((t => !e.includes(t))).concat(e.filter((e => !t.includes(e)))) : t.filter((t => !e.includes(t))) : t.concat([]) : e.concat([])
            }
            static randomInArray(t) {
                if (!t || 0 == t.length) return null;
                return t[Math.floor(Math.random() * t.length)]
            }
            static randomInArrayEx(t, e) {
                if (!t || 0 == t.length) return null;
                let a = this.copyArray(t);
                if (this.randomArray(a), e <= a.length) return a.slice(0, Math.min(e, a.length)); {
                    let n = e - a.length,
                        u = 0;
                    for (; n--;) a.push(t[u]), u++, u %= t.length;
                    return this.randomArray(a), a
                }
            }
            static showTips(t, e = 2, a, n = "#ffffff") {
                let u = new Laya.Label;
                u.fontSize = 30, u.color = n, u.centerX = 0, u.centerY = 0, u.bold = !0, u.stroke = 5, u.strokeColor = "#000000", u.text = t;
                let f = u.width + 50,
                    g = u.height + 30,
                    _ = new Laya.Box;
                _.zOrder = 1e4, _.width = f, _.height = g, a ? (_.x = a.x, _.y = a.y) : (_.x = Laya.stage.width - _.width >> 1, _.y = 300), Laya.stage.addChild(_);
                let p = new Laya.Image("res/img_tips.png");
                p.sizeGrid = "25,27,30,26", p.width = f, p.height = g, p.alpha = .5, _.addChild(p), _.addChild(u), Laya.Tween.from(_, {
                    y: 400,
                    alpha: 0
                }, 200, null, Laya.Handler.create(this, (() => {
                    Laya.Tween.to(_, {
                        y: 200,
                        alpha: 0
                    }, 200, null, Laya.Handler.create(this, (() => {
                        _.destroy()
                    })), 1e3 * e, !0, !0)
                })))
            }
            static adaptNode(t, e, a, n = !0, u) {
                const adaptFunc = function(f, g) {
                    if (u) {
                        let u = e / f,
                            _ = a / g,
                            p = n ? Math.max(u, _) : Math.min(u, _);
                        t.scaleX = t.scaleY = p
                    } else {
                        let u = f / g,
                            _ = u * a,
                            p = e / u;
                        n ? _ * a > e * p ? (f = _, g = a) : (f = e, g = p) : _ * a < e * p ? (f = _, g = a) : (f = e, g = p), t.width = f, t.height = g
                    }
                };
                if (t instanceof Laya.Image && "img_bg" != t.name) {
                    if (t._RegisterLoaded) return;
                    t._RegisterLoaded = !0, t.on(Laya.Event.LOADED, this, (() => {
                        t.destroyed || t._bitmap && t._bitmap._source && (t.width = t._bitmap._source.width, t.height = t._bitmap._source.height, adaptFunc(t.width, t.height))
                    }))
                } else adaptFunc(t.width, t.height)
            }
            static getClassName(t) {
                return t.__proto__.constructor.name
            }
            static checkClick(t = 300) {
                let e = Laya.Browser.now();
                return e - this.lastClickTime <= t ? (this.lastClickTime = e, !0) : (this.lastClickTime = e, !1)
            }
            static rgbToHsb(t, e, a) {
                let n, u, f;
                t /= 255, e /= 255, a /= 255;
                let g = Math.min(t, e, a),
                    _ = f = Math.max(t, e, a),
                    p = _ - g;
                if (_ == g) n = 0;
                else {
                    switch (_) {
                        case t:
                            n = (e - a) / p + (e < a ? 6 : 0);
                            break;
                        case e:
                            n = 2 + (a - t) / p;
                            break;
                        case a:
                            n = 4 + (t - e) / p
                    }
                    n = Math.round(60 * n) - 180
                }
                return u = 0 == _ ? 0 : 1 - g / _, u = Math.round(200 * u) - 100, f = Math.round(200 * f) - 100, [n, u, f]
            }
            static hsbToRgb(t, e, a) {
                let n = (e + 100) / 200,
                    u = (a + 100) / 200,
                    f = t + 180,
                    g = 0,
                    _ = 0,
                    p = 0,
                    y = parseInt((f / 60 % 6).toString()),
                    m = f / 60 - y,
                    b = u * (1 - n),
                    w = u * (1 - m * n),
                    x = u * (1 - (1 - m) * n);
                switch (y) {
                    case 0:
                        g = u, _ = x, p = b;
                        break;
                    case 1:
                        g = w, _ = u, p = b;
                        break;
                    case 2:
                        g = b, _ = u, p = x;
                        break;
                    case 3:
                        g = b, _ = w, p = u;
                        break;
                    case 4:
                        g = x, _ = b, p = u;
                        break;
                    case 5:
                        g = u, _ = b, p = w
                }
                return g = parseInt((255 * g).toString()), _ = parseInt((255 * _).toString()), p = parseInt((255 * p).toString()), [g, _, p]
            }
            static copyArray(t) {
                if (!t) return t;
                let e = new Array;
                return Laya.Utils.copyArray(e, t)
            }
            static cloneArray(t) {
                if (!t) return t;
                let e = new Array;
                for (let a = 0; a < t.length; a++) {
                    let n = t[a];
                    e[a] = n instanceof Array ? this.cloneArray(n) : n instanceof Object ? this.cloneDeep(n) : n
                }
                return e
            }
            static clone(t) {
                let e = {},
                    a = Object.getOwnPropertyNames(t);
                for (let n of a) e[n] = t[n];
                return e
            }
            static cloneDeep(t) {
                if (!t) return;
                if (this.isString(t) || this.isNumber(t)) return t;
                let e = t instanceof Array ? [] : {},
                    a = Object.getOwnPropertyNames(t);
                for (let n of a) {
                    let a = t[n];
                    e[n] = a instanceof Array ? this.copyArray(a) : a instanceof Object ? this.cloneDeep(a) : a
                }
                return e
            }
            static getFileExt(t) {
                return Laya.Utils.getFileExtension(t)
            }
            static getGlobalBounds(t, e) {
                let a = t.getBounds();
                a = a.clone();
                let n = new Laya.Point(a.x, a.y);
                return n = t.parent.localToGlobal(n), e ? (n = e.globalToLocal(n), a.setTo(n.x, n.y, a.width, a.height)) : a.setTo(n.x, n.y, a.width, a.height), a
            }
            static getIntRandom(t, e) {
                return Math.floor(Math.random() * (e - t + 1) + t)
            }
            static getIntRandomEx(t, e) {
                return Math.floor(Math.randomEx() * (e - t + 1) + t)
            }
            static getNumberRandom(t, e) {
                return Math.random() * (e - t) + t
            }
            static getNumberRandomEx(t, e) {
                return Math.randomEx() * (e - t) + t
            }
            static getSignRandom() {
                return 0 == this.getIntRandom(0, 1) ? -1 : 1
            }
            static formatNumber(t, e = 0) {
                if (this.isNumber(t)) {
                    let a = t.toFixed(e);
                    return a = a.split("").reverse().join("").replace(/(\d{3})/g, "$1,").replace(/\,$/, "").split("").reverse().join(""), a
                }
                return (t = 0).toFixed(e)
            }
            static formatString(t, e) {
                let a = e;
                if ("object" != typeof a) {
                    a = {};
                    for (let t in arguments) "0" !== t && (a[Number(t) - 1] = arguments[t])
                }
                for (let e in a) {
                    let f = a[e];
                    n = e, u = f, t = t.replace(new RegExp("\\{" + n + "\\}", "gm"), u)
                }
                var n, u;
                return t
            }
            static checkPowerOf2(t) {
                return 0 == (t &= t - 1)
            }
            static getIndex2N(t) {
                if (1 == t) return 0;
                if (this.checkPowerOf2(t)) {
                    let e = 1;
                    for (; t;) {
                        if (1 == t || 2 == t) return e;
                        t % 2 == 0 && (t >>= 1, e += 1)
                    }
                }
                return -1
            }
            static getIndexN(t, e) {
                let a = t;
                for (let n = 0; n < e; ++n) a *= t;
                return a
            }
            static roundNumber(t, e) {
                let a = Math.pow(10, e);
                return Math.round(t * a) / a
            }
            static showBorder(t, e = !0, a, n) {
                let u = t;
                if (!e) return void(u.__border && (Laya.timer.clearAll(u), u.__border.removeSelf(), u.__border = null));
                if (u.__border) return;
                let f = new Laya.Sprite;
                u.__border = f, Laya.stage.addChild(f), Laya.timer.loop(50, u, (function() {
                    let e = fx.Utils.getGlobalBounds(t, n);
                    f.graphics.clear(), a = a || "#ff0000", f.graphics.drawRect(e.x, e.y, e.width, e.height, null, a, 2)
                })), t.once(Laya.Event.REMOVED, this, (() => {
                    this.showBorder(t, !1)
                }))
            }
            static showRect(t, e, a = !0, n) {
                let u = e;
                if (!a) return void(u.__border && (Laya.timer.clearAll(u), u.__border.removeSelf(), u.__border = null));
                if (u.__border) return;
                let f = new Laya.Sprite;
                u.__border = f, e.addChild(f), f.graphics.clear(), n = n || "#ff0000", f.graphics.drawRect(t.x, t.y, t.width, t.height, null, n, 2), e.once(Laya.Event.REMOVED, this, (() => {
                    this.showRect(t, e, !1)
                }))
            }
            static showRedDot(t, a) {
                let n, u;
                if (t instanceof Laya.Point || t instanceof e ? (n = Laya.stage, u = t) : (n = t, a ? u = new Laya.Point(a.x, a.y) : (u = new Laya.Point(n.x, n.y), u = n.fromParentPoint(u))), n.__reddot) return;
                let f = new Laya.Sprite;
                f.scale(1 / n.scaleX, 1 / n.scaleY), f.x = u.x, f.y = u.y, n.addChild(f), f.graphics.clear(), f.graphics.drawCircle(0, 0, 5, "#ff0000", "#ff0000", 2), n.__reddot = f, n.once(Laya.Event.REMOVED, this, (function() {
                    n.__reddot = void 0, f.removeSelf()
                }))
            }
            static pathInfo(t) {
                let e = "",
                    a = "",
                    n = "",
                    u = "",
                    f = "",
                    g = "",
                    _ = t;
                if (t) {
                    _ = t.replace("\\", "/");
                    let p = t.match(/((^.+)\/)((\w+)(\.(\w+)))/i);
                    p && p.length > 1 ? (e = p[1], a = p[2], n = p[3], u = p[4], f = p[5], g = p[6]) : u = t
                }
                return {
                    dir: e,
                    dirname: a,
                    file: n,
                    filename: u,
                    ext: f,
                    extname: g,
                    full: _
                }
            }
            static createAnim(t, e) {
                let a = new Laya.Animation;
                return a.loadAnimation(t, Laya.Handler.create(this, (function() {
                    !a.destroyed && e && e.runWith(a)
                }))), a
            }
            static playAnim(t, e, a, n, u) {
                t.play(a, n, u), e && (n ? t.on(Laya.Event.COMPLETE, e.caller, (function() {
                    e.run()
                })) : t.once(Laya.Event.COMPLETE, e.caller, (function() {
                    e.run()
                })))
            }
            static getAnimSize(t, e) {
                if (t.isPlaying) {
                    let a = t.getSelfBounds();
                    e.runWith(a)
                } else {
                    t.play();
                    let func = function() {
                        t.gotoAndStop(0);
                        let a = t.getSelfBounds();
                        e.runWith(a)
                    };
                    t.once(Laya.Event.REMOVED, this, (() => {
                        Laya.timer.clear(this, func)
                    })), Laya.timer.frameOnce(1, this, func)
                }
            }
            static createAni(t) {
                let e = new Laya.Animation;
                return t.parent.addChild(e), e.pos(t.pos.x, t.pos.y, !0), e.offAll(), e.on(Laya.Event.LABEL, t.lbCaller, t.lbCb), e.on(Laya.Event.COMPLETE, t.completeCaller, t.completeCb), e
            }
            static playAni(t, e, a, n, u, f, g, _) {
                t && t.loadAnimation(e, Laya.Handler.create(this, (() => {
                    t.visible = !0, t.play(n, u, a), f && g && g.apply(f, _)
                })))
            }
            static recoverAni(t) {
                t && (t.offAll(), t.loop = !1, t.removeSelf())
            }
            static getLength(t) {
                return Object.keys(t).length
            }
            static randomByRate(t) {
                return t > 1 && (t *= .01), Math.random() > 1 - t
            }
            static applyMixins(t, e, a) {
                t.prototype && e.forEach((e => {
                    Object.getOwnPropertyNames(e.prototype).forEach((n => {
                        "constructor" != n && (t.prototype[n] = e.prototype[n], t._super = a)
                    }))
                }))
            }
            static super(t) {
                let e = this.getModule(t);
                return e._super || e.__super || e.__proto__
            }
            static getModule(t) {
                return t.__proto__.constructor
            }
            static getNumberZeroAmount(t) {
                if (null == t || isNaN(t)) return console.log("非法参数"), [0, 0];
                let e = 0;
                for (;;) {
                    let a = t / 1e3;
                    if (a < 1) break;
                    t = a, e += 1
                }
                return [t = 0 !== e ? Number(t.toFixed(2)) : Math.floor(t), 3 * e]
            }
            static getStringZeroAmount(t) {
                if (null == t || "string" != typeof t) return console.log("非法参数"), [0, 0];
                let e = t.indexOf("."),
                    a = 0,
                    n = 0,
                    u = (t = t.slice(0, e)).length;
                n = Math.floor(u / 3), a = u % 3, 0 == a && (a = 3, n -= 1);
                let f = Number(t.slice(a, a + 2));
                return f = Number(t.slice(a + 2, a + 3)) >= 5 ? f + 1 : f, [Number(t.slice(0, a) + "." + f), 3 * n]
            }
            static formatNumberWithUnits(t) {
                let [e, a] = f.getFormatNumberWithUnitsInfo(t);
                return e + a
            }
            static getFormatNumberWithUnitsInfo(t, e) {
                let [a, n] = [null, null];
                "number" == typeof t ? [a, n] = f.getNumberZeroAmount(t) : "string" == typeof t && ([a, n] = f.getStringZeroAmount(t));
                let u = "" + n,
                    g = null;
                return g = null != e ? e[u] : f.numberUnit[u], null == g && (g = ""), [a, g]
            }
            static takeOneByWeight(t, e) {
                let a = [];
                if (e) {
                    let n = t,
                        u = e;
                    if (n.length !== u.length) return void console.log("对象数组和权重数组长度不匹配!!!");
                    for (let t = 0; t < n.length; ++t) {
                        let e = n[t],
                            f = u[t];
                        a.push({
                            o: e,
                            weight: f
                        })
                    }
                } else a = t;
                if (!a) return void console.log("带权数组为空!!!");
                let n = 0,
                    u = [];
                for (let t = 0; t < a.length; ++t) {
                    let e = a[t].weight;
                    null != e && (n += e, u.push({
                        prob: e,
                        index: t,
                        ele: a[t]
                    }))
                }
                let g = null,
                    _ = 0,
                    p = f.getIntRandom(1, n),
                    y = 0;
                for (let t = 0; t < u.length; ++t)
                    if (y += u[t].prob, p <= y) {
                        g = u[t].ele, _ = u[t].index;
                        break
                    }
                return [_, g]
            }
            static takeSomeByWeight(t, e, a) {
                let n = [];
                if (a) {
                    let t = e,
                        u = a;
                    if (t.length !== u.length) return void console.log("对象数组和权重数组长度不匹配!!!");
                    for (let e = 0; e < t.length; ++e) {
                        let a = t[e],
                            f = u[e];
                        n.push({
                            o: a,
                            weight: f
                        })
                    }
                } else n = e;
                if (null == n) return void console.log("带权数组为空!!!");
                let u = [],
                    g = n.slice();
                for (let e = 0; e < t; ++e) {
                    let [t, e] = f.takeOneByWeight(g);
                    g.splice(t, 1), u.push([t, e])
                }
                return u
            }
            static getUIFrameAnimation(t, e) {
                return t[e]
            }
            static getDefaultUIFrameAnimation(t) {
                let e = t._aniList;
                if (e && e.length > 0) return e[0]
            }
            static getAnimationActionName(t) {
                return t._actionName
            }
            static getAnimationUrl(t) {
                return t._url
            }
            static timestampToTime(t, e) {
                e ? !e.separator && (e.separator = ["h ", "m ", "s"]) : e = {
                    separator: ["h ", "m ", "s"],
                    isAlign: !1
                };
                let a = t / 1e3,
                    n = Math.floor(a / 3600),
                    u = "";
                n >= 0 && (u = n < 10 && e.isAlign ? "0" + n + e.separator[0] : n + e.separator[0]);
                let f = Math.floor(a % 3600 / 60),
                    g = "";
                f >= 0 && (g = f < 10 && e.isAlign ? "0" + f + e.separator[1] : f + e.separator[1]);
                let _ = Math.floor(a % 60),
                    p = "";
                return _ >= 0 && (p = _ < 10 && e.isAlign ? "0" + _ + e.separator[2] : _ + e.separator[2]), u + g + p
            }
            static timestampToMS(t, e) {
                e ? !e.separator && (e.separator = ["m ", "s"]) : e = {
                    separator: ["m ", "s"],
                    isAlign: !1
                };
                let a = t / 1e3,
                    n = Math.floor(a % 3600 / 60),
                    u = "";
                n >= 0 && (u = n < 10 && e.isAlign ? "0" + n + e.separator[0] : n + e.separator[0]);
                let f = Math.floor(a % 60),
                    g = "";
                return f >= 0 && (g = f < 10 && e.isAlign ? "0" + f : f + "", e.separator[1] && (g += e.separator[1])), u + g
            }
            static timestampToHM(t, e) {
                e ? !e.separator && (e.separator = ["h ", "m"]) : e = {
                    separator: ["h ", "m"],
                    isAlign: !1
                };
                let a = t / 1e3,
                    n = Math.floor(a / 3600),
                    u = "";
                n >= 0 && (u = n < 10 && e.isAlign ? "0" + n + e.separator[0] : n + e.separator[0]);
                let f = Math.floor(a % 3600 / 60),
                    g = "";
                return f >= 0 && (g = f < 10 && e.isAlign ? "0" + f + e.separator[1] : f + e.separator[1]), u + g
            }
            static countdown(t, e, a) {
                const clear = function() {
                        e.clearTimer(e, tick)
                    },
                    tick = () => {
                        t = Math.max(t - 1e3, 0), a.call(e, t), t <= 0 && (clear(), e.off(Laya.Event.REMOVED, this, clear))
                    };
                e.once(Laya.Event.REMOVED, this, clear), e.timerLoop(1e3, e, tick)
            }
            static getDayInYear(t) {
                let e = t || new Date,
                    a = new Date(e.getFullYear().toString()).getTime(),
                    n = e.getTime();
                return Math.ceil((n - a) / 864e5)
            }
            static initRelativeDate(t) {
                f.relativeDate = t, f.localLaunchDate = new Date
            }
            static getDate() {
                return f.relativeDate || new Date
            }
            static getTime() {
                if (f.relativeDate) {
                    let t = (new Date).getTime() - f.localLaunchDate.getTime();
                    return f.relativeDate.getTime() + t
                }
                return (new Date).getTime()
            }
            static getCurDayStartTime() {
                let t = this.getDate().toLocaleDateString();
                return new Date(t).getTime()
            }
            static getCurEndStartTime() {
                return this.getCurDayStartTime() + 864e5 - 1
            }
            static getYearWeek() {
                let t = new Date,
                    e = t.getDay();
                0 == e && (e = 7);
                let a = new Date(t.getFullYear(), 0, 1),
                    n = a.getDay();
                0 == n && (n = 7);
                let u = Math.round((t.getTime() - a.getTime() + 864e5 * (n - e)) / 864e5);
                return {
                    year: t.getFullYear(),
                    week: Math.ceil(u / 7) + 1
                }
            }
            static isToday(t) {
                let e;
                e = "string" == typeof t ? new Date(t) : t;
                let a = new Date;
                return e >= new Date(a.getFullYear(), a.getMonth(), a.getDate())
            }
            static assign(t, e, a = !0, n = !0) {
                let u = a ? Object.keys(t) : Object.keys(e);
                return e instanceof Array && u.pop(), this.assignFrom(t, e, u, n)
            }
            static assignFrom(t, e, a, n) {
                let u = [];
                for (let f of a) null == e[f] || e[f] == t[f] || !n && null != t[f] || (t[f] = e[f], u.push(f));
                return u
            }
            static stringformat(t, e) {
                return this.formatString(t, e)
            }
            static binarySearch(t, e, a = 1) {
                let n = 0,
                    u = t.length - 1;
                for (; n <= u;) {
                    let f = Math.floor((n + u) / 2),
                        g = Math.min(f + a, u),
                        _ = e(t[f], t[g], f);
                    if (0 == _) return f;
                    _ > 0 ? n = f : u = f
                }
                return -1
            }
            static resetAnchor(t, e, a) {
                if (e < 0 || e > 1 || a < 0 || a > 1 || 0 == t.scaleX || 0 == t.scaleY) return;
                let n, u, f = t.anchorX,
                    g = t.anchorY;
                if (e == f && a == g) return n = f * t.width, u = g * t.height, void t.pivot(n, u);
                !f && t.pivotX && !g && t.pivotY && (f = t.pivotX / t.width, g = t.pivotY / t.height), f = f || 0, g = g || 0, n = (e - f) * t.width, u = (a - g) * t.height, t.anchorX = e, t.anchorY = a, t.pivot(n, u), n *= t.scaleX, u *= t.scaleY, t.x += n, t.y += u
            }
            static resetPivot(t, e, a) {
                let n = t.pivotX,
                    u = t.pivotY,
                    f = e / t.width,
                    g = a / t.height,
                    _ = n / t.width,
                    p = u / t.height,
                    y = (f - _) * t.width * t.scaleX,
                    m = (g - p) * t.height * t.scaleY;
                t.pivot(e, a), t.x += y, t.y += m
            }
            static generatePicture(t, e, a, n, u) {
                e = e || 0, a = a || 0, n = n || t.width, u = u || t.height;
                let g = t.drawToCanvas(n, u, e, a).toBase64("image/png", .9);
                g = g.substring(g.indexOf("base64") + 7);
                let _ = `${Laya.MiniFileMgr.fileNativeDir}/tmp_qrcode.png`;
                Laya.MiniFileMgr.fs.writeFile({
                    filePath: _,
                    data: g,
                    encoding: "base64",
                    success: t => {
                        wx.saveImageToPhotosAlbum({
                            filePath: _,
                            success: t => {
                                f.showTips("成功")
                            },
                            fail: t => {
                                f.showTips("失败")
                            }
                        })
                    },
                    fail: t => {
                        f.showTips("保存失败")
                    }
                })
            }
            static renderToTexture(t, e, a, n = 0, u = 0, f) {
                let g;
                if (e = e || t.width, a = a || t.height, Laya.stage.addChild(t), f) {
                    g = f;
                    let _ = t.drawToTexture(e, a, n, u, f.bitmap);
                    g.bitmap = _
                } else g = t.drawToTexture(e, a, n, u), Laya.CallLater.I.callLater(this, (() => {
                    g.bitmap.lock = !1, g.destroy()
                }));
                return Laya.stage.removeChild(t), g
            }
            static mixturePicture(t, e) {
                if (!window.wx) return;
                let a = t.width,
                    n = t.height,
                    u = t.drawToCanvas(a, n, 0, 0).toBase64("image/png", .9);
                u = u.substring(u.indexOf("base64") + 7);
                let f = `${Laya.MiniFileMgr.fileNativeDir}/tmp_qrcode.png`;
                Laya.MiniFileMgr.fs.writeFile({
                    filePath: f,
                    data: u,
                    encoding: "base64",
                    success: t => {
                        console.log(f), e(f)
                    },
                    fail: t => {}
                })
            }
            static deltaDays(t, e) {
                let a = (e - t) / 1e3;
                return Math.floor(a / 86400)
            }
            static equal(t, e, a = 1e-6) {
                return Math.abs(t - e) < a
            }
            static str2Boolean(t) {
                if ("string" != typeof t) return !1;
                let e = t.toLowerCase();
                return "false" !== e && "" !== e
            }
            static str2Number(t) {
                let e = 0;
                for (let a = 0; a < t.length; a++) {
                    let n = t.charCodeAt(a);
                    n <<= a, e += n
                }
                return e
            }
            static getFrameDelta(t) {
                let e = .001 * Laya.timer.delta;
                return t && (e = Math.min(e, t)), e
            }
            static createPrefabs(t, e = 1) {
                let a = [];
                if (!Laya.loader.getRes(t)) throw `需要先加载${t}才可以创建`;
                for (let n = 0; n < e; ++n) a.push(this.createPrefab(t));
                return a
            }
            static createPrefab(t, e) {
                if (!e) {
                    let e = Laya.loader.getRes(t);
                    if (e instanceof Laya.Prefab) return e.create(); {
                        let t = e;
                        return e = new Laya.Prefab, e.json = t, e.create()
                    }
                }
                Laya.loader.load(t, Laya.Handler.create(this, (() => {
                    if (e.caller.destroyed) return;
                    let a, n = Laya.loader.getRes(t);
                    if (n instanceof Laya.Prefab) a = n.create();
                    else {
                        let t = n;
                        n = new Laya.Prefab, n.json = t, a = n.create()
                    }
                    e.runWith(a)
                })))
            }
            static getEnumArray(t) {
                let e = 0,
                    a = [];
                for (; t[e];) a.push(t[e]), e++;
                return a
            }
            static getEnumKeyMap(t) {
                let e = this.getEnumArray(t),
                    a = {};
                for (const n of e) null != t[n] && (a[n] = n);
                return a
            }
            static MeterToKilometer(t) {
                if (t < 1e4) return t + "m";
                return (t / 1e3).toFixed(1) + "km"
            }
            static getCirclePoint(t, a, n) {
                let u = Math.rad(n),
                    f = t.x + Math.sin(u) * a,
                    g = t.y - Math.cos(u) * a;
                return new e(f, g)
            }
            static compareVersion(t, e) {
                let a = t;
                if (!a || !a.split) return 0;
                let n = e;
                if (!n || !n.split) return 0;
                let u = a.split("."),
                    f = n.split(".");
                const g = Math.max(u.length, f.length);
                for (; u.length < g;) u.push("0");
                for (; f.length < g;) f.push("0");
                for (let t = 0; t < g; t++) {
                    const e = parseInt(u[t]),
                        a = parseInt(f[t]);
                    if (e > a) return 1;
                    if (e < a) return -1
                }
                return 0
            }
            static compatibleVersion(t, e) {
                return f.compareVersion(t, e) >= 0
            }
            static defineProperty(t, e, a, n = "_") {
                if (!Object.getOwnPropertyDescriptor(t, e)) {
                    let u = n + e;
                    delete t[e], t.hasOwnProperty(u) || null == a || (t[u] = a), Object.defineProperty(t, e, {set: function(t) {
                            this[u] != t && (this[u] = t)
                        },
                        get: function() {
                            return this[u]
                        },
                        configurable: !0
                    })
                }
            }
            static definePropertyEx(t, e, a) {
                Object.getOwnPropertyDescriptor(t, e) ? console.warn(`already defined property: ${e} !`) : (delete t[e], Object.defineProperty(t, e, {
                    value: a.value,
                    enumerable: a.enumerable,
                    writable: a.writable,
                    configurable: a.configurable
                }))
            }
            static warpObjectGetterSetter(t, e) {
                let a = t;
                for (const n in t)
                    if (t.hasOwnProperty(n)) {
                        let u = a[n];
                        delete a[n], u instanceof Object ? Object.defineProperty(t, n, {get: function() {
                                return a["_" + n]
                            },
                            set: function(t) {
                                a["_" + n] = t, e && e.call(a, n)
                            },
                            enumerable: !1,
                            configurable: !0
                        }) : Object.defineProperty(t, n, {get: function() {
                                return a["_" + n]
                            },
                            set: function(t) {
                                t !== a["_" + n] && (a["_" + n] = t, e && e.call(a, n))
                            },
                            enumerable: !1,
                            configurable: !0
                        }), a["_" + n] = u, e && e.call(a, n)
                    }
            }
            static warpObjectGetterSetterAppend(t, e, a) {
                let n = t;
                for (const u of e) {
                    let e = n[u];
                    delete n[u], e instanceof Object ? Object.defineProperty(t, u, {get: function() {
                            return n["_" + u]
                        },
                        set: function(t) {
                            n["_" + u] = t, a && a.call(n, u)
                        },
                        enumerable: !1,
                        configurable: !0
                    }) : Object.defineProperty(t, u, {get: function() {
                            return n["_" + u]
                        },
                        set: function(t) {
                            t !== n["_" + u] && (n["_" + u] = t, a && a.call(n, u))
                        },
                        enumerable: !1,
                        configurable: !0
                    }), n["_" + u] = e, a && a.call(n, u)
                }
            }
            static warpObjectGetterSetterPrefix(t, e, a) {
                let n = t;
                const proc = (a, u, f) => {
                    let g = n[a];
                    delete n[a], g instanceof Object ? Object.defineProperty(t, a, {get: function() {
                            return u ? u.call(n) : n["_" + a]
                        },
                        set: function(t) {
                            f ? f.call(n, t) : n["_" + a] = t, e && e.call(n, a)
                        },
                        enumerable: !1,
                        configurable: !0
                    }) : Object.defineProperty(t, a, {get: function() {
                            return u ? u.call(n) : n["_" + a]
                        },
                        set: function(t) {
                            if (f) f.call(n, t);
                            else {
                                if (t === n["_" + a]) return;
                                n["_" + a] = t
                            }
                            e && e.call(n, a)
                        },
                        enumerable: !1,
                        configurable: !0
                    }), f ? f.call(n, g) : n["_" + a] = g, e && e.call(n, a)
                };
                let u = this.getUserFunctions(t);
                for (; t && t != Object.prototype;) {
                    a = a || Object.getOwnPropertyNames(t);
                    for (const e of a)
                        if (this.isGetterSetter(t, e) || this.isFunctionEx(t, e)) {
                            if (u.includes(e) && this.isGetterSetter(t, e)) {
                                let a = Object.getOwnPropertyDescriptor(t, e),
                                    n = a.get,
                                    u = a.set;
                                proc(e, n, u)
                            }
                        } else n != t || u.find((t => e.includes(t))) || proc(e);
                    t = Object.getPrototypeOf(t)
                }
            }
            static getUIComponetRoot(t) {
                if (!t.scene) return;
                let e = t.scene.getModuleUrlName();
                if (e) return e;
                let a = t.scene;
                for (; a.parent && (a = a.parent, !a.getModuleUrlName || (e = a.getModuleUrlName(), !e)););
                return e
            }
            static asyncProcess(t, e, a = 30) {
                const clearFunc = () => {
                        Laya.timer.clear(this, loopFunc), t.off(Laya.Event.REMOVED, this, clearFunc)
                    },
                    loopFunc = () => {
                        for (;;) {
                            if (Laya.stage.getTimeFromFrameStart() >= a) return;
                            if (e.run()) return void clearFunc()
                        }
                    };
                Laya.timer.frameLoop(1, this, loopFunc), t.once(Laya.Event.REMOVED, this, clearFunc)
            }
            static bindVarByName(t, e) {
                let a = e ? e.getChildren() : t.getChildren(),
                    n = t;
                for (const e of a) {
                    let a = e.name;
                    if (a) {
                        if (n[a]) throw Error("bindVarByName failed, already exist !!!");
                        n[a] = e
                    }
                    e.numChildren > 0 && this.bindVarByName(t, e)
                }
            }
            static bindScriptVarByName(t, e) {
                let a, n = Object.getOwnPropertyNames(t);
                if (n && n.length) {
                    e || (e = t.owner), a = e.getChildren();
                    for (const e of a) {
                        let a = e.name;
                        a && -1 !== n.indexOf(a) && (t[a] = e), e.numChildren > 0 && this.bindScriptVarByName(t, e)
                    }
                }
            }
            static clearUIComponentPositionInfo(t) {
                t && (t.x = t.y = t.left = t.right = t.top = t.bottom = t.centerX = t.centerY = void 0)
            }
            static getHashCode(t, e) {
                e || (t = t.toLowerCase());
                let a, n, u = 1315423911;
                for (a = t.length - 1; a >= 0; a--) n = t.charCodeAt(a), u ^= (u << 5) + n + (u >> 2);
                return 2147483647 & u
            }
            static createUUID() {
                let t = [],
                    e = "0123456789abcdef";
                for (let a = 0; a < 36; a++) t[a] = e.substr(Math.floor(16 * Math.random()), 1);
                return t[14] = "4", t[19] = e.substr(3 & t[19] | 8, 1), t[8] = t[13] = t[18] = t[23] = "-", t.join("")
            }
            static createUUIDEx(t, e) {
                var a, n, u = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
                    f = [];
                if (e = e || u.length, t)
                    for (a = 0; a < t; a++) f[a] = u[0 | Math.random() * e];
                else
                    for (f[8] = f[13] = f[18] = f[23] = "-", f[14] = "4", a = 0; a < 36; a++) f[a] || (n = 0 | 16 * Math.random(), f[a] = u[19 == a ? 3 & n | 8 : n]);
                return f.join("")
            }
            static remap(t, e, a, n, u) {
                return n + (t - e) / (a - e) * (u - n)
            }
            static colorHexTo3I(t) {
                if ("#" != t.charAt(0)) return new a;
                t = t.substr(1);
                let e = parseInt(t, 16);
                return new a((16711680 & e) >> 16, (65280 & e) >> 8, 255 & e)
            }
            static colorHexTo3F(t) {
                if ("#" != t.charAt(0)) return new a;
                t = t.substr(1);
                let e = parseInt(t, 16);
                return new a(((16711680 & e) >> 16) / 255, ((65280 & e) >> 8) / 255, (255 & e) / 255)
            }
            static colorHexTo4I(t) {
                if ("#" != t.charAt(0)) return new n;
                t = t.substr(1);
                let e = parseInt(t, 16);
                return new n((16711680 & e) >> 16, (65280 & e) >> 8, 255 & e, 255)
            }
            static colorHexTo4F(t) {
                if ("#" != t.charAt(0)) return new n;
                t = t.substr(1);
                let e = parseInt(t, 16);
                return new n(((16711680 & e) >> 16) / 255, ((65280 & e) >> 8) / 255, (255 & e) / 255, 1)
            }
            static getRandomColor4F() {
                let t = fx.Utils.getNumberRandom(0, 1),
                    e = fx.Utils.getNumberRandom(0, 1),
                    a = fx.Utils.getNumberRandom(0, 1);
                return new n(t, e, a, 1)
            }
            static getRandomColor3F() {
                let t = fx.Utils.getNumberRandom(0, 1),
                    e = fx.Utils.getNumberRandom(0, 1),
                    n = fx.Utils.getNumberRandom(0, 1);
                return new a(t, e, n)
            }
            static color3Fto3I(t) {
                return new a(255 * t.x, 255 * t.y, 255 * t.z)
            }
            static color3Ito3F(t) {
                return new a(t.x / 255, t.y / 255, t.z / 255)
            }
            static color3Fto4F(t) {
                return new n(t.x, t.y, t.z, 1)
            }
            static color4Fto3F(t) {
                return new a(t.x, t.y, t.z)
            }
            static color4Fto3I(t) {
                return new a(255 * t.x, 255 * t.y, 255 * t.z)
            }
            static color3Ito4F(t) {
                return new n(t.x / 255, t.y / 255, t.z / 255, 1)
            }
            static getColorLumin3F(t) {
                return a.dot(t, u)
            }
            static getColorLumin3I(t) {
                let e = this.color3Ito3F(t);
                return this.getColorLumin3F(e)
            }
            static setColorLumin3F(t, e) {
                let n = this.getColorLumin3F(t);
                return a.scale(t, e / n, t), a.Clamp(t, a.ZERO, a.ONE, t), t
            }
            static getColorLumin4F(t) {
                return a.dot(t, u)
            }
            static setColorLumin4F(t, e) {
                let a = this.color4Fto3F(t);
                return a = this.setColorLumin3F(a, e), t.setValue(a.x, a.y, a.z, t.w), t
            }
            static getRandomColorString() {
                let t = fx.Utils.getIntRandom(0, 255),
                    e = fx.Utils.getIntRandom(0, 255),
                    a = fx.Utils.getIntRandom(0, 255);
                return this.getHexColorStringI(t, e, a)
            }
            static getHexColorStringF(t, e, a) {
                return t = Math.floor(255 * t), e = Math.floor(255 * e), a = Math.floor(255 * a), this.getHexColorStringI(t, e, a)
            }
            static getHexColorStringI(t, e, a) {
                let n = (t << 16) + (e << 8) + a;
                return Laya.Utils.toHexColor(n)
            }
            static setTimerSpeed(t) {
                Laya.startTimer.speed = t, Laya.physicsTimer.speed = t, Laya.updateTimer.speed = t, Laya.lateTimer.speed = t, Laya.timer.speed = t
            }
            static clearUnusedRes(t) {
                let e = Laya.URL.formatURL(t),
                    a = Laya.Loader.getAtlas(e);
                if (a)
                    for (let t = 0, e = a.length; t < e; t++) {
                        let e = a[t],
                            n = Laya.Loader.getRes(e);
                        if (n && n._referenceCount > 0) return
                    }
                let n = Laya.Loader.textureMap[e];
                n && n._referenceCount > 0 || Laya.loader.clearRes(t)
            }
            static recurisNode(t, e, a = !1) {
                if (a) {
                    const anonymous = function(t) {
                        let a = t.getChildren();
                        for (const t of a) {
                            let e = anonymous(t);
                            if (!1 === e) return e;
                            if (-1 === e) break
                        }
                        return e(t)
                    };
                    anonymous(t)
                } else {
                    let a = [];
                    for (a.push(t); a.length > 0;) {
                        let t = a.shift(),
                            n = e(t);
                        if (!1 === n) return n;
                        if (-1 === n) continue;
                        let u = t.getChildren();
                        for (const t of u) a.push(t)
                    }
                }
            }
            static randomPointInRect(t, a = 1, n) {
                let u, f, g = 2 * a,
                    _ = !1;
                t.forEach((t => {
                    if (u = t, !u.__grid) {
                        let e = Math.ceil(t.width / g),
                            a = Math.ceil(t.height / g);
                        u.__grid = [];
                        for (let t = 0; t < e; t++) u.__grid[t] = new Array(a).fill(0);
                        _ = !0
                    }
                })), _ && n && n.length > 0 && this.occupyPointsInRects(t, n), fx.Utils.randomArray(t);
                let p = t.length;
                for (; p-- && (f = t[p], u = f, "full" == u.__grid);); - 1 == p && console.warn("randomPointInRect: 已占满！请缩小radius或者减少数量！");
                let y, m, b = new e(f.x, f.y),
                    w = new e(f.right, f.bottom),
                    x = u.__grid,
                    v = x.length,
                    S = x[0].length,
                    E = v * S;
                for (; E--;) {
                    y = fx.Utils.getNumberRandomEx(b.x, w.x), m = fx.Utils.getNumberRandomEx(b.y, w.y);
                    let t = w.x - b.x,
                        e = w.y - b.y,
                        n = Math.min(Math.floor((y - b.x) / t * v), v - 1),
                        u = Math.min(Math.floor((m - b.y) / e * S), S - 1);
                    if (0 == x[n][u]) {
                        x[n][u] = 1, y = (n + 1) / v * t + b.x - a, m = (u + 1) / S * e + b.y - a;
                        break
                    }
                }
                return -1 == E && (u.__grid = "full"), new e(y, m)
            }
            static occupyPointsInRects(t, a) {
                let n, u, f = t.length;
                for (; f--;) {
                    n = t[f], u = n;
                    let g = u.__grid;
                    if (g && "full" != g) {
                        let t = new e(n.x, n.y),
                            u = new e(n.right, n.bottom),
                            f = g.length,
                            _ = g[0].length;
                        for (let e = a.length - 1; e >= 0; --e) {
                            let n = a[e],
                                p = e;
                            if (n.x >= t.x && n.x <= u.x && n.y >= t.y && n.y <= u.y) {
                                let e = u.x - t.x,
                                    y = u.y - t.y,
                                    m = Math.min(Math.floor((n.x - t.x) / e * f), f - 1),
                                    b = Math.min(Math.floor((n.y - t.y) / y * _), _ - 1);
                                0 == g[m][b] && (g[m][b] = 1, a.splice(p, 1))
                            }
                        }
                    }
                    if (0 == a.length) break
                } - 1 == f && console.warn("occupyPointsInBounds 失败！不在范围内? 已占满? 没有创建格子?")
            }
            static randomPointInCircle(t, a = 1, n) {
                let u, f = 2 * a,
                    g = new e,
                    _ = !1;
                t.forEach((t => {
                    if (!t.__grid) {
                        let n = 2 * t.radius,
                            u = Math.ceil(n / f),
                            p = new e;
                        p.x = t.center.x - t.radius, p.y = t.center.y - t.radius;
                        let y = new e;
                        y.x = t.center.x + t.radius, y.y = t.center.y + t.radius, t.__min = p, t.__max = y;
                        let m = t.__grid = [];
                        for (let e = 0; e < u; e++) {
                            m[e] = new Array(u);
                            for (let f = 0; f < u; f++) {
                                let _ = (e + 1) / u * n + p.x - a,
                                    y = (f + 1) / u * n + p.y - a;
                                g.setValue(_, y);
                                let b = Math.pow(t.radius + .01, 2);
                                g.distanceSq(t.center) > b ? m[e][f] = 1 : m[e][f] = 0
                            }
                        }
                        _ = !0
                    }
                })), _ && n && n.length > 0 && this.occupyPointsInCircles(t, n), fx.Utils.randomArray(t);
                let p = t.length;
                for (; p-- && (u = t[p], "full" == u.__grid);); - 1 == p && console.warn("randomPointInCircles: 已占满！请缩小radius或者减少数量！");
                let y, m, b = u.__min,
                    w = u.__max,
                    x = u.__grid,
                    v = x.length,
                    S = x[0].length,
                    E = v * S;
                for (; E--;) {
                    y = fx.Utils.getNumberRandomEx(b.x, w.x), m = fx.Utils.getNumberRandomEx(b.y, w.y);
                    let t = w.x - b.x,
                        e = Math.min(Math.floor((y - b.x) / t * v), v - 1),
                        n = Math.min(Math.floor((m - b.y) / t * S), S - 1);
                    if (0 == x[e][n]) {
                        x[e][n] = 1, y = (e + 1) / v * t + b.x - a, m = (n + 1) / S * t + b.y - a;
                        break
                    }
                }
                return -1 == E && (u.__grid = "full"), new e(y, m)
            }
            static occupyPointsInCircles(t, e) {
                let a, n = t.length;
                for (; n--;) {
                    a = t[n];
                    let u = a.__grid;
                    if (u && "full" != u) {
                        let t = a.__min,
                            n = a.__max,
                            f = u.length;
                        for (let g = e.length - 1; g >= 0; --g) {
                            let _ = e[g],
                                p = g,
                                y = a.radius * a.radius;
                            if (_.distanceSq(a.center) <= y) {
                                let a = n.x - t.x,
                                    g = Math.min(Math.floor((_.x - t.x) / a * f), f - 1),
                                    y = Math.min(Math.floor((_.y - t.y) / a * f), f - 1);
                                0 == u[g][y] && (u[g][y] = 1, e.splice(p, 1))
                            }
                        }
                    }
                    if (0 == e.length) break
                } - 1 == n && console.warn("occupyPointsInCircles 失败！不在范围内? 已占满? 没有创建格子?")
            }
            static calcBezierPoint2D(t, a) {
                t = Math.clamp(t, 0, 1);
                const factorial = function(t) {
                    return t <= 1 ? 1 : t * factorial(t - 1)
                };
                let n = new e,
                    u = a.length - 1;
                return a.forEach(((e, a) => {
                    a ? (n.x += factorial(u) / factorial(a) / factorial(u - a) * e.x * Math.pow(1 - t, u - a) * Math.pow(t, a), n.y += factorial(u) / factorial(a) / factorial(u - a) * e.y * Math.pow(1 - t, u - a) * Math.pow(t, a)) : (n.x += e.x * Math.pow(1 - t, u - a) * Math.pow(t, a), n.y += e.y * Math.pow(1 - t, u - a) * Math.pow(t, a))
                })), n
            }
            static union(t) {
                let e = [];
                for (const a of t) e.includes(a) || e.push(a);
                return e
            }
        }
        f.NotchScreenCfg = [{
            model: "PAAM00",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "PAAT00",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "PACM00",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "PACT00",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "CPH1831",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "CPH1833",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "PBCM10",
            notchTop: 80,
            notchBottom: 10
        }, {
            model: "V1732A",
            notchTop: 36,
            notchBottom: 10
        }, {
            model: "V1934A",
            notchTop: 46,
            notchBottom: 0
        }, {
            model: "V2047A",
            notchTop: 31,
            notchBottom: 0
        }, {
            model: "V2056A",
            notchTop: 36,
            notchBottom: 10
        }, {
            model: "VOG-AL10",
            notchTop: 36,
            notchBottom: 10
        }, {
            model: "SEA-AL10",
            notchTop: 30,
            notchBottom: 0
        }, {
            model: "PBEM00",
            notchTop: 30,
            notchBottom: 0
        }, {
            model: "iPhone X",
            notchTop: 44,
            notchBottom: 30
        }, {
            model: "iPhone 11",
            notchTop: 64,
            notchBottom: 30
        }, {
            model: "iPhone 12",
            notchTop: 64,
            notchBottom: 30
        }, {
            model: "iPhone 13",
            notchTop: 64,
            notchBottom: 30
        }, {
            model: "iPhone 14",
            notchTop: 64,
            notchBottom: 30
        }, {
            model: "iPhone 15",
            notchTop: 64,
            notchBottom: 30
        }, {
            model: "iPhone 15 Pro",
            notchTop: 54,
            notchBottom: 34
        }, {
            model: "iPhone 15 Pro Max",
            notchTop: 54,
            notchBottom: 34
        }, {
            model: "iPhone 16",
            notchTop: 54,
            notchBottom: 34
        }, {
            model: "iPhone 16 Pro",
            notchTop: 54,
            notchBottom: 34
        }, {
            model: "SPN-AL00",
            notchTop: 2,
            notchBottom: 2
        }, {
            model: "HUAWEI CET-AL00",
            notchTop: 38,
            notchBottom: 0
        }, {
            model: "HUAWEI ALT-AL10",
            notchTop: 38,
            notchBottom: 0
        }], f.profileMap = {}, f.lastClickTime = 0, 
        f.numberUnit = {
            3: "K",
            6: "M",
            9: "B",
            12: "T",
            15: "aa",
            18: "bb",
            21: "cc",
            24: "dd",
            27: "ee",
            30: "ff",
            33: "gg",
            36: "hh",
            39: "ii",
            42: "jj",
            45: "kk",
            48: "ll",
            51: "mm",
            54: "nn",
            57: "oo",
            60: "pp",
            63: "qq",
            66: "rr",
            69: "ss",
            72: "tt",
            75: "uu",
            78: "vv",
            81: "ww",
            84: "xx",
            87: "yy",
            90: "zz",
            93: "Aa",
            96: "Bb",
            99: "Cc",
            102: "Dd",
            105: "Ee",
            108: "Ff",
            111: "Gg",
            114: "Hh",
            117: "Ii",
            120: "Jj",
            123: "Kk",
            126: "Ll",
            129: "Mm",
            132: "Nn",
            135: "Oo",
            138: "Pp",
            141: "Qq",
            144: "Rr",
            147: "Ss",
            150: "Tt",
            153: "Uu",
            156: "Vv",
            159: "Ww",
            162: "Xx",
            165: "Yy",
            168: "Zz",
            171: "AA",
            174: "BB",
            177: "CC",
            180: "DD",
            183: "EE",
            186: "FF",
            189: "GG",
            192: "HH",
            195: "II",
            198: "JJ",
            201: "KK",
            204: "LL",
            207: "MM",
            210: "NN",
            213: "OO",
            216: "PP",
            219: "QQ",
            222: "RR",
            225: "SS",
            228: "TT",
            231: "UU",
            234: "VV",
            237: "WW",
            240: "XX",
            243: "YY",
            246: "ZZ"
        }, f.relativeDate = void 0, f.localLaunchDate = void 0;
        class g {
            constructor(t, e) {
                this.parallelCount = 0, this.actions = t || [], this.isRepeat = e, this.pActionIdx = 0, this._curTweens = []
            }
            get actions() {
                return this._actions
            }
            set actions(t) {
                this._actions = t
            }
            get isRepeat() {
                return this._isRepeat
            }
            set isRepeat(t) {
                this._isRepeat = t
            }
            get pActionIdx() {
                return this._pActionIdx
            }
            set pActionIdx(t) {
                this._pActionIdx = t
            }
            run(t) {
                if (this._curTweens = [], !this.actions || 0 === this.actions.length) return;
                if (this.pActionIdx >= this.actions.length) {
                    if (!this.isRepeat) return void(this._curTween = null);
                    this.pActionIdx = 0
                }
                let e = this.actions[this.pActionIdx];
                if (t) {
                    if (t.destroyed) return void(this._curTween = null);
                    e.target = t
                }
                let a = !0;
                if (e.parallels && e.parallels.length > 0) {
                    this._recoverProps = {}, a = !1, this.curParallels = e.parallels.concat(e);
                    for (const t of e.parallels) t.target = e.target, this._run(t, !1)
                }
                this._run(e, a)
            }
            _run(t, e = !0) {
                if (t && t.t && t.target && t.props && f.isNumber(t.duration)) {
                    if (!t.props.isRecover && e && (this._recoverProps = {}), t.recoverKeys)
                        for (const e of t.recoverKeys) this.addRecover(e, t.target[e]);
                    let a = this;
                    if ("update" == t.t) {
                        let e = {},
                            n = "";
                        for (const e in t.props) {
                            n = e;
                            break
                        }
                        t.target[n] = 0, t.init && t.init(t.target), e[n] = 1, e.update = new Laya.Handler(this, (() => {
                            t.update(t.target, t.target[n])
                        }));
                        let u = Laya.Tween.to(t.target, e, t.duration, t.ease, Laya.Handler.create(this, (t => {
                            this.removeCurTween(u);
                            let e = a.curParallels;
                            e && e.length > 0 ? (e.splice(e.indexOf(t), 1), 0 == e.length && a.runNext(t)) : a.runNext(t)
                        }), [t]), void 0, void 0, !1);
                        this._curTween = u, this._curTweens.push(this._curTween)
                    } else if ("delay" == t.t) {
                        t.target._fx_sequenceDelayTime = 0;
                        let e = t.props,
                            n = Laya.Tween.to(t.target, e, t.duration, t.ease, Laya.Handler.create(this, (t => {
                                this.removeCurTween(n);
                                let e = a.curParallels;
                                e && e.length > 0 ? (e.splice(e.indexOf(t), 1), 0 == e.length && a.runNext(t)) : a.runNext(t)
                            }), [t]), void 0, void 0, !1);
                        this._curTween = n, this._curTweens.push(this._curTween)
                    } else if ("to" === t.t) {
                        let e = t.props;
                        "function" == typeof e && (e = e(t.target));
                        let n = Laya.Tween.to(t.target, e, t.duration, t.ease, Laya.Handler.create(this, (function(...t) {
                            this.removeCurTween(n);
                            let [e] = t, u = a.curParallels;
                            u && u.length > 0 ? (u.splice(u.indexOf(e), 1), 0 == u.length && a.runNext(e)) : a.runNext(e)
                        }), [t]), t.delay, void 0, !1);
                        this._curTween = n, this._curTweens.push(this._curTween)
                    } else if ("from" === t.t) {
                        let e = t.props;
                        "function" == typeof e && (e = e(t.target));
                        let n = Laya.Tween.from(t.target, e, t.duration, t.ease, Laya.Handler.create(this, (function(...t) {
                            this.removeCurTween(n);
                            let [e] = t, u = a.curParallels;
                            u && u.length > 0 ? (u.splice(u.indexOf(e), 1), 0 == u.length && a.runNext(e)) : a.runNext(e)
                        }), [t]), t.delay, void 0, !1);
                        this._curTween = n, this._curTweens.push(this._curTween)
                    } else if ("set" == t.t) {
                        let e = t.props;
                        "function" == typeof e && (e = e(t.target));
                        for (const a in e) t.target[a] = e[a];
                        let n = a.curParallels;
                        n && n.length > 0 ? (n.splice(n.indexOf(t), 1), 0 == n.length && a.runNext(t)) : a.runNext(t)
                    } else if (t.props.exec) {
                        let e = t.props.exec;
                        if (e instanceof Laya.Handler) {
                            let a = e.once;
                            e.runWith(t.target), a && (t.props.exec = null)
                        } else e(t.target);
                        let n = a.curParallels;
                        n && n.length > 0 ? (n.splice(n.indexOf(t), 1), 0 == n.length && a.runNext(t)) : this.runNext(t)
                    }
                } else {
                    let e = this.curParallels;
                    e && e.length > 0 && (e.splice(e.indexOf(t), 1), 0 == e.length && this.runNext(t))
                }
            }
            runNext(t) {
                t && t.complete && t.complete.call(t.complete, t.completeCaller, t.completeArgs), this.pActionIdx = this.pActionIdx + 1;
                let e = t && t.target;
                this.run(e)
            }
            removeCurTween(t) {
                let e = this._curTweens.indexOf(t); - 1 != e && this._curTweens.splice(e, 1)
            }
            getCurTween() {
                return this._curTween
            }
            addRecover(t, e) {
                this._recoverProps[t] || (this._recoverProps[t] = e)
            }
            pushAction(t) {
                if (this.parallelCount > 0) {
                    this.parallelCount--;
                    let e = this.actions[this.actions.length - 1];
                    e && e.parallels ? e.parallels.push(t) : (t.parallels = [], this.actions.push(t))
                } else this.actions.push(t)
            }
            pause() {
                for (const t of this._curTweens) t.pause()
            }
            resume() {
                for (const t of this._curTweens) t.resume()
            }
            parallel(t) {
                return this.parallelCount = t, this
            }
            to(t, e, a) {
                let n = {
                    t: "to",
                    target: null,
                    props: t,
                    duration: e,
                    ease: a
                };
                return this.pushAction(n), this
            }
            delay(t) {
                let e = {
                    t: "delay",
                    target: null,
                    props: {
                        _fx_sequenceDelayTime: 1
                    },
                    duration: t
                };
                return this.pushAction(e), this
            }
            hide() {
                let t = {
                    t: "exec",
                    target: null,
                    props: {
                        exec: null
                    },
                    duration: 0,
                    recoverKeys: ["visible"]
                };
                return t.props.exec = t => {
                    t.visible = !1
                }, this.pushAction(t), this
            }
            show() {
                let t = {
                    t: "exec",
                    target: null,
                    props: {
                        exec: null
                    },
                    duration: 0,
                    recoverKeys: ["visible"]
                };
                return t.props.exec = t => {
                    t.visible = !0
                }, this.pushAction(t), this
            }
            setProp(t) {
                let e = {
                    t: "set",
                    target: null,
                    props: t,
                    duration: 0
                };
                return e.props.exec = t => {}, this.pushAction(e), this
            }
            recover() {
                let t = {
                    t: "exec",
                    target: null,
                    props: {
                        exec: null,
                        isRecover: !0
                    },
                    duration: 0
                };
                return t.props.exec = t => {
                    for (var e in this._recoverProps) this._recoverProps.hasOwnProperty(e) && (t[e] = this._recoverProps[e]);
                    this._recoverProps = {}
                }, this.pushAction(t), this
            }
            removeNode(t) {
                let e = {
                    t: "exec",
                    target: null,
                    props: {
                        exec: null
                    },
                    duration: 0
                };
                return e.props.exec = e => {
                    t ? e.destroy() : e.removeSelf()
                }, this.pushAction(e), this
            }
            scaleIn(t, e, a) {
                let n = {
                    t: "from",
                    target: null,
                    props: {
                        scaleX: t,
                        scaleY: t
                    },
                    duration: e,
                    recoverKeys: ["scaleX", "scaleY"],
                    ease: a
                };
                return this.pushAction(n), this
            }
            scaleOut(t, e, a) {
                let n = {
                    t: "to",
                    target: null,
                    props: {
                        scaleX: t,
                        scaleY: t
                    },
                    duration: e,
                    recoverKeys: ["scaleX", "scaleY"],
                    ease: a
                };
                return this.pushAction(n), this
            }
            scaleOut2(t, e, a, n) {
                let u = {
                    t: "to",
                    target: null,
                    props: {
                        scaleX: t,
                        scaleY: e
                    },
                    duration: a,
                    recoverKeys: ["scaleX", "scaleY"],
                    ease: n
                };
                return this.pushAction(u), this
            }
            up(t, e, a) {
                let n = {
                    t: "to",
                    target: null,
                    props: function(e) {
                        return {
                            y: e.y - t
                        }
                    },
                    duration: e,
                    recoverKeys: ["y"],
                    ease: a
                };
                return this.pushAction(n), this
            }
            down(t, e, a) {
                let n = {
                    t: "to",
                    target: null,
                    props: function(e) {
                        return {
                            y: e.y + t
                        }
                    },
                    duration: e,
                    recoverKeys: ["y"],
                    ease: a
                };
                return this.pushAction(n), this
            }
            fadeIn(t, e) {
                let a = {
                    t: "to",
                    target: null,
                    props: function(t) {
                        return t.alpha = 0, {
                            alpha: 1
                        }
                    },
                    duration: t,
                    recoverKeys: ["alpha"],
                    ease: e
                };
                return this.pushAction(a), this
            }
            fadeOut(t, e) {
                let a = {
                    t: "to",
                    target: null,
                    props: {
                        alpha: 0
                    },
                    duration: t,
                    recoverKeys: ["alpha"],
                    ease: e
                };
                return this.pushAction(a), this
            }
            fadeTo(t, e, a) {
                let n = {
                    t: "to",
                    target: null,
                    props: {
                        alpha: t
                    },
                    duration: e,
                    recoverKeys: ["alpha"],
                    ease: a
                };
                return this.pushAction(n), this
            }
            pos(t, e, a, n) {
                let u = {
                    t: "to",
                    target: null,
                    props: function(a) {
                        return a.centerX = a.centerY = void 0, a.left = a.right = a.top = a.bottom = void 0, {
                            x: t,
                            y: e
                        }
                    },
                    duration: a,
                    recoverKeys: ["x", "y", "centerX", "centerY", "left", "right", "top", "bottom"],
                    ease: n
                };
                return 0 == a && (u.t = "exec", u.recoverKeys = null, u.ease = null, u.props = {}, u.props.exec = a => {
                    a.centerX = a.centerY = void 0, a.left = a.right = a.top = a.bottom = void 0, a.pos(t, e)
                }), this.pushAction(u), this
            }
            follow(t, a, n = 4, u, f, g = 9999999999) {
                let _ = {
                    t: "to",
                    target: null,
                    props: function(f) {
                        f.centerX = f.centerY = void 0, f.left = f.right = f.top = f.bottom = void 0;
                        let g = new e,
                            _ = u ? u.x : 0,
                            p = u ? u.y : 0;
                        return {
                            update: new Laya.Handler(this, ((e, u) => {
                                g.x = t.x + _ - f.x, g.y = t.y + p - f.y;
                                let y = g.len();
                                y <= n ? e._duration = 0 : (g.normalize(Math.min(y, a * (.05 + u))), f.x += g.x, f.y += g.y)
                            }))
                        }
                    },
                    ease: f,
                    duration: g,
                    recoverKeys: ["x", "y", "centerX", "centerY", "left", "right", "top", "bottom"]
                };
                return this.pushAction(_), this
            }
            move(t, e, a, n) {
                let u = {
                    t: "to",
                    target: null,
                    props: function(a) {
                        return a.centerX = a.centerY = void 0, a.left = a.right = a.top = a.bottom = void 0, {
                            x: a.x + t,
                            y: a.y + e
                        }
                    },
                    duration: a,
                    recoverKeys: ["x", "y", "centerX", "centerY", "left", "right", "top", "bottom"],
                    ease: n
                };
                return this.pushAction(u), this
            }
            rotate(t, e, a) {
                let n = {
                    t: "to",
                    target: null,
                    props: {
                        rotation: t
                    },
                    duration: e,
                    recoverKeys: ["rotation"],
                    ease: a
                };
                return this.pushAction(n), this
            }
            exec(t) {
                let e = {
                    t: "exec",
                    target: null,
                    props: {
                        exec: t
                    },
                    duration: 0
                };
                return this.pushAction(e), this
            }
            circle(t, e, a, n) {
                let u = {
                    t: "to",
                    target: null,
                    props: function(t) {
                        let n = t.globalToLocal(e, !0);
                        return f.resetPivot(t, n.x, n.y), {
                            rotation: a
                        }
                    },
                    duration: t,
                    recoverKeys: ["rotation", "pivotX", "pivotY"],
                    ease: n
                };
                return this.pushAction(u), this
            }
            blink(t, e, a) {
                let n = {
                    t: "update",
                    target: null,
                    props: {
                        _fx_sequenceBlink: 1
                    },
                    ease: a,
                    duration: t,
                    update: (t, a) => {
                        if (a >= 1) return void(t.alpha = 1);
                        let n = 1 / e,
                            u = Math.floor(a / (n / 2)) % 2 == 1 ? 1 : 0;
                        t.alpha = u
                    }
                };
                return this.pushAction(n), this
            }
            color(t, e, a, n) {
                let u = fx.Utils.colorHexTo4F(e),
                    f = fx.Utils.colorHexTo4F(a),
                    g = {
                        t: "update",
                        target: null,
                        props: {
                            _fx_sequenceColor: 1
                        },
                        ease: n,
                        duration: t,
                        update: (t, e) => {
                            let a = u.x + (f.x - u.x) * e,
                                n = u.y + (f.y - u.y) * e,
                                g = u.z + (f.z - u.z) * e,
                                _ = fx.Utils.getHexColorStringF(a, n, g);
                            t.filterColor(_)
                        }
                    };
                return this.pushAction(g), this
            }
            jumpTo(t, a, n) {
                if (t.length <= 2) throw Error("must have 3 points");
                let u, g = {
                    t: "update",
                    target: null,
                    props: {
                        _fx_sequenceJumpTo: 1
                    },
                    ease: n,
                    duration: a,
                    init: t => {
                        u = new e(t.x, t.y)
                    },
                    update: (e, a) => {
                        let n = f.calcBezierPoint2D(a, t);
                        e.pos(n.x, n.y, !0)
                    }
                };
                return this.pushAction(g), this
            }
            moveToTarget(t, a, n, u) {
                let f, g = {
                    t: "update",
                    target: null,
                    props: {
                        _fx_sequenceMoveToTarget: 1
                    },
                    ease: u,
                    duration: a,
                    init: t => {
                        f = new e(t.x, t.y)
                    },
                    update: (e, a) => {
                        let u = new Laya.Point(t.x + n.x, t.y + n.y);
                        if (t.parent.localToGlobal(u), e.parent.globalToLocal(u), a >= 1) return void e.pos(u.x, u.y);
                        let g = f.x + (u.x - f.x) * a,
                            _ = f.y + (u.y - f.y) * a;
                        e.pos(g, _)
                    }
                };
                return this.pushAction(g), this
            }
            throwTo(t, e, a, n) {
                let u = (e.x - t.x) / a,
                    f = (e.y - t.y + .5 * n * u * u) / u,
                    g = {
                        t: "update",
                        target: null,
                        props: {
                            _fx_sequenceThrowTo: 1
                        },
                        duration: 1e3 * u,
                        update: (g, _) => {
                            let p, y;
                            p = t.x < e.x ? t.x + _ * u * a : t.x - _ * u * a, y = t.y + (f * (_ * u) - .5 * n * (_ * u) * (_ * u)), _ >= 1 && (p = e.x, y = e.y), g.pos(p, y)
                        }
                    };
                return this.pushAction(g), this
            }
            brightness(t, e, a, n) {
                let u = {
                    t: "update",
                    target: null,
                    props: {
                        _fx_sequenceBrightness: 1
                    },
                    ease: n,
                    duration: a,
                    update: (a, n) => {
                        let u = t + (e - t) * n,
                            f = new Laya.ColorFilter;
                        f.adjustColor(u, u, 0, 0), a.filters = [f]
                    }
                };
                return this.pushAction(u), this
            }
            bezierTo(t, e, a, n) {
                let u = {
                    t: "update",
                    target: null,
                    props: {
                        _fx_sequenceBezierTo: 1
                    },
                    duration: 1e3 * t,
                    update: (t, u) => {
                        let f = fx.Effect.getBezierPoint(u, e, a, n);
                        t.pos(f.x, f.y)
                    }
                };
                return this.pushAction(u), this
            }
        }
        var _, p, y;
        t.BTStatus = void 0, (_ = t.BTStatus || (t.BTStatus = {}))[_.SUCCESS = 1] = "SUCCESS", _[_.FAILURE = 2] = "FAILURE", _[_.RUNNING = 3] = "RUNNING", 
        t.EPolicy = void 0, (p = t.EPolicy || (t.EPolicy = {}))[p.RequireOne = 0] = "RequireOne", p[p.RequireAll = 1] = "RequireAll", 
        t.BTCategory = void 0, (y = t.BTCategory || (t.BTCategory = {})).COMPOSITE = "composite", y.DECORATOR = "decorator", y.ACTION = "action", y.CONDITION = "condition";
        const XBTDecorators = {},
            XBTComposites = {},
            XBTActions = {},
            XBTConditions = {};
        class XBTBaseNode {
            constructor({
                category: t = "",
                name: e = "",
                title: a = "",
                description: n = "",
                properties: u
            }) {
                this.id = f.createUUID(), 
                this.category = t, 
                this.name = e, 
                this.title = a || e, 
                this.description = n, 
                this.properties = u || {}
            }
            static register(name_, category_) {
                let n = this;
                switch (n.bt_category = category_, n.bt_name = name_, category_) {
                    case t.BTCategory.COMPOSITE:
                        XBTComposites[name_] = n;
                        break;
                    case t.BTCategory.DECORATOR:
                        XBTDecorators[name_] = n;
                        break;
                    case t.BTCategory.ACTION:
                        XBTActions[name_] = n;
                        break;
                    case t.BTCategory.CONDITION:
                        XBTConditions[name_] = n;
                        break;
                    default:
                        throw Error("not found node category !")
                }
            }
            _execute(e) {
                this._enter(e), e.blackboard.get("isOpen", e.tree.id, this.id) || this._open(e);
                let a = this._tick(e);
                return a !== t.BTStatus.RUNNING && this._close(e), this._exit(e), a
            }
            _enter(t) {
                t._enterNode(this), this.enter(t)
            }
            _open(t) {
                t._openNode(this), t.blackboard.set("isOpen", !0, t.tree.id, this.id), this.open(t)
            }
            _tick(t) {
                return t._tickNode(this), this.tick(t)
            }
            _close(t) {
                t._closeNode(this), t.blackboard.set("isOpen", !1, t.tree.id, this.id), this.close(t)
            }
            _exit(t) {
                t._exitNode(this), this.exit(t)
            }
            enter(t) {}
            open(t) {}
            tick(t) {
                throw Error("BTBaseNode tick not implement !")
            }
            close(t) {}
            exit(t) {}
            bindout(...t) {
                return this.out = t, this
            }
            output(t, e) {
                if (this.out)
                    for (const a of this.out) a.properties[t] = e
            }
            takeOut(t) {
                let e = this.properties[t];
                return this.properties[t] = void 0, e
            }
        }
        class XBTAction extends XBTBaseNode {
            constructor({
                name: e = "Action",
                title: a = "",
                properties: n
            }) {
                super({
                    category: t.BTCategory.ACTION,
                    name: e,
                    title: a,
                    properties: n
                })
            }
        }
        class XBTTick {
            constructor() {
                this.tree = null, this.debug = null, this.target = null, this.blackboard = null, this._openNodes = [], this._nodeCount = 0
            }
            _enterNode(t) {
                this._nodeCount++, this._openNodes.push(t)
            }
            _openNode(t) {}
            _tickNode(t) {}
            _closeNode(t) {
                this._openNodes.pop()
            }
            _exitNode(t) {}
        }
        class XBTDecorator extends XBTBaseNode {
            constructor({
                child: e = null,
                name: a = "Decorator",
                title: n = "",
                properties: u
            } = {}) {
                super({
                    category: t.BTCategory.DECORATOR,
                    name: a,
                    title: n,
                    properties: u
                }), this.child = e
            }
            add(t) {
                this.child = t
            }
        }
        class XBTComposite extends XBTBaseNode {
            constructor({
                children: e = [],
                name: a = "Composite",
                title: n = "",
                properties: u
            }) {
                super({
                    category: t.BTCategory.COMPOSITE,
                    name: a,
                    title: n,
                    properties: u
                }), this.children = e.slice(0)
            }
            add(t) {
                this.children.push(t)
            }
        }
        const k = "1.6.130";
        var B = Laya.Color,
            R = Laya.Dialog,
            z = Laya.EventDispatcher;
        const V = {
            E_APP_ON_PAUSE: "$ONPAUSE",
            E_APP_ON_RESUME: "$ONRESUME",
            E_PANEL_OPENCLOSE: "$PANEL_OPENCLOSE",
            E_SOUND_PLAY_OK: "$SOUND_PLAY_OK",
            E_UI_ADAPTED: "UI_ADAPTED",
            E_PROP_CHANGED: "$USER_PROP_CHANGED",
            E_PHYSICS_COLLISION: "PHYSICS_COLLISION_ENTER",
            E_PHYSICS_COLLISION_EXIT: "PHYSICS_COLLISION_EXIT",
            E_MATERIAL_LOADED: "MATERIAL_LOAD_COMPLETE",
            E_ANIM_STATE_CHENGED: "$ANIM_STATE_CHENGE",
            E_ANIM_EVENT: "$ANIM_EVENT_TRIGGER",
            E_SERVER_CFG_COMPLETE: "E_SERVER_CFG_COMPLETE",
            E_ON_USER_SAVED: "$E_ON_USER_SAVED",
            E_UI_RES_LOAD_START: "$E_UI_RES_LOAD_START",
            E_UI_RES_LOAD_COMPLETE: "$E_UI_RES_LOAD_COMPLETE"
        };
        var Z;
        t.BaseCode = void 0, (Z = t.BaseCode || (t.BaseCode = {}))[Z.PANEL_OPEN = 0] = "PANEL_OPEN", Z[Z.PANEL_CLOSE = 1] = "PANEL_CLOSE", Z[Z.VIEW_OPEN = 2] = "VIEW_OPEN", Z[Z.VIEW_CLOSE = 3] = "VIEW_CLOSE", Z[Z.SCENE_CHANGE = 4] = "SCENE_CHANGE", Z[Z.SOUND_MUSIC_PLAY_OK = 5] = "SOUND_MUSIC_PLAY_OK", Z[Z.SOUND_FX_PLAY_OK = 6] = "SOUND_FX_PLAY_OK", Z[Z.HTTP_INTERFACE_UNDEFINED = 7] = "HTTP_INTERFACE_UNDEFINED", Z[Z.E_ANIM_START = 8] = "E_ANIM_START", Z[Z.E_ANIM_STOP = 9] = "E_ANIM_STOP", Z[Z.E_ANIM_ABORT = 10] = "E_ANIM_ABORT";
        const $ = window.Physics;
        var J;
        t.Gender = void 0, (J = t.Gender || (t.Gender = {}))[J.Male = 0] = "Male", J[J.Female = 1] = "Female";
        var tt;
        t.PlatformType = void 0, (tt = t.PlatformType || (t.PlatformType = {})).PC = "pc", tt.WEB = "web", tt.WEIXIN = "wx", tt.BAIDU = "swan", tt.VIVO = "vivo", tt.TT = "toutiao", tt.MEIZU = "meizu", tt.OPPO = "oppo", tt.NATIVE_XIAOMI = "native_xiaomi", tt.NATIVE_TAPTAP = "native_taptap", tt.QQ = "qq", tt.QTT = "qtt", tt.FTNN = "4399", tt.FTNNBOX = "4399box", tt.NATIVE_ANDROID = "native_android", tt.NATIVE_IOS = "native_ios", tt.KUAISHOU = "kuaishou", tt.HUAWEI = "huawei", tt.UC = "uc", tt.NATIVE_233 = "native_233", tt.TTFF = "2345", tt.CHUANYIN = "chuanyin", tt.NATIVE_KXHZ = "native_kxhz", tt.NATIVE_MMY = "native_mmy", tt.NATIVE_VIVO = "native_vivo", tt.NATIVE_OPPO = "native_oppo", tt.NATIVE_XINGTU = "native_xingtu", tt.NATIVE_MEIZU = "native_meizu", tt.NATIVE_TOPON = "native_topon", tt.NATIVE_HUAWEI = "native_huawei", tt.NATIVE_4399 = "native_4399", tt.NATIVE_GP = "native_googleplay", tt.XIAOMI = "xiaomi", tt.ALIPAY = "alipay", tt.RONGYAO = "rongyao", tt.MINI360 = "mini360", tt.YOUGUBT = "ygbt", tt.MT = "meituan";
        class et {
            constructor(t, e) {
                this._width = t, this._height = e
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
        }
        class it {
            static init() {
                let t = Laya.Browser.now();
                Math.seedEx = function(e) {
                    t = e
                }, Math.randomEx = function() {
                    t = (9301 * t + 49297) % 233280;
                    let e = t / 233280;
                    return e = Math.floor(1e4 * e) / 1e4, e
                }, Math.clamp = function(t, e, a) {
                    if (e > a) {
                        let t = e;
                        e = a, a = t
                    }
                    return t > a ? a : t < e ? e : t
                }, Math.rad = function(t) {
                    return t * (Math.PI / 180)
                }, Math.deg = function(t) {
                    return t * (180 / Math.PI)
                }, Math.sign = function(t) {
                    return +(t > 0) - +(t < 0) || +t
                }, Math.lerp = function(t, e, a) {
                    return a = Math.clamp(a, 0, 1), Laya.MathUtil.lerp(t, e, a)
                }, Laya.Node.prototype.findChildByName = function(t) {
                    let e = t.split("/"),
                        a = this,
                        n = null;
                    for (const t of e) {
                        if (n = a.getChildByName(t), !n) return null;
                        a = n
                    }
                    return n
                }, Laya.Node.prototype.getChildBySubName = function(t) {
                    let e = this._children;
                    for (const a of e)
                        if (-1 != a.name.indexOf(t)) return a
                }, Laya.Node.prototype.seekChildByName = function(t) {
                    if (!t) return;
                    let e = this._children;
                    for (const a of e)
                        if (a.name == t) return a;
                    for (const a of e) {
                        let e = a.seekChildByName(t);
                        if (e) return e
                    }
                }, Laya.Node.prototype.seekChildBySubName = function(t) {
                    if (!t) return;
                    let e = this._children;
                    for (const a of e)
                        if (-1 != a.name.indexOf(t)) return a;
                    for (const a of e) {
                        let e = a.seekChildBySubName(t);
                        if (e) return e
                    }
                }, Laya.Node.prototype.seekChildrenByName = function(t) {
                    let e = [];
                    const anonymous = function(a) {
                        a.name == t && e.push(a);
                        let n = a.getChildren();
                        for (const t of n) anonymous(t)
                    };
                    let a = this.getChildren();
                    for (const t of a) anonymous(t);
                    return e
                }, Laya.Node.prototype.seekChildrenBySubName = function(t) {
                    let e = [];
                    const anonymous = function(a) {
                        -1 != a.name.indexOf(t) && e.push(a);
                        let n = a.getChildren();
                        for (const t of n) anonymous(t)
                    };
                    let a = this.getChildren();
                    for (const t of a) anonymous(t);
                    return e
                }, Laya.Node.prototype.getAllComponents = function() {
                    return this._components
                }, Laya.Node.prototype.destroyAllComponents = function() {
                    let t = this.getAllComponents();
                    for (let e = t.length - 1; e >= 0; e--) {
                        t[e].destroy()
                    }
                }, Laya.Node.prototype.getChildren = function() {
                    return this._children.concat()
                }, Laya.Node.prototype.getChildrenBySubName = function(t) {
                    let e = this._children,
                        a = [];
                    return e.forEach((e => {
                        -1 != e.name.indexOf(t) && a.push(e)
                    })), a
                }, Laya.Label.prototype.fitWidth = function(t = !0) {
                    let e = this,
                        a = e.text,
                        n = `${e.fontSize}px ${e.font}`,
                        u = Laya.Browser.measureText(a, n).width;
                    if (isNaN(e.width) || u <= e.width) return;
                    let f = t ? "..." : "";
                    for (; u > e.width;) a = a.substr(0, a.length - 1), u = Laya.Browser.measureText(a + f, n).width;
                    e.text = a + f
                }, Laya.Box.prototype.reverse = function(t) {
                    let e, a, n, u = this;
                    if (0 != u.numChildren) {
                        t ? (e = "x", n = "anchorX", a = "width") : (e = "y", n = "anchorY", a = "height");
                        for (let t = 0; t < u.numChildren; t++) {
                            let f = this._children[t];
                            f instanceof Laya.Component && (f[n] = 1 - (isNaN(f[n]) ? 0 : f[n])), f[e] = u[a] - f[e]
                        }
                    }
                }, Laya.Box.prototype.verticalLayout = function(t, e = !0, a = 0) {
                    if (0 == this.numChildren) return;
                    let n = this;
                    n.top = n.left = n.right = n.bottom = void 0;
                    let u = 0,
                        f = 0,
                        g = 0,
                        _ = ["centerX", "left", "right"][a];
                    this._children.forEach((e => {
                        let a = e,
                            n = e.layoutGap || 0;
                        a instanceof Laya.UIComponent && (a.top = a.bottom = a.centerY = void 0, a[_] = 0, a.anchorY = 0), a.y = f, g = f + a.displayHeight, f = g + t + n, u = Math.max(u, a.displayWidth)
                    })), n.size(u, g), e || n.reverse(!1)
                }, Laya.Box.prototype.horizontalLayout = function(t, e = !0, a = 0) {
                    if (0 == this.numChildren) return;
                    let n = this;
                    n.top = n.left = n.right = n.bottom = void 0;
                    let u = 0,
                        f = 0,
                        g = 0,
                        _ = ["centerY", "top", "bottom"][a];
                    this._children.forEach((e => {
                        let a = e.layoutGap || 0,
                            n = e;
                        n instanceof Laya.UIComponent && (n.left = n.right = n.centerX = void 0, n[_] = 0, n.anchorX = 0), n.x = f, u = f + n.displayWidth, f = u + t + a, g = Math.max(g, n.displayHeight)
                    })), n.size(u, g), e || n.reverse(!0)
                }, Laya.Box.prototype.tileLayout = function(t, e, a, n, u = !1) {
                    if (t < 1 || e < 1 || a.width < 0 || a.height < 0) return console.log("Invalid parameter"), !1;
                    if (0 == this.numChildren) return console.log("No Children"), !1;
                    if (this.numChildren > t * e) return console.log("row or col Not enough"), !1;
                    let f = this;
                    f.top = f.left = f.right = f.bottom = void 0, f.width = e * (n.width + 2 * a.width), f.height = t * (n.height + 2 * a.height);
                    for (let t = 0; t < this._children.length; ++t) {
                        let f = this._children[t];
                        f instanceof Laya.UIComponent && (f.left = f.right = f.top = f.bottom = void 0, f.anchorX = f.anchorY = .5), u && (f.width = n.width, f.height = n.height);
                        let g = t % e,
                            _ = Math.floor(t / e);
                        f.x = g * (f.width + 2 * a.width) + a.width + f.width / 2, f.y = _ * (f.height + 2 * a.height) + a.height + f.height / 2
                    }
                    return !0
                }, Laya.Sprite.prototype.onPressed = function(t, e, a, n = !0, u, f = 100) {
                    let g = this;

                    function onPressed(a) {
                        g.__pressed = !0, null != u ? u > 0 ? Laya.timer.loop(u, t, e, [a]) : Laya.timer.frameLoop(1, t, e, [a]) : e.call(t, [a])
                    }

                    function onMouseDown(t) {
                        Laya.timer.once(f, g, onPressed, [t])
                    }

                    function interupt() {
                        Laya.timer.clear(g, onPressed), Laya.timer.clear(t, e), g.__pressed && a && a.call(t)
                    }

                    function onMouseUp() {
                        interupt(), Laya.timer.callLater(g, (() => {
                            g.__pressed = !1
                        }))
                    }
                    g.__pressed = !1, g.on(Laya.Event.MOUSE_DOWN, g, onMouseDown), n && g.onMoved(g, interupt), g.on(Laya.Event.MOUSE_UP, g, onMouseUp), g.on(Laya.Event.MOUSE_OUT, g, onMouseUp), g.offPressed = function() {
                        Laya.timer.clear(g, onPressed), Laya.timer.clear(t, e), g.off(Laya.Event.MOUSE_DOWN, g, onMouseDown), g.off(Laya.Event.MOUSE_UP, g, onMouseUp), g.__pressed = !1
                    }
                }, Laya.Sprite.prototype.offPressed = function() {}, Laya.Sprite.prototype.isPressed = function() {
                    return this.__pressed
                }, Laya.Sprite.prototype.onMoved = function(t, e, a = 0, ...n) {
                    let u, f = this,
                        g = new Laya.Point,
                        _ = !1;

                    function onMouseDown(t) {
                        _ || (g.x = t.stageX, g.y = t.stageY, _ = !0, u = t.touchId)
                    }

                    function onMouseMove(f) {
                        _ && u == f.touchId && g.distance(f.stageX, f.stageY) > a && e.call(t, f, g, ...n)
                    }

                    function onMouseUp() {
                        _ = !1, u = null
                    }
                    f.on(Laya.Event.MOUSE_DOWN, f, onMouseDown), f.on(Laya.Event.MOUSE_MOVE, f, onMouseMove), f.on(Laya.Event.MOUSE_UP, f, onMouseUp), f.offMoved = function() {
                        f.off(Laya.Event.MOUSE_DOWN, f, onMouseDown), f.off(Laya.Event.MOUSE_MOVE, f, onMouseMove), f.off(Laya.Event.MOUSE_UP, f, onMouseUp)
                    }
                }, Laya.Sprite.prototype.offMoved = function() {}, Laya.Sprite.prototype.filterColor = function(t) {
                    let e = fx.Utils.colorHexTo4F(t),
                        a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
                    a[0] = e.x, a[6] = e.y, a[12] = e.z, a[18] = e.w, this.filters = [new Laya.ColorFilter(a)]
                }, Laya.Scene.prototype.showSomething = function() {
                    this.onPressed(this, (() => {
                        let t = "&#33879;&#20316;&#26435;&#24402;&#25104;&#37117;&#21019;&#19990;&#26041;&#33311;&#31185;&#25216;&#26377;&#38480;&#20844;&#21496;&#25152;&#26377;";
                        t = t.replace(/&#[0-9]+;/g, (t => String.fromCodePoint(parseInt(`${t.replace("&#","").replace(";","")}`))));
                        let e = new Laya.Text;
                        e.text = t, e.font = "Arial", e.color = "#ffffff", e.fontSize = 30, e.x = 300, e.y = 50, this.addChild(e)
                    }), null, !0, null, 1e4)
                }, Laya.Bone && (Laya.Bone.prototype.mount = function(t, e) {
                    let a = this,
                        n = this._sprite;
                    return e && (this._update = a.update, a.update = a.updateEx, this._hUpdate = e), n ? (n.addChild(t), !0) : (this._sprite = t, !1)
                }, Laya.Bone.prototype.updateEx = function(t) {
                    this._update(t), this._hUpdate.runWith(this)
                }, Laya.Bone.prototype.unmount = function(t) {
                    this._sprite == t && (this._sprite = null), t.removeSelf();
                    let e = this;
                    this._hUpdate && (this._sprite && 0 != this._sprite.numChildren || (e.update = this._update, this._hUpdate = null, this._update = null))
                }), Laya.EventDispatcher.prototype.offAllNot = function(t) {
                    let e = this._events;
                    if (!e) return this;
                    if (t && t.length > 0)
                        for (let a in e) - 1 == t.indexOf(a) && (this._recoverHandlers(e[a]), delete e[a]);
                    return this
                }, Laya.EventDispatcher.prototype.priorityReverse = function(t, e = 1) {
                    let a = this._events;
                    if (!a) return;
                    let n = a[t];
                    if (n && n.length && n.length > 1 && e > 0) {
                        e = Math.min(e, Math.floor(.5 * n.length));
                        let t = n.splice(n.length - e, e);
                        for (const e of t) n.unshift(e)
                    }
                }, Laya.EventDispatcher.prototype.onAndEvent = function(t, e, a, n, u) {
                    return this.on(t, e, a, n), this.event(t, u), this
                }, Laya.Dialog.prototype.open = function(t = !0, e = null, a = null) {
                    this._dealDragArea(), this._param = e, a ? (this._dialogManager = a, this._dialogManager.open(this, t, this.isShowEffect), this._dialogManager.lock(!1), this.on(Laya.Event.DESTORYED, Laya.stage, (() => {
                        a.destroy()
                    }))) : (Laya.Dialog.manager.open(this, t, this.isShowEffect), Laya.Dialog.manager.lock(!1))
                }, Laya.Dialog.prototype.close = function(t = null) {
                    this.closeType = t, (this._dialogManager || Laya.Dialog.manager).close(this)
                }, Laya.Script.prototype.getComponent = function(t) {
                    return this.owner.getComponent(t)
                };
                let findChildComponent = function(t, e) {
                        for (let a = 0; a < t.length; ++a) {
                            let n = t[a],
                                u = n.getComponent(e);
                            if (u) return u;
                            if (n._children && n._children.length > 0 && (u = findChildComponent(n._children, e), u)) return u
                        }
                        return null
                    },
                    findChildComponents = function(t, e, a) {
                        for (let n = 0; n < t.length; ++n) {
                            let u = t[n],
                                f = u.getComponents(e);
                            f && (a = a.concat(f)), u._children && u._children.length > 0 && (a = findChildComponents(u._children, e, a))
                        }
                        return a
                    };
                Laya.Script.prototype.getComponentInChildren = function(t) {
                    return findChildComponent(this.owner._children, t)
                }, Laya.Script.prototype.getComponentsInChildren = function(t) {
                    let e = this.owner.getComponents(t) || [];
                    return e = findChildComponents(this.owner._children, t, e), e
                }, Laya.Script.prototype.addComponent = function(t) {
                    return this.owner.addComponent(t)
                }, Laya.Node.prototype.getComponentInChildren = function(t) {
                    return findChildComponent(this._children, t)
                }, Laya.Node.prototype.getComponentsInChildren = function(t) {
                    let e = this.getComponents(t) || [];
                    return e = findChildComponents(this._children, t, e), e
                }, window.Laya3D ? fx.BaseExtend3D.init() : Laya.Size = et
            }
        }
        class st {
            constructor() {
                this.mData = {}
            }
            static get instance() {
                return this._instance || (this._instance = new st), this._instance
            }
            load(t) {
                let e = this;
                Laya.loader.load("json/list.txt", new Laya.Handler(this, (function(...a) {
                    if (!a.pop()) return void t.run();
                    let n = Laya.loader.getRes("json/list.txt").replace(/\r\n/g, "\n").split("\n");
                    n.pop();
                    let u = [];
                    if (n.forEach((t => {
                            var e = t.substr(t.indexOf("json")); - 1 == t.indexOf(".txt") && u.push(e.replace("\\", "/"))
                        })), !u.length) return void t.run();
                    let g = u[0];
                    1 == u.length && g.includes("bundle.json") ? Laya.loader.load(g, new Laya.Handler(this, (function(e) {
                        if (!e) throw new Error("load cfg json failed!");
                        for (const t in e) this.mData[t] = e[t];
                        t.run()
                    })), null, Laya.Loader.JSON) : Laya.loader.load(u, new Laya.Handler(this, (function(...a) {
                        a.pop() && (a.forEach((t => {
                            let a = f.pathInfo(t).filename,
                                n = Laya.loader.getRes(t);
                            n = e.parseBuf(n), this.mData[a] = JSON.parse(n)
                        })), t.run())
                    }), u), null, Laya.Loader.BUFFER)
                })))
            }
            get(t, e, a) {
                return null == this.mData[t] ? null : null == e && null == a ? this.mData[t] : null == this.mData[t][e] ? null : null == a ? this.mData[t][e] : this.mData[t][e][a]
            }
            getConstant(t) {
                return this.get("constant", t)
            }
            getStr(t) {
                return this.get("lang_ch", t)
            }
            parseBuf(t) {
                if ("string" != typeof t) {
                    var e = new Laya.Byte(t),
                        a = e.getCustomString(1);
                    if ("{" == a || "[" == a) e.pos = 0, t = e.getUTFBytes(e.length);
                    else {
                        const e = window.pako;
                        t = decodeURIComponent(e.inflate(t, {
                            to: "string"
                        }))
                    }
                }
                return t
            }
            loadJson(t, e) {
                t && Laya.loader.load(t, Laya.Handler.create(this, (a => {
                    let n = this.mData[t] = JSON.parse(this.parseBuf(a));
                    e && e.runWith(n)
                })), null, Laya.Loader.BUFFER)
            }
        }
        class at extends z {
            constructor() {
                super(), this.m_listenerMap = {}
            }
            static get I() {
                return this._instance || (this._instance = new at), this._instance
            }
            find(t, e, a) {
                for (let n = 0; n < a.length; n++) {
                    let u = a[n];
                    if (t == u.type && e == u.cb) return n
                }
                return -1
            }
            findAll(t, e) {
                let a = [];
                for (let n = 0; n < e.length; n++) {
                    t == e[n].type && a.push(n)
                }
                return a
            }
            on(t, e, a, n) {
                let u = super.on(t, e, a, n);
                e.$_GID || (e.$_GID = Laya.Utils.getGID());
                let f = this.m_listenerMap[e.$_GID];
                return f ? -1 == this.find(t, a, f) ? f.push({
                    type: t,
                    cb: a
                }) : console.log(!1, `${t} listener already added!!!`) : (f = new Array, f.push({
                    type: t,
                    cb: a
                }), this.m_listenerMap[e.$_GID] = f), u
            }
            once(t, e, a, n) {
                let u = super.once(t, e, a, n);
                e.$_GID || (e.$_GID = Laya.Utils.getGID());
                let f = this.m_listenerMap[e.$_GID];
                return f ? -1 == this.find(t, a, f) ? f.push({
                    type: t,
                    cb: a
                }) : console.log(!1, `${t} listener already added!!!`) : (f = new Array, f.push({
                    type: t,
                    cb: a
                }), this.m_listenerMap[e.$_GID] = f), u
            }
            off(t, e, a, n) {
                if (e.$_GID) {
                    let n = this.m_listenerMap[e.$_GID];
                    if (n) {
                        let e = this.find(t, a, n); - 1 != e && n.splice(e, 1)
                    }
                }
                return super.off(t, e, a, n)
            }
            offAllCaller(t) {
                let e = t.$_GID;
                if (e) {
                    let a = this.m_listenerMap[e];
                    if (a) {
                        for (let e of a) super.off(e.type, t, e.cb);
                        delete this.m_listenerMap[e]
                    }
                }
                return super.offAllCaller(t)
            }
            offAll(t) {
                if (t)
                    for (let e in this.m_listenerMap) {
                        let a = this.m_listenerMap[e],
                            n = this.findAll(t, a);
                        for (let t of n) a.splice(t, 1)
                    } else this.m_listenerMap = {};
                return super.offAll(t)
            }
            event(t, e) {
                return super.event(t, e)
            }
        }
        class nt extends Laya.EventDispatcher {
            constructor() {
                super()
            }
            static superFunc(t, e) {
                if (t instanceof nt) return Laya.EventDispatcher.prototype[e].bind(t);
                return f.super(t).prototype[e].bind(t)
            }
            hasListener(t) {
                return "$" == t.charAt(0) ? at.I.hasListener(t) : nt.superFunc(this, "hasListener")(t)
            }
            event(t, e) {
                return "$" == t.charAt(0) ? at.I.event(t, e) : nt.superFunc(this, "event")(t, e)
            }
            on(t, e, a, n) {
                return "$" == t.charAt(0) ? at.I.on(t, e, a, n) : nt.superFunc(this, "on")(t, e, a, n)
            }
            once(t, e, a, n) {
                return "$" == t.charAt(0) ? at.I.once(t, e, a, n) : nt.superFunc(this, "once")(t, e, a, n)
            }
            off(t, e, a, n) {
                return "$" == t.charAt(0) ? at.I.off(t, e, a, n) : nt.superFunc(this, "off")(t, e, a, n)
            }
            offAllCaller(t) {
                return at.I.offAllCaller(t), nt.superFunc(this, "offAllCaller")(t)
            }
            offAll(t) {
                return t ? "$" == t.charAt(0) ? at.I.offAll(t) : nt.superFunc(this, "offAll")(t) : this.offAllCaller(this)
            }
        }
        class rt extends Laya.Scene {
            constructor() {
                super(), this.once(Laya.Event.ADDED, this, this.addToStage), this.once(Laya.Event.REMOVED, this, this.removeFromStage), this.views = []
            }
            get curView() {
                return this._curView
            }
            set curView(t) {
                this._curView = t
            }
            createDialogManager(t) {
                let e = new Laya.DialogManager;
                return e.zOrder = 0, e.popupEffect = t => {
                    t.scale(1, 1), t._effectTween = Laya.Tween.from(t, {
                        x: Laya.stage.width / 2,
                        y: Laya.stage.height / 2,
                        scaleX: 0,
                        scaleY: 0
                    }, 300, Laya.Ease.backOut, Laya.Handler.create(e, e.doOpen, [t]), 0, !1, !1)
                }, e.closeEffect = t => {
                    t._effectTween = Laya.Tween.to(t, {
                        x: Laya.stage.width / 2,
                        y: Laya.stage.height / 2,
                        scaleX: 0,
                        scaleY: 0
                    }, 300, Laya.Ease.strongOut, Laya.Handler.create(e, e.doClose, [t]), 0, !1, !1)
                }, e.popupEffectHandler = new Laya.Handler(this, e.popupEffect), e.closeEffectHandler = new Laya.Handler(this, e.closeEffect), t instanceof Laya.Node ? t.addChild(e) : this.addChild(e), e
            }
            removeView(t) {
                if (t)
                    if (this._curView == t) {
                        if (this.views.length > 1) throw Error("please use SceneManager.popView instead !!!");
                        this.views.length = 0, this._curView = null
                    } else {
                        let e = this.views.indexOf(t); - 1 != e && this.views.splice(e, 1)
                    }
            }
            pushView(t) {
                if (t) {
                    -1 == this.views.indexOf(t) && (this.views.push(t), this.addChild(t), t.on(Laya.Event.REMOVED, this, this.removeView, [t]))
                }
                if (this.views.length > 1) {
                    this.lastView = this.views[this.views.length - 2]
                } else {
                    this.lastView = null
                }
            }
            popView() {
                let t = this.views.pop();
                if (t && t.removeSelf(), this.views.length > 1) {
                    this.lastView = this.views[this.views.length - 2]
                } else {
                    this.lastView = null
                }
            }
            closeView(t) {
                let e = this.views.indexOf(t);
                if (-1 != e && (this.views.splice(e, 1), t.removeSelf()), this.views.length > 1) {
                    this.lastView = this.views[this.views.length - 2]
                } else {
                    this.lastView = null
                }
            }
            static getRes(...t) {
                return null
            }
            enter(...t) {
                console.log(f.getClassName(this) + " enter!"), this.onEnter(...t)
            }
            exit() {
                console.log(f.getClassName(this) + " exit!"), this.onExit()
            }
            actived() {
                console.log(f.getClassName(this) + " actived!"), this.onActive()
            }
            deactived() {
                console.log(f.getClassName(this) + " deactived!"), this.onDeactive()
            }
            onAdd() {}
            onRemove() {}
            onEnter(...t) {}
            onExit() {}
            onActive() {}
            onDeactive() {}
            onStart() {}
            close(t) {
                this.closeType = t, super.close(t)
            }
            removeSelf() {
                if (!this.closeType) throw Error("BaseScene can not removeSelf, use SceneManager.changeScene instead!");
                return super.removeSelf()
            }
            addToStage() {
                this.size(Laya.stage.width, Laya.stage.height), this.onAdd(), this.onStart !== rt.prototype.onStart && Laya.startTimer.callLater(this, this.onStart)
            }
            removeFromStage() {
                this.offAll(), this.timer.clearAll(this), this.onRemove()
            }
            loadScene(t) {
                this.url = t, this.frameOnce(1, this, super.loadScene, [t])
            }
            getModuleRegName() {
                let t = f.getModule(this),
                    e = Laya.ClassUtils._classMap;
                for (const a in e)
                    if (e.hasOwnProperty(a) && e[a] == t) return a;
                return null
            }
            getModuleUrlName() {
                let t = "";
                if (this.url) {
                    let e = this.url.indexOf("/"); - 1 !== e && (t = this.url.substring(e + 1))
                }
                return t
            }
        }
        f.applyMixins(rt, [nt], Laya.Scene), Laya.ClassUtils.regClass("Scene", rt);
        class ot extends Laya.View {
            constructor(...t) {
                super(), this.lastPos = new e, this.lastStamp = 0, this._count = 0, this.$_GID = Laya.Utils.getGID(), this.isAdapt = !1, this.once(Laya.Event.ADDED, this, this.addToStage), this.once(Laya.Event.REMOVED, this, this.removeFromStage), this.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown), this.on(Laya.Event.CLICK, this, this.clicked)
            }
            createDialogManager() {
                let t = new Laya.DialogManager;
                return t.zOrder = 0, t.popupEffect = e => {
                    e.scale(1, 1), e._effectTween = Laya.Tween.from(e, {
                        x: Laya.stage.width / 2,
                        y: Laya.stage.height / 2,
                        scaleX: 0,
                        scaleY: 0
                    }, 300, Laya.Ease.backOut, Laya.Handler.create(t, t.doOpen, [e]), 0, !1, !1)
                }, t.closeEffect = e => {
                    e._effectTween = Laya.Tween.to(e, {
                        x: Laya.stage.width / 2,
                        y: Laya.stage.height / 2,
                        scaleX: 0,
                        scaleY: 0
                    }, 300, Laya.Ease.strongOut, Laya.Handler.create(t, t.doClose, [e]), 0, !1, !1)
                }, t.popupEffectHandler = new Laya.Handler(this, t.popupEffect), t.closeEffectHandler = new Laya.Handler(this, t.closeEffect), this.addChild(t), t
            }
            getGID() {
                return this.$_GID
            }
            isAdapted() {
                return this.isAdapt
            }
            static getRes(...t) {
                return null
            }
            enter(...t) {
                console.log(f.getClassName(this) + " enter!"), this.onEnter(...t)
            }
            exit() {
                console.log(f.getClassName(this) + " exit!"), this.onExit()
            }
            actived() {
                console.log(f.getClassName(this) + " actived!"), this.onActive()
            }
            deactived() {
                console.log(f.getClassName(this) + " deactived!"), this.onDeactive()
            }
            onAdd() {}
            onRemove() {}
            onEnter(...t) {}
            onExit() {}
            onActive() {}
            onDeactive() {}
            onStart() {}
            onMouseDown(t) {
                return this.mouseThrough
            }
            onClicked(t) {
                return this.mouseThrough
            }
            onLayout(t) {}
            getBgComp() {
                return this.getChildByName("img_bg")
            }
            disableAdapt() {
                this.isAdapt = null
            }
            mouseDown(t) {
                !1 === this.onMouseDown(t) && t.stopPropagation()
            }
            clicked(t) {
                !1 === this.onClicked(t) && t.stopPropagation()
            }
            adaptScreen(t) {
                if (null === this.isAdapt) return;
                if (this.isAdapt) return void this.onLayout();
                if ((t = t || this.getBaseViewParent(this.parent)) && 0 == t.isAdapted()) return void t.once(V.E_UI_ADAPTED, this, this.adaptScreen);
                this.isAdapt = !0, this.left = this.top = this.bottom = this.right = this.centerX = this.centerY = void 0;
                let e = Laya.stage.width,
                    a = Laya.stage.height;
                t && (e = t.width, a = t.height);
                let n = !1;
                this._width == e && this._height == a || (this.size(0, 0), this.pos(0, 0), this.width = e, this.height = a, n = !0);
                let u = this.getBgComp(),
                    g = f.isNotchScreenDevice();
                if (u && (u.x = u.y = u.anchorX = u.anchorY = 0, this.origSize ? u.size(this.origSize.width, this.origSize.height) : this.origSize = new Laya.Size(u.width, u.height), g ? (u.mouseEnabled = !0, f.adaptNode(u, Laya.stage.width, Laya.stage.height, !0)) : f.adaptNode(u, e, a, !0)), g) {
                    this.hitTestPrior = !1;
                    let f, _, p, y = g.notchTop,
                        m = 0;
                    Laya.stage.screenMode == Laya.Stage.SCREEN_VERTICAL ? (f = "y", _ = "centerY", p = "height", m = a) : (f = "x", _ = "centerX", p = "width", m = e), t && t.isAdapted() ? u && (g.exceed = .5 * Math.abs(m - u[p]), u.centerX = u.centerY = 0, u.centerX = u.centerY = void 0, u[f] = .5 * (Laya.stage[p] - u[p]) - y) : (this[f] += y, this[p] -= y + g.notchBottom, u && (g.exceed = .5 * Math.abs(m - u[p]), u.centerX = u.centerY = 0, u.centerX = u.centerY = void 0, u[f] = .5 * (Laya.stage[p] - u[p]) - y), n = !0)
                } else u && (u.centerX = 0, u.centerY = 0, u.centerX = u.centerY = void 0);
                this.event(V.E_UI_ADAPTED, this), n ? this.once(Laya.Event.RESIZE, this, this.onLayout, [g]) : this.onLayout(g)
            }
            getBaseViewParent(t) {
                return !t || t instanceof rt ? null : t instanceof ot ? t : this.getBaseViewParent(t.parent)
            }
            addToStage() {
                let t = this.getBgComp();
                t && t instanceof Laya.Image ? (t.left = t.right = t.top = t.bottom = t.centerX = t.centerY = void 0, t.source ? (!t.width && (t.width = t.source.width), !t.height && (t.height = t.source.height), this.adaptScreen()) : (t.width = t.height = void 0, t.once(Laya.Event.LOADED, this, this.adaptScreen))) : this.adaptScreen(), this.onAdd(), this.onStart !== ot.prototype.onStart && Laya.startTimer.callLater(this, this.onStart)
            }
            removeFromStage() {
                this.offAll(), this.timer.clearAll(this), this.onRemove()
            }
            removeSelf(t = !0) {
                if (Laya.ClassUtils.getClass("SceneManager").isInUIStack(this)) throw Error("already in ui stack, please use SceneManager to remove self !!!");
                return t ? this.destroy() : super.removeSelf(), this
            }
            loadScene(t) {
                this.url = t, this.frameOnce(1, this, super.loadScene, [t])
            }
            getModuleRegName() {
                let t = f.getModule(this),
                    e = Laya.ClassUtils._classMap;
                for (const a in e)
                    if (e.hasOwnProperty(a) && e[a] == t) return a;
                return null
            }
            getModuleUrlName() {
                let t = "";
                if (this.url) {
                    let e = this.url.indexOf("/"); - 1 !== e && (t = this.url.substring(e + 1))
                }
                return t
            }
        }
        f.applyMixins(ot, [nt], Laya.View), Laya.ClassUtils.regClass("View", ot);
        class lt extends Laya.Dialog {
            constructor(...t) {
                super(), this.lastPos = new e, this.lastStamp = 0, this._count = 0, this.$_GID = Laya.Utils.getGID(), this.once(Laya.Event.ADDED, this, this.addToStage), this.once(Laya.Event.REMOVED, this, this.removeFromStage), this.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown), this.on(Laya.Event.CLICK, this, this.clicked)
            }
            getGID() {
                return this.$_GID
            }
            static getRes(...t) {
                return null
            }
            refreshMaskLayer() {
                let t = Laya.Dialog.manager.maskLayer;
                t.graphics.clear(!0), null == this.bgColor ? t.graphics.drawRect(0, 0, t.width, t.height, UIConfig.popupBgColor) : t.graphics.drawRect(0, 0, t.width, t.height, this.bgColor), null == this.bgAlpha ? t.alpha = UIConfig.popupBgAlpha : t.alpha = this.bgAlpha, this.isModal && this.mouseThrough ? t.mouseEnabled = !1 : t.mouseEnabled = !0
            }
            actived() {
                this.refreshMaskLayer(), console.log(f.getClassName(this) + " actived!"), this.onActive()
            }
            deactived() {
                console.log(f.getClassName(this) + " deactived!"), this.onDeactive()
            }
            onAdd() {}
            onRemove() {}
            onEnter(...t) {}
            onExit() {}
            onActive(...t) {}
            onDeactive() {}
            onStart() {}
            onMouseDown(t) {
                return this.mouseThrough
            }
            onClicked(t) {
                return this.mouseThrough
            }
            onOpened(t) {
                this.onEnter(...t)
            }
            close(t) {
                if (!this.closeEffPlay)
                    if ("closeOnSide" == t) {
                        if (this.isModal) return;
                        let t = null == this.autoDestroyAtClosed || this.autoDestroyAtClosed;
                        Laya.ClassUtils.getClass("SceneManager").closePanel(this, {
                            autoDestroy: t
                        }), this.isShowEffect && null != this.closeEffect && (this.closeEffPlay = !0)
                    } else super.close(t)
            }
            onClosed() {
                this.closeEffPlay = !1, this.onExit()
            }
            mouseDown(t) {
                !1 === this.onMouseDown(t) && t.stopPropagation()
            }
            clicked(t) {
                !1 === this.onClicked(t) && t.stopPropagation()
            }
            removeSelf() {
                if ("closePanel" != this.closeType) throw new Error("BaseDialog can not removeSelf, use SceneManager.closePanel instead!");
                return super.removeSelf()
            }
            addToStage() {
                this.refreshMaskLayer(), this.onAdd(), this.onStart !== lt.prototype.onStart && Laya.startTimer.callLater(this, this.onStart)
            }
            removeFromStage() {
                this.offAll(), this.timer.clearAll(this), this.onRemove()
            }
            loadScene(t) {
                this.url = t, this.frameOnce(1, this, super.loadScene, [t])
            }
            getModuleRegName() {
                let t = f.getModule(this),
                    e = Laya.ClassUtils._classMap;
                for (const a in e)
                    if (e.hasOwnProperty(a) && e[a] == t) return a;
                return null
            }
            getModuleUrlName() {
                let t = "";
                if (this.url) {
                    let e = this.url.indexOf("/"); - 1 !== e && (t = this.url.substring(e + 1))
                }
                return t
            }
        }
        f.applyMixins(lt, [nt], Laya.Dialog), Laya.ClassUtils.regClass("Dialog", lt);
        class ht {
            constructor() {
                this.audioContexts = [], this.curAudioIndex = 0, this.refCount = 0
            }
        }
        class ct {
            constructor() {
                this.musicVolume = 1, this.init(), at.I.on(V.E_APP_ON_PAUSE, this, this.deactive), at.I.on(V.E_APP_ON_RESUME, this, this.active);
                let t = Laya.ClassUtils.getRegClass("Sdk");
                t && t.instance.onAudioInterruption(this.deactive.bind(this), this.active.bind(this)), this.soundCfg = st.instance.get("soundCfg");
                let e = {},
                    a = !1;
                for (const t in this.soundCfg) {
                    let n = this.soundCfg[t];
                    "string" == typeof n && (a = !0, e[t] = {
                        id: t,
                        content: n,
                        volume: 1,
                        interval: 0
                    })
                }
                a && (this.soundCfg = e), this.lastPlayTimes = {}
            }
            static get instance() {
                return this._instance || (this._instance = new ct), this._instance
            }
            getAudioPoolInst() {
                return Laya.Browser.onWeiXin ? window.wx : Laya.Browser.onHWMiniGame || Laya.Browser.onQGMiniGame || Laya.Browser.onVVMiniGame ? window.qg : window.my && window.my.createInnerAudioContext ? window.my : void 0
            }
            init(t = !0) {
                if (this.soundFxEnable = !0, this.musicEnable = !0, this.playing = !1, t) {
                    let t = Laya.LocalStorage.getItem("soundFxEnable"),
                        e = Laya.LocalStorage.getItem("musicEnable");
                    "false" == t && (this.soundFxEnable = !1), "false" == e && (this.musicEnable = !1)
                }
                this.saveLocal = t, this.getAudioPoolInst() && (this.defaultPool = new ht, this.defaultPool.useWebAudioImplement = !0, this.addInnerAudioContextCnt(10), this.bindContexts = {})
            }
            addInnerAudioContextCnt(t) {
                let e = this.defaultPool.audioContexts.length - 1,
                    a = this.getAudioPoolInst();
                for (let n = e; n < t; n++) this.defaultPool.audioContexts.push(a.createInnerAudioContext({
                    useWebAudioImplement: !0
                }))
            }
            canSaveLoacl(t) {
                this.saveLocal = t
            }
            createAudioContxtPool(t, e = !0) {
                let a = this.getAudioPoolInst();
                if (a) {
                    if (t <= 0) return;
                    t = Math.min(t, this.defaultPool.audioContexts.length);
                    let u = new ht;
                    u.useWebAudioImplement = e;
                    for (var n = 0; n < t; n++) e ? u.audioContexts.push(this.defaultPool.audioContexts.pop()) : u.audioContexts.push(a.createInnerAudioContext({
                        useWebAudioImplement: !1
                    }));
                    return u
                }
            }
            bindSoundCtx(t, e) {
                if (this.getAudioPoolInst()) {
                    this.bindContexts[t] && this.unbindSoundCtx(t), e.refCount++, this.bindContexts[t] = e
                }
            }
            bindSoundCtxById(t, e) {
                t && this.soundCfg && this.soundCfg[t] && this.bindSoundCtx(this.soundCfg[t].content, e)
            }
            unbindSoundCtx(t) {
                if (this.getAudioPoolInst()) {
                    let e = this.bindContexts[t];
                    if (e) {
                        if (e.refCount--, 0 == e.refCount)
                            for (let t of e.audioContexts) e.useWebAudioImplement ? this.defaultPool.audioContexts.push(t) : t.destroy();
                        delete this.bindContexts[t]
                    }
                }
            }
            unbindSoundCtxById(t) {
                t && this.soundCfg && this.soundCfg[t] && this.unbindSoundCtx(this.soundCfg[t].content)
            }
            unbindAll() {
                if (this.getAudioPoolInst())
                    for (let t in this.bindContexts) this.unbindSoundCtx(t)
            }
            playSound(t, e = 1, a = 0, n = 1, u = 0) {
                if (this.soundFxEnable && t) {
                    if (!this.checkInterval(t, u)) return;
                    n || (n = 1), a > 0 ? Laya.timer.once(a, this, this._playSound, [t, e, n]) : this._playSound(t, e, n)
                }
            }
            playSoundById(t, e = 1, a = 0, n, u) {
                if (t && this.soundCfg && this.soundCfg[t]) {
                    let f = this.soundCfg[t].content;
                    !n && (n = this.soundCfg[t].volume), !u && (u = this.soundCfg[t].interval), f && this.playSound(f, e, a, n, u)
                }
            }
            _playSound(t, e, a) {
                if (this.getAudioPoolInst()) {
                    let e = this.bindContexts[t];
                    e || (e = this.defaultPool);
                    let n = e.curAudioIndex;
                    e.curAudioIndex++;
                    let u = e.audioContexts;
                    n %= u.length;
                    let f = u[n],
                        g = Laya.loader.getRes(t);
                    if (g) {
                        let t = g.readyUrl;
                        Laya.MiniFileMgr.readFile(t, void 0, Laya.Handler.create(this, (function() {
                            f.src = t, f.play(), a < 1 && (f.volume = a)
                        })))
                    } else Laya.loader.load(t, new Laya.Handler(this, (t => {
                        if (!t || !t.readyUrl) return;
                        let e = t.readyUrl;
                        Laya.MiniFileMgr.readFile(e, void 0, Laya.Handler.create(this, (function() {
                            f.src = e, f.play(), a < 1 && (f.volume = a)
                        })))
                    })))
                } else Laya.SoundManager.playSound(t, e), a < 1 && Laya.SoundManager.setSoundVolume(a, t)
            }
            stopAll() {
                Laya.SoundManager.stopAll()
            }
            stopAllSound() {
                this.stopSoundFx()
            }
            stopSoundFx(t) {
                if (Laya.timer.clearAll(this), t ? Laya.SoundManager.stopSound(t) : Laya.SoundManager.stopAllSound(), this.getAudioPoolInst())
                    if (t) {
                        for (let e of this.defaultPool.audioContexts)
                            if (e.src == t) {
                                e.stop();
                                break
                            }
                    } else {
                        for (let t of this.defaultPool.audioContexts) t.stop();
                        this.defaultPool.curAudioIndex = 0
                    }
            }
            stopSoundById(t) {
                if (t && this.soundCfg) {
                    let e = this.soundCfg[t].content;
                    e && this.stopSoundFx(e)
                }
            }
            toggleSoundFx(t, e) {
                return this.soundFxEnable = !this.soundFxEnable, void 0 !== t && (this.soundFxEnable = !!t), this.soundFxEnable || this.stopSoundFx(), (e = void 0 !== e ? e : this.saveLocal) && Laya.LocalStorage.setItem("soundFxEnable", String(this.soundFxEnable)), this.soundFxEnable
            }
            getToggleSoundFxStatus() {
                return this.soundFxEnable
            }
            playMusic(t, e = 0, a) {
                this.musicEnable && t ? (this.musicLoop = e, this.resumeMusic(), a && (this.setMusicVolume(a), this.musicVolume = a), this.musicUrl != t ? (this.playing && this.stopMusic(), Laya.loader.clearRes(this.musicUrl), this.musicUrl = t, this.playing = !0, Laya.loader.load(t, Laya.Handler.create(this, this.onMusicLoaded))) : this.playing || (this.musicUrl = t, this.playing = !0, this.onMusicLoaded())) : t && (this.musicLoop = e, this.musicUrl = t)
            }
            playMusicById(t, e = 0, a) {
                if (t && this.soundCfg) {
                    let n = this.soundCfg[t].content;
                    n && (this.musicId = t, a || (a = this.soundCfg[t].volume), this.playMusic(n, e, a))
                }
            }
            getMusicId() {
                return this.musicId
            }
            onMusicLoaded() {
                this.playing && (console.log("SoundManager playMusic..."), Laya.SoundManager.playMusic(this.musicUrl, this.musicLoop, Laya.Handler.create(this, this.onMusicComplete)))
            }
            stopMusic() {
                console.log("SoundManager stopMusic..."), Laya.SoundManager.stopMusic(), this.playing = !1
            }
            pauseMusic() {
                console.log("SoundManager pauseMusic..."), this.pause || (Laya.SoundManager.musicMuted = !0, this.pause = !0)
            }
            resumeMusic() {
                console.log("SoundManager resumeMusic..."), this.pause && (Laya.SoundManager.musicMuted = !1, this.pause = !1)
            }
            toggleMusic(t) {
                return this.musicEnable = !this.musicEnable, void 0 !== t && (this.musicEnable = !!t), this.musicEnable ? this.playMusic(this.musicUrl, this.musicLoop) : this.stopMusic(), this.saveLocal && Laya.LocalStorage.setItem("musicEnable", String(this.musicEnable)), this.musicEnable
            }
            getToggleMusicStatus() {
                return this.musicEnable
            }
            toggleAll(t) {
                return this.toggleMusic(t), this.toggleSoundFx(t), this.musicEnable && this.soundFxEnable
            }
            isPlayingMusic() {
                return this.playing
            }
            setMusicVolume(t = 1) {
                t < 0 || t > 1 || (console.log("SoundManager setMusicVolume:", t), this.musicVolume = t, Laya.SoundManager.setMusicVolume(t))
            }
            setSoundFxVolume(t = 1, e) {
                t < 0 || t > 1 || Laya.SoundManager.setSoundVolume(t, e)
            }
            setSoundVolumeById(t, e = 1) {
                if (t && this.soundCfg) {
                    let a = this.soundCfg[t].content;
                    a && this.setSoundFxVolume(e, a)
                }
            }
            onSoundFxComplete(t) {}
            onMusicComplete() {
                at.I.event(V.E_SOUND_PLAY_OK, {
                    code: t.BaseCode.SOUND_MUSIC_PLAY_OK
                })
            }
            active() {
                console.log("SoundManager active..."), this.musicEnable && !this.pause && (Laya.SoundManager.musicMuted = !1)
            }
            deactive() {
                console.log("SoundManager deactive..."), this.musicEnable && !this.pause && (Laya.SoundManager.musicMuted = !0)
            }
            checkInterval(t, e) {
                if (!e || e < 0) return !0;
                let a = this.lastPlayTimes[t] || 0,
                    n = Date.now();
                return n - a > e && (this.lastPlayTimes[t] = n, !0)
            }
        }
        class ut {
            static toneLight(t, e) {
                let a = new Laya.ColorFilter;
                a.adjustBrightness(e), t.filters = [a]
            }
            static multiplyColor(t, e) {
                if (e) {
                    let a;
                    if (a = "string" == typeof e ? f.colorHexTo3F(e) : e, t.filters && t.filters.length > 0) {
                        let e = t.filters[0]._mat;
                        e[0] = a.x / 255, e[6] = a.y / 255, e[12] = a.z / 255
                    } else {
                        let e = [a.x / 255, 0, 0, 0, 0, 0, a.y / 255, 0, 0, 0, 0, 0, a.z / 255, 0, 0, 0, 0, 0, 1, 0],
                            n = new Laya.ColorFilter(e);
                        t.filters = [n]
                    }
                } else t.filters = void 0
            }
            static setColor(t, e) {
                if (e) {
                    let a, n;
                    a = "string" == typeof e ? e : f.getHexColorStringI(e.x, e.y, e.z), t.filters && t.filters.length > 0 ? n = t.filters[0] : (n = new Laya.ColorFilter, t.filters = [n]), n.setColor(a)
                } else t.filters = void 0
            }
            static setColorGrayRGB(t, e) {
                if (e) {
                    let a = f.getColorLumin3I(e),
                        n = new Laya.ColorFilter;
                    n.gray(), n.adjustBrightness(a), t.filters = [n]
                } else t.filters = void 0
            }
            static rotationHue(t) {
                let e = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
                    a = Math.cos(Math.rad(t)),
                    n = Math.sin(Math.rad(t));
                e[0] = a + (1 - a) / 3, e[1] = 1 / 3 * (1 - a) - Math.sqrt(1 / 3) * n, e[2] = 1 / 3 * (1 - a) + Math.sqrt(1 / 3) * n, e[5] = 1 / 3 * (1 - a) + Math.sqrt(1 / 3) * n, e[6] = a + 1 / 3 * (1 - a), e[7] = 1 / 3 * (1 - a) - Math.sqrt(1 / 3) * n, e[10] = 1 / 3 * (1 - a) - Math.sqrt(1 / 3) * n, e[11] = 1 / 3 * (1 - a) + Math.sqrt(1 / 3) * n, e[12] = a + 1 / 3 * (1 - a);
                let u = new Laya.ColorFilter;
                return u.setByMatrix(e), u
            }
            static glow(t, e, a = 0) {
                let n = new Laya.GlowFilter(e, 10, a, a);
                t.filters = [n]
            }
            static splashEff(t, e, a = !1, n = 100) {
                let u, f = t;
                f.__splashEff ? (u = f.__splashEff.o, Laya.Tween.clearTween(u), t.filters = void 0) : (u = {
                    factor: n
                }, f.__splashEff = {
                    o: u
                }), u.factor = n;
                let g = new Laya.Handler(this, (function() {
                        ut.toneLight(t, u.factor)
                    })),
                    anifunc = function() {
                        Laya.Tween.from(u, {
                            factor: 0,
                            update: g
                        }, e >> 1, null, Laya.Handler.create(this, (function() {
                            Laya.Tween.to(u, {
                                factor: 0,
                                update: g
                            }, e >> 1, null, Laya.Handler.create(this, (function() {
                                if (u.factor = n, a) return anifunc()
                            })))
                        })))
                    };
                t.once(Laya.Event.REMOVED, t, this.stopSplashEff), anifunc()
            }
            static stopSplashEff(t) {
                let e = t || this;
                if (e.__splashEff) {
                    t = e;
                    let a = e.__splashEff.o;
                    Laya.Tween.clearTween(a), t.filters = void 0, e.__splashEff = null
                }
            }
            static shake(t, e, a) {
                let n, u = t;
                u.__shakeEff ? (Laya.Tween.clear(u.__shakeEff.tween), n = u.__shakeEff.o, t.x = u.__shakeEff.o.x, t.y = u.__shakeEff.o.y) : (n = new Laya.Point(t.x, t.y), u.__shakeEff = {
                    o: n
                }), u.__shakeEff.tween = Laya.Tween.to(t, {
                    update: new Laya.Handler(this, (function() {
                        let e = -a + 2 * a * Math.random(),
                            u = -a + 2 * a * Math.random();
                        t.x = n.x + e, t.y = n.y + u
                    }))
                }, e, null, Laya.Handler.create(this, (function() {
                    t.x = n.x, t.y = n.y, u.__shakeEff = null
                }))), t.once(Laya.Event.REMOVED, this, this.stopShake, [t])
            }
            static stopShake(t) {
                let e, a = t;
                a.__shakeEff && (Laya.Tween.clear(a.__shakeEff.tween), e = a.__shakeEff.o, t.x = a.__shakeEff.o.x, t.y = a.__shakeEff.o.y, a.__shakeEff = null)
            }
            static breathEff(t, e, a, n = !0) {
                let u, f = t;
                f.__breathEff ? (Laya.Tween.clear(f.__breathEff.tween), u = f.__breathEff.o, t.scaleX = f.__breathEff.o.x, t.scaleY = f.__breathEff.o.y) : (u = new Laya.Point(t.scaleX, t.scaleY), f.__breathEff = {
                    o: u
                });
                let anifunc = function() {
                    f.__breathEff.tween = Laya.Tween.to(t, {
                        scaleX: a * u.x,
                        scaleY: a * u.y
                    }, e >> 1, null, Laya.Handler.create(this, (function() {
                        f.__breathEff.tween = Laya.Tween.to(t, {
                            scaleX: u.x,
                            scaleY: u.y
                        }, e >> 1, null, Laya.Handler.create(this, (function() {
                            n ? anifunc() : ut.stopBreathEff(f)
                        })))
                    })))
                };
                anifunc(), t.once(Laya.Event.REMOVED, this, this.stopBreathEff, [f])
            }
            static stopBreathEff(t) {
                let e = t;
                e.__breathEff && (Laya.Tween.clear(e.__breathEff.tween), t.scaleX = e.__breathEff.o.x, t.scaleY = e.__breathEff.o.y, e.__breathEff = null)
            }
            static cd(t, e, a, n, u) {
                let g = t,
                    _ = t.width >> 1,
                    p = t.height >> 1;
                u = u || Math.max(_, p);
                let y = -90,
                    m = 270;
                if (g.__cdEff) {
                    Laya.Tween.clear(g.__cdEff.tween), g.__cdEff.o.graphics.drawPie(_, p, _, y, m, "#000000"), g.__cdEff.angle = y
                } else {
                    let e = new Laya.Sprite;
                    e.setSelfBounds(new Laya.Rectangle(0, 0, t.width, t.height)), e.alpha = .8, n ? t.mask = e : t.addChild(e), e.graphics.drawPie(_, p, u, y, m, "#000000"), g.__cdEff = {
                        o: e,
                        angle: y
                    }
                }
                return g.__cdEff.tween = Laya.Tween.to(g.__cdEff, {
                    angle: m,
                    update: new Laya.Handler(this, (function() {
                        let t = g.__cdEff.o,
                            e = g.__cdEff.angle;
                        0 == f.equal(e, y, 1) && (y = e, t.graphics.clear(), t.graphics.drawPie(_, p, u, e, m, "#000000"))
                    }))
                }, e, null, Laya.Handler.create(this, (function() {
                    g.__cdEff.o.destroy(), n && (t.mask = null), g.__cdEff = null, a && a.run()
                }))), t.once(Laya.Event.REMOVED, this, this.stopCDEff, [t]), g.__cdEff.tween
            }
            static getCDEffTween(t) {
                if (t.__cdEff) return t.__cdEff.tween
            }
            static stopCDEff(t) {
                if (t.__cdEff) {
                    Laya.Tween.clear(t.__cdEff.tween), t.__cdEff.o.destroy(), t.mask = null, t.__cdEff = null
                }
            }
            static splashScreen(t, e, a = 1, n) {
                let u, f = Laya.stage;
                f.__splashScreenEff ? (Laya.Tween.clear(f.__splashScreenEff.tween), u = f.__splashScreenEff.o) : (u = new Laya.Sprite, u.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, t), Laya.stage.addChild(u), f.__splashScreenEff = {
                    o: u
                }), u.alpha = 0, f.__splashScreenEff.tween = Laya.Tween.to(u, {
                    alpha: a
                }, e >> 1, null, Laya.Handler.create(this, (() => {
                    n && n.run(), f.__splashScreenEff.tween = Laya.Tween.to(u, {
                        alpha: 0
                    }, e >> 1, null, Laya.Handler.create(this, (() => {
                        u.removeSelf(), f.__splashScreenEff = null
                    })))
                })))
            }
            static shadeScreen(t, e, a = 1, n) {
                let u, f = Laya.stage;
                f.__splashScreenEff ? (Laya.Tween.clear(f.__splashScreenEff.tween), u = f.__splashScreenEff.o) : (u = new Laya.Sprite, u.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, t), Laya.stage.addChild(u), f.__splashScreenEff = {
                    o: u
                }), u.alpha = 0, f.__splashScreenEff.tween = Laya.Tween.to(u, {
                    alpha: a
                }, e >> 1, null, Laya.Handler.create(this, (() => {
                    u.destroy(), f.__splashScreenEff = null, n && n.run()
                })))
            }
            static shadeUIComponet(t, e, a) {
                e = e || "#ffffffff";
                let n = !1;
                if (t.name && a && -1 !== a.indexOf(t.name) && (n = !0), !n && (t instanceof Laya.Image || t instanceof Laya.Sprite || t instanceof Laya.Label)) {
                    let a = parseInt(e.substring(1, 3), 16) / 255,
                        n = parseInt(e.substring(3, 5), 16) / 255,
                        u = parseInt(e.substring(5, 7), 16) / 255,
                        f = parseInt(e.substring(7), 16) / 255;
                    t.filters = [new Laya.ColorFilter([a, 0, 0, 0, 0, 0, n, 0, 0, 0, 0, 0, u, 0, 0, 0, 0, 0, f, 0])]
                }
                for (let n = 0; n < t.numChildren; ++n) ut.shadeUIComponet(t.getChildAt(n), e, a)
            }
            static ghostEff(t, e, a) {}
            static jellyQEff(t, e, a = 1) {
                let n = 10 * a || 10,
                    u = {
                        scx: t.scaleX,
                        scy: t.scaleY
                    },
                    f = t;
                if (f._jellyQEff) {
                    if (!f._jellyQEff.complete) return;
                    f._jellyQEff.curTime = 0, f._jellyQEff.complete = !1
                } else f._jellyQEff = {
                    tween: null,
                    curTime: 0,
                    complete: !1
                };
                let g = new Laya.Handler(this, (function() {
                    let e = f._jellyQEff.curTime,
                        a = .1 * Math.exp(-.04 * e) * Math.cos(Math.PI / n * e);
                    f._jellyQEff.curTime += Math.PI / (n / 2), t.scaleX = u.scx + a, t.scaleY = u.scy + a
                }));
                Laya.Tween.to(f, {
                    update: g
                }, 300, null, Laya.Handler.create(this, (() => {
                    t.scaleX = u.scx, t.scaleY = u.scy, f._jellyQEff.complete = !0, e && e.run()
                }), [f]))
            }
            static btnScaleEff(t, e = {
                x: .88,
                y: .88
            }) {
                let a = t;
                if (a.__btnScaleEff) return;
                let n = {
                    scx: t.scaleX,
                    scy: t.scaleY,
                    fixed: !1
                };
                a.__btnScaleEff = n, t.on(Laya.Event.MOUSE_DOWN, this, (a => {
                    if (t instanceof Laya.UIComponent && (t.anchorX > 0 || t.anchorY > 0) && (t.left = t.right = t.bottom = t.top = void 0), !t.hitArea && (e.x < n.scx || e.y < n.scy)) {
                        n.fixed = !0;
                        let a = t.width + 2 * (1 - e.x) * t.width,
                            u = t.height + 2 * (1 - e.y) * t.height;
                        t.hitArea = new Laya.Rectangle((e.x - n.scx) * t.width, (e.y - n.scy) * t.height, a, u)
                    }
                    t.scale(n.scx * e.x, n.scy * e.y)
                })), t.on(Laya.Event.MOUSE_OUT, this, (e => {
                    t.scale(n.scx, n.scy), n.fixed && (t.hitArea = null)
                })), t.on(Laya.Event.MOUSE_UP, this, (e => {
                    t.scale(n.scx, n.scy), n.fixed && (t.hitArea = null)
                }))
            }
            static jumpEff(t, e = 7, a = 1e3, n = !0) {
                let u = {
                        ox: t.x,
                        oy: t.y
                    },
                    f = t;
                f._eff ? Laya.Tween.clear(f._eff.tween) : (f._eff = {}, f._eff.tween = new Laya.Tween);
                let effFun = function() {
                    f._eff.tween.to(t, {
                        y: u.oy + e
                    }, 500, null, Laya.Handler.create(this, (() => {
                        f._eff.tween.to(t, {
                            y: u.oy
                        }, 500, null, Laya.Handler.create(this, (() => {
                            n && (effFun(), t.y = u.oy)
                        })))
                    })))
                };
                effFun()
            }
            static scaleEff(t, e, a) {
                let n = {
                        ox: t.scaleX,
                        oy: t.scaleY
                    },
                    u = t;
                u.__scaleEff ? (Laya.Tween.clear(u.__scaleEff.tween), n.ox = u.__scaleEff.ox, n.oy = u.__scaleEff.oy, t.scaleX = n.ox, t.scaleY = n.oy) : u.__scaleEff = n, u.__scaleEff.tween = Laya.Tween.to(t, {
                    scaleX: n.ox + e,
                    scaleY: n.oy + e
                }, a >> 1, null, Laya.Handler.create(this, (() => {
                    Laya.Tween.to(t, {
                        scaleX: n.ox,
                        scaleY: n.oy
                    }, a >> 1, null, Laya.Handler.create(this, (() => {
                        u.__scaleEff = null
                    })))
                })))
            }
            static jetEff(t, e = !0, a, n = 0, u = 8) {
                let g = new Laya.Box,
                    _ = Math.PI / 40;
                for (let e = 0; e < u; ++e) {
                    let a = new Laya.Image;
                    a.skin = t, a.name = "img" + e, g.addChild(a);
                    let n = 100 * e,
                        u = 150;
                    e % 2 == 0 ? Laya.timer.once(n, null, (function(t) {
                        let e = t,
                            a = .1 * f.getIntRandom(0, 2) * u;
                        e._eff = {
                            curX: 0,
                            a: u + a * (0 == f.getIntRandom(0, 1) ? -1 : 1),
                            x: 0,
                            xdelta: f.getIntRandom(0, 3)
                        };
                        let n = new Laya.Handler(this, (function(t) {
                            let e = t._eff.a,
                                a = t._eff.curX,
                                n = -e * Math.sin(a);
                            t.x = t._eff.x, t.y = n, t._eff.curX = a + _, t._eff.x += t._eff.xdelta
                        }), [e]);
                        Laya.Tween.to(t, {
                            update: n
                        }, 40 * 16.67)
                    }), [a]) : Laya.timer.once(n, null, (function(t) {
                        let e = t,
                            a = .01 * f.getIntRandom(0, 2) * u;
                        e._eff = {
                            curX: 0,
                            a: u + a * (0 == f.getIntRandom(0, 1) ? -1 : 1),
                            x: 0,
                            xdelta: f.getIntRandom(0, 3)
                        };
                        let n = new Laya.Handler(this, (function(t) {
                            let e = t._eff.a,
                                a = t._eff.curX,
                                n = -e * Math.sin(-a);
                            t.x = t._eff.x, t.y = n, t._eff.curX = a - _, t._eff.x -= t._eff.xdelta
                        }), [e]);
                        Laya.Tween.to(t, {
                            update: n
                        }, 40 * 16.67)
                    }), [a])
                }
                return Laya.timer.once(700 + 40 * 16.67, null, (function(t) {
                    Laya.Tween.to(t, {
                        alpha: n
                    }, 300, null, Laya.Handler.create(null, (function(t) {
                        e && t.removeSelf(), a && a.run()
                    }), [t]))
                }), [g]), g
            }
            static scale_up_fade(t, e, a = 2, n = 200, u = 300, f = 50, _ = 1, p = 500, y = 0, m = 500) {
                return a *= t.scaleX, _ *= t.scaleX, (new g).scaleIn(a, n).delay(u).parallel(2).up(f, p).scaleOut(_, p).delay(y).fadeOut(m).delay(m).recover().exec(e).run(t)
            }
            static up_fade(t, e, a = 50, n = 500) {
                return (new g).up(a, n).fadeOut(n).delay(n).recover().exec(e).run(t)
            }
            static move_fade(t, e, a, n = 500) {
                return (new g).parallel(2).move(e.x, e.y, n).fadeOut(n).delay(n).recover().exec(a).run(t)
            }
            static fade_InOut(t, e, a = 1, n = 0, u) {
                let f = t;
                f.__fadeInOutEff ? Laya.Tween.clear(f.__fadeInOutEff.tween) : f.__fadeInOutEff = {
                    alpha: t.alpha
                };
                let anifunc = function() {
                    f.__fadeInOutEff.tween = Laya.Tween.to(t, {
                        alpha: n
                    }, e >> 1, null, Laya.Handler.create(this, (() => {
                        f.__fadeInOutEff.tween = Laya.Tween.to(t, {
                            alpha: a
                        }, e >> 1, null, Laya.Handler.create(this, (() => {
                            u ? anifunc() : this.stopFadeInOutEff(t)
                        })))
                    })))
                };
                anifunc(), t.once(Laya.Event.REMOVED, this, this.stopFadeInOutEff, [t])
            }
            static stopFadeInOutEff(t) {
                let e = t;
                e.__fadeInOutEff && (t.alpha = e.__fadeInOutEff.alpha, Laya.Tween.clear(e.__fadeInOutEff.tween), e.__fadeInOutEff = null, t.off(Laya.Event.REMOVED, this, this.stopFadeInOutEff))
            }
            static splashColor(t, e, a = -1, n = "#000000", u = "#ffffff", f) {
                let g, _ = t;
                _.__splashColor ? (g = _.__splashColor.o, g.clearAll(t), t.filters = void 0) : (g = new Laya.Timer, _.__splashColor = {
                    o: g,
                    c: t.filters
                });
                let anifunc = function() {
                    g.once(e >> 1, t, (() => {
                        t.color = u, g.once(e >> 1, t, (() => {
                            t.color = n, -1 == a ? anifunc() : (a -= 1) <= 0 ? (ut.stopSplashColor(t), f && f()) : anifunc()
                        }))
                    }))
                };
                t.once(Laya.Event.REMOVED, t, this.stopSplashColor), t.color = n, anifunc()
            }
            static stopSplashColor(t) {
                let e = t || this;
                if (e.__splashColor) {
                    let a = e.__splashColor.o;
                    a && a.clearAll(t), t.filters = e.__splashColor.c, e.__splashColor = null
                }
            }
            static getPropEffect(t, e, a, n) {
                Laya.MouseManager.enabled = !1;
                let u = "res/sound/gold_action_start",
                    g = "res/sound/gold_action_end",
                    _ = Laya.ClassUtils.getRegClass("Sdk"),
                    p = _.isOnNativeAndroid(),
                    y = _.isOnNativeIos();
                p || y ? (u += ".wav", g += ".wav") : (u += ".mp3", g += ".mp3");
                let m, b, w, x, v = [{
                    x: -300,
                    y: -150
                }, {
                    x: 0,
                    y: -150
                }, {
                    x: 300,
                    y: -150
                }];
                n && n.iconCtrl && (m = n.iconCtrl.scaleX, b = n.iconCtrl.scaleY), t instanceof Laya.Sprite ? w = t.localToGlobal(new Laya.Point(t.width / 2, t.height / 2)) : t instanceof Laya.Point && (w = t), e instanceof Laya.Sprite ? x = e.localToGlobal(new Laya.Point(e.width / 2, e.height / 2)) : e instanceof Laya.Point && (x = e);
                let S = [];
                for (let t = 0; t < 3; t++)
                    for (let e = 0; e < 15; e++) {
                        let a = Laya.Pool.getItemByClass("goldImage", Laya.Image);
                        a.source = Laya.loader.getRes("res/img_coins.png"), a.anchorX = a.anchorY = .5, a.size(70, 70), a.pos(w.x, w.y, !0), a.zOrder = 1e3, Laya.stage.addChild(a);
                        let n = {
                                x: v[t].x + f.getIntRandom(-150, 150),
                                y: v[t].y + f.getIntRandom(-50, 50)
                            },
                            u = {
                                image: a,
                                counts: 0,
                                point: [w, new Laya.Point(w.x + n.x, w.y + n.y), x],
                                runSign: !1
                            };
                        S.push(u), Laya.timer.once(15 * e, this, (function(t) {
                            S[t].runSign = !0
                        }), [15 * t + e])
                    }
                ct.instance.playSound(u);
                let playSound = function() {
                    ct.instance.playSound(u)
                };
                Laya.timer.loop(50, Laya.stage, playSound), Laya.timer.once(200, Laya.stage, (function() {
                    Laya.timer.clear(Laya.stage, playSound)
                }));
                let updataFuc = function(t) {
                    for (let e = 0; e < S.length; e++) {
                        const u = S[e];
                        if (u && u.runSign) {
                            let _ = t * u.counts,
                                p = ut.getBezierPoint(_, u.point[0], u.point[1], u.point[2]);
                            if (u.image.pos(p.x, p.y), _ >= 1) {
                                if (u.image.removeSelf(), Laya.Pool.recover("goldImage", u.image), S[e] = void 0, e == S.length - 1) Laya.timer.clear(Laya.stage, updataFuc), n && n.iconCtrl ? Laya.timer.once(150, this, (function(t) {
                                    n.iconCtrl && (Laya.Tween.clearAll(n.iconCtrl), Laya.Tween.to(n.iconCtrl, {
                                        scaleX: m,
                                        scaleY: b
                                    }, 100, null, Laya.Handler.create(this, (function(t) {
                                        t && t.run(), Laya.timer.once(100, this, (function() {
                                            Laya.MouseManager.enabled = !0
                                        }))
                                    }), [t])))
                                }), [a]) : (a && a.run(), Laya.timer.once(100, this, (function() {
                                    Laya.MouseManager.enabled = !0
                                })));
                                else if (0 == e && (ct.instance.playSound(g), n && n.iconCtrl && (n.iconCtrl.anchorX = n.iconCtrl.anchorY = .5, ut.propQEffect(n.iconCtrl)), n && n.callbackFirst && n.callbackFirst.run(), n && n.coinsLabelCtrl && n.addCoinsNum)) {
                                    let t = Number(n.coinsLabelCtrl.text);
                                    if (n.isScienceount) {
                                        if (!n.ownCoinsNum) return;
                                        t = n.ownCoinsNum
                                    }
                                    t = t > 0 ? t : 0;
                                    for (let e = 0; e < 10; e++) {
                                        let a = (e + 1) * (n.addCoinsNum / 10) + t;
                                        Laya.timer.once(25 * e, this, (t => {
                                            n.isScienceount ? n.coinsLabelCtrl.text = f.formatNumberWithUnits(Math.floor(t)) + "" : n.coinsLabelCtrl.text = Math.floor(t) + ""
                                        }), [a])
                                    }
                                }
                            } else S[e].counts += 70
                        }
                    }
                };
                Laya.timer.frameLoop(1, Laya.stage, updataFuc, [3e-4])
            }
            static getPropEffectEx(t, e, a, n) {
                Laya.MouseManager.enabled = !1;
                let u, g, _, p, y = [{
                    x: -300,
                    y: -150
                }, {
                    x: 0,
                    y: -150
                }, {
                    x: 300,
                    y: -150
                }];
                n && n.iconCtrl && (u = n.iconCtrl.scaleX, g = n.iconCtrl.scaleY), t instanceof Laya.Sprite ? _ = t.localToGlobal(new Laya.Point(t.width / 2, t.height / 2)) : t instanceof Laya.Point && (_ = t), e instanceof Laya.Sprite ? p = e.localToGlobal(new Laya.Point(e.width / 2, e.height / 2)) : e instanceof Laya.Point && (p = e);
                let m = [];
                for (let t = 0; t < 3; t++)
                    for (let e = 0; e < 15; e++) {
                        let a = Laya.Pool.getItemByClass("goldImage", Laya.Image);
                        a.source = Laya.loader.getRes("res/img_coins.png"), a.anchorX = a.anchorY = .5, a.size(70, 70), a.pos(_.x, _.y, !0), a.zOrder = 1e3, Laya.stage.addChild(a);
                        let n = {
                                x: y[t].x + f.getIntRandom(-150, 150),
                                y: y[t].y + f.getIntRandom(-50, 50)
                            },
                            u = {
                                image: a,
                                counts: 0,
                                point: [_, new Laya.Point(_.x + n.x, _.y + n.y), p],
                                runSign: !1
                            };
                        m.push(u), Laya.timer.once(15 * e, this, (function(t) {
                            m[t].runSign = !0
                        }), [15 * t + e])
                    }
                ct.instance.playSoundById(101);
                let playSound = function() {
                    ct.instance.playSoundById(101)
                };
                Laya.timer.loop(50, Laya.stage, playSound), Laya.timer.once(200, Laya.stage, (function() {
                    Laya.timer.clear(Laya.stage, playSound)
                }));
                let updataFuc = function(t) {
                    for (let e = 0; e < m.length; e++) {
                        const _ = m[e];
                        if (_ && _.runSign) {
                            let p = t * _.counts,
                                y = ut.getBezierPoint(p, _.point[0], _.point[1], _.point[2]);
                            if (_.image.pos(y.x, y.y), p >= 1) {
                                if (_.image.removeSelf(), Laya.Pool.recover("goldImage", _.image), m[e] = void 0, e == m.length - 1) Laya.timer.clear(Laya.stage, updataFuc), n && n.iconCtrl ? Laya.timer.once(150, this, (function(t) {
                                    n.iconCtrl && (Laya.Tween.clearAll(n.iconCtrl), Laya.Tween.to(n.iconCtrl, {
                                        scaleX: u,
                                        scaleY: g
                                    }, 100, null, Laya.Handler.create(this, (function(t) {
                                        t && t.run(), Laya.timer.once(100, this, (function() {
                                            Laya.MouseManager.enabled = !0
                                        }))
                                    }), [t])))
                                }), [a]) : (a && a.run(), Laya.timer.once(100, this, (function() {
                                    Laya.MouseManager.enabled = !0
                                })));
                                else if (0 == e && (ct.instance.playSoundById(102), n && n.iconCtrl && (n.iconCtrl.anchorX = n.iconCtrl.anchorY = .5, ut.propQEffect(n.iconCtrl)), n && n.callbackFirst && n.callbackFirst.run(), n && n.coinsLabelCtrl && n.addCoinsNum)) {
                                    let t = Number(n.coinsLabelCtrl.text);
                                    if (n.isScienceount) {
                                        if (!n.ownCoinsNum) return;
                                        t = n.ownCoinsNum
                                    }
                                    t = t > 0 ? t : 0;
                                    for (let e = 0; e < 10; e++) {
                                        let a = (e + 1) * (n.addCoinsNum / 10) + t;
                                        Laya.timer.once(25 * e, this, (t => {
                                            n.isScienceount ? n.coinsLabelCtrl.text = f.formatNumberWithUnits(Math.floor(t)) + "" : n.coinsLabelCtrl.text = Math.floor(t) + ""
                                        }), [a])
                                    }
                                }
                            } else m[e].counts += 70
                        }
                    }
                };
                Laya.timer.frameLoop(1, Laya.stage, updataFuc, [3e-4])
            }
            static consumePropEffect(t, e, a, n) {
                for (let a = 0; a < 3; a++)
                    for (let a = 0; a < 5; a++) Laya.timer.once(50 * a, this, (function() {
                        let a = Laya.Pool.getItemByClass("goldImage", Laya.Image);
                        a.source = Laya.loader.getRes(t), a.anchorX = .5, a.anchorY = .5, a.size(35, 35), a.pos(e.x, e.y, !0), a.zOrder = 1e3, Laya.stage.addChild(a), Laya.Tween.to(a, {
                            x: e.x + f.getIntRandom(-100, 100),
                            y: e.y + f.getIntRandom(-100, 100)
                        }, 400, null, Laya.Handler.create(this, (function(t) {
                            t.removeSelf(), Laya.Pool.recover("goldImage", t), n && n.run()
                        }), [a]))
                    }));
                let u = new Laya.Label;
                u.text = `-${a}`, u.anchorX = u.anchorY = .5, u.fontSize = 45, u.pos(e.x, e.y), u.zOrder = 1001, u.color = "#f8f3d3", u.stroke = 3, u.strokeColor = "#000000", Laya.stage.addChild(u), Laya.Tween.to(u, {
                    x: e.x,
                    y: e.y - 100
                }, 500, null, Laya.Handler.create(this, (function(t) {
                    t.removeSelf(), t.destroy()
                }), [u]))
            }
            static propQEffect(t) {
                let e = t.scaleX;
                t.scaleY;
                new g([{
                    t: "to",
                    target: t,
                    props: {
                        scaleX: 1.25 * e,
                        scaleY: .75 * e
                    },
                    duration: 50,
                    ease: null
                }, {
                    t: "to",
                    target: t,
                    props: {
                        scaleX: .75 * e,
                        scaleY: 1.25 * e
                    },
                    duration: 50,
                    ease: null
                }], !0).run()
            }
            static getBezierPoint(t, e, a, n) {
                let u = 1 - t;
                return {
                    x: u * u * e.x + 2 * t * u * a.x + t * t * n.x,
                    y: u * u * e.y + 2 * t * u * a.y + t * t * n.y
                }
            }
            static glowBreath(t, e) {
                if (!t.scene) return void console.log("该控件无所属场景!!!");
                e ? (!e.color && (e.color = "#ffffff"), !e.blur && (e.blur = 1), !e.offX && (e.offX = 0), !e.offY && (e.offY = 0)) : e = {
                    color: "#fffffff",
                    blur: 1
                };
                let a = 0,
                    n = e.blur,
                    u = !0;
                t.scene.timer.loop(100, t.scene, (() => {
                    if (u) {
                        if (a++, a > n) return void(u = !1)
                    } else if (a--, a < 0) return void(u = !0);
                    t.filters = [], t.filters = [new Laya.GlowFilter(e.color, a, e.offX, e.offY)]
                }))
            }
            static shakeCamrea(t, e = 10) {
                if (!t) return;
                let a, n = t.viewport;
                t.__mViewportTween && t.__mViewportTween instanceof Laya.Tween ? (a = t.__mViewportTween, a.complete(), a.clear()) : (a = new Laya.Tween, t.__mViewportTween = a);
                let u = new Laya.Point(n.x, n.y);
                a.to(n, {
                    update: new Laya.Handler(this, (() => {
                        let a = -e + 2 * e * Math.random(),
                            f = -e + 2 * e * Math.random();
                        n.x = u.x + a, n.y = u.y + f, t.viewport = n
                    }))
                }, 200, null, Laya.Handler.create(this, (() => {
                    n.x = u.x, n.y = u.y, t.viewport = n
                }))), t.once(Laya.Event.REMOVED, null, (() => {
                    a.clear(), delete t.__mViewportTween
                }))
            }
            static stopShakeCamrea(t) {
                if (!t) return;
                let e;
                t.__mViewportTween && t.__mViewportTween instanceof Laya.Tween && (e = t.__mViewportTween, e.complete(), e.clear(), delete t.__mViewportTween)
            }
            static loopRotate(t, e) {
                t.__loopRotateTween && this.stopLoopRotate(t);
                let a = {
                        value: 0
                    },
                    n = 360 / Math.abs(e),
                    u = new Laya.Handler(this, (() => {
                        let a = e * Laya.timer.delta / 1e3;
                        t.rotation += a
                    })),
                    exec = () => {
                        t.__loopRotateTween = Laya.Tween.to(a, {
                            value: 360,
                            update: u
                        }, 1e3 * n, null, new Laya.Handler(this, (() => {
                            exec()
                        })))
                    };
                exec(), t.on(Laya.Event.REMOVED, this, this.stopLoopRotate, [t])
            }
            static stopLoopRotate(t) {
                if (t.__loopRotateTween) {
                    t.__loopRotateTween.clear(), delete t.__loopRotateTween
                }
            }
        }
        class dt {
            static getSceneUrl(t) {
                return t
            }
            static destroy(t, e) {
                if (t && (t.autoDestroyAtClosed = !0, t.destroyed || t.close("closeByDestroy"), e && !Laya.isWXPlayable)) {
                    let e = t,
                        a = e.__loadedResMap;
                    if (a) {
                        for (const t of a) t.destroyed || t._removeReference();
                        e.__loadedResMap = void 0
                    }
                    Laya.Scene.gc()
                }
            }
            static uiChanged(t, e) {
                if (e) {
                    if (this.uiStack[this.uiStack.length - 1] == t) {
                        t.actived();
                        let e = this.uiStack[this.uiStack.length - 2];
                        e && e.deactived()
                    } else t.deactived()
                } else if (t) {
                    if (this.uiStack[this.uiStack.length - 1] == t) {
                        this.uiStack.pop(), t.deactived();
                        let e = this.uiStack[this.uiStack.length - 1];
                        e && e.actived()
                    } else {
                        let e = this.uiStack.indexOf(t); - 1 != e && (this.uiStack.splice(e, 1), t.deactived())
                    }
                }
            }
            static processRes(t) {
                Laya.loader.clearRes3d && Laya.loader.clearRes3d();
                let e = [],
                    a = [];
                for (const n of t) - 1 != ["ls", "lh"].indexOf(Laya.Utils.getFileExtension(n)) ? (Laya.loader.setGroup(n, "3DRES_GROUP"), e.push(n)) : a.push(n);
                return [e, a]
            }
            static changeScene(t, e, a) {
                let onLoadFail = function() {
                    console.error("--------------onLoadFail----------"), dt.cur_url_module = void 0, Laya.MouseManager.enabled = !0, fx.EventCenter.I.event("OnSceneLoadFail", t)
                };
                if (this.cur_url_module == t) return;
                this.cur_url_module = t;
                let n, u = dt;
                e && (n = e.userArgs, null != e.from && (n ? n.unshift(e.from) : n = [e.from])), n = n || [], Laya.MouseManager.enabled = !1, fx.EventCenter.I.event(V.E_UI_RES_LOAD_START);
                let listener = function(t) {
                    fx.EventCenter.I.event(V.E_UI_RES_LOAD_COMPLETE);
                    for (let t = u.uiStack.length - 1; t >= 0; --t) {
                        let e = u.uiStack[t];
                        e instanceof lt && (e.isShowEffect = !1, dt.closePanel(e))
                    }
                    let f = e && e.effectFunc;
                    if (f ? (t.open(!1), f.call(u, u.curScene, (() => {
                            u.curScene.exit()
                        }), t, (() => {
                            Laya.MouseManager.enabled = !0, u.cur_url_module = void 0, u.uiStack.push(t), t.enter(n), u.uiChanged(u.curScene, !1), u.uiChanged(t, !0), u.destroy(u.curScene, !0), u.curScene = t
                        }))) : (u.curScene && u.curScene.exit(), Laya.MouseManager.enabled = !0, u.cur_url_module = void 0, u.uiChanged(u.curScene, !1), t.open(!0), u.uiStack.push(t), t.enter(n), u.uiChanged(t, !0), u.destroy(u.curScene, !0), u.curScene = t), a && a.runWith(t), !Laya.isWXPlayable) {
                        Laya.ClassUtils.getRegClass("Sdk").instance.sendEvent("面板", {
                            "打开": t.getModuleUrlName()
                        })
                    }
                };
                if ("string" == typeof t) {
                    let e = t;
                    e = this.getSceneUrl(e), rt.load(e, Laya.Handler.create(u, listener))
                } else {
                    let e = t,
                        a = 1,
                        f = new e(...n),
                        g = e.getRes(...n);
                    if (g && g.length > 0) {
                        let [t, e] = this.processRes(g);
                        t.length > 0 && (a++, Laya.loader.create(t, Laya.Handler.create(u, (t => {
                            t ? (a--, 0 == a && listener(f)) : onLoadFail()
                        })))), e.length > 0 && (a++, Laya.loader.load(e, Laya.Handler.create(u, (t => {
                            if (t) {
                                for (const t of e) {
                                    let e = Laya.loader.getRes(t);
                                    if (e && 0 == e._referenceCount) {
                                        e._addReference();
                                        let t = f;
                                        t.__loadedResMap || (t.__loadedResMap = []), t.__loadedResMap.push(e)
                                    }
                                }
                                a--, 0 == a && listener(f)
                            } else onLoadFail()
                        }))))
                    }
                    f.once("onViewCreated", u, (() => {
                        a--, 0 == a && listener(f)
                    }))
                }
            }
            static changeView(e, a, n) {
                let u, g = dt;
                a && (u = a.userArgs, null != a.from && (u ? u.unshift(a.from) : u = [a.from])), u = u || [], Laya.MouseManager.enabled = !1, fx.EventCenter.I.event(V.E_UI_RES_LOAD_START);
                let listener = function(e) {
                    fx.EventCenter.I.event(V.E_UI_RES_LOAD_COMPLETE);
                    let _ = a && a.effectFunc;
                    g.curScene.pushView(e);
                    let p = g.curScene.curView;
                    _ ? (e.visible = !1, e.once(V.E_UI_ADAPTED, this, (() => {
                        e.visible = !0, _.call(g, p, (() => {
                            p && p.exit()
                        }), e, (() => {
                            Laya.MouseManager.enabled = !0, g.uiStack.push(e), e.enter(u), g.uiChanged(p, !1), g.uiChanged(e, !0), g.destroy(p), g.curScene.curView = e
                        }))
                    }))) : (p && p.exit(), Laya.MouseManager.enabled = !0, g.uiStack.push(e), e.enter(u), g.uiChanged(p, !1), g.uiChanged(e, !0), g.destroy(p), g.curScene.curView = e), n && n.runWith(e);
                    let y = f.getModule(e);
                    at.I.event(V.E_PANEL_OPENCLOSE, {
                        code: t.BaseCode.VIEW_OPEN,
                        name: dt.getModuleName(y),
                        gid: e.getGID()
                    })
                };
                if ("string" == typeof e) {
                    let t = e;
                    t = this.getSceneUrl(t), ot.load(t, Laya.Handler.create(g, listener))
                } else {
                    let t = e,
                        a = t.getRes(...u),
                        n = 1,
                        f = new t(...u);
                    a && a.length > 0 && (n++, Laya.loader.load(a, Laya.Handler.create(g, (() => {
                        n--, 0 == n && listener(f)
                    })))), f.once("onViewCreated", g, (() => {
                        n--, 0 == n && listener(f)
                    }))
                }
            }
            static pushView(e, a, n, u) {
                let g, _ = dt;
                a && (g = a.userArgs, null != a.from && (g ? g.unshift(a.from) : g = [a.from])), g = g || [], Laya.MouseManager.enabled = !1, fx.EventCenter.I.event(V.E_UI_RES_LOAD_START);
                let listener = function(e) {
                    fx.EventCenter.I.event(V.E_UI_RES_LOAD_COMPLETE);
                    let p = a && a.effectFunc;
                    _.curScene.pushView(e);
                    let y = _.curScene.curView;
                    p ? (e.visible = !1, e.once(V.E_UI_ADAPTED, this, (() => {
                        e.visible = !0, p.call(_, y, (() => {
                            y && u && y.exit()
                        }), e, (() => {
                            Laya.MouseManager.enabled = !0, _.uiStack.push(e), e.enter(g), _.uiChanged(e, !0), y && u && (y.visible = !1), _.curScene.curView = e
                        }))
                    }))) : (y && u && (y.exit(), y.visible = !1), Laya.MouseManager.enabled = !0, _.uiStack.push(e), e.enter(g), _.uiChanged(e, !0), _.curScene.curView = e), n && n.runWith(e);
                    let m = f.getModule(e);
                    if (at.I.event(V.E_PANEL_OPENCLOSE, {
                            code: t.BaseCode.VIEW_OPEN,
                            name: dt.getModuleName(m),
                            gid: e.getGID()
                        }), !Laya.isWXPlayable) {
                        Laya.ClassUtils.getRegClass("Sdk").instance.sendEvent("面板", {
                            "打开": e.getModuleUrlName()
                        })
                    }
                };
                if ("string" == typeof e) {
                    let t = e;
                    t = this.getSceneUrl(t), ot.load(t, Laya.Handler.create(_, listener))
                } else {
                    let t = e,
                        a = t.getRes(...g),
                        n = 1,
                        u = new t(...g);
                    if (a && a.length > 0) {
                        let [t, e] = this.processRes(a);
                        t.length > 0 && (n++, Laya.loader.create(t, Laya.Handler.create(_, (() => {
                            n--, 0 == n && listener(u)
                        })))), e.length > 0 && (n++, Laya.loader.load(e, Laya.Handler.create(_, (() => {
                            n--, 0 == n && listener(u)
                        }))))
                    }
                    u.once("onViewCreated", _, (() => {
                        n--, 0 == n && listener(u)
                    }))
                }
            }
            static closeView(e) {
                e.exit();
                let a = this.curScene.lastView;
                a && (a.visible = !0), this.uiChanged(e, !1), this.curScene.curView = a, this.curScene.closeView(e), this.destroy(e);
                let n = f.getModule(e);
                at.I.event(V.E_PANEL_OPENCLOSE, {
                    code: t.BaseCode.VIEW_CLOSE,
                    name: dt.getModuleName(n),
                    gid: e.getGID()
                })
            }
            static popView(e) {
                let a, n = e && e.effectFunc;
                e && (a = e.userArgs, null != e.from && (a ? a.unshift(e.from) : a = [e.from])), a = a || [];
                let u = this.curScene.lastView,
                    g = this.curScene.curView;
                if (!g) return;
                let _ = f.getModule(g);
                Laya.MouseManager.enabled = !1, n ? n.call(this, g, (() => {
                    g.exit()
                }), u, (() => {
                    Laya.MouseManager.enabled = !0, u && (u.enter(a), u.visible = !0), this.uiChanged(g, !1), this.curScene.curView = u, this.curScene.popView(), this.destroy(g)
                })) : (g && g.exit(), Laya.MouseManager.enabled = !0, u && (u.enter(a), u.visible = !0), this.uiChanged(g, !1), this.curScene.curView = u, this.curScene.popView(), this.destroy(g)), at.I.event(V.E_PANEL_OPENCLOSE, {
                    code: t.BaseCode.VIEW_CLOSE,
                    name: dt.getModuleName(_),
                    gid: g.getGID()
                })
            }
            static getModuleByName(t) {
                return Laya.ClassUtils.getRegClass(t)
            }
            static getModuleName(t) {
                let e = Laya.ClassUtils._classMap;
                for (const a in e)
                    if (e.hasOwnProperty(a) && e[a] == t) return a
            }
            static openPanel(e, a, n) {
                let u, g = dt;
                a && (u = a.userArgs, null != a.from && (u ? u.unshift(a.from) : u = [a.from])), u = u || [], Laya.MouseManager.enabled = !1, fx.EventCenter.I.event(V.E_UI_RES_LOAD_START);
                let listener = function(e) {
                    fx.EventCenter.I.event(V.E_UI_RES_LOAD_COMPLETE);
                    let _ = null;
                    a && a.addToScene && (_ = g.curScene.createDialogManager(a.addToScene), e.popupEffect = _.popupEffectHandler, e.closeEffect = _.closeEffectHandler);
                    let p = a && a.effectFunc;
                    if (p) g.uiStack.push(e), e.open(!1, u, _), g.uiChanged(e, !0), p.call(g, null, null, e, (() => {
                        Laya.MouseManager.enabled = !0
                    }));
                    else {
                        let t = a && a.closeOther;
                        null == t && (t = !0), Laya.MouseManager.enabled = !0, g.uiStack.push(e), e.open(t, u, _), g.uiChanged(e, !0)
                    }
                    n && n.runWith(e);
                    let y = f.getModule(e);
                    if (at.I.event(V.E_PANEL_OPENCLOSE, {
                            code: t.BaseCode.PANEL_OPEN,
                            name: dt.getModuleName(y),
                            gid: e.getGID()
                        }), !Laya.isWXPlayable) {
                        Laya.ClassUtils.getRegClass("Sdk").instance.sendEvent("面板", {
                            "打开": e.getModuleUrlName()
                        })
                    }
                };
                if ("string" == typeof e) {
                    let t = e;
                    t = this.getSceneUrl(t), Laya.Dialog.load(t, Laya.Handler.create(this, listener))
                } else if (a && a.isInstance) listener(e);
                else {
                    let t = e,
                        a = t.getRes(...u),
                        n = new t(...u),
                        f = 1;
                    !n.url && (f = 0), a && a.length > 0 && (f++, Laya.loader.load(a, Laya.Handler.create(g, (() => {
                        f--, 0 == f && listener(n)
                    })))), n.once("onViewCreated", g, (() => {
                        f--, 0 == f && listener(n)
                    }))
                }
            }
            static closePanel(e, a) {
                let n = dt,
                    u = f.getModule(e),
                    g = a && a.effectFunc,
                    _ = a && a.autoDestroy;
                null == _ && (_ = !0);
                let p = e.getGID();
                e.once(Laya.Event.REMOVED, this, (() => {
                    e && (e.mouseEnabled = !0), at.I.event(V.E_PANEL_OPENCLOSE, {
                        code: t.BaseCode.PANEL_CLOSE,
                        name: dt.getModuleName(u),
                        gid: p
                    })
                })), g ? (Laya.MouseManager.enabled = !1, g.call(n, e, (() => {
                    Laya.MouseManager.enabled = !0, e.autoDestroyAtClosed = _, e.isShowEffect = !1, e.close("closePanel"), n.uiChanged(e, !1)
                }))) : (e.autoDestroyAtClosed = _, n.uiChanged(e, !1), e.close("closePanel"), e.isShowEffect && (e.mouseEnabled = !1))
            }
            static getCurScene() {
                return this.curScene
            }
            static getCurSceneRgeName() {
                let t = f.getModule(this.curScene);
                if (t) return this.getModuleName(t)
            }
            static getCurViewRgeName() {
                let t = f.getModule(this.curScene.curView);
                if (t) return this.getModuleName(t)
            }
            static getCurDialogRegName() {
                let t = Laya.Dialog.manager,
                    e = t.getChildAt(t.numChildren - 1);
                if (e) return this.getModuleName(f.getModule(e))
            }
            static getCurUIRegName(t = 1) {
                let e = this.uiStack[this.uiStack.length - t];
                if (e) return this.getModuleName(f.getModule(e))
            }
            static isInUIStack(t) {
                return -1 != this.uiStack.indexOf(t)
            }
        }
        dt.uiStack = [], dt.EF_FADE_OUT_BLACK = function(t, e, a, n, u) {
            n.visible = !1, ut.shadeScreen("#000000", t, 1, Laya.Handler.create(this, (() => {
                n.visible = !0, a && a(), u && u()
            })))
        }, dt.EF_FADE_OUT = function(t, e, a, n, u) {
            n.visible = !0, Laya.Tween.to(e, {
                alpha: 0
            }, t, null, Laya.Handler.create(this, (() => {
                e.visible = !1, a && a(), u && u()
            }))), e.alpha = 1, e.zOrder = 1
        }, dt.EF_FADE_INOUT = function(t, e, a, n, u) {
            e.alpha = 1, n.alpha = 0, Laya.Tween.to(e, {
                alpha: 0
            }, t, null), Laya.Tween.to(n, {
                alpha: 1
            }, t, null, Laya.Handler.create(this, (() => {
                a && a(), u && u()
            })))
        }, dt.EF_FADE_IN_OUT = function(t, e, a, n, u) {
            e.alpha = 1, n.alpha = 0, Laya.Tween.to(e, {
                alpha: 0
            }, .5 * t, null, Laya.Handler.create(this, (() => {
                Laya.Tween.to(n, {
                    alpha: 1
                }, .5 * t, null, Laya.Handler.create(this, (() => {
                    a && a(), u && u()
                })))
            })))
        }, dt.EF_QSCALE_IN = function(t, e, a, n) {
            f.resetAnchor(a, .5, .5), Laya.Tween.from(a, {
                scaleX: 0,
                scaleY: 0
            }, 300, Laya.Ease.backOut, Laya.Handler.create(this, (() => {
                e && e(), n && n()
            })))
        }, dt.EF_QSCALE_FADE_IN = function(t, e, a, n) {
            a.alpha = 0, f.resetAnchor(a, .5, .5), Laya.Tween.from(a, {
                scaleX: 0,
                scaleY: 0
            }, 300, Laya.Ease.backOut, Laya.Handler.create(this, (() => {
                e && e(), n && n()
            }))), Laya.Tween.to(a, {
                alpha: 1
            }, 400, null, null)
        }, dt.EF_QSCALE_OUT = function(t, e, a, n) {
            Laya.Tween.to(t, {
                scaleX: 0,
                scaleY: 0
            }, 300, Laya.Ease.strongOut, Laya.Handler.create(t, (() => {
                e && e(), n && n()
            }), [t]))
        }, dt.EF_PANEL = function(t, e, a, n, u) {
            n.alpha = 0, dt.openPanel(t, {
                from: "",
                userArgs: [n, Laya.Handler.create(this, (() => {
                    a && a(), u && u()
                }))]
            })
        }, Laya.ClassUtils.regClass("SceneManager", dt), window.Config3D || (window.Config3D = class {
            constructor() {}
        });
        const ft = {
            enableShadow: !1,
            enableMultiLight: !1,
            enableAntialias: !0,
            enableRetinalCanvas: !0,
            enableHDR: !1
        };
        class gt extends nt {
            constructor() {
                super(), this._initialized = !1
            }
            init(...t) {
                0 == this._initialized && this.onInitOnce.apply(this, t), this.onInit(...t), this._initialized = !0
            }
            get initialized() {
                return this._initialized
            }
            onInit(...t) {}
            onInitOnce(...t) {}
        }
        class _t {
            constructor(t) {
                this.includes = [], this.readySaveProps = [];
                let e = t.getKey(),
                    a = _t.keyMap[e],
                    n = f.getModule(t);
                a && a != n ? console.error(`存储key重复！ ${e}`) : (this.data = t, _t.keyMap[e] = n, this.init(), t.isAutoRecover && this.recover())
            }
            init() {
                let t = this.data,
                    e = this.includes.slice();
                if (0 != this.includes.length || t.getIncludes) {
                    if (t.getIncludes) {
                        let a = t.getIncludes();
                        e = f.diffArray(this.includes, a, !0)
                    }
                } else e = Object.keys(t);
                if (t.getExcludes) {
                    let a = t.getExcludes();
                    for (const t of a) e.splice(e.indexOf(t), 1)
                }
                f.warpObjectGetterSetterAppend(t, e, this.dirty.bind(this)), this.includes = this.includes.concat(e)
            }
            hasStorage() {
                let t = this.data.getKey();
                return !!Laya.LocalStorage.getItem(t)
            }
            getData() {
                return this.data
            }
            recover() {
                let t = this.data.getKey(),
                    e = Laya.LocalStorage.getItem(t);
                if (e) try {
                    let t = e.charAt(0),
                        a = e.charAt(1),
                        n = e;
                    "Z" == t && "L" == a && (n = LZString.decompress(e.substring(2)));
                    let u = JSON.parse(n);
                    return f.assign(this.data, u, !1), !0
                } catch (a) {
                    console.log("LocalStorage.getItem error: ", t, e)
                }
            }
            dirty(t) {
                this.readySaveProps.includes(t) || this.readySaveProps.push(t), this.data.isAutoSave && 1 == this.readySaveProps.length && Laya.CallLater.I.callLater(this, this._save)
            }
            save() {
                this._save()
            }
            _save() {
                let t = [],
                    e = this.data;
                e.getExcludes && (t = e.getExcludes());
                let a = e;
                if (this.includes.length > 0) {
                    a = {};
                    for (const t of this.includes) a[t] = this.data[t]
                }
                let n = JSON.stringify(a, ((e, a) => {
                        if (!t.includes(e)) return a
                    })),
                    u = e.getKey();
                e.isCompress && "undefined" != typeof LZString && (n = "ZL" + LZString.compress(n)), Laya.LocalStorage.setItem(u, n)
            }
            clear() {
                let t = this.data.getKey();
                Laya.LocalStorage.removeItem(t)
            }
        }
        _t.keyMap = {};
        class pt {
            constructor(t) {
                this.autoSave = !0, pt.keyList.includes(t) ? console.error(`存储key重复！ ${t}`) : (this.key = t, pt.keyList.push(t))
            }
            init() {
                let t = this.loadData();
                if (t)
                    for (const e in this)
                        if (this.hasOwnProperty(e)) {
                            let a = t[e];
                            null != a && "" !== a && (this[e] = a)
                        }
            }
            loadData() {
                let t = Laya.LocalStorage.getItem(this.key);
                if (t) {
                    if (t instanceof Object) return t;
                    try {
                        t = JSON.parse(t)
                    } catch (e) {
                        console.log("LocalStorage.getItem error: ", this.key, t)
                    }
                }
                return t
            }
            dirty(t) {
                this.autoSave && Laya.CallLater.I.callLater(this, this._save)
            }
            save() {
                Laya.CallLater.I.callLater(this, this._save)
            }
            _save() {
                let t = ["$_GID", "_autoSave", "_key"],
                    e = JSON.stringify(this, ((e, a) => {
                        for (const a of t)
                            if (e == a) return;
                        return a
                    }));
                Laya.LocalStorage.setItem(this.key, e)
            }
            clear() {
                Laya.LocalStorage.removeItem(this.key)
            }
        }
        pt.keyList = [];
        const yt = window.CryptoJS;
        class mt {
            static getSecret() {
                return this._secret
            }
            static setSecret(t) {
                this._secret || this._secret != t && (this._secret = t, this.key = String(t))
            }
            static decryptAes(t) {
                if (!this.key) throw Error("need secret key !");
                let e = yt.AES.decrypt(t, this.key);
                return JSON.parse(e.toString(yt.enc.Utf8))
            }
            static encryptAes(t) {
                if (!this.key) throw Error("need secret key !");
                return yt.AES.encrypt(JSON.stringify(t), this.key).toString()
            }
            static base64Ciphertext(t) {
                let e = yt.enc.Hex.parse(t);
                return yt.enc.Base64.stringify(e)
            }
        }
        class bt {
            constructor() {
                this.releasePool = [], Laya.timer.frameLoop(1, this, this.update)
            }
            static get instance() {
                return this._instance || (this._instance = new bt), this._instance
            }
            add(t, e = !0, a, n) {
                if (!t) return;
                let u = {
                    node: t,
                    delay: a,
                    destroy: e,
                    group: n
                };
                a && (u.addtime = Laya.Browser.now()), this.releasePool.push(u)
            }
            update() {
                let t = Laya.Browser.now();
                for (let e = this.releasePool.length - 1; e >= 0; e--) {
                    let a = this.releasePool[e];
                    a.delay ? t - a.addtime >= a.delay && this.release(a, e) : this.release(a, e)
                }
            }
            release(t, e) {
                t.destroy ? t.node.destroyed || t.node.destroy() : t.node.removeSelf(), this.releasePool.splice(e, 1)
            }
            releaseByGroup(t) {
                if (t)
                    for (let e = this.releasePool.length - 1; e >= 0; e--) {
                        let a = this.releasePool[e];
                        a.group == t && this.release(a, e)
                    }
            }
        }
        class wt extends Laya.EventDispatcher {
            constructor(t) {
                super();
                let e = new Laya.HttpRequest;
                e.http.timeout = 1e4, e.once(Laya.Event.COMPLETE, this, this.completeHandler), e.once(Laya.Event.ERROR, this, this.errorHandler), e.on(Laya.Event.PROGRESS, this, this.processHandler), this.xhr = e, this.encrypt = t
            }
            send(t, e, a, n, u = "POST") {
                const f = window.pako;
                if (t) {
                    this.once("HTTPRSP", n, a);
                    let g = Laya.LocalStorage.getItem("AUTHTOKEN"),
                        _ = ["Content-Type", "application/x-www-form-urlencoded"];
                    g && (_.push("authorization"), _.push(g));
                    let p = JSON.stringify(e);
                    if (console.log("http >>>>>>>>>>>>>>>>>>> url:" + t + " data:" + p), "GET" == u.toUpperCase()) {
                        let a;
                        for (let t in e) {
                            let n = e[t];
                            "object" == typeof n && (n = JSON.stringify(n)), a = null == a ? t + "=" + encodeURIComponent(n) : a + "&" + t + "=" + encodeURIComponent(n)
                        }
                        this.xhr.send(t + "?" + a, null, u, "json", _)
                    } else _[1] = "application/json", p = this.encrypt ? f.deflate(encodeURIComponent(p), {
                        to: "string"
                    }) : encodeURIComponent(p), p = JSON.stringify({
                        data: p
                    }), this.xhr.send(t, p, u, "json", _)
                }
            }
            registerErrHandler(t, e) {
                this.once("HTTPERR", e, t)
            }
            processHandler(t) {}
            errorHandler(t) {
                console.log("http <<<<<<<<<<<<<<<<<<< error:" + JSON.stringify(t)), this.event("HTTPERR", t)
            }
            completeHandler(e) {
                const a = window.pako;
                let n = e.data;
                if (n) {
                    this.encrypt && (n = a.inflate(n, {
                        to: "string"
                    })), n = decodeURIComponent(n), console.log("http <<<<<<<<<<<<<<<<<<< ok:" + n);
                    try {
                        n = JSON.parse(n)
                    } catch (e) {
                        return void this.event("HTTPERR", {
                            code: t.BaseCode.HTTP_INTERFACE_UNDEFINED
                        })
                    }
                    try {
                        let t = this.xhr.http;
                        if (t.getAllResponseHeaders()) {
                            const e = ["authorization", "Authorization"];
                            for (const a of e) {
                                let e = t.getResponseHeader(a);
                                if (e) {
                                    Laya.LocalStorage.setItem("AUTHTOKEN", e);
                                    break
                                }
                            }
                        }
                    } catch (t) {}
                    this.event("HTTPRSP", n)
                } else console.log("http <<<<<<<<<<<<<<<<<<< ok: null")
            }
        }
        class xt {
            static request(t, e, a, n, u, f, g, _) {
                let p, y = new Laya.HttpRequest;
                if (y.http.timeout = g || 1e4, y.once(Laya.Event.COMPLETE, this, (t => {
                        console.log("HttpManager request complete: ", t), u && f && f.call(u, t)
                    })), y.once(Laya.Event.ERROR, this, (t => {
                        console.log("HttpManager request error: ", t), u && f && f.call(u, t)
                    })), p = "GET" == e ? ["Content-Type", "application/x-www-form-urlencoded"] : ["Content-Type", "application/json"], n && (p[2] = "Authorization", p[3] = n), _ && _.length > 0)
                    for (let t = 0; t < _.length; t += 2) {
                        let e = _[t],
                            a = _[t + 1];
                        void 0 !== e && void 0 !== a && p.push(e, a)
                    }
                "string" != typeof a && (a = JSON.stringify(a)), y.send(t, a, e, "json", p)
            }
        }
        class Lt {
            static get I() {
                return this._instance || (this._instance = new Lt), this._instance
            }
            callback(t, e, a) {
                t && e && e.call(t, a)
            }
            isLogin() {
                return !!this._openID
            }
            getOpenId() {
                return this._openID
            }
            getToken() {
                return this._token
            }
            login(t, e, a) {
                if (this.isLogin()) return void this.callback(e, a, [!0]);
                this._serverUrl = t.serverUrl, this._gameID = t.gameID, this._platform = t.platform;
                let n = this._serverUrl + "/createaccount",
                    u = window.sdk.Sdk.instance.getLoginCode(),
                    f = window.sdk.Sdk.instance.getLoginAnonymousCode(),
                    g = {
                        gameID: this._gameID,
                        platform: this._platform,
                        third: {
                            code: u,
                            anonymous_code: f,
                            openid: "",
                            anonymousOpenid: ""
                        },
                        strict: t.strict
                    };
                t.openid && (g.third.openid = t.openid), t.anonymousOpenid && (g.third.anonymousOpenid = t.anonymousOpenid), xt.request(n, "POST", g, null, this, (t => {
                    t && t.jwt && t.user && t.user.udid ? (this._token = t.jwt, this._openID = t.user.udid, console.log("http 登录成功!", t)) : console.log("http 登录失败!", t), this.callback(e, a, [this.isLogin(), t])
                }), 5e3)
            }
            getStorage(t, e) {
                if (!this._token) return console.log("getStorage 请先登录"), void this.callback(t, e, null);
                let a = this._serverUrl + "/getStorage",
                    n = {
                        gameID: this._gameID,
                        platform: this._platform,
                        openID: this._openID
                    };
                xt.request(a, "POST", n, this._token, t, e, 5e3)
            }
            setStorage(t, e, a) {
                if (!this._token) return console.log("setStorage 请先登录"), void this.callback(e, a, null);
                let n = this._serverUrl + "/setStorage",
                    u = {
                        gameID: this._gameID,
                        platform: this._platform,
                        openID: this._openID,
                        data: t
                    };
                xt.request(n, "POST", u, this._token, e, a)
            }
        }
        const vt = 1e8,
            St = "__TableViewIdx";
        var Et;
        t.TableViewDirection = void 0, (Et = t.TableViewDirection || (t.TableViewDirection = {}))[Et.HORIZONTAL = 0] = "HORIZONTAL", Et[Et.VERTICAL = 1] = "VERTICAL";
        class Tt extends Laya.Panel {
            constructor() {
                super(), this._indices = [], this._cellsUsed = [], this._cellsFreed = [], this._cellsPositions = [], this._direction = t.TableViewDirection.HORIZONTAL, this._isUsedCellsDirty = !1, this._contentSize = new fx.Size(0, 0)
            }
            get contentWidth() {
                return this._contentSize.width
            }
            get contentHeight() {
                return this._contentSize.height
            }
            get direction() {
                return this._direction
            }
            set direction(e) {
                this._direction = e, this.direction == t.TableViewDirection.HORIZONTAL ? this.hScrollBarSkin = "" : this.vScrollBarSkin = ""
            }
            get scrollBar() {
                return this._direction == t.TableViewDirection.HORIZONTAL ? this.hScrollBar : this.vScrollBar
            }
            reloadData() {
                this.scrollBar.changeHandler = new Laya.Handler(this, this._didScroll);
                for (const t of this._cellsUsed) this._cellsFreed.push(t), t.removeSelf();
                this._indices = [], this._cellsUsed = [], this._updateCellPositions(), this._updateContentSize(), this.dataHandler.cellsCount() > 0 && this._didScroll()
            }
            _updateCellPositions() {
                this._cellsPositions = [];
                let e = this.dataHandler.cellsCount();
                if (e > 0) {
                    let a = 0;
                    for (let n = 0; n < e; ++n) {
                        this._cellsPositions[n] = a;
                        let e = this.dataHandler.cellSizeAtIndex(this, n);
                        this.direction == t.TableViewDirection.HORIZONTAL ? a += e.width : a += e.height
                    }
                    this._cellsPositions[e] = a
                }
            }
            _updateContentSize() {
                let e = this.dataHandler.cellsCount();
                if (e > 0) {
                    let a = this._cellsPositions[e];
                    this.direction == t.TableViewDirection.HORIZONTAL ? this._contentSize = new fx.Size(a, this.height) : this._contentSize = new fx.Size(this.width, a), this.refresh()
                }
            }
            _offsetFromIndex(a) {
                return this.direction == t.TableViewDirection.HORIZONTAL ? new e(this._cellsPositions[a], 0) : new e(0, this._cellsPositions[a])
            }
            _indexFromOffset(t) {
                let e = this.dataHandler.cellsCount() - 1,
                    a = this.__indexFromOffset(t);
                return -1 != a && (a = Math.max(0, a), a > e && (a = vt)), a
            }
            __indexFromOffset(t) {
                let e = 0,
                    a = this.dataHandler.cellsCount() - 1,
                    n = t;
                for (; a >= e;) {
                    let t = e + Math.floor((a - e) / 2),
                        u = this._cellsPositions[t],
                        f = this._cellsPositions[t + 1];
                    if (n >= u && n <= f) return t;
                    n < u ? a = t - 1 : e = t + 1
                }
                return e <= 0 ? 0 : -1
            }
            _didScroll() {
                let e = this.dataHandler.cellsCount();
                if (0 == e) return;
                this._isUsedCellsDirty && (this._isUsedCellsDirty = !1, this._cellsUsed.sort(((t, e) => t[St] - e[St])));
                let a = this.scrollBar.value,
                    n = Math.max(e - 1, 0),
                    u = this._indexFromOffset(a);
                u == vt && (u = e - 1), this.direction == t.TableViewDirection.HORIZONTAL ? a += this.width : a += this.height;
                let f = this._indexFromOffset(a);
                if (f == vt && (f = e - 1), -1 == f && 1 == e && (f = u), this._cellsUsed.length > 0) {
                    let t = this._cellsUsed[0],
                        e = t[St];
                    for (; e < u && (this._moveCellOutOfSight(t), this._cellsUsed.length > 0);) t = this._cellsUsed[0], e = t[St]
                }
                if (this._cellsUsed.length > 0) {
                    let t = this._cellsUsed[this._cellsUsed.length - 1],
                        e = t[St];
                    for (; e <= n && e > f && (this._moveCellOutOfSight(t), this._cellsUsed.length > 0);) t = this._cellsUsed[this._cellsUsed.length - 1], e = t[St]
                }
                for (let t = u; t <= f; ++t) this._indices.includes(t) || this.updateCellAtIndex(t)
            }
            _moveCellOutOfSight(t) {
                let e = t[St],
                    a = this._cellsUsed.indexOf(t);
                this._cellsUsed.splice(a, 1), this._cellsFreed.push(t), this._isUsedCellsDirty = !0, a = this._indices.indexOf(e), this._indices.splice(a, 1), t.removeSelf()
            }
            _setIndexForCell(t, e) {
                e.anchorX = e.anchorY = 0;
                let a = this._offsetFromIndex(t);
                e.pos(a.x, a.y), e[St] = t
            }
            _addCellIfNecessary(t) {
                t.parent != this.content && this.addChild(t), this._cellsUsed.push(t), this._indices.push(t[St]), this._isUsedCellsDirty = !0
            }
            cellAtIndex(t) {
                if (this._indices.includes(t))
                    for (const e of this._cellsUsed)
                        if (e[St] == t) return e;
                return null
            }
            updateCellAtIndex(t) {
                if (t == vt) return;
                let e = this.dataHandler.cellsCount();
                if (0 == e || t >= e) return;
                let a = this.cellAtIndex(t);
                a && this._moveCellOutOfSight(a), a = this.dataHandler.tableCellAtIndex(this, t), this._setIndexForCell(t, a), this._addCellIfNecessary(a)
            }
            insertCellAtIndex(t) {
                if (t == vt) return;
                let e = this.dataHandler.cellsCount();
                if (0 == e || t >= e) return;
                let a = 0,
                    n = this.cellAtIndex(t);
                if (n) {
                    a = this._cellsUsed.indexOf(n);
                    for (let t = a; t < this._cellsUsed.length; t++) n = this._cellsUsed[t], this._setIndexForCell(n[St] + 1, n)
                }
                this._updateCellPositions(), this._updateContentSize(), this._didScroll()
            }
            removeCellAtIndex(t) {
                if (t == vt) return;
                let e = this.dataHandler.cellsCount();
                if (0 == e || t >= e) return;
                let a = 0,
                    n = this.cellAtIndex(t);
                if (!n) return;
                a = this._cellsUsed.indexOf(n), this._moveCellOutOfSight(n);
                let u = this._indices.indexOf(t);
                this._indices.splice(u, 1), this._updateCellPositions();
                for (let t = this._cellsUsed.length - 1; t > a; t--) n = this._cellsUsed[t], this._setIndexForCell(n[St] - 1, n)
            }
            dequeueCell() {
                if (0 == this._cellsFreed.length) return null; {
                    let t = this._cellsFreed[0];
                    return this._cellsFreed.splice(0, 1), t
                }
            }
            scrollToTop() {
                this.scrollTo(0, 0)
            }
            scrollToBottom() {
                this.scrollTo(0, this.scrollBar.max)
            }
        }
        class Ct extends Laya.Image {
            constructor(t) {
                super(), this._anisMap = {}, this._interval = 50, t && this.load(t)
            }
            onDestroy() {
                this.clearTimer(this, this._frameLoop)
            }
            load(t) {
                for (const e of t) this._anisMap[e.name] = e;
                return this
            }
            play(t, e, a, n, u, f) {
                !f && this._isPlaying && t == this._curAniName || (this._isPlaying = !0, this._loop = a, this._animation = this._anisMap[t], this._curAniName = t, this._count = this._animation.frames.length, n ? this.interval = n : this._animation.frameRate && (this._interval = 1e3 / this._animation.frameRate), this.activeInHierarchy && (this.clearTimer(this, this._frameLoop), this.timerLoop(this.interval, this, this._frameLoop, null, !0, !0)), this._complete = u, this.index = e || 0)
            }
            _onActiveInScene() {
                super._onActiveInScene(), this.interval > 0 && (this.clearTimer(this, this._frameLoop), this.timerLoop(this.interval, this, this._frameLoop, null, !0, !0))
            }
            gotoAndStop(t, e) {
                this._animation = this._anisMap[t], this._count = this._animation.frames.length, this.index = e, this.stop()
            }
            stop() {
                this._isPlaying = !1, this._curAniName = null, this.clearTimer(this, this._frameLoop)
            }
            pause() {
                this._isPause = !0
            }
            resume() {
                this._isPause = !1
            }
            get isPlaying() {
                return this._isPlaying
            }
            get index() {
                return this._index
            }
            set index(t) {
                this._index = t, this._displayToIndex(t)
            }
            get interval() {
                return this._interval
            }
            set interval(t) {
                this._interval != t && (this._interval = t, this._isPlaying && t > 0 && this.scene && (this.clearTimer(this, this._frameLoop), this.timerLoop(t, this, this._frameLoop, null, !0, !0)))
            }
            _displayToIndex(t) {
                this.skin = this._animation.frames[t]
            }
            _frameLoop() {
                this.destroyed ? this.clearTimer(this, this._frameLoop) : this.visible && this.parent && this._animation && !this._isPause && (this._index++, this._index >= this._count && (this._loop ? this._index = 0 : (this._index = 0, this.stop(), this._complete && this._complete.run())), this.destroyed || (this.index = this._index))
            }
            getCurAniName() {
                return this._curAniName
            }
            hasAni(t) {
                return Boolean(this._anisMap[t])
            }
        }
        class At extends Laya.Sprite {
            constructor(t) {
                super(), this._dir = new a, this._temp = new a, this._tempPoint = new Laya.Point, this._pointSize = 11, this._maxWidth = 40, this._minWidth = 2, this._historySize = 10, this._historyX = [], this._historyY = [], this._startTrail = !1, this._skin = t
            }
            onAwake() {
                this._lastPos = new a(this.x, this.y, 0), this._points = [];
                for (let t = 0; t < this._pointSize; t++) this._points.push(new a(0, 0, 0));
                Laya.loader.load(this._skin, Laya.Handler.create(this, (t => {
                    t && (this._tex = t, this.initCmd(), this.updateVertices())
                }))), this.frameLoop(1, this, this.update)
            }
            onDestroy() {
                this.clearTimer(this, this.update)
            }
            initCmd() {
                this._vertices = new Float32Array(4 * this._pointSize);
                let t = new Float32Array(4 * this._pointSize),
                    e = new Uint16Array(6 * (this._pointSize - 1));
                for (let t = 1; t < this._pointSize; ++t) {
                    let a = 6 * (t - 1),
                        n = 2 * (t - 1);
                    e[a] = n, e[a + 1] = n + 1, e[a + 2] = n + 2, e[a + 3] = n + 2, e[a + 4] = n + 1, e[a + 5] = n + 3
                }
                this._cmd = this.graphics.drawTriangles(this._tex, 0, 0, this._vertices, t, e)
            }
            updateVertices() {
                if (this._points.length <= 1) return;
                let t = 0,
                    e = this._points[0],
                    n = [0];
                for (let u = 1; u < this._points.length; ++u) {
                    let f = this._points[u],
                        g = a.distance(f, e);
                    t += g, e = f, n.push(g)
                }
                let u = 0;
                e = this._points[0], a.subtract(this._points[0], this._points[1], this._dir);
                for (let e = 0; e < this._points.length; ++e) {
                    u += n[e];
                    let f = this._points[e],
                        g = this._minWidth + (this._maxWidth - this._minWidth) * (t - u) / t;
                    a.cross(this._dir, a.UnitZ, this._temp), this._temp.normalize(g / 2);
                    let _ = 4 * e;
                    this._vertices[_] = f.x + this._temp.x, this._vertices[_ + 1] = f.y + this._temp.y, this._vertices[_ + 2] = f.x - this._temp.x, this._vertices[_ + 3] = f.y - this._temp.y, e > 0 && a.subtract(this._points[e - 1], f, this._dir)
                }
            }
            update() {
                if (!this._cmd || !this.visible || !this._startTrail) return;
                this._tempPoint.setTo(0, 0), this.localToGlobal(this._tempPoint), this._historyX.length >= this._historySize && this._historyX.pop(), this._historyX.unshift(this._tempPoint.x), this._historyY.length >= this._historySize && this._historyY.pop(), this._historyY.unshift(this._tempPoint.y);
                let t = 0,
                    e = 0;
                for (var a = 0; a < this._pointSize; a++) {
                    var n = this._points[a];
                    a < this._historyX.length ? (n.x = this._historyX[a] - this._tempPoint.x, n.y = this._historyY[a] - this._tempPoint.y, t = n.x, e = n.y) : (n.x = t, n.y = e)
                }
                this.updateVertices(), this._lastPos.setValue(this._tempPoint.x, this._tempPoint.y, 0)
            }
            start() {
                this._startTrail || (this.visible = !0, this._startTrail = !0, this.update())
            }
            stop() {
                this.visible = !1, this._startTrail = !1;
                for (let t = 0; t < this._points.length; t++) this._points[t].setValue(0, 0, 0);
                this._historyX = [], this._historyY = []
            }
        }
        class Mt {
            constructor(t, e) {
                this.x = 0, this.y = 0, this.x = t, this.y = e
            }
            plus(t) {
                return new Mt(this.x + t.x, this.y + t.y)
            }
            minus(t) {
                return new Mt(this.x - t.x, this.y - t.y)
            }
            multiply(t) {
                return this.x * t.x + this.y * t.y
            }
            scale(t) {
                return new Mt(this.x * t, this.y * t)
            }
            copy(t) {
                return this.x = t.x, this.y = t.y, this
            }
            clone() {
                return new Mt(this.x, this.y)
            }
            substract(t, e) {
                return t.x -= e.x, t.y -= e.y, t
            }
            lengthSqr() {
                return Math.pow(this.x, 2) + Math.pow(this.y, 2)
            }
        }
        class It {}
        class Ot {}
        class kt {
            constructor(t, e) {
                this.key = t, this.value = e
            }
        }
        class Nt {
            static absSq(t) {
                return t.multiply(t)
            }
            static normalize(t) {
                return t.scale(1 / Nt.abs(t))
            }
            static distSqPointLineSegment(t, e, a) {
                let n = a.minus(t),
                    u = e.minus(t),
                    f = n.multiply(u) / Nt.absSq(u);
                return f < 0 ? Nt.absSq(n) : f > 1 ? Nt.absSq(a.minus(e)) : Nt.absSq(a.minus(t.plus(u.scale(f))))
            }
            static sqr(t) {
                return t * t
            }
            static det(t, e) {
                return t.x * e.y - t.y * e.x
            }
            static abs(t) {
                return Math.sqrt(Nt.absSq(t))
            }
            static leftOf(t, e, a) {
                return Nt.det(t.minus(a), e.minus(t))
            }
        }
        Nt.RVO_EPSILON = 1e-5;
        class Pt {
            constructor() {
                this.agentNeighbors_ = [], this.obstaclNeighbors_ = [], this.orcaLines_ = [], this.position_ = new Mt(0, 0), this.prefVelocity_ = new Mt(0, 0), this.velocity_ = new Mt(0, 0), this.id = 0, this.maxNeighbors_ = 0, this.maxSpeed_ = 0, this.neighborDist = 0, this.radius_ = 0, this.timeHorizon = 0, this.timeHorizonObst = 0, this.newVelocity_ = new Mt(0, 0), this.mass = 1
            }
            computeNeighbors(t) {
                this.obstaclNeighbors_.length = 0;
                let e = Math.pow(this.timeHorizonObst * this.maxSpeed_ + this.radius_, 2);
                t.kdTree.computeObstacleNeighbors(this, e), this.agentNeighbors_.length = 0, this.maxNeighbors_ > 0 && (e = Math.pow(this.neighborDist, 2), e = t.kdTree.computeAgentNeighbors(this, e))
            }
            computeNewVelocity(t) {
                this.orcaLines_.length = 0;
                let e = this.orcaLines_,
                    a = 1 / this.timeHorizonObst;
                for (let t = 0; t < this.obstaclNeighbors_.length; ++t) {
                    let n = this.obstaclNeighbors_[t].value,
                        u = n.next,
                        f = n.point.minus(this.position_),
                        g = u.point.minus(this.position_),
                        _ = !1;
                    for (let t = 0; t < e.length; ++t)
                        if (Nt.det(f.scale(a).minus(e[t].point), e[t].direction) - a * this.radius_ >= -Nt.RVO_EPSILON && Nt.det(g.scale(a).minus(e[t].point), e[t].direction) - a * this.radius_ >= -Nt.RVO_EPSILON) {
                            _ = !0;
                            break
                        }
                    if (_) continue;
                    let p, y, m = Nt.absSq(f),
                        b = Nt.absSq(g),
                        w = Nt.sqr(this.radius_),
                        x = u.point.minus(n.point),
                        v = f.scale(-1).multiply(x) / Nt.absSq(x),
                        S = Nt.absSq(f.scale(-1).minus(x.scale(v))),
                        E = new Ot;
                    if (v < 0 && m <= w) {
                        n.convex && (E.point = new Mt(0, 0), E.direction = Nt.normalize(new Mt(-f.y, f.x)), e.push(E));
                        continue
                    }
                    if (v > 1 && b <= w) {
                        u.convex && Nt.det(g, u.direction) >= 0 && (E.point = new Mt(0, 0), E.direction = Nt.normalize(new Mt(-g.y, g.x)), e.push(E));
                        continue
                    }
                    if (v >= 0 && v <= 1 && S <= w) {
                        E.point = new Mt(0, 0), E.direction = n.direction.scale(-1), e.push(E);
                        continue
                    }
                    if (v < 0 && S <= w) {
                        if (!n.convex) continue;
                        u = n;
                        let t = Math.sqrt(m - w);
                        p = new Mt(f.x * t - f.y * this.radius_, f.x * this.radius_ + f.y * t).scale(1 / m), y = new Mt(f.x * t + f.y * this.radius_, -f.x * this.radius_ + f.y * t).scale(1 / m)
                    } else if (v > 1 && S <= w) {
                        if (!u.convex) continue;
                        n = u;
                        let t = Math.sqrt(b - w);
                        p = new Mt(g.x * t - g.y * this.radius_, g.x * this.radius_ + g.y * t).scale(1 / b), y = new Mt(g.x * t + g.y * this.radius_, -g.x * this.radius_ + g.y * t).scale(1 / b)
                    } else {
                        if (n.convex) {
                            let t = Math.sqrt(m - w);
                            p = new Mt(f.x * t - f.y * this.radius_, f.x * this.radius_ + f.y * t).scale(1 / m)
                        } else p = n.direction.scale(-1);
                        if (u.convex) {
                            let t = Math.sqrt(b - w);
                            y = new Mt(g.x * t + g.y * this.radius_, -g.x * this.radius_ + g.y * t).scale(1 / b)
                        } else y = n.direction
                    }
                    let C = n.previous,
                        A = !1,
                        k = !1;
                    n.convex && Nt.det(p, C.direction.scale(-1)) >= 0 && (p = C.direction.scale(-1), A = !0), u.convex && Nt.det(y, u.direction) <= 0 && (y = u.direction, k = !0);
                    let B = n.point.minus(this.position_).scale(a),
                        R = u.point.minus(this.position_).scale(a),
                        z = R.minus(B),
                        V = n == u ? .5 : this.velocity_.minus(B).multiply(z) / Nt.absSq(z),
                        Z = this.velocity_.minus(B).multiply(p),
                        $ = this.velocity_.minus(R).multiply(y);
                    if (V < 0 && Z < 0 || n == u && Z < 0 && $ < 0) {
                        let t = Nt.normalize(this.velocity_.minus(B));
                        E.direction = new Mt(t.y, -t.x), E.point = B.plus(t.scale(this.radius_ * a)), e.push(E);
                        continue
                    }
                    if (V > 1 && $ < 0) {
                        let t = Nt.normalize(this.velocity_.minus(R));
                        E.direction = new Mt(t.y, -t.x), E.point = R.plus(t.scale(this.radius_ * a)), e.push(E);
                        continue
                    }
                    let J = V < 0 || V > 1 || n == u ? 1 / 0 : Nt.absSq(this.velocity_.minus(z.scale(V).plus(B))),
                        tt = Z < 0 ? 1 / 0 : Nt.absSq(this.velocity_.minus(p.scale(Z).plus(B))),
                        et = $ < 0 ? 1 / 0 : Nt.absSq(this.velocity_.minus(y.scale($).plus(R)));
                    if (J <= tt && J <= et) {
                        E.direction = n.direction.scale(-1);
                        let t = new Mt(-E.direction.y, E.direction.x);
                        E.point = t.scale(this.radius_ * a).plus(B), e.push(E)
                    } else {
                        if (!(tt <= et)) {
                            if (k) continue;
                            E.direction = y.scale(-1);
                            let t = new Mt(-E.direction.y, E.direction.x);
                            E.point = t.scale(this.radius_ * a).plus(R), e.push(E);
                            continue
                        } {
                            if (A) continue;
                            E.direction = p;
                            let t = new Mt(-E.direction.y, E.direction.x);
                            E.point = t.scale(this.radius_ * a).plus(B), e.push(E)
                        }
                    }
                }
                let n = e.length,
                    u = 1 / this.timeHorizon;
                for (let a = 0; a < this.agentNeighbors_.length; ++a) {
                    let n, f = this.agentNeighbors_[a].value,
                        g = f.position_.minus(this.position_),
                        _ = f.mass / (this.mass + f.mass),
                        p = this.mass / (this.mass + f.mass),
                        y = _ >= .5 ? this.velocity_.minus(this.velocity_.scale(_)).scale(2) : this.prefVelocity_.plus(this.velocity_.minus(this.prefVelocity_).scale(2 * _)),
                        m = p >= .5 ? f.velocity_.scale(2).scale(1 - p) : f.prefVelocity_.plus(f.velocity_.minus(f.prefVelocity_).scale(2 * p)),
                        b = y.minus(m),
                        w = Nt.absSq(g),
                        x = this.radius_ + f.radius_,
                        v = Nt.sqr(x),
                        S = new Ot;
                    if (w > v) {
                        let t = b.minus(g.scale(u)),
                            e = Nt.absSq(t),
                            a = t.multiply(g);
                        if (a < 0 && Nt.sqr(a) > v * e) {
                            let a = Math.sqrt(e),
                                f = t.scale(1 / a);
                            S.direction = new Mt(f.y, -f.x), n = f.scale(x * u - a)
                        } else {
                            let e = Math.sqrt(w - v);
                            if (Nt.det(g, t) > 0) {
                                let t = new Mt(g.x * e - g.y * x, g.x * x + g.y * e);
                                S.direction = t.scale(1 / w)
                            } else {
                                let t = new Mt(g.x * e + g.y * x, -g.x * x + g.y * e);
                                S.direction = t.scale(-1 / w)
                            }
                            let a = b.multiply(S.direction);
                            n = S.direction.scale(a).minus(b)
                        }
                    } else {
                        let e = 1 / t,
                            a = b.minus(g.scale(e)),
                            u = Nt.abs(a),
                            f = a.scale(1 / u);
                        S.direction = new Mt(f.y, -f.x), n = f.scale(x * e - u)
                    }
                    S.point = y.plus(n.scale(_)), e.push(S)
                }
                let f = this.linearProgram2(e, this.maxSpeed_, this.prefVelocity_, !1, this.newVelocity_);
                f < e.length && this.linearProgram3(e, n, f, this.maxSpeed_, this.newVelocity_)
            }
            insertAgentNeighbor(t, e) {
                if (this != t) {
                    let a = Nt.absSq(this.position_.minus(t.position_));
                    if (a < e) {
                        this.agentNeighbors_.length < this.maxNeighbors_ && this.agentNeighbors_.push(new kt(a, t));
                        let n = this.agentNeighbors_.length - 1;
                        for (; 0 != n && a < this.agentNeighbors_[n - 1].key;) this.agentNeighbors_[n] = this.agentNeighbors_[n - 1], --n;
                        this.agentNeighbors_[n] = new kt(a, t), this.agentNeighbors_.length == this.maxNeighbors_ && (e = this.agentNeighbors_[this.agentNeighbors_.length - 1].key)
                    }
                }
                return e
            }
            insertObstacleNeighbor(t, e) {
                let a = t.next,
                    n = Nt.distSqPointLineSegment(t.point, a.point, this.position_);
                if (n < e) {
                    this.obstaclNeighbors_.push(new kt(n, t));
                    let e = this.obstaclNeighbors_.length - 1;
                    for (; 0 != e && n < this.obstaclNeighbors_[e - 1].key;) this.obstaclNeighbors_[e] = this.obstaclNeighbors_[e - 1], --e;
                    this.obstaclNeighbors_[e] = new kt(n, t)
                }
            }
            update(t) {
                this.velocity_.copy(this.newVelocity_), this.position_.copy(this.position_.plus(this.velocity_.scale(t)))
            }
            linearProgram1(t, e, a, n, u, f) {
                let g = t[e].point.multiply(t[e].direction),
                    _ = Nt.sqr(g) + Nt.sqr(a) - Nt.absSq(t[e].point);
                if (_ < 0) return !1;
                let p = Math.sqrt(_),
                    y = -g - p,
                    m = -g + p;
                for (let a = 0; a < e; ++a) {
                    let n = Nt.det(t[e].direction, t[a].direction),
                        u = Nt.det(t[a].direction, t[e].point.minus(t[a].point));
                    if (Math.abs(n) <= Nt.RVO_EPSILON) {
                        if (u < 0) return !1;
                        continue
                    }
                    let f = u / n;
                    if (n >= 0 ? m = Math.min(m, f) : y = Math.max(y, f), y > m) return !1
                }
                if (u) n.multiply(t[e].direction) > 0 ? f.copy(t[e].point.plus(t[e].direction.scale(m))) : f.copy(t[e].point.plus(t[e].direction.scale(y)));
                else {
                    let a = t[e].direction.multiply(n.minus(t[e].point));
                    a < y ? f.copy(t[e].point.plus(t[e].direction.scale(y))) : a > m ? f.copy(t[e].point.plus(t[e].direction.scale(m))) : f.copy(t[e].point.plus(t[e].direction.scale(a)))
                }
                return !0
            }
            linearProgram2(t, e, a, n, u) {
                n ? u.copy(a.scale(e)) : Nt.absSq(a) > Nt.sqr(e) ? u.copy(Nt.normalize(a).scale(e)) : u.copy(a);
                for (let f = 0; f < t.length; ++f)
                    if (Nt.det(t[f].direction, t[f].point.minus(u)) > 0) {
                        let g = u.clone();
                        if (!this.linearProgram1(t, f, e, a, n, u)) return u.copy(g), f
                    }
                return t.length
            }
            linearProgram3(t, e, a, n, u) {
                let f = 0;
                for (let g = a; g < t.length; ++g)
                    if (Nt.det(t[g].direction, t[g].point.minus(u)) > f) {
                        let a = [];
                        for (let n = 0; n < e; ++n) a.push(t[n]);
                        for (let n = e; n < g; ++n) {
                            let e = new Ot,
                                u = Nt.det(t[g].direction, t[n].direction);
                            if (Math.abs(u) <= Nt.RVO_EPSILON) {
                                if (t[g].direction.multiply(t[n].direction) > 0) continue;
                                e.point = t[g].point.plus(t[n].point).scale(.5)
                            } else e.point = t[g].point.plus(t[g].direction.scale(Nt.det(t[n].direction, t[g].point.minus(t[n].point)) / u));
                            e.direction = Nt.normalize(t[n].direction.minus(t[g].direction)), a.push(e)
                        }
                        let _ = u.clone();
                        this.linearProgram2(a, n, new Mt(-t[g].direction.y, t[g].direction.x), !0, u) < a.length && u.copy(_), f = Nt.det(t[g].direction, t[g].point.minus(u))
                    }
            }
        }
        class Bt {
            constructor(t, e) {
                this.a = t, this.b = e
            }
            lessThan(t) {
                return this.a < t.a || !(t.a < this.a) && this.b < t.b
            }
            lessEqualThan(t) {
                return this.a == t.a && this.b == t.b || this.lessThan(t)
            }
            bigThan(t) {
                return !this.lessEqualThan(t)
            }
            bigEqualThan(t) {
                return !this.lessThan(t)
            }
        }
        class Rt {}
        class Dt {}
        class Ut {
            constructor(t) {
                this.MAX_LEAF_SIZE = 10, this.agents = null, this.agentTree = [], this.obstacleTree = null, this._sim = t
            }
            buildAgentTree(t) {
                if (!this.agents || this.agents.length != t) {
                    this.agents = new Array(t);
                    for (let t = 0; t < this.agents.length; t++) this.agents[t] = this._sim.getAgent(t);
                    this.agentTree = new Array(2 * this.agents.length);
                    for (let t = 0; t < this.agentTree.length; t++) this.agentTree[t] = new Rt
                }
                0 != this.agents.length && this.buildAgentTreeRecursive(0, this.agents.length, 0)
            }
            buildObstacleTree() {
                this.obstacleTree = new Dt;
                let t = new Array(this._sim.obstacles.length);
                for (let e = 0; e < t.length; e++) t[e] = this._sim.obstacles[e];
                this.obstacleTree = this.buildObstacleTreeRecursive(t)
            }
            computeAgentNeighbors(t, e) {
                return this.queryAgentTreeRecursive(t, e, 0)
            }
            computeObstacleNeighbors(t, e) {
                this.queryObstacleTreeRecursive(t, e, this.obstacleTree)
            }
            queryVisibility(t, e, a) {
                return this.queryVisibilityRecursive(t, e, a, this.obstacleTree)
            }
            buildAgentTreeRecursive(t, e, a) {
                this.agentTree[a].begin = t, this.agentTree[a].end = e, this.agentTree[a].minX = this.agentTree[a].maxX = this.agents[t].position_.x, this.agentTree[a].minY = this.agentTree[a].maxY = this.agents[t].position_.y;
                for (let n = t + 1; n < e; ++n) this.agentTree[a].maxX = Math.max(this.agentTree[a].maxX, this.agents[n].position_.x), this.agentTree[a].minX = Math.min(this.agentTree[a].minX, this.agents[n].position_.x), this.agentTree[a].maxY = Math.max(this.agentTree[a].maxY, this.agents[n].position_.y), this.agentTree[a].minY = Math.min(this.agentTree[a].minY, this.agents[n].position_.y);
                if (e - t > this.MAX_LEAF_SIZE) {
                    let n = this.agentTree[a].maxX - this.agentTree[a].minX > this.agentTree[a].maxY - this.agentTree[a].minY,
                        u = .5 * (n ? this.agentTree[a].maxX + this.agentTree[a].minX : this.agentTree[a].maxY + this.agentTree[a].minY),
                        f = t,
                        g = e;
                    for (; f < g;) {
                        for (; f < g && (n ? this.agents[f].position_.x : this.agents[f].position_.y) < u;) ++f;
                        for (; g > f && (n ? this.agents[g - 1].position_.x : this.agents[g - 1].position_.y) >= u;) --g;
                        if (f < g) {
                            let t = this.agents[f];
                            this.agents[f] = this.agents[g - 1], this.agents[g - 1] = t, ++f, --g
                        }
                    }
                    let _ = f - t;
                    0 == _ && (++_, ++f, ++g), this.agentTree[a].left = a + 1, this.agentTree[a].right = a + 2 * _, this.buildAgentTreeRecursive(t, f, this.agentTree[a].left), this.buildAgentTreeRecursive(f, e, this.agentTree[a].right)
                }
            }
            buildObstacleTreeRecursive(t) {
                if (0 == t.length) return null; {
                    let e = new Dt,
                        a = 0,
                        n = t.length,
                        u = n;
                    for (let e = 0; e < t.length; ++e) {
                        let f = 0,
                            g = 0,
                            _ = t[e],
                            p = _.next;
                        for (let a = 0; a < t.length; a++) {
                            if (e == a) continue;
                            let y = t[a],
                                m = y.next,
                                b = Nt.leftOf(_.point, p.point, y.point),
                                w = Nt.leftOf(_.point, p.point, m.point);
                            b >= -Nt.RVO_EPSILON && w >= -Nt.RVO_EPSILON ? ++f : (b <= Nt.RVO_EPSILON && w <= Nt.RVO_EPSILON || ++f, ++g);
                            let x = new Bt(Math.max(f, g), Math.min(f, g)),
                                v = new Bt(Math.max(n, u), Math.min(n, u));
                            if (x.bigEqualThan(v)) break
                        }
                        let y = new Bt(Math.max(f, g), Math.min(f, g)),
                            m = new Bt(Math.max(n, u), Math.min(n, u));
                        y.lessThan(m) && (n = f, u = g, a = e)
                    } {
                        let f = [];
                        for (let t = 0; t < n; ++t) f.push(null);
                        let g = [];
                        for (let t = 0; t < u; ++t) g.push(null);
                        let _ = 0,
                            p = 0,
                            y = a,
                            m = t[y],
                            b = m.next;
                        for (let e = 0; e < t.length; ++e) {
                            if (y == e) continue;
                            let a = t[e],
                                n = a.next,
                                u = Nt.leftOf(m.point, b.point, a.point),
                                w = Nt.leftOf(m.point, b.point, n.point);
                            if (u >= -Nt.RVO_EPSILON && w >= -Nt.RVO_EPSILON) f[_++] = t[e];
                            else if (u <= Nt.RVO_EPSILON && w <= Nt.RVO_EPSILON) g[p++] = t[e];
                            else {
                                let t = Nt.det(b.point.minus(m.point), a.point.minus(m.point)) / Nt.det(b.point.minus(m.point), a.point.minus(n.point)),
                                    e = a.point.plus(n.point.minus(a.point).scale(t)),
                                    y = new It;
                                y.point = e, y.previous = a, y.next = n, y.convex = !0, y.direction = a.direction, y.id = this._sim.obstacles.length, this._sim.obstacles.push(y), a.next = y, n.previous = y, u > 0 ? (f[_++] = a, g[p++] = y) : (g[p++] = a, f[_++] = y)
                            }
                        }
                        return e.obstacle = m, e.left = this.buildObstacleTreeRecursive(f), e.right = this.buildObstacleTreeRecursive(g), e
                    }
                }
            }
            queryAgentTreeRecursive(t, e, a) {
                if (this.agentTree[a].end - this.agentTree[a].begin <= this.MAX_LEAF_SIZE)
                    for (let n = this.agentTree[a].begin; n < this.agentTree[a].end; ++n) e = t.insertAgentNeighbor(this.agents[n], e);
                else {
                    let n = Nt.sqr(Math.max(0, this.agentTree[this.agentTree[a].left].minX - t.position_.x)) + Nt.sqr(Math.max(0, t.position_.x - this.agentTree[this.agentTree[a].left].maxX)) + Nt.sqr(Math.max(0, this.agentTree[this.agentTree[a].left].minY - t.position_.y)) + Nt.sqr(Math.max(0, t.position_.y - this.agentTree[this.agentTree[a].left].maxY)),
                        u = Nt.sqr(Math.max(0, this.agentTree[this.agentTree[a].right].minX - t.position_.x)) + Nt.sqr(Math.max(0, t.position_.x - this.agentTree[this.agentTree[a].right].maxX)) + Nt.sqr(Math.max(0, this.agentTree[this.agentTree[a].right].minY - t.position_.y)) + Nt.sqr(Math.max(0, t.position_.y - this.agentTree[this.agentTree[a].right].maxY));
                    n < u ? n < e && u < (e = this.queryAgentTreeRecursive(t, e, this.agentTree[a].left)) && (e = this.queryAgentTreeRecursive(t, e, this.agentTree[a].right)) : u < e && n < (e = this.queryAgentTreeRecursive(t, e, this.agentTree[a].right)) && (e = this.queryAgentTreeRecursive(t, e, this.agentTree[a].left))
                }
                return e
            }
            queryObstacleTreeRecursive(t, e, a) {
                if (null == a) return e; {
                    let n = a.obstacle,
                        u = n.next,
                        f = Nt.leftOf(n.point, u.point, t.position_);
                    return e = this.queryObstacleTreeRecursive(t, e, f >= 0 ? a.left : a.right), Nt.sqr(f) / Nt.absSq(u.point.minus(n.point)) < e && (f < 0 && t.insertObstacleNeighbor(a.obstacle, e), this.queryObstacleTreeRecursive(t, e, f >= 0 ? a.right : a.left)), e
                }
            }
            queryVisibilityRecursive(t, e, a, n) {
                if (null == n) return !0; {
                    let u = n.obstacle,
                        f = u.next,
                        g = Nt.leftOf(u.point, f.point, t),
                        _ = Nt.leftOf(u.point, f.point, e),
                        p = 1 / Nt.absSq(f.point.minus(u.point));
                    if (g >= 0 && _ >= 0) return this.queryVisibilityRecursive(t, e, a, n.left) && (Nt.sqr(g) * p >= Nt.sqr(a) && Nt.sqr(_) * p >= Nt.sqr(a) || this.queryVisibilityRecursive(t, e, a, n.right));
                    if (g <= 0 && _ <= 0) return this.queryVisibilityRecursive(t, e, a, n.right) && (Nt.sqr(g) * p >= Nt.sqr(a) && Nt.sqr(_) * p >= Nt.sqr(a) || this.queryVisibilityRecursive(t, e, a, n.left));
                    if (g >= 0 && _ <= 0) return this.queryVisibilityRecursive(t, e, a, n.left) && this.queryVisibilityRecursive(t, e, a, n.right); {
                        let g = Nt.leftOf(t, e, u.point),
                            _ = Nt.leftOf(t, e, f.point),
                            p = 1 / Nt.absSq(e.minus(t));
                        return g * _ >= 0 && Nt.sqr(g) * p > Nt.sqr(a) && Nt.sqr(_) * p > Nt.sqr(a) && this.queryVisibilityRecursive(t, e, a, n.left) && this.queryVisibilityRecursive(t, e, a, n.right)
                    }
                }
            }
        }
        class zt {
            constructor(t = !0) {
                this.firstloginTimestamp = void 0, this.logindays = void 0, this.redBag = void 0, this.redBagCnt = void 0, this.noticeVer = void 0, t && f.warpObjectGetterSetter(this, this.dirty)
            }
            dirty(t) {
                Ft.instance.save(t, this[t])
            }
        }
        class Ft extends gt {
            constructor() {
                super(), this.readySaveProps = []
            }
            static get instance() {
                return this._instance || (this._instance = new Ft), this._instance
            }
            onInit(t) {
                let loadData = t => {
                    for (const e in t)
                        if (t.hasOwnProperty(e)) {
                            let a = this.unserialize(e);
                            null != a && "" !== a && (t[e] = a)
                        }
                    t.openId = this.unserialize("openId"), t.name = this.unserialize("name")
                };
                if (t) {
                    let e = new t;
                    loadData(e);
                    for (const t in this.mine)
                        if (this.mine.hasOwnProperty(t)) {
                            let a = this.mine[t];
                            null != a && "" !== a && (e[t] = a)
                        }
                    this.mine = e
                } else this.mine = new zt, loadData(this.mine), this.initData()
            }
            initData() {
                if (void 0 === this.mine.firstloginTimestamp ? (this.mine.firstloginTimestamp = f.getTime(), this.firstLogin = !0) : this.firstLogin = !1, void 0 === this.mine.logindays) this.mine.logindays = 1, this.newDay = !0;
                else {
                    let t = f.getDayInYear(new Date(this.mine.firstloginTimestamp)),
                        e = f.getDayInYear() - t + 1;
                    e > this.mine.logindays ? (this.mine.logindays = e, this.newDay = !0) : this.newDay = !1
                }
                void 0 === this.mine.redBag && (this.mine.redBag = 0, this.mine.redBagCnt = 0)
            }
            getMine() {
                return this.mine
            }
            getMineTrimmed() {
                let t = {},
                    e = this.mine;
                for (const a in e)
                    if (e.hasOwnProperty(a) && "_" == a[0]) {
                        let n = a.substring(1);
                        if (n) {
                            let u = e[a];
                            null != u && "" !== u && (t[n] = u)
                        }
                    }
                return t
            }
            getUserInfo() {
                return this.mine
            }
            update(t) {
                let e = t;
                e.savedTimestamp ? (this.isFirstLogin() || this.mine.openId != e.openId) && (this.mine = new zt, f.assign(this.mine, e, !1), this.initData(), e.openId && this.serialize("openId", e.openId), e.name && this.serialize("name", e.name)) : (f.assign(this.mine, e, !1), e.name && this.serialize("name", e.name), e.openId && this.serialize("openId", e.openId))
            }
            save(t, e) {
                t && this.event(V.E_PROP_CHANGED, [t, e]), this.readySaveProps.includes(t) || this.readySaveProps.push(t), 1 == this.readySaveProps.length && Laya.CallLater.I.callLater(this, this._save)
            }
            _save() {
                this.saveToLocal(), this.saveToServer(), this.readySaveProps.length = 0, at.I.event(V.E_ON_USER_SAVED)
            }
            saveToLocal() {
                let t = this.mine,
                    e = this.readySaveProps;
                if (e && e.length > 0)
                    for (const a of e) {
                        let e = "_" + a;
                        if (t.hasOwnProperty(e)) {
                            const a = t[e];
                            this.serialize(e, a)
                        }
                    }
            }
            saveToServer() {
                let t = Laya.ClassUtils.getRegClass("Sdk");
                if (1 !== t.instance.isLoginServer()) return;
                let e = this.getMineTrimmed();
                f.getLength(e) > 0 && t.instance.saveToServer(e)
            }
            serialize(t, e) {
                e instanceof Array ? Laya.LocalStorage.setItem(t, JSON.stringify(e)) : e instanceof Object ? Laya.LocalStorage.setJSON(t, e) : null != e ? Laya.LocalStorage.setItem(t, e) : Laya.LocalStorage.removeItem(t)
            }
            unserialize(t) {
                let e = Laya.LocalStorage.getItem(t);
                if (e) try {
                    e = JSON.parse(e)
                } catch (a) {
                    console.log("unserialize error: ", t, e)
                }
                return e
            }
            isNewDay() {
                return this.newDay
            }
            isFirstLogin() {
                return this.firstLogin
            }
            addRedBag(t) {
                this.mine.redBag += t, this.mine.redBag = Number(this.mine.redBag.toFixed(2)), this.mine.redBagCnt++
            }
            isNewNotice(t) {
                return !!Laya.ClassUtils.getRegClass("Sdk").instance.getServerJsonCfgNoticeHtmlText() && (!!t && (!this.mine.noticeVer || !fx.Utils.compatibleVersion(t, this.mine.noticeVer)))
            }
            readNotice(t) {
                this.isNewNotice(t) && (this.mine.noticeVer = t)
            }
        }
        class Ht {
            static get I() {
                return this._instance || (this._instance = new Ht), this._instance
            }
            init(t, e, a, n, u, f) {
                this.isInit || (this.isInit = !0, this.saveInterval = n, this.timer = new Laya.Timer, this.storageHandler = u, Lt.I.login({
                    serverUrl: t,
                    gameID: e,
                    platform: a,
                    strict: 1,
                    openid: f ? f.openid : "",
                    anonymousOpenid: f ? f.anonymousOpenid : ""
                }, this, this.onLogin), fx.EventCenter.I.on(V.E_ON_USER_SAVED, this, this.onUserSave))
            }
            onLogin() {
                Lt.I.isLogin() ? Lt.I.getStorage(this, this.onGetStorage) : this.storageHandler.run()
            }
            onGetStorage(t) {
                if (t && t.data) try {
                    let e = t.data;
                    e && f.assign(Ft.instance.getUserInfo(), e, !1)
                } catch (t) {
                    console.log(t)
                }
                this.storageHandler.run()
            }
            onUserSave() {
                this.timer.once(1e3 * this.saveInterval, this, this.save)
            }
            save() {
                let t = Ft.instance.getMineTrimmed(),
                    e = JSON.stringify(t);
                Lt.I.setStorage(e)
            }
        }
        class XBase64Encrypt {
            static setBase64Chars(t) {
                this.base64Chars = t
            }
            static init() {
                if (!this.lookup) {
                    this.lookup = new Uint8Array(256);
                    for (var t = 0; t < this.base64Chars.length; t++) this.lookup[this.base64Chars.charCodeAt(t)] = t
                }
            }
            static encode(t) {
                for (var e = new Uint8Array(t), a = e.length, n = "", u = 0; u < a; u += 3) n += this.base64Chars[e[u] >> 2], n += this.base64Chars[(3 & e[u]) << 4 | e[u + 1] >> 4], n += this.base64Chars[(15 & e[u + 1]) << 2 | e[u + 2] >> 6], n += this.base64Chars[63 & e[u + 2]];
                return a % 3 == 2 ? n = n.substring(0, n.length - 1) + "=" : a % 3 == 1 && (n = n.substring(0, n.length - 2) + "=="), n
            }
            static encodeStr(t) {
                let e = new Laya.Byte;
                return e.writeUTFString(t), this.encodeByte(e)
            }
            static encodeStr2(t) {
                let e = new Laya.Byte;
                e.writeUTFBytes(t);
                for (var a = this.encodeByte(e); 0 <= a.indexOf("+");) a = a.replace("+", "%2B");
                for (; 0 <= a.indexOf("&");) a = a.replace("&", "%26");
                for (; 0 <= a.indexOf("=");) a = a.replace("=", "%3D");
                return a
            }
            static encodeByte(t, e = 0, a = -1) {
                return a = a < 0 ? t.length : a, this.encode(t.getUint8Array(e, a).buffer)
            }
            static decodeToByte(t) {
                let e = new Laya.Byte(this.decode(t));
                return e.pos = 0, e
            }
            static decode(t) {
                this.init();
                var e, a, n, u, f = .75 * t.length,
                    g = t.length,
                    _ = 0;
                "=" === t[t.length - 1] && (f--, "=" === t[t.length - 2] && f--);
                let p = new ArrayBuffer(f),
                    y = new Uint8Array(p);
                for (let f = 0; f < g; f += 4) e = this.lookup[t.charCodeAt(f)], a = this.lookup[t.charCodeAt(f + 1)], n = this.lookup[t.charCodeAt(f + 2)], u = this.lookup[t.charCodeAt(f + 3)], y[_++] = e << 2 | a >> 4, y[_++] = (15 & a) << 4 | n >> 2, y[_++] = (3 & n) << 6 | 63 & u;
                return p
            }
        }
        XBase64Encrypt.lookup = null, XBase64Encrypt.base64Chars = "SNPn2QBOR7A1ghiCj5klmY6opZqrEsDFdeG90HIJK8LMtuv3wxyzabTUVWXcf4+/";
        class Xt {
            constructor() {
                this._size = 0, this._size = 0, this._keys = new Array, this._values = new Array
            }
            contains(t) {
                return 0 <= this._keys.indexOf(t)
            }
            containsKey(t) {
                return this.contains(t)
            }
            containsValue(t) {
                return 0 <= this._values.indexOf(t)
            }
            put(t, e) {
                let a = this._keys.indexOf(t);
                a >= 0 ? this._values[a] = e : (this._size++, this._keys.push(t), this._values.push(e))
            }
            remove(t) {
                let e = this._keys.indexOf(t);
                if (e < 0) return null;
                let a = this._values[e];
                return this._keys.splice(e, 1), this._values.splice(e, 1), this._size--, a
            }
            get(t) {
                let e = this._keys.indexOf(t);
                return e < 0 ? null : this._values[e]
            }
            getV(t) {
                return 0 <= t && t < this.length ? this._values[t] : null
            }
            getK(t) {
                return 0 <= t && t < this.length ? this._keys[t] : null
            }
            removeByIndex(t) {
                if (0 <= t && t < this.length) {
                    var e = this._values[t];
                    return this._keys.splice(t, 1), this._values.splice(t, 1), this._size--, e
                }
                return null
            }
            size() {
                return this._size
            }
            get length() {
                return this._size
            }
            isEmpty() {
                return 0 == this._size
            }
            putAll(t) {
                for (let e = 0; e < this._size; ++e) this.put(t._keys[e], t._values[e])
            }
            clear() {
                this.isEmpty() || (this._values.length = 0, this._keys.length = 0, this._size = 0)
            }
            clone() {
                if (this.isEmpty()) return new Xt;
                let t = new Xt;
                t._size = this._size;
                for (let e = 0; e < this._size; ++e) t._keys[e] = this._keys[e], t._values[e] = this._values[e];
                return t
            }
            putIfAbsent(t, e) {
                return this.get(t) || (this._size++, this._keys.push(t), this._values.push(e), null)
            }
            computeIfAbsent(t, e) {
                var a = this.get(t);
                return a || (e = e(t), this._size++, this._keys.push(t), this._values.push(e), e)
            }
            forEach(t) {
                for (let e = 0; e < this._size; ++e) t(this._keys[e], this._values[e])
            }
            forEachSome(t) {
                for (let e = 0; e < this._size && t(this._keys[e], this._values[e]); ++e);
            }
            getKeys() {
                return this._keys
            }
            getValues() {
                return this._values
            }
            forEachValue(t) {
                for (let e = 0; e < this._size; ++e) t(this._values[e])
            }
            getOrDefault(t, e) {
                return this.isEmpty() ? e : 0 <= (t = this._keys.indexOf(t)) ? this._values[t] : e
            }
            getEver() {
                return this.isEmpty() ? null : this._values[0]
            }
        }
        class qt extends Laya.HTMLDivElement {
            constructor(t = "HtmlText") {
                super(), this._defaultStyle = "color:#000000;bold:true;font:30px Arial", this.name = t, this.style.wordWrap = !1
            }
            get defaultStyle() {
                return this._defaultStyle
            }
            set defaultStyle(t) {
                this._defaultStyle = t
            }
            parse(t) {
                let e = t.split("<br/>");
                return t = "", e.forEach((e => {
                    let a = e.split(/(<span.+?<\/span>)/g);
                    0 == a.length && a.push(e);
                    for (const e of a) e && (this.isRichText(e) ? t += e : t += this.defaultRichText(e));
                    t += "<br/>"
                })), t
            }
            defaultRichText(t) {
                return `<span style='${this._defaultStyle}'>${t}</span>`
            }
            isRichText(t) {
                return -1 != t.indexOf("<span")
            }
            setText(t) {
                t && (t = this.parse(t), this.innerHTML = t)
            }
            addImg(t, e) {
                let a = "";
                a = e ? `<img src='${t}' style='${e}'></img>` : `<img src='${t}' ></img>`;
                let n = "",
                    u = this._innerHTML;
                u && (n = u), n += a, this.setText(n)
            }
            addText(t) {
                let e = "",
                    a = this._innerHTML;
                a && (e = a), e += t, this.setText(e)
            }
        }
        class XBTContinuous extends XBTAction {
            constructor({
                duration: t = 0
            } = {}) {
                super({
                    name: "Continuous"
                }), this.duration = t
            }
            tick(e) {
                let a = (new Date).getTime(),
                    n = e.blackboard.get("tick_frame", e.tree.id);
                return null == this.curFrame && (this.curFrame = n, this.startTime = a), n - this.curFrame > 1 && (this.startTime = a), this.curFrame = n, a - this.startTime >= this.duration ? t.BTStatus.SUCCESS : t.BTStatus.FAILURE
            }
        }
        XBTContinuous.register("BTContinuous", t.BTCategory.ACTION);
        class XBTRunner extends XBTAction {
            constructor() {
                super({
                    name: "Runner"
                })
            }
            tick(e) {
                return t.BTStatus.RUNNING
            }
        }
        XBTRunner.register("BTRunner", t.BTCategory.ACTION);
        class XBTFailer extends XBTAction {
            constructor() {
                super({
                    name: "Failer"
                })
            }
            tick(e) {
                return t.BTStatus.FAILURE
            }
        }
        XBTFailer.register("BTFailer", t.BTCategory.ACTION);
        class XBTError extends XBTAction {
            constructor() {
                super({
                    name: "Error"
                })
            }
            tick(t) {
                throw Error("BTError !")
            }
        }
        XBTError.register("BTError", t.BTCategory.ACTION);
        class XBTWait extends XBTAction {
            constructor({
                milliseconds: t = 0
            } = {}) {
                super({
                    name: "Wait",
                    title: "Wait <milliseconds>ms",
                    properties: {
                        milliseconds: 0
                    }
                }), this.endTime = t
            }
            open(t) {
                let e = (new Date).getTime();
                t.blackboard.set("startTime", e, t.tree.id, this.id)
            }
            tick(e) {
                return (new Date).getTime() - e.blackboard.get("startTime", e.tree.id, this.id) > this.endTime ? t.BTStatus.SUCCESS : t.BTStatus.RUNNING
            }
        }
        XBTWait.register("BTWait", t.BTCategory.ACTION);
        class XBTSucceeder extends XBTAction {
            constructor() {
                super({
                    name: "Succeeder"
                })
            }
            tick(e) {
                return t.BTStatus.SUCCESS
            }
        }
        XBTSucceeder.register("BTSucceeder", t.BTCategory.ACTION);
        class XBTWaitUtil extends XBTAction {
            constructor({
                condition: t = null,
                child: e = null
            } = {}) {
                super({
                    name: "WaitUtil",
                    title: "WaitUtil <condition>"
                }), this.cdt = t, this.child = e
            }
            tick(e) {
                if (!this.cdt) throw Error("must have condition node !");
                let a = this.cdt._execute(e);
                return a == t.BTStatus.SUCCESS ? a : (this.child && this.child._execute(e), t.BTStatus.RUNNING)
            }
        }
        XBTWaitUtil.register("BTWaitUtil", t.BTCategory.ACTION);
        class XBTParallel extends XBTComposite {
            constructor({
                children: e = [],
                successPolicy: a = t.EPolicy.RequireOne
            } = {}) {
                super({
                    name: "Parallel",
                    children: e
                }), this.successPolicy = a
            }
            tickRunning(e, a) {
                let n = [];
                if (void 0 !== a && a.length > 0) {
                    let u = a.length;
                    for (; u--;) {
                        let f = a[u],
                            g = this.children[f]._execute(e);
                        n[f] = g, g != t.BTStatus.RUNNING && a.splice(u, 1)
                    }
                    0 == a.length && e.blackboard.set("runningChild", void 0, e.tree.id, this.id)
                }
                return n
            }
            tick(e) {
                let a, n = e.blackboard.get("runningChild", e.tree.id, this.id);
                n && (a = n.concat());
                let u = this.tickRunning(e, n);
                if (u.length > 0 && u.includes(t.BTStatus.RUNNING)) return t.BTStatus.RUNNING;
                let f = 0,
                    g = this.children.length;
                for (let g = 0; g < this.children.length; g++) {
                    if (a && a.includes(g)) {
                        u[g] == t.BTStatus.SUCCESS && f++;
                        continue
                    }
                    let _ = this.children[g]._execute(e);
                    _ == t.BTStatus.RUNNING && (n ? n.push(g) : n = [g], e.blackboard.set("runningChild", n, e.tree.id, this.id)), _ == t.BTStatus.SUCCESS && f++
                }
                return this.successPolicy == t.EPolicy.RequireAll && f == g || this.successPolicy == t.EPolicy.RequireOne && f > 0 ? t.BTStatus.SUCCESS : t.BTStatus.FAILURE
            }
        }
        XBTParallel.register("BTParallel", t.BTCategory.COMPOSITE);
        class XBTSequence extends XBTComposite {
            constructor({
                children: e = [],
                continuePolicy: a = t.BTStatus.FAILURE,
                successPolicy: n = t.EPolicy.RequireOne
            } = {}) {
                super({
                    name: "Sequence",
                    children: e
                }), this.continuePolicy = a, this.successPolicy = n
            }
            open(t) {
                t.blackboard.set("runningChild", 0, t.tree.id, this.id)
            }
            tick(e) {
                let a = 0,
                    n = e.blackboard.get("runningChild", e.tree.id, this.id);
                for (let u = n; u < this.children.length; u++) {
                    let n = this.children[u]._execute(e);
                    if (n === t.BTStatus.RUNNING) return e.blackboard.set("runningChild", u, e.tree.id, this.id), n;
                    if (n == t.BTStatus.SUCCESS && a++, n != this.continuePolicy) break
                }
                return 0 != n && (a += n), this.successPolicy == t.EPolicy.RequireOne && a > 0 || this.successPolicy == t.EPolicy.RequireAll && a == this.children.length ? t.BTStatus.SUCCESS : t.BTStatus.FAILURE
            }
        }
        XBTSequence.register("BTSequence", t.BTCategory.COMPOSITE);
        class XBTLimiter extends XBTDecorator {
            constructor({
                child: t = null,
                maxLoop: e = 0
            } = {}) {
                if (super({
                        child: t,
                        name: "Limiter",
                        title: "Limit <maxLoop> Activations",
                        properties: {
                            maxLoop: 1
                        }
                    }), !e) throw "maxLoop parameter in Limiter decorator is an obligatory parameter";
                this.maxLoop = e
            }
            open(t) {
                t.blackboard.set("i", 0, t.tree.id, this.id)
            }
            tick(e) {
                if (!this.child) throw Error("BTLimiter no child !");
                let a = e.blackboard.get("i", e.tree.id, this.id);
                if (a < this.maxLoop) {
                    let n = this.child._execute(e);
                    return n != t.BTStatus.SUCCESS && n != t.BTStatus.FAILURE || e.blackboard.set("i", a + 1, e.tree.id, this.id), n
                }
                return t.BTStatus.FAILURE
            }
        }
        XBTLimiter.register("BTLimiter", t.BTCategory.DECORATOR);
        class XBTMaxTime extends XBTDecorator {
            constructor({
                maxTime: t = 0,
                child: e = null
            } = {}) {
                if (super({
                        child: e,
                        name: "MaxTime",
                        title: "Max <maxTime>ms",
                        properties: {
                            maxTime: 0
                        }
                    }), !t) throw "maxTime parameter in MaxTime decorator is an obligatory parameter";
                this.maxTime = t
            }
            open(t) {
                let e = (new Date).getTime();
                t.blackboard.set("startTime", e, t.tree.id, this.id)
            }
            tick(e) {
                if (!this.child) throw Error("BTStatus no child !");
                let a = (new Date).getTime(),
                    n = e.blackboard.get("startTime", e.tree.id, this.id),
                    u = this.child._execute(e);
                return a - n > this.maxTime ? t.BTStatus.FAILURE : u
            }
        }
        XBTMaxTime.register("BTMaxTime", t.BTCategory.DECORATOR);
        class XBTInverter extends XBTDecorator {
            constructor({
                child: t = null
            } = {}) {
                super({
                    child: t,
                    name: "Inverter"
                })
            }
            tick(e) {
                if (!this.child) throw Error("BTInverter no child !");
                let a = this.child._execute(e);
                return a == t.BTStatus.SUCCESS ? a = t.BTStatus.FAILURE : a == t.BTStatus.FAILURE && (a = t.BTStatus.SUCCESS), a
            }
        }
        XBTInverter.register("BTInverter", t.BTCategory.DECORATOR);
        class XBTRepeater extends XBTDecorator {
            constructor({
                maxLoop: t = -1,
                child: e = null
            } = {}) {
                super({
                    child: e,
                    name: "Repeater",
                    title: "Repeat <maxLoop>x",
                    properties: {
                        maxLoop: -1
                    }
                }), this.maxLoop = t
            }
            open(t) {
                t.blackboard.set("i", 0, t.tree.id, this.id)
            }
            tick(e) {
                if (!this.child) throw Error("BTRepeater no child !");
                let a = e.blackboard.get("i", e.tree.id, this.id),
                    n = t.BTStatus.SUCCESS;
                for (;
                    (this.maxLoop < 0 || a < this.maxLoop) && (n = this.child._execute(e), n == t.BTStatus.SUCCESS || n == t.BTStatus.FAILURE);) a++;
                return e.blackboard.set("i", a, e.tree.id, this.id), n
            }
        }
        XBTRepeater.register("BTRepeater", t.BTCategory.DECORATOR);
        class XBTRepeatUntilFailure extends XBTDecorator {
            constructor({
                maxLoop: t = -1,
                child: e = null
            } = {}) {
                super({
                    child: e,
                    name: "RepeatUntilFailure",
                    title: "Repeat Until Failure",
                    properties: {
                        maxLoop: -1
                    }
                }), this.maxLoop = t
            }
            open(t) {
                t.blackboard.set("i", 0, t.tree.id, this.id)
            }
            tick(e) {
                if (!this.child) throw Error("BTRepeatUntilFailure no child !");
                let a = e.blackboard.get("i", e.tree.id, this.id),
                    n = t.BTStatus.FAILURE;
                for (;
                    (this.maxLoop < 0 || a < this.maxLoop) && (n = this.child._execute(e), n == t.BTStatus.SUCCESS);) a++;
                return a = e.blackboard.set("i", a, e.tree.id, this.id), n
            }
        }
        XBTRepeatUntilFailure.register("BTRepeatUntilFailure", t.BTCategory.DECORATOR);
        class XBTRepeatUntilSuccess extends XBTDecorator {
            constructor({
                maxLoop: t = -1,
                child: e = null
            } = {}) {
                super({
                    child: e,
                    name: "RepeatUntilSuccess",
                    title: "Repeat Until Success",
                    properties: {
                        maxLoop: -1
                    }
                }), this.maxLoop = t
            }
            open(t) {
                t.blackboard.set("i", 0, t.tree.id, this.id)
            }
            tick(e) {
                if (!this.child) throw Error("BTRepeatUntilSuccess no child !");
                let a = e.blackboard.get("i", e.tree.id, this.id),
                    n = t.BTStatus.FAILURE;
                for (;
                    (this.maxLoop < 0 || a < this.maxLoop) && (n = this.child._execute(e), n == t.BTStatus.FAILURE);) a++;
                return a = e.blackboard.set("i", a, e.tree.id, this.id), n
            }
        }
        return XBTRepeatUntilSuccess.register("BTRepeatUntilSuccess", t.BTCategory.DECORATOR), 
        t.AniParam = class {
            constructor(t, e, a, n, u, f, g) {
                this.parent = t, this.pos = e, this.lbCaller = a, this.lbCb = n, this.completeCaller = u, this.completeCb = f, this.completeParams = g
            }
        }, t.AnimationImage = Ct, 
        t.AppBase = 
        class {
            constructor(t, e, a) {
                this.lastTimerScale = 1, console.log("Framework Ver: 1.6.130"), this.gameCfg = t;
                let n = null;
                Laya.isWXPlayable ? window.wx && (n = wx.getSystemInfoSync()) : n = window.sdk.Sdk.instance.initMiniAdapter(), this.initGraphicsSetting(n), console.log(`Graphics: ${JSON.stringify(ft)}`), Config.useRetinalCanvas = ft.enableRetinalCanvas, t.config3d = t.config3d || new Config3D, t.config3d.enableMultiLight = ft.enableMultiLight, t.config3d.isAntialias = Config.isAntialias = ft.enableAntialias;
                let cb = () => {
                    Laya.Physics && Laya.Physics.enable(), Laya.stage.scaleMode = t.scaleMode, Laya.stage.alignH = t.alignH, Laya.stage.alignV = t.alignV, Laya.stage.screenMode = t.screenMode, Laya.stage.frameRate = Laya.Stage.FRAME_FAST, Laya.URL.exportSceneToJson = t.exportSceneToJson, (t.debug || "true" == Laya.Utils.getQueryString("debug")) && Laya.enableDebugPanel(), t.physicsDebug && Laya.PhysicsDebugDraw && Laya.PhysicsDebugDraw.enable(), t.stat && Laya.Stat.show(0, 100), Laya.isWXPlayable || window.sdk.Sdk.isOnALIPAY() || Laya.alertGlobalError(t.errorHandler), it.init(), Laya.isWXPlayable || window.sdk.Sdk.instance.afterEngineInit(this.didEnterBackground.bind(this), this.willEnterForeground.bind(this)), e ? Laya.ResourceVersion.enable(e, Laya.Handler.create(this, this.onManifestLoaded)) : st.instance.load(Laya.Handler.create(this, this.onLoaded))
                };
                window.Laya3D ? (t.physic3dSetting && (Laya.Scene3D.physicsSettings = t.physic3dSetting), a ? Laya3D.init(t.width, t.height, t.config3d, new Laya.Handler(this, (() => {
                    cb()
                }))) : (Laya3D.init(t.width, t.height, t.config3d), cb())) : (Laya.init(t.width, t.height, Laya.WebGL), cb())
            }
            didEnterBackground() {
                0 != Laya.timer.scale && (this.lastTimerScale = Laya.timer.scale, Laya.timer.scale = 0, at.I.event(V.E_APP_ON_PAUSE))
            }
            willEnterForeground(t) {
                Laya.timer.scale = this.lastTimerScale, at.I.event(V.E_APP_ON_RESUME, t)
            }
            launch(t, e) {
                return e ? Laya.AtlasInfoManager.enable(e) : Laya.AtlasInfoManager.enable("fileconfig.json"), f.isOnMiniGame() && !Laya.isWXPlayable && window.sdk.Sdk.instance.checkUpdate(), this.onStageResize(), Laya.stage.on(Laya.Event.RESIZE, this, this.onStageResize), t ? dt.changeScene(t) : this.gameCfg.startScene ? dt.changeScene(this.gameCfg.startScene) : console.error("Launch Scene not found !!!"), this
            }
            onStageResize() {
                Laya.isWXPlayable || f.isOnPC() && window.sdk.Sdk.isOnPC() && (document.title = `${Laya.stage.width}x${Laya.stage.height}`)
            }
            onManifestLoaded() {
                st.instance.load(Laya.Handler.create(this, this.onLoaded))
            }
            onLoaded() {}
            initGraphicsSetting(t) {
                if (!t) return;
                let e = ft;
                if (t.deviceScore) {
                    let a = t.deviceScore.overall;
                    f.isNumber(a) && (e.enableShadow = a > 7);
                    let n = t.deviceScore.gpu;
                    f.isNumber(n) && (e.enableMultiLight = n > 7)
                } else if (t.benchmarkLevel) {
                    let a = t.benchmarkLevel;
                    f.isNumber(a) && (e.enableShadow = a > 20, e.enableMultiLight = a > 15)
                }
            }
        }, t.AudioContextPool = ht, 
        t.AutoReleaseManager = bt, 
        t.BTAction = XBTAction, 
        t.BTActions = XBTActions, 
        t.BTBaseNode = XBTBaseNode, 
        t.BTBlackboard = class {
            constructor() {
                this._baseMemory = {}, this._treeMemory = {}
            }
            _getTreeMemory(t) {
                return this._treeMemory[t] || (this._treeMemory[t] = {
                    nodeMemory: {},
                    openNodes: [],
                    traversalDepth: 0,
                    traversalCycle: 0
                }), this._treeMemory[t]
            }
            _getNodeMemory(t, e) {
                let a = t.nodeMemory;
                return a[e] || (a[e] = {}), a[e]
            }
            _getMemory(t, e) {
                let a = this._baseMemory;
                return t && (a = this._getTreeMemory(t), e && (a = this._getNodeMemory(a, e))), a
            }
            set(t, e, a, n) {
                this._getMemory(a, n)[t] = e
            }
            get(t, e, a) {
                return this._getMemory(e, a)[t]
            }
        }, t.BTComposite = XBTComposite, t.BTComposites = XBTComposites, 
        t.BTCondition = class extends XBTBaseNode {
            constructor({
                child: e = null,
                name: a = "Condition",
                title: n = "",
                properties: u
            }) {
                super({
                    category: t.BTCategory.CONDITION,
                    name: a,
                    title: n,
                    properties: u
                }), this.child = e
            }
            satisfy(t) {
                return !1
            }
            tick(e) {
                if (e.blackboard.get("runningChild", e.tree.id, this.id)) {
                    let a = this.child._execute(e);
                    return a != t.BTStatus.RUNNING && e.blackboard.set("runningChild", !1, e.tree.id, this.id), a
                }
                if (this.satisfy(e)) {
                    if (this.child) {
                        let a = this.child._execute(e);
                        return a == t.BTStatus.RUNNING && e.blackboard.set("runningChild", !0, e.tree.id, this.id), a
                    }
                    return t.BTStatus.SUCCESS
                }
                return t.BTStatus.FAILURE
            }
            add(t) {
                this.child = t
            }
        }, t.BTConditions = XBTConditions, t.BTContinuous = XBTContinuous, 
        t.BTDecorator = XBTDecorator, t.BTDecorators = XBTDecorators, t.BTError = XBTError, 
        t.BTFailer = XBTFailer, t.BTInverter = XBTInverter, 
        t.BTLimiter = XBTLimiter, 
        t.BTMaxTime = XBTMaxTime, t.BTParallel = XBTParallel, 
        t.BTRepeatUntilFailure = XBTRepeatUntilFailure, 
        t.BTRepeatUntilSuccess = XBTRepeatUntilSuccess, 
        t.BTRepeater = XBTRepeater, t.BTRunner = XBTRunner, t.BTSequence = XBTSequence, t.BTSucceeder = XBTSucceeder, 
        t.BTTick = XBTTick, t.BTWait = XBTWait, 
        t.BTWaitUtil = XBTWaitUtil, t.Base64Encrypt = XBase64Encrypt, t.BaseData = class {
            constructor(t, e) {
                this.id = t, this.gid = f.getGID(), null != e && (this.iniName = e, this.ini = st.instance.get(e, t))
            }
            clone() {
                let t = f.getModule(this);
                return this.iniName ? t = new t(this.id, this.iniName) : (t = new t, f.assign(t, this, !1)), t
            }
            from(t) {
                this.ini ? f.assign(this, t) : f.assign(this, t, !1)
            }
        }, t.BaseDataModel = class {
            constructor(t, e) {
                this.dataModule = e, this.name = t;
                let a = st.instance.get(t);
                a && (this.data = {}, this.ini = a, this._length = Object.keys(a).length)
            }
            get length() {
                return this._length
            }
            get(t) {
                return this.getWith(t, this.dataModule)
            }
            create(t) {
                return this.createWith(t, this.dataModule)
            }
            createWith(t, e) {
                if (this.ini[t]) {
                    let a = new e(t, this.name);
                    return f.assign(a, f.cloneDeep(a.ini), !1, !1), a
                }
            }
            getWith(t, e) {
                let a = this.data;
                if (a) {
                    if (a[t]) return a[t];
                    if (this.ini[t]) {
                        let a = this.data[t] = new e(t, this.name);
                        return f.assign(a, f.cloneDeep(a.ini), !1, !1), this.data[t]
                    }
                }
            }
            getValues(t) {
                let e = [];
                return this.recurisRaw((a => {
                    e.push(a[t])
                })), e
            }
            recurisRaw(t) {
                for (const e in this.ini) {
                    let a = t(this.ini[e], e);
                    if (!1 === a) return a
                }
            }
            foreach(t) {
                for (const e in this.ini) {
                    let a = t(this.ini[e], e);
                    if (!1 === a) return a
                }
            }
            getList(t = !1) {
                return this.list || (this.list = [], this.foreach(((e, a) => {
                    if (t) {
                        let t = this.get(a);
                        this.list.push(t)
                    } else this.list.push(e)
                }))), this.list
            }
        }, t.BaseDialog = lt, t.BaseEvent = V, 
        t.BaseEventDispatcher = nt, t.BaseExtend = it, t.BaseLogic = gt, 
        t.BaseScene = rt, t.BaseStorage = pt, t.BaseStorageModel = _t, 
        t.BaseView = ot, t.BehaviorTree = class {
            constructor() {
                this.id = f.createUUIDEx(5), 
                this.title = "The behavior tree", 
                this.description = "Default description", 
                this.properties = {}, 
                this.root = null, 
                this.debug = null
            }
            load(e, a) {
                a = a || {}, this.title = e.title || this.title, this.description = e.description || this.description, this.properties = e.properties || this.properties;
                let n, u, f, g = {};
                for (n in e.nodes) {
                    let t;
                    if (u = e.nodes[n], u.name in a) t = a[u.name];
                    else if (u.name in XBTDecorators) t = XBTDecorators[u.name];
                    else if (u.name in XBTComposites) t = XBTComposites[u.name];
                    else {
                        if (!(u.name in XBTActions)) throw new EvalError('BehaviorTree.load: Invalid node name + "' + u.name + '".');
                        t = XBTActions[u.name]
                    }
                    f = new t(u.properties), f.id = u.id || f.id, f.title = u.title || f.title, f.description = u.description || f.description, f.properties = u.properties || f.properties, g[n] = f
                }
                for (n in e.nodes)
                    if (u = e.nodes[n], f = g[n], f.category === t.BTCategory.COMPOSITE && u.children)
                        for (let t = 0; t < u.children.length; t++) {
                            let e = u.children[t];
                            f.children.push(g[e])
                        } else f.category === t.BTCategory.DECORATOR && u.child && (f.child = g[u.child]);
                this.root = g[e.root]
            }
            dump() {
                let e = {},
                    a = [];
                if (e.title = this.title, e.description = this.description, e.root = this.root ? this.root.id : null, e.properties = this.properties, e.nodes = {}, e.custom_nodes = [], !this.root) return e;
                let n = [this.root];
                for (; n.length > 0;) {
                    let u = n.pop(),
                        f = {};
                    f.id = u.id, f.name = u.name, f.title = u.title, f.description = u.description, f.properties = u.properties;
                    let g = u.constructor && u.constructor.prototype,
                        _ = g && g.name || u.name;
                    if (!XBTDecorators[_] && !XBTComposites[_] && !XBTActions[_] && a.indexOf(_) < 0) {
                        let t = {};
                        t.name = _, t.title = g && g.title || u.title, t.category = u.category, a.push(_), e.custom_nodes.push(t)
                    }
                    if (u.category === t.BTCategory.COMPOSITE && u.children) {
                        let t = [];
                        for (let e = u.children.length - 1; e >= 0; e--) t.push(u.children[e].id), n.push(u.children[e]);
                        f.children = t
                    } else u.category === t.BTCategory.DECORATOR && u.child && (n.push(u.child), f.child = u.child.id);
                    e.nodes[u.id] = f
                }
                return e
            }
            tick(t, e) {
                if (!e) throw "The blackboard parameter is obligatory and must be an instance of b3.Blackboard";
                if (!this.root) return;
                let a = new XBTTick;
                a.debug = this.debug, a.target = t, a.blackboard = e, a.tree = this;
                let n = e.get("tick_frame", a.tree.id);
                null == n ? e.set("tick_frame", 0, a.tree.id) : e.set("tick_frame", n + 1, a.tree.id);
                let u, f = this.root._execute(a),
                    g = e.get("openNodes", this.id),
                    _ = a._openNodes.slice(0),
                    p = 0;
                for (u = 0; u < Math.min(g.length, _.length) && (p = u + 1, g[u] === _[u]); u++);
                for (u = g.length - 1; u >= p; u--) g[u]._close(a);
                return e.set("openNodes", _, this.id), e.set("nodeCount", a._nodeCount, this.id), f
            }
        }, t.ByteUtil = class {
            static readShort(t) {
                return t.readInt16()
            }
            static writeShort(t, e) {
                t.writeInt16(e)
            }
            static readInt(t) {
                return t.readInt32()
            }
            static writeInt(t, e) {
                t.writeInt32(e)
            }
            static readFloat(t) {
                return t.readFloat32()
            }
            static writeFloat(t, e) {
                t.writeFloat32(e)
            }
            static readDouble(t) {
                return t.readFloat64()
            }
            static writeDouble(t, e) {
                t.writeFloat64(e)
            }
            static readBoolean(t) {
                return 1 == t.readInt16()
            }
            static writeBoolean(t, e) {
                this.writeShort(t, e ? 1 : 0)
            }
            static readString(t) {
                let e = t.readInt16();
                return e <= 0 ? "" : t.readUTFBytes(e)
            }
            static writeString(t, e) {
                if (e && "" != e) {
                    let a = new Laya.Byte;
                    a.writeUTFBytes(e);
                    let n = a.length;
                    t.writeInt16(n), n > 0 && t.writeUTFBytes(e)
                } else t.writeInt16(0)
            }
            static readStringArray(t) {
                let e = t.readInt16();
                if (e <= 0) return null;
                let a = [];
                for (let n = 0; n < e; ++n) a.push(this.readString(t));
                return a
            }
            static writeStringArray(t, e) {
                if (!e || e.length <= 0) t.writeInt16(0);
                else {
                    let a = e.length;
                    t.writeInt16(a);
                    for (let n = 0; n < a; ++n) this.writeString(t, e[n])
                }
            }
            static readShortArray(t) {
                let e = t.readInt16();
                if (e <= 0) return null;
                let a = [];
                for (let n = 0; n < e; ++n) a.push(this.readShort(t));
                return a
            }
            static writeShortArray(t, e) {
                if (!e || e.length <= 0) t.writeInt16(0);
                else {
                    let a = e.length;
                    t.writeInt16(a);
                    for (let n = 0; n < a; ++n) this.writeShort(t, e[n])
                }
            }
            static readIntArray(t) {
                let e = t.readInt16();
                if (e <= 0) return null;
                let a = [];
                for (let n = 0; n < e; ++n) a.push(this.readInt(t));
                return a
            }
            static writeIntArray(t, e) {
                if (!e || e.length <= 0) t.writeInt16(0);
                else {
                    let a = e.length;
                    t.writeInt16(a);
                    for (let n = 0; n < a; ++n) this.writeInt(t, e[n])
                }
            }
            static readFloatArray(t) {
                let e = t.readInt16();
                if (e <= 0) return null;
                let a = [];
                for (let n = 0; n < e; ++n) a.push(this.readFloat(t));
                return a
            }
            static writeFloatArray(t, e) {
                if (!e || e.length <= 0) t.writeInt16(0);
                else {
                    let a = e.length;
                    t.writeInt16(a);
                    for (let n = 0; n < a; ++n) this.writeFloat(t, e[n])
                }
            }
            static readDoubleArray(t) {
                let e = t.readInt16();
                if (e <= 0) return null;
                let a = [];
                for (let n = 0; n < e; ++n) a.push(this.readDouble(t));
                return a
            }
            static writeDoubleArray(t, e) {
                if (!e || e.length <= 0) t.writeInt16(0);
                else {
                    let a = e.length;
                    t.writeInt16(a);
                    for (let n = 0; n < a; ++n) this.writeDouble(t, e[n])
                }
            }
        }, t.CColor = {
            RED: "#FF0000",
            GREEN: "#00FF00",
            BLUE: "#0000FF",
            CYAN: "#00FFFF",
            GRAY: "#808080",
            WHITE: "#FFFFFF",
            BLACK: "#000000"
        }, t.CfgMgr = st, t.Color = B, t.CryptUtil = mt, t.Dialog = R, t.Effect = ut, t.EventCenter = at, t.EventDispatcher = z, t.FX_VERSION = k, t.GraphicsCfg = ft, t.HelperEx = class {
            static destroyBySign(t, e) {
                let a = Laya.Pool._poolDic;
                if (e) {
                    for (const e in a)
                        if (-1 != e.indexOf(t)) {
                            let t = a[e];
                            for (const e of t) e.destroy();
                            t.length = 0, delete a[e]
                        }
                    return
                }
                let n = Laya.Pool.getPoolBySign(t);
                for (const t of n) t.destroy();
                n.length = 0, delete a[t]
            }
            static checkPoolBySign(t) {
                return Laya.Pool._poolDic[t]
            }
            static clone(t, e) {
                let a;
                if (t instanceof Laya.Image) a = new Laya.Image, this.cloneToImage(t, a, e);
                else if (t instanceof Laya.Box) a = new Laya.Box, this.cloneToBox(t, a);
                else {
                    if (!(t instanceof Laya.Label)) throw Error("clone type not implement !");
                    a = new Laya.Label, this.cloneToLabel(t, a)
                }
                let n = t.getChildren();
                for (const t of n) {
                    let n = this.clone(t, e);
                    a.addChild(n)
                }
                return a
            }
            static cloneToImage(t, e, a) {
                this.cloneToUIComp(t, e), e.skin = t.skin, a && (e.graphics = t.graphics, e.source = t.source)
            }
            static cloneToBox(t, e) {
                this.cloneToUIComp(t, e), e.bgColor = t.bgColor
            }
            static cloneToLabel(t, e) {
                this.cloneToUIComp(t, e), e.align = t.align, e.bold = t.bold, e.borderColor = t.borderColor, e.color = t.color, e.font = t.font, e.fontSize = t.fontSize, e.italic = t.italic, e.leading = t.leading, e.overflow = t.overflow, e.padding = t.padding, e.text = t.text, e.underline = t.underline, e.underlineColor = t.underlineColor, e.valign = t.valign, e.wordWrap = t.wordWrap
            }
            static cloneToUIComp(t, e) {
                e.alpha = t.alpha, e.anchorX = t.anchorX, e.anchorY = t.anchorY, e.autoSize = t.autoSize, e.blendMode = t.blendMode, e.bottom = t.bottom, e.cacheAs = t.cacheAs, e.centerX = t.centerX, e.centerY = t.centerY, e.cid = t.cid, e.customRenderEnable = t.customRenderEnable, e.dataSource = t.dataSource, e.destroyed = !1, e.disabled = t.disabled, e.drawCallOptimize = t.drawCallOptimize, t.filters && (e.filters = t.filters.splice(0)), e.gray = t.gray, e.height = t.height, e.hitArea = t.hitArea, e.hitTestPrior = t.hitTestPrior, e.left = t.left, e.mask = t.mask, e.mouseEnabled = t.mouseEnabled, e.mouseThrough = t.mouseThrough, e.name = t.name, e.pivotX = t.pivotX, e.pivotY = t.pivotY, e.right = t.right, e.rotation = t.rotation, e.scaleX = t.scaleX, e.scaleY = t.scaleY, e.scrollRect = t.scrollRect, e.skewX = t.skewX, e.skewY = t.skewY, e.staticCache = t.staticCache, e.tag = t.tag, e.texture = t.texture, e.toolTip = t.toolTip, e.top = t.top, t.transform && (e.transform = t.transform.clone()), t.viewport && (e.viewport = t.viewport.clone()), e.visible = t.visible, e.width = t.width, e.x = t.x, e.y = t.y, e.zOrder = t.zOrder
            }
            static typeText(t, e, a, n) {
                this.stopTypeText(t);
                let u = 1 / a;
                u = Math.max(u, .033);
                let f = Math.ceil(u * a);
                f = Math.max(f, 1);
                let g = 0;
                const updateFunc = function() {
                    t.destroyed || (g = Math.min(g + f, e.length), t.text = e.substring(0, g), g == e.length && (this.stopTypeText(t), n && n.run()))
                };
                t.text = "", t._typeUpdateFunc = updateFunc, t.timerLoop(1e3 * u, this, updateFunc)
            }
            static stopTypeText(t) {
                t._typeUpdateFunc && (t.timer.clear(this, t._typeUpdateFunc), t._typeUpdateFunc = null)
            }
            static randomPointUnitArcCircle(t, e, a = null) {
                var n;
                n = null !== a ? a * t : Math.random() * t, e.x = Math.cos(n), e.y = Math.sin(n)
            }
            static randomPointInsideUnitArcCircle(t, e, a = null) {
                var n;
                this.randomPointUnitArcCircle(t, e, a), n = null !== a ? Math.pow(a, .5) : Math.pow(Math.random(), .5), e.x = e.x * n, e.y = e.y * n
            }
            static randomPointUnitCircle(t, e = null) {
                var a;
                a = null !== e ? e * Math.PI * 2 : Math.random() * Math.PI * 2, t.x = Math.cos(a), t.y = Math.sin(a)
            }
            static randomPointInsideUnitCircle(t, e = null) {
                var a;
                this.randomPointUnitCircle(t), a = null !== e ? Math.pow(e, .5) : Math.pow(Math.random(), .5), t.x = t.x * a, t.y = t.y * a
            }
        }, t.HtmlText = qt, t.Http = wt, t.HttpManager = xt, t.HttpServer = Lt, t.MD5 = class {
            constructor() {
                this.hexcase = 0, this.b64pad = ""
            }
            hex_md5(t) {
                return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(t)))
            }
            b64_md5(t) {
                return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(t)))
            }
            any_md5(t, e) {
                return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(t)), e)
            }
            hex_hmac_md5(t, e) {
                return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(t), this.str2rstr_utf8(e)))
            }
            b64_hmac_md5(t, e) {
                return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(t), this.str2rstr_utf8(e)))
            }
            any_hmac_md5(t, e, a) {
                return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(t), this.str2rstr_utf8(e)), a)
            }
            md5_vm_test() {
                return "900150983cd24fb0d6963f7d28e17f72" == this.hex_md5("abc").toLowerCase()
            }
            rstr_md5(t) {
                return this.binl2rstr(this.binl_md5(this.rstr2binl(t), 8 * t.length))
            }
            rstr_hmac_md5(t, e) {
                var a = this.rstr2binl(t);
                a.length > 16 && (a = this.binl_md5(a, 8 * t.length));
                for (var n = Array(16), u = Array(16), f = 0; f < 16; f++) n[f] = 909522486 ^ a[f], u[f] = 1549556828 ^ a[f];
                var g = this.binl_md5(n.concat(this.rstr2binl(e)), 512 + 8 * e.length);
                return this.binl2rstr(this.binl_md5(u.concat(g), 640))
            }
            rstr2hex(t) {
                try {
                    this.hexcase
                } catch (t) {
                    this.hexcase = 0
                }
                for (var e, a = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef", n = "", u = 0; u < t.length; u++) e = t.charCodeAt(u), n += a.charAt(e >>> 4 & 15) + a.charAt(15 & e);
                return n
            }
            rstr2b64(t) {
                try {
                    this.b64pad
                } catch (t) {
                    this.b64pad = ""
                }
                for (var e = "", a = t.length, n = 0; n < a; n += 3)
                    for (var u = t.charCodeAt(n) << 16 | (n + 1 < a ? t.charCodeAt(n + 1) << 8 : 0) | (n + 2 < a ? t.charCodeAt(n + 2) : 0), f = 0; f < 4; f++) 8 * n + 6 * f > 8 * t.length ? e += this.b64pad : e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(u >>> 6 * (3 - f) & 63);
                return e
            }
            rstr2any(t, e) {
                var a, n, u, f, g, _ = e.length,
                    p = Array(Math.ceil(t.length / 2));
                for (a = 0; a < p.length; a++) p[a] = t.charCodeAt(2 * a) << 8 | t.charCodeAt(2 * a + 1);
                var y = Math.ceil(8 * t.length / (Math.log(e.length) / Math.log(2))),
                    m = Array(y);
                for (n = 0; n < y; n++) {
                    for (g = Array(), f = 0, a = 0; a < p.length; a++) f = (f << 16) + p[a], f -= (u = Math.floor(f / _)) * _, (g.length > 0 || u > 0) && (g[g.length] = u);
                    m[n] = f, p = g
                }
                var b = "";
                for (a = m.length - 1; a >= 0; a--) b += e.charAt(m[a]);
                return b
            }
            str2rstr_utf8(t) {
                for (var e, a, n = "", u = -1; ++u < t.length;) e = t.charCodeAt(u), a = u + 1 < t.length ? t.charCodeAt(u + 1) : 0, 55296 <= e && e <= 56319 && 56320 <= a && a <= 57343 && (e = 65536 + ((1023 & e) << 10) + (1023 & a), u++), e <= 127 ? n += String.fromCharCode(e) : e <= 2047 ? n += String.fromCharCode(192 | e >>> 6 & 31, 128 | 63 & e) : e <= 65535 ? n += String.fromCharCode(224 | e >>> 12 & 15, 128 | e >>> 6 & 63, 128 | 63 & e) : e <= 2097151 && (n += String.fromCharCode(240 | e >>> 18 & 7, 128 | e >>> 12 & 63, 128 | e >>> 6 & 63, 128 | 63 & e));
                return n
            }
            str2rstr_utf16le(t) {
                for (var e = "", a = 0; a < t.length; a++) e += String.fromCharCode(255 & t.charCodeAt(a), t.charCodeAt(a) >>> 8 & 255);
                return e
            }
            str2rstr_utf16be(t) {
                for (var e = "", a = 0; a < t.length; a++) e += String.fromCharCode(t.charCodeAt(a) >>> 8 & 255, 255 & t.charCodeAt(a));
                return e
            }
            rstr2binl(t) {
                for (var e = Array(t.length >> 2), a = 0; a < e.length; a++) e[a] = 0;
                for (a = 0; a < 8 * t.length; a += 8) e[a >> 5] |= (255 & t.charCodeAt(a / 8)) << a % 32;
                return e
            }
            binl2rstr(t) {
                for (var e = "", a = 0; a < 32 * t.length; a += 8) e += String.fromCharCode(t[a >> 5] >>> a % 32 & 255);
                return e
            }
            binl_md5(t, e) {
                t[e >> 5] |= 128 << e % 32, t[14 + (e + 64 >>> 9 << 4)] = e;
                for (var a = 1732584193, n = -271733879, u = -1732584194, f = 271733878, g = 0; g < t.length; g += 16) {
                    var _ = a,
                        p = n,
                        y = u,
                        m = f;
                    a = this.md5_ff(a, n, u, f, t[g + 0], 7, -680876936), f = this.md5_ff(f, a, n, u, t[g + 1], 12, -389564586), u = this.md5_ff(u, f, a, n, t[g + 2], 17, 606105819), n = this.md5_ff(n, u, f, a, t[g + 3], 22, -1044525330), a = this.md5_ff(a, n, u, f, t[g + 4], 7, -176418897), f = this.md5_ff(f, a, n, u, t[g + 5], 12, 1200080426), u = this.md5_ff(u, f, a, n, t[g + 6], 17, -1473231341), n = this.md5_ff(n, u, f, a, t[g + 7], 22, -45705983), a = this.md5_ff(a, n, u, f, t[g + 8], 7, 1770035416), f = this.md5_ff(f, a, n, u, t[g + 9], 12, -1958414417), u = this.md5_ff(u, f, a, n, t[g + 10], 17, -42063), n = this.md5_ff(n, u, f, a, t[g + 11], 22, -1990404162), a = this.md5_ff(a, n, u, f, t[g + 12], 7, 1804603682), f = this.md5_ff(f, a, n, u, t[g + 13], 12, -40341101), u = this.md5_ff(u, f, a, n, t[g + 14], 17, -1502002290), n = this.md5_ff(n, u, f, a, t[g + 15], 22, 1236535329), a = this.md5_gg(a, n, u, f, t[g + 1], 5, -165796510), f = this.md5_gg(f, a, n, u, t[g + 6], 9, -1069501632), u = this.md5_gg(u, f, a, n, t[g + 11], 14, 643717713), n = this.md5_gg(n, u, f, a, t[g + 0], 20, -373897302), a = this.md5_gg(a, n, u, f, t[g + 5], 5, -701558691), f = this.md5_gg(f, a, n, u, t[g + 10], 9, 38016083), u = this.md5_gg(u, f, a, n, t[g + 15], 14, -660478335), n = this.md5_gg(n, u, f, a, t[g + 4], 20, -405537848), a = this.md5_gg(a, n, u, f, t[g + 9], 5, 568446438), f = this.md5_gg(f, a, n, u, t[g + 14], 9, -1019803690), u = this.md5_gg(u, f, a, n, t[g + 3], 14, -187363961), n = this.md5_gg(n, u, f, a, t[g + 8], 20, 1163531501), a = this.md5_gg(a, n, u, f, t[g + 13], 5, -1444681467), f = this.md5_gg(f, a, n, u, t[g + 2], 9, -51403784), u = this.md5_gg(u, f, a, n, t[g + 7], 14, 1735328473), n = this.md5_gg(n, u, f, a, t[g + 12], 20, -1926607734), a = this.md5_hh(a, n, u, f, t[g + 5], 4, -378558), f = this.md5_hh(f, a, n, u, t[g + 8], 11, -2022574463), u = this.md5_hh(u, f, a, n, t[g + 11], 16, 1839030562), n = this.md5_hh(n, u, f, a, t[g + 14], 23, -35309556), a = this.md5_hh(a, n, u, f, t[g + 1], 4, -1530992060), f = this.md5_hh(f, a, n, u, t[g + 4], 11, 1272893353), u = this.md5_hh(u, f, a, n, t[g + 7], 16, -155497632), n = this.md5_hh(n, u, f, a, t[g + 10], 23, -1094730640), a = this.md5_hh(a, n, u, f, t[g + 13], 4, 681279174), f = this.md5_hh(f, a, n, u, t[g + 0], 11, -358537222), u = this.md5_hh(u, f, a, n, t[g + 3], 16, -722521979), n = this.md5_hh(n, u, f, a, t[g + 6], 23, 76029189), a = this.md5_hh(a, n, u, f, t[g + 9], 4, -640364487), f = this.md5_hh(f, a, n, u, t[g + 12], 11, -421815835), u = this.md5_hh(u, f, a, n, t[g + 15], 16, 530742520), n = this.md5_hh(n, u, f, a, t[g + 2], 23, -995338651), a = this.md5_ii(a, n, u, f, t[g + 0], 6, -198630844), f = this.md5_ii(f, a, n, u, t[g + 7], 10, 1126891415), u = this.md5_ii(u, f, a, n, t[g + 14], 15, -1416354905), n = this.md5_ii(n, u, f, a, t[g + 5], 21, -57434055), a = this.md5_ii(a, n, u, f, t[g + 12], 6, 1700485571), f = this.md5_ii(f, a, n, u, t[g + 3], 10, -1894986606), u = this.md5_ii(u, f, a, n, t[g + 10], 15, -1051523), n = this.md5_ii(n, u, f, a, t[g + 1], 21, -2054922799), a = this.md5_ii(a, n, u, f, t[g + 8], 6, 1873313359), f = this.md5_ii(f, a, n, u, t[g + 15], 10, -30611744), u = this.md5_ii(u, f, a, n, t[g + 6], 15, -1560198380), n = this.md5_ii(n, u, f, a, t[g + 13], 21, 1309151649), a = this.md5_ii(a, n, u, f, t[g + 4], 6, -145523070), f = this.md5_ii(f, a, n, u, t[g + 11], 10, -1120210379), u = this.md5_ii(u, f, a, n, t[g + 2], 15, 718787259), n = this.md5_ii(n, u, f, a, t[g + 9], 21, -343485551), a = this.safe_add(a, _), n = this.safe_add(n, p), u = this.safe_add(u, y), f = this.safe_add(f, m)
                }
                return [a, n, u, f]
            }
            md5_cmn(t, e, a, n, u, f) {
                return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(e, t), this.safe_add(n, f)), u), a)
            }
            md5_ff(t, e, a, n, u, f, g) {
                return this.md5_cmn(e & a | ~e & n, t, e, u, f, g)
            }
            md5_gg(t, e, a, n, u, f, g) {
                return this.md5_cmn(e & n | a & ~n, t, e, u, f, g)
            }
            md5_hh(t, e, a, n, u, f, g) {
                return this.md5_cmn(e ^ a ^ n, t, e, u, f, g)
            }
            md5_ii(t, e, a, n, u, f, g) {
                return this.md5_cmn(a ^ (e | ~n), t, e, u, f, g)
            }
            safe_add(t, e) {
                var a = (65535 & t) + (65535 & e);
                return (t >> 16) + (e >> 16) + (a >> 16) << 16 | 65535 & a
            }
            bit_rol(t, e) {
                return t << e | t >>> 32 - e
            }
        }, t.MapEx = Xt, t.ModalDialogBox = class extends R {
            constructor(t, e, a) {
                if (super(), this.handler_close = Laya.Handler.create(this, (function() {
                        this.removeSelf()
                    })), a.tex_bgMask && (this.img_bgmask = new Laya.Image, this.img_bgmask.name = "img_bg", this.addChild(this.img_bgmask), this.img_bgmask.left = 0, this.img_bgmask.right = 0, this.img_bgmask.top = 0, this.img_bgmask.bottom = 0, this.img_bgmask.skin = a.tex_bgMask, a.texSizegrid_bgMask && (this.img_bgmask.sizeGrid = a.texSizegrid_bgMask)), this.img_bg = new Laya.Image, this.addChild(this.img_bg), a.tex_bg ? this.img_bg.skin = a.tex_bg : (console.log("模态弹出框背景纹理为空!!!"), this.img_bg.width = 500, this.img_bg.height = 400), a.texSizegrid_bg && (this.img_bg.sizeGrid = a.texSizegrid_bg), this.img_bg.centerX = 0, this.img_bg.centerY = 0, !a.texSize_bg && (a.texSize_bg = {
                        width: 600,
                        height: 400
                    }), !a.texSize_bg.width && (a.texSize_bg.width = 600), !a.texSize_bg.height && (a.texSize_bg.height = 400), this.img_bg.size(a.texSize_bg.width, a.texSize_bg.height), this.label_title = new Laya.Label, this.img_bg.addChild(this.label_title), this.label_title.fontSize = 40, this.label_title.bold = !0, this.label_title.color = "#ffffff", this.label_title.centerX = 0, this.label_title.top = 25, this.label_content = new Laya.Label, this.img_bg.addChild(this.label_content), this.label_content.fontSize = 36, this.label_content.bold = !0, this.label_content.color = "#ffffff", this.label_content.centerX = 0, this.label_content.centerY = 0, a.contentLeading && (this.label_content.leading = a.contentLeading), a.tex_closeBtn ? (this.btn_close = new Laya.Button, this.img_bg.addChild(this.btn_close), this.btn_close.skin = a.tex_closeBtn, this.btn_close.stateNum = 1, this.btn_close.anchorX = 1, this.btn_close.anchorY = 1, this.btn_close.top = 0, this.btn_close.right = 0, a.handler_closeBtn ? this.handler_closeBtn = a.handler_cancelBtn : this.handler_closeBtn = this.handler_close, this.btn_close.on(Laya.Event.CLICK, this, (function() {
                        this.handler_closeBtn.run()
                    }))) : console.log("模态弹出框关闭按钮纹理为空!!!"), a.tex_sureBtn) {
                    if (this.btn_sure = new Laya.Button, this.img_bg.addChild(this.btn_sure), this.btn_sure.stateNum = 1, this.btn_sure.skin = a.tex_sureBtn, a.texSizegrid_sureBtn && (this.btn_sure.sizeGrid = a.texSizegrid_sureBtn), this.btn_sure.size(200, 120), this.handler_sureBtn = a.handler_sureBtn, this.btn_sure.on(Laya.Event.CLICK, this, (function() {
                            this.handler_sureBtn && this.handler_sureBtn.run(), this.handler_close.run()
                        })), a.font_sureBtn) {
                        let t = Laya.loader.getRes(a.font_sureBtn);
                        t ? (this.font_btn_sure = new Laya.Image, this.btn_sure.addChild(this.font_btn_sure), this.font_btn_sure.source = t) : (this.font_btn_sure = new Laya.Label, this.btn_sure.addChild(this.font_btn_sure), this.font_btn_sure.text = a.font_sureBtn, this.font_btn_sure.color = "#ffffff", this.font_btn_sure.fontSize = 34, this.font_btn_sure.bold = !0), !a.font_suereBtn_centeroffset && (a.font_suereBtn_centeroffset = new Laya.Point(0, 0)), this.font_btn_sure.centerX = a.font_suereBtn_centeroffset.x, this.font_btn_sure.centerY = a.font_suereBtn_centeroffset.y
                    }
                } else console.log("模态对话框确认按钮纹理缺失!!!");
                if (a.tex_cancelBtn) {
                    if (this.btn_cancel = new Laya.Button, this.img_bg.addChild(this.btn_cancel), this.btn_cancel.stateNum = 1, this.btn_cancel.skin = a.tex_cancelBtn, a.texSizegrid_cancelBtn && (this.btn_cancel.sizeGrid = a.texSizegrid_cancelBtn), this.btn_cancel.size(200, 120), this.handler_cancelBtn = a.handler_cancelBtn, this.btn_cancel.on(Laya.Event.CLICK, this, (function() {
                            this.handler_cancelBtn && this.handler_cancelBtn.run(), this.handler_close.run()
                        })), a.font_cancelBtn) {
                        let t = Laya.loader.getRes(a.font_cancelBtn);
                        t ? (this.font_btn_cancel = new Laya.Image, this.btn_cancel.addChild(this.font_btn_cancel), this.font_btn_cancel.source = t) : (this.font_btn_cancel = new Laya.Label, this.btn_cancel.addChild(this.font_btn_cancel), this.font_btn_cancel.text = a.font_cancelBtn, this.font_btn_cancel.color = "#ffffff", this.font_btn_cancel.fontSize = 34, this.font_btn_cancel.bold = !0), !a.font_cancelBtn_centeroffset && (a.font_cancelBtn_centeroffset = new Laya.Point(0, 0)), this.font_btn_cancel.centerX = a.font_cancelBtn_centeroffset.x, this.font_btn_cancel.centerY = a.font_cancelBtn_centeroffset.y
                    }
                } else console.log("模态对话框取消按钮纹理缺失!!!");
                this.btn_sure && this.btn_cancel ? (this.btn_sure.centerX = (this.img_bg.width / 2 - this.btn_sure.width) / 2 + this.btn_sure.width / 2, this.btn_sure.bottom = -this.btn_sure.height / 3, this.btn_cancel.centerX = -(this.img_bg.width / 2 - this.btn_cancel.width) / 2 - this.btn_cancel.width / 2, this.btn_cancel.bottom = -this.btn_cancel.height / 3) : this.btn_sure && !this.btn_cancel ? (this.btn_sure.centerX = 0, this.btn_sure.bottom = 0) : !this.btn_sure && this.btn_cancel && (this.btn_cancel.centerX = 0, this.btn_cancel.bottom = 0)
            }
            get label_title() {
                return this._label_title
            }
            set label_title(t) {
                this._label_title = t
            }
            get label_content() {
                return this._label_content
            }
            set label_content(t) {
                this._label_content = t
            }
            get img_bgmask() {
                return this._img_bgmask
            }
            set img_bgmask(t) {
                this._img_bgmask = t
            }
            get img_bg() {
                return this._img_bg
            }
            set img_bg(t) {
                this._img_bg = t
            }
            get btn_close() {
                return this._btn_close
            }
            set btn_close(t) {
                this._btn_close = t
            }
            get btn_sure() {
                return this._btn_sure
            }
            set btn_sure(t) {
                this._btn_sure = t
            }
            get font_btn_sure() {
                return this._font_btn_sure
            }
            set font_btn_sure(t) {
                this._font_btn_sure = t
            }
            get btn_cancel() {
                return this._btn_cancel
            }
            set btn_cancel(t) {
                this._btn_cancel = t
            }
            get font_btn_cancel() {
                return this._font_btn_cancel
            }
            set font_btn_cancel(t) {
                this._font_btn_cancel = t
            }
        }, t.Physics = $, t.RVOMath = Nt, t.RandomUtil = class {
            init(t) {
                this._seed = t
            }
            random() {
                return this._seed = (9301 * this._seed + 49297) % 233280, this._seed / 233280
            }
            getIntRandom(t, e) {
                return Math.floor(this.random() * (e - t + 1) + t)
            }
            randomArray(t) {
                if (!t || 0 == t.length) return;
                let e = t.length;
                for (; e;) {
                    let a = Math.floor(this.random() * e--);
                    [t[a], t[e]] = [t[e], t[a]]
                }
                return t
            }
            randomInArray(t) {
                if (!t || 0 == t.length) return null;
                return t[Math.floor(this.random() * t.length)]
            }
        }, t.RvoAgent = Pt, t.RvoKdTree = Ut, t.RvoKeyValuePair = kt, t.RvoLine = Ot, t.RvoObstacle = It, t.RvoSimulator = class {
            constructor() {
                this.agentId = 0, this.agentIdLst = [], this.aid2agent = Object.create(null), this.obstacles = [], this.time = 0, this.kdTree = new Ut(this)
            }
            getAgent(t) {
                return this.aid2agent[this.agentIdLst[t]]
            }
            getAgentByAid(t) {
                return this.aid2agent[t]
            }
            getGlobalTime() {
                return this.time
            }
            getNumAgents() {
                return this.agentIdLst.length
            }
            setAgentPrefVelocity(t, e) {
                this.aid2agent[t].prefVelocity_.copy(e)
            }
            getAgentPosition(t) {
                return this.aid2agent[t].position_
            }
            getAgentPrefVelocity(t) {
                return this.aid2agent[t].prefVelocity_
            }
            getAgentVelocity(t) {
                return this.aid2agent[t].velocity_
            }
            getAgentRadius(t) {
                return this.aid2agent[t].radius_
            }
            getAgentOrcaLines(t) {
                return this.aid2agent[t].orcaLines_
            }
            addAgent(t, e, a, n, u) {
                if (!this.defaultAgent) throw new Error("no default agent");
                let f = new Pt;
                return f.position_.copy(t), f.maxNeighbors_ = this.defaultAgent.maxNeighbors_, f.maxSpeed_ = a || this.defaultAgent.maxSpeed_, f.neighborDist = this.defaultAgent.neighborDist, f.radius_ = e || this.defaultAgent.radius_, f.timeHorizon = this.defaultAgent.timeHorizon, f.timeHorizonObst = this.defaultAgent.timeHorizonObst, f.velocity_.copy(n || this.defaultAgent.velocity_), u && (f.mass = u), f.id = this.agentId++, this.aid2agent[f.id] = f, this.agentIdLst.push(f.id), f.id
            }
            removeAgent(t) {
                if (this.hasAgent(t)) {
                    delete this.aid2agent[t];
                    let e = this.agentIdLst.indexOf(t);
                    this.agentIdLst[e] = this.agentIdLst[this.agentIdLst.length - 1], this.agentIdLst.length--
                }
            }
            hasAgent(t) {
                return !!this.aid2agent[t]
            }
            setAgentMass(t, e) {
                this.aid2agent[t].mass = e
            }
            getAgentMass(t) {
                return this.aid2agent[t].mass
            }
            setAgentRadius(t, e) {
                this.aid2agent[t].radius_ = e
            }
            setAgentDefaults(t, e, a, n, u, f, g) {
                this.defaultAgent || (this.defaultAgent = new Pt), this.defaultAgent.maxNeighbors_ = e, this.defaultAgent.maxSpeed_ = f, this.defaultAgent.neighborDist = t, this.defaultAgent.radius_ = u, this.defaultAgent.timeHorizon = a, this.defaultAgent.timeHorizonObst = n, this.defaultAgent.velocity_ = g
            }
            run(t) {
                this.kdTree.buildAgentTree(this.getNumAgents());
                let e = this.agentIdLst.length;
                for (let a = 0; a < e; a++) this.aid2agent[this.agentIdLst[a]].computeNeighbors(this), this.aid2agent[this.agentIdLst[a]].computeNewVelocity(t);
                for (let a = 0; a < e; a++) this.aid2agent[this.agentIdLst[a]].update(t);
                this.time += t
            }
            addObstacle(t) {
                if (t.length < 2) return -1;
                let e = this.obstacles.length;
                for (let a = 0; a < t.length; ++a) {
                    let n = new It;
                    n.point = t[a], 0 != a && (n.previous = this.obstacles[this.obstacles.length - 1], n.previous.next = n), a == t.length - 1 && (n.next = this.obstacles[e], n.next.previous = n), n.direction = Nt.normalize(t[a == t.length - 1 ? 0 : a + 1].minus(t[a])), 2 == t.length ? n.convex = !0 : n.convex = Nt.leftOf(t[0 == a ? t.length - 1 : a - 1], t[a], t[a == t.length - 1 ? 0 : a + 1]) >= 0, n.id = this.obstacles.length, this.obstacles.push(n)
                }
                return e
            }
            processObstacles() {
                this.kdTree.buildObstacleTree()
            }
            queryVisibility(t, e, a) {
                return this.kdTree.queryVisibility(t, e, a)
            }
            getObstacles() {
                return this.obstacles
            }
            clear() {
                this.agentIdLst.length = 0, this.agentId = 0, this.aid2agent = Object.create(null), this.defaultAgent = null, this.kdTree = new Ut(this), this.obstacles.length = 0
            }
        }, t.RvoVector2 = Mt, t.SceneManager = dt, t.Sequence = g, t.ServerStorage = Ht, t.Size = et, t.SoundCfg = class {}, t.SoundManager = ct, t.TableView = Tt, t.Trail = At, t.UserInfoEntity = zt, t.UserLogic = Ft, t.Utils = f, t.V2 = e, t.V3 = a, t.V4 = n, t.WebSocket = class {
            constructor() {
                this.byte = new Laya.Byte, this.byte.endian = Laya.Byte.LITTLE_ENDIAN, this.ws = new Laya.Socket, this.ws.endian = Laya.Byte.LITTLE_ENDIAN, this.ws.on(Laya.Event.MESSAGE, this, this._onMessage), this.ws.on(Laya.Event.OPEN, this, this._onOpen), this.ws.on(Laya.Event.CLOSE, this, this._onClose), this.ws.on(Laya.Event.ERROR, this, this._onError)
            }
            isConnected() {
                return this.ws.connected
            }
            _onMessage(t) {
                this.onMessage && this.onMessage(t)
            }
            _onOpen(t) {
                console.log("WebSocket onOpen"), this.onOpen && this.onOpen(t)
            }
            _onClose(t) {
                console.log("WebSocket onClose"), this.token = void 0, this.onClose && this.onClose(t)
            }
            _onError(t) {
                console.log("WebSocket onError"), this.onError && this.onError(t)
            }
            connect(t, e) {
                return console.log(`WebSocket connect ${t} port:${e}`), e ? this.ws.connect(t, e) : this.ws.connectByUrl(t), this
            }
            close() {
                this.ws.close(), this.token = void 0
            }
            destroy() {
                this.ws.offAll();
                try {
                    this.ws.cleanSocket()
                } catch (t) {}
                this.ws = null, this.token = void 0
            }
            send(t) {
                return this.ws.send(t), this
            }
        }, t.cheatClass = function(t, e = "_", a = !0, n, u, g) {
            return function(_) {
                if (f.definePropertyEx(_.prototype, "cheatPrefix", {
                        value: e,
                        enumerable: !1,
                        writable: !1
                    }), f.definePropertyEx(_.prototype, "cheatOnlyDetect", {
                        value: a,
                        enumerable: !1,
                        writable: !1
                    }), f.definePropertyEx(_.prototype, "cheatGet", {
                        value: n,
                        enumerable: !1,
                        writable: !1
                    }), f.definePropertyEx(_.prototype, "cheatSet", {
                        value: u,
                        enumerable: !1,
                        writable: !1
                    }), f.definePropertyEx(_.prototype, "cheatScene", {
                        value: t,
                        enumerable: !1,
                        writable: !1
                    }), (n || u) && !g) throw Error("cheatGet or cheatSet must have callback !");
                f.definePropertyEx(_.prototype, "cheatCallback", {
                    value: g,
                    enumerable: !1,
                    writable: !1
                })
            }
        }, t.cheatProperty = function() {
            return function(t, e) {
                function checkCheat(a, n) {
                    let u = this[n],
                        g = t.cheatOnlyDetect ? mt.encryptAes(u) : u,
                        _ = function(t, e) {
                            return t.hasOwnProperty("$isInitCiphertextMap") || (f.definePropertyEx(t, "ciphertextMap", {
                                value: {},
                                enumerable: !1,
                                writable: !1
                            }), f.definePropertyEx(t, "$isInitCiphertextMap", {
                                value: !0,
                                enumerable: !1,
                                writable: !1
                            })), t.ciphertextMap.hasOwnProperty(e) ? t.ciphertextMap[e] : ""
                        }(a, e);
                    _ && g != _ && t.cheatCallback(t.cheatScene)
                }
                delete t[e], Object.defineProperty(t, e, {get: function() {
                        let a = t.cheatPrefix + e;
                        return t.cheatGet && checkCheat(this, a), t.cheatOnlyDetect ? this[a] : mt.decryptAes(this[a])
                    },
                    set: function(a) {
                        let n = t.cheatPrefix + e;
                        if (this[n] != a) {
                            t.cheatSet && checkCheat(this, n);
                            let u = mt.encryptAes(a);
                            ! function(t, e, a) {
                                t.hasOwnProperty("$isInitCiphertextMap") || (f.definePropertyEx(t, "ciphertextMap", {
                                    value: {},
                                    enumerable: !1,
                                    writable: !1
                                }), f.definePropertyEx(t, "$isInitCiphertextMap", {
                                    value: !0,
                                    enumerable: !1,
                                    writable: !1
                                })), t.ciphertextMap[e] = a
                            }(this, e, u), t.cheatOnlyDetect ? this[n] = a : this[n] = u
                        }
                    },
                    enumerable: !1,
                    configurable: !0
                })
            }
        }, Object.defineProperty(t, "__esModule", {
            value: !0
        }), t
    }({});
});

define("libs/game.js", function(require, module, exports) {

});
require("libs/game.js");