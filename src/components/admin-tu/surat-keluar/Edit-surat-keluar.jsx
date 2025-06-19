import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Navigasi";
import InputForm from "../../InputForm";
import Logout from "../../Logout";
import UpdateAlert from "../../UpdateAlert";
import { supabase } from "../../../supabaseClient"; // Import Supabase client

const EditSuratKeluar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [noSurat, setNoSurat] = useState("");
  const [noBerkas, setNoBerkas] = useState("");
  const [alamatPenerima, setAlamatPenerima] = useState("");
  const [tanggalKeluar, setTanggalKeluar] = useState("");
  const [perihal, setPerihal] = useState("");
  const [noPetunjuk, setNoPetunjuk] = useState("");
  const [noPaket, setNoPaket] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const { data, error } = await supabase
          .from("SuratKeluar")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setNoSurat(data.noSurat || "");
        setNoBerkas(data.noBerkas || "");
        setAlamatPenerima(data.alamatPenerima || "");
        setTanggalKeluar(
          data.tanggalKeluar ? data.tanggalKeluar.slice(0, 10) : ""
        );
        setPerihal(data.perihal || "");
        setNoPetunjuk(data.noPetunjuk || "");
        setNoPaket(data.noPaket || "");

        setOriginalData({
          noSurat: data.noSurat || "",
          noBerkas: data.noBerkas || "",
          alamatPenerima: data.alamatPenerima || "",
          tanggalKeluar: data.tanggalKeluar
            ? data.tanggalKeluar.slice(0, 10)
            : "",
          perihal: data.perihal || "",
          noPetunjuk: data.noPetunjuk || "",
          noPaket: data.noPaket || "",
          fileUrl: data.fileUrl || "",
        });
      } catch (error) {
        console.error("Error fetching surat keluar:", error.message);
      }
    };

    fetchSurat();
  }, [id]);

  const isChanged = () => {
    if (!originalData) return false;
    return (
      noSurat !== originalData.noSurat ||
      noBerkas !== originalData.noBerkas ||
      alamatPenerima !== originalData.alamatPenerima ||
      tanggalKeluar !== originalData.tanggalKeluar ||
      perihal !== originalData.perihal ||
      noPetunjuk !== originalData.noPetunjuk ||
      noPaket !== originalData.noPaket ||
      file !== null
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 2MB.");
        setFile(null);
      } else {
        setErrorMessage("");
        setFile(selectedFile);
      }
    }
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
    if (droppedFile) {
      if (droppedFile.size > 2 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 2MB.");
        setFile(null);
      } else {
        setErrorMessage("");
        setFile(droppedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        noSurat,
        noBerkas,
        alamatPenerima,
        tanggalKeluar,
        perihal,
        noPetunjuk,
        noPaket,
      };

      if (file) {
        // Proses upload file jika ada file baru
        const { data: fileData, error: fileError } = await supabase.storage
          .from("surat-keluar")
          .upload(`file_${Date.now()}`, file);

        if (fileError) throw fileError;

        const fileUrl = supabase.storage
          .from("surat-keluar")
          .getPublicUrl(fileData.path).publicURL;

        updatedData.fileUrl = fileUrl;
      }

      const { error } = await supabase
        .from("SuratKeluar")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating Surat Keluar:", error.message);
      alert("Terjadi kesalahan saat mengupdate data.");
    }
  };

  const handleCloseAlert = () => {
    setShowSuccess(false);
    navigate("/admin/rekap-surat-keluar");
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
          <div className="flex justify-between items-center mt-6 mb-6">
            <h2 className="text-2xl font-bold">Edit Surat Keluar</h2>
            <img
              src="/back.png"
              alt="back"
              width="20px"
              className="cursor-pointer"
              onClick={() => navigate("/admin/rekap-surat-keluar")}
            />
          </div>

          <form
            className="flex flex-col gap-2 w-xl max-w-full"
            onSubmit={handleSubmit}
          >
            <InputForm
              label="No. Surat"
              placeholder="Masukkan No. Surat"
              value={noSurat}
              onChange={(e) => setNoSurat(e.target.value)}
            />
            <InputForm
              label="No. Berkas"
              placeholder="Masukkan No. Berkas"
              value={noBerkas}
              onChange={(e) => setNoBerkas(e.target.value)}
            />
            <InputForm
              label="Alamat Penerima"
              placeholder="Masukkan Alamat Penerima"
              value={alamatPenerima}
              onChange={(e) => setAlamatPenerima(e.target.value)}
            />
            <InputForm
              label="Tanggal Keluar"
              type="date"
              value={tanggalKeluar}
              onChange={(e) => setTanggalKeluar(e.target.value)}
            />
            <InputForm
              label="Perihal"
              placeholder="Masukkan Perihal"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
            />
            <InputForm
              label="No. Petunjuk"
              placeholder="Masukkan No. Petunjuk"
              value={noPetunjuk}
              onChange={(e) => setNoPetunjuk(e.target.value)}
            />
            <InputForm
              label="No. Paket"
              placeholder="Masukkan No. Paket"
              value={noPaket}
              onChange={(e) => setNoPaket(e.target.value)}
            />

            <div className="flex">
              <label className="font-semibold mr-20">Unggah File Baru</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex items-center p-4 w-[470px] rounded-md text-center bg-white shadow cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-2 border-dashed border-blue-500 bg-blue-50"
                    : "border border-gray-300"
                }`}
              >
                <label htmlFor="fileInput" className="block cursor-pointer">
                  Unggah file atau seret ke sini (maks 2MB){" "}
                  {file ? `- ${file.name}` : ""}
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

            {!file && originalData?.fileUrl ? (
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  File sebelumnya:{" "}
                  <a
                    href={originalData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Lihat File Lama
                  </a>
                </p>
              </div>
            ) : (
              !file && (
                <div className="mt-2 text-sm text-red-500">
                  <p>Tidak ada file lama yang terlampir.</p>
                </div>
              )
            )}

            <button
              type="submit"
              disabled={!isChanged()}
              className={`mt-4 py-2 rounded-md ${
                isChanged()
                  ? "bg-[#34542C] hover:bg-[#34542C] text-white font-semibold"
                  : "bg-[#34542C] opacity-70 text-gray-500 cursor-not-allowed"
              }`}
            >
              Perbarui Surat
            </button>
          </form>
        </main>
      </div>

      {showSuccess && <UpdateAlert onClose={handleCloseAlert} />}
    </div>
  );
};

export default EditSuratKeluar;
