package Gestionale.Magazzino.Repository;

import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  @Query("SELECT new Gestionale.Magazzino.Dto.ProductDTO(p.id, p.name, p.location, p.quantity, p.inputQuantity, p.category.id) FROM Product p WHERE p.category.id = :categoryId")
  List<ProductDTO> findByCategoryId(Long categoryId);

  List<Product> findByName(String name);
}
