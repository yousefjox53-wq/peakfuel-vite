import React from 'react'
import { PRODUCTS } from '../data/products'
import { Link } from 'react-router-dom'
import { addToCart } from '../utils/cart'

export default function Home(){
  const featured = PRODUCTS.filter(p=>p.featured).slice(0,4)
  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Premium Supplements for Your Fitness Goals</h1>
            <p>Performance-driven formulas, clean ingredients, superior taste. Fuel every workout, recover faster, build more.</p>
            <div style={{display:'flex',gap:12}}>
              <Link className="btn btn-primary" to="/products">Shop Best Sellers</Link>
              <a className="btn btn-outline" href="#categories">Browse Categories</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1621920627433-6d3bcb5b9d5a?q=80&w=800&auto=format&fit=crop&fm=webp" alt="Supplements" />
          </div>
        </div>
      </section>

      <section className="container featured">
        <h2>Featured Products</h2>
        <div className="product-grid" style={{marginTop:12}}>
          {featured.map(p=>(
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
        </div>
      </section>

      <section id="categories" className="container categories">
        <h2>Shop by Category</h2>
        <div className="category-grid" style={{marginTop:12}}>
          {['Protein','Creatine','Pre-Workout','Vitamins'].map(c=>(
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="category-card">{c}</Link>
          ))}
        </div>
      </section>
    </div>
  )
}
