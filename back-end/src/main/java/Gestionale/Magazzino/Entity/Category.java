package Gestionale.Magazzino.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @ManyToOne
  @JoinColumn(name = "macchinario_id")
  private Macchinario macchinario;

  @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
  private List<Product> products = new ArrayList<>();

}
