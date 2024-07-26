package Gestionale.Magazzino.Security;

import Gestionale.Magazzino.Entity.User;
import Gestionale.Magazzino.Exceptions.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class JwtTool {

  @Value("${jwt.secret}")
  private String secret;

//  @Value("${jwt.duration}")
//  private long duration;

  //crea il token impostando data di inizio, data di fine, id dell'utente e firma del token attraverso
  //la chiave
  public String createToken(User user) {
    return Jwts.builder()
      .issuedAt(new Date(System.currentTimeMillis())) //INIZIO
      .subject(String.valueOf(user.getUserId()))
      .claim("roles", List.of(user.getRole().name())) // Aggiungi il ruolo
      .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
      .compact();
  }

  //effettuta la verifica del token ricevuto. Verifica la veridicita` del token e la sua scadenza
  public void verifyToken(String token) {
    try {
      Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
        .build().parse(token);
    } catch (Exception e) {
      throw new UnauthorizedException("Error in authorization, relogin!");
    }
  }

  public int getIdFromToken(String token) {
    return Integer.parseInt(Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
      .build().parseSignedClaims(token).getPayload().getSubject());
  }

  public List<String> getRolesFromToken(String token) {
    Claims claims = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
      .build().parseSignedClaims(token).getPayload();
    return claims.get("roles", List.class);
  }
}
