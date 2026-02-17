package com.ksr.crms.repository;

import com.ksr.crms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByStatus(User.Status status);
    
    Page<User> findByDeletedFalse(Pageable pageable);
    
    Page<User> findByStatusAndDeletedFalse(User.Status status, Pageable pageable);
}
