const ADMIN_STORAGE_KEY = 'chickenhaven_admin';

function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}

function adminLogin(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  window.location.href = 'admin.html';
}

function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = 'admin.html';
  }
}