import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});


/**
 * Strips null/undefined values from the filters object before sending,
 * so the API doesn't receive noise.
 */
function clean(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v != null)
  );
}

export async function classicSearch(query = null, filters = {}) {
    try{
        const body = clean({ ...filters, query });
        const { data } = await client.post("/search", body);
        return data;
    } catch (error) {
        console.error("[classicSearch] API error:", error);
        throw error;
    }
}

export async function vibeSearch(query, filters = {}) {
    try{
        const body = clean({ ...filters, query });
        const { data } = await client.post("/search/semantic", body);
        return data;
    } catch (error) {
        console.error("[vibeSearch] API error:", error);
        throw error;
    }
}

export async function getSimilarTitles(slug, filters = {}) {
    try{
        const body = clean({ ...filters });
        const { data } = await client.post(`/similar/${slug}`, body);
        return data;
    } catch (error) {
        console.error("[getSimilarTitles] API error:", error);
        throw error;
    }
}

export async function getDetailsBySlug(slug) {
    try{
        const { data } = await client.get(`/details/${slug}`);
        return data;
    } catch (error) {
        console.error("[getDetailsBySlug] API error:", error);
        throw error;
    }
}


export async function getFilterOptions() {
    try{
        const { data } = await client.get("/filters");
        return data;
    } catch (error) {
        console.error("[getFilterOptions] API error:", error);
        throw error;
    }
}