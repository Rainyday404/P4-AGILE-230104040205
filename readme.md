# P4-AGILE-230104040205

> **Untuk Memenuhi Praktikum 4 Web Service Engineering**

**Identitas Pengembang**
* **Nama**: Ivan Dwika Bagaskara (Hujan/Rain)
* **NIM**: 230104040205
* **Kelas**: A

---

**Mini E-Commerce API (Orders & Notifications)**
Proyek ini menggunakan metodologi Agile dengan siklus:
1.  **Design-First**: Kontrak API (OpenAPI).
2.  **Mock-First**: Validasi kontrak dengan Prism.
3.  **Test-First**: TDD dengan Jest & Supertest.
4.  **Hardening**: Security (Helmet, Rate-Limit) & Observability (Pino Logs).

## Struktur Folder
* `openapi/`: Spesifikasi kontrak API (`api.yaml`).
* `services/`: Kode sumber layanan (`order-service` & `notification-service`).
* `mock_logs/`: Bukti pengujian menggunakan Mock Server.
* `hardening_logs/`: Bukti pengujian Runtime Server (curl).
* `docs/`: Artefak Agile (Backlog, DoD, Product Goal).

## Prasyarat
* Node.js v18+
* npm

## Cara Instalasi & Menjalankan (Run & Test)

### 1. Instalasi Dependensi
Jalankan perintah ini untuk menginstal semua paket yang dibutuhkan:
```bash
npm ci
````

### 2\. Validasi & Testing (CI Lokal)

Sebelum menjalankan aplikasi, pastikan kode valid dan lulus tes:

```bash
# Cek validitas kontrak OpenAPI (Spectral)
npm run lint:api

# Cek tipe data TypeScript
npm run typecheck

# Jalankan Unit Test (Jest)
npm test
```

> **Catatan**: `npm test` harus menunjukkan hasil **PASS** (Hijau).

### 3\. Menjalankan Aplikasi (Runtime)

Karena ini adalah arsitektur *microservices* sederhana, jalankan kedua layanan di **dua terminal terpisah**:

**Terminal A (Order Service)**

```bash
npm run dev:orders
# Berjalan di [http://127.0.0.1:5002](http://127.0.0.1:5002)
```

**Terminal B (Notification Service)**

```bash
npm run dev:notif
# Berjalan di [http://127.0.0.1:5003](http://127.0.0.1:5003)
```

## Daftar Endpoint & Cara Akses

Gunakan Postman atau `curl` untuk mengakses endpoint berikut.

| Method | Endpoint | Deskripsi | Auth (Bearer) |
| :--- | :--- | :--- | :--- |
| `POST` | `http://localhost:5002/orders` | Membuat pesanan baru | `test123` |
| `GET` | `http://localhost:5003/notifications` | Melihat daftar notifikasi | `test123` |

### Contoh Request (Curl)

**Create Order (Sukses):**

```bash
curl -X POST [http://127.0.0.1:5002/orders](http://127.0.0.1:5002/orders) \
  -H "Authorization: Bearer test123" \
  -H "Content-Type: application/json" \
  -d '{"productId": "P1", "quantity": 2}'
```

**Get Notifications (Sukses):**

```bash
curl [http://127.0.0.1:5003/notifications](http://127.0.0.1:5003/notifications) \
  -H "Authorization: Bearer test123"
```

````