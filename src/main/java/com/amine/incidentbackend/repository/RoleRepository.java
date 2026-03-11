package com.amine.incidentbackend.repository;

import com.amine.incidentbackend.entity.Role;
import com.amine.incidentbackend.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(RoleName name);
    Boolean existsByName(RoleName name );

}

