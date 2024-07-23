package Gestionale.Magazzino.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @OneToMany(mappedBy = "categories")
  private Set<Macchinario> macchinarios;

  @OneToMany(mappedBy = "category")
  private Set<Product> products = new HashSet<>();

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public Set<Macchinario> getMacchinarios() { return macchinarios; }
  public void setMacchinarios(Set<Macchinario> macchinarios) { this.macchinarios = macchinarios; }

  public Set<Product> getProducts() { return products; }
  public void setProducts(Set<Product> products) { this.products = products; }
}

