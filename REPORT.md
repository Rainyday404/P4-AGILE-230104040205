# Laporan Praktikum #4
**Web Service Development Methodologies (AGILE)**

- **Nama**: Ivan Dwika Bagaskara (Hujan/Rain)
- **NIM**: 230104040205
- **Kelas**: <ISI_KELAS_KAMU_DISINI>
- **Tanggal**: 2025-12-15

## 1. Tujuan
Mendemonstrasikan siklus **Agile (Mini-Sprint)** untuk pengembangan layanan web, meliputi:
1.  **Design-First**: Membuat kontrak API (OpenAPI) terlebih dahulu.
2.  **Mock-First**: Memvalidasi desain dengan mock server (Prism).
3.  **Test-First**: Menulis tes otomatis (Jest + Supertest) sebelum implementasi (TDD).
4.  **Implementasi**: Coding layanan hingga semua tes lulus (GREEN).
5.  **Hardening**: Menambahkan logging terstruktur, tracing, dan keamanan.

## 2. Ringkasan Arsitektur
- **Services**:
  - `order-service` (Port: 5002)
  - `notification-service` (Port: 5003)
- **Kontrak**: `openapi/api.yaml` (OpenAPI 3.0.3).
- **Testing**: Jest framework dengan Supertest untuk HTTP assertion.
- **CI**: Script lokal (`npm run typecheck`, `npm run lint:api`, `npm test`) & konfigurasi GitHub Actions.
- **Observability**: Logging JSON menggunakan `pino` dan `pino-http`, serta tracing menggunakan header `x-correlation-id`.
- **Security**: Autentikasi Bearer (dummy), Helmet untuk HTTP headers, Rate-Limiting, dan Validasi Payload menggunakan Zod.

## 3. Hasil Utama
- **Lint OpenAPI**: **LULUS** (0 errors, 0 warnings).
- **Unit Test**: 2 Test Suites, 5 Tests **PASSED** (Hijau).
- **CI Lokal**: Typecheck TypeScript dan Lint API berhasil dijalankan tanpa error.
- **Mock-First**: Skenario pengujian mock berhasil terekam di folder `mock_logs/`.
- **Hardening**: Bukti eksekusi runtime server berhasil terekam di folder `hardening_logs/`.

## 4. Bukti Eksekusi
File bukti berikut tersimpan otomatis dalam folder proyek hasil dari eksekusi `curl`:

### 4.1 Mock-First (Prism)
- **201 Created**: `mock_logs/201_orders.txt`
- **200 OK**: `mock_logs/200_notifications.txt`
- **401 Unauthorized**: `mock_logs/401_notifications.txt`
- **400 Bad Request**: `mock_logs/400_orders.txt`

### 4.2 Hardening (Runtime / Server Asli)
- **201 Created**: `hardening_logs/201_orders.txt`
- **200 OK**: `hardening_logs/200_notifications.txt`
- **401 Unauthorized**: `hardening_logs/401_orders.txt`
- **400 ValidationError**: `hardening_logs/400_orders_validation.txt`
- **400 Bad JSON**: `hardening_logs/400_orders_badjson.txt`

> **Catatan**: Pada file log di atas, terlihat header `x-correlation-id` untuk tracing dan header keamanan dari Helmet.

## 5. Penjelasan Hardening
Implementasi hardening yang dilakukan meliputi:
1.  **Logging Terstruktur**: Menggunakan library Pino untuk menghasilkan log format JSON yang mudah di-query. Field sensitif seperti `Authorization` header otomatis disensor menjadi `[REDACTED]`.
2.  **Distributed Tracing**: Middleware `correlationId` memastikan setiap request memiliki ID unik yang konsisten dari request masuk hingga ke log response.
3.  **Error Handling**:
    - Middleware khusus untuk menangani **JSON Syntax Error** agar server mengembalikan `400 Bad Request` (kode `BAD_JSON`) alih-alih crash atau 500.
    - Validasi input menggunakan Zod mengembalikan `400 ValidationError`.
4.  **Keamanan**:
    - **Rate-Limit**: Membatasi request (60 req/menit untuk orders, 120 req/menit untuk notif).
    - **Helmet**: Mengamankan aplikasi dengan HTTP headers standar industri (XSS filter, no-sniff, dll).

## 6. Cara Reproduksi
Untuk menjalankan proyek ini dari awal:

```bash
# 1. Install dependensi
npm ci

# 2. Validasi Kode (Lint & Test)
npm run lint:api    # Cek kontrak OpenAPI
npm run typecheck   # Cek tipe data TypeScript
npm test            # Jalankan Unit Test

# 3. Jalankan Service (Gunakan 2 terminal berbeda)
npm run dev:orders
npm run dev:notif