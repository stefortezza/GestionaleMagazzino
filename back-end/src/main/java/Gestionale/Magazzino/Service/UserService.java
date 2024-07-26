package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.UserDto;
import Gestionale.Magazzino.Entity.User;
import Gestionale.Magazzino.Exceptions.UserNotFoundException;
import Gestionale.Magazzino.Repository.UserRepository;
import Gestionale.Magazzino.enums.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JavaMailSender javaMailSender;

  public User saveUser(UserDto userDto) {
    Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());
    if (existingUser.isPresent()) {
      throw new IllegalArgumentException("Email già registrata!");
    }
    User user = new User();
    user.setUsername(userDto.getUsername());
    user.setEmail(userDto.getEmail());
    user.setPassword(passwordEncoder.encode(userDto.getPassword()));
    user.setName(userDto.getName());
    user.setSurname(userDto.getSurname());
    user.setRole(Roles.valueOf(userDto.getRole().toUpperCase()));

    sendRegistrationMail(user);
    userRepository.save(user);
    return user;
  }
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserById(int id) {
    return userRepository.findById(id);
  }

  public User getUserByEmail(String email) {
    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isPresent()) {
      return userOptional.get();
    } else {
      throw new UserNotFoundException("Utente con email=" + email + " non trovato!");
    }
  }

  public User updateUser(int id, UserDto userDto) {
    Optional<User> userOptional = getUserById(id);
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      user.setName(userDto.getName());
      user.setSurname(userDto.getSurname());
      user.setEmail(userDto.getEmail());
      user.setPassword(passwordEncoder.encode(userDto.getPassword()));
      user.setRole(Roles.valueOf(userDto.getRole().toUpperCase()));

      return userRepository.save(user);
    } else {
      throw new UserNotFoundException("Utente con id=" + id + " non trovato!");
    }
  }

  public String deleteUser(int id) {
    Optional<User> userOptional = getUserById(id);
    if (userOptional.isPresent()) {
      userRepository.deleteById(id);
      return "Utente con id=" + id + " correttamente eliminato!";
    } else {
      throw new UserNotFoundException("Utente con id=" + id + " non trovato!");
    }
  }

  private void sendRegistrationMail(User user) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(user.getEmail());
    message.setSubject("Conferma Registrazione");
    message.setText("Gentile " + user.getName() + ",\n\n"
      + "Benvenuto nella nostra applicazione! La tua registrazione è avvenuta con successo.");

    javaMailSender.send(message);
  }
}
