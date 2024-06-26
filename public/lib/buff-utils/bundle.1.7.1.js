var buffUtils = function (t, _Wt) {
    "use strict";

    function e(t) {
        let e,
            r = 0;
        const n = t.reduce((t, e) => t + e.length, 0),
            s = new Uint8Array(n);
        for (const n of t) for (e = 0; e < n.length; r++, e++) s[r] = n[e];
        return s;
    }
    function r(t) {
        if (!Number.isSafeInteger(t) || t < 0) throw new Error(`Wrong positive integer: ${t}`);
    }
    function n(t, ...e) {
        if (!(t instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
        if (e.length > 0 && !e.includes(t.length)) throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
    }
    const s = {
        number: r,
        bool: function (t) {
            if ("boolean" != typeof t) throw new Error(`Expected boolean, not ${t}`);
        },
        bytes: n,
        hash: function (t) {
            if ("function" != typeof t || "function" != typeof t.create) throw new Error("Hash should be wrapped by utils.wrapConstructor");
            r(t.outputLen), r(t.blockLen);
        },
        exists: function (t, e = !0) {
            if (t.destroyed) throw new Error("Hash instance has been destroyed");
            if (e && t.finished) throw new Error("Hash#digest() has already been called");
        },
        output: function (t, e) {
            n(t);
            const r = e.outputLen;
            if (t.length < r) throw new Error(`digestInto() expects output buffer of length at least ${r}`);
        }
    };
    var i = s;
    const o = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0,
        h = t => new DataView(t.buffer, t.byteOffset, t.byteLength),
        c = (t, e) => t << 32 - e | t >>> e;
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    if (!(68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0])) throw new Error("Non little-endian hardware is not supported");
    function a(t) {
        if ("string" == typeof t && (t = function (t) {
            if ("string" != typeof t) throw new TypeError("utf8ToBytes expected string, got " + typeof t);
            return new TextEncoder().encode(t);
        }(t)), !(t instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
        return t;
    }
    Array.from({
        length: 256
    }, (t, e) => e.toString(16).padStart(2, "0"));
    let f = class {
        clone() {
            return this._cloneInto();
        }
    };
    function u(t) {
        const e = e => t().update(a(e)).digest(),
            r = t();
        return e.outputLen = r.outputLen, e.blockLen = r.blockLen, e.create = () => t(), e;
    }
    class l extends f {
        constructor(t, e, r, n) {
            super(), this.blockLen = t, this.outputLen = e, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = h(this.buffer);
        }
        update(t) {
            i.exists(this);
            const {
                view: e,
                buffer: r,
                blockLen: n
            } = this,
                s = (t = a(t)).length;
            for (let i = 0; i < s;) {
                const o = Math.min(n - this.pos, s - i);
                if (o !== n) r.set(t.subarray(i, i + o), this.pos), this.pos += o, i += o, this.pos === n && (this.process(e, 0), this.pos = 0); else {
                    const e = h(t);
                    for (; n <= s - i; i += n) this.process(e, i);
                }
            }
            return this.length += t.length, this.roundClean(), this;
        }
        digestInto(t) {
            i.exists(this), i.output(t, this), this.finished = !0;
            const {
                buffer: e,
                view: r,
                blockLen: n,
                isLE: s
            } = this;
            let {
                pos: o
            } = this;
            e[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > n - o && (this.process(r, 0), o = 0);
            for (let t = o; t < n; t++) e[t] = 0;
            !function (t, e, r, n) {
                if ("function" == typeof t.setBigUint64) return t.setBigUint64(e, r, n);
                const s = BigInt(32),
                    i = BigInt(4294967295),
                    o = Number(r >> s & i),
                    h = Number(r & i),
                    c = n ? 4 : 0,
                    a = n ? 0 : 4;
                t.setUint32(e + c, o, n), t.setUint32(e + a, h, n);
            }(r, n - 8, BigInt(8 * this.length), s), this.process(r, 0);
            const c = h(t),
                a = this.outputLen;
            if (a % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const f = a / 4,
                u = this.get();
            if (f > u.length) throw new Error("_sha2: outputLen bigger than state");
            for (let t = 0; t < f; t++) c.setUint32(4 * t, u[t], s);
        }
        digest() {
            const {
                buffer: t,
                outputLen: e
            } = this;
            this.digestInto(t);
            const r = t.slice(0, e);
            return this.destroy(), r;
        }
        _cloneInto(t) {
            t || (t = new this.constructor()), t.set(...this.get());
            const {
                blockLen: e,
                buffer: r,
                length: n,
                finished: s,
                destroyed: i,
                pos: o
            } = this;
            return t.length = n, t.pos = o, t.finished = s, t.destroyed = i, n % e && t.buffer.set(r), t;
        }
    }
    const d = (t, e, r) => t & e ^ t & r ^ e & r,
        b = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
        g = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
        w = new Uint32Array(64);
    class p extends l {
        constructor() {
            super(64, 32, 8, !1), this.A = 0 | g[0], this.B = 0 | g[1], this.C = 0 | g[2], this.D = 0 | g[3], this.E = 0 | g[4], this.F = 0 | g[5], this.G = 0 | g[6], this.H = 0 | g[7];
        }
        get() {
            const {
                A: t,
                B: e,
                C: r,
                D: n,
                E: s,
                F: i,
                G: o,
                H: h
            } = this;
            return [t, e, r, n, s, i, o, h];
        }
        set(t, e, r, n, s, i, o, h) {
            this.A = 0 | t, this.B = 0 | e, this.C = 0 | r, this.D = 0 | n, this.E = 0 | s, this.F = 0 | i, this.G = 0 | o, this.H = 0 | h;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) w[r] = t.getUint32(e, !1);
            for (let t = 16; t < 64; t++) {
                const e = w[t - 15],
                    r = w[t - 2],
                    n = c(e, 7) ^ c(e, 18) ^ e >>> 3,
                    s = c(r, 17) ^ c(r, 19) ^ r >>> 10;
                w[t] = s + w[t - 7] + n + w[t - 16] | 0;
            }
            let {
                A: r,
                B: n,
                C: s,
                D: i,
                E: o,
                F: h,
                G: a,
                H: f
            } = this;
            for (let t = 0; t < 64; t++) {
                const e = f + (c(o, 6) ^ c(o, 11) ^ c(o, 25)) + ((u = o) & h ^ ~u & a) + b[t] + w[t] | 0,
                    l = (c(r, 2) ^ c(r, 13) ^ c(r, 22)) + d(r, n, s) | 0;
                f = a, a = h, h = o, o = i + e | 0, i = s, s = n, n = r, r = e + l | 0;
            }
            var u;
            r = r + this.A | 0, n = n + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, o = o + this.E | 0, h = h + this.F | 0, a = a + this.G | 0, f = f + this.H | 0, this.set(r, n, s, i, o, h, a, f);
        }
        roundClean() {
            w.fill(0);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
        }
    }
    class y extends p {
        constructor() {
            super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
        }
    }
    const x = u(() => new p());
    u(() => new y());
    const A = BigInt(2 ** 32 - 1),
        m = BigInt(32);
    function H(t, e = !1) {
        return e ? {
            h: Number(t & A),
            l: Number(t >> m & A)
        } : {
            h: 0 | Number(t >> m & A),
            l: 0 | Number(t & A)
        };
    }
    var E = {
        fromBig: H,
        split: function (t, e = !1) {
            let r = new Uint32Array(t.length),
                n = new Uint32Array(t.length);
            for (let s = 0; s < t.length; s++) {
                const {
                    h: i,
                    l: o
                } = H(t[s], e);
                [r[s], n[s]] = [i, o];
            }
            return [r, n];
        },
        toBig: (t, e) => BigInt(t >>> 0) << m | BigInt(e >>> 0),
        shrSH: (t, e, r) => t >>> r,
        shrSL: (t, e, r) => t << 32 - r | e >>> r,
        rotrSH: (t, e, r) => t >>> r | e << 32 - r,
        rotrSL: (t, e, r) => t << 32 - r | e >>> r,
        rotrBH: (t, e, r) => t << 64 - r | e >>> r - 32,
        rotrBL: (t, e, r) => t >>> r - 32 | e << 64 - r,
        rotr32H: (t, e) => e,
        rotr32L: (t, e) => t,
        rotlSH: (t, e, r) => t << r | e >>> 32 - r,
        rotlSL: (t, e, r) => e << r | t >>> 32 - r,
        rotlBH: (t, e, r) => e << r - 32 | t >>> 64 - r,
        rotlBL: (t, e, r) => t << r - 32 | e >>> 64 - r,
        add: function (t, e, r, n) {
            const s = (e >>> 0) + (n >>> 0);
            return {
                h: t + r + (s / 2 ** 32 | 0) | 0,
                l: 0 | s
            };
        },
        add3L: (t, e, r) => (t >>> 0) + (e >>> 0) + (r >>> 0),
        add3H: (t, e, r, n) => e + r + n + (t / 2 ** 32 | 0) | 0,
        add4L: (t, e, r, n) => (t >>> 0) + (e >>> 0) + (r >>> 0) + (n >>> 0),
        add4H: (t, e, r, n, s) => e + r + n + s + (t / 2 ** 32 | 0) | 0,
        add5H: (t, e, r, n, s, i) => e + r + n + s + i + (t / 2 ** 32 | 0) | 0,
        add5L: (t, e, r, n, s) => (t >>> 0) + (e >>> 0) + (r >>> 0) + (n >>> 0) + (s >>> 0)
    };
    const [B, U] = E.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map(t => BigInt(t))),
        L = new Uint32Array(80),
        v = new Uint32Array(80);
    class S extends l {
        constructor() {
            super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
        }
        get() {
            const {
                Ah: t,
                Al: e,
                Bh: r,
                Bl: n,
                Ch: s,
                Cl: i,
                Dh: o,
                Dl: h,
                Eh: c,
                El: a,
                Fh: f,
                Fl: u,
                Gh: l,
                Gl: d,
                Hh: b,
                Hl: g
            } = this;
            return [t, e, r, n, s, i, o, h, c, a, f, u, l, d, b, g];
        }
        set(t, e, r, n, s, i, o, h, c, a, f, u, l, d, b, g) {
            this.Ah = 0 | t, this.Al = 0 | e, this.Bh = 0 | r, this.Bl = 0 | n, this.Ch = 0 | s, this.Cl = 0 | i, this.Dh = 0 | o, this.Dl = 0 | h, this.Eh = 0 | c, this.El = 0 | a, this.Fh = 0 | f, this.Fl = 0 | u, this.Gh = 0 | l, this.Gl = 0 | d, this.Hh = 0 | b, this.Hl = 0 | g;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) L[r] = t.getUint32(e), v[r] = t.getUint32(e += 4);
            for (let t = 16; t < 80; t++) {
                const e = 0 | L[t - 15],
                    r = 0 | v[t - 15],
                    n = E.rotrSH(e, r, 1) ^ E.rotrSH(e, r, 8) ^ E.shrSH(e, r, 7),
                    s = E.rotrSL(e, r, 1) ^ E.rotrSL(e, r, 8) ^ E.shrSL(e, r, 7),
                    i = 0 | L[t - 2],
                    o = 0 | v[t - 2],
                    h = E.rotrSH(i, o, 19) ^ E.rotrBH(i, o, 61) ^ E.shrSH(i, o, 6),
                    c = E.rotrSL(i, o, 19) ^ E.rotrBL(i, o, 61) ^ E.shrSL(i, o, 6),
                    a = E.add4L(s, c, v[t - 7], v[t - 16]),
                    f = E.add4H(a, n, h, L[t - 7], L[t - 16]);
                L[t] = 0 | f, v[t] = 0 | a;
            }
            let {
                Ah: r,
                Al: n,
                Bh: s,
                Bl: i,
                Ch: o,
                Cl: h,
                Dh: c,
                Dl: a,
                Eh: f,
                El: u,
                Fh: l,
                Fl: d,
                Gh: b,
                Gl: g,
                Hh: w,
                Hl: p
            } = this;
            for (let t = 0; t < 80; t++) {
                const e = E.rotrSH(f, u, 14) ^ E.rotrSH(f, u, 18) ^ E.rotrBH(f, u, 41),
                    y = E.rotrSL(f, u, 14) ^ E.rotrSL(f, u, 18) ^ E.rotrBL(f, u, 41),
                    x = f & l ^ ~f & b,
                    A = u & d ^ ~u & g,
                    m = E.add5L(p, y, A, U[t], v[t]),
                    H = E.add5H(m, w, e, x, B[t], L[t]),
                    S = 0 | m,
                    C = E.rotrSH(r, n, 28) ^ E.rotrBH(r, n, 34) ^ E.rotrBH(r, n, 39),
                    I = E.rotrSL(r, n, 28) ^ E.rotrBL(r, n, 34) ^ E.rotrBL(r, n, 39),
                    k = r & s ^ r & o ^ s & o,
                    D = n & i ^ n & h ^ i & h;
                w = 0 | b, p = 0 | g, b = 0 | l, g = 0 | d, l = 0 | f, d = 0 | u, ({
                    h: f,
                    l: u
                } = E.add(0 | c, 0 | a, 0 | H, 0 | S)), c = 0 | o, a = 0 | h, o = 0 | s, h = 0 | i, s = 0 | r, i = 0 | n;
                const F = E.add3L(S, I, D);
                r = E.add3H(F, H, C, k), n = 0 | F;
            }
            ({
                h: r,
                l: n
            } = E.add(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)), ({
                h: s,
                l: i
            } = E.add(0 | this.Bh, 0 | this.Bl, 0 | s, 0 | i)), ({
                h: o,
                l: h
            } = E.add(0 | this.Ch, 0 | this.Cl, 0 | o, 0 | h)), ({
                h: c,
                l: a
            } = E.add(0 | this.Dh, 0 | this.Dl, 0 | c, 0 | a)), ({
                h: f,
                l: u
            } = E.add(0 | this.Eh, 0 | this.El, 0 | f, 0 | u)), ({
                h: l,
                l: d
            } = E.add(0 | this.Fh, 0 | this.Fl, 0 | l, 0 | d)), ({
                h: b,
                l: g
            } = E.add(0 | this.Gh, 0 | this.Gl, 0 | b, 0 | g)), ({
                h: w,
                l: p
            } = E.add(0 | this.Hh, 0 | this.Hl, 0 | w, 0 | p)), this.set(r, n, s, i, o, h, c, a, f, u, l, d, b, g, w, p);
        }
        roundClean() {
            L.fill(0), v.fill(0);
        }
        destroy() {
            this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }
    class C extends S {
        constructor() {
            super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
        }
    }
    class I extends S {
        constructor() {
            super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
        }
    }
    class k extends S {
        constructor() {
            super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
        }
    }
    const D = u(() => new S());
    u(() => new C()), u(() => new I()), u(() => new k());
    const F = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]),
        G = Uint8Array.from({
            length: 16
        }, (t, e) => e),
        N = G.map(t => (9 * t + 5) % 16);
    let T = [G],
        z = [N];
    for (let t = 0; t < 4; t++) for (let e of [T, z]) e.push(e[t].map(t => F[t]));
    const j = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map(t => new Uint8Array(t)),
        O = T.map((t, e) => t.map(t => j[e][t])),
        $ = z.map((t, e) => t.map(t => j[e][t])),
        R = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]),
        V = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]),
        _ = (t, e) => t << e | t >>> 32 - e;
    function J(t, e, r, n) {
        return 0 === t ? e ^ r ^ n : 1 === t ? e & r | ~e & n : 2 === t ? (e | ~r) ^ n : 3 === t ? e & n | r & ~n : e ^ (r | ~n);
    }
    const W = new Uint32Array(16);
    class q extends l {
        constructor() {
            super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
        }
        get() {
            const {
                h0: t,
                h1: e,
                h2: r,
                h3: n,
                h4: s
            } = this;
            return [t, e, r, n, s];
        }
        set(t, e, r, n, s) {
            this.h0 = 0 | t, this.h1 = 0 | e, this.h2 = 0 | r, this.h3 = 0 | n, this.h4 = 0 | s;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) W[r] = t.getUint32(e, !0);
            let r = 0 | this.h0,
                n = r,
                s = 0 | this.h1,
                i = s,
                o = 0 | this.h2,
                h = o,
                c = 0 | this.h3,
                a = c,
                f = 0 | this.h4,
                u = f;
            for (let t = 0; t < 5; t++) {
                const e = 4 - t,
                    l = R[t],
                    d = V[t],
                    b = T[t],
                    g = z[t],
                    w = O[t],
                    p = $[t];
                for (let e = 0; e < 16; e++) {
                    const n = _(r + J(t, s, o, c) + W[b[e]] + l, w[e]) + f | 0;
                    r = f, f = c, c = 0 | _(o, 10), o = s, s = n;
                }
                for (let t = 0; t < 16; t++) {
                    const r = _(n + J(e, i, h, a) + W[g[t]] + d, p[t]) + u | 0;
                    n = u, u = a, a = 0 | _(h, 10), h = i, i = r;
                }
            }
            this.set(this.h1 + o + a | 0, this.h2 + c + u | 0, this.h3 + f + n | 0, this.h4 + r + i | 0, this.h0 + s + h | 0);
        }
        roundClean() {
            W.fill(0);
        }
        destroy() {
            this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
        }
    }
    const M = u(() => new q());
    class P extends f {
        constructor(t, e) {
            super(), this.finished = !1, this.destroyed = !1, i.hash(t);
            const r = a(e);
            if (this.iHash = t.create(), "function" != typeof this.iHash.update) throw new TypeError("Expected instance of class which extends utils.Hash");
            this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
            const n = this.blockLen,
                s = new Uint8Array(n);
            s.set(r.length > n ? t.create().update(r).digest() : r);
            for (let t = 0; t < s.length; t++) s[t] ^= 54;
            this.iHash.update(s), this.oHash = t.create();
            for (let t = 0; t < s.length; t++) s[t] ^= 106;
            this.oHash.update(s), s.fill(0);
        }
        update(t) {
            return i.exists(this), this.iHash.update(t), this;
        }
        digestInto(t) {
            i.exists(this), i.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
        }
        digest() {
            const t = new Uint8Array(this.oHash.outputLen);
            return this.digestInto(t), t;
        }
        _cloneInto(t) {
            t || (t = Object.create(Object.getPrototypeOf(this), {}));
            const {
                oHash: e,
                iHash: r,
                finished: n,
                destroyed: s,
                blockLen: i,
                outputLen: o
            } = this;
            return t.finished = n, t.destroyed = s, t.blockLen = i, t.outputLen = o, t.oHash = e._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
        }
        destroy() {
            this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
        }
    }
    const X = (t, e, r) => new P(t, e).update(r).digest();
    X.create = (t, e) => new P(t, e);
    const K = new TextEncoder(),
        Q = new TextDecoder();
    function Y(t) {
        return K.encode(t);
    }
    function Z(t) {
        const e = new Uint8Array(t.length / 2);
        let r,
            n = 0;
        if (null !== t.match(/[^a-fA-f0-9]/)) throw new TypeError("Invalid hex string: " + t);
        if (t.length % 2 > 0) throw new Error(`Hex string length is uneven: ${t.length}`);
        for (r = 0; r < t.length; r += 2) e[n] = parseInt(t.slice(r, r + 2), 16), n += 1;
        return e;
    }
    function tt(t) {
        if (0 === t) return Uint8Array.of(0);
        const e = [];
        for (; t > 0;) {
            const r = 255 & t;
            e.push(r), t = (t - r) / 256;
        }
        return new Uint8Array(e);
    }
    function et(t) {
        const e = new Array(8 * t.length);
        let r = 0;
        for (const n of t) {
            if (n > 255) throw new Error(`Invalid byte value: ${n}. Byte values must be between 0 and 255.`);
            for (let t = 7; t >= 0; t--, r++) e[r] = n >> t & 1;
        }
        return e;
    }
    function rt(t) {
        if (0n === t) return Uint8Array.of(0);
        const e = [];
        for (; t > 0n;) {
            const r = 0xffn & t;
            e.push(Number(r)), t = (t - r) / 256n;
        }
        return new Uint8Array(e);
    }
    function nt(t) {
        return Q.decode(t);
    }
    function st(t) {
        const e = new Array(t.length);
        for (let r = 0; r < t.length; r++) e.push(t[r].toString(16).padStart(2, "0"));
        return e.join("");
    }
    function it(t) {
        let e,
            r = 0;
        for (e = t.length - 1; e >= 0; e--) r = 256 * r + t[e];
        return Number(r);
    }
    function ot(t) {
        let e,
            r = 0n;
        for (e = t.length - 1; e >= 0; e--) r = 256n * r + BigInt(t[e]);
        return BigInt(r);
    }
    function ht(t, e = !0) {
        if (t instanceof ArrayBuffer) return new Uint8Array(t);
        if (t instanceof Uint8Array) return new Uint8Array(t);
        switch (typeof t) {
            case "bigint":
                return rt(t);
            case "boolean":
                return Uint8Array.of(t ? 1 : 0);
            case "number":
                return tt(t);
            case "string":
                return e ? Z(t) : K.encode(t);
            default:
                throw TypeError("Unsupported format:" + String(typeof t));
        }
    }
    function ct(t) {
        if ("object" == typeof t) {
            if (t instanceof Uint8Array) return t;
            try {
                return Y(JSON.stringify(t));
            } catch {
                throw TypeError("Object is not serializable.");
            }
        }
        return ht(t, !1);
    }
    function at(t) {
        if (t instanceof Uint8Array && (t = nt(t)), "string" == typeof t) try {
            return JSON.parse(t);
        } catch {
            return t;
        }
        return t;
    }
    const ft = {
        encode: t => st(t),
        decode: t => Z(t),
        normalize: t => ht(t),
        serialize: t => st(ht(t))
    },
        ut = {
            encode: t => nt(t),
            decode: t => Y(t),
            serialzie: t => ct(t),
            revive: t => at(t)
        };
    function lt(t) {
        return x(ht(t));
    }
    function dt(t) {
        return D(ht(t));
    }
    function bt(t) {
        return D(ht(t));
    }
    function gt(t) {
        return x(x(ht(t)));
    }
    function wt(t) {
        return M(x(ht(t)));
    }
    function pt(t, e) {
        return X(x, ht(t), ht(e));
    }
    function yt(t, e) {
        return X(D, ht(t), ht(e));
    }
    const xt = {
        sha256: lt,
        sha512: dt,
        ripe160: bt,
        hash256: gt,
        hash160: wt,
        hmac256: pt,
        hmac512: yt
    },
        At = new TextEncoder(),
        mt = [{
            name: "base58",
            charset: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        }];
    function Ht(t) {
        for (const e of mt) if (e.name === t) return e.charset;
        throw TypeError("Charset does not exist: " + t);
    }
    function Et(t) {
        return e([t, gt(t).slice(0, 4)]);
    }
    function Bt(t) {
        const e = t.slice(0, -4),
            r = t.slice(-4);
        if (gt(e).slice(0, 4).toString() !== r.toString()) throw new Error("Invalid checksum!");
        return e;
    }
    const Ut = {
        encode: function (t, e, r = !1) {
            "string" == typeof t && (t = At.encode(t));
            const n = Ht(e),
                s = n.length,
                i = [];
            let o,
                h,
                c,
                a = "",
                f = 0;
            for (o = 0; o < t.length; o++) for (f = 0, h = t[o], a += h > 0 || (a.length ^ o) > 0 ? "" : "1"; f in i || h > 0;) c = i[f], c = c > 0 ? 256 * c + h : h, h = c / s | 0, i[f] = c % s, f++;
            for (; f-- > 0;) a += n[i[f]];
            return r && a.length % 4 > 0 ? a + "=".repeat(4 - a.length % 4) : a;
        },
        decode: function (t, e) {
            const r = Ht(e),
                n = r.length,
                s = [],
                i = [];
            t = t.replace("=", "");
            let o,
                h,
                c,
                a = 0;
            for (o = 0; o < t.length; o++) {
                if (a = 0, h = r.indexOf(t[o]), h < 0) throw new Error(`Character range out of bounds: ${h}`);
                for (h > 0 || (i.length ^ o) > 0 || i.push(0); a in s || h > 0;) c = s[a], c = c > 0 ? c * n + h : h, h = c >> 8, s[a] = c % 256, a++;
            }
            for (; a-- > 0;) i.push(s[a]);
            return new Uint8Array(i);
        }
    },
        Lt = {
            encode: t => Ut.encode(t, "base58"),
            decode: t => Ut.decode(t, "base58")
        },
        vt = {
            encode: t => {
                const e = Et(t);
                return Ut.encode(e, "base58");
            },
            decode: t => Bt(Ut.decode(t, "base58"))
        },
        St = "qpzry9x8gf2tvdw0s3jn54khce6mua7l",
        Ct = [996825010, 642813549, 513874426, 1027748829, 705979059],
        It = [{
            version: 0,
            name: "bech32",
            const: 1
        }, {
            version: 1,
            name: "bech32m",
            const: 734539939
        }];
    function kt(t) {
        let e = 1;
        for (let r = 0; r < t.length; ++r) {
            const n = e >> 25;
            e = (33554431 & e) << 5 ^ t[r];
            for (let t = 0; t < 5; ++t) 0 != (n >> t & 1) && (e ^= Ct[t]);
        }
        return e;
    }
    function Dt(t) {
        const e = [];
        let r;
        for (r = 0; r < t.length; ++r) e.push(t.charCodeAt(r) >> 5);
        for (e.push(0), r = 0; r < t.length; ++r) e.push(31 & t.charCodeAt(r));
        return e;
    }
    function Ft(t, e, r, n = !0) {
        const s = [];
        let i = 0,
            o = 0;
        const h = (1 << r) - 1,
            c = (1 << e + r - 1) - 1;
        for (const n of t) {
            if (n < 0 || n >> e > 0) throw new Error("Failed to perform base conversion. Invalid value: " + String(n));
            for (i = (i << e | n) & c, o += e; o >= r;) o -= r, s.push(i >> o & h);
        }
        if (n) o > 0 && s.push(i << r - o & h); else if (o >= e || (i << r - o & h) > 0) throw new Error("Failed to perform base conversion. Invalid Size!");
        return s;
    }
    function Gt(t, e, r) {
        const n = e.concat(function (t, e, r) {
            const n = kt(Dt(t).concat(e).concat([0, 0, 0, 0, 0, 0])) ^ r.const,
                s = [];
            for (let t = 0; t < 6; ++t) s.push(n >> 5 * (5 - t) & 31);
            return s;
        }(t, e, r));
        let s = t + "1";
        for (let t = 0; t < n.length; ++t) s += St.charAt(n[t]);
        return s;
    }
    function Nt(t) {
        var _It$find;
        if (!function (t) {
            let e,
                r,
                n = !1,
                s = !1;
            for (e = 0; e < t.length; ++e) {
                if (r = t.charCodeAt(e), r < 33 || r > 126) return !1;
                r >= 97 && r <= 122 && (n = !0), r >= 65 && r <= 90 && (s = !0);
            }
            return !n || !s;
        }(t)) throw new Error("Encoded string goes out of bounds!");
        if (!function (t) {
            const e = t.lastIndexOf("1");
            return !(e < 1 || e + 7 > t.length || t.length > 90);
        }(t = t.toLowerCase())) throw new Error("Encoded string has invalid separator!");
        const e = [],
            r = t.lastIndexOf("1"),
            n = t.substring(0, r);
        for (let n = r + 1; n < t.length; ++n) {
            const r = St.indexOf(t.charAt(n));
            if (-1 === r) throw new Error("Character idx out of bounds: " + String(n));
            e.push(r);
        }
        const s = (_It$find = It.find(t => t.version === e[0])) !== null && _It$find !== void 0 ? _It$find : It[0];
        if (!function (t, e, r) {
            return kt(Dt(t).concat(e)) === r.const;
        }(n, e, s)) throw new Error("Checksum verification failed!");
        return [n, e.slice(0, e.length - 6)];
    }
    function Tt(t) {
        const e = (t = t.toLowerCase()).split("1", 1)[0],
            [r, n] = Nt(t),
            s = Ft(n.slice(1), 5, 8, !1),
            i = s.length;
        switch (!0) {
            case e !== r:
                throw new Error("Returned hrp string is invalid.");
            case null === s || i < 2 || i > 40:
                throw new Error("Decoded string is invalid or out of spec.");
            case n[0] > 16:
                throw new Error("Returned version bit is out of range.");
            default:
                return Uint8Array.from(s);
        }
    }
    const zt = {
        encode: function (t, e = "bc", r = 0) {
            var _It$find2;
            const n = Gt(e, [r, ...Ft([...t], 8, 5)], (_It$find2 = It.find(t => t.version === r)) !== null && _It$find2 !== void 0 ? _It$find2 : It[0]);
            return Tt(n), n;
        },
        decode: Tt,
        version: function (t) {
            t = t.toLowerCase();
            const [e, r] = Nt(t);
            return r[0];
        }
    },
        jt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        Ot = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        $t = new TextEncoder();
    function Rt(t, e = !1) {
        "string" == typeof t && (t = $t.encode(t));
        const r = e ? Ot : jt;
        let n = "",
            s = 0,
            i = 0;
        for (let e = 0; e < t.length; e++) for (i = i << 8 | t[e], s += 8; s >= 6;) s -= 6, n += r[i >> s & 63];
        if (s > 0) for (i <<= 6 - s, n += r[63 & i]; s < 6;) n += e ? "" : "=", s += 2;
        return n;
    }
    function Vt(t, e = !1) {
        const r = e || t.includes("-") || t.includes("_") ? Ot.split("") : jt.split(""),
            n = (t = t.replace(/=+$/, "")).split("");
        let s = 0,
            i = 0;
        const o = [];
        for (let t = 0; t < n.length; t++) {
            const e = n[t],
                h = r.indexOf(e);
            if (-1 === h) throw new Error("Invalid character: " + e);
            s += 6, i <<= 6, i |= h, s >= 8 && (s -= 8, o.push(i >>> s & 255));
        }
        return new Uint8Array(o);
    }
    const _t = {
        encode: Rt,
        decode: Vt
    },
        Jt = {
            encode: t => Rt(t, !0),
            decode: t => Vt(t, !0)
        };
    class Wt extends Uint8Array {
        constructor(t, e) {
            if (t = ht(t, !0), "number" == typeof e) {
                const r = new Uint8Array(e).fill(0);
                r.set(new Uint8Array(t)), t = r.buffer;
            }
            return super(t), this;
        }
        get arr() {
            return [...this];
        }
        get num() {
            return this.toNum();
        }
        get big() {
            return this.toBig();
        }
        get str() {
            return this.toStr();
        }
        get hex() {
            return this.toHex();
        }
        get raw() {
            return new Uint8Array(this);
        }
        get bits() {
            return this.toBits();
        }
        get bin() {
            return this.toBin();
        }
        get b58chk() {
            return this.tob58chk();
        }
        get base64() {
            return this.toBase64();
        }
        get b64url() {
            return this.toB64url();
        }
        get digest() {
            return this.toHash();
        }
        get id() {
            return this.toHash().hex;
        }
        get stream() {
            return new qt(this);
        }
        toNum(t = "le") {
            return it("le" === t ? this.reverse() : this);
        }
        toBig(t = "le") {
            return ot("le" === t ? this.reverse() : this);
        }
        toHash(t = "sha256") {
            switch (t) {
                case "sha256":
                    return new Wt(xt.sha256(this));
                case "hash256":
                    return new Wt(xt.hash256(this));
                case "ripe160":
                    return new Wt(xt.ripe160(this));
                case "hash160":
                    return new Wt(xt.hash160(this));
                default:
                    throw new Error("Unrecognized format:" + String(t));
            }
        }
        toHmac(t, e = "hmac256") {
            switch (e) {
                case "hmac256":
                    return new Wt(xt.hmac256(t, this));
                case "hmac512":
                    return new Wt(xt.hmac512(t, this));
                default:
                    throw new Error("Unrecognized format:" + String(e));
            }
        }
        toStr() {
            return nt(this);
        }
        toHex() {
            return st(this);
        }
        toJson() {
            return JSON.parse(nt(this));
        }
        toBytes() {
            return new Uint8Array(this);
        }
        toBits() {
            return et(this);
        }
        toBin() {
            return et(this).join("");
        }
        tob58chk() {
            return vt.encode(this);
        }
        toB64url() {
            return Jt.encode(this);
        }
        toBase64() {
            return _t.encode(this);
        }
        toBech32(t, e = 0) {
            return zt.encode(this, t, e);
        }
        prepend(t) {
            return Wt.join([Wt.bytes(t), this]);
        }
        append(t) {
            return Wt.join([this, Wt.bytes(t)]);
        }
        slice(t, e) {
            return new Wt(new Uint8Array(this).slice(t, e));
        }
        subarray(t, e) {
            return new Wt(new Uint8Array(this).subarray(t, e));
        }
        reverse() {
            return new Wt(new Uint8Array(this).reverse());
        }
        write(t, e) {
            this.set(t, e);
        }
        prefixSize(t) {
            const e = Wt.varInt(this.length, t);
            return Wt.join([e, this]);
        }
        static from(t) {
            return new Wt(Uint8Array.from(t));
        }
        static of(...t) {
            return new Wt(Uint8Array.of(...t));
        }
        static join(t) {
            const r = t.map(t => Wt.bytes(t));
            return new Wt(e(r));
        }
        static varInt(t, e) {
            if (t < 253) return Wt.num(t, 1);
            if (t < 65536) return Wt.of(253, ...Wt.num(t, 2, e));
            if (t < 4294967296) return Wt.of(254, ...Wt.num(t, 4, e));
            if (BigInt(t) < 0x10000000000000000n) return Wt.of(255, ...Wt.num(t, 8, e));
            throw new Error(`Value is too large: ${t}`);
        }
        static random(t = 32) {
            return new Wt(function (t = 32) {
                if (o && "function" == typeof o.getRandomValues) return o.getRandomValues(new Uint8Array(t));
                throw new Error("crypto.getRandomValues must be defined");
            }(t), t);
        }
        static normalize(t, e) {
            return new Wt(ht(t, !0), e);
        }
        static hexify(t) {
            return function (t) {
                return st(t = ht(t, !0));
            }(t);
        }
        static serialize(t, e) {
            return new Wt(ct(t), e);
        }
        static revive(t) {
            return at(t);
        }
    }
    _Wt = Wt;
    _Wt.num = (t, e, r = "le") => {
        const n = new _Wt(tt(t), e);
        return "le" === r ? n.reverse() : n;
    };
    _Wt.big = (t, e, r = "le") => {
        const n = new _Wt(rt(t), e);
        return "le" === r ? n.reverse() : n;
    };
    _Wt.bin = (t, e) => new _Wt(function (t) {
        if ("string" == typeof t) t = t.split("").map(Number); else if (!Array.isArray(t)) throw new Error("Invalid input type: expected a string or an array of numbers.");
        if (t.length % 8 != 0) throw new Error(`Binary array is invalid length: ${t.length}`);
        const e = new Uint8Array(t.length / 8);
        for (let r = 0, n = 0; r < t.length; r += 8, n++) {
            let s = 0;
            for (let e = 0; e < 8; e++) s |= t[r + e] << 7 - e;
            e[n] = s;
        }
        return e;
    }(t), e);
    _Wt.any = (t, e) => new _Wt(ht(t, !1), e);
    _Wt.raw = (t, e) => new _Wt(t, e);
    _Wt.str = (t, e) => new _Wt(Y(t), e);
    _Wt.hex = (t, e) => new _Wt(Z(t), e);
    _Wt.json = t => new _Wt(Y(JSON.stringify(t)));
    _Wt.bytes = (t, e) => new _Wt(ht(t, !0), e);
    _Wt.base64 = t => new _Wt(_t.decode(t));
    _Wt.b64url = t => new _Wt(Jt.decode(t));
    _Wt.bech32 = t => new _Wt(zt.decode(t));
    _Wt.b58chk = t => new _Wt(vt.decode(t));
    _Wt.encode = Y;
    _Wt.decode = nt;
    class qt {
        constructor(t) {
            this.data = new Uint8Array(t), this.size = this.data.length;
        }
        peek(t) {
            if (t > this.size) throw new Error(`Size greater than stream: ${t} > ${this.size}`);
            return new Wt(this.data.slice(0, t).buffer);
        }
        read(t) {
            var _t2;
            t = (_t2 = t) !== null && _t2 !== void 0 ? _t2 : this.readSize();
            const e = this.peek(t);
            return this.data = this.data.slice(t), this.size = this.data.length, e;
        }
        readSize(t) {
            const e = this.read(1).num;
            switch (!0) {
                case e >= 0 && e < 253:
                    return e;
                case 253 === e:
                    return this.read(2).toNum(t);
                case 254 === e:
                    return this.read(4).toNum(t);
                case 255 === e:
                    return this.read(8).toNum(t);
                default:
                    throw new Error(`Varint is out of range: ${e}`);
            }
        }
    }
    const Mt = {
        null: t => null === t,
        undefined: t => void 0 === t,
        hex: t => function (t) {
            switch (!0) {
                case "string" != typeof t:
                case t.length % 2 != 0:
                case /[^0-9a-fA-F]/.test(t):
                    return !1;
                default:
                    return !0;
            }
        }(t),
        string: t => "string" == typeof t,
        infinity: t => t === 1 / 0,
        bigint: t => "bigint" == typeof t,
        number: t => "number" == typeof t,
        class: t => "object" == typeof (t === null || t === void 0 ? void 0 : t.prototype) && t.toString().startsWith("class"),
        function: t => "function" == typeof t,
        uint8: t => t instanceof Uint8Array,
        uint16: t => t instanceof Uint16Array,
        uint32: t => t instanceof Uint32Array,
        buffer: t => t instanceof ArrayBuffer,
        array: t => Array.isArray(t),
        object: t => "object" == typeof t
    };
    const Pt = {
        type: t => {
            for (const [e, r] of Object.entries(Mt)) if (!0 === r(t)) return e;
            return "unknown";
        },
        array: {
            isString: t => t.every(t => Mt.string(t)),
            isNumber: t => t.every(t => Mt.number(t)),
            isBigint: t => t.every(t => Mt.bigint(t))
        },
        is: Mt
    };
    return t.B64URL = Jt, t.Base58 = Lt, t.Base58C = vt, t.Base64 = _t, t.BaseX = Ut, t.Bech32 = zt, t.Buff = Wt, t.Check = Pt, t.Hash = xt, t.Hex = ft, t.Stream = qt, t.Txt = ut, t.addChecksum = Et, t.b64decode = Vt, t.checkTheSum = Bt, t.hash160 = wt, t.hash256 = gt, t.hmac256 = pt, t.hmac512 = yt, t.ripe160 = bt, t.sha256 = lt, t.sha512 = dt, t;
}({});