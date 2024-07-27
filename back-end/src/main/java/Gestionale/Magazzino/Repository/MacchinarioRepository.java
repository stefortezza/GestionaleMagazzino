package Gestionale.Magazzino.Repository;

import Gestionale.Magazzino.Entity.Macchinario;
import Gestionale.Magazzino.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MacchinarioRepository extends JpaRepository<Macchinario, Long> {
  boolean existsByName(String name);
}
