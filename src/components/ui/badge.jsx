import * as React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
      variant === 'success' && 'bg-emerald-500/15 text-emerald-200',
      variant === 'warning' && 'bg-amber-500/15 text-amber-200',
      variant === 'danger' && 'bg-rose-500/15 text-rose-200',
      variant === 'default' && 'bg-white/10 text-white/70',
      className
    )}
    {...props}
  />
));
Badge.displayName = 'Badge';

export { Badge };
