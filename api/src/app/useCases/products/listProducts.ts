import { Request, Response } from 'express';

import { Product } from '../../models/Product';

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await Product.find();

    return res.json(products);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
