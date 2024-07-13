package Gestionale.Magazzino.Dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.List;

@Data
public class MacchinarioDTO {
  @Id
  @GeneratedValue
  private Long id;
  private String name;
  private List<CategoryDTO> categories;
}
