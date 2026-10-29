import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  deleteProduct,
} from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 12;

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

   async function loadProducts(pageNumber = 1) {
    try {
      setLoading(true);

      const skip = (pageNumber - 1) * limit;

      const data = await getProducts(limit, skip);

      setProducts(data.products);
      setTotal(data.total);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

    function nextPage() {
    const totalPages = Math.ceil(total / limit);

    if (page < totalPages) {
      const newPage = page + 1;

      setPage(newPage);
      loadProducts(newPage);
    }
  }

  function previousPage() {
    if (page > 1) {
      const newPage = page - 1;

      setPage(newPage);
      loadProducts(newPage);
    }
  }

    async function loadCategories() {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setProducts(
        products.filter((product) => product.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

    async function handleSearch(event) {
    event.preventDefault();

    try {
      setLoading(true);

      if (search.trim() === "") {
        await loadProducts();
        return;
      }

      const data = await searchProducts(search);
      setProducts(data.products);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

    async function handleCategory(event) {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);

    try {
      setLoading(true);

      if (selectedCategory === "") {
        await loadProducts();
        return;
      }

      const data = 
        await getProductsByCategory(selectedCategory);

      setProducts(data.products);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    console.log("Editar:", product);
  }

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Productos</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button type="submit">
          Buscar
        </button>
      </form>

      <select
        value={category}
        onChange={handleCategory}
      >
        
        <option value="">
          Todas las categorias
        </option>

        {categories.map((item) => {
          const value = item.slug ?? item;
          const label = item.name ?? item;

          return (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          );
        })}
      </select>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

            <div className="pagination">
        <button
          onClick={previousPage}
          disabled={page === 1}
        >
          Anterior
        </button>

        <span>
          Página {page}
        </span>

        <button
          onClick={nextPage}
          disabled={page >= Math.ceil(total / limit)}
        >
          Siguiente
        </button>
      </div>

    </section>
  );
}

export default Products;