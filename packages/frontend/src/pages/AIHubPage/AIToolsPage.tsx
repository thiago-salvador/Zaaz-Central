import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Link,
  Chip,
  TextField,
  InputAdornment,
  Fade,
} from '@mui/material';
import { FiExternalLink, FiSearch, FiStar, FiCode, FiImage, FiMessageSquare, FiPieChart, FiTool, FiZap } from 'react-icons/fi';

interface AITool {
  name: string;
  description: string;
  url: string;
  tags: string[];
  category: string;
  icon: React.ReactNode;
  featured?: boolean;
}

const aiTools: AITool[] = [
  {
    name: 'Claude',
    description: 'Advanced AI assistant for analysis, writing, and coding. Known for high accuracy and detailed responses.',
    url: 'https://claude.ai',
    tags: ['Assistant', 'Analysis', 'Writing', 'Coding'],
    category: 'General Purpose',
    icon: <FiMessageSquare />,
    featured: true
  },
  {
    name: 'ChatGPT',
    description: 'Versatile language model for conversations, content creation, and problem-solving.',
    url: 'https://chat.openai.com',
    tags: ['Assistant', 'Writing', 'Analysis'],
    category: 'General Purpose',
    icon: <FiMessageSquare />,
    featured: true
  },
  {
    name: 'Midjourney',
    description: 'AI art generation tool for creating high-quality images from text descriptions.',
    url: 'https://www.midjourney.com',
    tags: ['Image Generation', 'Art', 'Design'],
    category: 'Visual',
    icon: <FiImage />,
    featured: true
  },
  {
    name: 'DALL-E',
    description: 'AI system that creates realistic images and art from natural language descriptions.',
    url: 'https://openai.com/dall-e-3',
    tags: ['Image Generation', 'Art', 'Design'],
    category: 'Visual',
    icon: <FiImage />
  },
  {
    name: 'Make',
    description: 'Automation platform for connecting apps and automating workflows without coding.',
    url: 'https://www.make.com',
    tags: ['Automation', 'Workflow', 'Integration'],
    category: 'Automation',
    icon: <FiZap />,
    featured: true
  },
  {
    name: 'Zapier',
    description: 'Connect your apps and automate workflows with easy-to-use integrations.',
    url: 'https://zapier.com',
    tags: ['Automation', 'Workflow', 'Integration'],
    category: 'Automation',
    icon: <FiZap />
  },
  {
    name: 'Codeium',
    description: 'AI-powered coding assistant for faster development and code completion.',
    url: 'https://codeium.com',
    tags: ['Coding', 'Development', 'AI Assistant'],
    category: 'Development',
    icon: <FiCode />,
    featured: true
  },
  {
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write better code faster.',
    url: 'https://github.com/features/copilot',
    tags: ['Coding', 'Development', 'AI Assistant'],
    category: 'Development',
    icon: <FiCode />
  },
  {
    name: 'Anthropic API',
    description: 'Build AI-powered applications with Claude\'s advanced capabilities.',
    url: 'https://anthropic.ai',
    tags: ['API', 'Development', 'Integration'],
    category: 'Development',
    icon: <FiTool />
  },
  {
    name: 'OpenAI API',
    description: 'Access GPT models and more through a simple API interface.',
    url: 'https://openai.com/api',
    tags: ['API', 'Development', 'Integration'],
    category: 'Development',
    icon: <FiTool />
  },
  {
    name: 'Tableau',
    description: 'Interactive data visualization software powered by AI insights.',
    url: 'https://www.tableau.com',
    tags: ['Analytics', 'Visualization', 'Business'],
    category: 'Analytics',
    icon: <FiPieChart />
  },
  {
    name: 'Power BI',
    description: 'Business analytics service with AI-powered insights and visualizations.',
    url: 'https://powerbi.microsoft.com',
    tags: ['Analytics', 'Visualization', 'Business'],
    category: 'Analytics',
    icon: <FiPieChart />
  }
];

const AIToolsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = aiTools
    .map(tool => tool.category)
    .reduce((unique: string[], category) => 
      unique.includes(category) ? unique : [...unique, category], 
    []);

  const filteredTools = aiTools.filter(tool => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tool.name.toLowerCase().includes(searchLower) ||
      tool.description.toLowerCase().includes(searchLower) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      tool.category.toLowerCase().includes(searchLower)
    );
  });

  const featuredTools = filteredTools.filter(tool => tool.featured);
  const nonFeaturedTools = filteredTools.filter(tool => !tool.featured);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search AI tools by name, category, or tags..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch style={{ color: 'var(--text-secondary)' }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'var(--background)',
              color: 'white',
              '& input': {
                color: 'white',
                '&::placeholder': {
                  color: 'var(--text-secondary)',
                  opacity: 1
                }
              }
            }
          }}
          sx={{
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--border-color)'
              },
              '&:hover fieldset': {
                borderColor: 'var(--primary)'
              }
            }
          }}
        />
      </Box>

      {featuredTools.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiStar style={{ color: 'var(--primary)' }} />
            Featured Tools
          </Typography>
          <Grid container spacing={3}>
            {featuredTools.map((tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool.name}>
                <Fade in timeout={800}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border-color)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 'var(--shadow-lg)',
                        borderColor: 'var(--primary)',
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{ 
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: 'var(--background-light)'
                        }}>
                          {tool.icon}
                        </Box>
                        <Typography variant="h6" component="h2">
                          {tool.name}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="var(--text-secondary)"
                        sx={{ mb: 2 }}
                      >
                        {tool.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tool.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: 'var(--background-light)',
                              color: 'var(--text-secondary)',
                              '&:hover': {
                                backgroundColor: 'var(--primary)',
                                color: 'white'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<FiExternalLink />}
                        sx={{ 
                          ml: 'auto',
                          color: 'var(--primary)',
                          '&:hover': {
                            color: 'white',
                            backgroundColor: 'var(--primary)'
                          }
                        }}
                      >
                        Open Tool
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {categories.map(category => {
        const categoryTools = nonFeaturedTools.filter(tool => tool.category === category);
        if (categoryTools.length === 0) return null;

        return (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              {categoryTools[0].icon}
              {category}
            </Typography>
            <Grid container spacing={3}>
              {categoryTools.map((tool) => (
                <Grid item xs={12} sm={6} md={4} key={tool.name}>
                  <Fade in timeout={800}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border-color)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 'var(--shadow-lg)',
                          borderColor: 'var(--primary)',
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Box sx={{ 
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: 'var(--background-light)'
                          }}>
                            {tool.icon}
                          </Box>
                          <Typography variant="h6" component="h2">
                            {tool.name}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="var(--text-secondary)"
                          sx={{ mb: 2 }}
                        >
                          {tool.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {tool.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: 'var(--background-light)',
                                color: 'var(--text-secondary)',
                                '&:hover': {
                                  backgroundColor: 'var(--primary)',
                                  color: 'white'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={Link}
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<FiExternalLink />}
                          sx={{ 
                            ml: 'auto',
                            color: 'var(--primary)',
                            '&:hover': {
                              color: 'white',
                              backgroundColor: 'var(--primary)'
                            }
                          }}
                        >
                          Open Tool
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default AIToolsPage;
