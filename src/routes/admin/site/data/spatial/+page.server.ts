import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

		return { success: !insertError, template: data?.[0] };
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

		return { success: !updateError, template: data?.[0] };
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

		return { success: !fieldsError };
	}
};
