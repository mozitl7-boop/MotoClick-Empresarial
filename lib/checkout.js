export const STORAGE_KEY = 'motoclick_v2_cart';
export const ORDER_KEY = 'motoclick_v2_last_order';
export const TEST_CARD = '4242424242424242';
export function validateTestCard(value) {
  return String(value).replace(/\D/g, '') === TEST_CARD;
}
export function validateExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(String(value).trim());
  if (!match) return false;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return false;
  const expiryYear = 2000 + Number(match[2]);
  const current = new Date();
  return expiryYear > current.getFullYear() || (expiryYear === current.getFullYear() && month >= current.getMonth() + 1);
}
export function newOrderNumber() {
  const part = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2,6);
  return `MC-${part}-${rand}`;
}
