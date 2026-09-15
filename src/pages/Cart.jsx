import React from 'react'
import { loadCart, updateQty, removeItem, clearCart } from '../utils/cart'
import { PRODUCTS } from '../data/products'

function formatPrice(v){ return `$${v.toFixed(2)}` }

export default function Cart(){
  const [cart, setCart] = React.useState(loadCart())
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [discountCode, setDiscountCode] = React.useState('')
  const [appliedDiscount, setAppliedDiscount] = React.useState(0)
  const [screenshot, setScreenshot] = React.useState(null)
  const [screenshotUrl, setScreenshotUrl] = React.useState(null)

  React.useEffect(()=> {
    setCart(loadCart())
  },[])

  function recalc(){ setCart(loadCart()) }

  function subtotal(){
    return cart.reduce((s,i)=>{
      const prod = PRODUCTS.find(p=>p.id===i.id)
      return s + (prod ? prod.price * i.qty : 0)
    },0)
  }

  function totalWithDiscount(){
    const sub = subtotal()
    const discount = appliedDiscount
    return sub * (1 - discount)
  }

  function applyCode(){
    const code = (discountCode || '').trim().toLowerCase()
    if(code === 'yousef10'){
      setAppliedDiscount(0.10)
      alert('Discount applied: 10% off')
    } else {
      setAppliedDiscount(0)
      alert('Invalid code')
    }
  }

  function handleScreenshotUpload(e){
    const f = e.target.files[0]
    if(!f) return
    setScreenshot(f)
    const url = URL.createObjectURL(f)
    setScreenshotUrl(url)
  }

  function openWhatsApp(){
    if(cart.length === 0){ alert('Your cart is empty.'); return }
    if(!name || !phone || !address){ alert('Please enter your name, phone, and address.'); return }
    const lines = []
    lines.push('Order from PeakFuel Supplements')
    lines.push('')
    lines.push(`Name: ${name}`)
    lines.push(`Phone: ${phone}`)
    lines.push(`Address: ${address}`)
    lines.push('')
    lines.push('Products:')
    cart.forEach(item=>{
      const prod = PRODUCTS.find(p=>p.id===item.id)
      const opts = item.options || {}
      const optText = `${opts.size ? opts.size : ''}${opts.flavor ? ' • '+opts.flavor : ''}`
      lines.push(`- ${prod?.name || item.id}${optText ? ' ('+optText+')' : ''} x${item.qty} — ${formatPrice((prod?.price||0)*item.qty)}`)
    })
    lines.push('')
    const sub = subtotal()
    lines.push(`Subtotal: ${formatPrice(sub)}`)
    if(appliedDiscount > 0){
      lines.push(`Discount (${discountCode}): -${formatPrice(sub * appliedDiscount)}`)
    }
    lines.push(`Total: ${formatPrice(totalWithDiscount())}`)
    if(discountCode) lines.push(`Discount code used: ${discountCode}`)
    lines.push('')
    lines.push('Payment screenshot: please attach the screenshot image in WhatsApp before sending.')
    lines.push('Thank you!')

    const message = encodeURIComponent(lines.join('\n'))
    const waNumber = '2010XXXXXXXXX' // fixed WhatsApp number (Egypt format with country code)
    const waUrl = `https://wa.me/${waNumber}?text=${message}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="container cart-page">
      <h2>Your Cart</h2>

      <div className="cart-items" style={{marginTop:12}}>
        {cart.length === 0 && <p style={{color:'var(--muted)'}}>Your cart is empty. Go to <a href="/products" className="btn btn-outline">Shop</a></p>}
        {cart.map(item=>{
          const prod = PRODUCTS.find(p=>p.id===item.id) || {}
          return (
            <div className="cart-item" key={item.key}>
              <img src={prod.image} alt={prod.name} />
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{prod.name}</div>
                    <div style={{color:'var(--muted)'}}>{item.options?.size || ''} {item.options?.flavor ? '• '+item.options.flavor : ''}</div>
                  </div>
                  <div style={{fontWeight:700}}>{formatPrice(prod.price)}</div>
                </div>
                <div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}>
                  <button className="btn btn-outline" onClick={()=>{ updateQty(item.key, Math.max(1, item.qty - 1)); recalc() }}>−</button>
                  <div style={{minWidth:28,textAlign:'center'}}>{item.qty}</div>
                  <button className="btn btn-outline" onClick={()=>{ updateQty(item.key, item.qty + 1); recalc() }}>+</button>
                  <button className="btn btn-outline" onClick={()=>{ removeItem(item.key); recalc() }}>Remove</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{marginTop:20,display:'grid',gridTemplateColumns:'1fr 360px',gap:20}}>
        <div>
          <h3>Customer Details</h3>
          <div style={{display:'grid',gap:8}}>
            <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="input" placeholder="Phone number (e.g. +2010...)" value={phone} onChange={e=>setPhone(e.target.value)} />
            <textarea className="input" placeholder="Delivery address" value={address} onChange={e=>setAddress(e.target.value)} rows={4} />
          </div>

          <h3 style={{marginTop:16}}>Payment screenshot</h3>
          <p style={{color:'var(--muted)',marginTop:0}}>Upload your payment screenshot (clients will attach this image in WhatsApp when sending).</p>
          <input type="file" accept="image/*" onChange={handleScreenshotUpload} />
          {screenshotUrl && (
            <div style={{marginTop:8}}>
              <img src={screenshotUrl} alt="preview" style={{maxWidth:200,borderRadius:6}} />
              <div style={{marginTop:8}}>
                <a className="btn btn-outline" href={screenshotUrl} download="payment-screenshot.png">Download screenshot (for WhatsApp attach)</a>
              </div>
            </div>
          )}
        </div>

        <aside style={{background:'rgba(255,255,255,0.02)',padding:12,borderRadius:8}}>
          <h3>Summary</h3>
          <div style={{display:'flex',justifyContent:'space-between',color:'var(--muted)'}}>
            <div>Subtotal</div><div>{formatPrice(subtotal())}</div>
          </div>

          <div style={{display:'flex',gap:8,marginTop:10}}>
            <input className="input" placeholder="Discount code" value={discountCode} onChange={e=>setDiscountCode(e.target.value)} />
            <button className="btn btn-primary" onClick={applyCode}>Apply</button>
          </div>

          {appliedDiscount > 0 && <div style={{color:'var(--muted)',marginTop:8}}>Discount applied: {(appliedDiscount*100).toFixed(0)}%</div>}

          <div style={{display:'flex',justifyContent:'space-between',marginTop:12,fontWeight:700}}>
            <div>Total</div><div>{formatPrice(totalWithDiscount())}</div>
          </div>

          <div style={{marginTop:12,display:'flex',gap:8}}>
            <button className="btn btn-primary" onClick={openWhatsApp}>Checkout via WhatsApp</button>
            <button className="btn btn-outline" onClick={()=>{ clearCart(); setCart([]); window.dispatchEvent(new Event('storage')) }}>Clear</button>
          </div>

          <p style={{color:'var(--muted)',marginTop:12,fontSize:13}}>
            Note: After clicking Checkout a WhatsApp window will open with your order details pre-filled. Attach the payment screenshot manually in WhatsApp (or use the download link).
          </p>
        </aside>
      </div>
    </div>
  )
}
