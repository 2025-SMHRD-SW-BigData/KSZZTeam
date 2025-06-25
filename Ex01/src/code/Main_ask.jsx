import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'

const Main_ask = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const nav = useNavigate();

  // 이미지 선택 시 호출
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setAnalysisResult(''); // 분석 결과 초기화
    }
  }

  // AI 분석 시뮬레이션 (여기에 추후 API 연동하면 됨)
  const handleAnalyze = () => {
    if (!selectedImage) {
      alert('이미지를 먼저 업로드해주세요!');
      return;
    }
    // 임시 분석 결과 (나중에 실제 AI 결과로 교체)
    setAnalysisResult('이 이미지는 "바다"로 분류되었습니다.');
  }

  return (
    <div>
      <Header />
      <div className='ask-container'>
        <h2 className='ask-title'>이미지 AI 분류 서비스</h2>

        <div className='upload-section'>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <div id="imagePreview">
              <img src={selectedImage} alt="업로드된 이미지" />
            </div>
          )}
          <button className='analyze-button' onClick={handleAnalyze}>AI 분석하기</button>
        </div>

        <div className='result-section'>
          <h3>AI 분석 결과</h3>
          <div className='result-box'>
            {analysisResult ? analysisResult : '이미지를 업로드하고 분석 버튼을 눌러주세요.'}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Main_ask