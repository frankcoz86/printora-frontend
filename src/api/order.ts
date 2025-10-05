// /frontend/src/api/orders.ts
export async function markOrderPaid(order_id: number, provider = "stripe") {
    const url = import.meta.env.VITE_MARK_ORDER_PAID_URL!;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, provider }),
    });
    if (!res.ok) throw new Error("mark-order-paid failed");
    return res.json();
}
  