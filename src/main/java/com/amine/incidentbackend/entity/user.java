package com.amine.incidentbackend.entity;

import jakarta.persisttence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class user {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String firstName;

    @Column(nullable=false)
    private String lastName;

    @Column(nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(nullable=false)
    private Boolean active = true;

    @Column(nullable= false)
    private LocalDateTime createdAt;

    @ManyToOne(optional=true)
    @Joincolumn(name="role_id",nullable=false)
    private Role role ;

    public user{

    }

    public user(String firstName, String lastName, String email, String password, Boolean active, Role role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.active = active;
        this.role = role;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.active == null) {
            this.active = true;
        }
    }

    public Long getId(){
        return id;
    }

    public String getFirstName(){
        return firstName;
    }

    public void setFirstName(String firstName){
        this firstName=firstName;
    } 

    public String getLastName(){
        return lastName;
    }

    public void setLastName(String lastName){
        this lastName=lastName;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this email=email;
    }

    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}