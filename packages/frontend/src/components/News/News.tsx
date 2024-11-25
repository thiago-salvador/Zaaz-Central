import React, { useState } from 'react';
import Slider from 'react-slick';
import { FiArrowLeft, FiArrowRight, FiClock, FiShare2, FiExternalLink, FiPause, FiPlay } from 'react-icons/fi';

// Import slick styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './News.css';

const newsData = [
  {
    date: { day: '24', month: 'May' },
    title: 'Introducing Advanced Analytics Dashboard',
    text: "We're excited to announce our new analytics dashboard with real-time data visualization, custom reporting, and AI-powered insights to help you make better decisions.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
    category: 'Feature Update',
    link: '#/features/analytics'
  },
  {
    date: { day: '22', month: 'May' },
    title: 'Enhanced Security Measures Implemented',
    text: "Your security is our top priority. We've implemented advanced security features including biometric authentication and end-to-end encryption for all communications.",
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3',
    category: 'Security',
    link: '#/security'
  },
  {
    date: { day: '20', month: 'May' },
    title: 'Community Milestone: 100k Users!',
    text: "We're thrilled to announce that our platform has reached 100,000 active users! Thank you for being part of our growing community and helping us achieve this milestone.",
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3',
    category: 'Milestone',
    link: '#/community'
  },
  {
    date: { day: '18', month: 'May' },
    title: 'Mobile App Beta Launch',
    text: "Get early access to our new mobile app! Experience seamless integration with our platform on the go. Join the beta program and help shape the future of mobile collaboration.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
    category: 'Product Launch',
    link: '#/mobile-app'
  }
];

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Feature Update': '#4CAF50',
    'Security': '#FF5722',
    'Milestone': '#2196F3',
    'Product Launch': '#9C27B0'
  };
  return colors[category] || '#757575';
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className="news-slider__arrow news-slider-next" onClick={onClick}>
      <FiArrowRight />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className="news-slider__arrow news-slider-prev" onClick={onClick}>
      <FiArrowLeft />
    </button>
  );
};

const News: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleShare = (news: any) => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.text,
        url: window.location.origin + news.link
      }).catch(console.error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: isPlaying,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    beforeChange: (_: any, next: number) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px'
        }
      }
    ]
  };

  return (
    <div className="news-section">
      <div className="news-header">
        <h1 className="news-section-title">Latest News</h1>
        <button 
          className="news-autoplay-toggle"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
      </div>
      <div className="news-wrapper">
        <Slider {...settings}>
          {newsData.map((news, index) => (
            <div key={index} className="news-slider__item">
              <article className="news__item">
                <div className="news__img">
                  <img src={news.image} alt={news.title} />
                  <div 
                    className="news__category"
                    style={{ backgroundColor: getCategoryColor(news.category) }}
                  >
                    {news.category}
                  </div>
                </div>
                <div className="news__content">
                  <div className="news-meta">
                    <div className="news-date">
                      <FiClock />
                      <span className="news-date__title">{news.date.day}</span>
                      <span className="news-date__txt">{news.date.month}</span>
                    </div>
                    <div className="news-actions">
                      <button 
                        className="news-action-btn"
                        onClick={() => handleShare(news)}
                        title="Share"
                      >
                        <FiShare2 />
                      </button>
                    </div>
                  </div>
                  <h2 className="news__title">{news.title}</h2>
                  <p className="news__txt">{news.text}</p>
                  <a href={news.link} className="news__read-more">
                    Read More <FiExternalLink />
                  </a>
                </div>
              </article>
            </div>
          ))}
        </Slider>
        <div className="news-progress">
          <div 
            className="news-progress-bar" 
            style={{ 
              width: `${((activeSlide + 1) / newsData.length) * 100}%`,
              transition: isPlaying ? 'width 5s linear' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default News;
