package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

  @Autowired
  private CategoryService categoryService;

  @GetMapping("/categories")
  public List<CategoryDTO> getAllCategories() {
    return categoryService.getAllCategories();
  }

  @GetMapping("/categories/{id}")
  public CategoryDTO getCategoryById(@PathVariable Long id) {
    return categoryService.getCategoryById(id);
  }

  @PostMapping("/categories")
  public ResponseEntity<?> createCategory(@RequestBody CategoryDTO categoryDTO) {
    if (categoryService.categoryExistsByName(categoryDTO.getName())) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Categoria esiste già");
    }
    CategoryDTO createdCategory = categoryService.createCategory(categoryDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
  }


  @PutMapping("/categories/{id}")
  public CategoryDTO updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
    return categoryService.updateCategory(id, categoryDTO);
  }

  @DeleteMapping("/categories/{id}")
  public void deleteCategory(@PathVariable Long id) {
    categoryService.deleteCategory(id);
  }
}

