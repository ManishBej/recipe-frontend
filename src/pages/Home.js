import { Container, Typography, Box } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Recipe Share
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Discover, create, and share your favorite recipes
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;