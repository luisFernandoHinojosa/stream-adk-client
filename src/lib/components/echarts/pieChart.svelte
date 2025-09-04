<script lang="ts">
	//pieChart.svelte
	import { onMount } from 'svelte';
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

	// Variable para detectar móvil
	let isMobile = $state(false);

	// Detectar tamaño de pantalla
	function checkScreenSize() {
		isMobile = window.innerWidth < 640;
	}

	onMount(() => {
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	});

	const total = $derived(data.reduce((sum, item) => sum + item.value, 0));

	const option = $derived(
		(): EChartsOption => ({
			title: {
				text: title,
				left: 'center',
				top: 20,
				textStyle: {
					fontSize: isMobile ? 14 : 18, // Responsive font
					fontWeight: 'bold',
					color: theme === 'dark' ? '#ffffff' : '#374151'
				}
			},
			tooltip: {
				trigger: 'item',
				backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
				borderColor: theme === 'dark' ? '#6B7280' : '#E5E7EB',
				textStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151',
					fontSize: isMobile ? 12 : 14 // Responsive tooltip
				},
				formatter: (params: any) => {
					const percentage = ((params.value / total) * 100).toFixed(1);
					return `${params.name}<br/>
                ${params.marker}Valor: ${params.value}<br/>
                Porcentaje: ${percentage}%`;
				},
				confine: isMobile // Solo confinar en móvil
			},
			legend: {
				type: 'scroll',
				// Responsivo: horizontal abajo en móvil, vertical derecha en desktop
				orient: isMobile ? 'horizontal' : 'vertical',
				...(isMobile
					? { left: 'center', top: 'bottom', bottom: 10, right: undefined } // Móvil
					: { right: 10, top: 20, bottom: 20, left: undefined }), // Desktop (original)
				textStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151',
					fontSize: isMobile ? 11 : 12
				},
				pageTextStyle: {
					color: theme === 'dark' ? '#ffffff' : '#374151',
					fontSize: isMobile ? 10 : 12
				},
				// Tamaños de items responsivos
				itemWidth: isMobile ? 12 : 14,
				itemHeight: isMobile ? 8 : 10,
				itemGap: isMobile ? 8 : 10
			},
			series: [
				{
					name: title || 'Datos',
					type: 'pie',
					// Responsivo: radius y center
					radius: isMobile ? ['25%', '60%'] : [innerRadius, '70%'], // Móvil más pequeño
					center: isMobile ? ['50%', '45%'] : ['40%', '50%'], // Móvil centrado
					avoidLabelOverlap: isMobile ? true : false, // En móvil evitar overlap
					itemStyle: {
						borderRadius: isMobile ? 4 : 8, // Tu configuración original para desktop
						borderColor: theme === 'dark' ? '#1F2937' : '#ffffff',
						borderWidth: isMobile ? 1 : 2 // Tu configuración original para desktop
					},
					label: {
						show: showLabels,
						// Responsivo: inside en móvil, outside en desktop
						position: isMobile ? 'inside' : 'outside', // Tu configuración original para desktop
						color: theme === 'dark' ? '#ffffff' : '#374151',
						fontSize: isMobile ? 10 : 12,
						formatter: (params: any) => {
							if (isMobile) {
								// Móvil: solo porcentaje
								const percentage = ((params.value / total) * 100).toFixed(0);
								return `${percentage}%`;
							} else {
								// Desktop: tu formato original EXACTO
								if (!showPercentages) return params.name;
								const percentage = ((params.value / total) * 100).toFixed(1);
								return `${params.name}\n${percentage}%`;
							}
						},
						// Configuración adicional para labels internos en móvil
						...(isMobile && {
							distance: -5,
							rotate: 0,
							align: 'center',
							verticalAlign: 'middle'
						})
					},
					emphasis: {
						itemStyle: {
							shadowBlur: isMobile ? 5 : 10, // Tu configuración original para desktop
							shadowOffsetX: 0,
							shadowColor: isMobile ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)' // Tu configuración original
						},
						label: {
							show: true,
							fontSize: isMobile ? 12 : 14, // Tu configuración original
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: isMobile ? false : showLabels, // Tu configuración original para desktop
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
