import { Container, Typography, Box, Paper } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Recipe Share
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Recipe Share is a platform where food enthusiasts can discover, create, and share their favorite recipes with a community of like-minded individuals.
          </Typography>
          <Typography variant="body1" paragraph>
            Our mission is to make cooking more accessible and enjoyable for everyone, from beginners to experienced chefs. Share your culinary creations, explore new recipes, and connect with other food lovers.
          </Typography>
          <Typography variant="body1" paragraph>
            Features:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Create and share your own recipes</li>
            <li>Browse a diverse collection of community recipes</li>
            <li>Save your favorite recipes</li>
            <li>Responsive design for easy mobile access</li>
            <li>Dark mode for comfortable viewing</li>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default About;