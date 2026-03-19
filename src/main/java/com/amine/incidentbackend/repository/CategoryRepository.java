package com.amine.incidentbackend.repository;

import com.amine.incidentbackend.entity;
import org.springframework.jpa.repository.JpaRepository;

import java.util.Optional;

public CategoryRepository extends JpaRepository<Category,Long>{
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
}