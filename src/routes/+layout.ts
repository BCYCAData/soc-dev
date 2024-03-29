import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { combineChunks, createBrowserClient, isBrowser, parse } from '@supabase/ssr';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');
	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}
				const cookie = combineChunks(key, (name) => {
					const cookies = parse(document.cookie);
					return cookies[name];
				});
				return cookie;
				// const cookie = parse(document.cookie)
				// return cookie[key]
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};

// In my layout.ts I call superValidate with the schema, but the data doesn't yet have a way of knowing what to populate the form with:
// // layout.ts
// const captionForm = await superValidate(captionFormSchema)

// return { captionForm }

// So it's picked up by the page(s) and passed to the modal:
// 	// page.svelte

// ciscoheat — 12 / 15 / 2023 2:02 PM
// When you pass captionForm to the component, overwrite its data property with the spread operator(edited)
// [2:03 PM]
// <Modal captionForm={ {...data.captionForm, data: newData } } />
const data = {
	supabase: {
		supabaseUrl: 'https://swyytxokzdqqitszxaep.supabase.co',
		supabaseKey:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A',
		realtimeUrl: 'wss://swyytxokzdqqitszxaep.supabase.co/realtime/v1',
		authUrl: 'https://swyytxokzdqqitszxaep.supabase.co/auth/v1',
		storageUrl: 'https://swyytxokzdqqitszxaep.supabase.co/storage/v1',
		functionsUrl: 'https://swyytxokzdqqitszxaep.supabase.co/functions/v1',
		storageKey: 'sb-swyytxokzdqqitszxaep-auth-token',
		headers: {
			'X-Client-Info': 'supabase-ssr/0.1.0'
		},
		auth: {
			memoryStorage: null,
			stateChangeEmitters: {},
			autoRefreshTicker: 27,
			refreshingDeferred: null,
			initializePromise: {},
			detectSessionInUrl: true,
			lockAcquired: false,
			pendingInLock: [],
			broadcastChannel: {},
			instanceID: 0,
			logDebugMessages: false,
			persistSession: true,
			storageKey: 'sb-swyytxokzdqqitszxaep-auth-token',
			autoRefreshToken: true,
			admin: {
				url: 'https://swyytxokzdqqitszxaep.supabase.co/auth/v1',
				headers: {
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A',
					apikey:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A',
					'X-Client-Info': 'supabase-ssr/0.1.0'
				},
				mfa: {}
			},
			url: 'https://swyytxokzdqqitszxaep.supabase.co/auth/v1',
			headers: {
				Authorization:
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A',
				apikey:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A',
				'X-Client-Info': 'supabase-ssr/0.1.0'
			},
			flowType: 'pkce',
			mfa: {},
			storage: {
				isServer: false
			}
		},
		realtime: {
			accessToken:
				'eyJhbGciOiJIUzI1NiIsImtpZCI6InhLbEdKYTd6eU9odGVIV2giLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzExMjQwNDkxLCJpYXQiOjE3MTEyMzY4OTEsImlzcyI6Imh0dHBzOi8vc3d5eXR4b2t6ZHFxaXRzenhhZXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjUyZDJiNDNmLTlkNmUtNGQ2YS04OTBjLTJjNjU4ZDczNzhiNCIsImVtYWlsIjoiYWxhbmtlb3duQHNvdXRoZXJucGhvbmUuY29tLmF1IiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsia2l0ZGF0ZSI6bnVsbCwicHJpbmNpcGFsYWRkcmVzc3NpdGVvaWQiOjMwNzgxMjksInByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXSwicm9sZXMiOltdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzA4NDExNDUyfV0sInNlc3Npb25faWQiOiIwZmI2MDBjMC03OTJiLTQ2NWMtOGFkNC05YzhhMDFhZWI0YjYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.lEFqGi2RI17ACbbuFISQXkQQZf3HwChKV9MBkcAQYy4',
			apiKey:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A',
			channels: [],
			endPoint: 'wss://swyytxokzdqqitszxaep.supabase.co/realtime/v1/websocket',
			headers: {
				'X-Client-Info': 'supabase-ssr/0.1.0'
			},
			params: {
				apikey:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eXl0eG9remRxcWl0c3p4YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4MDg4MDIsImV4cCI6MTk4NjM4NDgwMn0.Yv8J7rYrtbMd7TH7TMqmx7-pMGJ21xh7rPkkVqgd24A'
			},
			timeout: 10000,
			heartbeatIntervalMs: 30000,
			pendingHeartbeatRef: null,
			ref: 0,
			conn: null,
			sendBuffer: [],
			serializer: {
				HEADER_LENGTH: 1
			},
			stateChangeCallbacks: {
				open: [],
				close: [],
				error: [],
				message: []
			},
			transport: null,
			reconnectTimer: {
				tries: 0
			}
		},
		rest: {
			url: 'https://swyytxokzdqqitszxaep.supabase.co/rest/v1',
			headers: {
				'X-Client-Info': 'supabase-ssr/0.1.0'
			},
			schemaName: 'public'
		},
		changedAccessToken:
			'eyJhbGciOiJIUzI1NiIsImtpZCI6InhLbEdKYTd6eU9odGVIV2giLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzExMjQwNDkxLCJpYXQiOjE3MTEyMzY4OTEsImlzcyI6Imh0dHBzOi8vc3d5eXR4b2t6ZHFxaXRzenhhZXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjUyZDJiNDNmLTlkNmUtNGQ2YS04OTBjLTJjNjU4ZDczNzhiNCIsImVtYWlsIjoiYWxhbmtlb3duQHNvdXRoZXJucGhvbmUuY29tLmF1IiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsia2l0ZGF0ZSI6bnVsbCwicHJpbmNpcGFsYWRkcmVzc3NpdGVvaWQiOjMwNzgxMjksInByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXSwicm9sZXMiOltdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzA4NDExNDUyfV0sInNlc3Npb25faWQiOiIwZmI2MDBjMC03OTJiLTQ2NWMtOGFkNC05YzhhMDFhZWI0YjYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.lEFqGi2RI17ACbbuFISQXkQQZf3HwChKV9MBkcAQYy4'
	},
	session: {
		access_token:
			'eyJhbGciOiJIUzI1NiIsImtpZCI6InhLbEdKYTd6eU9odGVIV2giLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzExMjQwNDkxLCJpYXQiOjE3MTEyMzY4OTEsImlzcyI6Imh0dHBzOi8vc3d5eXR4b2t6ZHFxaXRzenhhZXAuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjUyZDJiNDNmLTlkNmUtNGQ2YS04OTBjLTJjNjU4ZDczNzhiNCIsImVtYWlsIjoiYWxhbmtlb3duQHNvdXRoZXJucGhvbmUuY29tLmF1IiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsia2l0ZGF0ZSI6bnVsbCwicHJpbmNpcGFsYWRkcmVzc3NpdGVvaWQiOjMwNzgxMjksInByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXSwicm9sZXMiOltdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzA4NDExNDUyfV0sInNlc3Npb25faWQiOiIwZmI2MDBjMC03OTJiLTQ2NWMtOGFkNC05YzhhMDFhZWI0YjYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.lEFqGi2RI17ACbbuFISQXkQQZf3HwChKV9MBkcAQYy4',
		token_type: 'bearer',
		expires_in: 3600,
		expires_at: 1711240491,
		refresh_token: 'XgMHLXaM2afFiNVz-R0Iyg',
		user: {
			id: '52d2b43f-9d6e-4d6a-890c-2c658d7378b4',
			aud: 'authenticated',
			role: 'authenticated',
			email: 'alankeown@southernphone.com.au',
			email_confirmed_at: '2024-02-20T06:44:12.105811Z',
			phone: '',
			confirmation_sent_at: '2024-02-20T06:43:55.493903Z',
			confirmed_at: '2024-02-20T06:44:12.105811Z',
			last_sign_in_at: '2024-02-20T06:44:12.106501Z',
			app_metadata: {
				kitdate: null,
				principaladdresssiteoid: 3078129,
				provider: 'email',
				providers: ['email'],
				roles: []
			},
			user_metadata: {},
			identities: [
				{
					identity_id: 'c0cd335f-2b34-46ff-ab13-45764e9491e8',
					id: '52d2b43f-9d6e-4d6a-890c-2c658d7378b4',
					user_id: '52d2b43f-9d6e-4d6a-890c-2c658d7378b4',
					identity_data: {
						email: 'alankeown@southernphone.com.au',
						email_verified: false,
						phone_verified: false,
						sub: '52d2b43f-9d6e-4d6a-890c-2c658d7378b4'
					},
					provider: 'email',
					last_sign_in_at: '2024-02-20T06:43:55.487178Z',
					created_at: '2024-02-20T06:43:55.487223Z',
					updated_at: '2024-02-20T06:43:55.487223Z',
					email: 'alankeown@southernphone.com.au'
				}
			],
			created_at: '2024-02-20T06:43:55.477951Z',
			updated_at: '2024-03-23T23:34:51.825581Z',
			is_anonymous: false
		}
	},
	profileMessagesData: [
		{
			id: 14,
			message: 'Should be in both panels',
			created_at: '09/02/2023 22:48'
		}
	],
	propertyId: '3a9a9e38-b64f-42e9-912f-fe175d322e0c',
	propertyWasRented: true,
	communityName: 'BCYCA',
	propertyAddress: {
		property_address_street: '5348 THE BUCKETTS WAY',
		property_address_suburb: 'BURRELL CREEK',
		property_address_postcode: '2429'
	},
	propertyProfile: {
		phone: null,
		mobile_reception: null,
		sign_posted: null,
		other_essential_assets: null,
		residents0_18: null,
		residents19_50: null,
		residents51_70: null,
		residents71_: null,
		vulnerable_residents: null,
		number_birds: null,
		number_cats: null,
		number_dogs: null,
		number_other_pets: null,
		live_stock_present: null,
		live_stock_safe_area: null,
		share_livestock_safe_area: null,
		static_water_available: [0],
		have_stortz: null,
		stortz_size: null,
		truck_access: null,
		truck_access_other_information: null,
		fire_fighting_resources: [],
		fire_hazard_reduction: [],
		site_hazards: [],
		other_hazards: null,
		other_site_hazards: null,
		land_adjacent_hazard: null,
		property_rented: true
	},
	property_agent: {
		agent_mobile: '',
		agent_name: '',
		agent_phone: ''
	},
	userProfile: {
		family_name: 'Keown',
		fire_fighting_experience: 4,
		fire_trauma: null,
		first_name: 'Alan',
		mobile: '0497022623',
		other_comments: null,
		plan_to_leave_before_fire: 3,
		plan_to_leave_before_flood: null,
		residency_profile: 6,
		rfs_survival_plan: 'Y',
		stay_in_touch_choices: [0]
	},
	user_postal_address: {
		postal_address_postcode: '',
		postal_address_street: '',
		postal_address_suburb: ''
	},
	community_bcyca_profile: {
		community_meeting_choices: [],
		community_workshop_choices: [],
		information_sheet_choices: [],
		other_community_meeting: null,
		other_community_workshop: null,
		other_information_sheet: null,
		stay_in_touch_choices: [],
		will_run_community_workshops: null
	},
	community_tinonee_profile: {
		community_meeting_choices: [],
		community_workshop_choices: [],
		information_sheet_choices: [],
		other_community_meeting: null,
		other_community_workshop: 'Maybe',
		other_information_sheet: null,
		stay_in_touch_choices: [],
		will_run_community_workshops: null
	},
	community_mondrook_profile: null,
	community_external_profile: null
};
