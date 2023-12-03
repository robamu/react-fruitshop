import { ChangeEvent, ChangeEventHandler, useState } from "react";
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
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [currentSearchString, setCurrentSearchString] = useState("");

  return (
    <>
      <SearchBar
        checkBoxClickedCb={setShowOnlyInStock}
        searchBarInputCb={setCurrentSearchString}
      />
      <ProductTable
        products={products}
        showOnlyInStock={showOnlyInStock}
        searchString={currentSearchString}
      />
    </>
  );
}

interface SearchBarArgs {
  checkBoxClickedCb: (checked: boolean) => void;
  searchBarInputCb: (string: string) => void;
}

function SearchBar({ checkBoxClickedCb, searchBarInputCb }: SearchBarArgs) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => searchBarInputCb(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          onChange={(e) => checkBoxClickedCb(e.target.checked)}
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
}

interface ProductsWithFilters extends Products {
  showOnlyInStock: boolean;
  searchString: string;
}

interface ProductElement {
  name: string;
  stocked: boolean;
  element: JSX.Element;
}

function ProductTable({
  products,
  showOnlyInStock,
  searchString,
}: ProductsWithFilters) {
  let productMap: { [category: string]: ProductElement[] } = {};
  products.forEach((value) => {
    if (!productMap.hasOwnProperty(value.category)) {
      productMap[value.category] = [];
    }
    productMap[value.category].push({
      name: value.name,
      stocked: value.stocked,
      element: <ProductRow product={value} />,
    });
  });

  let table_body: JSX.Element[] = [];
  Object.entries(productMap).forEach(([category, productEntries], _) => {
    table_body.push(<ProductCategoryRow category={category} />);
    productEntries.forEach(({ name, stocked, element }) => {
      if (showOnlyInStock && !stocked) {
        return;
      }
      if (searchString !== "") {
        // Filter conditions. If those are not met, the entry will not be added to the table.
        if (
          !(
            category
              .toLocaleLowerCase()
              .includes(searchString.toLocaleLowerCase()) ||
            name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())
          )
        ) {
          return;
        }
      }
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
