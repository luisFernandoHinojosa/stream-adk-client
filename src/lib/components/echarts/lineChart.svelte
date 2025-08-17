<script lang="ts">
	import type { EChartsOption } from 'echarts';
	import BaseChart from './baseChart.svelte';
	import type { LineChartData } from '$lib/interface';

	const {
		data = [],
		xAxisLabels = [],
		title = '',
		height = '400px',
		showGrid = true,
		showLegend = true,
		theme = 'light',
		loading = false,
		className = ''
	} = $props<{
		data?: LineChartData[];
		xAxisLabels?: string[];
		title?: string;
		height?: string;
		showGrid?: boolean;
		showLegend?: boolean;
		theme?: 'light' | 'dark';
		loading?: boolean;
		className?: string;
	}>();

	function getDefaultColor(index: number): string {
		const colors = [
			'#3B82F6',
			'#EF4444',
			'#10B981',
			'#F59E0B',
			'#8B5CF6',
			'#EC4899',
			'#14B8A6',
			'#F97316'
		];
		return colors[index % colors.length];
	}

	const option = $derived(
		(): EChartsOption => ({
			title: {
				text: title,
				left: 'center',
				textStyle: {
					fontSize: 18,
					fontWeight: 'bold',
					color: theme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			tooltip: {
				trigger: 'axis',
				backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
				borderColor: theme === 'dark' ? '#6B7280' : '#E5E7EB',
				textStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			legend: {
				show: showLegend,
				bottom: 10,
				textStyle: { color: theme === 'dark' ? '#ffffff' : '#374151' }
			},
			grid: {
				show: showGrid,
				left: '3%',
				right: '4%',
				bottom: showLegend ? '15%' : '3%',
				containLabel: true,
				borderColor: theme === 'dark' ? '#6B7280' : '#E5E7EB'
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xAxisLabels,
				axisLine: { lineStyle: { color: theme === 'dark' ? '#6B7280' : '#E5E7EB' } },
				axisLabel: { color: theme === 'dark' ? '#D1D5DB' : '#6B7280' }
			},
			yAxis: {
				type: 'value',
				axisLine: { lineStyle: { color: theme === 'dark' ? '#6B7280' : '#E5E7EB' } },
				axisLabel: { color: theme === 'dark' ? '#D1D5DB' : '#6B7280' },
				splitLine: { lineStyle: { color: theme === 'dark' ? '#374151' : '#F3F4F6' } }
			},
			series: data.map((series, index) => ({
				name: series.name,
				type: 'line',
				smooth: series.smooth ?? false,
				data: series.data,
				itemStyle: { color: series.color ?? getDefaultColor(index) },
				lineStyle: { width: 2 },
				emphasis: { focus: 'series' }
			}))
		})
	);
</script>

<BaseChart
	option={option()}
	{height}
	{loading}
	theme={theme === 'dark' ? 'dark' : 'default'}
	className={`line-chart ${className}`}
/>
