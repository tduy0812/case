let myStore = new Store("Cua hang");

function showHome() {
    document.getElementById("main").innerHTML = `
     <table border="1">
        <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Color</td>
            <td>Price</td>
            <td>Image</td>
            <td colspan="2">Action</td>
        </tr>
        <tbody id="listProduct">

        </tbody>
    </table>
    `
    let list = localStorage.getItem('data') == null ? [] : JSON.parse(localStorage.getItem('data'));
    let html = ``;
    for (let i = 0; i < list.length; i++) {
        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${list[i].name}</td>
            <td>${list[i].color}</td>
            <td>${list[i].price}</td>
            <td><img src="${list[i].image}" alt=""></td>
            <td><button onclick="showFormUpdate(${i})">Update</button></td>
        <td><button onclick="removeProduct(${i})">Delete</button></td>
        </tr>
        `
    }
    document.getElementById("listProduct").innerHTML = html;
}

function showFormAdd() {
    document.getElementById("main").innerHTML = `
    <input type="text" id="id" placeholder="Id" readonly>
    <input type="text" id="name" placeholder="Name">
    <input type="text" id="color" placeholder="Color">
    <input type="text" id="price" placeholder="Price">
    <input type="file" id="image" accept="image/*">
    <img id="imagePreview" src="" alt="Preview">
    <button onclick="add()">Add</button>
    `
}

function add() {
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let color = document.getElementById("color").value;
    let price = document.getElementById("price").value;
    let imageInput = document.getElementById("image");
    let image = imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : ""; // Lấy đường dẫn của ảnh
    let newProduct = new Product(id, name, color, price, image);
    if (name.trim() === '' || color.trim() === '' || price.trim() === '' || imageInput.files.length === 0) {
        // Hiển thị thông báo nếu người dùng chưa nhập đủ thông tin
        alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        return; // Dừng việc thêm sản phẩm nếu thông tin không đầy đủ
    }
    myStore.add(newProduct);
    saveLocalStorage()
    showHome();
}

function removeProduct(index) {
    let isConfirm = confirm("Xóa sản phẩm");
    if (isConfirm) {
        myStore.remove(index);
        saveLocalStorage()
        showHome();
    }
}

let currentImage = "";

function showFormUpdate(index) {
    let list = localStorage.getItem('data') == null ? [] : JSON.parse(localStorage.getItem('data'));
    let oldProduct = list[index];
    // Lưu đường dẫn hình ảnh hiện tại vào biến toàn cục
    currentImage = oldProduct.image;

    console.log(oldProduct);
    document.getElementById("main").innerHTML = `
    <input type="text" id="id" placeholder="Id" value="${oldProduct.id}" readonly>
    <input type="text" id="name" placeholder="Name" value="${oldProduct.name}">
    <input type="text" id="color" placeholder="Color" value="${oldProduct.color}">
    <input type="text" id="price" placeholder="Price" value="${oldProduct.price}">
    <input type="file" id="image" accept="image/*">
    <img id="imagePreview" src="${oldProduct.image}" alt="Preview" style="max-width: 60px">
    <button onclick="update(${index})">Update</button>
    `;
}

function update(index) {
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let color = document.getElementById("color").value;
    let price = document.getElementById("price").value;
    let imageInput = document.getElementById("image");
    let image = imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : "";
    if (name.trim() === '' || color.trim() === '' || price.trim() === '') {
        // Hiển thị thông báo nếu người dùng chưa nhập đủ thông tin
        alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        return; // Dừng việc cập nhật sản phẩm nếu thông tin không đầy đủ
    }
    let newProduct = new Product(id, name, color, price, image);
    myStore.update(index, newProduct);
    saveLocalStorage()
    showHome();
}

function showFormSearch() {
    document.getElementById('main').innerHTML = ` <br>
    <input type="text" placeholder="Search product name..." id="find">   
    <button onclick="search()">Search</button> `;
}

function search() {
    let nameSearch = document.getElementById("find").value; // lấy dữ liêu từ ô input
    let listSearch = myStore.search(nameSearch);
    if (listSearch.length > 0) {
        let str = ``
        document.getElementById('main').innerHTML = `
        <table border="1">
        <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Color</td>
            <td>Price</td>
            <td>Image</td>
        </tr>
        <tbody id="listSearch">

        </tbody>
        </table>`

        for (let i = 0; i < listSearch.length; i++) {
            str += `
            <tr>
            <td>${i + 1}</td>
            <td>${listSearch[i].name}</td>
            <td>${listSearch[i].color}</td>
            <td>${listSearch[i].price}</td>
            <td><img src="${listSearch[i].image}" alt=""></td>
           </tr>`
        }
        document.getElementById("listSearch").innerHTML = str;
    } else {
        alert("Không tìm thấy " + nameSearch);
    }
}
let isSortedByNameAsc = false;
function sortByName() {
    if (isSortedByNameAsc) {
        myStore.listProduct.sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp tăng dần theo tên
    } else {
        myStore.listProduct.sort((a, b) => b.name.localeCompare(a.name)); // Sắp xếp giảm dần theo tên
    }
    isSortedByNameAsc = !isSortedByNameAsc;
    saveLocalStorage();
    showHome();
}

function saveLocalStorage() {
    list = myStore.listProduct;
    localStorage.setItem('data', JSON.stringify(list));
}

function restoreLocalStorage() {
    if (localStorage.getItem('data')) {
        list = JSON.parse(localStorage.getItem('data'));
        showHome();
    }
}

window.onload = function () {
    restoreLocalStorage()
}

showHome()