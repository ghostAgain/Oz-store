import React, { useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { supabase } from '../supaBaseClient.js';
import { useNavigate } from 'react-router-dom';

const ADMIN_DISCORD_ID = '552246124606652426';

export default function Login() {
  const navigate = useNavigate();

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    });
    if (error) {
      console.error('Erro ao logar com Discord:', error.message);
    }
  };

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Erro ao obter dados do usuário:', userError);
        return;
      }

      if (!user) return; // Não logado ainda

      // Discord ID geralmente está no app_metadata.provider_id
      const discordId = user?.app_metadata?.provider_id || null;

      if (!discordId) {
        console.error('Discord ID não encontrado no usuário.');
        return;
      }

      if (discordId === ADMIN_DISCORD_ID) {
        navigate('/admin');
      } else {
        navigate('/loja');
      }
    }

    checkUser();
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background:
          'linear-gradient(135deg, #0f0c29 60%, #302b63 80%, #24243e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      <Box
        component="img"
        src="/theozpath.png"
        alt="Logo"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: { xs: 100, sm: 120, md: 150 },
          maxWidth: '30vw',
          opacity: 0.15,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          width: { xs: '90vw', sm: 400, md: 450 },
          borderRadius: 2,
          bgcolor: 'rgba(30, 30, 47, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
        elevation={6}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: '#fff', mb: 1, textAlign: 'center' }}
        >
          Entrar com Discord
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#aab4f7', mb: 4, textAlign: 'center' }}
        >
          Acesse sua conta com segurança.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={handleDiscordLogin}
          sx={{
            backgroundColor: '#5865F2',
            color: '#fff',
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#4752c4',
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/dc.png"
            alt="Discord"
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          Conectar com Discord
        </Button>
      </Paper>
    </Box>
  );
}
