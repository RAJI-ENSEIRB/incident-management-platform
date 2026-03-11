package com.amine.incidentbackend.controller;

import com.amine.incidentbackend.repository.RoleRepository;
import com.amine.incidentbackend.entity.Role;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RoleController{
    private final RoleRepository roleRepository;
    public RoleController(RoleRepository roleRepository){
        this.roleRepository=roleRepository;
    }

    @GetMapping("/api/roles")
    public List<Role> getAllRoles(){
        return roleRepository.findAll();
    }

}