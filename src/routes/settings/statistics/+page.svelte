<script lang="ts">
	import { onMount } from 'svelte';
	import type { LineChartData } from '$lib/interface';
	import type { BarChartData } from '$lib/interface';
	import type { PieChartData } from '$lib/interface';
	import type { ScatterData } from '$lib/interface';
	import LineChart from '$lib/components/echarts/lineChart.svelte';
	import BarChart from '$lib/components/echarts/barChart.svelte';
	import PieChart from '$lib/components/echarts/pieChart.svelte';
	import ScatterChart from '$lib/components/echarts/scatterChart.svelte';
	let currentTheme: 'light' | 'dark' = 'light';
	let isLoading = true;

	// Datos para el grafico de lineas
	let lineData: LineChartData[] = [];
	let lineLabels: string[] = [];

	// Datos para el grafico de barras
	let barData: BarChartData[] = [];
	let barCategories: string[] = [];

	// Datos para el grafico circular
	let pieData: PieChartData[] = [];

	// Datos para el grafico de dispersión
	let scatterData: ScatterData[] = [];

	// Simular carga de datos
	onMount(() => {
		setTimeout(() => {
			loadChartData();
			isLoading = false;
		}, 1000);
	});

	function loadChartData() {
		// Datos para grafico de lineas
		lineLabels = [
			'Ene',
			'Feb',
			'Mar',
			'Abr',
			'May',
			'Jun',
			'Jul',
			'Ago',
			'Sep',
			'Oct',
			'Nov',
			'Dic'
		];
		lineData = [
			{
				name: 'Ventas 2023',
				data: [820, 932, 901, 934, 1290, 1330, 1320, 1200, 1100, 1350, 1400, 1500],
				color: '#3B82F6',
				smooth: true
			},
			{
				name: 'Ventas 2024',
				data: [720, 1032, 1101, 1234, 1390, 1430, 1520, 1400, 1300, 1450, 1600, 1700],
				color: '#EF4444',
				smooth: true
			}
		];

		// Datos para grafico de barras
		barCategories = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];
		barData = [
			{
				name: 'Q1 2024',
				data: [320, 450, 280, 380, 420],
				color: '#10B981'
			},
			{
				name: 'Q2 2024',
				data: [380, 520, 340, 420, 490],
				color: '#F59E0B'
			}
		];

		// Datos para grafico circular
		pieData = [
			{ name: 'Desktop', value: 1048, color: '#3B82F6' },
			{ name: 'Mobile', value: 735, color: '#EF4444' },
			{ name: 'Tablet', value: 580, color: '#10B981' },
			{ name: 'Smart TV', value: 484, color: '#F59E0B' },
			{ name: 'Others', value: 300, color: '#8B5CF6' }
		];

		// Datos para grafico de dispersión
		scatterData = [
			{
				name: 'Serie A',
				data: generateScatterData(50, 10, 60, 20, 80),
				color: '#3B82F6',
				symbolSize: 10
			},
			{
				name: 'Serie B',
				data: generateScatterData(50, 30, 80, 40, 100),
				color: '#EF4444',
				symbolSize: 8
			}
		];
	}

	function generateScatterData(
		count: number,
		xMin: number,
		xMax: number,
		yMin: number,
		yMax: number
	): [number, number][] {
		const data: [number, number][] = [];
		for (let i = 0; i < count; i++) {
			const x = Math.random() * (xMax - xMin) + xMin;
			const y = Math.random() * (yMax - yMin) + yMin;
			data.push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
		}
		return data;
	}
</script>

<main class="min-h-screen bg-light-one transition-colors duration-200 dark:bg-dark-one">
	<!-- <iframe src="https://vizta.link" width="600" height="400" title="ChatGPT"></iframe>
	<embed src="https://vizta.link" width="600" height="400" /> -->

	<!-- Content -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Grid de graficos -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Grafico de lineas -->
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						Evolución de Ventas
					</h2>
					<p class="text-gray-600 dark:text-gray-400">Comparación mensual entre 2024 y 2025</p>
				</div>
				<LineChart
					data={lineData}
					xAxisLabels={lineLabels}
					title="Ventas Mensuales"
					theme={currentTheme}
					loading={isLoading}
					height="350px"
					showGrid={true}
					showLegend={true}
				/>
			</div>

			<!-- Grafico de barras -->
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						Ventas por Producto
					</h2>
					<p class="text-gray-600 dark:text-gray-400">Comparación trimestral Q1 vs Q2 2025</p>
				</div>
				<BarChart
					data={barData}
					categories={barCategories}
					title="Ventas Trimestrales"
					theme={currentTheme}
					loading={isLoading}
					height="350px"
					horizontal={false}
					stacked={false}
					showDataLabels={false}
				/>
			</div>

			<!-- Grafico circular -->
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						Distribución por Dispositivo
					</h2>
					<p class="text-gray-600 dark:text-gray-400">Tráfico web por tipo de dispositivo</p>
				</div>
				<PieChart
					data={pieData}
					title="Tráfico por Dispositivo"
					theme={currentTheme}
					loading={isLoading}
					height="350px"
					showLabels={true}
					showPercentages={true}
					innerRadius="0%"
				/>
			</div>

			<!-- Grafico de dispersión -->
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						Análisis de Correlación
					</h2>
					<p class="text-gray-600 dark:text-gray-400">Relación entre variables X e Y</p>
				</div>
				<ScatterChart
					data={scatterData}
					title="Diagrama de Dispersión"
					xAxisName="Precios"
					yAxisName="Ventas"
					theme={currentTheme}
					loading={isLoading}
					height="350px"
					showBrushSelect={false}
				/>
			</div>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Grafico de barras horizontal -->
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
						Top Productos (Horizontal)
					</h2>
					<p class="text-gray-600 dark:text-gray-400">Ranking de productos más vendidos</p>
				</div>
				<BarChart
					data={[
						{
							name: 'Ventas',
							data: [420, 380, 340, 280, 450],
							color: '#8B5CF6'
						}
					]}
					categories={barCategories}
					title=""
					theme={currentTheme}
					loading={isLoading}
					height="300px"
					horizontal={true}
					showDataLabels={true}
				/>
			</div>

			<!-- app.svelte -->
			<div class="rounded-xl bg-white p-3 shadow-lg sm:p-6 dark:bg-gray-800">
				<div class="mb-3 sm:mb-4">
					<h2 class="mb-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
						Distribución de Ingresos
					</h2>
					<p class="text-sm text-gray-600 sm:text-base dark:text-gray-400">
						Porcentaje de ingresos por categoría
					</p>
				</div>
				<PieChart
					data={[
						{ name: 'Servicios', value: 60, color: '#3B82F6' },
						{ name: 'Productos', value: 30, color: '#10B981' },
						{ name: 'Otros', value: 10, color: '#F59E0B' }
					]}
					title=""
					theme={currentTheme}
					loading={isLoading}
					height="280px"
					innerRadius="30%"
					className="w-full"
				/>
			</div>
		</div>
	</div>
</main>
