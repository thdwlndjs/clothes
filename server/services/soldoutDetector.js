const cheerio = require('cheerio');

function isSoldOut(html) {     
    const $ = cheerio.load(html);
    $('script').remove();
  
        // 1. alt 속성에 '품절' 포함된 이미지 등
        if ($('img[alt*="품절"], area[alt*="품절"], input[alt*="품절"]').length > 0) return true;
  
        // 2. 클래스명에 soldout, 품절 등 포함된 요소 중 title 또는 텍스트에 '품절' 포함 여부
        const soldoutElems = $('[class*="soldout"], [class*="sold-out"], [class*="outofstock"], [class*="no-stock"], [class*="품절"], [class*="재고없음"]');
        for (const el of soldoutElems.toArray()) {
          const $el = $(el);
          const title = $el.attr('title') || '';
          const text = $el.text();
          if (title.includes('품절') || text.includes('품절')) return true;
        }
  
        // 3. option 태그 텍스트에 '품절' 포함 여부
        if ($('option').filter((i, el) => $(el).text().includes('품절')).length > 0) return true;
  
        // 4. a, div, button, span, li, label, strong 등 텍스트에 '품절' 포함 여부
        if ($('a, div, button, span, li, label, strong').filter((i, el) => $(el).text().includes('품절')).length > 0) return true;
  
        // '재입고 알림'이라는 텍스트가 alt 속성에 포함된 이미지가 있으면 품절로 판단
        if ($('img[alt*="재입고 알림"]').length > 0) return true;
  
        // 또는 페이지 내 텍스트 중에 '재입고 알림'이 포함된 것도 체크 가능
        if ($('*').filter((i, el) => $(el).text().includes('재입고 알림')).length > 0) return true;
        
        return false;
      }
    
      module.exports = { isSoldOut };
   