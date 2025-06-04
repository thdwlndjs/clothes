import React, { useState } from 'react';
import axios from 'axios';
import { GoPlusCircle } from "react-icons/go";
import './Main.css';

function main() {
  const [products, setProducts] = useState([]); // 배열로 선언
  const [modalOpen, setModalOpen] = useState(false);
  const [link, setLink] = useState('');

  const fetchOgData = async (url) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/preview?url=${encodeURIComponent(url)}`);
      return { link: url, ogImage: res.data.ogImage, ogTitle: res.data.ogTitle };
    } catch (error) {
      console.error('[X] Open Graph 데이터 가져오기 오류:', error);
      return { link: url, ogImage: null, ogTitle: "데이터를 불러올 수 없습니다." };
    }
  };

  const onAdd = async () => {
    if (!link.trim()) return;

    const newProduct = await fetchOgData(link);
    setProducts(prev => [...prev, newProduct]); // 배열에 추가
    setModalOpen(false);
    setLink('');
  };

  return (
    <div>
      <ul>
        {products.map((product, index) => (
          <li style={{ listStyle: "none" }} key={index}>
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              <img src={product.ogImage} alt="썸네일" width="400px" />
            </a>
            <h2>{product.ogTitle}</h2>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed-button"
        aria-label="추가"
      >
        <GoPlusCircle size={40} color="black" />
      </button>

      {modalOpen && (
        <div className="modal">
          <div className="modal-header">
            <h2>상품 등록</h2>
            <button className="close-btn" onClick={() => setModalOpen(false)}>x</button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="상품 링크를 입력하세요"
            />
            <button className="add-button" onClick={onAdd}>추가</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default main;