/**
 * Client-side for the paste creation page.
 */

(() => {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  const form = document.getElementById("form");
  const fileInput = document.getElementById("file-input");
  const contentInput = document.getElementById("content-input");
  const dropzone = document.getElementById("dropzone");
  const fileNameEl = document.getElementById("file-name");
  const uploadError = document.getElementById("upload-error");
  const browseBtn = document.getElementById("browse-btn");
  const uploadSubmit = document.getElementById("upload-submit");
  const tailwindEditor = document.getElementById("tailwind-editor");
  const tailwindError = document.getElementById("tailwind-error");
  const tailwindSubmit = document.getElementById("tailwind-submit");
  const MAX_BYTES = Number(form.dataset.maxBytes);

  let activeTab = tabs[0];
  let activePanel = panels[0];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab === activeTab) return;

      activeTab.classList.remove("border-brand-500", "text-brand-600", "bg-brand-50/50");
      activeTab.classList.add("border-transparent", "text-surface-400");
      activePanel.classList.add("hidden");

      tab.classList.add("border-brand-500", "text-brand-600", "bg-brand-50/50");
      tab.classList.remove("border-transparent", "text-surface-400");
      const newPanel = document.getElementById("panel-" + tab.dataset.panel);
      newPanel.classList.remove("hidden");

      activeTab = tab;
      activePanel = newPanel;
    });
  });

  /**
   * Displays an error message in the given container element.
   */
  function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  /**
   * Hides the given error container element.
   */
  function hideError(el) {
    el.classList.add("hidden");
  }

  /**
   * Validates and loads a file selected via browse or drag-and-drop.
   */
  function handleFile(file) {
    hideError(uploadError);
    fileNameEl.classList.add("hidden");
    dropzone.classList.remove("border-emerald-300", "bg-emerald-50/30");
    uploadSubmit.disabled = true;
    contentInput.value = "";

    if (!file) return;

    if (file.size > MAX_BYTES) {
      showError(uploadError, `File too large (${(file.size / 1000).toFixed(1)} KB). Max is ${MAX_BYTES / 1000} KB.`);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      if (!text.trim()) {
        showError(uploadError, "File is empty.");
        return;
      }
      contentInput.value = text;
      fileNameEl.textContent = "✓ " + file.name;
      fileNameEl.classList.remove("hidden");
      dropzone.classList.add("border-emerald-300", "bg-emerald-50/30");
      uploadSubmit.disabled = false;
    };

    reader.onerror = () => showError(uploadError, "Could not read file.");
    reader.readAsText(file);
  }

  ["dragenter", "dragover"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("border-brand-300", "bg-brand-50/30");
    });
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("border-brand-300", "bg-brand-50/30");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("border-brand-300", "bg-brand-50/30");
    handleFile(e.dataTransfer.files[0]);
  });

  dropzone.addEventListener("click", () => fileInput.click());
  browseBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    handleFile(fileInput.files[0]);
  });

  tailwindEditor.addEventListener("input", () => {
    hideError(tailwindError);
    tailwindSubmit.disabled = !tailwindEditor.value.trim();
  });

  form.addEventListener("submit", (e) => {
    if (activeTab.dataset.panel === "upload") {
      if (!contentInput.value.trim()) {
        e.preventDefault();
        showError(uploadError, "Please select a file first.");
      }
      return;
    }

    if (!tailwindEditor.value.trim()) {
      e.preventDefault();
      showError(tailwindError, "Paste some content first.");
      return;
    }
    contentInput.value = tailwindEditor.value;
  });
})();
