import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Navigasi";
import InputForm from "../../InputForm";
import Logout from "../../Logout";
import UpdateAlert from "../../UpdateAlert";
import { supabase } from "../../../supabaseClient";

const EditSuratMasuk = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [noSurat, setNoSurat] = useState("");
  const [perihal, setPerihal] = useState("");
  const [alamatPengirim, setAlamatPengirim] = useState("");
  const [tanggalTerima, setTanggalTerima] = useState("");
  const [sifatSurat, setSifatSurat] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const { data, error } = await supabase
          .from("SuratMasuk")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setNoSurat(data.noSurat);
        setPerihal(data.perihal);
        setAlamatPengirim(data.alamatPengirim);
        setTanggalTerima(data.tanggalTerima.slice(0, 10));
        setSifatSurat(data.sifatSurat);

        setOriginalData({
          noSurat: data.noSurat,
          perihal: data.perihal,
          alamatPengirim: data.alamatPengirim,
          tanggalTerima: data.tanggalTerima.slice(0, 10),
          sifatSurat: data.sifatSurat,
          fileUrl: data.fileUrl,
        });
      } catch (error) {
        console.error("Error fetching surat masuk:", error.message);
      }
    };

    fetchSurat();
  }, [id]);

  const isChanged = () => {
    if (!originalData) return false;
    return (
      noSurat !== originalData.noSurat ||
      perihal !== originalData.perihal ||
      alamatPengirim !== originalData.alamatPengirim ||
      tanggalTerima !== originalData.tanggalTerima ||
      sifatSurat !== originalData.sifatSurat ||
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
      let fileUrl = originalData?.fileUrl;

      // jika ada file baru diupload
      if (file) {
        const { data: uploadedFile, error: uploadError } =
          await supabase.storage
            .from("surat-masuk") // nama bucket storage kamu
            .upload(`surat-masuk/${Date.now()}_${file.name}`, file);

        if (uploadError) throw uploadError;

        const { data: fileData } = supabase.storage
          .from("surat-masuk")
          .getPublicUrl(uploadedFile.path);

        fileUrl = fileData.publicUrl;
      }

      // update ke tabel SuratMasuk
      const { error } = await supabase
        .from("SuratMasuk")
        .update({
          noSurat,
          perihal,
          alamatPengirim,
          tanggalTerima,
          sifatSurat,
          fileUrl,
        })
        .eq("id", id);

      if (error) throw error;

      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating Surat Masuk:", error.message);
      alert("Terjadi kesalahan saat update data.");
    }
  };

  const handleCloseAlert = () => {
    setShowSuccess(false);
    navigate("/admin/rekap-surat-masuk");
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
            <h2 className="text-2xl font-bold">Edit Surat Masuk</h2>
            <img
              src="/back.png"
              alt="back"
              width="20px"
              className="cursor-pointer"
              onClick={() => navigate("/admin/rekap-surat-masuk")}
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
              label="Perihal"
              placeholder="Masukkan Perihal"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
            />
            <InputForm
              label="Alamat Pengirim"
              placeholder="Masukkan Alamat Pengirim"
              value={alamatPengirim}
              onChange={(e) => setAlamatPengirim(e.target.value)}
            />
            <InputForm
              label="Tanggal Terima"
              type="date"
              value={tanggalTerima}
              onChange={(e) => setTanggalTerima(e.target.value)}
            />
            <div className="flex items-center mb-4">
              <label className="font-medium mr-[110px]">Sifat Surat</label>
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

            <div className="flex ">
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

export default EditSuratMasuk;
