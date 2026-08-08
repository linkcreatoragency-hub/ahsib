/* ahsib.online — percentage & general calculators */
(function () {
  "use strict";
  var A = window.A, $ = A.$;
  function n(id) { var e = $(id); if (!e) return NaN; return parseFloat(String(e.value).replace(/,/g, "")); }
  function out(id, big, sub, chips, extra) {
    var b = $(id + "Res"); if (!b) return;
    $(id + "Big").innerHTML = big;
    $(id + "Sub").innerHTML = sub || "";
    if ($(id + "Chips")) $(id + "Chips").innerHTML = chips && chips.length ? A.chips(chips) : "";
    if ($(id + "Extra")) $(id + "Extra").innerHTML = extra || "";
    b.classList.add("show");
  }
  function bad(id, msg) { A.showErr($(id + "Err"), msg); }
  function ok(id) { A.clearErr($(id + "Err")); }
  function f(x, d) { return A.fmtNum(x, d === undefined ? 4 : d); }

  /* ---- percentage-calculator: 3 modes ---- */
  (function () {
    if (!$("pcBtn")) return;
    var mode = "aOfB";
    ["pcM1", "pcM2", "pcM3"].forEach(function (id, i) {
      var el = $(id); if (!el) return;
      el.addEventListener("click", function () {
        mode = ["aOfB", "isWhat", "ofWhat"][i];
        ["pcM1", "pcM2", "pcM3"].forEach(function (x, j) { $(x).classList.toggle("on", i === j); });
        ["pcB1", "pcB2", "pcB3"].forEach(function (x, j) { $(x).classList.toggle("hidden", i !== j); });
        $("pcRes").classList.remove("show"); ok("pc");
      });
    });
    $("pcBtn").addEventListener("click", function () {
      ok("pc");
      if (mode === "aOfB") {
        var p = n("pcP"), b = n("pcT");
        if (isNaN(p) || isNaN(b)) return bad("pc", "أدخل النسبة والقيمة.");
        var v = b * p / 100;
        out("pc", f(v), p + "% من " + f(b) + " تساوي " + f(v),
          ["المتبقي: <b>" + f(b - v) + "</b>", "الضعف: <b>" + f(v * 2) + "</b>", "النصف: <b>" + f(v / 2) + "</b>"]);
      } else if (mode === "isWhat") {
        var a = n("pcA"), t = n("pcB");
        if (isNaN(a) || isNaN(t)) return bad("pc", "أدخل الرقمين.");
        if (t === 0) return bad("pc", "لا يمكن القسمة على صفر.");
        var pr = a / t * 100;
        out("pc", f(pr) + "%", f(a) + " من " + f(t) + " تمثل " + f(pr) + "%",
          ["الباقي: <b>" + f(100 - pr) + "%</b>", "الكسر: <b>" + f(a / t) + "</b>"]);
      } else {
        var x = n("pcX"), pp = n("pcPP");
        if (isNaN(x) || isNaN(pp)) return bad("pc", "أدخل القيمة والنسبة.");
        if (pp === 0) return bad("pc", "النسبة لا يمكن أن تكون صفراً.");
        var tot = x * 100 / pp;
        out("pc", f(tot), f(x) + " تمثل " + pp + "% من " + f(tot), ["الفرق: <b>" + f(tot - x) + "</b>"]);
      }
    });
  })();

  /* ---- percentage-increase (زيادة/نقصان) ---- */
  (function () {
    if (!$("piBtn")) return;
    $("piBtn").addEventListener("click", function () {
      ok("pi");
      var v = n("piV"), p = n("piP");
      if (isNaN(v) || isNaN(p)) return bad("pi", "أدخل القيمة والنسبة.");
      var inc = v * (1 + p / 100), dec = v * (1 - p / 100);
      out("pi", f(inc), "القيمة بعد الزيادة بنسبة " + p + "% من " + f(v),
        ["مقدار الزيادة: <b>" + f(v * p / 100) + "</b>",
          "بعد النقصان بنفس النسبة: <b>" + f(dec) + "</b>",
          "مقدار النقصان: <b>" + f(v * p / 100) + "</b>"]);
    });
  })();

  /* ---- percentage-change (نسبة التغير) ---- */
  (function () {
    if (!$("pchBtn")) return;
    $("pchBtn").addEventListener("click", function () {
      ok("pch");
      var a = n("pchA"), b = n("pchB");
      if (isNaN(a) || isNaN(b)) return bad("pch", "أدخل القيمتين.");
      if (a === 0) return bad("pch", "القيمة الأولى لا يمكن أن تكون صفراً.");
      var ch = (b - a) / Math.abs(a) * 100;
      var dir = ch > 0 ? "زيادة" : (ch < 0 ? "نقصان" : "بدون تغيير");
      out("pch", (ch > 0 ? "+" : "") + f(ch) + "%", dir + " من " + f(a) + " إلى " + f(b),
        ["مقدار التغير: <b>" + f(b - a) + "</b>", "النسبة الجديدة من القديمة: <b>" + f(b / a * 100) + "%</b>"]);
    });
  })();

  /* ---- percentage-difference (فرق النسبة المئوية) ---- */
  (function () {
    if (!$("pdBtn")) return;
    $("pdBtn").addEventListener("click", function () {
      ok("pd");
      var a = n("pdA"), b = n("pdB");
      if (isNaN(a) || isNaN(b)) return bad("pd", "أدخل القيمتين.");
      var avg = (Math.abs(a) + Math.abs(b)) / 2;
      if (avg === 0) return bad("pd", "لا يمكن حساب الفرق بين قيمتين صفريتين.");
      var pd = Math.abs(a - b) / avg * 100;
      out("pd", f(pd) + "%", "فرق النسبة المئوية بين " + f(a) + " و" + f(b),
        ["الفرق المطلق: <b>" + f(Math.abs(a - b)) + "</b>", "المتوسط: <b>" + f(avg) + "</b>",
          "نسبة التغير من الأولى للثانية: <b>" + f((b - a) / Math.abs(a) * 100) + "%</b>"]);
    });
  })();

  /* ---- discount-calculator ---- */
  (function () {
    if (!$("dcBtn")) return;
    $("dcBtn").addEventListener("click", function () {
      ok("dc");
      var p = n("dcP"), d = n("dcD"), vat = parseFloat($("dcV") ? $("dcV").value : "0") || 0;
      if (isNaN(p) || isNaN(d)) return bad("dc", "أدخل السعر ونسبة الخصم.");
      if (d < 0 || d > 100) return bad("dc", "نسبة الخصم يجب أن تكون بين 0 و100.");
      var save = p * d / 100, after = p - save;
      var withVat = after * (1 + vat / 100);
      out("dc", f(after, 2) + " ريال", "بعد خصم " + d + "% من " + f(p, 2) + " ريال",
        ["مقدار التوفير: <b>" + f(save, 2) + " ريال</b>",
          "السعر شامل ضريبة " + vat + "%: <b>" + f(withVat, 2) + " ريال</b>",
          "نسبة ما تدفعه: <b>" + f(100 - d, 2) + "%</b>"]);
    });
  })();

  /* ---- marks-percentage (النسبة المئوية للدرجات) ---- */
  (function () {
    if (!$("mpBtn")) return;
    $("mpBtn").addEventListener("click", function () {
      ok("mp");
      var got = n("mpG"), tot = n("mpT");
      if (isNaN(got) || isNaN(tot)) return bad("mp", "أدخل الدرجة المحصّلة والدرجة الكلية.");
      if (tot <= 0) return bad("mp", "الدرجة الكلية يجب أن تكون أكبر من صفر.");
      var p = got / tot * 100;
      var grade = p >= 95 ? "ممتاز مرتفع (A+)" : p >= 90 ? "ممتاز (A)" : p >= 85 ? "جيد جداً مرتفع (B+)"
        : p >= 80 ? "جيد جداً (B)" : p >= 75 ? "جيد مرتفع (C+)" : p >= 70 ? "جيد (C)"
          : p >= 65 ? "مقبول مرتفع (D+)" : p >= 60 ? "مقبول (D)" : "راسب (F)";
      out("mp", f(p, 2) + "%", "التقدير التقريبي: " + grade,
        ["الدرجة المفقودة: <b>" + f(tot - got, 2) + "</b>",
          "المعدل من 5: <b>" + f(p / 20, 2) + "</b>", "المعدل من 4: <b>" + f(p / 25, 2) + "</b>"]);
    });
  })();

  /* ---- gpa-to-percentage ---- */
  (function () {
    if (!$("gpBtn")) return;
    $("gpBtn").addEventListener("click", function () {
      ok("gp");
      var g = n("gpG"), scale = parseFloat($("gpS").value);
      if (isNaN(g)) return bad("gp", "أدخل المعدل التراكمي.");
      if (g < 0 || g > scale) return bad("gp", "المعدل يجب أن يكون بين 0 و" + scale + ".");
      var p = g / scale * 100;
      var other = scale === 5 ? g / 5 * 4 : g / 4 * 5;
      var grade = p >= 90 ? "ممتاز" : p >= 80 ? "جيد جداً" : p >= 70 ? "جيد" : p >= 60 ? "مقبول" : "ضعيف";
      out("gp", f(p, 2) + "%", "المعدل " + f(g, 2) + " من " + scale + " يعادل " + f(p, 2) + "% تقريباً",
        ["المعدل من " + (scale === 5 ? 4 : 5) + ": <b>" + f(other, 2) + "</b>",
          "التقدير: <b>" + grade + "</b>"]);
    });
  })();

  /* ---- mobile-balance (حساب الرصيد) ---- */
  (function () {
    if (!$("mbBtn")) return;
    $("mbBtn").addEventListener("click", function () {
      ok("mb");
      var amount = n("mbA"), vat = parseFloat($("mbV").value) || 0, fee = parseFloat($("mbF").value) || 0;
      if (isNaN(amount)) return bad("mb", "أدخل قيمة الشحن.");
      if (amount <= 0) return bad("mb", "قيمة الشحن يجب أن تكون أكبر من صفر.");
      var vatPart = amount * vat / (100 + vat);
      var net = amount - vatPart;
      var afterFee = net * (1 - fee / 100);
      out("mb", f(afterFee, 2) + " ريال", "الرصيد الفعلي المتوقع من بطاقة بقيمة " + f(amount, 2) + " ريال",
        ["قيمة الضريبة (" + vat + "%): <b>" + f(vatPart, 2) + " ريال</b>",
          "الرصيد قبل الرسوم: <b>" + f(net, 2) + " ريال</b>",
          "رسوم إدارية (" + fee + "%): <b>" + f(net - afterFee, 2) + " ريال</b>"]);
    });
  })();
})();
