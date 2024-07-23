package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Entity.EmailRequest;
import Gestionale.Magazzino.Service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class EmailController {

  @Autowired
  private EmailService emailService;

  @PostMapping("/sendEmail")
  public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
    try {
      emailService.sendEmail("stefano.fortezza98@hotmail.it", request.getSubject(), request.getBody());
      return ResponseEntity.ok("Email inviata con successo!");
    } catch (MessagingException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante l'invio dell'email: " + e.getMessage());
    }
  }
}
