package Gestionale.Magazzino.Dto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CategoryDTO {
  private Long id;
  private String name;
  private Long macchinarioId;
  private List<ProductDTO> products;

  // Costruttore per la query
  public CategoryDTO(Long id, String name, Long macchinarioId) {
    this.id = id;
    this.name = name;
    this.macchinarioId = macchinarioId;
  }
}
