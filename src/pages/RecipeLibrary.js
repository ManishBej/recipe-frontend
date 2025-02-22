import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { recipeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RecipeLibrary() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false); // Start with loading false
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [initialLoad, setInitialLoad] = useState(true); // Add initialLoad state
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    if (!initialLoad) setLoading(true);
    try {
      const { data } = await recipeService.getAllRecipes({
        page,
        limit: 12,
        sort,
        order,
        search: search.trim()
      });
      setRecipes(data.recipes);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load recipes');
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [page, sort, order, search, initialLoad]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, search ? 500 : 0);
    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleLike = async (recipeId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await recipeService.toggleLike(recipeId);
      setRecipes(recipes.map(recipe => 
        recipe._id === recipeId ? data : recipe
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  };

  if ((loading || initialLoad) && recipes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recipe Library
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search recipes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
                variant="outlined"
                InputProps={{
                  sx: { bgcolor: 'background.paper' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                <Select
                  value={sort}
                  onChange={handleSortChange}
                  displayEmpty
                  disabled={loading || initialLoad}
                >
                  <MenuItem value="createdAt">Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="cookingTime">Cooking Time</MenuItem>
                  <MenuItem value="likes">Popularity</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <Select
                  value={order}
                  onChange={handleOrderChange}
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {recipe.description.length > 150
                      ? `${recipe.description.substring(0, 150)}...`
                      : recipe.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    By {recipe.author.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.cookingTime} mins | {recipe.servings} servings
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                  >
                    View Recipe
                  </Button>
                  <IconButton
                    onClick={() => handleLike(recipe._id)}
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
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {recipes.length === 0 && !loading && (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            No recipes found. Try adjusting your search criteria.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default RecipeLibrary;