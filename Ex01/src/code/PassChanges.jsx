import React, { useState } from 'react'
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
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (password === password1) {
      setErrorMessage('');
      // 로그인 처리 로직 추가 (필요시)
      nav('/search');
    } else {

      setErrorMessage('패스워드를 다시 확인하세요.');
    }
  };
  return (
    <div>
      <div className='parent'>
        <div className='fixed-box1' id='login_div'>
          <img src={img1} id='img2' onClick={() => { nav('/search') }}></img>
          <b className='span1'>비밀번호 변경</b>

          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className='login_div2' >

            <h2 style={{ textAlign: 'center', fontSize: '30px' }}>변경할 비밀번호를 입력하세요</h2>
            <br></br>
            <br></br>
            <div className='login_div1'>
              <span style={{ fontSize: '20px' }}>새로운 비밀번호  </span>

              <br></br>
              <input type='password' placeholder='비밀번호를 입력하세요' style={{ width: '350px', height: '30px' }} value={password} onChange={(e) => setPassword(e.target.value)}></input>
              <br></br>
              <br></br>

              <span style={{ fontSize: '20px' }}> 새로운 비밀번호 확인</span>
              <br></br>
              <input type='password' placeholder='비밀번호를 확인하세요' style={{ width: '350px', height: '30px' }} value={password1} onChange={(e) => setPassword1(e.target.value)} ></input>
              <br></br>
              <br></br>
              {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

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

          <button id='button' onClick={handleLogin}>비밀번호 변경</button>

        </div>

      </div>
    </div>
  )
}

export default PassChanges