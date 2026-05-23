import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "green" | "blue" | "yellow" | "red";
  sub?: string;
}

export function StatCard({ title, value, icon: Icon, color = "green", sub }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
          color === "green" && "bg-green-100",
          color === "blue" && "bg-blue-100",
          color === "yellow" && "bg-yellow-100",
          color === "red" && "bg-red-100",
        )}>
          <Icon className={cn(
            "w-6 h-6",
            color === "green" && "text-green-600",
            color === "blue" && "text-blue-600",
            color === "yellow" && "text-yellow-600",
            color === "red" && "text-red-600",
          )} />
        </div>
      </div>
    </div>
  );
}
