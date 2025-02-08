import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='bg-black w-full h-screen'>
      <Navbar />
      <h1 className='text-5xl text-red-800'>App</h1>
      <Footer />
    </div>
  )
}

export default App