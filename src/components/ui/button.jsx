import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
        dtf: 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20 hover:from-fuchsia-600 hover:to-purple-700 transform hover:scale-105',
        banner: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105',
        rollup: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105',
        vinile: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/20 hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105',
        forex: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/20 hover:from-red-600 hover:to-pink-700 transform hover:scale-105',
        paypal: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-sky-600 transform hover:scale-105',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-lg px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };