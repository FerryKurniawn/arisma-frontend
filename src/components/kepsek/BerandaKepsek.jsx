import React, { useEffect, useState } from "react";
import Navigasi from "./Kepsekvigasi";
import Logout from "../Logout";
import { supabase } from "../../supabaseClient";

const BerandaKepsek = () => {
  const [dashboardData, setDashboardData] = useState({
    totalMasuk: 0,
    totalDisposisi: 0,
    rekap: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil semua surat masuk
        const { data: suratMasukData, error: suratError } = await supabase
          .from("SuratMasuk")
          .select("*");

        if (suratError) throw suratError;

        // Hitung total surat masuk
        const totalMasuk = suratMasukData.length;

        // Ambil semua data disposisi
        const { data: disposisiData, error: disposisiError } = await supabase
          .from("DaftarDisposisi")
          .select("*");

        if (disposisiError) throw disposisiError;

        const totalDisposisi = disposisiData.length;

        // Buat rekap per tahun berdasarkan tanggalTerima di suratMasuk
        const rekapMap = {};

        suratMasukData.forEach((surat) => {
          const tahun = new Date(surat.tanggalTerima).getFullYear();
          if (!rekapMap[tahun]) {
            rekapMap[tahun] = { masuk: 0, disposisi: 0 };
          }
          rekapMap[tahun].masuk += 1;
        });

        disposisiData.forEach((disposisi) => {
          const suratTerkait = suratMasukData.find(
            (surat) => surat.id === disposisi.suratMasukId
          );
          if (suratTerkait) {
            const tahun = new Date(suratTerkait.tanggalTerima).getFullYear();
            if (!rekapMap[tahun]) {
              rekapMap[tahun] = { masuk: 0, disposisi: 0 };
            }
            rekapMap[tahun].disposisi += 1;
          }
        });

        const rekap = Object.keys(rekapMap).map((tahun) => ({
          tahun,
          masuk: rekapMap[tahun].masuk,
          disposisi: rekapMap[tahun].disposisi,
        }));

        setDashboardData({
          totalMasuk,
          totalDisposisi,
          rekap,
        });
      } catch (error) {
        console.error("Gagal fetch dashboard:", error);
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
              <h3 className="text-gray-600 mb-1">Jumlah Disposisi</h3>
              <p className="text-3xl font-bold text-black">
                {dashboardData.totalDisposisi}
              </p>
            </div>
          </div>

          {/* Table Rekap */}
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
                  <th className="px-4 py-2 text-left">Disposisi</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {dashboardData.rekap.map((item) => (
                  <tr key={item.tahun} className="hover:bg-gray-100 border-b">
                    <td className="px-4 py-2">{item.tahun}</td>
                    <td className="px-4 py-2">{item.masuk}</td>
                    <td className="px-4 py-2">{item.disposisi}</td>
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

export default BerandaKepsek;
