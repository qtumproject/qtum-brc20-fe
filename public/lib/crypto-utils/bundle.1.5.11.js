var cryptoUtils = function (n, _Wn, _nt, _tt) {
    "use strict";

    /*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
    const {
        crypto: t
    } = globalThis,
        e = BigInt(0),
        r = BigInt(1),
        i = BigInt(2),
        s = BigInt(3),
        o = BigInt(8),
        a = Object.freeze({
            a: e,
            b: BigInt(7),
            P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
            n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
            h: r,
            Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
            Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
            beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
        }),
        c = (n, t) => (n + t / i) / t,
        u = {
            beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
            splitScalar(n) {
                const {
                    n: t
                } = a,
                    e = BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
                    i = -r * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
                    s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
                    o = e,
                    u = BigInt("0x100000000000000000000000000000000"),
                    f = c(o * n, t),
                    h = c(-i * n, t);
                let l = $(n - f * e - h * s, t),
                    y = $(-f * i - h * o, t);
                const d = l > u,
                    g = y > u;
                if (d && (l = t - l), g && (y = t - y), l > u || y > u) throw new Error("splitScalarEndo: Endomorphism failed, k=" + n);
                return {
                    k1neg: d,
                    k1: l,
                    k2neg: g,
                    k2: y
                };
            }
        },
        f = 32,
        h = 32,
        l = 32,
        y = f + 1,
        d = 2 * f + 1;
    function g(n) {
        const {
            a: t,
            b: e
        } = a,
            r = $(n * n),
            i = $(r * n);
        return $(i + t * n + e);
    }
    const w = a.a === e;
    class m extends Error {
        constructor(n) {
            super(n);
        }
    }
    function p(n) {
        if (!(n instanceof b)) throw new TypeError("JacobianPoint expected");
    }
    class b {
        constructor(n, t, e) {
            this.x = n, this.y = t, this.z = e;
        }
        static get BASE() {
            return new b(a.Gx, a.Gy, r);
        }
        static get ZERO() {
            return new b(e, r, e);
        }
        static fromAffine(n) {
            if (!(n instanceof E)) throw new TypeError("JacobianPoint#fromAffine: expected Point");
            return n.equals(E.ZERO) ? b.ZERO : new b(n.x, n.y, r);
        }
        static toAffineBatch(n) {
            const t = function (n, t = a.P) {
                const i = new Array(n.length),
                    s = V(n.reduce((n, r, s) => r === e ? n : (i[s] = n, $(n * r, t)), r), t);
                return n.reduceRight((n, r, s) => r === e ? n : (i[s] = $(n * i[s], t), $(n * r, t)), s), i;
            }(n.map(n => n.z));
            return n.map((n, e) => n.toAffine(t[e]));
        }
        static normalizeZ(n) {
            return b.toAffineBatch(n).map(b.fromAffine);
        }
        equals(n) {
            p(n);
            const {
                x: t,
                y: e,
                z: r
            } = this,
                {
                    x: i,
                    y: s,
                    z: o
                } = n,
                a = $(r * r),
                c = $(o * o),
                u = $(t * c),
                f = $(i * a),
                h = $($(e * o) * c),
                l = $($(s * r) * a);
            return u === f && h === l;
        }
        negate() {
            return new b(this.x, $(-this.y), this.z);
        }
        double() {
            const {
                x: n,
                y: t,
                z: e
            } = this,
                r = $(n * n),
                a = $(t * t),
                c = $(a * a),
                u = n + a,
                f = $(i * ($(u * u) - r - c)),
                h = $(s * r),
                l = $(h * h),
                y = $(l - i * f),
                d = $(h * (f - y) - o * c),
                g = $(i * t * e);
            return new b(y, d, g);
        }
        add(n) {
            p(n);
            const {
                x: t,
                y: r,
                z: s
            } = this,
                {
                    x: o,
                    y: a,
                    z: c
                } = n;
            if (o === e || a === e) return this;
            if (t === e || r === e) return n;
            const u = $(s * s),
                f = $(c * c),
                h = $(t * f),
                l = $(o * u),
                y = $($(r * c) * f),
                d = $($(a * s) * u),
                g = $(l - h),
                w = $(d - y);
            if (g === e) return w === e ? this.double() : b.ZERO;
            const m = $(g * g),
                x = $(g * m),
                A = $(h * m),
                E = $(w * w - x - i * A),
                v = $(w * (A - E) - y * x),
                S = $(s * c * g);
            return new b(E, v, S);
        }
        subtract(n) {
            return this.add(n.negate());
        }
        multiplyUnsafe(n) {
            const t = b.ZERO;
            if ("bigint" == typeof n && n === e) return t;
            let i = O(n);
            if (i === r) return this;
            if (!w) {
                let n = t,
                    s = this;
                for (; i > e;) i & r && (n = n.add(s)), s = s.double(), i >>= r;
                return n;
            }
            let {
                k1neg: s,
                k1: o,
                k2neg: a,
                k2: c
            } = u.splitScalar(i),
                f = t,
                h = t,
                l = this;
            for (; o > e || c > e;) o & r && (f = f.add(l)), c & r && (h = h.add(l)), l = l.double(), o >>= r, c >>= r;
            return s && (f = f.negate()), a && (h = h.negate()), h = new b($(h.x * u.beta), h.y, h.z), f.add(h);
        }
        precomputeWindow(n) {
            const t = w ? 128 / n + 1 : 256 / n + 1,
                e = [];
            let r = this,
                i = r;
            for (let s = 0; s < t; s++) {
                i = r, e.push(i);
                for (let t = 1; t < 2 ** (n - 1); t++) i = i.add(r), e.push(i);
                r = i.double();
            }
            return e;
        }
        wNAF(n, t) {
            !t && this.equals(b.BASE) && (t = E.BASE);
            const e = t && t._WINDOW_SIZE || 1;
            if (256 % e) throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
            let i = t && A.get(t);
            i || (i = this.precomputeWindow(e), t && 1 !== e && (i = b.normalizeZ(i), A.set(t, i)));
            let s = b.ZERO,
                o = b.BASE;
            const a = 1 + (w ? 128 / e : 256 / e),
                c = 2 ** (e - 1),
                u = BigInt(2 ** e - 1),
                f = 2 ** e,
                h = BigInt(e);
            for (let t = 0; t < a; t++) {
                const e = t * c;
                let a = Number(n & u);
                n >>= h, a > c && (a -= f, n += r);
                const l = e,
                    y = e + Math.abs(a) - 1,
                    d = t % 2 != 0,
                    g = a < 0;
                0 === a ? o = o.add(x(d, i[l])) : s = s.add(x(g, i[y]));
            }
            return {
                p: s,
                f: o
            };
        }
        multiply(n, t) {
            let e,
                r,
                i = O(n);
            if (w) {
                const {
                    k1neg: n,
                    k1: s,
                    k2neg: o,
                    k2: a
                } = u.splitScalar(i);
                let {
                    p: c,
                    f: f
                } = this.wNAF(s, t),
                    {
                        p: h,
                        f: l
                    } = this.wNAF(a, t);
                c = x(n, c), h = x(o, h), h = new b($(h.x * u.beta), h.y, h.z), e = c.add(h), r = f.add(l);
            } else {
                const {
                    p: n,
                    f: s
                } = this.wNAF(i, t);
                e = n, r = s;
            }
            return b.normalizeZ([e, r])[0];
        }
        toAffine(n) {
            const {
                x: t,
                y: e,
                z: i
            } = this,
                s = this.equals(b.ZERO);
            null == n && (n = s ? o : V(i));
            const a = n,
                c = $(a * a),
                u = $(c * a),
                f = $(t * c),
                h = $(e * u),
                l = $(i * a);
            if (s) return E.ZERO;
            if (l !== r) throw new Error("invZ was invalid");
            return new E(f, h);
        }
    }
    function x(n, t) {
        const e = t.negate();
        return n ? e : t;
    }
    const A = new WeakMap();
    let E = class {
        constructor(n, t) {
            this.x = n, this.y = t;
        }
        _setWindowSize(n) {
            this._WINDOW_SIZE = n, A.delete(this);
        }
        static get BASE() {
            return new E(a.Gx, a.Gy);
        }
        static get ZERO() {
            return new E(e, e);
        }
        hasEvenY() {
            return this.y % i === e;
        }
        static fromCompressedHex(n) {
            const t = 32 === n.length,
                e = C(t ? n : n.subarray(1));
            if (!Y(e)) throw new Error("Point is not on curve");
            let o = function (n) {
                const {
                    P: t
                } = a,
                    e = BigInt(6),
                    r = BigInt(11),
                    o = BigInt(22),
                    c = BigInt(23),
                    u = BigInt(44),
                    f = BigInt(88),
                    h = n * n * n % t,
                    l = h * h * n % t,
                    y = K(l, s) * l % t,
                    d = K(y, s) * l % t,
                    g = K(d, i) * h % t,
                    w = K(g, r) * g % t,
                    m = K(w, o) * w % t,
                    p = K(m, u) * m % t,
                    b = K(p, f) * p % t,
                    x = K(b, u) * m % t,
                    A = K(x, s) * l % t,
                    E = K(A, c) * w % t,
                    v = K(E, e) * h % t,
                    S = K(v, i);
                if (S * S % t !== n) throw new Error("Cannot find square root");
                return S;
            }(g(e));
            const c = (o & r) === r;
            if (t) c && (o = $(-o)); else {
                1 == (1 & n[0]) !== c && (o = $(-o));
            }
            const u = new E(e, o);
            return u.assertValidity(), u;
        }
        static fromUncompressedHex(n) {
            const t = C(n.subarray(1, f + 1)),
                e = C(n.subarray(f + 1, 2 * f + 1)),
                r = new E(t, e);
            return r.assertValidity(), r;
        }
        static fromHex(n) {
            const t = T(n),
                e = t.length,
                r = t[0];
            if (e === f) return this.fromCompressedHex(t);
            if (e === y && (2 === r || 3 === r)) return this.fromCompressedHex(t);
            if (e === d && 4 === r) return this.fromUncompressedHex(t);
            throw new Error(`Point.fromHex: received invalid point. Expected 32-${y} compressed bytes or ${d} uncompressed bytes, not ${e}`);
        }
        static fromPrivateKey(n) {
            return E.BASE.multiply(F(n));
        }
        static fromSignature(n, t, e) {
            const {
                r: r,
                s: i
            } = J(t);
            if (![0, 1, 2, 3].includes(e)) throw new Error("Cannot recover: invalid recovery bit");
            const s = q(T(n)),
                {
                    n: o
                } = a,
                c = 2 === e || 3 === e ? r + o : r,
                u = V(c, o),
                f = $(-s * u, o),
                h = $(i * u, o),
                l = 1 & e ? "03" : "02",
                y = E.fromHex(l + N(c)),
                d = E.BASE.multiplyAndAddUnsafe(y, f, h);
            if (!d) throw new Error("Cannot recover signature: point at infinify");
            return d.assertValidity(), d;
        }
        toRawBytes(n = !1) {
            return P(this.toHex(n));
        }
        toHex(n = !1) {
            const t = N(this.x);
            if (n) {
                return `${this.hasEvenY() ? "02" : "03"}${t}`;
            }
            return `04${t}${N(this.y)}`;
        }
        toHexX() {
            return this.toHex(!0).slice(2);
        }
        toRawX() {
            return this.toRawBytes(!0).slice(1);
        }
        assertValidity() {
            const n = "Point is not on elliptic curve",
                {
                    x: t,
                    y: r
                } = this;
            if (!Y(t) || !Y(r)) throw new Error(n);
            const i = $(r * r);
            if ($(i - g(t)) !== e) throw new Error(n);
        }
        equals(n) {
            return this.x === n.x && this.y === n.y;
        }
        negate() {
            return new E(this.x, $(-this.y));
        }
        double() {
            return b.fromAffine(this).double().toAffine();
        }
        add(n) {
            return b.fromAffine(this).add(b.fromAffine(n)).toAffine();
        }
        subtract(n) {
            return this.add(n.negate());
        }
        multiply(n) {
            return b.fromAffine(this).multiply(n, this).toAffine();
        }
        multiplyAndAddUnsafe(n, t, i) {
            const s = b.fromAffine(this),
                o = t === e || t === r || this !== E.BASE ? s.multiplyUnsafe(t) : s.multiply(t),
                a = b.fromAffine(n).multiplyUnsafe(i),
                c = o.add(a);
            return c.equals(b.ZERO) ? void 0 : c.toAffine();
        }
    };
    function v(n) {
        return Number.parseInt(n[0], 16) >= 8 ? "00" + n : n;
    }
    function S(n) {
        if (n.length < 2 || 2 !== n[0]) throw new Error(`Invalid signature integer tag: ${I(n)}`);
        const t = n[1],
            e = n.subarray(2, t + 2);
        if (!t || e.length !== t) throw new Error("Invalid signature integer: wrong length");
        if (0 === e[0] && e[1] <= 127) throw new Error("Invalid signature integer: trailing length");
        return {
            data: C(e),
            left: n.subarray(t + 2)
        };
    }
    class B {
        constructor(n, t) {
            this.r = n, this.s = t, this.assertValidity();
        }
        static fromCompact(n) {
            const t = n instanceof Uint8Array,
                e = "Signature.fromCompact";
            if ("string" != typeof n && !t) throw new TypeError(`${e}: Expected string or Uint8Array`);
            const r = t ? I(n) : n;
            if (128 !== r.length) throw new Error(`${e}: Expected 64-byte hex`);
            return new B(k(r.slice(0, 64)), k(r.slice(64, 128)));
        }
        static fromDER(n) {
            const t = n instanceof Uint8Array;
            if ("string" != typeof n && !t) throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
            const {
                r: e,
                s: r
            } = function (n) {
                if (n.length < 2 || 48 != n[0]) throw new Error(`Invalid signature tag: ${I(n)}`);
                if (n[1] !== n.length - 2) throw new Error("Invalid signature: incorrect length");
                const {
                    data: t,
                    left: e
                } = S(n.subarray(2)),
                    {
                        data: r,
                        left: i
                    } = S(e);
                if (i.length) throw new Error(`Invalid signature: left bytes after parsing: ${I(i)}`);
                return {
                    r: t,
                    s: r
                };
            }(t ? n : P(n));
            return new B(e, r);
        }
        static fromHex(n) {
            return this.fromDER(n);
        }
        assertValidity() {
            const {
                r: n,
                s: t
            } = this;
            if (!X(n)) throw new Error("Invalid Signature: r must be 0 < r < n");
            if (!X(t)) throw new Error("Invalid Signature: s must be 0 < s < n");
        }
        hasHighS() {
            const n = a.n >> r;
            return this.s > n;
        }
        normalizeS() {
            return this.hasHighS() ? new B(this.r, $(-this.s, a.n)) : this;
        }
        toDERRawBytes() {
            return P(this.toDERHex());
        }
        toDERHex() {
            const n = v(_(this.s)),
                t = v(_(this.r)),
                e = n.length / 2,
                r = t.length / 2,
                i = _(e),
                s = _(r);
            return `30${_(r + e + 4)}02${s}${t}02${i}${n}`;
        }
        toRawBytes() {
            return this.toDERRawBytes();
        }
        toHex() {
            return this.toDERHex();
        }
        toCompactRawBytes() {
            return P(this.toCompactHex());
        }
        toCompactHex() {
            return N(this.r) + N(this.s);
        }
    }
    function U(...n) {
        if (!n.every(n => n instanceof Uint8Array)) throw new Error("Uint8Array list expected");
        if (1 === n.length) return n[0];
        const t = n.reduce((n, t) => n + t.length, 0),
            e = new Uint8Array(t);
        for (let t = 0, r = 0; t < n.length; t++) {
            const i = n[t];
            e.set(i, r), r += i.length;
        }
        return e;
    }
    const H = Array.from({
        length: 256
    }, (n, t) => t.toString(16).padStart(2, "0"));
    function I(n) {
        if (!(n instanceof Uint8Array)) throw new Error("Expected Uint8Array");
        let t = "";
        for (let e = 0; e < n.length; e++) t += H[n[e]];
        return t;
    }
    const z = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
    function N(n) {
        if ("bigint" != typeof n) throw new Error("Expected bigint");
        if (!(e <= n && n < z)) throw new Error("Expected number 0 <= n < 2^256");
        return n.toString(16).padStart(64, "0");
    }
    function R(n) {
        const t = P(N(n));
        if (32 !== t.length) throw new Error("Error: expected 32 bytes");
        return t;
    }
    function _(n) {
        const t = n.toString(16);
        return 1 & t.length ? `0${t}` : t;
    }
    function k(n) {
        if ("string" != typeof n) throw new TypeError("hexToNumber: expected string, got " + typeof n);
        return BigInt(`0x${n}`);
    }
    function P(n) {
        if ("string" != typeof n) throw new TypeError("hexToBytes: expected string, got " + typeof n);
        if (n.length % 2) throw new Error("hexToBytes: received invalid unpadded hex" + n.length);
        const t = new Uint8Array(n.length / 2);
        for (let e = 0; e < t.length; e++) {
            const r = 2 * e,
                i = n.slice(r, r + 2),
                s = Number.parseInt(i, 16);
            if (Number.isNaN(s) || s < 0) throw new Error("Invalid byte sequence");
            t[e] = s;
        }
        return t;
    }
    function C(n) {
        return k(I(n));
    }
    function T(n) {
        return n instanceof Uint8Array ? Uint8Array.from(n) : P(n);
    }
    function O(n) {
        if ("number" == typeof n && Number.isSafeInteger(n) && n > 0) return BigInt(n);
        if ("bigint" == typeof n && X(n)) return n;
        throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
    }
    function $(n, t = a.P) {
        const r = n % t;
        return r >= e ? r : t + r;
    }
    function K(n, t) {
        const {
            P: r
        } = a;
        let i = n;
        for (; t-- > e;) i *= i, i %= r;
        return i;
    }
    function V(n, t = a.P) {
        if (n === e || t <= e) throw new Error(`invert: expected positive integers, got n=${n} mod=${t}`);
        let i = $(n, t),
            s = t,
            o = e,
            c = r;
        for (; i !== e;) {
            const n = s % i,
                t = o - c * (s / i);
            s = i, i = n, o = c, c = t;
        }
        if (s !== r) throw new Error("invert: does not exist");
        return $(o, t);
    }
    function q(n, t = !1) {
        const e = function (n) {
            const t = 8 * n.length - 8 * h,
                e = C(n);
            return t > 0 ? e >> BigInt(t) : e;
        }(n);
        if (t) return e;
        const {
            n: r
        } = a;
        return e >= r ? e - r : e;
    }
    let D, Z;
    class j {
        constructor(n, t) {
            if (this.hashLen = n, this.qByteLen = t, "number" != typeof n || n < 2) throw new Error("hashLen must be a number");
            if ("number" != typeof t || t < 2) throw new Error("qByteLen must be a number");
            this.v = new Uint8Array(n).fill(1), this.k = new Uint8Array(n).fill(0), this.counter = 0;
        }
        hmac(...n) {
            return pn.hmacSha256(this.k, ...n);
        }
        hmacSync(...n) {
            return Z(this.k, ...n);
        }
        checkSync() {
            if ("function" != typeof Z) throw new m("hmacSha256Sync needs to be set");
        }
        incr() {
            if (this.counter >= 1e3) throw new Error("Tried 1,000 k values for sign(), all were invalid");
            this.counter += 1;
        }
        async reseed(n = new Uint8Array()) {
            this.k = await this.hmac(this.v, Uint8Array.from([0]), n), this.v = await this.hmac(this.v), 0 !== n.length && (this.k = await this.hmac(this.v, Uint8Array.from([1]), n), this.v = await this.hmac(this.v));
        }
        reseedSync(n = new Uint8Array()) {
            this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), n), this.v = this.hmacSync(this.v), 0 !== n.length && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), n), this.v = this.hmacSync(this.v));
        }
        async generate() {
            this.incr();
            let n = 0;
            const t = [];
            for (; n < this.qByteLen;) {
                this.v = await this.hmac(this.v);
                const e = this.v.slice();
                t.push(e), n += this.v.length;
            }
            return U(...t);
        }
        generateSync() {
            this.checkSync(), this.incr();
            let n = 0;
            const t = [];
            for (; n < this.qByteLen;) {
                this.v = this.hmacSync(this.v);
                const e = this.v.slice();
                t.push(e), n += this.v.length;
            }
            return U(...t);
        }
    }
    function X(n) {
        return e < n && n < a.n;
    }
    function Y(n) {
        return e < n && n < a.P;
    }
    function W(n, t, i, s = !0) {
        const {
            n: o
        } = a,
            c = q(n, !0);
        if (!X(c)) return;
        const u = V(c, o),
            f = E.BASE.multiply(c),
            h = $(f.x, o);
        if (h === e) return;
        const l = $(u * $(t + i * h, o), o);
        if (l === e) return;
        let y = new B(h, l),
            d = (f.x === y.r ? 0 : 2) | Number(f.y & r);
        return s && y.hasHighS() && (y = y.normalizeS(), d ^= 1), {
            sig: y,
            recovery: d
        };
    }
    function F(n) {
        let t;
        if ("bigint" == typeof n) t = n; else if ("number" == typeof n && Number.isSafeInteger(n) && n > 0) t = BigInt(n); else if ("string" == typeof n) {
            if (n.length !== 2 * h) throw new Error("Expected 32 bytes of private key");
            t = k(n);
        } else {
            if (!(n instanceof Uint8Array)) throw new TypeError("Expected valid private key");
            if (n.length !== h) throw new Error("Expected 32 bytes of private key");
            t = C(n);
        }
        if (!X(t)) throw new Error("Expected private key: 0 < key < n");
        return t;
    }
    function M(n) {
        return n instanceof E ? (n.assertValidity(), n) : E.fromHex(n);
    }
    function J(n) {
        if (n instanceof B) return n.assertValidity(), n;
        try {
            return B.fromDER(n);
        } catch (t) {
            return B.fromCompact(n);
        }
    }
    function L(n) {
        const t = n instanceof Uint8Array,
            e = "string" == typeof n,
            r = (t || e) && n.length;
        return t ? r === y || r === d : e ? r === 2 * y || r === 2 * d : n instanceof E;
    }
    function G(n, t, e = !1) {
        if (L(n)) throw new TypeError("getSharedSecret: first arg must be private key");
        if (!L(t)) throw new TypeError("getSharedSecret: second arg must be public key");
        const r = M(t);
        return r.assertValidity(), r.multiply(F(n)).toRawBytes(e);
    }
    function Q(n) {
        return C(n.length > f ? n.slice(0, f) : n);
    }
    function nn(n) {
        const t = Q(n),
            r = $(t, a.n);
        return tn(r < e ? t : r);
    }
    function tn(n) {
        return R(n);
    }
    function en(n, t, e) {
        if (null == n) throw new Error(`sign: expected valid message hash, not "${n}"`);
        const r = T(n),
            i = F(t),
            s = [tn(i), nn(r)];
        if (null != e) {
            !0 === e && (e = pn.randomBytes(f));
            const n = T(e);
            if (n.length !== f) throw new Error(`sign: Expected ${f} bytes of extra data`);
            s.push(n);
        }
        return {
            seed: U(...s),
            m: Q(r),
            d: i
        };
    }
    function rn(n, t) {
        const {
            sig: e,
            recovery: r
        } = n,
            {
                der: i,
                recovered: s
            } = Object.assign({
                canonical: !0,
                der: !0
            }, t),
            o = i ? e.toDERRawBytes() : e.toCompactRawBytes();
        return s ? [o, r] : o;
    }
    async function sn(n, t, e = {}) {
        const {
            seed: r,
            m: i,
            d: s
        } = en(n, t, e.extraEntropy),
            o = new j(l, h);
        let a;
        for (await o.reseed(r); !(a = W(await o.generate(), i, s, e.canonical));) await o.reseed();
        return rn(a, e);
    }
    const on = {
        strict: !0
    };
    function an(n, t, e, r = on) {
        let i;
        try {
            i = J(n), t = T(t);
        } catch (n) {
            return !1;
        }
        const {
            r: s,
            s: o
        } = i;
        if (r.strict && i.hasHighS()) return !1;
        const c = q(t);
        let u;
        try {
            u = M(e);
        } catch (n) {
            return !1;
        }
        const {
            n: f
        } = a,
            h = V(o, f),
            l = $(c * h, f),
            y = $(s * h, f),
            d = E.BASE.multiplyAndAddUnsafe(u, l, y);
        if (!d) return !1;
        return $(d.x, f) === s;
    }
    function cn(n) {
        return $(C(n), a.n);
    }
    class un {
        constructor(n, t) {
            this.r = n, this.s = t, this.assertValidity();
        }
        static fromHex(n) {
            const t = T(n);
            if (64 !== t.length) throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${t.length}`);
            const e = C(t.subarray(0, 32)),
                r = C(t.subarray(32, 64));
            return new un(e, r);
        }
        assertValidity() {
            const {
                r: n,
                s: t
            } = this;
            if (!Y(n) || !X(t)) throw new Error("Invalid signature");
        }
        toHex() {
            return N(this.r) + N(this.s);
        }
        toRawBytes() {
            return P(this.toHex());
        }
    }
    class fn {
        constructor(n, t, e = pn.randomBytes()) {
            if (null == n) throw new TypeError(`sign: Expected valid message, not "${n}"`);
            this.m = T(n);
            const {
                x: r,
                scalar: i
            } = this.getScalar(F(t));
            if (this.px = r, this.d = i, this.rand = T(e), 32 !== this.rand.length) throw new TypeError("sign: Expected 32 bytes of aux randomness");
        }
        getScalar(n) {
            const t = E.fromPrivateKey(n),
                e = t.hasEvenY() ? n : a.n - n;
            return {
                point: t,
                scalar: e,
                x: t.toRawX()
            };
        }
        initNonce(n, t) {
            return R(n ^ C(t));
        }
        finalizeNonce(n) {
            const t = $(C(n), a.n);
            if (t === e) throw new Error("sign: Creation of signature failed. k is zero");
            const {
                point: r,
                x: i,
                scalar: s
            } = this.getScalar(t);
            return {
                R: r,
                rx: i,
                k: s
            };
        }
        finalizeSig(n, t, e, r) {
            return new un(n.x, $(t + e * r, a.n)).toRawBytes();
        }
        error() {
            throw new Error("sign: Invalid signature produced");
        }
        async calc() {
            const {
                m: n,
                d: t,
                px: e,
                rand: r
            } = this,
                i = pn.taggedHash,
                s = this.initNonce(t, await i(wn.aux, r)),
                {
                    R: o,
                    rx: a,
                    k: c
                } = this.finalizeNonce(await i(wn.nonce, s, e, n)),
                u = cn(await i(wn.challenge, a, e, n)),
                f = this.finalizeSig(o, c, u, t);
            return (await yn(f, n, e)) || this.error(), f;
        }
        calcSync() {
            const {
                m: n,
                d: t,
                px: e,
                rand: r
            } = this,
                i = pn.taggedHashSync,
                s = this.initNonce(t, i(wn.aux, r)),
                {
                    R: o,
                    rx: a,
                    k: c
                } = this.finalizeNonce(i(wn.nonce, s, e, n)),
                u = cn(i(wn.challenge, a, e, n)),
                f = this.finalizeSig(o, c, u, t);
            return dn(f, n, e) || this.error(), f;
        }
    }
    function hn(n, t, e) {
        const r = n instanceof un,
            i = r ? n : un.fromHex(n);
        return r && i.assertValidity(), {
            ...i,
            m: T(t),
            P: M(e)
        };
    }
    function ln(n, t, e, r) {
        const i = E.BASE.multiplyAndAddUnsafe(t, F(e), $(-r, a.n));
        return !(!i || !i.hasEvenY() || i.x !== n);
    }
    async function yn(n, t, e) {
        try {
            const {
                r: r,
                s: i,
                m: s,
                P: o
            } = hn(n, t, e),
                a = cn(await pn.taggedHash(wn.challenge, R(r), o.toRawX(), s));
            return ln(r, o, i, a);
        } catch (n) {
            return !1;
        }
    }
    function dn(n, t, e) {
        try {
            const {
                r: r,
                s: i,
                m: s,
                P: o
            } = hn(n, t, e),
                a = cn(pn.taggedHashSync(wn.challenge, R(r), o.toRawX(), s));
            return ln(r, o, i, a);
        } catch (n) {
            if (n instanceof m) throw n;
            return !1;
        }
    }
    const gn = {
        Signature: un,
        getPublicKey: function (n) {
            return E.fromPrivateKey(n).toRawX();
        },
        sign: async function (n, t, e) {
            return new fn(n, t, e).calc();
        },
        verify: yn,
        signSync: function (n, t, e) {
            return new fn(n, t, e).calcSync();
        },
        verifySync: dn
    };
    E.BASE._setWindowSize(8);
    const wn = {
        challenge: "BIP0340/challenge",
        aux: "BIP0340/aux",
        nonce: "BIP0340/nonce"
    },
        mn = {},
        pn = {
            bytesToHex: I,
            hexToBytes: P,
            concatBytes: U,
            mod: $,
            invert: V,
            isValidPrivateKey(n) {
                try {
                    return F(n), !0;
                } catch (n) {
                    return !1;
                }
            },
            _bigintTo32Bytes: R,
            _normalizePrivateKey: F,
            hashToPrivateKey: n => {
                n = T(n);
                const t = h + 8;
                if (n.length < t || n.length > 1024) throw new Error("Expected valid bytes of private key as per FIPS 186");
                return R($(C(n), a.n - r) + r);
            },
            randomBytes: (n = 32) => t.getRandomValues(new Uint8Array(n)),
            randomPrivateKey: () => pn.hashToPrivateKey(pn.randomBytes(h + 8)),
            precompute(n = 8, t = E.BASE) {
                const e = t === E.BASE ? t : new E(t.x, t.y);
                return e._setWindowSize(n), e.multiply(s), e;
            },
            sha256: async (...n) => {
                const e = await t.subtle.digest("SHA-256", U(...n));
                return new Uint8Array(e);
            },
            hmacSha256: async (n, ...e) => {
                const r = await t.subtle.importKey("raw", n, {
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                }, !1, ["sign"]),
                    i = U(...e),
                    s = await t.subtle.sign("HMAC", r, i);
                return new Uint8Array(s);
            },
            sha256Sync: void 0,
            hmacSha256Sync: void 0,
            taggedHash: async (n, ...t) => {
                let e = mn[n];
                if (void 0 === e) {
                    const t = await pn.sha256(Uint8Array.from(n, n => n.charCodeAt(0)));
                    e = U(t, t), mn[n] = e;
                }
                return pn.sha256(e, ...t);
            },
            taggedHashSync: (n, ...t) => {
                if ("function" != typeof D) throw new m("sha256Sync is undefined, you need to set it");
                let e = mn[n];
                if (void 0 === e) {
                    const t = D(Uint8Array.from(n, n => n.charCodeAt(0)));
                    e = U(t, t), mn[n] = e;
                }
                return D(e, ...t);
            },
            _JacobianPoint: b
        };
    Object.defineProperties(pn, {
        sha256Sync: {
            configurable: !1,
            get: () => D,
            set(n) {
                D || (D = n);
            }
        },
        hmacSha256Sync: {
            configurable: !1,
            get: () => Z,
            set(n) {
                Z || (Z = n);
            }
        }
    });
    var bn = Object.freeze({
        __proto__: null,
        CURVE: a,
        Point: E,
        Signature: B,
        getPublicKey: function (n, t = !1) {
            return E.fromPrivateKey(n).toRawBytes(t);
        },
        getSharedSecret: G,
        recoverPublicKey: function (n, t, e, r = !1) {
            return E.fromSignature(n, t, e).toRawBytes(r);
        },
        schnorr: gn,
        sign: sn,
        signSync: function (n, t, e = {}) {
            const {
                seed: r,
                m: i,
                d: s
            } = en(n, t, e.extraEntropy),
                o = new j(l, h);
            let a;
            for (o.reseedSync(r); !(a = W(o.generateSync(), i, s, e.canonical));) o.reseedSync();
            return rn(a, e);
        },
        utils: pn,
        verify: an
    });
    const xn = new TextEncoder(),
        An = [{
            name: "base58",
            charset: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        }, {
            name: "base64",
            charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        }, {
            name: "base64url",
            charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        }];
    function En(n) {
        for (const t of An) if (t.name === n) return t.charset;
        throw TypeError("Charset does not exist: " + n);
    }
    const vn = {
        encode: function (n, t, e = !1) {
            "string" == typeof n && (n = xn.encode(n));
            const r = En(t),
                i = r.length,
                s = [];
            let o,
                a,
                c,
                u = "",
                f = 0;
            for (o = 0; o < n.length; o++) for (f = 0, a = n[o], u += a > 0 || (u.length ^ o) > 0 ? "" : "1"; f in s || a > 0;) c = s[f], c = c > 0 ? 256 * c + a : a, a = c / i | 0, s[f] = c % i, f++;
            for (; f-- > 0;) u += r[s[f]];
            return e && u.length % 4 > 0 ? u + "=".repeat(4 - u.length % 4) : u;
        },
        decode: function (n, t) {
            const e = En(t),
                r = e.length,
                i = [],
                s = [];
            n = n.replace("=", "");
            let o,
                a,
                c,
                u = 0;
            for (o = 0; o < n.length; o++) {
                if (u = 0, a = e.indexOf(n[o]), a < 0) throw new Error(`Character range out of bounds: ${a}`);
                for (a > 0 || (s.length ^ o) > 0 || s.push(0); u in i || a > 0;) c = i[u], c = c > 0 ? c * r + a : a, a = c >> 8, i[u] = c % 256, u++;
            }
            for (; u-- > 0;) s.push(i[u]);
            return new Uint8Array(s);
        }
    },
        Sn = "qpzry9x8gf2tvdw0s3jn54khce6mua7l",
        Bn = [996825010, 642813549, 513874426, 1027748829, 705979059],
        Un = {
            BECH32: "bech32",
            BECH32M: "bech32m"
        };
    function Hn(n) {
        switch (n) {
            case Un.BECH32:
                return 1;
            case Un.BECH32M:
                return 734539939;
            default:
                throw new Error(`Unrecognized encoding: ${n}`);
        }
    }
    function In(n) {
        let t = 1;
        for (let e = 0; e < n.length; ++e) {
            const r = t >> 25;
            t = (33554431 & t) << 5 ^ n[e];
            for (let n = 0; n < 5; ++n) (r >> n & 1) > 0 && (t ^= Bn[n]);
        }
        return t;
    }
    function zn(n) {
        const t = [];
        let e;
        for (e = 0; e < n.length; ++e) t.push(n.charCodeAt(e) >> 5);
        for (t.push(0), e = 0; e < n.length; ++e) t.push(31 & n.charCodeAt(e));
        return t;
    }
    function Nn(n, t, e, r = !0) {
        const i = [];
        let s = 0,
            o = 0;
        const a = (1 << e) - 1,
            c = (1 << t + e - 1) - 1;
        for (const r of n) {
            if (r < 0 || r >> t > 0) return [];
            for (s = (s << t | r) & c, o += t; o >= e;) o -= e, i.push(s >> o & a);
        }
        if (r) o > 0 && i.push(s << e - o & a); else if (o >= t || (s << e - o & a) > 0) return [];
        return i;
    }
    function Rn(n, t, e) {
        const r = t.concat(function (n, t, e) {
            const r = In(zn(n).concat(t).concat([0, 0, 0, 0, 0, 0])) ^ Hn(e),
                i = [];
            for (let n = 0; n < 6; ++n) i.push(r >> 5 * (5 - n) & 31);
            return i;
        }(n, t, e));
        let i = n + "1";
        for (let n = 0; n < r.length; ++n) i += Sn.charAt(r[n]);
        return i;
    }
    function _n(n, t) {
        const e = t > 0 ? "bech32m" : "bech32";
        if (!function (n) {
            let t,
                e,
                r = !1,
                i = !1;
            for (t = 0; t < n.length; ++t) {
                if (e = n.charCodeAt(t), e < 33 || e > 126) return !1;
                e >= 97 && e <= 122 && (r = !0), e >= 65 && e <= 90 && (i = !0);
            }
            return !(r && i);
        }(n)) return {
            hrp: null,
            data: [255]
        };
        if (!function (n) {
            const t = n.lastIndexOf("1");
            return !(t < 1 || t + 7 > n.length || n.length > 90);
        }(n = n.toLowerCase())) return {
            hrp: null,
            data: [255]
        };
        const r = [],
            i = n.lastIndexOf("1"),
            s = n.substring(0, i);
        for (let t = i + 1; t < n.length; ++t) {
            const e = Sn.indexOf(n.charAt(t));
            if (-1 === e) return {
                hrp: null,
                data: [255]
            };
            r.push(e);
        }
        return function (n, t, e) {
            return In(zn(n).concat(t)) === Hn(e);
        }(s, r, e) ? {
            hrp: s,
            data: r.slice(0, r.length - 6)
        } : {
            hrp: null,
            data: [255]
        };
    }
    function kn(n, t = 0) {
        const e = n.split("1", 1)[0],
            {
                hrp: r,
                data: i
            } = _n(n, t),
            s = Nn(i.slice(1), 5, 8, !1),
            o = s.length;
        switch (!0) {
            case e !== r:
                throw new Error("Returned hrp string is invalid.");
            case null === s || o < 2 || o > 40:
                throw new Error("Decoded string is invalid or out of spec.");
            case i[0] > 16:
                throw new Error("Returned version bit is out of range.");
            case 0 === i[0] && 20 !== o && 32 !== o:
                throw new Error("Decoded string does not match version 0 spec.");
            case 0 === i[0] && 0 !== t:
            case 0 !== i[0] && 1 !== t:
                throw new Error("Decoded version bit does not match.");
            default:
                return Uint8Array.from(s);
        }
    }
    const Pn = {
        encode: function (n, t = "bch", e = 0) {
            const r = Rn(t, [e, ...Nn([...n], 8, 5)], e > 0 ? "bech32m" : "bech32");
            return kn(r, e), r;
        },
        decode: kn
    },
        Cn = new TextEncoder(),
        Tn = new TextDecoder();
    function On(n) {
        return Cn.encode(n);
    }
    function $n(n) {
        const t = [];
        let e,
            r = 0;
        if (n.length % 2 > 0) throw new Error(`Invalid hex string length: ${n.length}`);
        for (e = 0; e < n.length; e += 2) t[r] = parseInt(n.slice(e, e + 2), 16), r += 1;
        return Uint8Array.from(t);
    }
    function Kn(n) {
        const t = [];
        for (; n > 0;) {
            const e = 255 & n;
            t.push(e), n = (n - e) / 256;
        }
        return Uint8Array.from(t);
    }
    function Vn(n) {
        const t = [];
        for (; n > 0n;) {
            const e = 0xffn & n;
            t.push(Number(e)), n = (n - e) / 256n;
        }
        return Uint8Array.from(t);
    }
    function qn(n) {
        return Tn.decode(n);
    }
    function Dn(n) {
        let t,
            e = 0;
        for (t = n.length - 1; t >= 0; t--) e = 256 * e + n[t];
        return Number(e);
    }
    function Zn(n) {
        let t,
            e = 0n;
        for (t = n.length - 1; t >= 0; t--) e = 256n * e + BigInt(n[t]);
        return BigInt(e);
    }
    async function jn(n) {
        return crypto.subtle.digest("SHA-256", n).then(n => new Uint8Array(n));
    }
    async function Xn(n) {
        return jn(await jn(n));
    }
    const {
        crypto: Yn
    } = globalThis;
    class Wn extends Uint8Array {
        static async b58check(n) {
            const t = vn.decode(n, "base58");
            return new Wn(await async function (n) {
                const t = n.slice(0, -4),
                    e = n.slice(-4);
                if ((await Xn(t)).slice(0, 4).toString() !== e.toString()) throw new Error("Invalid checksum!");
                return t;
            }(t));
        }
        constructor(n, t = null, e = "be") {
            if (null !== t) {
                const e = new Uint8Array(t).fill(0);
                e.set(new Uint8Array(n)), n = e.buffer;
            }
            return super(n = "le" === e ? new Uint8Array(n).reverse() : n), this;
        }
        get num() {
            return this.toNum();
        }
        get big() {
            return this.toBig();
        }
        get arr() {
            return this.toArr();
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
        get hash() {
            return this.toHash();
        }
        get id() {
            return this.toHash().then(n => new Wn(n).hex);
        }
        toNum(n = "le") {
            return Dn("le" === n ? this.reverse() : this);
        }
        toBig(n = "le") {
            return Zn("le" === n ? this.reverse() : this);
        }
        async toHash() {
            return Yn.subtle.digest("SHA-256", this.raw).then(n => new Uint8Array(n));
        }
        async tob58check() {
            return vn.encode(await async function (n) {
                const t = await Xn(n);
                return Uint8Array.of(...n, ...t.slice(0, 4));
            }(this), "base58");
        }
        toArr() {
            return Array.from(this);
        }
        toStr() {
            return qn(this);
        }
        toHex() {
            return function (n) {
                const t = [];
                let e;
                for (e = 0; e < n.length; e++) t.push(n[e].toString(16).padStart(2, "0"));
                return t.join("");
            }(this);
        }
        toJson() {
            return JSON.parse(qn(this));
        }
        toBytes() {
            return new Uint8Array(this);
        }
        toB64url() {
            return vn.encode(this, "base64url");
        }
        toBase64(n) {
            return vn.encode(this, "base64", n);
        }
        toBech32(n, t) {
            return Pn.encode(this, n, t);
        }
        prepend(n) {
            return Wn.of(...n, ...this);
        }
        append(n) {
            return Wn.of(...this, ...n);
        }
        slice(n, t) {
            return new Wn(new Uint8Array(this).slice(n, t));
        }
        reverse() {
            return new Wn(new Uint8Array(this).reverse());
        }
        write(n, t) {
            this.set(n, t);
        }
        prependVarint(n = this.length) {
            return Wn.of(...Wn.readVarint(n), ...this);
        }
        static from(n) {
            return new Wn(Uint8Array.from(n));
        }
        static of(...n) {
            return new Wn(Uint8Array.of(...n));
        }
        static join(n) {
            let t,
                e = 0;
            const r = n.reduce((n, t) => n + t.length, 0),
                i = new Uint8Array(r);
            for (const r of n) for (t = 0; t < r.length; e++, t++) i[e] = r[t];
            return new Wn(i, r);
        }
        static readVarint(n) {
            if (n < 253) return Wn.num(n, 1);
            if (n < 65536) return Wn.of(253, ...Wn.num(n, 2));
            if (n < 4294967296) return Wn.of(254, ...Wn.num(n, 4));
            if (n < 0x10000000000000000) return Wn.of(255, ...Wn.num(n, 8));
            throw new Error(`Value is too large: ${n}`);
        }
        static random(n = 32) {
            return new Wn(Yn.getRandomValues(new Uint8Array(n)));
        }
        static normalize(n, t) {
            if (n instanceof Uint8Array) return n;
            if ("string" == typeof n) return Wn.hex(n, t).toBytes();
            if ("number" == typeof n) return Wn.num(n, t).toBytes();
            if ("bigint" == typeof n) return Wn.big(n, t).toBytes();
            throw TypeError("Unrecognized format: " + typeof n);
        }
        static serialize(n) {
            if ("string" == typeof n) return Wn.str(n).toBytes();
            if ("object" == typeof n) {
                if (n instanceof Uint8Array) return n;
                try {
                    return Wn.json(n).toBytes();
                } catch {
                    throw TypeError("Object is not serializable.");
                }
            }
            throw TypeError("Unrecognized format: " + typeof n);
        }
        static revitalize(n) {
            if (n instanceof Uint8Array && (n = qn(n)), "string" == typeof n) try {
                return JSON.parse(n);
            } catch {
                return n;
            }
            return n;
        }
    }
    _Wn = Wn;
    _Wn.num = (n, t, e = "le") => new _Wn(Kn(n), t, e);
    _Wn.big = (n, t, e = "le") => new _Wn(Vn(n), t, e);
    _Wn.buff = (n, t) => new _Wn(function (n) {
        if (n instanceof ArrayBuffer) return new Uint8Array(n);
        if (n instanceof Uint8Array) return n;
        const t = typeof n;
        switch (t) {
            case "bigint":
                return Vn(n);
            case "boolean":
                return Uint8Array.of(n);
            case "number":
                return Kn(n);
            case "string":
                return null !== n.match(/^(02|03)*[0-9a-fA-F]{64}$/) ? $n(n) : Cn.encode(n);
            default:
                throw TypeError("Unsupported format:" + t);
        }
    }(n), t);
    _Wn.raw = (n, t) => new _Wn(n, t);
    _Wn.str = (n, t) => new _Wn(On(n), t);
    _Wn.hex = (n, t) => new _Wn($n(n), t);
    _Wn.json = n => new _Wn(On(JSON.stringify(n)));
    _Wn.base64 = n => new _Wn(vn.decode(n, "base64"));
    _Wn.b64url = n => new _Wn(vn.decode(n, "base64url"));
    _Wn.bech32 = (n, t) => new _Wn(Pn.decode(n, t));
    _Wn.encode = On;
    _Wn.decode = qn;
    const Fn = globalThis.crypto;
    async function Mn(n, t) {
        return G(Wn.normalize(n), Wn.normalize(t), !0);
    }
    async function Jn(n) {
        return Fn.subtle.importKey("raw", Wn.normalize(n), {
            name: "AES-CBC"
        }, !0, ["encrypt", "decrypt"]);
    }
    const Ln = {
        ecdh: Mn,
        import: Jn,
        export: async function (n) {
            return Fn.subtle.exportKey("raw", n).then(n => new Uint8Array(n));
        },
        hmac: async function (n, t = "SHA-256") {
            const e = {
                name: "HMAC",
                hash: t
            };
            return Fn.subtle.importKey("raw", Wn.normalize(n), e, !1, ["sign", "verify"]);
        },
        shared: async function (n, t) {
            return Jn((await Mn(n, t)).slice(1, 33));
        },
        generate: async function () {
            return Jn(Wn.random(32));
        },
        normalize: async function (n) {
            return n instanceof CryptoKey ? n : Ln.import(n);
        }
    },
        Gn = globalThis.crypto;
    class Qn {
        static async fromSecret(n) {
            const t = await Ln.normalize(n);
            return new Qn(t);
        }
        static async fromShared(n, t) {
            const e = await Ln.shared(n, t);
            return new Qn(e);
        }
        static async encrypt(n, t, e) {
            const r = Wn.normalize(t),
                i = await Ln.normalize(n),
                s = void 0 !== e ? Wn.normalize(e) : Wn.random(16);
            return Gn.subtle.encrypt({
                name: "AES-CBC",
                iv: s
            }, i, r).then(n => Uint8Array.of(...s, ...new Uint8Array(n)));
        }
        static async decrypt(n, t, e) {
            const r = Wn.normalize(t),
                i = await Ln.normalize(n),
                s = void 0 !== e ? r : r.slice(16),
                o = void 0 !== e ? Wn.normalize(e) : r.slice(0, 16);
            return Gn.subtle.decrypt({
                name: "AES-CBC",
                iv: o
            }, i, s).then(n => new Uint8Array(n));
        }
        constructor(n) {
            this.key = n;
        }
        get secretKey() {
            return Ln.export(this.key);
        }
        get secretHex() {
            return this.secretKey.then(n => Wn.buff(n).toHex());
        }
        async encrypt(n, t) {
            return Qn.encrypt(this.key, n, t);
        }
        async decrypt(n, t) {
            return Qn.decrypt(this.key, n, t);
        }
    }
    class nt extends Uint8Array {
        static mod(n, t = nt.N) {
            return pn.mod(n, t);
        }
        static normalize(n) {
            return n = et(n), n = nt.mod(n), n = pn._normalizePrivateKey(n), Wn.big(n, 32).raw;
        }
        static validate(n) {
            return pn.isValidPrivateKey(n);
        }
        constructor(n) {
            super(n = nt.normalize(n));
        }
        get buff() {
            return new Wn(this);
        }
        get raw() {
            return this;
        }
        get num() {
            return this.buff.toBig();
        }
        get point() {
            return tt.fromNum(this.num);
        }
        get hasOddY() {
            return this.point.hasOddY;
        }
        get negated() {
            return this.hasOddY ? this.negate() : this;
        }
        gt(n) {
            return new nt(n).num > this.num;
        }
        lt(n) {
            return new nt(n).num < this.num;
        }
        eq(n) {
            return new nt(n).num === this.num;
        }
        ne(n) {
            return new nt(n).num !== this.num;
        }
        add(n) {
            const t = new nt(n);
            return new nt(this.num + t.num);
        }
        sub(n) {
            const t = new nt(n);
            return new nt(this.num - t.num);
        }
        mul(n) {
            const t = new nt(n);
            return new nt(this.num * t.num);
        }
        pow(n, t = nt.N - 1n) {
            const e = new nt(n),
                r = nt.mod(e.num, t);
            return new nt(this.num ** r);
        }
        div(n) {
            const t = new nt(n),
                e = this.pow(t.num, nt.N - 2n);
            return new nt(this.num * e.num);
        }
        negate() {
            return new nt(nt.N - this.num);
        }
    }
    _nt = nt;
    _nt.N = a.n;
    _nt.isField = n => n instanceof _nt;
    class tt {
        static validate(n) {
            try {
                n = et(n);
                const t = Wn.big(n).toHex();
                return E.fromHex(t).assertValidity(), !0;
            } catch {
                return !1;
            }
        }
        static fromNum(n) {
            n = et(n);
            const t = pn.mod(n, tt.N),
                e = E.BASE.multiply(t);
            return new tt(e.x, e.y);
        }
        static fromX(n) {
            n = et(n);
            const t = Wn.big(n).toHex();
            return tt.from(E.fromHex(t));
        }
        static from(n) {
            return new tt(n.x, n.y);
        }
        constructor(n, t) {
            this.__p = new E(n, t), this.__x = this.__p.x, this.__y = this.__p.y, this.__p.assertValidity();
        }
        get p() {
            return this.__p;
        }
        get buff() {
            return new Wn(this.rawX.slice(1));
        }
        get hex() {
            return this.buff.hex;
        }
        get hasOddY() {
            return !this.__p.hasEvenY();
        }
        get rawX() {
            const n = this.__p.hasEvenY() ? 2 : 3,
                t = Wn.big(this.__x);
            return Uint8Array.of(n, ...t);
        }
        get rawY() {
            return Wn.big(this.__y);
        }
        get x() {
            return this.__x;
        }
        get y() {
            return this.__y;
        }
        eq(n) {
            return n instanceof tt ? this.p.equals(new E(n.x, n.y)) : n instanceof Uint8Array ? this.x.toString() === n.toString() : "number" == typeof n ? BigInt(n) === this.x : n === this.x;
        }
        add(n) {
            return n instanceof tt ? tt.from(this.p.add(n.p)) : tt.from(this.p.add(tt.fromNum(n).p));
        }
        sub(n) {
            return n instanceof tt ? tt.from(this.p.subtract(n.p)) : tt.from(this.p.subtract(tt.fromNum(n).p));
        }
        mul(n) {
            return n instanceof tt ? tt.from(this.p.multiply(n.x)) : tt.from(this.p.multiply(et(n)));
        }
        negate() {
            return tt.from(this.__p.negate());
        }
    }
    _tt = tt;
    _tt.N = a.n;
    function et(n) {
        if (n instanceof Uint8Array) return Wn.raw(n).big;
        if ("string" == typeof n) return Wn.hex(n).big;
        if ("number" == typeof n) return BigInt(n);
        if ("bigint" == typeof n) return n;
        throw TypeError("Invalid input type:" + typeof n);
    }
    async function rt(n, t, e = "schnorr") {
        const r = Wn.normalize(n),
            i = Wn.normalize(t);
        return "schnorr" === e ? gn.sign(r, i) : sn(r, i);
    }
    async function it(n, t, e, r = "schnorr") {
        const i = Wn.normalize(n),
            s = Wn.normalize(t),
            o = Wn.normalize(e);
        return "schnorr" === r ? gn.verify(o, i, (a = s).length > 32 ? a.slice(1) : a) : an(o, i, s);
        var a;
    }
    class st {
        static generate() {
            return new st(Wn.random(32));
        }
        constructor(n) {
            this._buffer = Wn.normalize(n, 32);
        }
        get field() {
            return new nt(this._buffer);
        }
        get point() {
            return this.field.point;
        }
        get buff() {
            return new Wn(this._buffer);
        }
        get raw() {
            return new Uint8Array(this._buffer);
        }
        get hex() {
            return this.buff.hex;
        }
        get pub() {
            return new ot(this.point.rawX);
        }
        async sign(n, t) {
            return rt(Wn.normalize(n), this.raw, t);
        }
        async verify(n, t, e) {
            return it(n, this.pub.raw, t, e);
        }
    }
    class ot {
        static generate() {
            return new st(Wn.random(32)).pub;
        }
        constructor(n) {
            this._buffer = Wn.normalize(n);
        }
        get raw() {
            return new Uint8Array(this._buffer);
        }
        get rawX() {
            return this.raw.length > 32 ? this.raw.slice(1, 33) : this.raw;
        }
        get buff() {
            return new Wn(this.raw);
        }
        get hex() {
            return this.buff.hex;
        }
        async verify(n, t, e) {
            return it(n, this.raw, t, e);
        }
    }
    function at(n) {
        let t = 0n;
        for (let e = n.length - 1; e >= 0; e--) t = 256n * t + BigInt(n[e]);
        return BigInt(t);
    }
    function ct(n, t = 0) {
        const e = [];
        for (; n > 0;) {
            const t = 0xffn & n;
            e.push(t), n = (n - t) / 256n;
        }
        let r = Uint8Array.from(e.map(n => Number(n)));
        if (0 !== t) {
            const n = new Uint8Array(t);
            n.set(r), r = n;
        }
        return r;
    }
    const ut = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n, 15n, 7n, 4n, 13n, 1n, 10n, 6n, 15n, 3n, 12n, 0n, 9n, 5n, 2n, 14n, 11n, 8n, 3n, 10n, 14n, 4n, 9n, 15n, 8n, 1n, 2n, 7n, 0n, 6n, 13n, 11n, 5n, 12n, 1n, 9n, 11n, 10n, 0n, 8n, 12n, 4n, 13n, 3n, 7n, 15n, 14n, 5n, 6n, 2n, 4n, 0n, 5n, 9n, 7n, 12n, 2n, 10n, 14n, 1n, 3n, 8n, 11n, 6n, 15n, 13n],
        ft = [5n, 14n, 7n, 0n, 9n, 2n, 11n, 4n, 13n, 6n, 15n, 8n, 1n, 10n, 3n, 12n, 6n, 11n, 3n, 7n, 0n, 13n, 5n, 10n, 14n, 15n, 8n, 12n, 4n, 9n, 1n, 2n, 15n, 5n, 1n, 3n, 7n, 14n, 6n, 9n, 11n, 8n, 12n, 2n, 10n, 0n, 4n, 13n, 8n, 6n, 4n, 1n, 3n, 11n, 15n, 0n, 5n, 12n, 2n, 13n, 9n, 7n, 10n, 14n, 12n, 15n, 10n, 4n, 1n, 5n, 8n, 7n, 6n, 2n, 13n, 14n, 0n, 3n, 9n, 11n],
        ht = [11n, 14n, 15n, 12n, 5n, 8n, 7n, 9n, 11n, 13n, 14n, 15n, 6n, 7n, 9n, 8n, 7n, 6n, 8n, 13n, 11n, 9n, 7n, 15n, 7n, 12n, 15n, 9n, 11n, 7n, 13n, 12n, 11n, 13n, 6n, 7n, 14n, 9n, 13n, 15n, 14n, 8n, 13n, 6n, 5n, 12n, 7n, 5n, 11n, 12n, 14n, 15n, 14n, 15n, 9n, 8n, 9n, 14n, 5n, 6n, 8n, 6n, 5n, 12n, 9n, 15n, 5n, 11n, 6n, 8n, 13n, 12n, 5n, 12n, 13n, 14n, 11n, 8n, 5n, 6n],
        lt = [8n, 9n, 9n, 11n, 13n, 15n, 15n, 5n, 7n, 7n, 8n, 11n, 14n, 14n, 12n, 6n, 9n, 13n, 15n, 7n, 12n, 8n, 9n, 11n, 7n, 7n, 12n, 7n, 6n, 15n, 13n, 11n, 9n, 7n, 15n, 11n, 8n, 6n, 6n, 14n, 12n, 13n, 5n, 14n, 13n, 13n, 7n, 5n, 15n, 5n, 8n, 11n, 14n, 14n, 6n, 14n, 6n, 9n, 12n, 9n, 12n, 5n, 15n, 8n, 8n, 5n, 12n, 9n, 12n, 5n, 14n, 6n, 8n, 13n, 6n, 5n, 15n, 13n, 11n, 11n],
        yt = [0n, 0x5a827999n, 0x6ed9eba1n, 0x8f1bbcdcn, 0xa953fd4en],
        dt = [0x50a28be6n, 0x5c4dd124n, 0x6d703ef3n, 0x7a6d76e9n, 0n];
    function gt(n, t, e, r) {
        switch (!0) {
            case 0n === r:
                return n ^ t ^ e;
            case 1n === r:
                return n & t | ~n & e;
            case 2n === r:
                return (n | ~t) ^ e;
            case 3n === r:
                return n & e | t & ~e;
            case 4n === r:
                return n ^ (t | ~e);
            default:
                throw new TypeError("Unknown I value: " + String(r));
        }
    }
    function wt(n, t) {
        return 0xffffffffn & (n << t | (0xffffffffn & n) >> 32n - t);
    }
    function mt(n, t, e, r, i, s) {
        const o = [];
        let a,
            c,
            u,
            f,
            h,
            l,
            y,
            d = n,
            g = t,
            w = e,
            m = r,
            p = i,
            b = n,
            x = t,
            A = e,
            E = r,
            v = i;
        for (let n = 0; n < 16; n++) {
            const t = at(s.slice(4 * n, 4 * (n + 1)));
            o.push(t);
        }
        for (let n = 0; n < 80; n++) a = BigInt(n) >> 4n, f = o[Number(ut[n])], h = yt[Number(a)], l = o[Number(ft[n])], y = dt[Number(a)], d = wt(d + gt(g, w, m, a) + f + h, ht[n]) + p, c = p, p = m, m = wt(w, 10n), w = g, g = d, d = c, b = wt(b + gt(x, A, E, 4n - a) + l + y, lt[n]) + v, u = v, v = E, E = wt(A, 10n), A = x, x = b, b = u;
        return [t + w + E, e + m + v, r + p + b, i + d + x, n + g + A];
    }
    const pt = globalThis.crypto;
    async function bt(n, t = "SHA-256", e = 1, r = n => n) {
        let i,
            s = n instanceof ArrayBuffer ? n : Wn.normalize(n).buffer;
        for (i = 0; i < e; i++) s = await pt.subtle.digest(t, s), r(s);
        return new Uint8Array(s);
    }
    async function xt(n) {
        return bt(n, "SHA-256");
    }
    function At(n) {
        return function (n) {
            let t = [0x67452301n, 0xefcdab89n, 0x98badcfen, 0x10325476n, 0xc3d2e1f0n];
            for (let e = 0; e < n.length >> 6; e++) t = mt(...t, n.slice(64 * e, 64 * (e + 1)));
            const e = [128, ...new Array(119 - n.length & 63).fill(0)],
                r = Uint8Array.from([...n.slice(-64 & n.length), ...e, ...ct(BigInt(8 * n.length), 8)]);
            for (let n = 0; n < r.length >> 6; n++) t = mt(...t, r.slice(64 * n, 64 * (n + 1)));
            const i = [];
            for (let n = 0; n < t.length; n++) {
                const e = 0xffffffffn & t[n];
                i.push(...ct(e, 4));
            }
            return Uint8Array.from(i);
        }(n = Wn.normalize(n));
    }
    const Et = {
        data: async function (n) {
            return xt(Wn.serialize(n)).then(n => new Uint8Array(n));
        },
        digest: bt,
        ripe160: At,
        sha256: xt,
        sha512: async function (n) {
            return bt(n, "SHA-512");
        },
        hash160: async function (n) {
            return At(await xt(n));
        },
        hash256: async function (n) {
            return bt(n, "SHA-256", 2);
        },
        hmac256: async function (n, t) {
            const e = await Ln.hmac(n, "SHA-256");
            return pt.subtle.sign("HMAC", e, Wn.normalize(t)).then(n => new Uint8Array(n));
        },
        hmac512: async function (n, t) {
            const e = await Ln.hmac(n, "SHA-512");
            return pt.subtle.sign("HMAC", e, Wn.normalize(t)).then(n => new Uint8Array(n));
        }
    };
    return n.Cipher = Qn, n.Field = nt, n.Hash = Et, n.KeyPair = st, n.KeyUtil = Ln, n.Noble = bn, n.Point = tt, n.PubKey = ot, n.sign = rt, n.verify = it, n;
}({});