window.addEventListener("DOMContentLoaded", function () {
    console.log("keranjang page loaded")
    showCart()
})



// ambil data dari localStorage
const container = document.getElementById("container")
let cartEmpty = document.getElementById("keranjang-kosong")



function showCart() {
    let keranjang = JSON.parse(localStorage.getItem("list-produk")) || []
    // kosongkan halaman ketika pertama kali dipanggil
    container.innerHTML = ""

    // catat total harga semua produk
    const TotalHarga = document.getElementById("harga")
    TotalHarga.innerText = keranjang.reduce((nilaiAwal, produk) => {
        harga = produk.quantity * produk.price
        return nilaiAwal + harga
    }, 0).toFixed(2)

    // catat total barang yang di chechout 
    const TotalCheckout = document.getElementById("jumlah-item")
    TotalCheckout.innerText = keranjang.length

    // jikalau keranjang kosong maka menampilkan informasi
    if (keranjang.length === 0) {
        cartEmpty.style.display = "block"
        container.appendChild(cartEmpty)
        return 0
    }


    keranjang.forEach((produkKeranjang, index) => {
        // buat card untuk cart item
        const cart_item = document.createElement("div")

        const img = document.createElement("img")
        const item_detail = document.createElement("div")

        const nama_produk = document.createElement("h4")
        const harga_produk = document.createElement("p")
        const item_action = document.createElement("div")

        const quantity_control = document.createElement("div")
        const minBtn = document.createElement("button")
        const quantity = document.createElement("span")
        const PlusBtn = document.createElement("button")

        const remove_item = document.createElement("div")

        // set attribut
        cart_item.classList.add("cart-item")
        item_detail.classList.add("item-details")
        harga_produk.classList.add("item-price")
        item_action.classList.add("item-actions")
        quantity_control.classList.add("quantity-control")
        remove_item.classList.add("remove-item")

        // set value
        img.src = produkKeranjang.image

        nama_produk.textContent = produkKeranjang.title
        harga_produk.textContent = `$ ${produkKeranjang.price}`

        minBtn.textContent = "-"
        quantity.textContent = produkKeranjang.quantity
        PlusBtn.textContent = "+"

        remove_item.textContent = "Hapus"

        // tampilkan ke web browser
        cart_item.appendChild(img)
        cart_item.appendChild(item_detail)

        item_detail.appendChild(nama_produk)
        item_detail.appendChild(harga_produk)
        item_detail.appendChild(item_action)

        item_action.appendChild(quantity_control)
        item_action.appendChild(remove_item)

        quantity_control.appendChild(minBtn)
        quantity_control.appendChild(quantity)
        quantity_control.appendChild(PlusBtn)


        container.appendChild(cart_item)


        // fungsi untuk mines btn
        minBtn.disabled = produkKeranjang.quantity <= 1
        minBtn.addEventListener("click", () => {
            lessQuantity(produkKeranjang)

        })

        // fungsi untuk plus btn
        PlusBtn.addEventListener("click", () => {
            indeedQuantity(produkKeranjang)
        })

        // fungsi untuk tombol hapus
        remove_item.addEventListener("click", () => {
            deleteProduct(index)
        })
    });


}

// fungsi menambahkan jumlah produk
function lessQuantity(produkkeranjang) {
    let listProduk = JSON.parse(localStorage.getItem("list-produk")) || []
    listProduk = listProduk.map(item =>
        item.id === produkkeranjang.id ? { ...item, quantity: produkkeranjang.quantity - 1 } : item
    )

    localStorage.setItem("list-produk", JSON.stringify(listProduk))
    showCart()

}

// fungsi mengurangi jumnlah produk
function indeedQuantity(produkkeranjang) {
    let listProduk = JSON.parse(localStorage.getItem("list-produk")) || []
    listProduk = listProduk.map(item =>
        item.id === produkkeranjang.id ? { ...item, quantity: produkkeranjang.quantity + 1 } : item
    )

    localStorage.setItem("list-produk", JSON.stringify(listProduk))
    showCart()
}

// fungsi untuk menghapus produk
function deleteProduct(index) {
    let produkList = JSON.parse(localStorage.getItem("list-produk"))
    produkList.splice(index, 1)

    localStorage.setItem("list-produk", JSON.stringify(produkList))
    showCart()
}


// fungsi hapus semua produk
const deleleteAll = document.getElementById("hapus-semua")
deleleteAll.addEventListener("click", () => {
    if (confirm("yakin ingin menghapus semua produk?")) {
        localStorage.removeItem("list-produk")
        location.reload()
    }
})


// fungsi lanjut checkhout
const checkout = document.getElementById("checkout-btn")
checkout.addEventListener("click", () => {
    let keranjang = JSON.parse(localStorage.getItem("list-produk")) || []
    let total = keranjang.reduce((nilaiAwal, produk) => {
        harga = produk.quantity * produk.price
        return nilaiAwal + harga
    }, 0).toFixed(2)

    if (keranjang.length != 0) {
        alert(`Total belanja Anda: $${total}\nTerima kasih sudah belanja!`);
        localStorage.removeItem("list-produk")
        window.location.href = "index.html"
    } else {
        alert("tidak ada barang yang dibeli")
    }
})