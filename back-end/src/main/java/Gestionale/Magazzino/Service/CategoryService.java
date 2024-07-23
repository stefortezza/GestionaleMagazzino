package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Product;
import Gestionale.Magazzino.Repository.CategoryRepository;
import Gestionale.Magazzino.Repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private ProductRepository productRepository;

  public List<CategoryDTO> getAllCategories() {
    return categoryRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
  }

  public CategoryDTO getCategoryById(Long id) {
    return categoryRepository.findById(id).map(this::convertToDTO).orElse(null);
  }

  public CategoryDTO createCategory(CategoryDTO categoryDTO) {
    Category category = new Category();
    category.setName(categoryDTO.getName());
    return convertToDTO(categoryRepository.save(category));
  }

  public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
    Category category = categoryRepository.findById(id).orElseThrow();
    category.setName(categoryDTO.getName());
    return convertToDTO(categoryRepository.save(category));
  }

  public void deleteCategory(Long id) {
    categoryRepository.deleteById(id);
  }

  private CategoryDTO convertToDTO(Category category) {
    return new CategoryDTO(category.getId(), category.getName());
  }

  public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
    // Usa una lista con un solo ID per chiamare il metodo che gestisce più ID
    List<Product> products = productRepository.findByCategoryIds(Collections.singletonList(categoryId));
    return products.stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  private ProductDTO convertToDTO(Product product) {
    return new ProductDTO(product.getId(), product.getName(), product.getLocation(), product.getQuantity(), product.getInputQuantity(), product.getCategory().getId());
  }
}
