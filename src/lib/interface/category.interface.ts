export interface Category {
	business_id: number;
	category_name: string;
	icon: number;
}

export interface CategoryResponse extends Category {
	category_id: number;
	created_at: string;
	updated_at: string;
}
