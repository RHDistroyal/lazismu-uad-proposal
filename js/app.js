/**
 * SHARED SCRIPT APLIKASI LAZISMU UAD
 * Mengatur database localStorage, multi-page routing, form pengajuan, approval berjenjang,
 * dan FigJam User Flow Simulator (5 Swimlanes / Roles)
 */

const STORAGE_KEY = 'lazismu_proposals_data';
const ADMIN_SESSION_KEY = 'lazismu_admin_session';
const PEMOHON_SESSION_KEY = 'lazismu_pemohon_session';

// =============================================================================
// 1. BASIS DATA & LOCAL STORAGE
// =============================================================================

function getProposals() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing localStorage:', e);
    }
  }
  // Default ke INITIAL_PROPOSALS
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPOSALS));
  return INITIAL_PROPOSALS;
}

function saveProposals(proposals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}

function getProposalById(id) {
  if (!id) return null;
  const list = getProposals();
  return list.find(p => p && p.id && p.id.toUpperCase() === String(id).toUpperCase().trim());
}

function updateProposal(updated) {
  const list = getProposals();
  const idx = list.findIndex(p => p.id === updated.id);
  if (idx !== -1) {
    list[idx] = updated;
    saveProposals(list);
    return true;
  }
  return false;
}

function addProposal(newProposal) {
  const list = getProposals();
  list.unshift(newProposal);
  saveProposals(list);
  return newProposal;
}

function resetDatabase() {
  if (confirm('Apakah Anda ingin me-reset data simulasi proposal ke 28 data awal resmi Lazismu UAD? Semua perubahan pengujian akan dikembalikan ke data awal.')) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPOSALS));
    alert('Data simulasi berhasil di-reset ke kondisi awal!');
    location.reload();
  }
}

// Format Rupiah
function formatRupiah(number) {
  if (!number || isNaN(number)) return 'Rp 0';
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

// Format Tanggal
function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

// =============================================================================
// 2. MANAJEMEN SESI ROLE (ADMIN & PEMOHON)
// =============================================================================

const INTERNAL_ROLES = {
  staff: {
    role: 'staff',
    name: 'Ust. Hendra Kurniawan',
    title: 'Staf SE (Level 1 Verifikasi)',
    avatar: 'HK',
    badge: 'Level 1: Staf'
  },
  bidang: {
    role: 'bidang',
    name: 'Drs. H. Miftahul Huda',
    title: 'Pengurus Bidang Pendistribusian (Level 2)',
    avatar: 'MH',
    badge: 'Level 2: Bidang'
  },
  ketua: {
    role: 'ketua',
    name: 'Drs. Farid Ma’ruf',
    title: 'Ketua Kantor Layanan Lazismu UAD (Level 3)',
    avatar: 'FM',
    badge: 'Level 3: Pimpinan'
  },
  keuangan: {
    role: 'keuangan',
    name: 'Siti Nurhaliza, S.E',
    title: 'Divisi Keuangan & Bendahara',
    avatar: 'SN',
    badge: 'Keuangan'
  }
};

function getAdminSession() {
  const sess = localStorage.getItem(ADMIN_SESSION_KEY);
  if (sess) {
    try {
      const parsed = JSON.parse(sess);
      if (parsed && parsed.role && INTERNAL_ROLES[parsed.role]) {
        return parsed;
      }
    } catch (e) {}
  }
  return INTERNAL_ROLES.staff;
}

function setAdminSession(roleKey) {
  const target = INTERNAL_ROLES[roleKey] || INTERNAL_ROLES.staff;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(target));
  return target;
}

function getPemohonSession() {
  const sess = localStorage.getItem(PEMOHON_SESSION_KEY);
  if (sess) {
    try {
      return JSON.parse(sess);
    } catch (e) {}
  }
  // Default session
  const defaultUser = {
    nama: 'Muhammad Zaki Pratama',
    instansi: 'BEM FAST UAD',
    identitasId: 'NIM: 2200018042',
    email: 'zaki.pratama@webmail.uad.ac.id',
    noHp: '081234567890'
  };
  localStorage.setItem(PEMOHON_SESSION_KEY, JSON.stringify(defaultUser));
  return defaultUser;
}

function setPemohonSession(userData) {
  localStorage.setItem(PEMOHON_SESSION_KEY, JSON.stringify(userData));
}

// =============================================================================
// 3. TOAST & NOTIFIKASI
// =============================================================================

function showToast(message, type = 'info') {
  let box = document.getElementById('toastContainer');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastContainer';
    box.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 8px;';
    document.body.appendChild(box);
  }

  const toast = document.createElement('div');
  const borderCol = type === 'success' ? '#10B981' : type === 'danger' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#002D54';
  
  toast.style.cssText = `background: #001E38; color: #ffffff; padding: 10px 16px; border-radius: 4px; font-size: 12.5px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadeIn 0.2s ease; max-width: 420px; border-left: 3px solid ${borderCol}; line-height: 1.4;`;
  toast.innerHTML = `<div>${message}</div>`;
  box.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// =============================================================================
// 4. GLOBAL ROLE SWITCHER BAR (Clean Academic Portal Utility)
// =============================================================================

function initGlobalFlowBar(activeContext = 'public') {
  if (document.getElementById('simQuickDock')) return;

  const dock = document.createElement('div');
  dock.id = 'simQuickDock';
  dock.className = 'sim-floating-dock';

  dock.innerHTML = `
    <div id="simDockPanel" class="sim-dock-panel">
      <div class="sim-dock-header">
        <span class="sim-dock-title">Simulasi Peran SOP (FigJam)</span>
        <button type="button" onclick="toggleSimPanel()" style="background:none; border:none; font-size:16px; cursor:pointer; color:#64748B;">&times;</button>
      </div>

      <div class="sim-dock-roles">
        <a href="pemohon-dashboard.html" class="sim-dock-role-item ${activeContext === 'pemohon' ? 'active' : ''}">
          <span>Portal Pemohon</span>
          <span style="font-size:10px; color:#94A3B8;">Tahap 1</span>
        </a>
        <a href="admin-dashboard.html?tab=staff" class="sim-dock-role-item ${activeContext === 'staff' ? 'active' : ''}" onclick="setAdminSession('staff')">
          <span>Staf Verifikasi (L1)</span>
          <span style="font-size:10px; color:#94A3B8;">Tahap 2</span>
        </a>
        <a href="admin-dashboard.html?tab=bidang" class="sim-dock-role-item ${activeContext === 'bidang' ? 'active' : ''}" onclick="setAdminSession('bidang')">
          <span>Pengurus Bidang (L2)</span>
          <span style="font-size:10px; color:#94A3B8;">Tahap 3</span>
        </a>
        <a href="admin-dashboard.html?tab=ketua" class="sim-dock-role-item ${activeContext === 'ketua' ? 'active' : ''}" onclick="setAdminSession('ketua')">
          <span>Pimpinan Lazismu (L3)</span>
          <span style="font-size:10px; color:#94A3B8;">Tahap 4</span>
        </a>
        <a href="admin-keuangan.html" class="sim-dock-role-item ${activeContext === 'keuangan' ? 'active' : ''}" onclick="setAdminSession('keuangan')">
          <span>Keuangan & Pencairan BAST</span>
          <span style="font-size:10px; color:#94A3B8;">Tahap 5</span>
        </a>
      </div>

      <div class="sim-dock-actions">
        <a href="javascript:void(0)" class="sim-dock-action-link" onclick="openFigJamDiagramModal(); toggleSimPanel();">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          Diagram SOP Alur Layanan
        </a>
        <a href="javascript:void(0)" class="sim-dock-action-link" onclick="openWhatsAppSimulatorModal(); toggleSimPanel();">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Pratinjau Notifikasi WA
        </a>
        <a href="javascript:void(0)" class="sim-dock-action-link text-danger" onclick="resetDatabase()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Reset Data Simulasi
        </a>
      </div>
    </div>

    <button type="button" class="sim-dock-trigger" onclick="toggleSimPanel()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <span>Simulasi SOP & Peran</span>
    </button>
  `;

  document.body.appendChild(dock);

  // Close when clicked outside
  document.addEventListener('click', (e) => {
    const dockEl = document.getElementById('simQuickDock');
    const panel = document.getElementById('simDockPanel');
    if (dockEl && panel && !dockEl.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

function toggleSimPanel() {
  const panel = document.getElementById('simDockPanel');
  if (panel) {
    panel.classList.toggle('open');
  }
}

// =============================================================================
// 5. MODAL DIAGRAM FIGJAM FLOW INTERAKTIF
// =============================================================================

function openFigJamDiagramModal() {
  let modal = document.getElementById('modalFigJamFlow');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalFigJamFlow';
    modal.className = 'figjam-modal-overlay';
    modal.innerHTML = `
      <div class="figjam-modal-box">
        <div class="figjam-modal-header">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #F37021; text-transform: uppercase; letter-spacing: 0.5px;">STANDAR PROSEDUR OPERASIONAL</div>
            <h3 style="font-size: 16px; color: #002D54; margin-top: 2px;">Diagram Alur Pengajuan Proposal & Pencairan Dana</h3>
            <div style="font-size: 12px; color: #64748B;">Kantor Layanan Lazismu Universitas Ahmad Dahlan (5 Tahap Berjenjang)</div>
          </div>
          <button type="button" class="figjam-modal-close" onclick="closeFigJamDiagramModal()">&times;</button>
        </div>

        <div class="figjam-modal-body">
          
          <!-- TAHAP 1: PEMOHON -->
          <div class="swimlane-card swimlane-pemohon">
            <div class="swimlane-header">
              <span class="swimlane-badge">Tahap 1</span>
              <h4>Pemohon (Masyarakat / Mahasiswa / Takmir)</h4>
            </div>
            <div class="flow-step-chain">
              <div class="chain-step">Mulai</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Login / Registrasi Akun</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step highlight">Dashboard Pemohon (Unduh Template)</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Form Pengajuan Proposal</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Unggah Berkas PDF</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Konfirmasi Pengajuan</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Detail & Tracking Proposal</div>
              <div class="chain-arrow">→</div>
              <div class="chain-decision">Dokumen Lengkap?</div>
            </div>
            <div class="chain-branch-notes">
              <span class="branch-tag red">Tidak Lengkap: Melakukan Revisi & Unggah Ulang</span>
              <span class="branch-tag green">Lengkap: Diteruskan ke Verifikasi Staf L1</span>
            </div>
          </div>

          <!-- TAHAP 2: STAFF (LEVEL 1) -->
          <div class="swimlane-card swimlane-staff">
            <div class="swimlane-header">
              <span class="swimlane-badge">Tahap 2</span>
              <h4>Staf Lazismu (Verifikasi Administrasi & Rekam Jejak)</h4>
            </div>
            <div class="flow-step-chain">
              <div class="chain-step">Login Staf</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Dashboard Staf</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Daftar Proposal Masuk</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step highlight">Detail & Verifikasi Berkas</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Cek Riwayat Pemohon</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Catatan Evaluasi Internal</div>
              <div class="chain-arrow">→</div>
              <div class="chain-decision">Dokumen Lengkap?</div>
            </div>
            <div class="chain-branch-notes">
              <span class="branch-tag green">Lengkap: Teruskan ke Pengurus Bidang (Level 2)</span>
              <span class="branch-tag red">Tidak Lengkap: Kembalikan ke Pemohon (Status: REVISI)</span>
            </div>
          </div>

          <!-- TAHAP 3: PENGURUS BIDANG (LEVEL 2) -->
          <div class="swimlane-card swimlane-bidang">
            <div class="swimlane-header">
              <span class="swimlane-badge">Tahap 3</span>
              <h4>Pengurus Bidang (Penilaian Kelayakan 6 Pilar & Asnaf)</h4>
            </div>
            <div class="flow-step-chain">
              <div class="chain-step">Login Pengurus</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Dashboard Pengurus</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Daftar Terverifikasi</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step highlight">Review Kelayakan & 6 Pilar</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Rekomendasi Nominal & Plafon</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Catatan Rekomendasi Lanjutan</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step submit">Kirim ke Ketua / Pimpinan</div>
            </div>
          </div>

          <!-- TAHAP 4: KETUA / PIMPINAN (LEVEL 3) -->
          <div class="swimlane-card swimlane-ketua">
            <div class="swimlane-header">
              <span class="swimlane-badge">Tahap 4</span>
              <h4>Ketua / Pimpinan Lazismu UAD (Persetujuan Final & Auto BAST)</h4>
            </div>
            <div class="flow-step-chain">
              <div class="chain-step">Login Pimpinan</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Dashboard Pimpinan</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Menunggu Approval</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step highlight">Review Telaah & Riwayat</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Keputusan Final</div>
              <div class="chain-arrow">→</div>
              <div class="chain-decision">Disetujui?</div>
            </div>
            <div class="chain-branch-notes">
              <span class="branch-tag green">Disetujui (ACC): Kunci Nominal Final → Terbitkan BAST → Notif WA Panggilan Fisik</span>
              <span class="branch-tag red">Ditolak: Masukkan Alasan Penolakan Resmi</span>
            </div>
          </div>

          <!-- TAHAP 5: KEUANGAN / BENDAHARA -->
          <div class="swimlane-card swimlane-keuangan">
            <div class="swimlane-header">
              <span class="swimlane-badge">Tahap 5</span>
              <h4>Keuangan & Kasir (Audit Fisik Hadir, BAST, Pencairan & LPJ)</h4>
            </div>
            <div class="flow-step-chain">
              <div class="chain-step">Login Keuangan</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Daftar Proposal ACC</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step highlight">Cetak Berkas BAST</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Pemohon Hadir di Kantor</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Audit 3 Butir: Hadir, TTD Basah & Stempel</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step">Pencairan Dana (Transfer/Tunai)</div>
              <div class="chain-arrow">→</div>
              <div class="chain-step submit">Status: Telah Dicairkan (Masa LPJ 14 Hari)</div>
            </div>
          </div>

        </div>

        <div class="figjam-modal-footer">
          <a href="https://www.figma.com/board/2I7hc047wvzG7A2TMGuuay/Sistem-Informasi-Pengajuan-Proposal.?node-id=0-1&t=kcXgBmAd2WQ3x5QO-1" target="_blank" class="btn btn-secondary btn-sm">
            Buka Dokumen di Figma FigJam
          </a>
          <button type="button" class="btn btn-navy btn-sm" onclick="closeFigJamDiagramModal()">Tutup</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
}

function closeFigJamDiagramModal() {
  const modal = document.getElementById('modalFigJamFlow');
  if (modal) modal.style.display = 'none';
}

// =============================================================================
// 6. SIMULATOR WHATSAPP GATEWAY
// =============================================================================

function openWhatsAppSimulatorModal(proposalId = null, messageType = 'acc') {
  let modal = document.getElementById('modalWhatsAppSim');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalWhatsAppSim';
    modal.className = 'figjam-modal-overlay';
    document.body.appendChild(modal);
  }

  const list = getProposals();
  let p = proposalId ? getProposalById(proposalId) : null;
  if (!p) {
    p = list.find(item => item.status === 'MENUNGGU_PENCAIRAN') || list[0];
  }

  renderWhatsAppModalContent(p, messageType);
  modal.style.display = 'flex';
}

function renderWhatsAppModalContent(p, type = 'acc') {
  const modal = document.getElementById('modalWhatsAppSim');
  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

  let textContent = '';
  if (type === 'acc') {
    textContent = `*Assalamu’alaikum Warahmatullahi Wabarakatuh.*

Kepada Yth.
*${p.namaPemohon}*
(${p.instansi})

Kabar Gembira! Kami informasikan bahwa permohonan proposal bantuan dana Anda:
📌 *Kode Registrasi:* ${p.id}
📌 *Perihal:* ${p.perihal}
📌 *Nominal Disetujui (ACC):* *${formatRupiah(p.nominalACC || p.nominalDiajukan)}*
📌 *No. Berita Acara (BAST):* ${p.nomorBAST || '042/BAST/LAZISMU-UAD/X/2026'}

Telah *DISETUJUI (ACC)* oleh Ketua Kantor Layanan Lazismu UAD.

🏛️ *INSTRUKSI PENTING KEHADIRAN FISIK:*
Sebagai syarat wajib audit kepatuhan keuangan, penyerahan bantuan dana mewajibkan tanda tangan basah Berita Acara Serah Terima (BAST).
Mohon perwakilan resmi lembaga Anda hadir secara fisik ke kantor kami:

📍 *Lokasi:* Kantor Layanan Lazismu UAD (Gedung ITC Kampus 1 UAD, Jl. Kapas No. 9, Semaki, Umbulharjo, Yogyakarta)
🕒 *Jam Layanan:* Senin - Jumat (08.30 - 15.00 WIB)
📌 *Syarat Wajib Dibawa:*
1. *Stempel Asli Lembaga / Ortom*
2. Kartu Identitas (KTP / KTM UAD) Ketua Panitia

Silakan tunjukkan pesan WhatsApp ini atau nomor BAST di atas kepada petugas kasir Lazismu UAD.

_Wassalamu’alaikum Warahmatullahi Wabarakatuh._
*Kantor Layanan Lazismu Universitas Ahmad Dahlan*`;
  } else if (type === 'revisi') {
    textContent = `*Assalamu’alaikum Warahmatullahi Wabarakatuh.*

Kepada Yth.
*${p.namaPemohon}* (${p.instansi})

Pemberitahuan dari Tim Verifikasi Kantor Layanan Lazismu UAD terkait proposal:
📌 *Kode Proposal:* ${p.id}
📌 *Perihal:* ${p.perihal}
⚠️ *Status:* *PERLU PERBAIKAN BERKAS (REVISI)*

📝 *Catatan Tim Verifikasi Staff (Level 1):*
_"${p.catatanInternal || 'Terdapat lampiran Rincian Anggaran Biaya (RAB) dan tanda tangan dekanat yang belum lengkap.'}"_

Silakan masuk ke Portal Pemohon Lazismu UAD untuk melakukan perbaikan dan mengunggah berkas revisi Anda:
🔗 https://lazismu-uad-proposal.vercel.app/pemohon-dashboard.html

Terima kasih.
*Kantor Layanan Lazismu UAD*`;
  } else {
    textContent = `*Assalamu’alaikum Warahmatullahi Wabarakatuh.*

[PENGINGAT RESMI LPJ - BOT LAZISMU UAD]
Kepada Yth. *${p.namaPemohon}* (${p.instansi})

Kami mengingatkan bahwa dana bantuan untuk proposal *${p.id}* (${p.perihal}) telah disalurkan pada *${p.tglDanaCair || 'beberapa hari lalu'}*.

⏰ Sesuai ketentuan resmi BAST Butir ke-4, Anda berkewajiban menyerahkan *Laporan Pertanggungjawaban (LPJ)* maksimal *14 hari (2 minggu)* pasca kegiatan.

📌 *Batas Akhir (Deadline) LPJ:* *${p.deadlineLPJ || 'H+14 Pasca Kegiatan'}*

Mohon segera mengunggah scan LPJ dan nota kwitansi asli melalui portal:
🔗 https://lazismu-uad-proposal.vercel.app/lpj-form.html?id=${p.id}

Berkas fisik tetap wajib diserahkan ke kantor Lazismu UAD untuk arsip audit keuangan.

Terima kasih atas kerja sama dan amanahnya.
*Kantor Layanan Lazismu Universitas Ahmad Dahlan*`;
  }

  modal.innerHTML = `
    <div class="wa-sim-modal-box">
      <div class="wa-sim-header">
        <div style="display:flex; align-items:center; gap: 10px;">
          <div class="wa-avatar">📱</div>
          <div>
            <div style="font-size: 15px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px;">
              LAZISMU UAD Notifikasi Gateway <span style="color:#25D366; font-size:12px;">● Online</span>
            </div>
            <div style="font-size: 11px; color: #CBD5E1;">Nomor Tujuan: ${p.noHp || '081234567890'} (${p.namaPemohon})</div>
          </div>
        </div>
        <button type="button" class="wa-sim-close" onclick="closeWhatsAppSimulatorModal()">&times;</button>
      </div>

      <div style="padding: 12px 16px; background: #E2E8F0; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
        <button type="button" class="btn btn-sm ${type === 'acc' ? 'btn-success' : 'btn-secondary'}" onclick="renderWhatsAppModalContent(getProposalById('${p.id}'), 'acc')">
          📢 Notif ACC & Panggilan Hadir Fisik
        </button>
        <button type="button" class="btn btn-sm ${type === 'revisi' ? 'btn-warning' : 'btn-secondary'}" onclick="renderWhatsAppModalContent(getProposalById('${p.id}'), 'revisi')">
          ⚠️ Notif Revisi Berkas
        </button>
        <button type="button" class="btn btn-sm ${type === 'lpj' ? 'btn-primary' : 'btn-secondary'}" onclick="renderWhatsAppModalContent(getProposalById('${p.id}'), 'lpj')">
          ⏰ Notif Pengingat LPJ H+14
        </button>
      </div>

      <div class="wa-chat-canvas">
        <div class="wa-chat-bubble">
          <div class="wa-sender-tag">Kantor Layanan Lazismu UAD (Official Bot)</div>
          <div class="wa-message-text">${textContent.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>')}</div>
          <div class="wa-timestamp">${timeStr} ✓✓</div>
        </div>
      </div>

      <div class="wa-sim-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeWhatsAppSimulatorModal()">Tutup Simulator</button>
        <button type="button" class="btn btn-success btn-sm" onclick="navigator.clipboard.writeText('${textContent.replace(/'/g, "\\'")}'); showToast('Teks pesan WhatsApp berhasil disalin ke clipboard!', 'success');">
          📋 Salin Pesan WA
        </button>
      </div>
    </div>
  `;
}

function closeWhatsAppSimulatorModal() {
  const modal = document.getElementById('modalWhatsAppSim');
  if (modal) modal.style.display = 'none';
}

// =============================================================================
// 7. PUSAT UNDUHAN TEMPLATE RESMI (PROPOSAL, RAB, BAST, & LPJ)
// =============================================================================

function openProposalTemplate() {
  window.open('proposal-preview.html?mode=template', '_blank');
}

function openBastTemplate() {
  window.open('bast-preview.html?mode=template', '_blank');
}

function openLpjTemplate() {
  window.open('lpj-preview.html?mode=template', '_blank');
}

function downloadProposalDoc() {
  const a = document.createElement('a');
  a.href = 'Format_Proposal_Kegiatan_Lazismu_UAD.docx';
  a.download = 'Format_Proposal_Kegiatan_Lazismu_UAD.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Format Proposal Resmi Word (.docx) berhasil diunduh!', 'success');
}

function downloadRabExcel() {
  const a = document.createElement('a');
  a.href = 'Format_RAB_Anggaran_Lazismu_UAD.xlsx';
  a.download = 'Format_RAB_Anggaran_Lazismu_UAD.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Format RAB Resmi Excel (.xlsx) berhasil diunduh!', 'success');
}

function downloadLpjExcel() {
  const a = document.createElement('a');
  a.href = 'Format_Rekap_Nota_LPJ_Lazismu_UAD.xlsx';
  a.download = 'Format_Rekap_Nota_LPJ_Lazismu_UAD.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Lembar Rekap Nota LPJ (.xlsx) berhasil diunduh!', 'success');
}

// Backward compatibility alias
function downloadProposalTemplate() {
  openProposalTemplate();
}

function downloadRabTemplate() {
  downloadRabExcel();
}

// =============================================================================
// 7. RESPONSIVE MOBILE NAVIGATION
// =============================================================================
function initMobileNavigation() {
  const navContainer = document.querySelector('.nav-container');
  const navMenu = document.querySelector('.nav-menu');
  if (navContainer && navMenu && !document.querySelector('.nav-mobile-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'nav-mobile-toggle';
    toggleBtn.setAttribute('aria-label', 'Buka Menu Navigasi');
    toggleBtn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    `;
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
    };
    navContainer.appendChild(toggleBtn);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navContainer.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
});
