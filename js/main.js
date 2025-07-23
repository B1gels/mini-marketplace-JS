// produk ditampilkan setelah semua element html di load browser
window.addEventListener("DOMContentLoaded", function () {
    console.log("Main page loaded")
    getProduct()
})


// Fungsi untuk menampilkan loading screen
function showLoading() {
    document.getElementById('loading-screen').style.display = 'flex';
}

// Fungsi untuk menyembunyikan loading screen
function hideLoading() {
    document.getElementById('loading-screen').style.display = 'none';
}

// action reload page saat title di klik
let page_title = document.getElementById("page-title")
page_title.addEventListener("click", function () {
    console.log("page reload")
    location.reload()
})

// menampilkan produk berdasarkan pencarian
let produkAsli = []

// fungsi debounce 
function debounce(func, delay) {
    let timeoutID;
    return function (...args) {
        clearTimeout(timeoutID) // reset timer jika ada aktivitas
        timeoutID = setTimeout(() => {
            func.apply(this, args); // Jalankan fungsi setelah delay
        }, delay)
    }
}

const inputCari = document.getElementById("search")
function searchProduk() {
    const container = document.getElementById("container")
    const hasil_pencarian = produkAsli.filter(produk => produk.title.toLowerCase().includes(inputCari.value.toLowerCase().trim()))
    console.log(hasil_pencarian)
    hasil_pencarian.length === 0 ? container.innerHTML = `
    <div class="empty-search">
  <div class="empty-icon">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
      <path d="M9 9l6 6m-6 0l6-6m-9 3a7 7 0 1014 0 7 7 0 00-14 0z"/>
    </svg>
  </div>
  <h3 class="empty-title">Produk tidak ditemukan</h3>
  <p class="empty-message">Maaf, kami tidak menemukan produk yang sesuai dengan pencarian Anda.</p>
  <div class="empty-suggestions">
    <p>Beberapa saran:</p>
    <ul>
      <li>Periksa ejaan kata kunci</li>
      <li>Coba kata kunci yang lebih umum</li>
      <li>Telusuri kategori produk</li>
    </ul>
  </div>
</div> `: showProduct(hasil_pencarian)
}

const debouncedSearched = debounce(searchProduk,500)
inputCari.addEventListener("input",debouncedSearched)


// menampilkan produk berdasarkan kategory
const filterValue = document.getElementById("item-category")
function buildUrl() {
    baseURl = 'https://fakestoreapi.com/products'
    if (filterValue.value) {
        baseURl += `/category/${filterValue.value}`
    }

    return baseURl
}

// fungsi ketika value berubah
filterValue.addEventListener("change", function () {
    getProduct()
    inputCari.value = ""
})



// fungsi untuk menampilkan produk
async function getProduct() {
    const url = buildUrl()
    showLoading()
    try {
        const rest = await fetch(url)
        const data = await rest.json()
        produkAsli = data
        showProduct(data)

    }
    catch (err) {
        const container = document.getElementById("container")
        container.innerHTML = "jaringan ngelag bang"
        console.error(`sepertinya ada yang salah :( `, err)
    }
    finally {
        hideLoading()
    }
}


// fungsi untuk membuat card untuk produk
function showProduct(data) {
    const container = document.getElementById("container")
    container.innerHTML = ""

    data.forEach((produk) => {
        // buat struktur html
        const product_card = document.createElement("div")
        const product_img = document.createElement("img")
        const product_desc = document.createElement("div")
        const product_nama = document.createElement("h3")
        const product_harga = document.createElement("p")
        const desc_button = document.createElement("div")
        const product_detailBTN = document.createElement("button")
        const product_checkoutBTN = document.createElement("button")

        // set attribut
        product_card.classList.add("product-card"); // tetap
        product_card.classList.add("masuk-sebelum"); // class awal: opacity 0 dan rotateY


        product_desc.classList.add("product-desc")
        desc_button.classList.add("desc-button")

        // set value
        product_img.src = produk.image
        product_img.alt = `gambar ${produk.title}`

        product_nama.textContent = produk.title
        product_harga.textContent = `$${produk.price}`

        product_detailBTN.textContent = "detail"
        product_checkoutBTN.textContent = "checkout"

        // tampilkan ke web browser
        product_card.appendChild(product_img)
        product_card.appendChild(product_desc)
        product_desc.appendChild(product_nama)
        product_desc.appendChild(product_harga)
        product_desc.appendChild(desc_button)
        desc_button.appendChild(product_detailBTN)
        desc_button.appendChild(product_checkoutBTN)

        container.appendChild(product_card)

        // fungsi tombol detail produk
        product_detailBTN.addEventListener("click", () => {
            tampilkanDetailProduk(produk)
        });

        // fungsi tombol checkout
        product_checkoutBTN.addEventListener("click", () => {
            checkoutProduk(produk)
            console.log(`checkout item  : ${produk.title}`)
        })


        setTimeout(() => {
            product_card.classList.remove("masuk-sebelum"); // hapus class awal
            product_card.classList.add("masuk");

        });
    })
}

// fungsi untuk modal card (tampilan detail produk)
function tampilkanDetailProduk(produk) {
    const modal = document.getElementById("modal");
    const modalDetail = document.getElementById("modal-detail");

    modalDetail.innerHTML = `
        <div class="modal-header">
            <h2>Detail Produk</h2>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body compact">
            <img src="${produk.image}" alt="${produk.title}" class="product-image" />
            <div class="product-info">
                <h3 class="product-title">${produk.title}</h3>
                <div class="price-badge">$${produk.price}</div>
                <div class="product-meta">
                    <span class="category">${produk.category}</span>
                </div>
                <p class="product-description">${produk.description}</p>
            </div>
        </div>
        <div class="modal-actions">
            <button class="primary-btn">Beli Sekarang</button>
        </div>`;

    modal.style.display = "block";

    // fungsi tombol beli
    const beliBTN = document.querySelector('.modal-actions .primary-btn')
    beliBTN.addEventListener("click", function () {
        checkoutProduk(produk)
    })

    // fungsi untuk menutup modal (tombol x)
    modalDetail.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = "none";
    });

}

// fungsi untuk menutup modal (keypress Esc) 
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display == "block") {
        modal.style.display = "none";
        console.log("escape button ditekan")
    }
})
// fungsi untuk chechout barang
function checkoutProduk(product) {
    let listProduk = JSON.parse(localStorage.getItem("list-produk")) || []
    const itemSdhAda = listProduk.some(listProduk => product.id === listProduk.id)

    //confirmasi menambbahkan produk ke keranjang
    if (!confirm("tambahkan produk ke keranjang"))
        return

    // check apakah produk sudah ada di database
    if (itemSdhAda) {
        // jika sudah ada
        listProduk = listProduk.map(item =>
            item.id === product.id ?
                { ...item, quantity: item.quantity + 1 }
                : item
        )
        alert("produk bertambah ke chart")
    } else {
        // masukan produk kedatabase
        listProduk.push({
            id: product.id,
            title: product.title,
            price: product.price.toFixed(2),
            image: product.image,
            quantity: 1
        })
        alert("sukses menambahkan produk ke chart")
    }

    localStorage.setItem("list-produk", JSON.stringify(listProduk))

}