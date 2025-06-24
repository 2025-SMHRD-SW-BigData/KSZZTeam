import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/sing_logo1.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'
import Member from './Member'
import img1 from '../img/arrow.jpg'
import Search from './Search'

const PassChanges = () => {
    const nav = useNavigate();
  return (
    <div>
        <div className='parent'>
              <div className='fixed-box1' id='login_div'>
                <img src={img1} id='img2' onClick={() => { nav('/search') }}></img>
                    <b id='span1'>비밀번호 변경</b>
        
                  <br></br>
                  <br></br> 
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                <div id='login_div2' >
                  
                  <h2 style={{ textAlign: 'center', fontSize: '30px' }}>변경할 비밀번호를 입력하세요</h2>
                  <br></br>
                  <br></br>
                  <div id='login_div1'>
                    <span style={{ fontSize: '20px' }}>새로운 비밀번호  </span>
        
                    <br></br>
                    <input type='password' placeholder='비밀번호를 입력하세요' style={{ width: '350px', height: '30px' }}></input>
                    <br></br>
                    <br></br>
        
                    <span style={{ fontSize: '20px' }}> 새로운 비밀번호 확인</span>
                    <br></br>
                    <input type='password' placeholder='비밀번호를 확인하세요' style={{ width: '350px', height: '30px' }}  ></input>
                    <br></br>
                    <br></br>
                    
                    
                    <br></br>
                    <br></br>
        
                    <br></br>
                  </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
        
                <button id='button' onClick={() => { nav('/Search') }}>비밀번호 변경</button>
        
              </div>
        
            </div>
    </div>
  )
}

export default PassChanges