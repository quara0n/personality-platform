// Swipeable card rows with a dot toggle on top (Rune, 2026-10-17): the facet cards in the traits chapter and
// the tailored chapters' result cards. Phones and portrait tablets swipe; wider screens show a grid (design.css).
// Each [data-fcarousel] holds .d-fdot buttons and a .d-fslides track; it is safe to call again after a re-render.
export function initFacetCarousels(root){const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;root.querySelectorAll('[data-fcarousel]').forEach(box=>{if(box.dataset.ready)return;box.dataset.ready='1';const track=box.querySelector('.d-fslides'),cards=[...track.children].filter(c=>!c.hasAttribute('data-noslide')),dots=[...box.querySelectorAll('.d-fdot')];let at=-1,raf=0;
  const mark=i=>{if(i===at)return;at=i;dots.forEach((b,k)=>k===i?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current'));};
  const near=()=>{const x=track.scrollLeft;let best=0;cards.forEach((c,k)=>{if(Math.abs(c.offsetLeft-track.offsetLeft-x)<Math.abs(cards[best].offsetLeft-track.offsetLeft-x))best=k;});return track.scrollLeft+track.clientWidth>=track.scrollWidth-2?cards.length-1:best;};
  const go=i=>{i=Math.max(0,Math.min(cards.length-1,i));track.scrollTo({left:cards[i].offsetLeft-track.offsetLeft,behavior:still()?'auto':'smooth'});mark(i);};
  track.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>mark(near()));},{passive:true});
  dots.forEach((b,k)=>b.addEventListener('click',()=>go(k)));
  // An optional arrow moves one card on, and back to the first after the last.
  box.querySelector('[data-fnext]')?.addEventListener('click',()=>go(at>=cards.length-1?0:at+1));
  track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'){e.preventDefault();go(at+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(at-1);}});
  // Mouse users can drag the row like on a phone.
  let drag=null;track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button)return;drag={x:e.clientX,left:track.scrollLeft,moved:false};});
  addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6){drag.moved=true;track.classList.add('is-dragging');}if(drag.moved)track.scrollLeft=drag.left-dx;});
  addEventListener('pointerup',()=>{if(!drag)return;const moved=drag.moved;drag=null;track.classList.remove('is-dragging');if(moved){const stop=e=>{e.stopPropagation();e.preventDefault();};track.addEventListener('click',stop,{capture:true,once:true});setTimeout(()=>track.removeEventListener('click',stop,{capture:true}),0);go(near());}});
  box.resetFacets=()=>{track.scrollLeft=0;at=-1;mark(0);};mark(0);});}
