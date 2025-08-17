export interface Item {
	business_id: number;
	item_name: string;
	item_description: string;
	price: number;
	price_discount: number | null;
	image: string;
	is_visible: boolean;
	categories: number[];
}

export interface ItemResponse extends Item {
	item_id: number;
	created_at: string;
	updated_at: string;
}

export interface ImageItem {
	business_id: number;
	item_id: number;
	image: string;
}
