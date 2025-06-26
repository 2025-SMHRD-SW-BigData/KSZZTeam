import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/sing_logo1.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'
import PassChange from './PassChange'
import img1 from '../img/arrow.jpg'
import Upload from './Upload'


const Member = () => {
  const nav = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [visible, setVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);

    const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
       // 분석 결과 초기화
    }
  }

  const handleOptionChange = (event) => {
    const value = event.target.value;
    if (selectedOption === value) {
      setSelectedOption(null); // 선택 해제
    } else {
      setSelectedOption(value); // 다른 옵션 선택
    }
  };
  return (
    <div className='parent'>
      <div className='fixed-box1'>
        <form>
          <img src={img1} id='img2' onClick={() => { nav('/search') }}></img>
          <b className='span2'>회원가입</b>
          <br></br>
          <br></br>
          <div className='login_div2'>

            <h2 style={{ fontSize: '30px', textAlign: 'center' }}>회원가입</h2>

            <br></br>
            <div className='login_div1'>
              <span style={{ fontSize: '20px' }} >* 이메일  </span>

              <br></br>
              <input type='text' placeholder='이메일을 입력 하세요' style={{ width: '350px', height: '30px' }}></input>
              <br></br>
              <br></br>
              <span style={{ fontSize: '20px' }} >* 비밀번호  </span>

              <br></br>
              <input type='text' placeholder='비밀번호를 입력 하세요' style={{ width: '350px', height: '30px' }}></input>
              <br></br>
              <br></br>
              <span style={{ fontSize: '20px' }} >* 이름  </span>

              <br></br>
              <input type='text' placeholder='이름을 입력 하세요' style={{ width: '350px', height: '30px' }}></input>
              <br></br>
              <br></br>
              <span style={{ fontSize: '20px' }} >* 닉네임  </span>

              <br></br>
              <input type='text' placeholder='닉네임을 입력 하세요' style={{ width: '350px', height: '30px' }}></input>
              <br></br>
              <br></br>
              <span style={{ fontSize: '20px' }} >* 생년월일  </span>

              <br></br>
              <input type='date' style={{ fontSize: '20px', width: '350px', height: '30px' }}></input>
              <br></br>
              <br></br>
              <span style={{ fontSize: '20px' }} >* 휴대폰 번호  </span>

              <br></br>
              <input type='text' placeholder='휴대폰 번호를 -없이 입력 하세요' style={{ width: '350px', height: '30px' }}></input>
              <br></br>
              <br></br>

              <span style={{ fontSize: '20px' }} >요리사 유/무  </span>

              <br></br>

              <span style={{ fontSize: '20px', marginLeft: '50px' }}>Y  </span><input type='radio' value="option1"
                checked={selectedOption === 'option1'}
                onChange={handleOptionChange}></input>

              <span style={{ fontSize: '20px', marginLeft: '100px' }}>N </span><input type="radio"
                value="option2"
                checked={selectedOption === 'option2'}
                onChange={handleOptionChange}>
              </input>
              <br></br>
              <br></br>
              <p style={{ color: 'red', fontSize: '15px' }}>*요리사일 경우 경력증명을 할 수 있는 사진을 올려주세요</p>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
              />
              {selectedImage && (
                <div id="imagePreview1">
                  <img src={selectedImage} alt="업로드된 이미지" />
                </div>
              )}

            </div>

          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <button id='button1' type='submit' onClick={() => { nav('/search') }}>회원가입 완료</button><button id='button2' type='reset'>초기화</button>
        </form>
      </div>
    </div >
  )
}

export default Member