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
                    .signWith(key)
                    .claim("roles",userdetails)
    }
    public String extractUsername(String token){
        return extractAllClaims(token).getSubject()
    }

    public boolean isTokenValid(String token){
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);

    }

    public boolean isTokenExpired(String token){
        return extractAllClaims(token)getExpiration().before(new Date());
    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}