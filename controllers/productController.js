import Product from "../models/Product.js"

/* Admin only*/
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, availableStock } = req.body;
    const p = await Product.create({ name, price, description, availableStock });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

/*listing with sorting/filering  */
export const listProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;
    const { sortBy, order = 'asc', name } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };

    let sort = {};
    if (sortBy) {
      const dir = order === 'desc' ? -1 : 1;
      sort[sortBy] = dir;
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);
    res.json({ total, page, limit, products });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
};



