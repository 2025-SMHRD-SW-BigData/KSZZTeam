import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'

const main_infor = () => {
  const nav = useNavigate();
  return (
    <div>
      <div className='parent'>
        <div id='fixed_box4'>
          <Header></Header>
          <h1 style={{ marginLeft :'230px' }}>내 정보</h1>
          <div>
            <br></br>
            <div id='info_div1'>
              <br></br>
              <span className='info_b'> <b>이메일 :</b> </span>
              <br></br>
            
              <br></br>
              <span className='info_b'> <b>이름 :</b> </span>
              <br></br>

              <br></br>
              <span className='info_b'> <b>생년월일 :</b> </span>
              <br></br>
              <br></br>
            </div>
            <br></br>
            <br></br>
            

            <br></br>
            <div id='info_div2'>
              <br></br>
              <span className='info_b'><b>비밀번호  :</b></span>
              <br></br>
              <br></br>
              <span className='info_b'><b>닉네임 : </b></span>
              <br></br>
              <br></br>
              <span className='info_b'> <b>휴대폰 번호  :</b> </span>
              <br></br>
              <br></br>
              <span className='info_b'> <b>요리사 유/무 :</b> </span>
              <br></br>
              <br></br>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <button style={{height:'50px',width:'200px',marginLeft:'50px'}} onClick={()=>{nav('/infor1')}}>회원 정보 수정</button>
            <button style={{height:'50px',width:'200px',marginLeft:'70px'}}>회원 탈퇴</button>
          </div>

          <Footer></Footer>
        </div>
      </div>
    </div >
  )
}

export default main_infor