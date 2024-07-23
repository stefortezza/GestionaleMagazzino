package Gestionale.Magazzino.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductDTO {
  private Long id;
  private String name;
  private String location;
  private int quantity;
  private int inputQuantity;
  private Long categoryId;

  // Costruttore
  public ProductDTO(Long id, String name, String location, int quantity, int inputQuantity, Long categoryId) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.quantity = quantity;
    this.inputQuantity = inputQuantity;
    this.categoryId = categoryId;
  }
}
