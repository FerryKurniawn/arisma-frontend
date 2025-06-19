import React, { useEffect, useState } from "react";
import Navigasi from "../admin-tu/Navigasi";
import Logout from "../Logout";
import { supabase } from "../../supabaseClient";

const BerandaAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMasuk: 0,
    totalKeluar: 0,
    rekap: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil total jumlah surat masuk
        const { count: totalMasuk, error: errorMasuk } = await supabase
          .from("SuratMasuk")
          .select("*", { count: "exact", head: true });

        if (errorMasuk) throw errorMasuk;

        // Ambil total jumlah surat keluar
        const { count: totalKeluar, error: errorKeluar } = await supabase
          .from("SuratKeluar")
          .select("*", { count: "exact", head: true });

        if (errorKeluar) throw errorKeluar;

        // Ambil semua data surat masuk (untuk rekap per tahun)
        const { data: masukData, error: masukDataError } = await supabase
          .from("SuratMasuk")
          .select("tanggalTerima");

        if (masukDataError) throw masukDataError;

        // Ambil semua data surat keluar (untuk rekap per tahun)
        const { data: keluarData, error: keluarDataError } = await supabase
          .from("SuratKeluar")
          .select("tanggalKeluar");

        if (keluarDataError) throw keluarDataError;

        // Hitung rekap surat masuk per tahun
        const masukPerTahun = {};
        masukData.forEach((item) => {
          const tahun = new Date(item.tanggalTerima).getFullYear();
          masukPerTahun[tahun] = (masukPerTahun[tahun] || 0) + 1;
        });

        // Hitung rekap surat keluar per tahun
        const keluarPerTahun = {};
        keluarData.forEach((item) => {
          const tahun = new Date(item.tanggalKeluar).getFullYear();
          keluarPerTahun[tahun] = (keluarPerTahun[tahun] || 0) + 1;
        });

        // Gabungkan semua tahun
        const allYears = Array.from(
          new Set([
            ...Object.keys(masukPerTahun),
            ...Object.keys(keluarPerTahun),
          ])
        );

        // Susun rekap
        const rekap = allYears
          .map((tahun) => ({
            tahun,
            masuk: masukPerTahun[tahun] || 0,
            keluar: keluarPerTahun[tahun] || 0,
          }))
          .sort((a, b) => b.tahun - a.tahun); // Sort dari tahun terbaru ke lama

        // Set data ke state
        setDashboardData({
          totalMasuk,
          totalKeluar,
          rekap,
        });
      } catch (err) {
        console.error("Gagal fetch dashboard:", err.message);
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

          {/* Table Rekap Per Tahun */}
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
                {dashboardData.rekap.length > 0 ? (
                  dashboardData.rekap.map((item) => (
                    <tr key={item.tahun} className="hover:bg-gray-100 border-b">
                      <td className="px-4 py-2">{item.tahun}</td>
                      <td className="px-4 py-2">{item.masuk}</td>
                      <td className="px-4 py-2">{item.keluar}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Belum ada data rekap.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BerandaAdmin;
