# Prototype UI Digitalisasi Pengajuan Proposal - Kantor Layanan Lazismu UAD

Repositori rancangan antarmuka (UI/UX) dan simulasi sistem operasional untuk proyek Skripsi / Capstone Project:
**"Digitalisasi Sistem Pengajuan, Approval Berjenjang, dan Pelaporan Proposal Dana Kebajikan di Kantor Layanan Lazismu Universitas Ahmad Dahlan"**

---

## 👥 Tim Pengembang (4 Mahasiswa)
- **Topik Skripsi**: Sistem Informasi Pengajuan Proposal Lazismu UAD
- **Dosen Pembimbing**: Pak Farid
- **Mitra Lapangan**: Kantor Layanan Lazismu UAD (Pak Amrullah & Tim)
- **Konsultan Akademik**: Pak Agung & Pak Sunu

---

## 🎯 Masalah yang Diselesaikan (Latar Belakang 3 Tahun Mangkrak)
1. **Penyimpanan Data Terpusat & Rawan Human Error**: Selama 3 tahun proses bertumpu pada Google Form dan 1 Google Spreadsheet rekapitulasi yang rentan tertimpa data dan tidak memiliki otorisasi berjenjang.
2. **Ketiadaan Audit Trail Catatan Internal**: Catatan kelayakan dan rekam jejak pemohon tidak terdokumentasi rapi antar level.
3. **Penyusunan BAST Manual**: Berita Acara Serah Terima (BAST) harus diketik ulang manual saat pemohon datang ke kantor.
4. **Masalah Tunggakan LPJ**: Banyak pemohon yang terlambat atau tidak menyetorkan Laporan Pertanggungjawaban karena tiadanya sistem pengingat otomatis.

---

## ⚡ Alur 7 Tahapan Operasional yang Diterapkan

```
[1. Pengajuan Pemohon]
        │
        ▼
[2. Verifikasi Awal Staff (L1)]  ───(Catatan Rahasia & Track Record)
        │
        ▼
[3. Review Bidang Pendistribusian (L2)] ───(Pilar Lazismu & Usulan Nominal)
        │
        ▼
[4. Putusan Final Ketua (L3)]  ───(Ketuk Palu ACC & Kunci Nominal Final)
        │
        ▼
[5. Auto-Generate BAST & WA Gateway] ───(Instruksi Hadir Fisik ke Kantor)
        │
        ▼
[6. Tanda Tangan Basah & Pencairan (Keuangan)] ───(Stempel Fisik Lembaga)
        │
        ▼
[7. Pelaporan LPJ & Timer H+14] ───(Upload Scan LPJ + Berkas Fisik Audit)
```

---

## 🎨 Panduan Mengubah "Code to Figma" (Mengimpor ke Figma)

Untuk memasukkan prototype web ini ke dalam Figma sebagai vector frame yang dapat diedit:

1. **Jalankan Web Secara Lokal**:
   - Anda cukup membuka file [`index.html`](file:///e:/Matkul%20Persemester/MATKUL%20SEMESTER%208/Pra-Skripsi/testing%20ui/index.html) langsung di browser (Google Chrome / Microsoft Edge).
   - Atau jalankan local web server sederhana:
     ```bash
     npx serve "testing ui"
     # atau
     python -m http.server 8000
     ```

2. **Gunakan Plugin Figma `html.to.design`**:
   - Buka file Figma Anda: [Figma WEB-LAZISMU](https://www.figma.com/design/6YrFyrqoItnJ2uCNkTwP4t/WEB-LAZISMU?node-id=213-2353&t=LJA0J9Ys27samDUh-1)
   - Buka menu **Plugins** -> Cari **html.to.design** (by Divriots).
   - Masukkan URL local server (misal: `http://localhost:8000` atau URL web Anda) atau install ekstensi Chrome `html.to.design`.
   - Klik **Import to Figma**. Seluruh komponen (Navbar, Card, Stepper, Modal, dan Form) akan terkonversi otomatis menjadi Auto-Layout, Text Layers, dan Vector Frames di Figma!

---

## 🚀 Fitur Unggulan Prototype Ini
1. **Interactive Role Switcher Bar**: Dapat berpindah instan ke 5 peran aktor utama:
   - 🌐 **Publik & Beranda**: Pelacakan nomor registrasi proposal seketika.
   - 👤 **Pemohon**: Form pengajuan terintegrasi, kalkulasi estimasi, tracking alur, dan upload scan LPJ.
   - 📋 **Staff (Level 1)**: Cek kelengkapan berkas, evaluasi rekam jejak (*track record* masa lalu), dan input catatan evaluasi rahasia (*hidden* dari pemohon).
   - 📊 **Pengurus Bidang (Level 2)**: Penilaian kesesuaian 6 Pilar Lazismu dan pengusulan nominal bantuan yang layak.
   - 👑 **Ketua / Pimpinan (Level 3)**: Full audit trail riwayat evaluasi (Staff + Bidang), penetapan nominal final, tombol ACC yang langsung menerbitkan dokumen BAST otomatis.
   - 💳 **Keuangan / Bendahara**: Pratinjau & pencetakan lembar resmi BAST, verifikasi tanda tangan basah & stempel lembaga, serta konfirmasi pencairan.
2. **Simulator WhatsApp Notification (WA Gateway API)**: Menampilkan bentuk pesan notifikasi resmi WhatsApp yang otomatis terkirim ke ponsel pemohon saat proposal di-ACC atau mendekati tenggat LPJ.
3. **Dokumen BAST Resmi Siap Cetak**: Format Berita Acara Serah Terima sesuai standar surat resmi Lazismu UAD.
4. **Data Persistence (localStorage)**: Semua aksi (mengajukan proposal baru, verifikasi, rekomendasi nominal, ACC ketua, pencairan uang) otomatis tersimpan dan terupdate secara real-time antar view tanpa reload!
