/**
 * Pleper API Client — correct format (verified against live API)
 *
 * Protocol:
 *   batch_create          GET  ?api_key=&api_sig=&batch_id=new
 *   google/search/maps    POST form-encoded: keyword + latitude + longitude + batch_id
 *   by-profile/information POST form-encoded: profile_url + batch_id
 *   batch_commit          GET  ?api_key=&api_sig=&batch_id=N
 *   batch_get_results     GET  ?api_key=&api_sig=&batch_id=N  → status:"Finished", results:{...}
 */
export interface BusinessResult {
    name: string;
    cid: string;
    place_id: string;
    kg_id: string;
    business_profile_id: string;
    profile_url: string;
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    state?: string;
    phone?: string;
    website?: string;
    rating?: number;
    review_count?: number;
    categories?: string[];
}
export declare function geocodeCity(location: string): Promise<{
    lat: number;
    lng: number;
} | null>;
/**
 * Search for a brand GMB by name + location.
 * location: city/state string e.g. "Austin, TX" — geocoded to lat/lng for Pleper
 */
export declare function searchBrand(brandName: string, location: string): Promise<BusinessResult | null>;
/**
 * Get all search results (multiple businesses) around a lat/lng
 */
export declare function searchNearby(lat: number, lng: number, keyword?: string, count?: number): Promise<BusinessResult[]>;
/**
 * Get full profile info by profile_url (CID URL or place_id)
 */
export declare function getProfileInfo(profileUrl: string): Promise<BusinessResult | null>;
/**
 * Bulk search: multiple brands at once, all in one batch
 */
export declare function bulkSearchBrands(items: Array<{
    id: string;
    keyword: string;
    lat: number;
    lng: number;
}>): Promise<Array<{
    id: string;
    result: BusinessResult | null;
}>>;
