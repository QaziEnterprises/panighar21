// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Search, Package, BarChart3, ArrowUpDown, Eye } from "lucide-react";
import { offlineQuery } from "@/lib/offlineQuery";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string | null;
  product_name: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface SaleTransaction {
  id: string;
  date: string;
  total: number | null;
}

interface Product {
  id: string;
  name: string;
  selling_price: number;
  quantity: number;
  sku: string | null;
}

interface ProductStats {
  product_id: string;
  product_name: string;
  totalQty: number;
  totalRevenue: number;
  orderCount: number;
  avgQtyPerOrder: number;
}

const CHART_COLORS = [
  "var(--primary)", "var(--accent)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)",
  "var(--chart-1)", "var(--chart-2)",
];

export default function ProductAnalyticsPage() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"qty" | "revenue">("qty");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(period));
      const dateStr = daysAgo.toISOString().split("T")[0];

      const [itemsData, salesData, productsData] = await Promise.all([
        offlineQuery<SaleItem>("sale_items", { limit: 5000 }),
        offlineQuery<SaleTransaction>("sale_transactions", {
          order: "date",
          ascending: false,
          limit: 5000,
        }),
        offlineQuery<Product>("products", { limit: 1000 }),
      ]);

      const filteredSales = salesData.filter((s) => s.date >= dateStr);
      const saleIds = new Set(filteredSales.map((s) => s.id));
      const filteredItems = itemsData.filter((i) => saleIds.has(i.sale_id));

      setSaleItems(filteredItems);
      setSales(filteredSales);
      setProducts(productsData);
    } catch (e) {
      console.error("Failed to fetch analytics data", e);
    } finally {
      setLoading(false);
    }
  };

  const productStats = useMemo(() => {
    const map = new Map<string, ProductStats>();
    for (const item of saleItems) {
      const key = item.product_id || item.product_name || "Unknown";
      const existing = map.get(key);
      if (existing) {
        existing.totalQty += item.quantity;
        existing.totalRevenue += item.subtotal;
        existing.orderCount += 1;
        existing.avgQtyPerOrder = existing.totalQty / existing.orderCount;
      } else {
        map.set(key, {
          product_id: item.product_id || key,
          product_name: item.product_name || "Unknown Product",
          totalQty: item.quantity,
          totalRevenue: item.subtotal,
          orderCount: 1,
          avgQtyPerOrder: item.quantity,
        });
      }
    }
    return Array.from(map.values());
  }, [saleItems]);

  const sorted = useMemo(() => {
    const filtered = productStats.filter((p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.sort((a, b) =>
      sortBy === "qty" ? b.totalQty - a.totalQty : b.totalRevenue - a.totalRevenue
    );
  }, [productStats, search, sortBy]);

  const topSellers = sorted.slice(0, 10);
  const lowSellers = [...sorted].reverse().slice(0, 10);

  // Products with zero sales in the period
  const zeroSalesProducts = useMemo(() => {
    const soldIds = new Set(productStats.map((p) => p.product_id));
    return products.filter((p) => !soldIds.has(p.id));
  }, [products, productStats]);

  // Selected product daily trend
  const selectedProductData = useMemo(() => {
    if (!selectedProduct) return null;
    const stat = productStats.find((p) => p.product_id === selectedProduct);
    const items = saleItems.filter(
      (i) => (i.product_id || i.product_name) === selectedProduct
    );

    // Daily breakdown
    const saleMap = new Map<string, string>();
    for (const s of sales) saleMap.set(s.id, s.date);

    const dailyMap = new Map<string, { qty: number; revenue: number }>();
    for (const item of items) {
      const date = saleMap.get(item.sale_id) || "unknown";
      const existing = dailyMap.get(date);
      if (existing) {
        existing.qty += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        dailyMap.set(date, { qty: item.quantity, revenue: item.subtotal });
      }
    }

    const daily = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { stat, daily };
  }, [selectedProduct, saleItems, sales, productStats]);

  const formatPKR = (n: number) =>
    `Rs. ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Product Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track which products sell the most and which need attention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Products Sold</p>
            <p className="text-2xl font-bold text-primary">{productStats.reduce((s, p) => s + p.totalQty, 0)}</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-accent">{formatPKR(productStats.reduce((s, p) => s + p.totalRevenue, 0))}</p>
          </CardContent>
        </Card>
        <Card className="border-chart-3/20 bg-chart-3/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Unique Products Sold</p>
            <p className="text-2xl font-bold" style={{ color: "var(--chart-3)" }}>{productStats.length}</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Zero Sales Products</p>
            <p className="text-2xl font-bold text-destructive">{zeroSalesProducts.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="top">🔥 Top Sellers</TabsTrigger>
          <TabsTrigger value="low">📉 Low Sellers</TabsTrigger>
          <TabsTrigger value="zero">⚠️ Zero Sales</TabsTrigger>
          <TabsTrigger value="detail">🔍 Product Detail</TabsTrigger>
        </TabsList>

        {/* Top Sellers */}
        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSellers.slice(0, 8)} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis
                    dataKey="product_name"
                    type="category"
                    tick={{ fill: "var(--foreground)", fontSize: 11 }}
                    width={95}
                  />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                    formatter={(v: number, name: string) => [name === "totalQty" ? `${v} units` : formatPKR(v), name === "totalQty" ? "Quantity" : "Revenue"]}
                  />
                  <Bar dataKey="totalQty" fill="var(--primary)" radius={[0, 4, 4, 0]} name="totalQty" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Qty Sold</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Revenue</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Orders</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((p, i) => (
                  <motion.tr
                    key={p.product_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-bold text-primary">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{p.product_name}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">{p.totalQty}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-accent">{formatPKR(p.totalRevenue)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{p.orderCount}</td>
                    <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedProduct(p.product_id); document.querySelector('[data-value="detail"]')?.click(); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Low Sellers */}
        <TabsContent value="low" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" /> Lowest Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lowSellers.slice(0, 8)} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis dataKey="product_name" type="category" tick={{ fill: "var(--foreground)", fontSize: 11 }} width={95} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                    formatter={(v: number) => [`${v} units`, "Quantity"]}
                  />
                  <Bar dataKey="totalQty" fill="var(--destructive)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Qty Sold</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Revenue</th>
                  <th className="px-4 py-3 text-center font-semibold text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody>
                {lowSellers.map((p, i) => (
                  <motion.tr
                    key={p.product_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{p.product_name}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="destructive">{p.totalQty}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatPKR(p.totalRevenue)}</td>
                    <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedProduct(p.product_id); document.querySelector('[data-value="detail"]')?.click(); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Zero Sales */}
        <TabsContent value="zero" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-destructive" /> Products with Zero Sales
                <Badge variant="destructive" className="ml-2">{zeroSalesProducts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zeroSalesProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">🎉 All products have been sold at least once!</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {zeroSalesProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Stock: {p.quantity} | {formatPKR(p.selling_price)}</p>
                      </div>
                      <Badge variant="outline" className="text-destructive border-destructive/30">No Sales</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Detail */}
        <TabsContent value="detail" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" /> Select a Product to Analyze
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {sorted.filter((p) => p.product_name.toLowerCase().includes(search.toLowerCase())).slice(0, 30).map((p) => (
                  <Button
                    key={p.product_id}
                    size="sm"
                    variant={selectedProduct === p.product_id ? "default" : "outline"}
                    onClick={() => setSelectedProduct(p.product_id)}
                    className="text-xs"
                  >
                    {p.product_name} ({p.totalQty})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedProductData?.stat && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Total Quantity Sold</p>
                    <p className="text-2xl font-bold text-primary">{selectedProductData.stat.totalQty}</p>
                  </CardContent>
                </Card>
                <Card className="border-accent/20">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-accent">{formatPKR(selectedProductData.stat.totalRevenue)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{selectedProductData.stat.orderCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Avg Qty/Order</p>
                    <p className="text-2xl font-bold text-foreground">{selectedProductData.stat.avgQtyPerOrder.toFixed(1)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily trend chart */}
              {selectedProductData.daily.length > 1 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Daily Sales Trend — {selectedProductData.stat.product_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={selectedProductData.daily}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                          tickFormatter={(d) => new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                        />
                        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                          formatter={(v: number, name: string) => [name === "qty" ? `${v} units` : formatPKR(v), name === "qty" ? "Quantity" : "Revenue"]}
                          labelFormatter={(d) => new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                        />
                        <Line type="monotone" dataKey="qty" stroke="var(--primary)" strokeWidth={2} dot={{ fill: "var(--primary)" }} />
                        <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={{ fill: "var(--accent)" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Daily data table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Daily Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-border max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Date</th>
                          <th className="px-4 py-2 text-right font-semibold text-muted-foreground">Qty</th>
                          <th className="px-4 py-2 text-right font-semibold text-muted-foreground">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProductData.daily.map((d) => (
                          <tr key={d.date} className="border-t border-border hover:bg-muted/30">
                            <td className="px-4 py-2 text-foreground">{new Date(d.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td className="px-4 py-2 text-right font-medium text-primary">{d.qty}</td>
                            <td className="px-4 py-2 text-right text-accent">{formatPKR(d.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!selectedProductData?.stat && (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Select a product above to see its detailed sales analytics</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
