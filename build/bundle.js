let e;var t;(t=e||(e={}))[t.Image=0]="Image",t[t.Audio=1]="Audio";class s{constructor(e,t){this.x=e,this.y=t}static equal(e,t){return e.x===t.x&&e.y===t.y}shifted(e){return new s(this.x+e.x,this.y+e.y)}multiplied(e){return new s(this.x*e,this.y*e)}angleTo(e){return Math.atan2(e.y-this.y,e.x-this.x)}distTo(e){const t=e.x-this.x,s=e.y-this.y;return Math.hypot(t,s)}scaled(e,t){return new s(this.x/e*t,this.y/e*t)}centred(e){return new s(this.x+e/2,this.y+e/2)}isInside(e){return this.x>=e.x&&this.x<=e.x+e.width&&this.y>=e.y&&this.y<=e.y+e.height}clone(){return new s(this.x,this.y)}}class o{constructor(e,t,s,o){this.x=e,this.y=t,this.width=s,this.height=o}overlaps(e){return this.x<e.x+e.width&&this.x+this.width>e.x&&this.y<e.y+e.height&&this.y+this.height>e.y}static fromVecs(e,t){return new o(e.x,e.y,t.x,t.y)}}const n=(e,t)=>Math.floor(Math.random()*(t-e+1))+e,i=(e,t,s=e.roomAt(e.playerRoomPos))=>{const n=e.ecs.getComponent(t,S);if(e.ecs.hasComponent(t,k))return s.entities.some((s=>{if(s===t)return!1;if(e.ecs.hasComponent(s,k)){const o=e.ecs.getComponent(s,k).getActualHitbox(e.ecs.getComponent(s,S));return e.ecs.getComponent(t,k).getActualHitbox(n).overlaps(o)}return!1}));{const s=e.ecs.getComponent(e.leftHandItemBox,k).getActualHitbox(e.ecs.getComponent(e.leftHandItemBox,S)),i=e.ecs.getComponent(e.rightHandItemBox,k).getActualHitbox(e.ecs.getComponent(e.rightHandItemBox,S));e.ecs.addComponent(t,k,[new o(0,0,e.tileSize,e.tileSize)]);const a=e.ecs.getComponent(t,k).getActualHitbox(n);let r;return r=!(!s.overlaps(a)&&!i.overlaps(a)),e.ecs.removeComponent(t,k),r}},a=(e,t,s)=>{if(t.allEmpty())return!1;const[o,n]=t.takeItem(),a=e.ecs.getComponent(o,S),l=a.pixels.clone();return a.pixels=s,i(e,o)?(a.pixels=l,t.addItem(o,n),!1):(a.room=a.room.clone(),e.ecs.bringToFront(o),e.ecs.entitiesWithComponents(e.roomAt(e.playerRoomPos),[T]).forEach(e.ecs.bringToFront,e.ecs),e.shouldPlaySFX&&r(e.getAudio("place")).play(),!0)},r=e=>e.cloneNode(),l=(e,t,s)=>{const o=e.ecs.getComponent(s,S),n=e.ecs.getComponent(s,v),a=n.speedX*e.tileSize/e.currentFrameRate,r=n.speedY*e.tileSize/e.currentFrameRate;o.pixels.x+=a,i(e,s,t)&&(o.pixels.x-=a),o.pixels.y+=r,i(e,s,t)&&(o.pixels.y-=r)},c=(e,t,o)=>{let a;do{a=new s((n(2,e.roomSize.x-3)+Math.random()-.5)*e.tileSize,(n(2,e.roomSize.y-3)+Math.random()-.5)*e.tileSize),e.ecs.addComponent(o,S,[a,t.pos.clone()])}while(i(e,o,t))},m=(e,t,s,o,n=0)=>{e.strokeStyle=t,e.beginPath(),e.moveTo(s.x+n,s.y+n),e.lineTo(o.x+n,o.y+n),e.stroke()},h=(e,t)=>e.hasComponent(t,L),d=(e,t)=>e.hasComponent(t,O);class p{}class g{components={};addComponent(e,t){this.components[e]=t}removeComponent(e){delete this.components[e]}getComponent(e){return this.components[e]}}let u;var y;(y=u||(u={}))[y.Tick=0]="Tick",y[y.Keyboard=1]="Keyboard",y[y.KeyUp=2]="KeyUp",y[y.Click=3]="Click",y[y.RightClick=4]="RightClick",y[y.Hit=5]="Hit";class f{requiredComponents=[];ignoreAUC=!1;constructor(e,t,s){this.requiredComponents=e,this.trigger=t,this.update=s}}class x{systems=[];constructor(e){this.game=e}addSystem(e){this.systems.push(e)}updateSystems(e){const t=this.systems.filter((t=>t.trigger===e));for(const e of t){const t=[],s=this.game.roomAt(this.game.playerRoomPos);t.push(...this.game.ecs.entitiesWithComponents(s,e.requiredComponents)),e.ignoreAUC||t.push(...this.game.ecs.entities.filter((t=>d(this.game.ecs,t)&&e.requiredComponents.every((e=>this.game.ecs.hasComponent(t,e))))));for(const s of t)e.update(this.game,s)}}}class C{#e=[];componentManagers=new Map;constructor(e){this.systemManager=new x(e)}get entities(){return this.#e.filter((e=>!h(this,e)))}createEntity(){let e=this.#e.length;for(;this.#e.includes(e);)e++;return this.#e.push(e),e}removeEntity(e){this.#e.splice(this.#e.indexOf(e),1);for(const t of this.componentManagers.values())t.components[e]&&t.removeComponent(e)}bringToFront(e){this.#e.splice(this.#e.indexOf(e),1),this.#e.push(e)}hasComponent(e,t){return void 0!==this.componentManagers.get(t)?.getComponent(e)}addComponent(e,t,s=[]){this.componentManagers.has(t)||this.componentManagers.set(t,new g),this.componentManagers.get(t).addComponent(e,new t(...s))}getComponent(e,t){return this.componentManagers.get(t).getComponent(e)}removeComponent(e,t){this.componentManagers.get(t).removeComponent(e)}entitiesWithComponents(e,t){const s=[];for(const o of e.entities){let e=!0;for(const s of t)if(!this.hasComponent(o,s)){e=!1;break}e&&s.push(o)}return s}}class w{constructor(e,t,s,o,n){this.pos=e,this.angle=t,this.speed=s,this.friction=o,this.colour=n}static createBurst(e,t,s,o,n,i,a){for(let r=0;r<t;r++)setTimeout((()=>{e.particles.push(new w(o,Math.random()*Math.PI*2,n*(.75+.5*Math.random()),i,a))}),s*r)}}class S{constructor(e,t){this.pixels=e,this.room=t}getCentre(e){return new s(this.pixels.x+e/2,this.pixels.y+e/2)}}class z{timeOflastFrameChange=0;constructor(e,t,o){this.image=e,this.frame=t,this.dest=o||new s(null,null)}}class v{constructor(e){this.velocity=e,this.speedX=0,this.speedY=0}speedsTo(e,t){const s=Math.hypot(e,t);return[e/s*this.velocity||0,t/s*this.velocity||0]}get currentVelocity(){return Math.hypot(this.speedX,this.speedY)}}class k extends o{constructor(e){super(e.x,e.y,e.width,e.height)}getActualHitbox(e){return new k(new o(this.x+e.pixels.x,this.y+e.pixels.y,this.width,this.height))}}class H{constructor(e,t){this.leftHand=e,this.rightHand=t}hasSpace(){return null===this.leftHand||null===this.rightHand}allEmpty(){return null===this.leftHand&&null===this.rightHand}addItem(e,t){return"left"===t&&null===this.leftHand?(this.leftHand=e,e):null===this.rightHand?(this.rightHand=e,e):null}takeItem(){if(null!==this.leftHand){const e=this.leftHand;return this.leftHand=null,[e,"left"]}if(null!==this.rightHand){const e=this.rightHand;return this.rightHand=null,[e,"right"]}return null}}class M{#t;#s;constructor(e,t,s){this.health=e,this.maxHealth=e,this.#t=t,this.#s=s}heal(e){this.health=Math.min(this.health+e,this.maxHealth)}damage(e){if(this.health-=e,this.health<=0)if(this.#s===this.#t.player)pe("Game Over","Menu",!1),this.#t.paused=!0;else if(this.#s===this.#t.goose)pe("You Win!","Menu",!1);else if(this.#t.ecs.hasComponent(this.#s,R)&&w.createBurst(this.#t,17,17,this.#t.ecs.getComponent(this.#s,S).getCentre(this.#t.tileSize),.1,.997,this.#t.ecs.getComponent(this.#s,R).colour),this.#t.ecs.hasComponent(this.#s,E)){this.#t.ecs.addComponent(this.#s,L);const e=this.#t.ecs.getComponent(this.#s,E);e.timeOfDeath=performance.now(),e.timeUntilRespawn=n(...e.timeUntilRespawnRange),this.#t.toRespawn.push(this.#s)}else this.#t.ecs.removeEntity(this.#s)}}class A extends p{constructor(e){super(),this.damage=e}}class I{sneaking=!1}class T{constructor(e){this.canGetTired=e}}class P{}class b{randomWalkAngle=Math.random()*Math.PI*2;timeOfLastAngleChange=0;static angleChangeInterval=2e3;constructor(e,t){this.target=e,this.maxTiles=t}}class R{constructor(e){this.colour=e}}class L{constructor(e){this.shouldUpdate=e}}class E{constructor(e){this.timeUntilRespawnRange=e}}class F{timeOfLastHit=0;timeUntilNextHit=0;constructor(e,t,s){this.target=e,this.timeBetweenHitsRange=t,this.maxHitDist=s}}class O{}class X{constructor(e){this.entityToEvade=e}}class Y extends f{constructor(){super([I,v],u.Keyboard,((e,t)=>{const s=e.ecs.getComponent(t,v);if(e.keys.a||e.keys.arrowleft?e.keys.w||e.keys.arrowup?[s.speedX,s.speedY]=s.speedsTo(-1,-1):e.keys.s||e.keys.arrowdown?[s.speedX,s.speedY]=s.speedsTo(-1,1):[s.speedX,s.speedY]=s.speedsTo(-1,0):e.keys.d||e.keys.arrowright?e.keys.w||e.keys.arrowup?[s.speedX,s.speedY]=s.speedsTo(1,-1):e.keys.s||e.keys.arrowdown?[s.speedX,s.speedY]=s.speedsTo(1,1):[s.speedX,s.speedY]=s.speedsTo(1,0):e.keys.w||e.keys.arrowup?[s.speedX,s.speedY]=s.speedsTo(0,-1):e.keys.s||e.keys.arrowdown?[s.speedX,s.speedY]=s.speedsTo(0,1):(s.speedX=0,s.speedY=0),e.keys.shift){s.speedX/=3,s.speedY/=3;e.ecs.getComponent(t,I).sneaking=!0}}))}}class B extends f{constructor(){super([T,v,z],u.Tick,((e,t)=>{const s=e.ecs.getComponent(t,v),o=e.ecs.getComponent(t,z),n=e.ecs.getComponent(t,S);if(0===s.speedX&&0===s.speedY)o.frame.y=0;else{const e=Math.atan2(s.speedY,s.speedX);o.frame.y=0,e>-5*Math.PI/8&&e<-3*Math.PI/8?o.frame.y=16:e>=-3*Math.PI/8&&e<=3*Math.PI/8?o.frame.y=48:(e<=-5*Math.PI/8||e>=5*Math.PI/8)&&(o.frame.y=32)}if(l(e,e.roomAt(n.room),t),0!==s.speedX||0!==s.speedY){const i=1/s.currentVelocity*400;if(performance.now()-o.timeOflastFrameChange>=i&&(o.frame.x+=16,o.frame.x%=64,o.timeOflastFrameChange=performance.now(),(16===o.frame.x||48===o.frame.x)&&e.shouldPlaySFX)){const o=r(e.getAudio("footstep"));o.volume*=.5,t!==e.player&&(o.volume*=.5),o.volume*=s.currentVelocity/s.velocity;const i=e.ecs.getComponent(e.player,S).pixels.distTo(n.pixels);o.volume*=Math.max(1-i/(e.roomSize.x*e.tileSize),0),o.play()}}else o.frame.x=0;const a=e.ecs.getComponent(t,T);if(e.ecs.hasComponent(t,M)&&a.canGetTired){const o=e.ecs.getComponent(t,M);0!==s.currentVelocity?o.damage(s.currentVelocity/200):o.heal(o.maxHealth/1500)}n.pixels.x<0&&n.room.x>0?(n.room.x--,n.pixels.x=e.tileSize*e.roomSize.x-e.tileSize,i(e,t,e.roomAt(n.room))&&(n.room.x++,n.pixels.x=0)):n.pixels.x>e.tileSize*e.roomSize.x-e.tileSize&&n.room.x<e.roomSize.x-1?(n.room.x++,n.pixels.x=0,i(e,t,e.roomAt(n.room))&&(n.room.x--,n.pixels.x=e.tileSize*e.roomSize.x-e.tileSize)):n.pixels.y<0&&n.room.y>0?(n.room.y--,n.pixels.y=e.tileSize*e.roomSize.y-e.tileSize,i(e,t,e.roomAt(n.room))&&(n.room.y++,n.pixels.y=0)):n.pixels.y>e.tileSize*e.roomSize.y-e.tileSize&&n.room.y<e.roomSize.y-1&&(n.room.y++,n.pixels.y=0,i(e,t,e.roomAt(n.room))&&(n.room.y--,n.pixels.y=e.tileSize*e.roomSize.y-e.tileSize))}))}}class q extends f{ignoreAUC=!0;constructor(){super([S,z],u.Tick,((e,t)=>{const o=e.ecs.getComponent(t,S);if(e.keys.h&&e.ecs.hasComponent(t,X)){const o=e.ecs.getComponent(t,S),n=e.ecs.getComponent(t,v);m(e.ctx,"red",o.pixels,o.pixels.shifted(new s(n.speedX*e.canvas.width*2,n.speedY*e.canvas.width*2)),e.tileSize/2)}const n=e.ecs.getComponent(t,z);if(e.ctx.drawImage(n.image,n.frame.x,n.frame.y,n.frame.width,n.frame.height,o.pixels.x,o.pixels.y,n.dest.x??e.tileSize,n.dest.y??e.tileSize),e.keys.h&&e.ecs.hasComponent(t,k)){const s=e.ecs.getComponent(t,k).getActualHitbox(o);e.ctx.strokeStyle="#ff2222",e.ctx.lineWidth=Math.ceil(e.tileSize/90),e.ctx.strokeRect(s.x,s.y,s.width,s.height)}}))}}class U extends f{constructor(){super([H,S,I],u.RightClick,((e,t)=>{const o=e.ecs.getComponent(t,S),n=e.lastClickPos.x-o.pixels.x,i=e.lastClickPos.y-o.pixels.y;if(Math.hypot(n,i)>5*e.tileSize)return;const r=e.ecs.getComponent(t,H);a(e,r,e.lastClickPos.shifted(new s(-e.tileSize/2,-e.tileSize/2)))}))}}class W extends f{constructor(){super([I,H,S],u.KeyUp,((e,t)=>{if("f"===e.keyReleased){const s=e.ecs.getComponent(t,H);if(s.leftHand&&!s.rightHand){s.rightHand=s.leftHand,s.leftHand=null;e.ecs.getComponent(s.rightHand,S).pixels=e.rightHandItemPos}else if(!s.leftHand&&s.rightHand){s.leftHand=s.rightHand,s.rightHand=null;e.ecs.getComponent(s.leftHand,S).pixels=e.leftHandItemPos}else if(s.leftHand&&s.rightHand){const t=s.leftHand;s.leftHand=s.rightHand,s.rightHand=t;const o=e.ecs.getComponent(s.leftHand,S),n=e.ecs.getComponent(s.rightHand,S);o.pixels=e.leftHandItemPos,n.pixels=e.rightHandItemPos}(s.leftHand||s.rightHand)&&e.shouldPlaySFX&&r(e.getAudio("swap_hands")).play()}if("q"===e.keyReleased){const o=e.ecs.getComponent(t,H),n=e.ecs.getComponent(t,S),i={left:new s(-1,0),right:new s(1,0),above:new s(0,-1),below:new s(0,1)}[e.keys.d?"left":e.keys.a?"right":e.keys.w?"below":e.keys.s?"above":null],r=()=>{for(const t of[0,1,-1])for(const i of[-1,1,0]){if(a(e,o,new s(n.pixels.x+e.tileSize*i,n.pixels.y+e.tileSize*t)))return}};if(i){a(e,o,n.pixels.shifted(i.multiplied(e.tileSize)))||r()}else r()}if("shift"===e.keyReleased){e.ecs.getComponent(t,I).sneaking=!1}}))}}class G extends f{ignoreAUC=!0;constructor(){super([M,S],u.Tick,((e,t)=>{const s=e.ecs.getComponent(t,M),o=e.ecs.getComponent(t,S),n=(t,s)=>{e.ctx.fillStyle=t,e.ctx.fillRect(o.pixels.x,o.pixels.y+e.tileSize+4,e.tileSize*s,e.tileSize/8)};n("#ccc",1),n(`hsl(${s.health/s.maxHealth*100}, 100%, 50%)`,s.health/s.maxHealth)}))}}class V extends f{constructor(){super([A],u.Tick,((e,t)=>{const s=e.ecs.getComponent(t,A);if(s.frameCount<s.totalFrames){s.frameCount++;const o=e.ecs.getComponent(t,z),n=e.ecs.getComponent(s.holder,S).pixels.centred(e.tileSize);e.ctx.save(),e.ctx.translate(s.pivotPointOffset.x+n.x,s.pivotPointOffset.y+n.y),e.ctx.rotate(s.startAngle+s.swingRadians*s.frameCount/s.totalFrames),e.ctx.drawImage(o.image,o.frame.x,o.frame.y,o.frame.width,o.frame.height,0,.8*-e.tileSize,.8*e.tileSize,.8*e.tileSize),e.ctx.restore()}}))}}class K extends f{constructor(){super([b,S],u.Tick,((e,t)=>{const o=e.ecs.getComponent(t,b),n=e.ecs.getComponent(t,S),i=e.ecs.getComponent(o.target,S),a=i.pixels.distTo(n.pixels);let r=o.maxTiles*e.tileSize;if(o.target===e.player){e.ecs.getComponent(e.player,I).sneaking&&(r/=2)}const l=e.ecs.getComponent(t,v);if(a<r){const e=i.pixels.x-n.pixels.x,t=i.pixels.y-n.pixels.y;[l.speedX,l.speedY]=l.speedsTo(e,t)}else l.speedX=Math.cos(o.randomWalkAngle)*l.velocity,l.speedY=Math.sin(o.randomWalkAngle)*l.velocity,performance.now()-o.timeOfLastAngleChange>b.angleChangeInterval&&Math.random()<.1&&(o.randomWalkAngle+=Math.PI/4+Math.random()*Math.PI/4*(Math.random()<.5?1:-1),o.randomWalkAngle%=2*Math.PI,o.timeOfLastAngleChange=performance.now());e.keys.h&&m(e.ctx,"red",n.pixels,a<r?i.pixels:n.pixels.shifted(new s(Math.cos(o.randomWalkAngle)*e.canvas.width*2,Math.sin(o.randomWalkAngle)*e.canvas.width*2)),e.tileSize/2)}))}}const N=(e,t,o)=>{const n=e.ecs.getComponent(t,H),i=e.ecs.hasComponent(n.rightHand,A)?n.rightHand:e.ecs.hasComponent(n.leftHand,A)?n.leftHand:null;if(i){const n=e.ecs.getComponent(i,A);n.holder=t,n.frameCount=0,n.totalFrames=15;const a=e.ecs.getComponent(t,S),r=e.ecs.getComponent(o,S);n.startAngle=a.pixels.angleTo(r?.pixels||e.lastClickPos),n.swingRadians=Math.PI/3,n.pivotPointOffset=new s(Math.cos(n.startAngle)*e.tileSize/5,Math.sin(n.startAngle)*e.tileSize/5)}if(null!==o)if(e.ecs.hasComponent(o,P))if(n.hasSpace()){const i=n.addItem(o,"left"),a=e.ecs.getComponent(i,S);t===e.player?a.pixels=n.leftHand===i?e.leftHandItemPos:e.rightHandItemPos:a.pixels=new s(0,0),a.room=e.ecs.getComponent(t,S).room,e.shouldPlaySFX&&r(e.getAudio("pick_up")).play()}else e.shouldPlaySFX&&r(e.getAudio("decline")).play();else if(i&&e.ecs.hasComponent(o,M)){const t=e.ecs.getComponent(o,M),s=e.ecs.getComponent(i,A).damage;t.damage(s)}};class _ extends f{constructor(){super([I,S,H],u.Click,((e,t)=>{const s=e.ecs.getComponent(t,S),n=e.roomAt(e.playerRoomPos).entities.slice().reverse().find((n=>{if(!e.ecs.hasComponent(n,P)&&!e.ecs.hasComponent(n,M))return!1;if(n===t)return!1;const i=e.ecs.getComponent(n,S);if(s.pixels.distTo(i.pixels)>1.8*e.tileSize)return!1;let a=!1;e.ecs.hasComponent(n,k)||(e.ecs.addComponent(n,k,[new o(0,0,e.tileSize,e.tileSize)]),a=!0);const r=e.ecs.getComponent(n,k),l=e.lastClickPos.isInside(r.getActualHitbox(i));return a&&e.ecs.removeComponent(n,k),l}));N(e,t,n??null)}))}}class j extends f{constructor(){super([],u.Tick,(e=>{for(const[t,o]of e.particles.entries())o.pos=o.pos.shifted(new s(o.speed*Math.cos(o.angle)*e.tileSize/e.currentFrameRate,o.speed*Math.sin(o.angle)*e.tileSize/e.currentFrameRate)),o.speed*=o.friction,o.speed<.005&&e.particles.splice(t,1),e.ctx.fillStyle=o.colour,e.ctx.fillRect(o.pos.x,o.pos.y,e.tileSize/10,e.tileSize/10)}))}}class D extends f{constructor(){super([],u.Tick,(e=>{for(const t of e.toRespawn){const s=e.ecs.getComponent(t,E);if(performance.now()-s.timeOfDeath>s.timeUntilRespawn){e.ecs.removeComponent(t,L);const s=e.ecs.getComponent(t,M);s.heal(s.maxHealth);const o=e.ecs.getComponent(t,S);i(e,t)&&c(e,e.roomAt(o.room),t),e.ecs.bringToFront(t),e.toRespawn.splice(e.toRespawn.indexOf(t),1)}}}))}}class $ extends f{constructor(){super([X],u.Tick,((e,t)=>{const o=e.ecs.getComponent(t,X),n=e.ecs.getComponent(t,S),i=e.ecs.getComponent(o.entityToEvade,S),a=e.ecs.getComponent(t,v);for(const[t,o]of Object.entries(e.roomAt(n.room).doors)){if(0===o.length)continue;if(n.room.shifted({top:new s(0,-1),bottom:new s(0,1),left:new s(-1,0),right:new s(1,0)}[t]).distTo(i.room)<n.room.distTo(i.room))continue;const r=o[Math.floor(o.length/2)],l={top:new s(r,-1),bottom:new s(r,e.roomSize.y),left:new s(-1,r),right:new s(e.roomSize.x,r)}[t].multiplied(e.tileSize),c=n.pixels.angleTo(l),m=[Math.cos(c)*a.velocity,Math.sin(c)*a.velocity],h=n.pixels.shifted(new s(...m));if(!s.equal(n.room,e.playerRoomPos)||h.distTo(i.pixels)>=n.pixels.distTo(i.pixels))return void([a.speedX,a.speedY]=a.speedsTo(...m))}if(s.equal(n.room,i.room)){const e=i.pixels.x-n.pixels.x,t=i.pixels.y-n.pixels.y;[a.speedX,a.speedY]=a.speedsTo(-e,-t)}}))}}class Q extends f{constructor(){super([F,S],u.Tick,((e,t)=>{const s=e.ecs.getComponent(t,F);if(null===s.target)return;const o=e.ecs.getComponent(t,S),i=e.ecs.getComponent(s.target,S);o.pixels.distTo(i.pixels)<e.tileSize*s.maxHitDist&&performance.now()-s.timeOfLastHit>s.timeUntilNextHit&&(s.timeOfLastHit=performance.now(),s.timeUntilNextHit=n(...s.timeBetweenHitsRange),N(e,t,s.target))}))}}const J=(e,t,s,o,n)=>{const i=e.ecs.createEntity();return n&&e.ecs.addComponent(i,k,[n]),c(e,t,i),e.ecs.addComponent(i,z,[s,o]),e.ecs.addComponent(i,P),i},Z=(e,t)=>{const n=e.ecs.createEntity();e.ecs.addComponent(n,z,[e.getImage("zombie"),new o(0,0,16,16)]),e.ecs.addComponent(n,k,[o.fromVecs(new s(2,0).scaled(16,e.tileSize).shifted(new s(0,2)),new s(12,16).scaled(16,e.tileSize).shifted(new s(0,-2)))]),c(e,t,n);const i=e.ecs.getComponent(e.player,v).velocity;e.ecs.addComponent(n,v,[i/3+i/3*(e.level/le.maxLevel)]),e.ecs.addComponent(n,b,[e.player,e.roomSize.x/2+e.roomSize.x/2*e.level/le.maxLevel]),e.ecs.addComponent(n,M,[e.level/le.maxLevel*70+20,e,n]);const a=1e3-500*e.level/le.maxLevel;e.ecs.addComponent(n,F,[e.player,[a,a+1e3],1.5]);const r=8e3-5e3*e.level/le.maxLevel;e.ecs.addComponent(n,E,[[r,r+5e3]]);const l=e.ecs.createEntity();e.ecs.addComponent(l,z,[e.getImage("items"),new o(16,32,16,16)]),e.ecs.addComponent(l,S,[new s(e.canvas.width,e.canvas.height),t.pos]),e.ecs.addComponent(l,P),e.ecs.addComponent(l,A,[10]),e.ecs.addComponent(n,H,[l,null]),e.ecs.addComponent(n,T,[!1]),e.ecs.addComponent(n,R,["#bb0000"])},ee=(e,t)=>{const n=e.ecs.createEntity();return e.ecs.addComponent(n,O),e.ecs.addComponent(n,z,[e.getImage("goose"),new o(0,0,16,16)]),e.ecs.addComponent(n,k,[o.fromVecs(new s(2,0).scaled(16,e.tileSize).shifted(new s(0,2)),new s(12,16).scaled(16,e.tileSize).shifted(new s(0,-2)))]),c(e,e.roomAt(t),n),e.ecs.addComponent(n,M,[e.level/le.maxLevel*50+50,e,n]),e.ecs.addComponent(n,v,[e.level/le.maxLevel*1.3+.4]),e.ecs.addComponent(n,T,[!1]),e.ecs.addComponent(n,X,[e.player]),e.ecs.addComponent(n,R,["#bb0000"]),n},te=e=>{for(const t of e.rooms){for(let s=0;s<n(5,10);s++)J(e,t,e.getImage("items"),new o(0,0,16,16),new o(1,1,e.tileSize-1,e.tileSize-1));for(let s=0;s<Math.round(e.level/3);s++)Z(e,t)}const t=J(e,e.roomAt(e.playerRoomPos),e.getImage("items"),new o(0,32,16,16));e.ecs.addComponent(t,A,[7]);const i=new s(null,null);do{const[t,s]=Math.random()<.5?"xy":"yx";i[t]=Math.random()<.5?0:e.roomCount[t]-1,i[s]=n(0,e.roomCount[s]-1)}while(e.level>1&&s.equal(i,e.playerRoomPos));e.goose=ee(e,i)},se=(e,t)=>{const n=e.ecs.createEntity();return e.ecs.addComponent(n,S,[t,new s(Math.floor(e.roomCount.x/2),Math.floor(e.roomCount.y/2))]),e.ecs.addComponent(n,z,[e.getImage("player"),new o(0,0,16,16)]),e.ecs.addComponent(n,v,[3]),e.ecs.addComponent(n,T,[!0]),e.ecs.addComponent(n,I),e.ecs.addComponent(n,H,[null,null]),e.ecs.addComponent(n,M,[100,e,n]),e.ecs.addComponent(n,k,[o.fromVecs(new s(2,0).scaled(16,e.tileSize).shifted(new s(0,2)),new s(12,16).scaled(16,e.tileSize).shifted(new s(0,-2)))]),n};let oe;var ne;(ne=oe||(oe={}))[ne.ShortGrass=0]="ShortGrass",ne[ne.TallGrass=1]="TallGrass",ne[ne.Flowers1=2]="Flowers1",ne[ne.Flowers2=3]="Flowers2";class ie{tiles=[];constructor(e,t){this.game=e,this.pos=t;for(let e=0;e<this.game.roomSize.y;e++){this.tiles.push([]);for(let t=0;t<this.game.roomSize.x;t++)if(0==t||0==e||t==this.game.roomSize.x-1||e==this.game.roomSize.y-1)this.tiles[e].push(oe.ShortGrass);else{const t=Math.random()<.8?oe.ShortGrass:Math.random()<.7?oe.TallGrass:Math.random()<.5?oe.Flowers1:oe.Flowers2;this.tiles[e].push(t)}}}render(){this.game.ctx.clearRect(0,0,this.game.canvas.width,this.game.canvas.height);for(let e=0;e<this.game.roomSize.y;e++)for(let t=0;t<this.game.roomSize.x;t++){const s=this.tiles[e][t],o=this.game.tileSize;this.game.ctx.drawImage(this.game.getImage("tiles"),16*s,0,16,16,t*o,e*o,o,o)}}get entities(){return[this.game.leftHandItemBox,this.game.rightHandItemBox].concat(this.game.ecs.entities.filter((e=>!!this.game.ecs.hasComponent(e,S)&&s.equal(this.game.ecs.getComponent(e,S).room,this.pos))))}}const ae=(e,t,s)=>{const o=n(e,t-e-s);return Array(s).fill(null).map(((e,t)=>o+t))},re=e=>{const t=[];for(let n=0;n<e.roomCount.y;n++)for(let i=0;i<e.roomCount.x;i++){const a=new s(i,n),r=new ie(e,a);r.doors={top:ae(5,e.roomSize.x,4),bottom:ae(5,e.roomSize.x,4),left:ae(3,e.roomSize.y,3),right:ae(3,e.roomSize.y,3)},0===i&&(r.doors.left=[]),0===n&&(r.doors.top=[]),i===e.roomCount.x-1&&(r.doors.right=[]),n===e.roomCount.y-1&&(r.doors.bottom=[]);const l=e=>t.find((t=>s.equal(t.pos,e))),c=(e,t,s)=>{l(e)&&(t.doors[s]=l(e).doors[{top:"bottom",bottom:"top",left:"right",right:"left"}[s]])};c(a.shifted(new s(0,-1)),r,"top"),c(a.shifted(new s(0,1)),r,"bottom"),c(a.shifted(new s(-1,0)),r,"left"),c(a.shifted(new s(1,0)),r,"right"),t.push(r);for(let t=0;t<e.roomSize.y;t++)for(let n=0;n<e.roomSize.x;n++)if(0===n||0===t||n===e.roomSize.x-1||t===e.roomSize.y-1){const i=e.ecs.createEntity();let l;e.ecs.addComponent(i,S,[new s(n*e.tileSize,t*e.tileSize),a]);let c=[new s(0,0),new s(16,16)];0===n?0===t?l=[0,48]:t===e.roomSize.y-1?l=[32,48]:t===r.doors.left[0]-1?(l=[48,32],c=[new s(0,0),new s(14,14)]):t===r.doors.left[r.doors.left.length-1]+1?(l=[16,32],c=[new s(0,2),new s(14,14)]):r.doors.left.includes(t)?e.ecs.removeEntity(i):(l=[48,16],c=[new s(0,0),new s(14,16)]):n===e.roomSize.x-1?0===t?l=[16,48]:t===e.roomSize.y-1?l=[48,48]:t===r.doors.right[0]-1?(l=[32,32],c=[new s(2,0),new s(14,14)]):t===r.doors.right[r.doors.right.length-1]+1?(l=[0,32],c=[new s(2,2),new s(14,14)]):r.doors.right.includes(t)?e.ecs.removeEntity(i):(l=[16,16],c=[new s(2,0),new s(14,16)]):0===t?n===r.doors.top[0]-1?(l=[48,32],c=[new s(0,0),new s(14,14)]):n===r.doors.top[r.doors.top.length-1]+1?(l=[32,32],c=[new s(2,0),new s(14,14)]):r.doors.top.includes(n)?e.ecs.removeEntity(i):(l=[0,16],c=[new s(0,0),new s(16,14)]):t===e.roomSize.y-1&&(n===r.doors.bottom[0]-1?(l=[16,32],c=[new s(0,2),new s(14,14)]):n===r.doors.bottom[r.doors.bottom.length-1]+1?(l=[0,32],c=[new s(2,2),new s(14,14)]):r.doors.bottom.includes(n)?e.ecs.removeEntity(i):(l=[32,16],c=[new s(0,2),new s(16,14)])),e.ecs.addComponent(i,z,[e.getImage("tiles"),new o(...l??[0,0],16,16)]),e.ecs.addComponent(i,k,[o.fromVecs(...c.map((t=>t.scaled(16,e.tileSize))))])}}return t};class le{static maxLevel=15;paused=!1;eventListeners={};ecs=new C(this);toRespawn=[];particles=[];timeOfLastFrame=0;keys={};constructor(e,t,o,n,i){if(this.canvas=e,this.ctx=e.getContext("2d"),!(o>0&&o<=le.maxLevel))throw new Error(`Level ${o} does not exist`);this.level=o,this.assets=t,this.shouldPlayMusic=n,this.shouldPlaySFX=i,this.roomCount=new s(Math.ceil(o/2),Math.ceil(o/2)),o%2==0&&this.roomCount.x++,this.roomSize=new s(null,null),this.roomSize.y=Math.floor(9*(innerHeight/innerWidth+1)),this.tileSize=Math.floor(innerHeight/this.roomSize.y),this.roomSize.x=Math.floor(innerWidth/this.tileSize),this.canvas.width=this.roomSize.x*this.tileSize,this.canvas.height=this.roomSize.y*this.tileSize,this.ctx.imageSmoothingEnabled=!1,this.player=se(this,new s((this.roomSize.x/2-.5)*this.tileSize,(this.roomSize.y/2-.5)*this.tileSize)),[this.leftHandItemBox,this.leftHandItemPos]=this.addItemBox(new s(this.tileSize,(this.roomSize.y-4)*this.tileSize)),[this.rightHandItemBox,this.rightHandItemPos]=this.addItemBox(new s((this.roomSize.x-4)*this.tileSize,(this.roomSize.y-4)*this.tileSize)),this.rooms=re(this),te(this);for(const e of this.rooms)this.ecs.entitiesWithComponents(e,[T]).forEach(this.ecs.bringToFront,this.ecs);[Y,K,$,B,_,W,U,D,Q,q,G,V,j].forEach((e=>this.ecs.systemManager.addSystem(new e)))}setLastClickPos(e){const t=this.canvas.getBoundingClientRect();this.lastClickPos=new s(e.clientX-t.left,e.clientY-t.top)}addItemBox(e){const t=this.ecs.createEntity();return this.ecs.addComponent(t,z,[this.getImage("item_box"),new o(0,0,48,48),new s(3*this.tileSize,3*this.tileSize)]),this.ecs.addComponent(t,S,[e,this.playerRoomPos]),this.ecs.addComponent(t,k,[o.fromVecs(new s(11,11).scaled(16,this.tileSize),new s(26,26).scaled(16,this.tileSize))]),[t,e.shifted(new s(this.tileSize,this.tileSize))]}get playerRoomPos(){return this.ecs.getComponent(this.player,S).room}roomAt(e){return this.rooms.find((t=>s.equal(t.pos,e)))}getAsset(e){const t=[];for(const e in this.assets)t.push(...this.assets[e]);return t.find((t=>new RegExp(`${e}\\.[^\\.]+`).test(t.src)))}getImage(e){return this.getAsset(e)}getAudio(e){return this.getAsset(e)}addEventListeners(){const e={blur:this.pause.bind(this),keydown:e=>{const t=e.key.toLowerCase();"p"!==t&&"escape"!==t||this.pause(),this.keys[t]=!0,this.ecs.systemManager.updateSystems(u.Keyboard)},keyup:e=>{const t=e.key.toLowerCase();this.keyReleased=t,this.ecs.systemManager.updateSystems(u.KeyUp),delete this.keys[t],this.ecs.systemManager.updateSystems(u.Keyboard)},click:e=>{this.setLastClickPos(e),this.ecs.systemManager.updateSystems(u.Click)},contextmenu:e=>{e.preventDefault(),this.setLastClickPos(e),this.ecs.systemManager.updateSystems(u.RightClick)}};for(const t in e)document.addEventListener(t,e[t]);return e}removeEventListeners(){Object.entries(this.eventListeners).forEach((([e,t])=>{document.removeEventListener(e,t)}))}start(){if(this.paused=!1,this.eventListeners=this.addEventListeners(),this.startTime=performance.now(),this.timeOfLastFrame=performance.now(),this.tick(performance.now()),this.shouldPlayMusic){const e=this.getAudio("music");e.loop=!0,e.volume=.5,e.play()}}pause(){this.paused||(pe("Game Paused","Quit",!0),this.removeEventListeners(),this.getAudio("music").pause())}tick(e){this.paused||(this.currentFrameRate=1e3/(e-this.timeOfLastFrame),this.timeOfLastFrame=e,this.roomAt(this.playerRoomPos).render(),this.ecs.systemManager.updateSystems(u.Tick),requestAnimationFrame((e=>this.tick(e))))}}function ce(e){return document.querySelector(e)}const[me,he]=Array.from(document.querySelectorAll(".level-selector button")),de=()=>{const e=parseInt(ce(".level").innerText);me.disabled=1===e,he.disabled=e===le.maxLevel};me.onclick=()=>{const e=ce(".level");parseInt(e.innerText)>1&&(e.textContent=(parseInt(e.textContent)-1).toString()),de()},he.onclick=()=>{const e=ce(".level");parseInt(e.innerText)<le.maxLevel&&(e.textContent=(parseInt(e.textContent)+1).toString()),de()};ce(".menu-button").onclick=()=>{ce(".game-stopped").hidden=!0,ce(".menu").hidden=!1,de()},ce(".resume-button").onclick=()=>{ce(".game-stopped").hidden=!0,ce("canvas").hidden=!1,window.game.start()};const pe=(e,t,s)=>{window.game.paused=!0,ce("canvas").hidden=!0,ce(".game-stopped").hidden=!1,ce(".game-stopped .message").textContent=e,ce(".game-stopped .menu-button").textContent="< "+t,ce(".game-stopped .resume-button").disabled=!s};document.querySelectorAll(".switch").forEach((e=>{e.addEventListener("click",(()=>{e.textContent="ON"===e.textContent?"OFF":"ON"}))}));const ge=new class{#o=[];#n;#i=0;constructor(e,t){this.#o=e,this.progressBar=t}adjustProgressBar(){this.progressBar.style.width=`calc((100% - 1vh) * ${this.#i/this.#o.length})`}loadAsset(t){return new Promise(((s,o)=>{if(t.type===e.Image){const e=new Image;e.src=t.path,e.onload=()=>{s(e),this.#i++,this.adjustProgressBar()},e.onerror=o}else if(t.type===e.Audio){const e=new Audio;e.src=t.path,e.oncanplaythrough=()=>{s(e),this.#i++,this.adjustProgressBar()},e.onerror=o}}))}async loadAll(){this.#n=this.#o.map(this.loadAsset,this);const e=await Promise.all(this.#n);return await new Promise((e=>setTimeout(e,1e3))),{images:e.filter((e=>e instanceof HTMLImageElement)),audio:e.filter((e=>e instanceof HTMLAudioElement))}}}([{type:e.Image,path:"assets/images/tiles.png"},{type:e.Image,path:"assets/images/player.png"},{type:e.Image,path:"assets/images/items.png"},{type:e.Image,path:"assets/images/item_box.png"},{type:e.Image,path:"assets/images/zombie.png"},{type:e.Image,path:"assets/images/goose.png"},{type:e.Audio,path:"assets/sounds/music.mp3"},{type:e.Audio,path:"assets/sounds/footstep.mp3"},{type:e.Audio,path:"assets/sounds/pick_up.mp3"},{type:e.Audio,path:"assets/sounds/place.mp3"},{type:e.Audio,path:"assets/sounds/swap_hands.mp3"},{type:e.Audio,path:"assets/sounds/decline.mp3"}],ce(".loading .inner"));document.fonts.ready.then((async()=>{const e=ce(".loading");e.hidden=!1;const t=await ge.loadAll();e.hidden=!0,ce(".menu").hidden=!1,ce(".game-stopped").hidden=!0,de(),ce(".play-button").onclick=()=>{ce(".menu").hidden=!0;const e=parseInt(ce(".level").innerText),s=ce("canvas");s.hidden=!1;const o="ON"===ce(".music").textContent,n="ON"===ce(".sfx").textContent;window.game=new le(s,t,e,o,n),window.game.getAudio("music").currentTime=0,window.game.start()}}));