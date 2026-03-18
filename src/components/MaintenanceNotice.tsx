'use client';

/**
 * MaintenanceNotice — Site-down overlay using Molecular Design System
 * Full-viewport overlay with backdrop blur; dark card with accent tag
 */
export default function MaintenanceNotice() {
  return (
    <div className="maintenance-overlay" aria-live="polite" role="alert">
      <div className="maintenance-card">
        <span className="maintenance-tag">Notice</span>
        <h2 className="maintenance-title">Site Down for Maintenance</h2>
        <p className="maintenance-sub">
          We&apos;re making improvements. Please check back soon.
        </p>
      </div>
    </div>
  );
}
