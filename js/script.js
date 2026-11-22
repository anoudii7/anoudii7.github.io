const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero title word-by-word blur reveal
(function(){
  const h=document.getElementById('heroTitle');
  const lines=h.dataset.text.split('|');
  let i=0;
  lines.forEach((ln,li)=>{
    ln.trim().split(' ').forEach(w=>{
      const s=document.createElement('span');
      s.className='w'+(li===1?' grey':'');
      s.textContent=w;
      s.style.animationDelay=(0.25+i*0.09)+'s';
      h.appendChild(s);h.appendChild(document.createTextNode(' '));
      i++;
    });
    if(li<lines.length-1)h.appendChild(document.createElement('br'));
  });
})();

// Duplicate marquee for seamless loop
const tr=document.getElementById('track');tr.innerHTML+=tr.innerHTML;

// Scroll reveal + counters
const countUp=el=>{
  const t=+el.dataset.count,suf=el.dataset.suffix||'';let s=null;
  const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/1400,1);const e=1-Math.pow(1-p,3);
    el.textContent=Math.round(t*e).toLocaleString('ar-EG')+suf;if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
};
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);io.unobserve(e.target)}
}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// FAQ accordion
document.querySelectorAll('.q button').forEach(b=>b.addEventListener('click',()=>{
  const q=b.parentElement,open=q.classList.contains('open');
  document.querySelectorAll('.q').forEach(x=>x.classList.remove('open'));
  if(!open)q.classList.add('open');
}));

// Cursor follower
const c=document.getElementById('cursor');let mx=0,my=0,cx=0,cy=0;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
(function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('a,button,.svc,.tool').forEach(el=>{
  el.addEventListener('mouseenter',()=>c.classList.add('big'));
  el.addEventListener('mouseleave',()=>c.classList.remove('big'));
});

// Scroll progress
const pr=document.getElementById('progress');
addEventListener('scroll',()=>{const h=document.documentElement;pr.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});

/* =========================================================
   ✨ لمسات الحياة (Extra life)
   ========================================================= */

// Highlight the word "الأنظمة" in the hero title
document.querySelectorAll('#heroTitle .w').forEach(w=>{ if(w.textContent.includes('الأنظمة')) w.classList.add('hl'); });

// Typing effect
(function(){
  const words=['أحلّل السجلات وأكشف التهديدات','أبني أدوات بـ Python','أصمّم صفحات ويب تفاعلية','أتعلّم كل يوم شي جديد'];
  const el=document.getElementById('typed'); let wi=0,ci=0,del=false;
  if(reduceMotion){el.textContent=words[0];return}
  (function tick(){
    const w=words[wi];
    el.textContent=w.slice(0,ci);
    if(!del&&ci<w.length){ci++;setTimeout(tick,70)}
    else if(!del){del=true;setTimeout(tick,1600)}
    else if(ci>0){ci--;setTimeout(tick,35)}
    else{del=false;wi=(wi+1)%words.length;setTimeout(tick,300)}
  })();
})();

// Second marquee duplicate
const tr2=document.getElementById('track2'); if(tr2) tr2.innerHTML+=tr2.innerHTML;

// Spotlight follows mouse in hero
const hero=document.querySelector('.hero'), spot=document.getElementById('spot');
hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();spot.style.left=(e.clientX-r.left)+'px';spot.style.top=(e.clientY-r.top)+'px'});

// Floating chips parallax
const fls=document.querySelectorAll('.fl');
addEventListener('mousemove',e=>{
  const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
  fls.forEach((f,i)=>{const d=(i+1)*10; f.style.transform=`translate(${x*d}px,${y*d}px)`});
});

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(b=>{
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();
    b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

// 3D tilt + shine on project cards
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    const k=card.classList.contains('feat')?3:8;
    card.style.transform=`perspective(900px) rotateY(${(x-.5)*k}deg) rotateX(${(.5-y)*k}deg) translateY(-6px)`;
    card.style.setProperty('--mx',x*100+'%'); card.style.setProperty('--my',y*100+'%');
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

// Glow follows mouse on skill cards
document.querySelectorAll('.glow').forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px');
}));

// Back-to-top button + active nav link
const totop=document.getElementById('totop');
const navLinks=[...document.querySelectorAll('.links a')];
const secs=navLinks.map(a=>document.querySelector(a.getAttribute('href')));
addEventListener('scroll',()=>{
  totop.classList.toggle('show',scrollY>600);
  let cur=-1; secs.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top<innerHeight*.4) cur=i; });
  navLinks.forEach((a,i)=>a.classList.toggle('active',i===cur));
},{passive:true});

// Theme toggle (dark default, remembers choice)
(function(){
  const btn=document.getElementById('themeToggle'), root=document.documentElement;
  const sync=()=>{const light=root.dataset.theme==='light';btn.textContent=light?'☾':'☀';
    document.querySelector('meta[name="theme-color"]').content=light?'#ffffff':'#06080b'};
  sync();
  btn.addEventListener('click',()=>{
    root.dataset.theme=root.dataset.theme==='light'?'dark':'light';
    try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}
    sync();
  });
})();

// Hero terminal: types each command character by character
(function(){
  const body=document.getElementById('termBody'), ghost=document.getElementById('termGhost');
  if(!body) return;
  const prompt='<span class="p">anoud@portfolio</span><span class="m">:</span><span class="c">~</span><span class="m">$</span> ';
  const steps=[
    {cmd:'whoami', out:'<span class="k">anoud</span> <span class="m">// cybersecurity student</span>'},
    {cmd:'cat certs.txt', out:'<span class="p">[✓]</span> CEH — Certified Ethical Hacker'},
    {cmd:'ls ./projects', out:'<span class="c">awj-recruitment/</span>  <span class="c">login-attempt-analyzer/</span>\n<span class="c">digital-garden/</span>  <span class="c">memory-game/</span>'},
    {cmd:'nmap -sV future.career', out:'443/tcp <span class="p">open</span> opportunities\n<span class="k">0 vulnerabilities found.</span>'}
  ];
  const cur='<span class="cur"></span>';
  const full=steps.map(s=>prompt+s.cmd+'\n'+s.out+'\n').join('\n')+'\n'+prompt+cur;
  ghost.innerHTML=full;              // reserves the final height so the hero never jumps
  if(reduceMotion){body.innerHTML=full;return}   // "reduce motion": show everything at once
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  let started=false;
  const run=async()=>{
    if(started) return; started=true;
    let html='';
    await wait(900);
    for(const s of steps){
      html+=prompt;
      for(let i=1;i<=s.cmd.length;i++){ body.innerHTML=html+s.cmd.slice(0,i)+cur; await wait(55+Math.random()*55); }
      html+=s.cmd+'\n'; body.innerHTML=html+cur; await wait(300);
      html+=s.out+'\n\n'; body.innerHTML=html+prompt+cur; await wait(700);
    }
    body.innerHTML=html+prompt+cur;
  };
  body.innerHTML=prompt+cur;
  new IntersectionObserver((es,o)=>{ if(es[0].isIntersecting){run();o.disconnect()} }).observe(body);
})();
