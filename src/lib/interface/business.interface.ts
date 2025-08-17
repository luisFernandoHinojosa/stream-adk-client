export interface Business {
	business_name: string;
	business_description: string;
	whatsapp_url: string | null;
	instagram_url: string | null;
	facebook_url: string | null;
	tiktok_url: string | null;
	email: string | null;
	address: string;
	address_url: string | null;
	logo_path: string | null;
}

export interface BusinessResponse extends Business {
	business_id: number;
	created_at: string;
	updated_at: string;
}

export interface LogoBusiness {
	business_id: number;
	logo_path: string | null;
}
