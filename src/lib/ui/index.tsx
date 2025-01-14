import { createLayout } from '@rubriclab/ui/src/components/layout/layout'
import matter from './fonts/matter'

import arrowDown from './icons/arrowDown'
import arrowLeft from './icons/arrowLeft'
import arrowRight from './icons/arrowRight'
import arrowUp from './icons/arrowUp'
import cross from './icons/cross'
import edit from './icons/edit'
import menu from './icons/menu'
import minus from './icons/minus'
import plus from './icons/plus'
import search from './icons/search'
import settings from './icons/settings'
import trash from './icons/trash'
import icon from './logos/icon'
import wordmark from './logos/wordmark'

export const Layout = createLayout({
	colors: {
		light: {
			brand: {
				base: '#111111',
				focus: '#333333',
				active: '#000000',
				subtle: '#fafafa',
				text: '#111111',
				contrast: '#ffffff'
			},
			surface: {
				base: '#fafafa',
				subtle: '#f5f5f5',
				text: '#111111'
			},
			destructive: {
				base: '#ef4444',
				focus: '#f87171',
				active: '#dc2626',
				subtle: '#fee2e2',
				text: '#ef4444',
				contrast: '#ffffff'
			},
			success: {
				base: '#22c55e',
				focus: '#34d399',
				active: '#16a34a',
				subtle: '#dcfce7',
				text: '#22c55e',
				contrast: '#ffffff'
			},
			warning: {
				base: '#666666',
				focus: '#999999',
				active: '#333333',
				subtle: '#f5f5f5',
				text: '#666666',
				contrast: '#ffffff'
			}
		},
		dark: {
			brand: {
				base: '#ffffff',
				focus: '#e5e5e5',
				active: '#cccccc',
				subtle: '#111111',
				text: '#ffffff',
				contrast: '#111111'
			},
			surface: {
				base: '#111111',
				subtle: '#1a1a1a',
				text: '#ffffff'
			},
			destructive: {
				base: '#ef4444',
				focus: '#f87171',
				active: '#dc2626',
				subtle: '#1a1212',
				text: '#ef4444',
				contrast: '#ffffff'
			},
			success: {
				base: '#22c55e',
				focus: '#34d399',
				active: '#16a34a',
				subtle: '#121a14',
				text: '#22c55e',
				contrast: '#ffffff'
			},
			warning: {
				base: '#999999',
				focus: '#cccccc',
				active: '#666666',
				subtle: '#222222',
				text: '#999999',
				contrast: '#ffffff'
			}
		}
	},

	typography: {
		fonts: {
			body: matter,
			heading: matter,
			monospace: matter
		},
		scale: {
			headline: {
				fontSize: '1.5rem',
				lineHeight: '2rem',
				fontWeight: 600
			},
			subHeadline: {
				fontSize: '0.95rem',
				lineHeight: '1.5rem',
				fontWeight: 500
			},
			body: {
				fontSize: '0.9rem',
				lineHeight: '1.5rem',
				fontWeight: 400
			},
			caption: {
				fontSize: '0.8rem',
				lineHeight: '1.2rem',
				fontWeight: 400
			}
		},
		settings: {
			headingLineHeight: 1.5,
			headingLetterSpacing: '-0.5px',
			bodyLineHeight: 1.5
		}
	},

	icons: {
		arrowLeft,
		arrowRight,
		arrowUp,
		arrowDown,
		cross,
		plus,
		minus,
		edit,
		trash,
		search,
		settings,
		menu
	},

	logos: {
		icon,
		wordmark
	},

	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '4rem'
	},

	rounding: {
		subtle: '2px',
		rounded: '4px',
		pill: '9999px'
	},

	shadows: {
		sm: {
			offsetX: '0px',
			offsetY: '1px',
			blurRadius: '2px',
			color: 'rgba(0, 0, 0, 0.05)'
		},
		md: {
			offsetX: '0px',
			offsetY: '2px',
			blurRadius: '4px',
			color: 'rgba(0, 0, 0, 0.1)'
		},
		lg: {
			offsetX: '0px',
			offsetY: '4px',
			blurRadius: '8px',
			color: 'rgba(0, 0, 0, 0.15)'
		}
	},
	extendedShadows: {
		sm: 'rgba(0, 0, 0, 0.05)',
		md: 'rgba(0, 0, 0, 0.1)',
		lg: 'rgba(0, 0, 0, 0.15)'
	},

	animations: {
		quick: {
			timing: 'ease-in-out'
		},
		normal: {
			timing: 'ease-in-out'
		},
		slow: {
			timing: 'ease-in-out'
		}
	},

	transitions: {
		fast: '150ms',
		normal: '200ms',
		slow: '300ms'
	},

	borders: {
		thin: {
			width: '1px',
			style: 'solid'
		},
		thick: {
			width: '2px',
			style: 'solid'
		}
	},

	breakpoints: {
		xs: '360px',
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		xxl: '1536px'
	}
})
