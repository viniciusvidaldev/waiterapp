import { Request, Response } from 'express';

import { Category } from '../../models/Category';

export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find();

    return res.json(categories);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
