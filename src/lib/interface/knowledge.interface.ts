export interface Knowledge {
	id: number;
	business_id: number;
	title: string;
	content: string;
	content_type: 'text' | 'faq' | 'policy' | 'product' | 'service';
}
