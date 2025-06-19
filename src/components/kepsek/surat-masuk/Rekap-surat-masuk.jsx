import React, { useState, useEffect } from "react";
import Navigasi from "../Kepsekvigasi";
import { useNavigate } from "react-router-dom";
import Logout from "../../Logout";
import { supabase } from "../../../supabaseClient"; // sudah pakai supabaseClient.js kamu

const SuratMasuk = () => {
  const [suratMasuk, setSuratMasuk] = useState([]);
  const [filteredSurat, setFilteredSurat] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuratMasuk = async () => {
      try {
        const { data, error } = await supabase
          .from("SuratMasuk") // sesuaikan dengan nama tabel di Supabase kamu
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) {
          console.error("Error fetching surat masuk:", error);
          return;
        }

        if (Array.isArray(data)) {
          setSuratMasuk(data);
          setFilteredSurat(data);
        } else {
          console.error("Data bukan array:", data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchSuratMasuk();
  }, []);

  const handleSearch = () => {
    const search = searchTerm.toLowerCase();
    const filtered = suratMasuk.filter((surat) =>
      [
        surat.noSurat,
        surat.perihal,
        surat.alamatPengirim,
        surat.tanggalTerima,
        surat.sifatSurat,
        surat.disposisikanKe,
        surat.isiDisposisi,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(search))
    );
    setFilteredSurat(filtered);
  };

  const handleView = (id) => {
    navigate(`/kepsek/detail-surat-masuk/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[320px] flex-shrink-0">
        <Navigasi />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-screen relative">
        {/* Sticky top bar with Logout */}
        <div className="bg-white shadow px-4 py-2 sticky top-0 z-20 flex justify-end">
          <Logout />
        </div>

        <div className="p-8">
          {/* Header and Search */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Rekap Surat Masuk</h2>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md bg-white rounded-md">
                <input
                  type="text"
                  placeholder="Cari"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="w-full border rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <img src="/search.png" width="15px" alt="Search" />
                </div>
              </div>
              <button
                className={`px-6 py-2 text-sm rounded-md text-white transition-colors duration-200 ${
                  searchTerm.trim()
                    ? "bg-[#34542C] hover:bg-gray-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
              >
                Cari
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto bg-white shadow-md rounded-md">
            <table className="min-w-full text-sm table-auto">
              <thead className="bg-white">
                <tr>
                  <th className="p-3 text-left font-semibold">No. Surat</th>
                  <th className="p-3 text-left font-semibold">Perihal</th>
                  <th className="p-3 text-left font-semibold">
                    Alamat Pengirim
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Tanggal Terima
                  </th>
                  <th className="p-3 text-left font-semibold">Sifat Surat</th>
                  <th className="p-3 text-left font-semibold">
                    Disposisikan Ke
                  </th>
                  <th className="p-3 text-left font-semibold">Isi Disposisi</th>
                  <th className="p-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSurat.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  filteredSurat.map((surat, index) => (
                    <tr
                      key={surat.id}
                      className="border-t"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "rgba(217,217,217,0.5)" : "white",
                      }}
                    >
                      <td className="p-3">{surat.noSurat || "-"}</td>
                      <td className="p-3">{surat.perihal || "-"}</td>
                      <td className="p-3 max-w-[200px] truncate">
                        {surat.alamatPengirim || "-"}
                      </td>
                      <td className="p-3">
                        {surat.tanggalTerima
                          ? new Date(surat.tanggalTerima).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="p-3">
                        {surat.sifatSurat === "SangatSegera"
                          ? "Sangat Segera"
                          : surat.sifatSurat || "-"}
                      </td>
                      <td className="p-3">{surat.disposisikanKe || "-"}</td>
                      <td className="p-3 max-w-[200px] truncate">
                        {surat.isiDisposisi || "-"}
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button onClick={() => handleView(surat.id)}>
                          <img src="/eye.png" width="20" alt="View" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuratMasuk;
