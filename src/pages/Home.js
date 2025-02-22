import React from 'react';
import { Box, Typography, Button, Grid, Container, Card, CardContent, CardMedia } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: <KitchenIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Recipe Management',
      description: 'Organize your recipes with ease. Add, edit, and categorize your culinary creations.'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI Recipe Assistant',
      description: 'Get personalized recipe suggestions based on ingredients you have.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Community Sharing',
      description: 'Share your recipes and discover dishes from food enthusiasts worldwide.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, rgba(26,137,23,0.85) 0%, rgba(188,81,0,0.85) 100%)',
          color: 'white',
          position: 'relative',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/kitchen 01.jpg")', // Updated image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 2 
                }}
              >
                Your Culinary Journey Starts Here
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)' 
                }}
              >
                Discover, create, and share amazing recipes with our community
              </Typography>
              {!user && (
                <Box sx={{ '& > *': { mr: 2 } }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/register" 
                    size="large"
                    sx={{ 
                      backgroundColor: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.dark' }
                    }}
                  >
                    Join Now
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/login" 
                    size="large"
                    sx={{ 
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Why Choose Recipe Share?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                {feature.icon}
                <Typography variant="h5" component="h3" sx={{ my: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Recipes Section */}
      <Box sx={{ backgroundColor: 'primary.main', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Start Exploring
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/browsing recipe.png" // Updated image path
                  alt="Browse Recipes"
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Browse Recipes
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Explore our extensive collection of recipes from around the world.
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/recipes"
                    fullWidth
                  >
                    View Library
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            {user && (
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image="/AI Cook.jpeg" // Updated image path
                    alt="AI Assistant"
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      AI Recipe Assistant
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Get personalized recipe suggestions using our AI assistant.
                    </Typography>
                    <Button 
                      variant="contained" 
                      component={Link} 
                      to="/ai-assistant"
                      fullWidth
                    >
                      Try Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Your Culinary Adventure?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join our community of food enthusiasts and start sharing your recipes today.
          </Typography>
          {!user && (
            <Button
              variant="contained"
              component={Link}
              to="/register"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              Get Started
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default Home;