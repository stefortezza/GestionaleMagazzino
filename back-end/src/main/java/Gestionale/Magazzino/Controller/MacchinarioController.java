package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Dto.MacchinarioDTO;
import Gestionale.Magazzino.Entity.Macchinario;
import Gestionale.Magazzino.Repository.MacchinarioRepository;
import Gestionale.Magazzino.Service.MacchinarioService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/macchinario")
public class MacchinarioController {

  @Autowired
  private MacchinarioService macchinarioService;

  @GetMapping
  public List<MacchinarioDTO> getAllMacchinarios() {
    return macchinarioService.getAllMacchinarios();
  }

  @GetMapping("/{id}")
  public MacchinarioDTO getMacchinarioById(@PathVariable Long id) {
    return macchinarioService.getMacchinarioById(id);
  }

  @PostMapping
  public MacchinarioDTO createMacchinario(@RequestBody MacchinarioDTO macchinarioDTO) {
    return macchinarioService.createMacchinario(macchinarioDTO);
  }

  @PutMapping("/{id}")
  public MacchinarioDTO updateMacchinario(@PathVariable Long id, @RequestBody MacchinarioDTO macchinarioDTO) {
    return macchinarioService.updateMacchinario(id, macchinarioDTO);
  }

  @DeleteMapping("/{id}")
  public void deleteMacchinario(@PathVariable Long id) {
    macchinarioService.deleteMacchinario(id);
  }
}

