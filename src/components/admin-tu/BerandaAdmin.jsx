import React, { useEffect, useState } from "react";
import Navigasi from "../admin-tu/Navigasi";
import Logout from "../Logout";
import axios from "axios";

const BerandaAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMasuk: 0,
    totalKeluar: 0,
    rekap: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard`
        );
        setDashboardData(res.data);
      } catch (err) {
        console.error("Gagal fetch dashboard", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-sm">
      {/* Sidebar */}
      <aside className="w-[320px] bg-white border-r border-gray-200 shadow-sm">
        <Navigasi />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-4 py-2 sticky top-0 z-20 flex justify-end">
          <Logout />
        </header>

        {/* Dashboard Content */}
        <section className="flex-1 px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Beranda</h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-gray-600 mb-1">Jumlah Surat Masuk</h3>
              <p className="text-3xl font-bold text-black">
                {dashboardData.totalMasuk}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-gray-600 mb-1">Jumlah Surat Keluar</h3>
              <p className="text-3xl font-bold text-black">
                {dashboardData.totalKeluar}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-2 border-b">
              <h3 className="text-base font-medium text-gray-700">
                Rekap Surat per Tahun
              </h3>
            </div>
            <table className="w-full table-auto text-sm">
              <thead className="bg-[#34542C] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Tahun</th>
                  <th className="px-4 py-2 text-left">Surat Masuk</th>
                  <th className="px-4 py-2 text-left">Surat Keluar</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {dashboardData.rekap.map((item) => (
                  <tr key={item.tahun} className="hover:bg-gray-100 border-b">
                    <td className="px-4 py-2">{item.tahun}</td>
                    <td className="px-4 py-2">{item.masuk}</td>
                    <td className="px-4 py-2">{item.keluar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BerandaAdmin;
