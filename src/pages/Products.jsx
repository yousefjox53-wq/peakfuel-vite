import React from 'react'
import { PRODUCTS } from '../data/products'
import { Link, useLocation } from 'react-router-dom'
import { addToCart } from '../utils/cart'

function useQuery(){ return new URLSearchParams(useLocation().search) }

export default function Products(){
  const [categories, setCategories] = React.useState([])
  const [brands, setBrands] = React.useState([])
  const [selectedCats, setSelectedCats] = React.useState(new Set())
  const [selectedBrands, setSelectedBrands] = React.useState(new Set())
  const [priceMin, setPriceMin] = React.useState(0)
  const [priceMax, setPriceMax] = React.useState(200)
  const [sort, setSort] = React.useState('featured')
  const q = useQuery()

  React.useEffect(()=>{
    setCategories(Array.from(new Set(PRODUCTS.map(p=>p.category))))
    setBrands(Array.from(new Set(PRODUCTS.map(p=>p.brand))))
    const cat = q.get('category')
    if(cat) setSelectedCats(new Set([cat]))
  },[])

  function applyFilters(){
    let list = PRODUCTS.slice()
    if(selectedCats.size) list = list.filter(p=>selectedCats.has(p.category))
    if(selectedBrands.size) list = list.filter(p=>selectedBrands.has(p.brand))
    list = list.filter(p=>p.price >= priceMin && p.price <= priceMax)
    if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price)
    if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price)
    return list
  }

  const list = applyFilters()
  return (
    <div className="container shop">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="filter-section">
          <label><strong>Category</strong></label>
          {categories.map(c=>(
            <div key={c}><label><input type="checkbox" checked={selectedCats.has(c)} onChange={(e)=>{
              const next = new Set(selectedCats)
              if(e.target.checked) next.add(c); else next.delete(c)
              setSelectedCats(next)
            }} /> {c}</label></div>
          ))}
        </div>

        <div className="filter-section">
          <label><strong>Brand</strong></label>
          {brands.map(b=>(
            <div key={b}><label><input type="checkbox" checked={selectedBrands.has(b)} onChange={(e)=>{
              const next = new Set(selectedBrands)
              if(e.target.checked) next.add(b); else next.delete(b)
              setSelectedBrands(next)
            }} /> {b}</label></div>
          ))}
        </div>

        <div className="filter-section">
          <label><strong>Price</strong></label>
          <div style={{display:'flex',gap:8}}>
            <input className="input" type="number" value={priceMin} onChange={e=>setPriceMin(Number(e.target.value))} />
            <input className="input" type="number" value={priceMax} onChange={e=>setPriceMax(Number(e.target.value))} />
          </div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-outline" onClick={()=>{
            setSelectedBrands(new Set()); setSelectedCats(new Set()); setPriceMin(0); setPriceMax(200)
          }}>Clear</button>
        </div>
      </aside>

      <section className="listing">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>All Products</h2>
          <div>
            <label style={{color:'var(--muted)'}}>Sort: </label>
            <select className="input" value={sort} onChange={e=>setSort(e.target.value)} style={{width:180,display:'inline-block',marginLeft:8}}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="product-grid" style={{marginTop:12}}>
          {list.map(p=>(
            <div className="product-card" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="meta">
                <div style={{fontWeight:700}}>{p.name}</div>
                <div className="price">${p.price.toFixed(2)}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <Link to={`/product/${p.id}`} className="btn btn-outline">View</Link>
                <button className="btn btn-primary" onClick={()=>{
                  addToCart({ id: p.id, qty: 1, options: {} })
                  window.dispatchEvent(new Event('storage'))
                }}>Add</button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p style={{color:'var(--muted)'}}>No products match those filters.</p>}
        </div>
      </section>
    </div>
  )
}
