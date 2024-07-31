package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.UserDto;
import Gestionale.Magazzino.Entity.User;
import Gestionale.Magazzino.Exceptions.BadRequestException;
import Gestionale.Magazzino.Exceptions.UserNotFoundException;
import Gestionale.Magazzino.Service.UserService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

  @Autowired
  private UserService userService;

  @Autowired
  private JavaMailSender mailSender;

  private final Cloudinary cloudinary;

  @Autowired
  public UserController(Cloudinary cloudinary) {
    this.cloudinary = cloudinary;
  }

  @GetMapping("/users")
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  @PostMapping("/users/{id}/upload")
  public ResponseEntity<String> uploadFilesAndSendEmail(@PathVariable int id, @RequestParam("files") MultipartFile[] files) {
    Optional<User> userOptional = userService.getUserById(id);

    if (!userOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"Utente con id=" + id + " non trovato!\"}");
    }

    User user = userOptional.get();
    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

      helper.setTo(user.getEmail());
      helper.setSubject("I tuoi file PDF");
      helper.setText("Ecco i tuoi file PDF allegati.");

      // Aggiungi tutti i file come allegati
      for (MultipartFile file : files) {
        helper.addAttachment(file.getOriginalFilename(), new ByteArrayDataSource(file.getBytes(), file.getContentType()));
      }

      mailSender.send(mimeMessage);
      return ResponseEntity.ok("{\"message\": \"Email inviata con successo!\"}");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Errore durante il caricamento dei file e l'invio dell'email: " + e.getMessage() + "\"}");
    }
  }



  private void sendEmailWithAttachment(String to, String subject, String body, byte[] fileBytes, String fileName) {
    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(body);

      // Aggiungi l'allegato
      helper.addAttachment(fileName, new ByteArrayDataSource(fileBytes, "application/pdf"));

      mailSender.send(mimeMessage);
    } catch (Exception e) {
      throw new RuntimeException("Error sending email: " + e.getMessage());
    }
  }

  @GetMapping("/users/{id}")
  public User getUserById(@PathVariable int id) {
    Optional<User> userOptional = userService.getUserById(id);

    if (userOptional.isPresent()) {
      return userOptional.get();
    } else {
      throw new UserNotFoundException("Utente with id=" + id + " not found!");
    }
  }

  @PutMapping("/users/{id}")
  public User updateUser(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      throw new BadRequestException(bindingResult.getAllErrors().stream()
        .map(error -> error.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
    }
    return userService.updateUser(id, userDto);
  }

  @DeleteMapping("/users/{id}")
  public String deleteUser(@PathVariable int id) {
    return userService.deleteUser(id);
  }
}

