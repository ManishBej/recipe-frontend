import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { recipeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const { data } = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await recipeService.toggleLike(id);
      setRecipe(data);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(id);
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete recipe');
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    if (canEdit) {
      navigate(`/recipes/edit/${id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 4 }}>
          Recipe not found
        </Alert>
      </Container>
    );
  }

  const isAuthor = user && recipe.author._id === user._id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                {recipe.title}
              </Typography>
              <Box>
                <IconButton
                  onClick={handleLike}
                  color={recipe.likes.includes(user?._id) ? 'primary' : 'default'}
                >
                  {recipe.likes.includes(user?._id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {recipe.likes.length}
                  </Typography>
                </IconButton>
                {canEdit && (
                  <>
                    <IconButton
                      color="primary"
                      onClick={handleEdit}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                {recipe.description}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Cooking Time
              </Typography>
              <Typography variant="body1" paragraph>
                {recipe.cookingTime} minutes
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Servings
              </Typography>
              <Typography variant="body1" paragraph>
                {recipe.servings} servings
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Step ${index + 1}`}
                        secondary={instruction}
                      />
                    </ListItem>
                    {index < recipe.instructions.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Created by {recipe.author.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recipe? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RecipeDetail;