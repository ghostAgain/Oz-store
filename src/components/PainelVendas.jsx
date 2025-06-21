import React, { useState } from 'react';
import { Box, Typography, Card, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AdminPainel() {
  const [produtos, setProdutos] = useState([]);

  const totalVendas = 0;
  const receitaTotal = 0;
  const produtosAtivos = 0;

  const navigate = useNavigate();

  function StatCard({ title, value, icon, color }) {
    return (
      <Card
        sx={{
          background: 'rgba(30, 30, 50, 0.85)',
          color: '#e0e6f0',
          borderRadius: 2,
          boxShadow: 3,
          minWidth: 180,
          display: 'flex',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box sx={{ mr: 2, fontSize: 36, color }}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>{title}</Typography>
          <Typography variant="h5" fontWeight="bold">{value}</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Typography variant="h4" color="#bbaaff" mb={3}>Painel de Vendas</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item>
          <StatCard title="Total de Vendas" value={totalVendas} color="#4caf50" icon="📈" />
        </Grid>
        <Grid item>
          <StatCard title="Receita Total" value={`R$ ${receitaTotal.toFixed(2)}`} color="#ffa726" icon="💰" />
        </Grid>
        <Grid item>
          <StatCard title="Produtos Ativos" value={produtosAtivos} color="#29b6f6" icon="📦" />
        </Grid>
      </Grid>
      <Box>
        {produtos.length === 0 ? (
          <Typography color="#888" fontStyle="italic">Nenhum produto carregado ainda.</Typography>
        ) : (
          produtos.map((produto) => (
            <Box key={produto.id} sx={{ mb: 2, p: 2, backgroundColor: '#1e1e32', borderRadius: 2 }}>
              <Typography variant="h6" color="#e0e6f0">{produto.name}</Typography>
              <Typography color="#ccc">{produto.description}</Typography>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin')}
          sx={{ px: 5, py: 1.5, fontWeight: '600' }}
        >
          Painel Admin Oz
        </Button>
      </Box>
    </Box>
  );
}
