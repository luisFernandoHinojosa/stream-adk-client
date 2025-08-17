<script lang="ts">
	import type { EChartsOption } from 'echarts';
	import BaseChart from './baseChart.svelte';
	import type { BarChartData } from '$lib/interface';

	//PROPS
	const {
		data = [],
		categories = [],
		title = '',
		height = '400px',
		horizontal = false,
		stacked = false,
		showDataLabels = false,
		theme = 'light',
		loading = false,
		className = ''
	} = $props<{
		data?: BarChartData[];
		categories?: string[];
		title?: string;
		height?: string;
		horizontal?: boolean;
		stacked?: boolean;
		showDataLabels?: boolean;
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
				axisPointer: { type: 'shadow' },
				backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
				borderColor: theme === 'dark' ? '#6B7280' : '#E5E7EB',
				textStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			legend: {
				show: data.length > 1,
				bottom: 10,
				textStyle: { color: theme === 'dark' ? '#ffffff' : '#374151' }
			},
			grid: {
				left: horizontal ? '15%' : '3%',
				right: '4%',
				bottom: data.length > 1 ? '15%' : '3%',
				containLabel: true
			},
			xAxis: {
				type: horizontal ? 'value' : 'category',
				data: horizontal ? undefined : categories,
				axisLine: {
					lineStyle: { color: theme === 'dark' ? '#6B7280' : '#E5E7EB' }
				},
				axisLabel: {
					color: theme === 'dark' ? '#D1D5DB' : '#6B7280',
					...(horizontal ? {} : { rotate: categories.some((cat) => cat.length > 8) ? 45 : 0 })
				},
				splitLine: horizontal
					? { lineStyle: { color: theme === 'dark' ? '#374151' : '#F3F4F6' } }
					: undefined
			},
			yAxis: {
				type: horizontal ? 'category' : 'value',
				data: horizontal ? categories : undefined,
				axisLine: {
					lineStyle: { color: theme === 'dark' ? '#6B7280' : '#E5E7EB' }
				},
				axisLabel: { color: theme === 'dark' ? '#D1D5DB' : '#6B7280' },
				splitLine: horizontal
					? undefined
					: { lineStyle: { color: theme === 'dark' ? '#374151' : '#F3F4F6' } }
			},
			series: data.map((series, index) => ({
				name: series.name,
				type: 'bar',
				data: series.data,
				stack: stacked ? 'total' : undefined,
				itemStyle: {
					color: series.color ?? getDefaultColor(index),
					borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
				},
				label: {
					show: showDataLabels,
					position: horizontal ? 'right' : 'top',
					color: theme === 'dark' ? '#ffffff' : '#374151'
				},
				emphasis: {
					focus: 'series',
					itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' }
				}
			}))
		})
	);
</script>

<BaseChart
	option={option()}
	{height}
	{loading}
	theme={theme === 'dark' ? 'dark' : 'default'}
	className={`bar-chart ${className}`}
/>
