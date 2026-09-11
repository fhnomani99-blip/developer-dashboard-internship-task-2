import { useEffect, useState } from "react";

function Sidebar() {
  const [active, setActive] = useState(
    window.location.hash.replace("#", "") || "dashboard"
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "tasks", icon: "✅", label: "Tasks" },
    { id: "progress", icon: "📊", label: "Progress" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  useEffect(() => {
    const handleHashChange = () => {
      const page =
        window.location.hash.replace("#", "") || "dashboard";

      setActive(page);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleNavigation = (id) => {
    window.location.hash = id;
    setActive(id);

    // Close mobile sidebar after selecting a page
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => {
          setMobileOpen((prev) => !prev);
        }}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-logo">
          <h2>DevFlow</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                active === item.id ? "active" : ""
              }`}
              onClick={() => handleNavigation(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;