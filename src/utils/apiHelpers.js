/**
 * Normalizes paginated API responses to a consistent format
 * Handles different response formats from backend
 * 
 * Backend returns: { success: true, data: { items: [...], pagination: {...}, campaigns: [...], contacts: [...] } }
 * After interceptor: { items: [...], pagination: {...}, campaigns: [...], contacts: [...] }
 * 
 * @param {Object} response - API response object (already extracted by interceptor)
 * @param {string} itemKey - Key to look for items (e.g., 'campaigns', 'contacts')
 * @returns {Object} Normalized response with items and pagination
 */
export function normalizePaginatedResponse(response, itemKey = 'items') {
  // Handle different response formats
  // Backend may return items in different keys: items, campaigns, contacts, etc.
  let items = [];
  
  // First, try the specific itemKey (e.g., 'campaigns', 'contacts')
  if (response && typeof response === 'object') {
    if (Array.isArray(response[itemKey])) {
      items = response[itemKey];
    } else if (Array.isArray(response.items)) {
      items = response.items;
    } else if (Array.isArray(response.campaigns)) {
      items = response.campaigns;
    } else if (Array.isArray(response.contacts)) {
      items = response.contacts;
    } else if (Array.isArray(response.automations)) {
      items = response.automations;
    } else if (Array.isArray(response.templates)) {
      items = response.templates;
    } else if (Array.isArray(response.transactions)) {
      items = response.transactions;
    } else if (Array.isArray(response)) {
      // If response itself is an array, use it
      items = response;
    }
  }
  
  // Ensure items is always an array
  if (!Array.isArray(items)) {
    items = [];
  }
  
  // Extract pagination - handle different formats
  let pagination = {};
  if (response && typeof response === 'object') {
    pagination = response.pagination || {};
    
    // Calculate pageSize and totalPages
    const pageSize = pagination.pageSize || pagination.limit || pagination.perPage || 20;
    const total = pagination.total || pagination.totalCount || 0;
    const totalPages = pagination.totalPages || pagination.pages || Math.ceil(total / pageSize);
    const currentPage = pagination.page || pagination.currentPage || 1;
    
    // Ensure pagination has required fields with defaults
    pagination = {
      page: currentPage,
      pageSize: pageSize,
      total: total,
      totalPages: totalPages > 0 ? totalPages : 1,
      hasNextPage: pagination.hasNextPage !== undefined ? pagination.hasNextPage : currentPage < totalPages,
      hasPrevPage: pagination.hasPrevPage !== undefined ? pagination.hasPrevPage : currentPage > 1,
    };
  }
  
  return {
    items,
    pagination,
  };
}

/**
 * Normalizes array responses that might be wrapped in objects
 * Handles cases where backend returns { items: [...] } or { campaigns: [...] } or just [...]
 * 
 * Backend returns: { success: true, data: { automations: [...] } } or { success: true, data: [...] }
 * After interceptor: { automations: [...] } or [...]
 * 
 * @param {*} data - Response data (could be array or object, already extracted by interceptor)
 * @param {string} itemKey - Key to look for items if data is object (e.g., 'automations', 'templates')
 * @returns {Array} Normalized array
 */
export function normalizeArrayResponse(data, itemKey = 'items') {
  // If data is already an array, return it
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data is an object, look for array properties
  if (data && typeof data === 'object') {
    // Try the specific itemKey first
    if (Array.isArray(data[itemKey])) {
      return data[itemKey];
    }
    
    // Try common array keys
    if (Array.isArray(data.items)) {
      return data.items;
    }
    if (Array.isArray(data.campaigns)) {
      return data.campaigns;
    }
    if (Array.isArray(data.contacts)) {
      return data.contacts;
    }
    if (Array.isArray(data.automations)) {
      return data.automations;
    }
    if (Array.isArray(data.templates)) {
      return data.templates;
    }
    if (Array.isArray(data.categories)) {
      return data.categories;
    }
    if (Array.isArray(data.discounts)) {
      return data.discounts;
    }
    if (Array.isArray(data.audiences)) {
      return data.audiences;
    }
    if (Array.isArray(data.packages)) {
      return data.packages;
    }
    
    // If no array found, return empty array
    return [];
  }
  
  // If data is null, undefined, or other non-array/non-object, return empty array
  return [];
}

