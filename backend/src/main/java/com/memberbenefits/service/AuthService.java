package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.domain.entity.User;
import com.memberbenefits.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final MemberService memberService;
    
    @Transactional
    public User getOrCreateUserFromOidcUser(OidcUser oidcUser) {
        String authProvider = "google";
        String authSub = oidcUser.getSubject();
        String email = oidcUser.getEmail();
        
        log.debug("Processing OIDC user for authSub: {}, email: {}", authSub, email);
        
        return userRepository.findByAuthProviderAndAuthSub(authProvider, authSub)
            .orElseGet(() -> createNewUser(authProvider, authSub, email));
    }
    
    private User createNewUser(String authProvider, String authSub, String email) {
        log.info("Creating new user for authSub: {}, email: {}", authSub, email);
        
        User user = new User();
        user.setAuthProvider(authProvider);
        user.setAuthSub(authSub);
        user.setEmail(email);
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        
        return userRepository.save(user);
    }
    
    public Optional<User> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            log.debug("Authentication is null");
            return Optional.empty();
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof OidcUser) {
            OidcUser oidcUser = (OidcUser) principal;
            return Optional.of(getOrCreateUserFromOidcUser(oidcUser));
        } else if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            return Optional.of(getOrCreateUserFromOAuth2User(oauth2User));
        } else {
            log.debug("Authentication principal is neither OidcUser nor OAuth2User: {}", principal.getClass());
            return Optional.empty();
        }
    }

    @Transactional
    public User getOrCreateUserFromOAuth2User(OAuth2User oauth2User) {
        String authProvider = "google";
        String authSub = oauth2User.getName(); // This is the subject ID
        String email = oauth2User.getAttribute("email");
        
        log.debug("Processing OAuth2 user for authSub: {}, email: {}", authSub, email);
        
        return userRepository.findByAuthProviderAndAuthSub(authProvider, authSub)
            .orElseGet(() -> createNewUser(authProvider, authSub, email));
    }
    
    public Optional<Member> getCurrentMember(Authentication authentication) {
        Optional<User> user = getCurrentUser(authentication);
        return user.map(memberService::getOrCreateMemberForUser);
    }
}

