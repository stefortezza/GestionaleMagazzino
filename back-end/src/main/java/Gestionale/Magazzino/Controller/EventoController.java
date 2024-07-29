package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Entity.Evento;
import Gestionale.Magazzino.Repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class EventoController {

  @Autowired
  private EventoRepository eventoRepository;

  @GetMapping("/eventi")
  public List<Evento> getEventi() {
    return eventoRepository.findAll();
  }

  @PostMapping("/eventi")
  public ResponseEntity<Evento> addEvento(@RequestBody Evento evento) {
    Evento nuovoEvento = eventoRepository.save(evento);
    return new ResponseEntity<>(nuovoEvento, HttpStatus.CREATED);
  }

  @PutMapping("/eventi/{id}")
  public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento evento) {
    if (!eventoRepository.existsById(id)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    evento.setId(id); // Assicurati che il metodo setId esista nella tua entità Evento
    Evento eventoAggiornato = eventoRepository.save(evento);
    return new ResponseEntity<>(eventoAggiornato, HttpStatus.OK);
  }

  @DeleteMapping("/eventi/{id}")
  public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
    if (!eventoRepository.existsById(id)) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    eventoRepository.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
