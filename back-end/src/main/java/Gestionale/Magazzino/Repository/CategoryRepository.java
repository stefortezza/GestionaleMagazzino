package Gestionale.Magazzino.Repository;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  @Query("SELECT new Gestionale.Magazzino.Dto.CategoryDTO(c.id, c.name, c.macchinario.id) FROM Category c WHERE c.macchinario.id = :macchinarioId")
  List<CategoryDTO> findByMacchinarioId(Long macchinarioId);
}


