export interface EventMetadata {
	event_metadata_key: string;
	event_metadata_value: string;
}

export interface CustomerEvent {
	customer_id: number;
	employee_id: number;
	event_category_id: number;
	event_type: string;
	event_datetime: string;
	event_sentiment_score: number;
	event_summary: string;
	event_tags: string[];
	sales_stage: string;
	customer_sale: string;
	product_name: string;
	likelihood_to_convert: number;
	urgency_score: number;
	event_metadata_list: EventMetadata[];
	event_id: number;
	created_at: string;
	updated_at: string;
}

export interface Customer {
	customer_id: number;
	company_id: number;
	customer_name: string;
	customer_type: 'individual' | string;
	industry: string;
	customer_website: string;
	customer_email: string;
	customer_phone: string;
	customer_health_score: number;
	churn_risk_score: number;
	preferred_communication: string;
	customer_status: string;
	engagement_level: string;
	interest_category: string;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	events?: CustomerEvent[];
}
