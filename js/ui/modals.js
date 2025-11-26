(function (global) {
  const toggleModalVisibility = (modalEl, show = false) => {
    if (!modalEl) return;
    modalEl.classList.toggle('hidden', !show);
    modalEl.classList.toggle('flex', show);
    if (show && global.lucide) {
      global.lucide.createIcons();
    }
  };

  const openDashboardDeleteModal = (botId, trigger, context = {}) => {
    const { canWriteFlag, toast, $, getDashboardBotName, setBotId, setTrigger, handleDelete } = context;
    if (!botId) return;
    if (!canWriteFlag) {
      toast?.('⚠ No tienes permisos para eliminar bots');
      return;
    }
    const modal = $?.('dashboardDeleteModal');
    if (!modal) {
      handleDelete?.(botId, trigger);
      return;
    }
    setBotId?.(botId);
    setTrigger?.(trigger || null);
    const nameEl = $?.('dashboardDeleteBotName');
    if (nameEl) {
      nameEl.textContent = getDashboardBotName?.(botId) || botId || 'este bot';
    }
    toggleModalVisibility(modal, true);
  };

  const closeDashboardDeleteModal = (force = false, context = {}) => {
    const { $, getTrigger, setTrigger, setBotId } = context;
    const modal = $?.('dashboardDeleteModal');
    if (!modal) return;
    const confirmBtn = $?.('confirmDashboardDelete');
    if (!force && confirmBtn && confirmBtn.disabled) return;
    toggleModalVisibility(modal, false);
    setBotId?.(null);
    const trigger = getTrigger?.();
    setTrigger?.(null);
    if (trigger && typeof trigger.focus === 'function') {
      trigger.focus();
    }
  };

  const openChangePasswordModal = (emailKey, context = {}) => {
    const { setPendingKey, resetModal, modalEl, inputEl } = context;
    setPendingKey?.(emailKey);
    resetModal?.();
    toggleModalVisibility(modalEl, true);
    if (inputEl) inputEl.focus();
  };

  const closeChangePasswordModal = (context = {}) => {
    const { setPendingKey, modalEl } = context;
    setPendingKey?.('');
    toggleModalVisibility(modalEl, false);
  };

  const openDeleteUserModal = (emailKey, emailValue, context = {}) => {
    const { setPendingKey, setPendingEmail, modalEl } = context;
    setPendingKey?.(emailKey);
    setPendingEmail?.(emailValue);
    toggleModalVisibility(modalEl, true);
  };

  const closeDeleteUserModal = (context = {}) => {
    const { setPendingKey, setPendingEmail, modalEl } = context;
    setPendingKey?.('');
    setPendingEmail?.('');
    toggleModalVisibility(modalEl, false);
  };

  const openKnowledgeModal = (context = {}) => {
    const { modalEl, inputEl, errorEl, statusEl } = context;
    if (!modalEl) return;
    toggleModalVisibility(modalEl, true);
    if (inputEl) inputEl.value = '';
    errorEl?.classList.add('hidden');
    statusEl?.classList.add('hidden');
    if (inputEl) setTimeout(() => inputEl.focus(), 50);
  };

  const closeKnowledgeModal = (context = {}) => {
    const { modalEl, inputEl, errorEl, statusEl } = context;
    if (!modalEl) return;
    toggleModalVisibility(modalEl, false);
    if (inputEl) inputEl.value = '';
    errorEl?.classList.add('hidden');
    statusEl?.classList.add('hidden');
  };

  const openKnowledgeDeleteModal = (page, context = {}) => {
    const { modalEl, titleEl, translate } = context;
    if (!modalEl || !titleEl) return;
    titleEl.textContent = page?.title || translate?.('this page') || 'this page';
    toggleModalVisibility(modalEl, true);
  };

  const closeKnowledgeDeleteModal = (context = {}, onClose) => {
    const { modalEl } = context;
    if (!modalEl) return;
    toggleModalVisibility(modalEl, false);
    onClose?.();
  };

  const openWidgetModal = (context = {}) => {
    const { modalEl } = context;
    toggleModalVisibility(modalEl, true);
  };

  const closeWidgetModal = (context = {}) => {
    const { modalEl } = context;
    toggleModalVisibility(modalEl, false);
  };

  const openTypeModal = (context = {}) => {
    const { typeModal, resetTypeModal, responses, createEmptyResponse, setActive } = context;
    if (!typeModal) {
      const newResponse = createEmptyResponse?.();
      if (responses && typeof responses.push === 'function' && newResponse !== undefined) {
        responses.push(newResponse);
        if (typeof setActive === 'function') {
          setActive(responses.length - 1);
        }
      }
      return;
    }
    resetTypeModal?.();
    typeModal.classList.remove('hidden');
    global.requestAnimationFrame(() => {
      typeModal.classList.add('show');
    });
    typeModal.setAttribute('aria-hidden', 'false');
    if (global.lucide) global.lucide.createIcons();
  };

  const closeTypeModal = (context = {}) => {
    const { typeModal } = context;
    if (!typeModal) return;
    typeModal.classList.remove('show');
    typeModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => typeModal.classList.add('hidden'), 220);
  };

  global.ModalHandlers = {
    toggleModalVisibility,
    openDashboardDeleteModal,
    closeDashboardDeleteModal,
    openChangePasswordModal,
    closeChangePasswordModal,
    openDeleteUserModal,
    closeDeleteUserModal,
    openKnowledgeModal,
    closeKnowledgeModal,
    openKnowledgeDeleteModal,
    closeKnowledgeDeleteModal,
    openWidgetModal,
    closeWidgetModal,
    openTypeModal,
    closeTypeModal,
  };
})(window);
