/**
 * Toast notification styles using custom Tailwind classes
 * This provides consistent styling for all toast types across the application
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastStyles {
	container: string;
	icon: string;
	closeButton: string;
}

export const TOAST_STYLES: Record<ToastType, ToastStyles> = {
	success: {
		container: 'bg-green-600 border-l-4 border-green-800 text-white shadow-lg',
		icon: 'text-green-100',
		closeButton: 'text-green-200 hover:text-white hover:bg-green-700 focus:ring-green-300'
	},
	error: {
		container: 'bg-red-600 border-l-4 border-red-800 text-white shadow-lg',
		icon: 'text-red-100',
		closeButton: 'text-red-200 hover:text-white hover:bg-red-700 focus:ring-red-300'
	},
	warning: {
		container: 'bg-amber-500 border-l-4 border-amber-700 text-white shadow-lg',
		icon: 'text-amber-100',
		closeButton: 'text-amber-200 hover:text-white hover:bg-amber-600 focus:ring-amber-300'
	},
	info: {
		container: 'bg-blue-600 border-l-4 border-blue-800 text-white shadow-lg',
		icon: 'text-blue-100',
		closeButton: 'text-blue-200 hover:text-white hover:bg-blue-700 focus:ring-blue-300'
	}
} as const;
