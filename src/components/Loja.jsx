import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  Modal,
  Paper,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../supaBaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function Loja() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  // States
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });

  // Cartão form states
  const [cardData, setCardData] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate('/login');
          return;
        }

        setUser(user);

        const { data: produtosData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'Ativo');

        if (prodError) {
          setProdutos([]);
          setAlert({ open: true, severity: 'error', message: 'Erro ao carregar produtos' });
        } else {
          setProdutos(produtosData);
        }
      } catch (err) {
        setAlert({ open: true, severity: 'error', message: 'Erro inesperado' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  function toggleDrawer() {
    setDrawerOpen((open) => !open);
  }

  function handleLogout() {
    supabase.auth.signOut();
    navigate('/login');
  }

  // Validação simples do form cartão
  function validateCard() {
    const { numero, nome, validade, cvv } = cardData;
    if (!/^\d{13,16}$/.test(numero.replace(/\s+/g, ''))) {
      setAlert({ open: true, severity: 'error', message: 'Número do cartão inválido' });
      return false;
    }
    if (nome.trim().length < 3) {
      setAlert({ open: true, severity: 'error', message: 'Nome no cartão inválido' });
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(validade)) {
      setAlert({ open: true, severity: 'error', message: 'Validade deve ser MM/AA' });
      return false;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setAlert({ open: true, severity: 'error', message: 'CVV inválido' });
      return false;
    }
    return true;
  }

  function handleCardChange(e) {
    const { name, value } = e.target;
    setCardData((old) => ({ ...old, [name]: value }));
  }

  function handleCardSubmit(e) {
    e.preventDefault();
    if (!validateCard()) return;
    setAlert({ open: true, severity: 'success', message: 'Cartão cadastrado com sucesso!' });
    setModalOpen(false);
    setCardData({ numero: '', nome: '', validade: '', cvv: '' });
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#12152a',
        color: '#e0e6f0',
        p: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar / menu button */}
      {!isDesktop && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<MenuIcon />}
            onClick={toggleDrawer}
            sx={{ textTransform: 'none' }}
          >
            Menu
          </Button>
        </Box>
      )}

      {/* Drawer */}
      <Drawer
        open={drawerOpen || isDesktop}
        onClose={() => setDrawerOpen(false)}
        variant={isDesktop ? 'persistent' : 'temporary'}
        anchor="left"
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: '#1e1e32',
            color: '#e0e6f0',
            width: 300,
            p: 3,
            borderRight: 'none',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            boxSizing: 'border-box',
            zIndex: 1300,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h6" fontWeight="700">
            Oz store
          </Typography>
          {!isDesktop && (
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#e0e6f0' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            borderBottom: '1px solid #2a2d45',
            pb: 3,
          }}
        >
          <Avatar
            alt={user?.email}
            sx={{ bgcolor: '#5865F2', width: 56, height: 56, fontWeight: 'bold' }}
          >
            {user?.email?.[0].toUpperCase() || '?'}
          </Avatar>
          <Box>
            <Typography fontWeight="700" fontSize={18} sx={{ userSelect: 'none' }}>
              {user?.email}
            </Typography>
            <Typography color="#a0a8c0" fontSize={14}>
              Cliente
            </Typography>
          </Box>
        </Box>

        <Button
          startIcon={<CreditCardIcon />}
          variant="contained"
          sx={{ mb: 2, textTransform: 'none', fontWeight: '600' }}
          onClick={() => setModalOpen(true)}
        >
          Registrar Cartão
        </Button>

        <Button
          startIcon={<LogoutIcon />}
          variant="outlined"
          color="error"
          sx={{ textTransform: 'none', fontWeight: '600' }}
          onClick={handleLogout}
        >
          Sair
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="caption"
          color="#777"
          sx={{ userSelect: 'none', mt: 'auto', textAlign: 'center' }}
        >
          © 2025 Oz Store
        </Typography>
      </Drawer>

      {/* Conteúdo principal */}
      <Box sx={{ flexGrow: 1, ml: isDesktop ? '300px' : 0 }}>
        <Typography variant="h3" fontWeight="700" mb={4}>
          Oz store - Produtos
        </Typography>

        {loading ? (
          <Typography>Carregando produtos...</Typography>
        ) : produtos.length === 0 ? (
          <Typography>Nenhum produto ativo disponível.</Typography>
        ) : (
          <Grid container spacing={3}>
            {produtos.map((p) => (
              <Grid key={p.id} item xs={12} sm={6} md={4}>
                <Paper
                  elevation={6}
                  sx={{
                    bgcolor: 'rgba(30,30,50,0.85)',
                    borderRadius: 3,
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: `0 8px 20px ${theme.palette.primary.main}88`,
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="700" mb={1}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ flexGrow: 1, mb: 2, color: '#c5c9d1cc' }}>
                    {p.description}
                  </Typography>
                  <Typography variant="h6" color={theme.palette.primary.main} fontWeight="bold">
                    R$ {Number(p.price).toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Modal para cadastrar cartão */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-titulo"
        aria-describedby="modal-descricao"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90vw', sm: 400 },
            bgcolor: '#1e1e32',
            borderRadius: 3,
            p: 4,
            outline: 'none',
            boxShadow: 24,
          }}
          elevation={24}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography id="modal-titulo" variant="h6" fontWeight="700" color="#e0e6f0">
              Registrar Cartão
            </Typography>
            <IconButton
              onClick={() => setModalOpen(false)}
              sx={{ color: '#e0e6f0' }}
              aria-label="Fechar"
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box component="form" onSubmit={handleCardSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Número do Cartão"
              name="numero"
              variant="filled"
              value={cardData.numero}
              onChange={handleCardChange}
              inputProps={{ maxLength: 16 }}
              required
              fullWidth
              sx={{
                bgcolor: '#12152a',
                input: { color: '#e0e6f0' },
                label: { color: '#a0a8c0' },
              }}
            />

            <TextField
              label="Nome no Cartão"
              name="nome"
              variant="filled"
              value={cardData.nome}
              onChange={handleCardChange}
              required
              fullWidth
              sx={{
                bgcolor: '#12152a',
                input: { color: '#e0e6f0' },
                label: { color: '#a0a8c0' },
              }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Validade (MM/AA)"
                name="validade"
                variant="filled"
                value={cardData.validade}
                onChange={handleCardChange}
                inputProps={{ maxLength: 5 }}
                required
                fullWidth
                sx={{
                  bgcolor: '#12152a',
                  input: { color: '#e0e6f0' },
                  label: { color: '#a0a8c0' },
                }}
              />
              <TextField
                label="CVV"
                name="cvv"
                variant="filled"
                value={cardData.cvv}
                onChange={handleCardChange}
                inputProps={{ maxLength: 4 }}
                required
                sx={{
                  bgcolor: '#12152a',
                  input: { color: '#e0e6f0' },
                  label: { color: '#a0a8c0' },
                  width: 120,
                }}
              />
            </Stack>

            <Button variant="contained" color="primary" type="submit" sx={{ mt: 1, fontWeight: '700' }}>
              Salvar Cartão
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Snackbar para alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3500}
        onClose={() => setAlert((old) => ({ ...old, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert((old) => ({ ...old, open: false }))}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
