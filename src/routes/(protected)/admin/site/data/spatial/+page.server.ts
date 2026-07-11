/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON/external-library data structures */
import { error, fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { PERMISSIONS } from '$lib/constants/permissions';
import { hasPermission } from '$lib/server/permissions';
import {
	sanitizeTemplateStyleOverride,
	type TemplateGeometry
} from '$lib/map/capture/template-styles';

/** Parse + whitelist the optional `style` field posted by TemplateStyleEditor,
 * validated against the *submitted* geometry_type so a geometry change strips
 * stale keys. Empty field → null (use the code default). */
function parseStyleField(formData: FormData): { style: unknown; error?: string } {
	const raw = ((formData.get('style') as string | null) ?? '').trim();
	if (!raw) return { style: null };
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { style: null, error: 'Style is not valid JSON' };
	}
	const geometry = formData.get('geometry_type') as TemplateGeometry;
	const { override, errors } = sanitizeTemplateStyleOverride(parsed, geometry);
	if (errors.length) return { style: null, error: `Invalid style: ${errors.join('; ')}` };
	return { style: override };
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: templates, error: templatesError } = await supabase
		.from('feature_templates')
		.select('*, template_fields(*)');

	const { data: enumValues, error: enumError } = await supabase.rpc('get_enum_values', {
		enum_names: ['geometry_type', 'field_type', 'feature_category']
	});

	if (templatesError || enumError) {
		throw error(500, 'Failed to load data');
	}

	return {
		templates,
		enumValues,
		initialData: {
			geometryTypes: enumValues.geometry_type,
			fieldTypes: enumValues.field_type,
			categories: enumValues.feature_category
		}
	};
};

export const actions: Actions = {
	createTemplate: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_DATA_SPATIAL)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to create a template'
			});
		}
		const formData = await request.formData();
		const styleResult = parseStyleField(formData);
		if (styleResult.error) {
			return fail(400, { success: false, message: styleResult.error });
		}
		const template = {
			name: formData.get('name'),
			description: formData.get('description'),
			geometry_type: formData.get('geometry_type'),
			category: formData.get('category'),
			style: styleResult.style,
			is_active: true
		};

		const { data, error: insertError } = await supabase
			.from('feature_templates')
			.insert(template)
			.select();

		if (insertError) {
			return fail(400, {
				success: false,
				message: 'Failed to create template'
			});
		}

		return {
			success: true,
			message: 'Template created successfully',
			data: data?.[0]
		};
	},

	updateTemplate: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_DATA_SPATIAL)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to update a template'
			});
		}
		const formData = await request.formData();
		const templateId = formData.get('id');
		const styleResult = parseStyleField(formData);
		if (styleResult.error) {
			return fail(400, { success: false, message: styleResult.error });
		}
		const updates = {
			name: formData.get('name'),
			description: formData.get('description'),
			geometry_type: formData.get('geometry_type'),
			category: formData.get('category'),
			style: styleResult.style,
			is_active: formData.get('is_active') === 'true'
		};

		const { data, error: updateError } = await supabase
			.from('feature_templates')
			.update(updates)
			.eq('id', templateId)
			.select();

		if (updateError) {
			return fail(400, {
				success: false,
				message: 'Failed to update template'
			});
		}

		return {
			success: true,
			message: 'Template updated successfully',
			data: data?.[0]
		};
	},

	manageFields: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_DATA_SPATIAL)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to manage fields'
			});
		}
		const formData = await request.formData();
		const fields = JSON.parse(formData.get('fields') as string);
		const templateId = formData.get('template_id');

		const { error: fieldsError } = await supabase.from('template_fields').upsert(
			fields.map((field: any) => ({
				...field,
				template_id: templateId
			}))
		);

		if (fieldsError) {
			return fail(400, {
				success: false,
				message: 'Failed to manage template fields'
			});
		}

		return {
			success: true,
			message: 'Template fields updated successfully'
		};
	}
};
