'use client';

import { useEffect } from 'react';

let revealObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver {
  if (revealObserver) return revealObserver;
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          revealObserver?.unobserve(el);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    },
  );
  return revealObserver;
}

/** Observe [data-reveal] nodes inside scope (or whole document). Safe after dynamic mount. */
export function observeRevealElements(scope: ParentNode = document) {
  document.documentElement.classList.add('js-reveal-ready');
  const observer = getRevealObserver();
  const nodes = scope.querySelectorAll('[data-reveal]:not(.revealed)');
  nodes.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const rect = htmlEl.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      const delay = parseInt(htmlEl.dataset.revealDelay || '0', 10);
      setTimeout(() => htmlEl.classList.add('revealed'), delay);
      observer.unobserve(htmlEl);
    } else {
      observer.observe(htmlEl);
    }
  });
  // #region agent log
  const inTestimonials = scope instanceof Element && scope.classList.contains('testimonials-section')
    ? nodes.length
    : scope.querySelectorAll?.('.testimonials-section [data-reveal]:not(.revealed)').length ?? 0;
  if (inTestimonials > 0 || (scope instanceof Element && scope.classList.contains('testimonials-section'))) {
    fetch('http://127.0.0.1:7256/ingest/e48ec5c9-1222-4755-acbd-1976e3fa33d6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f852bb'},body:JSON.stringify({sessionId:'f852bb',location:'animations.ts:observeRevealElements',message:'observe late reveal',data:{observed:nodes.length,scopeIsTestimonials:scope instanceof Element&&scope.classList.contains('testimonials-section')},timestamp:Date.now(),hypothesisId:'H1',runId:'post-fix'})}).catch(()=>{});
  }
  // #endregion
  return nodes.length;
}

export function useScrollReveal() {
  useEffect(() => {
    const count = observeRevealElements(document);
    // #region agent log
    fetch('http://127.0.0.1:7256/ingest/e48ec5c9-1222-4755-acbd-1976e3fa33d6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f852bb'},body:JSON.stringify({sessionId:'f852bb',location:'animations.ts:useScrollReveal',message:'scroll reveal init',data:{revealCount:count,hasTestimonials:!!document.querySelector('.testimonials-section')},timestamp:Date.now(),hypothesisId:'H1',runId:'post-fix'})}).catch(()=>{});
    // #endregion

    return () => {
      revealObserver?.disconnect();
      revealObserver = null;
      document.documentElement.classList.remove('js-reveal-ready');
    };
  }, []);
}
