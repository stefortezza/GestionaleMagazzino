package Gestionale.Magazzino.Repository;

import Gestionale.Magazzino.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  @Query("SELECT p FROM Product p WHERE p.category.id IN :categoryIds")
  List<Product> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds);
  Product findByName(String name);
}
