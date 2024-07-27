package Gestionale.Magazzino.Service;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Dto.MacchinarioDTO;
import Gestionale.Magazzino.Dto.ProductDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Entity.Macchinario;
import Gestionale.Magazzino.Entity.Product;
import Gestionale.Magazzino.Repository.CategoryRepository;
import Gestionale.Magazzino.Repository.MacchinarioRepository;
import Gestionale.Magazzino.Repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MacchinarioService {

  @Autowired
  private MacchinarioRepository macchinarioRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private ProductRepository productRepository;

  public List<MacchinarioDTO> getAllMacchinarios() {
    return macchinarioRepository.findAll().stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  public MacchinarioDTO getMacchinarioById(Long id) {
    Macchinario macchinario = macchinarioRepository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Macchinario not found with id: " + id));
    return convertToDTO(macchinario);
  }

  public MacchinarioDTO createMacchinario(MacchinarioDTO macchinarioDTO) {
    Macchinario macchinario = new Macchinario();
    macchinario.setName(macchinarioDTO.getName());

    // Imposta le categorie
    Set<Category> categories = Optional.ofNullable(macchinarioDTO.getCategoryIds())
      .orElse(Collections.emptyList()).stream()
      .map(id -> categoryRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id)))
      .collect(Collectors.toSet());
    macchinario.setCategories(categories);

    // Imposta i prodotti selezionati
    Set<Product> products = Optional.ofNullable(macchinarioDTO.getProductIds())
      .orElse(Collections.emptyList()).stream()
      .map(id -> productRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id)))
      .collect(Collectors.toSet());
    macchinario.setProducts(products);

    return convertToDTO(macchinarioRepository.save(macchinario));
  }

  public MacchinarioDTO updateMacchinario(Long id, MacchinarioDTO macchinarioDTO) {
    Macchinario macchinario = macchinarioRepository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Macchinario not found with id: " + id));

    macchinario.setName(macchinarioDTO.getName());

    // Aggiornamento delle categorie
    Set<Category> categories = Optional.ofNullable(macchinarioDTO.getCategoryIds())
      .orElse(Collections.emptyList()).stream()
      .map(categoryId -> categoryRepository.findById(categoryId)
        .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId)))
      .collect(Collectors.toSet());
    macchinario.setCategories(categories);

    // Aggiornamento dei prodotti
    Set<Product> products = Optional.ofNullable(macchinarioDTO.getProductIds())
      .orElse(Collections.emptyList()).stream()
      .map(productId -> productRepository.findById(productId)
        .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId)))
      .collect(Collectors.toSet());

    // Associa solo i prodotti selezionati al macchinario
    macchinario.setProducts(products);

    // Salva e restituisce il macchinario aggiornato
    return convertToDTO(macchinarioRepository.save(macchinario));
  }



  @Transactional
  public void updateProductQuantity(Long macchinarioId, Long categoryId, Long productId, int quantityChange) {
    Macchinario macchinario = macchinarioRepository.findById(macchinarioId)
      .orElseThrow(() -> new EntityNotFoundException("Macchinario not found with id: " + macchinarioId));

    Product product = productRepository.findById(productId)
      .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

    if (!product.getCategory().getId().equals(categoryId)) {
      throw new IllegalArgumentException("Product does not belong to the specified category.");
    }

    int newQuantity = product.getQuantity() + quantityChange;
    if (newQuantity < 0) {
      throw new IllegalArgumentException("Quantity cannot be negative.");
    }

    product.setQuantity(newQuantity);
    productRepository.save(product);
  }

  public void deleteMacchinario(Long id) {
    macchinarioRepository.deleteById(id);
  }

  private MacchinarioDTO convertToDTO(Macchinario macchinario) {
    return new MacchinarioDTO(
      macchinario.getId(),
      macchinario.getName(),
      macchinario.getCategories().stream().map(Category::getId).collect(Collectors.toList()),
      macchinario.getProducts().stream().map(Product::getId).collect(Collectors.toList())
    );
  }

  public List<ProductDTO> getProductsByMacchinarioAndCategory(Long macchinarioId, Long categoryId) {
    Optional<Macchinario> macchinarioOptional = macchinarioRepository.findById(macchinarioId);
    List<Product> products = new ArrayList<>();
    if (macchinarioOptional.isPresent()) {
      Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
      if (categoryOptional.isPresent()) {
        Macchinario macchinario = macchinarioOptional.get();
        Category category = categoryOptional.get();
        products = macchinario.getProducts().stream().filter((prodotto) -> prodotto.getCategory().equals(category)).toList();
      }
    }
    return products.stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  public List<CategoryDTO> getCategoriesByMacchinarioId(Long macchinarioId) {
    Macchinario macchinario = macchinarioRepository.findById(macchinarioId)
      .orElseThrow(() -> new EntityNotFoundException("Macchinario not found with id: " + macchinarioId));

    Set<Category> categories = macchinario.getCategories();
    return categories.stream()
      .map(this::convertCategoryToDTO)
      .collect(Collectors.toList());
  }

  public boolean existsByName(String name) {
    return macchinarioRepository.existsByName(name);
  }

  private CategoryDTO convertCategoryToDTO(Category category) {
    return new CategoryDTO(category.getId(), category.getName());
  }

  private ProductDTO convertToDTO(Product product) {
    return new ProductDTO(
      product.getId(),
      product.getName(),
      product.getLocation(),
      product.getQuantity(),
      product.getInputQuantity(),
      product.getCategory().getId()
    );
  }
}
