<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as echarts from 'echarts';
	import type { ECharts, EChartsOption } from 'echarts';

	//PROPS
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

	const initChart = () => {
		if (chartContainer && !chart) {
			chart = echarts.init(chartContainer, theme);

			if (loading) {
				chart.showLoading(loadingOptions);
			}

			chart.setOption(option);

			if (autoResize) {
				window.addEventListener('resize', handleResize);
			}
		}
	};

	const handleResize = () => {
		if (chart) {
			chart.resize();
		}
	};

	const updateChart = () => {
		if (chart) {
			if (loading) {
				chart.showLoading(loadingOptions);
			} else {
				chart.hideLoading();
			}
			chart.setOption(option, true);
		}
	};

	const cleanup = () => {
		if (chart) {
			if (autoResize) {
				window.removeEventListener('resize', handleResize);
			}
			chart.dispose();
			chart = null;
		}
	};

	onMount(() => {
		initChart();
	});

	onDestroy(() => {
		cleanup();
	});

	$effect(() => {
		if (chart && option) {
			updateChart();
		}
	});

	$effect(() => {
		if (chart) {
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
	style="height: {height}; width: {width};"
>
	{#if !chart && loading}
		<div class="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-800">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
		</div>
	{/if}
</div>
