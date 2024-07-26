package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.UserDto;
import Gestionale.Magazzino.Entity.User;
import Gestionale.Magazzino.Exceptions.BadRequestException;
import Gestionale.Magazzino.Exceptions.UserNotFoundException;
import Gestionale.Magazzino.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping("/users")
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/users/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public User getUserById(@PathVariable int id) {
    Optional<User> userOptional = userService.getUserById(id);

    if (userOptional.isPresent()) {
      return userOptional.get();
    } else {
      throw new UserNotFoundException("Utente with id=" + id + " not found!");
    }
  }

  @PutMapping("/users/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public User updateUser(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      throw new BadRequestException(bindingResult.getAllErrors().stream()
        .map(error -> error.getDefaultMessage()).reduce("", (s, s2) -> s + s2));
    }
    return userService.updateUser(id, userDto);
  }

  @DeleteMapping("/users/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public String deleteUser(@PathVariable int id) {
    return userService.deleteUser(id);
  }
}

