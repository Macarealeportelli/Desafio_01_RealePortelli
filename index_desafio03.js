import fs from 'fs'


export class ProductManager {

  constructor(path) {
    this.path = path
  }

  async getProducts(limit){
    try {
      if(fs.existsSync(this.path)){
        const infoProducts = await fs.promises.readFile(this.path, 'utf-8')
        if(limit === 'max'){
          console.log(infoProducts)
          return JSON.parse(infoProducts)
        }else{
          return JSON.parse(infoProducts).slice(0, limit)
        }
      } else {
        return []
      }
    } catch (error) {
      return error
    }
  }


  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
    if(!title || !description || !price || !thumbnail || !code || !stock) {
      return console.log('Error, product incomplete');
    } else {
        const isCode = await this.#evaluarCode(code)
        if(isCode){
          console.log('That code already exist, try again')
        } else {
          const product = {
            id: await this.#generarId(), 
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          }
          const read = await this.getProducts()
          read.push(product)
          await fs.promises.writeFile(this.path, JSON.stringify(read, null, 2))
        } 
    }
    } catch(error) {
      console.log(error)
      return error
    } 
  }

  async getProductById(idProduct){
    try {
      const read = await this.getProducts()
      const prod = read.find((p)=>p.id===parseInt(idProduct))
      if(prod){
        console.log(prod)
        return prod
      }else{
        return 'product not found'
      }
    } catch(error) {
      console.log(error)
      return error
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
    try {
      let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      const filtrado =read.filter(prod => prod.id != idProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(filtrado, null, 2))
      return filtrado
    }
    } catch (error) {
      console.log(error)
      return error
    }
  }


  async #generarId() {
    const read = await this.getProducts()
    let id =
      read.length === 0
        ? 1
        : read[read.length - 1].id + 1
    return id
  }

  // async #evaluarProductoId(id){
  //   const read = await this.getProducts()
  //   const findId = read.find((product)=>product.id === id)
  //   return findId
  // }

  async #evaluarCode(code){
    const read = await this.getProducts()
    const findCode = read.find((product)=>product.code === code)
    return findCode
  }
}

// const productManager = new ProductManager('./archivos/products.json')

// async function prueba() {
//   await productManager.getProducts()
//   // await productManager.addProduct('producto 1', 'Este es el producto prueba 1', 200, 'sin imagen', 'abc13423', 25)
//   // await productManager.addProduct('producto 2', 'Este es el producto prueba 2', 200, 'sin imagen', 'dsa423dsdsa', 25)
//   // await productManager.addProduct('producto 3', 'Este es el producto prueba 3', 200, 'sin imagen', 'asdasdasdas', 25)
//   // await productManager.addProduct('producto 4', 'Este es el producto prueba 4', 200, 'sin imagen', 'dsadasas', 25)
//   // const productoId = await productManager.getProductById(1)
// }

// prueba()












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





































