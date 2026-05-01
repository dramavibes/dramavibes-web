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
    const body = clean({ ...filters, query });
    const { data } = await client.post("/search", body);
    return data;
}

export async function vibeSearch(query, filters = {}) {
    const body = clean({ ...filters, query });
    const { data } = await client.post("/search/semantic", body);
    return data;
}

export async function getSimilarTitles(slug, filters = {}) {
    const body = clean({ ...filters });
    const { data } = await client.post(`/similar/${slug}`, body);
    return data;
}

export async function getDramaBySlug(slug) {
    const { data } = await client.get(`/details/${slug}`);
    return data;
}


export async function getFilterOptions() {
    const { data } = await client.get("/filters");
    return data;
}