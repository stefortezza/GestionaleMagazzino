package Gestionale.Magazzino.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryDTO {
  private Long id;
  private String name;

  // Costruttore
  public CategoryDTO(Long id, String name) {
    this.id = id;
    this.name = name;
  }
}
