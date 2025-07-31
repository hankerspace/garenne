import { Container, Typography, Box } from '@mui/material';

const AnimalListPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Liste des animaux
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cette page affichera la liste des animaux avec filtres et recherche.
        </Typography>
      </Box>
    </Container>
  );
};

export default AnimalListPage;