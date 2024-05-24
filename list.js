class Store {
    name;
    listProduct;

    constructor(name) {
        this.name = name
        let listProduct = localStorage.getItem('data') == null ? [] : JSON.parse(localStorage.getItem('data'));
        if(listProduct) { this.listProduct = localStorage.getItem('data') == null ? [] : JSON.parse(localStorage.getItem('data'));}

    }

    add(newProduct) {
        this.listProduct.push(newProduct)
    }

    remove(index) {
        this.listProduct.splice(index, 1)
    }

    update(index, newProduct) {
        this.listProduct[index] = newProduct
    }

    search(name) {
        return this.listProduct.filter (value => value.name.toLowerCase().includes(name.toLowerCase()))

    }
}