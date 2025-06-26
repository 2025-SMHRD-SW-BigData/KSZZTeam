import React from 'react';

const FishPriceControls = ({ fishName, searchDate, setFishName, setSearchDate, fetchData }) => {
    return (
        <div className="controls">
            <input
                type="text"
                placeholder="어종명을 입력하세요 (예: 넙치, 고등어, 갈치)"
                value={fishName}
                onChange={(e) => setFishName(e.target.value)}
            />
            <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
            />
            <button onClick={fetchData}>조회하기</button>
        </div>
    );
};

export default FishPriceControls;