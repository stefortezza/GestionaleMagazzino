package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping("/products")
  public List<ProductDTO> getAllProducts() {
    return productService.getAllProducts();
  }

  @GetMapping("/products/{id}")
  public ProductDTO getProductById(@PathVariable Long id) {
    return productService.getProductById(id);
  }

  @GetMapping("/categories/{categoryId}/products")
  public List<ProductDTO> getProductsByCategoryId(@PathVariable Long categoryId) {
    return productService.getProductsByCategoryId(categoryId);
  }

  @PostMapping("/products")
  public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
    return productService.createProduct(productDTO);
  }

  @PutMapping("/macchinario/{macchinarioId}/categories/{categoryId}/products/{productId}")
  public ResponseEntity<List<ProductDTO>> updateProductQuantity(
    @PathVariable Long macchinarioId,
    @PathVariable Long categoryId,
    @PathVariable Long productId,
    @RequestBody Map<String, Integer> quantityChange) {
    int change = quantityChange.get("quantityChange");
    List<ProductDTO> updatedProducts = productService.updateProductQuantity(macchinarioId, categoryId, productId, change);
    return ResponseEntity.ok(updatedProducts);
  }

  @DeleteMapping("/products/{id}")
  public void deleteProduct(@PathVariable Long id) {
    productService.deleteProduct(id);
  }
}
