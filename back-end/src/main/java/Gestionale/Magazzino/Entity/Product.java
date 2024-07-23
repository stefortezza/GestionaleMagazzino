package Gestionale.Magazzino.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String location;
  private Integer quantity;
  private Integer inputQuantity;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;
}
