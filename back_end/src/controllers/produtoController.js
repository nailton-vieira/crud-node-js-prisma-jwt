const prisma = require('../models/prisma/client');

const getAllProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getProdutoById = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!produto) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const createProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(price),
        quantidade: parseInt(quantity),
        userId: req.userData.userId,
      },
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;

    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (produto.userId !== req.userData.userId && req.userData.funcao !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { nome, descricao, preco: parseFloat(price), quantity: parseInt(quantity) },
    });

    res.json(updatedProduto);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (produto.userId !== req.userData.userId && req.userData.funcao !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await prisma.produto.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getAllProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
};