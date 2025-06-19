import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigasi from "../Kepsekvigasi";
import Logout from "../../Logout";
import SentAlert from "../../SentAlert";
import { supabase } from "../../../supabaseClient";

const DetailSuratMasuk = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [surat, setSurat] = useState({
    noSurat: "",
    perihal: "",
    alamatPengirim: "",
    tanggalTerima: "",
    sifatSurat: "",
    isiDisposisi: "",
    fileUrl: "",
    disposisikanKe: "",
    tenggatWaktu: "",
  });

  const [adminList, setAdminList] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "";
    const date = new Date(tanggal);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const { data, error } = await supabase
          .from("SuratMasuk")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setSurat({
          noSurat: data.noSurat,
          perihal: data.perihal,
          alamatPengirim: data.alamatPengirim,
          tanggalTerima: formatTanggal(data.tanggalTerima),
          sifatSurat: data.sifatSurat,
          isiDisposisi: data.isiDisposisi || "",
          fileUrl: data.fileUrl,
          disposisikanKe: data.disposisikanKe || "",
          tenggatWaktu: data.tenggatWaktu?.split("T")[0] || "",
        });
      } catch (error) {
        console.error("Error fetching surat masuk:", error.message);
      }
    };

    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from("User")
          .select("id, username")
          .eq("role", "ADMIN");

        if (error) throw error;

        setAdminList(data);
      } catch (error) {
        console.error("Gagal mengambil data admin:", error.message);
      }
    };

    fetchSurat();
    fetchAdmins();
  }, [id]);

  const handleChange = (e) => {
    setErrorMessage("");
    setSurat({ ...surat, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!surat.disposisikanKe || !surat.isiDisposisi || !surat.tenggatWaktu) {
      setErrorMessage("Semua field disposisi wajib diisi.");
      return;
    }

    try {
      const { error } = await supabase
        .from("SuratMasuk")
        .update({
          disposisikanKe: surat.disposisikanKe,
          isiDisposisi: surat.isiDisposisi,
          tenggatWaktu: new Date(surat.tenggatWaktu).toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating surat masuk:", error.message);
        alert("Gagal memperbarui surat disposisi.");
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Terjadi kesalahan.");
    }
  };

  const handleCloseAlert = () => {
    setShowSuccess(false);
    navigate("/kepsek/surat-masuk");
  };

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
            <h2 className="text-2xl font-bold">Detail Surat Masuk</h2>
            <img
              src="/back.png"
              alt="back"
              width="20px"
              className="cursor-pointer"
              onClick={() => navigate("/kepsek/surat-masuk")}
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

          <h2 className="text-2xl font-bold mb-4 mt-4">Form Disposisi</h2>
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl mt-6">
            <div className="mb-4 grid grid-cols-3 gap-4 items-center">
              <h3 className="font-semibold">Disposisikan ke</h3>
              <select
                name="disposisikanKe"
                className="col-span-2 p-2 border rounded"
                value={surat.disposisikanKe}
                onChange={handleChange}
              >
                <option value="">Pilih</option>
                {adminList.map((admin) => (
                  <option key={admin.id} value={admin.username}>
                    {admin.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-4 items-start">
              <h3 className="font-semibold">Isi Disposisi</h3>
              <input
                type="text"
                name="isiDisposisi"
                className="col-span-2 p-2 border rounded"
                value={surat.isiDisposisi}
                onChange={handleChange}
                placeholder="Tulis isi disposisi..."
              />
            </div>

            <div className="mb-4 grid grid-cols-3 gap-4 items-center">
              <h3 className="font-semibold">Tenggat Waktu</h3>
              <input
                type="date"
                name="tenggatWaktu"
                className="col-span-2 p-2 border rounded"
                value={surat.tenggatWaktu}
                onChange={handleChange}
              />
            </div>

            {errorMessage && (
              <p className="text-red-600 font-medium mb-4 col-span-3">
                {errorMessage}
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="bg-[#34542C] py-3 px-8 text-white"
            >
              Kirim
            </button>
          </div>
        </main>
      </div>

      {showSuccess && <SentAlert onClose={handleCloseAlert} />}
    </div>
  );
};

export default DetailSuratMasuk;
