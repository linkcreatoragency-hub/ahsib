/* ahsib.online — date & Hijri tools */
(function () {
  "use strict";
  var H = window.Hijri, A = window.A;
  var $ = A.$;

  function res(id) { return { box: $(id + "Res"), big: $(id + "Big"), sub: $(id + "Sub"), chips: $(id + "Chips"), extra: $(id + "Extra") }; }
  function show(r, big, sub, chipList, extraHTML) {
    r.big.innerHTML = big;
    r.sub.innerHTML = sub || "";
    if (r.chips) r.chips.innerHTML = chipList && chipList.length ? A.chips(chipList) : "";
    if (r.extra) r.extra.innerHTML = extraHTML || "";
    r.box.classList.add("show");
  }
  function jdnG(o) { return H.gregToJdn(o.y, o.m, o.d); }
  function jdnH(o) { return H.hijriToJdn(o.y, o.m, o.d); }
  function gObj(o) { return { year: o.y, month: o.m, day: o.d }; }
  function hObj(o) { return { year: o.y, month: o.m, day: o.d }; }
  function bothLine(jdn) {
    var g = H.jdnToGreg(jdn), h = H.jdnToHijri(jdn);
    return A.wdOf(jdn) + "، " + A.fmtH(h) + " — الموافق " + A.fmtG(g);
  }
  function spanStats(days) {
    return ["عدد الأيام: <b>" + A.num(days) + "</b>",
      "عدد الأسابيع: <b>" + A.num(Math.floor(days / 7)) + "</b>",
      "عدد الساعات: <b>" + A.num(days * 24) + "</b>",
      "عدد الدقائق: <b>" + A.num(days * 1440) + "</b>"];
  }

  /* ---------- 1. Hijri ⇄ Gregorian converter ---------- */
  (function () {
    if (!$("cvtBtn")) return;
    var g = A.dateSelects("cvtG", "g"), h = A.dateSelects("cvtH", "h");
    var r = res("cvt"), err = $("cvtErr"), mode = "g2h";
    function setMode(m) {
      mode = m;
      $("btnG2H").classList.toggle("on", m === "g2h");
      $("btnH2G").classList.toggle("on", m === "h2g");
      $("cvtGBlock").classList.toggle("hidden", m !== "g2h");
      $("cvtHBlock").classList.toggle("hidden", m !== "h2g");
      r.box.classList.remove("show"); A.clearErr(err);
    }
    $("btnG2H").addEventListener("click", function () { setMode("g2h"); });
    $("btnH2G").addEventListener("click", function () { setMode("h2g"); });
    $("cvtBtn").addEventListener("click", function () {
      A.clearErr(err);
      var jdn, from, to;
      if (mode === "g2h") {
        var v = g.get();
        if (!H.isValidGregorian(v.y, v.m, v.d)) return A.showErr(err, "التاريخ الميلادي غير صحيح.");
        jdn = jdnG(v);
        if (jdn < H.hijriToJdn(H.MIN_YEAR, 1, 1) || jdn > H.hijriToJdn(H.MAX_YEAR, 12, 1))
          return A.showErr(err, "التاريخ خارج نطاق تقويم أم القرى (" + H.MIN_YEAR + "–" + H.MAX_YEAR + " هـ).");
        from = A.fmtG(gObj(v)); to = A.fmtH(H.jdnToHijri(jdn));
      } else {
        var w = h.get();
        if (!H.isValidHijri(w.y, w.m, w.d)) return A.showErr(err, "التاريخ الهجري غير صحيح.");
        jdn = jdnH(w);
        from = A.fmtH(hObj(w)); to = A.fmtG(H.jdnToGreg(jdn));
      }
      var hh = H.jdnToHijri(jdn);
      show(r, to, "التاريخ المُدخل: " + from, [
        "يوم الأسبوع: <b>" + A.wdOf(jdn) + "</b>",
        "أيام الشهر الهجري: <b>" + H.monthLength(hh.year, hh.month) + "</b>",
        "أيام السنة الهجرية: <b>" + H.yearLength(hh.year) + "</b>"
      ]);
    });
  })();

  /* ---------- 2 & 3. Difference between two dates ---------- */
  ["ddG", "ddH"].forEach(function (id) {
    if (!$(id + "Btn")) return;
    var kind = id === "ddH" ? "h" : "g";
    var a = A.dateSelects(id + "A", kind), b = A.dateSelects(id + "B", kind);
    var r = res(id), err = $(id + "Err");
    var lenFn = kind === "h" ? H.monthLength : A.gLen;
    var valid = kind === "h" ? H.isValidHijri : H.isValidGregorian;
    var toJ = kind === "h" ? jdnH : jdnG;
    var fmt = kind === "h" ? function (o) { return A.fmtH(hObj(o)); } : function (o) { return A.fmtG(gObj(o)); };
    $(id + "Btn").addEventListener("click", function () {
      A.clearErr(err);
      var v1 = a.get(), v2 = b.get();
      if (!valid(v1.y, v1.m, v1.d) || !valid(v2.y, v2.m, v2.d)) return A.showErr(err, "أحد التاريخين غير صحيح.");
      var j1 = toJ(v1), j2 = toJ(v2);
      var swapped = j1 > j2;
      if (swapped) { var t = v1; v1 = v2; v2 = t; t = j1; j1 = j2; j2 = t; }
      var days = j2 - j1;
      var d = A.ymd(v1.y, v1.m, v1.d, v2.y, v2.m, v2.d, lenFn);
      show(r, A.ageText(d),
        "الفرق بين " + fmt(v1) + " و" + fmt(v2) + (swapped ? " (تم ترتيب التاريخين تلقائياً)" : ""),
        spanStats(days).concat(["يوم البداية: <b>" + A.wdOf(j1) + "</b>", "يوم النهاية: <b>" + A.wdOf(j2) + "</b>"]));
    });
  });

  /* ---------- 4-7. Age calculators ---------- */
  [["ageG", "g", false], ["ageGAt", "g", true], ["ageH", "h", false], ["ageHAt", "h", true]]
    .forEach(function (cfg) {
      var id = cfg[0], kind = cfg[1], atDate = cfg[2];
      if (!$(id + "Btn")) return;
      var birth = A.dateSelects(id + "B", kind);
      var at = atDate ? A.dateSelects(id + "T", kind) : null;
      var r = res(id), err = $(id + "Err");
      var lenFn = kind === "h" ? H.monthLength : A.gLen;
      var valid = kind === "h" ? H.isValidHijri : H.isValidGregorian;
      var toJ = kind === "h" ? jdnH : jdnG;
      $(id + "Btn").addEventListener("click", function () {
        A.clearErr(err);
        var bv = birth.get();
        if (!valid(bv.y, bv.m, bv.d)) return A.showErr(err, "تاريخ الميلاد غير صحيح.");
        var bj = toJ(bv), tv, tj;
        if (atDate) {
          tv = at.get();
          if (!valid(tv.y, tv.m, tv.d)) return A.showErr(err, "التاريخ المرجعي غير صحيح.");
          tj = toJ(tv);
          if (tj < bj) return A.showErr(err, "التاريخ المرجعي أقدم من تاريخ الميلاد.");
        } else {
          var t = H.todayKSA(); tj = H.gregToJdn(t.year, t.month, t.day);
          if (bj > tj) return A.showErr(err, "تاريخ الميلاد في المستقبل.");
          var tt = kind === "h" ? H.jdnToHijri(tj) : H.jdnToGreg(tj);
          tv = { y: tt.year, m: tt.month, d: tt.day };
        }
        var age = A.ymd(bv.y, bv.m, bv.d, tv.y, tv.m, tv.d, lenFn);
        var days = tj - bj;
        // the other calendar's age too
        var oKind = kind === "h" ? "g" : "h";
        var ob = oKind === "h" ? H.jdnToHijri(bj) : H.jdnToGreg(bj);
        var ot = oKind === "h" ? H.jdnToHijri(tj) : H.jdnToGreg(tj);
        var oLen = oKind === "h" ? H.monthLength : A.gLen;
        var oAge = A.ymd(ob.year, ob.month, ob.day, ot.year, ot.month, ot.day, oLen);
        var otherLabel = oKind === "h" ? "بالتقويم الهجري" : "بالتقويم الميلادي";
        // next birthday on the input calendar
        var nb = nextBirthday(bv, tv, kind);
        var list = [
          "يوم ميلادك: <b>" + A.wdOf(bj) + "</b>",
          "ميلادك بالميلادي: <b>" + A.fmtG(H.jdnToGreg(bj)) + "</b>",
          "ميلادك بالهجري: <b>" + A.fmtH(H.jdnToHijri(bj)) + "</b>"
        ].concat(spanStats(days));
        if (nb !== null) list.push(nb === 0 ? "🎉 <b>عيد ميلادك اليوم!</b>" : "يتبقى على عيد ميلادك: <b>" + A.arCount(nb, A.AR_DAY) + "</b>");
        show(r, A.ageText(age), "العمر " + otherLabel + ": " + A.ageText(oAge), list);
      });
      function nextBirthday(bv, tv, k) {
        var lf = k === "h" ? H.monthLength : A.gLen;
        var y = tv.y, d = Math.min(bv.d, lf(y, bv.m));
        var j = k === "h" ? H.hijriToJdn(y, bv.m, d) : H.gregToJdn(y, bv.m, d);
        var now = k === "h" ? H.hijriToJdn(tv.y, tv.m, tv.d) : H.gregToJdn(tv.y, tv.m, tv.d);
        if (j < now) { y++; d = Math.min(bv.d, lf(y, bv.m)); j = k === "h" ? H.hijriToJdn(y, bv.m, d) : H.gregToJdn(y, bv.m, d); }
        return j - now;
      }
    });

  /* ---------- 8. Add / subtract from a date ---------- */
  (function () {
    if (!$("addBtn")) return;
    var g = A.dateSelects("addG", "g"), h = A.dateSelects("addH", "h");
    var r = res("add"), err = $("addErr"), cal = "g", op = "add";
    function setCal(c) {
      cal = c;
      $("btnCalG").classList.toggle("on", c === "g");
      $("btnCalH").classList.toggle("on", c === "h");
      $("addGBlock").classList.toggle("hidden", c !== "g");
      $("addHBlock").classList.toggle("hidden", c !== "h");
      r.box.classList.remove("show");
    }
    function setOp(o) {
      op = o;
      $("btnAdd").classList.toggle("on", o === "add");
      $("btnSub").classList.toggle("on", o === "sub");
    }
    $("btnCalG").addEventListener("click", function () { setCal("g"); });
    $("btnCalH").addEventListener("click", function () { setCal("h"); });
    $("btnAdd").addEventListener("click", function () { setOp("add"); });
    $("btnSub").addEventListener("click", function () { setOp("sub"); });
    $("addBtn").addEventListener("click", function () {
      A.clearErr(err);
      var v = cal === "h" ? h.get() : g.get();
      var valid = cal === "h" ? H.isValidHijri : H.isValidGregorian;
      if (!valid(v.y, v.m, v.d)) return A.showErr(err, "التاريخ المُدخل غير صحيح.");
      var dy = +$("addY").value || 0, dm = +$("addM").value || 0, dd = +$("addD").value || 0;
      if (dy === 0 && dm === 0 && dd === 0) return A.showErr(err, "أدخل عدد السنوات أو الأشهر أو الأيام المراد إضافتها.");
      var s = op === "sub" ? -1 : 1;
      var lf = cal === "h" ? H.monthLength : A.gLen;
      var y = v.y + s * dy, m = v.m + s * dm;
      while (m > 12) { m -= 12; y++; }
      while (m < 1) { m += 12; y--; }
      var maxD = lf(y, m), d = Math.min(v.d, maxD);
      var j = (cal === "h" ? H.hijriToJdn(y, m, d) : H.gregToJdn(y, m, d)) + s * dd;
      var og = H.jdnToGreg(j), oh = H.jdnToHijri(j);
      var srcTxt = cal === "h" ? A.fmtH(hObj(v)) : A.fmtG(gObj(v));
      var deltaTxt = [];
      if (dy) deltaTxt.push(A.arCount(dy, A.AR_YEAR));
      if (dm) deltaTxt.push(A.arCount(dm, A.AR_MONTH));
      if (dd) deltaTxt.push(A.arCount(dd, A.AR_DAY));
      show(r, cal === "h" ? A.fmtH(oh) : A.fmtG(og),
        srcTxt + " " + (op === "sub" ? "ناقص" : "زائد") + " " + deltaTxt.join(" و"),
        ["يوم الأسبوع: <b>" + A.wdOf(j) + "</b>",
          "بالميلادي: <b>" + A.fmtG(og) + "</b>", "بالهجري: <b>" + A.fmtH(oh) + "</b>"]);
    });
  })();

  /* ---------- 9 & 10. Days until / since ---------- */
  ["duG", "duH"].forEach(function (id) {
    if (!$(id + "Btn")) return;
    var kind = id === "duH" ? "h" : "g";
    var t = A.dateSelects(id + "T", kind);
    var r = res(id), err = $(id + "Err");
    var valid = kind === "h" ? H.isValidHijri : H.isValidGregorian;
    var toJ = kind === "h" ? jdnH : jdnG;
    var lenFn = kind === "h" ? H.monthLength : A.gLen;
    $(id + "Btn").addEventListener("click", function () {
      A.clearErr(err);
      var v = t.get();
      if (!valid(v.y, v.m, v.d)) return A.showErr(err, "التاريخ غير صحيح.");
      var tj = toJ(v);
      var td = H.todayKSA(), nj = H.gregToJdn(td.year, td.month, td.day);
      var now = kind === "h" ? H.jdnToHijri(nj) : H.jdnToGreg(nj);
      var days = tj - nj;
      var span = days >= 0
        ? A.ymd(now.year, now.month, now.day, v.y, v.m, v.d, lenFn)
        : A.ymd(v.y, v.m, v.d, now.year, now.month, now.day, lenFn);
      var big = days === 0 ? "التاريخ هو اليوم!"
        : (days > 0 ? "يتبقى " + A.arCount(days, A.AR_DAY) : "مضى " + A.arCount(-days, A.AR_DAY));
      show(r, big, (days === 0 ? "" : "أي ما يعادل " + A.ageText(span) + " ") + "— " + bothLine(tj),
        [(days > 0 ? "عدد الأسابيع المتبقية" : "عدد الأسابيع الماضية") + ": <b>" + A.num(Math.floor(Math.abs(days) / 7)) + "</b>",
          "عدد الساعات: <b>" + A.num(Math.abs(days) * 24) + "</b>",
          "يوم الأسبوع: <b>" + A.wdOf(tj) + "</b>"]);
    });
  });
})();
