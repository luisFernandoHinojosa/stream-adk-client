export const formatValue = (value: unknown): string => {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'string') return `"${value}"`;
	if (typeof value === 'boolean') return value.toString();
	if (typeof value === 'number') return value.toString();
	return String(value);
};
