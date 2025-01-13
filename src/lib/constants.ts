// Validation Patterns
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PASSWORD_VALIDATIONS = [
	{
		description: 'at least 8 characters',
		test: (password: string) => password.length > 8
	},
	{
		description: 'at least 1 capital letter',
		test: (password: string) => /[A-Z]/.test(password)
	},
	{
		description: 'at least 1 number',
		test: (password: string) => /[0-9]/.test(password)
	},
	{
		description: 'at least 1 symbol (?~!@#%^&*()_+-=,:;|)',
		test: (password: string) => /[?~!@#%^&*()_+-=,:;|]/.test(password)
	},
	{
		description: 'matching passwords',
		test: (password: string, confirmPassword: string) => password === confirmPassword
	}
] as const;

// Geographic Data Constants
export const DISTANCE_THRESHOLD = 0.00009;
export const OFFSET_DISTANCE = 0.00015;
export const GNAF_ZOOM = 15;

// Community Types
export const COMMUNITY_TYPES = {
	BCYCA: 'BCYCA',
	TINONEE: 'TINONEE',
	MONDROOK: 'MONDROOK',
	EXTERNAL: 'EXTERNAL'
};

// Help Badge messages

export const admimHelpMessages = {
	site: {
		data: {
			addresses: {
				searhAddressHelp: 'This is the address that was checked for validity.',
				validatedAddressHelp:
					"This is the address from the NSW Government's GURAS Address Database that is attached to the property that was identified from the G-NAF address.",
				gnafAddressHelp:
					'This is the postal address from the Geocoded National Address File - (G-NAF) that most closely matches the search address.'
			}
		}
	}
};

// HTTP Status Codes
// Informational responses (1xx)
export const CONTINUE = 100;
export const SWITCHING_PROTOCOLS = 101;
export const PROCESSING = 102;
export const EARLY_HINTS = 103;

// Successful responses (2xx)
export const SUCCESS_OK = 200;
export const SUCCESS_CREATED = 201;
export const SUCCESS_ACCEPTED = 202;
export const SUCCESS_NON_AUTHORITATIVE_INFORMATION = 203;
export const SUCCESS_NO_CONTENT = 204;
export const SUCCESS_RESET_CONTENT = 205;
export const SUCCESS_PARTIAL_CONTENT = 206;
export const SUCCESS_MULTI_STATUS = 207;
export const SUCCESS_ALREADY_REPORTED = 208;
export const SUCCESS_IM_USED = 226;

// Redirection messages (3xx)
export const REDIRECT_MULTIPLE_CHOICES = 300;
export const REDIRECT_MOVED_PERMANENTLY = 301;
export const REDIRECT_FOUND = 302;
export const REDIRECT_SEE_OTHER = 303;
export const REDIRECT_NOT_MODIFIED = 304;
export const REDIRECT_USE_PROXY = 305;
export const REDIRECT_TEMPORARY_REDIRECT = 307;
export const REDIRECT_PERMANENT_REDIRECT = 308;

// Client error responses (4xx)
export const CLIENT_ERROR_BAD_REQUEST = 400;
export const CLIENT_ERROR_UNAUTHORIZED = 401;
export const CLIENT_ERROR_PAYMENT_REQUIRED = 402;
export const CLIENT_ERROR_FORBIDDEN = 403;
export const CLIENT_ERROR_NOT_FOUND = 404;
export const CLIENT_ERROR_METHOD_NOT_ALLOWED = 405;
export const CLIENT_ERROR_NOT_ACCEPTABLE = 406;
export const CLIENT_ERROR_PROXY_AUTHENTICATION_REQUIRED = 407;
export const CLIENT_ERROR_REQUEST_TIMEOUT = 408;
export const CLIENT_ERROR_CONFLICT = 409;
export const CLIENT_ERROR_GONE = 410;
export const CLIENT_ERROR_LENGTH_REQUIRED = 411;
export const CLIENT_ERROR_PRECONDITION_FAILED = 412;
export const CLIENT_ERROR_PAYLOAD_TOO_LARGE = 413;
export const CLIENT_ERROR_URI_TOO_LONG = 414;
export const CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE = 415;
export const CLIENT_ERROR_RANGE_NOT_SATISFIABLE = 416;
export const CLIENT_ERROR_EXPECTATION_FAILED = 417;
export const CLIENT_ERROR_IM_A_TEAPOT = 418;
export const CLIENT_ERROR_MISDIRECTED_REQUEST = 421;
export const CLIENT_ERROR_UNPROCESSABLE_ENTITY = 422;
export const CLIENT_ERROR_LOCKED = 423;
export const CLIENT_ERROR_FAILED_DEPENDENCY = 424;
export const CLIENT_ERROR_TOO_EARLY = 425;
export const CLIENT_ERROR_UPGRADE_REQUIRED = 426;
export const CLIENT_ERROR_PRECONDITION_REQUIRED = 428;
export const CLIENT_ERROR_TOO_MANY_REQUESTS = 429;
export const CLIENT_ERROR_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
export const CLIENT_ERROR_UNAVAILABLE_FOR_LEGAL_REASONS = 451;

// Server error responses (5xx)
export const SERVER_ERROR_INTERNAL_SERVER_ERROR = 500;
export const SERVER_ERROR_NOT_IMPLEMENTED = 501;
export const SERVER_ERROR_BAD_GATEWAY = 502;
export const SERVER_ERROR_SERVICE_UNAVAILABLE = 503;
export const SERVER_ERROR_GATEWAY_TIMEOUT = 504;
export const SERVER_ERROR_HTTP_VERSION_NOT_SUPPORTED = 505;
export const SERVER_ERROR_VARIANT_ALSO_NEGOTIATES = 506;
export const SERVER_ERROR_INSUFFICIENT_STORAGE = 507;
export const SERVER_ERROR_LOOP_DETECTED = 508;
export const SERVER_ERROR_NOT_EXTENDED = 510;
export const SERVER_ERROR_NETWORK_AUTHENTICATION_REQUIRED = 511;
