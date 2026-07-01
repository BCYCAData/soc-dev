import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, params, parent }) => {
	const { user } = await parent();
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
		featureAttributes: attributes,
		userRole: ''
	};
};
export const actions: Actions = {
	saveFeature: async ({ request, locals: { supabase } }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return fail(401, { success: false, message: 'Authentication required' });
		}
		const formData = await request.formData();
		const propertyId = formData.get('propertyId');
		const templateId = formData.get('templateId');
		const geometryStr = formData.get('geometry');
		const featureId = formData.get('featureId');

		if (!propertyId || !templateId || !geometryStr) {
			return fail(400, {
				success: false,
				message: 'Missing required fields'
			});
		}

		const geometry = JSON.parse(geometryStr.toString());

		// First save the feature. Use the GeoJSON-accepting wrapper: the geometry
		// param is jsonb (ST_GeomFromGeoJSON server-side) rather than a PostGIS
		// `geometry`, which the parsed GeoJSON object could not bind to (G4).
		const { data: featureData, error: featureError } = await supabase.rpc(
			'upsert_spatial_feature_geojson',
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
			return fail(400, {
				success: false,
				message: 'Failed to save spatial feature'
			});
		}

		// The hardened RPC returns a structured result: { valid, feature_id?, issues?, warnings? }.
		const result = (featureData ?? {}) as {
			valid?: boolean;
			feature_id?: string;
			issues?: string[];
			warnings?: string[];
		};

		if (!result.valid || !result.feature_id) {
			return fail(400, {
				success: false,
				message: 'Validation failed',
				issues: result.issues ?? [],
				warnings: result.warnings ?? []
			});
		}

		const newFeatureId = result.feature_id;
		const warnings = result.warnings ?? [];

		// Then update any provided attribute values
		const attributesArray = Array.from(formData.entries())
			.filter(([key]) => key.startsWith('attr_'))
			.map(([key]) => ({
				feature_id: newFeatureId,
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
				return fail(400, {
					success: false,
					message: 'Failed to save feature attribute'
				});
			}

			return {
				success: true,
				message: 'Spatial feature and attributes successfully updated',
				featureId: newFeatureId,
				attributeIds: attributeData,
				warnings
			};
		}

		return {
			success: true,
			message: 'Spatial feature successfully updated',
			featureId: newFeatureId,
			warnings
		};
	},
	deleteFeature: async ({ request, locals: { supabase } }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return fail(401, { success: false, message: 'Authentication required' });
		}
		const formData = await request.formData();
		const featureId = formData.get('featureId');
		const propertyId = formData.get('propertyId');

		if (!featureId || !propertyId) {
			return fail(400, {
				success: false,
				message: 'Missing required fields'
			});
		}
		const { data: deleteResult, error: rpcError } = await supabase.rpc('delete_spatial_feature', {
			p_feature_id: featureId,
			p_user_id: user.id,
			p_property_id: propertyId
		});
		if (rpcError) {
			console.log('deleteSpatialFeatureError', rpcError.message);
			return fail(400, {
				success: false,
				message: 'Failed to delete spatial feature'
			});
		}

		return {
			success: true,
			message: 'Spatial feature successfully deleted',
			deleteResult
		};
	}
};
