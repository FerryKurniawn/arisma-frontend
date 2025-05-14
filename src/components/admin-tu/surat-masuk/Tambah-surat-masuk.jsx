import React, { useState } from "react";
import Navigasi from "../Navigasi";
import Logout from "../../Logout";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import AddAlert from "../../AddAlert";

const TambahSuratMasuk = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [noSurat, setNoSurat] = useState("");
  const [perihal, setPerihal] = useState("");
  const [alamatPengirim, setAlamatPengirim] = useState("");
  const [tanggalTerima, setTanggalTerima] = useState(null);
  const [sifatSurat, setSifatSurat] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 2MB.");
      return;
    }
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
    setFile(droppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("noSurat", noSurat);
    formData.append("perihal", perihal);
    formData.append("alamatPengirim", alamatPengirim);
    formData.append("tanggalTerima", format(tanggalTerima, "yyyy-MM-dd"));
    formData.append("sifatSurat", sifatSurat);
    if (file) {
      formData.append("fileUrl", file);
    }

    try {
      const response = await fetch("http://localhost:2000/api/surat-masuk", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        alert("Gagal menambahkan surat.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghubungi server.");
      console.error("Error:", error);
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
              <h2 className="text-2xl font-bold mt-4">Tambah Surat Masuk</h2>
              <img
                src="/back.png"
                alt="back"
                width="20px"
                className="mt-5 cursor-pointer"
                onClick={() => {
                  navigate("/admin/rekap-surat-masuk");
                }}
              />
            </div>
          </div>

          <div className="flex min-h-screen">
            <form
              className="flex flex-col gap-4 w-full max-w-4xl"
              onSubmit={handleSubmit}
            >
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
                <label className="font-medium w-64">Alamat Pengirim</label>
                <input
                  type="text"
                  placeholder="Masukkan Alamat Pengirim"
                  value={alamatPengirim}
                  onChange={(e) => setAlamatPengirim(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">Tanggal Terima</label>
                <input
                  type="date"
                  value={
                    tanggalTerima ? format(tanggalTerima, "yyyy-MM-dd") : ""
                  }
                  onChange={(e) => setTanggalTerima(new Date(e.target.value))}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-medium w-64">Sifat Surat</label>
                <select
                  value={sifatSurat}
                  onChange={(e) => setSifatSurat(e.target.value)}
                  className="flex-1 p-3 rounded-md bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                >
                  <option value="">Pilih</option>
                  <option value="SangatSegera">Sangat Segera</option>
                  <option value="Segera">Segera</option>
                  <option value="Biasa">Biasa</option>
                </select>
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
                className="self-start mt-4 bg-gray-300 hover:bg-gray-400 text-black py-2 px-6 rounded-md"
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
                  navigate("/admin/rekap-surat-masuk");
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TambahSuratMasuk;
