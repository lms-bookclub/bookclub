function createElement(html: string) {
  let el = document.createElement('div');
  el.innerHTML = html;
  return el.children[0];
}

export {
  createElement,
};
