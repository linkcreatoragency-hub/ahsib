/* ahsib.online — shared helpers */
(function () {
  "use strict";
  var H = window.Hijri;

  var G_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  var G_MONTHS_LONG = ["(1) يناير – كانون الثاني", "(2) فبراير – شباط", "(3) مارس – آذار",
    "(4) أبريل – نيسان", "(5) مايو – أيار", "(6) يونيو – حزيران", "(7) يوليو – تموز",
    "(8) أغسطس – آب", "(9) سبتمبر – أيلول", "(10) أكتوبر – تشرين الأول",
    "(11) نوفمبر – تشرين الثاني", "(12) ديسمبر – كانون الأول"];
  var H_MONTHS = ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
    "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
  var WD = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  function $(id) { return document.getElementById(id); }
  function opt(v, t) { var o = document.createElement("option"); o.value = v; o.textContent = t; return o; }

  function fillRange(sel, from, to, labels) {
    if (!sel) return;
    sel.innerHTML = "";
    var step = from <= to ? 1 : -1;
    for (var i = from; step > 0 ? i <= to : i >= to; i += step) {
      sel.appendChild(opt(i, labels ? labels[i - 1] : String(i)));
    }
  }

  /* Arabic counted-noun agreement: [one, two, 3-10, 11+/0] */
  var AR_DAY = ["يوم واحد", "يومان", "أيام", "يومًا"];
  var AR_MONTH = ["شهر واحد", "شهران", "أشهر", "شهرًا"];
  var AR_YEAR = ["سنة واحدة", "سنتان", "سنوات", "سنة"];
  var AR_WEEK = ["أسبوع واحد", "أسبوعان", "أسابيع", "أسبوعًا"];
  var AR_HOUR = ["ساعة واحدة", "ساعتان", "ساعات", "ساعة"];
  function arCount(n, f) {
    if (n === 1) return f[0];
    if (n === 2) return f[1];
    if (n >= 3 && n <= 10) return n + " " + f[2];
    return num(n) + " " + f[3];
  }
  function num(n) { return Number(n).toLocaleString("en-US"); }
  function round(n, d) { var p = Math.pow(10, d === undefined ? 2 : d); return Math.round(n * p) / p; }
  function fmtNum(n, d) {
    if (!isFinite(n)) return "—";
    var r = round(n, d === undefined ? 6 : d);
    return r.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 6 : d });
  }

  function gLen(y, m) {
    return [31, ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 29 : 28,
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  }
  function fmtG(o) { return o.day + " " + G_MONTHS[o.month - 1] + " " + o.year + " م"; }
  function fmtH(o) { return o.day + " " + H_MONTHS[o.month - 1] + " " + o.year + " هـ"; }
  function wdOf(jdn) { return WD[H.weekdayOfJdn(jdn)]; }

  /* Difference in y/m/d between two calendar dates (same calendar) */
  function ymd(y1, m1, d1, y2, m2, d2, lenFn) {
    var y = y2 - y1, m = m2 - m1, d = d2 - d1;
    if (d < 0) { m--; var pm = m2 - 1, py = y2; if (pm < 1) { pm = 12; py--; } d += lenFn(py, pm); }
    if (m < 0) { y--; m += 12; }
    return { y: y, m: m, d: d };
  }
  function ageText(a) {
    var p = [];
    if (a.y) p.push(arCount(a.y, AR_YEAR));
    if (a.m) p.push(arCount(a.m, AR_MONTH));
    if (a.d || !p.length) p.push(arCount(a.d, AR_DAY));
    return p.join(" و");
  }

  /* Populate a linked day/month/year triple. kind: "g" | "h" */
  function dateSelects(prefix, kind, def) {
    var dS = $(prefix + "D"), mS = $(prefix + "M"), yS = $(prefix + "Y");
    if (!dS || !mS || !yS) return null;
    var today = H.todayKSA();
    var th = H.gregorianToHijri(today.year, today.month, today.day);
    if (kind === "h") {
      fillRange(mS, 1, 12, H_MONTHS);
      fillRange(yS, H.MAX_YEAR, H.MIN_YEAR);
      yS.value = (def && def.y) || th.year;
      mS.value = (def && def.m) || th.month;
    } else {
      fillRange(mS, 1, 12, G_MONTHS_LONG);
      fillRange(yS, today.year + 60, 1900);
      yS.value = (def && def.y) || today.year;
      mS.value = (def && def.m) || today.month;
    }
    function syncDays() {
      var y = +yS.value, m = +mS.value, keep = +dS.value || (def && def.d) || (kind === "h" ? th.day : today.day);
      var max = kind === "h" ? H.monthLength(y, m) : gLen(y, m);
      fillRange(dS, 1, max);
      dS.value = Math.min(keep, max);
    }
    yS.addEventListener("change", syncDays);
    mS.addEventListener("change", syncDays);
    syncDays();
    dS.value = (def && def.d) || (kind === "h" ? th.day : today.day);
    return {
      get: function () { return { y: +yS.value, m: +mS.value, d: +dS.value }; },
      set: function (o) { yS.value = o.y; mS.value = o.m; syncDays(); dS.value = o.d; }
    };
  }

  function showErr(el, msg) {
    if (!el) return;
    el.textContent = msg; el.classList.add("show");
  }
  function clearErr(el) { if (el) el.classList.remove("show"); }
  function chips(list) {
    return list.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("");
  }

  /* today banner used across pages */
  function todayBanner() {
    var el = $("todayLine");
    if (!el) return;
    var t = H.todayKSA();
    var h = H.gregorianToHijri(t.year, t.month, t.day);
    var jdn = H.gregToJdn(t.year, t.month, t.day);
    el.innerHTML = "<b>" + wdOf(jdn) + "، " + fmtH(h) + "</b><span>الموافق " + fmtG(t) + "</span>";
  }

  window.A = {
    $: $, fillRange: fillRange, arCount: arCount, num: num, round: round, fmtNum: fmtNum,
    gLen: gLen, fmtG: fmtG, fmtH: fmtH, wdOf: wdOf, ymd: ymd, ageText: ageText,
    dateSelects: dateSelects, showErr: showErr, clearErr: clearErr, chips: chips,
    G_MONTHS: G_MONTHS, H_MONTHS: H_MONTHS, WD: WD,
    AR_DAY: AR_DAY, AR_MONTH: AR_MONTH, AR_YEAR: AR_YEAR, AR_WEEK: AR_WEEK, AR_HOUR: AR_HOUR
  };

  document.addEventListener("DOMContentLoaded", todayBanner);
})();
