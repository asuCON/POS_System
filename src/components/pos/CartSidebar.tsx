import { CartItem } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const CartSidebar = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartSidebarProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full h-full flex flex-col bg-pos-sidebar text-pos-sidebar-foreground">
      {/* Header */}
      <div className="p-5 border-b border-pos-sidebar-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-bold">Current Order</h2>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {itemCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <ShoppingBag className="w-12 h-12 mb-3" />
            <p className="text-sm">No items yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-pos-sidebar-muted rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {item.emoji} {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <p className="text-sm font-bold ml-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-7 h-7 rounded-md bg-pos-sidebar flex items-center justify-center hover:bg-destructive/20 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-semibold w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-7 h-7 rounded-md bg-pos-sidebar flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-auto w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & Checkout */}
      {items.length > 0 && (
        <div className="p-5 border-t border-pos-sidebar-muted space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-pos-sidebar-muted">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Charge ${total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
