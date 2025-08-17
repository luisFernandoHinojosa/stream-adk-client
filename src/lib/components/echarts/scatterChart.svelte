<script lang="ts">
	import type { ScatterData } from '$lib/interface';
	import BaseChart from './baseChart.svelte';
	import type { EChartsOption } from 'echarts';

	//PROPS
	const {
		data = [],
		title = '',
		xAxisName = 'X Axis',
		yAxisName = 'Y Axis',
		height = '400px',
		theme = 'light',
		loading = false,
		className = '',
		showBrushSelect = false
	} = $props<{
		data?: ScatterData[];
		title?: string;
		xAxisName?: string;
		yAxisName?: string;
		height?: string;
		theme?: 'light' | 'dark';
		loading?: boolean;
		className?: string;
		showBrushSelect?: boolean;
	}>();

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
				trigger: 'item',
				backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
				borderColor: theme === 'dark' ? '#6B7280' : '#E5E7EB',
				textStyle: { color: theme === 'dark' ? '#ffffff' : '#374151' },
				formatter: (params: any) =>
					`${params.seriesName}<br/>
                ${xAxisName}: ${params.value[0]}<br/>
                ${yAxisName}: ${params.value[1]}`
			},
			legend: {
				show: data.length > 1,
				bottom: 10,
				textStyle: { color: theme === 'dark' ? '#ffffff' : '#374151' }
			},
			brush: showBrushSelect ? { toolbox: ['rect', 'polygon', 'clear'], xAxisIndex: 0 } : undefined,
			toolbox: showBrushSelect
				? {
						feature: { brush: { type: ['rect', 'polygon', 'clear'] } },
						iconStyle: { borderColor: theme === 'dark' ? '#ffffff' : '#374151' },
						emphasis: { iconStyle: { borderColor: '#3B82F6' } }
					}
				: undefined,
			grid: {
				left: '10%',
				right: '4%',
				bottom: data.length > 1 || showBrushSelect ? '15%' : '10%',
				top: '15%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				name: xAxisName,
				nameLocation: 'middle',
				nameGap: 30,
				nameTextStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151',
					fontSize: 14
				},
				axisLine: { lineStyle: { color: theme === 'dark' ? '#6B7280' : '#E5E7EB' } },
				axisLabel: { color: theme === 'dark' ? '#D1D5DB' : '#6B7280' },
				splitLine: { lineStyle: { color: theme === 'dark' ? '#374151' : '#F3F4F6' } }
			},
			yAxis: {
				type: 'value',
				name: yAxisName,
				nameLocation: 'middle',
				nameGap: 50,
				nameTextStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151',
					fontSize: 14
				},
				axisLine: { lineStyle: { color: theme === 'dark' ? '#6B7280' : '#E5E7EB' } },
				axisLabel: { color: theme === 'dark' ? '#D1D5DB' : '#6B7280' },
				splitLine: { lineStyle: { color: theme === 'dark' ? '#374151' : '#F3F4F6' } }
			},
			series: data.map((series, index) => ({
				name: series.name,
				type: 'scatter',
				data: series.data,
				symbolSize: series.symbolSize ?? 8,
				itemStyle: {
					color: series.color ?? getDefaultColor(index),
					opacity: 0.7
				},
				emphasis: {
					focus: 'series',
					itemStyle: {
						opacity: 1,
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 0, 0.3)'
					}
				}
			}))
		})
	);

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
</script>

<BaseChart
	option={option()}
	{height}
	{loading}
	theme={theme === 'dark' ? 'dark' : 'default'}
	className={`scatter-chart ${className}`}
/>
