package com.example.springboot.service;

import com.example.springboot.entity.User;
import com.example.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 회원가입
    public boolean signin(String email, String password) {

        if (userRepository.findByEmail(email) != null) {
            return false; // 중복
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);
        return true;
    }

    // 로그인
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email);
        if (user == null) return null;

        // 비밀번호 비교
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        // JWT로 변경 가능 — 지금은 임시 토큰
        return "FAKE-TOKEN-" + email;
    }
}
