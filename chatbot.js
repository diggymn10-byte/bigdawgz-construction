/* Big Dawgz Construction — site chat assistant (self-injecting widget)
   Guided assistant: answers from approved facts, captures leads, never goes off-script.
   TODO before launch: confirm the FACTS below with Earl, and wire lead delivery (see submitLead). */
(function(){
  if(document.getElementById('bdc-launch')) return; // avoid double-load
  var AV='assets/bulldog-avatar.png';

  var CSS=''+
  '#bdc-launch{position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;background:#0d0d0d;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 14px 30px -8px rgba(20,25,35,.55);z-index:2147483000;transition:transform .18s,box-shadow .18s;border:none;padding:0}'+
  '#bdc-launch:hover{transform:translateY(-2px);box-shadow:0 18px 36px -8px rgba(233,83,31,.5)}'+
  '#bdc-launch img{width:64px;height:64px;object-fit:cover;border-radius:50%}'+
  '#bdc-launch .bdc-x{display:none}#bdc-launch.open img{display:none}#bdc-launch.open .bdc-x{display:block}'+
  '#bdc-launch .bdc-x svg{width:26px;height:26px;stroke:#fff;fill:none;stroke-width:2.4;stroke-linecap:round}'+
  '#bdc-win{position:fixed;bottom:100px;right:24px;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 130px);background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 30px 70px -24px rgba(20,25,35,.6);z-index:2147483000;display:none;flex-direction:column;font-family:Inter,system-ui,-apple-system,sans-serif}'+
  '#bdc-win.show{display:flex;animation:bdcpop .22s ease}'+
  '@keyframes bdcpop{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}'+
  '.bdc-head{display:flex;align-items:center;gap:12px;padding:15px 18px;background:#E9531F;color:#fff}'+
  '.bdc-head .av{width:42px;height:42px;border-radius:50%;background:#0d0d0d;flex:0 0 42px;display:flex;align-items:center;justify-content:center;overflow:hidden}'+
  '.bdc-head .av img{width:42px;height:42px;object-fit:cover;border-radius:50%}'+
  '.bdc-head b{font-family:Oswald,sans-serif;font-weight:600;font-size:16px;letter-spacing:.3px;display:block;line-height:1.15}'+
  '.bdc-head small{font-size:12px;display:flex;align-items:center;gap:6px;color:#ffe0d5}'+
  '.bdc-head small:before{content:"";width:7px;height:7px;border-radius:50%;background:#35d16a;display:inline-block}'+
  '.bdc-body{flex:1;overflow-y:auto;padding:16px 15px;display:flex;flex-direction:column;gap:9px;background:#f7f8fa}'+
  '.bdc-row{display:flex;gap:8px;align-items:flex-end;max-width:86%}'+
  '.bdc-row.out{align-self:flex-end;flex-direction:row-reverse}'+
  '.bdc-row .pic{width:26px;height:26px;border-radius:50%;flex:0 0 26px;background:#0d0d0d;overflow:hidden;display:flex;align-items:center;justify-content:center}'+
  '.bdc-row .pic img{width:26px;height:26px;object-fit:cover;border-radius:50%}'+
  '.bdc-bub{padding:9px 13px;font-size:13.7px;line-height:1.45}'+
  '.bdc-row.in .bdc-bub{background:#fff;border:1px solid #e6e8ec;color:#20242c;border-radius:15px 15px 15px 5px}'+
  '.bdc-row.out .bdc-bub{background:#E9531F;color:#fff;border-radius:15px 15px 5px 15px}'+
  '.bdc-quick{display:flex;flex-wrap:wrap;gap:7px;padding:2px 0 4px 34px}'+
  '.bdc-quick button{background:#fff;border:1.5px solid #E9531F;color:#c8430f;font-family:Inter,sans-serif;font-weight:600;font-size:12.7px;padding:8px 13px;border-radius:18px;cursor:pointer;transition:.15s}'+
  '.bdc-quick button:hover{background:#E9531F;color:#fff}'+
  '.bdc-typing{display:flex;gap:4px;padding:2px 2px;align-items:center}'+
  '.bdc-typing span{width:7px;height:7px;border-radius:50%;background:#c3c8d0;animation:bdcb 1s infinite}'+
  '.bdc-typing span:nth-child(2){animation-delay:.15s}.bdc-typing span:nth-child(3){animation-delay:.3s}'+
  '@keyframes bdcb{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}'+
  '.bdc-foot{padding:11px 13px;display:flex;align-items:center;gap:9px;border-top:1px solid #e6e8ec;background:#fff}'+
  '.bdc-foot input{flex:1;border:1px solid #e6e8ec;border-radius:22px;padding:10px 15px;font-size:13.5px;font-family:inherit;color:#20242c;outline:none}'+
  '.bdc-foot input:focus{border-color:#E9531F}'+
  '.bdc-foot .send{width:38px;height:38px;border-radius:50%;flex:0 0 38px;background:#E9531F;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center}'+
  '.bdc-foot .send svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
  '.bdc-disc{font-size:10.5px;text-align:center;padding:7px 10px;color:#9aa1ad;background:#f6f7f9}';

  var style=document.createElement('style'); style.textContent=CSS; document.head.appendChild(style);

  var host=document.createElement('div');
  host.innerHTML=''+
  '<button id="bdc-launch" aria-label="Open chat"><img src="'+AV+'" alt=""><span class="bdc-x"><svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span></button>'+
  '<div id="bdc-win" role="dialog" aria-label="Big Dawgz chat">'+
    '<div class="bdc-head"><span class="av"><img src="'+AV+'" alt=""></span><div><b>Big Dawgz Construction</b><small>Online now</small></div></div>'+
    '<div class="bdc-body" id="bdc-body"></div>'+
    '<div class="bdc-foot"><input id="bdc-input" placeholder="Type your message..." autocomplete="off"><button class="send" id="bdc-send" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg></button></div>'+
    '<div class="bdc-disc">Automated assistant &middot; General info only, not a quote or advice</div>'+
  '</div>';
  document.body.appendChild(host);

  var body=document.getElementById('bdc-body'),win=document.getElementById('bdc-win'),launch=document.getElementById('bdc-launch'),input=document.getElementById('bdc-input'),send=document.getElementById('bdc-send');
  var started=false,mode='menu',lead={};

  // ===== APPROVED FACTS (placeholder — CONFIRM WITH EARL) =====
  var MENU=[{k:'inspection',label:'Free inspection'},{k:'storm',label:'Storm / hail damage'},{k:'services',label:'Our services'},{k:'area',label:'Where you work'},{k:'talk',label:'Talk to someone'}];
  var A={
    inspection:"We do free inspections and estimates — no cost, no pressure. Want us to reach out and set one up?",
    storm:"Storm and hail damage is what we do best. We inspect and document the damage, work with your insurance, and get your roof back to pre-storm condition. The inspection is free. Want us to take a look?",
    services:"We're a full-service general contractor: roofing, siding, storm restoration, remodels, utility buildings, and general contracting. What are you looking to get done?",
    area:"We're based in Burkburnett, TX and cover Wichita Falls plus communities across North Texas and Southern Oklahoma. Want us to reach out?",
    talk:"Happy to help. You can call us at 844-569-DAWG, or leave your name and number and we'll reach out."
  };

  function scrollDown(){body.scrollTop=body.scrollHeight;}
  function bot(text,cb){var t=document.createElement('div');t.className='bdc-row in';t.innerHTML='<span class="pic"><img src="'+AV+'"></span><div class="bdc-bub"><div class="bdc-typing"><span></span><span></span><span></span></div></div>';body.appendChild(t);scrollDown();setTimeout(function(){t.querySelector('.bdc-bub').textContent=text;scrollDown();if(cb)cb();},650);}
  function user(text){var r=document.createElement('div');r.className='bdc-row out';r.innerHTML='<div class="bdc-bub"></div>';r.querySelector('.bdc-bub').textContent=text;body.appendChild(r);scrollDown();}
  function quick(options){var q=document.createElement('div');q.className='bdc-quick';options.forEach(function(o){var b=document.createElement('button');b.textContent=o.label;b.onclick=function(){q.remove();user(o.label);handle(o.k);};q.appendChild(b);});body.appendChild(q);scrollDown();}
  function showMenu(){mode='menu';quick(MENU);}
  function handle(k){
    if(A[k]){bot(A[k],function(){
      if(k==='services')quick([{k:'inspection',label:'Free inspection'},{k:'storm',label:'Storm damage'},{k:'talk',label:'Talk to someone'},{k:'menu',label:'Back to menu'}]);
      else if(k==='talk')quick([{k:'leave',label:'Leave my info'},{k:'menu',label:'Back to menu'}]);
      else quick([{k:'leave',label:'Yes, contact me'},{k:'menu',label:'Back to menu'}]);
    });}
    else if(k==='menu'){bot("No problem — what else can I help with?",showMenu);}
    else if(k==='leave'){mode='ask_name';bot("Great! What's your name?");}
  }
  function submitLead(){
    // TODO: deliver lead to Big Dawgz. Wire to the same destination as the contact form (Web3Forms key) at launch.
    try{console.log('BDC LEAD:',lead);}catch(e){}
  }
  function freeText(text){
    if(mode==='ask_name'){lead.name=text;mode='ask_phone';bot("Thanks "+text+"! And the best phone number to reach you?");return;}
    if(mode==='ask_phone'){lead.phone=text;mode='done';submitLead();bot("Perfect — someone from Big Dawgz will reach out to you soon. Anything else I can help with?",function(){quick([{k:'menu',label:'Back to menu'}]);});return;}
    bot("Good question — let me have someone from the team reach out with the details. What's your name?",function(){mode='ask_name';});
  }
  function onSend(){var v=input.value.trim();if(!v)return;input.value='';user(v);freeText(v);}
  send.onclick=onSend;
  input.addEventListener('keydown',function(e){if(e.key==='Enter')onSend();});
  launch.onclick=function(){var open=win.classList.toggle('show');launch.classList.toggle('open',open);if(open&&!started){started=true;bot("Hey! Thanks for stopping by Big Dawgz Construction. What can I help you with today?",showMenu);}};
})();
