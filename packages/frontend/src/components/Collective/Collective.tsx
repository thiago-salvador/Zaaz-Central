import React from 'react';
import './Collective.css';

interface CollectiveCard {
  id: number;
  title: string;
  copy: string;
  button: string;
  image: string;
}

const cards: CollectiveCard[] = [
  {
    id: 1,
    title: 'Design Systems',
    copy: 'Explore our collection of design systems and guidelines for building consistent user experiences',
    button: 'View Systems',
    image: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max'
  },
  {
    id: 2,
    title: 'Component Library',
    copy: 'Discover our extensive library of reusable components for faster development',
    button: 'Browse Library',
    image: 'https://images.unsplash.com/photo-1533903345306-15d1c30952de?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max'
  },
  {
    id: 3,
    title: 'Code Patterns',
    copy: 'Learn about our best practices and coding patterns for maintainable applications',
    button: 'View Patterns',
    image: 'https://images.unsplash.com/photo-1545243424-0ce743321e11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max'
  },
  {
    id: 4,
    title: 'API Documentation',
    copy: 'Access comprehensive documentation for all our APIs and integrations',
    button: 'View Docs',
    image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max'
  }
];

interface CardProps {
  title: string;
  copy: string;
  button: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ title, copy, button, image }) => {
  return (
    <div className="collective-card" style={{ backgroundImage: `url(${image})` }}>
      <div className="content">
        <h2 className="title">{title}</h2>
        <p className="copy">{copy}</p>
        <button className="btn">{button}</button>
      </div>
    </div>
  );
};

export const Collective: React.FC = () => {
  return (
    <section className="collective-section">
      <h1>The Collective</h1>
      <div className="page-content">
        {cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            copy={card.copy}
            button={card.button}
            image={card.image}
          />
        ))}
      </div>
    </section>
  );
};
