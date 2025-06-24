import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/sing_logo1.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'
import PassChange from './PassChange'
import Member from './Member'
import img1 from '../img/arrow.jpg'

const Search = () => {
  const nav = useNavigate();

  //상태 관리 추가
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (userId.trim() === '' || password.trim() === '') {
      setErrorMessage('아이디와 패스워드를 확인하세요.');
    } else {
      setErrorMessage('');
      // 로그인 처리 로직 추가 (필요시)
      nav('/');
    }
  };

  return (
    <div>

      <div className='parent'>
        <div className='fixed-box1' id='login_div'>
          {/* <img src={img1} id='img2'></img> */}
          <img src={img} id='img1'></img>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h1 id="login">싱싱해</h1>
          <br></br>
          <br></br>
          <div id='login_div2' >
            <h2 style={{ textAlign: 'center', fontSize: '30px' }}>로그인</h2>
            <div id='login_div1'>
              <span style={{ fontSize: '20px' }}>아이디  </span>
              <br></br>
              <input type='text' placeholder='아이디를 입력 하세요' style={{ width: '350px', height: '30px' }} value={userId} onChange={(e)=>setUserId(e.target.value)}></input>
              <br></br>
              <br></br>

              <span style={{ fontSize: '20px' }}>패스워드  </span>
              <br></br>
              <input type='password' placeholder='패스워드를 입력 하세요' style={{ width: '350px', height: '30px' }} value={password} onChange={(e)=>setPassword(e.target.value)}  ></input>
              <br></br>
              <br></br>
              <br></br>
              <p className='passsearch' onClick={() => { nav('/passchange') }}>비밀번호를 잊으셨나요?</p>
              <br></br>
            </div>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <button id='button' onClick={handleLogin}>로그인 하기</button>
          <br></br>
          <br></br>
          <p id='passsearch1' onClick={() => { nav('/member') }}>회원가입 하기</p>
        </div>
      </div>


    </div>
  )
}

export default Search