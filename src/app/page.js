'use client';

import { useEffect, useState } from 'react';
import './globals.css';

export default function Home() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        setStories(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: '#fff', padding: '50px' }}>Loading...</div>;

  const featuredStory = stories[0];
  const otherStories = stories.slice(1);

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div>
            <div className="logo">UNCOVER NEWS</div>
            <div className="tagline">Uncover the Truth</div>
          </div>
          <input
            type="text"
            className="search-bar"
            placeholder="Search stories, sources, topics..."
          />
        </div>
      </header>

      <div className="container">
        <main className="main-content">
          {featuredStory && (
            <section className="featured-story">
              <h1>{featuredStory.title}</h1>
              <p className="tldr">{featuredStory.tldr}</p>
              <div className="story-meta">
                <div>
                  <strong>Source:</strong> {featuredStory.source.name}
                  <span style={{ margin: '0 8px' }}>·</span>
                  <span className="credibility-badge">
                    {featuredStory.credibilityScore}/10
                  </span>
                  <span style={{ margin: '0 8px' }}>·</span>
                  Just now
                </div>
                <button className="read-more">Read Full Story →</button>
              </div>
            </section>
          )}

          <h2 className="section-title">Top Stories Now</h2>

          {otherStories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="story-header">
                <div className="vote-section">
                  <button className="vote-button">↑</button>
                  <span className="vote-count">{story.upvotes}</span>
                  <button className="vote-button">↓</button>
                </div>
                <div className="story-header-content">
                  <div className="story-tags">
                    {story.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2>{story.title}</h2>
                  <p className="tldr">{story.tldr}</p>
                </div>
              </div>
              <div className="story-footer">
                <div className="source-info">
                  <span>
                    <strong>Source:</strong> {story.source.name}
                  </span>
                  <span style={{ margin: '0 8px' }}>·</span>
                  <span className="credibility-badge">
                    {story.credibilityScore}/10
                  </span>
                  <span style={{ margin: '0 8px' }}>·</span>
                  <span>2 hours ago</span>
                  <span style={{ margin: '0 8px' }}>·</span>
                  <span>{story.clicks} clicks</span>
                </div>
                <button className="read-more">Read Full Story →</button>
              </div>
            </article>
          ))}
        </main>

        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>🔥 Trending Now</h3>
            <div className="trending-item">#politics</div>
            <div className="trending-item">#accountability</div>
            <div className="trending-item">#investigative</div>
            <div className="trending-item">#surveillance</div>
          </div>

          <div className="newsletter-cta">
            <h3>Get Daily Digest</h3>
            <p>Top stories delivered to your inbox every morning at 8am</p>
            <button className="cta-button">Subscribe Now</button>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <p>Uncover the Truth — Credibility-focused news aggregation</p>
        <p style={{ marginTop: '10px', color: '#bbb' }}>
          © 2025 Uncover News. Built on trust. Powered by community intelligence.
        </p>
      </footer>
    </div>
  );
}
