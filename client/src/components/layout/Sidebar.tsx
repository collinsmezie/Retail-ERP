"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../ui/utils";
import { Boxes, Package, Warehouse, ScanBarcode, LayoutDashboard, ShoppingCart, Banknote } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/accounting", label: "Accounting", icon: Banknote },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/inventory/stockin", label: "Stock In", icon: Warehouse },
  { href: "/inventory/stockout", label: "Stock Out", icon: ScanBarcode },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r bg-white">
      <div className="h-14 border-b px-4 flex items-center font-semibold tracking-tight">Retail ERP</div>
      <nav className="flex-1 p-2 space-y-1">
        {nav.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href + (item.href === "/" ? "" : "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm border border-transparent",
                active ? "bg-sky-50 text-sky-700 border-sky-100" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <ActiveIcon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-slate-500 border-t">v0.1.0</div>
    </aside>
  );
} 