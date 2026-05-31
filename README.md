# SRG Financing Monitor
**PT Asli Pangan Indonesia**

Web app untuk monitoring portfolio SRG (Sistem Resi Gudang) berbasis kopi.

## Deploy ke Vercel (step by step)

### 1. Upload ke GitHub
1. Buka [github.com](https://github.com) → login
2. Klik **"New repository"** → nama: `srg-monitor` → **Create**
3. Di halaman repo yang baru, klik **"uploading an existing file"**
4. Drag & drop **seluruh folder `srg-monitor`** ke halaman GitHub
5. Klik **"Commit changes"**

### 2. Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com) → login dengan GitHub
2. Klik **"Add New → Project"**
3. Pilih repo `srg-monitor` → klik **Import**
4. Framework: pilih **Create React App** (auto-detected)
5. Klik **Deploy** → tunggu ~2 menit

### 3. Selesai!
Vercel akan memberikan URL seperti: `https://srg-monitor-xxx.vercel.app`

---

## Cara pakai
- **Overview**: summary portfolio + charts
- **Portfolio**: tabel lengkap semua fasilitas
- **Facility**: utilisasi SGD 1,510,000 + income/cost summary
- **Maturity**: jadwal jatuh tempo
- **Add/Edit**: tambah atau ubah fasilitas — semua kalkulasi otomatis

Data tersimpan di **localStorage** browser. Export CSV tersedia di header.

## Development lokal
```bash
npm install
npm start
```  
