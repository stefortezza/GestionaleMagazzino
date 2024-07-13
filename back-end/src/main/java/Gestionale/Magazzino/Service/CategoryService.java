package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Product;
import Gestionale.Magazzino.Repository.CategoryRepository;
import Gestionale.Magazzino.Repository.MacchinarioRepository;
import Gestionale.Magazzino.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {
  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private MacchinarioRepository macchinarioRepository;

  public List<CategoryDTO> getAllCategories() {
    return categoryRepository.findAll().stream()
      .map(category -> new CategoryDTO(category.getId(), category.getName(), category.getMacchinario().getId()))
      .toList();
  }

  public CategoryDTO getCategoryById(Long id) {
    return categoryRepository.findById(id)
      .map(category -> new CategoryDTO(category.getId(), category.getName(), category.getMacchinario().getId()))
      .orElse(null);
  }

  public CategoryDTO createCategory(CategoryDTO categoryDTO) {
    Category category = convertToEntity(categoryDTO);
    category = categoryRepository.save(category);
    return convertToDTO(category);
  }

  public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
    Category category = categoryRepository.findById(id).orElseThrow();
    category.setName(categoryDTO.getName());
    category.setMacchinario(macchinarioRepository.findById(categoryDTO.getMacchinarioId()).orElseThrow());
    category = categoryRepository.save(category);
    return convertToDTO(category);
  }

  public void deleteCategory(Long id) {
    categoryRepository.deleteById(id);
  }

  public List<CategoryDTO> getCategoriesByMacchinarioId(Long macchinarioId) {
    return categoryRepository.findByMacchinarioId(macchinarioId);
  }

  private CategoryDTO convertToDTO(Category category) {
    CategoryDTO categoryDTO = new CategoryDTO();
    categoryDTO.setId(category.getId());
    categoryDTO.setName(category.getName());
    categoryDTO.setMacchinarioId(category.getMacchinario().getId());
    categoryDTO.setProducts(category.getProducts().stream().map(this::convertProductToDTO).collect(Collectors.toList()));
    return categoryDTO;
  }

  private Category convertToEntity(CategoryDTO categoryDTO) {
    Category category = new Category();
    category.setId(categoryDTO.getId());
    category.setName(categoryDTO.getName());
    category.setMacchinario(macchinarioRepository.findById(categoryDTO.getMacchinarioId()).orElseThrow());
    return category;
  }

  private ProductDTO convertProductToDTO(Product product) {
    ProductDTO productDTO = new ProductDTO();
    productDTO.setId(product.getId());
    productDTO.setName(product.getName());
    productDTO.setLocation(product.getLocation());
    productDTO.setQuantity(product.getQuantity());
    productDTO.setInputQuantity(product.getInputQuantity());
    productDTO.setCategoryId(product.getCategory().getId());
    return productDTO;
  }
}
