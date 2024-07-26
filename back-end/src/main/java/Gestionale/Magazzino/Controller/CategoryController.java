package Gestionale.Magazzino.Controller;

import Gestionale.Magazzino.Dto.CategoryDTO;
import Gestionale.Magazzino.Entity.Category;
import Gestionale.Magazzino.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
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
  @PreAuthorize("hasAuthority('ADMIN')")
  public CategoryDTO getCategoryById(@PathVariable Long id) {
    return categoryService.getCategoryById(id);
  }

  @PostMapping("/categories")
  @PreAuthorize("hasAuthority('ADMIN')")
  public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
    return categoryService.createCategory(categoryDTO);
  }

  @PutMapping("/categories/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public CategoryDTO updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
    return categoryService.updateCategory(id, categoryDTO);
  }

  @DeleteMapping("/categories/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public void deleteCategory(@PathVariable Long id) {
    categoryService.deleteCategory(id);
  }
}

