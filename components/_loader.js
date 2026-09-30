/* Dev loader for cards & kits: fetches component .jsx files, strips ES module syntax,
   transpiles with Babel standalone, and exposes them on window.PanelDS.
   Needs React, ReactDOM and @babel/standalone loaded first.
   <script src="components/_loader.js" data-components="type/Eyebrow.jsx lists/RuledList.jsx"></script>
   <script type="text/babel">DSReady.then(({ Eyebrow }) => …)</script>
   List dependencies before the files that import them. */
(function () {
  const me = document.currentScript;
  const base = me.src.replace(/[^/]*$/, '');
  const files = (me.dataset.components || '').split(/\s+/).filter(Boolean);
  const DS = (window.PanelDS = window.PanelDS || {});
  window.DSReady = Promise.all(files.map(f => fetch(base + f).then(r => r.text()))).then(srcs => {
    srcs.forEach((src, i) => {
      const names = [...src.matchAll(/export\s+(?:function|const)\s+(\w+)/g)].map(m => m[1]);
      let code = src.replace(/^\s*import\s+(?:React(?:\s*,\s*)?)?(\{[^}]*\})?\s*(?:from\s*)?['"][^'"]+['"];?\s*$/gm, (m, braces) =>
        braces && !/['"]react['"]/.test(m) ? 'const ' + braces + ' = DS;' : '');
      code = code.replace(/export\s+(function|const)\s/g, '$1 ');
      try {
        code = Babel.transform(code, { presets: ['react'] }).code;
        Object.assign(DS, new Function('React', 'DS', code + '\nreturn {' + names.join(',') + '};')(React, DS));
      } catch (e) { console.error('PanelDS: failed to load ' + files[i], e); }
    });
    return DS;
  });
})();
