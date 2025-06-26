import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../style/Main.css';
import axios from 'axios'

const MainSizang = () => {
  const nav = useNavigate();
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [markers, setMarkers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeImage, setPlaceImage] = useState(null);

  const REST_API_KEY = 'eed2712ea99c8e0cae36fb6a57624202';

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=d48e9868ca4088ba839d6a30d7fe13ac&libraries=services&autoload=false";

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(35.1595454, 126.8526012),
          level: 3
        };

        const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(kakaoMap);

        const markerPosition = new window.kakao.maps.LatLng(37.570217, 126.991091);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(kakaoMap);
        setMarkers([marker]);
      });
    };

    document.head.appendChild(script);
  }, []);

  // 🔍 검색 함수
  const handleSearch = () => {
    if (!keyword.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        markers.forEach(marker => marker.setMap(null)); // 기존 마커 삭제

        const newMarkers = [];
        const bounds = new window.kakao.maps.LatLngBounds();

        data.forEach(place => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);

          const marker = new window.kakao.maps.Marker({
            position: position
          });
          marker.setMap(map);
          newMarkers.push(marker);

          bounds.extend(position);
        });

        setMarkers(newMarkers);
        setSearchResults(data);
        setSelectedPlace(null);
        map.setBounds(bounds);
      } else {
        alert('검색 결과를 찾을 수 없습니다.');
        setSearchResults([]);
        setSelectedPlace(null);
      }
    });
  };
  // 🔍 장소명으로 블로그 사진 가져오기
  const fetchPlaceImage = async (placeName) => {
    try {
      const response = await axios.get('https://dapi.kakao.com/v2/search/blog', {
        params: { query: placeName, sort: 'accuracy' },
        headers: { Authorization: `KakaoAK ${REST_API_KEY}` }
      });

      if (response.data.documents.length > 0) {
        const thumbnailUrl = response.data.documents[0].thumbnail;
        setPlaceImage(thumbnailUrl);
      } else {
        setPlaceImage(null); // 검색 결과 없을 때
      }
    } catch (error) {
      console.error('이미지 검색 실패:', error);
      setPlaceImage(null);
    }
  };

  // 🗺️ 검색 결과 클릭 시 지도 이동 및 상세정보 표시
  const handleResultClick = (place) => {
    const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);

    // 지도 중심 이동 및 줌인
    map.setLevel(2); // 줌인
    map.setCenter(moveLatLon);

    // 기존 마커 삭제
    markers.forEach(marker => marker.setMap(null));

    // 새 마커 추가
    const marker = new window.kakao.maps.Marker({
      position: moveLatLon
    });
    marker.setMap(map);
    setMarkers([marker]);

    // 선택된 장소 저장
    setSelectedPlace(place);
  };

  return (
    <div>

      <div className='parent'>
        <Header></Header>
        <div id='fixed_box3'>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="시장 이름을 검색하세요"
              style={{ width: '300px', padding: '8px', marginRight: '10px' }}
            />
            <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
              검색
            </button>
          </div>

          {/* 지도 */}
          <div id="map" style={{ width: '550px', height: '300px', marginBottom: '20px' }}></div>

          {/* 검색 결과 리스트 */}
          {searchResults.length > 0 && (
            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
              <h3>검색 결과</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {searchResults.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => handleResultClick(place)}
                    style={{ cursor: 'pointer', padding: '5px 0', borderBottom: '1px solid #eee' }}
                  >
                    {place.place_name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 선택된 장소 상세정보 출력 */}
          {selectedPlace && (
            <div style={{ border: '1px solid #ddd', padding: '10px' }}>
              <h3>선택한 장소 정보</h3>
              <p><strong>장소명:</strong> {selectedPlace.place_name}</p>
              <p><strong>주소:</strong> {selectedPlace.road_address_name || selectedPlace.address_name}</p>
              <p><strong>전화번호:</strong> {selectedPlace.phone || '없음'}</p>
              {placeImage ? (
                <img src={placeImage} alt="장소 이미지" style={{ width: '100%', marginTop: '10px' }} />
              ) : (
                <p style={{ marginTop: '10px' }}>관련 사진이 없습니다.</p>
              )}
            </div>
          )}
        </div>
        <Footer></Footer>
      </div>

    </div>
  );
};

export default MainSizang;