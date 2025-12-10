package com.example.springboot.controller;

import com.example.springboot.dto.ProductDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

// Node에서:
// app.get('/api/preview', async (req, res) => { ... })
@RestController
@RequestMapping("/api")
public class PreviewController {

    @GetMapping("/preview")
    public ResponseEntity<?> getPreview(@RequestParam(required = false) String url) {
        // url 없으면 400
        if (url == null || url.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"url query parameter is required\"}");
        }

        try {
            // Node의 axios.get(url) 대신 Jsoup 사용
            Document doc = Jsoup
                    .connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(5000)
                    .get();

            String ogImage = null;
            String ogTitle = null;

            // <meta property="og:image" content="...">
            Element ogImageTag = doc.selectFirst("meta[property=og:image]");
            if (ogImageTag != null) {
                ogImage = ogImageTag.attr("content");
            }

            // <meta property="og:title" content="...">
            Element ogTitleTag = doc.selectFirst("meta[property=og:title]");
            if (ogTitleTag != null) {
                ogTitle = ogTitleTag.attr("content");
            }

            // Node의 res.json({ ogImage, ogTitle })에 해당
            ProductDTO response = new ProductDTO(ogImage, ogTitle);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Failed to fetch URL\"}");
        }
    }
}
