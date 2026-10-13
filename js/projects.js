/**
 * UNIVERS42 - PROJECT CATALOG MANAGER
 * Data loading, dynamic rendering, live search, category filtering & sorting
 */

(function () {
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  let allProjects = [];
  let currentCategory = 'all';
  let currentSort = 'stars';

  async function loadProjectsData() {
    try {
      const response = await fetch('data/projects.json');
      if (response.ok) {
        allProjects = await response.json();
      } else {
        throw new Error('Fetch failed');
      }
    } catch (e) {
      allProjects = window.UNIVERS42_DEFAULT_PROJECTS || [];
    }
    window.UNIVERS42_PROJECTS = allProjects;
    updateCategoryCounts();
    renderProjects();
  }

  function updateCategoryCounts() {
    const counts = { all: allProjects.length };
    allProjects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      const cat = btn.dataset.filter;
      const countSpan = btn.querySelector('.filter-count');
      if (countSpan && counts[cat] !== undefined) {
        countSpan.textContent = counts[cat];
      }
    });
  }

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const searchInput = document.getElementById('projectSearch');
    if (!grid) return;

    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

    let filtered = allProjects.filter(p => {
      const matchesCategory = (currentCategory === 'all' || p.category === currentCategory);
      const matchesQuery = !query ||
        p.name.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.lang.toLowerCase().includes(query) ||
        (p.rank && p.rank.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (currentSort === 'stars') return b.stars - a.stars;
      if (currentSort === 'name') return a.name.localeCompare(b.name);
      if (currentSort === 'lang') return a.lang.localeCompare(b.lang);
      return 0;
    });

    if (filtered.length === 0) {
      const safeQuery = escapeHtml(query);
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; background: var(--bg-surface); border-radius: 16px; border: 1px dashed var(--border-light);">
          <p style="color: var(--cyan-42); font-family: var(--font-mono); font-size: 1.15rem; margin-bottom: 8px;">[404: REPO NOT FOUND IN ACTIVE FILTER]</p>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 500px; margin: 0 auto 1.5rem;">
            No se encontraron repositorios con el término "${safeQuery}". Prueba buscando "shell", "c", "rust", "tester" o restablece los filtros.
          </p>
          <button class="btn-secondary" onclick="window.resetProjectFilters()">Restablecer filtros</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="project-card" data-id="${p.id || ''}">
        <div class="project-card-top">
          <div class="card-meta-row">
            <span class="lang-badge">
              <span class="lang-dot ${p.langClass}"></span>
              ${p.lang}
            </span>
            <span class="card-stars">
              ★ ${p.stars}
            </span>
          </div>

          <h3 class="project-title">${p.name}</h3>
          <p class="project-desc">${p.desc}</p>

          <div class="project-tags">
            ${p.tags.map(t => `<span class="tag-pill" onclick="window.filterByTag('${t}')">#${t}</span>`).join('')}
          </div>
        </div>

        <div class="project-card-footer">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="card-btn-action" title="Abrir repositorio en GitHub">
            <span>Ver en GitHub</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>

          <button class="btn-clone-copy" onclick="window.copyClone('${p.url}', '${p.name}')" title="Copiar comando git clone">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>clone</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  window.copyClone = function (url, name) {
    if (window.playKeyClick) window.playKeyClick('click');
    const cloneCmd = `git clone ${url}.git`;
    navigator.clipboard.writeText(cloneCmd).then(() => {
      if (window.showToast) window.showToast(`Copiado: ${cloneCmd}`);
    }).catch(() => {
      if (window.showToast) window.showToast(`Clona con: ${cloneCmd}`);
    });
  };

  window.filterByTag = function (tag) {
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) {
      searchInput.value = tag;
      renderProjects();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    }
  };

  window.resetProjectFilters = function () {
    const searchInput = document.getElementById('projectSearch');
    if (searchInput) searchInput.value = '';
    currentCategory = 'all';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
    renderProjects();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.getElementById('filterTabs');
    const searchInput = document.getElementById('projectSearch');
    const sortSelect = document.getElementById('sortSelect');

    if (filterTabs) {
      filterTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        if (window.playKeyClick) window.playKeyClick('click');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.filter;
        renderProjects();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderProjects();
      });

      // Global shortcut Ctrl+K or '/' to focus search
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          searchInput.focus();
        } else if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProjects();
      });
    }

    loadProjectsData();
  });
})();
