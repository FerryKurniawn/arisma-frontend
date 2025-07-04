import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Navigasi";
import Logout from "../../Logout";
import { supabase } from "../../../supabaseClient"; // Pastikan path sesuai

const Detailsuratmasuk = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [surat, setSurat] = useState(null);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const { data, error } = await supabase
          .from("SuratMasuk") // Pastikan nama tabel di Supabase benar
          .select("*")
          .eq("id", id)
          .single(); // Mengambil hanya satu data

        if (error) {
          throw error;
        }

        setSurat(data);
      } catch (error) {
        console.error("Error fetching surat Masuk:", error.message);
      }
    };

    fetchSurat();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-[320px] flex-shrink-0">
        <Navigasi />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full bg-white shadow-md p-4 flex justify-end sticky top-0 z-30">
          <Logout />
        </div>

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mt-6 mb-6">
            <h2 className="text-2xl font-bold">Surat Masuk</h2>
            <img
              src="/back.png"
              alt="back"
              width="20px"
              className="cursor-pointer"
              onClick={() => navigate("/admin/rekap-surat-masuk")}
            />
          </div>

          {surat ? (
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">No. Surat</h3>
                <p>{surat.noSurat}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Perihal</h3>
                <p>{surat.perihal}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Alamat Pengirim</h3>
                <p>{surat.alamatPengirim}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Tanggal Terima</h3>
                <p>{surat.tanggalTerima?.slice(0, 10)}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Sifat Surat</h3>
                <p>
                  {surat.sifatSurat === "SangatSegera"
                    ? "Sangat Segera"
                    : surat.sifatSurat}
                </p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Disposisi</h3>
                <p>
                  {surat.disposisikanKe?.trim() ? surat.disposisikanKe : "-"}
                </p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Isi Disposisi</h3>
                <p>{surat.isiDisposisi?.trim() ? surat.isiDisposisi : "-"}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">File Surat</h3>
                <div className="col-span-2">
                  {surat.fileUrl ? (
                    surat.fileUrl.endsWith(".pdf") ? (
                      <iframe
                        src={surat.fileUrl}
                        title="File Surat"
                        width="100%"
                        height="500px"
                        className="border rounded"
                      ></iframe>
                    ) : (
                      <a
                        href={surat.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat File
                      </a>
                    )
                  ) : (
                    <p className="text-gray-500">Tidak ada file terlampir</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Detailsuratmasuk;
