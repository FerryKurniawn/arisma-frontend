import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Kepsekvigasi";
import InputForm from "../../InputForm";
import Logout from "../../Logout";
import UpdateAlert from "../../UpdateAlert";
import { supabase } from "../../../supabaseClient";

const EditDisposisi = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [noSurat, setNoSurat] = useState("");
  const [perihal, setPerihal] = useState("");
  const [alamatPengirim, setAlamatPengirim] = useState("");
  const [tanggalTerima, setTanggalTerima] = useState("");
  const [sifatSurat, setSifatSurat] = useState("");
  const [disposisikanKe, setDisposisikanKe] = useState("");
  const [isiDisposisi, setIsiDisposisi] = useState("");
  const [tenggatWaktu, setTenggatWaktu] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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
        setDisposisikanKe(data.disposisikanKe);
        setIsiDisposisi(data.isiDisposisi);
        setTenggatWaktu(data.tenggatWaktu?.slice(0, 10));

        setOriginalData({
          noSurat: data.noSurat,
          perihal: data.perihal,
          alamatPengirim: data.alamatPengirim,
          tanggalTerima: data.tanggalTerima.slice(0, 10),
          sifatSurat: data.sifatSurat,
          disposisikanKe: data.disposisikanKe,
          isiDisposisi: data.isiDisposisi,
          tenggatWaktu: data.tenggatWaktu?.slice(0, 10),
          fileUrl: data.fileUrl,
        });
      } catch (error) {
        console.error("Error fetching disposisi:", error.message);
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
      disposisikanKe !== originalData.disposisikanKe ||
      isiDisposisi !== originalData.isiDisposisi ||
      tenggatWaktu !== originalData.tenggatWaktu ||
      file !== null
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 2MB.");
      setFile(null);
    } else {
      setErrorMessage("");
      setFile(selectedFile);
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
    if (droppedFile && droppedFile.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 2MB.");
      setFile(null);
    } else {
      setErrorMessage("");
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = originalData?.fileUrl;

      if (file) {
        const { data: uploadedFile, error: uploadError } =
          await supabase.storage
            .from("surat-masuk")
            .upload(`surat-masuk/${Date.now()}_${file.name}`, file);

        if (uploadError) throw uploadError;

        const { data: fileData } = supabase.storage
          .from("surat-masuk")
          .getPublicUrl(uploadedFile.path);

        fileUrl = fileData.publicUrl;
      }

      const { error } = await supabase
        .from("SuratMasuk")
        .update({
          noSurat,
          perihal,
          alamatPengirim,
          tanggalTerima,
          sifatSurat,
          disposisikanKe,
          isiDisposisi,
          tenggatWaktu,
          fileUrl,
        })
        .eq("id", id);

      if (error) throw error;

      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating Disposisi:", error.message);
      alert("Terjadi kesalahan saat update data.");
    }
  };

  const handleCloseAlert = () => {
    setShowSuccess(false);
    navigate("/kepsek/Daftar-Disposisi");
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
            <h2 className="text-2xl font-bold">Edit Disposisi</h2>
            <img
              src="/back.png"
              alt="back"
              width="20px"
              className="cursor-pointer"
              onClick={() => navigate("/kepsek/daftar-disposisi")}
            />
          </div>

          <form
            className="flex flex-col gap-2 max-w-2xl"
            onSubmit={handleSubmit}
          >
            <InputForm
              label="No. Surat"
              value={noSurat}
              onChange={(e) => setNoSurat(e.target.value)}
            />
            <InputForm
              label="Perihal"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
            />
            <InputForm
              label="Alamat Pengirim"
              value={alamatPengirim}
              onChange={(e) => setAlamatPengirim(e.target.value)}
            />
            <InputForm
              label="Tanggal Terima"
              type="date"
              value={tanggalTerima}
              onChange={(e) => setTanggalTerima(e.target.value)}
            />
            <InputForm
              label="Sifat Surat"
              isSelect
              value={sifatSurat}
              onChange={(e) => setSifatSurat(e.target.value)}
              options={[
                { value: "", label: "Pilih" },
                { value: "SangatSegera", label: "Sangat Segera" },
                { value: "Segera", label: "Segera" },
                { value: "Biasa", label: "Biasa" },
              ]}
            />
            <InputForm
              label="Disposisikan Ke"
              value={disposisikanKe}
              onChange={(e) => setDisposisikanKe(e.target.value)}
            />
            <InputForm
              label="Isi Disposisi"
              isTextarea
              value={isiDisposisi}
              onChange={(e) => setIsiDisposisi(e.target.value)}
            />
            <InputForm
              label="Tenggat Waktu"
              type="date"
              value={tenggatWaktu}
              onChange={(e) => setTenggatWaktu(e.target.value)}
            />

            <div className="flex">
              <label className="font-semibold mr-28">Unggah File Baru</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-[700px] p-4 rounded shadow-md bg-white text-center cursor-pointer ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <label htmlFor="fileInput" className="cursor-pointer block">
                  {file ? file.name : "Klik atau seret file ke sini (maks 2MB)"}
                </label>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </div>
              {errorMessage && (
                <div className="text-sm text-red-500 mt-1">{errorMessage}</div>
              )}
            </div>

            {!file && originalData?.fileUrl && (
              <div className="mt-2 text-sm text-gray-700">
                File sebelumnya:{" "}
                <a
                  href={originalData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File Lama
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={!isChanged()}
              className={`mt-4 py-2 rounded-md ${
                isChanged()
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Perbarui Disposisi
            </button>
          </form>
        </main>
      </div>

      {showSuccess && <UpdateAlert onClose={handleCloseAlert} />}
    </div>
  );
};

export default EditDisposisi;
