import { cn } from '@/lib/utils';
import { StockStatus } from '@/types/erp';

interface StockBadgeProps {
  status: StockStatus;
  className?: string;
}

const statusConfig = {
  'in-stock': {
    label: 'In Stock',
    className: 'stock-in',
  },
  'low-stock': {
    label: 'Low Stock',
    className: 'stock-low',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    className: 'stock-out',
  },
};

export function StockBadge({ status, className }: StockBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
