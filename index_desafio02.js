const fs = require('fs')
const { title } = require('process')

class ProductManager {

  constructor() {
    this.products = []
    this.path = './archivos/products.json'
  }

  async getProducts(){
    try{
      if(fs.existsSync(this.path)){
        const infoProducts = await fs.promises.readFile(this.path, 'utf-8')
        const infoProductsJS = JSON.parse(infoProducts)
        return console.log(infoProductsJS)
      } else {
        return []
      }
    } catch(error){
      console.log(error)
    }
    // return console.log(this.products)
  }


  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
    if(!title || !description || !price || !thumbnail || !code || !stock) {
      return console.log('Error, product incomplete');
    } else {
        const isCode = this.#evaluarCode(code)
        if(isCode){
          console.log('That code already exist, try again')
        } else {
          const product = {
            id: this.#generarId(), 
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          }
          this.products.push(product)
          await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } 
    }
    } catch(error) {
      console.log(error)
    } 
  }

  async getProductById(idProduct){
    try {
      if (fs.existsSync(this.path)){
        await fs.promises.readFile(this.path, 'utf-8')
        const productFound = this.#evaluarProductoId(idProduct)
        if(productFound){
          console.log(productFound)
          return productFound
        } else {
          console.log('Product not found')
        }
      }
    } catch(error) {
      console.log(error)
    }
  }

  async updateProduct(idProduct, change){
    let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      product = {...product, ...change}
      read = read.map(prod => {
        if(prod.id == product.id){
          prod = product
        }
        return prod
      })
      read = JSON.stringify(read, null, 2)
      await fs.promises.writeFile(this.path, read)
      console.log(JSON.parse(read))
      return read
    }else{
      return null
    }
  }

  async deleteProduct(idProduct){
    let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      const filtrado =read.filter(prod => prod.id != idProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(filtrado, null, 2))
      return filtrado
    }
  }


  #generarId() {
    let id =
      this.products.length === 0
        ? 1
        : this.products[this.products.length - 1].id + 1
    return id
  }

  #evaluarProductoId(id){
    return this.products.find(product => product.id === id)
  }

  #evaluarCode(code){
    return this.products.find(product => product.code === code)
  }
}

const product = new ProductManager()

// primer getProducts = array vacio
// product.getProducts()

// agrego productos:
// product.addProduct('producto 1', 'Este es el producto prueba 1', 200, 'sin imagen', 'abc123', 25)
// product.addProduct('producto 2', 'Este es el producto prueba 2', 200, 'sin imagen', 'dsadsdsa', 25)

// segundo getProducts = array con el primer producto agregado
// product.getProducts()

// error = codigo repetido
// product.addProduct('producto prueba', 'Este es el producto prueba', 200, 'sin imagen', 'abc123', 25)

//objeto del producto con el id deseado:
// product.getProductById(1)
// product.getProductById(2)

//id no encontrado:
// product.getProductById(67)

// actualizar productos:
// product.updateProduct(2, {"title":'prueba cambiada'})

//borrar producto:
// product.deleteProduct(1)






































