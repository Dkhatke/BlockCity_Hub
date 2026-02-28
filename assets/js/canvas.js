/* ═══════════════════════════════════════════════════════
   canvas.js — ANVAY Blockchain Background
   Enhanced from original — same structure, richer visuals:
   • Nodes rendered as glowing block squares with hex labels
   • Links have animated data packets travelling along them
   • Per-node colour from room palette
   • Radial glow behind each node
═══════════════════════════════════════════════════════ */

(function () {

  const canvas = document.getElementById("blockchainCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const COLORS     = ["#00E5FF","#FFB800","#C084FC","#FF6B35","#00E676"];
  const NODE_COUNT = 22;
  const LINK_DIST  = 160;

  let W, H;
  let nodes = [];

  // ── Resize ────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ── Create a node ─────────────────────────────────────
  function randomNode() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - .5) * .25,
      vy:    (Math.random() - .5) * .25,
      size:  3 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      // Short hex label displayed inside each block
      label: "0x" + Math.random().toString(16).slice(2, 5).toUpperCase(),
    };
  }

  // ── Draw a single block node ───────────────────────────
  function drawNode(n, time) {
    const glow = .6 + .4 * Math.sin(n.pulse + time * .001);

    ctx.save();
    ctx.translate(n.x, n.y);

    // Radial glow behind node
    const grad = ctx.createRadialGradient(0, 0, n.size, 0, 0, n.size * 4.5);
    grad.addColorStop(0, n.color + "55");
    grad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(0, 0, n.size * 4.5, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Block square
    ctx.globalAlpha = .18 * glow + .25;
    ctx.fillStyle   = n.color;
    ctx.beginPath();
    ctx.roundRect(-n.size, -n.size, n.size * 2, n.size * 2, 2);
    ctx.fill();

    // Block border
    ctx.globalAlpha = .55 * glow;
    ctx.strokeStyle = n.color;
    ctx.lineWidth   = .8;
    ctx.stroke();

    // Hex label inside block (only for larger nodes)
    if (n.size >= 5) {
      ctx.globalAlpha = .5 * glow;
      ctx.fillStyle   = n.color;
      ctx.font        = `${Math.round(n.size * .85)}px 'DM Mono',monospace`;
      ctx.textAlign   = "center";
      ctx.textBaseline= "middle";
      ctx.fillText(n.label, 0, 0);
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── Draw link between two nearby nodes ────────────────
  function drawLink(a, b, dist, time) {
    const opacity = (1 - dist / LINK_DIST) * .12;

    // Line
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(0,229,255,${opacity})`;
    ctx.lineWidth   = .6;
    ctx.stroke();

    // Animated packet along the link
    // Each pair gets a unique phase from their indices
    const phase  = ((a.x + b.y) * .001 + time * .00045) % 1;
    const px     = a.x + (b.x - a.x) * phase;
    const py     = a.y + (b.y - a.y) * phase;
    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${opacity * 5})`;
    ctx.fill();
  }

  // ── Move nodes ────────────────────────────────────────
  function update() {
    nodes.forEach(n => {
      n.x    += n.vx;
      n.y    += n.vy;
      n.pulse += .01;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  // ── Render frame ─────────────────────────────────────
  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    // Links first (behind nodes)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) drawLink(nodes[i], nodes[j], dist, time);
      }
    }

    // Nodes on top
    nodes.forEach(n => drawNode(n, time));
  }

  // ── Main loop ─────────────────────────────────────────
  function animate(time) {
    update();
    draw(time);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);

  document.fonts.ready.then(() => {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, randomNode);
    animate(0);
  });

})();