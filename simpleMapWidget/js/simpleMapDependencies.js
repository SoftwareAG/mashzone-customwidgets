/*
 * Copyright © 2013 - 2018 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.                                                            
 *
 */
angular.module('simpleMapWidgetModule')
  .service('jQuery', ['$window', function($window) {
    // License - N/A built into MashZone
    return $window.jQuery;
  }])
  .service('UtilX_smw', [function() {
    /**
     * this contains some utils I find useful inside the widgets. Most of it has been taken from internet forums (stackoverflow...)
     * and is therefore not my work
     */
    var UtilX = {
      generateUUID: function() {
        function s(n) {
          return h((Math.random() * (1 << (n << 2))) ^ Date.now()).slice(-n);
        }

        function h(n) {
          return (n | 0).toString(16);
        }
        return "X" + [
          s(4) + s(4), s(4),
          '4' + s(3), // UUID version 4
          h(8 | (Math.random() * 4)) + s(3), // {8|9|A|B}xxx
          // s(4) + s(4) + s(4),
          Date.now().toString(16).slice(-10) + s(2) // Use timestamp to avoid collisions
        ].join('-');
      }
    }
    return UtilX;
  }])
  .service('leafletPromise_smw', ['$q', '$window', 'jQuery', function($q, $window, jQuery) {
    var deferred = $q.defer();
    jQuery.getScript("/mashzone/hub/dashboard/widgets/customWidgets/simpleMapWidget/js/leaflet.js.src")
      .done(function(script, textStatus) {
        deferred.resolve($window.L.noConflict());
      })
      .fail(function(jqxhr, settings, exception) {
        console.log("+-+-+- leaflet not loaded ", jqxhr);
      });
    return deferred.promise;
  }])
  .service('lodashPromise_smw', ['$q', '$window', 'jQuery', function($q, $window, jQuery) {
    // License - MIT
    var deferred = $q.defer();
    jQuery.getScript("/mashzone/hub/dashboard/widgets/customWidgets/simpleMapWidget/js/lodash.min.js.src", function() {
      deferred.resolve($window._.noConflict());
    });
    return deferred.promise;
  }])
  .service('d3-color_smw', [function() {
    // License - BSD
    var loadD3 = function() {
      // https://d3js.org/d3-color/ Version 1.0.2. Copyright 2016 Mike Bostock.
      ! function(t, e) { "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.d3 = t.d3 || {}) }(this, function(t) {
        "use strict";

        function e(t, e) { var n = Object.create(t.prototype); for (var i in e) n[i] = e[i]; return n }

        function n() {}

        function i(t) { var e; return t = (t + "").trim().toLowerCase(), (e = S.exec(t)) ? (e = parseInt(e[1], 16), new h(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | 240 & e, (15 & e) << 4 | 15 & e, 1)) : (e = _.exec(t)) ? r(parseInt(e[1], 16)) : (e = z.exec(t)) ? new h(e[1], e[2], e[3], 1) : (e = C.exec(t)) ? new h(255 * e[1] / 100, 255 * e[2] / 100, 255 * e[3] / 100, 1) : (e = L.exec(t)) ? a(e[1], e[2], e[3], e[4]) : (e = A.exec(t)) ? a(255 * e[1] / 100, 255 * e[2] / 100, 255 * e[3] / 100, e[4]) : (e = B.exec(t)) ? l(e[1], e[2] / 100, e[3] / 100, 1) : (e = D.exec(t)) ? l(e[1], e[2] / 100, e[3] / 100, e[4]) : F.hasOwnProperty(t) ? r(F[t]) : "transparent" === t ? new h(NaN, NaN, NaN, 0) : null }

        function r(t) { return new h(t >> 16 & 255, t >> 8 & 255, 255 & t, 1) }

        function a(t, e, n, i) { return i <= 0 && (t = e = n = NaN), new h(t, e, n, i) }

        function s(t) { return t instanceof n || (t = i(t)), t ? (t = t.rgb(), new h(t.r, t.g, t.b, t.opacity)) : new h }

        function o(t, e, n, i) { return 1 === arguments.length ? s(t) : new h(t, e, n, null == i ? 1 : i) }

        function h(t, e, n, i) { this.r = +t, this.g = +e, this.b = +n, this.opacity = +i }

        function l(t, e, n, i) { return i <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new g(t, e, n, i) }

        function u(t) {
          if (t instanceof g) return new g(t.h, t.s, t.l, t.opacity);
          if (t instanceof n || (t = i(t)), !t) return new g;
          if (t instanceof g) return t;
          t = t.rgb();
          var e = t.r / 255,
            r = t.g / 255,
            a = t.b / 255,
            s = Math.min(e, r, a),
            o = Math.max(e, r, a),
            h = NaN,
            l = o - s,
            u = (o + s) / 2;
          return l ? (h = e === o ? (r - a) / l + 6 * (r < a) : r === o ? (a - e) / l + 2 : (e - r) / l + 4, l /= u < .5 ? o + s : 2 - o - s, h *= 60) : l = u > 0 && u < 1 ? 0 : h, new g(h, l, u, t.opacity)
        }

        function c(t, e, n, i) { return 1 === arguments.length ? u(t) : new g(t, e, n, null == i ? 1 : i) }

        function g(t, e, n, i) { this.h = +t, this.s = +e, this.l = +n, this.opacity = +i }

        function d(t, e, n) { return 255 * (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) }

        function p(t) {
          if (t instanceof b) return new b(t.l, t.a, t.b, t.opacity);
          if (t instanceof v) { var e = t.h * G; return new b(t.l, Math.cos(e) * t.c, Math.sin(e) * t.c, t.opacity) }
          t instanceof h || (t = s(t));
          var n = k(t.r),
            i = k(t.g),
            r = k(t.b),
            a = y((.4124564 * n + .3575761 * i + .1804375 * r) / K),
            o = y((.2126729 * n + .7151522 * i + .072175 * r) / Q),
            l = y((.0193339 * n + .119192 * i + .9503041 * r) / T);
          return new b(116 * o - 16, 500 * (a - o), 200 * (o - l), t.opacity)
        }

        function f(t, e, n, i) { return 1 === arguments.length ? p(t) : new b(t, e, n, null == i ? 1 : i) }

        function b(t, e, n, i) { this.l = +t, this.a = +e, this.b = +n, this.opacity = +i }

        function y(t) { return t > X ? Math.pow(t, 1 / 3) : t / W + U }

        function w(t) { return t > V ? t * t * t : W * (t - U) }

        function m(t) { return 255 * (t <= .0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - .055) }

        function k(t) { return (t /= 255) <= .04045 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4) }

        function N(t) {
          if (t instanceof v) return new v(t.h, t.c, t.l, t.opacity);
          t instanceof b || (t = p(t));
          var e = Math.atan2(t.b, t.a) * H;
          return new v(e < 0 ? e + 360 : e, Math.sqrt(t.a * t.a + t.b * t.b), t.l, t.opacity)
        }

        function M(t, e, n, i) { return 1 === arguments.length ? N(t) : new v(t, e, n, null == i ? 1 : i) }

        function v(t, e, n, i) { this.h = +t, this.c = +e, this.l = +n, this.opacity = +i }

        function x(t) {
          if (t instanceof E) return new E(t.h, t.s, t.l, t.opacity);
          t instanceof h || (t = s(t));
          var e = t.r / 255,
            n = t.g / 255,
            i = t.b / 255,
            r = (at * i + it * e - rt * n) / (at + it - rt),
            a = i - r,
            o = (nt * (n - r) - tt * a) / et,
            l = Math.sqrt(o * o + a * a) / (nt * r * (1 - r)),
            u = l ? Math.atan2(o, a) * H - 120 : NaN;
          return new E(u < 0 ? u + 360 : u, l, r, t.opacity)
        }

        function q(t, e, n, i) { return 1 === arguments.length ? x(t) : new E(t, e, n, null == i ? 1 : i) }

        function E(t, e, n, i) { this.h = +t, this.s = +e, this.l = +n, this.opacity = +i }
        var $ = function(t, e, n) { t.prototype = e.prototype = n, n.constructor = t },
          R = .7,
          j = 1 / R,
          I = "\\s*([+-]?\\d+)\\s*",
          P = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
          O = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
          S = /^#([0-9a-f]{3})$/,
          _ = /^#([0-9a-f]{6})$/,
          z = new RegExp("^rgb\\(" + [I, I, I] + "\\)$"),
          C = new RegExp("^rgb\\(" + [O, O, O] + "\\)$"),
          L = new RegExp("^rgba\\(" + [I, I, I, P] + "\\)$"),
          A = new RegExp("^rgba\\(" + [O, O, O, P] + "\\)$"),
          B = new RegExp("^hsl\\(" + [P, O, O] + "\\)$"),
          D = new RegExp("^hsla\\(" + [P, O, O, P] + "\\)$"),
          F = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, rebeccapurple: 6697881, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 };
        $(n, i, { displayable: function() { return this.rgb().displayable() }, toString: function() { return this.rgb() + "" } }), $(h, o, e(n, { brighter: function(t) { return t = null == t ? j : Math.pow(j, t), new h(this.r * t, this.g * t, this.b * t, this.opacity) }, darker: function(t) { return t = null == t ? R : Math.pow(R, t), new h(this.r * t, this.g * t, this.b * t, this.opacity) }, rgb: function() { return this }, displayable: function() { return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1 }, toString: function() { var t = this.opacity; return t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t)), (1 === t ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (1 === t ? ")" : ", " + t + ")") } })), $(g, c, e(n, {
          brighter: function(t) { return t = null == t ? j : Math.pow(j, t), new g(this.h, this.s, this.l * t, this.opacity) },
          darker: function(t) { return t = null == t ? R : Math.pow(R, t), new g(this.h, this.s, this.l * t, this.opacity) },
          rgb: function() {
            var t = this.h % 360 + 360 * (this.h < 0),
              e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
              n = this.l,
              i = n + (n < .5 ? n : 1 - n) * e,
              r = 2 * n - i;
            return new h(d(t >= 240 ? t - 240 : t + 120, r, i), d(t, r, i), d(t < 120 ? t + 240 : t - 120, r, i), this.opacity)
          },
          displayable: function() { return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1 }
        }));
        var G = Math.PI / 180,
          H = 180 / Math.PI,
          J = 18,
          K = .95047,
          Q = 1,
          T = 1.08883,
          U = 4 / 29,
          V = 6 / 29,
          W = 3 * V * V,
          X = V * V * V;
        $(b, f, e(n, {
          brighter: function(t) { return new b(this.l + J * (null == t ? 1 : t), this.a, this.b, this.opacity) },
          darker: function(t) { return new b(this.l - J * (null == t ? 1 : t), this.a, this.b, this.opacity) },
          rgb: function() {
            var t = (this.l + 16) / 116,
              e = isNaN(this.a) ? t : t + this.a / 500,
              n = isNaN(this.b) ? t : t - this.b / 200;
            return t = Q * w(t), e = K * w(e), n = T * w(n), new h(m(3.2404542 * e - 1.5371385 * t - .4985314 * n), m(-.969266 * e + 1.8760108 * t + .041556 * n), m(.0556434 * e - .2040259 * t + 1.0572252 * n), this.opacity)
          }
        })), $(v, M, e(n, { brighter: function(t) { return new v(this.h, this.c, this.l + J * (null == t ? 1 : t), this.opacity) }, darker: function(t) { return new v(this.h, this.c, this.l - J * (null == t ? 1 : t), this.opacity) }, rgb: function() { return p(this).rgb() } }));
        var Y = -.14861,
          Z = 1.78277,
          tt = -.29227,
          et = -.90649,
          nt = 1.97294,
          it = nt * et,
          rt = nt * Z,
          at = Z * tt - et * Y;
        $(E, q, e(n, {
          brighter: function(t) { return t = null == t ? j : Math.pow(j, t), new E(this.h, this.s, this.l * t, this.opacity) },
          darker: function(t) { return t = null == t ? R : Math.pow(R, t), new E(this.h, this.s, this.l * t, this.opacity) },
          rgb: function() {
            var t = isNaN(this.h) ? 0 : (this.h + 120) * G,
              e = +this.l,
              n = isNaN(this.s) ? 0 : this.s * e * (1 - e),
              i = Math.cos(t),
              r = Math.sin(t);
            return new h(255 * (e + n * (Y * i + Z * r)), 255 * (e + n * (tt * i + et * r)), 255 * (e + n * (nt * i)), this.opacity)
          }
        })), t.color = i, t.rgb = o, t.hsl = c, t.lab = f, t.hcl = M, t.cubehelix = q, Object.defineProperty(t, "__esModule", { value: !0 })
      });
    };
    return (new loadD3()).d3;
  }]);