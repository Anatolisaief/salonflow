package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Producto;
import com.anatoli.salonflow.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @PostMapping
    public Producto crearProducto(@Valid @RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @GetMapping("/{id}")
    public Producto obtenerProductoPorId(@PathVariable Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    @GetMapping("/marca/{marca}")
    public List<Producto> buscarPorMarca(@PathVariable String marca) {
        return productoRepository.findByMarca(marca);
    }

    @GetMapping("/nombre/{nombre}")
    public List<Producto> buscarPorNombre(@PathVariable String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody Producto productoActualizado) {

        return productoRepository.findById(id).map(producto -> {
            producto.setNombre(productoActualizado.getNombre());
            producto.setMarca(productoActualizado.getMarca());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setStock(productoActualizado.getStock());
            return productoRepository.save(producto);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }
}