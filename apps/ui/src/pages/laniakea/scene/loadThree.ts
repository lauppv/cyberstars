/* eslint-disable @typescript-eslint/no-explicit-any */
// three.js comes from unpkg at a pinned version with its integrity hash (the
// CSP lets unpkg through for it), so it stays out of the app's bundle and is
// fetched only by students who open the game. A second visit reuses it.
const SRC = 'https://unpkg.com/three@0.160.0/build/three.min.js';
const INTEGRITY = 'sha384-qOkzR5Ke/XkQxuGVJ9hpFEpDlcoLtWwVYhnJf06cLIZa2vaIptSqaubivErzmD5O';

let loading: Promise<any> | null = null;

export function loadThree(): Promise<any> {
  const ready = (window as any).THREE;
  if (ready) return Promise.resolve(ready);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SRC;
    script.integrity = INTEGRITY;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve((window as any).THREE);
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error('three.js did not load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}
