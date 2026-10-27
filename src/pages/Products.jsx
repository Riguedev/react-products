import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import {
  getProducts,
  searchProducts,
  deleteProduct,
} from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </section>
  );
}

export default Products;