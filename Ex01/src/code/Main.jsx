import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/logo.jpg.png'
import '../style/Main.css'
import Header from './Header'
import Footer from './Footer'
import FishPriceControls from './FishPriceControls';
import FishPriceTable from './FishPriceTable';
import PaginationControls from './PaginationControls';



const Main = () => {
    const nav = useNavigate();
    const [fishName, setFishName] = useState('');
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('검색할 어종명과 날짜를 선택해주세요.');

    const numOfRows = 50;
    const apiKey = 'PuTClKecmfUj5VNhigDWx0ZFkdP2Y%2B9vl9yOUjj1Zy%2Fi5XSMtshCZ39Z7yus9JruWi%2BfLXz1SNzVJEYb7TbFZg%3D%3D';

    const fetchData = async () => {
        if (!fishName) {
            setMessage('어종명을 입력해주세요.');
            return;
        }
        if (!searchDate) {
            setMessage('조회할 날짜를 선택해주세요.');
            return;
        }

        const baseDt = searchDate.replace(/-/g, '');
        const encodedFishName = encodeURIComponent(fishName);
        const url = `https://apis.data.go.kr/1192000/select0040List/getselect0040List?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${currentPage}&type=xml&baseDt=${baseDt}&mprcStdCodeNm=${encodedFishName}`;

        setLoading(true);
        setItems([]);
        setMessage('데이터를 불러오는 중...');

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`네트워크 오류: ${response.statusText}`);

            const xmlString = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

            const resultCode = xmlDoc.querySelector('resultCode')?.textContent;
            const resultMsg = xmlDoc.querySelector('resultMsg')?.textContent;

            if (resultCode !== '00') throw new Error(`API 오류: ${resultMsg} (코드: ${resultCode})`);

            const total = parseInt(xmlDoc.querySelector('totalCount')?.textContent || 0, 10);
            setTotalCount(total);

            let fetchedItems = Array.from(xmlDoc.querySelectorAll('item')).filter(item => {
                const weight = parseFloat(item.querySelector('csmtWt')?.textContent || 0);
                const amount = parseInt(item.querySelector('csmtAmount')?.textContent || 0, 10);
                return weight > 0 && amount > 0;
            });

            if (fetchedItems.length === 0) {
                setMessage(`${searchDate}에 '${fishName}' 위판 데이터가 없습니다.`);
            } else {
                setMessage(`총 ${total.toLocaleString()}건의 데이터 중 유효한 결과를 표시합니다.`);
            }

            setItems(fetchedItems);
        } catch (error) {
            console.error('오류 발생:', error);
            setMessage(`데이터 조회 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        const lastPage = Math.ceil(totalCount / numOfRows);
        if (currentPage < lastPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (fishName) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <div>
            <Header></Header>

            <div className='parent'>
                <div className='fixed-box'>
                    <div className="container">
                        <h1>어종별 위판 가격 조회</h1>
                        <FishPriceControls
                            fishName={fishName}
                            searchDate={searchDate}
                            setFishName={setFishName}
                            setSearchDate={setSearchDate}
                            fetchData={() => { setCurrentPage(1); fetchData(); }}
                        />
                        <p>{message}</p>

                        <div className="table-wrapper">
                            {items.length > 0 && <FishPriceTable items={items} />}
                        </div>

                        {items.length > 0 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalCount={totalCount}
                                numOfRows={numOfRows}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                            />
                        )}

                        {loading && <p>로딩 중...</p>}
                    </div>
                </div>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default Main