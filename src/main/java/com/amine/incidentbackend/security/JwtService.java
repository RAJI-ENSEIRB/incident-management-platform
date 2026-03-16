package com.amine.incidentbackend.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;


@service
public class JwtService{

    @value("${app.jwt.secret}")
    private String jwtSecret;

    @value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey key;

    @PostConstruct
    public void init(){
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.key = keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime + jwtExpirationMs);

        return Jwts.builder()
                    .subject(userDetails.getUsername())
                    .issuedAt(now)
                    .expiration(expiryDate)
                    .claim("roles",userdetails)
    }
    public

}