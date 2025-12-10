package com.example.springboot.dto;

public class ProductDTO {

    private String ogImage;
    private String ogTitle;

    public ProductDTO() {
    }

    public ProductDTO(String ogImage, String ogTitle) {
        this.ogImage = ogImage;
        this.ogTitle = ogTitle;
    }

    public String getOgImage() {
        return ogImage;
    }

    public void setOgImage(String ogImage) {
        this.ogImage = ogImage;
    }

    public String getOgTitle() {
        return ogTitle;
    }

    public void setOgTitle(String ogTitle) {
        this.ogTitle = ogTitle;
    }
}
