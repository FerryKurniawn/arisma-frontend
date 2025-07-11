import React, { useState, useEffect } from "react";
import Navigasi from "../Kepsekvigasi";
import Logout from "../../Logout";
import { useNavigate } from "react-router-dom";
import Delete from "../../admin-tu/Delete";
import { supabase } from "../../../supabaseClient";

const DaftarDisposisi = () => {
  const navigate = useNavigate();
  const [dataSurat, setDataSurat] = useState([]);
  const [filteredSurat, setFilteredSurat] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const isDataValid = (surat) => {
    return (
      typeof surat.tenggatWaktu === "string" &&
      surat.tenggatWaktu !== "-" &&
      surat.tenggatWaktu.trim() !== ""
    );
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("SuratMasuk")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;

      const validData = data.filter(isDataValid);
      setDataSurat(validData);
      setFilteredSurat(validData);
    } catch (err) {
      console.error("Gagal fetch data surat:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const handleSearch = () => {
    const filtered = dataSurat.filter((surat) => {
      const search = searchTerm.toLowerCase();
      return (
        surat.noSurat.toLowerCase().includes(search) ||
        surat.perihal.toLowerCase().includes(search) ||
        surat.alamatPengirim.toLowerCase().includes(search) ||
        surat.tanggalTerima.toLowerCase().includes(search) ||
        (surat.sifatSurat && surat.sifatSurat.toLowerCase().includes(search)) ||
        (surat.disposisikanKe &&
          surat.disposisikanKe.toLowerCase().includes(search)) ||
        (surat.isiDisposisi &&
          surat.isiDisposisi.toLowerCase().includes(search))
      );
    });

    setFilteredSurat(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("SuratMasuk").delete().eq("id", id);

      if (error) {
        console.error("Error saat hapus surat:", error.message);
        alert("Gagal menghapus surat.");
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("Error saat hapus surat:", err.message);
      alert("Terjadi kesalahan.");
    } finally {
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
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
            <h2 className="text-2xl font-bold">Daftar Disposisi</h2>
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

          {/* Table Surat Masuk */}
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
                  <th className="p-3 text-left font-semibold">Tenggat Waktu</th>
                  <th className="p-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSurat.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
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
                      <td className="p-3">{surat.noSurat}</td>
                      <td className="p-3">{surat.perihal}</td>
                      <td className="p-3 max-w-[200px] truncate">
                        {surat.alamatPengirim}
                      </td>
                      <td className="p-3">
                        {new Date(surat.tanggalTerima).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-3">
                        {surat.sifatSurat === "SangatSegera"
                          ? "Sangat Segera"
                          : surat.sifatSurat}
                      </td>
                      <td className="p-3">{surat.disposisikanKe || "-"}</td>
                      <td className="p-3 max-w-[200px] truncate">
                        {surat.isiDisposisi || "-"}
                      </td>
                      <td className="p-3">
                        {surat.tenggatWaktu
                          ? new Date(surat.tenggatWaktu).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/kepsek/detail-disposisi/${surat.id}`)
                          }
                        >
                          <img src="/eye.png" width="20" alt="Lihat" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/kepsek/edit-disposisi/${surat.id}`)
                          }
                        >
                          <img src="/pencil.png" width="15" alt="Edit" />
                        </button>
                        <button onClick={() => openDeleteModal(surat.id)}>
                          <img src="/trash-can.png" width="15" alt="Hapus" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <Delete
            onDelete={() => handleDelete(selectedId)}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedId(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default DaftarDisposisi;
