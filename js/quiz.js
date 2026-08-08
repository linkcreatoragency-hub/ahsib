/* ahsib.online — entertainment quizzes (mental age, personality) + math game */
(function () {
  "use strict";
  var A = window.A, $ = A.$;

  /* ---------------- mental age test ---------------- */
  (function () {
    var root = $("maQuiz"); if (!root) return;
    var Q = [
      ["كيف تبدأ يومك عادةً؟", [["أستيقظ مبكراً بخطة واضحة", 5], ["أستيقظ في وقت معتاد بلا خطة", 3], ["أؤجّل المنبّه مراراً", 1]]],
      ["عند اتخاذ قرار مهم، ماذا تفعل؟", [["أكتب الإيجابيات والسلبيات", 5], ["أستشير شخصاً أثق به", 3], ["أتبع إحساسي فوراً", 1]]],
      ["كيف تتعامل مع النقد؟", [["أستفيد منه وأعدّل", 5], ["أتقبّله لكن ينزعجني", 3], ["أرد بسرعة وأدافع", 1]]],
      ["ماذا تفعل عند وصول راتبك؟", [["أدّخر جزءاً ثم أصرف", 5], ["أصرف على الأساسيات فقط", 3], ["أشتري ما أرغب فوراً", 1]]],
      ["في وقت الفراغ تفضّل…", [["القراءة أو تعلّم مهارة", 5], ["مشاهدة فيلم أو مسلسل", 3], ["ألعاب وتصفّح سريع", 1]]],
      ["كيف ترتّب مهامك؟", [["قائمة مهام وأولويات", 5], ["أتذكّرها ذهنياً", 3], ["أعمل حسب المزاج", 1]]],
      ["عند الخلاف مع صديق…", [["أفتح حواراً هادئاً", 5], ["أنتظر أن يبدأ هو", 3], ["أقاطعه فترة", 1]]],
      ["كيف تنظر للمستقبل؟", [["لديّ أهداف مكتوبة", 5], ["لديّ تصوّر عام", 3], ["أعيش يومي فقط", 1]]],
      ["عند ارتكاب خطأ في العمل…", [["أعترف وأصلحه فوراً", 5], ["أصلحه بهدوء دون إخبار أحد", 3], ["أبحث عن مبرر", 1]]],
      ["كيف تنفق وقتك على الهاتف؟", [["بحدود وبهدف", 5], ["أكثر مما ينبغي أحياناً", 3], ["ساعات طويلة يومياً", 1]]],
      ["ما رأيك في الروتين اليومي؟", [["أساس النجاح", 5], ["مفيد لكنه ممل", 3], ["أكرهه تماماً", 1]]],
      ["عند مواجهة مشكلة مفاجئة…", [["أهدأ ثم أحلّل الخيارات", 5], ["أطلب المساعدة مباشرة", 3], ["أتوتّر وأؤجّل", 1]]]
    ];
    var idx = 0, score = 0;
    var qEl = $("maQ"), oEl = $("maOpts"), pEl = $("maProg"), rEl = $("maRes");
    function render() {
      if (idx >= Q.length) return finish();
      qEl.textContent = (idx + 1) + ". " + Q[idx][0];
      pEl.textContent = "السؤال " + (idx + 1) + " من " + Q.length;
      oEl.innerHTML = "";
      Q[idx][1].forEach(function (o) {
        var b = document.createElement("button");
        b.className = "btn sec"; b.type = "button"; b.textContent = o[0];
        b.addEventListener("click", function () { score += o[1]; idx++; render(); });
        oEl.appendChild(b);
      });
    }
    function finish() {
      var max = Q.length * 5, pct = score / max;
      var age = Math.round(12 + pct * 43); // 12 → 55
      var desc = age < 20 ? "روح شابة ومتحمّسة، تعيش اللحظة وتحب التجريب."
        : age < 30 ? "طاقة الشباب مع بداية نضج واضح في القرارات."
          : age < 40 ? "توازن جيد بين الحماس والحكمة، وتخطيط عملي للحياة."
            : age < 50 ? "نضج واضح وانضباط، تفكّر بعيد المدى قبل أن تتصرف."
              : "حكمة وهدوء، تميل للتخطيط الدقيق وضبط النفس.";
      $("maQBox").classList.add("hidden");
      rEl.innerHTML = '<div class="result show"><div class="big">عمرك العقلي التقريبي: ' + age + ' سنة</div>' +
        '<div class="sub">' + desc + '</div><div class="chips">' +
        A.chips(["مجموع نقاطك: <b>" + score + " من " + max + "</b>", "النسبة: <b>" + Math.round(pct * 100) + "%</b>"]) +
        '</div><p style="margin-top:14px;font-size:.9rem;color:#64748b">هذا الاختبار للتسلية فقط ولا يُعدّ تقييماً نفسياً أو طبياً.</p>' +
        '<button class="btn sec" style="margin-top:12px" id="maAgain">إعادة الاختبار</button></div>';
      $("maAgain").addEventListener("click", function () {
        idx = 0; score = 0; rEl.innerHTML = ""; $("maQBox").classList.remove("hidden"); render();
      });
    }
    render();
  })();

  /* ---------------- personality test ---------------- */
  (function () {
    var root = $("ptQuiz"); if (!root) return;
    // 4 traits: قيادي (D) · اجتماعي (I) · هادئ (S) · دقيق (C)
    var Q = [
      ["في مجموعة عمل جديدة، أنت…", [["أتولّى التنظيم", "D"], ["أكسر الجمود وأتعرّف على الجميع", "I"], ["أستمع أولاً", "S"], ["أسأل عن التفاصيل والمعايير", "C"]]],
      ["عند ضغط الوقت…", [["أتخذ القرار بسرعة", "D"], ["أحفّز الفريق", "I"], ["أحافظ على الهدوء", "S"], ["أراجع الخطة خطوة بخطوة", "C"]]],
      ["أكثر ما يزعجك…", [["البطء والتردّد", "D"], ["الأجواء الجافة", "I"], ["الخلافات والصراخ", "S"], ["الفوضى والأخطاء", "C"]]],
      ["مكان عملك المثالي…", [["مليء بالتحديات", "D"], ["حيوي واجتماعي", "I"], ["مستقر وودود", "S"], ["منظّم وواضح", "C"]]],
      ["عند شراء شيء غالٍ…", [["أقرّر بسرعة إن أعجبني", "D"], ["أسأل أصدقائي", "I"], ["أنتظر وأفكّر", "S"], ["أقارن المواصفات والأسعار", "C"]]],
      ["أصدقاؤك يصفونك بأنك…", [["حاسم", "D"], ["مرح", "I"], ["وفيّ", "S"], ["دقيق", "C"]]],
      ["في النقاش…", [["أدافع عن رأيي بقوة", "D"], ["أحب تبادل الأفكار", "I"], ["أبحث عن حل وسط", "S"], ["أستند إلى الأدلة", "C"]]],
      ["عند بدء مشروع جديد…", [["أبدأ فوراً", "D"], ["أشرك الآخرين", "I"], ["أتأكد من استقرار الوضع", "S"], ["أضع خطة مكتوبة", "C"]]],
      ["الفشل بالنسبة لك…", [["حافز للمحاولة أقوى", "D"], ["تجربة أرويها لاحقاً", "I"], ["أمر مزعج أتجاوزه بهدوء", "S"], ["درس أحلّل أسبابه", "C"]]],
      ["إجازتك المفضّلة…", [["مغامرة ونشاط", "D"], ["سفر مع مجموعة", "I"], ["استرخاء في مكان هادئ", "S"], ["زيارة منظّمة بجدول", "C"]]]
    ];
    var T = {
      D: ["الشخصية القيادية الحاسمة", "تميل إلى المبادرة واتخاذ القرار بسرعة، وتحب التحدي والنتائج الواضحة. نقطة قوتك الجرأة، وما يستحق الانتباه هو منح الآخرين وقتاً أطول للتعبير.", "🚀"],
      I: ["الشخصية الاجتماعية المُلهِمة", "تكسب الناس بسرعة وتنشر الحماس في أي مجموعة. نقطة قوتك التواصل، وما يستحق الانتباه هو متابعة التفاصيل حتى النهاية.", "🌟"],
      S: ["الشخصية الهادئة الداعمة", "تقدّر الاستقرار والعلاقات طويلة الأمد، ويرتاح الناس معك. نقطة قوتك الثبات، وما يستحق الانتباه هو التعبير عن رأيك بوضوح أكبر.", "🤝"],
      C: ["الشخصية الدقيقة المنظّمة", "تحب المعايير والوضوح وتنجز العمل بجودة عالية. نقطة قوتك الإتقان، وما يستحق الانتباه هو عدم المبالغة في السعي للكمال.", "🎯"]
    };
    var idx = 0, sc = { D: 0, I: 0, S: 0, C: 0 };
    var qEl = $("ptQ"), oEl = $("ptOpts"), pEl = $("ptProg"), rEl = $("ptRes");
    function render() {
      if (idx >= Q.length) return finish();
      qEl.textContent = (idx + 1) + ". " + Q[idx][0];
      pEl.textContent = "السؤال " + (idx + 1) + " من " + Q.length;
      oEl.innerHTML = "";
      Q[idx][1].forEach(function (o) {
        var b = document.createElement("button");
        b.className = "btn sec"; b.type = "button"; b.textContent = o[0];
        b.addEventListener("click", function () { sc[o[1]]++; idx++; render(); });
        oEl.appendChild(b);
      });
    }
    function finish() {
      var best = "D";
      Object.keys(sc).forEach(function (k) { if (sc[k] > sc[best]) best = k; });
      var t = T[best], total = Q.length;
      var bars = Object.keys(sc).map(function (k) {
        return "<tr><td>" + T[k][0] + "</td><td class='mono'>" + Math.round(sc[k] / total * 100) + "%</td></tr>";
      }).join("");
      $("ptQBox").classList.add("hidden");
      rEl.innerHTML = '<div class="result show"><div class="big">' + t[2] + " " + t[0] + '</div>' +
        '<div class="sub">' + t[1] + '</div>' +
        '<div class="tbl-wrap res-table"><table><thead><tr><th>النمط</th><th>نسبتك</th></tr></thead><tbody>' + bars + '</tbody></table></div>' +
        '<p style="font-size:.9rem;color:#64748b">هذا الاختبار للتسلية والتعرّف على الذات فقط، وليس تشخيصاً نفسياً معتمداً.</p>' +
        '<button class="btn sec" id="ptAgain">إعادة الاختبار</button></div>';
      $("ptAgain").addEventListener("click", function () {
        idx = 0; sc = { D: 0, I: 0, S: 0, C: 0 }; rEl.innerHTML = ""; $("ptQBox").classList.remove("hidden"); render();
      });
    }
    render();
  })();

  /* ---------------- math game ---------------- */
  (function () {
    if (!$("mgStart")) return;
    var level = "easy", timeLeft = 60, timer = null, score = 0, streak = 0, best = 0, cur = null;
    var qEl = $("mgQ"), aEl = $("mgA"), sEl = $("mgScore"), tEl = $("mgTime"), fEl = $("mgFeed");
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function make() {
      var ops = level === "easy" ? ["+", "-"] : level === "medium" ? ["+", "-", "×"] : ["+", "-", "×", "÷"];
      var op = ops[rnd(0, ops.length - 1)], a, b, ans;
      var max = level === "easy" ? 20 : level === "medium" ? 50 : 99;
      if (op === "+") { a = rnd(2, max); b = rnd(2, max); ans = a + b; }
      else if (op === "-") { a = rnd(2, max); b = rnd(1, a); ans = a - b; }
      else if (op === "×") { a = rnd(2, level === "medium" ? 12 : 20); b = rnd(2, 12); ans = a * b; }
      else { b = rnd(2, 12); ans = rnd(2, 12); a = b * ans; }
      cur = { txt: a + " " + op + " " + b, ans: ans };
      qEl.textContent = cur.txt + " = ؟";
      aEl.value = ""; aEl.focus();
    }
    function tick() {
      timeLeft--; tEl.textContent = timeLeft;
      if (timeLeft <= 0) stop();
    }
    function start() {
      score = 0; streak = 0; timeLeft = +$("mgDur").value; level = $("mgLevel").value;
      sEl.textContent = "0"; tEl.textContent = timeLeft; fEl.textContent = "";
      $("mgPlay").classList.remove("hidden"); $("mgStart").textContent = "إعادة البدء";
      clearInterval(timer); timer = setInterval(tick, 1000); make();
    }
    function stop() {
      clearInterval(timer); timer = null;
      if (score > best) best = score;
      qEl.textContent = "انتهى الوقت!";
      fEl.innerHTML = "نتيجتك: <b>" + score + "</b> إجابة صحيحة · أفضل نتيجة لك: <b>" + best + "</b>";
      aEl.value = "";
    }
    function check() {
      if (!timer) return;
      var v = parseFloat(aEl.value);
      if (isNaN(v)) return;
      if (v === cur.ans) {
        score++; streak++;
        sEl.textContent = score;
        fEl.innerHTML = "✅ إجابة صحيحة" + (streak >= 3 ? " — متتالية " + streak + "!" : "");
        make();
      } else {
        streak = 0;
        fEl.innerHTML = "❌ حاول مرة أخرى";
        aEl.select();
      }
    }
    $("mgStart").addEventListener("click", start);
    aEl.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
    var cb = $("mgCheck"); if (cb) cb.addEventListener("click", check);
  })();

  /* ---------------- tools page search ---------------- */
  (function () {
    var box = $("toolSearch"); if (!box) return;
    var links = [].slice.call(document.querySelectorAll(".tool-link"));
    var cats = [].slice.call(document.querySelectorAll(".cat"));
    var empty = $("noResult");
    box.addEventListener("input", function () {
      var q = box.value.trim();
      links.forEach(function (l) {
        l.style.display = !q || l.textContent.indexOf(q) >= 0 ? "" : "none";
      });
      var any = false;
      cats.forEach(function (c) {
        var vis = c.querySelectorAll('.tool-link:not([style*="none"])').length;
        c.style.display = vis ? "" : "none";
        if (vis) any = true;
      });
      if (empty) empty.classList.toggle("show", !any);
    });
  })();
})();
