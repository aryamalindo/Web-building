  let writer;
  let currentChar = "嗨";
  let currentLang = "en";
  let isPaused = false;

  const UI = {
    en: { sub: "Stroke order • Dictionary", stroke: "Stroke Order Animation", vocab: "Vocabulary", speed: "Speed", pause: "Pause", resume: "Resume", play: "Play", replay: "Replay", search: "Search character...", steps: "Step-by-Step Progression" },
    id: { sub: "Urutan goresan • Kamus", stroke: "Animasi Urutan Goresan", vocab: "Kosakata", speed: "Kecepatan", pause: "Jeda", resume: "Lanjut", play: "Putar", replay: "Ulang", search: "Cari karakter...", steps: "Urutan Goresan Bertahap" },
    zh: { sub: "笔顺 • 字典", stroke: "笔顺动画", vocab: "常用词汇", speed: "速度", pause: "暂停", resume: "继续", play: "播放", replay: "重播", search: "搜索汉字...", steps: "分步临摹" }
  };

  function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    renderData(currentChar);
  }

  function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
    
    // Update Text
    document.getElementById('ui-sub').innerText = UI[lang].sub;
    document.getElementById('ui-stroke-title').innerText = UI[lang].stroke;
    document.getElementById('ui-vocab-title').innerText = UI[lang].vocab;
    document.getElementById('ui-speed').innerText = UI[lang].speed;
    document.getElementById('ui-play').innerText = UI[lang].play;
    document.getElementById('ui-replay').innerText = UI[lang].replay;
    document.getElementById('main-search').placeholder = UI[lang].search;
    document.getElementById('ui-step-title').innerText = UI[lang].steps;
    
    updatePauseLabel();
  }

  function handlePause() {
    if (!writer) return;
    isPaused = !isPaused;
    isPaused ? writer.pauseAnimation() : writer.resumeAnimation();
    updatePauseLabel();
  }

  function updatePauseLabel() {
    document.getElementById('pause-btn').innerText = isPaused ? UI[currentLang].resume : UI[currentLang].pause;
  }

  function playAnim() { if(writer) { isPaused = false; updatePauseLabel(); writer.animateCharacter(); } }
  function replayAnim() { renderData(currentChar);}
  
  function renderData(char) {
    if (!char) return;
    currentChar = char;
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.getElementById("writer-target").innerHTML = "";
    isPaused = false;
    updatePauseLabel();

    writer = HanziWriter.create("writer-target", char, {
      width: 300, height: 300, padding: 20,
      strokeColor: isDark ? '#ff3b3b' : '#e11d2e',
      outlineColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      strokeAnimationSpeed: parseFloat(document.getElementById('speed-slider').value),
      showOutline: true,
      delayBetweenStrokes: 150
    });
    writer.animateCharacter();
    renderSteps(char);
  }

  function renderSteps(char) {
    const container = document.getElementById("steps-container");
    container.innerHTML = "";
    const isDark = document.body.getAttribute('data-theme') === 'dark';

    HanziWriter.getCharacterData(char).then(data => {
      data.strokes.forEach((_, i) => {
        const div = document.createElement("div");
        div.className = "mini-box";
        container.appendChild(div);
        const s = HanziWriter.create(div, char, { 
            width: 50, height: 50, padding: 5, 
            strokeColor: isDark ? '#fff' : '#333'
        });
        s.showCharacter({ numStrokes: i + 1 });
      });
    });
  }

  document.getElementById("main-search").addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if(val) renderData(val);
  });

  document.getElementById("speed-slider").addEventListener("input", (e) => {
    const val = e.target.value;
    document.getElementById("speed-val").innerText = val;
    replayAnim()
  });

  // Init
  setLang('en');
  renderData("嗨");