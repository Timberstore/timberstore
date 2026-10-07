import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

let keyboardBound = false;

function onKeyDown(event) {
  const close = event.target.closest?.(SEL.informationMessageClose);
  if (!close || close.tagName === 'BUTTON') return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  // Apollo owns dismissal and persistence. Activate the existing element so
  // both direct and delegated native click handlers remain intact.
  close.click();
}

export default {
  name: 'information-message',
  pages: ['*'],
  init(root) {
    for (const close of root.querySelectorAll(SEL.informationMessageClose)) {
      close.setAttribute('aria-label', TEXTS.closeInformationMessage);
      if (close.tagName !== 'BUTTON') {
        close.setAttribute('role', 'button');
        close.tabIndex = 0;
      }
    }
    if (keyboardBound) return;
    document.addEventListener('keydown', onKeyDown);
    keyboardBound = true;
  },
};
