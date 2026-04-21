// app.js
// Simple front-end "auth" for demo purposes only (no real security)

// ---- MOCK USERS ---- //
const MOCK_USERS = [
  { username: 'employee1', password: 'password', role: 'employee', name: 'Employee One' },
  { username: 'supervisor1', password: 'password', role: 'supervisor', name: 'Supervisor One' },
  { username: 'hr1',        password: 'password', role: 'hr',        name: 'HR Manager' }
];

// ---- SESSION HELPERS (localStorage) ---- //
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
  const data = localStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// ---- AUTH LOGIC ---- //
function login(username, password) {
  const user = MOCK_USERS.find(
    u => u.username === username && u.password === password
  );
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

function logout() {
  clearCurrentUser();
  // Redirect to login page
  window.location.href = 'index.html';
}

// ---- ROLE-BASED ACCESS GUARD ---- //
// Call this in each protected page (not on index.html)
function enforceAuth(allowedRoles = []) {
  const user = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();

  // If not logged in, always go to login page
  if (!user) {
    if (currentPage !== 'index.html') {
      window.location.href = 'index.html';
    }
    return;
  }

  // If allowedRoles is empty, any logged-in user is fine
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Optional: redirect unauthorized roles to dashboard
    window.location.href = 'dashboard.html';
    return;
  }

  // If there's an element for showing username, fill it
  const userSpan = document.getElementById('currentUserName');
  if (userSpan) {
    userSpan.textContent = `${user.name} (${user.role})`;
  }
}

// ---- NAV HIGHLIGHT & ROLE-BASED NAV ITEMS ---- //
function initNav() {
  const user = getCurrentUser();
  const pathname = window.location.pathname.split('/').pop();

  // Show/hide nav links based on role
  const navEmployee = document.querySelectorAll('.nav-employee');
  const navSupervisor = document.querySelectorAll('.nav-supervisor');
  const navHR = document.querySelectorAll('.nav-hr');

  if (!user) {
    // If not logged in, hide all role-based nav
    [navEmployee, navSupervisor, navHR].forEach(list =>
      list.forEach(el => el.style.display = 'none')
    );
  } else {
    // Default: hide all, then show as needed
    [navEmployee, navSupervisor, navHR].forEach(list =>
      list.forEach(el => el.style.display = 'none')
    );

    if (user.role === 'employee') {
      navEmployee.forEach(el => el.style.display = 'inline-block');
    }
    if (user.role === 'supervisor') {
      navSupervisor.forEach(el => el.style.display = 'inline-block');
    }
    if (user.role === 'hr') {
      navHR.forEach(el => el.style.display = 'inline-block');
    }
  }

  // Highlight active link
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === pathname) {
      a.classList.add('active');
    }
  });
}

// ---- Attach logout handler globally ---- //
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      logout();
    });
  }
  initNav();
});
