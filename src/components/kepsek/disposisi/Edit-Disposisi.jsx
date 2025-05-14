// ... import statements tetap
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Kepsekvigasi";
import InputForm from "../../InputForm";
import Logout from "../../Logout";
import UpdateAlert from "../../UpdateAlert";

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
  const [adminList, setAdminList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/surat-masuk/${id}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data surat masuk");
        const data = await response.json();

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
        console.error("Error fetching surat masuk:", error);
      }
    };

    fetchSurat();
  }, [id]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users?role=admin`
        );
        if (!response.ok) throw new Error("Failed to fetch admins");
        const admins = await response.json();
        setAdminList(admins);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

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
      const formData = new FormData();
      formData.append("noSurat", noSurat);
      formData.append("perihal", perihal);
      formData.append("alamatPengirim", alamatPengirim);
      formData.append("tanggalTerima", tanggalTerima);
      formData.append("sifatSurat", sifatSurat);
      formData.append("disposisikanKe", disposisikanKe);
      formData.append("isiDisposisi", isiDisposisi);
      formData.append("tenggatWaktu", tenggatWaktu);
      if (file) formData.append("fileUrl", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/surat-masuk/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        setShowSuccess(true);
      } else {
        alert("Terjadi kesalahan saat mengupdate Surat Masuk.");
      }
    } catch (error) {
      console.error("Error updating Surat Masuk:", error);
      alert("Terjadi kesalahan saat menghubungi server.");
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
              onClick={() => navigate("/kepsek/Daftar-Disposisi")}
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
            <div className="mb-4 flex gap-4 items-center">
              <h3 className="font-semibold mr-16">Disposisikan ke</h3>
              <select
                className="w-[480px] p-4 bg-white rounded shadow-md"
                value={disposisikanKe}
                onChange={(e) => setDisposisikanKe(e.target.value)}
              >
                <option value="">Pilih</option>
                {adminList.map((admin) => (
                  <option key={admin.id} value={admin.username}>
                    {admin.username}
                  </option>
                ))}
              </select>
            </div>
            <InputForm
              label="Isi Disposisi"
              value={isiDisposisi}
              isTextarea
              onChange={(e) => setIsiDisposisi(e.target.value)}
            />
            <InputForm
              label="Tenggat Waktu"
              type="date"
              value={tenggatWaktu}
              onChange={(e) => setTenggatWaktu(e.target.value)}
            />

            {/* Drag & Drop File Upload */}
            <div className="flex">
              <label className="font-semibold mr-28">Unggah File Baru</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-[700px] p-4 rounded shadow-md bg-white text-center cursor-pointer transition-all duration-200 ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <label htmlFor="fileInput" className="block cursor-pointer">
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
                  ? "bg-[#34542C] hover:bg-[#34542C] text-white font-semibold"
                  : "bg-[#34542C] opacity-70 text-gray-500 cursor-not-allowed"
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
