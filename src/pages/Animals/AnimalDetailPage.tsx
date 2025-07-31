import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const AnimalDetailPage = () => {
  const { id } = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Détail animal {id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cette page affichera les détails d'un animal avec onglets pour aperçu, reproduction, pesées et santé.
        </Typography>
      </Box>
    </Container>
  );
};

export default AnimalDetailPage;