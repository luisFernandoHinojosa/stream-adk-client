import { SRC_IMG_DEFAULT } from '$lib/constants';
import type { BusinessResponse } from '$lib/interface';

export const defaultBusinesses: BusinessResponse[] = [
	{
		business_id: 0,
		business_name: 'Electrogar',
		business_description:
			'We specialize in the sale of technology products, appliances, and household items, always offering the best brands at competitive prices.',
		whatsapp_url: '67787486',
		instagram_url: null,
		facebook_url: null,
		tiktok_url: null,
		email: 'luis111ferrrivera@gmail.com',
		address: 'Calle 123, Ciudad, Bolivia',
		address_url: null,
		created_at: '',
		updated_at: '',
		logo_path: SRC_IMG_DEFAULT
	},
	{
		business_id: 1,
		business_name: 'Hotel Europa',
		business_description:
			"The Europa offers full-service spa services and is located 17 minutes' drive from El Alto International Airport in Bolivia. It offers an indoor pool and free Wi-Fi.",
		whatsapp_url: '67787486',
		instagram_url: null,
		facebook_url: null,
		tiktok_url: null,
		email: 'luis111ferrrivera@gmail.com',
		address: 'Calle 123, Ciudad, Bolivia',
		address_url: null,
		created_at: '',
		updated_at: '',
		logo_path: SRC_IMG_DEFAULT
	},
	{
		business_id: 2,
		business_name: 'Hospital Peñarando',
		business_description:
			'This is not just a hospital, but an advanced, accessible healthcare facility that genuinely cares about family well-being. We aim to merge preventive care, diagnostic care, specialized care, and emergency care into one, so that every phase of healthcare is covered.',
		whatsapp_url: '67787486',
		instagram_url: null,
		facebook_url: null,
		tiktok_url: null,
		email: 'luis111ferrrivera@gmail.com',
		address: 'Calle 123, Ciudad, Bolivia',
		address_url: null,
		created_at: '',
		updated_at: '',
		logo_path: SRC_IMG_DEFAULT
	}
];
