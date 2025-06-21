import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper, Snackbar, Alert,
  MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supaBaseClient.js';

const categories = [
  'Bypass',
  'Spoofer',
  'Otimização FiveM',
  'Otimização SAMP/MTA',
  'Curso de Telagem',
  'Inject Discord',
];

const statusOptions = ['Ativo', 'Inativo'];

export default function AdminPainel() {
  const navigate = useNavigate();

  // States
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    status: 'Ativo',
    imageurl: '',
  });
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from Supabase
  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      showAlert('Erro ao carregar produtos.', 'error');
    } else {
      setProducts(data);
    }
  }

  // Show alert helper
  function showAlert(message, severity = 'error') {
    setAlert({ open: true, severity, message });
  }

  // Handle form input changes
  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Validate form fields
  function validateForm() {
    if (!form.name.trim()) {
      showAlert('Nome é obrigatório.');
      return false;
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      showAlert('Preço inválido.');
      return false;
    }
    if (!form.stock || isNaN(parseInt(form.stock))) {
      showAlert('Estoque inválido.');
      return false;
    }
    if (!categories.includes(form.category)) {
      showAlert('Categoria inválida.');
      return false;
    }
    if (!statusOptions.includes(form.status)) {
      showAlert('Status inválido.');
      return false;
    }
    return true;
  }

  // Handle adding a new product
  async function handleAddProduct() {
    if (!validateForm()) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      showAlert('Usuário não autenticado.');
      return;
    }

    const newProduct = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      stock: parseInt(form.stock),
      status: form.status,
      imageurl: form.imageurl,
      user_id: user.id,
    };

    const { error } = await supabase.from('products').insert([newProduct]);

    if (error) {
      showAlert('Erro ao adicionar produto: ' + error.message);
      return;
    }

    showAlert('Produto adicionado com sucesso!', 'success');

    // Reset form and refresh products list
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      status: 'Ativo',
      imageurl: '',
    });

    fetchProducts();
  }

  // Handle deleting a product by id
  async function handleDelete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      showAlert('Erro ao deletar produto.');
      return;
    }

    showAlert('Produto removido.', 'info');
    fetchProducts();
  }

  // Logout user and redirect to login page
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  // Filter and search products before displaying
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filterStatus !== 'Todos') {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, filterStatus, searchTerm]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 4,
        backgroundColor: '#12152a',
        color: '#e0e6f0',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="700">
          Admin Painel
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
            Ir para Loja
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Sair
          </Button>
        </Box>
      </Box>

      {/* Form to add new product */}
      <Paper
        sx={{
          p: 3,
          mb: 5,
          bgcolor: 'rgba(30,30,50,0.85)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" mb={2} color='white'>
          Inserir produto
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Nome"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ flex: '1 1 200px' }}
            variant="filled"
            InputLabelProps={{ style: { color: '#a0a8c0' } }}
            inputProps={{ style: { color: '#e0e6f0' } }}
          />

          <TextField
            label="Descrição"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ flex: '2 1 400px' }}
            variant="filled"
            InputLabelProps={{ style: { color: '#a0a8c0' } }}
            inputProps={{ style: { color: '#e0e6f0' } }}
          />

          <TextField
            label="Preço"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            type="number"
            sx={{ flex: '1 1 100px' }}
            variant="filled"
            InputLabelProps={{ style: { color: '#a0a8c0' } }}
            inputProps={{ style: { color: '#e0e6f0' }, min: 0, step: '0.01' }}
          />

          <TextField
            label="Estoque"
            name="stock"
            value={form.stock}
            onChange={handleInputChange}
            type="number"
            sx={{ flex: '1 1 100px' }}
            variant="filled"
            InputLabelProps={{ style: { color: '#a0a8c0' } }}
            inputProps={{ style: { color: '#e0e6f0' }, min: 0, step: '1' }}
          />

          <FormControl sx={{ flex: '1 1 150px' }} variant="filled">
            <InputLabel sx={{ color: '#a0a8c0' }}>Categoria</InputLabel>
            <Select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              sx={{ color: '#e0e6f0', bgcolor: '#2a2d45', borderRadius: 2 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ flex: '1 1 150px' }} variant="filled">
            <InputLabel sx={{ color: '#a0a8c0' }}>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              sx={{ color: '#e0e6f0', bgcolor: '#2a2d45', borderRadius: 2 }}
            >
              {statusOptions.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="URL da Imagem"
            name="imageurl"
            value={form.imageurl}
            onChange={handleInputChange}
            fullWidth
            sx={{ flex: '2 1 400px' }}
            variant="filled"
            InputLabelProps={{ style: { color: '#a0a8c0' } }}
            inputProps={{ style: { color: '#e0e6f0' } }}
          />

          <Box sx={{ flexBasis: '100%', textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleAddProduct}>
              Cadastrar Produto
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Filters */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <FormControl sx={{ minWidth: 150 }} variant="filled">
          <InputLabel sx={{ color: '#a0a8c0' }} id="filter-status-label">
            Filtrar Status
          </InputLabel>
          <Select
            labelId="filter-status-label"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{
              color: '#e0e6f0',
              bgcolor: '#2a2d45',
              borderRadius: 2,
              '.MuiSelect-icon': { color: '#a0a8c0' },
            }}
            label="Filtrar Status"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {statusOptions.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          variant="filled"
          label="Pesquisar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputLabelProps={{ style: { color: '#a0a8c0' } }}
          inputProps={{ style: { color: '#e0e6f0' } }}
          sx={{ bgcolor: '#2a2d45', borderRadius: 2, flexGrow: 1 }}
        />
      </Box>

      {/* Product Table */}
      <Paper
        sx={{
          p: 3,
          bgcolor: 'rgba(30,30,50,0.85)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(50,50,100,0.5)',
          overflow: 'auto',
          maxWidth: '100%',
        }}
      >
        <Typography variant="h6" mb={2} color="white">
          Produtos Cadastrados ({filteredProducts.length})
        </Typography>

        {filteredProducts.length === 0 ? (
          <Typography sx={{ color: '#a0a8c0' }}>Nenhum produto encontrado.</Typography>
        ) : (
          <Table
            size="small"
            sx={{
              minWidth: 650,
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
                color: '#d0d6f0',
                borderBottom: '1px solid #33425f',
              },
              '& .MuiTableCell-head': { fontWeight: '700', color: '#a0b4e0' },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Estoque</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Imagem</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((prod) => (
                <TableRow key={prod.id} hover>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>R$ {Number(prod.price).toFixed(2)}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 180,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {prod.description}
                  </TableCell>
                  <TableCell>{prod.category}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>{prod.status}</TableCell>
                  <TableCell>
                    {prod.imageurl ? (
                      <img
                        src={prod.imageurl}
                        alt={prod.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(prod.id)}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
