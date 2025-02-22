import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { aiService, recipeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const steps = ['Enter Ingredients', 'Choose Recipe Type', 'View Recipe'];

function AiRecipeAssistant() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailedRecipe, setDetailedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGetSuggestions = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await aiService.suggestRecipes(ingredients);
      if (!data.suggestions || !Array.isArray(data.suggestions) || data.suggestions.length === 0) {
        throw new Error('No recipe suggestions available for these ingredients');
      }
      setSuggestions(data.suggestions);
      setActiveStep(1);
    } catch (err) {
      setSuggestions([]);
      setError(err.response?.data?.message || err.message || 'Failed to get suggestions. Please try different ingredients.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = async (recipe) => {
    setSelectedRecipe(recipe);
    setLoading(true);
    setError('');
    try {
      const { data } = await aiService.getDetailedRecipe({
        dishName: recipe.dishName,
        cuisine: recipe.cuisine,
        ingredients: ingredients
      });
      if (!data.title || !data.instructions || !data.ingredients) {
        throw new Error('Invalid recipe details received');
      }
      setDetailedRecipe(data);
      setActiveStep(2);
    } catch (err) {
      setDetailedRecipe(null);
      setError(err.response?.data?.message || err.message || 'Failed to get recipe details. Please try again.');
      setActiveStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!detailedRecipe) return;
    
    try {
      const recipeData = {
        title: detailedRecipe.title,
        description: detailedRecipe.description,
        ingredients: detailedRecipe.ingredients,
        instructions: detailedRecipe.instructions,
        cookingTime: detailedRecipe.cookingTime,
        servings: detailedRecipe.servings
      };
      
      const { data } = await recipeService.createRecipe(recipeData);
      navigate(`/recipes/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What ingredients do you have?
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Enter ingredient"
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddIngredient}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              {ingredients.map((ing, index) => (
                <Chip
                  key={index}
                  label={ing}
                  onDelete={() => handleRemoveIngredient(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
            <Button
              variant="contained"
              onClick={handleGetSuggestions}
              disabled={ingredients.length === 0 || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Recipe Suggestions'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Suggested Recipes
            </Typography>
            <Grid container spacing={3}>
              {suggestions.map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {recipe.dishName}
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        {recipe.cuisine} Cuisine
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {recipe.briefDescription}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Additional ingredients needed:
                      </Typography>
                      <List dense>
                        {recipe.additionalIngredientsNeeded.map((ing, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={ing} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleSelectRecipe(recipe)}
                      >
                        Select Recipe
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {detailedRecipe?.title}
            </Typography>
            <Paper sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                {detailedRecipe?.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {detailedRecipe?.ingredients.map((ing, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ing} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Instructions
              </Typography>
              <List>
                {detailedRecipe?.instructions.map((step, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Step ${index + 1}`}
                        secondary={step}
                      />
                    </ListItem>
                    {index < detailedRecipe.instructions.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Cooking Time: {detailedRecipe?.cookingTime} minutes
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Servings: {detailedRecipe?.servings}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tips
                </Typography>
                <List>
                  {detailedRecipe?.tips.map((tip, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Button
                variant="contained"
                onClick={handleSaveRecipe}
                sx={{ mt: 2 }}
              >
                Save to My Recipes
              </Button>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Recipe Assistant
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderStepContent()}
      </Box>
    </Container>
  );
}

export default AiRecipeAssistant;