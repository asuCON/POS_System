import { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          className="bg-card rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border border-transparent hover:border-primary/20 active:scale-95 cursor-pointer"
        >
          <span className="text-4xl">{product.emoji}</span>
          <span className="text-sm font-semibold text-card-foreground text-center leading-tight">
            {product.name}
          </span>
          <span className="text-sm font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ProductGrid;
