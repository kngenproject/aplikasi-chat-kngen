# 🔒 SecureChat – End-to-End Encrypted Messenger

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-ffca28)
![Encryption](https://img.shields.io/badge/Encryption-NaCl%20Box-00b4d8)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile-lightgrey)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

**SecureChat** adalah aplikasi chat real-time dengan **enkripsi end-to-end (E2EE)** menggunakan **TweetNaCl.js** (Curve25519 + XSalsa20-Poly1305). Tidak ada pihak ketiga, termasuk server Firebase, yang dapat membaca pesan karena semua dekripsi terjadi di sisi klien.

🔐 **Private key tidak pernah meninggalkan browser**  
⚡ **Real-time** dengan Firebase Realtime Database  
📱 **Responsif** – bekerja di desktop dan mobile

---

## ✨ Fitur

- ✅ **End-to-End Encryption** – pesan dienkripsi dengan public key penerima
- ✅ **Zero-knowledge** – server hanya menyimpan ciphertext + nonce
- ✅ **Room-based** – buat room unik atau generate kode acak
- ✅ **User online list** – lihat siapa yang aktif dalam room
- ✅ **Pilih target chat** – klik user untuk mengirim pesan terenkripsi
- ✅ **Auto key exchange** – public key otomatis dibagikan antar pengguna
- ✅ **Desain mobile-first** – tampilan nyaman di HP & desktop

---

## 🚀 Demo & Preview

> 🔴 **Demo tidak disediakan secara publik karena memerlukan konfigurasi Firebase sendiri.**  
> Ikuti langkah setup di bawah untuk menjalankan di localhost atau hosting pribadi.

Tampilan antarmuka:

| Desktop | Mobile |
|---------|--------|
| (Tampilan layar lebar dengan sidebar) | (Tampilan kompak satu kolom) |

---

## 📦 Teknologi yang Digunakan

| Teknologi | Fungsi |
|-----------|--------|
| **Firebase Realtime Database** | Penyimpanan pesan & metadata user |
| **TweetNaCl.js** | Enkripsi curve25519 + box (autentikasi & kerahasiaan) |
| **HTML5 / CSS3** | UI modern dengan efek glassmorphism |
| **Vanilla JavaScript** | Tanpa framework, murni native |

---

## 🛠️ Setup & Instalasi

### 1. Clone repository
```bash
git clone https://github.com/username/securechat.git
cd securechat