package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Product;
import Gestionale.Magazzino.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping("/products")
  public List<ProductDTO> getAllProducts() {
    return productService.getAllProducts().stream()
      .map(product -> new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId()))
      .collect(Collectors.toList());
  }

  @GetMapping("/products/{id}")
  public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
    Product product = productService.getProductById(id);
    if (product == null) {
      return ResponseEntity.notFound().build();
    }
    ProductDTO productDTO = new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId());
    return ResponseEntity.ok(productDTO);
  }

  @PostMapping("/products")
  public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
    // Verifica se il prodotto esiste già
    if (productService.productExistsByName(productDTO.getName())) {
      return ResponseEntity.badRequest().body(null); // Ritorna un errore 400 se il prodotto esiste già
    }

    Product product = new Product();
    product.setName(productDTO.getName());
    product.setLocation(productDTO.getLocation());
    product.setQuantity(productDTO.getQuantity());
    product.setInputQuantity(productDTO.getInputQuantity());
    product.setCategory(productService.getCategoryById(productDTO.getCategoryId()));
    product = productService.saveProduct(product);
    ProductDTO newProductDTO = new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId());
    return ResponseEntity.ok(newProductDTO);
  }



  @PutMapping("/products/{id}")
  public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
    Product product = productService.getProductById(id);
    if (product == null) {
      return ResponseEntity.notFound().build();
    }
    product.setName(productDTO.getName());
    product.setLocation(productDTO.getLocation());
    product.setQuantity(productDTO.getQuantity());
    product.setInputQuantity(productDTO.getInputQuantity());
    product.setCategory(productService.getCategoryById(productDTO.getCategoryId()));
    product = productService.saveProduct(product);
    ProductDTO updatedProductDTO = new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId());
    return ResponseEntity.ok(updatedProductDTO);
  }

  @DeleteMapping("/products/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/products/by-categories")
  public ResponseEntity<List<ProductDTO>> getProductsByCategories(@RequestBody Map<String, List<Long>> request) {
    List<Long> categoryIds = request.get("categoryIds");
    List<ProductDTO> products = productService.getProductsByCategoryIds(categoryIds);
    return ResponseEntity.ok(products);
  }
}
