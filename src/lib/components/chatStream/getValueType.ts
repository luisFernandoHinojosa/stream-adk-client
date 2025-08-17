export const getValueType = (value: unknown): string => {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'boolean') return 'boolean';
	if (typeof value === 'number') return 'number';
	if (typeof value === 'string') return 'string';
	if (Array.isArray(value)) return 'array';
	if (typeof value === 'object') return 'object';
	return 'unknown';
};
