import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { GoPlusCircle, GoDash } from 'react-icons/go';
import { AiOutlineClose } from 'react-icons/ai';
import he from 'he';

import './Main.css';

function Main() {
  const [products, setProducts] = useState([]);
  const [link, setLink] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // 🔄 Firestore 데이터 로드
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(
          collection(db, 'users', user.uid, 'products'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔎 Open Graph 데이터 가져오기
  const fetchOgData = async (url) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/preview?url=${encodeURIComponent(url)}`);
      return {
        link: url,
        ogImage: res.data.ogImage || '/fallback.png', // fallback image
        ogTitle: res.data.ogTitle || '제목 없음'
      };
    } catch (error) {
      console.error('[X] OG 데이터 오류:', error);
      return {
        link: url,
        ogImage: '/fallback.png',
        ogTitle: '데이터를 불러올 수 없습니다.'
      };
    }
  };

  // ➕ 상품 추가
  const onAdd = async () => {
    if (!link.trim()) return;
    const userId = auth.currentUser?.uid;
    if (!userId) return alert('로그인이 필요합니다.');

    const ogData = await fetchOgData(link);

    try {
      const docRef = await addDoc(
        collection(db, 'users', userId, 'products'),
        {
          ...ogData,
          createdAt: serverTimestamp()
        }
      );

      setProducts(prev => [{ id: docRef.id, ...ogData }, ...prev]);
      setLink('');
      setModalOpen(false);
    } catch (e) {
      console.error('[X] Firestore 저장 오류:', e);
      alert('상품 추가에 실패했습니다.');
    }
  };

  // ❌ 상품 삭제
  const handleDelete = async (id) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return alert('로그인이 필요합니다.');

    try {
      await deleteDoc(doc(db, 'users', userId, 'products', id));
      setProducts(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error('[X] 삭제 실패:', e);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <ul>
        {products.map(product => (
          <li className="product-item" key={product.id}>
            <button className="p-close-btn" onClick={() => {
              if (window.confirm('삭제하시겠습니까?')) {
                handleDelete(product.id);
              }
            }}>
              <GoDash size={20} />
            </button>
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              <img src={product.ogImage} alt="썸네일" width="550px" />
            </a>
            <h2 className="product-title">{he.decode(product.ogTitle)}</h2>
          </li>
        ))}
      </ul>

      {/* ➕ 모달 열기 버튼 */}
      <button
        onClick={() => {
          setModalOpen(true);
          setLink('');
        }}
        className="fixed-button"
        aria-label="추가"
      >
        <GoPlusCircle size={40} color="black" />
      </button>

      {/* 🪟 모달 */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-header">
            <h2>상품 등록</h2>
            <button className="close-btn" onClick={() => {
              setModalOpen(false);
              setLink('');
            }}>
              <AiOutlineClose size={20} />
            </button>
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

export default Main;
