import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import Cart from './pages/Cart'
import { cartCount } from './utils/cart'

function Nav(){
  const [count, setCount] = React.useState(cartCount())
  React.useEffect(()=>{
    const onStorage = ()=> setCount(cartCount())
    window.addEventListener('storage', onStorage)
    const timer = setInterval(()=> setCount(cartCount()), 500)
    return ()=>{ window.removeEventListener('storage', onStorage); clearInterval(timer) }
  },[])
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">PeakFuel</Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/products#categories">Categories</Link>
          <Link to="/cart">Cart <span id="cart-count">({count})</span></Link>
        </nav>
      </div>
    </header>
  )
}

export default function App(){
  return (
    <div>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/product/:id" element={<Product/>} />
          <Route path="/cart" element={<Cart/>} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>© {new Date().getFullYear()} PeakFuel Supplements</div>
          <div style={{color:'var(--muted)'}}>Clean. Powerful. Trusted.</div>
        </div>
      </footer>
    </div>
  )
}
