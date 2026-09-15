import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { addToCart } from '../utils/cart'

export default function Product(){
  const { id } = useParams()
  const p = PRODUCTS.find(x=>x.id === id)
  const [size, setSize] = React.useState(p?.sizes?.[0] || '')
  const [flavor, setFlavor] = React.useState(p?.flavors?.[0] || '')
  const [qty, setQty] = React.useState(1)

  if(!p) return <div className="container"><h2>Product not found</h2><Link to="/products" className="btn btn-outline">Back to shop</Link></div>

  return (
    <div className="container product-page">
      <div className="gallery">
        <img src={p.image} alt={p.name} />
      </div>

      <div className="details">
        <h1>{p.name}</h1>
        <div style={{color:'var(--muted)'}}>{p.brand}</div>
        <div style={{fontWeight:700,fontSize:20,margin:'10px 0'}}>${p.price.toFixed(2)}</div>

        <div className="options">
          <div>
            <label>Size</label>
            <select className="input" value={size} onChange={e=>setSize(e.target.value)}>
              {p.sizes.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {p.flavors.length > 0 && (
            <div>
              <label>Flavor</label>
              <select className="input" value={flavor} onChange={e=>setFlavor(e.target.value)}>
                {p.flavors.map(f=> <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}

          <div>
            <label>Quantity</label>
            <div className="qty-controls">
              <button className="btn btn-outline" onClick={()=>setQty(Math.max(1,qty-1))}>−</button>
              <input className="input" type="number" value={qty} onChange={e=>setQty(Math.max(1,Number(e.target.value)||1))} style={{width:80,textAlign:'center'}} />
              <button className="btn btn-outline" onClick={()=>setQty(qty+1)}>+</button>
            </div>
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn btn-primary btn-large" onClick={()=>{
              addToCart({ id: p.id, qty, options: { size, flavor } })
              window.dispatchEvent(new Event('storage'))
            }}>Add to Cart</button>
            <Link to="/cart" className="btn btn-outline">Go to Cart</Link>
          </div>
        </div>

        <div style={{marginTop:12,color:'var(--muted)'}}>
          <strong>About</strong>
          <p>{p.description}</p>
        </div>
      </div>
    </div>
  )
}
