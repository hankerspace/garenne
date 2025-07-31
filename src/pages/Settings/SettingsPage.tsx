import { Container, Typography, Box } from '@mui/material';

const SettingsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Paramètres
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cette page permettra de configurer le thème, les unités, et gérer l'export/import des données.
        </Typography>
      </Box>
    </Container>
  );
};

export default SettingsPage;