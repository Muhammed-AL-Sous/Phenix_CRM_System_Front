/**
 * Builds query params for GET /{role}/users (IndexUsersRequest), e.g. /api/admin/users.
 * Omits empty optional fields so Laravel does not receive invalid empty search.
 */

export function compactUsersListParams(arg) {
  if (!arg || typeof arg !== "object") return {};
  const { scope: _scope, ...rest } = arg;
  const out = {};
  for (const [key, raw] of Object.entries(rest)) {
    if (raw === undefined || raw === null || raw === "") continue;
    if (key === "search" && String(raw).trim() === "") continue;
    out[key] = raw;
  }
  return out;
}

export function usersListParamsToQueryString(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") {
      search.set(key, value ? "1" : "0");
    } else {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Normalizes API envelope `{ data, meta, links }` from ApiResponse::success + paginator.
 */
export function normalizeUsersListResponse(response) {
  const rows = response?.data;
  const meta = response?.meta ?? null;
  const links = response?.links ?? null;

  if (Array.isArray(rows) && meta && typeof meta.current_page === "number") {
    return { users: rows, meta, links };
  }

  if (Array.isArray(rows)) {
    return {
      users: rows,
      meta: {
        total_items: rows.length,
        items_per_page: rows.length || 1,
        current_page: 1,
        total_pages: 1,
        from: rows.length ? 1 : null,
        to: rows.length ? rows.length : null,
      },
      links: null,
    };
  }

  return { users: [], meta: null, links: null };
}
