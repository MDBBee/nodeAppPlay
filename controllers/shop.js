const Product = require("../models/product");
const Cart = require("../models/cart");
const { where } = require("sequelize");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((prod) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: prod,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let extractedCart;
  req.user
    .getCart()
    .then((cart) => {
      extractedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((prod) => {
      let newQnty = 1;
      let product;

      if (prod.length > 0) {
        product = prod[0];

        const oldQnty = product.cartItem.quantity;
        newQnty = oldQnty + 1;
        return [product, newQnty];
      }
      return Product.findByPk(prodId).then((prod) => [prod, newQnty]);
    })
    .then((data) => {
      const [product, qty] = data;
      extractedCart.addProduct(product, { through: { quantity: qty } });
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: prodId } }))
    .then((prod) => {
      const product = prod[0];
      product.cartItem.destroy();
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let axtractedCart;
  req.user
    .getCart()
    .then((cart) => {
      axtractedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          return order.addProduct(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => axtractedCart.setProducts(null))
    .then((_) => res.redirect("/order"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) =>
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      })
    )
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
