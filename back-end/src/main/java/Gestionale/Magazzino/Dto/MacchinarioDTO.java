package Gestionale.Magazzino.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class MacchinarioDTO {
  private Long id;
  private String name;
  private List<Long> categoryIds; // IDs of categories
  private List<Long> productIds; // IDs of products

  // Costruttore
  public MacchinarioDTO(Long id, String name, List<Long> categoryIds, List<Long> productIds) {
    this.id = id;
    this.name = name;
    this.categoryIds = categoryIds;
    this.productIds = productIds;
  }

  // Getters e setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public List<Long> getCategoryIds() { return categoryIds; }
  public void setCategoryIds(List<Long> categoryIds) { this.categoryIds = categoryIds; }

  public List<Long> getProductIds() { return productIds; }
  public void setProductIds(List<Long> productIds) { this.productIds = productIds; }
}
