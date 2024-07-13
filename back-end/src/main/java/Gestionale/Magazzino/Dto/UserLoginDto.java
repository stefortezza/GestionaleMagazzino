package Gestionale.Magazzino.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDto {
  @NotBlank(message = "L'email non puo` essere vuota o mancante o composta da soli spazi!")
  @Email
    private String email;
  @NotBlank(message = "La password non puo` essere vuota o mancante o composta da soli spazi!")
  private String password;
}
