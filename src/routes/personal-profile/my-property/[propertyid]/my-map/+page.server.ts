import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, params }) => {
	const { user } = await getSessionAndUser();
	const propertyId = params.propertyid;
	const [
		{ data: propertyGeometryData, error: propertyGeometryError },
		{ data: templates, error: templatesError },
		{ data: features, error: featuresError },
		{ data: attributes, error: attributesError }
	] = await Promise.all([
		supabase.rpc('get_property_geometry', { id_input: propertyId }),
		supabase.rpc('get_spatial_feature_templates'),
		supabase.rpc('get_spatial_features', { p_property_id: propertyId, p_user_id: user.id }),
		supabase.rpc('get_spatial_feature_attributes', {
			p_property_id: propertyId,
			p_user_id: user.id
		})
	]);

	if (propertyGeometryError) {
		console.log('error get Property Geometry:', propertyGeometryError);
		throw error(400, propertyGeometryError);
	}

	if (templatesError || featuresError || attributesError) {
		console.log('Spatial Feature Template Error:', templatesError);
		console.log('Spatial Features Error:', featuresError);
		console.log('Spatial Feature Attributes Error:', attributesError);
		throw error(400, 'Error fetching feature data');
	}

	return {
		propertyGeometryData,
		featureTemplates: templates,
		spatialFeatures: features,
		featureAttributes: attributes
	};
};
export const actions: Actions = {
	saveFeature: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();
		const propertyId = formData.get('propertyId');
		const templateId = formData.get('templateId');
		const geometryStr = formData.get('geometry');
		const featureId = formData.get('featureId');

		if (!propertyId || !templateId || !geometryStr) {
			throw error(400, 'Missing required fields');
		}

		const geometry = JSON.parse(geometryStr.toString());

		// First save the feature
		const { data: featureData, error: featureError } = await supabase.rpc(
			'upsert_spatial_feature',
			{
				p_feature_id: featureId ? featureId.toString() : null,
				p_user_id: user.id,
				p_property_id: propertyId.toString(),
				p_template_id: templateId.toString(),
				p_geom: geometry
			}
		);

		if (featureError) {
			console.log('featureError', featureError.message);
			throw error(400, featureError.message);
		}

		// Then update any provided attribute values
		const attributesArray = Array.from(formData.entries())
			.filter(([key]) => key.startsWith('attr_'))
			.map(([key]) => ({
				feature_id: featureData,
				field_id: key.replace('attr_', ''),
				value: formData.get(key)?.toString() || null // Allow null values
			}));

		if (attributesArray.length > 0) {
			const { data: attributeData, error: attributeError } = await supabase.rpc(
				'upsert_feature_attributes',
				{
					p_attributes: attributesArray
				}
			);

			if (attributeError) {
				console.log('attributeError', attributeError.message);
				throw error(400, attributeError.message);
			}

			return { success: true, featureId: featureData, attributeIds: attributeData };
		}

		return { success: true, featureId: featureData };
	},
	deleteFeature: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();
		const featureId = formData.get('featureId');
		const propertyId = formData.get('propertyId');

		if (!featureId || !propertyId) {
			throw error(400, 'Missing required fields');
		}
		console.log('p_feature_id: ', featureId, 'p_user_id: ', user.id, 'p_property_id: ', propertyId);
		const { data: deleteResult, error: rpcError } = await supabase.rpc('delete_spatial_feature', {
			p_feature_id: featureId,
			p_user_id: user.id,
			p_property_id: propertyId
		});

		if (rpcError) {
			console.log('deleteSpatialFeatureError', rpcError.message);
			throw error(400, rpcError.message);
		}

		return { success: true, deleteResult };
	}
};
