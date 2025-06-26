import React from 'react';

const FishPriceTable = ({ items }) => {
    return (
        <table className="priceTable">
            <thead>
                <tr>
                    <th>위판장</th>
                    <th>원산지</th>
                    <th>상태</th>
                    <th>규격</th>
                    <th>중량(kg)</th>
                    <th>단가(원)</th>
                    <th>총 금액(원)</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, idx) => (
                    <tr key={idx}>
                        <td>{item.querySelector('mxtrNm')?.textContent || ''} - {item.querySelector('csmtmktNm')?.textContent || ''}</td>
                        <td>{item.querySelector('orgplceSeNm')?.textContent || ''}</td>
                        <td>{item.querySelector('kdfshSttusNm')?.textContent || ''}</td>
                        <td>{item.querySelector('goodsStndrdNm')?.textContent || ''}</td>
                        <td>{parseFloat(item.querySelector('csmtWt')?.textContent || 0).toLocaleString()}</td>
                        <td>{parseInt(item.querySelector('csmtUntpc')?.textContent || 0).toLocaleString()}</td>
                        <td>{parseInt(item.querySelector('csmtAmount')?.textContent || 0).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FishPriceTable;