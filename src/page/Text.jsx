import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Text() {
  const [ogImage, setOgImage] = useState(null);
  const testUrl = 'https://emostanceclub-world.com/16/?idx=68';

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/preview?url=${encodeURIComponent(testUrl)}`);
        setOgImage(res.data.ogImage);
      } catch (err) {
        console.error('Preview fetch error:', err);
      }
    };

    fetchPreview();
  }, []);

  return (
    <div>
      {ogImage ? <img src={ogImage} alt="og:image preview" width="300" /> : <p>로딩중...</p>}
    </div>
  );
}

export default Text;
