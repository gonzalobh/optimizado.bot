document.addEventListener("DOMContentLoaded", () => {
  const translationManager = window.translationManager;
  const t = (key, vars) => translationManager ? translationManager.translate(key, vars) : key;
  const registerTranslationTarget = (node, key, target = 'text', options = {}) => {
    if (!node || !window.translationManager) return;
    translationManager.register(node, key, target, options);
  };

  window.t = t;
  window.registerTranslationTarget = registerTranslationTarget;

  if (!translationManager) return;

  translationManager.init();

  const languageSelectEl = document.getElementById('languageSelect');
  if (languageSelectEl) {
    languageSelectEl.value = translationManager.getCurrentLanguage?.() || languageSelectEl.value;
    languageSelectEl.addEventListener('change', (event) => {
      translationManager.applyLanguage(event.target.value);
      if (typeof window.renderLeadsTable === 'function') window.renderLeadsTable();
    });
    const languageOptionMap = {
      en: 'language.english',
      fr: 'language.french',
      es: 'language.spanish',
      de: 'language.german',
      pt: 'language.portuguese',
    };
    Array.from(languageSelectEl.options).forEach((option) => {
      const key = languageOptionMap[option.value];
      if (!key) return;
      translationManager.register(option, key);
    });
  }

  const PERSONALITY_TRANSLATION_ENTRIES = [
    { value: 'friendly', key: 'Friendly' },
    { value: 'professional', key: 'Professional' },
    { value: 'informal', key: 'Informal' },
    { value: 'informative', key: 'Informative' },
    { value: 'empathetic', key: 'Empathetic' },
  ];
  const PERSONALITY_KEY_BY_VALUE = PERSONALITY_TRANSLATION_ENTRIES.reduce((acc, entry) => {
    acc[entry.value] = entry.key;
    return acc;
  }, {});

  const usuariosTabLabel = document.getElementById('usuariosTabLabel');
  if (usuariosTabLabel) {
    usuariosTabLabel.textContent = translationManager.translate('Usuarios');
    translationManager.register(usuariosTabLabel, 'Usuarios');
  }

  const leadCaptureTitle = document.getElementById('leadCaptureTitle');
  if (leadCaptureTitle) {
    leadCaptureTitle.textContent = translationManager.translate('Lead capture');
    registerTranslationTarget(leadCaptureTitle, 'Lead capture');
  }
  const leadCaptureDescription = document.getElementById('leadCaptureDescription');
  if (leadCaptureDescription) {
    leadCaptureDescription.textContent = translationManager.translate('Enable or disable the lead capture prompts.');
    registerTranslationTarget(leadCaptureDescription, 'Enable or disable the lead capture prompts.');
  }

  const colorsTabLabel = document.querySelector('[data-chat-panel-tab="colors"] span');
  registerTranslationTarget(colorsTabLabel, 'Colores');
  const colorsPanel = document.querySelector('[data-chat-panel="colors"]');
  if (colorsPanel) {
    const colorsTitle = colorsPanel.querySelector('.flex.items-center.gap-2.font-semibold.text-gray-800');
    registerTranslationTarget(colorsTitle, 'Colores');
    const headingNodes = colorsPanel.querySelectorAll('p.text-xs.font-semibold.text-gray-500.uppercase.tracking-wide');
    const headingKeys = ['Colores', 'Encabezado', 'Chat', 'Cliente'];
    headingNodes.forEach((node, idx) => registerTranslationTarget(node, headingKeys[idx]));
    const templateLabel = colorsPanel.querySelector('#toggleTemplatePanel span');
    registerTranslationTarget(templateLabel, 'Modelos');
    const templateDescription = colorsPanel.querySelector('.space-y-3 > p.text-xs.text-gray-500');
    registerTranslationTarget(templateDescription, 'Selecciona un estilo predefinido en la ventana emergente. Puedes ajustar los colores luego.');
    const optionLabels = colorsPanel.querySelectorAll('span.text-sm.font-medium.text-gray-600.select-none');
    const optionKeys = [
      'Fondo del encabezado',
      'Texto del encabezado',
      'Fondo del chat',
      'Color del texto',
      'Fondo del cliente',
      'Texto del cliente',
    ];
    optionLabels.forEach((node, idx) => registerTranslationTarget(node, optionKeys[idx]));
  }

  const widgetPositionLabel = document.getElementById('widgetPositionLabel');
  if (widgetPositionLabel) {
    widgetPositionLabel.textContent = translationManager.translate('Position');
    registerTranslationTarget(widgetPositionLabel, 'Position');
  }
  const widgetIconColorLabel = document.getElementById('widgetIconColorLabel');
  if (widgetIconColorLabel) {
    widgetIconColorLabel.textContent = t('Widget Icon Color');
    registerTranslationTarget(widgetIconColorLabel, 'Widget Icon Color');
  }

  const personalityLabel = document.querySelector('label[for="personalitySelect"]');
  const personalitySelectEl = document.getElementById('personalitySelect');
  const personalityDropdownLabel = document.getElementById('personalityDropdownLabel');
  const dropdownOptions = Array.from(document.querySelectorAll('#personalityDropdownMenu [data-personality-option]'));
  if (personalityLabel) {
    personalityLabel.textContent = translationManager.translate('Personalidad');
    registerTranslationTarget(personalityLabel, 'Personalidad');
  }
  if (personalitySelectEl) {
    Array.from(personalitySelectEl.options).forEach(option => {
      const key = PERSONALITY_KEY_BY_VALUE[option.value];
      if (!key) return;
      option.textContent = translationManager.translate(key);
      registerTranslationTarget(option, key);
    });
  }
  dropdownOptions.forEach(optionButton => {
    const optionValue = optionButton.getAttribute('data-personality-option');
    const optionLabel = optionButton.querySelector('.personality-option-label');
    const key = optionValue ? PERSONALITY_KEY_BY_VALUE[optionValue] : '';
    if (!key || !optionLabel) return;
    optionLabel.textContent = translationManager.translate(key);
    registerTranslationTarget(optionLabel, key);
  });
  if (personalityDropdownLabel && personalitySelectEl) {
    const selectedKey = PERSONALITY_KEY_BY_VALUE[personalitySelectEl.value] || PERSONALITY_TRANSLATION_ENTRIES[0]?.key;
    if (selectedKey) {
      personalityDropdownLabel.textContent = translationManager.translate(selectedKey);
      registerTranslationTarget(personalityDropdownLabel, selectedKey);
    }
  }

  const chatHeaderSectionTitle = document.getElementById('chatHeaderSectionTitle');
  if (chatHeaderSectionTitle) {
    chatHeaderSectionTitle.textContent = t('Encabezado');
    registerTranslationTarget(chatHeaderSectionTitle, 'Encabezado');
  }
  const headerSummaryDescription = document.getElementById('headerSummaryDescription');
  if (headerSummaryDescription) {
    headerSummaryDescription.textContent = t('Edita el título y la identidad visual del encabezado.');
    registerTranslationTarget(headerSummaryDescription, 'Edita el título y la identidad visual del encabezado.');
  }
  const welcomeSectionTitle = document.getElementById('welcomeSectionTitle');
  if (welcomeSectionTitle) {
    welcomeSectionTitle.textContent = t('Mensaje de bienvenida');
    registerTranslationTarget(welcomeSectionTitle, 'Mensaje de bienvenida');
  }
  const welcomeSummaryBadge = document.getElementById('welcomeSummaryBadge');
  if (welcomeSummaryBadge) {
    welcomeSummaryBadge.textContent = t('Desactivado');
    registerTranslationTarget(welcomeSummaryBadge, 'Desactivado');
  }
  const welcomeSummaryText = document.getElementById('welcomeSummaryText');
  if (welcomeSummaryText) {
    welcomeSummaryText.textContent = t('Agregar un mensaje de bienvenida para saludar a tus visitantes.');
    registerTranslationTarget(welcomeSummaryText, 'Agregar un mensaje de bienvenida para saludar a tus visitantes.');
  }

  const dash2TitleTranslations = [
    ['dash2TotalConvTitle', 'Total Conversations'],
    ['dash2KnowledgeTitle', 'Limit Knowledge'],
    ['dash2AnswersTitle', 'Limit Answers'],
    ['dash2ConversationsTitle', 'Conversations'],
  ];
  dash2TitleTranslations.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) registerTranslationTarget(el, key);
  });

  const promptTitleEl = document.getElementById('promptSectionTitle');
  const promptDescriptionEl = document.getElementById('promptSectionDescription');
  const promptTextareaEl = document.getElementById('promptTextarea');
  const promptSaveBtnEl = document.getElementById('savePromptBtn');
  registerTranslationTarget(promptTitleEl, 'System Prompt');
  registerTranslationTarget(promptDescriptionEl, 'Aquí puedes escribir el texto base del asistente. Este texto se usará como prompt del sistema para este bot.');
  registerTranslationTarget(promptTextareaEl, 'Escribe aquí el prompt del sistema...', 'placeholder');
  registerTranslationTarget(promptSaveBtnEl, 'Guardar cambios');
});
