<script lang="ts">
	//baseChart.svelte
	import { onMount, onDestroy } from 'svelte';
	import * as echarts from 'echarts';
	import type { ECharts, EChartsOption } from 'echarts';

	interface Props {
		option: EChartsOption;
		theme?: string;
		height?: string;
		width?: string;
		className?: string;
		loading?: boolean;
		loadingOptions?: object;
		autoResize?: boolean;
		getChart?: () => ECharts | null;
		resize?: () => void;
	}

	let {
		option,
		theme = 'default',
		height = '400px',
		width = '100%',
		className = '',
		loading = false,
		loadingOptions = {},
		autoResize = true,
		getChart,
		resize
	}: Props = $props();

	let chartContainer: HTMLDivElement;
	let chart = $state<ECharts | null>(null);
	let resizeObserver: ResizeObserver;
	let mounted = $state(false);

	const initChart = () => {
		if (!chartContainer || chart) return;

		try {
			// Verificar que el contenedor tenga dimensiones
			const rect = chartContainer.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) {
				console.warn('Chart container has no dimensions');
				return;
			}

			chart = echarts.init(chartContainer, theme, {
				renderer: 'canvas',
				devicePixelRatio: window.devicePixelRatio || 1,
				width: 'auto',
				height: 'auto'
			});

			if (loading) {
				chart.showLoading(loadingOptions);
			}

			// Solo establecer opción si no está vacía
			if (option && Object.keys(option).length > 0) {
				chart.setOption(option, true);
			}

			if (autoResize) {
				setupResize();
			}

			// Exponer funciones al componente padre
			if (getChart) {
				getChart = () => chart;
			}
			if (resize) {
				resize = handleResize;
			}
		} catch (error) {
			console.error('Error initializing chart:', error);
		}
	};

	const setupResize = () => {
		if (window.ResizeObserver) {
			resizeObserver = new ResizeObserver((entries) => {
				if (entries.length > 0) {
					handleResize();
				}
			});
			resizeObserver.observe(chartContainer);
		} else {
			// Fallback
			window.addEventListener('resize', handleResize);
		}
	};

	const handleResize = () => {
		if (!chart || chart.isDisposed()) return;

		// Usar requestAnimationFrame para mejor performance
		requestAnimationFrame(() => {
			if (chart && !chart.isDisposed()) {
				chart.resize();
			}
		});
	};

	const updateChart = () => {
		if (!chart || chart.isDisposed()) return;

		try {
			if (loading) {
				chart.showLoading(loadingOptions);
			} else {
				chart.hideLoading();
			}

			// Solo actualizar si hay opciones válidas
			if (option && Object.keys(option).length > 0) {
				chart.setOption(option, true);
			}
		} catch (error) {
			console.error('Error updating chart:', error);
		}
	};

	const cleanup = () => {
		if (chart && !chart.isDisposed()) {
			try {
				chart.dispose();
			} catch (error) {
				console.error('Error disposing chart:', error);
			}
		}
		chart = null;

		if (resizeObserver) {
			resizeObserver.disconnect();
		} else if (autoResize) {
			window.removeEventListener('resize', handleResize);
		}
	};

	onMount(() => {
		mounted = true;
		// Pequeño delay para asegurar que el DOM esté completamente renderizado
		setTimeout(() => {
			initChart();
		}, 10);
	});

	onDestroy(() => {
		cleanup();
	});

	// Effect para actualizar cuando cambie la opción
	$effect(() => {
		if (mounted && chart && option) {
			updateChart();
		}
	});

	// Effect para manejar loading
	$effect(() => {
		if (mounted && chart && !chart.isDisposed()) {
			if (loading) {
				chart.showLoading(loadingOptions);
			} else {
				chart.hideLoading();
			}
		}
	});
</script>

<div
	bind:this={chartContainer}
	class="echarts-container {className}"
	style="height: {height}; width: {width}; min-height: 200px; position: relative;"
>
	{#if !chart && loading}
		<div
			class="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50"
		>
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
		</div>
	{/if}
</div>

<style>
	.echarts-container {
		overflow: hidden;
	}

	.echarts-container > div {
		width: 100% !important;
		height: 100% !important;
	}

	@media (max-width: 640px) {
		.echarts-container {
			min-height: 280px;
		}
	}
</style>
