/**
 * UNIVERS42 - INTERACTIVE TERMINAL ENGINE (HELLISH / 42CTL)
 * Features: Command history (Up/Down), Tab autocompletion, sound FX, safe output
 */

(function () {
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  const COMMAND_LIST = [
    'help', 'repos', 'francinette', 'torturette', 'exam',
    'norminette', 'manifesto', 'stats', 'matrix', 'about', '42', 'clear'
  ];

  let commandHistory = [];
  let historyIndex = -1;

  document.addEventListener('DOMContentLoaded', () => {
    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('termOutput');
    if (!termInput || !termOutput) return;

    function appendTermLine(content, className = '') {
      const line = document.createElement('div');
      line.className = `term-output-line ${className}`;
      line.innerHTML = content;
      termOutput.appendChild(line);
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    function executeCommand(raw) {
      const command = raw.trim().toLowerCase();
      if (!command) return;

      // Add to history
      commandHistory.push(raw);
      historyIndex = commandHistory.length;

      appendTermLine(`<span class="term-cyan">cadet@univers42:~$</span> ${escapeHtml(raw)}`);

      switch (command) {
        case 'help':
          if (window.playKeyClick) window.playKeyClick('beep');
          appendTermLine(`Comandos disponibles en el shell de Univers42:`, 'term-cyan');
          appendTermLine(`  <span class="term-indigo">repos</span>         - Muestra los repositorios con mayor impacto`);
          appendTermLine(`  <span class="term-indigo">francinette</span>   - Ejecuta una simulación completa del tester de 42`);
          appendTermLine(`  <span class="term-indigo">torturette</span>    - Rastrear allocations y memoria en busca de leaks`);
          appendTermLine(`  <span class="term-indigo">exam</span>          - Simula una prueba técnica con Examshell 42`);
          appendTermLine(`  <span class="term-indigo">norminette</span>    - Comprueba el estilo de código contra la Norme 42`);
          appendTermLine(`  <span class="term-indigo">stats</span>         - Métricas globales de Univers42`);
          appendTermLine(`  <span class="term-indigo">manifesto</span>     - Muestra el credo del builder de Univers42`);
          appendTermLine(`  <span class="term-indigo">matrix</span>        - Activa secuencia digital rain`);
          appendTermLine(`  <span class="term-indigo">about</span>         - Sobre el colectivo y misión open-source`);
          appendTermLine(`  <span class="term-indigo">42</span>            - The Answer to Life, Universe and Everything`);
          appendTermLine(`  <span class="term-indigo">clear</span>         - Limpia la pantalla de la terminal`);
          appendTermLine(`Tip: Usa <span class="term-amber">[Tab]</span> para autocompletar y <span class="term-amber">[↑ / ↓]</span> para historial.`, 'term-muted');
          break;

        case 'clear':
          termOutput.innerHTML = '';
          if (window.playKeyClick) window.playKeyClick('click');
          break;

        case 'repos':
          if (window.playKeyClick) window.playKeyClick('click');
          appendTermLine(`[TOP REPOSITORIOS UNIVERS42]`, 'term-cyan');
          const projects = (window.UNIVERS42_PROJECTS || window.UNIVERS42_DEFAULT_PROJECTS || []).slice(0, 8);
          projects.forEach(p => {
            appendTermLine(`• <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline;">${p.name}</a> (${p.lang}) ★${p.stars} — ${p.tags.join(', ')}`);
          });
          break;

        case 'francinette':
          if (window.playKeyClick) window.playKeyClick('beep');
          appendTermLine(`[FRANCINETTE TESTER v3.4.1 -- RUNNING 42 SUITE]`, 'term-cyan');
          appendTermLine(`Verificando: ft_printf, get_next_line, libft...`, 'term-muted');

          setTimeout(() => {
            appendTermLine(`[GNL 1/3]: 1000 lines single FD .......... <span class="term-success">[OK]</span>`);
          }, 300);
          setTimeout(() => {
            appendTermLine(`[GNL 2/3]: Multiple FDs alternating ...... <span class="term-success">[OK]</span>`);
          }, 600);
          setTimeout(() => {
            appendTermLine(`[GNL 3/3]: EOF without newline ........... <span class="term-success">[OK]</span>`);
          }, 900);
          setTimeout(() => {
            appendTermLine(`[PRINTF]: Flags %d, %i, %u, %x, %X, %p ... <span class="term-success">[OK]</span>`);
          }, 1200);
          setTimeout(() => {
            if (window.playKeyClick) window.playKeyClick('success');
            appendTermLine(`══════════════════════════════════════════════`, 'term-success');
            appendTermLine(`ALL TESTS PASSED: 125/125 PASSED! 100% SUCCESS`, 'term-success');
            appendTermLine(`Moulinette validation ready. 0 KO, 0 SEGFAULT.`, 'term-success');
            if (window.showToast) window.showToast('Francinette: 100/100 All Tests Green!');
          }, 1500);
          break;

        case 'torturette':
          if (window.playKeyClick) window.playKeyClick('beep');
          appendTermLine(`[TORTURETTE DYNAMIC ALLOCATION & HEAP TRACER]`, 'term-cyan');
          appendTermLine(`Hooking: malloc, calloc, realloc, free...`, 'term-muted');
          setTimeout(() => {
            appendTermLine(`Tracking memory space 0x7fff0000 -> 0x7ffffff...`);
            appendTermLine(`Allocations registradas: <span class="term-cyan">1,248 bloques</span>`);
            appendTermLine(`Deallocations (liberados): <span class="term-success">1,248 bloques</span>`);
            appendTermLine(`Balance de fugas:         <span class="term-success">0 bytes leaked (Valgrind Clean)</span>`);
            appendTermLine(`Estado: <span class="term-success">CLEAN - SAFE TO PUSH TO GIT</span>`, 'term-success');
            if (window.playKeyClick) window.playKeyClick('success');
            if (window.showToast) window.showToast('Torturette: 0 Memory Leaks!');
          }, 650);
          break;

        case 'exam':
          if (window.playKeyClick) window.playKeyClick('beep');
          appendTermLine(`[42 EXAMSHELL SIMULATOR -- RANK 02]`, 'term-amber');
          appendTermLine(`Tiempo restante: <span class="term-warning">02:59:44</span> | Intentos: 1`, 'term-muted');
          appendTermLine(`Ejercicio asignado: <span class="term-cyan">ft_strrev</span> (Level 2)`);
          appendTermLine(`Escribe tu solución o compila con: <span class="term-indigo">gcc -Wall -Wextra -Werror</span>`);
          appendTermLine(`Diff test contra ejercicio patrón: <span class="term-success">GRADE: SUCCESS! (100 pts)</span>`, 'term-success');
          break;

        case 'norminette':
          appendTermLine(`norminette -R CheckForbiddenSourceHeader *.c *.h`, 'term-muted');
          appendTermLine(`ft_printf.c: OK!`, 'term-success');
          appendTermLine(`parser.c: OK!`, 'term-success');
          appendTermLine(`ast_exec.c: OK!`, 'term-success');
          appendTermLine(`hellish.h: OK!`, 'term-success');
          appendTermLine(`Total de errores: <span class="term-success">0 NORME ERRORS!</span> (Estilo impecable)`, 'term-success');
          if (window.playKeyClick) window.playKeyClick('success');
          break;

        case 'stats':
          appendTermLine(`[UNIVERS42 GLOBAL METRICS]`, 'term-cyan');
          appendTermLine(`• Repositorios públicos: <span class="term-success">192+</span>`);
          appendTermLine(`• Filosofía:             <span class="term-indigo">100% Peer-to-Peer & FOSS</span>`);
          appendTermLine(`• Estrellas en GitHub:   <span class="term-amber">140+ en proyectos insignia</span>`);
          appendTermLine(`• Lenguajes principales: <span class="term-cyan">C, Rust, Shell, Python, ASM</span>`);
          appendTermLine(`• Memory Leaks:          <span class="term-success">0 tolerados</span>`);
          break;

        case 'manifesto':
          appendTermLine(`"The tools are the projects. The projects are the tools."`, 'term-cyan');
          appendTermLine(`Univers42 nació para no conformarse con terminar los proyectos obligatorios.`);
          appendTermLine(`Diseñamos los sanitizadores, shells, engines y suites de examen que aceleran`);
          appendTermLine(`la excelencia técnica de cualquier builder en la red 42.`);
          break;

        case 'matrix':
          if (window.playKeyClick) window.playKeyClick('beep');
          appendTermLine(`01000101 01110011 01100011 01110101 01100101 01101100 01100001 00100000 00110100 00110010`, 'term-success');
          appendTermLine(`Wake up, Cadet... The Matrix has you.`, 'term-cyan');
          break;

        case '42':
          appendTermLine(`42 is the Answer to the Ultimate Question of Life, the Universe, and Everything.`, 'term-cyan');
          appendTermLine(`Y también el lugar donde aprendes a programar con cero leaks y sin bibliotecas mágicas.`, 'term-muted');
          break;

        case 'about':
          appendTermLine(`Univers42 — Colectivo Open-Source y laboratorio de ingeniería.`);
          appendTermLine(`192 repositorios públicos en GitHub, 100% open source.`);
          appendTermLine(`Visita: <a href="https://github.com/Univers42" target="_blank" rel="noopener noreferrer" style="color: #00f2fe;">https://github.com/Univers42</a>`);
          break;

        default:
          if (window.playKeyClick) window.playKeyClick('error');
          appendTermLine(`hellish: comando no reconocido: '${escapeHtml(raw)}'. Escribe <span class="term-cyan">help</span> para ver comandos.`, 'term-warning');
          break;
      }
    }

    window.runTermCommand = function (cmd) {
      if (window.playKeyClick) window.playKeyClick('click');
      termInput.value = cmd;
      executeCommand(cmd);
      termInput.value = '';
      termInput.focus();
    };

    termInput.addEventListener('keydown', (e) => {
      // Tab Autocomplete
      if (e.key === 'Tab') {
        e.preventDefault();
        const current = termInput.value.trim().toLowerCase();
        if (current) {
          const match = COMMAND_LIST.find(cmd => cmd.startsWith(current));
          if (match) {
            termInput.value = match;
            if (window.playKeyClick) window.playKeyClick('click');
          }
        }
        return;
      }

      // History navigation (Up Arrow)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          termInput.value = commandHistory[historyIndex];
        }
        return;
      }

      // History navigation (Down Arrow)
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          termInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          termInput.value = '';
        }
        return;
      }

      // Enter key - execute
      if (e.key === 'Enter') {
        executeCommand(termInput.value);
        termInput.value = '';
      } else if (e.key.length === 1 && window.playKeyClick) {
        window.playKeyClick('click');
      }
    });
  });
})();
