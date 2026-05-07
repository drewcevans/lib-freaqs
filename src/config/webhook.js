export const WEBHOOK = 'https://script.google.com/macros/s/AKfycbzElJ7eBedD1goiEaXkjBLmLUDddqZ0amePiSG9oNYcDMGs5aSk7HqNWF0AeQxmnPA-/exec';

export const post = (payload) =>
  fetch(WEBHOOK, {
    method:  'POST',
    mode:    'no-cors',
    redirect:'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body:    JSON.stringify(payload),
  }).catch(() => {});
