const STORAGE_KEY = 'peakfuel_cart_v2'

export function loadCart(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch(e){ return [] }
}
export function saveCart(cart){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)) }
export function cartCount(){ return loadCart().reduce((s,i)=>s+i.qty,0) }
export function addToCart(item){
  const cart = loadCart()
  const key = item.id + '::' + JSON.stringify(item.options || {})
  const idx = cart.findIndex(c=>c.key === key)
  if(idx !== -1){ cart[idx].qty += item.qty } else { cart.push({ ...item, key }) }
  saveCart(cart)
}
export function updateQty(key, qty){
  const cart = loadCart()
  const idx = cart.findIndex(c=>c.key === key)
  if(idx !== -1){ cart[idx].qty = qty; if(cart[idx].qty <= 0) cart.splice(idx,1); saveCart(cart) }
}
export function clearCart(){ localStorage.removeItem(STORAGE_KEY) }
export function removeItem(key){ const cart = loadCart().filter(c=>c.key !== key); saveCart(cart) }
