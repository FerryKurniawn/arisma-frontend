import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Navigasi";
import Logout from "../../Logout";
import { supabase } from "../../../supabaseClient"; // Import Supabase client

const DetailSuratKeluar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const { data, error } = await supabase
          .from("SuratKeluar")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setSurat(data);
      } catch (error) {
        console.error("Error fetching surat keluar:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-[320px] flex-shrink-0">
        <Navigasi />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full bg-white shadow-md p-4 flex justify-end sticky top-0 z-30">
          <Logout />
        </div>

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mt-6 mb-6">
            <h2 className="text-2xl font-bold">Detail Surat Keluar</h2>
            <img
              src="/back.png"
              alt="back"
              width="20px"
              className="cursor-pointer"
              onClick={() => navigate("/admin/rekap-surat-keluar")}
            />
          </div>

          {loading ? (
            <p>Loading data surat keluar...</p>
          ) : surat ? (
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">No. Surat</h3>
                <p className="col-span-2">{surat.noSurat ?? "null"}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">No. Berkas</h3>
                <p className="col-span-2">{surat.noBerkas ?? "null"}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Alamat Penerima</h3>
                <p className="col-span-2">{surat.alamatPenerima ?? "null"}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Tanggal Keluar</h3>
                <p className="col-span-2">
                  {surat.tanggalKeluar
                    ? surat.tanggalKeluar.slice(0, 10)
                    : "null"}
                </p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">Perihal</h3>
                <p className="col-span-2">{surat.perihal ?? "null"}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">No. Petunjuk</h3>
                <p className="col-span-2">{surat.noPetunjuk ?? "null"}</p>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <h3 className="font-semibold">No. Paket</h3>
                <p className="col-span-2">{surat.noPaket ?? "null"}</p>
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
            <p>Data surat keluar tidak ditemukan pada ID {id}.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DetailSuratKeluar;
