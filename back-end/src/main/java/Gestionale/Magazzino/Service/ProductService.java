package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Product;
import Gestionale.Magazzino.Repository.CategoryRepository;
import Gestionale.Magazzino.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  public List<ProductDTO> getAllProducts() {
    return productRepository.findAll().stream()
      .map(product -> new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId()))
      .toList();
  }

  public ProductDTO getProductById(Long id) {
    Optional<Product> productOptional = productRepository.findById(id);
    if (productOptional.isPresent()) {
      Product product = productOptional.get();
      return new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId());
    } else {
      return null;
    }
  }

  public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
    return productRepository.findByCategoryId(categoryId);
  }

  public ProductDTO createProduct(ProductDTO productDTO) {
    Optional<Category> categoryOptional = categoryRepository.findById(productDTO.getCategoryId());
    if (categoryOptional.isEmpty()) {
      throw new IllegalArgumentException("Categoria non trovata per id: " + productDTO.getCategoryId());
    }

    Category category = categoryOptional.get();

    Product product = new Product();
    product.setName(productDTO.getName());
    product.setLocation(productDTO.getLocation());
    product.setQuantity(productDTO.getQuantity());
    product.setInputQuantity(productDTO.getInputQuantity());
    product.setCategory(category);

    Product savedProduct = productRepository.save(product);
    return new ProductDTO(savedProduct.getId(), savedProduct.getName(), savedProduct.getLocation(), savedProduct.getQuantity(), savedProduct.getInputQuantity(), savedProduct.getCategory().getId());
  }

  public List<ProductDTO> updateProductQuantity(Long macchinarioId, Long categoryId, Long productId, int quantityChange) {
    Optional<Product> productOpt = productRepository.findById(productId);
    if (productOpt.isPresent()) {
      Product product = productOpt.get();
      String productName = product.getName();
      List<Product> productsToUpdate = productRepository.findByName(productName);
      productsToUpdate.forEach(p -> p.setQuantity(p.getQuantity() + quantityChange));
      productRepository.saveAll(productsToUpdate);

      return productsToUpdate.stream()
        .map(p -> new ProductDTO(p.getId(), p.getName(), p.getLocation(), p.getQuantity(), p.getInputQuantity(), p.getCategory().getId()))
        .collect(Collectors.toList());
    } else {
      throw new RuntimeException("Product not found");
    }
  }

  public void deleteProduct(Long id) {
    productRepository.deleteById(id);
  }
}
