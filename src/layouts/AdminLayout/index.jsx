import { Outlet } from 'react-router-dom'; // or wherever your routing is from

export function AdminLayout() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Outlet />       </div>
    </div>
  );
}
