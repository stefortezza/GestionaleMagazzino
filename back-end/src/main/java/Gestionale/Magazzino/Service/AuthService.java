package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.UserLoginDto;
import Gestionale.Magazzino.Entity.User;
import Gestionale.Magazzino.Exceptions.UnauthorizedException;
import Gestionale.Magazzino.Security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  @Autowired
  private UserService userService;

  @Autowired
  private JwtTool jwtTool;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public String authenticateUserAndCreateToken(UserLoginDto userLoginDto) {
    User user = userService.getUserByEmail(userLoginDto.getEmail());

    if (passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
      return jwtTool.createToken(user);
    } else {
      throw new UnauthorizedException("Error in authorization, relogin!");
    }
  }
}
