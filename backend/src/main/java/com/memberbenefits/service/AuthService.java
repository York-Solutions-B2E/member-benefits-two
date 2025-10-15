package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.domain.entity.User;
import com.memberbenefits.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    
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
        if (authentication == null || !(authentication.getPrincipal() instanceof OidcUser)) {
            log.debug("Authentication is null or not OidcUser: {}", authentication);
            return Optional.empty();
        }
        
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        return Optional.of(getOrCreateUserFromOidcUser(oidcUser));
    }

    @Autowired
    private MemberService memberService;
    
    public Optional<Member> getCurrentMember(Authentication authentication) {
        Optional<User> user = getCurrentUser(authentication);
        return user.map(memberService::getOrCreateMemberForUser);
    }
}

