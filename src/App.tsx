import "./App.css";

interface ProductInfo {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

interface Products {
  products: ProductInfo[];
}

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

function FilterableProductTable({ products }: Products) {
  return (
    <>
      <SearchBar />
      <ProductTable products={products} />
    </>
  );
}

function SearchBar() {
  return (
    <>
      <form id="form">
        <input type="search" id="query" placeholder="Search..." />
        <label>
          <input type="checkbox" /> Only show products in stock
        </label>
      </form>
    </>
  );
}

interface ProductElement {
  element: JSX.Element;
  stocked: boolean;
}

function ProductTable({ products }: Products) {
  let productMap: { [category: string]: ProductElement[] } = {};
  products.forEach((value) => {
    if (!productMap.hasOwnProperty(value.category)) {
      productMap[value.category] = [];
    }
    productMap[value.category].push({
      element: <ProductRow product={value} />,
      stocked: value.stocked,
    });
  });
  let table_body: JSX.Element[] = [];
  Object.entries(productMap).forEach(([key, productEntries], _) => {
    table_body.push(<ProductCategoryRow category={key} />);
    productEntries.forEach(({ element }) => {
      table_body.push(element);
    });
  });
  return (
    <>
      <table>
        <th>Name</th>
        <th>Price</th>
        {table_body}
      </table>
    </>
  );
}

function ProductCategoryRow({ category }: { category: string }) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }: { product: ProductInfo }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}
