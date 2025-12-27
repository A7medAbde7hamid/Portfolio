const supabaseUrl = 'https://eiqgbkpzywcpgbmovizt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcWdia3B6eXdjcGdibW92aXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MzMyNTYsImV4cCI6MjA4MjIwOTI1Nn0.Q5yCD2pEd-yrP0SM8iPzd89MVL-4OAUPUwGXFX9lNmI';

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

const adminApiUrl = `${supabaseUrl}/functions/v1/admin-api`;
const imageUploadUrl = `${supabaseUrl}/functions/v1/image-upload`;
const sendEmailUrl = `${supabaseUrl}/functions/v1/send-email`;

async function supabaseSelect(table: string, options: { order?: string; eq?: Record<string, string> } = {}) {
  let url = `${supabaseUrl}/rest/v1/${table}?select=*`;
  if (options.order) url += `&order=${options.order}`;
  if (options.eq) {
    Object.entries(options.eq).forEach(([k, v]) => { url += `&${k}=eq.${v}`; });
  }
  const res = await fetch(url, { headers });
  return res.json();
}

async function supabaseInsert(table: string, data: object) {
  await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(data),
  });
}

export async function trackPageView(page: string) {
  const visitorId = localStorage.getItem('visitor_id') || crypto.randomUUID();
  localStorage.setItem('visitor_id', visitorId);
  await supabaseInsert('analytics', { page, event_type: 'view', visitor_id: visitorId });
}

export async function trackContactMessage(email: string) {
  await supabaseInsert('analytics', { page: 'contact', event_type: 'message', visitor_id: `${email}-${Date.now()}` });
}

export async function saveContactMessage(name: string, email: string, message: string) {
  // Save to database
  await supabaseInsert('contact_messages', { name, email, message });
  // Send email notification
  await fetch(sendEmailUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, email, message }),
  });
}

export async function fetchProjects() {
  return supabaseSelect('projects', { order: 'display_order' });
}

export async function fetchCertificates() {
  return supabaseSelect('certificates', { order: 'created_at.desc' });
}

export async function fetchSkills() {
  return supabaseSelect('skills', { order: 'display_order' });
}

export async function fetchContent(key: string) {
  const data = await supabaseSelect('site_content', { eq: { key } });
  return data?.[0]?.value || '';
}

export async function fetchHeroSettings() {
  return supabaseSelect('hero_settings');
}

export async function getAnalyticsCount() {
  const res = await fetch(`${supabaseUrl}/rest/v1/analytics?select=id`, {
    headers: { ...headers, Prefer: 'count=exact' },
  });
  const range = res.headers.get('content-range');
  return parseInt(range?.split('/')[1] || '0');
}

export async function adminLogin(password: string) {
  const res = await fetch(adminApiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'login', password }),
  });
  return (await res.json()).success;
}

export async function adminCreate(table: string, data: object, adminPassword: string) {
  return fetch(adminApiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'create', table, data, adminPassword }),
  }).then(r => r.json());
}

export async function adminUpdate(table: string, id: string, data: object, adminPassword: string) {
  return fetch(adminApiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'update', table, id, data, adminPassword }),
  }).then(r => r.json());
}

export async function adminDelete(table: string, id: string, adminPassword: string) {
  return fetch(adminApiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'delete', table, id, adminPassword }),
  }).then(r => r.json());
}

export async function uploadImage(imageData: string, fileName: string, adminPassword: string) {
  const res = await fetch(imageUploadUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ imageData, fileName, adminPassword }),
  });
  return (await res.json()).publicUrl;
}

// New tables
export async function fetchCaseStudies() {
  return supabaseSelect('case_studies', { order: 'display_order' });
}

export async function fetchOldTales() {
  return supabaseSelect('old_tales', { order: 'display_order' });
}

export async function subscribeNewsletter(email: string, name?: string) {
  return supabaseInsert('newsletter_subscribers', { email, name });
}

export async function fetchGithubRepos(adminPassword: string) {
  const res = await fetch(adminApiUrl, {
    method: 'POST', headers,
    body: JSON.stringify({ action: 'fetch_github_repos', adminPassword }),
  });
  return (await res.json()).repos || [];
}

export async function syncGithubRepo(repo: any, adminPassword: string) {
  return fetch(adminApiUrl, {
    method: 'POST', headers,
    body: JSON.stringify({ action: 'sync_github_repo', repo, adminPassword }),
  }).then(r => r.json());
}

export async function fetchSubscribers(adminPassword: string) {
  const res = await fetch(adminApiUrl, {
    method: 'POST', headers,
    body: JSON.stringify({ action: 'get_subscribers', adminPassword }),
  });
  return res.json();
}

export async function deleteSubscriber(id: string, adminPassword: string) {
  return fetch(adminApiUrl, {
    method: 'POST', headers,
    body: JSON.stringify({ action: 'delete_subscriber', id, adminPassword }),
  }).then(r => r.json());
}

export async function fetchSocialLinks() {
  return supabaseSelect('social_links', { order: 'display_order' });
}

export async function fetchTestimonials() {
  try {
    const data = await supabaseSelect('testimonials', { order: 'display_order' });
    return Array.isArray(data) && data.length > 0 ? data.filter((t: any) => t.is_visible !== false) : null;
  } catch {
    return null;
  }
}
