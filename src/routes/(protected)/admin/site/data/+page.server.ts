import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { hasAnyPermission } from '$lib/server/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// Check if user has ANY admin.site.data permission
	// This allows access if they have admin.site.data.spatial, admin.site.data.addresses, etc.
	if (!hasAnyPermission(
		parentData.permissions,
		PERMISSIONS.ADMIN_SITE_DATA,
		PERMISSIONS.ADMIN_SITE_DATA_SPATIAL,
		PERMISSIONS.ADMIN_SITE_DATA_ADDRESSES,
		PERMISSIONS.ADMIN_SITE_DATA_KYNG_BOUNDARIES
	)) {
		throw error(403, 'Insufficient permissions for site data administration');
	}

	return {
		siteDataAdminData: {}
	};
};

export const actions: Actions = {
	createTemplate: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const template = {
			name: formData.get('name'),
			description: formData.get('description'),
			geometry_type: formData.get('geometry_type'),
			category: formData.get('category'),
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

	updateTemplate: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const templateId = formData.get('id');
		const updates = {
			name: formData.get('name'),
			description: formData.get('description'),
			geometry_type: formData.get('geometry_type'),
			category: formData.get('category'),
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

	manageFields: async ({ request, locals: { supabase } }) => {
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
