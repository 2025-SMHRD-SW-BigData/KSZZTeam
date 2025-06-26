import React from 'react';

const PaginationControls = ({ currentPage, totalCount, numOfRows, handlePrevPage, handleNextPage }) => {
    const lastPage = Math.ceil(totalCount / numOfRows);

    return (
        <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>이전 페이지</button>
            <span>페이지: {currentPage} / {lastPage}</span>
            <button onClick={handleNextPage} disabled={currentPage >= lastPage}>다음 페이지</button>
        </div>
    );
};

export default PaginationControls;