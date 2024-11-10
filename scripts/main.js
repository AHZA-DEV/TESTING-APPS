




// Fungsi untuk mendapatkan lokasi pengguna
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("current-location").innerHTML = "Geolokasi tidak didukung oleh browser ini.";
    }
}

// Callback untuk posisi berhasil didapat
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Reverse geocoding menggunakan Nominatim OpenStreetMap
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || 'Lokasi tidak diketahui';
            document.getElementById("current-location").innerHTML = city;
            getPrayerTimes(latitude, longitude);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("current-location").innerHTML = "Tidak dapat mendapatkan nama lokasi";
        });
}

// Menangani error geolokasi
function showError(error) {
    let message = "";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Pengguna menolak permintaan geolokasi.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Informasi lokasi tidak tersedia.";
            break;
        case error.TIMEOUT:
            message = "Waktu permintaan untuk mendapatkan lokasi habis.";
            break;
        case error.UNKNOWN_ERROR:
            message = "Terjadi kesalahan yang tidak diketahui.";
            break;
    }
    document.getElementById("current-location").innerHTML = message;
}

// Fungsi untuk mendapatkan waktu shalat
async function getPrayerTimes(latitude, longitude) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=11`);
        const data = await response.json();
        
        if (data.code === 200) {
            const timings = data.data.timings;
            
            // Update waktu shalat di UI
            document.getElementById("fajr-time").innerHTML = timings.Fajr;
            document.getElementById("dhuhr-time").innerHTML = timings.Dhuhr;
            document.getElementById("asr-time").innerHTML = timings.Asr;
            document.getElementById("maghrib-time").innerHTML = timings.Maghrib;
            document.getElementById("isha-time").innerHTML = timings.Isha;

            // Update waktu terakhir diperbarui
            document.getElementById("update-time").innerHTML = `Diperbarui pada ${date.toLocaleTimeString()}`;

            // Mulai pengecekan waktu shalat berikutnya
            checkNextPrayer(timings);
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
    }
}

// Fungsi untuk mengecek waktu shalat berikutnya
function checkNextPrayer(timings) {
    const prayers = [
        { name: 'Subuh', time: timings.Fajr },
        { name: 'Dzuhur', time: timings.Dhuhr },
        { name: 'Ashar', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isya', time: timings.Isha }
    ];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (let prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':');
        const prayerTime = parseInt(hours) * 60 + parseInt(minutes);

        if (prayerTime > currentTime) {
            highlightNextPrayer(prayer.name);
            break;
        }
    }
}

// Fungsi untuk menyorot waktu shalat berikutnya
function highlightNextPrayer(prayerName) {
    // Reset semua highlight
    document.querySelectorAll('.prayer-time').forEach(el => {
        el.classList.remove('next-prayer');
    });

    // Tambahkan highlight ke waktu shalat berikutnya
    const prayerElements = document.querySelectorAll('.prayer-time h3');
    prayerElements.forEach(el => {
        if (el.textContent === prayerName) {
            el.parentElement.classList.add('next-prayer');
        }
    });
}

// Fungsi untuk toggle menu mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        hamburger.classList.toggle('active');
    });
}

// Event listener saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    getLocation();
    toggleMobileMenu();

    // Perbarui waktu shalat setiap 6 jam
    setInterval(() => {
        getLocation();
    }, 6 * 60 * 60 * 1000);
});
