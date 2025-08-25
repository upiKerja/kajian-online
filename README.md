# Belajar Ngaji Online v0.7
| Model | Status | Deskripsi |
|---------|-----------|----|
| Kelas  | Beres | User dapat daftar & Mentor dapat assign kelas baru. |
| Pertemuan Kelas | Belum | Belum diimplementasikan dengan baik.
| Kajian | Beres | Admin dapat assign kajian. |
| Pengguna | Beres | Log In with Google, Discord or Facebook. |
| Donasi | Belum | Dokumentasi belum tersedia. |

## 25 Agustus 2025
- Pertemuan Kelas
  - Setiap Kelas dapat memiliki beberapa pertemuan dengan beberapa tipe seperti berupa tulisan, YouTube, & External link seperti Zoom, Google Meet.
  - Kelas dapat memiliki beberapa pertemuan/tidak (Opsional)
- Allias
  - Setiap model akan memiliki allias guna mempermudah membaca API URL. ex: `/index/{slug}` menjadi `{slug}`
  - Saat ini hanya tersedia pada `kelas` dan `kajian`
- Program Donasi
  - Menambah Route baru `inspect` untuk melihat total nominal yang terkumpul.
  - Hanya Admin yang dapat melakukan assign pada Program Donasi

### Batasan
- Hasil Donasi belum dapat divalidasi lebih lanjut.
- Pertemuan Kelas belum diimplementasikan dengan baik.
- Cache menyimpan status code yang invalid. 

### Perbaikan
- Request Duplikat saat validasi role pengguna.

## 19 Agustus 2025
- Autentikasi
  - Role `admin, biasa` dan `mentor` hanya dapat mengakses route yang diiziinkan pada role tersebut. Mengandalkan `access_token` yang diberikan oleh provider seperti Google, Discord & Facebook dan disimpan dalam Cookie.
  - Setiap request yang dilakukan oleh FrontEnd ke BackEnd harus disertakan Credentials yang menyimpan `access_token` di dalamnya.
  - Jika `access_token` tidak ada/invalid maka akan mengembalikan `401`. Jika user mencoba mengakses Route yang tidak diizinkan akan mengembalikan `403`.
- Endpoint
  - `discover` untuk merekomendasikan kajian/kelas. Baru tersedia pada `donasi, kelas, kajian`

### Batasan
- Cache menyimpan status code yang invalid.  
- Request Duplikat saat validasi role pengguna.
