  package Gestionale.Magazzino.Service;

  import Gestionale.Magazzino.Dto.CategoryDTO;
  import Gestionale.Magazzino.Dto.MacchinarioDTO;
  import Gestionale.Magazzino.Dto.ProductDTO;
  import Gestionale.Magazzino.Entity.Category;
  import Gestionale.Magazzino.Entity.Macchinario;
  import Gestionale.Magazzino.Entity.Product;
  import Gestionale.Magazzino.Repository.CategoryRepository;
  import Gestionale.Magazzino.Repository.MacchinarioRepository;
  import jakarta.persistence.EntityNotFoundException;
  import jakarta.transaction.Transactional;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.stereotype.Service;

  import java.util.ArrayList;
  import java.util.List;
  import java.util.Optional;
  import java.util.stream.Collectors;

  @Service
  public class MacchinarioService {

    @Autowired
    private MacchinarioRepository macchinarioRepository;

    public List<MacchinarioDTO> getAllMacchinarios() {
      return macchinarioRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
    }

    @Transactional
    public MacchinarioDTO getMacchinarioById(Long id) {
      Macchinario macchinario = macchinarioRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Macchinario non trovato con id: " + id));
      // Assicurati che la lista categories sia caricata prima di accedervi
      macchinario.getCategories().size(); // Forza il caricamento della lista
      return convertToDTO(macchinario);
    }

    @Transactional
    public MacchinarioDTO createMacchinario(MacchinarioDTO macchinarioDTO) {
      Macchinario macchinario = new Macchinario();
      macchinario.setName(macchinarioDTO.getName());

      // Aggiungi le categorie con i relativi prodotti al macchinario
      if (macchinarioDTO.getCategories() != null) {
        for (CategoryDTO categoryDTO : macchinarioDTO.getCategories()) {
          Category category = new Category();
          category.setName(categoryDTO.getName());

          // Aggiungi i prodotti alla categoria
          if (categoryDTO.getProducts() != null) {
            List<Product> products = new ArrayList<>();
            for (ProductDTO productDTO : categoryDTO.getProducts()) {
              Product product = new Product();
              product.setName(productDTO.getName());
              product.setLocation(productDTO.getLocation());
              product.setQuantity(productDTO.getQuantity());
              product.setInputQuantity(productDTO.getInputQuantity());
              product.setCategory(category); // Imposta la relazione inversa

              products.add(product);
            }
            category.setProducts(products);
          }

          category.setMacchinario(macchinario); // Imposta la relazione inversa
          macchinario.getCategories().add(category);
        }
      }

      Macchinario savedMacchinario = macchinarioRepository.save(macchinario);
      return convertToDTO(savedMacchinario);
    }

    public MacchinarioDTO updateMacchinario(Long id, MacchinarioDTO macchinarioDTO) {
      Macchinario macchinario = macchinarioRepository.findById(id).orElseThrow();
      macchinario.setName(macchinarioDTO.getName());
      macchinario = macchinarioRepository.save(macchinario);
      return convertToDTO(macchinario);
    }

    public void deleteMacchinario(Long id) {
      macchinarioRepository.deleteById(id);
    }

    private MacchinarioDTO convertToDTO(Macchinario macchinario) {
      MacchinarioDTO macchinarioDTO = new MacchinarioDTO();
      macchinarioDTO.setId(macchinario.getId());
      macchinarioDTO.setName(macchinario.getName());
      macchinarioDTO.setCategories(macchinario.getCategories().stream().map(this::convertCategoryToDTO).collect(Collectors.toList()));
      return macchinarioDTO;
    }

    private Macchinario convertToEntity(MacchinarioDTO macchinarioDTO) {
      Macchinario macchinario = new Macchinario();
      macchinario.setId(macchinarioDTO.getId());
      macchinario.setName(macchinarioDTO.getName());
      // Not setting categories here to avoid circular dependency
      return macchinario;
    }

    private CategoryDTO convertCategoryToDTO(Category category) {
      CategoryDTO categoryDTO = new CategoryDTO();
      categoryDTO.setId(category.getId());
      categoryDTO.setName(category.getName());
      categoryDTO.setMacchinarioId(category.getMacchinario().getId());
      categoryDTO.setProducts(category.getProducts().stream().map(this::convertProductToDTO).collect(Collectors.toList()));
      return categoryDTO;
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
