/**
 * Google Maps URL Builder
 *
 * Generates unique GMB URLs that:
 * 1. Load the BRAND's GMB listing when clicked (brand CID is embedded)
 * 2. Are unique per nearby location (different viewport lat/lng)
 *
 * Format: https://www.google.com/maps/place/BRAND_NAME/@NEARBY_LAT,NEARBY_LNG,14z/data=...BRAND_PLACE_ID...
 */
import type { BusinessResult } from './pleper.js';
export interface NearbyLocation {
    index: number;
    name: string;
    cid: string;
    place_id: string;
    latitude: number;
    longitude: number;
    address: string;
    distance_miles: number;
    gmb_url: string;
}
export interface GmbLookupResult {
    brand: {
        name: string;
        cid: string;
        place_id: string;
        kg_id: string;
        profile_url: string;
        latitude: number;
        longitude: number;
        address: string;
        phone?: string;
        website?: string;
        rating?: number;
        review_count?: number;
        categories?: string[];
    };
    nearby: NearbyLocation[];
    ctr_booster_config: {
        AuthorId: string;
        TargetUrl: string;
        TargetName: string;
        lstCustomGeolocations: string[];
        generated_urls: string[];
    };
}
/**
 * Build a unique Google Maps URL that loads the BRAND GMB listing
 * but with the viewport centered on a nearby location.
 *
 * This is the key URL format used by CTR Booster for GMB campaigns:
 * - The @LAT,LNG part sets the map viewport (nearby location)
 * - The data=... part encodes the brand's place_id (so clicking always loads brand)
 * - The cid= suffix is the brand CID as fallback
 */
export declare function buildBrandUrlFromNearby(brand: Pick<BusinessResult, 'name' | 'cid' | 'place_id' | 'kg_id' | 'latitude' | 'longitude'>, nearbyLat: number, nearbyLng: number, zoomLevel?: number): string;
/**
 * Assemble the full lookup result including URLs and CTR Booster config
 */
export declare function buildGmbResult(brand: BusinessResult, nearbyBusinesses: BusinessResult[]): GmbLookupResult;
