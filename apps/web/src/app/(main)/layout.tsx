import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SidebarTreeMenu, getAllMenus } from '@/components/navigation';

/**
 * 🏛️ MAIN GROUP LAYOUT: Layout chuẩn cho toàn bộ phân hệ nghiệp vụ
 * - Thuần Server Component (bọc các Client sub-components)
 * - 🛡️ ROUTE GROUP SERVER GUARD: Kiểm tra xác thực ngay tại Layout cha của nhóm (main).
 *   Nếu chưa đăng nhập hoặc session hết hạn -> Redirect ngay về /login trước khi render bất kỳ component con nào.
 * - Next.js tự động ghi nhớ (persist) layout này khi điều hướng SPA giữa các route con
 * - Bố cục: Navbar ở trên, thân 2 cột (Trái 20% Tree Menu, Phải 80% Content), Footer ở đáy
 */
export default async function MainGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ Lớp bảo vệ Server-Side Auth Guard cho toàn bộ nhóm (main)
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // 🎼 Lấy danh sách menu tổng hợp từ các module theo thứ tự `order`
  const menuModules = getAllMenus();

  return (
    <div className="d-flex flex-column min-vh-100 bg-subtle-custom">
      <Navbar />
      <main className="py-4 flex-grow-1">
        <div className="container-fluid px-3 px-md-4">
          <div className="row g-4">
            {/* CỘT TRÁI: ~20% Tree Menu Sidebar */}
            <div className="col-12 col-lg-3 col-xl-2">
              <SidebarTreeMenu modules={menuModules} />
            </div>

            {/* CỘT PHẢI: ~80% Nội dung trang hiện tại */}
            <div className="col-12 col-lg-9 col-xl-10">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
