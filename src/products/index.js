import express from "express";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import fs from "fs-extra";
import uniqid from "uniqid";

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "products.json"
);
const getproducts = () => JSON.parse(fs.readFileSync(productsJSONPath));
const writeproducts = (content) =>
  fs.writeFileSync(productsJSONPath, JSON.stringify(content));

const productsRouter = express.Router();

productsRouter.post("/", async(req, res, next) => {
  try {
    
    const product = {
      ...req.body,
      _id: uniqid(),

      createdat: new Date(),
      updatedAt: new Date(),
    };
    console.log(req.body);

    const products = await getproducts();
    products.push(product);
    writeproducts(products);
    res.status(201).send({ id: product._id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getproducts();
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const products = await getproducts();
    const eachprod = products.find((product) => product._id === req.params.id);
    if (!eachprod) {
      res.status(404).send({ message: `Incorrect Id` });
    }
    res.send(eachprod);
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const products = await getproducts();
    const index = await products.findIndex(
      (product) => product._id === req.params.id
    );
    console.log(index);
    if (!index == -1) {
      res.status(404).send({ message: `Incorrect request with Id` });
    }
    const producttobeupdated = products[index];
    const updatedproduct = { ...producttobeupdated, ...req.body };
    products[index] = updatedproduct;
    await writeproducts(products);
    res.status(202).send(updatedproduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const products = await getproducts();
   const deletingproduct = products.filter(
      (product) => product._id !== req.params.id
    );
     writeproducts(deletingproduct);
    res.send("deleted successfully!!");
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
