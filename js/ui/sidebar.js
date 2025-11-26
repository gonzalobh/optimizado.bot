(function() {
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const DEFAULT_TAB_KEYS = ['dashboard', 'dashboard2', 'chat', 'mensajes', 'knowledge', 'respuestas', 'prompt', 'leads', 'usuarios'];
  let tabKeys = [...DEFAULT_TAB_KEYS];

  function getInitialTabKey() {
    try {
      const url = new URL(window.location.href);
      const tabParam = (url.searchParams.get('tab') || '').trim();
      if (tabParam && DEFAULT_TAB_KEYS.includes(tabParam)) {
        return tabParam;
      }
    } catch (err) {
      console.warn('No se pudo leer el parámetro de tab en la URL', err);
    }
    return tabKeys[0] || 'dashboard';
  }

  let currentActiveTab = getInitialTabKey();

  function updateUrlTabParam(tab) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.warn('No se pudo actualizar el parámetro de tab en la URL', err);
    }
  }

  function setActiveTab(tab) {
    const fallbackTab = tabKeys.includes(tab) ? tab : (tabKeys[0] || 'dashboard');
    const targetTab = fallbackTab;
    currentActiveTab = targetTab;
    updateUrlTabParam(targetTab);
    $$('.sidebar-btn').forEach(btn => {
      const btnTab = btn.getAttribute('data-tab');
      btn.classList.toggle('active', btnTab === targetTab);
    });
    DEFAULT_TAB_KEYS.forEach(key => {
      const section = document.getElementById(`tab-${key}`);
      if (section) {
        const shouldShow = key === targetTab && tabKeys.includes(key);
        section.classList.toggle('hidden', !shouldShow);
      }
    });
    const onTabActivated = window.sidebarHooks?.onTabActivated;
    if (typeof onTabActivated === 'function') {
      onTabActivated(targetTab);
    }
  }

  function initTabs() {
    const initialTab = tabKeys.includes(currentActiveTab) ? currentActiveTab : (tabKeys[0] || 'dashboard');
    setActiveTab(initialTab);
    $$('.sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (!tab) return;
        setActiveTab(tab);
      });
    });
  }

  function initSidebarToggle() {
    const sidebarEl = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    const bodyEl = document.body;
    if (!sidebarEl || !toggleSidebarBtn) return;

    const closeSidebar = ({ immediate = false } = {}) => {
      if (window.innerWidth >= 768) {
        sidebarEl.classList.remove('hidden', '-translate-x-full');
        bodyEl.classList.remove('overflow-hidden');
        return;
      }
      bodyEl.classList.remove('overflow-hidden');
      sidebarEl.classList.add('-translate-x-full');
      if (immediate) {
        sidebarEl.classList.add('hidden');
        return;
      }
      sidebarEl.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'transform') {
          sidebarEl.classList.add('hidden');
          sidebarEl.removeEventListener('transitionend', handler);
        }
      }, { once: true });
    };

    const openSidebar = () => {
      sidebarEl.classList.remove('hidden');
      requestAnimationFrame(() => {
        sidebarEl.classList.remove('-translate-x-full');
      });
      bodyEl.classList.add('overflow-hidden');
    };

    toggleSidebarBtn.addEventListener('click', () => {
      if (sidebarEl.classList.contains('hidden')) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });

    const handleSidebarOnResize = () => {
      if (window.innerWidth >= 768) {
        sidebarEl.classList.remove('hidden', '-translate-x-full');
        bodyEl.classList.remove('overflow-hidden');
      } else {
        closeSidebar({ immediate: true });
      }
    };

    handleSidebarOnResize();
    window.addEventListener('resize', handleSidebarOnResize);
  }

  window.sidebar = {
    DEFAULT_TAB_KEYS,
    getInitialTabKey,
    getTabKeys: () => [...tabKeys],
    setTabKeys: (keys = []) => {
      tabKeys = Array.isArray(keys) ? [...keys] : [...DEFAULT_TAB_KEYS];
    },
    getCurrentActiveTab: () => currentActiveTab,
    setCurrentActiveTab: (tab) => {
      currentActiveTab = tab;
    },
    setActiveTab,
    initTabs,
    initSidebarToggle,
  };

  document.addEventListener('DOMContentLoaded', () => {
    initSidebarToggle();
  });
})();
