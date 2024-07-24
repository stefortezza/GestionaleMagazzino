package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Dto.MacchinarioDTO;
import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Service.MacchinarioService;
import Gestionale.Magazzino.Service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MacchinarioController {

  private static final Logger logger = LoggerFactory.getLogger(MacchinarioController.class);

  @Autowired
  private MacchinarioService macchinarioService;

  @Autowired
  private ProductService productService;

  @GetMapping("/macchinario")
  public ResponseEntity<List<MacchinarioDTO>> getAllMacchinarios() {
    try {
      List<MacchinarioDTO> macchinarios = macchinarioService.getAllMacchinarios();
      return ResponseEntity.ok(macchinarios);
    } catch (Exception e) {
      logger.error("Error retrieving all macchinarios", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/macchinario/{id}")
  public ResponseEntity<MacchinarioDTO> getMacchinarioById(@PathVariable Long id) {
    try {
      MacchinarioDTO macchinario = macchinarioService.getMacchinarioById(id);
      return ResponseEntity.ok(macchinario);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      logger.error("Error retrieving macchinario with id " + id, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/macchinario")
  public ResponseEntity<MacchinarioDTO> createMacchinario(@RequestBody MacchinarioDTO macchinarioDTO) {
    try {
      MacchinarioDTO createdMacchinario = macchinarioService.createMacchinario(macchinarioDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdMacchinario);
    } catch (Exception e) {
      logger.error("Error creating macchinario", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/macchinario/{id}")
  public ResponseEntity<MacchinarioDTO> updateMacchinario(@PathVariable Long id, @RequestBody MacchinarioDTO macchinarioDTO) {
    try {
      MacchinarioDTO updatedMacchinario = macchinarioService.updateMacchinario(id, macchinarioDTO);
      return ResponseEntity.ok(updatedMacchinario);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      logger.error("Error updating macchinario with id " + id, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DeleteMapping("/macchinario/{id}")
  public ResponseEntity<Void> deleteMacchinario(@PathVariable Long id) {
    try {
      macchinarioService.deleteMacchinario(id);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      logger.error("Error deleting macchinario with id " + id, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/macchinario/{macchinarioId}/categories/{categoryId}/products")
  public ResponseEntity<List<ProductDTO>> getProductsByMacchinarioAndCategory(@PathVariable Long macchinarioId, @PathVariable Long categoryId) {
    try {
      List<ProductDTO> products = macchinarioService.getProductsByMacchinarioAndCategory(macchinarioId, categoryId);
      return ResponseEntity.ok(products);
    } catch (Exception e) {
      logger.error("Error retrieving products by category id " + categoryId, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/macchinario/{macchinarioId}/categories")
  public ResponseEntity<List<CategoryDTO>> getCategoriesByMacchinarioId(@PathVariable Long macchinarioId) {
    try {
      List<CategoryDTO> categories = macchinarioService.getCategoriesByMacchinarioId(macchinarioId);
      if (categories.isEmpty()) {
        return ResponseEntity.noContent().build(); // No content if list is empty
      }
      return ResponseEntity.ok(categories);
    } catch (Exception e) {
      logger.error("Error retrieving categories for macchinario with id " + macchinarioId, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/macchinario/{macchinarioId}/categories/{categoryId}/products/{productId}/update-quantity")
  public ResponseEntity<Void> updateProductQuantity(
    @PathVariable Long macchinarioId,
    @PathVariable Long categoryId,
    @PathVariable Long productId,
    @RequestParam int quantityChange) {
    try {
      macchinarioService.updateProductQuantity(macchinarioId, categoryId, productId, quantityChange);
      return ResponseEntity.ok().build();
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    } catch (Exception e) {
      e.printStackTrace(); // O usa un logger per il logging
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
