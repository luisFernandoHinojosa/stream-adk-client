export interface BarChartData {
	name: string;
	data: number[];
	color?: string;
}

export interface ScatterData {
	name: string;
	data: [number, number][];
	color?: string;
	symbolSize?: number | ((value: [number, number]) => number);
}

export interface PieChartData {
	name: string;
	value: number;
	color?: string;
}
export interface LineChartData {
	name: string;
	data: number[];
	color?: string;
	smooth?: boolean;
}
