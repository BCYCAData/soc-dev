/**
 * Capture documentation screenshots for the socdocs site.
 *
 * Usage:
 *   node scripts/docs-screenshots.ts [--list] [--only <substring>]
 *
 * Environment:
 *   DOCS_SHOTS_BASE_URL        target app (default http://localhost:5173)
 *   DOCS_SHOTS_OUTPUT_DIR      output root (default ../socdocs/static/images/docs)
 *   DOCS_SHOTS_RESIDENT_EMAIL / DOCS_SHOTS_RESIDENT_PASSWORD
 *   DOCS_SHOTS_COORDINATOR_EMAIL / DOCS_SHOTS_COORDINATOR_PASSWORD
 *   DOCS_SHOTS_ADMIN_EMAIL / DOCS_SHOTS_ADMIN_PASSWORD
 *   DOCS_SHOTS_COMMUNITY       community slug for community pages (default bcyca)
 *   DOCS_SHOTS_PROPERTY_ID     property id (default: first property link found)
 *   DOCS_SHOTS_KYNG_AREA       kyng area slug (default: first area link found)
 *   DOCS_SHOTS_ALLOW_PROD=1    override the production-database guard
 *
 * Captures are viewport shots at 1440x900 (per the socdocs design doc) and are
 * written as webp named after the socdocs page they illustrate. Roles without
 * credentials in the environment are skipped with a warning, so a bare run
 * still captures all public pages. Authenticated captures refuse to run
 * against the production Supabase project: seed demo accounts in the dev
 * project instead (see socdocs technical/documentation/screenshot-workflow).
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

type Role = 'public' | 'resident' | 'coordinator' | 'admin';

type Shot = {
	/** socdocs page this capture illustrates; also the output path (<page>.webp) */
	page: string;
	/** app route; may contain [propertyid], [kyng_area], or {community} */
	route: string;
	role: Role;
	/** extra settle time after network idle, for maps and other async widgets */
	settleMs?: number;
};

const PROD_SUPABASE_REFS = ['rcnccgyvdgmcnomwcaja'];
const VIEWPORT = { width: 1440, height: 900 };
const MAP_SETTLE_MS = 4000;

const SHOTS: Shot[] = [
	// User Guide — getting started (public pages except the survey)
	{ page: 'user/getting-started/create-your-account', route: '/auth/signup', role: 'public' },
	{ page: 'user/getting-started/sign-in-and-out', route: '/auth/signin', role: 'public' },
	{
		page: 'user/getting-started/reset-your-password',
		route: '/auth/requestresetpassword',
		role: 'public'
	},
	{
		page: 'user/getting-started/the-onboarding-survey',
		route: '/personal-profile-form',
		role: 'resident'
	},
	// User Guide — profile
	{ page: 'user/your-profile/profile-overview', route: '/personal-profile', role: 'resident' },
	{ page: 'user/your-profile/about-me', route: '/personal-profile/aboutme', role: 'resident' },
	{ page: 'user/your-profile/settings', route: '/personal-profile/my-settings', role: 'resident' },
	// User Guide — property
	{
		page: 'user/your-property/property-overview',
		route: '/personal-profile/my-property',
		role: 'resident'
	},
	{
		page: 'user/your-property/assets',
		route: '/personal-profile/my-property/[propertyid]/assets',
		role: 'resident'
	},
	{
		page: 'user/your-property/hazards',
		route: '/personal-profile/my-property/[propertyid]/hazards',
		role: 'resident'
	},
	{
		page: 'user/your-property/my-map',
		route: '/personal-profile/my-property/[propertyid]/my-map',
		role: 'resident',
		settleMs: MAP_SETTLE_MS
	},
	{
		page: 'user/your-property/resources',
		route: '/personal-profile/my-property/[propertyid]/resources',
		role: 'resident'
	},
	// User Guide — community
	{
		page: 'user/your-community/community-overview',
		route: '/personal-profile/my-community',
		role: 'resident'
	},
	{
		page: 'user/your-community/events',
		route: '/personal-profile/my-community/{community}/events',
		role: 'resident'
	},
	{
		page: 'user/your-community/information',
		route: '/personal-profile/my-community/{community}/information',
		role: 'resident'
	},
	{
		page: 'user/your-community/community-map',
		route: '/personal-profile/my-community/{community}/map',
		role: 'resident',
		settleMs: MAP_SETTLE_MS
	},
	{
		page: 'user/your-community/workshops',
		route: '/personal-profile/my-community/{community}/workshops',
		role: 'resident'
	},
	// Administrator Guide — introduction
	{ page: 'admin/introduction/the-admin-dashboard', route: '/admin', role: 'admin' },
	// Administrator Guide — KYNG coordinators
	{
		page: 'admin/kyng-coordinators/your-dashboard',
		route: '/kyng-coordinator',
		role: 'coordinator'
	},
	{
		page: 'admin/kyng-coordinators/area-map',
		route: '/kyng-coordinator/[kyng_area]/map',
		role: 'coordinator',
		settleMs: MAP_SETTLE_MS
	},
	{
		page: 'admin/kyng-coordinators/unregistered-addresses',
		route: '/kyng-coordinator/[kyng_area]/unregistered-addresses',
		role: 'coordinator'
	},
	{
		page: 'admin/kyng-coordinators/resident-admin',
		route: '/kyng-coordinator/[kyng_area]/user-admin',
		role: 'coordinator'
	},
	// Administrator Guide — community administration
	{ page: 'admin/community-administration/overview', route: '/admin/community', role: 'admin' },
	{
		page: 'admin/community-administration/managing-events',
		route: '/admin/community/{community}/events',
		role: 'admin'
	},
	{
		page: 'admin/community-administration/managing-information',
		route: '/admin/community/{community}/information',
		role: 'admin'
	},
	{
		page: 'admin/community-administration/community-map',
		route: '/admin/community/{community}/map',
		role: 'admin',
		settleMs: MAP_SETTLE_MS
	},
	{
		page: 'admin/community-administration/managing-workshops',
		route: '/admin/community/{community}/workshops',
		role: 'admin'
	},
	// Administrator Guide — emergency tools
	{ page: 'admin/emergency-tools/reports', route: '/admin/emergency/reports', role: 'admin' },
	{
		page: 'admin/emergency-tools/service-map',
		route: '/admin/emergency/service-map',
		role: 'admin',
		settleMs: MAP_SETTLE_MS
	},
	// Administrator Guide — site administration
	{
		page: 'admin/site-administration/address-data',
		route: '/admin/site/data/addresses',
		role: 'admin'
	},
	{
		page: 'admin/site-administration/spatial-data',
		route: '/admin/site/data/spatial',
		role: 'admin'
	},
	{
		page: 'admin/site-administration/kyng-boundaries',
		route: '/admin/site/data/kyng-boundaries',
		role: 'admin',
		settleMs: MAP_SETTLE_MS
	},
	{ page: 'admin/site-administration/messages', route: '/admin/site/messages', role: 'admin' },
	{
		page: 'admin/site-administration/roles-and-permissions',
		route: '/admin/site/roles/permissions',
		role: 'admin'
	},
	{
		page: 'admin/site-administration/profile-requirements',
		route: '/admin/site/profile-requirements',
		role: 'admin'
	},
	// Administrator Guide — user management
	{ page: 'admin/user-management/adding-users', route: '/admin/users/new', role: 'admin' },
	{ page: 'admin/user-management/kits', route: '/admin/users/kits', role: 'admin' },
	{
		page: 'admin/user-management/kyng-coordinator-assignment',
		route: '/admin/users/kyng-coordinators',
		role: 'admin'
	}
];

const baseUrl = process.env.DOCS_SHOTS_BASE_URL ?? 'http://localhost:5173';
const outputDir = path.resolve(
	process.env.DOCS_SHOTS_OUTPUT_DIR ?? '../socdocs/static/images/docs'
);
const community = process.env.DOCS_SHOTS_COMMUNITY ?? 'bcyca';

function loadAppEnv(): void {
	for (const file of ['.env.local', '.env']) {
		try {
			process.loadEnvFile(file);
		} catch {
			// optional file
		}
	}
}

function credentials(role: Role): { email: string; password: string } | undefined {
	const email = process.env[`DOCS_SHOTS_${role.toUpperCase()}_EMAIL`];
	const password = process.env[`DOCS_SHOTS_${role.toUpperCase()}_PASSWORD`];
	return email && password ? { email, password } : undefined;
}

function assertNotProduction(): void {
	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL ?? '';
	if (
		PROD_SUPABASE_REFS.some((ref) => supabaseUrl.includes(ref)) &&
		process.env.DOCS_SHOTS_ALLOW_PROD !== '1'
	) {
		throw new Error(
			'Authenticated captures are blocked: PUBLIC_SUPABASE_URL points at the production project. ' +
				'Point .env.local at the dev project (with seeded demo accounts) or set DOCS_SHOTS_ALLOW_PROD=1.'
		);
	}
}

async function signIn(context: BrowserContext, role: Role): Promise<void> {
	const creds = credentials(role);
	if (!creds) throw new Error(`Missing credentials for role '${role}'`);
	const page = await context.newPage();
	await page.goto(`${baseUrl}/auth/signin`, { waitUntil: 'networkidle' });
	await page.fill('#email', creds.email);
	await page.fill('#password', creds.password);
	await page.click('button[type="submit"]');
	await page.waitForURL((url) => !url.pathname.startsWith('/auth/signin'), { timeout: 20000 });
	await page.close();
}

/** Resolve [propertyid] / [kyng_area] from env or by following the first matching link. */
async function resolveToken(
	page: Page,
	listRoute: string,
	hrefPrefix: string,
	envVar: string
): Promise<string> {
	const fromEnv = process.env[envVar];
	if (fromEnv) return fromEnv;
	await page.goto(`${baseUrl}${listRoute}`, { waitUntil: 'networkidle' });
	const href = await page
		.locator(`a[href*="${hrefPrefix}"]`)
		.first()
		.getAttribute('href', { timeout: 10000 });
	const match = href?.match(new RegExp(`${hrefPrefix}/([^/]+)`));
	if (!match)
		throw new Error(`Could not discover a value for ${envVar} from ${listRoute}; set ${envVar}`);
	return match[1];
}

async function resolveRoute(page: Page, route: string): Promise<string> {
	let resolved = route.replace('{community}', community);
	if (resolved.includes('[propertyid]')) {
		const id = await resolveToken(
			page,
			'/personal-profile/my-property',
			'/personal-profile/my-property',
			'DOCS_SHOTS_PROPERTY_ID'
		);
		resolved = resolved.replace('[propertyid]', id);
	}
	if (resolved.includes('[kyng_area]')) {
		const area = await resolveToken(
			page,
			'/kyng-coordinator',
			'/kyng-coordinator',
			'DOCS_SHOTS_KYNG_AREA'
		);
		resolved = resolved.replace('[kyng_area]', area);
	}
	return resolved;
}

async function capture(page: Page, shot: Shot): Promise<void> {
	const route = await resolveRoute(page, shot.route);
	await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
	if (!route.startsWith('/auth/signin') && page.url().includes('/auth/signin')) {
		throw new Error(`Redirected to sign-in: role '${shot.role}' lacks access to ${route}`);
	}
	await page.waitForTimeout(shot.settleMs ?? 500);
	const png = await page.screenshot({ type: 'png' });
	const outPath = path.join(outputDir, `${shot.page}.webp`);
	await mkdir(path.dirname(outPath), { recursive: true });
	await sharp(png).webp({ quality: 85 }).toFile(outPath);
	console.log(`captured ${shot.page} <- ${route}`);
}

async function main(): Promise<void> {
	loadAppEnv();
	const only = process.argv.includes('--only')
		? process.argv[process.argv.indexOf('--only') + 1]
		: undefined;
	const selected = SHOTS.filter(
		(shot) => !only || shot.page.includes(only) || shot.route.includes(only)
	);

	if (process.argv.includes('--list')) {
		for (const shot of selected) {
			const ready =
				shot.role === 'public' || credentials(shot.role) ? '' : '  [missing credentials]';
			console.log(`${shot.role.padEnd(11)} ${shot.page}  <-  ${shot.route}${ready}`);
		}
		return;
	}

	const roles = [...new Set(selected.map((shot) => shot.role))];
	if (roles.some((role) => role !== 'public' && credentials(role))) {
		assertNotProduction();
	}

	const browser: Browser = await chromium.launch();
	let captured = 0;
	let failed = 0;
	const skippedRoles: Role[] = [];

	for (const role of roles) {
		if (role !== 'public' && !credentials(role)) {
			skippedRoles.push(role);
			continue;
		}
		const context = await browser.newContext({ viewport: VIEWPORT });
		if (role !== 'public') await signIn(context, role);
		const page = await context.newPage();
		for (const shot of selected.filter((entry) => entry.role === role)) {
			try {
				await capture(page, shot);
				captured += 1;
			} catch (error) {
				failed += 1;
				console.error(`FAILED ${shot.page}: ${error instanceof Error ? error.message : error}`);
			}
		}
		await context.close();
	}

	await browser.close();
	for (const role of skippedRoles) {
		const pages = selected.filter((shot) => shot.role === role).length;
		console.warn(
			`skipped ${pages} '${role}' pages: set DOCS_SHOTS_${role.toUpperCase()}_EMAIL / _PASSWORD`
		);
	}
	console.log(`done: ${captured} captured, ${failed} failed -> ${outputDir}`);
	if (failed > 0) process.exit(1);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
