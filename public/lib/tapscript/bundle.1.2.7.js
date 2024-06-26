var tapscript = function (t, _t2, _ki, _Ii, _Pi, _Zi) {
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
        a = t => new DataView(t.buffer, t.byteOffset, t.byteLength),
        c = (t, e) => t << 32 - e | t >>> e;
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    if (!(68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0])) throw new Error("Non little-endian hardware is not supported");
    function u(t) {
        if ("string" == typeof t && (t = function (t) {
            if ("string" != typeof t) throw new TypeError("utf8ToBytes expected string, got " + typeof t);
            return new TextEncoder().encode(t);
        }(t)), !(t instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
        return t;
    }
    Array.from({
        length: 256
    }, (t, e) => e.toString(16).padStart(2, "0"));
    let h = class {
        clone() {
            return this._cloneInto();
        }
    };
    function d(t) {
        const e = e => t().update(u(e)).digest(),
            r = t();
        return e.outputLen = r.outputLen, e.blockLen = r.blockLen, e.create = () => t(), e;
    }
    let f = class extends h {
        constructor(t, e, r, n) {
            super(), this.blockLen = t, this.outputLen = e, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = a(this.buffer);
        }
        update(t) {
            i.exists(this);
            const {
                view: e,
                buffer: r,
                blockLen: n
            } = this,
                s = (t = u(t)).length;
            for (let i = 0; i < s;) {
                const o = Math.min(n - this.pos, s - i);
                if (o !== n) r.set(t.subarray(i, i + o), this.pos), this.pos += o, i += o, this.pos === n && (this.process(e, 0), this.pos = 0); else {
                    const e = a(t);
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
                    a = Number(r & i),
                    c = n ? 4 : 0,
                    u = n ? 0 : 4;
                t.setUint32(e + c, o, n), t.setUint32(e + u, a, n);
            }(r, n - 8, BigInt(8 * this.length), s), this.process(r, 0);
            const c = a(t),
                u = this.outputLen;
            if (u % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const h = u / 4,
                d = this.get();
            if (h > d.length) throw new Error("_sha2: outputLen bigger than state");
            for (let t = 0; t < h; t++) c.setUint32(4 * t, d[t], s);
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
    };
    const l = (t, e, r) => t & e ^ t & r ^ e & r,
        p = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
        g = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
        m = new Uint32Array(64);
    let y = class extends f {
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
                H: a
            } = this;
            return [t, e, r, n, s, i, o, a];
        }
        set(t, e, r, n, s, i, o, a) {
            this.A = 0 | t, this.B = 0 | e, this.C = 0 | r, this.D = 0 | n, this.E = 0 | s, this.F = 0 | i, this.G = 0 | o, this.H = 0 | a;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) m[r] = t.getUint32(e, !1);
            for (let t = 16; t < 64; t++) {
                const e = m[t - 15],
                    r = m[t - 2],
                    n = c(e, 7) ^ c(e, 18) ^ e >>> 3,
                    s = c(r, 17) ^ c(r, 19) ^ r >>> 10;
                m[t] = s + m[t - 7] + n + m[t - 16] | 0;
            }
            let {
                A: r,
                B: n,
                C: s,
                D: i,
                E: o,
                F: a,
                G: u,
                H: h
            } = this;
            for (let t = 0; t < 64; t++) {
                const e = h + (c(o, 6) ^ c(o, 11) ^ c(o, 25)) + ((d = o) & a ^ ~d & u) + p[t] + m[t] | 0,
                    f = (c(r, 2) ^ c(r, 13) ^ c(r, 22)) + l(r, n, s) | 0;
                h = u, u = a, a = o, o = i + e | 0, i = s, s = n, n = r, r = e + f | 0;
            }
            var d;
            r = r + this.A | 0, n = n + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, o = o + this.E | 0, a = a + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, n, s, i, o, a, u, h);
        }
        roundClean() {
            m.fill(0);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
        }
    },
        b = class extends y {
            constructor() {
                super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
            }
        };
    const w = d(() => new y());
    d(() => new b());
    const v = BigInt(2 ** 32 - 1),
        x = BigInt(32);
    function _(t, e = !1) {
        return e ? {
            h: Number(t & v),
            l: Number(t >> x & v)
        } : {
            h: 0 | Number(t >> x & v),
            l: 0 | Number(t & v)
        };
    }
    var E = {
        fromBig: _,
        split: function (t, e = !1) {
            let r = new Uint32Array(t.length),
                n = new Uint32Array(t.length);
            for (let s = 0; s < t.length; s++) {
                const {
                    h: i,
                    l: o
                } = _(t[s], e);
                [r[s], n[s]] = [i, o];
            }
            return [r, n];
        },
        toBig: (t, e) => BigInt(t >>> 0) << x | BigInt(e >>> 0),
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
    const [S, A] = E.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map(t => BigInt(t))),
        k = new Uint32Array(80),
        O = new Uint32Array(80);
    let B = class extends f {
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
                Dl: a,
                Eh: c,
                El: u,
                Fh: h,
                Fl: d,
                Gh: f,
                Gl: l,
                Hh: p,
                Hl: g
            } = this;
            return [t, e, r, n, s, i, o, a, c, u, h, d, f, l, p, g];
        }
        set(t, e, r, n, s, i, o, a, c, u, h, d, f, l, p, g) {
            this.Ah = 0 | t, this.Al = 0 | e, this.Bh = 0 | r, this.Bl = 0 | n, this.Ch = 0 | s, this.Cl = 0 | i, this.Dh = 0 | o, this.Dl = 0 | a, this.Eh = 0 | c, this.El = 0 | u, this.Fh = 0 | h, this.Fl = 0 | d, this.Gh = 0 | f, this.Gl = 0 | l, this.Hh = 0 | p, this.Hl = 0 | g;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) k[r] = t.getUint32(e), O[r] = t.getUint32(e += 4);
            for (let t = 16; t < 80; t++) {
                const e = 0 | k[t - 15],
                    r = 0 | O[t - 15],
                    n = E.rotrSH(e, r, 1) ^ E.rotrSH(e, r, 8) ^ E.shrSH(e, r, 7),
                    s = E.rotrSL(e, r, 1) ^ E.rotrSL(e, r, 8) ^ E.shrSL(e, r, 7),
                    i = 0 | k[t - 2],
                    o = 0 | O[t - 2],
                    a = E.rotrSH(i, o, 19) ^ E.rotrBH(i, o, 61) ^ E.shrSH(i, o, 6),
                    c = E.rotrSL(i, o, 19) ^ E.rotrBL(i, o, 61) ^ E.shrSL(i, o, 6),
                    u = E.add4L(s, c, O[t - 7], O[t - 16]),
                    h = E.add4H(u, n, a, k[t - 7], k[t - 16]);
                k[t] = 0 | h, O[t] = 0 | u;
            }
            let {
                Ah: r,
                Al: n,
                Bh: s,
                Bl: i,
                Ch: o,
                Cl: a,
                Dh: c,
                Dl: u,
                Eh: h,
                El: d,
                Fh: f,
                Fl: l,
                Gh: p,
                Gl: g,
                Hh: m,
                Hl: y
            } = this;
            for (let t = 0; t < 80; t++) {
                const e = E.rotrSH(h, d, 14) ^ E.rotrSH(h, d, 18) ^ E.rotrBH(h, d, 41),
                    b = E.rotrSL(h, d, 14) ^ E.rotrSL(h, d, 18) ^ E.rotrBL(h, d, 41),
                    w = h & f ^ ~h & p,
                    v = d & l ^ ~d & g,
                    x = E.add5L(y, b, v, A[t], O[t]),
                    _ = E.add5H(x, m, e, w, S[t], k[t]),
                    B = 0 | x,
                    I = E.rotrSH(r, n, 28) ^ E.rotrBH(r, n, 34) ^ E.rotrBH(r, n, 39),
                    P = E.rotrSL(r, n, 28) ^ E.rotrBL(r, n, 34) ^ E.rotrBL(r, n, 39),
                    T = r & s ^ r & o ^ s & o,
                    U = n & i ^ n & a ^ i & a;
                m = 0 | p, y = 0 | g, p = 0 | f, g = 0 | l, f = 0 | h, l = 0 | d, ({
                    h: h,
                    l: d
                } = E.add(0 | c, 0 | u, 0 | _, 0 | B)), c = 0 | o, u = 0 | a, o = 0 | s, a = 0 | i, s = 0 | r, i = 0 | n;
                const C = E.add3L(B, P, U);
                r = E.add3H(C, _, I, T), n = 0 | C;
            }
            ({
                h: r,
                l: n
            } = E.add(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)), ({
                h: s,
                l: i
            } = E.add(0 | this.Bh, 0 | this.Bl, 0 | s, 0 | i)), ({
                h: o,
                l: a
            } = E.add(0 | this.Ch, 0 | this.Cl, 0 | o, 0 | a)), ({
                h: c,
                l: u
            } = E.add(0 | this.Dh, 0 | this.Dl, 0 | c, 0 | u)), ({
                h: h,
                l: d
            } = E.add(0 | this.Eh, 0 | this.El, 0 | h, 0 | d)), ({
                h: f,
                l: l
            } = E.add(0 | this.Fh, 0 | this.Fl, 0 | f, 0 | l)), ({
                h: p,
                l: g
            } = E.add(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | g)), ({
                h: m,
                l: y
            } = E.add(0 | this.Hh, 0 | this.Hl, 0 | m, 0 | y)), this.set(r, n, s, i, o, a, c, u, h, d, f, l, p, g, m, y);
        }
        roundClean() {
            k.fill(0), O.fill(0);
        }
        destroy() {
            this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    },
        I = class extends B {
            constructor() {
                super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
            }
        },
        P = class extends B {
            constructor() {
                super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
            }
        },
        T = class extends B {
            constructor() {
                super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
            }
        };
    const U = d(() => new B());
    d(() => new I()), d(() => new P()), d(() => new T());
    const C = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]),
        L = Uint8Array.from({
            length: 16
        }, (t, e) => e),
        N = L.map(t => (9 * t + 5) % 16);
    let H = [L],
        Z = [N];
    for (let t = 0; t < 4; t++) for (let e of [H, Z]) e.push(e[t].map(t => C[t]));
    const R = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map(t => new Uint8Array(t)),
        j = H.map((t, e) => t.map(t => R[e][t])),
        D = Z.map((t, e) => t.map(t => R[e][t])),
        z = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]),
        $ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]),
        F = (t, e) => t << e | t >>> 32 - e;
    function q(t, e, r, n) {
        return 0 === t ? e ^ r ^ n : 1 === t ? e & r | ~e & n : 2 === t ? (e | ~r) ^ n : 3 === t ? e & n | r & ~n : e ^ (r | ~n);
    }
    const K = new Uint32Array(16);
    let V = class extends f {
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
            for (let r = 0; r < 16; r++, e += 4) K[r] = t.getUint32(e, !0);
            let r = 0 | this.h0,
                n = r,
                s = 0 | this.h1,
                i = s,
                o = 0 | this.h2,
                a = o,
                c = 0 | this.h3,
                u = c,
                h = 0 | this.h4,
                d = h;
            for (let t = 0; t < 5; t++) {
                const e = 4 - t,
                    f = z[t],
                    l = $[t],
                    p = H[t],
                    g = Z[t],
                    m = j[t],
                    y = D[t];
                for (let e = 0; e < 16; e++) {
                    const n = F(r + q(t, s, o, c) + K[p[e]] + f, m[e]) + h | 0;
                    r = h, h = c, c = 0 | F(o, 10), o = s, s = n;
                }
                for (let t = 0; t < 16; t++) {
                    const r = F(n + q(e, i, a, u) + K[g[t]] + l, y[t]) + d | 0;
                    n = d, d = u, u = 0 | F(a, 10), a = i, i = r;
                }
            }
            this.set(this.h1 + o + u | 0, this.h2 + c + d | 0, this.h3 + h + n | 0, this.h4 + r + i | 0, this.h0 + s + a | 0);
        }
        roundClean() {
            K.fill(0);
        }
        destroy() {
            this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
        }
    };
    const M = d(() => new V());
    let G = class extends h {
        constructor(t, e) {
            super(), this.finished = !1, this.destroyed = !1, i.hash(t);
            const r = u(e);
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
    };
    const W = (t, e, r) => new G(t, e).update(r).digest();
    W.create = (t, e) => new G(t, e);
    const Y = new TextEncoder(),
        J = new TextDecoder();
    function Q(t) {
        return Y.encode(t);
    }
    function X(t) {
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
        return J.decode(t);
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
    function at(t, e = !0) {
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
                return e ? X(t) : Y.encode(t);
            default:
                throw TypeError("Unsupported format:" + String(typeof t));
        }
    }
    function ct(t) {
        return w(w(at(t)));
    }
    const ut = {
        sha256: function (t) {
            return w(at(t));
        },
        sha512: function (t) {
            return U(at(t));
        },
        ripe160: function (t) {
            return U(at(t));
        },
        hash256: ct,
        hash160: function (t) {
            return M(w(at(t)));
        },
        hmac256: function (t, e) {
            return W(w, at(t), at(e));
        },
        hmac512: function (t, e) {
            return W(U, at(t), at(e));
        }
    },
        ht = new TextEncoder(),
        dt = [{
            name: "base58",
            charset: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        }];
    function ft(t) {
        for (const e of dt) if (e.name === t) return e.charset;
        throw TypeError("Charset does not exist: " + t);
    }
    const lt = {
        encode: function (t, e, r = !1) {
            "string" == typeof t && (t = ht.encode(t));
            const n = ft(e),
                s = n.length,
                i = [];
            let o,
                a,
                c,
                u = "",
                h = 0;
            for (o = 0; o < t.length; o++) for (h = 0, a = t[o], u += a > 0 || (u.length ^ o) > 0 ? "" : "1"; h in i || a > 0;) c = i[h], c = c > 0 ? 256 * c + a : a, a = c / s | 0, i[h] = c % s, h++;
            for (; h-- > 0;) u += n[i[h]];
            return r && u.length % 4 > 0 ? u + "=".repeat(4 - u.length % 4) : u;
        },
        decode: function (t, e) {
            const r = ft(e),
                n = r.length,
                s = [],
                i = [];
            t = t.replace("=", "");
            let o,
                a,
                c,
                u = 0;
            for (o = 0; o < t.length; o++) {
                if (u = 0, a = r.indexOf(t[o]), a < 0) throw new Error(`Character range out of bounds: ${a}`);
                for (a > 0 || (i.length ^ o) > 0 || i.push(0); u in s || a > 0;) c = s[u], c = c > 0 ? c * n + a : a, a = c >> 8, s[u] = c % 256, u++;
            }
            for (; u-- > 0;) i.push(s[u]);
            return new Uint8Array(i);
        }
    },
        pt = t => {
            const r = function (t) {
                return e([t, ct(t).slice(0, 4)]);
            }(t);
            return lt.encode(r, "base58");
        },
        gt = t => function (t) {
            const e = t.slice(0, -4),
                r = t.slice(-4);
            if (ct(e).slice(0, 4).toString() !== r.toString()) throw new Error("Invalid checksum!");
            return e;
        }(lt.decode(t, "base58")),
        mt = "qpzry9x8gf2tvdw0s3jn54khce6mua7l",
        yt = [996825010, 642813549, 513874426, 1027748829, 705979059],
        bt = [{
            version: 0,
            name: "bech32",
            const: 1
        }, {
            version: 1,
            name: "bech32m",
            const: 734539939
        }];
    function wt(t) {
        let e = 1;
        for (let r = 0; r < t.length; ++r) {
            const n = e >> 25;
            e = (33554431 & e) << 5 ^ t[r];
            for (let t = 0; t < 5; ++t) 0 != (n >> t & 1) && (e ^= yt[t]);
        }
        return e;
    }
    function vt(t) {
        const e = [];
        let r;
        for (r = 0; r < t.length; ++r) e.push(t.charCodeAt(r) >> 5);
        for (e.push(0), r = 0; r < t.length; ++r) e.push(31 & t.charCodeAt(r));
        return e;
    }
    function xt(t, e, r, n = !0) {
        const s = [];
        let i = 0,
            o = 0;
        const a = (1 << r) - 1,
            c = (1 << e + r - 1) - 1;
        for (const n of t) {
            if (n < 0 || n >> e > 0) throw new Error("Failed to perform base conversion. Invalid value: " + String(n));
            for (i = (i << e | n) & c, o += e; o >= r;) o -= r, s.push(i >> o & a);
        }
        if (n) o > 0 && s.push(i << r - o & a); else if (o >= e || (i << r - o & a) > 0) throw new Error("Failed to perform base conversion. Invalid Size!");
        return s;
    }
    function _t(t, e, r) {
        const n = e.concat(function (t, e, r) {
            const n = wt(vt(t).concat(e).concat([0, 0, 0, 0, 0, 0])) ^ r.const,
                s = [];
            for (let t = 0; t < 6; ++t) s.push(n >> 5 * (5 - t) & 31);
            return s;
        }(t, e, r));
        let s = t + "1";
        for (let t = 0; t < n.length; ++t) s += mt.charAt(n[t]);
        return s;
    }
    function Et(t) {
        var _bt$find;
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
            const r = mt.indexOf(t.charAt(n));
            if (-1 === r) throw new Error("Character idx out of bounds: " + String(n));
            e.push(r);
        }
        const s = (_bt$find = bt.find(t => t.version === e[0])) !== null && _bt$find !== void 0 ? _bt$find : bt[0];
        if (!function (t, e, r) {
            return wt(vt(t).concat(e)) === r.const;
        }(n, e, s)) throw new Error("Checksum verification failed!");
        return [n, e.slice(0, e.length - 6)];
    }
    function St(t) {
        const e = (t = t.toLowerCase()).split("1", 1)[0],
            [r, n] = Et(t),
            s = xt(n.slice(1), 5, 8, !1),
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
    const At = {
        encode: function (t, e = "bc", r = 0) {
            var _bt$find2;
            const n = _t(e, [r, ...xt([...t], 8, 5)], (_bt$find2 = bt.find(t => t.version === r)) !== null && _bt$find2 !== void 0 ? _bt$find2 : bt[0]);
            return St(n), n;
        },
        decode: St,
        version: function (t) {
            t = t.toLowerCase();
            const [e, r] = Et(t);
            return r[0];
        }
    },
        kt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        Ot = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        Bt = new TextEncoder();
    function It(t, e = !1) {
        "string" == typeof t && (t = Bt.encode(t));
        const r = e ? Ot : kt;
        let n = "",
            s = 0,
            i = 0;
        for (let e = 0; e < t.length; e++) for (i = i << 8 | t[e], s += 8; s >= 6;) s -= 6, n += r[i >> s & 63];
        if (s > 0) for (i <<= 6 - s, n += r[63 & i]; s < 6;) n += e ? "" : "=", s += 2;
        return n;
    }
    function Pt(t, e = !1) {
        const r = e || t.includes("-") || t.includes("_") ? Ot.split("") : kt.split(""),
            n = (t = t.replace(/=+$/, "")).split("");
        let s = 0,
            i = 0;
        const o = [];
        for (let t = 0; t < n.length; t++) {
            const e = n[t],
                a = r.indexOf(e);
            if (-1 === a) throw new Error("Invalid character: " + e);
            s += 6, i <<= 6, i |= a, s >= 8 && (s -= 8, o.push(i >>> s & 255));
        }
        return new Uint8Array(o);
    }
    const Tt = {
        encode: It,
        decode: Pt
    },
        Ut = t => It(t, !0),
        Ct = t => Pt(t, !0);
    let Lt = (_t2 = class t extends Uint8Array {
        constructor(t, e) {
            if (t = at(t, !0), "number" == typeof e) {
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
            return new Nt(this);
        }
        toNum(t = "le") {
            return it("le" === t ? this.reverse() : this);
        }
        toBig(t = "le") {
            return ot("le" === t ? this.reverse() : this);
        }
        toHash(e = "sha256") {
            switch (e) {
                case "sha256":
                    return new t(ut.sha256(this));
                case "hash256":
                    return new t(ut.hash256(this));
                case "ripe160":
                    return new t(ut.ripe160(this));
                case "hash160":
                    return new t(ut.hash160(this));
                default:
                    throw new Error("Unrecognized format:" + String(e));
            }
        }
        toHmac(e, r = "hmac256") {
            switch (r) {
                case "hmac256":
                    return new t(ut.hmac256(e, this));
                case "hmac512":
                    return new t(ut.hmac512(e, this));
                default:
                    throw new Error("Unrecognized format:" + String(r));
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
            return pt(this);
        }
        toB64url() {
            return Ut(this);
        }
        toBase64() {
            return Tt.encode(this);
        }
        toBech32(t, e = 0) {
            return At.encode(this, t, e);
        }
        prepend(e) {
            return t.join([t.bytes(e), this]);
        }
        append(e) {
            return t.join([this, t.bytes(e)]);
        }
        slice(e, r) {
            return new t(new Uint8Array(this).slice(e, r));
        }
        subarray(e, r) {
            return new t(new Uint8Array(this).subarray(e, r));
        }
        reverse() {
            return new t(new Uint8Array(this).reverse());
        }
        write(t, e) {
            this.set(t, e);
        }
        prefixSize(e) {
            const r = t.varInt(this.length, e);
            return t.join([r, this]);
        }
        static from(e) {
            return new t(Uint8Array.from(e));
        }
        static of(...e) {
            return new t(Uint8Array.of(...e));
        }
        static join(r) {
            const n = r.map(e => t.bytes(e));
            return new t(e(n));
        }
        static varInt(e, r) {
            if (e < 253) return t.num(e, 1);
            if (e < 65536) return t.of(253, ...t.num(e, 2, r));
            if (e < 4294967296) return t.of(254, ...t.num(e, 4, r));
            if (BigInt(e) < 0x10000000000000000n) return t.of(255, ...t.num(e, 8, r));
            throw new Error(`Value is too large: ${e}`);
        }
        static random(e = 32) {
            return new t(function (t = 32) {
                if (o && "function" == typeof o.getRandomValues) return o.getRandomValues(new Uint8Array(t));
                throw new Error("crypto.getRandomValues must be defined");
            }(e), e);
        }
        static normalize(e, r) {
            return new t(at(e, !0), r);
        }
        static hexify(t) {
            return function (t) {
                return st(t = at(t, !0));
            }(t);
        }
        static serialize(e, r) {
            return new t(function (t) {
                if ("object" == typeof t) {
                    if (t instanceof Uint8Array) return t;
                    try {
                        return Q(JSON.stringify(t));
                    } catch {
                        throw TypeError("Object is not serializable.");
                    }
                }
                return at(t, !1);
            }(e), r);
        }
        static revive(t) {
            return function (t) {
                if (t instanceof Uint8Array && (t = nt(t)), "string" == typeof t) try {
                    return JSON.parse(t);
                } catch {
                    return t;
                }
                return t;
            }(t);
        }
    }, _t2.num = (e, r, n = "le") => {
        const s = new _t2(tt(e), r);
        return "le" === n ? s.reverse() : s;
    }, _t2.big = (e, r, n = "le") => {
        const s = new _t2(rt(e), r);
        return "le" === n ? s.reverse() : s;
    }, _t2.bin = (e, r) => new _t2(function (t) {
        if ("string" == typeof t) t = t.split("").map(Number); else if (!Array.isArray(t)) throw new Error("Invalid input type: expected a string or an array of numbers.");
        if (t.length % 8 != 0) throw new Error(`Binary array is invalid length: ${t.length}`);
        const e = new Uint8Array(t.length / 8);
        for (let r = 0, n = 0; r < t.length; r += 8, n++) {
            let s = 0;
            for (let e = 0; e < 8; e++) s |= t[r + e] << 7 - e;
            e[n] = s;
        }
        return e;
    }(e), r), _t2.any = (e, r) => new _t2(at(e, !1), r), _t2.raw = (e, r) => new _t2(e, r), _t2.str = (e, r) => new _t2(Q(e), r), _t2.hex = (e, r) => new _t2(X(e), r), _t2.json = e => new _t2(Q(JSON.stringify(e))), _t2.bytes = (e, r) => new _t2(at(e, !0), r), _t2.base64 = e => new _t2(Tt.decode(e)), _t2.b64url = e => new _t2(Ct(e)), _t2.bech32 = e => new _t2(At.decode(e)), _t2.b58chk = e => new _t2(gt(e)), _t2.encode = Q, _t2.decode = nt, _t2),
        Nt = class {
            constructor(t) {
                this.data = new Uint8Array(t), this.size = this.data.length;
            }
            peek(t) {
                if (t > this.size) throw new Error(`Size greater than stream: ${t} > ${this.size}`);
                return new Lt(this.data.slice(0, t).buffer);
            }
            read(t) {
                var _t3;
                t = (_t3 = t) !== null && _t3 !== void 0 ? _t3 : this.readSize();
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
        };
    function Ht(t, e) {
        const r = Lt.bytes(t);
        if (r.length !== e) throw new Error(`Invalid input size: ${r.hex} !== ${e}`);
    }
    function Zt(t, e) {
        if (e) throw new Error(t);
        return !1;
    }
    function Rt(t, ...e) {
        const r = Lt.str(t).digest.raw,
            n = e.map(t => Lt.normalize(t));
        return Lt.join([r, r, Lt.join(n)]).digest;
    }
    function jt(t, e = "main") {
        const r = "main" === e ? ["1"] : ["m", "n"];
        for (const e of r) if (t.startsWith(e)) return !0;
        return !1;
    }
    function Dt(t, e = "main") {
        const r = Lt.bytes(t),
            n = "main" === e ? Lt.num(0) : Lt.num(111);
        return Ht(t, 20), r.prepend(n).tob58chk();
    }
    const zt = {
        check: jt,
        encode: Dt,
        decode: function (t, e = "main") {
            if (!jt(t, e)) throw new TypeError("Invalid p2pkh address!");
            return Lt.b58chk(t).slice(1);
        },
        scriptPubKey: function (t) {
            const e = Lt.bytes(t);
            return Ht(e, 20), ["OP_DUP", "OP_HASH160", e.hex, "OP_EQUALVERIFY", "OP_CHECKSIG"];
        },
        fromPubKey: function (t, e) {
            const r = Lt.bytes(t);
            return Ht(r, 33), Dt(r.toHash("hash160"), e);
        }
    },
        $t = {
            OP_0: 0,
            OP_PUSHDATA1: 76,
            OP_PUSHDATA2: 77,
            OP_PUSHDATA4: 78,
            OP_1NEGATE: 79,
            OP_SUCCESS80: 80,
            OP_1: 81,
            OP_2: 82,
            OP_3: 83,
            OP_4: 84,
            OP_5: 85,
            OP_6: 86,
            OP_7: 87,
            OP_8: 88,
            OP_9: 89,
            OP_10: 90,
            OP_11: 91,
            OP_12: 92,
            OP_13: 93,
            OP_14: 94,
            OP_15: 95,
            OP_16: 96,
            OP_NOP: 97,
            OP_SUCCESS98: 98,
            OP_IF: 99,
            OP_NOTIF: 100,
            OP_ELSE: 103,
            OP_ENDIF: 104,
            OP_VERIFY: 105,
            OP_RETURN: 106,
            OP_TOALTSTACK: 107,
            OP_FROMALTSTACK: 108,
            OP_2DROP: 109,
            OP_2DUP: 110,
            OP_3DUP: 111,
            OP_2OVER: 112,
            OP_2ROT: 113,
            OP_2SWAP: 114,
            OP_IFDUP: 115,
            OP_DEPTH: 116,
            OP_DROP: 117,
            OP_DUP: 118,
            OP_NIP: 119,
            OP_OVER: 120,
            OP_PICK: 121,
            OP_ROLL: 122,
            OP_ROT: 123,
            OP_SWAP: 124,
            OP_TUCK: 125,
            OP_SUCCESS126: 126,
            OP_SUCCESS127: 127,
            OP_SUCCESS128: 128,
            OP_SUCCESS129: 129,
            OP_SIZE: 130,
            OP_SUCCESS131: 131,
            OP_SUCCESS132: 132,
            OP_SUCCESS133: 133,
            OP_SUCCESS134: 134,
            OP_EQUAL: 135,
            OP_EQUALVERIFY: 136,
            OP_SUCCESS137: 137,
            OP_SUCCESS138: 138,
            OP_1ADD: 139,
            OP_1SUB: 140,
            OP_SUCCESS141: 141,
            OP_SUCCESS142: 142,
            OP_NEGATE: 143,
            OP_ABS: 144,
            OP_NOT: 145,
            OP_0NOTEQUAL: 146,
            OP_ADD: 147,
            OP_SUB: 148,
            OP_SUCCESS149: 149,
            OP_SUCCESS150: 150,
            OP_SUCCESS151: 151,
            OP_SUCCESS152: 152,
            OP_SUCCESS153: 153,
            OP_BOOLAND: 154,
            OP_BOOLOR: 155,
            OP_NUMEQUAL: 156,
            OP_NUMEQUALVERIFY: 157,
            OP_NUMNOTEQUAL: 158,
            OP_LESSTHAN: 159,
            OP_GREATERTHAN: 160,
            OP_LESSTHANOREQUAL: 161,
            OP_GREATERTHANOREQUAL: 162,
            OP_MIN: 163,
            OP_MAX: 164,
            OP_WITHIN: 165,
            OP_RIPEMD160: 166,
            OP_SHA1: 167,
            OP_SHA256: 168,
            OP_HASH160: 169,
            OP_HASH256: 170,
            OP_CODESEPARATOR: 171,
            OP_CHECKSIG: 172,
            OP_CHECKSIGVERIFY: 173,
            OP_CHECKMULTISIG: 174,
            OP_CHECKMULTISIGVERIFY: 175,
            OP_NOP1: 176,
            OP_CHECKLOCKTIMEVERIFY: 177,
            OP_CHECKSEQUENCEVERIFY: 178,
            OP_NOP4: 179,
            OP_NOP5: 180,
            OP_NOP6: 181,
            OP_NOP7: 182,
            OP_NOP8: 183,
            OP_NOP9: 184,
            OP_NOP10: 185,
            OP_CHECKSIGADD: 186
        };
    function Ft(t) {
        if (t > 186 && t < 255) return "OP_SUCCESS" + String(t);
        for (const [e, r] of Object.entries($t)) if (r === t) return e;
        throw new Error("OPCODE not found:" + String(t));
    }
    function qt(t) {
        switch (!0) {
            case 0 === t:
                return "opcode";
            case t >= 1 && t <= 75:
                return "varint";
            case 76 === t:
                return "pushdata1";
            case 77 === t:
                return "pushdata2";
            case 78 === t:
                return "pushdata4";
            case t <= 254:
                return "opcode";
            default:
                throw new Error(`Invalid word range: ${t}`);
        }
    }
    function Kt(t) {
        switch (!0) {
            case "number" != typeof t:
                return !1;
            case 0 === t:
                return !0;
            case [].includes(t):
                return !1;
            case 75 < t && t < 254:
                return !0;
            default:
                return !1;
        }
    }
    function Vt(t) {
        return "string" == typeof t && t.length % 2 == 0 && /[0-9a-fA-F]/.test(t);
    }
    function Mt(t) {
        return Vt(t) || t instanceof Uint8Array;
    }
    const Gt = 520;
    function Wt(t = [], e = !0) {
        let r = Lt.num(0);
        return Array.isArray(t) && (r = Lt.raw(Yt(t))), Vt(t) && (r = Lt.hex(t)), t instanceof Uint8Array && (r = Lt.raw(t)), e && (r = r.prefixSize("be")), r;
    }
    function Yt(t) {
        const e = [];
        for (const r of t) e.push(Jt(r));
        return e.length > 0 ? Lt.join(e) : new Uint8Array();
    }
    function Jt(t) {
        let e = new Uint8Array();
        if ("string" == typeof t) {
            if (t.startsWith("OP_")) return Lt.num(function (t) {
                for (const [e, r] of Object.entries($t)) if (e === t) return Number(r);
                throw new Error("OPCODE not found:" + t);
            }(t), 1);
            e = Vt(t) ? Lt.hex(t) : Lt.str(t);
        } else if (e = Lt.bytes(t), 1 === e.length && e[0] <= 16) return 0 !== e[0] && (e[0] += 80), e;
        if (e.length > Gt) {
            const t = function (t) {
                const e = [],
                    r = new Nt(t);
                for (; r.size > Gt;) e.push(r.read(Gt));
                return e.push(r.read(r.size)), e;
            }(e);
            return Yt(t);
        }
        return Lt.join([Qt(e.length), e]);
    }
    function Qt(t) {
        const e = Lt.num(76, 1),
            r = Lt.num(77, 1);
        switch (!0) {
            case t <= 75:
                return Lt.num(t);
            case t > 75 && t < 256:
                return Lt.join([e, Lt.num(t, 1)]);
            case t >= 256 && t <= Gt:
                return Lt.join([r, Lt.num(t, 2, "be")]);
            default:
                throw new Error("Invalid word size:" + t.toString());
        }
    }
    function Xt(t, e = !1) {
        let r = Lt.bytes(t);
        if (e) {
            const t = r.stream.readSize("be");
            if (r.length !== t) throw new Error(`Varint does not match stream size: ${t} !== ${r.length}`);
            r = r.slice(1);
        }
        return function (t) {
            const e = new Nt(t),
                r = [],
                n = e.size;
            let s,
                i,
                o,
                a = 0;
            for (; a < n;) switch (s = e.read(1).num, i = qt(s), a++, i) {
                case "varint":
                    r.push(e.read(s).hex), a += s;
                    break;
                case "pushdata1":
                    o = e.read(1).reverse().num, r.push(e.read(o).hex), a += o + 1;
                    break;
                case "pushdata2":
                    o = e.read(2).reverse().num, r.push(e.read(o).hex), a += o + 2;
                    break;
                case "pushdata4":
                    o = e.read(4).reverse().num, r.push(e.read(o).hex), a += o + 4;
                    break;
                case "opcode":
                    if (!Kt(s)) throw new Error(`Invalid OPCODE: ${s}`);
                    r.push(Ft(s));
                    break;
                default:
                    throw new Error(`Word type undefined: ${s}`);
            }
            return r;
        }(r);
    }
    const te = {
        toAsm: function (t, e) {
            if (Array.isArray(t) && (t = Wt(t, e)), t instanceof Uint8Array || Vt(t)) return Xt(t, e);
            throw new Error("Invalid format: " + String(typeof t));
        },
        toBytes: function (t, e) {
            if ((t instanceof Uint8Array || Vt(t)) && (t = Xt(t, e)), Array.isArray(t)) return Wt(t, e);
            throw new Error("Invalid format: " + String(typeof t));
        },
        toParam: function (t) {
            if (!Array.isArray(t)) return Lt.bytes(t);
            throw new Error("Invalid format: " + String(typeof t));
        }
    },
        ee = {
            encode: Wt,
            decode: Xt,
            fmt: te
        };
    function re(t, e = "main") {
        const r = "main" === e ? ["3"] : ["2"];
        for (const e of r) if (t.startsWith(e)) return !0;
        return !1;
    }
    function ne(t, e = "main") {
        const r = "main" === e ? Lt.num(5) : Lt.num(196),
            n = Lt.bytes(t);
        return Ht(n, 20), n.prepend(r).tob58chk();
    }
    const se = {
        check: re,
        encode: ne,
        decode: function (t, e = "main") {
            if (!re(t, e)) throw new TypeError(`Invalid p2sh address for network ${e}:` + t);
            return Lt.b58chk(t).slice(1);
        },
        scriptPubKey: function (t) {
            return ["OP_HASH160", Lt.bytes(t).hex, "OP_EQUAL"];
        },
        fromScript: function (t, e) {
            return ne(ee.fmt.toBytes(t, !1).toHash("hash160"), e);
        }
    },
        ie = {
            main: "bc",
            testnet: "tb",
            signet: "tb",
            regtest: "bcrt"
        },
        oe = ["bc1q", "tb1q", "bcrt1q"];
    function ae(t) {
        for (const e of oe) if (t.startsWith(e)) return !0;
        return !1;
    }
    function ce(t, e = "main") {
        const r = ie[e],
            n = Lt.bytes(t);
        return Ht(n, 20), n.toBech32(r, 0);
    }
    const ue = {
        check: ae,
        encode: ce,
        decode: function (t) {
            if (!ae(t)) throw new TypeError("Invalid segwit address!");
            return Lt.bech32(t);
        },
        scriptPubKey: function (t) {
            const e = Lt.bytes(t);
            return Ht(e, 20), ["OP_0", e.hex];
        },
        fromPubKey: function (t, e) {
            const r = Lt.bytes(t);
            return Ht(r, 33), ce(r.toHash("hash160"), e);
        }
    },
        he = ["bc1q", "tb1q", "bcrt1q"];
    function de(t) {
        for (const e of he) if (t.startsWith(e)) return !0;
        return !1;
    }
    function fe(t, e = "main") {
        const r = ie[e],
            n = Lt.bytes(t);
        return Ht(n, 32), n.toBech32(r, 0);
    }
    const le = {
        check: de,
        encode: fe,
        decode: function (t) {
            if (!de(t)) throw new TypeError("Invalid segwit address!");
            return Lt.bech32(t);
        },
        scriptPubKey: function (t) {
            const e = Lt.bytes(t);
            return Ht(e, 32), ["OP_0", e.hex];
        },
        fromScript: function (t, e) {
            return fe(ee.fmt.toBytes(t, !1).toHash("sha256"), e);
        }
    };
    function pe(t) {
        const e = Lt.bytes(t);
        return e.length > 32 ? e.slice(1, 33) : e;
    }
    const ge = ["bc1p", "tb1p", "bcrt1p"];
    function me(t) {
        for (const e of ge) if (t.startsWith(e)) return !0;
        return !1;
    }
    function ye(t, e = "main") {
        const r = ie[e],
            n = Lt.bytes(t);
        return Ht(n, 32), n.toBech32(r, 1);
    }
    const be = {
        check: me,
        encode: ye,
        decode: function (t) {
            if (!me(t)) throw new TypeError("Invalid taproot address!");
            return Lt.bech32(t);
        },
        scriptPubKey: function (t) {
            const e = Lt.bytes(t);
            return Ht(e, 32), ["OP_1", e.hex];
        },
        fromPubKey: function (t, e) {
            return ye(pe(t), e);
        }
    },
        we = {
            version: 2,
            vin: [],
            vout: [],
            locktime: 0
        },
        ve = {
            scriptSig: [],
            sequence: 4294967293,
            witness: []
        },
        xe = {
            value: 0n,
            scriptPubKey: []
        };
    function _e(t) {
        const e = {
            ...we,
            ...t
        };
        return e.vin = e.vin.map(t => ({
            ...ve,
            ...t
        })), e.vout = e.vout.map(t => ({
            ...xe,
            ...t
        })), e;
    }
    function Ee(t, e) {
        const {
            version: r,
            vin: n,
            vout: s,
            locktime: i
        } = _e(t),
            o = !0 !== e && function (t) {
                for (const e of t) {
                    const {
                        witness: t
                    } = e;
                    if ("string" == typeof t || t instanceof Uint8Array || Array.isArray(t) && t.length > 0) return !0;
                }
                return !1;
            }(n),
            a = [Se(r)];
        o && a.push(Lt.hex("0001")), a.push(function (t) {
            const e = [Lt.varInt(t.length)];
            for (const r of t) {
                const {
                    txid: t,
                    vout: n,
                    scriptSig: s,
                    sequence: i
                } = r;
                e.push(Ae(t)), e.push(ke(n)), e.push(Wt(s, !0)), e.push(Oe(i));
            }
            return Lt.join(e);
        }(n)), a.push(function (t) {
            const e = [Lt.varInt(t.length)];
            for (const r of t) e.push(Ie(r));
            return Lt.join(e);
        }(s));
        for (const t of n) o && a.push(Pe(t.witness));
        return a.push(Ue(i)), Lt.join(a);
    }
    function Se(t) {
        return Lt.num(t, 4).reverse();
    }
    function Ae(t) {
        return Lt.hex(t, 32).reverse();
    }
    function ke(t) {
        return Lt.num(t, 4).reverse();
    }
    function Oe(t = 4294967293) {
        return Lt.bytes(t).reverse();
    }
    function Be(t) {
        if ("number" == typeof t) {
            if (t % 1 != 0) throw new Error("Value must be an integer:" + String(t));
            return Lt.num(t, 8).reverse();
        }
        return Lt.big(t, 8).reverse();
    }
    function Ie(t) {
        const {
            value: e,
            scriptPubKey: r
        } = t,
            n = [];
        return n.push(Be(e)), n.push(Wt(r, !0)), Lt.join(n);
    }
    function Pe(t = []) {
        const e = [];
        if (Array.isArray(t)) {
            const r = Lt.varInt(t.length);
            e.push(r);
            for (const r of t) e.push(Te(r));
            return Lt.join(e);
        }
        return Lt.normalize(t);
    }
    function Te(t) {
        return function (t) {
            if (Array.isArray(t)) return 0 === t.length;
            if ("string" == typeof t && "" === t) return !0;
            const e = Lt.bytes(t);
            return 1 === e.length && 0 === e[0];
        }(t) ? new Lt(0) : Wt(t, !0);
    }
    function Ue(t) {
        if ("string" == typeof t) return Lt.hex(t, 4);
        if ("number" == typeof t) return Lt.num(t, 4).reverse();
        throw new Error("Unrecognized format: " + String(t));
    }
    function Ce(t) {
        "string" == typeof t && (t = Lt.hex(t).raw);
        const e = new Nt(t),
            r = function (t) {
                return t.read(4).reverse().toNum();
            }(e),
            n = function (t) {
                const [e, r] = [...t.peek(2)];
                if (0 === e) {
                    if (t.read(2), 1 === r) return !0;
                    throw new Error(`Invalid witness flag: ${r}`);
                }
                return !1;
            }(e),
            s = function (t) {
                const e = [],
                    r = t.readSize();
                for (let n = 0; n < r; n++) e.push(Le(t));
                return e;
            }(e),
            i = function (t) {
                const e = [],
                    r = t.readSize();
                for (let n = 0; n < r; n++) e.push(Ne(t));
                return e;
            }(e);
        if (n) for (const t of s) t.witness = He(e);
        const o = function (t) {
            return t.read(4).reverse().toNum();
        }(e);
        return {
            version: r,
            vin: s,
            vout: i,
            locktime: o
        };
    }
    function Le(t) {
        return {
            txid: t.read(32).reverse().toHex(),
            vout: t.read(4).reverse().toNum(),
            scriptSig: Re(t, !0),
            sequence: t.read(4).reverse().toHex(),
            witness: []
        };
    }
    function Ne(t) {
        return {
            value: t.read(8).reverse().big,
            scriptPubKey: Re(t, !0)
        };
    }
    function He(t) {
        const e = [],
            r = t.readSize();
        for (let n = 0; n < r; n++) {
            const r = Ze(t, !0);
            e.push(r !== null && r !== void 0 ? r : "");
        }
        return e;
    }
    function Ze(t, e) {
        const r = !0 === e ? t.readSize("be") : t.size;
        return r > 0 ? t.read(r).hex : null;
    }
    function Re(t, e) {
        const r = Ze(t, e);
        return null !== r ? r : [];
    }
    const je = {
        toBytes: function (t) {
            if (Mt(t)) return Ce(t), Lt.bytes(t);
            if ("object" == typeof t) return Ee(t);
            throw new Error("Invalid format: " + String(typeof t));
        },
        toJson: function (t) {
            if (Mt(t)) return Ce(t);
            if ("object" == typeof t && !(t instanceof Uint8Array)) return Ee(t), _e(t);
            throw new Error("Invalid format: " + String(typeof t));
        }
    },
        De = [["p2pkh", /^76a914(?<hash>\w{40})88ac$/], ["p2sh", /^a914(?<hash>\w{40})87$/], ["p2w-pkh", /^0014(?<hash>\w{40})$/], ["p2w-sh", /^0020(?<hash>\w{64})$/], ["p2tr", /^5120(?<hash>\w{64})$/]],
        ze = [192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 234, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254, 102, 126, 128, 132, 150, 152, 186, 188, 190];
    function $e(t = []) {
        const e = [...t],
            r = function (t) {
                let e = t.at(-1);
                return Vt(e) && (e = Lt.hex(e)), t.length > 1 && e instanceof Uint8Array && 80 === e[0] ? (t.pop(), Lt.raw(e)) : null;
            }(e),
            n = function (t) {
                let e = t.at(-1);
                return Vt(e) && (e = Lt.hex(e)), t.length > 1 && e instanceof Uint8Array && e.length > 32 && ze.includes(254 & e[0]) ? (t.pop(), Lt.raw(e)) : null;
            }(e),
            s = function (t) {
                if (t.length > 1) {
                    const e = t.at(-1);
                    try {
                        const r = ee.fmt.toBytes(e);
                        return t.pop(), r;
                    } catch (t) {
                        return null;
                    }
                }
                return null;
            }(e),
            i = function (t) {
                const e = [];
                for (const r of t) (Vt(r) || r instanceof Uint8Array) && e.push(r);
                return e;
            }(e);
        return {
            annex: r,
            cblock: n,
            script: s,
            params: i
        };
    }
    function Fe(t) {
        const e = ee.fmt.toBytes(t, !1).hex;
        for (const [t, r] of De) {
            var _r$exec;
            const n = t,
                {
                    groups: s
                } = (_r$exec = r.exec(e)) !== null && _r$exec !== void 0 ? _r$exec : {},
                {
                    hash: i
                } = s !== null && s !== void 0 ? s : {};
            if (Vt(i)) return {
                type: n,
                data: Lt.hex(i)
            };
        }
        return {
            type: "raw",
            data: Lt.hex(e)
        };
    }
    const qe = {
        create: _e,
        encode: Ee,
        decode: Ce,
        fmt: je,
        util: {
            getTxid: function (t) {
                return Ee(je.toJson(t), !0).toHash("hash256").reverse().hex;
            },
            readScriptPubKey: Fe,
            readWitness: $e
        }
    },
        Ke = [["1", "p2pkh", "main", 20, "base58"], ["3", "p2sh", "main", 20, "base58"], ["m", "p2pkh", "testnet", 20, "base58"], ["n", "p2pkh", "testnet", 20, "base58"], ["2", "p2sh", "testnet", 20, "base58"], ["bc1q", "p2w-pkh", "main", 20, "bech32"], ["tb1q", "p2w-pkh", "testnet", 20, "bech32"], ["bcrt1q", "p2w-pkh", "regtest", 20, "bech32"], ["bc1q", "p2w-sh", "main", 32, "bech32"], ["tb1q", "p2w-sh", "testnet", 32, "bech32"], ["bcrt1q", "p2w-sh", "regtest", 32, "bech32"], ["bc1p", "p2tr", "main", 32, "bech32m"], ["tb1p", "p2tr", "testnet", 32, "bech32m"], ["bcrt1p", "p2tr", "regtest", 32, "bech32m"]];
    function Ve(t, e) {
        switch (e) {
            case "base58":
                return Lt.b58chk(t).slice(1);
            case "bech32":
            case "bech32m":
                return Lt.bech32(t);
            default:
                throw new Error("Invalid address format: " + e);
        }
    }
    function Me(t) {
        switch (t) {
            case "p2pkh":
                return zt;
            case "p2sh":
                return se;
            case "p2w-pkh":
                return ue;
            case "p2w-sh":
                return le;
            case "p2tr":
                return be;
            default:
                throw new Error("Invalid address type: " + t);
        }
    }
    function Ge(t) {
        const [e, r, n] = function (t) {
            for (const e of Ke) {
                const [r, n, s, i, o] = e;
                if (t.startsWith(r) && Ve(t, o).length === i) return e;
            }
            throw new Error("Invalid address: " + t);
        }(t),
            s = Me(r),
            i = s.decode(t, n);
        return {
            prefix: e,
            type: r,
            network: n,
            data: i,
            script: s.scriptPubKey(i)
        };
    }
    const We = {
        p2pkh: zt,
        p2sh: se,
        p2wpkh: ue,
        p2wsh: le,
        p2tr: be,
        decode: Ge,
        fromScriptPubKey: function (t, e) {
            const {
                type: r,
                data: n
            } = qe.util.readScriptPubKey(t);
            return Me(r).encode(n, e);
        },
        toScriptPubKey: function (t) {
            const {
                script: e
            } = Ge(t);
            return ee.fmt.toAsm(e, !1);
        }
    },
        Ye = [1, 2, 3];
    function Je(t, e, r = {}) {
        const {
            sigflag: n = 1
        } = r,
            s = 128 == (128 & n),
            i = n % 128;
        if (!Ye.includes(i)) throw new Error("Invalid hash type: " + String(n));
        const o = qe.fmt.toJson(t),
            {
                version: a,
                vin: c,
                vout: u,
                locktime: h
            } = o,
            {
                txid: d,
                vout: f,
                prevout: l,
                sequence: p
            } = c[e],
            {
                value: g
            } = l !== null && l !== void 0 ? l : {};
        if (void 0 === g) throw new Error("Prevout value is empty!");
        let m = r.script;
        if (void 0 === m && void 0 !== r.pubkey) {
            m = `76a914${Lt.bytes(r.pubkey).toHash("hash160").hex}88ac`;
        }
        if (void 0 === m) throw new Error("No pubkey / script has been set!");
        if (ee.fmt.toAsm(m).includes("OP_CODESEPARATOR")) throw new Error("This library does not currently support the use of OP_CODESEPARATOR in segwit scripts.");
        const y = [Se(a), Qe(c, s), Xe(c, i, s), Ae(d), ke(f), ee.encode(m, !0), Be(g), Oe(p), tr(u, e, i), Ue(h), Lt.num(n, 4).reverse()];
        return Lt.join(y).toHash("hash256");
    }
    function Qe(t, e) {
        if (!0 === e) return Lt.num(0, 32);
        const r = [];
        for (const {
            txid: e,
            vout: n
        } of t) r.push(Ae(e)), r.push(ke(n));
        return Lt.join(r).toHash("hash256");
    }
    function Xe(t, e, r) {
        if (r || 1 !== e) return Lt.num(0, 32);
        const n = [];
        for (const {
            sequence: e
        } of t) n.push(Oe(e));
        return Lt.join(n).toHash("hash256");
    }
    function tr(t, e, r) {
        const n = [];
        if (1 === r) {
            for (const {
                value: e,
                scriptPubKey: r
            } of t) n.push(Be(e)), n.push(ee.encode(r, !0));
            return Lt.join(n).toHash("hash256");
        }
        if (3 === r && e < t.length) {
            const {
                value: r,
                scriptPubKey: s
            } = t[e];
            return n.push(Be(r)), n.push(ee.encode(s, !0)), Lt.join(n).toHash("hash256");
        }
        return Lt.num(0, 32);
    }
    function er(t) {
        if (!Number.isSafeInteger(t) || t < 0) throw new Error(`Wrong positive integer: ${t}`);
    }
    function rr(t, ...e) {
        if (!(t instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
        if (e.length > 0 && !e.includes(t.length)) throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
    }
    const nr = {
        number: er,
        bool: function (t) {
            if ("boolean" != typeof t) throw new Error(`Expected boolean, not ${t}`);
        },
        bytes: rr,
        hash: function (t) {
            if ("function" != typeof t || "function" != typeof t.create) throw new Error("Hash should be wrapped by utils.wrapConstructor");
            er(t.outputLen), er(t.blockLen);
        },
        exists: function (t, e = !0) {
            if (t.destroyed) throw new Error("Hash instance has been destroyed");
            if (e && t.finished) throw new Error("Hash#digest() has already been called");
        },
        output: function (t, e) {
            rr(t);
            const r = e.outputLen;
            if (t.length < r) throw new Error(`digestInto() expects output buffer of length at least ${r}`);
        }
    };
    var sr = nr;
    const ir = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0,
        or = t => new DataView(t.buffer, t.byteOffset, t.byteLength),
        ar = (t, e) => t << 32 - e | t >>> e;
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    if (!(68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0])) throw new Error("Non little-endian hardware is not supported");
    function cr(t) {
        if ("string" == typeof t && (t = function (t) {
            if ("string" != typeof t) throw new TypeError("utf8ToBytes expected string, got " + typeof t);
            return new TextEncoder().encode(t);
        }(t)), !(t instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
        return t;
    }
    Array.from({
        length: 256
    }, (t, e) => e.toString(16).padStart(2, "0"));
    let ur = class {
        clone() {
            return this._cloneInto();
        }
    };
    function hr(t) {
        const e = e => t().update(cr(e)).digest(),
            r = t();
        return e.outputLen = r.outputLen, e.blockLen = r.blockLen, e.create = () => t(), e;
    }
    function dr(t = 32) {
        if (ir && "function" == typeof ir.getRandomValues) return ir.getRandomValues(new Uint8Array(t));
        throw new Error("crypto.getRandomValues must be defined");
    }
    let fr = class extends ur {
        constructor(t, e, r, n) {
            super(), this.blockLen = t, this.outputLen = e, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = or(this.buffer);
        }
        update(t) {
            sr.exists(this);
            const {
                view: e,
                buffer: r,
                blockLen: n
            } = this,
                s = (t = cr(t)).length;
            for (let i = 0; i < s;) {
                const o = Math.min(n - this.pos, s - i);
                if (o !== n) r.set(t.subarray(i, i + o), this.pos), this.pos += o, i += o, this.pos === n && (this.process(e, 0), this.pos = 0); else {
                    const e = or(t);
                    for (; n <= s - i; i += n) this.process(e, i);
                }
            }
            return this.length += t.length, this.roundClean(), this;
        }
        digestInto(t) {
            sr.exists(this), sr.output(t, this), this.finished = !0;
            const {
                buffer: e,
                view: r,
                blockLen: n,
                isLE: s
            } = this;
            let {
                pos: i
            } = this;
            e[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > n - i && (this.process(r, 0), i = 0);
            for (let t = i; t < n; t++) e[t] = 0;
            !function (t, e, r, n) {
                if ("function" == typeof t.setBigUint64) return t.setBigUint64(e, r, n);
                const s = BigInt(32),
                    i = BigInt(4294967295),
                    o = Number(r >> s & i),
                    a = Number(r & i),
                    c = n ? 4 : 0,
                    u = n ? 0 : 4;
                t.setUint32(e + c, o, n), t.setUint32(e + u, a, n);
            }(r, n - 8, BigInt(8 * this.length), s), this.process(r, 0);
            const o = or(t),
                a = this.outputLen;
            if (a % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const c = a / 4,
                u = this.get();
            if (c > u.length) throw new Error("_sha2: outputLen bigger than state");
            for (let t = 0; t < c; t++) o.setUint32(4 * t, u[t], s);
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
    };
    const lr = (t, e, r) => t & e ^ t & r ^ e & r,
        pr = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
        gr = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
        mr = new Uint32Array(64);
    let yr = class extends fr {
        constructor() {
            super(64, 32, 8, !1), this.A = 0 | gr[0], this.B = 0 | gr[1], this.C = 0 | gr[2], this.D = 0 | gr[3], this.E = 0 | gr[4], this.F = 0 | gr[5], this.G = 0 | gr[6], this.H = 0 | gr[7];
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
                H: a
            } = this;
            return [t, e, r, n, s, i, o, a];
        }
        set(t, e, r, n, s, i, o, a) {
            this.A = 0 | t, this.B = 0 | e, this.C = 0 | r, this.D = 0 | n, this.E = 0 | s, this.F = 0 | i, this.G = 0 | o, this.H = 0 | a;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) mr[r] = t.getUint32(e, !1);
            for (let t = 16; t < 64; t++) {
                const e = mr[t - 15],
                    r = mr[t - 2],
                    n = ar(e, 7) ^ ar(e, 18) ^ e >>> 3,
                    s = ar(r, 17) ^ ar(r, 19) ^ r >>> 10;
                mr[t] = s + mr[t - 7] + n + mr[t - 16] | 0;
            }
            let {
                A: r,
                B: n,
                C: s,
                D: i,
                E: o,
                F: a,
                G: c,
                H: u
            } = this;
            for (let t = 0; t < 64; t++) {
                const e = u + (ar(o, 6) ^ ar(o, 11) ^ ar(o, 25)) + ((h = o) & a ^ ~h & c) + pr[t] + mr[t] | 0,
                    d = (ar(r, 2) ^ ar(r, 13) ^ ar(r, 22)) + lr(r, n, s) | 0;
                u = c, c = a, a = o, o = i + e | 0, i = s, s = n, n = r, r = e + d | 0;
            }
            var h;
            r = r + this.A | 0, n = n + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, o = o + this.E | 0, a = a + this.F | 0, c = c + this.G | 0, u = u + this.H | 0, this.set(r, n, s, i, o, a, c, u);
        }
        roundClean() {
            mr.fill(0);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
        }
    },
        br = class extends yr {
            constructor() {
                super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
            }
        };
    const wr = hr(() => new yr());
    hr(() => new br());
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const vr = BigInt(0),
        xr = BigInt(1),
        _r = BigInt(2),
        Er = t => t instanceof Uint8Array,
        Sr = Array.from({
            length: 256
        }, (t, e) => e.toString(16).padStart(2, "0"));
    function Ar(t) {
        if (!Er(t)) throw new Error("Uint8Array expected");
        let e = "";
        for (let r = 0; r < t.length; r++) e += Sr[t[r]];
        return e;
    }
    function kr(t) {
        const e = t.toString(16);
        return 1 & e.length ? `0${e}` : e;
    }
    function Or(t) {
        if ("string" != typeof t) throw new Error("hex string expected, got " + typeof t);
        return BigInt("" === t ? "0" : `0x${t}`);
    }
    function Br(t) {
        if ("string" != typeof t) throw new Error("hex string expected, got " + typeof t);
        if (t.length % 2) throw new Error("hex string is invalid: unpadded " + t.length);
        const e = new Uint8Array(t.length / 2);
        for (let r = 0; r < e.length; r++) {
            const n = 2 * r,
                s = t.slice(n, n + 2),
                i = Number.parseInt(s, 16);
            if (Number.isNaN(i) || i < 0) throw new Error("invalid byte sequence");
            e[r] = i;
        }
        return e;
    }
    function Ir(t) {
        return Or(Ar(t));
    }
    function Pr(t) {
        if (!Er(t)) throw new Error("Uint8Array expected");
        return Or(Ar(Uint8Array.from(t).reverse()));
    }
    const Tr = (t, e) => Br(t.toString(16).padStart(2 * e, "0")),
        Ur = (t, e) => Tr(t, e).reverse();
    function Cr(t, e, r) {
        let n;
        if ("string" == typeof e) try {
            n = Br(e);
        } catch (r) {
            throw new Error(`${t} must be valid hex string, got "${e}". Cause: ${r}`);
        } else {
            if (!Er(e)) throw new Error(`${t} must be hex string or Uint8Array`);
            n = Uint8Array.from(e);
        }
        const s = n.length;
        if ("number" == typeof r && s !== r) throw new Error(`${t} expected ${r} bytes, got ${s}`);
        return n;
    }
    function Lr(...t) {
        const e = new Uint8Array(t.reduce((t, e) => t + e.length, 0));
        let r = 0;
        return t.forEach(t => {
            if (!Er(t)) throw new Error("Uint8Array expected");
            e.set(t, r), r += t.length;
        }), e;
    }
    function Nr(t) {
        if ("string" != typeof t) throw new Error("utf8ToBytes expected string, got " + typeof t);
        return new TextEncoder().encode(t);
    }
    const Hr = t => (_r << BigInt(t - 1)) - xr,
        Zr = t => new Uint8Array(t),
        Rr = t => Uint8Array.from(t);
    function jr(t, e, r) {
        if ("number" != typeof t || t < 2) throw new Error("hashLen must be a number");
        if ("number" != typeof e || e < 2) throw new Error("qByteLen must be a number");
        if ("function" != typeof r) throw new Error("hmacFn must be a function");
        let n = Zr(t),
            s = Zr(t),
            i = 0;
        const o = () => {
            n.fill(1), s.fill(0), i = 0;
        },
            a = (...t) => r(s, n, ...t),
            c = (t = Zr()) => {
                s = a(Rr([0]), t), n = a(), 0 !== t.length && (s = a(Rr([1]), t), n = a());
            },
            u = () => {
                if (i++ >= 1e3) throw new Error("drbg: tried 1000 values");
                let t = 0;
                const r = [];
                for (; t < e;) {
                    n = a();
                    const e = n.slice();
                    r.push(e), t += n.length;
                }
                return Lr(...r);
            };
        return (t, e) => {
            let r;
            for (o(), c(t); !(r = e(u()));) c();
            return o(), r;
        };
    }
    const Dr = {
        bigint: t => "bigint" == typeof t,
        function: t => "function" == typeof t,
        boolean: t => "boolean" == typeof t,
        string: t => "string" == typeof t,
        isSafeInteger: t => Number.isSafeInteger(t),
        array: t => Array.isArray(t),
        field: (t, e) => e.Fp.isValid(t),
        hash: t => "function" == typeof t && Number.isSafeInteger(t.outputLen)
    };
    function zr(t, e, r = {}) {
        const n = (e, r, n) => {
            const s = Dr[r];
            if ("function" != typeof s) throw new Error(`Invalid validator "${r}", expected function`);
            const i = t[e];
            if (!(n && void 0 === i || s(i, t))) throw new Error(`Invalid param ${String(e)}=${i} (${typeof i}), expected ${r}`);
        };
        for (const [t, r] of Object.entries(e)) n(t, r, !1);
        for (const [t, e] of Object.entries(r)) n(t, e, !0);
        return t;
    }
    var $r = Object.freeze({
        __proto__: null,
        bitGet: (t, e) => t >> BigInt(e) & 1n,
        bitLen: function (t) {
            let e;
            for (e = 0; t > 0n; t >>= xr, e += 1);
            return e;
        },
        bitMask: Hr,
        bitSet: (t, e, r) => t | (r ? xr : vr) << BigInt(e),
        bytesToHex: Ar,
        bytesToNumberBE: Ir,
        bytesToNumberLE: Pr,
        concatBytes: Lr,
        createHmacDrbg: jr,
        ensureBytes: Cr,
        equalBytes: function (t, e) {
            if (t.length !== e.length) return !1;
            for (let r = 0; r < t.length; r++) if (t[r] !== e[r]) return !1;
            return !0;
        },
        hexToBytes: Br,
        hexToNumber: Or,
        numberToBytesBE: Tr,
        numberToBytesLE: Ur,
        numberToHexUnpadded: kr,
        numberToVarBytesBE: t => Br(kr(t)),
        utf8ToBytes: Nr,
        validateObject: zr
    });
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const Fr = BigInt(0),
        qr = BigInt(1),
        Kr = BigInt(2),
        Vr = BigInt(3),
        Mr = BigInt(4),
        Gr = BigInt(5),
        Wr = BigInt(8);
    function Yr(t, e) {
        const r = t % e;
        return r >= Fr ? r : e + r;
    }
    function Jr(t, e, r) {
        if (r <= Fr || e < Fr) throw new Error("Expected power/modulo > 0");
        if (r === qr) return Fr;
        let n = qr;
        for (; e > Fr;) e & qr && (n = n * t % r), t = t * t % r, e >>= qr;
        return n;
    }
    function Qr(t, e, r) {
        let n = t;
        for (; e-- > Fr;) n *= n, n %= r;
        return n;
    }
    function Xr(t, e) {
        if (t === Fr || e <= Fr) throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
        let r = Yr(t, e),
            n = e,
            s = Fr,
            i = qr;
        for (; r !== Fr;) {
            const t = n % r,
                e = s - i * (n / r);
            n = r, r = t, s = i, i = e;
        }
        if (n !== qr) throw new Error("invert: does not exist");
        return Yr(s, e);
    }
    function tn(t) {
        if (t % Mr === Vr) {
            const e = (t + qr) / Mr;
            return function (t, r) {
                const n = t.pow(r, e);
                if (!t.eql(t.sqr(n), r)) throw new Error("Cannot find square root");
                return n;
            };
        }
        if (t % Wr === Gr) {
            const e = (t - Gr) / Wr;
            return function (t, r) {
                const n = t.mul(r, Kr),
                    s = t.pow(n, e),
                    i = t.mul(r, s),
                    o = t.mul(t.mul(i, Kr), s),
                    a = t.mul(i, t.sub(o, t.ONE));
                if (!t.eql(t.sqr(a), r)) throw new Error("Cannot find square root");
                return a;
            };
        }
        return function (t) {
            const e = (t - qr) / Kr;
            let r, n, s;
            for (r = t - qr, n = 0; r % Kr === Fr; r /= Kr, n++);
            for (s = Kr; s < t && Jr(s, e, t) !== t - qr; s++);
            if (1 === n) {
                const e = (t + qr) / Mr;
                return function (t, r) {
                    const n = t.pow(r, e);
                    if (!t.eql(t.sqr(n), r)) throw new Error("Cannot find square root");
                    return n;
                };
            }
            const i = (r + qr) / Kr;
            return function (t, o) {
                if (t.pow(o, e) === t.neg(t.ONE)) throw new Error("Cannot find square root");
                let a = n,
                    c = t.pow(t.mul(t.ONE, s), r),
                    u = t.pow(o, i),
                    h = t.pow(o, r);
                for (; !t.eql(h, t.ONE);) {
                    if (t.eql(h, t.ZERO)) return t.ZERO;
                    let e = 1;
                    for (let r = t.sqr(h); e < a && !t.eql(r, t.ONE); e++) r = t.sqr(r);
                    const r = t.pow(c, qr << BigInt(a - e - 1));
                    c = t.sqr(r), u = t.mul(u, r), h = t.mul(h, c), a = e;
                }
                return u;
            };
        }(t);
    }
    BigInt(9), BigInt(16);
    const en = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
    function rn(t) {
        return zr(t, en.reduce((t, e) => (t[e] = "function", t), {
            ORDER: "bigint",
            MASK: "bigint",
            BYTES: "isSafeInteger",
            BITS: "isSafeInteger"
        }));
    }
    function nn(t, e) {
        const r = void 0 !== e ? e : t.toString(2).length;
        return {
            nBitLength: r,
            nByteLength: Math.ceil(r / 8)
        };
    }
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const sn = BigInt(0),
        on = BigInt(1);
    function an(t) {
        return rn(t.Fp), zr(t, {
            n: "bigint",
            h: "bigint",
            Gx: "field",
            Gy: "field"
        }, {
            nBitLength: "isSafeInteger",
            nByteLength: "isSafeInteger"
        }), Object.freeze({
            ...nn(t.n, t.nBitLength),
            ...t,
            p: t.Fp.ORDER
        });
    }
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const {
        bytesToNumberBE: cn,
        hexToBytes: un
    } = $r,
        hn = {
            Err: class extends Error {
                constructor(t = "") {
                    super(t);
                }
            },
            _parseInt(t) {
                const {
                    Err: e
                } = hn;
                if (t.length < 2 || 2 !== t[0]) throw new e("Invalid signature integer tag");
                const r = t[1],
                    n = t.subarray(2, r + 2);
                if (!r || n.length !== r) throw new e("Invalid signature integer: wrong length");
                if (0 === n[0] && n[1] <= 127) throw new e("Invalid signature integer: trailing length");
                return {
                    d: cn(n),
                    l: t.subarray(r + 2)
                };
            },
            toSig(t) {
                const {
                    Err: e
                } = hn,
                    r = "string" == typeof t ? un(t) : t;
                if (!(r instanceof Uint8Array)) throw new Error("ui8a expected");
                let n = r.length;
                if (n < 2 || 48 != r[0]) throw new e("Invalid signature tag");
                if (r[1] !== n - 2) throw new e("Invalid signature: incorrect length");
                const {
                    d: s,
                    l: i
                } = hn._parseInt(r.subarray(2)),
                    {
                        d: o,
                        l: a
                    } = hn._parseInt(i);
                if (a.length) throw new e("Invalid signature: left bytes after parsing");
                return {
                    r: s,
                    s: o
                };
            },
            hexFromSig(t) {
                const e = t => Number.parseInt(t[0], 16) >= 8 ? "00" + t : t,
                    r = t => {
                        const e = t.toString(16);
                        return 1 & e.length ? `0${e}` : e;
                    },
                    n = e(r(t.s)),
                    s = e(r(t.r)),
                    i = n.length / 2,
                    o = s.length / 2,
                    a = r(i),
                    c = r(o);
                return `30${r(o + i + 4)}02${c}${s}02${a}${n}`;
            }
        },
        dn = BigInt(0),
        fn = BigInt(1),
        ln = BigInt(2),
        pn = BigInt(3),
        gn = BigInt(4);
    function mn(t) {
        const e = function (t) {
            const e = an(t);
            zr(e, {
                a: "field",
                b: "field"
            }, {
                allowedPrivateKeyLengths: "array",
                wrapPrivateKey: "boolean",
                isTorsionFree: "function",
                clearCofactor: "function",
                allowInfinityPoint: "boolean",
                fromBytes: "function",
                toBytes: "function"
            });
            const {
                endo: r,
                Fp: n,
                a: s
            } = e;
            if (r) {
                if (!n.eql(s, n.ZERO)) throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
                if ("object" != typeof r || "bigint" != typeof r.beta || "function" != typeof r.splitScalar) throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
            }
            return Object.freeze({
                ...e
            });
        }(t),
            {
                Fp: r
            } = e,
            n = e.toBytes || ((t, e, n) => {
                const s = e.toAffine();
                return Lr(Uint8Array.from([4]), r.toBytes(s.x), r.toBytes(s.y));
            }),
            s = e.fromBytes || (t => {
                const e = t.subarray(1);
                return {
                    x: r.fromBytes(e.subarray(0, r.BYTES)),
                    y: r.fromBytes(e.subarray(r.BYTES, 2 * r.BYTES))
                };
            });
        function i(t) {
            const {
                a: n,
                b: s
            } = e,
                i = r.sqr(t),
                o = r.mul(i, t);
            return r.add(r.add(o, r.mul(t, n)), s);
        }
        function o(t) {
            return "bigint" == typeof t && dn < t && t < e.n;
        }
        function a(t) {
            if (!o(t)) throw new Error("Expected valid bigint: 0 < bigint < curve.n");
        }
        function c(t) {
            const {
                allowedPrivateKeyLengths: r,
                nByteLength: n,
                wrapPrivateKey: s,
                n: i
            } = e;
            if (r && "bigint" != typeof t) {
                if (t instanceof Uint8Array && (t = Ar(t)), "string" != typeof t || !r.includes(t.length)) throw new Error("Invalid key");
                t = t.padStart(2 * n, "0");
            }
            let o;
            try {
                o = "bigint" == typeof t ? t : Ir(Cr("private key", t, n));
            } catch (e) {
                throw new Error(`private key must be ${n} bytes, hex or bigint, not ${typeof t}`);
            }
            return s && (o = Yr(o, i)), a(o), o;
        }
        const u = new Map();
        function h(t) {
            if (!(t instanceof d)) throw new Error("ProjectivePoint expected");
        }
        class d {
            constructor(t, e, n) {
                if (this.px = t, this.py = e, this.pz = n, null == t || !r.isValid(t)) throw new Error("x required");
                if (null == e || !r.isValid(e)) throw new Error("y required");
                if (null == n || !r.isValid(n)) throw new Error("z required");
            }
            static fromAffine(t) {
                const {
                    x: e,
                    y: n
                } = t || {};
                if (!t || !r.isValid(e) || !r.isValid(n)) throw new Error("invalid affine point");
                if (t instanceof d) throw new Error("projective point not allowed");
                const s = t => r.eql(t, r.ZERO);
                return s(e) && s(n) ? d.ZERO : new d(e, n, r.ONE);
            }
            get x() {
                return this.toAffine().x;
            }
            get y() {
                return this.toAffine().y;
            }
            static normalizeZ(t) {
                const e = r.invertBatch(t.map(t => t.pz));
                return t.map((t, r) => t.toAffine(e[r])).map(d.fromAffine);
            }
            static fromHex(t) {
                const e = d.fromAffine(s(Cr("pointHex", t)));
                return e.assertValidity(), e;
            }
            static fromPrivateKey(t) {
                return d.BASE.multiply(c(t));
            }
            _setWindowSize(t) {
                this._WINDOW_SIZE = t, u.delete(this);
            }
            assertValidity() {
                if (this.is0()) {
                    if (e.allowInfinityPoint) return;
                    throw new Error("bad point: ZERO");
                }
                const {
                    x: t,
                    y: n
                } = this.toAffine();
                if (!r.isValid(t) || !r.isValid(n)) throw new Error("bad point: x or y not FE");
                const s = r.sqr(n),
                    o = i(t);
                if (!r.eql(s, o)) throw new Error("bad point: equation left != right");
                if (!this.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
            }
            hasEvenY() {
                const {
                    y: t
                } = this.toAffine();
                if (r.isOdd) return !r.isOdd(t);
                throw new Error("Field doesn't support isOdd");
            }
            equals(t) {
                h(t);
                const {
                    px: e,
                    py: n,
                    pz: s
                } = this,
                    {
                        px: i,
                        py: o,
                        pz: a
                    } = t,
                    c = r.eql(r.mul(e, a), r.mul(i, s)),
                    u = r.eql(r.mul(n, a), r.mul(o, s));
                return c && u;
            }
            negate() {
                return new d(this.px, r.neg(this.py), this.pz);
            }
            double() {
                const {
                    a: t,
                    b: n
                } = e,
                    s = r.mul(n, pn),
                    {
                        px: i,
                        py: o,
                        pz: a
                    } = this;
                let c = r.ZERO,
                    u = r.ZERO,
                    h = r.ZERO,
                    f = r.mul(i, i),
                    l = r.mul(o, o),
                    p = r.mul(a, a),
                    g = r.mul(i, o);
                return g = r.add(g, g), h = r.mul(i, a), h = r.add(h, h), c = r.mul(t, h), u = r.mul(s, p), u = r.add(c, u), c = r.sub(l, u), u = r.add(l, u), u = r.mul(c, u), c = r.mul(g, c), h = r.mul(s, h), p = r.mul(t, p), g = r.sub(f, p), g = r.mul(t, g), g = r.add(g, h), h = r.add(f, f), f = r.add(h, f), f = r.add(f, p), f = r.mul(f, g), u = r.add(u, f), p = r.mul(o, a), p = r.add(p, p), f = r.mul(p, g), c = r.sub(c, f), h = r.mul(p, l), h = r.add(h, h), h = r.add(h, h), new d(c, u, h);
            }
            add(t) {
                h(t);
                const {
                    px: n,
                    py: s,
                    pz: i
                } = this,
                    {
                        px: o,
                        py: a,
                        pz: c
                    } = t;
                let u = r.ZERO,
                    f = r.ZERO,
                    l = r.ZERO;
                const p = e.a,
                    g = r.mul(e.b, pn);
                let m = r.mul(n, o),
                    y = r.mul(s, a),
                    b = r.mul(i, c),
                    w = r.add(n, s),
                    v = r.add(o, a);
                w = r.mul(w, v), v = r.add(m, y), w = r.sub(w, v), v = r.add(n, i);
                let x = r.add(o, c);
                return v = r.mul(v, x), x = r.add(m, b), v = r.sub(v, x), x = r.add(s, i), u = r.add(a, c), x = r.mul(x, u), u = r.add(y, b), x = r.sub(x, u), l = r.mul(p, v), u = r.mul(g, b), l = r.add(u, l), u = r.sub(y, l), l = r.add(y, l), f = r.mul(u, l), y = r.add(m, m), y = r.add(y, m), b = r.mul(p, b), v = r.mul(g, v), y = r.add(y, b), b = r.sub(m, b), b = r.mul(p, b), v = r.add(v, b), m = r.mul(y, v), f = r.add(f, m), m = r.mul(x, v), u = r.mul(w, u), u = r.sub(u, m), m = r.mul(w, y), l = r.mul(x, l), l = r.add(l, m), new d(u, f, l);
            }
            subtract(t) {
                return this.add(t.negate());
            }
            is0() {
                return this.equals(d.ZERO);
            }
            wNAF(t) {
                return l.wNAFCached(this, u, t, t => {
                    const e = r.invertBatch(t.map(t => t.pz));
                    return t.map((t, r) => t.toAffine(e[r])).map(d.fromAffine);
                });
            }
            multiplyUnsafe(t) {
                const n = d.ZERO;
                if (t === dn) return n;
                if (a(t), t === fn) return this;
                const {
                    endo: s
                } = e;
                if (!s) return l.unsafeLadder(this, t);
                let {
                    k1neg: i,
                    k1: o,
                    k2neg: c,
                    k2: u
                } = s.splitScalar(t),
                    h = n,
                    f = n,
                    p = this;
                for (; o > dn || u > dn;) o & fn && (h = h.add(p)), u & fn && (f = f.add(p)), p = p.double(), o >>= fn, u >>= fn;
                return i && (h = h.negate()), c && (f = f.negate()), f = new d(r.mul(f.px, s.beta), f.py, f.pz), h.add(f);
            }
            multiply(t) {
                a(t);
                let n,
                    s,
                    i = t;
                const {
                    endo: o
                } = e;
                if (o) {
                    const {
                        k1neg: t,
                        k1: e,
                        k2neg: a,
                        k2: c
                    } = o.splitScalar(i);
                    let {
                        p: u,
                        f: h
                    } = this.wNAF(e),
                        {
                            p: f,
                            f: p
                        } = this.wNAF(c);
                    u = l.constTimeNegate(t, u), f = l.constTimeNegate(a, f), f = new d(r.mul(f.px, o.beta), f.py, f.pz), n = u.add(f), s = h.add(p);
                } else {
                    const {
                        p: t,
                        f: e
                    } = this.wNAF(i);
                    n = t, s = e;
                }
                return d.normalizeZ([n, s])[0];
            }
            multiplyAndAddUnsafe(t, e, r) {
                const n = d.BASE,
                    s = (t, e) => e !== dn && e !== fn && t.equals(n) ? t.multiply(e) : t.multiplyUnsafe(e),
                    i = s(this, e).add(s(t, r));
                return i.is0() ? void 0 : i;
            }
            toAffine(t) {
                const {
                    px: e,
                    py: n,
                    pz: s
                } = this,
                    i = this.is0();
                null == t && (t = i ? r.ONE : r.inv(s));
                const o = r.mul(e, t),
                    a = r.mul(n, t),
                    c = r.mul(s, t);
                if (i) return {
                    x: r.ZERO,
                    y: r.ZERO
                };
                if (!r.eql(c, r.ONE)) throw new Error("invZ was invalid");
                return {
                    x: o,
                    y: a
                };
            }
            isTorsionFree() {
                const {
                    h: t,
                    isTorsionFree: r
                } = e;
                if (t === fn) return !0;
                if (r) return r(d, this);
                throw new Error("isTorsionFree() has not been declared for the elliptic curve");
            }
            clearCofactor() {
                const {
                    h: t,
                    clearCofactor: r
                } = e;
                return t === fn ? this : r ? r(d, this) : this.multiplyUnsafe(e.h);
            }
            toRawBytes(t = !0) {
                return this.assertValidity(), n(d, this, t);
            }
            toHex(t = !0) {
                return Ar(this.toRawBytes(t));
            }
        }
        d.BASE = new d(e.Gx, e.Gy, r.ONE), d.ZERO = new d(r.ZERO, r.ONE, r.ZERO);
        const f = e.nBitLength,
            l = function (t, e) {
                const r = (t, e) => {
                    const r = e.negate();
                    return t ? r : e;
                },
                    n = t => ({
                        windows: Math.ceil(e / t) + 1,
                        windowSize: 2 ** (t - 1)
                    });
                return {
                    constTimeNegate: r,
                    unsafeLadder(e, r) {
                        let n = t.ZERO,
                            s = e;
                        for (; r > sn;) r & on && (n = n.add(s)), s = s.double(), r >>= on;
                        return n;
                    },
                    precomputeWindow(t, e) {
                        const {
                            windows: r,
                            windowSize: s
                        } = n(e),
                            i = [];
                        let o = t,
                            a = o;
                        for (let t = 0; t < r; t++) {
                            a = o, i.push(a);
                            for (let t = 1; t < s; t++) a = a.add(o), i.push(a);
                            o = a.double();
                        }
                        return i;
                    },
                    wNAF(e, s, i) {
                        const {
                            windows: o,
                            windowSize: a
                        } = n(e);
                        let c = t.ZERO,
                            u = t.BASE;
                        const h = BigInt(2 ** e - 1),
                            d = 2 ** e,
                            f = BigInt(e);
                        for (let t = 0; t < o; t++) {
                            const e = t * a;
                            let n = Number(i & h);
                            i >>= f, n > a && (n -= d, i += on);
                            const o = e,
                                l = e + Math.abs(n) - 1,
                                p = t % 2 != 0,
                                g = n < 0;
                            0 === n ? u = u.add(r(p, s[o])) : c = c.add(r(g, s[l]));
                        }
                        return {
                            p: c,
                            f: u
                        };
                    },
                    wNAFCached(t, e, r, n) {
                        const s = t._WINDOW_SIZE || 1;
                        let i = e.get(t);
                        return i || (i = this.precomputeWindow(t, s), 1 !== s && e.set(t, n(i))), this.wNAF(s, i, r);
                    }
                };
            }(d, e.endo ? Math.ceil(f / 2) : f);
        return {
            CURVE: e,
            ProjectivePoint: d,
            normPrivateKeyToScalar: c,
            weierstrassEquation: i,
            isWithinCurveOrder: o
        };
    }
    function yn(t) {
        const e = function (t) {
            const e = an(t);
            return zr(e, {
                hash: "hash",
                hmac: "function",
                randomBytes: "function"
            }, {
                bits2int: "function",
                bits2int_modN: "function",
                lowS: "boolean"
            }), Object.freeze({
                lowS: !0,
                ...e
            });
        }(t),
            {
                Fp: r,
                n: n
            } = e,
            s = r.BYTES + 1,
            i = 2 * r.BYTES + 1;
        function o(t) {
            return Yr(t, n);
        }
        function a(t) {
            return Xr(t, n);
        }
        const {
            ProjectivePoint: c,
            normPrivateKeyToScalar: u,
            weierstrassEquation: h,
            isWithinCurveOrder: d
        } = mn({
            ...e,
            toBytes(t, e, n) {
                const s = e.toAffine(),
                    i = r.toBytes(s.x),
                    o = Lr;
                return n ? o(Uint8Array.from([e.hasEvenY() ? 2 : 3]), i) : o(Uint8Array.from([4]), i, r.toBytes(s.y));
            },
            fromBytes(t) {
                const e = t.length,
                    n = t[0],
                    o = t.subarray(1);
                if (e !== s || 2 !== n && 3 !== n) {
                    if (e === i && 4 === n) {
                        return {
                            x: r.fromBytes(o.subarray(0, r.BYTES)),
                            y: r.fromBytes(o.subarray(r.BYTES, 2 * r.BYTES))
                        };
                    }
                    throw new Error(`Point of length ${e} was invalid. Expected ${s} compressed bytes or ${i} uncompressed bytes`);
                }
                {
                    const t = Ir(o);
                    if (!(dn < (a = t) && a < r.ORDER)) throw new Error("Point is not on curve");
                    const e = h(t);
                    let s = r.sqrt(e);
                    return 1 == (1 & n) !== ((s & fn) === fn) && (s = r.neg(s)), {
                        x: t,
                        y: s
                    };
                }
                var a;
            }
        }),
            f = t => Ar(Tr(t, e.nByteLength));
        function l(t) {
            return t > n >> fn;
        }
        const p = (t, e, r) => Ir(t.slice(e, r));
        class g {
            constructor(t, e, r) {
                this.r = t, this.s = e, this.recovery = r, this.assertValidity();
            }
            static fromCompact(t) {
                const r = e.nByteLength;
                return t = Cr("compactSignature", t, 2 * r), new g(p(t, 0, r), p(t, r, 2 * r));
            }
            static fromDER(t) {
                const {
                    r: e,
                    s: r
                } = hn.toSig(Cr("DER", t));
                return new g(e, r);
            }
            assertValidity() {
                if (!d(this.r)) throw new Error("r must be 0 < r < CURVE.n");
                if (!d(this.s)) throw new Error("s must be 0 < s < CURVE.n");
            }
            addRecoveryBit(t) {
                return new g(this.r, this.s, t);
            }
            recoverPublicKey(t) {
                const {
                    r: n,
                    s: s,
                    recovery: i
                } = this,
                    u = w(Cr("msgHash", t));
                if (null == i || ![0, 1, 2, 3].includes(i)) throw new Error("recovery id invalid");
                const h = 2 === i || 3 === i ? n + e.n : n;
                if (h >= r.ORDER) throw new Error("recovery id 2 or 3 invalid");
                const d = 0 == (1 & i) ? "02" : "03",
                    l = c.fromHex(d + f(h)),
                    p = a(h),
                    g = o(-u * p),
                    m = o(s * p),
                    y = c.BASE.multiplyAndAddUnsafe(l, g, m);
                if (!y) throw new Error("point at infinify");
                return y.assertValidity(), y;
            }
            hasHighS() {
                return l(this.s);
            }
            normalizeS() {
                return this.hasHighS() ? new g(this.r, o(-this.s), this.recovery) : this;
            }
            toDERRawBytes() {
                return Br(this.toDERHex());
            }
            toDERHex() {
                return hn.hexFromSig({
                    r: this.r,
                    s: this.s
                });
            }
            toCompactRawBytes() {
                return Br(this.toCompactHex());
            }
            toCompactHex() {
                return f(this.r) + f(this.s);
            }
        }
        const m = {
            isValidPrivateKey(t) {
                try {
                    return u(t), !0;
                } catch (t) {
                    return !1;
                }
            },
            normPrivateKeyToScalar: u,
            randomPrivateKey: () => {
                const t = function (t, e, r = !1) {
                    const n = (t = Cr("privateHash", t)).length,
                        s = nn(e).nByteLength + 8;
                    if (s < 24 || n < s || n > 1024) throw new Error(`hashToPrivateScalar: expected ${s}-1024 bytes of input, got ${n}`);
                    return Yr(r ? Pr(t) : Ir(t), e - qr) + qr;
                }(e.randomBytes(r.BYTES + 8), n);
                return Tr(t, e.nByteLength);
            },
            precompute: (t = 8, e = c.BASE) => (e._setWindowSize(t), e.multiply(BigInt(3)), e)
        };
        function y(t) {
            const e = t instanceof Uint8Array,
                r = "string" == typeof t,
                n = (e || r) && t.length;
            return e ? n === s || n === i : r ? n === 2 * s || n === 2 * i : t instanceof c;
        }
        const b = e.bits2int || function (t) {
            const r = Ir(t),
                n = 8 * t.length - e.nBitLength;
            return n > 0 ? r >> BigInt(n) : r;
        },
            w = e.bits2int_modN || function (t) {
                return o(b(t));
            },
            v = Hr(e.nBitLength);
        function x(t) {
            if ("bigint" != typeof t) throw new Error("bigint expected");
            if (!(dn <= t && t < v)) throw new Error(`bigint expected < 2^${e.nBitLength}`);
            return Tr(t, e.nByteLength);
        }
        function _(t, n, s = E) {
            if (["recovered", "canonical"].some(t => t in s)) throw new Error("sign() legacy options not supported");
            const {
                hash: i,
                randomBytes: h
            } = e;
            let {
                lowS: f,
                prehash: p,
                extraEntropy: m
            } = s;
            null == f && (f = !0), t = Cr("msgHash", t), p && (t = Cr("prehashed msgHash", i(t)));
            const y = w(t),
                v = u(n),
                _ = [x(v), x(y)];
            if (null != m) {
                const t = !0 === m ? h(r.BYTES) : m;
                _.push(Cr("extraEntropy", t, r.BYTES));
            }
            const S = Lr(..._),
                A = y;
            return {
                seed: S,
                k2sig: function (t) {
                    const e = b(t);
                    if (!d(e)) return;
                    const r = a(e),
                        n = c.BASE.multiply(e).toAffine(),
                        s = o(n.x);
                    if (s === dn) return;
                    const i = o(r * o(A + s * v));
                    if (i === dn) return;
                    let u = (n.x === s ? 0 : 2) | Number(n.y & fn),
                        h = i;
                    return f && l(i) && (h = function (t) {
                        return l(t) ? o(-t) : t;
                    }(i), u ^= 1), new g(s, h, u);
                }
            };
        }
        const E = {
            lowS: e.lowS,
            prehash: !1
        },
            S = {
                lowS: e.lowS,
                prehash: !1
            };
        return c.BASE._setWindowSize(8), {
            CURVE: e,
            getPublicKey: function (t, e = !0) {
                return c.fromPrivateKey(t).toRawBytes(e);
            },
            getSharedSecret: function (t, e, r = !0) {
                if (y(t)) throw new Error("first arg must be private key");
                if (!y(e)) throw new Error("second arg must be public key");
                return c.fromHex(e).multiply(u(t)).toRawBytes(r);
            },
            sign: function (t, r, n = E) {
                const {
                    seed: s,
                    k2sig: i
                } = _(t, r, n);
                return jr(e.hash.outputLen, e.nByteLength, e.hmac)(s, i);
            },
            verify: function (t, r, n, s = S) {
                var _c$BASE$multiplyAndAd;
                const i = t;
                if (r = Cr("msgHash", r), n = Cr("publicKey", n), "strict" in s) throw new Error("options.strict was renamed to lowS");
                const {
                    lowS: u,
                    prehash: h
                } = s;
                let d, f;
                try {
                    if ("string" == typeof i || i instanceof Uint8Array) try {
                        d = g.fromDER(i);
                    } catch (t) {
                        if (!(t instanceof hn.Err)) throw t;
                        d = g.fromCompact(i);
                    } else {
                        if ("object" != typeof i || "bigint" != typeof i.r || "bigint" != typeof i.s) throw new Error("PARSE");
                        {
                            const {
                                r: t,
                                s: e
                            } = i;
                            d = new g(t, e);
                        }
                    }
                    f = c.fromHex(n);
                } catch (t) {
                    if ("PARSE" === t.message) throw new Error("signature must be Signature instance, Uint8Array or hex string");
                    return !1;
                }
                if (u && d.hasHighS()) return !1;
                h && (r = e.hash(r));
                const {
                    r: l,
                    s: p
                } = d,
                    m = w(r),
                    y = a(p),
                    b = o(m * y),
                    v = o(l * y),
                    x = (_c$BASE$multiplyAndAd = c.BASE.multiplyAndAddUnsafe(f, b, v)) === null || _c$BASE$multiplyAndAd === void 0 ? void 0 : _c$BASE$multiplyAndAd.toAffine();
                return !!x && o(x.x) === l;
            },
            ProjectivePoint: c,
            Signature: g,
            utils: m
        };
    }
    let bn = class extends ur {
        constructor(t, e) {
            super(), this.finished = !1, this.destroyed = !1, sr.hash(t);
            const r = cr(e);
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
            return sr.exists(this), this.iHash.update(t), this;
        }
        digestInto(t) {
            sr.exists(this), sr.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
    };
    const wn = (t, e, r) => new bn(t, e).update(r).digest();
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    function vn(t) {
        return {
            hash: t,
            hmac: (e, ...r) => wn(t, e, function (...t) {
                if (!t.every(t => t instanceof Uint8Array)) throw new Error("Uint8Array list expected");
                if (1 === t.length) return t[0];
                const e = t.reduce((t, e) => t + e.length, 0),
                    r = new Uint8Array(e);
                for (let e = 0, n = 0; e < t.length; e++) {
                    const s = t[e];
                    r.set(s, n), n += s.length;
                }
                return r;
            }(...r)),
            randomBytes: dr
        };
    }
    wn.create = (t, e) => new bn(t, e);
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const xn = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
        _n = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
        En = BigInt(1),
        Sn = BigInt(2),
        An = (t, e) => (t + e / Sn) / e;
    function kn(t) {
        const e = xn,
            r = BigInt(3),
            n = BigInt(6),
            s = BigInt(11),
            i = BigInt(22),
            o = BigInt(23),
            a = BigInt(44),
            c = BigInt(88),
            u = t * t * t % e,
            h = u * u * t % e,
            d = Qr(h, r, e) * h % e,
            f = Qr(d, r, e) * h % e,
            l = Qr(f, Sn, e) * u % e,
            p = Qr(l, s, e) * l % e,
            g = Qr(p, i, e) * p % e,
            m = Qr(g, a, e) * g % e,
            y = Qr(m, c, e) * m % e,
            b = Qr(y, a, e) * g % e,
            w = Qr(b, r, e) * h % e,
            v = Qr(w, o, e) * p % e,
            x = Qr(v, n, e) * u % e,
            _ = Qr(x, Sn, e);
        if (!On.eql(On.sqr(_), t)) throw new Error("Cannot find square root");
        return _;
    }
    const On = function (t, e, r = !1, n = {}) {
        if (t <= Fr) throw new Error(`Expected Fp ORDER > 0, got ${t}`);
        const {
            nBitLength: s,
            nByteLength: i
        } = nn(t, e);
        if (i > 2048) throw new Error("Field lengths over 2048 bytes are not supported");
        const o = tn(t),
            a = Object.freeze({
                ORDER: t,
                BITS: s,
                BYTES: i,
                MASK: Hr(s),
                ZERO: Fr,
                ONE: qr,
                create: e => Yr(e, t),
                isValid: e => {
                    if ("bigint" != typeof e) throw new Error("Invalid field element: expected bigint, got " + typeof e);
                    return Fr <= e && e < t;
                },
                is0: t => t === Fr,
                isOdd: t => (t & qr) === qr,
                neg: e => Yr(-e, t),
                eql: (t, e) => t === e,
                sqr: e => Yr(e * e, t),
                add: (e, r) => Yr(e + r, t),
                sub: (e, r) => Yr(e - r, t),
                mul: (e, r) => Yr(e * r, t),
                pow: (t, e) => function (t, e, r) {
                    if (r < Fr) throw new Error("Expected power > 0");
                    if (r === Fr) return t.ONE;
                    if (r === qr) return e;
                    let n = t.ONE,
                        s = e;
                    for (; r > Fr;) r & qr && (n = t.mul(n, s)), s = t.sqr(s), r >>= qr;
                    return n;
                }(a, t, e),
                div: (e, r) => Yr(e * Xr(r, t), t),
                sqrN: t => t * t,
                addN: (t, e) => t + e,
                subN: (t, e) => t - e,
                mulN: (t, e) => t * e,
                inv: e => Xr(e, t),
                sqrt: n.sqrt || (t => o(a, t)),
                invertBatch: t => function (t, e) {
                    const r = new Array(e.length),
                        n = e.reduce((e, n, s) => t.is0(n) ? e : (r[s] = e, t.mul(e, n)), t.ONE),
                        s = t.inv(n);
                    return e.reduceRight((e, n, s) => t.is0(n) ? e : (r[s] = t.mul(e, r[s]), t.mul(e, n)), s), r;
                }(a, t),
                cmov: (t, e, r) => r ? e : t,
                toBytes: t => r ? Ur(t, i) : Tr(t, i),
                fromBytes: t => {
                    if (t.length !== i) throw new Error(`Fp.fromBytes: expected ${i}, got ${t.length}`);
                    return r ? Pr(t) : Ir(t);
                }
            });
        return Object.freeze(a);
    }(xn, void 0, void 0, {
        sqrt: kn
    }),
        Bn = function (t, e) {
            const r = e => yn({
                ...t,
                ...vn(e)
            });
            return Object.freeze({
                ...r(e),
                create: r
            });
        }({
            a: BigInt(0),
            b: BigInt(7),
            Fp: On,
            n: _n,
            Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
            Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
            h: BigInt(1),
            lowS: !0,
            endo: {
                beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
                splitScalar: t => {
                    const e = _n,
                        r = BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
                        n = -En * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
                        s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
                        i = r,
                        o = BigInt("0x100000000000000000000000000000000"),
                        a = An(i * t, e),
                        c = An(-n * t, e);
                    let u = Yr(t - a * r - c * s, e),
                        h = Yr(-a * n - c * i, e);
                    const d = u > o,
                        f = h > o;
                    if (d && (u = e - u), f && (h = e - h), u > o || h > o) throw new Error("splitScalar: Endomorphism failed, k=" + t);
                    return {
                        k1neg: d,
                        k1: u,
                        k2neg: f,
                        k2: h
                    };
                }
            }
        }, wr),
        In = BigInt(0),
        Pn = t => "bigint" == typeof t && In < t && t < xn,
        Tn = t => "bigint" == typeof t && In < t && t < _n,
        Un = {};
    function Cn(t, ...e) {
        let r = Un[t];
        if (void 0 === r) {
            const e = wr(Uint8Array.from(t, t => t.charCodeAt(0)));
            r = Lr(e, e), Un[t] = r;
        }
        return wr(Lr(r, ...e));
    }
    const Ln = t => t.toRawBytes(!0).slice(1),
        Nn = t => Tr(t, 32),
        Hn = t => Yr(t, xn),
        Zn = t => Yr(t, _n),
        Rn = Bn.ProjectivePoint,
        jn = (t, e, r) => Rn.BASE.multiplyAndAddUnsafe(t, e, r);
    function Dn(t) {
        let e = Bn.utils.normPrivateKeyToScalar(t),
            r = Rn.fromPrivateKey(e);
        return {
            scalar: r.hasEvenY() ? e : Zn(-e),
            bytes: Ln(r)
        };
    }
    function zn(t) {
        if (!Pn(t)) throw new Error("bad x: need 0 < x < p");
        const e = Hn(t * t);
        let r = kn(Hn(e * t + BigInt(7)));
        r % Sn !== In && (r = Hn(-r));
        const n = new Rn(t, r, En);
        return n.assertValidity(), n;
    }
    function $n(...t) {
        return Zn(Ir(Cn("BIP0340/challenge", ...t)));
    }
    function Fn(t, e, r) {
        const n = Cr("signature", t, 64),
            s = Cr("message", e),
            i = Cr("publicKey", r, 32);
        try {
            const t = zn(Ir(i)),
                e = Ir(n.subarray(0, 32));
            if (!Pn(e)) return !1;
            const r = Ir(n.subarray(32, 64));
            if (!Tn(r)) return !1;
            const o = $n(Nn(e), Ln(t), s),
                a = jn(t, r, Zn(-o));
            return !(!a || !a.hasEvenY() || a.toAffine().x !== e);
        } catch (t) {
            return !1;
        }
    }
    const qn = {
        getPublicKey: function (t) {
            return Dn(t).bytes;
        },
        sign: function (t, e, r = dr(32)) {
            const n = Cr("message", t),
                {
                    bytes: s,
                    scalar: i
                } = Dn(e),
                o = Cr("auxRand", r, 32),
                a = Nn(i ^ Ir(Cn("BIP0340/aux", o))),
                c = Cn("BIP0340/nonce", a, s, n),
                u = Zn(Ir(c));
            if (u === In) throw new Error("sign failed: k is zero");
            const {
                bytes: h,
                scalar: d
            } = Dn(u),
                f = $n(h, s, n),
                l = new Uint8Array(64);
            if (l.set(h, 0), l.set(Nn(Zn(d + f * i)), 32), !Fn(l, n, s)) throw new Error("sign: Invalid signature produced");
            return l;
        },
        verify: Fn,
        utils: {
            randomPrivateKey: Bn.utils.randomPrivateKey,
            lift_x: zn,
            pointToBytes: Ln,
            numberToBytesBE: Tr,
            bytesToNumberBE: Ir,
            taggedHash: Cn,
            mod: Yr
        }
    },
        Kn = function (t, e) {
            const r = e.map(t => Array.from(t).reverse());
            return (e, n) => {
                const [s, i, o, a] = r.map(r => r.reduce((r, n) => t.add(t.mul(r, e), n)));
                return e = t.div(s, i), n = t.mul(n, t.div(o, a)), {
                    x: e,
                    y: n
                };
            };
        }(On, [["0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7", "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581", "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262", "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"], ["0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b", "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14", "0x0000000000000000000000000000000000000000000000000000000000000001"], ["0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c", "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3", "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931", "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"], ["0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b", "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573", "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f", "0x0000000000000000000000000000000000000000000000000000000000000001"]].map(t => t.map(t => BigInt(t)))),
        Vn = function (t, e) {
            if (rn(t), !t.isValid(e.A) || !t.isValid(e.B) || !t.isValid(e.Z)) throw new Error("mapToCurveSimpleSWU: invalid opts");
            const r = function (t, e) {
                const r = t.ORDER;
                let n = dn;
                for (let t = r - fn; t % ln === dn; t /= ln) n += fn;
                const s = n,
                    i = (r - fn) / ln ** s,
                    o = (i - fn) / ln,
                    a = ln ** s - fn,
                    c = ln ** (s - fn),
                    u = t.pow(e, i),
                    h = t.pow(e, (i + fn) / ln);
                let d = (e, r) => {
                    let n = u,
                        i = t.pow(r, a),
                        d = t.sqr(i);
                    d = t.mul(d, r);
                    let f = t.mul(e, d);
                    f = t.pow(f, o), f = t.mul(f, i), i = t.mul(f, r), d = t.mul(f, e);
                    let l = t.mul(d, i);
                    f = t.pow(l, c);
                    let p = t.eql(f, t.ONE);
                    i = t.mul(d, h), f = t.mul(l, n), d = t.cmov(i, d, p), l = t.cmov(f, l, p);
                    for (let e = s; e > 1; e--) {
                        let r = ln ** (e - ln),
                            s = t.pow(l, r);
                        const o = t.eql(s, t.ONE);
                        i = t.mul(d, n), n = t.mul(n, n), s = t.mul(l, n), d = t.cmov(i, d, o), l = t.cmov(s, l, o);
                    }
                    return {
                        isValid: p,
                        value: d
                    };
                };
                if (t.ORDER % gn === pn) {
                    const r = (t.ORDER - pn) / gn,
                        n = t.sqrt(t.neg(e));
                    d = (e, s) => {
                        let i = t.sqr(s);
                        const o = t.mul(e, s);
                        i = t.mul(i, o);
                        let a = t.pow(i, r);
                        a = t.mul(a, o);
                        const c = t.mul(a, n),
                            u = t.mul(t.sqr(a), s),
                            h = t.eql(u, e);
                        return {
                            isValid: h,
                            value: t.cmov(c, a, h)
                        };
                    };
                }
                return d;
            }(t, e.Z);
            if (!t.isOdd) throw new Error("Fp.isOdd is not implemented!");
            return n => {
                let s, i, o, a, c, u, h, d;
                s = t.sqr(n), s = t.mul(s, e.Z), i = t.sqr(s), i = t.add(i, s), o = t.add(i, t.ONE), o = t.mul(o, e.B), a = t.cmov(e.Z, t.neg(i), !t.eql(i, t.ZERO)), a = t.mul(a, e.A), i = t.sqr(o), u = t.sqr(a), c = t.mul(u, e.A), i = t.add(i, c), i = t.mul(i, o), u = t.mul(u, a), c = t.mul(u, e.B), i = t.add(i, c), h = t.mul(s, o);
                const {
                    isValid: f,
                    value: l
                } = r(i, u);
                d = t.mul(s, n), d = t.mul(d, l), h = t.cmov(h, o, f), d = t.cmov(d, l, f);
                const p = t.isOdd(n) === t.isOdd(d);
                return d = t.cmov(t.neg(d), d, p), h = t.div(h, a), {
                    x: h,
                    y: d
                };
            };
        }(On, {
            A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
            B: BigInt("1771"),
            Z: On.create(BigInt("-11"))
        });
    function Mn(t) {
        let e,
            r = 0;
        const n = t.reduce((t, e) => t + e.length, 0),
            s = new Uint8Array(n);
        for (const n of t) for (e = 0; e < n.length; r++, e++) s[r] = n[e];
        return s;
    }
    function Gn(t) {
        if (!Number.isSafeInteger(t) || t < 0) throw new Error(`Wrong positive integer: ${t}`);
    }
    function Wn(t, ...e) {
        if (!(t instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
        if (e.length > 0 && !e.includes(t.length)) throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
    }
    !function (t, e, r) {
        if ("function" != typeof e) throw new Error("mapToCurve() must be defined");
    }(Bn.ProjectivePoint, t => {
        const {
            x: e,
            y: r
        } = Vn(On.create(t[0]));
        return Kn(e, r);
    }, {
        DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
        encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
        p: On.ORDER,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: wr
    });
    const Yn = {
        number: Gn,
        bool: function (t) {
            if ("boolean" != typeof t) throw new Error(`Expected boolean, not ${t}`);
        },
        bytes: Wn,
        hash: function (t) {
            if ("function" != typeof t || "function" != typeof t.create) throw new Error("Hash should be wrapped by utils.wrapConstructor");
            Gn(t.outputLen), Gn(t.blockLen);
        },
        exists: function (t, e = !0) {
            if (t.destroyed) throw new Error("Hash instance has been destroyed");
            if (e && t.finished) throw new Error("Hash#digest() has already been called");
        },
        output: function (t, e) {
            Wn(t);
            const r = e.outputLen;
            if (t.length < r) throw new Error(`digestInto() expects output buffer of length at least ${r}`);
        }
    };
    var Jn = Yn;
    const Qn = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0,
        Xn = t => new DataView(t.buffer, t.byteOffset, t.byteLength),
        ts = (t, e) => t << 32 - e | t >>> e;
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    if (!(68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0])) throw new Error("Non little-endian hardware is not supported");
    function es(t) {
        if ("string" == typeof t && (t = function (t) {
            if ("string" != typeof t) throw new TypeError("utf8ToBytes expected string, got " + typeof t);
            return new TextEncoder().encode(t);
        }(t)), !(t instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
        return t;
    }
    Array.from({
        length: 256
    }, (t, e) => e.toString(16).padStart(2, "0"));
    let rs = class {
        clone() {
            return this._cloneInto();
        }
    };
    function ns(t) {
        const e = e => t().update(es(e)).digest(),
            r = t();
        return e.outputLen = r.outputLen, e.blockLen = r.blockLen, e.create = () => t(), e;
    }
    class ss extends rs {
        constructor(t, e, r, n) {
            super(), this.blockLen = t, this.outputLen = e, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Xn(this.buffer);
        }
        update(t) {
            Jn.exists(this);
            const {
                view: e,
                buffer: r,
                blockLen: n
            } = this,
                s = (t = es(t)).length;
            for (let i = 0; i < s;) {
                const o = Math.min(n - this.pos, s - i);
                if (o !== n) r.set(t.subarray(i, i + o), this.pos), this.pos += o, i += o, this.pos === n && (this.process(e, 0), this.pos = 0); else {
                    const e = Xn(t);
                    for (; n <= s - i; i += n) this.process(e, i);
                }
            }
            return this.length += t.length, this.roundClean(), this;
        }
        digestInto(t) {
            Jn.exists(this), Jn.output(t, this), this.finished = !0;
            const {
                buffer: e,
                view: r,
                blockLen: n,
                isLE: s
            } = this;
            let {
                pos: i
            } = this;
            e[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > n - i && (this.process(r, 0), i = 0);
            for (let t = i; t < n; t++) e[t] = 0;
            !function (t, e, r, n) {
                if ("function" == typeof t.setBigUint64) return t.setBigUint64(e, r, n);
                const s = BigInt(32),
                    i = BigInt(4294967295),
                    o = Number(r >> s & i),
                    a = Number(r & i),
                    c = n ? 4 : 0,
                    u = n ? 0 : 4;
                t.setUint32(e + c, o, n), t.setUint32(e + u, a, n);
            }(r, n - 8, BigInt(8 * this.length), s), this.process(r, 0);
            const o = Xn(t),
                a = this.outputLen;
            if (a % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const c = a / 4,
                u = this.get();
            if (c > u.length) throw new Error("_sha2: outputLen bigger than state");
            for (let t = 0; t < c; t++) o.setUint32(4 * t, u[t], s);
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
    const is = (t, e, r) => t & e ^ t & r ^ e & r,
        os = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
        as = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
        cs = new Uint32Array(64);
    class us extends ss {
        constructor() {
            super(64, 32, 8, !1), this.A = 0 | as[0], this.B = 0 | as[1], this.C = 0 | as[2], this.D = 0 | as[3], this.E = 0 | as[4], this.F = 0 | as[5], this.G = 0 | as[6], this.H = 0 | as[7];
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
                H: a
            } = this;
            return [t, e, r, n, s, i, o, a];
        }
        set(t, e, r, n, s, i, o, a) {
            this.A = 0 | t, this.B = 0 | e, this.C = 0 | r, this.D = 0 | n, this.E = 0 | s, this.F = 0 | i, this.G = 0 | o, this.H = 0 | a;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) cs[r] = t.getUint32(e, !1);
            for (let t = 16; t < 64; t++) {
                const e = cs[t - 15],
                    r = cs[t - 2],
                    n = ts(e, 7) ^ ts(e, 18) ^ e >>> 3,
                    s = ts(r, 17) ^ ts(r, 19) ^ r >>> 10;
                cs[t] = s + cs[t - 7] + n + cs[t - 16] | 0;
            }
            let {
                A: r,
                B: n,
                C: s,
                D: i,
                E: o,
                F: a,
                G: c,
                H: u
            } = this;
            for (let t = 0; t < 64; t++) {
                const e = u + (ts(o, 6) ^ ts(o, 11) ^ ts(o, 25)) + ((h = o) & a ^ ~h & c) + os[t] + cs[t] | 0,
                    d = (ts(r, 2) ^ ts(r, 13) ^ ts(r, 22)) + is(r, n, s) | 0;
                u = c, c = a, a = o, o = i + e | 0, i = s, s = n, n = r, r = e + d | 0;
            }
            var h;
            r = r + this.A | 0, n = n + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, o = o + this.E | 0, a = a + this.F | 0, c = c + this.G | 0, u = u + this.H | 0, this.set(r, n, s, i, o, a, c, u);
        }
        roundClean() {
            cs.fill(0);
        }
        destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
        }
    }
    class hs extends us {
        constructor() {
            super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
        }
    }
    const ds = ns(() => new us());
    ns(() => new hs());
    const fs = BigInt(2 ** 32 - 1),
        ls = BigInt(32);
    function ps(t, e = !1) {
        return e ? {
            h: Number(t & fs),
            l: Number(t >> ls & fs)
        } : {
            h: 0 | Number(t >> ls & fs),
            l: 0 | Number(t & fs)
        };
    }
    var gs = {
        fromBig: ps,
        split: function (t, e = !1) {
            let r = new Uint32Array(t.length),
                n = new Uint32Array(t.length);
            for (let s = 0; s < t.length; s++) {
                const {
                    h: i,
                    l: o
                } = ps(t[s], e);
                [r[s], n[s]] = [i, o];
            }
            return [r, n];
        },
        toBig: (t, e) => BigInt(t >>> 0) << ls | BigInt(e >>> 0),
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
    const [ms, ys] = gs.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map(t => BigInt(t))),
        bs = new Uint32Array(80),
        ws = new Uint32Array(80);
    class vs extends ss {
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
                Dl: a,
                Eh: c,
                El: u,
                Fh: h,
                Fl: d,
                Gh: f,
                Gl: l,
                Hh: p,
                Hl: g
            } = this;
            return [t, e, r, n, s, i, o, a, c, u, h, d, f, l, p, g];
        }
        set(t, e, r, n, s, i, o, a, c, u, h, d, f, l, p, g) {
            this.Ah = 0 | t, this.Al = 0 | e, this.Bh = 0 | r, this.Bl = 0 | n, this.Ch = 0 | s, this.Cl = 0 | i, this.Dh = 0 | o, this.Dl = 0 | a, this.Eh = 0 | c, this.El = 0 | u, this.Fh = 0 | h, this.Fl = 0 | d, this.Gh = 0 | f, this.Gl = 0 | l, this.Hh = 0 | p, this.Hl = 0 | g;
        }
        process(t, e) {
            for (let r = 0; r < 16; r++, e += 4) bs[r] = t.getUint32(e), ws[r] = t.getUint32(e += 4);
            for (let t = 16; t < 80; t++) {
                const e = 0 | bs[t - 15],
                    r = 0 | ws[t - 15],
                    n = gs.rotrSH(e, r, 1) ^ gs.rotrSH(e, r, 8) ^ gs.shrSH(e, r, 7),
                    s = gs.rotrSL(e, r, 1) ^ gs.rotrSL(e, r, 8) ^ gs.shrSL(e, r, 7),
                    i = 0 | bs[t - 2],
                    o = 0 | ws[t - 2],
                    a = gs.rotrSH(i, o, 19) ^ gs.rotrBH(i, o, 61) ^ gs.shrSH(i, o, 6),
                    c = gs.rotrSL(i, o, 19) ^ gs.rotrBL(i, o, 61) ^ gs.shrSL(i, o, 6),
                    u = gs.add4L(s, c, ws[t - 7], ws[t - 16]),
                    h = gs.add4H(u, n, a, bs[t - 7], bs[t - 16]);
                bs[t] = 0 | h, ws[t] = 0 | u;
            }
            let {
                Ah: r,
                Al: n,
                Bh: s,
                Bl: i,
                Ch: o,
                Cl: a,
                Dh: c,
                Dl: u,
                Eh: h,
                El: d,
                Fh: f,
                Fl: l,
                Gh: p,
                Gl: g,
                Hh: m,
                Hl: y
            } = this;
            for (let t = 0; t < 80; t++) {
                const e = gs.rotrSH(h, d, 14) ^ gs.rotrSH(h, d, 18) ^ gs.rotrBH(h, d, 41),
                    b = gs.rotrSL(h, d, 14) ^ gs.rotrSL(h, d, 18) ^ gs.rotrBL(h, d, 41),
                    w = h & f ^ ~h & p,
                    v = d & l ^ ~d & g,
                    x = gs.add5L(y, b, v, ys[t], ws[t]),
                    _ = gs.add5H(x, m, e, w, ms[t], bs[t]),
                    E = 0 | x,
                    S = gs.rotrSH(r, n, 28) ^ gs.rotrBH(r, n, 34) ^ gs.rotrBH(r, n, 39),
                    A = gs.rotrSL(r, n, 28) ^ gs.rotrBL(r, n, 34) ^ gs.rotrBL(r, n, 39),
                    k = r & s ^ r & o ^ s & o,
                    O = n & i ^ n & a ^ i & a;
                m = 0 | p, y = 0 | g, p = 0 | f, g = 0 | l, f = 0 | h, l = 0 | d, ({
                    h: h,
                    l: d
                } = gs.add(0 | c, 0 | u, 0 | _, 0 | E)), c = 0 | o, u = 0 | a, o = 0 | s, a = 0 | i, s = 0 | r, i = 0 | n;
                const B = gs.add3L(E, A, O);
                r = gs.add3H(B, _, S, k), n = 0 | B;
            }
            ({
                h: r,
                l: n
            } = gs.add(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)), ({
                h: s,
                l: i
            } = gs.add(0 | this.Bh, 0 | this.Bl, 0 | s, 0 | i)), ({
                h: o,
                l: a
            } = gs.add(0 | this.Ch, 0 | this.Cl, 0 | o, 0 | a)), ({
                h: c,
                l: u
            } = gs.add(0 | this.Dh, 0 | this.Dl, 0 | c, 0 | u)), ({
                h: h,
                l: d
            } = gs.add(0 | this.Eh, 0 | this.El, 0 | h, 0 | d)), ({
                h: f,
                l: l
            } = gs.add(0 | this.Fh, 0 | this.Fl, 0 | f, 0 | l)), ({
                h: p,
                l: g
            } = gs.add(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | g)), ({
                h: m,
                l: y
            } = gs.add(0 | this.Hh, 0 | this.Hl, 0 | m, 0 | y)), this.set(r, n, s, i, o, a, c, u, h, d, f, l, p, g, m, y);
        }
        roundClean() {
            bs.fill(0), ws.fill(0);
        }
        destroy() {
            this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
    }
    class xs extends vs {
        constructor() {
            super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
        }
    }
    class _s extends vs {
        constructor() {
            super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
        }
    }
    class Es extends vs {
        constructor() {
            super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
        }
    }
    const Ss = ns(() => new vs());
    ns(() => new xs()), ns(() => new _s()), ns(() => new Es());
    const As = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]),
        ks = Uint8Array.from({
            length: 16
        }, (t, e) => e),
        Os = ks.map(t => (9 * t + 5) % 16);
    let Bs = [ks],
        Is = [Os];
    for (let t = 0; t < 4; t++) for (let e of [Bs, Is]) e.push(e[t].map(t => As[t]));
    const Ps = [[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map(t => new Uint8Array(t)),
        Ts = Bs.map((t, e) => t.map(t => Ps[e][t])),
        Us = Is.map((t, e) => t.map(t => Ps[e][t])),
        Cs = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]),
        Ls = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]),
        Ns = (t, e) => t << e | t >>> 32 - e;
    function Hs(t, e, r, n) {
        return 0 === t ? e ^ r ^ n : 1 === t ? e & r | ~e & n : 2 === t ? (e | ~r) ^ n : 3 === t ? e & n | r & ~n : e ^ (r | ~n);
    }
    const Zs = new Uint32Array(16);
    class Rs extends ss {
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
            for (let r = 0; r < 16; r++, e += 4) Zs[r] = t.getUint32(e, !0);
            let r = 0 | this.h0,
                n = r,
                s = 0 | this.h1,
                i = s,
                o = 0 | this.h2,
                a = o,
                c = 0 | this.h3,
                u = c,
                h = 0 | this.h4,
                d = h;
            for (let t = 0; t < 5; t++) {
                const e = 4 - t,
                    f = Cs[t],
                    l = Ls[t],
                    p = Bs[t],
                    g = Is[t],
                    m = Ts[t],
                    y = Us[t];
                for (let e = 0; e < 16; e++) {
                    const n = Ns(r + Hs(t, s, o, c) + Zs[p[e]] + f, m[e]) + h | 0;
                    r = h, h = c, c = 0 | Ns(o, 10), o = s, s = n;
                }
                for (let t = 0; t < 16; t++) {
                    const r = Ns(n + Hs(e, i, a, u) + Zs[g[t]] + l, y[t]) + d | 0;
                    n = d, d = u, u = 0 | Ns(a, 10), a = i, i = r;
                }
            }
            this.set(this.h1 + o + u | 0, this.h2 + c + d | 0, this.h3 + h + n | 0, this.h4 + r + i | 0, this.h0 + s + a | 0);
        }
        roundClean() {
            Zs.fill(0);
        }
        destroy() {
            this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
        }
    }
    const js = ns(() => new Rs());
    class Ds extends rs {
        constructor(t, e) {
            super(), this.finished = !1, this.destroyed = !1, Jn.hash(t);
            const r = es(e);
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
            return Jn.exists(this), this.iHash.update(t), this;
        }
        digestInto(t) {
            Jn.exists(this), Jn.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
    const zs = (t, e, r) => new Ds(t, e).update(r).digest();
    zs.create = (t, e) => new Ds(t, e);
    const $s = new TextEncoder(),
        Fs = new TextDecoder();
    function qs(t) {
        return $s.encode(t);
    }
    function Ks(t) {
        const e = new Uint8Array(t.length / 2);
        let r,
            n = 0;
        if (null !== t.match(/[^a-fA-f0-9]/)) throw new TypeError("Invalid hex string: " + t);
        if (t.length % 2 > 0) throw new Error(`Hex string length is uneven: ${t.length}`);
        for (r = 0; r < t.length; r += 2) e[n] = parseInt(t.slice(r, r + 2), 16), n += 1;
        return e;
    }
    function Vs(t) {
        if (0 === t) return Uint8Array.of(0);
        const e = [];
        for (; t > 0;) {
            const r = 255 & t;
            e.push(r), t = (t - r) / 256;
        }
        return new Uint8Array(e);
    }
    function Ms(t) {
        const e = new Array(8 * t.length);
        let r = 0;
        for (const n of t) {
            if (n > 255) throw new Error(`Invalid byte value: ${n}. Byte values must be between 0 and 255.`);
            for (let t = 7; t >= 0; t--, r++) e[r] = n >> t & 1;
        }
        return e;
    }
    function Gs(t) {
        if (0n === t) return Uint8Array.of(0);
        const e = [];
        for (; t > 0n;) {
            const r = 0xffn & t;
            e.push(Number(r)), t = (t - r) / 256n;
        }
        return new Uint8Array(e);
    }
    function Ws(t) {
        return Fs.decode(t);
    }
    function Ys(t) {
        const e = new Array(t.length);
        for (let r = 0; r < t.length; r++) e.push(t[r].toString(16).padStart(2, "0"));
        return e.join("");
    }
    function Js(t) {
        let e,
            r = 0;
        for (e = t.length - 1; e >= 0; e--) r = 256 * r + t[e];
        return Number(r);
    }
    function Qs(t) {
        let e,
            r = 0n;
        for (e = t.length - 1; e >= 0; e--) r = 256n * r + BigInt(t[e]);
        return BigInt(r);
    }
    function Xs(t, e = !0) {
        if (t instanceof ArrayBuffer) return new Uint8Array(t);
        if (t instanceof Uint8Array) return new Uint8Array(t);
        switch (typeof t) {
            case "bigint":
                return Gs(t);
            case "boolean":
                return Uint8Array.of(t ? 1 : 0);
            case "number":
                return Vs(t);
            case "string":
                return e ? Ks(t) : $s.encode(t);
            default:
                throw TypeError("Unsupported format:" + String(typeof t));
        }
    }
    function ti(t) {
        return ds(ds(Xs(t)));
    }
    const ei = {
        sha256: function (t) {
            return ds(Xs(t));
        },
        sha512: function (t) {
            return Ss(Xs(t));
        },
        ripe160: function (t) {
            return Ss(Xs(t));
        },
        hash256: ti,
        hash160: function (t) {
            return js(ds(Xs(t)));
        },
        hmac256: function (t, e) {
            return zs(ds, Xs(t), Xs(e));
        },
        hmac512: function (t, e) {
            return zs(Ss, Xs(t), Xs(e));
        }
    },
        ri = new TextEncoder(),
        ni = [{
            name: "base58",
            charset: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        }];
    function si(t) {
        for (const e of ni) if (e.name === t) return e.charset;
        throw TypeError("Charset does not exist: " + t);
    }
    const ii = {
        encode: function (t, e, r = !1) {
            "string" == typeof t && (t = ri.encode(t));
            const n = si(e),
                s = n.length,
                i = [];
            let o,
                a,
                c,
                u = "",
                h = 0;
            for (o = 0; o < t.length; o++) for (h = 0, a = t[o], u += a > 0 || (u.length ^ o) > 0 ? "" : "1"; h in i || a > 0;) c = i[h], c = c > 0 ? 256 * c + a : a, a = c / s | 0, i[h] = c % s, h++;
            for (; h-- > 0;) u += n[i[h]];
            return r && u.length % 4 > 0 ? u + "=".repeat(4 - u.length % 4) : u;
        },
        decode: function (t, e) {
            const r = si(e),
                n = r.length,
                s = [],
                i = [];
            t = t.replace("=", "");
            let o,
                a,
                c,
                u = 0;
            for (o = 0; o < t.length; o++) {
                if (u = 0, a = r.indexOf(t[o]), a < 0) throw new Error(`Character range out of bounds: ${a}`);
                for (a > 0 || (i.length ^ o) > 0 || i.push(0); u in s || a > 0;) c = s[u], c = c > 0 ? c * n + a : a, a = c >> 8, s[u] = c % 256, u++;
            }
            for (; u-- > 0;) i.push(s[u]);
            return new Uint8Array(i);
        }
    },
        oi = t => {
            const e = function (t) {
                return Mn([t, ti(t).slice(0, 4)]);
            }(t);
            return ii.encode(e, "base58");
        },
        ai = t => function (t) {
            const e = t.slice(0, -4),
                r = t.slice(-4);
            if (ti(e).slice(0, 4).toString() !== r.toString()) throw new Error("Invalid checksum!");
            return e;
        }(ii.decode(t, "base58")),
        ci = "qpzry9x8gf2tvdw0s3jn54khce6mua7l",
        ui = [996825010, 642813549, 513874426, 1027748829, 705979059],
        hi = [{
            version: 0,
            name: "bech32",
            const: 1
        }, {
            version: 1,
            name: "bech32m",
            const: 734539939
        }];
    function di(t) {
        let e = 1;
        for (let r = 0; r < t.length; ++r) {
            const n = e >> 25;
            e = (33554431 & e) << 5 ^ t[r];
            for (let t = 0; t < 5; ++t) 0 != (n >> t & 1) && (e ^= ui[t]);
        }
        return e;
    }
    function fi(t) {
        const e = [];
        let r;
        for (r = 0; r < t.length; ++r) e.push(t.charCodeAt(r) >> 5);
        for (e.push(0), r = 0; r < t.length; ++r) e.push(31 & t.charCodeAt(r));
        return e;
    }
    function li(t, e, r, n = !0) {
        const s = [];
        let i = 0,
            o = 0;
        const a = (1 << r) - 1,
            c = (1 << e + r - 1) - 1;
        for (const n of t) {
            if (n < 0 || n >> e > 0) throw new Error("Failed to perform base conversion. Invalid value: " + String(n));
            for (i = (i << e | n) & c, o += e; o >= r;) o -= r, s.push(i >> o & a);
        }
        if (n) o > 0 && s.push(i << r - o & a); else if (o >= e || (i << r - o & a) > 0) throw new Error("Failed to perform base conversion. Invalid Size!");
        return s;
    }
    function pi(t, e, r) {
        const n = e.concat(function (t, e, r) {
            const n = di(fi(t).concat(e).concat([0, 0, 0, 0, 0, 0])) ^ r.const,
                s = [];
            for (let t = 0; t < 6; ++t) s.push(n >> 5 * (5 - t) & 31);
            return s;
        }(t, e, r));
        let s = t + "1";
        for (let t = 0; t < n.length; ++t) s += ci.charAt(n[t]);
        return s;
    }
    function gi(t) {
        var _hi$find;
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
            const r = ci.indexOf(t.charAt(n));
            if (-1 === r) throw new Error("Character idx out of bounds: " + String(n));
            e.push(r);
        }
        const s = (_hi$find = hi.find(t => t.version === e[0])) !== null && _hi$find !== void 0 ? _hi$find : hi[0];
        if (!function (t, e, r) {
            return di(fi(t).concat(e)) === r.const;
        }(n, e, s)) throw new Error("Checksum verification failed!");
        return [n, e.slice(0, e.length - 6)];
    }
    function mi(t) {
        const e = (t = t.toLowerCase()).split("1", 1)[0],
            [r, n] = gi(t),
            s = li(n.slice(1), 5, 8, !1),
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
    const yi = {
        encode: function (t, e = "bc", r = 0) {
            var _hi$find2;
            const n = pi(e, [r, ...li([...t], 8, 5)], (_hi$find2 = hi.find(t => t.version === r)) !== null && _hi$find2 !== void 0 ? _hi$find2 : hi[0]);
            return mi(n), n;
        },
        decode: mi,
        version: function (t) {
            t = t.toLowerCase();
            const [e, r] = gi(t);
            return r[0];
        }
    },
        bi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        wi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        vi = new TextEncoder();
    function xi(t, e = !1) {
        "string" == typeof t && (t = vi.encode(t));
        const r = e ? wi : bi;
        let n = "",
            s = 0,
            i = 0;
        for (let e = 0; e < t.length; e++) for (i = i << 8 | t[e], s += 8; s >= 6;) s -= 6, n += r[i >> s & 63];
        if (s > 0) for (i <<= 6 - s, n += r[63 & i]; s < 6;) n += e ? "" : "=", s += 2;
        return n;
    }
    function _i(t, e = !1) {
        const r = e || t.includes("-") || t.includes("_") ? wi.split("") : bi.split(""),
            n = (t = t.replace(/=+$/, "")).split("");
        let s = 0,
            i = 0;
        const o = [];
        for (let t = 0; t < n.length; t++) {
            const e = n[t],
                a = r.indexOf(e);
            if (-1 === a) throw new Error("Invalid character: " + e);
            s += 6, i <<= 6, i |= a, s >= 8 && (s -= 8, o.push(i >>> s & 255));
        }
        return new Uint8Array(o);
    }
    const Ei = {
        encode: xi,
        decode: _i
    },
        Si = t => xi(t, !0),
        Ai = t => _i(t, !0);
    class ki extends Uint8Array {
        constructor(t, e) {
            if (t = Xs(t, !0), "number" == typeof e) {
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
            return new Oi(this);
        }
        toNum(t = "le") {
            return Js("le" === t ? this.reverse() : this);
        }
        toBig(t = "le") {
            return Qs("le" === t ? this.reverse() : this);
        }
        toHash(t = "sha256") {
            switch (t) {
                case "sha256":
                    return new ki(ei.sha256(this));
                case "hash256":
                    return new ki(ei.hash256(this));
                case "ripe160":
                    return new ki(ei.ripe160(this));
                case "hash160":
                    return new ki(ei.hash160(this));
                default:
                    throw new Error("Unrecognized format:" + String(t));
            }
        }
        toHmac(t, e = "hmac256") {
            switch (e) {
                case "hmac256":
                    return new ki(ei.hmac256(t, this));
                case "hmac512":
                    return new ki(ei.hmac512(t, this));
                default:
                    throw new Error("Unrecognized format:" + String(e));
            }
        }
        toStr() {
            return Ws(this);
        }
        toHex() {
            return Ys(this);
        }
        toJson() {
            return JSON.parse(Ws(this));
        }
        toBytes() {
            return new Uint8Array(this);
        }
        toBits() {
            return Ms(this);
        }
        toBin() {
            return Ms(this).join("");
        }
        tob58chk() {
            return oi(this);
        }
        toB64url() {
            return Si(this);
        }
        toBase64() {
            return Ei.encode(this);
        }
        toBech32(t, e = 0) {
            return yi.encode(this, t, e);
        }
        prepend(t) {
            return ki.join([ki.bytes(t), this]);
        }
        append(t) {
            return ki.join([this, ki.bytes(t)]);
        }
        slice(t, e) {
            return new ki(new Uint8Array(this).slice(t, e));
        }
        subarray(t, e) {
            return new ki(new Uint8Array(this).subarray(t, e));
        }
        reverse() {
            return new ki(new Uint8Array(this).reverse());
        }
        write(t, e) {
            this.set(t, e);
        }
        prefixSize(t) {
            const e = ki.varInt(this.length, t);
            return ki.join([e, this]);
        }
        static from(t) {
            return new ki(Uint8Array.from(t));
        }
        static of(...t) {
            return new ki(Uint8Array.of(...t));
        }
        static join(t) {
            const e = t.map(t => ki.bytes(t));
            return new ki(Mn(e));
        }
        static varInt(t, e) {
            if (t < 253) return ki.num(t, 1);
            if (t < 65536) return ki.of(253, ...ki.num(t, 2, e));
            if (t < 4294967296) return ki.of(254, ...ki.num(t, 4, e));
            if (BigInt(t) < 0x10000000000000000n) return ki.of(255, ...ki.num(t, 8, e));
            throw new Error(`Value is too large: ${t}`);
        }
        static random(t = 32) {
            return new ki(function (t = 32) {
                if (Qn && "function" == typeof Qn.getRandomValues) return Qn.getRandomValues(new Uint8Array(t));
                throw new Error("crypto.getRandomValues must be defined");
            }(t), t);
        }
        static normalize(t, e) {
            return new ki(Xs(t, !0), e);
        }
        static hexify(t) {
            return function (t) {
                return Ys(t = Xs(t, !0));
            }(t);
        }
        static serialize(t, e) {
            return new ki(function (t) {
                if ("object" == typeof t) {
                    if (t instanceof Uint8Array) return t;
                    try {
                        return qs(JSON.stringify(t));
                    } catch {
                        throw TypeError("Object is not serializable.");
                    }
                }
                return Xs(t, !1);
            }(t), e);
        }
        static revive(t) {
            return function (t) {
                if (t instanceof Uint8Array && (t = Ws(t)), "string" == typeof t) try {
                    return JSON.parse(t);
                } catch {
                    return t;
                }
                return t;
            }(t);
        }
    }
    _ki = ki;
    _ki.num = (t, e, r = "le") => {
        const n = new _ki(Vs(t), e);
        return "le" === r ? n.reverse() : n;
    };
    _ki.big = (t, e, r = "le") => {
        const n = new _ki(Gs(t), e);
        return "le" === r ? n.reverse() : n;
    };
    _ki.bin = (t, e) => new _ki(function (t) {
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
    _ki.any = (t, e) => new _ki(Xs(t, !1), e);
    _ki.raw = (t, e) => new _ki(t, e);
    _ki.str = (t, e) => new _ki(qs(t), e);
    _ki.hex = (t, e) => new _ki(Ks(t), e);
    _ki.json = t => new _ki(qs(JSON.stringify(t)));
    _ki.bytes = (t, e) => new _ki(Xs(t, !0), e);
    _ki.base64 = t => new _ki(Ei.decode(t));
    _ki.b64url = t => new _ki(Ai(t));
    _ki.bech32 = t => new _ki(yi.decode(t));
    _ki.b58chk = t => new _ki(ai(t));
    _ki.encode = qs;
    _ki.decode = Ws;
    class Oi {
        constructor(t) {
            this.data = new Uint8Array(t), this.size = this.data.length;
        }
        peek(t) {
            if (t > this.size) throw new Error(`Size greater than stream: ${t} > ${this.size}`);
            return new ki(this.data.slice(0, t).buffer);
        }
        read(t) {
            var _t4;
            t = (_t4 = t) !== null && _t4 !== void 0 ? _t4 : this.readSize();
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
    const {
        ProjectivePoint: Bi
    } = Bn;
    class Ii extends Uint8Array {
        static mod(t, e = Ii.N) {
            return qn.utils.mod(t, e);
        }
        static pow(t, e, r = Ii.N) {
            if (t = Ii.mod(t, r), e = Ii.mod(e, r), 0n === t) return 0n;
            let n = 1n;
            for (; e > 0n;) 1n === (1n & e) && (n = Ii.mod(n * t, r)), e >>= 1n, t = Ii.mod(t * t, r);
            return n;
        }
        static normalize(t) {
            return t = Ti(t), t = Ii.mod(t), Ii.validate(t), ki.big(t, 32);
        }
        static validate(t) {
            return Bn.utils.isValidPrivateKey(t);
        }
        constructor(t) {
            super(Ii.normalize(t), 32);
        }
        get buff() {
            return new ki(this);
        }
        get raw() {
            return this.buff.raw;
        }
        get big() {
            return this.buff.big;
        }
        get hex() {
            return this.buff.hex;
        }
        get point() {
            return this.generate();
        }
        get xpoint() {
            return new Pi(this.point.x);
        }
        get hasOddY() {
            return this.point.hasOddY;
        }
        get negated() {
            return this.hasOddY ? this.negate() : this;
        }
        gt(t) {
            return new Ii(t).big > this.big;
        }
        lt(t) {
            return new Ii(t).big < this.big;
        }
        eq(t) {
            return new Ii(t).big === this.big;
        }
        ne(t) {
            return new Ii(t).big !== this.big;
        }
        add(t) {
            const e = new Ii(t);
            return new Ii(this.big + e.big);
        }
        sub(t) {
            const e = new Ii(t);
            return new Ii(this.big - e.big);
        }
        mul(t) {
            const e = new Ii(t);
            return new Ii(this.big * e.big);
        }
        pow(t, e = Ii.N - 1n) {
            const r = new Ii(t),
                n = Ii.mod(r.big, e);
            return new Ii(this.big ** n);
        }
        div(t) {
            const e = new Ii(t),
                r = this.pow(e.big, Ii.N - 2n);
            return new Ii(this.big * r.big);
        }
        negate() {
            return new Ii(Ii.N - this.big);
        }
        generate() {
            return Pi.import(Bi.BASE.multiply(this.big));
        }
    }
    _Ii = Ii;
    _Ii.N = Bn.CURVE.n;
    class Pi {
        static validate(t) {
            try {
                return t = new Pi(t), !0;
            } catch {
                return !1;
            }
        }
        static normalize(t) {
            let e = function (t) {
                if (t instanceof Ii || t instanceof Pi) return t.buff;
                if (t instanceof Uint8Array || "string" == typeof t || "number" == typeof t || "bigint" == typeof t) return ki.bytes(t);
                throw TypeError("Invalid input type:" + typeof t);
            }(t);
            return 32 === e.length && (e = e.prepend(2)), Bi.fromHex(e.hex);
        }
        static generate(t) {
            return new Ii(t).generate();
        }
        static import(t) {
            const e = t instanceof Pi ? {
                x: t.x.big,
                y: t.y.big
            } : {
                x: t.x,
                y: t.y
            };
            return new Pi(e.x, e.y);
        }
        constructor(t, e) {
            this.__p = "bigint" == typeof t && "bigint" == typeof e ? new Bi(t, e, 1n) : Pi.normalize(t), this.p.assertValidity();
        }
        get p() {
            return this.__p;
        }
        get x() {
            return ki.big(this.p.x, 32);
        }
        get y() {
            return ki.big(this.p.y, 32);
        }
        get buff() {
            return ki.raw(this.p.toRawBytes(!0));
        }
        get raw() {
            return this.buff.raw;
        }
        get hex() {
            return this.buff.hex;
        }
        get hasEvenY() {
            return this.p.hasEvenY();
        }
        get hasOddY() {
            return !this.p.hasEvenY();
        }
        eq(t) {
            return t instanceof Pi ? this.p.equals(new Bi(t.x.big, t.y.big, 1n)) : t instanceof Uint8Array ? this.x.big === ki.raw(t).big : "number" == typeof t ? BigInt(t) === this.x.big : t === this.x.big;
        }
        add(t) {
            return t instanceof Pi ? Pi.import(this.p.add(t.p)) : Pi.import(this.p.add(Pi.generate(t).p));
        }
        sub(t) {
            return t instanceof Pi ? Pi.import(this.p.subtract(t.p)) : Pi.import(this.p.subtract(Pi.generate(t).p));
        }
        mul(t) {
            return t instanceof Pi ? Pi.import(this.p.multiply(t.x.big)) : Pi.import(this.p.multiply(Ti(t)));
        }
        negate() {
            return Pi.import(this.p.negate());
        }
    }
    _Pi = Pi;
    _Pi.N = Bn.CURVE.n;
    function Ti(t) {
        if (t instanceof Ii) return t.big;
        if (t instanceof Pi) return t.x.big;
        if (t instanceof Uint8Array) return ki.raw(t).big;
        if ("string" == typeof t) return ki.hex(t).big;
        if ("number" == typeof t) return ki.num(t).big;
        if ("bigint" == typeof t) return BigInt(t);
        throw TypeError("Invalid input type:" + typeof t);
    }
    function Ui(t) {
        const e = ki.bytes(t);
        if (33 === e.length) return e.slice(1, 33);
        if (32 === e.length) return e;
        throw new Error("Invalid key length: " + String(e.length));
    }
    function Ci(t, e, r = "taproot") {
        const n = ki.bytes(e).raw,
            s = ki.bytes(t).raw;
        switch (r) {
            case "ecdsa":
                return Bn.sign(n, s).toDERRawBytes();
            case "taproot":
                return qn.sign(n, s);
            default:
                throw new Error("Unknown signature type:" + String(r));
        }
    }
    function Li(t, e, r, n = "taproot") {
        const s = ki.bytes(t).raw,
            i = ki.bytes(e).raw,
            o = ki.bytes(r).raw;
        switch (n) {
            case "ecdsa":
                return Bn.verify(s, i, o);
            case "taproot":
                return qn.verify(s, i, Ui(o));
            default:
                throw new Error("Unknown signature type:" + String(n));
        }
    }
    const Ni = {
        type: "ecdsa"
    };
    class Hi extends Uint8Array {
        static random(t) {
            return new Hi(ki.random(32), t);
        }
        constructor(t, e = {}) {
            super(new Ii(t)), this.config = {
                ...Ni,
                ...e
            }, this.xonly = "taproot" === this.config.type;
        }
        get buff() {
            return new ki(this);
        }
        get raw() {
            return this.buff.raw;
        }
        get hex() {
            return this.buff.hex;
        }
        get field() {
            return new Ii(this);
        }
        get point() {
            return this.field.point;
        }
        get pub() {
            return new Zi(this.point.raw, this.config);
        }
        get hasEvenY() {
            return this.point.hasEvenY;
        }
        get hasOddY() {
            return this.point.hasOddY;
        }
        get xfilter() {
            return this.xonly && this.hasOddY ? this.negate() : this;
        }
        add(t) {
            const e = this.xfilter.field;
            return new Hi(e.add(t), this.config);
        }
        sub(t) {
            const e = this.xfilter.field;
            return new Hi(e.sub(t), this.config);
        }
        mul(t) {
            const e = this.xfilter.field;
            return new Hi(e.mul(t), this.config);
        }
        div(t) {
            const e = this.xfilter.field;
            return new Hi(e.div(t), this.config);
        }
        pow(t) {
            const e = this.xfilter.field;
            return new Hi(e.pow(t), this.config);
        }
        negate() {
            return new Hi(this.field.negate(), this.config);
        }
        sign(t, e = this.config.type) {
            return Ci(this.raw, t, e);
        }
        verify(t, e, r = this.config.type) {
            return Li(t, e, this.pub.raw, r);
        }
        toWIF(t = 128) {
            return ki.join([t, this, 1]).b58chk;
        }
    }
    class Zi extends Uint8Array {
        static random(t) {
            return Hi.random(t).pub;
        }
        static fromSecret(t, e) {
            return new Hi(t, e).pub;
        }
        constructor(t, e = {}) {
            const r = {
                ...Ni,
                ...e
            };
            "taproot" === r.type ? super(Zi.xfilter(t), 32) : super(ki.bytes(t), 33), this.config = {
                ...Ni,
                ...e
            }, this.xonly = "taproot" === r.type;
        }
        get buff() {
            return this.xonly ? this.x : new ki(this);
        }
        get raw() {
            return this.buff.raw;
        }
        get hex() {
            return this.buff.hex;
        }
        get point() {
            return new Pi(this);
        }
        get x() {
            return this.point.x;
        }
        get y() {
            return this.point.y;
        }
        get hasEvenY() {
            return this.point.hasEvenY;
        }
        get hasOddY() {
            return this.point.hasOddY;
        }
        add(t) {
            return new Zi(this.point.add(t).raw, this.config);
        }
        sub(t) {
            return new Zi(this.point.sub(t).raw, this.config);
        }
        mul(t) {
            return new Zi(this.point.mul(t).raw, this.config);
        }
        negate() {
            return new Zi(this.point.negate().raw, this.config);
        }
        verify(t, e, r = this.config.type) {
            return Li(t, e, this.raw, r);
        }
    }
    _Zi = Zi;
    _Zi.xfilter = Ui;
    const Ri = {
        hash: Je,
        sign: function (t, e, r, n = {}) {
            const {
                sigflag: s = 1
            } = n,
                i = Ci(t, Je(e, r, n), "ecdsa");
            return Lt.join([i, s]);
        },
        verify: function (t, e, r = {}) {
            const n = qe.fmt.toJson(t),
                {
                    throws: s = !1
                } = r,
                {
                    witness: i = []
                } = n.vin[e],
                o = qe.util.readWitness(i),
                {
                    script: a,
                    params: c
                } = o;
            let u = null;
            if (c.length < 1) return Zt("Invalid witness data: " + String(i), s);
            if (void 0 === r.script && null !== a && (r.script = a), void 0 !== r.pubkey) u = Lt.bytes(r.pubkey); else {
                if (!(c.length > 1 && 33 === c[1].length)) return Zt("No pubkey provided!", s);
                u = Lt.bytes(c[1]);
            }
            const h = ee.fmt.toParam(c[0]),
                d = h.slice(0, -1),
                f = h.slice(-1)[0],
                l = Je(n, e, {
                    ...r,
                    sigflag: f
                });
            return !!Li(d.hex, l.hex, u.hex, "ecdsa") || Zt("Invalid signature!", s);
        }
    },
        ji = [0, 1, 2, 3, 129, 130, 131];
    function Di(t, e, r = {}) {
        const {
            extension: n,
            sigflag: s = 0,
            extflag: i = 0,
            key_version: o = 0,
            separator_pos: a = 4294967295
        } = r,
            c = qe.fmt.toJson(t),
            {
                version: u,
                vin: h,
                vout: d,
                locktime: f
            } = c;
        if (e >= h.length) throw new Error("Index out of bounds: " + String(e));
        if (!ji.includes(s)) throw new Error("Invalid hash type: " + String(s));
        if (i < 0 || i > 127) throw new Error("Extention flag out of range: " + String(i));
        const {
            txid: l,
            vout: p,
            sequence: g,
            witness: m = []
        } = h[e],
            y = 128 == (128 & s),
            b = function (t) {
                if (void 0 === t) return;
                if (t.length < 2) return;
                let e = t.at(-1);
                "string" == typeof e && (e = Lt.hex(e));
                if (e instanceof Uint8Array && 80 === e[0]) return Lt.raw(e).prefixSize("be").digest;
                return;
            }(m),
            w = 2 * (i + (void 0 !== n ? 1 : 0)) + (void 0 !== b ? 1 : 0),
            v = Lt.str("TapSighash").digest,
            x = [v, v, Lt.num(0, 1), Lt.num(s, 1), Se(u), Ue(f)];
        if (!y) {
            const t = h.map(t => zi(t));
            x.push(function (t) {
                const e = [];
                for (const {
                    txid: r,
                    vout: n
                } of t) e.push(Ae(r)), e.push(ke(n));
                return Lt.join(e).digest;
            }(h), function (t) {
                const e = [];
                for (const {
                    value: r
                } of t) e.push(Be(r));
                return Lt.join(e).digest;
            }(t), function (t) {
                const e = [];
                for (const {
                    scriptPubKey: r
                } of t) e.push(Wt(r, !0));
                return Lt.join(e).digest;
            }(t), function (t) {
                const e = [];
                for (const {
                    sequence: r
                } of t) e.push(Oe(r));
                return Lt.join(e).digest;
            }(h));
        }
        if (((3 & s) < 2 || (3 & s) > 3) && x.push(function (t) {
            const e = [];
            for (const {
                value: r,
                scriptPubKey: n
            } of t) e.push(Be(r)), e.push(ee.encode(n, !0));
            return Lt.join(e).digest;
        }(d)), x.push(Lt.num(w, 1)), y) {
            const {
                value: t,
                scriptPubKey: r
            } = zi(h[e]);
            x.push(Ae(l), ke(p), Be(t), ee.encode(r, !0), Oe(g));
        } else x.push(Lt.num(e, 4).reverse());
        return void 0 !== b && x.push(b), 3 == (3 & s) && x.push(function (t) {
            return Lt.join([Be(t.value), ee.encode(t.scriptPubKey, !0)]).digest;
        }(d[e])), void 0 !== n && x.push(Lt.bytes(n), Lt.num(o), Lt.num(a, 4)), Lt.join(x).digest;
    }
    function zi(t) {
        if (void 0 === t.prevout) throw new Error("Prevout data missing for input: " + String(t.txid));
        return t.prevout;
    }
    const $i = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
        Fi = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
    const qi = 192;
    function Ki(t) {
        const e = Lt.str(t).digest;
        return Lt.join([e, e]);
    }
    function Vi(t, e = qi) {
        return Lt.join([Ki("TapLeaf"), Wi(e), Lt.normalize(t)]).digest.hex;
    }
    function Mi(t, e) {
        return e < t && ([t, e] = [e, t]), Lt.join([Ki("TapBranch"), Lt.hex(t).raw, Lt.hex(e).raw]).digest.hex;
    }
    function Gi(t, e, r = []) {
        const n = [],
            s = [];
        if (t.length < 1) throw new Error("Tree is empty!");
        for (let s = 0; s < t.length; s++) {
            const i = t[s];
            if (Array.isArray(i)) {
                const [t, s, o] = Gi(i, e);
                e = s, n.push(t);
                for (const t of o) r.push(t);
            } else n.push(i);
        }
        if (1 === n.length) return [n[0], e, r];
        n.sort(), n.length % 2 != 0 && n.push(n[n.length - 1]);
        for (let t = 0; t < n.length - 1; t += 2) {
            const i = Mi(n[t], n[t + 1]);
            s.push(i), "string" == typeof e && (e === n[t] ? (r.push(n[t + 1]), e = i) : e === n[t + 1] && (r.push(n[t]), e = i));
        }
        return Gi(s, e, r);
    }
    function Wi(t = 192) {
        return 254 & t;
    }
    function Yi(t, e = new Uint8Array(), r = !1) {
        const n = r ? new Ii(t).point.x.raw : pe(t);
        return Lt.join([Ki("TapTweak"), n, Lt.bytes(e)]).digest;
    }
    function Ji(t, e, r = !1) {
        void 0 === e && (e = new Uint8Array());
        const n = Lt.bytes(t),
            s = Yi(t, e, r);
        return r ? Qi(n, s) : Xi(n, s);
    }
    function Qi(t, e) {
        let r = new Ii(t);
        return r.point.hasOddY && (r = r.negate()), Lt.raw(r.add(e).raw);
    }
    function Xi(t, e) {
        t = pe(t);
        const r = new Pi(t).add(e);
        return Lt.raw(r.raw);
    }
    const to = 192;
    function eo(t, e = {}) {
        const {
            isPrivate: r = !1,
            tree: n = [],
            version: s = to
        } = e,
            i = r ? new Hi(t).pub.x.raw : pe(t);
        let {
            target: o
        } = e;
        void 0 !== o && (o = Lt.bytes(o).hex);
        let a,
            c = [];
        if (n.length > 0) {
            const [e, s, i] = Gi(n, o);
            c = i, a = Ji(t, e, r);
        } else a = Ji(t, void 0 !== o ? o : void 0, r);
        const u = r ? new Hi(a).point.raw[0] : a[0],
            h = [Lt.num(s + so(u)), i];
        c.length > 0 && c.forEach(t => h.push(Lt.hex(t)));
        const d = Lt.join(h);
        if (void 0 !== o && !ro(a, o, d, e)) throw new Error("Path checking failed! Unable to generate path.");
        return [pe(a).hex, d.hex];
    }
    function ro(t, e, r, n = {}) {
        const {
            isPrivate: s = !1,
            throws: i = !1
        } = n,
            {
                parity: o,
                paths: a,
                intkey: c
            } = no(r),
            u = s ? new Hi(t).pub.x.raw : pe(t),
            h = Lt.join([o, u]);
        if (33 !== h.length) return Zt("Invalid tapkey: " + h.hex, i);
        let d = Lt.bytes(e).hex;
        for (const t of a) d = Mi(d, t);
        const f = Ji(c, d);
        return Lt.raw(f).hex === Lt.raw(h).hex;
    }
    function no(t) {
        const e = new Nt(Lt.bytes(t)),
            r = e.read(1).num,
            n = e.read(32),
            [s, i] = r % 2 == 0 ? [r, 2] : [r - 1, 3],
            o = [];
        for (; e.size >= 32;) o.push(e.read(32).hex);
        if (0 !== e.size) throw new Error("Non-empty buffer on control block: " + String(e));
        return {
            intkey: n,
            paths: o,
            parity: i,
            version: s
        };
    }
    function so(t = 2) {
        if (0 === t || 1 === t) return t;
        if (2 === t || "02" === t) return 0;
        if (3 === t || "03" === t) return 1;
        throw new Error("Invalid parity bit: " + String(t));
    }
    const io = {
        hash: Di,
        sign: function (t, e, r, n = {}) {
            const {
                sigflag: s = 0
            } = n,
                i = function (t, e, r = Lt.random(32)) {
                    const n = Lt.bytes(e),
                        s = new Ii(t),
                        i = s.point,
                        o = i.hasEvenY ? s.big : s.negated.big,
                        a = Rt("BIP0340/aux", Lt.bytes(r)),
                        c = Rt("BIP0340/nonce", o ^ a.big, i.x.raw, n),
                        u = new Ii(c),
                        h = u.point,
                        d = h.hasEvenY ? u.big : u.negated.big,
                        f = new Ii(Rt("BIP0340/challenge", h.x.raw, i.x.raw, n)),
                        l = new Ii(d + f.big * o);
                    return Lt.join([h.x.raw, l.raw]);
                }(t, Di(e, r, n));
            return 0 === s ? Lt.raw(i) : Lt.join([i, s]);
        },
        verify: function (t, e, r = {}) {
            const n = qe.fmt.toJson(t),
                {
                    throws: s = !1
                } = r,
                {
                    prevout: i,
                    witness: o = []
                } = n.vin[e],
                a = qe.util.readWitness(o),
                {
                    cblock: c,
                    script: u,
                    params: h
                } = a;
            let d;
            if (h.length < 1) return Zt("Invalid witness data: " + String(o), s);
            const {
                scriptPubKey: f
            } = i !== null && i !== void 0 ? i : {};
            if (void 0 === f) return Zt("Prevout scriptPubKey is empty!", s);
            const {
                type: l,
                data: p
            } = qe.util.readScriptPubKey(f);
            if ("p2tr" !== l) return Zt("Prevout script is not a valid taproot output:" + p.hex, s);
            if (32 !== p.length) return Zt("Invalid tapkey length: " + String(p.length), s);
            if (null !== c && null !== u) {
                const t = Vi(u, 254 & c[0]);
                if (r.extension = t, !ro(p, t, c, {
                    throws: s
                })) return Zt("cblock verification failed!", s);
            }
            d = void 0 !== r.pubkey ? Lt.bytes(r.pubkey) : h.length > 1 && 32 === h[1].length ? Lt.bytes(h[1]) : Lt.bytes(p);
            const g = ee.fmt.toParam(h[0]),
                m = new Nt(g),
                y = m.read(64).raw;
            return 1 === m.size && (r.sigflag = m.read(1).num, 0 === r.sigflag) ? Zt("0x00 is not a valid appended sigflag!", s) : !!function (t, e, r, n = !1) {
                const s = new Pi(pe(r)),
                    i = Lt.bytes(e),
                    o = Lt.bytes(t).stream;
                o.size < 64 && Zt("Signature length is too small: " + String(o.size), n);
                const a = o.read(32);
                a.big > $i && Zt("Signature r value greater than field size!", n);
                const c = o.read(32);
                c.big > Fi && Zt("Signature s value greater than curve order!", n);
                const u = new Ii(Rt("BIP0340/challenge", a.raw, s.x.raw, i)),
                    h = new Ii(c).point,
                    d = s.mul(u.big),
                    f = h.sub(d);
                return f.hasOddY && Zt("Signature R value has odd Y coordinate!", n), 0n === f.x.big && Zt("Signature R value is infinite!", n), f.x.big === a.big;
            }(y, Di(n, e, r), d, s) || Zt("Invalid signature!", s);
        }
    },
        oo = {
            segwit: Ri,
            taproot: io
        },
        ao = {
            getTag: Ki,
            getLeaf: Vi,
            getBranch: Mi,
            getRoot: function (t) {
                return Lt.hex(Gi(t)[0]);
            }
        },
        co = {
            getPubKey: function (t, e = {}) {
                return eo(t, {
                    ...e,
                    isPrivate: !1
                });
            },
            getSecKey: function (t, e = {}) {
                return eo(t, {
                    ...e,
                    isPrivate: !0
                });
            },
            encodeScript: function (t, e) {
                return Vi(ee.fmt.toBytes(t), e);
            },
            checkPath: ro,
            tree: ao,
            tweak: {
                getPubKey: function (t, e) {
                    return Ji(t, e);
                },
                getSecKey: function (t, e) {
                    return Ji(t, e, !0);
                },
                getTweak: Yi,
                tweakSecKey: Qi,
                tweakPubKey: Xi
            },
            util: {
                readCtrlBlock: no,
                readParityBit: so
            }
        };
    class uo {
        constructor(t) {
            this._buff = Lt.raw(Wt(t));
        }
        get raw() {
            return this._buff.raw;
        }
        get hex() {
            return this._buff.hex;
        }
        get asm() {
            return Xt(this._buff);
        }
        getHash(t, e) {
            switch (t) {
                case "p2w":
                    return this._buff.toHash("hash256").hex;
                case "p2sh":
                    return this._buff.toHash("hash160").hex;
                case "p2tr":
                    return ao.getLeaf(this._buff, e);
                default:
                    throw new Error("Unrecognized format: " + t);
            }
        }
        toJSON() {
            var _this$asm;
            return (_this$asm = this.asm) !== null && _this$asm !== void 0 ? _this$asm : [];
        }
    }
    const ho = 4294967295,
        fo = 512;
    class lo {
        constructor(t) {
            this.value = "string" == typeof t ? parseInt(t, 16) : t;
        }
        get isReplaceable() {
            return this.value < ho;
        }
        get isLocked() {
            return !(this.value !== ho || 0 != (-2147483648 & this.value));
        }
        get isTimelock() {
            return 0 != (4194304 & this.value);
        }
        get timestamp() {
            return this.isLocked ? this.isTimelock ? this.value * fo : this.value * fo * 600 : 0;
        }
        set timestamp(t) {
            this.value = Math.ceil(t / fo);
        }
        get blockheight() {
            return this.isLocked ? this.isTimelock ? Math.ceil(this.value * fo / 600) : this.value : 0;
        }
        set blockheight(t) {
            this.value = t;
        }
        get estDate() {
            return this.isTimelock ? new Date(Date.now() + this.value * fo * 1e3) : new Date(Date.now() + 600 * this.value * 1e3);
        }
        set estDate(t) {
            const e = t.getTime() - Date.now();
            this.value = e > 512e3 ? Math.ceil(e / 1e3 / fo) : 1;
        }
        toJSON() {
            return this.value;
        }
    }
    let po = class {
        constructor(t) {
            this.value = BigInt(t.value), this.scriptPubKey = new uo(t.scriptPubKey);
        }
        get type() {
            const {
                type: t
            } = Fe(this.scriptPubKey.raw);
            return t;
        }
    };
    class go {
        constructor(t, e) {
            this._data = t, this._meta = $e(t), this.format = e;
        }
        get length() {
            return this._data.length;
        }
        get annex() {
            const t = this._meta.annex;
            return null !== t ? Lt.raw(t).hex : void 0;
        }
        get cblock() {
            const t = this._meta.cblock;
            return null !== t ? Lt.raw(t).hex : void 0;
        }
        get script() {
            const t = this._meta.script;
            return null !== t ? ee.decode(t) : void 0;
        }
        get params() {
            return this._meta.params;
        }
        toJSON() {
            return this._data;
        }
    }
    let mo = class {
        constructor(t, e) {
            this._tx = t, this.idx = e;
        }
        get data() {
            return this._tx.vin[this.idx];
        }
        get txid() {
            return this.data.txid;
        }
        get vout() {
            return this.data.vout;
        }
        get prevout() {
            return void 0 !== this.data.prevout ? new po(this.data.prevout) : void 0;
        }
        get scriptSig() {
            return new uo(this.data.scriptSig);
        }
        get sequence() {
            return new lo(this.data.sequence);
        }
        get witness() {
            return new go(this.data.witness);
        }
        get type() {
            if (void 0 !== this.prevout) {
                const t = this.prevout.scriptPubKey.raw,
                    {
                        type: e
                    } = Fe(t);
                if ("p2sh" === e) {
                    const t = this.scriptSig.asm;
                    if ("OP_0" === t[0]) {
                        if (20 === t[1].length) return "p2w-p2pkh";
                        if (32 === t[1].length) return "p2w-p2sh";
                    }
                    return "p2sh";
                }
                return e;
            }
            return "raw";
        }
        sign(t, e) {
            if (this.type.startsWith("p2w")) return oo.segwit.sign(t, this._tx, this.idx, e);
            if (this.type.startsWith("p2tr")) return oo.taproot.sign(t, this._tx, this.idx, e);
            if (this.type.startsWith("p2pkh") || this.type.startsWith("p2sh")) throw new Error("This library does not support signing legacy transactions.");
            throw new Error("Unable to sign this input type:" + String(this.type));
        }
    };
    class yo {
        constructor(t = 0) {
            this.value = Lt.bytes(t).num;
        }
        get isTimelock() {
            return this.value > 5e8;
        }
        get timestamp() {
            return this.isTimelock ? this.value : 600 * this.value;
        }
        set timestamp(t) {
            this.value = t;
        }
        get blockheight() {
            return this.isTimelock ? Math.floor(this.value / 600) : this.value;
        }
        set blockheight(t) {
            this.value = t;
        }
        get estDate() {
            return this.isTimelock ? new Date(Date.now() + 1e3 * this.value) : new Date(Date.now() + 600 * this.value * 1e3);
        }
        set estDate(t) {
            this.value = Math.floor((t.getTime() - Date.now()) / 1e3);
        }
        toJSON() {
            return this.value;
        }
    }
    var bo, wo;
    !function (t) {
        t.assertEqual = t => t, t.assertIs = function (t) { }, t.assertNever = function (t) {
            throw new Error();
        }, t.arrayToEnum = t => {
            const e = {};
            for (const r of t) e[r] = r;
            return e;
        }, t.getValidEnumValues = e => {
            const r = t.objectKeys(e).filter(t => "number" != typeof e[e[t]]),
                n = {};
            for (const t of r) n[t] = e[t];
            return t.objectValues(n);
        }, t.objectValues = e => t.objectKeys(e).map(function (t) {
            return e[t];
        }), t.objectKeys = "function" == typeof Object.keys ? t => Object.keys(t) : t => {
            const e = [];
            for (const r in t) Object.prototype.hasOwnProperty.call(t, r) && e.push(r);
            return e;
        }, t.find = (t, e) => {
            for (const r of t) if (e(r)) return r;
        }, t.isInteger = "function" == typeof Number.isInteger ? t => Number.isInteger(t) : t => "number" == typeof t && isFinite(t) && Math.floor(t) === t, t.joinValues = function (t, e = " | ") {
            return t.map(t => "string" == typeof t ? `'${t}'` : t).join(e);
        }, t.jsonStringifyReplacer = (t, e) => "bigint" == typeof e ? e.toString() : e;
    }(bo || (bo = {})), function (t) {
        t.mergeShapes = (t, e) => ({
            ...t,
            ...e
        });
    }(wo || (wo = {}));
    const vo = bo.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]),
        xo = t => {
            switch (typeof t) {
                case "undefined":
                    return vo.undefined;
                case "string":
                    return vo.string;
                case "number":
                    return isNaN(t) ? vo.nan : vo.number;
                case "boolean":
                    return vo.boolean;
                case "function":
                    return vo.function;
                case "bigint":
                    return vo.bigint;
                case "symbol":
                    return vo.symbol;
                case "object":
                    return Array.isArray(t) ? vo.array : null === t ? vo.null : t.then && "function" == typeof t.then && t.catch && "function" == typeof t.catch ? vo.promise : "undefined" != typeof Map && t instanceof Map ? vo.map : "undefined" != typeof Set && t instanceof Set ? vo.set : "undefined" != typeof Date && t instanceof Date ? vo.date : vo.object;
                default:
                    return vo.unknown;
            }
        },
        _o = bo.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
    class Eo extends Error {
        constructor(t) {
            super(), this.issues = [], this.addIssue = t => {
                this.issues = [...this.issues, t];
            }, this.addIssues = (t = []) => {
                this.issues = [...this.issues, ...t];
            };
            const e = new.target.prototype;
            Object.setPrototypeOf ? Object.setPrototypeOf(this, e) : this.__proto__ = e, this.name = "ZodError", this.issues = t;
        }
        get errors() {
            return this.issues;
        }
        format(t) {
            const e = t || function (t) {
                return t.message;
            },
                r = {
                    _errors: []
                },
                n = t => {
                    for (const s of t.issues) if ("invalid_union" === s.code) s.unionErrors.map(n); else if ("invalid_return_type" === s.code) n(s.returnTypeError); else if ("invalid_arguments" === s.code) n(s.argumentsError); else if (0 === s.path.length) r._errors.push(e(s)); else {
                        let t = r,
                            n = 0;
                        for (; n < s.path.length;) {
                            const r = s.path[n];
                            n === s.path.length - 1 ? (t[r] = t[r] || {
                                _errors: []
                            }, t[r]._errors.push(e(s))) : t[r] = t[r] || {
                                _errors: []
                            }, t = t[r], n++;
                        }
                    }
                };
            return n(this), r;
        }
        toString() {
            return this.message;
        }
        get message() {
            return JSON.stringify(this.issues, bo.jsonStringifyReplacer, 2);
        }
        get isEmpty() {
            return 0 === this.issues.length;
        }
        flatten(t = t => t.message) {
            const e = {},
                r = [];
            for (const n of this.issues) n.path.length > 0 ? (e[n.path[0]] = e[n.path[0]] || [], e[n.path[0]].push(t(n))) : r.push(t(n));
            return {
                formErrors: r,
                fieldErrors: e
            };
        }
        get formErrors() {
            return this.flatten();
        }
    }
    Eo.create = t => new Eo(t);
    const So = (t, e) => {
        let r;
        switch (t.code) {
            case _o.invalid_type:
                r = t.received === vo.undefined ? "Required" : `Expected ${t.expected}, received ${t.received}`;
                break;
            case _o.invalid_literal:
                r = `Invalid literal value, expected ${JSON.stringify(t.expected, bo.jsonStringifyReplacer)}`;
                break;
            case _o.unrecognized_keys:
                r = `Unrecognized key(s) in object: ${bo.joinValues(t.keys, ", ")}`;
                break;
            case _o.invalid_union:
                r = "Invalid input";
                break;
            case _o.invalid_union_discriminator:
                r = `Invalid discriminator value. Expected ${bo.joinValues(t.options)}`;
                break;
            case _o.invalid_enum_value:
                r = `Invalid enum value. Expected ${bo.joinValues(t.options)}, received '${t.received}'`;
                break;
            case _o.invalid_arguments:
                r = "Invalid function arguments";
                break;
            case _o.invalid_return_type:
                r = "Invalid function return type";
                break;
            case _o.invalid_date:
                r = "Invalid date";
                break;
            case _o.invalid_string:
                "object" == typeof t.validation ? "includes" in t.validation ? (r = `Invalid input: must include "${t.validation.includes}"`, "number" == typeof t.validation.position && (r = `${r} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? r = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? r = `Invalid input: must end with "${t.validation.endsWith}"` : bo.assertNever(t.validation) : r = "regex" !== t.validation ? `Invalid ${t.validation}` : "Invalid";
                break;
            case _o.too_small:
                r = "array" === t.type ? `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : "string" === t.type ? `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : "number" === t.type ? `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : "date" === t.type ? `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : "Invalid input";
                break;
            case _o.too_big:
                r = "array" === t.type ? `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : "string" === t.type ? `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : "number" === t.type ? `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : "bigint" === t.type ? `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : "date" === t.type ? `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : "Invalid input";
                break;
            case _o.custom:
                r = "Invalid input";
                break;
            case _o.invalid_intersection_types:
                r = "Intersection results could not be merged";
                break;
            case _o.not_multiple_of:
                r = `Number must be a multiple of ${t.multipleOf}`;
                break;
            case _o.not_finite:
                r = "Number must be finite";
                break;
            default:
                r = e.defaultError, bo.assertNever(t);
        }
        return {
            message: r
        };
    };
    let Ao = So;
    function ko() {
        return Ao;
    }
    const Oo = t => {
        const {
            data: e,
            path: r,
            errorMaps: n,
            issueData: s
        } = t,
            i = [...r, ...(s.path || [])],
            o = {
                ...s,
                path: i
            };
        let a = "";
        const c = n.filter(t => !!t).slice().reverse();
        for (const t of c) a = t(o, {
            data: e,
            defaultError: a
        }).message;
        return {
            ...s,
            path: i,
            message: s.message || a
        };
    };
    function Bo(t, e) {
        const r = Oo({
            issueData: e,
            data: t.data,
            path: t.path,
            errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, ko(), So].filter(t => !!t)
        });
        t.common.issues.push(r);
    }
    class Io {
        constructor() {
            this.value = "valid";
        }
        dirty() {
            "valid" === this.value && (this.value = "dirty");
        }
        abort() {
            "aborted" !== this.value && (this.value = "aborted");
        }
        static mergeArray(t, e) {
            const r = [];
            for (const n of e) {
                if ("aborted" === n.status) return Po;
                "dirty" === n.status && t.dirty(), r.push(n.value);
            }
            return {
                status: t.value,
                value: r
            };
        }
        static async mergeObjectAsync(t, e) {
            const r = [];
            for (const t of e) r.push({
                key: await t.key,
                value: await t.value
            });
            return Io.mergeObjectSync(t, r);
        }
        static mergeObjectSync(t, e) {
            const r = {};
            for (const n of e) {
                const {
                    key: e,
                    value: s
                } = n;
                if ("aborted" === e.status) return Po;
                if ("aborted" === s.status) return Po;
                "dirty" === e.status && t.dirty(), "dirty" === s.status && t.dirty(), (void 0 !== s.value || n.alwaysSet) && (r[e.value] = s.value);
            }
            return {
                status: t.value,
                value: r
            };
        }
    }
    const Po = Object.freeze({
        status: "aborted"
    }),
        To = t => ({
            status: "dirty",
            value: t
        }),
        Uo = t => ({
            status: "valid",
            value: t
        }),
        Co = t => "aborted" === t.status,
        Lo = t => "dirty" === t.status,
        No = t => "valid" === t.status,
        Ho = t => "undefined" != typeof Promise && t instanceof Promise;
    var Zo;
    !function (t) {
        t.errToObj = t => "string" == typeof t ? {
            message: t
        } : t || {}, t.toString = t => "string" == typeof t ? t : null == t ? void 0 : t.message;
    }(Zo || (Zo = {}));
    class Ro {
        constructor(t, e, r, n) {
            this._cachedPath = [], this.parent = t, this.data = e, this._path = r, this._key = n;
        }
        get path() {
            return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
        }
    }
    const jo = (t, e) => {
        if (No(e)) return {
            success: !0,
            data: e.value
        };
        if (!t.common.issues.length) throw new Error("Validation failed but no issues detected.");
        return {
            success: !1,
            get error() {
                if (this._error) return this._error;
                const e = new Eo(t.common.issues);
                return this._error = e, this._error;
            }
        };
    };
    function Do(t) {
        if (!t) return {};
        const {
            errorMap: e,
            invalid_type_error: r,
            required_error: n,
            description: s
        } = t;
        if (e && (r || n)) throw new Error('Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.');
        if (e) return {
            errorMap: e,
            description: s
        };
        return {
            errorMap: (t, e) => "invalid_type" !== t.code ? {
                message: e.defaultError
            } : void 0 === e.data ? {
                message: null != n ? n : e.defaultError
            } : {
                message: null != r ? r : e.defaultError
            },
            description: s
        };
    }
    class zo {
        constructor(t) {
            this.spa = this.safeParseAsync, this._def = t, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
        }
        get description() {
            return this._def.description;
        }
        _getType(t) {
            return xo(t.data);
        }
        _getOrReturnCtx(t, e) {
            return e || {
                common: t.parent.common,
                data: t.data,
                parsedType: xo(t.data),
                schemaErrorMap: this._def.errorMap,
                path: t.path,
                parent: t.parent
            };
        }
        _processInputParams(t) {
            return {
                status: new Io(),
                ctx: {
                    common: t.parent.common,
                    data: t.data,
                    parsedType: xo(t.data),
                    schemaErrorMap: this._def.errorMap,
                    path: t.path,
                    parent: t.parent
                }
            };
        }
        _parseSync(t) {
            const e = this._parse(t);
            if (Ho(e)) throw new Error("Synchronous parse encountered promise.");
            return e;
        }
        _parseAsync(t) {
            const e = this._parse(t);
            return Promise.resolve(e);
        }
        parse(t, e) {
            const r = this.safeParse(t, e);
            if (r.success) return r.data;
            throw r.error;
        }
        safeParse(t, e) {
            var r;
            const n = {
                common: {
                    issues: [],
                    async: null !== (r = null == e ? void 0 : e.async) && void 0 !== r && r,
                    contextualErrorMap: null == e ? void 0 : e.errorMap
                },
                path: (null == e ? void 0 : e.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: t,
                parsedType: xo(t)
            },
                s = this._parseSync({
                    data: t,
                    path: n.path,
                    parent: n
                });
            return jo(n, s);
        }
        async parseAsync(t, e) {
            const r = await this.safeParseAsync(t, e);
            if (r.success) return r.data;
            throw r.error;
        }
        async safeParseAsync(t, e) {
            const r = {
                common: {
                    issues: [],
                    contextualErrorMap: null == e ? void 0 : e.errorMap,
                    async: !0
                },
                path: (null == e ? void 0 : e.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: t,
                parsedType: xo(t)
            },
                n = this._parse({
                    data: t,
                    path: r.path,
                    parent: r
                }),
                s = await (Ho(n) ? n : Promise.resolve(n));
            return jo(r, s);
        }
        refine(t, e) {
            const r = t => "string" == typeof e || void 0 === e ? {
                message: e
            } : "function" == typeof e ? e(t) : e;
            return this._refinement((e, n) => {
                const s = t(e),
                    i = () => n.addIssue({
                        code: _o.custom,
                        ...r(e)
                    });
                return "undefined" != typeof Promise && s instanceof Promise ? s.then(t => !!t || (i(), !1)) : !!s || (i(), !1);
            });
        }
        refinement(t, e) {
            return this._refinement((r, n) => !!t(r) || (n.addIssue("function" == typeof e ? e(r, n) : e), !1));
        }
        _refinement(t) {
            return new Ba({
                schema: this,
                typeName: ja.ZodEffects,
                effect: {
                    type: "refinement",
                    refinement: t
                }
            });
        }
        superRefine(t) {
            return this._refinement(t);
        }
        optional() {
            return Ia.create(this, this._def);
        }
        nullable() {
            return Pa.create(this, this._def);
        }
        nullish() {
            return this.nullable().optional();
        }
        array() {
            return ua.create(this, this._def);
        }
        promise() {
            return Oa.create(this, this._def);
        }
        or(t) {
            return fa.create([this, t], this._def);
        }
        and(t) {
            return ma.create(this, t, this._def);
        }
        transform(t) {
            return new Ba({
                ...Do(this._def),
                schema: this,
                typeName: ja.ZodEffects,
                effect: {
                    type: "transform",
                    transform: t
                }
            });
        }
        default(t) {
            const e = "function" == typeof t ? t : () => t;
            return new Ta({
                ...Do(this._def),
                innerType: this,
                defaultValue: e,
                typeName: ja.ZodDefault
            });
        }
        brand() {
            return new Na({
                typeName: ja.ZodBranded,
                type: this,
                ...Do(this._def)
            });
        }
        catch(t) {
            const e = "function" == typeof t ? t : () => t;
            return new Ua({
                ...Do(this._def),
                innerType: this,
                catchValue: e,
                typeName: ja.ZodCatch
            });
        }
        describe(t) {
            return new (0, this.constructor)({
                ...this._def,
                description: t
            });
        }
        pipe(t) {
            return Ha.create(this, t);
        }
        isOptional() {
            return this.safeParse(void 0).success;
        }
        isNullable() {
            return this.safeParse(null).success;
        }
    }
    const $o = /^c[^\s-]{8,}$/i,
        Fo = /^[a-z][a-z0-9]*$/,
        qo = /[0-9A-HJKMNP-TV-Z]{26}/,
        Ko = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i,
        Vo = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/,
        Mo = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u,
        Go = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/,
        Wo = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
    class Yo extends zo {
        constructor() {
            super(...arguments), this._regex = (t, e, r) => this.refinement(e => t.test(e), {
                validation: e,
                code: _o.invalid_string,
                ...Zo.errToObj(r)
            }), this.nonempty = t => this.min(1, Zo.errToObj(t)), this.trim = () => new Yo({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: "trim"
                }]
            }), this.toLowerCase = () => new Yo({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: "toLowerCase"
                }]
            }), this.toUpperCase = () => new Yo({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: "toUpperCase"
                }]
            });
        }
        _parse(t) {
            this._def.coerce && (t.data = String(t.data));
            if (this._getType(t) !== vo.string) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.string,
                    received: e.parsedType
                }), Po;
            }
            const e = new Io();
            let r;
            for (const o of this._def.checks) if ("min" === o.kind) t.data.length < o.value && (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.too_small,
                minimum: o.value,
                type: "string",
                inclusive: !0,
                exact: !1,
                message: o.message
            }), e.dirty()); else if ("max" === o.kind) t.data.length > o.value && (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.too_big,
                maximum: o.value,
                type: "string",
                inclusive: !0,
                exact: !1,
                message: o.message
            }), e.dirty()); else if ("length" === o.kind) {
                const n = t.data.length > o.value,
                    s = t.data.length < o.value;
                (n || s) && (r = this._getOrReturnCtx(t, r), n ? Bo(r, {
                    code: _o.too_big,
                    maximum: o.value,
                    type: "string",
                    inclusive: !0,
                    exact: !0,
                    message: o.message
                }) : s && Bo(r, {
                    code: _o.too_small,
                    minimum: o.value,
                    type: "string",
                    inclusive: !0,
                    exact: !0,
                    message: o.message
                }), e.dirty());
            } else if ("email" === o.kind) Vo.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "email",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty()); else if ("emoji" === o.kind) Mo.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "emoji",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty()); else if ("uuid" === o.kind) Ko.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "uuid",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty()); else if ("cuid" === o.kind) $o.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "cuid",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty()); else if ("cuid2" === o.kind) Fo.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "cuid2",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty()); else if ("ulid" === o.kind) qo.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "ulid",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty()); else if ("url" === o.kind) try {
                new URL(t.data);
            } catch (n) {
                r = this._getOrReturnCtx(t, r), Bo(r, {
                    validation: "url",
                    code: _o.invalid_string,
                    message: o.message
                }), e.dirty();
            } else if ("regex" === o.kind) {
                o.regex.lastIndex = 0;
                o.regex.test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                    validation: "regex",
                    code: _o.invalid_string,
                    message: o.message
                }), e.dirty());
            } else if ("trim" === o.kind) t.data = t.data.trim(); else if ("includes" === o.kind) t.data.includes(o.value, o.position) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.invalid_string,
                validation: {
                    includes: o.value,
                    position: o.position
                },
                message: o.message
            }), e.dirty()); else if ("toLowerCase" === o.kind) t.data = t.data.toLowerCase(); else if ("toUpperCase" === o.kind) t.data = t.data.toUpperCase(); else if ("startsWith" === o.kind) t.data.startsWith(o.value) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.invalid_string,
                validation: {
                    startsWith: o.value
                },
                message: o.message
            }), e.dirty()); else if ("endsWith" === o.kind) t.data.endsWith(o.value) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.invalid_string,
                validation: {
                    endsWith: o.value
                },
                message: o.message
            }), e.dirty()); else if ("datetime" === o.kind) {
                ((i = o).precision ? i.offset ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${i.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`) : new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${i.precision}}Z$`) : 0 === i.precision ? i.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$") : i.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$")).test(t.data) || (r = this._getOrReturnCtx(t, r), Bo(r, {
                    code: _o.invalid_string,
                    validation: "datetime",
                    message: o.message
                }), e.dirty());
            } else "ip" === o.kind ? (n = t.data, ("v4" !== (s = o.version) && s || !Go.test(n)) && ("v6" !== s && s || !Wo.test(n)) && (r = this._getOrReturnCtx(t, r), Bo(r, {
                validation: "ip",
                code: _o.invalid_string,
                message: o.message
            }), e.dirty())) : bo.assertNever(o);
            var n, s, i;
            return {
                status: e.value,
                value: t.data
            };
        }
        _addCheck(t) {
            return new Yo({
                ...this._def,
                checks: [...this._def.checks, t]
            });
        }
        email(t) {
            return this._addCheck({
                kind: "email",
                ...Zo.errToObj(t)
            });
        }
        url(t) {
            return this._addCheck({
                kind: "url",
                ...Zo.errToObj(t)
            });
        }
        emoji(t) {
            return this._addCheck({
                kind: "emoji",
                ...Zo.errToObj(t)
            });
        }
        uuid(t) {
            return this._addCheck({
                kind: "uuid",
                ...Zo.errToObj(t)
            });
        }
        cuid(t) {
            return this._addCheck({
                kind: "cuid",
                ...Zo.errToObj(t)
            });
        }
        cuid2(t) {
            return this._addCheck({
                kind: "cuid2",
                ...Zo.errToObj(t)
            });
        }
        ulid(t) {
            return this._addCheck({
                kind: "ulid",
                ...Zo.errToObj(t)
            });
        }
        ip(t) {
            return this._addCheck({
                kind: "ip",
                ...Zo.errToObj(t)
            });
        }
        datetime(t) {
            var e;
            return "string" == typeof t ? this._addCheck({
                kind: "datetime",
                precision: null,
                offset: !1,
                message: t
            }) : this._addCheck({
                kind: "datetime",
                precision: void 0 === (null == t ? void 0 : t.precision) ? null : null == t ? void 0 : t.precision,
                offset: null !== (e = null == t ? void 0 : t.offset) && void 0 !== e && e,
                ...Zo.errToObj(null == t ? void 0 : t.message)
            });
        }
        regex(t, e) {
            return this._addCheck({
                kind: "regex",
                regex: t,
                ...Zo.errToObj(e)
            });
        }
        includes(t, e) {
            return this._addCheck({
                kind: "includes",
                value: t,
                position: null == e ? void 0 : e.position,
                ...Zo.errToObj(null == e ? void 0 : e.message)
            });
        }
        startsWith(t, e) {
            return this._addCheck({
                kind: "startsWith",
                value: t,
                ...Zo.errToObj(e)
            });
        }
        endsWith(t, e) {
            return this._addCheck({
                kind: "endsWith",
                value: t,
                ...Zo.errToObj(e)
            });
        }
        min(t, e) {
            return this._addCheck({
                kind: "min",
                value: t,
                ...Zo.errToObj(e)
            });
        }
        max(t, e) {
            return this._addCheck({
                kind: "max",
                value: t,
                ...Zo.errToObj(e)
            });
        }
        length(t, e) {
            return this._addCheck({
                kind: "length",
                value: t,
                ...Zo.errToObj(e)
            });
        }
        get isDatetime() {
            return !!this._def.checks.find(t => "datetime" === t.kind);
        }
        get isEmail() {
            return !!this._def.checks.find(t => "email" === t.kind);
        }
        get isURL() {
            return !!this._def.checks.find(t => "url" === t.kind);
        }
        get isEmoji() {
            return !!this._def.checks.find(t => "emoji" === t.kind);
        }
        get isUUID() {
            return !!this._def.checks.find(t => "uuid" === t.kind);
        }
        get isCUID() {
            return !!this._def.checks.find(t => "cuid" === t.kind);
        }
        get isCUID2() {
            return !!this._def.checks.find(t => "cuid2" === t.kind);
        }
        get isULID() {
            return !!this._def.checks.find(t => "ulid" === t.kind);
        }
        get isIP() {
            return !!this._def.checks.find(t => "ip" === t.kind);
        }
        get minLength() {
            let t = null;
            for (const e of this._def.checks) "min" === e.kind && (null === t || e.value > t) && (t = e.value);
            return t;
        }
        get maxLength() {
            let t = null;
            for (const e of this._def.checks) "max" === e.kind && (null === t || e.value < t) && (t = e.value);
            return t;
        }
    }
    function Jo(t, e) {
        const r = (t.toString().split(".")[1] || "").length,
            n = (e.toString().split(".")[1] || "").length,
            s = r > n ? r : n;
        return parseInt(t.toFixed(s).replace(".", "")) % parseInt(e.toFixed(s).replace(".", "")) / Math.pow(10, s);
    }
    Yo.create = t => {
        var e;
        return new Yo({
            checks: [],
            typeName: ja.ZodString,
            coerce: null !== (e = null == t ? void 0 : t.coerce) && void 0 !== e && e,
            ...Do(t)
        });
    };
    class Qo extends zo {
        constructor() {
            super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
        }
        _parse(t) {
            this._def.coerce && (t.data = Number(t.data));
            if (this._getType(t) !== vo.number) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.number,
                    received: e.parsedType
                }), Po;
            }
            let e;
            const r = new Io();
            for (const n of this._def.checks) if ("int" === n.kind) bo.isInteger(t.data) || (e = this._getOrReturnCtx(t, e), Bo(e, {
                code: _o.invalid_type,
                expected: "integer",
                received: "float",
                message: n.message
            }), r.dirty()); else if ("min" === n.kind) {
                (n.inclusive ? t.data < n.value : t.data <= n.value) && (e = this._getOrReturnCtx(t, e), Bo(e, {
                    code: _o.too_small,
                    minimum: n.value,
                    type: "number",
                    inclusive: n.inclusive,
                    exact: !1,
                    message: n.message
                }), r.dirty());
            } else if ("max" === n.kind) {
                (n.inclusive ? t.data > n.value : t.data >= n.value) && (e = this._getOrReturnCtx(t, e), Bo(e, {
                    code: _o.too_big,
                    maximum: n.value,
                    type: "number",
                    inclusive: n.inclusive,
                    exact: !1,
                    message: n.message
                }), r.dirty());
            } else "multipleOf" === n.kind ? 0 !== Jo(t.data, n.value) && (e = this._getOrReturnCtx(t, e), Bo(e, {
                code: _o.not_multiple_of,
                multipleOf: n.value,
                message: n.message
            }), r.dirty()) : "finite" === n.kind ? Number.isFinite(t.data) || (e = this._getOrReturnCtx(t, e), Bo(e, {
                code: _o.not_finite,
                message: n.message
            }), r.dirty()) : bo.assertNever(n);
            return {
                status: r.value,
                value: t.data
            };
        }
        gte(t, e) {
            return this.setLimit("min", t, !0, Zo.toString(e));
        }
        gt(t, e) {
            return this.setLimit("min", t, !1, Zo.toString(e));
        }
        lte(t, e) {
            return this.setLimit("max", t, !0, Zo.toString(e));
        }
        lt(t, e) {
            return this.setLimit("max", t, !1, Zo.toString(e));
        }
        setLimit(t, e, r, n) {
            return new Qo({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: t,
                    value: e,
                    inclusive: r,
                    message: Zo.toString(n)
                }]
            });
        }
        _addCheck(t) {
            return new Qo({
                ...this._def,
                checks: [...this._def.checks, t]
            });
        }
        int(t) {
            return this._addCheck({
                kind: "int",
                message: Zo.toString(t)
            });
        }
        positive(t) {
            return this._addCheck({
                kind: "min",
                value: 0,
                inclusive: !1,
                message: Zo.toString(t)
            });
        }
        negative(t) {
            return this._addCheck({
                kind: "max",
                value: 0,
                inclusive: !1,
                message: Zo.toString(t)
            });
        }
        nonpositive(t) {
            return this._addCheck({
                kind: "max",
                value: 0,
                inclusive: !0,
                message: Zo.toString(t)
            });
        }
        nonnegative(t) {
            return this._addCheck({
                kind: "min",
                value: 0,
                inclusive: !0,
                message: Zo.toString(t)
            });
        }
        multipleOf(t, e) {
            return this._addCheck({
                kind: "multipleOf",
                value: t,
                message: Zo.toString(e)
            });
        }
        finite(t) {
            return this._addCheck({
                kind: "finite",
                message: Zo.toString(t)
            });
        }
        safe(t) {
            return this._addCheck({
                kind: "min",
                inclusive: !0,
                value: Number.MIN_SAFE_INTEGER,
                message: Zo.toString(t)
            })._addCheck({
                kind: "max",
                inclusive: !0,
                value: Number.MAX_SAFE_INTEGER,
                message: Zo.toString(t)
            });
        }
        get minValue() {
            let t = null;
            for (const e of this._def.checks) "min" === e.kind && (null === t || e.value > t) && (t = e.value);
            return t;
        }
        get maxValue() {
            let t = null;
            for (const e of this._def.checks) "max" === e.kind && (null === t || e.value < t) && (t = e.value);
            return t;
        }
        get isInt() {
            return !!this._def.checks.find(t => "int" === t.kind || "multipleOf" === t.kind && bo.isInteger(t.value));
        }
        get isFinite() {
            let t = null,
                e = null;
            for (const r of this._def.checks) {
                if ("finite" === r.kind || "int" === r.kind || "multipleOf" === r.kind) return !0;
                "min" === r.kind ? (null === e || r.value > e) && (e = r.value) : "max" === r.kind && (null === t || r.value < t) && (t = r.value);
            }
            return Number.isFinite(e) && Number.isFinite(t);
        }
    }
    Qo.create = t => new Qo({
        checks: [],
        typeName: ja.ZodNumber,
        coerce: (null == t ? void 0 : t.coerce) || !1,
        ...Do(t)
    });
    class Xo extends zo {
        constructor() {
            super(...arguments), this.min = this.gte, this.max = this.lte;
        }
        _parse(t) {
            this._def.coerce && (t.data = BigInt(t.data));
            if (this._getType(t) !== vo.bigint) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.bigint,
                    received: e.parsedType
                }), Po;
            }
            let e;
            const r = new Io();
            for (const n of this._def.checks) if ("min" === n.kind) {
                (n.inclusive ? t.data < n.value : t.data <= n.value) && (e = this._getOrReturnCtx(t, e), Bo(e, {
                    code: _o.too_small,
                    type: "bigint",
                    minimum: n.value,
                    inclusive: n.inclusive,
                    message: n.message
                }), r.dirty());
            } else if ("max" === n.kind) {
                (n.inclusive ? t.data > n.value : t.data >= n.value) && (e = this._getOrReturnCtx(t, e), Bo(e, {
                    code: _o.too_big,
                    type: "bigint",
                    maximum: n.value,
                    inclusive: n.inclusive,
                    message: n.message
                }), r.dirty());
            } else "multipleOf" === n.kind ? t.data % n.value !== BigInt(0) && (e = this._getOrReturnCtx(t, e), Bo(e, {
                code: _o.not_multiple_of,
                multipleOf: n.value,
                message: n.message
            }), r.dirty()) : bo.assertNever(n);
            return {
                status: r.value,
                value: t.data
            };
        }
        gte(t, e) {
            return this.setLimit("min", t, !0, Zo.toString(e));
        }
        gt(t, e) {
            return this.setLimit("min", t, !1, Zo.toString(e));
        }
        lte(t, e) {
            return this.setLimit("max", t, !0, Zo.toString(e));
        }
        lt(t, e) {
            return this.setLimit("max", t, !1, Zo.toString(e));
        }
        setLimit(t, e, r, n) {
            return new Xo({
                ...this._def,
                checks: [...this._def.checks, {
                    kind: t,
                    value: e,
                    inclusive: r,
                    message: Zo.toString(n)
                }]
            });
        }
        _addCheck(t) {
            return new Xo({
                ...this._def,
                checks: [...this._def.checks, t]
            });
        }
        positive(t) {
            return this._addCheck({
                kind: "min",
                value: BigInt(0),
                inclusive: !1,
                message: Zo.toString(t)
            });
        }
        negative(t) {
            return this._addCheck({
                kind: "max",
                value: BigInt(0),
                inclusive: !1,
                message: Zo.toString(t)
            });
        }
        nonpositive(t) {
            return this._addCheck({
                kind: "max",
                value: BigInt(0),
                inclusive: !0,
                message: Zo.toString(t)
            });
        }
        nonnegative(t) {
            return this._addCheck({
                kind: "min",
                value: BigInt(0),
                inclusive: !0,
                message: Zo.toString(t)
            });
        }
        multipleOf(t, e) {
            return this._addCheck({
                kind: "multipleOf",
                value: t,
                message: Zo.toString(e)
            });
        }
        get minValue() {
            let t = null;
            for (const e of this._def.checks) "min" === e.kind && (null === t || e.value > t) && (t = e.value);
            return t;
        }
        get maxValue() {
            let t = null;
            for (const e of this._def.checks) "max" === e.kind && (null === t || e.value < t) && (t = e.value);
            return t;
        }
    }
    Xo.create = t => {
        var e;
        return new Xo({
            checks: [],
            typeName: ja.ZodBigInt,
            coerce: null !== (e = null == t ? void 0 : t.coerce) && void 0 !== e && e,
            ...Do(t)
        });
    };
    class ta extends zo {
        _parse(t) {
            this._def.coerce && (t.data = Boolean(t.data));
            if (this._getType(t) !== vo.boolean) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.boolean,
                    received: e.parsedType
                }), Po;
            }
            return Uo(t.data);
        }
    }
    ta.create = t => new ta({
        typeName: ja.ZodBoolean,
        coerce: (null == t ? void 0 : t.coerce) || !1,
        ...Do(t)
    });
    class ea extends zo {
        _parse(t) {
            this._def.coerce && (t.data = new Date(t.data));
            if (this._getType(t) !== vo.date) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.date,
                    received: e.parsedType
                }), Po;
            }
            if (isNaN(t.data.getTime())) {
                return Bo(this._getOrReturnCtx(t), {
                    code: _o.invalid_date
                }), Po;
            }
            const e = new Io();
            let r;
            for (const n of this._def.checks) "min" === n.kind ? t.data.getTime() < n.value && (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.too_small,
                message: n.message,
                inclusive: !0,
                exact: !1,
                minimum: n.value,
                type: "date"
            }), e.dirty()) : "max" === n.kind ? t.data.getTime() > n.value && (r = this._getOrReturnCtx(t, r), Bo(r, {
                code: _o.too_big,
                message: n.message,
                inclusive: !0,
                exact: !1,
                maximum: n.value,
                type: "date"
            }), e.dirty()) : bo.assertNever(n);
            return {
                status: e.value,
                value: new Date(t.data.getTime())
            };
        }
        _addCheck(t) {
            return new ea({
                ...this._def,
                checks: [...this._def.checks, t]
            });
        }
        min(t, e) {
            return this._addCheck({
                kind: "min",
                value: t.getTime(),
                message: Zo.toString(e)
            });
        }
        max(t, e) {
            return this._addCheck({
                kind: "max",
                value: t.getTime(),
                message: Zo.toString(e)
            });
        }
        get minDate() {
            let t = null;
            for (const e of this._def.checks) "min" === e.kind && (null === t || e.value > t) && (t = e.value);
            return null != t ? new Date(t) : null;
        }
        get maxDate() {
            let t = null;
            for (const e of this._def.checks) "max" === e.kind && (null === t || e.value < t) && (t = e.value);
            return null != t ? new Date(t) : null;
        }
    }
    ea.create = t => new ea({
        checks: [],
        coerce: (null == t ? void 0 : t.coerce) || !1,
        typeName: ja.ZodDate,
        ...Do(t)
    });
    class ra extends zo {
        _parse(t) {
            if (this._getType(t) !== vo.symbol) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.symbol,
                    received: e.parsedType
                }), Po;
            }
            return Uo(t.data);
        }
    }
    ra.create = t => new ra({
        typeName: ja.ZodSymbol,
        ...Do(t)
    });
    class na extends zo {
        _parse(t) {
            if (this._getType(t) !== vo.undefined) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.undefined,
                    received: e.parsedType
                }), Po;
            }
            return Uo(t.data);
        }
    }
    na.create = t => new na({
        typeName: ja.ZodUndefined,
        ...Do(t)
    });
    class sa extends zo {
        _parse(t) {
            if (this._getType(t) !== vo.null) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.null,
                    received: e.parsedType
                }), Po;
            }
            return Uo(t.data);
        }
    }
    sa.create = t => new sa({
        typeName: ja.ZodNull,
        ...Do(t)
    });
    class ia extends zo {
        constructor() {
            super(...arguments), this._any = !0;
        }
        _parse(t) {
            return Uo(t.data);
        }
    }
    ia.create = t => new ia({
        typeName: ja.ZodAny,
        ...Do(t)
    });
    class oa extends zo {
        constructor() {
            super(...arguments), this._unknown = !0;
        }
        _parse(t) {
            return Uo(t.data);
        }
    }
    oa.create = t => new oa({
        typeName: ja.ZodUnknown,
        ...Do(t)
    });
    class aa extends zo {
        _parse(t) {
            const e = this._getOrReturnCtx(t);
            return Bo(e, {
                code: _o.invalid_type,
                expected: vo.never,
                received: e.parsedType
            }), Po;
        }
    }
    aa.create = t => new aa({
        typeName: ja.ZodNever,
        ...Do(t)
    });
    class ca extends zo {
        _parse(t) {
            if (this._getType(t) !== vo.undefined) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.void,
                    received: e.parsedType
                }), Po;
            }
            return Uo(t.data);
        }
    }
    ca.create = t => new ca({
        typeName: ja.ZodVoid,
        ...Do(t)
    });
    class ua extends zo {
        _parse(t) {
            const {
                ctx: e,
                status: r
            } = this._processInputParams(t),
                n = this._def;
            if (e.parsedType !== vo.array) return Bo(e, {
                code: _o.invalid_type,
                expected: vo.array,
                received: e.parsedType
            }), Po;
            if (null !== n.exactLength) {
                const t = e.data.length > n.exactLength.value,
                    s = e.data.length < n.exactLength.value;
                (t || s) && (Bo(e, {
                    code: t ? _o.too_big : _o.too_small,
                    minimum: s ? n.exactLength.value : void 0,
                    maximum: t ? n.exactLength.value : void 0,
                    type: "array",
                    inclusive: !0,
                    exact: !0,
                    message: n.exactLength.message
                }), r.dirty());
            }
            if (null !== n.minLength && e.data.length < n.minLength.value && (Bo(e, {
                code: _o.too_small,
                minimum: n.minLength.value,
                type: "array",
                inclusive: !0,
                exact: !1,
                message: n.minLength.message
            }), r.dirty()), null !== n.maxLength && e.data.length > n.maxLength.value && (Bo(e, {
                code: _o.too_big,
                maximum: n.maxLength.value,
                type: "array",
                inclusive: !0,
                exact: !1,
                message: n.maxLength.message
            }), r.dirty()), e.common.async) return Promise.all([...e.data].map((t, r) => n.type._parseAsync(new Ro(e, t, e.path, r)))).then(t => Io.mergeArray(r, t));
            const s = [...e.data].map((t, r) => n.type._parseSync(new Ro(e, t, e.path, r)));
            return Io.mergeArray(r, s);
        }
        get element() {
            return this._def.type;
        }
        min(t, e) {
            return new ua({
                ...this._def,
                minLength: {
                    value: t,
                    message: Zo.toString(e)
                }
            });
        }
        max(t, e) {
            return new ua({
                ...this._def,
                maxLength: {
                    value: t,
                    message: Zo.toString(e)
                }
            });
        }
        length(t, e) {
            return new ua({
                ...this._def,
                exactLength: {
                    value: t,
                    message: Zo.toString(e)
                }
            });
        }
        nonempty(t) {
            return this.min(1, t);
        }
    }
    function ha(t) {
        if (t instanceof da) {
            const e = {};
            for (const r in t.shape) {
                const n = t.shape[r];
                e[r] = Ia.create(ha(n));
            }
            return new da({
                ...t._def,
                shape: () => e
            });
        }
        return t instanceof ua ? new ua({
            ...t._def,
            type: ha(t.element)
        }) : t instanceof Ia ? Ia.create(ha(t.unwrap())) : t instanceof Pa ? Pa.create(ha(t.unwrap())) : t instanceof ya ? ya.create(t.items.map(t => ha(t))) : t;
    }
    ua.create = (t, e) => new ua({
        type: t,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ja.ZodArray,
        ...Do(e)
    });
    class da extends zo {
        constructor() {
            super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
        }
        _getCached() {
            if (null !== this._cached) return this._cached;
            const t = this._def.shape(),
                e = bo.objectKeys(t);
            return this._cached = {
                shape: t,
                keys: e
            };
        }
        _parse(t) {
            if (this._getType(t) !== vo.object) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.object,
                    received: e.parsedType
                }), Po;
            }
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t),
                {
                    shape: n,
                    keys: s
                } = this._getCached(),
                i = [];
            if (!(this._def.catchall instanceof aa && "strip" === this._def.unknownKeys)) for (const t in r.data) s.includes(t) || i.push(t);
            const o = [];
            for (const t of s) {
                const e = n[t],
                    s = r.data[t];
                o.push({
                    key: {
                        status: "valid",
                        value: t
                    },
                    value: e._parse(new Ro(r, s, r.path, t)),
                    alwaysSet: t in r.data
                });
            }
            if (this._def.catchall instanceof aa) {
                const t = this._def.unknownKeys;
                if ("passthrough" === t) for (const t of i) o.push({
                    key: {
                        status: "valid",
                        value: t
                    },
                    value: {
                        status: "valid",
                        value: r.data[t]
                    }
                }); else if ("strict" === t) i.length > 0 && (Bo(r, {
                    code: _o.unrecognized_keys,
                    keys: i
                }), e.dirty()); else if ("strip" !== t) throw new Error("Internal ZodObject error: invalid unknownKeys value.");
            } else {
                const t = this._def.catchall;
                for (const e of i) {
                    const n = r.data[e];
                    o.push({
                        key: {
                            status: "valid",
                            value: e
                        },
                        value: t._parse(new Ro(r, n, r.path, e)),
                        alwaysSet: e in r.data
                    });
                }
            }
            return r.common.async ? Promise.resolve().then(async () => {
                const t = [];
                for (const e of o) {
                    const r = await e.key;
                    t.push({
                        key: r,
                        value: await e.value,
                        alwaysSet: e.alwaysSet
                    });
                }
                return t;
            }).then(t => Io.mergeObjectSync(e, t)) : Io.mergeObjectSync(e, o);
        }
        get shape() {
            return this._def.shape();
        }
        strict(t) {
            return new da({
                ...this._def,
                unknownKeys: "strict",
                ...(void 0 !== t ? {
                    errorMap: (e, r) => {
                        var n, s, i, o;
                        const a = null !== (i = null === (s = (n = this._def).errorMap) || void 0 === s ? void 0 : s.call(n, e, r).message) && void 0 !== i ? i : r.defaultError;
                        return "unrecognized_keys" === e.code ? {
                            message: null !== (o = Zo.errToObj(t).message) && void 0 !== o ? o : a
                        } : {
                            message: a
                        };
                    }
                } : {})
            });
        }
        strip() {
            return new da({
                ...this._def,
                unknownKeys: "strip"
            });
        }
        passthrough() {
            return new da({
                ...this._def,
                unknownKeys: "passthrough"
            });
        }
        extend(t) {
            return new da({
                ...this._def,
                shape: () => ({
                    ...this._def.shape(),
                    ...t
                })
            });
        }
        merge(t) {
            return new da({
                unknownKeys: t._def.unknownKeys,
                catchall: t._def.catchall,
                shape: () => ({
                    ...this._def.shape(),
                    ...t._def.shape()
                }),
                typeName: ja.ZodObject
            });
        }
        setKey(t, e) {
            return this.augment({
                [t]: e
            });
        }
        catchall(t) {
            return new da({
                ...this._def,
                catchall: t
            });
        }
        pick(t) {
            const e = {};
            return bo.objectKeys(t).forEach(r => {
                t[r] && this.shape[r] && (e[r] = this.shape[r]);
            }), new da({
                ...this._def,
                shape: () => e
            });
        }
        omit(t) {
            const e = {};
            return bo.objectKeys(this.shape).forEach(r => {
                t[r] || (e[r] = this.shape[r]);
            }), new da({
                ...this._def,
                shape: () => e
            });
        }
        deepPartial() {
            return ha(this);
        }
        partial(t) {
            const e = {};
            return bo.objectKeys(this.shape).forEach(r => {
                const n = this.shape[r];
                t && !t[r] ? e[r] = n : e[r] = n.optional();
            }), new da({
                ...this._def,
                shape: () => e
            });
        }
        required(t) {
            const e = {};
            return bo.objectKeys(this.shape).forEach(r => {
                if (t && !t[r]) e[r] = this.shape[r]; else {
                    let t = this.shape[r];
                    for (; t instanceof Ia;) t = t._def.innerType;
                    e[r] = t;
                }
            }), new da({
                ...this._def,
                shape: () => e
            });
        }
        keyof() {
            return Sa(bo.objectKeys(this.shape));
        }
    }
    da.create = (t, e) => new da({
        shape: () => t,
        unknownKeys: "strip",
        catchall: aa.create(),
        typeName: ja.ZodObject,
        ...Do(e)
    }), da.strictCreate = (t, e) => new da({
        shape: () => t,
        unknownKeys: "strict",
        catchall: aa.create(),
        typeName: ja.ZodObject,
        ...Do(e)
    }), da.lazycreate = (t, e) => new da({
        shape: t,
        unknownKeys: "strip",
        catchall: aa.create(),
        typeName: ja.ZodObject,
        ...Do(e)
    });
    class fa extends zo {
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t),
                r = this._def.options;
            if (e.common.async) return Promise.all(r.map(async t => {
                const r = {
                    ...e,
                    common: {
                        ...e.common,
                        issues: []
                    },
                    parent: null
                };
                return {
                    result: await t._parseAsync({
                        data: e.data,
                        path: e.path,
                        parent: r
                    }),
                    ctx: r
                };
            })).then(function (t) {
                for (const e of t) if ("valid" === e.result.status) return e.result;
                for (const r of t) if ("dirty" === r.result.status) return e.common.issues.push(...r.ctx.common.issues), r.result;
                const r = t.map(t => new Eo(t.ctx.common.issues));
                return Bo(e, {
                    code: _o.invalid_union,
                    unionErrors: r
                }), Po;
            });
            {
                let t;
                const n = [];
                for (const s of r) {
                    const r = {
                        ...e,
                        common: {
                            ...e.common,
                            issues: []
                        },
                        parent: null
                    },
                        i = s._parseSync({
                            data: e.data,
                            path: e.path,
                            parent: r
                        });
                    if ("valid" === i.status) return i;
                    "dirty" !== i.status || t || (t = {
                        result: i,
                        ctx: r
                    }), r.common.issues.length && n.push(r.common.issues);
                }
                if (t) return e.common.issues.push(...t.ctx.common.issues), t.result;
                const s = n.map(t => new Eo(t));
                return Bo(e, {
                    code: _o.invalid_union,
                    unionErrors: s
                }), Po;
            }
        }
        get options() {
            return this._def.options;
        }
    }
    fa.create = (t, e) => new fa({
        options: t,
        typeName: ja.ZodUnion,
        ...Do(e)
    });
    const la = t => t instanceof _a ? la(t.schema) : t instanceof Ba ? la(t.innerType()) : t instanceof Ea ? [t.value] : t instanceof Aa ? t.options : t instanceof ka ? Object.keys(t.enum) : t instanceof Ta ? la(t._def.innerType) : t instanceof na ? [void 0] : t instanceof sa ? [null] : null;
    class pa extends zo {
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t);
            if (e.parsedType !== vo.object) return Bo(e, {
                code: _o.invalid_type,
                expected: vo.object,
                received: e.parsedType
            }), Po;
            const r = this.discriminator,
                n = e.data[r],
                s = this.optionsMap.get(n);
            return s ? e.common.async ? s._parseAsync({
                data: e.data,
                path: e.path,
                parent: e
            }) : s._parseSync({
                data: e.data,
                path: e.path,
                parent: e
            }) : (Bo(e, {
                code: _o.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [r]
            }), Po);
        }
        get discriminator() {
            return this._def.discriminator;
        }
        get options() {
            return this._def.options;
        }
        get optionsMap() {
            return this._def.optionsMap;
        }
        static create(t, e, r) {
            const n = new Map();
            for (const r of e) {
                const e = la(r.shape[t]);
                if (!e) throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
                for (const s of e) {
                    if (n.has(s)) throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(s)}`);
                    n.set(s, r);
                }
            }
            return new pa({
                typeName: ja.ZodDiscriminatedUnion,
                discriminator: t,
                options: e,
                optionsMap: n,
                ...Do(r)
            });
        }
    }
    function ga(t, e) {
        const r = xo(t),
            n = xo(e);
        if (t === e) return {
            valid: !0,
            data: t
        };
        if (r === vo.object && n === vo.object) {
            const r = bo.objectKeys(e),
                n = bo.objectKeys(t).filter(t => -1 !== r.indexOf(t)),
                s = {
                    ...t,
                    ...e
                };
            for (const r of n) {
                const n = ga(t[r], e[r]);
                if (!n.valid) return {
                    valid: !1
                };
                s[r] = n.data;
            }
            return {
                valid: !0,
                data: s
            };
        }
        if (r === vo.array && n === vo.array) {
            if (t.length !== e.length) return {
                valid: !1
            };
            const r = [];
            for (let n = 0; n < t.length; n++) {
                const s = ga(t[n], e[n]);
                if (!s.valid) return {
                    valid: !1
                };
                r.push(s.data);
            }
            return {
                valid: !0,
                data: r
            };
        }
        return r === vo.date && n === vo.date && +t == +e ? {
            valid: !0,
            data: t
        } : {
            valid: !1
        };
    }
    class ma extends zo {
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t),
                n = (t, n) => {
                    if (Co(t) || Co(n)) return Po;
                    const s = ga(t.value, n.value);
                    return s.valid ? ((Lo(t) || Lo(n)) && e.dirty(), {
                        status: e.value,
                        value: s.data
                    }) : (Bo(r, {
                        code: _o.invalid_intersection_types
                    }), Po);
                };
            return r.common.async ? Promise.all([this._def.left._parseAsync({
                data: r.data,
                path: r.path,
                parent: r
            }), this._def.right._parseAsync({
                data: r.data,
                path: r.path,
                parent: r
            })]).then(([t, e]) => n(t, e)) : n(this._def.left._parseSync({
                data: r.data,
                path: r.path,
                parent: r
            }), this._def.right._parseSync({
                data: r.data,
                path: r.path,
                parent: r
            }));
        }
    }
    ma.create = (t, e, r) => new ma({
        left: t,
        right: e,
        typeName: ja.ZodIntersection,
        ...Do(r)
    });
    class ya extends zo {
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t);
            if (r.parsedType !== vo.array) return Bo(r, {
                code: _o.invalid_type,
                expected: vo.array,
                received: r.parsedType
            }), Po;
            if (r.data.length < this._def.items.length) return Bo(r, {
                code: _o.too_small,
                minimum: this._def.items.length,
                inclusive: !0,
                exact: !1,
                type: "array"
            }), Po;
            !this._def.rest && r.data.length > this._def.items.length && (Bo(r, {
                code: _o.too_big,
                maximum: this._def.items.length,
                inclusive: !0,
                exact: !1,
                type: "array"
            }), e.dirty());
            const n = [...r.data].map((t, e) => {
                const n = this._def.items[e] || this._def.rest;
                return n ? n._parse(new Ro(r, t, r.path, e)) : null;
            }).filter(t => !!t);
            return r.common.async ? Promise.all(n).then(t => Io.mergeArray(e, t)) : Io.mergeArray(e, n);
        }
        get items() {
            return this._def.items;
        }
        rest(t) {
            return new ya({
                ...this._def,
                rest: t
            });
        }
    }
    ya.create = (t, e) => {
        if (!Array.isArray(t)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
        return new ya({
            items: t,
            typeName: ja.ZodTuple,
            rest: null,
            ...Do(e)
        });
    };
    class ba extends zo {
        get keySchema() {
            return this._def.keyType;
        }
        get valueSchema() {
            return this._def.valueType;
        }
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t);
            if (r.parsedType !== vo.object) return Bo(r, {
                code: _o.invalid_type,
                expected: vo.object,
                received: r.parsedType
            }), Po;
            const n = [],
                s = this._def.keyType,
                i = this._def.valueType;
            for (const t in r.data) n.push({
                key: s._parse(new Ro(r, t, r.path, t)),
                value: i._parse(new Ro(r, r.data[t], r.path, t))
            });
            return r.common.async ? Io.mergeObjectAsync(e, n) : Io.mergeObjectSync(e, n);
        }
        get element() {
            return this._def.valueType;
        }
        static create(t, e, r) {
            return new ba(e instanceof zo ? {
                keyType: t,
                valueType: e,
                typeName: ja.ZodRecord,
                ...Do(r)
            } : {
                keyType: Yo.create(),
                valueType: t,
                typeName: ja.ZodRecord,
                ...Do(e)
            });
        }
    }
    class wa extends zo {
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t);
            if (r.parsedType !== vo.map) return Bo(r, {
                code: _o.invalid_type,
                expected: vo.map,
                received: r.parsedType
            }), Po;
            const n = this._def.keyType,
                s = this._def.valueType,
                i = [...r.data.entries()].map(([t, e], i) => ({
                    key: n._parse(new Ro(r, t, r.path, [i, "key"])),
                    value: s._parse(new Ro(r, e, r.path, [i, "value"]))
                }));
            if (r.common.async) {
                const t = new Map();
                return Promise.resolve().then(async () => {
                    for (const r of i) {
                        const n = await r.key,
                            s = await r.value;
                        if ("aborted" === n.status || "aborted" === s.status) return Po;
                        "dirty" !== n.status && "dirty" !== s.status || e.dirty(), t.set(n.value, s.value);
                    }
                    return {
                        status: e.value,
                        value: t
                    };
                });
            }
            {
                const t = new Map();
                for (const r of i) {
                    const n = r.key,
                        s = r.value;
                    if ("aborted" === n.status || "aborted" === s.status) return Po;
                    "dirty" !== n.status && "dirty" !== s.status || e.dirty(), t.set(n.value, s.value);
                }
                return {
                    status: e.value,
                    value: t
                };
            }
        }
    }
    wa.create = (t, e, r) => new wa({
        valueType: e,
        keyType: t,
        typeName: ja.ZodMap,
        ...Do(r)
    });
    class va extends zo {
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t);
            if (r.parsedType !== vo.set) return Bo(r, {
                code: _o.invalid_type,
                expected: vo.set,
                received: r.parsedType
            }), Po;
            const n = this._def;
            null !== n.minSize && r.data.size < n.minSize.value && (Bo(r, {
                code: _o.too_small,
                minimum: n.minSize.value,
                type: "set",
                inclusive: !0,
                exact: !1,
                message: n.minSize.message
            }), e.dirty()), null !== n.maxSize && r.data.size > n.maxSize.value && (Bo(r, {
                code: _o.too_big,
                maximum: n.maxSize.value,
                type: "set",
                inclusive: !0,
                exact: !1,
                message: n.maxSize.message
            }), e.dirty());
            const s = this._def.valueType;
            function i(t) {
                const r = new Set();
                for (const n of t) {
                    if ("aborted" === n.status) return Po;
                    "dirty" === n.status && e.dirty(), r.add(n.value);
                }
                return {
                    status: e.value,
                    value: r
                };
            }
            const o = [...r.data.values()].map((t, e) => s._parse(new Ro(r, t, r.path, e)));
            return r.common.async ? Promise.all(o).then(t => i(t)) : i(o);
        }
        min(t, e) {
            return new va({
                ...this._def,
                minSize: {
                    value: t,
                    message: Zo.toString(e)
                }
            });
        }
        max(t, e) {
            return new va({
                ...this._def,
                maxSize: {
                    value: t,
                    message: Zo.toString(e)
                }
            });
        }
        size(t, e) {
            return this.min(t, e).max(t, e);
        }
        nonempty(t) {
            return this.min(1, t);
        }
    }
    va.create = (t, e) => new va({
        valueType: t,
        minSize: null,
        maxSize: null,
        typeName: ja.ZodSet,
        ...Do(e)
    });
    class xa extends zo {
        constructor() {
            super(...arguments), this.validate = this.implement;
        }
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t);
            if (e.parsedType !== vo.function) return Bo(e, {
                code: _o.invalid_type,
                expected: vo.function,
                received: e.parsedType
            }), Po;
            function r(t, r) {
                return Oo({
                    data: t,
                    path: e.path,
                    errorMaps: [e.common.contextualErrorMap, e.schemaErrorMap, ko(), So].filter(t => !!t),
                    issueData: {
                        code: _o.invalid_arguments,
                        argumentsError: r
                    }
                });
            }
            function n(t, r) {
                return Oo({
                    data: t,
                    path: e.path,
                    errorMaps: [e.common.contextualErrorMap, e.schemaErrorMap, ko(), So].filter(t => !!t),
                    issueData: {
                        code: _o.invalid_return_type,
                        returnTypeError: r
                    }
                });
            }
            const s = {
                errorMap: e.common.contextualErrorMap
            },
                i = e.data;
            return this._def.returns instanceof Oa ? Uo(async (...t) => {
                const e = new Eo([]),
                    o = await this._def.args.parseAsync(t, s).catch(n => {
                        throw e.addIssue(r(t, n)), e;
                    }),
                    a = await i(...o);
                return await this._def.returns._def.type.parseAsync(a, s).catch(t => {
                    throw e.addIssue(n(a, t)), e;
                });
            }) : Uo((...t) => {
                const e = this._def.args.safeParse(t, s);
                if (!e.success) throw new Eo([r(t, e.error)]);
                const o = i(...e.data),
                    a = this._def.returns.safeParse(o, s);
                if (!a.success) throw new Eo([n(o, a.error)]);
                return a.data;
            });
        }
        parameters() {
            return this._def.args;
        }
        returnType() {
            return this._def.returns;
        }
        args(...t) {
            return new xa({
                ...this._def,
                args: ya.create(t).rest(oa.create())
            });
        }
        returns(t) {
            return new xa({
                ...this._def,
                returns: t
            });
        }
        implement(t) {
            return this.parse(t);
        }
        strictImplement(t) {
            return this.parse(t);
        }
        static create(t, e, r) {
            return new xa({
                args: t || ya.create([]).rest(oa.create()),
                returns: e || oa.create(),
                typeName: ja.ZodFunction,
                ...Do(r)
            });
        }
    }
    class _a extends zo {
        get schema() {
            return this._def.getter();
        }
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t);
            return this._def.getter()._parse({
                data: e.data,
                path: e.path,
                parent: e
            });
        }
    }
    _a.create = (t, e) => new _a({
        getter: t,
        typeName: ja.ZodLazy,
        ...Do(e)
    });
    class Ea extends zo {
        _parse(t) {
            if (t.data !== this._def.value) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    received: e.data,
                    code: _o.invalid_literal,
                    expected: this._def.value
                }), Po;
            }
            return {
                status: "valid",
                value: t.data
            };
        }
        get value() {
            return this._def.value;
        }
    }
    function Sa(t, e) {
        return new Aa({
            values: t,
            typeName: ja.ZodEnum,
            ...Do(e)
        });
    }
    Ea.create = (t, e) => new Ea({
        value: t,
        typeName: ja.ZodLiteral,
        ...Do(e)
    });
    class Aa extends zo {
        _parse(t) {
            if ("string" != typeof t.data) {
                const e = this._getOrReturnCtx(t),
                    r = this._def.values;
                return Bo(e, {
                    expected: bo.joinValues(r),
                    received: e.parsedType,
                    code: _o.invalid_type
                }), Po;
            }
            if (-1 === this._def.values.indexOf(t.data)) {
                const e = this._getOrReturnCtx(t),
                    r = this._def.values;
                return Bo(e, {
                    received: e.data,
                    code: _o.invalid_enum_value,
                    options: r
                }), Po;
            }
            return Uo(t.data);
        }
        get options() {
            return this._def.values;
        }
        get enum() {
            const t = {};
            for (const e of this._def.values) t[e] = e;
            return t;
        }
        get Values() {
            const t = {};
            for (const e of this._def.values) t[e] = e;
            return t;
        }
        get Enum() {
            const t = {};
            for (const e of this._def.values) t[e] = e;
            return t;
        }
        extract(t) {
            return Aa.create(t);
        }
        exclude(t) {
            return Aa.create(this.options.filter(e => !t.includes(e)));
        }
    }
    Aa.create = Sa;
    class ka extends zo {
        _parse(t) {
            const e = bo.getValidEnumValues(this._def.values),
                r = this._getOrReturnCtx(t);
            if (r.parsedType !== vo.string && r.parsedType !== vo.number) {
                const t = bo.objectValues(e);
                return Bo(r, {
                    expected: bo.joinValues(t),
                    received: r.parsedType,
                    code: _o.invalid_type
                }), Po;
            }
            if (-1 === e.indexOf(t.data)) {
                const t = bo.objectValues(e);
                return Bo(r, {
                    received: r.data,
                    code: _o.invalid_enum_value,
                    options: t
                }), Po;
            }
            return Uo(t.data);
        }
        get enum() {
            return this._def.values;
        }
    }
    ka.create = (t, e) => new ka({
        values: t,
        typeName: ja.ZodNativeEnum,
        ...Do(e)
    });
    class Oa extends zo {
        unwrap() {
            return this._def.type;
        }
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t);
            if (e.parsedType !== vo.promise && !1 === e.common.async) return Bo(e, {
                code: _o.invalid_type,
                expected: vo.promise,
                received: e.parsedType
            }), Po;
            const r = e.parsedType === vo.promise ? e.data : Promise.resolve(e.data);
            return Uo(r.then(t => this._def.type.parseAsync(t, {
                path: e.path,
                errorMap: e.common.contextualErrorMap
            })));
        }
    }
    Oa.create = (t, e) => new Oa({
        type: t,
        typeName: ja.ZodPromise,
        ...Do(e)
    });
    class Ba extends zo {
        innerType() {
            return this._def.schema;
        }
        sourceType() {
            return this._def.schema._def.typeName === ja.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
        }
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t),
                n = this._def.effect || null;
            if ("preprocess" === n.type) {
                const t = n.transform(r.data);
                return r.common.async ? Promise.resolve(t).then(t => this._def.schema._parseAsync({
                    data: t,
                    path: r.path,
                    parent: r
                })) : this._def.schema._parseSync({
                    data: t,
                    path: r.path,
                    parent: r
                });
            }
            const s = {
                addIssue: t => {
                    Bo(r, t), t.fatal ? e.abort() : e.dirty();
                },
                get path() {
                    return r.path;
                }
            };
            if (s.addIssue = s.addIssue.bind(s), "refinement" === n.type) {
                const t = t => {
                    const e = n.refinement(t, s);
                    if (r.common.async) return Promise.resolve(e);
                    if (e instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                    return t;
                };
                if (!1 === r.common.async) {
                    const n = this._def.schema._parseSync({
                        data: r.data,
                        path: r.path,
                        parent: r
                    });
                    return "aborted" === n.status ? Po : ("dirty" === n.status && e.dirty(), t(n.value), {
                        status: e.value,
                        value: n.value
                    });
                }
                return this._def.schema._parseAsync({
                    data: r.data,
                    path: r.path,
                    parent: r
                }).then(r => "aborted" === r.status ? Po : ("dirty" === r.status && e.dirty(), t(r.value).then(() => ({
                    status: e.value,
                    value: r.value
                }))));
            }
            if ("transform" === n.type) {
                if (!1 === r.common.async) {
                    const t = this._def.schema._parseSync({
                        data: r.data,
                        path: r.path,
                        parent: r
                    });
                    if (!No(t)) return t;
                    const i = n.transform(t.value, s);
                    if (i instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
                    return {
                        status: e.value,
                        value: i
                    };
                }
                return this._def.schema._parseAsync({
                    data: r.data,
                    path: r.path,
                    parent: r
                }).then(t => No(t) ? Promise.resolve(n.transform(t.value, s)).then(t => ({
                    status: e.value,
                    value: t
                })) : t);
            }
            bo.assertNever(n);
        }
    }
    Ba.create = (t, e, r) => new Ba({
        schema: t,
        typeName: ja.ZodEffects,
        effect: e,
        ...Do(r)
    }), Ba.createWithPreprocess = (t, e, r) => new Ba({
        schema: e,
        effect: {
            type: "preprocess",
            transform: t
        },
        typeName: ja.ZodEffects,
        ...Do(r)
    });
    class Ia extends zo {
        _parse(t) {
            return this._getType(t) === vo.undefined ? Uo(void 0) : this._def.innerType._parse(t);
        }
        unwrap() {
            return this._def.innerType;
        }
    }
    Ia.create = (t, e) => new Ia({
        innerType: t,
        typeName: ja.ZodOptional,
        ...Do(e)
    });
    class Pa extends zo {
        _parse(t) {
            return this._getType(t) === vo.null ? Uo(null) : this._def.innerType._parse(t);
        }
        unwrap() {
            return this._def.innerType;
        }
    }
    Pa.create = (t, e) => new Pa({
        innerType: t,
        typeName: ja.ZodNullable,
        ...Do(e)
    });
    class Ta extends zo {
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t);
            let r = e.data;
            return e.parsedType === vo.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
                data: r,
                path: e.path,
                parent: e
            });
        }
        removeDefault() {
            return this._def.innerType;
        }
    }
    Ta.create = (t, e) => new Ta({
        innerType: t,
        typeName: ja.ZodDefault,
        defaultValue: "function" == typeof e.default ? e.default : () => e.default,
        ...Do(e)
    });
    class Ua extends zo {
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t),
                r = {
                    ...e,
                    common: {
                        ...e.common,
                        issues: []
                    }
                },
                n = this._def.innerType._parse({
                    data: r.data,
                    path: r.path,
                    parent: {
                        ...r
                    }
                });
            return Ho(n) ? n.then(t => ({
                status: "valid",
                value: "valid" === t.status ? t.value : this._def.catchValue({
                    get error() {
                        return new Eo(r.common.issues);
                    },
                    input: r.data
                })
            })) : {
                status: "valid",
                value: "valid" === n.status ? n.value : this._def.catchValue({
                    get error() {
                        return new Eo(r.common.issues);
                    },
                    input: r.data
                })
            };
        }
        removeCatch() {
            return this._def.innerType;
        }
    }
    Ua.create = (t, e) => new Ua({
        innerType: t,
        typeName: ja.ZodCatch,
        catchValue: "function" == typeof e.catch ? e.catch : () => e.catch,
        ...Do(e)
    });
    class Ca extends zo {
        _parse(t) {
            if (this._getType(t) !== vo.nan) {
                const e = this._getOrReturnCtx(t);
                return Bo(e, {
                    code: _o.invalid_type,
                    expected: vo.nan,
                    received: e.parsedType
                }), Po;
            }
            return {
                status: "valid",
                value: t.data
            };
        }
    }
    Ca.create = t => new Ca({
        typeName: ja.ZodNaN,
        ...Do(t)
    });
    const La = Symbol("zod_brand");
    class Na extends zo {
        _parse(t) {
            const {
                ctx: e
            } = this._processInputParams(t),
                r = e.data;
            return this._def.type._parse({
                data: r,
                path: e.path,
                parent: e
            });
        }
        unwrap() {
            return this._def.type;
        }
    }
    class Ha extends zo {
        _parse(t) {
            const {
                status: e,
                ctx: r
            } = this._processInputParams(t);
            if (r.common.async) {
                return (async () => {
                    const t = await this._def.in._parseAsync({
                        data: r.data,
                        path: r.path,
                        parent: r
                    });
                    return "aborted" === t.status ? Po : "dirty" === t.status ? (e.dirty(), To(t.value)) : this._def.out._parseAsync({
                        data: t.value,
                        path: r.path,
                        parent: r
                    });
                })();
            }
            {
                const t = this._def.in._parseSync({
                    data: r.data,
                    path: r.path,
                    parent: r
                });
                return "aborted" === t.status ? Po : "dirty" === t.status ? (e.dirty(), {
                    status: "dirty",
                    value: t.value
                }) : this._def.out._parseSync({
                    data: t.value,
                    path: r.path,
                    parent: r
                });
            }
        }
        static create(t, e) {
            return new Ha({
                in: t,
                out: e,
                typeName: ja.ZodPipeline
            });
        }
    }
    const Za = (t, e = {}, r) => t ? ia.create().superRefine((n, s) => {
        var i, o;
        if (!t(n)) {
            const t = "function" == typeof e ? e(n) : "string" == typeof e ? {
                message: e
            } : e,
                a = null === (o = null !== (i = t.fatal) && void 0 !== i ? i : r) || void 0 === o || o,
                c = "string" == typeof t ? {
                    message: t
                } : t;
            s.addIssue({
                code: "custom",
                ...c,
                fatal: a
            });
        }
    }) : ia.create(),
        Ra = {
            object: da.lazycreate
        };
    var ja;
    !function (t) {
        t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline";
    }(ja || (ja = {}));
    const Da = Yo.create,
        za = Qo.create,
        $a = Ca.create,
        Fa = Xo.create,
        qa = ta.create,
        Ka = ea.create,
        Va = ra.create,
        Ma = na.create,
        Ga = sa.create,
        Wa = ia.create,
        Ya = oa.create,
        Ja = aa.create,
        Qa = ca.create,
        Xa = ua.create,
        tc = da.create,
        ec = da.strictCreate,
        rc = fa.create,
        nc = pa.create,
        sc = ma.create,
        ic = ya.create,
        oc = ba.create,
        ac = wa.create,
        cc = va.create,
        uc = xa.create,
        hc = _a.create,
        dc = Ea.create,
        fc = Aa.create,
        lc = ka.create,
        pc = Oa.create,
        gc = Ba.create,
        mc = Ia.create,
        yc = Pa.create,
        bc = Ba.createWithPreprocess,
        wc = Ha.create,
        vc = {
            string: t => Yo.create({
                ...t,
                coerce: !0
            }),
            number: t => Qo.create({
                ...t,
                coerce: !0
            }),
            boolean: t => ta.create({
                ...t,
                coerce: !0
            }),
            bigint: t => Xo.create({
                ...t,
                coerce: !0
            }),
            date: t => ea.create({
                ...t,
                coerce: !0
            })
        },
        xc = Po;
    var _c = Object.freeze({
        __proto__: null,
        defaultErrorMap: So,
        setErrorMap: function (t) {
            Ao = t;
        },
        getErrorMap: ko,
        makeIssue: Oo,
        EMPTY_PATH: [],
        addIssueToContext: Bo,
        ParseStatus: Io,
        INVALID: Po,
        DIRTY: To,
        OK: Uo,
        isAborted: Co,
        isDirty: Lo,
        isValid: No,
        isAsync: Ho,
        get util() {
            return bo;
        },
        get objectUtil() {
            return wo;
        },
        ZodParsedType: vo,
        getParsedType: xo,
        ZodType: zo,
        ZodString: Yo,
        ZodNumber: Qo,
        ZodBigInt: Xo,
        ZodBoolean: ta,
        ZodDate: ea,
        ZodSymbol: ra,
        ZodUndefined: na,
        ZodNull: sa,
        ZodAny: ia,
        ZodUnknown: oa,
        ZodNever: aa,
        ZodVoid: ca,
        ZodArray: ua,
        ZodObject: da,
        ZodUnion: fa,
        ZodDiscriminatedUnion: pa,
        ZodIntersection: ma,
        ZodTuple: ya,
        ZodRecord: ba,
        ZodMap: wa,
        ZodSet: va,
        ZodFunction: xa,
        ZodLazy: _a,
        ZodLiteral: Ea,
        ZodEnum: Aa,
        ZodNativeEnum: ka,
        ZodPromise: Oa,
        ZodEffects: Ba,
        ZodTransformer: Ba,
        ZodOptional: Ia,
        ZodNullable: Pa,
        ZodDefault: Ta,
        ZodCatch: Ua,
        ZodNaN: Ca,
        BRAND: La,
        ZodBranded: Na,
        ZodPipeline: Ha,
        custom: Za,
        Schema: zo,
        ZodSchema: zo,
        late: Ra,
        get ZodFirstPartyTypeKind() {
            return ja;
        },
        coerce: vc,
        any: Wa,
        array: Xa,
        bigint: Fa,
        boolean: qa,
        date: Ka,
        discriminatedUnion: nc,
        effect: gc,
        enum: fc,
        function: uc,
        instanceof: (t, e = {
            message: `Input not instance of ${t.name}`
        }) => Za(e => e instanceof t, e),
        intersection: sc,
        lazy: hc,
        literal: dc,
        map: ac,
        nan: $a,
        nativeEnum: lc,
        never: Ja,
        null: Ga,
        nullable: yc,
        number: za,
        object: tc,
        oboolean: () => qa().optional(),
        onumber: () => za().optional(),
        optional: mc,
        ostring: () => Da().optional(),
        pipeline: wc,
        preprocess: bc,
        promise: pc,
        record: oc,
        set: cc,
        strictObject: ec,
        string: Da,
        symbol: Va,
        transformer: gc,
        tuple: ic,
        undefined: Ma,
        union: rc,
        unknown: Ya,
        void: Qa,
        NEVER: xc,
        ZodIssueCode: _o,
        quotelessJson: t => JSON.stringify(t, null, 2).replace(/"([^"]+)":/g, "$1:"),
        ZodError: Eo
    });
    const Ec = _c.string().regex(/^[a-fA-F0-9]$/),
        Sc = _c.string().regex(/^[a-fA-F0-9]{64}$/),
        Ac = _c.number().min(0).max(4294967295),
        kc = _c.bigint(),
        Oc = _c.instanceof(Uint8Array),
        Bc = _c.union([Ec, Ac, _c.string(), Oc]).array(),
        Ic = _c.union([Bc, Ec, Oc]),
        Pc = _c.array(Ic),
        Tc = _c.object({
            value: _c.union([Ac, kc]),
            scriptPubKey: Ic
        }),
        Uc = _c.object({
            txid: Sc,
            vout: Ac,
            scriptSig: Ic,
            sequence: Ac,
            prevout: Tc.optional(),
            witness: Pc
        }),
        Cc = {
            TxData: _c.object({
                version: Ac,
                vin: _c.array(Uc),
                vout: _c.array(Tc),
                locktime: Ac
            }),
            TxInput: Uc,
            TxOutput: Tc,
            witness: Pc,
            script: Ic,
            hexstr: Ec,
            hash: Sc,
            uint32: Ac,
            uint64: kc
        };
    return t.Address = We, t.Input = mo, t.Output = po, t.Script = ee, t.Sequence = lo, t.Signer = oo, t.Tap = co, t.Transaction = class {
        constructor(t) {
            "string" == typeof t && (t = Lt.hex(t)), t instanceof Uint8Array && (t = qe.decode(t));
            const e = Cc.TxData;
            this._data = e.parse(qe.create(t));
        }
        get data() {
            return this._data;
        }
        get version() {
            return this.data.version;
        }
        get vin() {
            return this.data.vin.map((t, e) => new mo(this.data, e));
        }
        get vout() {
            return this.data.vout.map(t => new po(t));
        }
        get locktime() {
            return new yo(this.data.locktime);
        }
        get base() {
            return qe.encode(this.data, !0);
        }
        get buff() {
            return qe.encode(this.data);
        }
        get raw() {
            return this.buff.raw;
        }
        get hex() {
            return this.buff.hex;
        }
        get size() {
            return this.raw.length;
        }
        get bsize() {
            return this.base.length;
        }
        get weight() {
            return 3 * this.bsize + this.size;
        }
        get vsize() {
            const t = this.weight % 4 > 0 ? 1 : 0;
            return Math.floor(this.weight / 4) + t;
        }
        get hash() {
            return this.buff.toHash("hash256").reverse().hex;
        }
        get txid() {
            return this.base.toHash("hash256").reverse().hex;
        }
        async export() {
            const {
                size: t,
                weight: e,
                vsize: r,
                hex: n
            } = this;
            return {
                txid: this.txid,
                hash: this.hash,
                ...this.data,
                size: t,
                weight: e,
                vsize: r,
                hex: n
            };
        }
    }, t.Tx = qe, t.Witness = go, t;
}({});