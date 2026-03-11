package com.amine.incidentbackend.seed;

import com.amine.incidentbackend.entity.Role;
import com.amine.incidentbackend.entity.User;
import com.amine.incidentbackend.enums.RoleName;
import com.amine.incidentbackend.repository.RoleRepository;
import com.amine.incidentbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        createRoleIfNotExists(RoleName.USER);
        createRoleIfNotExists(RoleName.TECHNICIAN);
        createRoleIfNotExists(RoleName.MANAGER);
        createRoleIfNotExists(RoleName.ADMIN);

        if (!userRepository.existsByEmail("admin@incident.local")) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setEmail("admin@incident.local");
            admin.setPassword("admin123");
            admin.setActive(true);
            admin.setRole(adminRole);

            userRepository.save(admin);
            System.out.println("Admin user created: admin@incident.local / admin123");
        }
    }

    private void createRoleIfNotExists(RoleName roleName) {
        if (!roleRepository.existsByName(roleName)) {
            roleRepository.save(new Role(roleName));
            System.out.println("Role created: " + roleName);
        }
    }
}