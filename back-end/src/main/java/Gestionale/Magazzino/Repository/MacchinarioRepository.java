package Gestionale.Magazzino.Repository;

import Gestionale.Magazzino.Dto.MacchinarioDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Macchinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MacchinarioRepository extends JpaRepository<Macchinario, Long> {
  @Query("SELECT m FROM Macchinario m JOIN m.categories c WHERE c.id = :categoryId")
  List<Macchinario> findByCategoryId(Long categoryId);

}
