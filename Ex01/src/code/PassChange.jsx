import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/sing_logo1.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'
import PassChanges from './PassChanges'
import Member from './Member'
import img1 from '../img/arrow.jpg'

const PassChange = () => {
  const nav = useNavigate();

    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

      const handleLogin = () => {
    if (userId.trim() === '' || userName.trim() === '' || userEmail.trim() === '') {
      setErrorMessage('필수 사항을 전부 입력해 주세요');
    } else {
      setErrorMessage('');
      // 로그인 처리 로직 추가 (필요시)
      nav('/passchanges');
    }
  };
  return (
    <div className='parent'>
      <div className='fixed-box1' id='login_div'>
        <img src={img1} id='img2' onClick={() => { nav('/search') }}></img>
            <b id='span1'>비밀번호 찾기</b>

          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        <div id='login_div2' >
          
          <h2 style={{ textAlign: 'center', fontSize: '30px' }}>개인정보를 입력해 주세요</h2>
          <br></br>
          <br></br>
          <div id='login_div1'>
            <span style={{ fontSize: '20px' }} value={userName} onChange={(e)=>setUserName(e.target.value)}>* 이름   </span>

            <br></br>
            <input type='text' placeholder='이름을 입력 하세요' style={{ width: '350px', height: '30px' }}></input>
            <br></br>
            <br></br>
            <br></br>

            <span style={{ fontSize: '20px' }} value={userId} onChange={(e)=>setUserId(e.target.value)}>* 아이디  </span>
            <br></br>
            <input type='text' placeholder='아이디를 입력 하세요' style={{ width: '350px', height: '30px' }}  ></input>
            <br></br>
            <br></br>
            <br></br>
            
            <span style={{ fontSize: '20px' }} value={userEmail} onChange={(e)=>setUserEmail(e.target.value)}>* 이메일  </span>
            <br></br>
            <input type='text' placeholder='이메일을 확인 하세요' style={{ width: '350px', height: '30px' }}  ></input>
            <br></br>
            <br></br>
            <br></br>
            <span style={{color:'gray'}}>
              (*로 표시된 부분은 필수 입력사항 입니다.)
            </span>
            <br></br>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

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

        <button id='button' onClick={handleLogin}>비밀번호 변경하기</button>

      </div>

    </div>
  )
}

export default PassChange