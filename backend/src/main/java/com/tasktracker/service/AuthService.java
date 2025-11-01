package com.tasktracker.service;

import com.tasktracker.dto.*;
import com.tasktracker.entity.RefreshToken;
import com.tasktracker.entity.User;
import com.tasktracker.exception.ResourceNotFoundException;
import com.tasktracker.exception.UnauthorizedException;
import com.tasktracker.repository.RefreshTokenRepository;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenExpiration;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = createRefreshToken(user);

        return new LoginResponse(accessToken, refreshToken, user.getId(), user.getUsername(), user.getEmail());
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = createRefreshToken(user);

        return new LoginResponse(accessToken, refreshToken, user.getId(), user.getUsername(), user.getEmail());
    }

    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token expired");
        }

        User user = refreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtTokenProvider.generateToken(userDetails);

        return new LoginResponse(accessToken, refreshToken.getToken(), user.getId(), user.getUsername(), user.getEmail());
    }

    @Transactional
    public void logout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        refreshTokenRepository.deleteByUserId(user.getId());
    }

    private String createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        // Convert milliseconds to seconds (LocalDateTime.plusSeconds expects long)
        refreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000));

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }
}