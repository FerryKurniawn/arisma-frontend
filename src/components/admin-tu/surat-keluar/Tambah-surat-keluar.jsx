import React, { useState } from "react";
import Navigasi from "../Navigasi";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Logout from "../../Logout";
import AddAlert from "../../AddAlert";
import { format } from "date-fns";
import { supabase } from "../../../supabaseClient";

const TambahSuratKeluar = () => {
  const navigate = useNavigate();

  const [noSurat, setNoSurat] = useState("");
  const [noBerkas, setNoBerkas] = useState("");
  const [alamatPenerima, setAlamatPenerima] = useState("");
  const [tanggalKeluar, setTanggalKeluar] = useState("");
  const [perihal, setPerihal] = useState("");
  const [noPetunjuk, setNoPetunjuk] = useState("");
  const [noPaket, setNoPaket] = useState("");
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 2MB.");
      return;
    }
    setErrorMessage("");
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 2MB.");
      return;
    }
    setErrorMessage("");
    setFile(droppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fileUrl = null;

    try {
      // Upload file ke Supabase Storage jika ada file
      if (file) {
        const { data, error } = await supabase.storage
          .from("surat-keluar")
          .upload(`files/${Date.now()}_${file.name}`, file);

        if (error) {
          console.error("File upload error:", error);
          alert("Gagal mengunggah file.");
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("surat-keluar")
          .getPublicUrl(data.path);

        fileUrl = publicUrlData.publicUrl;
      }

      // Insert ke tabel SuratKeluar
      const { error: insertError } = await supabase.from("SuratKeluar").insert([
        {
          noSurat: noSurat,
          noBerkas: noBerkas,
          alamatPenerima: alamatPenerima,
          tanggalKeluar: format(new Date(tanggalKeluar), "yyyy-MM-dd"),
          perihal: perihal,
          noPetunjuk: noPetunjuk,
          noPaket: noPaket,
          fileUrl: fileUrl,
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        alert("Gagal menambahkan surat.");
        return;
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan saat menghubungi server.");
    }
  };

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
          <div className="flex flex-col items-start justify-between mb-6">
            <div className="flex flex-row justify-between items-center w-full">
              <h2 className="text-2xl font-bold mt-4">Tambah Surat Keluar</h2>
              <img
                src="/back.png"
                alt="back"
                width="20px"
                className="mt-5 cursor-pointer"
                onClick={() => {
                  navigate("/admin/rekap-surat-keluar");
                }}
              />
            </div>
          </div>

          <div className="flex min-h-screen">
            <form
              className="flex flex-col gap-4 w-full max-w-4xl"
              onSubmit={handleSubmit}
            >
              {/* Input Fields */}
              <div className="flex items-center gap-4">
                <label className="font-medium w-64">No. Surat</label>
                <input
                  type="text"
                  placeholder="Masukkan No. Surat"
                  value={noSurat}
                  onChange={(e) => setNoSurat(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">No. Berkas</label>
                <input
                  type="text"
                  placeholder="Masukkan No. Berkas"
                  value={noBerkas}
                  onChange={(e) => setNoBerkas(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">Alamat Penerima</label>
                <input
                  type="text"
                  placeholder="Masukkan Alamat Penerima"
                  value={alamatPenerima}
                  onChange={(e) => setAlamatPenerima(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">Tanggal Keluar</label>
                <input
                  type="date"
                  value={tanggalKeluar}
                  onChange={(e) => setTanggalKeluar(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">Perihal</label>
                <input
                  type="text"
                  placeholder="Masukkan Perihal"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">No. Petunjuk</label>
                <input
                  type="text"
                  placeholder="Masukkan No. Petunjuk"
                  value={noPetunjuk}
                  onChange={(e) => setNoPetunjuk(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">No. Paket</label>
                <input
                  type="text"
                  placeholder="Masukkan No. Paket"
                  value={noPaket}
                  onChange={(e) => setNoPaket(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">Unggah File</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 p-6 rounded-md text-center bg-white text-black shadow cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-2 border-dashed border-blue-500 bg-blue-50"
                      : "border border-gray-300"
                  }`}
                >
                  <label htmlFor="fileInput" className="block cursor-pointer">
                    {file
                      ? file.name
                      : "Pilih file atau seret ke sini (max 2MB)"}
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
              </div>
              {errorMessage && (
                <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
              )}

              <button
                type="submit"
                disabled={
                  !noSurat ||
                  !perihal ||
                  !alamatPenerima ||
                  !tanggalKeluar ||
                  !perihal ||
                  !noPetunjuk ||
                  !noPaket ||
                  errorMessage
                }
                className={`self-start mt-4 py-2 px-6 rounded-md text-white transition-all duration-200
                  ${
                    !noSurat ||
                    !perihal ||
                    !alamatPenerima ||
                    !tanggalKeluar ||
                    !perihal ||
                    !noPetunjuk ||
                    !noPaket ||
                    errorMessage
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#34542C] hover:bg-green-900 cursor-pointer"
                  }`}
              >
                Tambah
              </button>
            </form>
          </div>

          {showSuccess && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
              <AddAlert
                onClose={() => {
                  setShowSuccess(false);
                  navigate("/admin/rekap-surat-keluar");
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TambahSuratKeluar;
