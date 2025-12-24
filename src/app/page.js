'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function Home() {
  const [stories, setStories] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votedStories, setVotedStories] = useState(new Set());

  useEffect(() => {
    const votedFromStorage = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('story_') && key.endsWith('_voted')) {
        const storyId = parseInt(key.replace('story_', '').replace('_voted', ''));
        votedFromStorage.add(storyId);
      }
    }
    setVotedStories(votedFromStorage);
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const url = selectedTag 
          ? `/api/stories?tag=${encodeURIComponent(selectedTag)}`
          : '/api/stories';
        const response = await fetch(url);
        const data = await response.json();
        setStories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setLoading(false);
      }
    };
    fetchStories();
  }, [selectedTag]);

  const handleVote = async (storyId, voteType) => {
    const voteKey = `story_${storyId}_voted`;
    if (localStorage.getItem(voteKey)) {
      alert('You already voted on this story');
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType })
      });

      if (!response.ok) throw new Error('Vote failed');
      
      const updatedStory = await response.json();
      localStorage.setItem(voteKey, 'true');
      const newVoted = new Set(votedStories);
      newVoted.add(storyId);
      setVotedStories(newVoted);

      setStories(stories.map(s => 
        s.id === storyId 
          ? { ...s, upvotes: updatedStory.upvotes, downvotes: updatedStory.downvotes }
          : s
      ));
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  if (loading) return <div style={{ color: '#fff', padding: '50px' }}>Loading...</div>;

  const featuredStory = stories.find(s => s.isCommunityPick) || 
                        stories.sort((a, b) => ((b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)))[0];
  const otherStories = stories.slice(1);

  return (
    <div>
      <header style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>UNCOVER NEWS</div>
            <div style={{ fontSize: '12px', color: '#b0b0b0' }}>Uncover the Truth</div>
          </div>
          <input type="text" placeholder="Search..." style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '8px 16px', color: '#fff', width: '250px' }} />
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 20px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '50px' }}>
        <main>
          {featuredStory && <h2 style={{ fontSize: '16px', marginBottom: '20px', color: '#a0a0a0', textTransform: 'uppercase' }}>Community Picks</h2>}

          {featuredStory && (
            <section style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '40px', marginBottom: '50px', borderRadius: '20px' }}>
              <h1 style={{ fontSize: '32px', margin: '0 0 24px 0', fontWeight: '700' }}>{featuredStory.title}</h1>
              <p style={{ fontSize: '16px', color: '#e0e0e0', margin: '20px 0 30px 0' }}>{featuredStory.tldr}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '13px' }}>
                <div>
                  {featuredStory.isCommunityPick && <span style={{ background: 'rgba(150, 180, 220, 0.3)', padding: '6px 12px', borderRadius: '6px', marginRight: '12px', fontWeight: '600', display: 'inline-block' }}>🏆 Community Pick</span>}
                  <strong>Source:</strong> {featuredStory.source.name} · <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', display: 'inline-block', margin: '0 8px' }}>{featuredStory.credibilityScore.toFixed(1)}/10</span> · 2 hours ago
                </div>
                <a href={featuredStory.link} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(150, 180, 220, 0.9)', cursor: 'pointer', textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.color = 'rgba(150, 180, 220, 1)'} onMouseLeave={(e) => e.target.style.color = 'rgba(150, 180, 220, 0.9)'}>Read Full Story →</a>
              </div>
            </section>
          )}

          {selectedTag && (
            <div style={{ padding: '12px 20px', backgroundColor: 'rgba(150, 180, 220, 0.15)', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', border: '1px solid rgba(150, 180, 220, 0.3)' }}>
              <span>Filtering by: <strong>{selectedTag}</strong></span>
              <button onClick={() => setSelectedTag(null)} style={{ background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
          )}

          <h2 style={{ fontSize: '16px', marginBottom: '20px', color: '#a0a0a0', textTransform: 'uppercase' }}>Top Stories Now</h2>

          {otherStories.map((story) => {
            const netVotes = story.upvotes - story.downvotes;
            const isVoted = votedStories.has(story.id);
            
            return (
              <article key={story.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '24px', marginBottom: '20px', borderRadius: '16px', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '50px' }}>
                    <button 
                      onClick={() => handleVote(story.id, 'upvote')}
                      style={{ background: 'none', border: 'none', color: isVoted ? 'rgba(150, 180, 220, 1)' : '#808080', cursor: 'pointer', fontSize: '20px', padding: '4px', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.target.style.color = 'rgba(150, 180, 220, 0.9)'}
                      onMouseLeave={(e) => e.target.style.color = isVoted ? 'rgba(150, 180, 220, 1)' : '#808080'}
                    >
                      ⬆
                    </button>
                    <span style={{ fontWeight: '600', color: netVotes < 0 ? '#ff6b6b' : '#fff', fontSize: '13px' }}>{netVotes}</span>
                    <button 
                      onClick={() => handleVote(story.id, 'downvote')}
                      style={{ background: 'none', border: 'none', color: isVoted ? 'rgba(150, 180, 220, 1)' : '#808080', cursor: 'pointer', fontSize: '20px', padding: '4px', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.target.style.color = 'rgba(150, 180, 220, 0.9)'}
                      onMouseLeave={(e) => e.target.style.color = isVoted ? 'rgba(150, 180, 220, 1)' : '#808080'}
                    >
                      ⬇
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {story.tags && story.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          onClick={() => handleTagClick(tag)}
                          style={{ backgroundColor: selectedTag === tag ? 'rgba(150, 180, 220, 0.4)' : 'rgba(255, 255, 255, 0.06)', color: selectedTag === tag ? 'rgba(150, 180, 220, 1)' : '#c0c0c0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: selectedTag === tag ? '1px solid rgba(150, 180, 220, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)', fontWeight: '500', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.target.style.color = 'rgba(150, 180, 220, 0.9)'; e.target.style.backgroundColor = 'rgba(150, 180, 220, 0.3)'; }}
                          onMouseLeave={(e) => { e.target.style.color = selectedTag === tag ? 'rgba(150, 180, 220, 1)' : '#c0c0c0'; e.target.style.backgroundColor = selectedTag === tag ? 'rgba(150, 180, 220, 0.4)' : 'rgba(255, 255, 255, 0.06)'; }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '700' }}>{story.title}</h2>
                    <p style={{ fontSize: '14px', color: '#d0d0d0', marginBottom: '18px' }}>{story.tldr}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', color: '#a0a0a0' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <span><strong>Source:</strong> {story.source.name}</span>
                    <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', color: '#fff' }}>{story.credibilityScore.toFixed(1)}/10</span>
                    <span>2 hours ago · {story.clicks} clicks</span>
                  </div>
                  <a href={story.link} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(150, 180, 220, 0.9)', textDecoration: 'none', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = 'rgba(150, 180, 220, 1)'} onMouseLeave={(e) => e.target.style.color = 'rgba(150, 180, 220, 0.9)'}>Read Full Story →</a>
                </div>
              </article>
            );
          })}
        </main>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '13px', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', color: '#999' }}>🔥 Trending Now</h3>
            {['#politics', '#accountability', '#investigative', '#surveillance', '#corporate'].map((topic) => (
              <div 
                key={topic}
                onClick={() => handleTagClick(topic)}
                style={{ padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '13px', cursor: 'pointer', color: '#d0d0d0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = 'rgba(150, 180, 220, 0.9)'}
                onMouseLeave={(e) => e.target.style.color = '#d0d0d0'}
              >
                {topic}
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', fontWeight: '700', color: '#fff' }}>Get Daily Digest</h3>
            <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '15px' }}>Top stories delivered at 8am</p>
            <button style={{ backgroundColor: '#fff', color: '#1a1a1a', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Subscribe Now</button>
          </div>
        </aside>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 30px', textAlign: 'center', color: '#a0a0a0', fontSize: '12px', marginTop: '80px' }}>
        <p>Uncover the Truth — Credibility-focused news aggregation</p>
        <p style={{ marginTop: '10px' }}>© 2025 Uncover News. Built on trust. Powered by community.</p>
      </footer>
    </div>
  );
}
