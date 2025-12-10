import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoPlusCircle } from "react-icons/go";
import './ProductAll.css'; // CSS 따로 분리해도 좋음


function ProductAll() {
  const [ogImage, setogImage] = useState(null);
  const [ogTitle, setogTitle] = useState(null);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]); // 여기 추가
  const [text, setText] = useState('');



  const originalUrl = 'https://kamien.kr/product/247-nylon-bermuda-pants-light-beige/81/category/44/display/1/';
  const onAdd = () => {
    if (!input.trim()) return;
    setProducts(prev => [...prev, input.trim()]);
    setInput('');
  };

  useEffect(() => {
    const fetchOgImageAndUpload = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/preview?url=${encodeURIComponent(originalUrl)}`);
        setogImage(res.data.ogImage);

      } catch (error) {
        console.error('[X] 이미지 처리 오류:', error);
      }
    };

    fetchOgImageAndUpload();

    const fetchOgTitleAndUpload = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/preview?url=${encodeURIComponent(originalUrl)}`);
        setogTitle(res.data.ogTitle);

      } catch (error) {
        console.error('[X] 텍스트 처리 오류:', error);
      }
    };

    fetchOgTitleAndUpload();
  }, []);

  return (
    <div>
      {ogImage ? (
        <a href={originalUrl} target="_blank" rel="noopener noreferrer">
          <img src={ogImage} alt="썸네일" width="400px" />
        </a>
      ) : (
        <p>썸네일을 불러오는 중...</p>
      )}
      {ogTitle ? (
        <h2>{ogTitle}</h2>
      ) : (
        <p>제목을 불러오는 중...</p>
      )}
      <button
        onClick={onAdd}
        className='fixed-button'
        aria-label="추가"
      >
        <GoPlusCircle size={40} color="black" />
      </button>

    </div>
  );
}

export default ProductAll;

{/* <div style={{ padding: 20 }}>
  <h1>전체 상품 목록</h1>
  <textarea
    placeholder=""
    value={text}
    onChange={e => setText(e.target.value)}
    rows={20}
    style={{ width: '100%', height: '100vh', fontSize: 18, padding: 10, boder: 'none', outline: 'none', boxSizing: '' }}
  />
</div> */}