import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Main_Infor1 = () => {
    const nav = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOptionChange = (event) => {
        const value = event.target.value;
        if (selectedOption === value) {
            setSelectedOption(null); // 선택 해제
        } else {
            setSelectedOption(value); // 다른 옵션 선택
        }
    };
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            // 분석 결과 초기화
        }
    }
    return (
        <div>
            <Header></Header>
            <div className='parent'>
                <div className='fixed-box'>
                    <h1 style={{ textAlign: 'center' }}>회원 정보 수정</h1>
                    <div id='info_div2'>

                        <br></br>
                        <span className='info_b'><b>비밀번호 변경 :</b></span><input style={{marginLeft:'42px'}}></input>
                        <br></br>
                        <br></br>
                        <span className='info_b'><b>비밀번호 변경 확인 :</b></span><input style={{marginLeft:'10px'}}></input>
                        <br></br>
                        <br></br>
                        
                        <span className='info_b'><b>닉네임 변경 : </b></span><input style={{marginLeft:'53px'}}></input>

                        <br></br>
                        <br></br>
                        <span className='info_b'> <b>휴대폰 번호 변경 :</b> </span><input style={{marginLeft:'20px'}}></input>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <span className='info_b'> <b>요리사 유/무 변경 :</b> </span>
                        <span style={{ fontSize: '20px', marginLeft: '50px' }}>Y  </span><input type='radio' value="option1"
                            checked={selectedOption === 'option1'}
                            onChange={handleOptionChange}></input>
                        

                        <span style={{ fontSize: '20px', marginLeft: '100px' }}>N </span><input type="radio"
                            value="option2"
                            checked={selectedOption === 'option2'}
                            onChange={handleOptionChange}></input>
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
                    
                    <br></br>
                    <br></br>
                    <br></br>
                        <button style={{width:'100px',height:'50px', marginLeft:'220px'}} onClick={()=>{nav('/infor')}}>수정완료</button>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Main_Infor1