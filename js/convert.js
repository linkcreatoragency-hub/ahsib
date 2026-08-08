/* ahsib.online — unit converters (length, weight, area, volume, temperature) */
(function () {
  "use strict";
  var A = window.A, $ = A.$;
  if (!$("cnvBtn")) return;

  var UNITS = {
    length: {
      name: "الطول", base: "متر",
      list: [
        ["mm", "ملّيمتر (mm)", 0.001], ["cm", "سنتيمتر (cm)", 0.01], ["dm", "ديسيمتر (dm)", 0.1],
        ["m", "متر (m)", 1], ["km", "كيلومتر (km)", 1000],
        ["in", "إنش (in)", 0.0254], ["ft", "قدم (ft)", 0.3048], ["yd", "ياردة (yd)", 0.9144],
        ["mi", "ميل (mi)", 1609.344], ["nmi", "ميل بحري (nmi)", 1852]
      ]
    },
    weight: {
      name: "الوزن", base: "كيلوغرام",
      list: [
        ["mg", "ملّيغرام (mg)", 0.000001], ["g", "غرام (g)", 0.001], ["kg", "كيلوغرام (kg)", 1],
        ["t", "طن متري (t)", 1000], ["q", "قنطار (100 كجم)", 100],
        ["oz", "أوقية (oz)", 0.028349523125], ["lb", "رطل / باوند (lb)", 0.45359237],
        ["st", "ستون (st)", 6.35029318]
      ]
    },
    area: {
      name: "المساحة", base: "متر مربع",
      list: [
        ["mm2", "ملّيمتر مربع", 0.000001], ["cm2", "سنتيمتر مربع", 0.0001], ["m2", "متر مربع", 1],
        ["km2", "كيلومتر مربع", 1000000], ["ha", "هكتار", 10000], ["dunam", "دونم (1000 م²)", 1000],
        ["ft2", "قدم مربع", 0.09290304], ["yd2", "ياردة مربعة", 0.83612736],
        ["acre", "فدّان إنجليزي (acre)", 4046.8564224], ["mi2", "ميل مربع", 2589988.110336]
      ]
    },
    volume: {
      name: "الحجم والسعة", base: "لتر",
      list: [
        ["ml", "ملّيلتر (ml)", 0.001], ["cl", "سنتيلتر (cl)", 0.01], ["l", "لتر (L)", 1],
        ["m3", "متر مكعب (m³)", 1000], ["cm3", "سنتيمتر مكعب (cm³)", 0.001],
        ["tsp", "ملعقة صغيرة", 0.0049289216], ["tbsp", "ملعقة كبيرة", 0.0147867648],
        ["cup", "كوب (240 مل)", 0.24], ["gal", "غالون أمريكي", 3.785411784],
        ["galuk", "غالون بريطاني", 4.54609], ["ft3", "قدم مكعب", 28.316846592]
      ]
    },
    temperature: {
      name: "درجة الحرارة", base: "درجة مئوية",
      list: [["c", "درجة مئوية (°C)", 1], ["f", "فهرنهايت (°F)", 1], ["k", "كلفن (K)", 1], ["r", "رانكين (°R)", 1]],
      temp: true
    }
  };

  var kind = window.CONV_KIND || "length";
  var U = UNITS[kind];
  var fromS = $("cnvFrom"), toS = $("cnvTo"), val = $("cnvVal");
  var r = { box: $("cnvRes"), big: $("cnvBig"), sub: $("cnvSub"), extra: $("cnvExtra") };
  var err = $("cnvErr");

  U.list.forEach(function (u) {
    [fromS, toS].forEach(function (s) {
      var o = document.createElement("option"); o.value = u[0]; o.textContent = u[1]; s.appendChild(o);
    });
  });
  fromS.value = U.list[window.CONV_FROM_IDX !== undefined ? window.CONV_FROM_IDX : 0][0];
  toS.value = U.list[window.CONV_TO_IDX !== undefined ? window.CONV_TO_IDX : U.list.length - 1][0];

  function label(code) {
    for (var i = 0; i < U.list.length; i++) if (U.list[i][0] === code) return U.list[i][1];
    return code;
  }
  function toBase(v, c) {
    if (!U.temp) { return v * factor(c); }
    if (c === "c") return v;
    if (c === "f") return (v - 32) * 5 / 9;
    if (c === "k") return v - 273.15;
    return (v - 491.67) * 5 / 9;
  }
  function fromBase(v, c) {
    if (!U.temp) { return v / factor(c); }
    if (c === "c") return v;
    if (c === "f") return v * 9 / 5 + 32;
    if (c === "k") return v + 273.15;
    return (v + 273.15) * 9 / 5;
  }
  function factor(c) {
    for (var i = 0; i < U.list.length; i++) if (U.list[i][0] === c) return U.list[i][2];
    return 1;
  }

  function convert() {
    A.clearErr(err);
    var v = parseFloat(String(val.value).replace(/,/g, ""));
    if (isNaN(v)) return A.showErr(err, "أدخل قيمة رقمية صحيحة.");
    var base = toBase(v, fromS.value);
    var out = fromBase(base, toS.value);
    r.big.innerHTML = A.fmtNum(out, 6) + " <span style='font-size:.62em;font-weight:600'>" + label(toS.value) + "</span>";
    r.sub.textContent = A.fmtNum(v, 6) + " " + label(fromS.value) + " تساوي " + A.fmtNum(out, 6) + " " + label(toS.value);
    var rows = U.list.map(function (u) {
      return "<tr><td>" + u[1] + "</td><td class='mono'>" + A.fmtNum(fromBase(base, u[0]), 6) + "</td></tr>";
    }).join("");
    r.extra.innerHTML = '<div class="tbl-wrap res-table"><table><caption class="hidden">جدول التحويل</caption><thead><tr><th>الوحدة</th><th>القيمة المكافئة</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
    r.box.classList.add("show");
  }

  $("cnvBtn").addEventListener("click", convert);
  val.addEventListener("keydown", function (e) { if (e.key === "Enter") convert(); });
  var sw = $("cnvSwap");
  if (sw) sw.addEventListener("click", function () {
    var a = fromS.value; fromS.value = toS.value; toS.value = a; convert();
  });
  [fromS, toS].forEach(function (s) { s.addEventListener("change", function () { if (r.box.classList.contains("show")) convert(); }); });
  if (val.value) convert();
})();
