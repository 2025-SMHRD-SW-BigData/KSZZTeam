import React, { useRef, useState } from 'react'
import { useNavigate, } from 'react-router-dom'
import img from '../img/logo.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'



const Main_ask = () => {
  const nav = useNavigate();
  
  return (
    <div>
      <Header></Header>
      <div className='parent'>
        <div className='fixed-box'>
          <h2>이미지를 업로드 해주세요</h2>
          <input type="file" id="imageUpload" accept="image/*"/>
            <div id="imagePreview"></div>
        </div>
      </div>


      <Footer></Footer>
    </div>
  )
}

export default Main_ask