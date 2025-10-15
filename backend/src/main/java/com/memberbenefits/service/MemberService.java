package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.domain.entity.User;
import com.memberbenefits.domain.embeddable.Address;
import com.memberbenefits.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    
    private final MemberRepository memberRepository;
    
    @Transactional
    public Member getOrCreateMemberForUser(User user) {
        return memberRepository.findByUserId(user.getId())
            .orElseGet(() -> createNewMemberForUser(user));
    }
    
    private Member createNewMemberForUser(User user) {
        log.info("Creating new member for user: {}", user.getEmail());
        
        Member member = new Member();
        member.setUserId(user.getId());
        member.setFirstName("John"); // Default values - in real app, get from OIDC or form
        member.setLastName("Smith");
        member.setEmail(user.getEmail());
        member.setDateOfBirth(LocalDate.of(1985, 6, 15)); // Default DOB
        member.setPhone("555-123-4567");
        
        // Set default address
        Address address = new Address();
        address.setLine1("123 Main Street");
        address.setCity("Anytown");
        address.setState("CA");
        address.setPostalCode("12345");
        member.setMailingAddress(address);
        
        member.setCreatedAt(OffsetDateTime.now());
        member.setUpdatedAt(OffsetDateTime.now());
        
        return memberRepository.save(member);
    }
    
    public Optional<Member> getMemberByUserId(UUID userId) {
        return memberRepository.findByUserId(userId);
    }
}