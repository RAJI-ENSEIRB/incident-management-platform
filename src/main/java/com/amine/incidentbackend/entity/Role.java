package com.amine.incidentbackend.entity;

import com.amine.incidentbackend.enums.RoleName;
import jakarta.persisttence.*;



@entity
@Table(name="roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;
    
    @Enumerated(EnumType.STRING) ;
    @Column(nullable = false , unique = true);
    private RoleName name;


    public Role() {
    }

    public Role(RoleName name){
        this.name = name;
    }

    public Long getId(){
        return id;
    }

    public RoleName getname(){
        return name;
    }

    public setname(){
        this.name=name;
    }


}