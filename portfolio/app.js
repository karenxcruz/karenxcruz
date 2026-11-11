(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const content = window.portfolioContent;
  if (!content) return;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const tags = items => `<div class="tags">${items.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div>`;
  const cover = project => {
    const art = project.cover === 'dental' ? '<span class="dental-circle"></span><span class="dental-circle second"></span><span class="cover-dot"></span><span class="dental-monogram">Ec.</span>' : project.cover === 'research' ? `<div class="research-visual">${'<span></span>'.repeat(9)}</div>` : `<div class="calendar-visual"><div class="calendar-top"><span>MI CALENDARIO</span><span>✦</span></div><div class="calendar-dots">${'<i></i>'.repeat(28)}</div></div>`;
    return `<div class="project-cover cover-${project.cover}" aria-hidden="true"><span class="cover-marker">UN PROYECTO / UNA CONEXIÓN</span>${art}<span class="cover-caption">${escapeHTML(project.coverLabel)}</span></div>`;
  };
  $('#project-grid').innerHTML = content.projects.map(p => `<article class="project-card">${cover(p)}<div class="project-body"><span class="project-category">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.line)}</p>${tags(p.stack.slice(0,4))}<div class="project-action"><span>ÓRBITA ${p.number}</span><button type="button" data-project="${p.id}" aria-label="Conocer el proyecto ${escapeHTML(p.name)}">Conoce el proyecto <span aria-hidden="true">↗</span></button></div></div></article>`).join('');
  $('#stack-grid').innerHTML = content.technologies.map(g => `<article class="stack-group"><h3>${escapeHTML(g.title)}</h3><p>${escapeHTML(g.description)}</p><div class="stack-items">${g.items.map(([label,mark]) => `<div class="stack-item"><span aria-hidden="true">${escapeHTML(mark)}</span><small>${escapeHTML(label)}</small></div>`).join('')}</div></article>`).join('');

  const tabs = $$('.tabs [role="tab"]');
  function selectTab(tab, focus=false) {
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on; });
    if (focus) tab.focus();
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => selectTab(tab));
    tab.addEventListener('keydown',e => {let n;if(e.key==='ArrowRight')n=(index+1)%tabs.length;if(e.key==='ArrowLeft')n=(index+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectTab(tabs[n],true);}});
  });

  const dialog = $('#project-dialog'); let projectTrigger = null;
  function openProject(id, trigger) {
    const p=content.projects.find(p=>p.id===id); if(!p)return;
    projectTrigger=trigger;
    $('#dialog-content').innerHTML=`<div class="dialog-heading"><span class="eyebrow">ÓRBITA ${p.number} / ${escapeHTML(p.category)}</span><h2 id="dialog-title">${escapeHTML(p.name)}</h2><p class="dialog-lead">${escapeHTML(p.description)}</p></div><div class="dialog-role"><strong>MI PARTICIPACIÓN</strong>${escapeHTML(p.role)}</div><div class="dialog-columns"><div><h3>Mi aporte</h3><ul>${p.contributions.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ul></div><div><h3>Lo que permite hacer</h3><ul>${p.features.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ul></div></div><div class="dialog-tech"><h3>Tecnologías del proyecto</h3>${tags(p.stack)}</div><div class="dialog-actions">${p.code?`<a class="button secondary" href="${p.code}" target="_blank" rel="noopener noreferrer">Ver código <span aria-hidden="true">↗</span></a>`:''}${p.demo?`<a class="button primary" href="${p.demo}" target="_blank" rel="noopener noreferrer">Abrir aplicación <span aria-hidden="true">↗</span></a>`:''}<a class="text-link" href="mailto:karenximenacruz@gmail.com?subject=${encodeURIComponent('Conversemos sobre '+p.name)}">Conversemos sobre este proyecto ↗</a></div><p class="dialog-note">${escapeHTML(p.note)}</p>`;
    dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');$('#dialog-close').focus();
  }
  $$('.project-action button').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project,b)));
  $('#dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(projectTrigger)projectTrigger.focus();});
  $('#copy-email').addEventListener('click',async()=>{const feedback=$('#copy-feedback');try{await navigator.clipboard.writeText('karenximenacruz@gmail.com');feedback.textContent='Correo copiado. ¡Hablemos pronto!';}catch{feedback.textContent='Puedes copiarlo aquí: karenximenacruz@gmail.com';}});

  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let storedMotion=null;try{storedMotion=localStorage.getItem('karen-motion');}catch{}
  let motion=storedMotion===null?!media.matches:storedMotion==='on';
  const toggle=$('#motion-toggle'); let raf=0;
  function updateMotion(){document.body.classList.toggle('motion-off',!motion);toggle.setAttribute('aria-pressed',String(!motion));toggle.setAttribute('aria-label',motion?'Pausar animaciones':'Activar animaciones');$('.motion-text',toggle).textContent=motion?'Movimiento':'En pausa';if(!raf)raf=requestAnimationFrame(animate);}
  toggle.addEventListener('click',()=>{motion=!motion;try{localStorage.setItem('karen-motion',motion?'on':'off');}catch{}updateMotion();});
  $$('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.getElementById(link.getAttribute('href').slice(1));if(!target)return;event.preventDefault();target.scrollIntoView({behavior:motion?'smooth':'instant',block:'start'});history.replaceState(null,'',link.getAttribute('href'));}));
  media.addEventListener('change',e=>{motion=!e.matches;updateMotion();});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.06});
  $$('[data-reveal]').forEach(el=>observer.observe(el));document.body.classList.add('js-ready');
  setTimeout(()=>$$('.hero-enter').forEach(el=>el.classList.remove('hero-enter')),1600);
  const navLinks=$$('.nav a');const sectionObserver=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible.length){const id=visible[0].target.id;navLinks.forEach(a=>{const active=a.getAttribute('href')==='#'+id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -35% 0px',threshold:[0,.1,.3,.5]});
  ['inicio','universo','proyectos','contacto'].forEach(id=>sectionObserver.observe(document.getElementById(id)));
  $$('.tilt').forEach(panel=>panel.addEventListener('pointermove',e=>{if(!motion||e.pointerType==='touch')return;const r=panel.getBoundingClientRect();panel.style.setProperty('--mx',`${(e.clientX-r.left)/r.width*100}%`);panel.style.setProperty('--my',`${(e.clientY-r.top)/r.height*100}%`);}));

  const stage=$('#credential-stage'),badge=$('#badge-physics'),inner=$('#badge-inner'),flip=$('#flip-badge');
  const front=$('.badge-front'),back=$('.badge-back');let flipped=false;
  flip.addEventListener('click',()=>{flipped=!flipped;inner.classList.toggle('flipped',flipped);flip.setAttribute('aria-pressed',String(flipped));front.setAttribute('aria-hidden',String(flipped));back.setAttribute('aria-hidden',String(!flipped));flip.innerHTML=(flipped?'Volver a mi foto':'Ver el otro lado')+' <span aria-hidden="true">↻</span>';});
  let x=0,y=0,vx=0,vy=0,rotation=0,dragging=false,offsetX=0,offsetY=0,lastX=0,lastY=0,lastTime=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  badge.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;offsetX=e.clientX-x;offsetY=e.clientY-y;lastX=e.clientX;lastY=e.clientY;lastTime=performance.now();badge.classList.add('dragging');badge.setPointerCapture(e.pointerId);if(!raf)raf=requestAnimationFrame(animate);});
  badge.addEventListener('pointermove',e=>{if(!dragging)return;const t=performance.now(),dt=Math.max(t-lastTime,8);vx=clamp((e.clientX-lastX)/dt*16,-12,12);vy=clamp((e.clientY-lastY)/dt*16,-12,12);const limit=Math.max(10,Math.min(stage.clientWidth*.22,(stage.clientWidth-badge.offsetWidth)/2-10));x=clamp(e.clientX-offsetX,-limit,limit);y=clamp(e.clientY-offsetY,-65,40);lastX=e.clientX;lastY=e.clientY;lastTime=t;if(!raf)raf=requestAnimationFrame(animate);});
  function release(){dragging=false;badge.classList.remove('dragging');if(!raf)raf=requestAnimationFrame(animate);}
  badge.addEventListener('pointerup',release);badge.addEventListener('pointercancel',release);badge.addEventListener('lostpointercapture',()=>{if(dragging)release();});

  const canvas=$('#universe'),ctx=canvas.getContext('2d');let cw=0,ch=0,stars=[],lastTick=0;
  function resize(){cw=innerWidth;ch=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);let seed=75;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};stars=Array.from({length:cw<600?35:75},()=>({x:random()*cw,y:random()*ch,r:random()*.8+.25,phase:random()*6.28,speed:random()*.025+.005}));if(!raf)raf=requestAnimationFrame(animate);}
  function drawUniverse(t){ctx.clearRect(0,0,cw,ch);stars.forEach(s=>{const twinkle=motion?.32+Math.sin(t*.0007+s.phase)*.16:.32;ctx.fillStyle=`rgba(200,189,231,${twinkle})`;ctx.beginPath();ctx.arc(s.x,(s.y+(motion?t*s.speed*.06:0))%ch,s.r,0,Math.PI*2);ctx.fill();});if(motion){const elapsed=(t*.001)%9;if(elapsed<1.2){const p=elapsed/1.2,sx=cw*.74-p*210,sy=ch*.2+p*130;const g=ctx.createLinearGradient(sx,sy,sx+60,sy-38);g.addColorStop(0,`rgba(187,166,239,${Math.sin(p*Math.PI)*.3})`);g.addColorStop(1,'rgba(187,166,239,0)');ctx.strokeStyle=g;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+60,sy-38);ctx.stroke();}}}
  function animate(t){raf=0;const dt=lastTick?Math.min((t-lastTick)/16.67,2):1;lastTick=t;
    if(!dragging){if(motion){vx+=(-x*.025-vx*.1)*dt;vy+=(-y*.035-vy*.12)*dt;x+=vx*dt;y+=vy*dt;}else{x=0;y=0;vx=0;vy=0;}}
    const rest=motion&&!dragging?Math.sin(t*.0007)*2.2:0;rotation+=(clamp(x*.085+vx*.55+rest,-16,16)-rotation)*.12;
    badge.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rotation.toFixed(2)}deg)`;
    const center=stage.clientWidth/2;const top=badge.offsetTop+y-17;const path=`M ${center} 25 Q ${center+x*.2} ${top*.5} ${center+x} ${top}`;$('#strap').setAttribute('d',path);$('#strap-shadow').setAttribute('d',path);
    drawUniverse(t);if((motion||dragging)&&!document.hidden)raf=requestAnimationFrame(animate);
  }
  window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){lastTick=0;raf=requestAnimationFrame(animate);}});resize();updateMotion();
})();
