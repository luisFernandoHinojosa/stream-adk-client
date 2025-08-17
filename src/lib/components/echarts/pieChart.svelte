<script lang="ts">
	import type { PieChartData } from '$lib/interface';
	import BaseChart from './baseChart.svelte';
	import type { EChartsOption } from 'echarts';

	// PROPS
	const {
		data = [],
		title = '',
		height = '400px',
		showLabels = true,
		showPercentages = true,
		innerRadius = '0%',
		theme = 'light',
		loading = false,
		className = ''
	} = $props<{
		data?: PieChartData[];
		title?: string;
		height?: string;
		showLabels?: boolean;
		showPercentages?: boolean;
		innerRadius?: string;
		theme?: 'light' | 'dark';
		loading?: boolean;
		className?: string;
	}>();

	const total = $derived(data.reduce((sum, item) => sum + item.value, 0));

	const option = $derived(
		(): EChartsOption => ({
			title: {
				text: title,
				left: 'center',
				top: 20,
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
				textStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151'
				},
				formatter: (params: any) => {
					const percentage = ((params.value / total) * 100).toFixed(1);
					return `${params.name}<br/>
                ${params.marker}Valor: ${params.value}<br/>
                Porcentaje: ${percentage}%`;
				}
			},
			legend: {
				type: 'scroll',
				orient: 'vertical',
				right: 10,
				top: 20,
				bottom: 20,
				textStyle: { color: theme === 'dark' ? '#ffffff' : '#374151' },
				pageTextStyle: { color: theme === 'dark' ? '#ffffff' : '#374151' }
			},
			series: [
				{
					name: title || 'Datos',
					type: 'pie',
					radius: [innerRadius, '70%'],
					center: ['40%', '50%'],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 8,
						borderColor: theme === 'dark' ? '#1F2937' : '#ffffff',
						borderWidth: 2
					},
					label: {
						show: showLabels,
						position: 'outside',
						color: theme === 'dark' ? '#ffffff' : '#374151',
						formatter: (params: any) => {
							if (!showPercentages) return params.name;
							const percentage = ((params.value / total) * 100).toFixed(1);
							return `${params.name}\n${percentage}%`;
						}
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						},
						label: {
							show: true,
							fontSize: 14,
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: showLabels,
						lineStyle: {
							color: theme === 'dark' ? '#6B7280' : '#9CA3AF'
						}
					},
					data: data.map((item, index) => ({
						name: item.name,
						value: item.value,
						itemStyle: {
							color: item.color ?? getDefaultColor(index)
						}
					}))
				}
			]
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
			'#F97316',
			'#6366F1',
			'#84CC16',
			'#F43F5E',
			'#06B6D4'
		];
		return colors[index % colors.length];
	}
</script>

<BaseChart
	option={option()}
	{height}
	{loading}
	theme={theme === 'dark' ? 'dark' : 'default'}
	className={`pie-chart ${className}`}
/>
