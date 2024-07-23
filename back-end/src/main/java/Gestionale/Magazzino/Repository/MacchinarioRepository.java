package Gestionale.Magazzino.Repository;

import Gestionale.Magazzino.Entity.Macchinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MacchinarioRepository extends JpaRepository<Macchinario, Long> {
}
