// A synchronous, first-party head script: CSS knows the age before body paint.
// Keep the DOM change confined to html[data-age]; React does not own this attribute.
export const AGE_BOOTSTRAP = `(function(){var a=null,p=location.pathname.match(/(?:^|\\/)(kids|juniors)\\/?$/);try{a=localStorage.getItem('lu-age');if(p){a=p[1];localStorage.setItem('lu-age',a)}}catch(e){if(p)a=p[1]}var h=location.hash.slice(1);if(h==='kids'||h==='juniors')a=h;if(a==='kids'||a==='juniors')document.documentElement.dataset.age=a})()`;
