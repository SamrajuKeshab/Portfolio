/* ================= THREE.JS 3D UNIVERSE ================= */
(function(){
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg3d');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, .1, 100);
  camera.position.z = 11;
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  /* Particle starfield with gradient colors */
  const COUNT = 1600;
  const pos = new Float32Array(COUNT*3), col = new Float32Array(COUNT*3);
  const cA = new THREE.Color('#00e5ff'), cB = new THREE.Color('#a855f7'), cC = new THREE.Color('#ff2d95');
  for (let i=0;i<COUNT;i++){
    pos[i*3]   = (Math.random()-.5)*44;
    pos[i*3+1] = (Math.random()-.5)*26;
    pos[i*3+2] = (Math.random()-.5)*22 - 4;
    const t = Math.random();
    const c = t < .5 ? cA.clone().lerp(cB, t*2) : cB.clone().lerp(cC, (t-.5)*2);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(col,3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size:.07, vertexColors:true, transparent:true, opacity:.85, depthWrite:false, blending:THREE.AdditiveBlending
  }));
  scene.add(particles);

  /* Hero wireframe icosahedron + core */
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.1, 1),
    new THREE.MeshBasicMaterial({color:'#00e5ff', wireframe:true, transparent:true, opacity:.13})
  );
  ico.position.set(5, .6, -2.5);
  scene.add(ico);
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.25, 0),
    new THREE.MeshBasicMaterial({color:'#a855f7', wireframe:true, transparent:true, opacity:.4})
  );
  ico.add(core);

  /* Orbital rings */
  const rings = [];
  const ringCols = ['#00e5ff','#ff2d95','#a855f7'];
  for (let i=0;i<3;i++){
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(2.1 + i*.95, .015, 8, 120),
      new THREE.MeshBasicMaterial({color:ringCols[i], transparent:true, opacity:.22})
    );
    r.position.copy(ico.position);
    r.rotation.x = Math.PI/2.4 + i*.35;
    r.rotation.y = i*.7;
    scene.add(r); rings.push(r);
  }

  /* Torus knot — lower left */
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.15, .3, 140, 14),
    new THREE.MeshBasicMaterial({color:'#ff2d95', wireframe:true, transparent:true, opacity:.1})
  );
  knot.position.set(-5.8, -2.4, -4.5);
  scene.add(knot);

  /* Mouse + scroll parallax */
  let mx=0, my=0, scroll=0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX/innerWidth)*2 - 1;
    my = -(e.clientY/innerHeight)*2 + 1;
  });
  window.addEventListener('scroll', () => scroll = window.scrollY);
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  (function loop(){
    requestAnimationFrame(loop);
    const t = performance.now()*.001;
    particles.rotation.y = t*.02;
    particles.rotation.x = Math.sin(t*.1)*.04;
    ico.rotation.y = t*.16; ico.rotation.x = t*.08;
    core.rotation.y = -t*.5; core.rotation.z = t*.12;
    rings.forEach((r,i)=>{ r.rotation.z = t*(.08+i*.05); });
    knot.rotation.y = t*.1; knot.rotation.z = t*.05;
    camera.position.x += (mx*.9 - camera.position.x)*.04;
    camera.position.y += (my*.55 + scroll*.0009 - camera.position.y)*.04;
    camera.lookAt(0,0,0);
    renderer.render(scene, camera);
  })();
})();

/* ================= MARQUEE ================= */
(function(){
  const items = ['Java','Python','C','React','JavaScript','HTML5','CSS3','MySQL','PostgreSQL','AI / ML','NLP','RAG','Git','GitHub','Linux','VS Code','Rasa','Three.js'];
  const track = document.getElementById('marquee');
  track.innerHTML = [...items, ...items].map(i => `<span>${i}</span>`).join('');
})();

/* ================= TYPING EFFECT ================= */
(function(){
  const roles = ['Full Stack Developer','AI & ML Enthusiast','Problem Solver','Java • Python • C Developer','Chatbot & RAG Builder'];
  const el = document.getElementById('typed');
  let ri=0, ci=0, del=false;
  function tick(){
    const word = roles[ri];
    if (!del){
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length){ del = true; return setTimeout(tick, 1900); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0){ del = false; ri = (ri+1)%roles.length; return setTimeout(tick, 450); }
    }
    setTimeout(tick, del ? 40 : 85);
  }
  setTimeout(tick, 900);
})();

/* ================= SCROLL REVEAL ================= */
(function(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting){
        en.target.classList.add('visible');
        /* skill bars */
        en.target.querySelectorAll('.bar i').forEach(b => b.style.width = b.dataset.val + '%');
        /* count-up stats */
        en.target.querySelectorAll('[data-count]').forEach(n => {
          if (n.dataset.done) return; n.dataset.done = 1;
          const end = +n.dataset.count, t0 = performance.now(), dur = 1400;
          (function step(t){
            const p = Math.min((t - t0)/dur, 1);
            n.textContent = Math.round(end * (1 - Math.pow(1-p, 3)));
            if (p < 1) requestAnimationFrame(step);
          })(t0);
        });
        io.unobserve(en.target);
      }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ================= 3D TILT CARDS ================= */
(function(){
  if (!matchMedia('(pointer:fine)').matches) return;
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - .5;
      const y = (e.clientY - r.top)/r.height - .5;
      card.style.transform = `perspective(950px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-4px)`;
      card.style.setProperty('--gx', (x*100+50)+'%');
      card.style.setProperty('--gy', (y*100+50)+'%');
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
})();

/* ================= NAV / PROGRESS / CURSOR ================= */
(function(){
  const nav = document.getElementById('navbar');
  const prog = document.getElementById('progress');
  const toTop = document.getElementById('toTop');
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); links.classList.remove('open');
  }));

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    toTop.classList.toggle('show', scrollY > 600);
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? (scrollY/h)*100 : 0) + '%';
  });
  toTop.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

  /* active link */
  const sections = document.querySelectorAll('section[id]');
  const navA = document.querySelectorAll('.nav-links a[href^="#"]');
  const so = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting){
        navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+e.target.id));
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px'});
  sections.forEach(s => so.observe(s));

  /* custom cursor */
  if (matchMedia('(pointer:fine)').matches){
    const dot = document.getElementById('cDot'), ring = document.getElementById('cRing');
    let rx=0, ry=0, tx=0, ty=0;
    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      dot.style.left = tx+'px'; dot.style.top = ty+'px';
    });
    (function follow(){
      rx += (tx-rx)*.16; ry += (ty-ry)*.16;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll('a, button, .tilt, .chip, .cert, .stat').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
    /* map CSS class used above */
    const style = document.createElement('style');
    style.textContent = '.cursor-ring.grow{width:56px;height:56px;background:rgba(0,229,255,.08);border-color:rgba(168,85,247,.7)}';
    document.head.appendChild(style);
  }

  /* preloader */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hide'), 700);
  });
  setTimeout(() => document.getElementById('preloader').classList.add('hide'), 3500); /* safety */
})();
