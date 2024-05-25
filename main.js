let myStore = new Store("San Pham");

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
            <td>${list[i].price} vnđ</td>
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
    <input type="number" id="price" placeholder="Price">
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
    // Kiểm tra đầy đủ thông tin
    if (name.trim() === '' || color.trim() === '' || price.trim() === '') {
        alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        return;
    }

    // Kiểm tra giá trị price không âm
    if (isNaN(price) || Number(price) < 0) {
        alert("Giá sản phẩm phải là số không âm!");
        return;
    }

    let imageInput = document.getElementById("image");

    if (imageInput.files.length === 0) {
        alert("Vui lòng chọn hình ảnh!");
        return;
    }

    // Chuyển đổi hình ảnh thành dữ liệu base64
    let image = "";
    if (imageInput.files.length > 0) {
        let file = imageInput.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            image = reader.result;
            let newProduct = new Product(id, name, color, price, image);
            myStore.add(newProduct);
            saveLocalStorage();
            showHome();
        };
    } else {
        alert("Vui lòng chọn hình ảnh!");
    }
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
    <input type="number" id="price" placeholder="Price" value="${oldProduct.price}">
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
    let image = imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : currentImage;
    // Kiểm tra đầy đủ thông tin
    if (name.trim() === '' || color.trim() === '' || price.trim() === '') {
        alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        return;
    }

    // Kiểm tra giá trị price không âm
    if (isNaN(price) || Number(price) < 0) {
        alert("Giá sản phẩm phải là số không âm!");
        return;
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