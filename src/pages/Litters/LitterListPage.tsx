import { Container, Typography, Box } from '@mui/material';

const LitterListPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Liste des portées
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cette page affichera la liste des portées avec leurs détails.
        </Typography>
      </Box>
    </Container>
  );
};

export default LitterListPage;