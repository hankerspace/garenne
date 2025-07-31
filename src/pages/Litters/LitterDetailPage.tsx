import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const LitterDetailPage = () => {
  const { id } = useParams();

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Détail portée {id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cette page affichera les détails d'une portée avec possibilité de créer les jeunes au sevrage.
        </Typography>
      </Box>
    </Container>
  );
};

export default LitterDetailPage;