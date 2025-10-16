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
        // First try to find by user ID
        Optional<Member> existingByUserId = memberRepository.findByUserId(user.getId());
        if (existingByUserId.isPresent()) {
            return existingByUserId.get();
        }
        
        // If not found by user ID, try to find by email (for seeded data)
        Optional<Member> existingByEmail = memberRepository.findByEmail(user.getEmail());
        if (existingByEmail.isPresent()) {
            Member member = existingByEmail.get();
            // Update the member to link it to the current user
            member.setUserId(user.getId());
            member.setUpdatedAt(OffsetDateTime.now());
            return memberRepository.save(member);
        }
        
        // If no existing member found, create a new one
        return createNewMemberForUser(user);
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