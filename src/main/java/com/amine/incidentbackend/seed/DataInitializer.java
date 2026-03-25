package com.amine.incidentbackend.seed;

import com.amine.incidentbackend.entity.Category;
import com.amine.incidentbackend.entity.Role;
import com.amine.incidentbackend.entity.User;
import com.amine.incidentbackend.enums.RoleName;
import com.amine.incidentbackend.repository.CategoryRepository;
import com.amine.incidentbackend.repository.RoleRepository;
import com.amine.incidentbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createRoleIfNotExists(RoleName.USER);
        createRoleIfNotExists(RoleName.TECHNICIAN);
        createRoleIfNotExists(RoleName.MANAGER);
        createRoleIfNotExists(RoleName.ADMIN);

        createCategoryIfNotExists("Network", "Network incidents");
        createCategoryIfNotExists("System", "System incidents");
        createCategoryIfNotExists("Application", "Application incidents");
        createCategoryIfNotExists("Hardware", "Hardware incidents");

        if (!userRepository.existsByEmail("admin@incident.local")) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setEmail("admin@incident.local");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setActive(true);
            admin.setRole(adminRole);

            userRepository.save(admin);
            System.out.println("Admin user created: admin@incident.local / admin123");
        }

        if (!userRepository.existsByEmail("tech@incident.local")) {
            Role technicianRole = roleRepository.findByName(RoleName.TECHNICIAN)
                    .orElseThrow(() -> new RuntimeException("TECHNICIAN role not found"));

            User technician = new User();
            technician.setFirstName("Tech");
            technician.setLastName("Support");
            technician.setEmail("tech@incident.local");
            technician.setPassword(passwordEncoder.encode("tech123"));
            technician.setActive(true);
            technician.setRole(technicianRole);

            userRepository.save(technician);
            System.out.println("Technician user created: tech@incident.local / tech123");
        }
    }

    private void createRoleIfNotExists(RoleName roleName) {
        if (!roleRepository.existsByName(roleName)) {
            roleRepository.save(new Role(roleName));
            System.out.println("Role created: " + roleName);
        }
    }

    private void createCategoryIfNotExists(String name, String description) {
        if (!categoryRepository.existsByName(name)) {
            categoryRepository.save(new Category(name, description));
            System.out.println("Category created: " + name);
        }
    }
}