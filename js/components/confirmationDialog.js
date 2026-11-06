/**
 * Reusable, accessible confirmation dialog for important player actions.
 * Returns true only when the player explicitly confirms the action.
 */
export function requestConfirmation({
  title = "Are you sure?",
  message = "Please confirm that you want to continue.",
  confirmText = "Yes, continue",
  cancelText = "Go back",
} = {}) {
  const dialog = document.querySelector("#processConfirmDialog");
  if (!dialog) return Promise.resolve(window.confirm(`${title}\n\n${message}`));

  const titleElement = dialog.querySelector("#processConfirmTitle");
  const messageElement = dialog.querySelector("#processConfirmMessage");
  const confirmButton = dialog.querySelector("#processConfirmYes");
  const cancelButton = dialog.querySelector("#processConfirmNo");

  titleElement.textContent = title;
  messageElement.textContent = message;
  confirmButton.textContent = confirmText;
  cancelButton.textContent = cancelText;

  return new Promise(resolve => {
    const finish = confirmed => {
      dialog.removeEventListener("close", onClose);
      resolve(confirmed);
    };
    const onClose = () => finish(dialog.returnValue === "confirm");
    dialog.addEventListener("close", onClose, { once: true });

    // Focus the safe option first so Enter/Escape cannot accidentally confirm.
    dialog.showModal();
    cancelButton.focus();
  });
}
