package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Product;
import Gestionale.Magazzino.Repository.CategoryRepository;
import Gestionale.Magazzino.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  public List<Product> getAllProducts() {
    return productRepository.findAll();
  }

  public Product saveProduct(Product product) {
    return productRepository.save(product);
  }

  public Product getProductById(Long id) {
    return productRepository.findById(id).orElse(null);
  }

  public Category getCategoryById(Long id) {
    return categoryRepository.findById(id).orElse(null);
  }

  public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
    Product product = productRepository.findById(id).orElseThrow();
    product.setName(productDTO.getName());
    product.setLocation(productDTO.getLocation());
    product.setQuantity(productDTO.getQuantity());
    product.setInputQuantity(productDTO.getInputQuantity());
    product.setCategory(categoryRepository.findById(productDTO.getCategoryId()).orElseThrow());
    return convertToDTO(productRepository.save(product));
  }

  public void deleteProduct(Long id) {
    productRepository.deleteById(id);
  }

  public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
    return getProductsByCategoryIds(List.of(categoryId));
  }

  public List<ProductDTO> getProductsByCategoryIds(List<Long> categoryIds) {
    List<Product> products = productRepository.findByCategoryIds(categoryIds);
    return products.stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  public boolean productExistsByName(String name) {
    return productRepository.findByName(name) != null;
  }

  private ProductDTO convertToDTO(Product product) {
    ProductDTO dto = new ProductDTO();
    dto.setId(product.getId());
    dto.setName(product.getName());
    dto.setLocation(product.getLocation());
    dto.setQuantity(product.getQuantity());
    dto.setInputQuantity(product.getInputQuantity());
    dto.setCategoryId(product.getCategory().getId());
    return dto;
  }
}
